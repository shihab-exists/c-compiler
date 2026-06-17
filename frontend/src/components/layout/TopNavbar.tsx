import { Play, Download, Share2, Maximize, Moon, Sun, Save, Cpu } from "lucide-react";
import { useAppStore } from "@/store/app.store";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { compilerApi } from "@/lib/api";

export function TopNavbar() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const activeProject = useAppStore((s) => s.activeProject);
  const code = useAppStore((s) => s.code);
  const input = useAppStore((s) => s.input);
  const setOutput = useAppStore((s) => s.setOutput);
  const status = useAppStore((s) => s.status);

  const handleRun = async () => {
    setOutput({ status: "running" });
    try {
      const { data } = await compilerApi.run(code, input, activeProject?.id);
      setOutput({
        status: data.status,
        output: data.output,
        errors: data.errors,
        warnings: data.warnings,
        executionTime: data.executionTime,
        memoryUsage: data.memoryUsage,
      });
    } catch (err: any) {
      setOutput({
        status: "error",
        errors: err?.response?.data?.error || "Failed to run code",
      });
    }
  };

  const handleCompile = async () => {
    setOutput({ status: "running" });
    try {
      const { data } = await compilerApi.compile(code, input, activeProject?.id);
      setOutput({
        status: data.status,
        output: data.output,
        errors: data.errors,
        warnings: data.warnings,
        executionTime: data.executionTime,
        memoryUsage: data.memoryUsage,
      });
    } catch (err: any) {
      setOutput({
        status: "error",
        errors: err?.response?.data?.error || "Failed to compile code",
      });
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeProject?.name ? `${activeProject.name}.c` : "main.c";
    a.click();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // In a real app, show toast
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-neutral-200 dark:border-navy-700 bg-white/60 dark:bg-navy-800/60 backdrop-blur-xl z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-accent-400" />
          <span className="font-semibold text-navy-500 dark:text-white">
            {activeProject?.name || "Untitled Project"}
          </span>
        </div>
        <span className="text-xs px-2 py-1 rounded-md bg-navy-100 dark:bg-navy-700 text-navy-500 dark:text-navy-100 font-medium">
          C
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content="Save (Ctrl+S)">
          <button id="save-btn" onClick={handleSave} className="btn-secondary !px-3">
            <Save className="h-4 w-4" />
          </button>
        </Tooltip>

        <Tooltip content="Compile (Ctrl+Shift+B)">
          <button id="compile-btn" onClick={handleCompile} className="btn-secondary !px-3">
            <Cpu className="h-4 w-4" />
            <span>Compile</span>
          </button>
        </Tooltip>

        <Tooltip content="Run (Ctrl+Enter)">
          <Button id="run-btn" onClick={handleRun} className="!px-4">
            <Play className="h-4 w-4 fill-current" />
            <span>Run</span>
          </Button>
        </Tooltip>

        <Tooltip content="Download">
          <button onClick={handleSave} className="btn-secondary !px-3">
            <Download className="h-4 w-4" />
          </button>
        </Tooltip>

        <Tooltip content="Share">
          <button onClick={handleShare} className="btn-secondary !px-3">
            <Share2 className="h-4 w-4" />
          </button>
        </Tooltip>

        <Tooltip content="Fullscreen">
          <button
            onClick={() => document.documentElement.requestFullscreen?.()}
            className="btn-secondary !px-3"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </Tooltip>

        <button onClick={toggleTheme} className="btn-secondary !px-3">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
