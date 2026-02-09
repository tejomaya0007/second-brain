import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Edit3, 
  Archive,
  Clock, 
  Tag as TagIcon,
  ExternalLink
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { tapScale } from "../../lib/animations";

export function FeedCard({ entry, onDelete, onArchive }) {
  const navigate = useNavigate();
  
  // entry represents a single page
  const allTags = [
    ...(entry.manualTags || []),
    ...(entry.aiTags || []),
  ];
  const date = entry.createdAt
    ? new Date(entry.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    })
    : '';

  const handleEdit = () => {
    navigate(`/edit/${entry.id}`);
  };

  return (
    <Card 
      className="flex flex-col h-full bg-surface-elevated/30 border-white/5 hover:border-accent-1/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <button
          type="button"
          onClick={() => navigate(`/entry/${entry.id}`)}
          className="group/title flex-1 text-left cursor-pointer"
        >
          <h3 className="text-lg font-bold text-white group-hover/title:text-accent-1 transition-colors line-clamp-2 leading-tight">
            {entry.title || 'Untitled page'}
          </h3>
          {entry.notebookTitle && (
            <p className="text-[11px] text-gray-500 mt-1 truncate">
              {entry.notebookTitle}
            </p>
          )}
        </button>
        
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleEdit}
            className="p-2 h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <Edit3 size={14} />
          </button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 h-8 w-8 rounded-lg text-gray-500 hover:text-red-400 cursor-pointer"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-8 w-8 rounded-lg text-gray-500 hover:text-gray-200 cursor-pointer"
            onClick={() => onArchive && onArchive(entry.id)}
          >
            <Archive size={14} />
          </Button>
        </div>
      </div>

      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
        {entry.summary || entry.content || 'Start writing your notes on this page.'}
      </p>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {allTags.slice(0, 4).map((tag, i) => (
            <span 
              key={i} 
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border transition-colors",
                entry.aiTags?.includes(tag) 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-accent-1/10 text-accent-1 border-accent-1/20"
              )}
            >
              {tag}
            </span>
          ))}
          {allTags.length > 4 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-gray-500 bg-white/5 border border-white/10">
              +{allTags.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="flex items-center gap-1 text-[11px]">
              <Clock size={12} />
              <span>{date}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-700" />
            <div className="flex items-center gap-1 text-[11px]">
              <TagIcon size={12} />
              <span>{allTags.length} tags</span>
            </div>
          </div>
          
          <Link
            to={`/entry/${entry.id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-accent-1 cursor-pointer"
          >
            <motion.div whileHover={{ x: 3 }}>
              Read More
              <ExternalLink size={12} className="ml-1 inline" />
            </motion.div>
          </Link>
        </div>
      </div>
    </Card>
  );
}
