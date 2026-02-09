import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { knowledgeApi } from '../services/api';
import { PieChart as PieChartIcon, Sparkles, Clock } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState('');

  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(true);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    const loadPages = async () => {
      try {
        const { data } = await knowledgeApi.getAll();
        const notebooks = data || [];
        const allPages = notebooks.flatMap((nb) => nb.pages || []);
        setPages(allPages);
      } catch (e) {
        setPages([]);
      } finally {
        setLoadingPages(false);
      }
    };

    loadPages();
  }, []);

  const topicSlices = useMemo(() => {
    const counts = new Map();
    pages.forEach((p) => {
      const tags = [...(p.manualTags || []), ...(p.aiTags || [])];
      if (!tags.length) return;
      const strongest = tags[0];
      counts.set(strongest, (counts.get(strongest) || 0) + 1);
    });

    const entries = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const total = entries.reduce((sum, [, v]) => sum + v, 0) || 1;
    let acc = 0;
    return entries.map(([label, value]) => {
      const start = acc / total;
      acc += value;
      const end = acc / total;
      return { label, value, start, end };
    });
  }, [pages]);

  const aiUsage = useMemo(() => {
    const dailyLimit = 20;
    const used = 0;
    const remaining = Math.max(dailyLimit - used, 0);
    return { dailyLimit, used, remaining };
  }, []);

  const handleSaveName = async () => {
    if (!name.trim() || !user) return;
    setSavingName(true);
    setNameError('');
    const result = await updateProfile({ name: name.trim() });
    if (!result.success) {
      setNameError(result.error || 'Could not update name');
    }
    setSavingName(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <div className="glass-card p-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent-1 to-accent-4 flex items-center justify-center text-white text-2xl font-bold">
          {user.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">
                Display name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-1/60 focus:border-accent-1/60"
                placeholder="Your name"
              />
              {nameError && (
                <p className="text-xs text-red-400 mt-1">{nameError}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-stretch sm:items-end">
              <div>
                <p className="text-xs font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-300">{user.email}</p>
              </div>
              <Button
                size="sm"
                className="px-4 mt-1"
                disabled={savingName || !name.trim() || name.trim() === user.name}
                onClick={handleSaveName}
              >
                {savingName ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-accent-1 uppercase flex items-center gap-2">
                <PieChartIcon size={14} />
                Topic Focus
              </p>
              <p className="text-sm text-gray-400 mt-1">What you write about the most.</p>
            </div>
            <span className="text-xs text-gray-500">{pages.length} pages</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative w-40 h-40 mx-auto sm:mx-0">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <circle cx="16" cy="16" r="14" fill="#050509" />
                {topicSlices.length === 0 && (
                  <circle cx="16" cy="16" r="14" stroke="#1f2933" strokeWidth="3" fill="none" />
                )}
                {topicSlices.map((slice, index) => {
                  const startAngle = slice.start * 2 * Math.PI - Math.PI / 2;
                  const endAngle = slice.end * 2 * Math.PI - Math.PI / 2;
                  const largeArc = slice.end - slice.start > 0.5 ? 1 : 0;
                  const x1 = 16 + 14 * Math.cos(startAngle);
                  const y1 = 16 + 14 * Math.sin(startAngle);
                  const x2 = 16 + 14 * Math.cos(endAngle);
                  const y2 = 16 + 14 * Math.sin(endAngle);
                  const d = `M16,16 L${x1},${y1} A14,14 0 ${largeArc} 1 ${x2},${y2} Z`;
                  const colors = [
                    '#fb7185',
                    '#38bdf8',
                    '#a855f7',
                    '#22c55e',
                    '#facc15',
                    '#f97316',
                  ];
                  const fill = colors[index % colors.length];
                  return <path key={slice.label} d={d} fill={fill} opacity="0.9" />;
                })}
                <circle cx="16" cy="16" r="7.5" fill="#020617" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Top topic</span>
                <span className="text-xs font-semibold text-white mt-1 text-center px-2 truncate max-w-[96px]">
                  {topicSlices[0]?.label || 'No tags yet'}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {loadingPages ? (
                <p className="text-xs text-gray-500">Loading topics…</p>
              ) : topicSlices.length === 0 ? (
                <p className="text-xs text-gray-500">
                  Start adding tags to your pages to see where your attention goes.
                </p>
              ) : (
                topicSlices.map((slice, index) => {
                  const total = topicSlices.reduce((sum, s) => sum + s.value, 0) || 1;
                  const pct = Math.round((slice.value / total) * 100);
                  const colors = [
                    'from-pink-500 to-rose-500',
                    'from-sky-400 to-cyan-400',
                    'from-violet-500 to-fuchsia-500',
                    'from-emerald-400 to-lime-400',
                    'from-amber-400 to-yellow-400',
                    'from-orange-400 to-amber-500',
                  ];
                  const barColor = colors[index % colors.length];
                  return (
                    <div key={slice.label} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-white/60" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-gray-300 mb-1">
                          <span className="truncate max-w-[130px]">{slice.label}</span>
                          <span className="text-gray-500">{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${barColor}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-white flex items-center gap-1">
                <Clock size={14} className="text-accent-1" />
                Session
              </p>
              <p className="text-sm text-gray-400">Stay logged in and capture thoughts anytime.</p>
            </div>
            <Button
              variant="outline"
              className="border-red-500/40 text-red-400 hover:bg-red-500/10"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
