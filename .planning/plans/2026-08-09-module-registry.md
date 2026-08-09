# Module Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Docusaurus plugin that generates a module registry from doc frontmatter, consumed by a `<ModuleLink>` component and a dynamic `ProgressOverview`, eliminating all hardcoded module numbers.

**Architecture:** A custom Docusaurus plugin scans all docs at build time via `loadContent`, reads frontmatter and `_category_.json` files, builds a flat slug-to-metadata registry, and exposes it via `setGlobalData`. A `<ModuleLink>` component (globally registered) renders hyperlinks using registry data. `ProgressOverview` is refactored to consume the same registry with accordion support for nested modules.

**Tech Stack:** Docusaurus 3.10, React 19, TypeScript (strict mode), gray-matter (frontmatter parsing)

## Global Constraints

- TypeScript strict mode (`tsconfig.json` extends `@docusaurus/tsconfig`)
- No raw hex values or magic numbers (design token system in `src/css/tokens.css`)
- No icon libraries — individual SVGs only
- Content linter (`scripts/lint-content.sh`) runs on pre-commit via husky/lint-staged
- Docusaurus docs serve from root (`routeBasePath: '/'`)
- All docs use `.md` extension (not `.mdx` except rare cases)

---

### Task 1: Module Registry Plugin

**Files:**
- Create: `plugins/module-registry/index.ts`
- Modify: `docusaurus.config.ts:5` (add plugin registration)
- Modify: `package.json` (add `gray-matter` dependency)

**Interfaces:**
- Consumes: nothing (reads filesystem directly)
- Produces: Global data accessible via `usePluginData('module-registry')` with shape:
  ```ts
  {
    modules: Record<string, {
      title: string;
      path: string;
      parent?: string;
      part: string;
      position: number;
    }>;
    parts: Array<{
      dirName: string;
      label: string;
      position: number;
      description: string;
    }>;
  }
  ```

- [ ] **Step 1: Install gray-matter**

```bash
npm install gray-matter
```

This package parses YAML frontmatter from markdown files. It's the standard choice for this in the Node ecosystem.

- [ ] **Step 2: Create the plugin directory**

```bash
mkdir -p plugins/module-registry
```

- [ ] **Step 3: Write the plugin**

Create `plugins/module-registry/index.ts`:

