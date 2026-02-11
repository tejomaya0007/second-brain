# 🧠 Second Brain – AI-Powered Knowledge Management Platform  
### Full Stack Engineering Internship Assignment – Hedamo / Altibbe

**Candidate:** Tejomaya  
**GitHub:** https://github.com/tejomaya0007  
**Email:** tejomaya@example.com  

---

## 📌 Executive Summary

Second Brain is a production-grade, cloud-native, AI-ready knowledge management system designed to help individuals and teams capture, organize, and retrieve information efficiently.

This platform combines modern frontend engineering, scalable backend architecture, secure authentication, and future-focused AI integration to deliver a robust digital knowledge companion.

The project demonstrates full lifecycle ownership: system design, development, deployment, debugging, optimization, and documentation.

---

## 🚀 Live Deployment

### Frontend (Vercel)
https://your-frontend-url.vercel.app


### Backend (Railway)
https://your-backend-url.up.railway.app


Both services are continuously deployed from the main branch.

---

## 📸 Product Showcase

All screenshots are located in `/screenshots`.

/screenshots
├── auth-login.png
├── auth-register.png
├── dashboard.png
├── note-editor.png
├── ai-chat.png
├── public-search.png
└── mobile-view.png


### 1. Authentication
![Auth](./screenshots/auth-login.png)

### 2. Dashboard
![Dashboard](./screenshots/dashboard.png)

### 3. Note Editor
![Editor](./screenshots/note-editor.png)

### 4. AI Chat
![AI](./screenshots/ai-chat.png)

### 5. Public Search
![Public](./screenshots/public-search.png)

---

## 🎯 Problem Statement

Modern professionals consume large volumes of information daily. Existing tools fail to provide:

- Structured knowledge retention
- Intelligent retrieval
- Secure access control
- AI-assisted understanding
- Portability across platforms

Second Brain addresses these gaps by combining structured storage with AI reasoning.

---

## 💡 Solution Overview

Second Brain provides:

- Centralized knowledge repository
- Secure user accounts
- Smart search
- AI-powered assistance
- Public/private sharing
- Cloud accessibility

The platform is designed for scalability, extensibility, and long-term maintainability.

---

## 🛠️ Technology Stack

### Frontend Layer
| Technology | Purpose |
|------------|----------|
| React (Vite) | UI framework |
| Tailwind CSS | Styling |
| Axios | API communication |
| Zustand | State management |
| Vercel | Hosting |

### Backend Layer
| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | API framework |
| PostgreSQL | Database |
| Sequelize | ORM |
| JWT | Authentication |
| Railway | Hosting |

### AI Layer (Planned)
| Tool | Purpose |
|------|----------|
| Ollama | Local LLM serving |
| LLaMA / Mistral | Language models |

---

## 📂 Repository Structure

second-brain/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── middleware/
│ │ ├── services/
│ │ └── models/
│ ├── migrations/
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── pages/
│ │ ├── services/
│ │ └── store/
│ ├── public/
│ └── vite.config.js
│
├── docs/
├── screenshots/
└── railway.json


---

## 🏗️ System Architecture

Browser
↓
React Frontend (Vercel)
↓ HTTPS
Express API (Railway)
↓
PostgreSQL Database
↓
AI Layer (Ollama - Planned)


---

## 🔐 Security Architecture

### Authentication
- JWT-based stateless auth
- Token expiration
- Secure cookie storage

### Authorization
- Role-based middleware
- Route protection
- Public/private separation

### Infrastructure Security
- HTTPS enforced
- Environment variables secured
- No secrets in repo
- CORS configured

---

## ⚙️ Environment Configuration

### Backend (.env)

PORT=4000
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=strong_secret
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app


### Frontend

VITE_API_URL=https://your-backend-url/api


---

## 🧪 Local Development Guide

### Prerequisites
- Node.js >= 18
- PostgreSQL
- Git

### Setup

```bash
git clone https://github.com/tejomaya0007/second-brain.git
cd second-brain
Backend
cd backend
npm install
npm run migrate
npm start
Frontend
cd frontend
npm install
npm run dev

```

---

### 🔁 CI/CD Pipeline
GitHub → Push

Auto build on Vercel

Auto deploy on Railway

Environment injection

Health check

Deployment is fully automated.

📡 API Design
Auth
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
Knowledge
POST   /api/knowledge
GET    /api/knowledge
PUT    /api/knowledge/:id
DELETE /api/knowledge/:id
Public
GET /api/public/brain/query
🧩 Error Handling Strategy
Centralized error middleware

Standard HTTP status codes

Structured JSON responses

Production-safe logs

🧪 Testing Strategy (Planned)
Unit tests (Jest)

API tests (Supertest)

E2E (Playwright)

Load testing (k6)

📊 Performance Optimization
DB indexing

Lazy loading

Request batching

Compression

Caching

 Upcoming integration
 
🤖 AI Roadmap (Ollama Integration)
Phase 1
Local LLM deployment

Basic summarization

Phase 2
RAG pipeline

Semantic search

Context memory

Phase 3
Multi-agent reasoning

Personal assistant

Architecture:

User → Query → DB → Retriever → Ollama → Response
📈 Product Roadmap
Short Term
UI polish

Analytics

Dark mode

Medium Term
Mobile app

Team spaces

Collaboration

Long Term
Enterprise version

AI copilots

Plugin ecosystem

📄 Documentation
Located in /docs:

Architecture whitepaper

UX guidelines

Deployment handbook

API reference

