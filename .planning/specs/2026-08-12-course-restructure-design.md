# Course Restructure Design Spec

## Problem

Part 3 ("Building for the Client") is a monolith — 9 modules covering CMS, email building, personalization, flows, landing pages, and activation templates. Three major topic areas (Content/Email, Handlebars/Personalization, Flows) each deserve deeper treatment to be truly comprehensive. The current structure glosses over Handlebars (1 module), flows (2 modules), and email building (1 module). A consultant finishing this course should be able to handle real implementations without guessing.

## Goals

1. **Comprehensive coverage** — Handlebars gets its own progressive multi-module section. Flows get fundamentals + advanced. Email building is progressive (drag-drop → content blocks → templates).
2. **Modularity** — someone who only needs Handlebars, or only needs Flows, can work through that section independently.
3. **Progressive building** — each module within a section layers on the previous one. Learners build real artifacts that get more complex over time.
4. **Maintainability** — all source-of-truth documents (PROGRESS.md, module-assignments.md, course design spec) are updated. The module registry plugin derives everything from frontmatter, so no component changes are needed.

## What Changes

### Parts 1-2: Unchanged

Setup & Foundations and Data & Audiences remain as-is. The consent automation flow project moves from Part 1 to Part 5 (Flows & Automation) — it was always deferred and fits better as a flow project after learners understand flow building.

### Part 3: Content & Email Building (was part of old Part 3)

Progressive email building. Each module introduces one concept and produces a built artifact.

