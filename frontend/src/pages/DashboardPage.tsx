import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  FolderKanban,
  Clock,
  Activity,
  TrendingUp,
  Code2,
  FileCode,
  Plus,
  ArrowRight,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyticsApi, projectApi } from "@/lib/api";
import { useAppStore } from "@/store/app.store";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const [analytics, setAnalytics] = useState({ totalRuns: 0, totalProjects: 0, compileSuccessRate: 0, mostUsedSnippets: [] });
  const [projects, setProjects] = useState([]);
  const setActiveProject = useAppStore((s) => s.setActiveProject);

  useEffect(() => {
    analyticsApi.get().then((r) => setAnalytics(r.data));
    projectApi.list().then((r) => setProjects(r.data.slice(0, 5)));
  }, []);

  return (
    <div className="h-full overflow-y-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-navy-500 dark:text-white">Dashboard</h2>
            <p className="mt-1 text-neutral-300">Welcome back to your C Compiler workspace.</p>
          </div>
          <Link to="/compiler">
            <Button>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard title="Total Runs" value={String(analytics.totalRuns)} icon={Play} color="blue" delay={0} />
          <StatsCard title="Projects" value={String(analytics.totalProjects)} icon={FolderKanban} color="purple" delay={0.1} />
          <StatsCard title="Success Rate" value={`${analytics.compileSuccessRate}%`} icon={TrendingUp} color="green" delay={0.2} />
          <StatsCard title="Avg Execution" value="24ms" icon={Clock} color="orange" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest C projects and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projects.length === 0 && (
                  <p className="text-sm text-neutral-300">No projects yet. Create one to get started.</p>
                )}
                {projects.map((project: any) => (
                  <Link
                    key={project.id}
                    to={`/compiler/${project.id}`}
                    onClick={() => setActiveProject({ id: project.id, name: project.name })}
                    className="flex items-center justify-between p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50 hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent-400/10 text-accent-400">
                        <Code2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy-500 dark:text-white">{project.name}</p>
                        <p className="text-xs text-neutral-300">
                          Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-neutral-300 group-hover:text-accent-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Snippets</CardTitle>
              <CardDescription>Jump-start your next program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {["Hello World", "Arrays", "Linked List", "Bubble Sort"].map((name) => (
                  <Link
                    key={name}
                    to="/compiler"
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50 hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors"
                  >
                    <FileCode className="h-6 w-6 text-accent-400" />
                    <span className="text-xs font-medium text-center">{name}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-dashed border-neutral-200 dark:border-navy-700">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto text-accent-400 mb-2" />
                <p className="text-sm text-neutral-300">Activity chart integration ready (Recharts / Chart.js)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
