import * as React from "react";
import { motion } from "framer-motion";
import { Filter, SortAsc, SortDesc, Grid, List, X } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export function FilterBar({ 
  tags, 
  activeTag, 
  onTagChange, 
  sort, 
  onSortChange, 
  viewMode, 
  onViewModeChange 
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
        <Button
          variant={activeTag === "" ? "primary" : "secondary"}
          size="sm"
          onClick={() => onTagChange("")}
          className="shrink-0"
        >
          All Entries
        </Button>
        {tags.map((tag) => (
          <span
            key={tag}
            className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/5 text-gray-300 border border-white/5 cursor-default select-none"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center bg-surface border border-border rounded-xl p-1">
          <button
            onClick={() => onSortChange(sort === "newest" ? "oldest" : "newest")}
            className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center gap-2 px-3 text-xs font-medium"
          >
            {sort === "newest" ? <SortDesc size={14} /> : <SortAsc size={14} />}
            <span className="hidden sm:inline">{sort === "newest" ? "Newest" : "Oldest"}</span>
          </button>
        </div>

        <div className="flex items-center bg-surface border border-border rounded-xl p-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              viewMode === "grid" ? "bg-accent-1/10 text-accent-1" : "text-gray-500 hover:text-white"
            )}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              viewMode === "list" ? "bg-accent-1/10 text-accent-1" : "text-gray-500 hover:text-white"
            )}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