```ts
import type {LoadContext, Plugin} from '@docusaurus/types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ModuleEntry {
  title: string;
  path: string;
  parent?: string;
  part: string;
  position: number;
}

interface PartEntry {
  dirName: string;
  label: string;
  position: number;
  description: string;
}

interface RegistryData {
  modules: Record<string, ModuleEntry>;
  parts: PartEntry[];
}

export default function moduleRegistryPlugin(context: LoadContext): Plugin {
  const docsDir = path.join(context.siteDir, 'docs');

  return {
    name: 'module-registry',

    async loadContent(): Promise<RegistryData> {
      const modules: Record<string, ModuleEntry> = {};
      const parts: PartEntry[] = [];
      const slugsSeen = new Map<string, string>();

      // Read top-level part directories
      const topDirs = fs.readdirSync(docsDir, {withFileTypes: true})
        .filter(d => d.isDirectory() && d.name.startsWith('part-'));

      for (const partDir of topDirs) {
        const partPath = path.join(docsDir, partDir.name);
        const categoryFile = path.join(partPath, '_category_.json');

        if (!fs.existsSync(categoryFile)) continue;

        const category = JSON.parse(fs.readFileSync(categoryFile, 'utf-8'));
        parts.push({
          dirName: partDir.name,
          label: category.label,
          position: category.position,
          description: category.description ?? '',
        });

        // Process all markdown files in this part (including subdirectories)
        processDirectory(partPath, partDir.name, undefined, modules, slugsSeen);
      }

      // Sort parts by position
      parts.sort((a, b) => a.position - b.position);

      return {modules, parts};
    },

    async contentLoaded({content, actions}) {
      const {setGlobalData} = actions;
      const registryData = content as RegistryData;
      setGlobalData(registryData);
    },
  };
}

function deriveSlug(filePath: string): string {
  const basename = path.basename(filePath, path.extname(filePath));
  if (basename === 'index') {
    return path.basename(path.dirname(filePath));
  }
  return basename;
}

function derivePermalink(filePath: string, docsRoot: string): string {
  const relative = path.relative(docsRoot, filePath);
  const withoutExt = relative.replace(/\.(md|mdx)$/, '');
  const withoutIndex = withoutExt.replace(/\/index$/, '');
  return '/' + withoutIndex;
}

function processDirectory(
  dirPath: string,
  partName: string,
  parentSlug: string | undefined,
  modules: Record<string, ModuleEntry>,
  slugsSeen: Map<string, string>,
): void {
  const entries = fs.readdirSync(dirPath, {withFileTypes: true});
  const docsRoot = path.resolve(dirPath, '..', '..');

  // Check if this is a subcategory directory (has _category_.json and is not a part dir)
  const isSubcategory = parentSlug === undefined
    ? false
    : fs.existsSync(path.join(dirPath, '_category_.json'));

  // Determine the parent slug for items in subcategory directories
  let subcategoryParent = parentSlug;

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // This is a subcategory (e.g., getting-started/, domain-setup/)
      const subCategoryFile = path.join(fullPath, '_category_.json');
      if (!fs.existsSync(subCategoryFile)) continue;

      // The directory name becomes the parent slug for its children
      const dirSlug = entry.name;

      // Check for index.md in the subcategory
      const indexFile = ['index.md', 'index.mdx']
        .map(f => path.join(fullPath, f))
        .find(f => fs.existsSync(f));

      if (indexFile) {
        const {data: fm} = matter(fs.readFileSync(indexFile, 'utf-8'));
        registerModule(dirSlug, {
          title: fm.title ?? entry.name,
          path: derivePermalink(indexFile, path.resolve(dirPath, '..')),
          part: partName,
          position: fm.sidebar_position ?? 0,
        }, indexFile, modules, slugsSeen);
      }

      // Process children with this directory as parent
      processDirectory(fullPath, partName, dirSlug, modules, slugsSeen);
    } else if (entry.name.match(/\.(md|mdx)$/) && entry.name !== 'index.md' && entry.name !== 'index.mdx') {
      const {data: fm} = matter(fs.readFileSync(fullPath, 'utf-8'));
      const slug = deriveSlug(fullPath);

      const moduleEntry: ModuleEntry = {
        title: fm.title ?? slug,
        path: derivePermalink(fullPath, path.resolve(dirPath, parentSlug !== undefined ? '../..' : '..')),
        part: partName,
        position: fm.sidebar_position ?? 0,
      };

      // If we're inside a subcategory, set the parent
      if (parentSlug !== undefined) {
        moduleEntry.parent = parentSlug;
      }

      registerModule(slug, moduleEntry, fullPath, modules, slugsSeen);
    }
  }
}

function registerModule(
  slug: string,
  entry: ModuleEntry,
  filePath: string,
  modules: Record<string, ModuleEntry>,
  slugsSeen: Map<string, string>,
): void {
  if (slugsSeen.has(slug)) {
    throw new Error(
      `[module-registry] Duplicate slug "${slug}" found in:\n` +
      `  - ${slugsSeen.get(slug)}\n` +
      `  - ${filePath}\n` +
      `Rename one of the files to resolve this conflict.`
    );
  }
  slugsSeen.set(slug, filePath);
  modules[slug] = entry;
}
```

- [ ] **Step 4: Register the plugin in docusaurus.config.ts**

Add the plugin to the `plugins` array in `docusaurus.config.ts`. Add this after the `i18n` block (around line 47), before the `presets` block:

```ts
  plugins: [
    path.join(__dirname, 'plugins/module-registry'),
  ],
```

Add the `path` import at the top of the file:

```ts
import path from 'path';
```

- [ ] **Step 5: Add part descriptions to `_category_.json` files**

The `ProgressOverview` currently stores part descriptions in the hardcoded array. Move these into the `_category_.json` files so the plugin can read them. Update each file to add the `description` field:

