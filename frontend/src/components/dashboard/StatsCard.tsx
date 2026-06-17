import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  delay = 0,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  color: "blue" | "green" | "orange" | "red" | "purple";
  delay?: number;
}) {
  const colors = {
    blue: "from-accent-300/20 to-accent-400/10 text-accent-400",
    green: "from-success/20 to-success/5 text-success",
    orange: "from-warning/20 to-warning/5 text-warning",
    red: "from-error/20 to-error/5 text-error",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card p-5 relative overflow-hidden group"
    >
      <div
        className={cn(
          "absolute top-0 right-0 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl opacity-40 -mr-8 -mt-8 transition-opacity group-hover:opacity-60",
          colors[color]
        )}
      />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-neutral-300">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-navy-500 dark:text-white">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-neutral-300">{subtitle}</p>}
        </div>
        <div className={cn("p-3 rounded-xl bg-gradient-to-br", colors[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
