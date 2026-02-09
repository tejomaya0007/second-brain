
#Second Brain

Nova is a personal “second brain” for researchers, students, and builders.  
Capture notes, links, and files; organize them into notebooks; and use the **Nova** AI assistant to summarize, tag, and chat over your own knowledge base.

---

## Features

- **Auth & Profile**
  - Secure email + password authentication
  - Beautiful login / signup screen
  - Editable profile with display name
  - Topic overview based on your notes

- **Notebooks & Pages**
  - Create notebooks and pages for different topics
  - Rich text note content + manual tags
  - Auto-generated AI summary for each page
  - Archive pages without deleting them

- **AI Assistant (Nova)**
  - Chat with Nova using your own notes as context
  - Smart AI-generated tags (specific, non-generic)
  - Summaries, ideas, and “continue writing” helpers
  - Uses Google Gemini (`gemini-2.5-flash`) under the hood

- **Sources & Attachments**
  - Attach reference files (PDFs, docs, images, etc.)
  - Size limit per file: **5MB**
  - Delete attachments from a page when no longer needed
  - Attachments are used as extra AI context

- **Dashboard**
  - Global search across your pages
  - Filter by main tags (top tags only, not noisy tag clouds)
  - Newest / Oldest sort toggle
  - Edit, delete, and archive actions on each card

- **Chat**
  - Global AI chat powered by your own pages (per-user only)
  - No predefined prompt buttons – just a clean, focused chat
  - Assistant name: **Nova**

---

## Tech Stack

- **Frontend**
  - React
  - React Router
  - Axios
  - Tailwind CSS
  - Framer Motion
  - lucide-react (icons)

- **Backend**
  - Node.js + Express
  - Sequelize ORM
  - SQLite database

- **AI**
  - Google Gemini Generative Language API
  - Model: `gemini-2.5-flash`

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- Google Gemini API key

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd yellow-marsupial
