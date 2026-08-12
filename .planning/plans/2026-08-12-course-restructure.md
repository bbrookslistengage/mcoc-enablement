# Course Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the course from 6 parts (~24 modules) to 9 parts (~36 modules), breaking apart the monolithic Part 3 into dedicated sections for Content/Email, Personalization/Handlebars, Flows, Landing Pages/Web, and merging Campaigns with Analytics.

**Architecture:** This is entirely a file-move + frontmatter + docs update. No component or plugin code changes. The module registry plugin derives everything from frontmatter and `_category_.json` files, so restructuring the `docs/` directory and updating frontmatter is sufficient. Source-of-truth planning docs (PROGRESS.md, module-assignments.md, course design spec) are updated to match.

**Tech Stack:** Docusaurus 3.10 (static site), Markdown with YAML frontmatter

## Global Constraints

- TypeScript strict mode (`tsconfig.json` extends `@docusaurus/tsconfig`)
- Content linter (`scripts/lint-content.sh`) runs on pre-commit via husky/lint-staged
- Docusaurus docs serve from root (`routeBasePath: '/'`)
- All docs use `.md` extension
- Sidebar auto-generated from directory structure (`sidebars.ts`)
- Module registry plugin reads frontmatter `title`, `sidebar_position`, `description` and `_category_.json` files
- No numbered module references in content — use `<ModuleLink slug="..." />`
- Frontmatter requires `sidebar_position`, `title`, and `description`

## Reference

- Design spec: `.planning/specs/2026-08-12-course-restructure-design.md`
- Current module tracker: `.planning/PROGRESS.md`
- Current assignment specs: `.planning/specs/module-assignments.md`
- Current course design: `.planning/specs/2026-08-06-mca-enablement-course-design.md`

---

### Task 1: Create New Part Directories, Move Files, and Remove Old Directories

This is a single atomic task to avoid intermediate states where both old and new part directories exist simultaneously. The module registry plugin throws a hard error on duplicate slugs, so `part-4-ai` and `part-7-ai` cannot coexist (both would register `agentforce`, `conversational-messaging`, `predictive-ai`).

**Files:**
- Create: `docs/part-3-content/_category_.json`
- Create: `docs/part-4-personalization/_category_.json`
- Create: `docs/part-5-flows/_category_.json`
- Create: `docs/part-6-web/_category_.json`
- Create: `docs/part-7-ai/_category_.json`
- Create: `docs/part-8-analytics/_category_.json`
- Create: `docs/part-9-capstone/_category_.json`
- Move: all files from `docs/part-3-building/`, `docs/part-4-ai/`, `docs/part-5-analytics/`, `docs/part-6-capstone/`
- Move: `docs/part-1-foundations/consent-automation-flow.md` → `docs/part-5-flows/consent-flow-project.md`
- Delete: `docs/part-3-building/personalization.md`, `docs/part-3-building/messaging-channels.md`
- Delete: old directories `docs/part-3-building/`, `docs/part-4-ai/`, `docs/part-5-analytics/`, `docs/part-6-capstone/`
- Modify: stale `<ModuleLink>` references in existing content

**Interfaces:**
- Consumes: nothing
- Produces: New part directories with `_category_.json` files, all existing modules in correct new locations, stale cross-references fixed

- [ ] **Step 1: Create all new part directories**

```bash
mkdir -p docs/part-3-content docs/part-4-personalization docs/part-5-flows docs/part-6-web docs/part-7-ai docs/part-8-analytics docs/part-9-capstone
```

- [ ] **Step 2: Create `docs/part-3-content/_category_.json`**

```json
{
  "label": "Part 3: Content & Email Building",
  "position": 3,
  "collapsible": true,
  "collapsed": true,
  "description": "Build emails progressively — from the drag-and-drop editor to content blocks to templates."
}
```

- [ ] **Step 3: Create `docs/part-4-personalization/_category_.json`**

```json
{
  "label": "Part 4: Dynamic Content & Personalization",
  "position": 4,
  "collapsible": true,
  "collapsed": true,
  "description": "From no-code merge fields to Handlebars mastery — progressively personalize your emails."
}
```

- [ ] **Step 4: Create `docs/part-5-flows/_category_.json`**

```json
{
  "label": "Part 5: Flows & Automation",
  "position": 5,
  "collapsible": true,
  "collapsed": true,
  "description": "Build marketing flows from simple sends to advanced orchestration with subflows and batching."
}
```

- [ ] **Step 5: Create `docs/part-6-web/_category_.json`**

```json
{
  "label": "Part 6: Landing Pages & Web",
  "position": 6,
  "collapsible": true,
  "collapsed": true,
  "description": "Build landing pages, capture form submissions, and instrument external sites with the web connector."
}
```

- [ ] **Step 6: Create `docs/part-7-ai/_category_.json`**

```json
{
  "label": "Part 7: AI & Intelligence",
  "position": 7,
  "collapsible": true,
  "collapsed": true,
  "description": "Explore Agentforce, conversational messaging, and predictive AI features."
}
```

- [ ] **Step 7: Create `docs/part-8-analytics/_category_.json`**

```json
{
  "label": "Part 8: Campaigns & Analytics",
  "position": 8,
  "collapsible": true,
  "collapsed": true,
  "description": "Organize marketing activity into campaigns and build dashboards to measure performance."
}
```

