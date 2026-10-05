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

A tool for capturing thoughts, questions, quotes, and ideas, with the ability to later reflect on them, link them, and explore them as a network. No active reminder system — a tool used when wanted.

Also a learning project for full-stack development: the code is written by hand, AI is used only for planning, understanding bugs, and code review.

## Use Cases

| # | Scenario | Description |
|---|---|---|
| 1 | **Quick capture** | A thought, question, or quote comes up spontaneously and is captured in seconds, without interrupting the moment. |
| 2 | **The quiet minute** | In a free moment, an open question is surfaced (random or targeted), thought through, and new notes are added. |
| 3 | **Thought threads** | A thought develops over several sessions: question → first thought → second thought referencing both previous ones. This chain is viewable as a connected, chronological sequence. |
| 4 | **Collecting project ideas** | A central note for a project, with new idea notes referencing it over time. |
| 5 | **Recognizing patterns** | Recurring topics or questions become visible, even without deliberate linking. |
| 6 | **Tracking changes of opinion** | If a view on a topic changes, the old note stays unchanged; a new note references it. This makes changes of opinion visible over time. |
| 7 | **Exploring the thought landscape** | Browsing freely through the network of notes, spotting clusters and recurring themes. |
| 8 | **Targeted retrieval** | Finding a specific note via search and filters (type, tag, date range). |
| 9 | **Periodic review** | An on-demand summary of a time period or topic cluster, including open questions and visible changes of opinion. |

## Functional Requirements

### Capture
- Create a note with minimal friction (one text field, saved instantly)
- Note types: thought, question, quote, idea/project idea (freely extensible)
- Quotes as their own node type with structured source (person, work/context, date); a separate note can reference a quote and record its own interpretation

### Organization & Status
- Questions have status open/answered
- Freely assignable tags, multiple per note
- Filterable by type, tag, status, date range
- Notes can be archived or pinned
- Confidentiality flag per note (see [AI & Confidentiality](#ai--confidentiality))

### Reflection / Resurfacing
- A mechanism that surfaces open questions on demand (random, oldest first, or filtered by tag)
- Answers/thoughts for a question are linked to it, not left as a loose note
- "Time travel": arbitrary older notes are occasionally resurfaced too
- No active reminder system — purely user-initiated

### Linking
- Manually link notes to each other
- Automatic, weaker linking via shared tags
- Detect content-similar notes and suggest them as links
- **Origin of every edge is visible**: manual / automatic (tag) / AI-suggested — visually distinguishable, automatic edges can be removed individually without affecting manual ones
- Link type (e.g. "contradicts", "expands on", "answers") noted as a later extension; starts as a simple undirected edge
- **Thought threads**: a dedicated, chronological view of a chain, separate from the overall graph

### Elaboration
- An original question/idea stays unchanged; an elaborated concept becomes its own new note, referencing back
- Optional AI feature: condense the notes of a topic cluster into a summary note on demand, referencing its sources

### Visualization
- Graph view: notes as nodes, links as edges (visually distinguishable by origin)
- Clusters/topic emphasis should be recognizable
- Node size derived automatically (e.g. number of links) instead of manual prioritization
- Zoom/focus on a single note and its direct neighborhood
- Dedicated thread view: linear, chronological sequence

### Search & Overview
- Full-text search across all notes
- Periodic, on-demand generated review

### AI & Confidentiality
- **Decision: cloud AI (e.g. Claude/OpenAI API) for all AI features**, instead of a local model. The quality gap between a local model on modest hardware and cloud models is noticeable for more demanding tasks (cluster summarization, RAG chat), while the realistic cost is low.
- **Estimated cost:** no subscription, pay-per-use only — roughly €10–30/year under normal personal use.
- A confidentiality flag per note remains part of the concept, in case specific sensitive notes should later be excluded from AI processing.

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

- **Web app** (laptop, longer sessions): extended writing, graph visualization, thread view, reviews.
- **Flutter app** (mobile, daily use): quick capture on the go, share-sheet integration, offline-first with background sync.
- **Shared backend** (FastAPI + DB): single source of truth. Both clients stay thin; the actual logic lives centrally in the backend.

Order: backend + web app first (covers nearly all use cases), then the Flutter app once the API and data model are stable.

## Roadmap & Time Estimate

Rough estimate in hours, assuming intermediate programming skills and no AI code generation. Current implementation status is tracked in the [main README](../README.md#roadmap).

| Phase | Content |
|---|---|
| 0 | Setup (backend/frontend skeleton, DB connection) |
| 1 | MVP quick capture |
| 2 | List & organization (types, tags, filter, search) |
| 3 | "Quiet minute" |
| 4 | Manual linking & threads |
| 5 | Graph visualization |
| 6 | Automatic tag-based linking |
| 7 | Similarity & auto-tagging (AI) | 
| 8 | Cluster summarization & review (RAG) | 
| 9 | Export/backup |
| 10 | Deployment | 
| 11 | Flutter mobile app | 


## Open Questions

- Choice of cloud AI provider for embeddings/summarization
- Details of the thread view for branching chains (several notes referencing the same original note)