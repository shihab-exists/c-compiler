import { Save, Download, Share2, Maximize, BookOpen, Sparkles } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { useAppStore } from "@/store/app.store";
import { aiApi } from "@/lib/api";

export function FloatingActions() {
  const code = useAppStore((s) => s.code);

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "main.c";
    a.click();
  };

  const handleSave = () => {
    localStorage.setItem("saved-code", code);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleExplain = async () => {
    try {
      const { data } = await aiApi.explain(code);
      alert(data.explanation);
    } catch {
      alert("AI service is unavailable in this demo.");
    }
  };

  const actions = [
    { icon: Save, label: "Save", onClick: handleSave },
    { icon: Download, label: "Download", onClick: handleDownload },
    { icon: Share2, label: "Share", onClick: handleShare },
    { icon: Maximize, label: "Fullscreen", onClick: () => document.documentElement.requestFullscreen?.() },
    { icon: BookOpen, label: "Docs", onClick: () => window.open("https://en.cppreference.com/w/c", "_blank") },
    { icon: Sparkles, label: "AI Explain", onClick: handleExplain },
  ];

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
      {actions.map((action) => (
        <Tooltip key={action.label} content={action.label}>
          <button
            onClick={action.onClick}
            className="h-12 w-12 rounded-full bg-white dark:bg-navy-700 text-navy-500 dark:text-white shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all flex items-center justify-center border border-neutral-200 dark:border-navy-600"
          >
            <action.icon className="h-5 w-5" />
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
