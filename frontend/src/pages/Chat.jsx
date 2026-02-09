import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react';
import { knowledgeApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { fadeIn, staggerContainer } from '../lib/animations';
import { cn } from '../lib/utils';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setLoading(true);
    try {
      const { data } = await knowledgeApi.chat(question);
      setMessages((prev) => [...prev, { role: 'ai', text: data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Sorry, I encountered an error while searching your knowledge base.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Clear chat history?')) {
      setMessages([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-160px)]">
      <header className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Meet <span className="text-gradient">Nova</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Your personal knowledge assistant, grounded in your own notes.
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-gray-500 hover:text-red-400">
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
        )}
      </header>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden bg-surface-elevated/20 border-white/5 relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.length === 0 && (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="h-full flex flex-col items-center justify-center text-center px-12"
            >
              <motion.div 
                variants={fadeIn("up")}
                className="w-20 h-20 rounded-3xl bg-accent-1/10 text-accent-1 flex items-center justify-center mb-6 shadow-2xl shadow-accent-1/5 border border-accent-1/20"
              >
                <Bot size={40} />
              </motion.div>
              <motion.h2 variants={fadeIn("up")} className="text-xl font-bold text-white mb-2">
                Ask Nova about anything you've captured
              </motion.h2>
              <motion.p variants={fadeIn("up")} className="text-gray-500 text-sm max-w-sm mb-8 font-medium">
                Start typing a question below to search, summarize, or connect ideas across your notes.
              </motion.p>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={cn(
                  "flex items-start gap-4",
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
                  m.role === 'user' ? "bg-accent-1/20 text-accent-1" : "bg-accent-2/20 text-accent-2"
                )}>
                  {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                <div className={cn(
                  "max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-xl",
                  m.role === 'user'
                    ? 'bg-accent-1 text-white rounded-tr-none'
                    : 'bg-surface-elevated text-gray-200 border border-white/5 rounded-tl-none font-medium'
                )}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-accent-2/20 text-accent-2 shrink-0 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div className="bg-surface-elevated border border-white/5 rounded-2xl rounded-tl-none px-5 py-4">
                <div className="flex gap-1.5">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 bg-accent-2 rounded-full" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-accent-2 rounded-full" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-accent-2 rounded-full" 
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={endRef} className="h-4" />
        </div>

        <div className="p-6 bg-surface/50 border-t border-white/5 backdrop-blur-xl">
          <form onSubmit={handleSend} className="relative group">
            <input
              autoFocus
              className={cn(
                "w-full bg-surface-elevated/50 border border-border rounded-2xl pl-5 pr-14 py-4 text-sm text-white placeholder-gray-500 transition-all duration-200 outline-none",
                "focus:border-accent-1/50 focus:ring-4 focus:ring-accent-1/5"
              )}
              placeholder="Ask anything about your knowledge base..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()} 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-accent-1 text-white rounded-xl shadow-lg shadow-accent-1/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-[10px] text-center text-gray-600 font-bold uppercase tracking-widest mt-3">
            Grounded in your personal insights
          </p>
        </div>
      </Card>
    </div>
  );
}
