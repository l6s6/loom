# Loom

Personal note-taking and knowledge-management app. Capture short notes (thoughts, questions, quotes, ideas), organize them by type, tag, and status, and link related notes to each other. The focus is on open questions: tracking them, resurfacing them, and recording which later note answered them.

This is a learning project: a full-stack app built to practice backend architecture, frontend development, and database design. AI tools were used intentionally for assistance with debugging, boilerplate, brainstorming and reviews —no "vibe coding" allowed. See docs/learnings.md for what came out of that process.
## Live Demo

[Live demo](https://loom-loom19.vercel.app/) (public instance with sample data)

*Note: The backend is hosted on a free Render instance, which spins down after a period of inactivity. If you are the first visitor in a while, the initial page load may take up to 60 seconds while the server wakes up.*

## Status

In development. Implemented so far:

- Backend: CRUD for notes, types, tags, and links between notes; filtering and search; PostgreSQL with Alembic migrations; test suite with pytest
- Frontend: rich-text editor (Tiptap) with autosave, type/tag/status editing, note linking with backlink navigation, server state via TanStack Query
- Demo deployment on Render (API, database) and Vercel (frontend); CI with GitHub Actions

Not yet built: graph visualization, revisiting open questions, AI features (similarity search, answer suggestions for open questions), export, mobile app. Full plan in [Roadmap](#roadmap).

## Concept

Use cases and requirements are documented in [`docs/concept.md`](docs/concept.md). Short version: capture fleeting notes with low friction, organize and link them over time, and keep track of open questions until a later note answers them.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL (SQLite for tests) |
| Testing / CI | Pytest, GitHub Actions |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, shadcn/ui, TanStack Query, Tiptap |
| Hosting (demo) | Render, Vercel |
| Mobile | Flutter (planned) |
| AI | Cloud LLM / embedding API (planned) |

## Roadmap

- [x] Phase 0 — Project setup
- [x] Phase 1 — Note creation and listing
- [x] Phase 2 — Types, tags, status, filtering, search
- [X] Phase 3 — Revisiting open questions
- [x] Phase 4 — Manual linking between notes (backlinks with link type)
- [X] Phase 5 — Graph visualization
- [ ] Phase 6 — Embeddings, similarity search, answer suggestions for open questions
- [ ] Phase 7 — Recurring-thought detection, optional summaries
- [ ] Phase 8 — Export (JSON, Obsidian-compatible Markdown)
- [ ] Phase 9 — Deployment: demo done, private instance open
- [ ] Phase 10 — Flutter app

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn core.main:app --reload
```

API docs at `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`. Requires the backend to be running.

## Documentation

- [`docs/concept.md`](docs/concept.md) — use cases and requirements
- [`docs/learnings.md`](docs/learnings.md) — technical learnings from building this
