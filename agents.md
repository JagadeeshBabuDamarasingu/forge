# Agent Directives for Forge

Forge is a **full-lifecycle project management tool** that guides projects from ideation to go-live. It supports hardware and software projects across five phases: **Analyse → Plan → Design → Build → Ship**.

Multiple projects are managed from a single workspace dashboard. Each project is isolated under `projects/[project-id]/`.

> **Important**: The Design phase in Forge uses the Design OS tool embedded within it. Screen designs and exports generated in the Design phase are meant to be implemented in a separate product codebase.

---

## Understanding Forge Context

When working in Forge, be aware of three distinct contexts:

### 1. Forge Application (UI)
The React application at `src/`. When modifying Forge itself:
- Components live in `src/components/`
- Library code lives in `src/lib/`
- Uses the stone/lime palette, DM Sans typography
- Routes all live under `/:projectId/` (except `/` dashboard and `/projects/new`)

### 2. Project Files (Data)
Per-project files managed by agents. These are the "state" of each project:
- `projects/[id]/project.json` — metadata
- `projects/[id]/analyse/` — briefs, research, PRFAQ
- `projects/[id]/plan/` — PRD, architecture, UX spec
- `projects/[id]/product/` — Design OS product files (overview, roadmap, data shape, design system, shell, sections)
- `projects/[id]/build/` — epics, stories, sprint status
- `projects/[id]/ship/` — launch checklist, deployments

### 3. Screen Designs (Generated Components)
React components created during the Design phase:
- `src/sections/[project-id]/[section-id]/components/`
- `src/shell/[project-id]/components/`

---

## Five Lifecycle Phases

```
ANALYSE → PLAN → DESIGN → BUILD → SHIP
```

| Phase | Purpose | Key Commands |
|-------|---------|--------------|
| Analyse | Problem brief, market research, PRFAQ | `/analyst-brief`, `/market-research`, `/prfaq` |
| Plan | PRD, architecture, UX spec | `/create-prd`, `/create-architecture` |
| Design | Design tokens, shell, sections, screen designs | `/product-vision`, `/design-tokens`, `/design-shell`, `/shape-section`, `/design-screen` |
| Build | Epics, stories, sprint tracking | `/create-epics`, `/dev-story`, `/sprint-status`, `/roundtable` |
| Ship | Launch checklist, deployment log | `/launch-checklist` |

**Project types** (set at creation):
- **Quick** — Plan + Design only
- **Standard** — Analyse + Plan + Design + Build
- **Full** — All five phases

---

## File Structure

```
.forge/
  settings.json              ← workspace orchestration defaults

projects/
  projects.json              ← registry (used by daemon)
  [project-id]/
    project.json             ← {name, type, status, currentPhase, ...}
    forge.config.json        ← project-level orchestration overrides
    project-context.md       ← persistent AI constitution (loaded by every agent)
    memory.json              ← {decisions[], entities[], vocab[]}
    orchestration.json       ← current state, gates, handoffs, agent history

    analyse/
      brief.md
      prfaq.md
      research/
        market.md
        technical.md

    plan/
      prd.md
      architecture.md
      ux-spec.md

    product/                 ← Design OS product files
      product-overview.md
      product-roadmap.md
      data-shape/
      design-system/
      shell/
      sections/

    build/
      sprint-status.json
      epics/
        epic-[NN]/
          epic.json
          epic.md
          stories/
            story-[NN].md

    ship/
      launch-checklist.md
      deployments.json

    handoffs/                ← inter-agent structured messages

src/
  sections/[project-id]/[section-id]/components/
  shell/[project-id]/components/

daemon/
  server.ts                  ← WebSocket server + file watcher (npm run forge:daemon)
```

---

## Workspace Management Commands

- `/new-project` — Create a new Forge project (guided setup)
- `/migrate-project` — Migrate an existing root-level Design OS project into `projects/`

## Design Phase Commands (Design OS)

All Design OS commands work within the Design phase. They resolve paths relative to `projects/[project-id]/`. The path resolution preamble in each command explains how to map shorthand paths.

- `/product-vision` — Define product overview, roadmap, and data shape (all-in-one)
- `/product-roadmap` — Update the product roadmap
- `/data-shape` — Update the data shape
- `/design-tokens` — Choose color palette and typography
- `/design-shell` — Design the application shell
- `/shape-section` — Define a section spec and generate sample data
- `/sample-data` — Update sample data for a section
- `/design-screen` — Create screen designs for a section
- `/screenshot-design` — Capture screenshots of screen designs
- `/export-product` — Generate the UI design handoff package

## Build Phase Commands

- `/create-epics` — Break the PRD into epics and stories
- `/dev-story` — Flesh out a story with implementation detail
- `/sprint-status` — Update story/epic statuses interactively
- `/roundtable` — Get multi-perspective analysis on a decision

## Ship Phase Commands

- `/launch-checklist` — Generate a comprehensive launch checklist

---

## Orchestration

Forge includes a lightweight daemon (`npm run forge:daemon`) that watches `projects/` for file changes:
- Detects new handoff files in `projects/[id]/handoffs/`
- Evaluates gates in `forge.config.json`
- Updates `orchestration.json` state
- Broadcasts changes to the browser via WebSocket

Permission model: workspace `.forge/settings.json` defaults are merged with per-project `forge.config.json` overrides. Project values win.

---

## Design Requirements (Design Phase)

When creating screen designs, follow these guidelines:

- **Mobile Responsive**: Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- **Light & Dark Mode**: Use `dark:` variants for all colors
- **Use Design Tokens**: Apply the project's color palette and typography when defined
- **Props-Based Components**: Accept data and callbacks via props — never import data directly
- **No Navigation in Section Screen Designs**: The shell handles all navigation chrome

---

## Tailwind CSS Directives

- **Tailwind CSS v4**: Always use v4, never v3 patterns
- **No tailwind.config.js**: Never create or reference one
- **Use Built-in Utility Classes**: Avoid custom CSS
- **Use Built-in Colors**: Use Tailwind's color utilities (e.g., `stone-500`, `lime-400`)

---

## Design System (Forge Application)

The Forge application itself uses a "Refined Utility" aesthetic:

- **Typography**: DM Sans for headings and body, IBM Plex Mono for code
- **Colors**: Stone palette for neutrals, lime for accents
- **Icon**: Anvil (from lucide-react) for the Forge logo
- **Layout**: Maximum 800px content width, generous whitespace
- **Cards**: Minimal borders (1px), subtle shadows, generous padding
- **Motion**: Subtle fade-ins (200ms), no bouncy animations

Phase colors: Analyse=amber, Plan=blue, Design=violet, Build=orange, Ship=lime/green.
