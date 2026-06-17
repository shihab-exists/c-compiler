import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "./store/app.store";
import { Sidebar } from "./components/layout/Sidebar";
import { TopNavbar } from "./components/layout/TopNavbar";
import { DashboardPage } from "./pages/DashboardPage";
import { CompilerPage } from "./pages/CompilerPage";
import { AuthPage } from "./pages/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const theme = useAppStore((s) => s.theme);
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [theme, setUser]);

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-900 text-navy-900 dark:text-navy-50 transition-colors">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function AppShell() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopNavbar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/compiler" element={<CompilerPage />} />
            <Route path="/compiler/:projectId" element={<CompilerPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
