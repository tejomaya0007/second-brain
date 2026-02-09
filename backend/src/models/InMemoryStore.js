import crypto from "crypto";

// In-memory store — works without MongoDB for demo/development
const entries = [
  {
    _id: "seed001",
    title: "React Hooks Guide",
    content: "React hooks are functions that let you use state and lifecycle features in functional components. useState manages local state. useEffect handles side effects like data fetching. useCallback and useMemo optimize performance by memoizing values and functions.",
    url: "",
    tags: ["react", "javascript", "frontend"],
    aiTags: ["hooks", "state-management", "functional-components"],
    summary: "A concise guide to React hooks covering useState, useEffect, useCallback, and useMemo for managing state and side effects in functional components.",
    createdAt: "2026-02-08T10:00:00.000Z",
    updatedAt: "2026-02-08T10:00:00.000Z",
  },
  {
    _id: "seed002",
    title: "Node.js Event Loop Explained",
    content: "The Node.js event loop is what allows Node.js to perform non-blocking I/O operations. It handles asynchronous callbacks and is central to Node.js architecture. The event loop has phases: timers, pending callbacks, idle/prepare, poll, check, and close callbacks.",
    url: "",
    tags: ["nodejs", "backend"],
    aiTags: ["event-loop", "async", "non-blocking"],
    summary: "Explains how the Node.js event loop enables non-blocking I/O through its multi-phase architecture handling timers, callbacks, and polling.",
    createdAt: "2026-02-07T14:30:00.000Z",
    updatedAt: "2026-02-07T14:30:00.000Z",
  },
  {
    _id: "seed003",
    title: "CSS Grid vs Flexbox",
    content: "CSS Grid is a two-dimensional layout system for the web. Flexbox is one-dimensional and works in a row or column. Use Grid for page layouts, Flexbox for component layouts. Grid handles complex 2D layouts while Flexbox excels at distributing space along a single axis.",
    url: "",
    tags: ["css", "web-design"],
    aiTags: ["layout", "responsive", "grid", "flexbox"],
    summary: "Compares CSS Grid (2D layouts) and Flexbox (1D layouts), recommending Grid for page structure and Flexbox for component-level alignment.",
    createdAt: "2026-02-06T09:15:00.000Z",
    updatedAt: "2026-02-06T09:15:00.000Z",
  },
  {
    _id: "seed004",
    title: "MongoDB Indexing Strategies",
    content: "MongoDB indexes support efficient query execution. Without indexes, MongoDB performs a full collection scan. Common index types: single field, compound, multikey, text, and geospatial. The ESR rule (Equality, Sort, Range) helps optimize compound index field order.",
    url: "",
    tags: ["mongodb", "database"],
    aiTags: ["indexing", "performance", "queries"],
    summary: "Covers MongoDB index types and the ESR rule for optimizing compound indexes to avoid full collection scans and improve query performance.",
    createdAt: "2026-02-05T16:45:00.000Z",
    updatedAt: "2026-02-05T16:45:00.000Z",
  },
];

function generateId() {
  return crypto.randomBytes(12).toString("hex");
}

class InMemoryKnowledge {
  static async create(data) {
    const entry = {
      _id: generateId(),
      title: data.title || "",
      content: data.content || "",
      url: data.url || "",
      tags: data.tags || [],
      aiTags: data.aiTags || [],
      summary: data.summary || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    entries.unshift(entry);
    return { ...entry };
  }

  static async find(query = {}, sortOpt = { createdAt: -1 }) {
    let results = [...entries];

    // Text search
    if (query.$text) {
      const term = query.$text.$search.toLowerCase();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.content.toLowerCase().includes(term) ||
          e.tags.some((t) => t.toLowerCase().includes(term)) ||
          e.aiTags.some((t) => t.toLowerCase().includes(term))
      );
    }

    // Tag filter
    if (query.$or) {
      const tagFilters = query.$or;
      results = results.filter((e) =>
        tagFilters.some((f) => {
          if (f.tags) return e.tags.includes(f.tags);
          if (f.aiTags) return e.aiTags.includes(f.aiTags);
          return false;
        })
      );
    }

    // Sort
    const sortKey = Object.keys(sortOpt)[0] || "createdAt";
    const sortDir = sortOpt[sortKey] === 1 ? 1 : -1;
    results.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return -sortDir;
      if (a[sortKey] > b[sortKey]) return sortDir;
      return 0;
    });

    return results;
  }

  static async findById(id) {
    return entries.find((e) => e._id === id) || null;
  }

  static async findByIdAndUpdate(id, data) {
    const idx = entries.findIndex((e) => e._id === id);
    if (idx === -1) return null;
    entries[idx] = { ...entries[idx], ...data, updatedAt: new Date().toISOString() };
    return { ...entries[idx] };
  }

  static async findByIdAndDelete(id) {
    const idx = entries.findIndex((e) => e._id === id);
    if (idx === -1) return null;
    const [removed] = entries.splice(idx, 1);
    return removed;
  }
}

export default InMemoryKnowledge;
