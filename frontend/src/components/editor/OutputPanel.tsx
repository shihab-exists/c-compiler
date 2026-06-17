import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Terminal, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/store/app.store";
import { formatTime } from "@/lib/utils";

export function OutputPanel() {
  const output = useAppStore((s) => s.output);
  const errors = useAppStore((s) => s.errors);
  const warnings = useAppStore((s) => s.warnings);
  const status = useAppStore((s) => s.status);
  const executionTime = useAppStore((s) => s.executionTime);
  const memoryUsage = useAppStore((s) => s.memoryUsage);

  const statusBadge = {
    idle: { text: "Ready", class: "bg-neutral-200 text-neutral-300" },
    running: { text: "Running...", class: "bg-accent-400/20 text-accent-400" },
    success: { text: "Success", class: "bg-success/20 text-success" },
    warning: { text: "Warning", class: "bg-warning/20 text-warning" },
    error: { text: "Error", class: "bg-error/20 text-error" },
    timeout: { text: "Timeout", class: "bg-error/20 text-error" },
  }[status];

  return (
    <div className="h-full flex flex-col glass-card rounded-2xl overflow-hidden">
      <Tabs defaultValue="output" className="h-full">
        <TabsList className="h-12">
          <TabsTrigger value="output">
            <Terminal className="h-4 w-4 mr-2" />
            Output
          </TabsTrigger>
          <TabsTrigger value="errors">
            <AlertCircle className="h-4 w-4 mr-2" />
            Errors
            {errors && <span className="ml-2 h-2 w-2 rounded-full bg-error" />}
          </TabsTrigger>
          <TabsTrigger value="warnings">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Warnings
            {warnings && <span className="ml-2 h-2 w-2 rounded-full bg-warning" />}
          </TabsTrigger>
          <TabsTrigger value="console">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Console
          </TabsTrigger>
        </TabsList>

        <div className="px-4 py-2 flex items-center gap-4 border-b border-neutral-200 dark:border-navy-700 bg-white/40 dark:bg-navy-800/40">
          <span className={"text-xs font-semibold px-2.5 py-1 rounded-full " + statusBadge.class}>
            {statusBadge.text}
          </span>
          <span className="text-xs text-neutral-300">Execution: {formatTime(executionTime)}</span>
          <span className="text-xs text-neutral-300">Memory: {memoryUsage ? `${memoryUsage}KB` : "--"}</span>
        </div>

        <TabsContent value="output">
          <pre className="h-full w-full whitespace-pre-wrap font-mono text-sm leading-relaxed text-navy-500 dark:text-navy-100">
            {output || "// Output will appear here after running your code"}
          </pre>
        </TabsContent>
        <TabsContent value="errors">
          <pre className="h-full w-full whitespace-pre-wrap font-mono text-sm leading-relaxed text-error">
            {errors || "No errors"}
          </pre>
        </TabsContent>
        <TabsContent value="warnings">
          <pre className="h-full w-full whitespace-pre-wrap font-mono text-sm leading-relaxed text-warning">
            {warnings || "No warnings"}
          </pre>
        </TabsContent>
        <TabsContent value="console">
          <pre className="h-full w-full whitespace-pre-wrap font-mono text-sm leading-relaxed text-neutral-300">
            Console log / debug messages will appear here.
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