- [ ] **Step 8: Create `docs/part-9-capstone/_category_.json`**

```json
{
  "label": "Part 9: Capstone",
  "position": 9,
  "collapsible": true,
  "collapsed": true,
  "description": "Put it all together with a multi-channel implementation project."
}
```

- [ ] **Step 9: Move CMS to Part 3**

```bash
git mv docs/part-3-building/salesforce-cms.md docs/part-3-content/salesforce-cms.md
```

sidebar_position stays 1, no frontmatter changes needed.

- [ ] **Step 10: Move email-builder to Part 3 and update title**

```bash
git mv docs/part-3-building/email-builder.md docs/part-3-content/email-builder.md
```

Then update frontmatter in `docs/part-3-content/email-builder.md`:

```yaml
---
sidebar_position: 2
title: "The Email Builder"
description: "The drag-and-drop editor, builder elements, sections, and preview and test."
---
```

- [ ] **Step 11: Move flow-fundamentals to Part 5**

```bash
git mv docs/part-3-building/flow-fundamentals.md docs/part-5-flows/flow-fundamentals.md
```

Update frontmatter in `docs/part-5-flows/flow-fundamentals.md`:

```yaml
---
sidebar_position: 1
title: "Flow Fundamentals"
description: "Flow types, trigger conditions, configuration settings, and marketing flow elements."
---
```

- [ ] **Step 12: Move activation-templates to Part 5**

```bash
git mv docs/part-3-building/activation-templates.md docs/part-5-flows/activation-templates.md
```

Update frontmatter in `docs/part-5-flows/activation-templates.md`:

```yaml
---
sidebar_position: 2
title: "Activation Templates"
description: "Configuring activation templates and selecting appropriate contact point values."
---
```

- [ ] **Step 13: Move flow-orchestration to Part 5**

```bash
git mv docs/part-3-building/flow-orchestration.md docs/part-5-flows/flow-orchestration.md
```

Update frontmatter in `docs/part-5-flows/flow-orchestration.md`:

```yaml
---
sidebar_position: 3
title: "Flows: Orchestration and Logic"
description: "Decision branches, path experiments, wait steps, and content variables in flows."
---
```

- [ ] **Step 14: Move landing-pages to Part 6**

```bash
git mv docs/part-3-building/landing-pages.md docs/part-6-web/landing-pages.md
```

Update frontmatter in `docs/part-6-web/landing-pages.md`:

```yaml
---
sidebar_position: 1
title: "Landing Pages and Forms"
description: "Page builder, form creation, components, configuration, and consent banner integration."
---
```

- [ ] **Step 15: Move landing-pages-advanced to Part 6**

```bash
git mv docs/part-3-building/landing-pages-advanced.md docs/part-6-web/landing-pages-advanced.md
```

Update frontmatter in `docs/part-6-web/landing-pages-advanced.md`:

```yaml
---
sidebar_position: 2
title: "Landing Pages: Advanced"
description: "Hidden fields, UTM parameters, lead creation, consent capture, and campaign assignment."
---
```

- [ ] **Step 16: Move consent-automation-flow to Part 5 and rename**

First, verify no existing content references the old slug:

```bash
grep -r 'slug="consent-automation-flow"' docs/
```

Expected: no results. If any results appear, update those references to `slug="consent-flow-project"` before proceeding.

```bash
git mv docs/part-1-foundations/consent-automation-flow.md docs/part-5-flows/consent-flow-project.md
```

Update frontmatter in `docs/part-5-flows/consent-flow-project.md`:

```yaml
---
sidebar_position: 5
sidebar_label: "▶ Consent Automation Flow"
title: "Project: Consent Automation Flow"
description: "Build the Data 360-Triggered Flow that automatically creates consent records for new individuals in LEOptical's org."
custom_edit_url: null
---
```

- [ ] **Step 17: Fix stale ModuleLink references before deleting files**

The `personalization.md` file is being deleted, but existing content references its slug. Find and fix all references:

```bash
grep -r 'slug="personalization"' docs/
```

Known reference: `docs/part-2-data/data-graphs/index.md` line 215. Update it to point to the appropriate replacement module:

```markdown
<!-- Before -->
You will use this pattern in the <ModuleLink slug="personalization" /> module.
<!-- After -->
You will use this pattern in the <ModuleLink slug="merge-fields-dynamic-content" /> module.
```

Also check for any forward references to the web connector that incorrectly point to `landing-pages-advanced`:

```bash
grep -r 'web connector' docs/ --ignore-case
```

Known reference: `docs/part-1-foundations/consent-configuration.md` line 223 references the web connector via `slug="landing-pages-advanced"`. Update it to point to the new web connector module:

```markdown
<!-- Before -->
You will configure the web connector in <ModuleLink slug="landing-pages-advanced" />.
<!-- After -->
You will configure the web connector in <ModuleLink slug="web-connector" />.
```

Run one final sweep for any other slugs being moved/deleted:

```bash
grep -r 'slug="messaging-channels"' docs/
```

Fix any results found.

- [ ] **Step 18: Remove deferred/replaced files**

