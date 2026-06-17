import { useAppStore } from "@/store/app.store";

export function InputPanel() {
  const input = useAppStore((s) => s.input);
  const setInput = useAppStore((s) => s.setInput);

  return (
    <div className="h-full flex flex-col glass-card rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-navy-700 bg-white/40 dark:bg-navy-800/40">
        <h4 className="text-sm font-semibold text-navy-500 dark:text-white">Custom Input</h4>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input for your program here..."
        className="flex-1 w-full resize-none bg-transparent p-4 font-mono text-sm outline-none placeholder:text-neutral-300 text-navy-500 dark:text-navy-100"
        spellCheck={false}
      />
    </div>
  );
}
