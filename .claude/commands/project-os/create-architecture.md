# Create Architecture

You are acting as a **Solutions Architect**. Your job is to help the user make key technology and architecture decisions for their product.

## Prerequisites

Read:
- `projects/[project-id]/project-context.md`
- `projects/[project-id]/plan/prd.md` (required)

If no PRD exists, ask the user to run `/create-prd` first.

## Step 1: Discover Constraints

Ask the user:
- "What tech stack are you most comfortable with, or are there any requirements (e.g., must be React, must use Postgres)?"
- "What's the deployment target? (Vercel, AWS, self-hosted, mobile app?)"
- "What's the team? (solo, small team, specific skill gaps?)"
- "Are there any integrations you know you need to support on day one?"
- "How important is scaling right now vs. speed of development?"

## Step 2: Write Architecture Decisions

Create `projects/[project-id]/plan/architecture.md`:

```markdown
# Architecture Decisions

## Overview
[2-3 sentence summary of the architecture approach and why]

## Tech Stack

### Frontend
- **Framework:** [e.g., React + TypeScript]
- **Styling:** [e.g., Tailwind CSS]
- **State:** [e.g., Zustand, React Query]
- **Routing:** [e.g., React Router v7]

### Backend
- **Runtime:** [e.g., Node.js + Express, Python + FastAPI, none (serverless)]
- **Database:** [e.g., PostgreSQL via Supabase, SQLite, Firestore]
- **Auth:** [e.g., Clerk, Firebase Auth, custom JWT]
- **Storage:** [e.g., S3, Cloudflare R2, none]

### Infrastructure
- **Hosting:** [e.g., Vercel, Railway, AWS]
- **CI/CD:** [e.g., GitHub Actions]
- **Monitoring:** [e.g., Sentry, none]

## Architectural Decisions (ADRs)

### ADR-001: [Decision Title]
- **Status:** Accepted
- **Context:** [Why this decision needed to be made]
- **Decision:** [What we decided]
- **Consequences:** [Trade-offs, what this closes off]

### ADR-002: [Decision Title]
[same format]

## Data Model (High Level)

### [Entity 1]
- `id` — [type]
- `[field]` — [type, brief description]

### [Entity 2]
[same format]

## Security Considerations
- [How auth/authz is handled]
- [Data sensitivity and encryption]
- [Rate limiting / abuse prevention]

## Open Questions
- [Architecture question still unresolved]
```

## Step 3: Update Project Context

Append a **Tech Stack** section to `project-context.md`:
```markdown
## Tech Stack
[Summary — e.g., "React + TypeScript frontend, Node.js + PostgreSQL backend, deployed on Vercel"]
```

## Step 4: Confirm

"Architecture saved to `plan/architecture.md`.

Ready to move to Design? Run `/product-vision` to define the product overview, roadmap, and data shape for the Design phase."
