# 🧠 Second Brain – AI-Powered Knowledge Management System

Second Brain is a full-stack web application that helps users capture, organize, and manage their ideas, notes, and knowledge in one secure place with AI-assisted features.

---

## 🚀 Live Demo

**Frontend:**  
https://second-brain-r8dyxqzu8-tejomayas-projects.vercel.app

**Backend API:**  
https://second-brain-production-979e.up.railway.app

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Axios
- Tailwind CSS
- Zustand
- Deployed on Vercel

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Deployed on Railway

### Database
- PostgreSQL (Railway)

---

## ✨ Features

- 🔐 User Authentication (Register / Login / Logout)
- 📝 Create, Read, Update, Delete Notes
- 🏷️ Tag Management
- 🔍 Search Functionality
- 🤖 AI-powered Summarization & Chat
- 📄 Page Management
- 🔒 Secure API using JWT
- ☁️ Cloud Deployed (Vercel + Railway)

---

## 📂 Project Structure

```text
second-brain/
├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
└── railway.json
⚙️ Environment Variables
Backend (.env)
PORT=4000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
Frontend (Vercel)
VITE_API_URL=https://your-backend-url/api
🧪 Run Locally
Clone Repository
git clone https://github.com/tejomaya0007/second-brain.git
cd second-brain
Backend Setup
cd backend
npm install
npm start
Frontend Setup
cd frontend
npm install
npm run dev
Open in browser:

http://localhost:5173
📈 Deployment
Frontend: Vercel

Backend: Railway

Database: PostgreSQL (Railway)

🔐 Authentication Flow
JWT-based authentication

Protected API routes

Session validation via /api/auth/me

👨‍💻 Author
Tejomaya
GitHub: https://github.com/tejomaya0007

📜 License
MIT License


🔥  
If you want a **short README**, **resume version**, or **portfolio-style README**, say the word.

You said:
like tell fully all thing in in one code it api error come tell them to replace and future implacation tell we add ollama model for it

ChatGPT said:
Bro 😎🔥 here is a FULL ADVANCED README.md in one single code block, including:

✅ Setup
✅ Errors & Fixes
✅ API issues
✅ Deployment issues
✅ Troubleshooting
✅ Future (Ollama AI)
✅ Production notes

Just copy this into README.md.

# 🧠 Second Brain – AI-Powered Knowledge Management System

Second Brain is a full-stack cloud-deployed web application for managing personal knowledge, notes, and ideas with secure authentication and AI-assisted features.

---

## 🚀 Live Project

### Frontend (Vercel)
https://second-brain-r8dyxqzu8-tejomayas-projects.vercel.app

### Backend (Railway)
https://second-brain-production-979e.up.railway.app

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Axios
- Tailwind CSS
- Zustand
- Vercel Deployment

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Railway Deployment

### Database
- PostgreSQL (Railway Cloud DB)

---

## ✨ Features

- User Authentication (Register / Login / Logout)
- JWT-based Session Management
- Knowledge & Notes CRUD
- Page Management
- Tag Generation
- AI Chat & Summarization
- Secure API Routes
- Cloud Hosting

---

## 📂 Project Structure

```text
second-brain/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── vite.config.js
│
└── railway.json
⚙️ Environment Variables
Backend (.env)
PORT=4000
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=supersecretkey
NODE_ENV=production
Frontend (Vercel Environment)
VITE_API_URL=https://second-brain-production-979e.up.railway.app/api
⚠️ Important: After changing env variables, always redeploy.

🧪 Run Locally
Clone
git clone https://github.com/tejomaya0007/second-brain.git
cd second-brain
Backend
cd backend
npm install
npm start
Frontend
cd frontend
npm install
npm run dev
Open:

http://localhost:5173
🌐 Deployment Setup
Backend (Railway)
Root directory: /backend

Build: npm install

Start: npm start

Postgres added via Railway plugin

DATABASE_URL auto-injected

Frontend (Vercel)
Root: /frontend

Build: npm run build

Output: dist/

Set VITE_API_URL

🔐 Authentication Flow
User registers → /api/auth/register

User logs in → /api/auth/login

JWT issued

Token stored in browser

Protected routes validate token

/api/auth/me checks session

🚨 Common Errors & Fixes
❌ 404 Route Not Found
Reason:
Wrong API base URL

Fix:
Set correct URL in Vercel:

VITE_API_URL=https://your-backend-url/api
❌ 401 Unauthorized / No Token
Reason:
User not logged in or token missing

Fix:
Login first and verify token storage

❌ 409 Conflict (Email Exists)
Reason:
User already registered

Fix:
Use new email or login

❌ CORS Error
Reason:
Frontend domain not allowed

Fix (Backend):

app.use(cors({
  origin: ['https://*.vercel.app'],
  credentials: true
}));
❌ Backend Not Connecting
Reason:
Wrong DATABASE_URL

Fix:
Check Railway variables

❌ Frontend Still Calls localhost
Reason:
Old build cached

Fix:
Redeploy on Vercel

🔧 API Configuration
Axios Client:

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});
Make sure VITE_API_URL is correct.

🧩 Troubleshooting Checklist
Before reporting bugs, verify:

✅ Backend running

✅ DB connected

✅ Env variables set

✅ Redeployed

✅ No localhost references

✅ Network tab shows 200/201

📈 Future Improvements
Planned upgrades:

🤖 AI Integration (Ollama)
We plan to integrate Ollama local LLM models for:

Offline AI chat

Knowledge summarization

Smart tagging

Personal AI assistant

Example future flow:

User → Backend → Ollama API → AI Response
Planned Models
LLaMA

Mistral

Phi

Gemma

🔮 Other Roadmap
Refresh Tokens

Email Verification

Password Reset

Role-Based Access

Mobile App

Analytics Dashboard

Encryption-at-Rest

Rate Limiting

📊 Production Notes
Uses HTTPS

Secure cookies

Encrypted DB

JWT validation

ORM migrations

Centralized logging

👨‍💻 Author
Tejomaya
GitHub: https://github.com/tejomaya0007

