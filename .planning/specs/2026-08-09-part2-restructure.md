# Part 2 Restructure — Design Spec

**Date:** 2026-08-09
**Status:** Draft

## Summary

Restructure Part 2 (Data & Audiences) to reflect the new Introduction to Data 360 primer and to better match the practical learning arc. The main changes:

1. **Rename Module 6** from "Data 360 and Data Model Objects" to "Working with Data 360"
2. **Convert Module 6** to a multi-subpage module covering the full Data 360 operational experience
3. **Remove Module 7** (CRM Data Ingestion) as a standalone module — its content is absorbed into Module 6
4. **Swap the order** of Identity Resolution and Data Graphs — IDR comes first because Data Graphs depend on Unified Individuals
5. **Module count** drops from 6 to 5 in Part 2

## Rationale

The Introduction to Data 360 module now gives learners the vocabulary and mental model (data streams, DLOs, DMOs, IDR, segments). Part 2 no longer needs to teach these concepts from scratch. Instead, it should:

- Show them what these things actually look like in their SDO
- Teach the operational mechanics (refresh chain, manual refresh in SDOs, dependency order)
- Have them build the LEOptical data model hands-on

The old Module 7 (CRM Data Ingestion) overlaps heavily with Module 6 once Module 6 starts with "tour the existing CRM data streams." The Actionable List assignment moves to Segmentation.

IDR moves before Data Graphs because the refresh chain page explicitly teaches "data streams refresh, then IDR runs, then the Data Graph refreshes." Teaching Data Graphs before IDR contradicts that sequence.

---

## New Part 2 Structure

```
Part 2: Data & Audiences
├── Working with Data 360                (multi-subpage, sidebar_position: 1)
│   ├── index.md                         — Overview, what this module covers
│   ├── exploring-your-org.md            — Tour data streams, DLOs, DMOs, field mappings
│   ├── the-refresh-chain.md             — Dependency order reference page
│   ├── ingesting-external-data.md       — CSV data streams, standard vs custom DMOs
│   └── the-leoptical-data-model.md      — ERD, relationship design decisions
├── Identity Resolution                  (single page, sidebar_position: 2)
├── Data Graphs                          (single page, sidebar_position: 3)
├── Segmentation                         (single page, sidebar_position: 4)
└── Consumption and Entitlements         (single page, sidebar_position: 5)
```

### Old → New Mapping

| Old # | Old Module | New # | New Location |
|-------|-----------|-------|-------------|
| 6 | Data 360 and Data Model Objects | 6 | Working with Data 360 (expanded to multi-subpage) |
| 7 | CRM Data Ingestion | — | Absorbed into Working with Data 360 subpages; Actionable List moves to Segmentation |
| 8 | Data Graphs | 8 | Data Graphs (moved after IDR) |
| 9 | Identity Resolution | 7 | Identity Resolution (moved before Data Graphs) |
| 10 | Segmentation | 9 | Segmentation (inherits Actionable List from old Module 7) |
| 11 | Consumption and Entitlements | 10 | Consumption and Entitlements |

---

## Content Boundaries: Introduction to Data 360 vs Working with Data 360

The Introduction to Data 360 module (`docs/introduction/intro-to-data-360.md`) is a conceptual primer. Working with Data 360 is the hands-on counterpart. They must complement each other without repeating or conflicting.

### What the intro already covers (do NOT re-teach)

- What Data 360 is (unified data platform underneath MCA)
- The three conceptual stages: Connect, Harmonize and Unify, Analyze and Act
- What data streams are (ingestion pipelines from source systems)
- What DLOs are (raw representation of source data, persistent, foundation layer)
- What DMOs are (virtual views that reference DLO data, not separate copies)
- That one DLO can map to multiple DMOs
- Standard vs custom DMOs (Individual, Contact Point Email, Sales Order are standard; Eye Exam is custom)
- What DMO relationships are and why they matter for segmentation
- What identity resolution is (matching records → Unified Individual)
- What segments are (queries against DMOs and relationships)
- The end-to-end flow: data streams → DLOs → DMOs → IDR → relationships → segments
- Coming from MCE? comparisons (DLOs vs data extensions, DMO relationships vs Contact Builder)

