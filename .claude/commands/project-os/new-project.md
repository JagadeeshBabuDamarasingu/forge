# New Project

You are helping the user create a new Forge project. This is a conversational setup process.

## Step 1: Gather Project Info

Ask the user:

"Let's set up your new Forge project. Tell me:
1. **Project name** — what should we call it?
2. **Project type** — choose one:
   - **Quick** — Plan + Design only (great for UI prototypes)
   - **Standard** — Analyse + Plan + Design + Build (most projects)
   - **Full** — All five phases including Ship
3. **Brief description** — one or two sentences about what you're building (optional)"

Wait for their response.

## Step 2: Generate a Project ID

Create a URL-safe slug from the project name:
- Lowercase
- Replace spaces and special chars with hyphens
- Max 40 characters
- Examples: "Task Flow Pro" → "task-flow-pro", "My SaaS App" → "my-saas-app"

If the generated ID conflicts with an existing directory in `projects/`, append a short suffix (e.g., `-2`).

## Step 3: Create the Project Structure

Create all the following files and directories:

### `projects/[project-id]/project.json`
```json
{
  "id": "[project-id]",
  "name": "[Project Name]",
  "description": "[description or empty string]",
  "type": "[quick|standard|full]",
  "status": "active",
  "currentPhase": "[first phase based on type: 'plan' for quick, 'analyse' for standard/full]",
  "created": "[ISO timestamp]",
  "updated": "[ISO timestamp]"
}
```

### `projects/[project-id]/forge.config.json`
```json
{
  "project": {
    "name": "[Project Name]",
    "type": "[type]"
  },
  "orchestration": {
    "autonomy": "manual",
    "auto_chain": {}
  }
}
```

### `projects/[project-id]/project-context.md`
```markdown
# [Project Name] — Project Context

This file is loaded by every agent working on this project to maintain continuity.

## Product
[Brief description]

## Project Type
[type]

## Key Decisions
(none yet)

## Current Phase
[currentPhase]
```

### `projects/[project-id]/memory.json`
```json
{
  "decisions": [],
  "entities": [],
  "vocab": []
}
```

### `projects/[project-id]/orchestration.json`
```json
{
  "project": "[project-id]",
  "current_phase": "[currentPhase]",
  "active_agents": [],
  "gates": {
    "analyse_complete": false,
    "plan_approved": false,
    "design_complete": false,
    "build_complete": false
  },
  "pending_handoffs": [],
  "agent_history": [],
  "active_roundtable": null
}
```

Also create empty directories (use a `.gitkeep` placeholder file):
- `projects/[project-id]/analyse/research/`
- `projects/[project-id]/plan/`
- `projects/[project-id]/product/sections/`
- `projects/[project-id]/build/epics/`
- `projects/[project-id]/ship/`
- `projects/[project-id]/handoffs/`

## Step 4: Confirm and Guide

After creating all files, tell the user:

"**[Project Name]** is ready!

- **ID:** `[project-id]`
- **Type:** [type]
- **Location:** `projects/[project-id]/`

Open it in Forge at `http://localhost:5173/[project-id]`

[Based on type, suggest the next step:]
- Quick: Run `/product-vision` to define your product, then `/design-tokens` to choose colors.
- Standard/Full: Run `/analyst-brief` to start with a problem brief."

## Important Notes

- Always use the current ISO timestamp for `created` and `updated`
- Project IDs must be unique — check if the directory already exists before creating
- The `project-context.md` is the AI's persistent memory — write it thoughtfully
