import { useState, createContext, useContext, Children, isValidElement, cloneElement } from "react";
import { cn } from "@/lib/utils";

const TabsContext = createContext<{ active: string; setActive: (v: string) => void } | null>(null);

export function Tabs({ defaultValue, children, className }: { defaultValue: string; children: React.ReactNode; className?: string }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("flex flex-col h-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-1 border-b border-neutral-200 dark:border-navy-700 px-4", className)}>{children}</div>;
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const active = ctx.active === value;
  return (
    <button
      onClick={() => ctx.setActive(value)}
      className={cn(
        "relative px-4 py-3 text-sm font-medium transition-colors",
        active ? "text-accent-400" : "text-neutral-300 hover:text-navy-500 dark:hover:text-navy-100",
        className
      )}
    >
      {children}
      {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent-400" />}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.active !== value) return null;
  return <div className={cn("flex-1 overflow-auto p-4", className)}>{children}</div>;
}