### What the intro explicitly defers to later modules

- "The Data Model Objects module later in the course covers DMOs in detail" (line 70)
- "The Identity Resolution module covers the matching rules, configuration, and edge cases" (line 103)
- "The Segmentation module covers this in depth" (line 111)
- "Each one gets its own dedicated module where you will configure it hands-on" (line 124)

### What Working with Data 360 covers (NEW content, not in the intro)

- **What data streams look like in the UI.** The intro says "you will set up data streams." This module says "open this screen, click this tab, here is what you see."
- **SDO limitations.** No scheduled refreshes. Manual refresh required. Not mentioned in the intro.
- **Full refresh vs incremental refresh mechanics.** Not in the intro.
- **The refresh dependency chain.** The intro mentions the end-to-end flow but does NOT cover the operational dependency (refresh data stream → run IDR → refresh Data Graph) or what happens when you skip a step. This is new.
- **What DLOs look like in the UI.** The intro describes them conceptually. This module shows them.
- **DSO history.** Not in the intro (intro's research confirmed DSOs are internal infrastructure, correctly omitted from the primer).
- **Field mapping mechanics.** The intro says "you create a DMO by mapping DLO fields to it." This module shows them how to do it.
- **Standard DMO advantages beyond what the intro covers.** The intro mentions standard vs custom exists. This module explains the tradeoffs: automatic relationships, built-in behaviors, when to use custom.
- **CSV data stream creation.** The intro mentions CRM objects and CSV files as sources but does not walk through creating one.
- **Ingestion troubleshooting.** Not in the intro.
- **Data Transforms.** Not in the intro.
- **Data Graphs (light touch).** The intro does not mention Data Graphs at all. The refresh chain page introduces them briefly.
- **The LEOptical ERD.** The intro uses LEOptical examples but does not present the full data model.

### How they reference each other

**Intro → Working with Data 360:** The intro already says "the Data Model Objects module covers DMOs in detail" (this forward reference should be updated to reference "Working with Data 360" when the slug changes).

**Working with Data 360 → Intro:** The index.md overview should say something like: "The Introduction to Data 360 gave you the vocabulary and mental model. This module is where you see it in practice." Subpages can reference the intro for concept refreshers: "If you need a refresher on what DMOs are, revisit the Introduction to Data 360 module."

### Potential conflict zones (writer must be careful)

| Topic | Intro says | Working with D360 must NOT say | Working with D360 SHOULD say |
|-------|-----------|-------------------------------|------------------------------|
| DLO nature | "Raw representation of source data, persistent, not temporary" | "DLOs are temporary staging" (contradicts intro) | "As you learned in the intro, DLOs persist. Here is what they look like." |
| DMO storage | "Virtual view, does not store a separate copy, references DLO data" | "DMOs store their own records" (contradicts intro) | "You saw in the intro that DMOs are virtual views. Watch what happens when you refresh the data stream — the DMO reflects the change without any separate update." |
| Standard vs custom | "Standard for common entities, custom for business-specific" | A different set of standard DMO examples | Same examples (Individual, Contact Point Email, Sales Order, Eye Exam as custom) plus deeper tradeoff discussion |
| Data flow | "Data streams → DLOs → DMOs → IDR → relationships → segments" | A different ordering | Same ordering, expanded with refresh chain details and "what happens if you skip a step" |

---

## Subpage Specs

### index.md — Working with Data 360

**sidebar_position:** 1

**Overview (~150 words)**

The Introduction to Data 360 gave you the vocabulary. This module is where you open your SDO and see it all in practice. You will tour the data streams, DLOs, and DMOs that the Marketing Data Kit set up automatically, learn the operational mechanics that govern how data moves through the platform, ingest LEOptical's external data sources, and review the target data model you will build throughout the course.

This is the longest module in the course. It has four subpages. Work through them in order.

**No assignment on the index page.** Each subpage has its own assignment or tasks.

---

### exploring-your-org.md — Exploring Your Org

**sidebar_position:** 1

**Purpose:** Hands-on tour of the Data 360 infrastructure that the Marketing Data Kit auto-installed during Getting Started. The learner has never actually looked at these objects. This is the "oh, THAT's what a data stream looks like" moment.

**Lesson body sections:**

**Data streams in your org**
- Open Data 360 Setup. Navigate to Data Streams.
- The Marketing Data Kit auto-installed CRM data streams when you provisioned Data 360 in Getting Started. These bring CRM objects (Contact, Account, etc.) into Data 360.
- Click into the Contact data stream. Tour every tab on the screen: (need to research what tabs exist and what each shows)
- Note the refresh status. When was it last refreshed? Is it scheduled?
- **SDO limitation:** SDOs do not allow scheduled data stream refreshes. In a production client org, CRM data streams refresh every ~15 minutes via upsert. In your SDO, you must manually refresh. This is important for the rest of the course: every time you create or update a CRM record, you need to manually refresh the data stream before Data 360 will see the change.
- Full refresh vs incremental refresh: a full refresh deletes all records in the DLO and re-ingests from the source. An incremental refresh (upsert) only brings in new and changed records. (need to research exact mechanics and when each is used)

**Data lake objects**
- Navigate to the DLOs. Show them what a DLO looks like.
- Point out how similar the DLO structure is to the data stream — the DLO mirrors the source.
- Brief history of DSOs (Data Storage Objects): DSOs are the internal storage layer beneath DLOs. They are not user-facing in the current platform, but they existed as a visible layer in earlier versions of Data Cloud. The architecture is: DSO (internal storage) → DLO (user-visible raw data) → DMO (virtual structured view). Mentioning this gives context for why the architecture is layered the way it is and why some older documentation references DSOs.
- DLOs persist. They accumulate data over time. They are not temporary staging. But you rarely interact with them directly after initial setup.

**Field mappings and DMO relationships**
- From a DLO, navigate to the field mappings. Show how DLO fields map to DMO fields.
- Show that one DLO can map to multiple DMOs. Example: the Contact DLO maps fields to both the Individual DMO and the Contact Point Email DMO.
- Show them the existing DMOs that the Marketing Data Kit created. Tour Individual, Contact Point Email, Account.
- Point out that standard DMOs come with automatic relationships. (need to research: what exactly comes out of the box with standard DMOs — automatic relationships, built-in behaviors, anything else)

**Assignment:**
- Open the Contact data stream and document what you see on each tab
- Navigate from the Contact data stream to its DLO, then to the DMO mappings
- Identify which DMOs the Contact DLO maps to
- Manually refresh the Contact data stream and note how long it takes
- Find and document at least one example of a single DLO mapping to multiple DMOs

**Knowledge check:**
- What is the difference between a full refresh and an incremental refresh?
- Why do you need to manually refresh data streams in an SDO?
- How does a DLO relate to its source data stream?
- Can a single DLO map to more than one DMO? Give an example from your org.

---

### the-refresh-chain.md — The Refresh Chain

**sidebar_position:** 2

**Purpose:** Reference page the learner can bookmark and return to throughout the course. Every time they add data and wonder "why isn't my new record showing up?" this page has the answer.

**Lesson body sections:**

**The dependency chain**

This is the operational heartbeat of Data 360. When you add, update, or delete data, three things need to happen in order:

1. **Data stream refreshes.** New or updated records flow from the source system into the DLO. Until this happens, Data 360 does not know the record exists or changed.

2. **Identity resolution runs.** IDR reads the DMOs (which reference the DLOs), applies matching rules, and creates or updates Unified Individuals. Until this happens, the record exists in the data model but is not linked to a unified identity. It will not appear in segments that filter on Unified Individuals.

3. **Data Graph refreshes.** The Data Graph is a pre-computed snapshot of related records for each Unified Individual. It is what powers Handlebars personalization in emails. Until the Data Graph refreshes, newly unified records will not appear in personalization merge fields.

If you skip a step or run them out of order, downstream data is stale or missing. Examples:
- You create a Contact in CRM but do not refresh the Contact data stream → Data 360 does not know the record exists
- You refresh the data stream but do not run IDR → the record exists in the DMO but is not linked to a Unified Individual and will not appear in segments
- IDR runs but the Data Graph has not refreshed → the record is unified but Handlebars merge fields will not resolve for it

**Refresh mechanics in SDOs vs production**

| | SDO | Production |
|---|-----|-----------|
| CRM data stream refresh | Manual only | Every ~15 min (upsert). Full refresh cadence is configurable. |
| CSV/external data stream refresh | Manual only | Configurable schedule |
| Identity resolution | Manual trigger or flow-triggered | Configurable schedule |
| Data Graph refresh | Manual trigger | Configurable schedule |

In your SDO, the workflow every time you add data is:
1. Create/update the record in CRM (or upload a CSV)
2. Go to Data 360 Setup → Data Streams → find the relevant stream → Refresh
3. Wait for the refresh to complete
4. Run Identity Resolution
5. Refresh the Data Graph

This is tedious. It is also the reality of working in an SDO. In a production org, these steps are automated on schedules.

**What is a Data Graph?**
- A Data Graph is a pre-computed snapshot of connected records for each Unified Individual
- You already created one in Getting Started (the Marketing Content Personalization graph)
- It is what Handlebars personalization reads from when resolving merge fields in emails
- The Data Graphs module covers configuration in detail. For now, know that it exists, that it needs to refresh after IDR, and that personalization depends on it.
- Gotcha: if a Unified Individual does not have data for a field, the Data Graph omits that field entirely from the JSON. It is not null. It does not exist. This matters for Handlebars expressions and is covered in detail in the Personalization module.

**Data Transforms (light touch)**
- Data Transforms let you reshape, filter, or enrich data between the DLO and DMO layers
- They run as part of the data pipeline, after ingestion but before the data reaches DMOs
- Common uses: combining fields, filtering out test records, type conversions
- LEOptical does not use Data Transforms in this course, but you should know they exist for client engagements where source data needs transformation before mapping
- (need to research: exact placement in the pipeline, common use cases, any SDO limitations)

**No formal assignment for this page.** It is a reference page. The learner will use it throughout the course.

**Knowledge check:**
- What are the three steps that must happen (in order) after you create a new CRM record before that record appears in a segment?
- What happens if you run IDR before the data stream has refreshed?
- Why does the Data Graph need to refresh after IDR?
- In an SDO, why must data stream refreshes be triggered manually?

---

### ingesting-external-data.md — Ingesting External Data

**sidebar_position:** 3

**Purpose:** Hands-on creation of data streams for LEOptical's CSV sources. This is the first time the learner creates their own data streams (vs touring the auto-installed CRM ones).

**Lesson body sections:**

**CSV data streams**
- LEOptical has three external data sources: loyalty members, ecommerce orders, and eye exam records
- Each needs its own data stream
- Walk through creating a data stream for a CSV source (need to research exact steps)
- Upload `loyalty_members.csv`, `ecommerce_orders.csv`, and `exam_history.csv`

**Standard vs custom DMOs**
- Standard DMOs come with automatic relationships and built-in behaviors (need to research exactly what). Examples: Individual, Contact Point Email, Sales Order, Account.
- Custom DMOs give you full control over fields and structure, but you wire up relationships yourself.
- For LEOptical: loyalty data maps to the standard Loyalty Program Member DMO (with custom fields). Ecommerce data maps to standard Sales Order and Sales Order Product DMOs. Eye exam data has no standard equivalent, so you create a custom Eye Exam DMO.
- The tradeoff: standard DMOs integrate with platform features automatically (segmentation knows about them, IDR can reference them). Custom DMOs require more manual configuration. But sometimes the standard field names and relationships do not match what you need, and some consultants prefer custom DMOs for that reason.
- (need to research: what specific advantages standard DMOs have — automatic relationships, out-of-box segment templates, IDR awareness, anything else)

**Field mapping**
- Walk through mapping CSV fields to DMO fields
- Show how to handle field name mismatches (source has "order_total", DMO expects "TotalAmount")
- Show how to handle data type mismatches
- Show how to map to an existing DMO vs creating a new custom DMO

**Troubleshooting ingestion**
- The seed data has intentional dirty data. Some records will fail to ingest.
- Common causes: missing required fields, date format mismatches, values the platform does not recognize
- How to investigate failures: (need to research where failed records show up, how to debug)
- Record counts may not match source CSV row counts. That is expected. Document discrepancies.

**Assignment:**
- Create data streams for `loyalty_members.csv`, `ecommerce_orders.csv`, and `exam_history.csv`
- Map fields to the appropriate DMOs (standard for loyalty and ecommerce, custom for eye exams)
- Create the custom Eye Exam DMO
- Refresh all three data streams
- Verify record counts in each DMO and investigate any discrepancies
- Document which records failed and why

**Success criteria:**
- [ ] Three data streams are created (loyalty, ecommerce, eye exams)
- [ ] Loyalty data is mapped to the Loyalty Program Member DMO
- [ ] Ecommerce data is mapped to Sales Order and Sales Order Product DMOs
- [ ] Eye Exam custom DMO is created and mapped
- [ ] All three data streams have been refreshed successfully
- [ ] Record count discrepancies are investigated and documented
- [ ] You can explain the difference between using a standard DMO and creating a custom one

---

### the-leoptical-data-model.md — The LEOptical Data Model

**sidebar_position:** 4

**Purpose:** Teach the learner to read and understand the target data model. This is the architecture conversation you would have with a client.

**Lesson body sections:**

**The ERD**
- Present the full LEOptical ERD showing all DMOs and their relationships
- Walk through each entity: what it represents, where its data comes from, what relationships it has
- (The ERD itself is defined in `.planning/specs/data-model.md`)

**Relationship design decisions**
- Why each DMO was chosen (standard vs custom)
- Why relationships are structured the way they are
- What tradeoffs were made
- How this data model supports the segments LEOptical needs (forward reference to Segmentation module)

**DMO relationships in practice**
- How to define relationships between DMOs in Data 360 (need to research exact steps)
- Standard DMOs come with some relationships pre-defined. Custom DMOs require manual relationship setup.
- Show the relationships they need to create for the LEOptical data model

**Assignment:**
- Review the LEOptical ERD and verify your DMO setup matches it
- Create any missing relationships between DMOs
- Verify that relationships are correctly defined by navigating the data model in Data 360 Setup
- Write a brief data model summary (1 paragraph per DMO) explaining what it holds and how it connects to the rest of the model

**Success criteria:**
- [ ] All DMOs from the target data model exist in your org
- [ ] All relationships between DMOs are defined
- [ ] You can navigate the data model in Data 360 and trace relationships between entities
- [ ] Data model summary document is written
- [ ] You can explain why Eye Exam is a custom DMO while Sales Order is standard

---

## Identity Resolution (sidebar_position: 2)

Unchanged from current spec except:
- **sidebar_position changes from 4 to 2** (moved before Data Graphs)
- Module content and assignment remain the same
- The lesson should reference the refresh chain page: "You learned in the refresh chain that IDR must run after data streams refresh. Now you configure the rules that IDR uses."

---

## Data Graphs (sidebar_position: 3)

Unchanged from current spec except:
- **sidebar_position changes from 3 to 3** (stays at 3 but now follows IDR instead of preceding it)
- The lesson can now assume IDR has been taught. The learner understands Unified Individuals and has configured matching rules.
- Reference the refresh chain: "The Data Graph refreshes after IDR. You already know this from the refresh chain page."
- The Data Graph they created in Getting Started can now be revisited with full context.

---

## Segmentation (sidebar_position: 4)

Unchanged from current spec except:
- **sidebar_position changes from 5 to 4**
- **Inherits the Actionable List assignment** from old Module 7 (CRM Data Ingestion). Add as a section or stretch goal: create an Actionable List from Campaign Members.

---

## Consumption and Entitlements (sidebar_position: 5)

Unchanged from current spec except:
- **sidebar_position changes from 6 to 5**

---

## File Changes Required

### Delete
- `docs/part-2-data/data-360-dmos.md` (replaced by directory)
- `docs/part-2-data/crm-data-ingestion.md` (absorbed into Working with Data 360)

### Create
- `docs/part-2-data/working-with-data-360/_category_.json`
- `docs/part-2-data/working-with-data-360/index.md`
- `docs/part-2-data/working-with-data-360/exploring-your-org.md`
- `docs/part-2-data/working-with-data-360/the-refresh-chain.md`
- `docs/part-2-data/working-with-data-360/ingesting-external-data.md`
- `docs/part-2-data/working-with-data-360/the-leoptical-data-model.md`

### Update
- `docs/part-2-data/identity-resolution.md` — sidebar_position: 2
- `docs/part-2-data/data-graphs.md` — sidebar_position: 3
- `docs/part-2-data/segmentation.md` — sidebar_position: 4, add Actionable List assignment
- `docs/part-2-data/consumption-entitlements.md` — sidebar_position: 5
- `.planning/PROGRESS.md` — update module table (remove CRM Data Ingestion, rename Module 6, reorder 8/9)
- `.planning/specs/module-assignments.md` — update Part 2 section to reflect new structure
- Any existing modules with `ModuleLink` references to `crm-data-ingestion` or `data-360-dmos` slugs

### ModuleLink slug changes
- `data-360-dmos` → `working-with-data-360` (check all existing modules for references)
- `crm-data-ingestion` → removed (check for any references)

---

## Research Needed Before Writing

1. **Data stream UI tabs** — What tabs exist on a data stream detail page? What does each show?
2. **Full refresh vs incremental refresh** — Exact mechanics, when each is used, how to trigger each in the UI
3. **DSO history** — What DSOs looked like when they were user-visible, when they were hidden, why
4. **Standard DMO advantages** — What exactly comes out of the box: automatic relationships, built-in segment awareness, IDR integration, anything else
5. **Custom DMO setup** — Exact steps to create a custom DMO and define relationships
6. **Data Transforms** — What they are, where they fit in the pipeline, common use cases, SDO limitations
7. **Ingestion failure debugging** — Where failed records show up, how to investigate, what the error messages look like
8. **SDO data stream scheduling** — Confirm that SDOs cannot schedule refreshes. Document what the UI shows.

---

## Downstream Module Number Impact

Module numbers shift because CRM Data Ingestion is removed and IDR/Data Graphs swap:

| Old # | Old Module | New # | New Module |
|-------|-----------|-------|-----------|
| 6 | Data 360 and DMOs | 6 | Working with Data 360 |
| 7 | CRM Data Ingestion | — | (removed) |
| 8 | Data Graphs | 8 | Data Graphs |
| 9 | Identity Resolution | 7 | Identity Resolution |
| 10 | Segmentation | 9 | Segmentation |
| 11 | Consumption and Entitlements | 10 | Consumption and Entitlements |
| 12-25 | (Parts 3-6) | 11-24 | (shift down by 1) |

**Total course modules:** 24 (down from 25, excluding deferred modules)

Note: The course does not use module numbers in content (per writing style guide). Numbers are used only in PROGRESS.md for tracking. No content changes needed for the renumbering.

---

## Open Questions

1. Should the Actionable List concept move to Segmentation as a full section, or just a stretch goal? It's a CRM-native feature that doesn't go through the full DMO/segment pipeline. Might deserve its own callout box rather than a full section.
