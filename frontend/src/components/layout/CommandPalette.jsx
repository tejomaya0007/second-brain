import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, X, Zap, MessageCircle, PlusCircle, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const actions = [
    { icon: PlusCircle, label: "Add New Knowledge", shortcut: "N", path: "/add" },
    { icon: LayoutDashboard, label: "Go to Dashboard", shortcut: "D", path: "/dashboard" },
    { icon: MessageCircle, label: "Open AI Chat", shortcut: "C", path: "/chat" },
    { icon: Zap, label: "View Streak", shortcut: "S", path: "/dashboard" },
  ];

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden relative"
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Search className="text-gray-500" size={20} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
              />
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/5 rounded-md transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto p-2">
              <div className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Quick Actions
              </div>
              {filteredActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    navigate(action.path);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <action.icon size={18} className="text-gray-500 group-hover:text-accent-1" />
                    <span className="text-sm text-gray-300 group-hover:text-white">
                      {action.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-600 font-mono bg-background px-1.5 py-0.5 border border-border rounded uppercase">
                      {action.shortcut}
                    </span>
                  </div>
                </button>
              ))}
              {filteredActions.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No commands found for "{query}"
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border bg-background/50 flex items-center justify-between text-[10px] text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-border rounded bg-surface">↑↓</kbd> to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-border rounded bg-surface">Enter</kbd> to select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 border border-border rounded bg-surface">Esc</kbd> to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