`docs/part-1-foundations/_category_.json`:
```json
{
  "label": "Part 1: Setup & Foundations",
  "position": 1,
  "collapsible": true,
  "collapsed": true,
  "description": "Provision your SDO, configure domains and business units, and build the consent framework."
}
```

`docs/part-2-data/_category_.json`:
```json
{
  "label": "Part 2: Data & Audiences",
  "position": 2,
  "collapsible": true,
  "collapsed": true,
  "description": "Ingest data, build your data model, resolve identities, and create segments."
}
```

`docs/part-3-building/_category_.json`:
```json
{
  "label": "Part 3: Building for the Client",
  "position": 3,
  "collapsible": true,
  "collapsed": true,
  "description": "Create content, build emails, configure flows, design landing pages, and set up activations."
}
```

`docs/part-4-ai/_category_.json`:
```json
{
  "label": "Part 4: AI & Intelligence",
  "position": 4,
  "collapsible": true,
  "collapsed": true,
  "description": "Explore Agentforce, conversational messaging, and predictive AI features."
}
```

`docs/part-5-analytics/_category_.json`:
```json
{
  "label": "Part 5: Analytics",
  "position": 5,
  "collapsible": true,
  "collapsed": true,
  "description": "Build dashboards and surface marketing data across the Salesforce platform."
}
```

`docs/part-6-capstone/_category_.json`:
```json
{
  "label": "Part 6: Capstone",
  "position": 6,
  "collapsible": true,
  "collapsed": true,
  "description": "Put it all together with a multi-channel implementation project."
}
```

- [ ] **Step 6: Verify the plugin loads**

```bash
npm run build
```

Expected: Build succeeds. Check `.docusaurus/globalData.json` to confirm the registry data is present under the `module-registry` key. Verify:
- All 25+ modules appear with correct titles matching their frontmatter
- All 6 parts appear with correct labels, positions, and descriptions
- Sub-modules (e.g., `environment-setup`, `authenticated-domain`) have `parent` fields
- Index pages (e.g., `getting-started`) appear without `parent` fields
- No duplicate slug errors

- [ ] **Step 7: Commit**

```bash
git add plugins/module-registry/ docusaurus.config.ts package.json package-lock.json docs/part-*/_category_.json
git commit -m "feat: add module-registry plugin that builds registry from doc frontmatter"
```

---

### Task 2: `<ModuleLink>` Component

**Files:**
- Create: `src/components/ModuleLink.tsx`
- Modify: `src/theme/MDXComponents.tsx`

**Interfaces:**
- Consumes: `usePluginData('module-registry')` returning `RegistryData` (from Task 1)
- Produces: `<ModuleLink slug="..." text="..." />` — globally available JSX component

- [ ] **Step 1: Create the ModuleLink component**

Create `src/components/ModuleLink.tsx`:

```tsx
import React from 'react';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';

interface ModuleEntry {
  title: string;
  path: string;
  parent?: string;
  part: string;
  position: number;
}

interface RegistryData {
  modules: Record<string, ModuleEntry>;
  parts: Array<{
    dirName: string;
    label: string;
    position: number;
    description: string;
  }>;
}

interface ModuleLinkProps {
  slug: string;
  text?: string;
}

export default function ModuleLink({slug, text}: ModuleLinkProps): React.ReactElement {
  const {modules} = usePluginData('module-registry') as RegistryData;
  const entry = modules[slug];

  if (!entry) {
    throw new Error(
      `[ModuleLink] Unknown module slug "${slug}". ` +
      `Available slugs: ${Object.keys(modules).sort().join(', ')}`
    );
  }

  return (
    <Link to={entry.path}>
      {text ?? entry.title}
    </Link>
  );
}
```

- [ ] **Step 2: Register ModuleLink globally in MDXComponents**

Edit `src/theme/MDXComponents.tsx` to add `ModuleLink`:

```tsx
import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Screenshot from '@site/src/components/Screenshot';
import ModuleLink from '@site/src/components/ModuleLink';

export default {
  ...MDXComponents,
  Screenshot,
  ModuleLink,
};
```

- [ ] **Step 3: Test the component with a temporary reference**

