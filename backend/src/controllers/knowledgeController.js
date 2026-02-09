import * as service from "../services/knowledgeService.js";
import { summarize as aiSummarize, generateTags as aiGenerateTags } from "../services/aiService.js";

export async function create(req, res, next) {
  try {
    const entry = await service.createNotebook({ ...req.body, userId: req.user.id });
    res.status(201).json(entry);
  } catch (e) { next(e); }
}

export async function getAll(req, res, next) {
  try {
    const { search, tag, sort } = req.query;
    const entries = await service.getAllEntries({ search, tag, sort, userId: req.user.id });
    res.json(entries);
  } catch (e) { next(e); }
}

export async function getById(req, res, next) {
  try {
    const entry = await service.getEntryById(req.params.id, req.user.id);
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json(entry);
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const entry = await service.updateEntry(req.params.id, req.body);
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json(entry);
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const entry = await service.deleteEntry(req.params.id);
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (e) { next(e); }
}

export async function search(req, res, next) {
  try {
    const entries = await service.searchEntries(req.query.q);
    res.json(entries);
  } catch (e) { next(e); }
}

export async function chat(req, res, next) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });
    const answer = await service.askQuestion(question, req.user.id);
    res.json({ answer });
  } catch (e) { next(e); }
}

// AI helpers for a single note's content
export async function summarizeNote(req, res, next) {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "content is required" });
    }
    const summary = await aiSummarize(content);
    res.json({ summary });
  } catch (e) { next(e); }
}

export async function generateNoteTags(req, res, next) {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "content is required" });
    }
    const tags = await aiGenerateTags(content);
    res.json({ tags });
  } catch (e) { next(e); }
}

// Page-specific endpoints
export async function createPage(req, res, next) {
  try {
    if (!req.body.notebookId) {
      return res.status(400).json({ error: "notebookId is required" });
    }
    const page = await service.createPage(req.body);
    res.status(201).json(page);
  } catch (e) { next(e); }
}

export async function updatePage(req, res, next) {
  try {
    const page = await service.updatePage(req.params.id, req.body);
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (e) { next(e); }
}

export async function deletePage(req, res, next) {
  try {
    const page = await service.deletePage(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json({ message: "Page deleted successfully" });
  } catch (e) { next(e); }
}

export async function getPage(req, res, next) {
  try {
    const page = await service.getPageById(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (e) { next(e); }
}
