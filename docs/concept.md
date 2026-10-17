# Concept: Loom

Use cases and requirements for [Loom](../README.md), written before the first line of code. Decisions that changed during development are marked as such; open questions are marked as open.

## Contents

- [Vision](#vision)
- [Use Cases](#use-cases)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [Architecture Approach](#architecture-approach-two-clients-one-backend)
- [Roadmap & Time Estimate](#roadmap--time-estimate)
- [Open Questions](#open-questions)

## Vision

A tool for capturing thoughts, questions, quotes, and ideas, with the ability to later reflect on them, link them, and explore them as a network. The focus is on open questions: they are tracked, resurfaced on demand, and closed by the note that answers them. No active reminder system — a tool used when wanted.

Also a learning project for full-stack development: the code is mostly written by hand, AI is used for planning, understanding bugs, and code review.

## Use Cases

| # | Scenario | Description |
|---|---|---|
| 1 | **Quick capture** | A thought, question, or quote comes up spontaneously and is captured in seconds, without interrupting the moment. |
| 2 | **The quiet minute** | In a free moment, an open question is surfaced (random or targeted), thought through, and new notes are added. |
| 3 | **Question lifecycle** | A question is noted and stays open. A later note answers it, directly or incidentally. The link between question and answer is recorded, and the question is closed. |
| 4 | **Collecting project ideas** | A central note for a project, with new idea notes referencing it over time. |
| 5 | **Recognizing patterns** | Recurring topics or questions become visible, even without deliberate linking. |
| 6 | **Tracking changes of opinion** | If a view on a topic changes, the old note stays unchanged; a new note references it. This makes changes of opinion visible over time. |
| 7 | **Exploring the thought landscape** | Browsing freely through the network of notes, spotting clusters and recurring themes. |
| 8 | **Targeted retrieval** | Finding a specific note via search and filters (type, tag, date range). |
| 9 | **Periodic review** | An on-demand summary of a time period or topic cluster, including open questions, how long they were open, and which notes resolved them. |

**Example for scenario 3 (question lifecycle):**
"What makes a good friend?" is noted and stays open for weeks. A later note about a conversation says "a good friend tells you things you don't want to hear". On saving, Loom finds the open question as similar and asks whether the new note answers it. After confirmation, the two notes are linked (type "answered") and the question is marked as closed.

## Functional Requirements

### Capture
- Create a note with minimal friction (one text field, saved instantly)
- Note types: thought, question, quote, idea/project idea (freely extensible)
- Quotes as their own node type with structured source (person, work/context, date); a separate note can reference a quote and record its own interpretation
- Title is optional, with staged handling when missing:
  1. A manually entered title is used
  2. No title, short content → content itself serves as the display label
  3. No title, long content → automatically truncated start of the text (rule-based, no AI)
  4. Optional "suggest title" button (AI-generated), used when tidying up later
  5. Fallback for unclear content: "Reply to: [title of the original note]"

### Organization & Status
- Status per note: open / ongoing / closed (or none). Mainly used for questions.
- Freely assignable tags, multiple per note
- Filterable by type, tag, status, date range
- Archive instead of delete
- Confidentiality flag per note (see [AI & Confidentiality](#ai--confidentiality))

### Reflection / Resurfacing: the question cycle
1. **Resurfacing.** Open questions are surfaced on demand ("quiet minute"), weighted by age and by time since last seen. Purely user-initiated, no notifications.
2. **Answer suggestions.** When a note is saved, similar open questions are found via embeddings and offered: "Does this answer your question ...?" On confirmation, a link with origin `ai` and type "answered" is created and the question's status is updated. Nothing happens without confirmation.
3. **Review.** How long questions were open, and which note resolved each of them.

Further ideas:
- **Recurrence detection:** "You have noted something similar three times already."
- **Contradiction detection:** notes that disagree with each other. Optional, likely unreliable.
- **Time travel:** arbitrary older notes are occasionally resurfaced too.

### Linking
- Links are directed (source → target) and have an optional single type (e.g. "answered", "contradicts", "expands on")
- Manually link notes to each other, with backlinks shown on the target
- Automatic, weaker connections via shared tags, computed at query time and not stored as links
- Detect content-similar notes and suggest them as links
- **Origin of every edge is visible**: manual / tag / AI-suggested — visually distinguishable, automatic edges can be removed individually without affecting manual ones
- **Decision (changed during development):** one semantic type per note pair is enough. A list of types per link and dedicated "thread" views were dropped; chains of thoughts are expressed through ordinary links.

### Elaboration
- An original question/idea stays unchanged; an elaborated concept becomes its own new note, referencing back
- Optional AI feature: condense the notes of a topic cluster into a summary note on demand, referencing its sources

### Visualization
- Graph view: notes as nodes, links as edges (visually distinguishable by origin)
- Clusters/topic emphasis should be recognizable
- Node size derived automatically (e.g. number of links) instead of manual prioritization
- Zoom/focus on a single note and its direct neighborhood

### Search & Overview
- Full-text search across all notes
- Periodic, on-demand generated review

### AI & Confidentiality
- **Decision: cloud AI (e.g. Claude/OpenAI API) for all AI features**, instead of a local model. The quality gap between a local model on modest hardware and cloud models is noticeable for more demanding tasks (cluster summarization, answer suggestions), while the realistic cost is low.
- **Estimated cost:** no subscription, pay-per-use only — roughly €10–30/year under normal personal use.
- Notes flagged as private are never sent to the API and get no embeddings.

### Export & Backup
- Full raw data export (JSON) for backups, including all metadata
- Markdown export, Obsidian-compatible:
  - one file per note, YAML frontmatter with tags/date/type/status
  - manual links as `[[wikilinks]]`, automatic/AI edges noted in frontmatter only

## Non-Functional Requirements

- **Capture speed is the top priority** — no friction when jotting down a thought
- **Accessible from anywhere** — usable on phone and computer
- **Data ownership** — own data, exportable, no vendor lock-in
- **Longevity** — stays clear and performant even with thousands of notes over years
- **Extensibility** — architecture designed so new features can be added incrementally

## Architecture Approach: Two Clients, One Backend

- **Web app** (laptop, longer sessions): extended writing, graph visualization, reviews.
- **Flutter app** (mobile, daily use): quick capture on the go, share-sheet integration, offline-first with background sync.
- **Shared backend** (FastAPI + DB): single source of truth. Both clients stay thin; the actual logic lives centrally in the backend.

Order: backend + web app first (covers nearly all use cases), then the Flutter app once the API and data model are stable.

## Roadmap & Time Estimate

Rough estimate in hours, assuming intermediate programming skills and no AI code generation. Current implementation status is tracked in the [main README](../README.md#roadmap).

| Phase | Content | Hrs. |
|---|---|---|
| 0 | Setup (backend/frontend skeleton, DB connection) | 7 |
| 1 | MVP quick capture | 17 |
| 2 | List & organization (types, tags, status, filter, search) | 12 |
| 3 | Revisiting open questions ("quiet minute") | 7 |
| 4 | Manual linking (optional type, backlinks) | 12 |
| 5 | Graph visualization | 25 |
| 6 | Embeddings, similarity search, answer suggestions | 25 |
| 7 | Recurrence detection, optional summaries | 17 |
| 8 | Export/backup | 7 |
| 9 | Deployment (demo and private instance) | 12 |
| 10 | Flutter mobile app | 50 |
| **Total** | | **≈ 190** |

## Open Questions

- Concrete link types (fixed list, free text, or a combination) — deliberately left open
- Choice of cloud AI provider for embeddings and summarization
- Embedding storage: arrays/JSON with cosine similarity in Python, or pgvector
- Similarity threshold for answer suggestions, and how to avoid noisy suggestions
- How private notes are excluded from embeddings and AI calls (flag checked in one place on the backend)
