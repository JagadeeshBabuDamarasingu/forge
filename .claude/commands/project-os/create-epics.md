# Create Epics

You are acting as a **Senior Engineer / Tech Lead**. Your job is to break the product requirements into epics and stories for the Build phase.

## Prerequisites

Read:
- `projects/[project-id]/project-context.md`
- `projects/[project-id]/plan/prd.md` (required)
- `projects/[project-id]/product/product-roadmap.md` (if exists — use sections as epic anchors)
- `projects/[project-id]/plan/architecture.md` (if exists)

If no PRD exists, ask the user to run `/create-prd` first.

## Step 1: Discuss Breakdown

Ask the user:
- "Should I create one epic per product section (from the roadmap), or organize differently?"
- "What should be the first epic — the foundation (auth, DB schema, shell) or a specific feature?"
- "Any stories you already know need to be broken out separately?"

## Step 2: Create Epic Files

For each epic, create `projects/[project-id]/build/epics/epic-[NN]/epic.json`:

```json
{
  "id": "epic-01",
  "title": "[Epic Title]",
  "goal": "[One sentence — what completing this epic delivers]",
  "order": 1,
  "status": "backlog",
  "stories": ["story-01", "story-02", "story-03"]
}
```

And create the epic spec at `projects/[project-id]/build/epics/epic-[NN]/epic.md`:

```markdown
# Epic [NN]: [Epic Title]

## Goal
[What completing this epic delivers to the user]

## Stories
1. [story-01] [Story title]
2. [story-02] [Story title]
3. [story-03] [Story title]

## Acceptance Criteria
- [What "done" means for this epic]

## Dependencies
- [Any prerequisites from other epics]

## Notes
[Implementation hints, gotchas, or context]
```

And create each story stub at `projects/[project-id]/build/epics/epic-[NN]/stories/story-[NN].md`:

```markdown
# Story [NN]: [Story Title]

**Epic:** [epic-id]
**Status:** backlog

## As a...
[user role]

## I want to...
[action]

## So that...
[value/outcome]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Notes
[Technical hints, edge cases]
```

## Step 3: Create Sprint Status

Create `projects/[project-id]/build/sprint-status.json`:

```json
{
  "project": "[project-id]",
  "status": {
    "epic-01": "backlog",
    "epic-01-story-01": "backlog",
    "epic-01-story-02": "backlog",
    "epic-02": "backlog"
  }
}
```

## Step 4: Update Orchestration

Update `projects/[project-id]/orchestration.json`:
- Set `current_phase` to `build`
- Set `gates.design_complete` to `true`

## Step 5: Confirm

"Created [N] epics with [M] total stories.

**Epics:**
1. **[Epic 1]** — [goal]
2. **[Epic 2]** — [goal]

The Build page in Forge will now show your epic board. Run `/dev-story` to flesh out individual stories when you're ready to implement."
