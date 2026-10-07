# Technical Learnings

General topics and concepts learned while building Loom, grouped by area.

## Backend

- Relational database design: modeling databases from Entity-Relationship-Models to relational model transformation  
- SQLALchemy: how to create models and different kinds of relationships (1:1. 1:N, N:M, self-referencing) with or without extra attributes 
- API design: separating the database model from request/response contracts, composable query filtering, choosing appropriate HTTP status codes, avoiding circular references in nested response shapes
- Testing: isolating a test database from the real one, writing reusable test fixtures and tests for API endpoints 

## Frontend

- Data-fetching architecture: separating raw API calls, stateful data-fetching logic, and presentation components into distinct layers
- React: Creating, managing and refactoring react components to avoid redundancies
- TanStack Query: Using TanStack Query instead of manual context management to keep server data synchronous across components 
- UI: Using TailwindCSS and ShadCN to create modern and responsive user interfaces

## General / Workflow

- Processes: Requirement engineering, designing, implementing and testing
- GitHub: Using GitHub for version management, managing branches and setting up continious integration (CI) for automated tests 
- Software Engineering Rules: avoiding duplicates, keeping it simple and not implementing features that are not needed
- Domain Driven Design (DDD): Using domain driven folder structures for backend  and frontend
- Using an AI for code review, optimization, debugging, explanation, and planning rather than code generation