| Position | Slug | Title | Key Concepts |
|----------|------|-------|-------------|
| 1 | salesforce-cms | Salesforce CMS & Content Management | CMS workspace, collections, content types, asset organization |
| 2 | email-builder | The Email Builder | Drag-and-drop editor, all builder elements, sections, preview & test. Build Email 1 (simple promotional email) |
| 3 | content-blocks | Content Blocks | Reusable content blocks, propagation behavior, converting to sections (stops propagating). Build Email 2 using content blocks |
| 4 | email-templates | Email Templates | Templates as starting points (don't propagate), locked/editable regions, locking strategies, HTML paste email. Build 2-3 templates with different lock levels |

**Narrative arc:** Raw email → reusable pieces → reusable starting points. Each layer adds a propagation rule.

### Part 4: Dynamic Content & Personalization (was Module 14)

From no-code personalization to Handlebars mastery. Mirrors The Odin Project's JavaScript progression — teach concepts incrementally, then assign a project.

| Position | Slug | Title | Key Concepts |
|----------|------|-------|-------------|
| 1 | marketing-objects | Marketing Objects | What they are (like MCE data extensions), CSV import, when/why to use them, setting up LEOptical marketing objects |
| 2 | merge-fields-dynamic-content | Merge Fields & Dynamic Content | Data sources tab, merge fields (no-code), content variables, dynamic variations, accessing data graph data. No Handlebars yet |
| 3 | handlebars-foundations | Handlebars: Foundations | Syntax basics (`{{expression}}`), `get` vs dot notation, `with` for context, accessing data graph, `if`/`unless`/`equals`, `fallback`, string helpers (Concat, Replace, ProperCase, etc.) |
| 4 | handlebars-working-with-data | Handlebars: Working with Data | `each` for looping, `filter`, `sort`, `map`, `flatten`, the Map/Flatten pattern, navigating nested data graph structures, `slice`, `length`. Build a "Your Recent Orders" section |
| 5 | handlebars-advanced | Handlebars: Advanced Techniques | Math helpers, date helpers (DateAdd, DateDiff, Now, TimeZoneConversion), `Format`/`FormatCurrency`/`FormatNumber`, `Query`/`QueryFirst` (Marketing Object lookups), `GetContentBlock`, `Set`, `Hash`, `JSONPath`, `RaiseError` for debugging |
| 6 | ampscript-in-mca | AMPscript in MCA | What's supported vs. not, resolves to Handlebars internally, ContentBlockByKey → getContentBlock conversion, when to use AMPscript vs Handlebars. Needs careful research |
| 7 | personalization-project | Project: Personalized Campaign Email | Build a complete multi-section personalized email from scratch using templates, content blocks, handlebars, data graph, marketing objects. Ties together everything from Parts 3-4 |

**Handlebars helper coverage by module:**

- Foundations: get, with, if, unless, equals, compare, and, or, not, isEmpty, iif, fallback, concat, replace, substring, trim, uppercase, lowercase, properCase, indexOf, char
- Working with Data: each, filter, flatten, get (advanced), lookup, map, slice, sort, length, repeat
- Advanced: add, subtract, multiply, divide, modulo, random, dateAdd, dateDiff, now, timeZoneConversion, format, formatCurrency, formatNumber, query, queryFirst, getContentBlock, personalizationResult, set, hash, jsonPath, raiseError

### Part 5: Flows & Automation (was Modules 15-16)

| Position | Slug | Title | Key Concepts |
|----------|------|-------|-------------|
| 1 | flow-fundamentals | Flow Fundamentals | Flow types (marketing vs standard), all flow elements (the full table from current spec), trigger types, entry criteria, send email action. Build a simple welcome flow |
| 2 | activation-templates | Activation Templates | Contact point selection, the "3 emails" gotcha, activation vs flow-based sends, required fields |
| 3 | flow-orchestration | Flows: Orchestration & Logic | Decision branches, path experiments, wait steps (time/date/event), Einstein Decision, content variables in flows. Expand welcome flow into nurture series + build post-purchase flow |
| 4 | flows-advanced | Flows: Advanced | Subflows, Send to Flow, variables/formulas/constants, collections, batching, interviews, re-entry settings, Unified Individual ID mutability and how it affects re-entry. Needs thorough research |
| 5 | consent-flow-project | Project: Consent Automation Flow | Build the Data 360 triggered flow for automatic consent record creation. Moved from Part 1 where it was deferred. Tests flow skills on a real infrastructure problem |

**Why activation templates after flow fundamentals:** Learners need to understand sending an email in a flow before learning how to control which contact point gets sent to. Activation templates are the bridge between "I can send an email" and "I can send the right email to the right address."

### Part 6: Landing Pages & Web (was Modules 17-18 + new web connector)

| Position | Slug | Title | Key Concepts |
|----------|------|-------|-------------|
| 1 | landing-pages | Landing Pages & Forms | Page builder, form components, consent banner integration, Lead creation, required field mapping |
| 2 | landing-pages-advanced | Landing Pages: Advanced | Hidden fields, UTM parameters, auto-populate from URL, Campaign assignment via hidden CampaignId |
| 3 | web-connector | Web Connector (multi-subpage) | See subpage breakdown below |

**Web Connector subpages:**

| Subpage | Slug suffix | Focus |
|---------|-------------|-------|
| Index | web-connector/index | What the web connector is, how it fits into MCA data collection, overview of what we're building |
| Setting Up | web-connector/setup | Creating the web connector in MCA, configuring the embed code, deploying to the Netlify site, verifying the connection |
| Consent Banner | web-connector/consent-banner | Configuring the web consent banner for external sites, connecting to MCA consent model, testing consent capture |
| Data 360 Integration | web-connector/data-360-integration | Auto-created data streams from the connector, verifying data lands in Data 360, understanding connector DMO mappings |
| Custom Events & Schema | web-connector/custom-events | Adding custom events to the connector, updating the connector schema, tracking events and verifying they land in Data 360 |
| Identity Capture | web-connector/identity-capture | Linking anonymous visitors to known Individuals. Currently an unsolved open item — needs research |
| Interactions SDK | web-connector/interactions-sdk | Reference/walkthrough for adding custom events programmatically via the Interactions SDK |

### Part 7: AI & Intelligence (unchanged from current Part 4)

| Position | Slug | Title |
|----------|------|-------|
| 1 | agentforce | Agentforce for Marketing |
| 2 | conversational-messaging | Conversational Messaging |
| 3 | predictive-ai | Predictive AI |

Messaging Channels (SMS/WhatsApp) remains deferred.

### Part 8: Campaigns & Analytics (merged from old Parts 5 + new Campaigns)

| Position | Slug | Title | Key Concepts |
|----------|------|-------|-------------|
| 1 | campaigns | Campaigns in MCA | Campaign workspace, linking flows/emails to campaigns, metrics aggregation, Campaign Creation Agent. Needs research |
| 2 | reporting-dashboards | Reporting & Dashboards | Pre-built dashboards, campaign performance reporting, surfacing marketing data across the platform |

**Why merged:** Campaigns and analytics are both about organizing and measuring marketing activity. Campaigns give structure; dashboards give visibility. Natural sequence: set up campaigns → report on them.

### Part 9: Capstone (unchanged)

| Position | Slug | Title |
|----------|------|-------|
| 1 | capstone-project | Capstone Project |

## Module Count Summary

| Part | Name | Modules |
|------|------|---------|
| Intro | Introduction | 4 |
| 1 | Setup & Foundations | 5 |
| 2 | Data & Audiences | 6 |
| 3 | Content & Email Building | 4 |
| 4 | Dynamic Content & Personalization | 7 |
| 5 | Flows & Automation | 5 |
| 6 | Landing Pages & Web | 3 |
| 7 | AI & Intelligence | 3 |
| 8 | Campaigns & Analytics | 2 |
| 9 | Capstone | 1 |
| **Total** | | **39** (4 intro + 35 numbered modules; web connector subpages count as part of module 29) |

## Research Needed

These modules require research before content can be written:

| Module | What Needs Research |
|--------|-------------------|
| Marketing Objects | Full feature set, limitations, CSV import process, Handlebars/AMPscript access patterns |
| AMPscript in MCA | Exactly which functions are supported, which are not, known gaps vs MCE AMPscript |
| Flows: Advanced | Batching behavior, interview mechanics, re-entry settings, Unified Individual ID mutability |
| Consent Automation Flow | Trigger mechanism validation in live SDO (existing open item) |
| Web Connector (all subpages) | Full setup process, data streams, custom events, schema updates, Interactions SDK, identity capture |
| Campaigns in MCA | Campaign workspace features, metrics aggregation, Campaign Creation Agent capabilities |

## Documents to Update

When implementation begins, these source-of-truth documents must be updated:

1. **`.planning/PROGRESS.md`** — Replace the module table with new numbering, slugs, and titles. Reset content status for new/restructured modules. Keep completed modules' status.
2. **`.planning/specs/module-assignments.md`** — Add assignment specs for all new modules. Update Part 3 revised order table. Restructure into new Parts.
3. **`.planning/specs/2026-08-06-mca-enablement-course-design.md`** — Update the Module Outline and Exam Alignment Summary sections to reflect new structure.
4. **`docs/` directory** — Create new part folders (part-3-content, part-4-personalization, part-5-flows, part-6-web, part-7-ai, part-8-analytics, part-9-capstone). Move existing files. Create new module files with frontmatter.
5. **`_category_.json` files** — Create/update for all new part folders with correct labels, positions, and descriptions.
6. **`CLAUDE.md`** — Update any references to Part 3 module numbers or structure.

## What Does NOT Change

- Parts 1-2 (foundations, data) — untouched except consent-automation-flow moves out
- Module registry plugin — derives from frontmatter, no code changes needed
- ProgressOverview / ProgressCheckbox — work off registry, no changes needed
- Design tokens, CSS, components — no changes
- Content pipeline (research → write → fact-check) — no changes
- Writing style guide — no changes

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Consent automation flow moves from Part 1 to Part 5 | It was always deferred. Learners need flow-building skills first. It serves as a project that tests flow concepts on a real infrastructure problem |
| Email builder split into 3 modules (editor, content blocks, templates) | Each introduces one concept with its own propagation rule. Progressive complexity. Learner builds something in each |
| Handlebars split into 3 modules (foundations, data, advanced) | 44 helper functions can't be covered in one module. Progressive complexity mirrors Odin Project's JS section |
| Marketing Objects gets its own module before Handlebars | Need to set up Marketing Objects before you can do `Query`/`QueryFirst` lookups in Handlebars Advanced |
| Merge fields & dynamic content is separate from Handlebars | No-code personalization first, then code. Different skill level, different audience segment |
| Activation templates after flow fundamentals, before orchestration | Need to understand email sending in flows first, then learn contact point control, then build complex flows |
| Web connector is multi-subpage | Too much ground to cover in one page: setup, consent, data streams, custom events, identity, SDK |
| Campaigns & Analytics merged into one part | Both about organizing and measuring. Campaigns after flows means learners can link everything they've built |
