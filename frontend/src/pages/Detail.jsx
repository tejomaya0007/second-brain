import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  Calendar,
  Share2,
  Bookmark,
  ChevronRight,
  Zap,
  Tag as TagIcon
} from 'lucide-react';
import { knowledgeApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { fadeIn, staggerContainer } from '../lib/animations';
import { cn } from '../lib/utils';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    knowledgeApi.getById(id)
      .then(({ data }) => setEntry(data))
      .catch(() => setEntry(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this entry?')) return;
    try {
      await knowledgeApi.delete(id);
      navigate('/dashboard');
    } catch {
      alert('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 border-4 border-accent-1/20 border-t-accent-1 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Unpacking insight...</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <Card className="p-12 border-dashed border-white/10">
          <div className="w-20 h-20 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Insight not found</h2>
          <p className="text-gray-500 mb-8 font-medium">The knowledge entry you're looking for might have been deleted or moved.</p>
          <Link to="/dashboard">
            <Button variant="secondary" className="px-8">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const allTags = [...(entry.tags || []), ...(entry.aiTags || [])];

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeIn("down")} className="flex items-center justify-between mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-400 hover:text-white group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Feed
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Link to={`/edit/${entry._id}`}>
              <Button variant="secondary" size="sm" className="gap-2">
                <Edit3 size={14} />
                Edit
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </motion.div>

        <motion.header variants={fadeIn("up")} className="mb-10">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-accent-1 uppercase tracking-widest bg-accent-1/10 px-3 py-1.5 rounded-full border border-accent-1/20">
              <Zap size={14} fill="currentColor" />
              Captured Insight
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest bg-surface-elevated px-3 py-1.5 rounded-full border border-border">
              <Calendar size={14} />
              {new Date(entry.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-6">
            {entry.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, i) => (
              <span 
                key={i} 
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border",
                  entry.aiTags?.includes(tag) 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-accent-1/10 text-accent-1 border-accent-1/20"
                )}
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={fadeIn("up")} className="lg:col-span-2 space-y-8">
            <Card className="p-8 bg-surface-elevated/40 border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain size={120} />
              </div>
              <div className="relative">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <AlignLeft size={14} />
                  Knowledge Content
                </h3>
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed font-medium text-lg">
                  {entry.content}
                </div>
              </div>
            </Card>

            {entry.url && (
              <Card className="p-6 bg-surface-elevated/20 border-white/5 group hover:border-accent-1/30 transition-colors">
                <a 
                  href={entry.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-accent-1 transition-colors">
                      <ExternalLink size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Original Source</h4>
                      <p className="text-gray-500 text-sm truncate max-w-xs sm:max-w-md">{entry.url}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                </a>
              </Card>
            )}
          </motion.div>

          <motion.aside variants={fadeIn("left")} className="space-y-6">
            <AnimatePresence>
              {entry.summary && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-1 to-accent-2 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <Card className="relative p-6 bg-surface-elevated/80 border-white/10 backdrop-blur-xl">
                    <h3 className="text-xs font-bold text-accent-1 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles size={14} />
                      AI Synthesis
                    </h3>
                    <p className="text-gray-200 text-sm leading-relaxed font-medium">
                      {entry.summary}
                    </p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="p-6 bg-surface-elevated/20 border-white/5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={14} />
                Metadata
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-bold uppercase">Captured</span>
                  <span className="text-gray-400 font-medium">{new Date(entry.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-bold uppercase">Refined</span>
                  <span className="text-gray-400 font-medium">{new Date(entry.updatedAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-bold uppercase">Complexity</span>
                  <span className="text-emerald-400 font-bold uppercase">Low</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 gap-2">
                <Share2 size={16} />
                Share
              </Button>
              <Button variant="secondary" className="flex-1 gap-2">
                <Bookmark size={16} />
                Store
              </Button>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </div>
  );
}

// Helper icon component
function AlignLeft(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="21" x2="3" y1="6" y2="6" />
      <line x1="15" x2="3" y1="12" y2="12" />
      <line x1="17" x2="3" y1="18" y2="18" />
    </svg>
  );
}

function Brain(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" />
    </svg>
  );
}
