# ADR 0009: Use shadcn/ui and Tailwind CSS for UI Implementation

## Status

Accepted

## Context

Mova requires a responsive and professional user interface for workout planning, exercise browsing, logging, dashboards, forms, tables, and admin functionality.

The team wanted to create a modern UI while avoiding the need to design every component from scratch. The team was already aware of shadcn/ui and wanted to apply it for the first time in a real project.

## Decision

We decided to use shadcn/ui together with Tailwind CSS.

## Reasons

shadcn/ui and Tailwind CSS were selected because they provide:

- Modern, beautiful, and visually consistent UI components
- Faster implementation of common interface elements (dialogs, tables, forms, charts)
- A highly professional look without building all components manually from scratch
- Good compatibility with React and TypeScript
- Flexibility to customize components when needed (copy-paste model rather than heavy node_modules dependencies)
- A good learning opportunity for a modern frontend design workflow

## Alternatives Considered

Possible alternatives would have included:

- Writing all CSS and components manually
- Material UI (MUI)
- Bootstrap
- Chakra UI
- DaisyUI

These alternatives were not selected because shadcn/ui offered a superior balance between professional component quality, customizability, and modern design practices.

## Consequences

### Positive

- The frontend looks highly professional and polished with less manual UI work.
- Reusable components improve consistency across the application.
- Tailwind CSS allows fast styling directly in components.
- The team gained experience with a modern UI workflow.

### Negative

- shadcn/ui requires understanding how generated components are integrated into the project.
- Tailwind utility classes can become verbose if not structured carefully.
- The team must keep custom design decisions consistent across the application.
