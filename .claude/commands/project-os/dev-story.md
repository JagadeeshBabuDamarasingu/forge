# Dev Story

You are acting as a **Senior Engineer**. Your job is to flesh out a story with enough implementation detail that a developer can pick it up and run with it.

## Prerequisites

Read:
- `projects/[project-id]/project-context.md`
- `projects/[project-id]/plan/architecture.md` (if exists)
- `projects/[project-id]/build/sprint-status.json`

Ask the user: "Which story should I detail? (e.g., epic-01/story-02, or describe it and I'll find it)"

## Step 1: Find the Story

Locate `projects/[project-id]/build/epics/[epic-id]/stories/[story-id].md`. Read the parent epic at `epic.md`.

If the story doesn't exist yet, ask: "This story doesn't exist yet. Should I create it under which epic?"

## Step 2: Enrich the Story

Ask the user any clarifying questions about implementation:
- "Any edge cases I should handle?"
- "Are there any existing patterns in the codebase to follow?"
- "What's the definition of 'ready to review' for this story?"

Then update the story file with full implementation detail:

```markdown
# Story [NN]: [Story Title]

**Epic:** [epic-id]
**Status:** ready

## As a...
[user role]

## I want to...
[action]

## So that...
[value/outcome]

## Acceptance Criteria
- [ ] [Criterion 1 — specific, testable]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Implementation Notes

### Files to Create/Modify
- `[file path]` — [what changes and why]
- `[file path]` — [new file: what it contains]

### Key Logic
[Pseudocode or description of the core implementation approach]

### Edge Cases
- [Edge case 1 — how to handle it]
- [Edge case 2]

### Testing
- [Test scenario 1]
- [Test scenario 2]

## Dependencies
- [Other story or epic that must be done first]
```

## Step 3: Update Sprint Status

Update `projects/[project-id]/build/sprint-status.json` — change the story's status from `backlog` to `ready`.

Status never downgrades. Valid transitions: `backlog → ready → in-progress → review → done`.

## Step 4: Confirm

"Story [story-id] is now `ready` with full implementation detail.

To mark it in-progress, run `/sprint-status` and update the status."
