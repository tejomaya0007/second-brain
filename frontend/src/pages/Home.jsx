import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Brain, Sparkles, MessageSquare, ArrowRight, Github } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { fadeIn, staggerContainer } from '../lib/animations';

export default function Home() {
  return (
    <div className="relative isolate">
      {/* Background Glow */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent-1 to-accent-2 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="py-20 sm:py-28 text-center">
          <motion.div 
            variants={fadeIn("down", "spring", 0.1)}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-elevated border border-border text-accent-1 text-sm mb-8 shadow-2xl"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span className="font-bold tracking-wide uppercase text-[10px]">AI-Powered Knowledge Management</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeIn("up", "spring", 0.2)}
            initial="hidden"
            animate="show"
            className="text-5xl sm:text-7xl font-black leading-tight mb-8 tracking-tight"
          >
            <span className="text-white">Your Digital</span>
            <br />
            <span className="text-gradient">Second Brain</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeIn("up", "spring", 0.3)}
            initial="hidden"
            animate="show"
            className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Capture everything. Remember everything. Let AI organize your digital life with automatic summarization, smart tagging, and semantic search.
          </motion.p>
          
          <motion.div 
            variants={fadeIn("up", "spring", 0.4)}
            initial="hidden"
            animate="show"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/add">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-bold">
                Start Capturing
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base font-bold">
                Explore Feed
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features */}
        <motion.section 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="pb-32 grid sm:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Brain,
              title: 'Smart Notes',
              desc: 'Capture insights, links, and articles in a clean, distraction-free environment.',
              color: 'text-accent-1',
              bg: 'bg-accent-1/10'
            },
            {
              icon: Sparkles,
              title: 'AI Synthesis',
              desc: 'Automatic summaries and intelligent tagging powered by world-class AI models.',
              color: 'text-accent-2',
              bg: 'bg-accent-2/10'
            },
            {
              icon: MessageSquare,
              title: 'Semantic Chat',
              desc: 'Ask questions about your stored knowledge and get instant, grounded answers.',
              color: 'text-accent-4',
              bg: 'bg-accent-4/10'
            },
          ].map((f, i) => (
            <Card key={i} className="group cursor-default border-white/5 hover:border-white/10">
              <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
            </Card>
          ))}
        </motion.section>
      </div>

      {/* Footer Decoration */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-accent-2 to-accent-3 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}