The old `personalization.md` is replaced by 7 new modules in Part 4. The `messaging-channels.md` is deferred with no content. Remove both.

```bash
git rm docs/part-3-building/personalization.md
git rm docs/part-3-building/messaging-channels.md
```

- [ ] **Step 19: Remove old directories**

After all files are moved or deleted, the old directories should be empty except for `_category_.json`. Use `rm -rf` instead of `rmdir` to handle any untracked files (`.DS_Store`, editor temp files) that would cause `rmdir` to fail.

```bash
# Remove old Part 3
git rm docs/part-3-building/_category_.json
rm -rf docs/part-3-building

# Part 4 AI → Part 7 AI
git mv docs/part-4-ai/agentforce.md docs/part-7-ai/agentforce.md
git mv docs/part-4-ai/conversational-messaging.md docs/part-7-ai/conversational-messaging.md
git mv docs/part-4-ai/predictive-ai.md docs/part-7-ai/predictive-ai.md
git rm docs/part-4-ai/_category_.json
rm -rf docs/part-4-ai

# Part 5 Analytics → Part 8 Analytics
git mv docs/part-5-analytics/reporting-dashboards.md docs/part-8-analytics/reporting-dashboards.md
git rm docs/part-5-analytics/_category_.json
rm -rf docs/part-5-analytics

# Part 6 Capstone → Part 9 Capstone
git mv docs/part-6-capstone/capstone-project.md docs/part-9-capstone/capstone-project.md
git rm docs/part-6-capstone/_category_.json
rm -rf docs/part-6-capstone
```

No frontmatter changes needed for AI, Analytics, or Capstone modules — sidebar_position values stay the same within their parts.

- [ ] **Step 20: Verify no old directories remain**

```bash
ls -d docs/part-* | sort
```

Expected output:
```
docs/part-1-foundations
docs/part-2-data
docs/part-3-content
docs/part-4-personalization
docs/part-5-flows
docs/part-6-web
docs/part-7-ai
docs/part-8-analytics
docs/part-9-capstone
```

- [ ] **Step 21: Commit**

```bash
git add -A docs/
git commit -m "$(cat <<'EOF'
refactor: restructure course into 9 parts

- Created new part directories (3-content, 4-personalization,
  5-flows, 6-web, 7-ai, 8-analytics, 9-capstone)
- CMS + email builder → Part 3 (Content & Email Building)
- Flows + activation templates → Part 5 (Flows & Automation)
- Landing pages → Part 6 (Landing Pages & Web)
- AI modules → Part 7 (AI & Intelligence)
- Analytics → Part 8 (Campaigns & Analytics)
- Capstone → Part 9 (Capstone)
- Consent automation flow moves from Part 1 to Part 5
- Removed deferred messaging-channels and replaced personalization
- Fixed stale ModuleLink references (personalization, web connector)
EOF
)"
```

---

### Task 2: Create New Module Stub Files (Parts 3-5)

Create frontmatter-only stub files for all new modules. These are placeholder files so the registry picks them up and the sidebar renders. Content will be written later via the content pipeline.

**Files:**
- Create: `docs/part-3-content/content-blocks.md`
- Create: `docs/part-3-content/email-templates.md`
- Create: `docs/part-4-personalization/marketing-objects.md`
- Create: `docs/part-4-personalization/merge-fields-dynamic-content.md`
- Create: `docs/part-4-personalization/handlebars-foundations.md`
- Create: `docs/part-4-personalization/handlebars-working-with-data.md`
- Create: `docs/part-4-personalization/handlebars-advanced.md`
- Create: `docs/part-4-personalization/ampscript-in-mca.md`
- Create: `docs/part-4-personalization/personalization-project.md`
- Create: `docs/part-5-flows/flows-advanced.md`

**Interfaces:**
- Consumes: part directories from Task 1 (same commit)
- Produces: module stub files with correct frontmatter for the registry

- [ ] **Step 1: Create `docs/part-3-content/content-blocks.md`**

```markdown
---
sidebar_position: 3
title: "Content Blocks"
description: "Reusable content blocks, propagation behavior, and converting content blocks to sections."
---

## Overview
```

- [ ] **Step 2: Create `docs/part-3-content/email-templates.md`**

```markdown
---
sidebar_position: 4
title: "Email Templates"
description: "Templates as reusable starting points, locked and editable regions, locking strategies, and HTML paste emails."
---

## Overview
```

- [ ] **Step 3: Create `docs/part-4-personalization/marketing-objects.md`**

```markdown
---
sidebar_position: 1
title: "Marketing Objects"
description: "Marketing Objects as a data store for personalization, CSV import, and when to use them over other data sources."
---

## Overview
```

- [ ] **Step 4: Create `docs/part-4-personalization/merge-fields-dynamic-content.md`**

```markdown
---
sidebar_position: 2
title: "Merge Fields and Dynamic Content"
description: "Data sources tab, merge fields, content variables, and dynamic variations without code."
---

## Overview
```

- [ ] **Step 5: Create `docs/part-4-personalization/handlebars-foundations.md`**

```markdown
---
sidebar_position: 3
title: "Handlebars: Foundations"
description: "Handlebars syntax, accessing the data graph, conditional logic, fallback values, and string helpers."
---

## Overview
```

