import { useEffect, useState } from "react";
import { FileCode, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { snippetApi } from "@/lib/api";
import { useAppStore, snippets as localSnippets } from "@/store/app.store";
import { Link } from "react-router-dom";

export function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const setCode = useAppStore((s) => s.setCode);

  useEffect(() => {
    snippetApi.list().then((r) => setSnippets(r.data));
  }, []);

  const useSnippet = (snippet: any) => {
    setCode(snippet.code);
    snippetApi.use(snippet.id);
  };

  const allSnippets = snippets.length
    ? snippets
    : Object.entries(localSnippets).map(([k, v]) => ({ id: k, title: k, category: "Built-in", code: v, isBuiltin: true }));

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-navy-500 dark:text-white">Code Snippets</h2>
            <p className="text-neutral-300">Reusable templates to speed up your workflow</p>
          </div>
          <Button>
            <Plus className="h-4 w-4" /> New Snippet
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allSnippets.map((snippet: any) => (
            <Card key={snippet.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent-400/10 text-accent-400">
                    <FileCode className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{snippet.title}</CardTitle>
                    <CardDescription>{snippet.category}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <pre className="flex-1 max-h-32 overflow-hidden rounded-lg bg-navy-50 dark:bg-navy-800 p-3 text-xs font-mono text-neutral-300">
                  {snippet.code}
                </pre>
                <Link to="/compiler" onClick={() => useSnippet(snippet)}>
                  <Button className="w-full mt-4">Use Snippet</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
