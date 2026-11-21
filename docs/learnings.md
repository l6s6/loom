# Technical Learnings

Key topics and concepts learned while building Loom, grouped by area.

## Backend

- **Relational database design:** Modeling schemas from Entity-Relationship diagrams to normalized relational tables.
- **SQLAlchemy 2.0:** Creating models and relationships (1:1, 1:N, N:M, self-referencing links), avoiding N+1 queries with `joinedload` / `selectinload`, and handling concurrent constraint violations (`IntegrityError` → `409 Conflict`) cleanly.
- **API design:** Separating database models from Pydantic request/response schemas, composable query filtering, choosing proper HTTP status codes (`201`, `204` without body, `404`, `409`), and avoiding circular references.
- **Testing:** Isolating a PostgreSQL test database per test function with reusable factories and fixtures in Pytest.

## Frontend

- **Data-fetching architecture:** Separating raw `fetch` calls (`apiClient`), TanStack Query hooks, and presentation components into distinct feature layers.
- **React & TypeScript:** Enforcing `strict` TypeScript and ESLint (`no-explicit-any`, hook rules), avoiding render-time side effects, and designing debounced autosave without breaking typing UX.
- **TanStack Query:** Keeping notes, tags, types, links, and the 3D graph synchronized via targeted cache invalidation instead of manual global state.
- **UI:** Building a clean, responsive interface with Tailwind CSS, shadcn/ui, Tiptap (Markdown), and `react-force-graph-3d`.

## General / Workflow

- **Processes:** Requirements engineering, ER modeling, iterative implementation, and testing.
- **GitHub & CI:** Branching, atomic commits, and automated GitHub Actions pipelines (Pytest on PostgreSQL + ESLint + TypeScript/Vite build).
- **Software Engineering:** Avoiding duplication, keeping modules domain-driven (DDD-inspired folder structure), and handling edge cases explicitly.
- **AI-assisted workflow:** Using AI intentionally for code review, debugging, trade-off analysis, and planning rather than unreviewed code generation.
