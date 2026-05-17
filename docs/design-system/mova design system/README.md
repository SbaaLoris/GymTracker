# Mova Design System

> **Mova** is a gym tracker web app built on **shadcn/ui** with a crimson-red accent, warm-neutral surfaces, and the **Geist** typeface. This design system captures the visual language used in the Mova frontend so designs made with this system look like they belong to the product.

This system is derived from a single source:
- **Codebase:** [SbaaLoris/GymTracker](https://github.com/SbaaLoris/GymTracker) — the live frontend (Vite + React 19 + TS + Tailwind v4 + shadcn/ui) is the source of truth. Stitch mockups under `docs/mockups/` are early design explorations, not all implemented yet — treat them as direction, not contract.

For deeper context on the product, browse the repo directly: it includes architecture docs, OpenAPI spec, and domain modelling notes.

---

## Index

| File | What it is |
| --- | --- |
| `README.md` | this file — overview, voice, visual foundations, iconography |
| `colors_and_type.css` | All design tokens as CSS variables, plus semantic helpers (`.mova-h1`, `.mova-stat`, `.mova-card`, …) |
| `fonts/geist-*.woff2` | Self-hosted Geist Variable (3 unicode-range subsets) |
| `assets/logo.svg` | Mova wordmark — uses `currentColor` for the wordmark and `--mova-dot` CSS var (default `#E13636`) for the red dot |
| `assets/favicon.svg` | Square favicon |
| `assets/mockups/*.png` | Stitch design mockups for the unbuilt screens (Dashboard / Logger / Plan / Progress / Library / Admin) |
| `preview/*.html` | Token + component preview cards — surfaced as cards in the Design System tab |
| `ui_kits/mova-app/index.html` | Interactive demo — Home / Exercises / Login / Register (shipped) + **Components** route (every shadcn primitive) |
| `ui_kits/mova-app/Primitives.jsx` | Button, Card, Badge, Input, Field*, Separator, Logo |
| `ui_kits/mova-app/FormControls.jsx` | Select, Checkbox, Switch, Radio, ToggleGroup, Slider, Textarea, InputGroup, FieldSet, FieldLegend, FieldError, Label |
| `ui_kits/mova-app/Overlays.jsx` | Dialog, AlertDialog, Sheet, Drawer, Popover, Tooltip, HoverCard, DropdownMenu |
| `ui_kits/mova-app/DataDisplay.jsx` | Tabs, Table, Avatar, Accordion, Progress, Pagination, Breadcrumb, ScrollArea |
| `ui_kits/mova-app/Feedback.jsx` | Alert, Empty, Skeleton, Spinner, Toaster + `toast()` |
| `ui_kits/mova-app/*.css` | `kit.css` (frontend recreation) + `shadcn-components.css` (the primitive set) |
| `reference/frontend/` | Verbatim copy of the upstream `frontend/src/` so you can read the real source |
| `reference/docs/` | Mockup PNGs + Stitch HTML exports — design reference only |

---

## Product context

Mova lets fitness enthusiasts:
1. browse a **curated master list of exercises** maintained by an Admin,
2. build and save **workout plans** (or pick an Admin-made template),
3. **log a session** — sets, reps, weight, or cardio time/intensity,
4. track **body weight** over time and **export everything** to CSV/PDF,
5. submit a **request** for a new exercise to be added.

Two roles share the UI: **User** (default) and **Admin** (manages the master list, approves requests). The current shipped surface is small (Home, Exercises, Login, Register); Workout Logger / Progress / Plans / Admin Console exist as Stitch mockups but aren't built yet.

---

## Content fundamentals

**Voice:** direct, performance-tuned, short. Second person ("you"), present tense, verbs the user can act on. Headlines are nouns or imperatives — almost never adjective-led.

**Casing:**
- Headlines: Sentence case for titles (`Welcome back`, `Create account`, `Mova Gym Tracker`).
- Buttons: Sentence case (`Login`, `Create account`, `Go to Exercises →`).
- Eyebrows / micro-labels: ALL CAPS with `0.08em` tracking (`PERFORMANCE INSIGHTS`, `THIS WEEK`, `CURRENT WEIGHT`).
- Tags / badges: ALL CAPS short (`USER`, `ADMIN`, `PENDING`, `QUADS`).

**Length:** one line for headlines, ≤14 words for descriptions, ≤4 words for CTAs.

**Numerics:** big — the design system gives stat numbers their own scale (`--stat-size: 3rem`). Always pair a numeric stat with a tiny uppercase eyebrow above it.

**Emoji:** sparingly, and never as nouns. The dashboard greeting "Good morning, Loris 👋" uses 👋 as a punctuation flourish, not as the subject. Never use 🔥💪 — those would feel off-brand.

**Examples — Yes:**
- "Ready to hit your targets today?"
- "Browse 450+ curated high-performance movements."
- "Own your performance data."
- "Welcome back"
- "First demo page." *(deliberately self-aware on an unfinished screen)*

**Examples — No:**
- "Unleash your inner athlete!" (hype, no verb)
- "Empowering your fitness journey." (adjective stack, no concrete outcome)
- "💪 Get pumped! 🔥" (emoji-led, exclamation)

---

## Visual foundations

### Colors

Two pillars: a **warm-neutral background ramp** (very subtle 107° hue — not pure gray) and a **crimson red** that runs from light pink through to deep oxblood.

| Token | Light value | Use |
| --- | --- | --- |
| `--background` | `oklch(1 0 0)` | page bg |
| `--foreground` | `oklch(0.153 0.006 107.1)` | body text, headlines |
| `--muted` / `--accent` | `oklch(0.966 0.005 106.5)` | chip bg, hover, inset surfaces |
| `--border` / `--input` | `oklch(0.93 0.007 106.5)` | hairlines, input borders |
| `--card` | `oklch(1 0 0)` | card surface |
| `--primary` | `oklch(0.505 0.213 27.518)` ≈ #B51B3A | **Button "default" / brand action** |
| `--destructive` | `oklch(0.577 0.245 27.325)` ≈ #E11D48 | destructive actions (Logout, Delete) AND the bright "marketing red" used in mockup CTAs |
| `--ring` | `oklch(0.737 0.021 106.9)` | focus ring |
| `--chart-1…5` | `0.444 → 0.808` crimson ramp | charts, progress, accents |

> ⚠️ Two reds live side by side. The codebase calls the **deeper** one `primary` (used by `<Button variant="default">`) and the **brighter** one `destructive`. The Stitch mockups lean on `destructive` for CTAs — when in doubt, prefer the deeper `primary` on real buttons.

A full **dark mode** ramp is defined in `colors_and_type.css` (see `.dark` block).

### Type

Single family: **Geist Variable** (100–900). Self-hosted from `fonts/` — three subsets (latin / latin-ext / cyrillic) loaded via `@font-face` in `colors_and_type.css`.

- Display 48 / 700 / -0.025em — landing headlines ("Progress.")
- H1 36 / 700 / -0.02em — page titles ("Good morning, Loris")
- H2 24 / 600 — section headers
- H3 18 / 600 — card titles
- Eyebrow 12 / 500 / +0.1em / UPPER — pretitles, eyebrows
- Body 14 / 400 — default
- Stat 48 / 700 / -0.03em — big numerals ("128", "78.4")

### Backgrounds

Solid color, never gradients. Two surfaces dominate:
- **Light app bg:** `--background` (pure white) under main content.
- **Off-white quiet surface:** `oklch(0.988 0.003 106.5)` under sidebars and dashboard inserts — a 1.2% warm tint that reads "calm".
- **Auth surface:** `--muted` (the warm gray) — fills the whole viewport, the auth card sits in the middle.

No textures, no hand-drawn illustrations, no photographic full-bleed in chrome. Photography appears **only** in exercise-card thumbnails in the Stitch mockups (real fitness/gym photos, dark moody tones). When real photos aren't available, render a dark gradient placeholder with a faint dumbbell icon — never invent fake imagery.

### Animation & motion

Minimal. Default transitions are `120ms ease` for colour, background, and ring. Active state is `translateY(1px)` for ~60ms — the button feels physically pressed. There are no bouncy springs, no scroll-triggered reveals, no parallax. Charts render statically.

### Hover / press states

- **Hover** = same color, slightly darker. Primary buttons use `filter: brightness(0.92)` not a different bg. Outline buttons gain `--muted` bg. Ghost gains `--muted` bg.
- **Press** = `translateY(1px)` translation (skipped for menu-opening buttons, `[aria-haspopup]`).
- **Focus** = 3px ring with `--ring` color at ~50% opacity, plus border shifts to `--ring`.

### Borders & shadows

- **Default card** = no shadow, just `ring-1 ring-foreground/10` (a 1px outline at 10% foreground). This is the "default elevation" — almost invisible, very shadcn.
- **Inputs / hairlines** = 1px `--border` (warm-neutral).
- **Floating CTA (FAB)** uses `0 8px 24px oklch(...crimson.../0.35)` — coloured glow.
- No protection gradients, no inset shadows. Capsules (pill badges) sit on plain bg without their own shadow.

### Radii

`--radius: 0.45rem` is the base (7.2px). The ladder:
- `sm` 4.3 — chip
- `md` 5.8 — small button
- `lg` 7.2 — default button
- `xl` 10  — **cards** (`rounded-xl`)
- `4xl` 18.7 — **pill badges** (`rounded-4xl`)

Pill badges look fully round at h-5 (20px); cards use a softer 10px. There are no sharp corners anywhere.

### Layout

- App container is `max-w-5xl` (64rem ≈ 1024px) centered, with `lg:px-8` (32px gutter). Auth screens use `max-w-sm` (24rem).
- Sticky top header at `h-14` (56px) with a 1px bottom border + glassmorphic backdrop blur over a `bg-background/60`.
- One single `<main>` column. No sidebars in the current shipped surface; the Stitch dashboard mockups also use a single column.

### Transparency & blur

Used in **one place**: the sticky header has `bg-background/60` with `backdrop-blur` — the page subtly shows through as you scroll. Otherwise everything is solid.

### Cards (the workhorse element)

```
rounded-xl  bg-card  ring-1 ring-foreground/10  py-4
```

- Always 1rem vertical padding, content via `card-header` / `card-content` which pad `px-4`.
- A border-left accent variant (`box-shadow: inset 4px 0 0 var(--destructive), ring-1 …`) is used for "current weight" style emphasis tiles in the dashboard mockup. Use sparingly — at most one accent card per row.

---

## Iconography

The shipped frontend has **no in-product icon library** — only a few SVGs in `public/icons.svg` (bluesky/discord/github/x/social/documentation) inherited from the Vite starter. None of them are used in the actual app's `src/` code.

Recommendation: use **Lucide** (the conventional pairing for shadcn) when an icon is needed. Stroke 2, round caps and joins, currentColor. The Stitch mockups show this set in use — dumbbell, run, eye, plus, check, bell, calendar, clock, download, search, more-horizontal, clipboard.

> ⚠️ **Substitution flag:** the repo doesn't ship a real icon library, so this design system uses Lucide as the recommended set. If the team adopts a different one (Hugeicons, Heroicons), swap and re-flag.

**Emoji** — see Content Fundamentals. Used as flourishes, not nouns. Lone emoji like 👋 after a greeting is fine; rows of emoji 💪🔥📈 are not.

**Unicode arrows** — `→` is used in CTA copy ("Go to Exercises →") instead of an icon. This is a deliberate Mova affordance; keep it.

---

## How to use this system

1. Pull `colors_and_type.css` into any HTML artifact — every variable + semantic helper class is defined there.
2. Use `assets/logo.svg` for the wordmark. The wordmark is `currentColor`-aware, so you can color it via parent `color` (and the red dot stays red).
3. Look at `ui_kits/mova-app/` for ready-made primitives (Button, Card, Badge, Input, Field) — these match the upstream component API one-to-one.
4. When designing surfaces that don't yet exist in the codebase (Dashboard, Logger, Progress, Plans, Admin), follow the **Stitch mockups under `reference/docs/mockups/`** for layout direction, but use the **codebase tokens + components** for the actual chrome.

---

## Caveats

- **Font.** Geist is now self-hosted from `fonts/` (matches upstream `@fontsource-variable/geist`). No web-font fallback needed.
- **Icons not in repo.** Lucide is recommended; flag substitution if the team picks a different set.
- **Mockups vs. shipped.** The elaborate Dashboard / Logger / Progress / Library / Admin screens live in `reference/docs/stitch-export/` and `reference/docs/mockups/` — they are NOT in the shipped frontend yet. Treat them as the design direction but verify against `reference/frontend/` when implementing.
