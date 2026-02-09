import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, LayoutGrid, List, SlidersHorizontal, Zap } from 'lucide-react';
import { knowledgeApi } from '../services/api';
import { pageApi } from '../services/pageApi.js';
import { FeedCard } from '../components/feed/FeedCard';
import { FilterBar } from '../components/feed/FilterBar';
import { Button } from '../components/ui/Button';
import { StatsPanel } from '../components/gamification/StatsPanel';
import { staggerContainer, fadeIn } from '../lib/animations';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [entries, setEntries] = useState([]); // pages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const fetchEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (tagFilter) params.tag = tagFilter;
      if (sort) params.sort = sort;
      const { data } = await knowledgeApi.getAll(params);

      // Backend returns notebooks with nested pages; flatten to individual pages
      const notebooks = data || [];
      let pages = notebooks.flatMap((nb) => {
        const nbPages = nb.pages || [];
        return nbPages.map((p) => ({
          ...p,
          notebookTitle: nb.title || 'Untitled',
        }));
      });

      // Filter out archived pages
      pages = pages.filter((p) => !p.archived);

      // Apply client-side sort for newest/oldest
      pages = [...pages].sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return sort === 'oldest' ? da - db : db - da;
      });

      setEntries(pages);
    } catch (e) {
      setError('Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id) => {
    if (!confirm('Archive this page? You can unarchive it later from the archive view.')) return;
    try {
      await pageApi.update(id, { archived: true });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert('Failed to archive');
    }
  };

  useEffect(() => { fetchEntries(); }, [sort, tagFilter]);

  // Keep search in sync with ?search= in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearch(q);
  }, [location.search]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this page?')) return;
    try {
      await pageApi.delete(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert('Failed to delete');
    }
  };

  // Build a compact tag list using the first couple of tags from each entry
  const allTags = Array.from(new Set(
    entries.flatMap((e) => {
      const tags = [
        ...(e.manualTags || []),
        ...(e.aiTags || []),
      ];
      // Take the first 2 tags from each page as its "main" topics
      return tags.slice(0, 2);
    })
  )).slice(0, 8);

  const totalTags = [...new Set(entries.flatMap((e) => [
    ...(e.manualTags || []),
    ...(e.aiTags || []),
  ]))].length;

  // Filter entries client-side by search (title or tags)
  const filteredEntries = entries.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const titleMatch = (e.title || '').toLowerCase().includes(q);
    const tags = [
      ...(e.manualTags || []),
      ...(e.aiTags || []),
    ].join(' ').toLowerCase();
    const tagMatch = tags.includes(q);
    return titleMatch || tagMatch;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          variants={fadeIn("right", "spring", 0.1)}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent-1/10 flex items-center justify-center text-accent-1">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-accent-1 uppercase tracking-widest">Knowledge Feed</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Your Second <span className="text-gradient">Brain</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Exploring {filteredEntries.length} captured insights and ideas.
          </p>
        </motion.div>

        <motion.div
          variants={fadeIn("left", "spring", 0.2)}
          initial="hidden"
          animate="show"
          className="flex items-center gap-4"
        >
          <Link to="/add">
            <Button className="gap-2 px-8 py-4 text-base shadow-2xl shadow-accent-1/20">
              <Plus size={20} />
              Capture Insight
            </Button>
          </Link>
        </motion.div>
      </header>

      <StatsPanel totalEntries={filteredEntries.length} totalTags={totalTags} />

      <FilterBar 
        tags={allTags}
        activeTag={tagFilter}
        onTagChange={setTagFilter}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-surface-elevated/50 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-12 text-center border-red-500/20">
          <p className="text-red-400 font-medium">{error}</p>
          <Button variant="secondary" onClick={fetchEntries} className="mt-4">Try Again</Button>
        </div>
      ) : filteredEntries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-20 text-center border-dashed border-white/10"
        >
          <div className="w-20 h-20 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus size={32} className="text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No insights yet</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">
            Start building your knowledge base by capturing your first thought.
          </p>
          <Link to="/add">
            <Button variant="outline">Create First Entry</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className={cn(
            "grid gap-6",
            viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}
        >
          {filteredEntries.map((entry) => (
            <FeedCard 
              key={entry.id} 
              entry={entry} 
              onDelete={handleDelete}
              onArchive={handleArchive}
              onEdit={(id) => navigate(`/edit/${id}`)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
