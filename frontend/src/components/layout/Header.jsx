import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Command, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { tapScale } from "../../lib/animations";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />

          <input
            type="text"
            placeholder="Search knowledge..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const q = query.trim();
                navigate(q ? `/dashboard?search=${encodeURIComponent(q)}` : "/dashboard");
              }
            }}
            className="w-full bg-surface-elevated/50 border border-border rounded-xl pl-10 pr-12 py-2 text-sm text-white focus:outline-none"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-background px-1.5 py-0.5 border border-border rounded text-[10px] text-gray-500 font-mono">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="flex items-center gap-4">

        <motion.button
          whileTap={tapScale}
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-1 to-accent-4 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          <span className="text-sm font-medium text-gray-300 hidden sm:inline-block">
            {user?.name || "User"}
          </span>
        </motion.button>

        <motion.button
          whileTap={tapScale}
          onClick={logout}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
          title="Logout"
        >
          <LogOut size={18} />
        </motion.button>

      </div>
    </header>
  );
}