- [ ] **Step 6: Create `docs/part-4-personalization/handlebars-working-with-data.md`**

```markdown
---
sidebar_position: 4
title: "Handlebars: Working with Data"
description: "Looping with each, filtering, sorting, mapping, and navigating nested data graph structures."
---

## Overview
```

- [ ] **Step 7: Create `docs/part-4-personalization/handlebars-advanced.md`**

```markdown
---
sidebar_position: 5
title: "Handlebars: Advanced Techniques"
description: "Math and date helpers, Marketing Object lookups, GetContentBlock, formatting, and debugging with RaiseError."
---

## Overview
```

- [ ] **Step 8: Create `docs/part-4-personalization/ampscript-in-mca.md`**

```markdown
---
sidebar_position: 6
title: "AMPscript in MCA"
description: "Supported AMPscript functions in MCA, known gaps, and when to use AMPscript versus Handlebars."
---

## Overview
```

- [ ] **Step 9: Create `docs/part-4-personalization/personalization-project.md`**

```markdown
---
sidebar_position: 7
sidebar_label: "▶ Personalization Project"
title: "Project: Personalized Campaign Email"
description: "Build a complete multi-section personalized email using templates, content blocks, Handlebars, and Marketing Objects."
custom_edit_url: null
---

## Overview
```

- [ ] **Step 10: Create `docs/part-5-flows/flows-advanced.md`**

```markdown
---
sidebar_position: 4
title: "Flows: Advanced"
description: "Subflows, variables, formulas, batching, interviews, re-entry settings, and Unified Individual ID mutability."
---

## Overview
```

- [ ] **Step 11: Verify all new files exist**

```bash
ls docs/part-3-content/*.md docs/part-4-personalization/*.md docs/part-5-flows/*.md
```

Expected:
- Part 3: `salesforce-cms.md`, `email-builder.md`, `content-blocks.md`, `email-templates.md`
- Part 4: `marketing-objects.md`, `merge-fields-dynamic-content.md`, `handlebars-foundations.md`, `handlebars-working-with-data.md`, `handlebars-advanced.md`, `ampscript-in-mca.md`, `personalization-project.md`
- Part 5: `flow-fundamentals.md`, `activation-templates.md`, `flow-orchestration.md`, `flows-advanced.md`, `consent-flow-project.md`

- [ ] **Step 12: Commit**

```bash
git add docs/part-3-content/ docs/part-4-personalization/ docs/part-5-flows/
git commit -m "$(cat <<'EOF'
feat: add stub files for new modules in Parts 3-5

Content & Email Building: content-blocks, email-templates
Personalization: marketing-objects, merge-fields-dynamic-content,
  handlebars (foundations/data/advanced), ampscript, project
Flows: flows-advanced
EOF
)"
```

---

### Task 3: Create New Module Stub Files (Parts 6, 8) and Web Connector Multi-Subpage

**Files:**
- Create: `docs/part-6-web/web-connector/_category_.json`
- Create: `docs/part-6-web/web-connector/index.md`
- Create: `docs/part-6-web/web-connector/setup.md`
- Create: `docs/part-6-web/web-connector/consent-banner.md`
- Create: `docs/part-6-web/web-connector/data-360-integration.md`
- Create: `docs/part-6-web/web-connector/custom-events.md`
- Create: `docs/part-6-web/web-connector/identity-capture.md`
- Create: `docs/part-6-web/web-connector/interactions-sdk.md`
- Create: `docs/part-8-analytics/campaigns.md`

**Interfaces:**
- Consumes: part directories from Task 1 (same commit)
- Produces: web connector multi-subpage module and campaigns stub

- [ ] **Step 1: Create web connector directory**

```bash
mkdir -p docs/part-6-web/web-connector
```

- [ ] **Step 2: Create `docs/part-6-web/web-connector/_category_.json`**

```json
{
  "label": "Web Connector",
  "position": 3,
  "collapsible": true,
  "collapsed": true,
  "description": "Instrument external sites with tracking, consent capture, custom events, and identity resolution."
}
```

- [ ] **Step 3: Create `docs/part-6-web/web-connector/index.md`**

```markdown
---
sidebar_position: 1
title: "Web Connector"
description: "What the web connector is, how it fits into MCA data collection, and an overview of what we are building."
---

## Overview
```

- [ ] **Step 4: Create `docs/part-6-web/web-connector/setup.md`**

```markdown
---
sidebar_position: 2
title: "Setting Up the Connector"
description: "Creating the web connector in MCA, configuring the embed code, deploying to the Netlify site, and verifying the connection."
---

## Overview
```

- [ ] **Step 5: Create `docs/part-6-web/web-connector/consent-banner.md`**

```markdown
---
sidebar_position: 3
title: "Web Consent Banner"
description: "Configuring the consent banner for external sites, connecting to the MCA consent model, and testing consent capture."
---

## Overview
```

- [ ] **Step 6: Create `docs/part-6-web/web-connector/data-360-integration.md`**

```markdown
---
sidebar_position: 4
title: "Data 360 Integration"
description: "Auto-created data streams from the web connector, verifying data lands in Data 360, and understanding connector DMO mappings."
---

## Overview
```

- [ ] **Step 7: Create `docs/part-6-web/web-connector/custom-events.md`**

