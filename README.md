# Agent Workspace

Agent Workspace is a full-stack AI agent platform where users can create custom agents, chat with them, upload knowledge files, and use those uploaded documents as persistent context across the workspace.

The app is built around configurable agents: each agent has its own avatar, name, description, system prompt, model, temperature, chats, and uploaded knowledge files. It uses OpenRouter for model completions and PostgreSQL for persistent user, agent, chat, message, and file data.

## Highlights

- JWT authentication with registration, login, profile loading, and profile updates
- User-owned workspaces with protected API routes
- Dashboard with workspace stats, recent agents, and recent conversations
- Agent creation and settings pages with custom prompts, avatars, model selection, and temperature control
- Built-in templates including Research Assistant, Resume Reviewer, Customer Support Agent, Data Analyst, and Creative Partner
- Chat UI with markdown rendering, code highlighting, copy actions, conversation history, and new conversation creation
- Selected agent/model display on the chat input area
- Agent identity guard so agents answer as their configured agent name instead of the underlying model provider
- PDF, DOCX, and TXT uploads with backend text extraction
- Extracted document text is stored in the database and included as context for every agent owned by the same user
- Resume Reviewer receives an extra instruction to prioritize resume/CV details from uploaded files
- PostgreSQL persistence through Prisma ORM
- OpenRouter-powered model routing

## Visuals

![Landing Page](frontend\src\assets\Landings.png)
![Dashboard](frontend\src\assets\Dashboard.png)

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS 4, Radix UI, TanStack Query, Framer Motion, React Hook Form, Axios |
| Backend | Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL, JWT, bcryptjs, Multer |
| AI | OpenRouter chat completions |
| File Parsing | `pdf-parse` for PDFs, `mammoth` for DOCX, native filesystem reads for TXT |
| Styling/UI | Tailwind CSS, lucide-react icons, custom UI components |

## Repository Structure

```text
.
|-- backend/
|   |-- prisma/
|   |   `-- schema.prisma
|   |-- src/
|   |   |-- config/
|   |   |   |-- database.ts
|   |   |   |-- env.ts
|   |   |   `-- models.ts
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- services/
|   |   |   |-- agent.service.ts
|   |   |   |-- chat.service.ts
|   |   |   |-- file.service.ts
|   |   |   `-- openrouter.service.ts
|   |   |-- types/
|   |   |-- utils/
|   |   `-- index.ts
|   |-- uploads/
|   |-- package.json
|   `-- tsconfig.json
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- lib/
|   |   |-- pages/
|   |   |-- types/
|   |   |-- App.tsx
|   |   `-- main.tsx
|   |-- package.json
|   `-- vite.config.ts
`-- README.md
```

## How It Works

1. A user registers or logs in.
2. The frontend stores the JWT and sends authenticated requests to the backend.
3. The user creates agents with a custom system prompt, model, avatar, and temperature.
4. The user can upload PDF, DOCX, or TXT files to an agent.
5. The backend stores the uploaded file and extracts readable text.
6. Extracted text is saved on the `uploaded_files.extractedText` column.
7. When the user chats with any of their agents, the backend adds the user's uploaded document context to the system prompt.
8. OpenRouter receives the final prompt and chat history, then returns the assistant response.

This means uploaded documents are remembered beyond a single chat. A resume uploaded through one agent can still be used by Resume Reviewer or any other agent owned by the same user.

## Prerequisites

- Node.js 22 recommended
- npm
- PostgreSQL
- OpenRouter API key

The installed `pdf-parse` version requires modern Node versions. The project has been tested in this workspace with Node `v22.17.0`.

## Environment Variables

### Backend

Create `backend/.env` from `backend/.env.example`.

```env
DATABASE_URL="postgresql://user:password@localhost:5432/agent_workspace?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
OPENROUTER_API_KEY="your-openrouter-api-key"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |
| `JWT_SECRET` | Yes | Secret for signing JWT access tokens, minimum 16 characters |
| `JWT_EXPIRES_IN` | No | Token lifetime, defaults to `7d` |
| `OPENROUTER_API_KEY` | Yes | API key for OpenRouter completions |
| `PORT` | No | Backend server port, defaults to `5000` |
| `NODE_ENV` | No | `development`, `production`, or `test` |
| `FRONTEND_URL` | No | Allowed frontend origin for CORS and OpenRouter referer headers |
| `UPLOAD_DIR` | No | Directory where uploaded files are stored |
| `MAX_FILE_SIZE` | No | Maximum upload size in bytes, defaults to 10 MB |

### Frontend

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_URL=http://localhost:5000/api
```

During local development, Vite also proxies `/api` to `http://localhost:5000`.

## Local Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Backend Environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL URL, JWT secret, and OpenRouter API key.

### 3. Prepare the Database

```bash
npx prisma generate
npx prisma db push
```

`db push` syncs the Prisma schema to the configured PostgreSQL database.

### 4. Start the Backend

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

### 5. Install Frontend Dependencies

Open a second terminal:

```bash
cd frontend
npm install
```

### 6. Configure Frontend Environment

```bash
cp .env.example .env
```

