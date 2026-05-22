---
version: alpha
name: Forge Refined Utility
description: Design system for Forge, a full-lifecycle project management tool for guiding work from ideation to go-live.
colors:
  primary: "#1C1917"
  on-primary: "#FAFAF9"
  secondary: "#F5F5F4"
  on-secondary: "#1C1917"
  surface: "#FAFAF9"
  surface-card: "#FFFFFF"
  on-surface: "#1C1917"
  muted: "#F5F5F4"
  on-muted: "#57534E"
  border: "#E7E5E4"
  focus: "#78716C"
  accent: "#65A30D"
  on-accent: "#FFFFFF"
  destructive: "#E11D48"
  analyse: "#D97706"
  plan: "#2563EB"
  design: "#7C3AED"
  build: "#EA580C"
  ship: "#65A30D"
typography:
  display-lg:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: 0
  heading-md:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: 0
  heading-sm:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: 0
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0
  code-sm:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 12px
  muted-panel:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.on-muted}"
    rounded: "{rounded.lg}"
    padding: 16px
  focus-ring:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  destructive-action:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: 12px
  phase-analyse:
    backgroundColor: "{colors.analyse}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
  phase-plan:
    backgroundColor: "{colors.plan}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
  phase-design:
    backgroundColor: "{colors.design}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
  phase-build:
    backgroundColor: "{colors.build}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
  phase-ship:
    backgroundColor: "{colors.ship}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
---

# Design System

## Overview

Forge uses a refined utility aesthetic: quiet, operational, and designed for repeated project work. The interface should feel like a precise workspace for moving projects through Analyse, Plan, Design, Build, and Ship, not like a marketing site.

The visual language is built from warm stone neutrals, restrained lime accents, DM Sans typography, IBM Plex Mono for code and commands, subtle borders, and generous whitespace. Screens should prioritize scanability, state clarity, and confidence over decoration.

## Colors

- **Primary** (#1C1917): Core actions, active navigation, logo blocks, and high-emphasis text.
- **On-primary** (#FAFAF9): Text and icons on dark primary surfaces.
- **Secondary** (#F5F5F4): Low-emphasis controls, inactive tabs, soft badges, and hover states.
- **Surface** (#FAFAF9): Main page background.
- **Surface-card** (#FFFFFF): Cards, dialogs, popovers, and contained tool surfaces.
- **On-surface** (#1C1917): Primary text on light surfaces.
- **Muted** (#F5F5F4): Subtle panels, code containers, skeleton surfaces, and empty-state backgrounds.
- **On-muted** (#57534E): Secondary text, helper copy, timestamps, and quiet metadata.
- **Border** (#E7E5E4): Dividers, card borders, form controls, and table separators.
- **Focus** (#78716C): Accessible focus rings and selected-outline states.
- **Accent** (#65A30D): Completion, export success, go-live readiness, and the most important affirmative action.
- **Destructive** (#E11D48): Irreversible actions and blocking errors.
- **Phase colors**: Analyse amber (#D97706), Plan blue (#2563EB), Design violet (#7C3AED), Build orange (#EA580C), Ship lime (#65A30D).

Dark mode in the app inverts the stone system: stone-900 backgrounds, stone-800 cards, stone-200 primary controls, stone-400 secondary text, and brighter lime status accents. Keep the semantic relationships intact when adding dark variants.

## Typography

- **Headings**: DM Sans, semibold, compact but not oversized. Use 24-32px only for page-level titles.
- **Body**: DM Sans, regular, 14-16px. Keep operational copy short and concrete.
- **Labels**: DM Sans, medium, 12px for badges, phase labels, metadata, and compact controls.
- **Code and commands**: IBM Plex Mono, 13px for inline commands, paths, JSON snippets, and generated file references.

Do not use negative letter spacing. Keep letter spacing at 0 and rely on weight, size, and whitespace for hierarchy.

## Layout

Forge content should use centered, readable columns with a maximum width near 800px for document-like pages and denser full-width bands only where workflow context needs it. Routes under `/:projectId/` should retain project navigation chrome unless they are explicit full-screen design previews.

Use responsive Tailwind utilities and design mobile states intentionally. Project pages should remain navigable and readable on small screens, with controls wrapping before text truncates in a way that hides critical state.

## Elevation & Depth

Depth is mostly structural. Prefer 1px borders, subtle shadows, sticky headers with translucent card backgrounds, and clear separation through spacing. Avoid heavy elevation, glassy effects, decorative gradients, and floating page sections.

## Shapes

Controls and cards should use small radii: 4px for small affordances, 6px for buttons and inputs, 8px for cards and panels, and 12px only for larger modals or section containers. Do not mix very rounded and sharp treatments in the same workflow.

## Components

- **Buttons**: Primary buttons use dark stone with light text. Lime buttons are reserved for completion, export, launch, and the strongest affirmative action. Secondary buttons use stone-100 with stone-900 text.
- **Cards**: White or dark stone surfaces with 1px stone borders, subtle shadow, and generous internal spacing. Cards represent individual artifacts, status summaries, or repeated items; do not nest cards inside cards.
- **Inputs**: White or dark card backgrounds, 1px borders, 6px radius, and visible focus rings. Labels should be close to fields and helper text should use muted foreground.
- **Navigation**: Keep route and phase navigation compact. Active states should be unmistakable through fill or strong text contrast, not oversized decoration.
- **Badges and statuses**: Use phase colors only for phase identity and workflow state. Avoid turning every label into a bright badge.
- **Icons**: Use lucide-react icons with 1.5px stroke by default. The Forge logo is the Anvil icon.
- **Motion**: Use subtle 200ms fade or collapse transitions. Avoid bouncy motion and large animated flourishes.

## Do's and Don'ts

- Do keep Forge quiet, useful, and work-focused.
- Do use stone neutrals as the dominant palette and lime as a sparse accent.
- Do make project phase, file state, and next action easy to scan.
- Do use props-based screen design components in generated Design phase components.
- Do include light and dark variants for user-facing UI.
- Don't create landing-page-style hero layouts for operational workflows.
- Don't use Tailwind v3 patterns or add `tailwind.config.js`; Forge uses Tailwind CSS v4.
- Don't import sample data directly into generated section screen components.
- Don't put navigation chrome inside section screen designs; the shell owns navigation.
- Don't use decorative gradient blobs, oversized cards, or one-note purple/blue themes.
