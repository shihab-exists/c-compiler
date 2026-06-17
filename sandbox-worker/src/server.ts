import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const execAsync = promisify(exec);

const TIMEOUT_MS = parseInt(process.env.SANDBOX_TIMEOUT_MS || "10000", 10);
const MEMORY_MB = parseInt(process.env.SANDBOX_MEMORY_MB || "128", 10);
const CPU_LIMIT = process.env.SANDBOX_CPU_LIMIT || "1.0";
const DOCKER_IMAGE = process.env.DOCKER_IMAGE || "ccompiler-sandbox";
const API_KEY = process.env.API_KEY; // Optional: require secret key

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.post("/run", async (req, res) => {
  const { code, input = "" } = req.body;
  if (typeof code !== "string") return res.status(400).json({ error: "Code is required" });

  const runId = uuidv4();
  const tempDir = path.join(process.cwd(), "tmp", runId);
  const sourceFile = path.join(tempDir, "main.c");
  const inputFile = path.join(tempDir, "input.txt");
  const startTime = Date.now();

  try {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(sourceFile, code, "utf-8");
    await fs.writeFile(inputFile, input, "utf-8");

    const cmd = [
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

    const { stdout, stderr } = await execAsync(cmd, { timeout: TIMEOUT_MS + 2000 });
    const executionTime = Date.now() - startTime;

    const errorLines: string[] = [];
    const warningLines: string[] = [];
    stderr.split("\n").forEach((line) => {
      if (line.includes("warning:")) warningLines.push(line);
      else if (line.includes("error:")) errorLines.push(line);
    });

    const status = errorLines.length > 0 ? "error" : warningLines.length > 0 ? "warning" : "success";

    res.json({
      status,
      output: stdout,
      errors: errorLines.join("\n"),
      warnings: warningLines.join("\n"),
      executionTime,
      memoryUsage: 0,
    });
  } catch (err: any) {
    const isTimeout = err.killed || err.signal === "SIGTERM";
    res.status(500).json({
      status: isTimeout ? "timeout" : "error",
      output: "",
      errors: isTimeout ? "Execution timed out." : err.stderr || err.message,
      warnings: "",
      executionTime: Date.now() - startTime,
      memoryUsage: 0,
    });
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {}
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🛡️ Sandbox worker listening on port ${PORT}`);
});