```markdown
---
sidebar_position: 5
title: "Custom Events and Schema"
description: "Adding custom events to the web connector, updating the connector schema, and tracking events in Data 360."
---

## Overview
```

- [ ] **Step 8: Create `docs/part-6-web/web-connector/identity-capture.md`**

```markdown
---
sidebar_position: 6
title: "Identity Capture"
description: "Linking anonymous website visitors to known Individuals in Data 360."
---

## Overview
```

- [ ] **Step 9: Create `docs/part-6-web/web-connector/interactions-sdk.md`**

```markdown
---
sidebar_position: 7
title: "Interactions SDK"
description: "Adding custom events programmatically to external sites using the Interactions SDK."
---

## Overview
```

- [ ] **Step 10: Create `docs/part-8-analytics/campaigns.md`**

```markdown
---
sidebar_position: 1
title: "Campaigns in MCA"
description: "Campaign workspace, linking flows and emails to campaigns, metrics aggregation, and the Campaign Creation Agent."
---

## Overview
```

Then update `docs/part-8-analytics/reporting-dashboards.md` frontmatter to position 2:

```yaml
---
sidebar_position: 2
title: "Reporting and Dashboards"
description: "Pre-built dashboards, addressing reporting requirements, and surfacing marketing data across Salesforce."
---
```

- [ ] **Step 11: Verify all new files exist**

```bash
ls docs/part-6-web/web-connector/*.md docs/part-8-analytics/*.md
```

Expected:
- Web connector: `index.md`, `setup.md`, `consent-banner.md`, `data-360-integration.md`, `custom-events.md`, `identity-capture.md`, `interactions-sdk.md`
- Analytics: `campaigns.md`, `reporting-dashboards.md`

- [ ] **Step 12: Commit**

```bash
git add docs/part-6-web/web-connector/ docs/part-8-analytics/
git commit -m "$(cat <<'EOF'
feat: add web connector multi-subpage module and campaigns stub

Web Connector (Part 6): index, setup, consent-banner,
  data-360-integration, custom-events, identity-capture,
  interactions-sdk
Campaigns (Part 8): new module before reporting-dashboards
EOF
)"
```

---

### Task 4: Update PROGRESS.md

Replace the module table in `.planning/PROGRESS.md` with the new structure. Keep completed module statuses. Mark new modules as not started.

**Files:**
- Modify: `.planning/PROGRESS.md`

**Interfaces:**
- Consumes: nothing
- Produces: updated module tracker matching the new course structure

- [ ] **Step 1: Read the current PROGRESS.md**

Read `.planning/PROGRESS.md` in full to understand all sections.

- [ ] **Step 2: Replace the Phase 4 module table**

Replace the existing module table (lines 43-72 approximately) with the new structure. Keep all status values for modules that haven't changed. New modules get `-` status. Modules that were renamed get their new titles but keep their existing status.

The new table should be:

```markdown
| Part | # | Module | Spec | Skeleton | Content | Screenshots | Verified |
|------|---|--------|------|----------|---------|-------------|----------|
| Intro | I-1 | How This Course Works | Done | - | Draft (0 VERIFY) | N/A | - |
| Intro | I-2 | MCA vs. MCE | Done | - | Draft (0 VERIFY) | N/A | - |
| Intro | I-3 | Introduction to Data 360 | Done | - | Draft (0 VERIFY) | N/A | - |
| Intro | I-4 | Navigating a New Platform | Done | - | Draft (0 VERIFY) | N/A | - |
| 1 | 1 | Getting Started | Done | - | Draft (9 VERIFY) | - | - |
| 1 | 2 | Domain Setup | Done | - | Draft (7 VERIFY) | - | - |
| 1 | 3 | Business Units and Governance | Done | - | Draft (8 VERIFY) | - | - |
| 1 | 4 | Consent Fundamentals | Done | - | Draft (3 VERIFY) | - | - |
| 1 | 5 | Consent Configuration | Done | - | Draft (4 VERIFY) | - | - |
| 2 | 6 | Working with Data 360 (multi-subpage) | Restructured | - | - | - | - |
| 2 | 7 | Identity Resolution (multi-subpage) | Restructured | - | Draft (5 VERIFY) | - | - |
| 2 | 8 | Data Graphs (multi-subpage) | Restructured | - | Draft (4 VERIFY) | - | - |
| 2 | 9 | Segmentation | Done | - | Draft (24 VERIFY) | - | - |
| 2 | 10 | Consumption and Entitlements | Done | - | - | - | - |
| 3 | 11 | Salesforce CMS and Content Management | Done | - | - | - | - |
| 3 | 12 | The Email Builder | Needs update | - | - | - | - |
| 3 | 13 | Content Blocks | - | - | - | - | - |
| 3 | 14 | Email Templates | - | - | - | - | - |
| 4 | 15 | Marketing Objects | - | - | - | - | - |
| 4 | 16 | Merge Fields and Dynamic Content | - | - | - | - | - |
| 4 | 17 | Handlebars: Foundations | - | - | - | - | - |
| 4 | 18 | Handlebars: Working with Data | - | - | - | - | - |
| 4 | 19 | Handlebars: Advanced Techniques | - | - | - | - | - |
| 4 | 20 | AMPscript in MCA | - | - | - | - | - |
| 4 | 21 | Project: Personalized Campaign Email | - | - | - | - | - |
| 5 | 22 | Flow Fundamentals | Done | - | - | - | - |
| 5 | 23 | Activation Templates | Done | - | - | - | - |
| 5 | 24 | Flows: Orchestration and Logic | Needs update | - | - | - | - |
| 5 | 25 | Flows: Advanced | - | - | - | - | - |
| 5 | 26 | Project: Consent Automation Flow | - | - | - | - | - |
| 6 | 27 | Landing Pages and Forms | Done | - | - | - | - |
| 6 | 28 | Landing Pages: Advanced | Done | - | - | - | - |
| 6 | 29 | Web Connector (multi-subpage) | - | - | - | - | - |
| 7 | 30 | Agentforce for Marketing | Done | - | - | - | - |
| 7 | 31 | Conversational Messaging | Deferred | - | - | - | - |
| 7 | 32 | Predictive AI | Done | - | - | - | - |
| 8 | 33 | Campaigns in MCA | - | - | - | - | - |
| 8 | 34 | Reporting and Dashboards | Done | - | - | - | - |
| 9 | 35 | Capstone Project | Deferred | - | - | - | - |
```

