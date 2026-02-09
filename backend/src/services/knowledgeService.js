import { Notebook, Page } from "../models/KnowledgeEntry.js";
import { Op } from 'sequelize';
import { chatWithKnowledge, summarize as aiSummarize } from "./aiService.js";

// Notebook operations
export async function createNotebook({ title, userId }) {
  return Notebook.create({ title, userId });
}

export async function getAllNotebooks(userId) {
  return Notebook.findAll({
    where: { userId },
    include: [{ model: Page, as: 'pages' }],
    order: [['createdAt', 'DESC']],
  });
}

export async function getNotebookById(id, userId) {
  return Notebook.findOne({
    where: { id, userId },
    include: [{ model: Page, as: 'pages', order: [['createdAt', 'ASC']] }],
  });
}

// Page operations
export async function createPage(data) {
  let summary = '';
  const aiTags = [];

  if (data.content && data.content.trim()) {
    try {
      // Generate a concise summary for dashboard preview
      summary = await aiSummarize(data.content);
    } catch (e) {
      console.error("Failed to generate summary on createPage:", e.message);
      summary = '';
    }
  }

  return Page.create({ ...data, summary, aiTags });
}

export async function updatePage(id, data) {
  const page = await Page.findByPk(id);
  if (!page) return null;

  const contentChanged = data.content && data.content !== page.content;
  let updateData = { ...data };

  if (contentChanged) {
    try {
      // Refresh the stored summary whenever the main note content changes
      updateData.summary = await aiSummarize(data.content);
    } catch (e) {
      console.error("Failed to generate summary on updatePage:", e.message);
      updateData.summary = page.summary || '';
    }

    // Keep existing AI tags for now; tag generation is handled separately
    updateData.aiTags = page.aiTags || [];
  }

  await page.update(updateData);
  return page;
}

export async function deletePage(id) {
  const page = await Page.findByPk(id);
  if (!page) return null;
  await page.destroy();
  return page;
}

export async function getPageById(id) {
  return Page.findByPk(id);
}

// Legacy compatibility for dashboard
export async function getAllEntries({ search, tag, sort, userId }) {
  const notebooks = await getAllNotebooks(userId);
  return notebooks;
}

export async function getEntryById(id, userId) {
  return getNotebookById(id, userId);
}

export async function updateEntry(id, data) {
  // For legacy: update notebook title
  const notebook = await Notebook.findByPk(id);
  if (!notebook) return null;
  await notebook.update({ title: data.title });
  return notebook;
}

export async function deleteEntry(id) {
  const notebook = await Notebook.findByPk(id);
  if (!notebook) return null;
  await Page.destroy({ where: { notebookId: id } });
  await notebook.destroy();
  return notebook;
}

export async function searchEntries(q) {
  if (!q) return [];
  return Notebook.findAll({
    where: {
      title: { [Op.iLike]: `%${q}%` },
    },
    include: [{ model: Page, as: 'pages' }],
    order: [['createdAt', 'DESC']],
  });
}

export async function askQuestion(question, userId) {
  // Only use pages that belong to the current user via their notebooks
  const pages = await Page.findAll({
    include: [
      {
        model: Notebook,
        as: 'notebook',
        where: { userId },
        attributes: [],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });
  if (!pages.length) return "No pages found for this user. Create some pages first!";
  return chatWithKnowledge(question, pages);
}
