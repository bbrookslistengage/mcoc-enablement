# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Self-paced enablement course for Salesforce Marketing Cloud Advanced (MCA), built with Docusaurus 3.10. Fictional client: **LEOptical** (eyecare/eyewear, B2C). 25 modules across 6 parts, modeled after The Odin Project's teaching philosophy.

## Commands

- `npm start` — dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check (`tsc`)
- `npm run lint:content` — run content linter on all docs
- `npm run lint:content docs/part-1-foundations/getting-started.md` — lint a specific file
- `npm run serve` — serve production build locally
- `npm run clear` — clear Docusaurus cache

Pre-commit hook runs `lint-staged`, which applies `scripts/lint-content.sh` to staged `docs/**/*.md` files.

## Content Pipeline

Two commands for producing module content:

- `/research-module {slug}` — researches the MCA platform feature for a module, writes structured research to `.planning/research/{slug}.md`. Clear context after this completes.
- `/write-module {slug}` — drafts the module from research, runs fact-checker (adds `<!-- VERIFY -->` flags for unsupported claims), runs content linter, updates `.planning/PROGRESS.md`.

Agents (dispatched by the commands, not invoked directly):
- `researcher` — web research + internal spec gathering
- `module-writer` — writes the full module draft
- `fact-checker` — cross-references draft against research, flags hallucinations

## Architecture

**Docusaurus config:** `docusaurus.config.ts` — docs serve from root (`routeBasePath: '/'`), blog disabled, dark mode disabled. Sidebar is auto-generated from directory structure (`sidebars.ts`).

**Design tokens:** All visual values live in `src/css/tokens.css` as CSS custom properties. `src/css/custom.css` maps tokens to Infima variables and defines all component styles. No raw hex values, no magic numbers outside the token file. No icon libraries — individual SVGs only, placed in `src/icons/`.

**Progress tracking:** Client-side localStorage. `ProgressCheckbox` (lesson/assignment checkboxes per module) and `ProgressOverview` (course overview page with progress bar). Components communicate via a `progress-updated` custom event on `window`. Storage key format: `progress:{moduleSlug}:{lesson|assignment}`.

**Swizzled theme:** `src/theme/DocItem/Layout.tsx` wraps the default DocItem layout to inject `ProgressCheckbox` and prev/next navigation into every doc page.

**Course overview page:** `src/pages/index.tsx` renders the hero and `ProgressOverview`. The module list is hardcoded in `ProgressOverview.tsx` as `COURSE_PARTS` — update this array when adding/removing modules.

**Content:** `docs/` contains module markdown organized by part (`part-1-foundations/`, `part-2-data/`, etc.). Each part has a `_category_.json` for sidebar ordering.

**Screenshot component:** `src/components/Screenshot.tsx` is globally registered via `src/theme/MDXComponents.tsx`. Use it in any `.md` or `.mdx` file without importing:
```mdx
<Screenshot src="/img/{module-slug}/{filename}.png" alt="..." caption="Optional caption" />
```
Screenshots live in `static/img/{module-slug}/`, named `{module-number}-{description}.png`. The component renders with a rounded border, shadow, and optional italic caption.

## Content Rules (enforced by linter)

The content linter (`scripts/lint-content.sh`) enforces rules from `.planning/WRITING-STYLE-GUIDE.md`. Key constraints:

- **No em dashes, exclamation marks, semicolons, or ellipses** in prose
- **Banned words:** leverage, utilize, robust, seamless, comprehensive, powerful, exciting, journey, ecosystem, solution, optimize, empower, delve, harness, holistic, paradigm, synergy, landscape, realm, streamline, facilitate, and more (see full list in linter)
- **Banned phrases:** "let's dive in", "it's important to note", "in order to", "make sure to", "feel free to", "Congratulations", "Great job", etc.
- **Banned admonitions:** `:::note` and `:::danger` (use `:::info`, `:::warning`, `:::tip`, `:::caution`)
- **Terminology:** "Data 360" not "Data Cloud"; "MCA" not "Marketing Cloud Growth"
- **Unresolved `<!-- VERIFY -->` comments** produce warnings (not errors)

The linter strips fenced code blocks before checking, so code examples are exempt.

## Module Format

Fixed section order in every module markdown file (see `.planning/MODULE-TEMPLATE.md`):
1. **Overview** — context, why it matters, grounded in LEOptical
2. **Lesson overview** — bullet list of topics (always starts with the same intro sentence)
3. **Lesson body** — freeform H2 subsections (NOT a single "Lesson" heading)
4. **Assignment** — tasks using client framing when relevant
5. **Success Criteria** — verifiable checkbox items
6. **Knowledge check** — 4-8 reflection questions
7. **Additional resources** — conditional section

Frontmatter requires `sidebar_position`, `title`, and `description`.

## Writing Style

Tone: direct, honest, conversational but not chatty. Second person, active voice, present tense. Short sentences. No filler, no hedging, no forced enthusiasm. Learners are experienced Salesforce consultants, not beginners. Flag uncertainty with `<!-- VERIFY -->` comments. See `.planning/WRITING-STYLE-GUIDE.md` for the full guide.

## Planning Docs

All specs and planning docs live in `.planning/` (not in `docs/`):
- `.planning/PROGRESS.md` — master project tracker
- `.planning/WRITING-STYLE-GUIDE.md` — tone, banned words, anti-hallucination rules
- `.planning/DESIGN-TOKENS.md` — token naming and usage rules
- `.planning/MODULE-TEMPLATE.md` — module format reference
- `.planning/platform-gotchas.md` — confirmed MCA platform quirks
- `.planning/specs/` — data model, seed data, client specs
