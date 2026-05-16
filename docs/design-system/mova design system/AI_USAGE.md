# Mova Design System Usage Rules for AI

This folder is a design reference, not application source code.

The real frontend lives in:

frontend/

The existing frontend setup is the source of truth.

## Existing frontend rules

The project uses React, Vite, TypeScript, Tailwind CSS v4 and shadcn/ui.

shadcn/ui must remain the component foundation.

Do not replace the existing shadcn setup.

Do not create a second UI system.

Do not copy this design system folder into frontend/src.

## What this folder is for

Use this folder only to understand:

1. Brand identity
2. Logo usage
3. Color direction
4. Typography direction
5. Radius and spacing direction
6. Component appearance
7. Empty states
8. Layout patterns
9. Voice and tone

## Files that may be used as reference

preview/*.html may be used as visual reference.

assets/logo.svg may be used as the real logo asset.

colors_and_type.css may be compared with frontend/src/index.css.

reference/frontend/src/components/Logo.tsx may be used as reference for a clean React Logo component.

README.md may be used to understand the design direction.

## Files that must not be implemented directly

Do not copy reference/frontend into the real frontend.

Do not use Google Stitch exports as implementation.

Do not use mockups as real pages.

Do not use screenshots as implementation.

Do not use ui_kits as a second component library.

Do not overwrite frontend/src/components/ui components unless explicitly approved.

## Forbidden folders for implementation

reference/docs/stitch-export/
reference/docs/mockups/
assets/mockups/
screenshots/
ui_kits/
preview/

These folders are visual references only.

## Where new code may go

Real app code may only be added to:

frontend/src/components/layout/
frontend/src/components/shared/
frontend/src/components/features/
frontend/src/pages/
frontend/src/styles/

shadcn components stay in:

frontend/src/components/ui/

## Design token rules

Prefer existing shadcn tokens:

bg-background
text-foreground
text-muted-foreground
bg-primary
text-primary-foreground
border-border
bg-card
text-card-foreground

Avoid raw hex colors inside components.

Avoid Tailwind raw color classes unless there is a clear reason.

Use frontend/src/index.css for global theme tokens.

## Required workflow before changing code

Before changing code, first produce a short analysis with:

1. Which design system files are relevant
2. Which files will be ignored
3. Which frontend files will be changed
4. Why each change is needed
5. What risks exist

Only after that, make small targeted changes.

## Build rules

After changes, run:

npm run lint
npm run build

The app must still build successfully.

## Main principle

Use the Mova Design System to polish the existing shadcn frontend.

Do not rebuild the app from mockups.

Do not replace the shadcn foundation.