For local development, keep:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start the Frontend

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Available Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the backend in watch mode with `tsx` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled backend from `dist/index.js` |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:migrate` | Create and apply a Prisma development migration |
| `npm run db:studio` | Open Prisma Studio |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Run TypeScript checks and build production assets |
| `npm run preview` | Preview the production build locally |

## API Overview

All protected routes require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Get the current authenticated profile |
| `PATCH` | `/api/auth/me` | Update profile fields |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/dashboard` | Get workspace stats, recent agents, and recent chats |

### Agents

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/agents` | List the current user's agents |
| `POST` | `/api/agents` | Create an agent |
| `GET` | `/api/agents/:id` | Get one agent with recent chats and files |
| `PATCH` | `/api/agents/:id` | Update an agent |
| `DELETE` | `/api/agents/:id` | Delete an agent and related data |

### Chats

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/agents/:agentId/chats` | List chats for an agent |
| `POST` | `/api/agents/:agentId/chats` | Create a chat |
| `GET` | `/api/agents/:agentId/chats/:chatId` | Get a chat and its messages |
| `DELETE` | `/api/agents/:agentId/chats/:chatId` | Delete a chat |
| `POST` | `/api/agents/:agentId/chats/:chatId/messages` | Send a user message and receive an AI response |

### Files

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/agents/:agentId/files` | List files uploaded to an agent |
| `POST` | `/api/agents/:agentId/files` | Upload a PDF, DOCX, or TXT file using multipart field `file` |
| `DELETE` | `/api/agents/:agentId/files/:fileId` | Delete an uploaded file |

## Document Upload and Context

The upload pipeline lives in `backend/src/services/file.service.ts`.

Supported file types:

- PDF: `application/pdf`
- DOCX: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- TXT: `text/plain`

Extraction behavior:

- PDF text is extracted with `pdf-parse`.
- DOCX text is extracted with `mammoth`.
- TXT text is read directly from disk.
- Whitespace is normalized before saving.
- Empty or unreadable files are rejected.
- Uploaded files are stored on disk in `UPLOAD_DIR`.
- Metadata and extracted text are stored in PostgreSQL.

Chat context behavior:

- `backend/src/services/chat.service.ts` reads uploaded file text for all agents owned by the current user.
- The newest files are used first.
- Context is capped to keep prompts bounded.
- Resume Reviewer is explicitly instructed to prioritize resume/CV details when relevant.

Existing uploads created before extraction was added may have empty extracted text unless they were backfilled or re-uploaded.

## Agent Templates

Templates are defined in `frontend/src/lib/constants.ts`.

Current templates:

- Research Assistant
- Resume Reviewer
- Customer Support Agent
- Data Analyst
- Creative Partner

Templates fill the agent name, description, avatar, and system prompt. Users can edit all fields before saving.

## Model Configuration

The frontend model list is defined in `frontend/src/lib/constants.ts`.

The backend default model is defined in `backend/src/config/models.ts`.

Current frontend model options include:

- Gemini 2.5 Flash Lite
- Gemini 2.5 Flash
- GPT-4o Mini
- GPT-5 Nano
- Gemma 4 31B Free

If an existing agent has a saved model that is not in the current frontend list, the settings page still displays that saved model instead of rendering a blank select value.

## Database Models

The Prisma schema includes:

- `User`
- `Agent`
- `Chat`
- `Message`
- `UploadedFile`

Important relationships:

- A user owns many agents.
- An agent owns many chats and uploaded files.
- A chat owns many messages.
- Deleting a user cascades through agents.
- Deleting an agent cascades through chats, messages, and uploaded file records.

`UploadedFile.extractedText` stores the parsed text used as AI context.

## Build Verification

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

The frontend build may warn about large chunks after minification. That warning does not block the build.

## Deployment Notes

### Backend

Recommended production steps:

```bash
cd backend
npm install
npx prisma generate
npm run build
npm start
```

Set all backend environment variables in the hosting provider. Make sure `DATABASE_URL`, `JWT_SECRET`, `OPENROUTER_API_KEY`, and `FRONTEND_URL` are correct.

For persistent file uploads, the backend host needs durable storage for `UPLOAD_DIR`. If the deployment platform has an ephemeral filesystem, uploaded files may disappear after redeploys or restarts. In that case, move file storage to a persistent disk or object storage service.

### Frontend

Recommended production steps:

```bash
cd frontend
npm install
npm run build
```

Set `VITE_API_URL` to the deployed backend API URL, for example:

```env
VITE_API_URL=https://your-backend.example.com/api
```

## Common Troubleshooting

### The backend cannot start

Check that:

- PostgreSQL is running.
- `DATABASE_URL` is valid.
- `JWT_SECRET` is at least 16 characters.
- `OPENROUTER_API_KEY` is set.
- The port in `PORT` is available.

### File upload is rejected

Check that:

- The file is PDF, DOCX, or TXT.
- The file is under `MAX_FILE_SIZE`.
- The file contains extractable text.
- The backend process can write to `UPLOAD_DIR`.

### The agent does not use uploaded context

Check that:

- The file upload succeeded.
- The file has readable extracted text.
- The question is relevant to the uploaded document.
- The total context is within the prompt cap.

### The model select appears blank

The settings page includes a fallback display for saved model IDs outside the current list. If it still appears blank, confirm the agent's `model` field is not empty in the database.

## License

ISC
