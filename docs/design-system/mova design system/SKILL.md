---
name: mova-design
description: Use this skill to generate well-branded interfaces and assets for Mova (a shadcn-styled gym tracker app), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and a shadcn-faithful UI kit for prototyping. Apply when generating UI for Mova, building screens for the GymTracker codebase, or composing flows out of shadcn primitives.
user-invocable: true
---

# Mova Design Skill

Mova is a gym tracker web app built on **shadcn/ui** (Tailwind v4, Geist Variable, crimson red accent on warm neutrals). This skill teaches you how to design FOR Mova: brand voice, tokens, components, and the shadcn rules to follow.

## Step 1 — load brand context

Read these files in this skill in order:

1. **README.md** — Voice, visual foundations, iconography, layout rules. Read this every time before designing.
2. **colors_and_type.css** — All tokens as CSS variables + semantic helpers (`.mova-h1`, `.mova-stat`, etc). Import this first in any HTML artifact.
3. **ui_kits/mova-app/** — Faithful recreation of the shipped frontend (Home, Exercises, Login, Register) AND the full shadcn primitive set rebuilt as plain React+CSS so you can compose flows without a build step.
4. **reference/frontend/** — verbatim source of the upstream shadcn-React codebase. Read it as the source of truth.
5. **reference/shadcn-skill.md** — the official shadcn agent skill (uploaded by the user). All its rules apply — see the "shadcn rules to honor" section below.

## Step 2 — pick the right component

If a need is in this table, use the named primitive. Don't write a styled `<div>` for it.

| Need                                | Use                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Action / submit                     | `Button` (variants: default, outline, ghost, destructive, secondary, link)                          |
| Status pill                         | `Badge` (default, secondary, outline, destructive)                                                  |
| Form input                          | `Input`, `Textarea`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Slider`             |
| 2–7 choices                         | `ToggleGroup` + `ToggleGroupItem` (not a row of `Button`)                                            |
| Search w/ icon, kg-suffix input     | `InputGroup` + `InputGroupAddon` + `InputGroupInput`                                                 |
| Container                           | `Card` + `CardHeader` + `CardTitle` + `CardDescription` + `CardContent` + `CardFooter`               |
| Tabular data                        | `Table` + `TableHeader` + `TableBody` + `TableRow` + `TableHead` + `TableCell`                       |
| User identity                       | `Avatar` + `AvatarImage` + `AvatarFallback`  *(fallback is required for a11y)*                       |
| Navigation tabs                     | `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent`                                                  |
| Modal confirmation / form           | `Dialog` + `DialogTitle` + `DialogDescription` + `DialogContent` + `DialogFooter`                    |
| Destructive confirmation            | `AlertDialog` (cancel + destructive action, no other content)                                        |
| Side panel                          | `Sheet` (`side="right"` default)                                                                     |
| Bottom drawer (mobile)              | `Drawer`                                                                                              |
| Row actions / overflow menu         | `DropdownMenu` + `DropdownMenuGroup` + `DropdownMenuItem`                                            |
| Hover hint                          | `Tooltip` (single-line; for richer use `HoverCard`)                                                  |
| Inline expandable                   | `Accordion` + `AccordionItem` + `AccordionTrigger` + `AccordionContent`                              |
| Progress                            | `Progress` (linear bar)                                                                              |
| Empty state                         | `Empty` (icon + title + description + action)                                                        |
| Error / info callout                | `Alert` + `AlertTitle` + `AlertDescription`                                                          |
| Loading                             | `Skeleton` for content shapes; `Spinner` only for buttons / inline                                   |
| Toast                               | `toast()` from sonner (or our `toast()` helper). Never inline "Saved!" text.                         |
| Page nav crumbs                     | `Breadcrumb`                                                                                          |
| Page count                          | `Pagination`                                                                                          |
| Hairline                            | `Separator` (never `<hr>` or a styled border-top div)                                                 |
| Long list / scroll viewport         | `ScrollArea`                                                                                          |
| App shell with side nav             | `Sidebar` (admin only — user-facing screens use the top header)                                      |
| Body weight / volume / freq chart   | `Chart` (Recharts wrapper) — line for weight, bar for frequency                                      |

## Step 3 — shadcn rules to honor

These are enforced. They mirror **reference/shadcn-skill.md** which the user uploaded — read it for the full rationale and the "Incorrect / Correct" pairs.

### Forms (always)

- Form layout uses **`FieldGroup` + `Field`**. Never `div` with `gap-*` or `space-y-*` for form layout.
- Validation: **`data-invalid` on `Field`**, **`aria-invalid` on the control**, optional `FieldError` for the message.
- Disabled: `data-disabled` on `Field`, `disabled` on the control.
- Buttons inside inputs use **`InputGroup` + `InputGroupAddon`** with `InputGroupInput`/`InputGroupTextarea`. Never raw `Input` inside `InputGroup`.
- 2–7 mutually-exclusive options: **`ToggleGroup`** (segmented control), not a manual row of `Button`s with active state.
- Group related radios/checkboxes with **`FieldSet` + `FieldLegend`**, not a `div` with a heading.

### Composition (always)

- Items live inside their Group: `SelectItem` → `SelectGroup`, `DropdownMenuItem` → `DropdownMenuGroup`, `CommandItem` → `CommandGroup`.
- `Dialog`, `AlertDialog`, `Sheet`, `Drawer` **must have a Title** — use `className="sr-only"` if visually hidden. Otherwise screen readers can't announce them.
- Use full **Card composition** (`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`) — don't dump everything in `CardContent`.
- `Button` has no `isPending` / `isLoading` prop. Compose with `Spinner` + `data-icon="inline-start"` + `disabled`:
  ```tsx
  <Button disabled><Spinner data-icon="inline-start" />Logging in…</Button>
  ```
- `TabsTrigger` must be inside `TabsList`.
- `Avatar` always needs `AvatarFallback` for when the image fails.

### Use components, not custom markup

- Callouts → `Alert`. Empty states → `Empty`. Toast → `toast()`. Hairline → `Separator`. Loading shape → `Skeleton`. Status pill → `Badge`.
- Don't build any of those as styled `div`s.

### Styling

- `className` is for **layout**, not styling. Don't override component colors or typography.
- **No `space-x-*` / `space-y-*`.** Use `flex` with `gap-*`. Vertical stacks: `flex flex-col gap-*`.
- Use **`size-*`** when width and height are equal (`size-10`, not `w-10 h-10`).
- Use **`truncate`** shorthand, not `overflow-hidden text-ellipsis whitespace-nowrap`.
- **No manual `dark:` overrides.** Use semantic tokens (`bg-background`, `text-muted-foreground`) which already cover dark.
- Use **`cn()`** for conditional classes — no manual template-literal ternaries.
- **No manual `z-index`** on overlay components. Dialog/Sheet/Popover/etc handle stacking themselves.
- **Semantic colors only.** `bg-primary`, `text-muted-foreground` — never `bg-blue-500` or `text-emerald-600`.
- For status colors use `Badge` variants, never raw Tailwind colors.

### Icons

- Icons inside `Button` carry `data-icon="inline-start"` or `data-icon="inline-end"`. The button handles sizing.
- **No sizing classes on icons inside components.** Components size their own icons via CSS.
- Pass icons as components/objects, not string keys: `icon={CheckIcon}`, never a string lookup.

## Step 4 — Mova-specific decisions on top of shadcn

These resolve choices that shadcn leaves open:

- **Brand red.** Two reds: `--primary` (#B51B3A, deep) and `--destructive` (#E11D48, bright). `<Button variant="default">` uses `--primary`. The brighter `--destructive` is reserved for `variant="destructive"`, the focus indicator on errors, and the red dot in the logo. Marketing CTAs in mockups lean on `--destructive`; in product, stick with `--primary`.
- **Card.** Default Mova card = `rounded-xl bg-card ring-1 ring-foreground/10 py-4`. No border, no shadow — the ring IS the elevation. Don't add `shadow-md` "just to lift it".
- **Card variants.** A 4px destructive-coloured left inset can be used as `accent` for one "current value" card per dashboard row. Never more than one accent card adjacent.
- **Eyebrows over headings on dashboard tiles.** `text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground` above a `text-3xl font-semibold` value. See the Stat Card preview.
- **Icons.** Lucide is the recommended set (`stroke-2`, `currentColor`). The repo doesn't ship its own icon library yet — flag substitution if the team picks another set.
- **Type.** Geist Variable, self-hosted from `fonts/` via `@font-face`. No fallbacks needed beyond the system-ui stack.
- **Voice.** Direct, present tense, second person. Sentence case for headlines and buttons. ALL CAPS for eyebrows and tags. Emoji as flourish only (a `👋` after "Good morning" is fine; `💪🔥` is not).
- **Layout.** `max-w-5xl` (64rem) main container, `max-w-sm` (24rem) auth card. Top header is `h-14` sticky with backdrop-blur over `bg-background/60`. Admin uses `Sidebar`; everything else uses the top header.

## Step 5 — design behaviour for prototypes vs production

- **Throwaway prototypes / mocks / slides** — write static HTML, copy assets out, use the React-in-browser primitives in `ui_kits/mova-app/`. Reference `colors_and_type.css` for tokens. No build step.
- **Production code (in the actual `GymTracker` codebase)** — use the **real shadcn CLI** (`npx shadcn@latest add …`) to add components. The components in this design system's UI kit are *for design-time prototyping*; the production codebase pulls real shadcn source. Always run `npx shadcn@latest docs <component>` and fetch the URLs before composing — never guess the API.

If the user invokes this skill without other guidance, ask what flow they want to build (auth / dashboard / logger / library / progress / plans / admin), what surface (desktop / mobile / both), and whether the output is a throwaway mock or production code. Then act as an expert designer and ship.
