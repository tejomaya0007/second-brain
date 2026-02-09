import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  LayoutDashboard, 
  PlusSquare, 
  MessageCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap
} from "lucide-react";
import { cn } from "../../lib/utils";
import { tapScale } from "../../lib/animations";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add", label: "Add Knowledge", icon: PlusSquare },
  { to: "/chat", label: "AI Chat", icon: MessageCircle },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const { pathname } = useLocation();

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 260 }}
      className="hidden md:flex flex-col h-screen bg-surface border-r border-border relative z-50 transition-all duration-300"
    >
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-1 via-accent-2 to-accent-3 flex items-center justify-center text-white shadow-lg shadow-accent-1/20 shrink-0">
            <Zap size={20} fill="currentColor" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent truncate"
            >
              Second Brain
            </motion.span>
          )}
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          const Icon = item.icon;
          
          return (
            <Link key={item.to} to={item.to}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={tapScale}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-accent-1/10 text-accent-1" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={22} className={cn("shrink-0", isActive ? "text-accent-1" : "group-hover:text-white")} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-accent-1 rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          {!collapsed && <span className="font-medium">Collapse</span>}
        </button>
      </div>
    </motion.div>
  );
}
