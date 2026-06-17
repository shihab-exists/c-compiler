import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-neutral-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-4 py-2 text-sm outline-none transition-all",
          "placeholder:text-neutral-300 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
