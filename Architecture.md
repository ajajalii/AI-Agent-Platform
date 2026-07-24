# Agent Workspace Architecture

Agent Workspace is a full-stack AI agent platform. Users authenticate, create custom agents, upload knowledge files, and chat with agents that use both their saved configuration and uploaded document context.

## High-Level Architecture

```text
Browser
  |
  | React + Vite frontend
  | Axios API client with JWT auth
  v
Express API
  |
  | Controllers -> Services -> Prisma
  v
PostgreSQL

Express API
  |
  | OpenRouter chat completion request
  v
OpenRouter / LLM provider

Express API
  |
  | Multer upload + text extraction
  v
Local upload storage
```

## Main Components

### Frontend

The frontend lives in `frontend/` and is built with React, Vite, TypeScript, Tailwind CSS, Radix UI, TanStack Query, Axios, and React Router.

Key areas:

| Path | Responsibility |
| --- | --- |
| `frontend/src/App.tsx` | Main route tree |
| `frontend/src/api/` | API client modules for auth, agents, chats, and files |
| `frontend/src/contexts/AuthContext.tsx` | Authentication state and current user handling |
| `frontend/src/pages/` | Application pages such as dashboard, chat, login, registration, and agent settings |
| `frontend/src/components/` | Shared UI, layout, markdown, and route guard components |
| `frontend/src/lib/constants.ts` | Agent templates and model options |

The frontend sends requests to `VITE_API_URL`, falling back to `/api`. During local development, Vite proxies `/api` to `http://localhost:5000`.

### Backend

The backend lives in `backend/` and is built with Express, TypeScript, Prisma, PostgreSQL, JWT authentication, Multer uploads, and OpenRouter integration.

Key areas:

| Path | Responsibility |
| --- | --- |
| `backend/src/index.ts` | Express app setup, middleware, route mounting, health check |
| `backend/src/routes/` | HTTP route definitions |
| `backend/src/controllers/` | Request and response handling |
| `backend/src/services/` | Business logic for auth, agents, chats, files, dashboard, and LLM calls |
| `backend/src/middleware/` | Authentication, validation, error handling, and upload middleware |
| `backend/src/config/` | Environment, database, and model configuration |
| `backend/src/utils/` | Shared validation, response, and parameter helpers |
| `backend/prisma/schema.prisma` | Database schema |

The backend exposes API routes under `/api`.

## Request Flow

### Authentication

1. A user registers or logs in from the frontend.
2. The backend validates the request body.
3. Passwords are hashed with `bcryptjs`.
4. A JWT is issued after successful authentication.
5. The frontend stores the token in `localStorage`.
6. Axios attaches `Authorization: Bearer <token>` to authenticated requests.
7. Protected backend routes use the authentication middleware before reaching controllers.

### Agent Creation

1. The frontend submits agent name, description, avatar, model, temperature, and system prompt.
2. The backend validates the payload.
3. The agent service creates a user-owned `Agent` record through Prisma.
4. The frontend refreshes agent and dashboard data.

### Chat Completion

1. The user sends a message inside an agent chat.
2. The backend verifies the authenticated user owns the target agent and chat.
3. The chat service stores the user message.
4. The service builds the prompt from the agent system prompt, agent identity rules, recent chat history, and uploaded file context.
5. The OpenRouter service sends the completion request.
6. The assistant response is saved as a `Message`.
7. The frontend renders the response with markdown and code highlighting.

### File Upload

1. The frontend uploads a PDF, DOCX, or TXT file using multipart field `file`.
2. Multer stores the file in `UPLOAD_DIR`.
3. The file service extracts readable text:
   - PDF files use `pdf-parse`.
   - DOCX files use `mammoth`.
   - TXT files are read directly.
4. File metadata and extracted text are stored in PostgreSQL.
5. Uploaded document context can be included in future chat prompts.

## API Surface

Public routes:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |

Protected routes:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/auth/me` | Get current user profile |
| `PATCH` | `/api/auth/me` | Update current user profile |
| `GET` | `/api/dashboard` | Get workspace stats and recent activity |
| `GET` | `/api/agents` | List agents |
| `POST` | `/api/agents` | Create an agent |
| `GET` | `/api/agents/:id` | Get one agent |
| `PATCH` | `/api/agents/:id` | Update an agent |
| `DELETE` | `/api/agents/:id` | Delete an agent |
| `GET` | `/api/agents/:agentId/chats` | List chats for an agent |
| `POST` | `/api/agents/:agentId/chats` | Create a chat |
| `GET` | `/api/agents/:agentId/chats/:chatId` | Get chat messages |
| `DELETE` | `/api/agents/:agentId/chats/:chatId` | Delete a chat |
| `POST` | `/api/agents/:agentId/chats/:chatId/messages` | Send a message |
| `GET` | `/api/agents/:agentId/files` | List uploaded files |
| `POST` | `/api/agents/:agentId/files` | Upload a file |
| `DELETE` | `/api/agents/:agentId/files/:fileId` | Delete a file |

## Database Model

The Prisma schema defines these main models:

| Model | Purpose |
| --- | --- |
| `User` | Registered account with email, name, password hash, and optional avatar |
| `Agent` | User-owned AI agent with prompt, model, avatar, and temperature |
| `Chat` | Conversation thread for one agent |
| `Message` | User or assistant message within a chat |
| `UploadedFile` | Uploaded file metadata, disk path, and extracted text |

Important relationships:

- A user owns many agents.
- An agent owns many chats and uploaded files.
- A chat owns many messages.
- Deleting a user cascades through their agents.
- Deleting an agent cascades through chats, messages, and uploaded file records.

## Data and Context Boundaries

- JWT authentication identifies the current user.
- Agent, chat, and file access should remain scoped to resources owned by the authenticated user.
- Uploaded files are stored on disk, while metadata and extracted text are stored in PostgreSQL.
- Extracted text is used as additional context for AI responses.
- Local upload storage must be replaced or backed by persistent storage if deployed to an environment with an ephemeral filesystem.

## External Dependencies

| Dependency | Role |
| --- | --- |
| PostgreSQL | Persistent relational database |
| Prisma | ORM and schema management |
| OpenRouter | LLM completion provider |
| Local filesystem | Uploaded file storage |

## Deployment Notes

The frontend and backend can be deployed separately. In production:

- Set backend environment variables on the API host.
- Run Prisma generation and migrations before starting the backend.
- Set `FRONTEND_URL` on the backend to the deployed frontend origin.
- Set `VITE_API_URL` on the frontend to the deployed backend API URL.
- Use durable storage for uploads if uploaded files must survive restarts or redeploys.