import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { OutputPanel } from "@/components/editor/OutputPanel";
import { InputPanel } from "@/components/editor/InputPanel";
import { FloatingActions } from "@/components/editor/FloatingActions";
import { projectApi } from "@/lib/api";
import { useAppStore } from "@/store/app.store";
import { snippets } from "@/store/app.store";
import { Code2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CompilerPage() {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(!!projectId);
  const setCode = useAppStore((s) => s.setCode);
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const activeProject = useAppStore((s) => s.activeProject);

  useEffect(() => {
    if (projectId) {
      projectApi.get(projectId).then((r) => {
        const p = r.data;
        setActiveProject({ id: p.id, name: p.name });
        setCode(p.sourceCode || p.files?.[0]?.content || snippets.hello);
        setLoading(false);
      });
    } else {
      setActiveProject(null);
    }
  }, [projectId, setCode, setActiveProject]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-4 gap-4"
    >
      {/* Top info bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Code2 className="h-5 w-5 text-accent-400" />
          <h2 className="text-lg font-semibold text-navy-500 dark:text-white">
            {activeProject?.name || "Untitled"}
          </h2>
          <Badge variant="default">main.c</Badge>
        </div>
        <div className="text-xs text-neutral-300 flex items-center gap-4">
          <span>Auto-save: ON</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Ready
          </span>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Editor: 70% approx */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <MonacoEditor />
          </div>
          <div className="h-40 shrink-0">
            <InputPanel />
          </div>
        </div>

        {/* Right panel: 30% approx */}
        <div className="lg:col-span-4 min-h-0">
          <OutputPanel />
        </div>
      </div>

      <FloatingActions />
    </motion.div>
  );
}