- [ ] **Step 3: Add restructure decision to the Decisions Log**

Add this row to the Decisions Log table:

```markdown
| 2026-08-12 | Course restructured from 6 parts to 9 parts | Part 3 was a monolith covering CMS, email, personalization, flows, landing pages, and activations. Split into dedicated sections: Content & Email Building (Part 3), Dynamic Content & Personalization (Part 4), Flows & Automation (Part 5), Landing Pages & Web (Part 6). AI moved to Part 7, Analytics merged with new Campaigns module into Part 8, Capstone becomes Part 9. Consent automation flow moved from Part 1 to Part 5. See `.planning/specs/2026-08-12-course-restructure-design.md`. |
| 2026-08-12 | Handlebars split into 3 progressive modules | 44 helper functions cannot be covered in one module. Mirrors Odin Project JS section: foundations → working with data → advanced techniques |
| 2026-08-12 | Email builder split into 3 modules (editor, content blocks, templates) | Each introduces one concept with its own propagation rule. Progressive complexity |
| 2026-08-12 | Web connector added as multi-subpage module | Covers setup, consent banner, Data 360 integration, custom events, identity capture, and Interactions SDK |
| 2026-08-12 | Campaigns and Analytics merged into Part 8 | Both about organizing and measuring marketing activity. Campaigns after flows means learners can link everything they have built |
```

- [ ] **Step 4: Update Open Items table**

Add a row for Campaigns research:

```markdown
| Campaigns in MCA feature scope | New module needs research: campaign workspace, metrics aggregation, Campaign Creation Agent | Not started |
```

Update stale module number references in existing open items:

```markdown
<!-- Before -->
| Module 25 capstone requirements | ...
| Module 20 (Messaging Channels) scope | ...
| Module 22 (Conversational Messaging) scope | ...

<!-- After -->
| Capstone project requirements | Needs design after all other modules are finalized | Not started |
| Messaging Channels scope | SMS/WhatsApp deferred. Decide whether to include as conceptual or remove entirely | Not started |
| Conversational Messaging scope | Depends on Messaging Channels. Same decision needed | Not started |
```

- [ ] **Step 5: Update stale module number references in Decisions Log**

The Decisions Log contains old module numbers that are now stale. Update these rows:

```markdown
<!-- Before -->
| 2026-08-06 | Module 7 Actionable List is Campaign Member-based, not Opportunity-based | ... |
| 2026-08-06 | Module 16 post-purchase is Automation Event Triggered Flow on Sales Order | ... |

<!-- After -->
| 2026-08-06 | Actionable List is Campaign Member-based, not Opportunity-based | No Opportunities in the data model |
| 2026-08-06 | Post-purchase flow is Automation Event Triggered Flow on Sales Order | Transactional send pattern |
```

- [ ] **Step 6: Update stale Phase 3 checklist reference**

```markdown
<!-- Before -->
- [ ] HTML paste email snippet created (Module 13)

<!-- After -->
- [ ] HTML paste email snippet created (Email Templates module)
```

- [ ] **Step 7: Commit**

```bash
git add .planning/PROGRESS.md
git commit -m "$(cat <<'EOF'
docs: update PROGRESS.md for course restructure

New module table with 35 modules across 9 parts.
Added restructure decisions to the decisions log.
Updated stale module number references throughout.
EOF
)"
```

---

### Task 5: Update Module Assignments Spec

Restructure `.planning/specs/module-assignments.md` to match the new part structure. Add stub assignment sections for new modules. Keep existing assignment content for moved modules.

**Files:**
- Modify: `.planning/specs/module-assignments.md`

**Interfaces:**
- Consumes: nothing
- Produces: updated assignment spec matching the new course structure

- [ ] **Step 1: Read the current module-assignments.md in full**

Read `.planning/specs/module-assignments.md` to understand the full content.

- [ ] **Step 2: Update the "Revised Part 3 order" table at the top**

Replace the existing table with:

