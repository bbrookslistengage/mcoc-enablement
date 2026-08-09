# Module Registry Design

**Date:** 2026-08-09
**Status:** Approved

## Problem

Module cross-references in content use hardcoded numbers ("Module 5", "Module 8"). If modules are reordered, nested, or renamed, every numbered reference must be found and updated manually. There is no single source of truth for module names — `ProgressOverview.tsx` maintains a hardcoded `COURSE_PARTS` array, and content authors write free-text references.

## Solution

A build-time module registry generated from doc frontmatter, consumed by a global `<ModuleLink>` component and a refactored `ProgressOverview`.

## Design

### 1. Docusaurus Plugin: `plugins/module-registry/index.ts`

A custom Docusaurus plugin that hooks into the `contentLoaded` lifecycle. At that point, all docs are parsed by the docs plugin, so the registry plugin can access every doc's metadata.

**Registry shape** (flat map keyed by slug):

```ts
type ModuleRegistry = Record<string, {
  title: string;       // from frontmatter
  path: string;        // resolved permalink
  parent?: string;     // slug of parent module (for sub-modules)
  part: string;        // e.g., "part-1-foundations"
  position: number;    // sidebar_position
}>;
```

**Slug derivation:**
- Derived from the filename (last segment of the doc ID)
- Index pages (`getting-started/index.md`) use the directory name as slug (`getting-started`)
- Child pages (`getting-started/environment-setup.md`) use their filename (`environment-setup`)

**Build-time validation:**
- Duplicate slugs cause a build failure with a clear error message
- The registry is written via `createData` and exposed as a virtual module importable as `@site/module-registry` (or similar path depending on Docusaurus plugin data conventions)

**Part metadata:**
- The plugin also reads `_category_.json` files to get part labels and ordering
- This data is included in the registry output so `ProgressOverview` can group and order modules without hardcoding

### 2. `<ModuleLink>` Component: `src/components/ModuleLink.tsx`

A React component that renders a hyperlink to a module, with the title pulled from the registry.

**Props:**
- `slug` (required): The module slug to link to
- `text` (optional): Override the displayed link text (link still points to the correct module)

**Usage in markdown:**

```md
<!-- Standard: renders title as link text -->
...the Data Graph you will build in <ModuleLink slug="data-graphs" />.

<!-- Custom text: link points to data-graphs but displays your text -->
...see <ModuleLink slug="data-graphs" text="the data modeling module" />.
```

**Rendered output:**
```html
<a href="/part-2-data/data-graphs">Data Graphs</a>
```

**Build-time validation:**
- If a slug is not found in the registry, the build fails with an error naming the file and the invalid slug

**Registration:**
- Globally registered in `src/theme/MDXComponents.tsx` alongside `Screenshot`, so no imports are needed in `.md` files

### 3. `ProgressOverview` Refactor

**Current state:** Hardcoded `COURSE_PARTS` array with all 25 modules manually listed.

**New behavior:** Consumes the registry from the plugin's generated data and dynamically builds the course structure.

**Hierarchy derivation:**
- Registry entries include `part` (directory) and `position` (sidebar_position)
- Sub-modules have a `parent` field pointing to their parent slug
- Part names and ordering come from `_category_.json` metadata included in the registry

**Accordion UI for nested modules:**
- Top-level modules render as they do now (title + checkbox)
- Modules with children render as an accordion — clicking expands to show sub-module checkboxes
- Parent module progress reflects the aggregate of its children (e.g., 2/4 sub-modules complete)
- Accordion expand/collapse state is visual only (not persisted to localStorage)

**Progress tracking compatibility:**
- Existing localStorage keys use `progress:{slug}:{lesson|assignment}`
- Slugs are filenames, so they don't change — existing progress data is preserved
- Sub-modules get their own progress keys (e.g., `progress:environment-setup:lesson`)
- Parent module progress is computed from children — no separate storage key

### 4. Content Scrub: Replace Numbered References

All existing `Module X` references in content are replaced with `<ModuleLink>` components.

**Mapping:**

| Current Reference | File(s) | Replacement Slug |
|---|---|---|
| Module 5 (consent config) | consent-fundamentals.md, consent-automation-flow.md, seeding-your-org.md | `consent-configuration` |
| Module 8 (data graphs) | consent-configuration.md, environment-setup.md | `data-graphs` |
| Module 14 (email sending) | consent-configuration.md | `email-builder` (verify slug) |
| Module 23 (Einstein scoring) | environment-setup.md | `predictive-ai` (verify slug) |
| "Modules 2-4" (range) | consent-configuration.md | Rewrite as prose with individual `<ModuleLink>` components |

### 5. Linter Rule

Add a rule to `scripts/lint-content.sh` that flags any text matching `Module \d+` (case-insensitive) as an error. This prevents future numbered references from being introduced.

### 6. CLAUDE.md Update

Add the following to the `CLAUDE.md` content rules and architecture sections so future sessions follow the convention:

**Architecture section — add:**
> **Module registry:** A Docusaurus plugin (`plugins/module-registry/`) scans all doc frontmatter at build time and generates a registry mapping slugs to titles and paths. The registry is consumed by `<ModuleLink>` and `ProgressOverview`. Module titles are defined in frontmatter — the registry is the derived single source of truth.

**Content rules section — add:**
> - **No numbered module references** — never write "Module 5" or "Module 8". Always use `<ModuleLink slug="..." />` to reference other modules. The component renders the module title as a hyperlink, pulled from the build-time registry.

**Screenshot component section — update to mention ModuleLink:**
> **ModuleLink component:** `src/components/ModuleLink.tsx` is globally registered via `src/theme/MDXComponents.tsx`. Use it in any `.md` file without importing:
> ```md
> <ModuleLink slug="data-graphs" />
> <ModuleLink slug="data-graphs" text="custom link text" />
> ```
> The slug is the filename (without extension) of the target module. The component renders the module's frontmatter title as a hyperlink.

## Files Changed

### New Files
- `plugins/module-registry/index.ts` — Docusaurus plugin
- `src/components/ModuleLink.tsx` — Global component

### Modified Files
- `docusaurus.config.ts` — Register the custom plugin
- `src/theme/MDXComponents.tsx` — Register `ModuleLink` globally
- `src/components/ProgressOverview.tsx` — Replace hardcoded array with dynamic registry; add accordion UI
- `scripts/lint-content.sh` — Add `Module \d+` linter rule
- `CLAUDE.md` — Add module registry conventions
- ~6 content files under `docs/` — Replace numbered references with `<ModuleLink>`

### Unchanged
- Frontmatter (already the source of truth)
- `sidebar_position`, `_category_.json` files (consumed as-is)
- `ProgressCheckbox.tsx` (slug-based keys still work)
- `DocItem/Layout.tsx` (unchanged)

## Build-time Guarantees
- Duplicate slugs → build fails
- Unknown slug in `<ModuleLink>` → build fails
- `Module \d+` in content → linter error
