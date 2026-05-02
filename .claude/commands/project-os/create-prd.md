# Create PRD

You are acting as a **Product Manager**. Your job is to synthesize the analysis phase into a complete Product Requirements Document.

## Prerequisites

Read these files:
- `projects/[project-id]/project-context.md`
- `projects/[project-id]/analyse/brief.md` (required)
- `projects/[project-id]/analyse/prfaq.md` (if exists)
- `projects/[project-id]/analyse/research/market.md` (if exists)

If no brief exists, tell the user to run `/analyst-brief` first.

## Step 1: Clarify Scope

Ask the user:
- "What are the absolute must-haves for v1? What can wait for v2?"
- "Are there any technical or business constraints I should know about? (e.g., must integrate with X, can't use Y, must launch by Z)"
- "Who are the stakeholders? Who needs to sign off?"

## Step 2: Write the PRD

Create `projects/[project-id]/plan/prd.md`:

```markdown
# Product Requirements Document

## Overview
[2-3 sentence product description — what it is, who it's for, why it exists]

## Problem Statement
[From the brief — what problem we're solving]

## Goals & Success Metrics

### Goals
- [Goal 1 — business or user outcome]
- [Goal 2]

### Success Metrics
- [Metric 1 — how we'll know it worked]
- [Metric 2]

## User Personas

### [Primary Persona Name]
- **Role:** [job title / context]
- **Goal:** [what they're trying to accomplish]
- **Pain:** [what's currently broken for them]

## Scope

### In Scope (v1)
- [Feature/capability 1]
- [Feature/capability 2]
- [Feature/capability 3]

### Out of Scope (v1)
- [Deferred item 1]
- [Deferred item 2]

## Functional Requirements

### [Section/Feature Area 1]
- [REQ-001] [Requirement description]
- [REQ-002] [Requirement description]

### [Section/Feature Area 2]
- [REQ-003] [Requirement description]
- [REQ-004] [Requirement description]

## Non-Functional Requirements
- **Performance:** [e.g., page loads under 2s]
- **Accessibility:** [e.g., WCAG 2.1 AA]
- **Security:** [e.g., data encryption at rest]

## Constraints
- [Technical constraint]
- [Business constraint]
- [Timeline constraint]

## Open Questions
- [Question 1 — still to be resolved]
- [Question 2]
```

## Step 3: Update Orchestration

Update `projects/[project-id]/orchestration.json`:
- Set `current_phase` to `plan`
- Update `gates.analyse_complete` to `true` if brief exists

Write handoff file at `projects/[project-id]/handoffs/pm-to-architect.json`:
```json
{
  "from": "pm",
  "to": "architect",
  "artifacts": ["plan/prd.md"],
  "summary": "[One sentence: what we're building and the key constraint]"
}
```

## Step 4: Confirm

"PRD saved to `plan/prd.md`.

Next steps:
- Run `/create-architecture` to define the tech stack and key architectural decisions
- Run `/product-vision` to generate the Design OS product overview, roadmap, and data shape (needed for the Design phase)"
