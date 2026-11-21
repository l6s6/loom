# Loom Frontend

React + TypeScript (`strict`) + Vite frontend for [Loom](../README.md).

## Scripts

```bash
npm install     # install dependencies
npm run dev     # start Vite dev server (http://localhost:5173)
npm run lint    # run ESLint (0 errors / 0 warnings in CI)
npm run build   # run TypeScript type-check (tsc -b) and Vite production build
```

## Structure

- `src/api/` — shared `fetch` client with FastAPI `detail` error parsing
- `src/features/` — domain modules (`notes`, `links`, `graph`) with `api.ts`, `hooks.ts`, `types.ts`, and components
- `src/pages/` — route-level views (`NotesView`, `EditorView`, `TodoView`, `GraphView`, `TagsView`, `NoteTypesView`)
- `src/components/` — shared layout and shadcn/ui primitives
