import { useEffect, useState } from "react";
import { Save, Trash2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SavedCodesPage() {
  const [saved, setSaved] = useState<{ id: string; title: string; code: string; date: string }[]>([]);

  useEffect(() => {
    const stored = Object.entries(localStorage)
      .filter(([k]) => k.startsWith("saved-code"))
      .map(([k, v]) => ({ id: k, title: k, code: v, date: new Date().toLocaleString() }));
    setSaved(stored.length ? stored : [{ id: "demo", title: "Demo Save", code: "// Saved code sample", date: "Just now" }]);
  }, []);

  const download = (item: any) => {
    const blob = new Blob([item.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.title}.c`;
    a.click();
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-navy-500 dark:text-white">Saved Codes</h2>
        <div className="grid gap-4">
          {saved.map((item) => (
            <Card key={item.id} className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10 text-success">
                  <Save className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-500 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-neutral-300">{item.date}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => download(item)} className="btn-secondary !px-3">
                  <Download className="h-4 w-4" />
                </button>
                <button className="btn-secondary !px-3 text-error">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
