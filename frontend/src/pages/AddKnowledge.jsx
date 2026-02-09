import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, FileText, Link as LinkIcon,
  Send, Bot, Sparkles, User,
  Music, Video, Map, FileStack,
  X, ChevronRight, Settings, Share2, Info, MoreVertical,
  Clock, FolderOpen, Edit3, Save, RefreshCw, Upload, Image
} from 'lucide-react';
import { knowledgeApi } from '../services/api';
import { pageApi } from '../services/pageApi.js';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';

export default function AddKnowledge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [notebook, setNotebook] = useState(null);
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [sources, setSources] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('Saved');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [showSourcesPanel, setShowSourcesPanel] = useState(false);
  const [pageSearch, setPageSearch] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  const chatEndRef = useRef(null);
  const autoSaveIntervalRef = useRef(null);

  useEffect(() => {
    initializeNotebook();
    if (id) {
      loadPage(id);
    }
    startAutoSave();
    return () => stopAutoSave();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeNotebook = async () => {
    try {
      // Get or create the main notebook
      const { data: notebooks } = await knowledgeApi.getAll();
      let mainNotebook = notebooks[0];

      // If no notebook exists yet, create one and use the response data
      if (!mainNotebook) {
        const { data } = await knowledgeApi.create({ title: 'My Notebook' });
        mainNotebook = data;
      }

      // Safety: ensure we have a plain object with id and pages array
      const normalized = {
        id: mainNotebook.id,
        title: mainNotebook.title,
        pages: mainNotebook.pages || [],
      };

      setNotebook(normalized);
      setPages(normalized.pages);

      if (normalized.pages.length > 0 && !id) {
        const first = normalized.pages[0];
        setActivePage(first);
        setNoteContent(first.content || '');
        setTags(first.manualTags || []);
        setSources(first.attachments || []);
      }
    } catch (err) {
      console.error('Failed to initialize notebook', err);
    }
  };

  const startAutoSave = () => {
    autoSaveIntervalRef.current = setInterval(() => {
      if (activePage && noteContent !== activePage.content) {
        saveNote(true);
      }
    }, 5 * 60 * 1000); // 5 minutes
  };

  const stopAutoSave = () => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }
  };

  const loadPage = async (pageId) => {
    try {
      const { data } = await pageApi.getById(pageId);
      setActivePage(data);
      setNoteContent(data.content || '');
      setTags(data.manualTags || []);
      setSources(data.attachments || []);
    } catch (err) {
      console.error('Failed to load page', err);
    }
  };

  const createNewPage = async () => {
    if (!newPageTitle.trim() || !notebook) return;
    try {
      const { data } = await pageApi.create({
        notebookId: notebook.id,
        title: newPageTitle,
        content: '',
        manualTags: [],
        attachments: []
      });
      
      const newPages = [...pages, data];
      setPages(newPages);
      setActivePage(data);
      setNoteContent('');
      setTags([]);
      setSources([]);
      setShowAddPage(false);
      setNewPageTitle('');
      // Stay on /add; no route change needed
    } catch (err) {
      console.error('Failed to create page', err);
    }
  };

  const saveNote = async (isAutoSave = false) => {
    if (!activePage) return;
    try {
      setAutoSaveStatus('Saving...');
      await pageApi.update(activePage.id, {
        title: activePage.title,
        content: noteContent,
        manualTags: tags,
        attachments: sources
      });
      setAutoSaveStatus(isAutoSave ? 'Auto-saved' : 'Saved');
      setTimeout(() => setAutoSaveStatus('Saved'), 2000);
    } catch (err) {
      setAutoSaveStatus('Save failed');
      console.error('Failed to save', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const { data } = await knowledgeApi.chat(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I couldn\'t process that request.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

    files.forEach((file) => {
      if (file.size > MAX_SIZE) {
        console.warn('File too large, skipping:', file.name);
        // Simple UX: you could replace with a toast if you add one later
        alert(`"${file.name}" is larger than 5 MB and was not uploaded.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const attachment = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: reader.result,
          size: file.size,
        };
        setSources((prev) => {
          const updated = [...prev, attachment];
          // Persist attachments so they survive refresh
          if (activePage) {
            pageApi.update(activePage.id, {
              title: activePage.title,
              content: noteContent,
              manualTags: tags,
              attachments: updated,
            }).catch((err) => console.error('Failed to save attachments', err));
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddLink = () => {
    const raw = linkInput.trim();
    if (!raw) return;

    const attachment = {
      id: Date.now().toString(),
      name: raw,
      type: 'link',
      url: raw,
      size: 0,
    };

    setSources(prev => {
      const updated = [...prev, attachment];
      if (activePage) {
        pageApi.update(activePage.id, {
          title: activePage.title,
          content: noteContent,
          manualTags: tags,
          attachments: updated,
        }).catch((err) => console.error('Failed to save link attachment', err));
      }
      return updated;
    });
    setLinkInput('');
  };

  const handleRemoveSource = (id) => {
    setSources((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (activePage) {
        pageApi.update(activePage.id, {
          title: activePage.title,
          content: noteContent,
          manualTags: tags,
          attachments: updated,
        }).catch((err) => console.error('Failed to remove attachment', err));
      }
      return updated;
    });
  };

  const generateTags = async () => {
    if (!noteContent.trim()) return;
    try {
      const { data } = await knowledgeApi.generateTags(noteContent);
      const newTags = Array.isArray(data.tags) ? data.tags : [];
      setTags(prev => [...new Set([...prev, ...newTags])]);
      // Optionally auto-save with new tags
      if (activePage) {
        await pageApi.update(activePage.id, {
          title: activePage.title,
          content: noteContent,
          manualTags: [...new Set([...tags, ...newTags])],
          attachments: sources,
        });
      }
    } catch (err) {
      console.error('Failed to generate tags', err);
    }
  };

  const persistTags = async (updatedTags) => {
    setTags(updatedTags);
    if (activePage) {
      try {
        await pageApi.update(activePage.id, {
          title: activePage.title,
          content: noteContent,
          manualTags: updatedTags,
          attachments: sources,
        });
      } catch (err) {
        console.error('Failed to save manual tags', err);
      }
    }
  };

  const handleAddManualTag = () => {
    const raw = newTagInput.trim();
    if (!raw) return;
    const exists = tags.some((t) => t.toLowerCase() === raw.toLowerCase());
    if (exists) {
      setNewTagInput('');
      return;
    }
    const updated = [...tags, raw];
    persistTags(updated);
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = tags.filter((t) => t !== tagToRemove);
    persistTags(updated);
  };

  const runQuickAction = async (type) => {
    if (loading) return;

    // For all quick actions we need some note content
    if (!noteContent.trim()) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Write some notes first, then I can help summarize or generate ideas.' }]);
      return;
    }

    setLoading(true);
    const linkSources = sources.filter((s) => s.type === 'link');
    const fileSources = sources.filter((s) => s.type !== 'link');

    const linksText = linkSources.length
      ? `\n\nSOURCES (links):\n${linkSources
          .map((s) => `- ${s.url || s.name}`)
          .join('\n')}`
      : '';

    const filesText = fileSources.length
      ? `\n\nSOURCES (files):\n${fileSources
          .map((s) => `- ${s.name}`)
          .join('\n')}`
      : '';
    try {
      if (type === 'summarize') {
        const { data } = await knowledgeApi.summarize(noteContent);
        const summary = data.summary || '';
        setMessages(prev => [
          ...prev,
          { role: 'ai', text: summary },
        ]);
      } else if (type === 'ideas') {
        const prompt = `Generate 3-5 concrete ideas or next steps based on this note. Respond as bullet points.\n\nNOTE:\n${noteContent}${linksText}${filesText}`;
        const { data } = await knowledgeApi.chat(prompt);
        setMessages(prev => [
          ...prev,
          { role: 'ai', text: data.answer },
        ]);
      } else if (type === 'continue') {
        const prompt = `You are continuing a note.

Look at the LAST SENTENCE of the note:
- If it looks INCOMPLETE (for example ends with a word like "it" and no full stop), first FINISH that same sentence starting exactly from the last word.
- If the last sentence already ends with a full stop (".", "!", or "?"), start the next sentence as a NEW paragraph.

Then write in total about 100–150 words more, formatted as TWO short paragraphs:
- The first part finishes or continues the current thought.
- After roughly 40–60 words, insert ONE blank line and then continue in a second paragraph.
- Do NOT rewrite or copy the existing text, only continue from where it stops.

CURRENT NOTE:
${noteContent}${linksText}${filesText}`;
        const { data } = await knowledgeApi.chat(prompt);
        const continuation = data.answer || '';
        // Append the AI-generated continuation directly into the note content
        setNoteContent(prev => {
          const spacer = prev.trim().length ? '\n\n' : '';
          return prev + spacer + continuation;
        });
      }
    } catch (err) {
      console.error('Quick AI action failed', err);
      setMessages(prev => [...prev, { role: 'ai', text: 'AI request failed. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 top-[64px] left-[260px] bg-background flex overflow-hidden z-10">
      {/* Panel 1: History/Pages */}
      <div className="w-64 border-r border-white/5 flex flex-col bg-surface/30">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pages</h2>
            <Button
              size="sm"
              onClick={() => setShowAddPage(true)}
              className="p-1.5 h-8 w-8 rounded-lg bg-accent-1/10 hover:bg-accent-1/20 text-accent-1"
            >
              <Plus size={16} />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              placeholder="Search pages..." 
              value={pageSearch}
              onChange={(e) => setPageSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-accent-1/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {pages
            .filter(page => {
              if (!pageSearch.trim()) return true;
              return (page.title || '').toLowerCase().includes(pageSearch.toLowerCase());
            })
            .map(page => (
            <button
              key={page.id}
              onClick={() => {
                setActivePage(page);
                setNoteContent(page.content || '');
                setTags(page.manualTags || []);
                setSources(page.attachments || []);
                // Do not change route when switching pages
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                activePage?.id === page.id ? "bg-accent-1/10 border border-accent-1/20" : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-gray-400 shrink-0 group-hover:text-accent-1">
                <FileText size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{page.title}</p>
                <p className="text-[10px] text-gray-500 truncate">
                  {new Date(page.createdAt).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Panel 2: Notes Editor */}
      <div className="flex-1 flex flex-col bg-background">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            {activePage && (
              <>
                <input
                  value={activePage.title}
                  onChange={(e) => setActivePage(prev => ({ ...prev, title: e.target.value }))}
                  className="text-sm font-semibold text-white bg-transparent outline-none border-b border-transparent hover:border-white/20 focus:border-accent-1/50"
                />
                <span className="text-xs text-gray-500">{autoSaveStatus}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => saveNote()} className="gap-2">
              <Save size={16} />
              Save
            </Button>
            <Button size="sm" variant="secondary" onClick={generateTags} className="gap-2">
              <Sparkles size={16} />
              Generate Tags
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6">
          {activePage ? (
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Start writing your notes here..."
              className="w-full h-full bg-transparent text-white text-base leading-relaxed outline-none resize-none placeholder-gray-600"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div className="space-y-4">
                <FileText size={48} className="mx-auto text-gray-600" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">No page selected</h3>
                  <p className="text-gray-500 text-sm">Create a new page or select an existing one to start writing</p>
                </div>
                <Button onClick={() => setShowAddPage(true)} className="gap-2">
                  <Plus size={18} />
                  New Page
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel 3: Sources & Attachments */}
      <div className="w-80 border-l border-white/5 flex flex-col bg-surface/30">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sources</h2>
            <Button size="sm" onClick={() => setShowSourcesPanel(!showSourcesPanel)} className="p-1.5">
              <Upload size={16} />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showSourcesPanel && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="border-b border-white/5 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Add Link</label>
                  <Input
                    placeholder="https://example.com"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLink();
                      }
                    }}
                    className="bg-black/20 border-white/5 rounded-lg py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Upload Files</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-accent-1/10 file:text-accent-1 hover:file:bg-accent-1/20"
                  />
                  <p className="mt-1 text-[10px] text-gray-500">
                    Supports images, PDF, and Word files (.doc, .docx). Each file must be under 5 MB.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Tags */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h3>
            <div className="flex items-center gap-2 mb-3">
              <Input
                placeholder="Add tag manually..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddManualTag();
                  }
                }}
                className="bg-black/20 border-white/5 rounded-lg py-1 px-2 text-xs flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                className="text-[11px] px-2 py-1 h-7"
                onClick={handleAddManualTag}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent-1/10 text-accent-1 text-[11px] rounded-full"
                  >
                    <span className="truncate max-w-[120px]">{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 rounded-full hover:bg-accent-1/20 text-accent-1 flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sources List */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Attachments</h3>
            <div className="space-y-2">
              {sources.map(source => (
                <div key={source.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-gray-400">
                    {source.type === 'image' ? <Image size={14} /> : <FileText size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-200 truncate">{source.name}</p>
                    <p className="text-[10px] text-gray-500">{(source.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSource(source.id)}
                    className="ml-1 rounded-full p-1 hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Remove attachment"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panel 4: AI Chat */}
      <div className="w-80 border-l border-white/5 flex flex-col bg-surface/30">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">AI Assistant</h2>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="px-2 py-1 text-[10px] h-7"
                  onClick={() => setMessages([])}
                >
                  Back to actions
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-xs text-gray-500 mb-4">Ask me to continue writing, summarize, or generate ideas from your note.</p>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start gap-2 text-xs"
                  onClick={() => runQuickAction('continue')}
                  disabled={loading}
                >
                  <Edit3 size={14} />
                  Continue writing
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start gap-2 text-xs"
                  onClick={() => runQuickAction('summarize')}
                  disabled={loading}
                >
                  <FileText size={14} />
                  Summarize notes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start gap-2 text-xs"
                  onClick={() => runQuickAction('ideas')}
                  disabled={loading}
                >
                  <Sparkles size={14} />
                  Generate ideas
                </Button>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
                  m.role === 'user' ? "bg-accent-1 text-white" : "bg-accent-2 text-white"
                )}>
                  {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className={cn(
                  "p-3 rounded-xl text-xs leading-relaxed max-w-full break-words",
                  m.role === 'user' ? "bg-accent-1 text-white" : "bg-surface-elevated text-gray-200 border border-white/5"
                )}>
                  {m.text}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-white/5">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-accent-1/50"
            />
            <Button size="sm" type="submit" disabled={!input.trim() || loading} className="p-2">
              <Send size={14} />
            </Button>
          </form>
        </div>
      </div>

      {/* Add Page Modal */}
      <AnimatePresence>
        {showAddPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-surface-elevated border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Create New Page</h3>
              <Input
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="Page title"
                className="mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <Button onClick={createNewPage} disabled={!newPageTitle.trim()} className="flex-1">
                  Create
                </Button>
                <Button variant="secondary" onClick={() => setShowAddPage(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

