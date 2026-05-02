# Sprint Status

You are helping the user update the sprint status for their project. This is an interactive command to move stories and epics through the status pipeline.

## Prerequisites

Read `projects/[project-id]/build/sprint-status.json` and all epic files at `projects/[project-id]/build/epics/*/epic.json`.

## Status Rules

Status never downgrades. Valid transitions:
- **Epic:** `backlog → in-progress → done`
- **Story:** `backlog → ready → in-progress → review → done`

## Step 1: Show Current State

Display a summary of the current sprint status:

"**Sprint Status — [Project Name]**

Epics:
- [epic-01] [title] — [status]
  - [story-01] [title] — [status]
  - [story-02] [title] — [status]
- [epic-02] [title] — [status]
  ..."

## Step 2: Ask for Updates

"What would you like to update? You can say things like:
- 'mark epic-01/story-02 as in-progress'
- 'story-03 is done'
- 'epic-01 is now in-progress'
- 'update a few stories'

Or type 'done' to exit without changes."

Process updates one by one. For each update:
1. Validate the transition is legal (no downgrade)
2. If the story moves to `in-progress`, also set the parent epic to `in-progress`
3. If all stories in an epic move to `done`, prompt: "All stories in [epic] are done. Mark the epic as done too?"

## Step 3: Write Updates

Update `projects/[project-id]/build/sprint-status.json` with all the new statuses.

## Step 4: Summary

"Updated [N] items:
- [item] [old status] → [new status]

Run `/sprint-status` anytime to update again."