```markdown
## Course Structure (Revised 2026-08-12)

See `.planning/specs/2026-08-12-course-restructure-design.md` for the full restructure design spec.

**Part 3: Content & Email Building**
| # | Module |
|---|--------|
| 11 | Salesforce CMS & Content Management |
| 12 | The Email Builder |
| 13 | Content Blocks |
| 14 | Email Templates |

**Part 4: Dynamic Content & Personalization**
| # | Module |
|---|--------|
| 15 | Marketing Objects |
| 16 | Merge Fields & Dynamic Content |
| 17 | Handlebars: Foundations |
| 18 | Handlebars: Working with Data |
| 19 | Handlebars: Advanced Techniques |
| 20 | AMPscript in MCA |
| 21 | Project: Personalized Campaign Email |

**Part 5: Flows & Automation**
| # | Module |
|---|--------|
| 22 | Flow Fundamentals |
| 23 | Activation Templates |
| 24 | Flows: Orchestration & Logic |
| 25 | Flows: Advanced |
| 26 | Project: Consent Automation Flow |

**Part 6: Landing Pages & Web**
| # | Module |
|---|--------|
| 27 | Landing Pages & Forms |
| 28 | Landing Pages: Advanced |
| 29 | Web Connector (multi-subpage) |

**Part 7: AI & Intelligence**
| # | Module |
|---|--------|
| 30 | Agentforce for Marketing |
| 31 | Conversational Messaging |
| 32 | Predictive AI |

**Part 8: Campaigns & Analytics**
| # | Module |
|---|--------|
| 33 | Campaigns in MCA |
| 34 | Reporting & Dashboards |

**Part 9: Capstone**
| # | Module |
|---|--------|
| 35 | Capstone Project |
```

- [ ] **Step 3: Restructure Part 3 assignment section**

Move the existing Module 12 (CMS) and Module 13 (Email Builder) assignments under a "Part 3: Content & Email Building" heading. Rename Module 13 heading from "Email Builder Deep Dive" to "The Email Builder".

Add stub assignment sections for the two new modules:

```markdown
### Module 13 — Content Blocks

> **The client wants:** (assignment not yet designed — pending research)

**Assignment:** TBD

---

### Module 14 — Email Templates

> **The client wants:** (assignment not yet designed — pending research)

**Assignment:** TBD

> **Note:** Template-related assignment content from the old Module 13 (Email Builder Deep Dive) should be moved here. The three templates (Monthly Newsletter, Product Spotlight, Loyalty Tier Notification) and the HTML paste email belong in this module.
```

- [ ] **Step 4: Create Part 4 assignment section**

Add a new "Part 4: Dynamic Content & Personalization" section. Move relevant content from the old Module 14 (Personalization: Handlebars & AMPscript) and add stubs for new modules:

```markdown
## Part 4: Dynamic Content & Personalization

### Module 15 — Marketing Objects

> **The client wants:** (assignment not yet designed — pending research into Marketing Objects feature)

**Assignment:** TBD

---

### Module 16 — Merge Fields & Dynamic Content

> **The client wants:** (assignment not yet designed)

**Assignment:** TBD

> **Note:** The no-code personalization content from the old Module 14 (data sources tab, content variables, dynamic variations) belongs here.

---

### Module 17 — Handlebars: Foundations

> **The client wants:** (assignment not yet designed)

**Assignment:** TBD

---

### Module 18 — Handlebars: Working with Data

> **The client wants:** (assignment not yet designed)

**Assignment:** TBD

---

### Module 19 — Handlebars: Advanced Techniques

> **The client wants:** (assignment not yet designed)

**Assignment:** TBD

---

### Module 20 — AMPscript in MCA

> **The client wants:** (assignment not yet designed — pending research into supported AMPscript functions)

**Assignment:** TBD

---

### Module 21 — Project: Personalized Campaign Email

> **The client wants:** LEOptical needs a complete personalized email for their upcoming VisionCare Rewards campaign, pulling data from the data graph and marketing objects, using templates and content blocks, with Handlebars personalization throughout.

**Assignment:** TBD — ties together everything from Parts 3-4.
```

- [ ] **Step 5: Restructure Part 5 assignment section**

Move existing assignment content under "Part 5: Flows & Automation" with these new headings:
- Old "Module 15 — Flow Fundamentals" → `### Module 22 — Flow Fundamentals`
- Old "Module 19 — Activation Templates" → `### Module 23 — Activation Templates`
- Old "Module 16 — Flow Orchestration" → `### Module 24 — Flows: Orchestration and Logic`

Keep the existing assignment content under each heading. Add stubs for Flows Advanced and Consent Flow Project:

```markdown
### Module 25 — Flows: Advanced

> **The client wants:** (assignment not yet designed — pending research into batching, interviews, re-entry, Unified Individual ID mutability)

**Assignment:** TBD

---

### Module 26 — Project: Consent Automation Flow

> **The client wants:** Build the permanent consent automation infrastructure. The consent flow is a Data 360-Triggered Flow that fires on the Individual DMO and creates OPT_IN records for new individuals.

**Assignment:** Content exists in `docs/part-5-flows/consent-flow-project.md` — expand into a full project assignment with testing phases.
```

- [ ] **Step 6: Create Part 6 assignment section**

