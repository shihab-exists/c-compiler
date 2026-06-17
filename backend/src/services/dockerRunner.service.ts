import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const execAsync = promisify(exec);

export interface RunResult {
  status: "success" | "error" | "warning" | "timeout";
  output: string;
  errors: string;
  warnings: string;
  executionTime: number;
  memoryUsage: number;
}

const TIMEOUT_MS = parseInt(process.env.SANDBOX_TIMEOUT_MS || "10000", 10);
const MEMORY_MB = parseInt(process.env.SANDBOX_MEMORY_MB || "128", 10);
const CPU_LIMIT = process.env.SANDBOX_CPU_LIMIT || "1.0";
const DOCKER_IMAGE = process.env.DOCKER_IMAGE || "ccompiler-sandbox";
const SANDBOX_URL = process.env.SANDBOX_URL; // Remote sandbox worker URL

export async function runCCode(code: string, input: string = ""): Promise<RunResult> {
  if (SANDBOX_URL) {
    return runRemoteSandbox(code, input);
  }
  return runLocalDocker(code, input);
}

async function runRemoteSandbox(code: string, input: string): Promise<RunResult> {
  const startTime = Date.now();
  try {
    const { data } = await axios.post(
      `${SANDBOX_URL}/run`,
      { code, input },
      { timeout: TIMEOUT_MS + 2000 }
    );
    return {
      ...data,
      executionTime: data.executionTime || Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      status: "error",
      output: "",
      errors: err?.response?.data?.error || err.message || "Remote sandbox unavailable",
      warnings: "",
      executionTime: Date.now() - startTime,
      memoryUsage: 0,
    };
  }
}

async function runLocalDocker(code: string, input: string): Promise<RunResult> {
  const runId = uuidv4();
  const tempDir = path.join(process.cwd(), "tmp", runId);
  const sourceFile = path.join(tempDir, "main.c");
  const inputFile = path.join(tempDir, "input.txt");

  const startTime = Date.now();

  try {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(sourceFile, code, "utf-8");
    await fs.writeFile(inputFile, input, "utf-8");

    const compileCmd = [
      "docker run --rm",
      `-v "${tempDir}:/sandbox"`,
      `--memory="${MEMORY_MB}m"`,
      `--cpus="${CPU_LIMIT}"`,
      `--network none`,
      `--read-only`,
      `-w /sandbox`,
      DOCKER_IMAGE,
      "sh /sandbox/run.sh"
    ].join(" ");

    const { stdout, stderr } = await execAsync(compileCmd, { timeout: TIMEOUT_MS + 2000 });

    const executionTime = Date.now() - startTime;

    const errorLines: string[] = [];
    const warningLines: string[] = [];

    stderr.split("\n").forEach((line) => {
      if (line.includes("warning:")) warningLines.push(line);
      else if (line.includes("error:")) errorLines.push(line);
    });

    const status: RunResult["status"] =
      errorLines.length > 0 ? "error" : warningLines.length > 0 ? "warning" : "success";

    return {
      status,
      output: stdout,
      errors: errorLines.join("\n"),
      warnings: warningLines.join("\n"),
      executionTime,
      memoryUsage: 0,
    };
  } catch (err: any) {
    const isTimeout = err.killed || err.signal === "SIGTERM";
    return {
      status: isTimeout ? "timeout" : "error",
      output: "",
      errors: isTimeout ? "Execution timed out." : err.stderr || err.message,
      warnings: "",
      executionTime: Date.now() - startTime,
      memoryUsage: 0,
    };
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {}
  }
}
