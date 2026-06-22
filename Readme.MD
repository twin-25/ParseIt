# Parsit

Paste text, drop a URL, or upload a file — then chat with it directly. Parsit is a session-based RAG application that lets you ingest content from multiple sources and ask questions about it in natural language, with streaming responses powered by Claude.

## What it does

- **Ingest from anywhere** — paste raw text, provide a URL, or upload files (PDF, TXT, DOCX)
- **Chat with your content** — ask questions and get answers grounded strictly in what you've ingested, with streaming responses
- **Multi-source sessions** — add multiple documents, URLs, and text snippets to the same session and query across all of them together
- **Document tracking** — see exactly what's been ingested into your current session

Parsit is session-based by design for v1: no accounts, no login. Start a session, ingest content, chat, and end the session when you're done.

## How it works

1. **Create a session** — generates a unique session ID
2. **Ingest content** — text, URLs, and files are parsed, chunked, embedded, and stored as vectors in a dedicated ChromaDB collection for that session
3. **Chat** — your question is embedded and matched against the most relevant chunks in your session's collection; those chunks plus your question are sent to Claude, which streams back an answer grounded in your content
4. **End session** — clears the session and deletes its vector collection

## Tech stack

**Backend**
- FastAPI — REST API and SSE streaming
- LlamaIndex — RAG pipeline orchestration (chunking, embedding, retrieval, chat engine)
- ChromaDB — vector storage
- HuggingFace `sentence-transformers` (`BAAI/bge-small-en-v1.5`) — local embeddings
- Anthropic Claude (Haiku) — response generation

**Frontend**
- React + Vite
- Redux Toolkit Query — API state management and caching
- Tailwind CSS — styling
- `react-markdown` — rendering formatted responses

**Infrastructure**
- Docker Compose — three services: `backend`, `frontend`, `chromadb`

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │ ───▶ │   FastAPI    │ ───▶ │  ChromaDB   │
│  (Vite)     │ ◀─── │   Backend    │ ◀─── │  (vectors)  │
└─────────────┘ SSE  └──────────────┘      └─────────────┘
                            │
                            ▼
                      ┌──────────────┐
                      │ Claude API   │
                      │  (Haiku)     │
                      └──────────────┘
```

Sessions are held in memory on the backend (a session dict mapping `session_id` → `{index, chat_engine, documents}`). Each session gets its own ChromaDB collection, keeping content fully isolated between sessions.

## Getting started

### Prerequisites
- Docker and Docker Compose
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/twin-25/ParseIt.git
   cd ParseIt
   ```

2. Create a `.env` file in the project root
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

3. Build and start all services
   ```bash
   docker compose up --build
   ```

4. Open the app
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ChromaDB: [http://localhost:8001](http://localhost:8001)

### Everyday use after the first build

```bash
docker compose up -d
```

Rebuild only when you change `requirements.txt`, `package.json`, or a Dockerfile:

```bash
docker compose build <service> --no-cache
docker compose up -d
```

## API endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| `POST` | `/sessions` | Create a new session |
| `DELETE` | `/sessions/{session_id}` | Delete a session and its vector data |
| `GET` | `/sessions/{session_id}/documents` | List documents ingested in a session |
| `POST` | `/ingest` | Ingest text, a URL, or files into a session |
| `POST` | `/chat` | Send a message, receive a streamed response (SSE) |

## Known limitations (v1)

- **Sessions are in-memory** — restarting the backend clears all active sessions and their data
- **No persistence across visits** — there's no way to return to a previous session later
- **JavaScript-rendered pages can't be ingested** — the URL reader works on static/server-rendered HTML; pages that render content client-side won't extract usable text
- **No multi-user support** — sessions aren't tied to accounts; anyone with a session ID has full access to it

## Roadmap

- Persistent sessions (Postgres for metadata, durable ChromaDB storage)
- User accounts and multi-tenant session scoping
- Semantic caching layer for repeated/similar queries
- Hybrid retrieval (vector + keyword) and reranking for improved answer quality

## License

MIT