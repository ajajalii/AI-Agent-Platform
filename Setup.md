# Setup Guide

This guide explains how to set up and run the **Agent Workspace** project locally.

The application consists of:

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **AI Provider:** OpenRouter

---

# Table of Contents

1. Prerequisites
2. Clone the Repository
3. Install PostgreSQL
4. Create Database
5. Backend Setup
6. Configure Environment Variables
7. Setup Prisma Database
8. Start Backend Server
9. Frontend Setup
10. Start Frontend
11. Verify Everything Works
12. Available Scripts
13. Troubleshooting

---

# 1. Prerequisites

Before running this project, install the following software.

## Node.js

Download and install Node.js (version 22 or newer).

https://nodejs.org

Verify installation:

```bash
node -v
npm -v
```

Example output:

```
v22.17.0
10.x.x
```

---

## PostgreSQL

Download PostgreSQL

https://www.postgresql.org/download/

During installation remember:

- Username
- Password
- Port (default: 5432)

Verify installation:

```bash
psql --version
```

---

## Git

Download Git

https://git-scm.com/downloads

Verify:

```bash
git --version
```

---

## OpenRouter Account

Create a free account.

https://openrouter.ai

Generate an API key.

You'll need this later in your `.env`.

---

# 2. Clone the Repository

Clone the repository.

```bash
git clone <repository-url>
```

Move into project.

```bash
cd agent-workspace
```

Project structure:

```
agent-workspace
│
├── backend
│
├── frontend
│
└── README.md
```

---

# 3. Create PostgreSQL Database

Open pgAdmin or PostgreSQL terminal.

Create a new database.

Example:

```
agent_workspace
```

No tables need to be created manually.

Prisma will create them automatically.

---

# 4. Backend Setup

Open terminal.

Move into backend.

```bash
cd backend
```

Install all dependencies.

```bash
npm install
```

This installs packages such as

- Express
- Prisma
- JWT
- Multer
- bcrypt
- pdf-parse
- mammoth
- TypeScript

Wait until installation finishes.

---

# 5. Configure Environment Variables

Inside backend create

```
.env
```

You can copy the example.

```bash
cp .env.example .env
```

Open the file.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/agent_workspace?schema=public"

JWT_SECRET="your-secret-key"

JWT_EXPIRES_IN="7d"

OPENROUTER_API_KEY="sk-or-v1-xxxxxxxxxxxxxxxx"

PORT=5000

NODE_ENV=development

FRONTEND_URL="http://localhost:5173"

UPLOAD_DIR="./uploads"

MAX_FILE_SIZE=10485760
```

### Explanation

#### DATABASE_URL

Connection string for PostgreSQL.

Replace:

- username
- password
- database name

Example

```
postgresql://postgres:admin123@localhost:5432/agent_workspace?schema=public
```

---

#### JWT_SECRET

Used to sign authentication tokens.

Use any long random string.

Example

```
my-super-secret-jwt-key-123456789
```

---

#### OPENROUTER_API_KEY

Paste your OpenRouter API key.

Without this AI responses will not work.

---

#### PORT

Backend port.

Default

```
5000
```

---

#### FRONTEND_URL

Frontend URL used for CORS.

```
http://localhost:5173
```

---

#### UPLOAD_DIR

Folder where uploaded files are stored.

Default

```
./uploads
```

---

#### MAX_FILE_SIZE

Maximum upload size.

Default:

```
10485760
```

= 10 MB

---

# 6. Setup Prisma Database

Generate Prisma Client.

```bash
npx prisma generate
```

Expected output:

```
✔ Generated Prisma Client
```

---

Push schema into PostgreSQL.

```bash
npx prisma db push
```

Expected output:

```
Database synced successfully
```

Prisma will automatically create all tables.

Example tables:

- User
- Agent
- Chat
- Message
- UploadedFile

---

(Optional)

Open Prisma Studio.

```bash
npx prisma studio
```

It opens:

```
http://localhost:5555
```

You can inspect all database records.

---

# 7. Start Backend Server

Run

```bash
npm run dev
```

Expected output:

```
Server running on port 5000
Connected to PostgreSQL
```

Backend API

```
http://localhost:5000
```

Health endpoint

```
GET http://localhost:5000/api/health
```

---

# 8. Frontend Setup

Open a second terminal.

Move into frontend.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

---

Create environment file.

```bash
cp .env.example .env
```

Add

```env
VITE_API_URL=http://localhost:5000/api
```

This tells the frontend where the backend API is running.

---

# 9. Start Frontend

Run

```bash
npm run dev
```

Expected output

```
Local:
http://localhost:5173
```

Open in browser.

```
http://localhost:5173
```

---

# 10. Verify Everything Works

Open

```
http://localhost:5173
```

You should now be able to

- Register a new account
- Login
- Create agents
- Upload PDF, DOCX, or TXT files
- Chat with AI
- View conversation history
- Update profile
- Manage agents

---

# 11. Running the Project Again

Whenever you reopen the project.

### Terminal 1

```bash
cd backend
npm run dev
```

### Terminal 2

```bash
cd frontend
npm run dev
```

Make sure PostgreSQL is running.

That's all.

---

# Available Scripts

## Backend

Start development server

```bash
npm run dev
```

Build project

```bash
npm run build
```

Run production build

```bash
npm start
```

Generate Prisma Client

```bash
npm run db:generate
```

Push database schema

```bash
npm run db:push
```

Create migration

```bash
npm run db:migrate
```

Open Prisma Studio

```bash
npm run db:studio
```

---

## Frontend

Development

```bash
npm run dev
```

Production build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# Troubleshooting

## Backend won't start

Check:

- PostgreSQL is running
- DATABASE_URL is correct
- PORT is available
- npm install completed successfully

---

## Prisma Error

Run

```bash
npx prisma generate
```

Then

```bash
npx prisma db push
```

---

## Cannot Connect to Database

Verify:

- PostgreSQL service is running
- Username is correct
- Password is correct
- Database exists

---

## AI Doesn't Respond

Check:

- OPENROUTER_API_KEY is valid
- Internet connection is available
- OpenRouter account has access to the selected model

---

## File Upload Fails

Ensure:

- File is PDF, DOCX, or TXT
- File size is less than 10 MB
- uploads directory exists
- Backend has write permission

---

## CORS Error

Verify

```env
FRONTEND_URL=http://localhost:5173
```

and restart the backend.

---

# Local URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

API

```
http://localhost:5000/api
```

Health Check

```
http://localhost:5000/api/health
```

Prisma Studio

```
http://localhost:5555
```

---

# You're Ready!

Your local development environment is now fully configured. Start both the backend and frontend servers, open `http://localhost:5173`, create an account, and begin using Agent Workspace.