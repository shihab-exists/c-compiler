import { BookOpen, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const docs = [
  { title: "C Reference", url: "https://en.cppreference.com/w/c" },
  { title: "GCC Documentation", url: "https://gcc.gnu.org/onlinedocs/" },
  { title: "C Standard Library", url: "https://en.cppreference.com/w/c/header" },
  { title: "Learn C", url: "https://www.learn-c.org/" },
];

export function DocumentationPage() {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-navy-500 dark:text-white">Documentation</h2>
        <div className="grid gap-4">
          {docs.map((doc) => (
            <a key={doc.title} href={doc.url} target="_blank" rel="noreferrer">
              <Card className="flex items-center justify-between p-5 hover:bg-navy-50 dark:hover:bg-navy-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-navy-100 dark:bg-navy-700 text-navy-500 dark:text-navy-100">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                </div>
                <ExternalLink className="h-5 w-5 text-neutral-300" />
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
