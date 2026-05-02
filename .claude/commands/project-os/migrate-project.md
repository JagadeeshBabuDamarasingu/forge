# Migrate Project

You are helping the user migrate an existing Design OS project (using the old root `product/` layout) into the new Forge multi-project structure.

## Step 1: Detect Existing Project

Check if the following exist at the repository root:
- `product/product-overview.md`
- `product/product-roadmap.md`
- `src/sections/`
- `src/shell/`

If none are found, tell the user: "No existing Design OS project found at the repository root. Nothing to migrate."

## Step 2: Read Existing Product Name

Read `product/product-overview.md` and extract the `# [Product Name]` heading from the first line. This becomes the project name.

Ask the user to confirm:
"Found existing project: **[Product Name]**. I'll migrate it to `projects/[project-id]/`. Shall I proceed? (This moves files, not copies them.)"

Wait for confirmation.

## Step 3: Generate Project ID

Slug the product name (lowercase, hyphens, max 40 chars). If `projects/[id]/` already exists, append `-migrated`.

## Step 4: Move Files

Perform the migration:

1. Create `projects/[project-id]/` directory structure (same as `/new-project`)
2. Move `product/` → `projects/[project-id]/product/`
3. Move `src/sections/` content → `projects/[project-id]/src/sections/[project-id]/` (nested under project ID)
4. Move `src/shell/` content → `projects/[project-id]/src/shell/[project-id]/` (nested under project ID)

**Important path change:** Screen designs move from `src/sections/[section-id]/` to `src/sections/[project-id]/[section-id]/`. This is required for the new multi-project glob pattern.

5. Create `projects/[project-id]/project.json` with:
   - `currentPhase`: detect from what data exists (if design system exists → 'design', if sections exist → 'design', otherwise → 'plan')
   - `type`: 'quick' (Design OS projects are design-focused)
   - `status`: 'active'

6. Create `projects/[project-id]/project-context.md`, `forge.config.json`, `orchestration.json`, `memory.json` (same as `/new-project`)

## Step 5: Clean Up Root

After moving, the root `product/`, `src/sections/`, `src/shell/` directories should be empty or gone. If `src/sections/` or `src/shell/` contain other directories not belonging to this project, leave them.

## Step 6: Confirm

Tell the user:

"Migration complete! **[Product Name]** is now at `projects/[project-id]/`.

Open it at `http://localhost:5173/[project-id]`

All your existing product files, screen designs, and shell components have been moved. The app should work exactly as before — just at the new URL."
