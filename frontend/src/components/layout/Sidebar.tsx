import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Code2,
  FolderKanban,
  Save,
  FileCode,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/compiler", label: "Compiler", icon: Code2 },
  { path: "/projects", label: "Projects", icon: FolderKanban },
  { path: "/saved", label: "Saved Codes", icon: Save },
  { path: "/snippets", label: "Snippets", icon: FileCode },
  { path: "/docs", label: "Documentation", icon: BookOpen },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const user = useAppStore((s) => s.user);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  return (
    <aside className="w-64 flex flex-col bg-navy-500 text-white h-full shrink-0">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-300 to-accent-400 flex items-center justify-center shadow-glow">
          <Code2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">C Compiler</h1>
          <p className="text-xs text-navy-100/70">Pro IDE</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn("sidebar-link", active && "sidebar-link-active")}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-white/10 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-navy-200 to-accent-300 flex items-center justify-center text-navy-900 font-bold">
            {user?.name?.[0] || user?.email?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || user?.email || "User"}</p>
            <p className="text-xs text-navy-100/70 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