Move existing Module 17-18 (Landing Pages) assignments under "Part 6: Landing Pages & Web". Add a stub for Web Connector:

```markdown
### Module 29 — Web Connector

> **The client wants:** LEOptical's external website (hosted on Netlify) needs to send visitor behavior data back to Data 360 so the marketing team can use website activity in segments and flows.

**Assignment:** TBD — multi-subpage module covering setup, consent banner, Data 360 integration, custom events, identity capture, and Interactions SDK.
```

- [ ] **Step 7: Create Part 8 assignment section**

Add a section for Campaigns, keep existing Reporting & Dashboards:

```markdown
## Part 8: Campaigns & Analytics

### Module 33 — Campaigns in MCA

> **The client wants:** (assignment not yet designed — pending research into MCA campaigns feature)

**Assignment:** TBD

---

### Module 34 — Reporting & Dashboards
```

(Keep existing Module 24/Reporting content, renumbered to 34.)

- [ ] **Step 8: Commit**

```bash
git add .planning/specs/module-assignments.md
git commit -m "$(cat <<'EOF'
docs: restructure module-assignments.md for new course layout

Reorganized into Parts 3-9. Added stub assignments for new modules.
Moved existing assignment content to new module numbers.
EOF
)"
```

---

### Task 6: Update Course Design Spec and CLAUDE.md

Update the original course design spec and CLAUDE.md to reflect the new structure.

**Files:**
- Modify: `.planning/specs/2026-08-06-mca-enablement-course-design.md`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: nothing
- Produces: updated reference docs

- [ ] **Step 1: Read both files in full**

Read `.planning/specs/2026-08-06-mca-enablement-course-design.md` and `CLAUDE.md`.

- [ ] **Step 2: Update the Module Outline in the course design spec**

Replace the existing "Module Outline" section (Parts 1-6 tables) with the new structure. Add a note at the top:

```markdown
> **Updated 2026-08-12:** Course restructured from 6 parts to 9 parts. See `.planning/specs/2026-08-12-course-restructure-design.md` for full rationale.
```

Replace the Part 3-6 tables with the new Parts 3-9. Keep Parts 1-2 as-is.

- [ ] **Step 3: Update the Exam Alignment Summary**

Replace the existing table with:

```markdown
| Exam Section | Weight | Course Parts | Modules |
|---|---|---|---|
| Platform Setup & Governance | 13% | Part 1 | 1-3 |
| Consent | 13% | Part 1 | 4-5 |
| Data Modeling, IDR & Segmentation | 25% | Part 2 | 6-10 |
| Campaign Design, Flow & Content | 30% | Parts 3-6 | 11-29 |
| Agentforce & AI Innovation | 11% | Part 7 | 30-32 |
| Analytics & Performance Insights | 8% | Part 8 | 33-34 |
```

- [ ] **Step 4: Update CLAUDE.md**

In the "Content" bullet under "Architecture", update the description to mention the new part structure:

```markdown
**Content:** `docs/` contains module markdown organized by part (`part-1-foundations/`, `part-2-data/`, `part-3-content/`, `part-4-personalization/`, `part-5-flows/`, `part-6-web/`, `part-7-ai/`, `part-8-analytics/`, `part-9-capstone/`). Each part has a `_category_.json` for sidebar ordering.
```

- [ ] **Step 5: Commit**

```bash
git add .planning/specs/2026-08-06-mca-enablement-course-design.md CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: update course design spec and CLAUDE.md for restructure

Updated module outline, exam alignment, and directory references
to reflect the new 9-part course structure.
EOF
)"
```

---

### Task 7: Build Verification

Run the Docusaurus build to verify everything wires up correctly — sidebar renders, registry picks up all modules, no broken links.

**Files:**
- No file changes (verification only)

**Interfaces:**
- Consumes: all changes from Tasks 1-6
- Produces: confirmation that the build passes

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: clean build with no errors. Watch for:
- Broken `<ModuleLink>` references (slug not found)
- Missing frontmatter fields
- Duplicate sidebar positions within a part

- [ ] **Step 2: If build fails, fix issues**

Common issues:
- **Broken ModuleLink:** A module references a slug that was renamed or moved. Find the reference with `grep -r 'ModuleLink.*slug="old-slug"' docs/` and update it.
- **Missing frontmatter:** Add the required `sidebar_position`, `title`, and `description` fields.
- **Duplicate positions:** Two files in the same directory have the same `sidebar_position`. Renumber one.

- [ ] **Step 3: Run the content linter**

```bash
npm run lint:content
```

Expected: no new errors from the restructure. Existing VERIFY warnings are expected.

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: passes with no errors.

- [ ] **Step 5: Start dev server and spot-check**

```bash
npm start
```

Verify in the browser:
- Sidebar shows all 9 parts in correct order
- Each part expands to show its modules in correct order
- Course overview page (homepage) renders all modules grouped by part
- Web Connector shows as a nested/accordion module within Part 6
- Click a few module links to verify pages render

- [ ] **Step 6: Commit any fixes**

If any fixes were needed:

```bash
git add -A
git commit -m "fix: resolve build issues from course restructure"
```

- [ ] **Step 7: Final verification commit (if no fixes needed)**

If everything passed clean, no commit needed. The restructure is complete.
