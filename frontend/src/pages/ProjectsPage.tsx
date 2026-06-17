import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, FolderKanban, Copy, Trash2, Edit3, Download, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { projectApi } from "@/lib/api";
import { Link } from "react-router-dom";

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => projectApi.list().then((r) => setProjects(r.data));

  const create = async () => {
    if (!newName) return;
    await projectApi.create({ name: newName, sourceCode: "" });
    setNewName("");
    loadProjects();
  };

  const remove = async (id: string) => {
    await projectApi.delete(id);
    loadProjects();
  };

  const duplicate = async (id: string) => {
    await projectApi.duplicate(id);
    loadProjects();
  };

  const download = (project: any) => {
    const blob = new Blob([project.sourceCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name}.c`;
    a.click();
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-navy-500 dark:text-white">Projects</h2>
            <p className="text-neutral-300">Manage your C projects</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input placeholder="Project name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Button onClick={create}>
                <Plus className="h-4 w-4" /> Create
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {projects.map((project: any) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent-400/10 text-accent-400">
                  <FolderKanban className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-500 dark:text-white">{project.name}</h3>
                  <p className="text-xs text-neutral-300">{new Date(project.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/compiler/${project.id}`}>
                  <Button size="sm">Open</Button>
                </Link>
                <button onClick={() => duplicate(project.id)} className="btn-secondary !px-2">
                  <Copy className="h-4 w-4" />
                </button>
                <button onClick={() => download(project)} className="btn-secondary !px-2">
                  <Download className="h-4 w-4" />
                </button>
                <button onClick={() => remove(project.id)} className="btn-secondary !px-2 text-error hover:bg-error/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