Add a temporary test reference to any existing doc file (e.g., at the bottom of `docs/part-1-foundations/consent-fundamentals.md`):

```md
<!-- TEMP TEST: remove after verifying -->
Test link: <ModuleLink slug="data-graphs" />
```

Run the dev server:

```bash
npm start
```

Navigate to the Consent Fundamentals page. Verify:
- The link renders with the text "Data Graphs"
- The link points to `/part-2-data/data-graphs`
- Clicking the link navigates to the Data Graphs page

Then test error handling. Change the slug to something invalid:

```md
<ModuleLink slug="nonexistent-module" />
```

Expected: The build/dev server should throw an error with the message `[ModuleLink] Unknown module slug "nonexistent-module"`.

Remove the temporary test lines after verifying.

- [ ] **Step 4: Commit**

```bash
git add src/components/ModuleLink.tsx src/theme/MDXComponents.tsx
git commit -m "feat: add ModuleLink component with global MDX registration"
```

---

### Task 3: Refactor `ProgressOverview` to Use Registry

**Files:**
- Modify: `src/components/ProgressOverview.tsx`
- Modify: `src/css/custom.css` (add accordion styles)

**Interfaces:**
- Consumes: `usePluginData('module-registry')` returning `RegistryData` (from Task 1)
- Produces: Same rendered UI as before for flat modules, accordion UI for nested modules. Exports nothing (the `COURSE_PARTS` export and `ModuleInfo`/`PartInfo` type exports are removed).

- [ ] **Step 1: Check for existing consumers of COURSE_PARTS export**

Search for any imports of `COURSE_PARTS`, `ModuleInfo`, or `PartInfo` from `ProgressOverview`:

```bash
grep -r "COURSE_PARTS\|from.*ProgressOverview" src/ --include="*.ts" --include="*.tsx"
```

Expected: Only `ProgressOverview.tsx` itself and possibly `index.tsx`. If other files import these, note them for updating.

- [ ] **Step 2: Rewrite ProgressOverview to consume the registry**

Replace the entire contents of `src/components/ProgressOverview.tsx`:

