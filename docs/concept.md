# Concept: Loom – a personal app for thoughts and ideas

This document describes the vision, use cases, and requirements behind [Loom](../README.md) – before the first line of code was written. It is intentionally designed as a living document: decisions that have changed over the course of development are marked as such, and open questions are explicitly labeled as open rather than left unmentioned.

## Contents

- [Vision](#vision)
- [Use Cases](#use-cases)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [Architectural Approach](#architectural-approach-two-clients-one-backend)
- [Roadmap & Time Estimate](#roadmap--time-estimate)
- [Open Issues](#open-issues)

## Vision

A personal tool for effortlessly capturing thoughts, questions, quotes, and ideas—with the ability to reflect on them later at your own pace, connect them, and explore them visually as a network.

At the same time, Loom is a long-term learning project designed to deepen programming skills in full-stack development—deliberately using minimal AI-generated code, but leveraging AI to aid in planning and understanding.
## Use Cases

| # | Scenario | Description |
|---|---|---|
| 1 | **Flash Capture** | A thought, a question, or a quote pops into your head spontaneously and is captured in seconds without interrupting the moment. |
| 2 | **The Quiet Minute** | During a free moment, an open-ended question is posed (randomly or intentionally); you reflect on it and jot down new thoughts on the subject. |
| 3 | **Thought Threads** | A thought evolves over several sessions: Question → first thought → second thought, which refers back to both previous ones. This chain can be traced as a coherent, chronological progression. |
| 4 | **Collecting Project Ideas** | A central note for a project, to which new idea notes repeatedly link. |
| 5 | **Recognizing Patterns** | Recurring themes or questions become visible, even without conscious linking. |
| 6 | **Tracking the Evolution of Opinions** | If your perspective on a topic changes, the old note remains unchanged; a new note references it. This makes changes in opinion visible over time. |
| 7 | **Exploring the Landscape of Thoughts** | Browse freely through the network of your own thoughts, visually identifying clusters and key themes. |
| 8 | **Targeted Search** | Use search and filters (type, tag, time period) to find a specific note. |
| 9 | **Periodic Review** | Upon request, receive a summary of a time period or topic cluster, including open questions and discernible shifts in opinion. |

## Functional Requirements

### Entry
- Create a note with minimal friction
- Note types: Thought, Question, Quote, Idea/Project Idea (freely expandable)
- Quotes as a separate node type with structured source information (person, work/context, date); a separate note can reference a quote and record the user’s own interpretation of it
- Title optional; tiered handling of missing titles:
  1. Manually entered title is used
  2. No title, short content → Content itself serves as the display
  3. No title, long content → Automatically truncated beginning of text (technically, without AI)
  4. Optional “Suggest Title” button (AI-generated), usable during later cleanup
  5. Fallback for unclear content: “Response to: [Title of the original note]”

### Organization & Status
- Questions with “Open”, "Ongoing" or “Closed” status
- Tags can be freely assigned; multiple tags per note
- Filterable by type, tag, status, and time period
- Archive instead of deleting
- Confidentiality flag per note (see [AI & Confidentiality](#ai--confidentiality))

### Reflection / Follow-up
- Mechanism that specifically presents open questions for selection (randomly, oldest first, or filtered by tag)
- Answers/thoughts regarding a question are linked to it, not stored as separate notes
- “Time travel”: even older notes are occasionally brought back up
- No active reminder system—purely user-driven

### Linking
- Manually link notes to one another
- Automatic, weaker linking via shared tags
- Recognize notes with similar content and suggest them as links
- **Origin of each edge visible**: manual / automatic (tag) / AI-suggested—visually distinguishable; automatic edges can be selectively removed without affecting manual ones
- Link type (e.g., “contradicts,” “expands upon,” “answers”) marked for future expansion; initially a simple undirected edge
- **Threads**: a separate, chronological view of a chain’s progression, distinct from the overall graph

### Elaboration
- The original question or idea remains unchanged; a developed concept is created as a separate, new note with a link back to the original
- Optional AI feature: Consolidate notes from a topic cluster into a summary note that links back to their sources, if desired

### Visualization
- Graphical network representation: Notes as nodes, links as edges (visually distinguishable by origin)
- Clarity of clusters/key topics
- Node size automatically determined (e.g., number of links) instead of manual prioritization
- Zoom/focus on individual notes and their immediate surroundings
- Dedicated thread view: linear, chronological timeline

### Search & Overview
- Full-text search across all notes
- Periodic review generated on demand

### AI & Confidentiality
- **Decision: Cloud AI (e.g., Claude/OpenAI API) for all AI functions**, rather than a local model. The difference in quality between a local model running on modest hardware and cloud models is noticeable, especially for more demanding tasks (cluster summarization, RAG chat), while the realistic costs are low.
- **Estimated costs:** no subscription, purely pay-per-use—approx. 10–30 €/year for normal personal use.
- The confidentiality flag per note remains as a concept, in case individual sensitive notes need to be excluded from AI processing in the future.

### Export & Backup
- Full raw data export (JSON) for backups, including all metadata
- Markdown export, compatible with Obsidian:
  - one file per note, YAML front matter with tags/date/type/status
  - Manual links as `[[Wikilinks]]`, automatic/AI-generated links only as notes in the front matter

## Non-functional Requirements

- **Capture speed is the top priority** – no barriers to jotting down a thought
- **Accessibility from anywhere** – use on mobile and computer
- **Data sovereignty** – your own data, exportable, no vendor lock-in
- **Long-term viability** – remains clear and performs well even with thousands of notes over the years
- **Extensibility** – architecture designed so that new features can be added incrementally

## Architectural Approach: Two Clients, One Backend

- **Web App** (laptop, longer sessions): detailed writing, graph visualization, thread view, retrospectives.
- **Flutter App** (mobile, everyday use): quick entry on the go, Share Sheet integration, offline-first with background sync.
- **Shared Backend** (FastAPI + DB): single source of truth. Both clients remain lightweight; the actual logic is centralized in the backend.

Order: first the backend + web app (covers almost all use cases), then the Flutter app—as soon as the API and data model are stable.

## Roadmap & Time Estimate

Rough estimate in hours, assuming moderate programming skills and no AI-generated code. The current implementation status is listed in the [main README](../README.md#roadmap).

| Phase | Content | Hours |
|---|---|---|
| 0 | Setup (backend/frontend framework, DB connection) | 7 |
| 1 | MVP Quick Entry | 17 |
| 2 | List & Organization (types, tags, filters, search) | 12 |
| 3 | “Quiet Minute” | 7 |
| 4 | Manual Linking & Threads | 17 |
| 5 | Graph Visualization | 25 |
| 6 | Automatic Tag Linking | 5 |
| 7 | Similarity & Auto-Tagging (AI) | 20 |
| 8 | Cluster Summary & Review (RAG) | 17 |
| 9 | Export/Backup | 7 |
| 10 | Deployment | 12 |
| 11 | Flutter Mobile App | 50 |
| **Total** | | **≈ 196** |

<details>
<summary><strong>Detailed Breakdown of Phases 0–4</strong></summary>

**Phase 0 – Setup: 7h**
- Set up repo, tooling, and linting – 1.5h
- Backend framework (FastAPI Hello World, folder structure) – 2h
- Database connection (SQLAlchemy + SQLite, first model) – 2h
- Frontend framework (React/Vite setup, basic layout) – 1.5h

**Phase 1 – MVP Quick Prototype: 17h**
- Design note data model & migration – 2h
- Endpoint for creating a note – 2h
- Endpoint for retrieving the note list – 1.5h
- Input field component (frontend) – 3h
- Frontend↔backend integration – 3h
- Rendering the note list (frontend) – 2.5h
- Basic styling – 1.5h
- Testing & debugging buffer – 1.5h

**Phase 2 – List & Organization: 12h**
- Add type and status fields to the model + migration – 1.5h
- Tags data model (many-to-many relationship) – 2h
- Filter endpoint (query parameters) – 2h
- Full-text search backend – 1.5 hours
- Filter UI – 2.5 hours
- Tag management UI – 2 hours
- Buffer/debugging – 0.5 hours

**Phase 3 – The “quiet moment”: 7 hours**
- “Random open question” endpoint – 1.5 hours
- Status change logic – 1h
- “View Question + Write Answer” UI view – 2.5h
- Linking answer notes to questions – 1.5h
- Buffer – 0.5h

**Phase 4 – Manual Linking & Threads: 17h**
- Data model linking – 1.5h
- Endpoint for creating/deleting links – 2h
- UI for manual linking – 3h
- Backlink display – 2h
- Thread logic – 3h
- Thread view UI – 3h
- Buffer/debugging – 2.5h
</details>

## Open Issues

- Specific link types (fixed list, free text, or a combination) – intentionally left open for now
- Selection of a cloud AI provider for embeddings/summaries
- Details of the thread view for branched chains (multiple notes refer to the same original note)