# Loom

Personal note-taking and knowledge-management app. Capture short notes (thoughts, questions, quotes, ideas), organize them by type/tag/status, and link related notes to each other.

This is also a learning project: a full-stack app built to practice backend architecture, frontend development, and database design, without using AI to write the code. See [`docs/learnings.md`](docs/learnings.md) for what came out of that.

## Live Demo

You can try out a live version of the application here:  
👉 **[Link to Live Demo](https://loom-loom19.vercel.app/)**

*Note: The backend is hosted on a free Render instance, which spins down after a period of inactivity. If you are the first visitor in a while, it may take **up to 60 seconds** for the initial page load while the server wakes up.*


## Status

In development. Implemented so far:

- Backend: CRUD for notes, types, tags, and links between notes; filtering and search; test suite with pytest
- Frontend: note editor with autosave, type/tag/status editing, note linking with backlink navigation

Not yet built: thread view (traversal over linked notes), graph visualization, AI features, export, mobile app. Full plan in [Roadmap](#roadmap).

## Concept

Use cases and requirements are documented in [`docs/concept.md`](docs/concept.md). Short version: a place to capture fleeting notes with low friction, organize and link them over time, and occasionally revisit open questions or old notes.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, SQLAlchemy, Alembic |
| Database | SQLite (local), PostgreSQL planned for deployment |
| Testing | Pytest |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, shadcn/ui |
| Mobile | Flutter (planned) |
| AI | Cloud LLM API, planned for later phases |

## Roadmap

- [x] Phase 0 — Project setup
- [x] Phase 1 — Note creation and listing
- [x] Phase 2 — Types, tags, status, filtering, search
- [x] Phase 4 — Manual linking between notes (thread view still open)
- [ ] Phase 3 — Revisiting open questions
- [ ] Phase 5 — Graph visualization
- [ ] Phase 6 — Tag-based linking
- [ ] Phase 7 — AI similarity search and auto-tagging
- [ ] Phase 8 — Summarization and chat over notes
- [ ] Phase 9 — Export (JSON, Obsidian-compatible Markdown)
- [ ] Phase 10 — Deployment
- [ ] Phase 11 — Flutter app

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