```tsx
import {type ReactNode, useState, useEffect, useCallback} from 'react';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';

interface ModuleEntry {
  title: string;
  path: string;
  parent?: string;
  part: string;
  position: number;
}

interface PartEntry {
  dirName: string;
  label: string;
  position: number;
  description: string;
}

interface RegistryData {
  modules: Record<string, ModuleEntry>;
  parts: PartEntry[];
}

function getModuleProgress(slug: string): {lesson: boolean; assignment: boolean} {
  if (typeof window === 'undefined') return {lesson: false, assignment: false};
  return {
    lesson: localStorage.getItem(`progress:${slug}:lesson`) === 'true',
    assignment: localStorage.getItem(`progress:${slug}:assignment`) === 'true',
  };
}

function isModuleComplete(slug: string): boolean {
  const p = getModuleProgress(slug);
  return p.lesson && p.assignment;
}

function extractPartNumber(label: string): string {
  const match = label.match(/Part (\d+)/);
  return match ? match[1] : '';
}

function extractPartName(label: string): string {
  const match = label.match(/Part \d+:\s*(.+)/);
  return match ? match[1] : label;
}

interface BuiltPart {
  label: string;
  description: string;
  modules: Array<{
    slug: string;
    title: string;
    path: string;
    children: Array<{
      slug: string;
      title: string;
      path: string;
      position: number;
    }>;
    position: number;
  }>;
}

function buildPartsFromRegistry(data: RegistryData): BuiltPart[] {
  const {modules, parts} = data;

  return parts.map(part => {
    // Get all modules in this part
    const partModules = Object.entries(modules)
      .filter(([, entry]) => entry.part === part.dirName)
      .map(([slug, entry]) => ({slug, ...entry}));

    // Separate top-level modules (no parent) from children
    const topLevel = partModules
      .filter(m => !m.parent)
      .sort((a, b) => a.position - b.position);

    // Build module list with children
    const builtModules = topLevel.map(mod => {
      const children = partModules
        .filter(m => m.parent === mod.slug)
        .sort((a, b) => a.position - b.position)
        .map(m => ({
          slug: m.slug,
          title: m.title,
          path: m.path,
          position: m.position,
        }));

      return {
        slug: mod.slug,
        title: mod.title,
        path: mod.path,
        children,
        position: mod.position,
      };
    });

    return {
      label: part.label,
      description: part.description,
      modules: builtModules,
    };
  });
}

function AccordionModule({
  mod,
}: {
  mod: BuiltPart['modules'][number];
}): ReactNode {
  const [expanded, setExpanded] = useState(false);

  const childComplete = mod.children.filter(c => isModuleComplete(c.slug)).length;
  const allChildrenComplete = childComplete === mod.children.length;

  return (
    <li className="part-section__module part-section__module--accordion">
      <div className="part-section__module-header">
        <span
          className={`part-section__status${allChildrenComplete ? ' part-section__status--complete' : ''}`}
        />
        <Link to={mod.path} className="part-section__module-link">
          {mod.title}
        </Link>
        <button
          type="button"
          className={`part-section__accordion-toggle${expanded ? ' part-section__accordion-toggle--open' : ''}`}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${mod.title} sub-modules`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="part-section__child-count">
          {childComplete}/{mod.children.length}
        </span>
      </div>
      {expanded && (
        <ul className="part-section__submodules">
          {mod.children.map(child => {
            const complete = isModuleComplete(child.slug);
            return (
              <li key={child.slug} className="part-section__module part-section__module--sub">
                <span
                  className={`part-section__status${complete ? ' part-section__status--complete' : ''}`}
                />
                <Link to={child.path} className="part-section__module-link">
                  {child.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

export default function ProgressOverview(): ReactNode {
  const registryData = usePluginData('module-registry') as RegistryData;
  const builtParts = buildPartsFromRegistry(registryData);

  // Collect all leaf-level slugs for progress counting
  const allLeafSlugs: string[] = [];
  for (const part of builtParts) {
    for (const mod of part.modules) {
      if (mod.children.length > 0) {
        allLeafSlugs.push(...mod.children.map(c => c.slug));
      } else {
        allLeafSlugs.push(mod.slug);
      }
    }
  }

  const [completedCount, setCompletedCount] = useState(0);
  const totalModules = allLeafSlugs.length;

  const recalculate = useCallback(() => {
    const count = allLeafSlugs.filter(slug => isModuleComplete(slug)).length;
    setCompletedCount(count);
  }, [allLeafSlugs]);

  useEffect(() => {
    recalculate();
    window.addEventListener('progress-updated', recalculate);
    return () => window.removeEventListener('progress-updated', recalculate);
  }, [recalculate]);

  const handleReset = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      for (const slug of allLeafSlugs) {
        localStorage.removeItem(`progress:${slug}:lesson`);
        localStorage.removeItem(`progress:${slug}:assignment`);
      }
      window.dispatchEvent(new Event('progress-updated'));
      recalculate();
    }
  }, [allLeafSlugs, recalculate]);

  const pct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <>
      <div className="course-progress">
        <div className="course-progress__bar-wrap">
          <div className="course-progress__track">
            <div
              className="course-progress__fill"
              style={{width: `${pct}%`}}
            />
          </div>
          <span className="course-progress__label">
            {completedCount}/{totalModules} complete
          </span>
        </div>
      </div>

      <div className="course-parts">
        {builtParts.map(part => {
          const partNum = extractPartNumber(part.label);
          const partName = extractPartName(part.label);

          // Count completed leaf modules in this part
          let partLeafCount = 0;
          let partLeafComplete = 0;
          for (const mod of part.modules) {
            if (mod.children.length > 0) {
              partLeafCount += mod.children.length;
              partLeafComplete += mod.children.filter(c => isModuleComplete(c.slug)).length;
            } else {
              partLeafCount += 1;
              partLeafComplete += isModuleComplete(mod.slug) ? 1 : 0;
            }
          }

          const firstModulePath = part.modules[0]?.path ?? '#';

          return (
            <div key={part.label} className="part-section">
              <Link to={firstModulePath} className="part-section__header">
                <div className="part-section__top-row">
                  <span className="part-section__number">Part {partNum}</span>
                  <span className="part-section__count">
                    {partLeafComplete}/{partLeafCount}
                  </span>
                </div>
                <h2 className="part-section__title">{partName}</h2>
                <p className="part-section__description">{part.description}</p>
              </Link>
              <ul className="part-section__modules">
                {part.modules.map(mod => {
                  if (mod.children.length > 0) {
                    return <AccordionModule key={mod.slug} mod={mod} />;
                  }
                  const complete = isModuleComplete(mod.slug);
                  return (
                    <li key={mod.slug} className="part-section__module">
                      <span
                        className={`part-section__status${complete ? ' part-section__status--complete' : ''}`}
                      />
                      <Link to={mod.path} className="part-section__module-link">
                        {mod.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="course-footer-actions">
        <button
          type="button"
          className="course-footer-actions__reset-btn"
          onClick={handleReset}
        >
          Reset all progress
        </button>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Add accordion CSS styles**

Add these styles to `src/css/custom.css`, in the existing `part-section` block. Use existing design tokens where available:

```css
/* Accordion module styles */
.part-section__module--accordion {
  flex-direction: column;
  align-items: stretch;
}

.part-section__module-header {
  display: flex;
  align-items: center;
  gap: var(--sp-xs);
}

.part-section__accordion-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: transform 0.2s ease, color 0.2s ease;
}

.part-section__accordion-toggle:hover {
  color: var(--color-text-primary);
}

.part-section__accordion-toggle--open {
  transform: rotate(180deg);
}

.part-section__child-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-left: var(--sp-xs);
}

.part-section__submodules {
  list-style: none;
  padding-left: var(--sp-lg);
  margin: var(--sp-xs) 0 0 0;
}

.part-section__module--sub {
  padding: var(--sp-2xs) 0;
}
```

Note: The exact token names (`--sp-xs`, `--color-text-muted`, etc.) must match what exists in `src/css/tokens.css`. Check the actual token names before using them. If they differ, use the correct token names from the file.

- [ ] **Step 4: Verify the overview page**

```bash
npm start
```

Navigate to the course overview page (`/`). Verify:
- All 6 parts render with correct titles, descriptions, and module counts
- Flat modules (e.g., Consent Fundamentals) render as before with status dots and links
- Nested modules (e.g., Getting Started, Domain Setup, Business Units) render with an accordion toggle
- Clicking the accordion toggle expands to show sub-modules
- Clicking the accordion toggle again collapses
- The parent module title links to the index page
- Sub-module titles link to their respective pages
- Progress bar shows correct counts
- "Reset all progress" button works

- [ ] **Step 5: Run typecheck**

```bash
npm run typecheck
```

Expected: No TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProgressOverview.tsx src/css/custom.css
git commit -m "refactor: ProgressOverview consumes module registry with accordion sub-modules"
```

---

### Task 4: Scrub Numbered Module References

**Files:**
- Modify: `docs/part-1-foundations/consent-fundamentals.md:12`
- Modify: `docs/part-1-foundations/consent-configuration.md:14-15,259`
- Modify: `docs/part-1-foundations/consent-automation-flow.md:9,13,31,40`
- Modify: `docs/part-1-foundations/getting-started/seeding-your-org.md:13,264,266`
- Modify: `docs/part-1-foundations/getting-started/environment-setup.md:111,122`

**Interfaces:**
- Consumes: `<ModuleLink>` component (from Task 2)
- Produces: Updated content with all `Module \d+` references replaced by `<ModuleLink>` components

- [ ] **Step 1: Find all numbered module references**

Run a comprehensive search to make sure we catch everything:

```bash
grep -rn -i "module [0-9]" docs/ --include="*.md" --include="*.mdx"
```

Review every match. The mapping from the spec:

| Reference | Slug |
|---|---|
| Module 5 (consent config) | `consent-configuration` |
| Module 8 (data graphs) | `data-graphs` |
| Module 14 (email builder) | `email-builder` |
| Module 23 (predictive AI) | `predictive-ai` |

For any references not in this table, determine the correct slug by cross-referencing the module content and the registry.

- [ ] **Step 2: Update consent-fundamentals.md**

In `docs/part-1-foundations/consent-fundamentals.md`, line 12 currently reads:

```md
Module 5 builds the flow that creates consent records for LEOptical's customers. This module is the prerequisite. Understand the model here, and the flow in Module 5 will make sense. Skip this, and Module 5 will feel like following steps without knowing why.
```

Replace with:

```md
<ModuleLink slug="consent-configuration" /> builds the flow that creates consent records for LEOptical's customers. This module is the prerequisite. Understand the model here, and the configuration in <ModuleLink slug="consent-configuration" /> will make sense. Skip this, and <ModuleLink slug="consent-configuration" /> will feel like following steps without knowing why.
```

Check for any other `Module \d+` references in the file (lines ~45, ~170, ~190 may have references to Module 5 and Module 8). Update each one:

- "Module 5" → `<ModuleLink slug="consent-configuration" />`
- "Module 8" → `<ModuleLink slug="data-graphs" />`

Read the surrounding sentence for each and rewrite naturally. For example, "That's the problem Module 5 solves" becomes "That's the problem <ModuleLink slug="consent-configuration" /> solves".

- [ ] **Step 3: Update consent-configuration.md**

In `docs/part-1-foundations/consent-configuration.md`:

Line 14 currently reads:
```md
This module builds on the data work from Modules 2-4. The Communication Subscription Consent DMO that you write records to here connects to Contact Point Email in the Data Graph you will build in Module 8.
```

Replace with:
```md
This module builds on the data work from <ModuleLink slug="data-360-dmos" />, <ModuleLink slug="crm-data-ingestion" />, and <ModuleLink slug="data-graphs" />. The Communication Subscription Consent DMO that you write records to here connects to Contact Point Email in the Data Graph you will build in <ModuleLink slug="data-graphs" />.
```

Line 259 reference to "Module 14" — find the exact line and replace with `<ModuleLink slug="email-builder" />`. Read the surrounding context to rewrite naturally.

- [ ] **Step 4: Update consent-automation-flow.md**

In `docs/part-1-foundations/consent-automation-flow.md`:

Line 9: "Module 5 covers CSV import as a manual workaround" →
```md
<ModuleLink slug="consent-configuration" /> covers CSV import as a manual workaround
```

Line 13: "Do not attempt to build this flow from the Create Consent Request element reference table in Module 5 alone" →
```md
Do not attempt to build this flow from the Create Consent Request element reference table in <ModuleLink slug="consent-configuration" /> alone
```

Lines 31 and 40: Replace similarly.

- [ ] **Step 5: Update seeding-your-org.md**

In `docs/part-1-foundations/getting-started/seeding-your-org.md`:

Line 13: "You will update the protagonist emails with your own address in Module 5 when you set up consent." →
```md
You will update the protagonist emails with your own address in <ModuleLink slug="consent-configuration" /> when you set up consent.
```

Line 264: "In Module 5, you will update these 10 contacts..." →
```md
In <ModuleLink slug="consent-configuration" />, you will update these 10 contacts...
```

Line 266: "You will come back to them in Module 5." →
```md
You will come back to them in <ModuleLink slug="consent-configuration" />.
```

- [ ] **Step 6: Update environment-setup.md**

In `docs/part-1-foundations/getting-started/environment-setup.md`:

Line 111: "Module 8 covers Data Graphs in depth" →
```md
<ModuleLink slug="data-graphs" /> covers Data Graphs in depth
```

Line 122: "Module 23 covers how to interpret scoring results" →
```md
<ModuleLink slug="predictive-ai" /> covers how to interpret scoring results
```

- [ ] **Step 7: Verify no numbered references remain**

```bash
grep -rn -i "module [0-9]" docs/ --include="*.md" --include="*.mdx"
```

Expected: No matches.

- [ ] **Step 8: Verify the build succeeds**

```bash
npm run build
```

Expected: Build succeeds with no errors. All `<ModuleLink>` slugs resolve correctly.

- [ ] **Step 9: Spot-check rendered links**

```bash
npm start
```

Navigate to each modified page and verify the links render correctly:
- Consent Fundamentals: links to Consent Configuration and Data Graphs
- Consent Configuration: links to Data 360 and DMOs, CRM Data Ingestion, Data Graphs, and Email Builder
- Consent Automation Flow: links to Consent Configuration
- Seeding Your Org: links to Consent Configuration
- Environment Setup: links to Data Graphs and Predictive AI

- [ ] **Step 10: Commit**

```bash
git add docs/
git commit -m "refactor: replace all numbered module references with ModuleLink components"
```

---

### Task 5: Linter Rule and CLAUDE.md Update

**Files:**
- Modify: `scripts/lint-content.sh:153` (add new rule)
- Modify: `CLAUDE.md` (add module registry documentation)

**Interfaces:**
- Consumes: nothing
- Produces: Linter rule that flags `Module \d+` in content; updated CLAUDE.md for future sessions

- [ ] **Step 1: Add the linter rule**

In `scripts/lint-content.sh`, add a new rule in the "Terminology" section (after the "Marketing Cloud Growth" check, around line 156). Add before the VERIFY comment check:

```bash
  # ─── Module references ──────────────────────────────
  check_pattern '\bModule [0-9]' "numbered module reference: use <ModuleLink slug=\"...\"> instead" "error" "$file" "$content_prose"
```

- [ ] **Step 2: Verify the linter catches numbered references**

Create a temporary test file:

```bash
echo '---
sidebar_position: 99
title: "Lint Test"
description: "test"
---

This references Module 5 which should fail.
' > /tmp/lint-test.md
./scripts/lint-content.sh /tmp/lint-test.md
```

Expected: Error output showing "numbered module reference" on line 7.

```bash
rm /tmp/lint-test.md
```

- [ ] **Step 3: Verify the linter passes on all existing content**

```bash
npm run lint:content
```

Expected: No errors for numbered module references (since we replaced them all in Task 4). Other existing warnings/errors may appear — those are unrelated.

- [ ] **Step 4: Update CLAUDE.md**

Add the following sections to `CLAUDE.md`:

In the **Architecture** section, after the "Screenshot component" paragraph, add:

```md
**Module registry:** A Docusaurus plugin (`plugins/module-registry/`) scans all doc frontmatter at build time and generates a registry mapping slugs to titles and paths. The registry is exposed via `setGlobalData` and consumed by `<ModuleLink>` and `ProgressOverview` via `usePluginData('module-registry')`. Module titles come from frontmatter, part metadata from `_category_.json` — the registry is the derived single source of truth. When adding or renaming modules, just update the frontmatter title. The `ProgressOverview` on the course overview page dynamically builds from the registry — no hardcoded module list.

**ModuleLink component:** `src/components/ModuleLink.tsx` is globally registered via `src/theme/MDXComponents.tsx`. Use it in any `.md` file without importing:
```​mdx
<ModuleLink slug="data-graphs" />
<ModuleLink slug="data-graphs" text="custom link text" />
```​
The slug is the filename (without extension) of the target module. The component renders the module's frontmatter title as a hyperlink. Unknown slugs cause a build failure.
```

In the **Content Rules** section, add a new bullet:

```md
- **No numbered module references** — never write "Module 5" or "Module 8". Always use `<ModuleLink slug="..." />` to reference other modules by name. The linter flags `Module \d+` as an error.
```

In the **Course overview page** line in the Architecture section, replace:
```md
**Course overview page:** `src/pages/index.tsx` renders the hero and `ProgressOverview`. The module list is hardcoded in `ProgressOverview.tsx` as `COURSE_PARTS` — update this array when adding/removing modules.
```

With:
```md
**Course overview page:** `src/pages/index.tsx` renders the hero and `ProgressOverview`. The module list is dynamically built from the module registry — no manual updates needed when adding, removing, or reordering modules. Nested modules render with an accordion UI.
```

- [ ] **Step 5: Run the full build one final time**

```bash
npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 6: Commit**

```bash
git add scripts/lint-content.sh CLAUDE.md
git commit -m "chore: add Module N linter rule and update CLAUDE.md with registry docs"
```
