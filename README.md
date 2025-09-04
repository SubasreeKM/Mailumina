📧 Mailumina: AI-Powered Communication Assistant
🚀 Overview

Mailumina is an AI-powered communication assistant designed to intelligently manage support emails end-to-end.
It retrieves emails from Gmail, categorizes them by urgency and sentiment, generates AI-powered draft replies, and provides a real-time dashboard for efficient customer support management.

The goal:
✔ Reduce manual workload
✔ Ensure faster, empathetic responses
✔ Extract actionable insights from unstructured emails
✔ Improve customer satisfaction and retention

🏗 System Architecture
Gmail (IMAP) ─▶ Backend (FastAPI) ─▶ Supabase (DB) ─▶ Frontend (React/Next.js)
                         │                               ▲
                         ▼                               │
                     OpenAI API ◀────────────────────────┘

⚡ Features

Email Retrieval & Filtering

Connects to Gmail IMAP to fetch emails

Filters support-related emails (support, help, query, request)

Categorization & Prioritization

Sentiment analysis (Positive / Negative / Neutral)

Priority detection (Urgent / Normal)

AI-Powered Draft Responses

Generates context-aware responses using OpenAI

Retrieval-Augmented Generation (RAG) with knowledge base (kb_docs in Supabase)

Drafts stored in database for review before sending

Information Extraction

Extracts customer details (email, phone) & keywords

Displays metadata alongside raw email

Dashboard (Frontend)

Lists support emails with priority badges

Displays sentiment labels

Real-time updates via Supabase subscriptions

Editable AI-generated draft replies

Analytics: total emails, urgent vs normal, resolved vs pending

📂 Project Structure
respond-zen/
│
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py          # FastAPI entrypoint
│   │   ├── email_fetcher.py # Gmail IMAP fetcher
│   │   ├── supabase_utils.py# Supabase integration
│   │   ├── nlp_utils.py     # Sentiment & extraction
│   │   ├── ai_utils.py      # OpenAI draft generator
│   │   └── smtp_sender.py   # Outgoing mail sender
│   └── requirements.txt
│
├── frontend/                # React/Next.js frontend
│   ├── src/pages/Index.tsx  # Dashboard UI
│   ├── src/integrations/    # Supabase client
│   └── package.json
│
├── supabase/                # Supabase config & SQL
│   ├── schema.sql
│   └── client.ts
│
└── README.md                # Project documentation

🔧 Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/your-username/respond-zen.git
cd respond-zen

2️⃣ Backend Setup (FastAPI)
cd backend
python -m venv venv
venv\Scripts\activate   # (Windows)  
source venv/bin/activate # (Linux/Mac)

pip install -r requirements.txt


Create a .env file in backend/:

# Supabase
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Gmail IMAP
IMAP_HOST=imap.gmail.com
IMAP_USER=your-email@gmail.com
IMAP_PASS=your-app-password

# SMTP (for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# OpenAI
OPENAI_API_KEY=sk-xxxxxx


Run backend:

uvicorn app.main:app --reload --port 8000

3️⃣ Frontend Setup (React/Next.js)
cd frontend
npm install
npm run dev


Frontend runs at: http://localhost:3000
Backend runs at: http://localhost:8000

4️⃣ Supabase Setup

Run this schema in Supabase SQL Editor:

-- Emails table
create table if not exists public.emails (
  id bigserial primary key,
  message_id text unique,
  sender text,
  subject text,
  body text,
  received_at timestamptz,
  extracted jsonb,
  sentiment jsonb,
  priority_score int default 0,
  status text default 'pending',
  draft text
);

-- Knowledge base table
create table if not exists public.kb_docs (
  id bigserial primary key,
  title text,
  content text,
  created_at timestamptz default now()
);

insert into public.kb_docs (title, content) values
('Reset password','To reset password click https://example.com/reset.'),
('Refund policy','Refunds within 15 days if unused. Contact billing@example.com.');

📊 Workflow

Fetch Emails → Gmail IMAP → Backend → Supabase

Analyze → NLP (sentiment, urgency) → Supabase update

Display → Frontend Dashboard (real-time updates)

Draft Reply → OpenAI + Knowledge Base → Supabase

Review & Send → Frontend → Backend SMTP → Customer

Mark Resolved → Status updated in Supabase

📌 Tech Stack

Frontend: React, Next.js, TailwindCSS

Backend: FastAPI (Python), Uvicorn

Database: Supabase (Postgres + Realtime)

AI/NLP: OpenAI GPT, HuggingFace Sentiment

Email: Gmail IMAP + SMTP

📈 Future Enhancements

Multi-user authentication (Supabase Auth)

Advanced analytics & charts

SLA tracking & automated escalation

Multilingual support

Integration with Slack / MS Teams