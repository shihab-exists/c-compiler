import Editor from "@monaco-editor/react";
import { useAppStore } from "@/store/app.store";
import { useEffect } from "react";

export function MonacoEditor() {
  const theme = useAppStore((s) => s.theme);
  const code = useAppStore((s) => s.code);
  const setCode = useAppStore((s) => s.setCode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        document.getElementById("save-btn")?.click();
      }
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        document.getElementById("run-btn")?.click();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "B") {
        e.preventDefault();
        document.getElementById("compile-btn")?.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-navy-700 shadow-card">
      <Editor
        height="100%"
        language="c"
        value={code}
        onChange={(value) => setCode(value || "")}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          minimap: { enabled: true, scale: 1 },
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          bracketPairColorization: { enabled: true },
          folding: true,
          renderLineHighlight: "all",
          renderLineHighlightOnlyWhenFocus: false,
          matchBrackets: "always",
          autoIndent: "full",
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
          padding: { top: 16 },
          smoothScrolling: true,
          cursorBlinking: "smooth",
        }}
        loading={
          <div className="h-full w-full flex items-center justify-center text-neutral-300">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
