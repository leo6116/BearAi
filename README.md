# BearAi

**AI Video Script & Prompt Generator** — go from a raw idea (or a reference image) straight to
shot-ready AI video generation prompts. BearAi writes the script, breaks it into a timeline of
3–5 second scenes, and crafts one detailed, cinematography-grade prompt per scene — ready to
paste into Runway, Kling, Luma, Pika, Sora, Veo, or any other AI video generator.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript strict mode)
- **Styling:** Tailwind CSS 3 with a custom design-token system (`tailwind.config.ts` + CSS
  variables in `app/globals.css`)
- **Animation:** Framer Motion (component/page transitions, staggered reveals) + GSAP
  ScrollTrigger (scroll-driven storytelling on the landing page)
- **Smooth scroll:** Lenis
- **State:** Zustand (`store/generationStore.ts`)
- **Forms/validation:** react-hook-form + Zod
- **LLM:** `@anthropic-ai/sdk` (primary) with an OpenAI fallback, behind a provider-agnostic
  adapter (`lib/anthropic.ts`) selected via `AI_PROVIDER`
- **Icons:** lucide-react · **Toasts:** sonner

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes (when `AI_PROVIDER=anthropic`) | Your Anthropic API key. |
| `AI_PROVIDER` | No (default `anthropic`) | `anthropic` or `openai` — swaps the LLM provider used by every generation route without touching call sites. |
| `NEXT_PUBLIC_APP_NAME` | No (default `BearAi`) | Product name shown in the UI. |
| `OPENAI_API_KEY` | Only if `AI_PROVIDER=openai` | OpenAI API key. |
| `OPENAI_MODEL` | No (default `gpt-4o`) | OpenAI model id. |
| `ANTHROPIC_MODEL` | No (default `claude-sonnet-4-5`) | Anthropic model id. |

Without a valid API key the app still runs and builds — generation requests fail gracefully with
an on-brand error message instead of a stack trace.

## Scripts

```bash
pnpm dev      # start the dev server (Turbopack)
pnpm build    # production build
pnpm start    # run the production build
pnpm lint     # ESLint
```

## Architecture overview

```
app/
  page.tsx                     Landing page (Hero, HowItWorks, FeatureGrid, Marquee, FAQ…)
  generate/page.tsx             Input panel → loading sequence → redirects to a session on success
  generate/[sessionId]/page.tsx Persisted/shareable timeline view (reads from localStorage)
  about/page.tsx, not-found.tsx
  api/generate/route.ts         Orchestrates topic resolution (image→topic) + script generation
  api/generate/scene/route.ts   Regenerates a single scene with surrounding-scene context
components/
  ui/          Design-system primitives: Button, Card, Tabs, Accordion, CustomCursor,
               GrainOverlay, PageTransition, ScrollProgressBar, MagneticButton, Toasts…
  landing/     Marketing sections
  generator/   Input panel, image dropzone, loading sequence, timeline, scene cards, export menu
lib/
  anthropic.ts    Provider-agnostic structured-completion adapter (Anthropic tool-use / OpenAI
                  function-calling — never freeform-text + regex parsing)
  generation.ts   Orchestration: image→topic, script generation, single-scene regeneration,
                  each validated against the Zod schemas with one corrective retry on failure
  prompts.ts      The cinematography system prompt + user-prompt builders
  schemas.ts      Zod schemas — the single source of truth mirrored into types/index.ts
  toolSchemas.ts  JSON Schemas passed to the LLM's forced tool-use / function-calling
  sessionStorage.ts  Session persistence (see "Persistence" below)
store/
  generationStore.ts  Zustand store: input state, generation/loading step, result, per-scene
                       regeneration flags, copy-confirmation state
```

### Generation flow

1. **Text mode:** the user's topic is sent straight to `generateScript()`.
2. **Image mode:** the uploaded image is analyzed first (`previewOnly: true` on `/api/generate`)
   to produce an editable creative-direction summary. Once the user confirms/edits it, the final
   generate call is a plain text-mode request using that (possibly edited) topic — so the image is
   never re-analyzed and the user's edits are always respected.
3. The LLM is called with a **forced tool-use / function-calling schema** (never freeform text
   parsed with regex). The response is validated against the matching Zod schema; on failure it is
   retried once with a corrective instruction before surfacing an error.

### Persistence

Sessions are currently persisted to the browser's `localStorage` (`lib/sessionStorage.ts`) so a
generation is shareable via `/generate/[sessionId]` within the same browser. This keeps the demo
fully self-contained with no database. To move this to a real database later, replace the two
functions in `lib/sessionStorage.ts` (`saveSession` / `loadSession`) with calls to a `sessions`
table/collection keyed by `sessionId` — no other call site needs to change.

## Deployment

Deploys to Vercel with zero config beyond setting `ANTHROPIC_API_KEY` (and optionally the other
env vars above) in the project's environment settings.

## Known scope notes

- Sessions are local-only (see Persistence above) — a shared link only resolves in the browser
  that generated it. Swapping in a real database is a documented, isolated follow-up.
- The custom cursor, Lenis smooth scroll, and most decorative motion are disabled automatically
  under `prefers-reduced-motion` and on touch/narrow viewports.
