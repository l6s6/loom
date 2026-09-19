# Loom

*A personal thought-graph and idea workshop — capture fleeting thoughts, questions, and quotes, and watch how they weave together over time.*

## About

Loom is a personal tool for capturing thoughts the moment they happen — a fleeting idea, an open question, a quote worth remembering — and later revisiting, connecting, and developing them further. Notes aren't just stored; they're linked (manually, by shared tags, or by AI-detected similarity) and visualized as an evolving graph, so patterns and recurring themes become visible over time.

Beyond its personal use, this project is also a long-term learning project in full-stack development — backend architecture, frontend, graph visualization, and practical AI integration — built without relying on AI to write the actual code.

## Status

🚧 **Early development.** Backend has full CRUD for notes (types, tags, status, filtering, search) and a test suite. Frontend has a working note editor (title/content autosave, status/type/tag editing with autocomplete) and a sidebar with note list, creation, and deletion, all kept in sync via shared state. See [Roadmap](#roadmap) below for the full plan.

## Core Features (planned)

- **Frictionless capture** — jot down a thought, question, quote, or idea in seconds
- **Question status** — mark questions as open/answered, revisit open ones during quiet moments
- **Thought threads** — chains of related notes that build on each other over time
- **Linking with origin tracking** — manual links, tag-based links, and AI-suggested links, visually distinguishable
- **Graph visualization** — notes as nodes, connections as edges, clusters and themes made visible
- **AI-assisted reflection** — cluster summarization and a chat interface over your own notes (RAG), using a cloud LLM API
- **Obsidian-compatible export** — Markdown with frontmatter and wikilinks, so your data is never locked in

Full use cases and requirements are documented in [`docs/concept.md`](docs/concept.md).

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, SQLAlchemy, Alembic |
| Database | SQLite (local) → PostgreSQL (later) |
| Testing | Pytest (backend) |
| Frontend (web) | React, TypeScript, Vite, Tailwind CSS, React Router, shadcn/ui |
| Frontend (mobile) | Flutter *(later phase)* |
| AI | Cloud LLM API (e.g. Claude) for embeddings, summarization, and RAG chat |
| Deployment | Docker, self-hosted, accessed privately via Tailscale |

## Roadmap

- [x] Phase 0 — Project setup (backend skeleton, DB connection, frontend skeleton)
- [x] Phase 1 — MVP quick-capture (create & list notes)
- [x] Phase 2 — Organization (types, tags, status, filtering, search)
- [ ] Phase 3 — "Quiet minute" reflection flow
- [ ] Phase 4 — Manual linking, backlinks, thought threads
- [ ] Phase 5 — Graph visualization
- [ ] Phase 6 — Automatic tag-based linking
- [ ] Phase 7 — AI similarity search & auto-tagging
- [ ] Phase 8 — Cluster summarization & RAG chat
- [ ] Phase 9 — Export/backup (JSON + Obsidian-compatible Markdown)
- [ ] Phase 10 — Deployment (Docker, self-hosted, PWA)
- [ ] Phase 11 — Flutter mobile app

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Visit `http://127.0.0.1:8000/docs` for the interactive API docs.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. Requires the backend to be running (see above) for data to load — CORS is configured to allow requests from the Vite dev server.

## Project Structure

```
loom/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── routers/
│   ├── alembic/
│   ├── tests/
│   │   ├── conftest.py
│   │   └── test_notes.py
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── api/
│       ├── hooks/
│       ├── context/
│       ├── components/
│       │   ├── ui/          # shadcn/ui components
│       │   └── editor/      # note editor building blocks (title, status, type, tags)
│       ├── types/
│       ├── Layout.tsx
│       ├── EditorView.tsx
│       └── App.tsx
└── docs/
    ├── concept.md
    └── architektur-notizen.md
```

## Why "Loom"

A loom weaves separate threads into a single fabric. That's the idea here: individual, scattered thoughts — captured as they occur — gradually woven together into a visible, connected picture of how you think.
