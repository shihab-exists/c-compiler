import { cn } from "@/lib/utils";

export function Badge({ children, className, variant = "default" }: { children: React.ReactNode; className?: string; variant?: "default" | "success" | "warning" | "error" }) {
  const variants = {
    default: "bg-navy-100 dark:bg-navy-800 text-navy-500 dark:text-navy-100",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    error: "bg-error/15 text-error",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", variants[variant], className)}>
      {children}
    </span>
  );
}
