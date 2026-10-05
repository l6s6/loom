# Technical Learnings

General topics and concepts learned while building Loom, grouped by area. Kept high-level rather than listing individual bugs.

## Backend

- Relational database design: normalization, many-to-many relationships, when a plain join table is enough versus when a relationship needs its own associated data, self-referencing relationships
- Schema migrations: how migration autogeneration works and its limitations, reviewing generated changes before applying them, database-specific constraints on altering existing tables
- ORM relationship modeling: lazy loading, explicit foreign key resolution when multiple relationships point at the same table, how and when model classes need to be imported for the ORM to know about them
- API design: separating the database model from request/response contracts, composable query filtering, choosing appropriate HTTP status codes, avoiding circular references in nested response shapes
- Testing: isolating a test database from the real one, dependency injection for swapping dependencies in tests, writing reusable test fixtures

## Frontend

- Data-fetching architecture: separating raw API calls, stateful data-fetching logic, and presentation components into distinct layers
- State management: local component state versus state shared across components, and when a more global mechanism (e.g. Context) is warranted
- Common React pitfalls: stale closures, accidental mutation of state, rules around when hooks can be called, deriving values instead of duplicating them in state
- TypeScript's role as a compile-time-only tool, and what that implies for keeping frontend types in sync with an actual API response
- Constraints of utility-first CSS frameworks around dynamically generated class names, and patterns for working around them

## General / Workflow

- Discipline around schema changes: keeping model changes and migrations together, inspecting generated changes before trusting them
- Debugging by isolating variables (environment, working directory, state) rather than guessing at the symptom directly
- Recognizing when time spent understanding a problem thoroughly pays off for later, structurally similar problems
- Using an AI assistant for code review, explanation, and planning rather than code generation, and structuring that collaboration deliberately