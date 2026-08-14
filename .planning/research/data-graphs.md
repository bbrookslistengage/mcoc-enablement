# Research: Data Graphs

Generated: 2026-08-10
Module: data-graphs
Part: part-2-data
Sources: 28 sources consulted (18 included, 10 discarded or inaccessible)

---

## Module Context

### From module-assignments.md (Module 8)

**The client wants:** LEOptical needs to answer questions like "Show me Gold loyalty members who purchased SeeClear lenses online in the last 90 days." Build the data graph that makes this possible.

**Assignment:**
- Build a Data Graph connecting: Individual -> Contact Point Email -> Sales Orders -> Products, and Individual -> Loyalty Program Member (custom DMO)
- Define the relationships between DMOs in the graph
- Set the default Data Graph for MCA in Setup
- Test the graph by exploring unified profiles that span multiple data sources
- Understand that this Data Graph is what powers dynamic content in emails — without it, Handlebars personalization won't resolve
- Understand a critical Data Graph gotcha: **if an Individual doesn't have data populated for a field, the Data Graph won't include that field in the JSON at all — it won't be null, it simply won't exist.** This matters for Handlebars: there's nothing for the expression to "hook onto." You'll deal with this directly in the Personalization module when writing personalization logic

**Success Criteria:**
- [ ] Data Graph is created with all relevant DMO relationships
- [ ] Graph connects CRM, loyalty, and ecommerce data through the Individual
- [ ] Default Data Graph is set in MCA Setup
- [ ] You can navigate unified profiles and see data from multiple sources
- [ ] You understand the dependency: Data Stream refresh -> IDR run -> Data Graph refresh -> dynamic email content resolves
- [ ] You understand the null field gotcha: missing data means the field is absent from the graph JSON, not null

**Introduce:** Activation Templates concept — explain what they are and the required fields. Learners will configure them in the Activation Templates module, but they need to know the concept now as they're building the data model.

### Module Structure (two subpages)

1. `docs/part-2-data/data-graphs/index.md` — Conceptual overview
2. `docs/part-2-data/data-graphs/configuring-leoptical-data-graph.md` — Hands-on walkthrough

---

## What is a Data Graph?

A Data Graph is a pre-computed, aggregated view of Data Model Objects (DMOs) organized around a primary DMO (typically Unified Individual). It transforms normalized database tables into materialized views that enable near-real-time lookups across multiple related objects without requiring SQL joins at query time.

**Official working definition (Mavlers/multiple sources):** "A visualization and architectural tool that maps your data and connects various objects together into a single, unified view."

**More precise technical definition (Salesforce Engineering blog):** Data Graph "pre-computes views of extensive datasets, enabling sub-second lookups across multiple tables and records." It stores comprehensive customer information profiles indexed for instant retrieval across "10 to 25 or more objects simultaneously."

### How it differs from a segment and a DMO query

| Concept | What it is | When used |
|---------|-----------|-----------|
| **DMO query** | Ad-hoc SQL-like query against raw DMO tables at runtime | Exploration, reports, calculated insights |
| **Segment** | Filtered population of Unified Individuals matching criteria | Audience selection for activations |
| **Data Graph** | Pre-built, pre-computed relationship graph, refreshed on schedule | Email personalization, Flow Decision Splits, Merge Fields, Dynamic Content |

The key distinction: a segment tells you *who* to send to; the Data Graph tells you *what to say to them* by providing the full relational context of each individual's data at send time.

**Source:** Salesforce Engineering blog, Mavlers guide, Salesforce Ben article, arthurbackouche.com

---

## Standard Data Graph Type

### Data Graph types

Two confirmed types exist:

**Standard Data Graph**
- Pre-computes DMO relationship data on a configurable schedule (hourly, every 4 hours, daily, weekly, monthly)
- Suitable for marketing journeys, merge fields, decision splits, dynamic content in emails
- The type used in MCA for email personalization and Flow

**Real-Time Data Graph**
- Refreshes every few milliseconds
- Suited for voice-based AI agent interactions and scenarios requiring immediate data accuracy
- Used by Agentforce for live customer interactions
- Not the type used for standard marketing email personalization

**Source:** arthurbackouche.com, Salesforce Engineering blog

### When to use Standard vs Real-Time

For MCA marketing use cases (email, Flow, segments), the Standard Data Graph is always the correct choice. Real-Time Data Graph is an Agentforce AI agent feature, not a marketing personalization tool.

---

## How Data Graphs Work

### Pre-computation and materialized views

The Data Graph engine reads the normalized DMO tables (which store data in relational format requiring joins to traverse) and pre-computes the results into materialized views — essentially denormalized snapshots of the data relationships. This is what enables sub-second lookups at send time.

**Analogy from source:** Like "asking ChatGPT about information" versus traditional "Direct API Query" methods that "analyze all datasets from your database from scratch."

**Scale:** The engineering blog confirms it handles "billions of records" and demonstrated 200 million records with query results "within milliseconds," reducing processing time from three hours to 90 minutes through incremental refresh improvements.

### What gets stored

The Data Graph stores:
- All fields selected from the primary DMO (Unified Individual)
- Fields from all related DMOs added to the graph
- Relationship traversal paths between DMOs
- The result is a nested JSON structure per Unified Individual

### Architecture: Hub-and-spoke

- **Hub:** Unified Individual (the post-IDR resolved identity)
- **Spokes:** Related DMOs (Contact Point Email, Contact Point Phone, Sales Order, Loyalty Program Member, etc.)

**Source:** Salesforce Engineering blog (engineering.salesforce.com), Mavlers, arthurbackouche.com

---

## Refresh Mechanics

### Refresh schedule options

From the Salesforce Engineering blog, confirmed refresh intervals for Standard Data Graph:
- Hourly
- Every 4 hours
- Daily (recommended for most marketing use cases)
- Weekly
- Monthly

**Important:** There is no "No Refresh" option — a schedule must be set.

Salesforce is actively developing "hourly incremental updates" that refresh only newly added or changed data rather than the full dataset.

### Build time

From Trailhead create-a-data-graph unit: "Data graph creation can take between 15 minutes to several hours depending on size and complexity of the primary DMO and related objects."

### Manual refresh

<!-- VERIFY --> Whether a manual/on-demand refresh option exists in the UI needs SDO verification.

### Refresh history (Summer '26)

With the Data Cloud feature release in June 2026, a new capability was introduced to view Data Graph refresh history. This is a Summer '26 feature.

**Source:** Multiple search result summaries citing Salesforce release notes, Salesforce Engineering blog

### Staleness behavior

When a Data Graph is stale (scheduled refresh hasn't run), personalization in emails and Flow Decision Splits will use whatever data was captured in the last successful refresh. If a customer's loyalty tier changed or a new order was placed after the last refresh, the Data Graph will not reflect that change until the next refresh completes.

**This is the critical dependency chain (from module-assignments.md and confirmed by multiple sources):**
1. Data Streams refresh (data ingested into DMOs)
2. Identity Resolution runs (records matched and merged into Unified Individuals)
3. Data Graph refreshes (relationships resolved across DMOs)
4. Dynamic content resolves in emails / Decision Splits evaluate correctly

**Source:** module-assignments.md, Mavlers guide, Genetrix Technology blog

---

## Data Graph and Handlebars Personalization

### The $dataGraph variable

The Data Graph is accessed in Handlebars via the special `$dataGraph` variable, which represents the default profile data graph configured in MCA Setup. It is accessed using the `@root` keyword.

**Two access syntaxes:**

Dot notation:
```
{{@root.$dataGraph.ssot__FirstName__c}}
```

Get helper (recommended by Salesforce because it enables filtering and sorting):
```
{{get (get @root "$dataGraph") "ssot__FirstName__c"}}
```

### JSON structure

The Data Graph returns a nested JSON object per Unified Individual. Field names use the Salesforce namespace convention (e.g., `ssot__FirstName__c`). Related DMOs appear as nested arrays.

Example of traversing to first name:
```
ssot__FirstName__c → "Erica"
```

Example of traversing to a related array (Unified Link Individual):
```
IndividualIdentityLink__dlm → [ array of Individual records ]
```

### Accessing related DMOs

Multi-level data navigation uses Map and Flatten helpers in sequence:
```
{{map (get (get @root "$dataGraph") "IndividualIdentityLink__dlm") "ssot__Individual__dlm"}}
```
Then flatten nested arrays and repeat the pattern to reach specific related records.

### Handling missing fields (critical gotcha)

**Confirmed in platform-gotchas.md:** If an Individual does not have data for a field, the Data Graph JSON does not include that field at all. It is not null or empty — it simply does not exist in the JSON.

The Handlebars `fallback` helper provides default values for missing fields:
```
{{fallback (get (get @root "$dataGraph") "ssot__FirstName__c") "Pilot"}}
```
This returns "Pilot" if First Name is absent from the JSON.

**Source:** platform-gotchas.md, developer.salesforce.com Handlebars docs, the-agentic-marketer.com Handlebars guide

---

## Data Graph and Flow

### Decision Splits

In Flow, Decision Split elements can evaluate conditions against Data Graph fields. The Data Graph is a prerequisite for using Data Graph fields in Decision Splits.

**Navigation path in Flow builder (confirmed from Genetrix Technology blog):**
Resource → Data Graph Objects → Related Objects → [traverse the object tree]

**Example field path used in Decision Split:**
Unified Individual → Unified Link Individual → Individual → Account → Lead → IsConverted

The Configure Basic Personalization step (see below) must be completed before Flow can access Data Graph fields in Decision Splits.

### Merge Fields in Flow / Email

In the email builder's Data Source tab, marketers select the Data Graph as the data source and insert merge fields by navigating the object tree. These resolve at send time using the pre-computed Data Graph data.

### Dynamic Content

Dynamic Content blocks in the email builder can swap entire sections of content based on conditional rules built against Data Graph fields (e.g., show different content for Gold vs. Platinum loyalty tier members).

**Source:** Genetrix Technology blog, Mavlers guide, Trailhead email personalization module, Salesforce Ben cross-object merge fields article

---

## UI Walkthrough

### Creating a Data Graph

**Navigation:** App Launcher → Data Cloud → More menu → Data Graphs tab (may need to click "More" in the tab bar)

**Step-by-step (confirmed from multiple sources including Trailhead, Mavlers, the-agentic-marketer.com, module spec):**

1. Click **New**
2. Select **Start from Scratch** → click **Next**
3. Select **Standard Data Graph** → click **Next**
4. Enter details:
   - **Name:** e.g., "Marketing Content Personalization"
   - **API Name:** auto-populates based on Name entry
   - **Data Space:** select default data space
   - **Primary DMO:** select **Unified Individual** (from the Profile category)
5. Click **Next**
6. On the field selection screen:
   - Right panel shows fields for the selected DMO
   - Check the boxes for fields you want included from Unified Individual
7. Add related (child) DMOs by clicking the **+** button next to a DMO name in the left panel
8. For LEOptical, the traversal path for contact data:
   - Unified Individual → **Unified Link Individual** → **Individual** (include Data Source field)
   - Unified Individual → Unified Link Individual → Individual → **Contact Point Email** (include Email Address field)
   - Unified Individual → Unified Link Individual → Individual → **Contact Point Phone** (include Formatted E164 Phone Number field)
9. Click **Save and Build**
10. In the refresh schedule dialog, select a schedule (Daily recommended)
11. Click **Save and Build** again to confirm

**Source:** Mavlers, the-agentic-marketer.com, module spec/Quip guide, Trailhead create-a-data-graph unit

### Monitoring build status

After clicking Save and Build, the Data Graph enters a building state. Monitor the **Last Run Status** column in the Data Graphs list view. It will show "Building" or similar while processing, then "Active" when complete.

Build time: 15 minutes to several hours depending on data volume and complexity.

**Source:** Trailhead create-a-data-graph

---

## Unified Link Individual

### What it is

The Unified Link Individual is a system-generated DMO created by the Identity Resolution process. It serves as the **bridge** between the Unified Individual (the resolved, merged identity) and the original Individual source records.

**Why it exists:** When IDR merges multiple source records into a single Unified Individual, it needs to maintain the lineage — which original records contributed to this unified profile. The Unified Link Individual is that mapping table. It stores Individual IDs paired with their corresponding Unified Individual IDs.

**Key quote from research:** "The unified individual by itself is not the unified profile; the unified profile is made up of both the unified link individual DMO and unified individual DMO, giving you access to both source data and reconciled data."

**Another key quote:** "The Unified Link Individual CCID is the key object for tracking source records that links the unified profile back to its original data sources."

### Why the traversal path goes through it

Standard DMOs (Individual, Contact Point Email, Contact Point Phone) are linked to their **source Individual records**, not to the Unified Individual directly. Since the Data Graph is rooted on the Unified Individual, you must traverse through the Unified Link Individual to reach the source Individual records — and from there, their associated contact point data.

**Traversal path:**
```
Unified Individual
  └── Unified Link Individual  (maps unified → source)
        └── Individual  (the source CRM record)
              └── Contact Point Email  (email addresses on that record)
              └── Contact Point Phone  (phone numbers on that record)
```

### Practical implication

When you add Contact Point Email to the Data Graph, you must follow this path through Unified Link Individual. Attempting to add Contact Point Email directly off Unified Individual without this intermediate hop will not work — the relationship does not exist at that level.

**Source:** the-agentic-marketer.com (confirmed traversal path), LinkedIn Learning Salesforce Data Cloud Consultant cert prep, Salesforce Help search result summaries, medium.com/@derrick.ellis unified profiles article

---

## Save and Build

### What "Build" does

Build triggers the pre-computation engine that:
1. Reads all selected DMOs and fields
2. Traverses the configured relationship paths
3. Materializes the denormalized view for each Unified Individual record
4. Indexes the result for fast lookup at send time

### Critical immutability constraint

**Once you click Save and Build, fields and DMOs that were added cannot be removed later.** This is a hard platform constraint. You can add new DMOs/fields to an existing Data Graph by editing it, but you cannot remove anything already built.

If the Data Graph design is wrong, you must delete it and recreate from scratch.

**Practical implication for the course:** The learner created "Marketing Content Personalization" in Getting Started. If that graph was built with an incomplete configuration, the learner will need to either:
1. Edit it to add the missing DMOs (if the edit/add flow is supported — see VERIFY below)
2. Delete and recreate it

<!-- VERIFY --> Whether you can add new DMOs to an existing Data Graph after the initial build. Multiple sources say you cannot *remove* after building, but it is unclear whether *adding* new DMOs to an existing graph is supported. The module spec describes the learner enhancing the existing graph, implying additions are possible.

**Source:** Multiple sources (Mavlers, The Spot, Trailhead, search result summaries)

---

## Refresh Schedule Configuration

### Available options (confirmed)

- Hourly
- Every 4 hours
- Daily
- Weekly
- Monthly

No "No Refresh" option exists — a schedule is required.

### Recommendation for MCA marketing use cases

Daily works for most email marketing use cases. Hourly may be needed if near-real-time segmentation or personalization based on recent purchase events is required.

### SDO limitation

<!-- VERIFY --> Whether SDO/demo orgs have any restriction on refresh frequency (e.g., forced to weekly or daily only). The spec notes SDOs are limited to 3 Data Graphs total, but refresh frequency limitations in SDOs have not been confirmed from official sources.

**Source:** Salesforce Engineering blog, multiple search result summaries

---

## Assisted Setup: Configure Basic Personalization

### Navigation path

Setup → Marketing Cloud → Assisted Setup → Reporting and Optimization → Customer Engagement → Configure Basic Personalization

OR

Setup → Marketing Cloud → Customer Engagement → Configure Basic Personalization

**Source:** Mavlers guide, Genetrix Technology blog, search result summaries citing official docs

### What "Configure Basic Personalization" does

This step links a specific Data Graph to MCA as the **default data graph** for:
- The email builder's Data Sources tab (auto-selects this graph when opening the editor)
- Flow Decision Splits and Merge Field elements (makes Data Graph fields available)
- Dynamic Content blocks

**Without this step:** Even if a Data Graph is built and active, the email builder and Flow cannot access its data.

**What changes in the UI after this step:**
- The email builder's Data Source tab shows the configured Data Graph
- Flow elements that reference Data Graph fields can be configured

The Mavlers guide describes the navigation as: Marketing Cloud Setup → Reports and Optimization → Customer Engagement → Configure Basic Personalization → select Data Graph from dropdown → confirm.

**Source:** Mavlers guide, Genetrix Technology blog (confirmed the prerequisite: "Make sure that in Setup → Marketing Cloud → Customer Engagement → Configure Basic Personalization, you have selected the data graph you configured earlier"), search result summaries from official Salesforce help articles

---

## Editing an Existing Data Graph

### Can you add DMOs after creation?

Multiple sources confirm that **you cannot remove DMOs or fields after building**. The question of whether you can *add* new DMOs to an existing Data Graph is less clearly documented.

The module spec/Quip guide implies the learner enhances the existing "Marketing Content Personalization" graph (rather than deleting and recreating), suggesting that adding new DMOs to an existing built graph is supported.

<!-- VERIFY --> Confirm in SDO whether editing a built Data Graph to add new child DMOs is possible. If adding is not supported, the learner would need to delete and recreate.

### Deleting a Data Graph

If a Data Graph needs to be rebuilt from scratch, it can be deleted from the Data Graphs list view. <!-- VERIFY --> Confirm deletion removes the graph from the Configure Basic Personalization setting and whether a re-linking step is required after recreation.

### The "Marketing Content Personalization" graph from Getting Started

The learner created this Data Graph early in the course (Getting Started module). This module revisits it with full context. The intended flow is:
- The learner reviews the existing Data Graph
- Enhances it by adding the LEOptical-specific DMOs (Loyalty Program Member, Sales Order, Eye Exam)
- Verifies the refresh has run and the graph is Active

---

## Validation and Verification

### Confirming the Data Graph is working

1. In Data Cloud → Data Graphs, check **Last Run Status** = "Active"
2. Check **Last Run** timestamp to confirm a refresh has completed
3. Navigate to a Unified Individual profile in Data Cloud and verify that related DMO data is visible
4. In the email builder, open the Data Sources tab and confirm the Data Graph appears as a selectable source
5. Add a merge field from the Data Graph in an email and use "Preview as Contact" for a known protagonist contact to verify the field resolves

**Summer '26 addition:** Data Graph refresh history is now viewable in the UI (June 2026 feature release).

**Source:** Trailhead create-a-data-graph, Mavlers guide

---

## Common Errors and Gotchas

### Missing fields are absent from JSON, not null (confirmed gotcha from platform-gotchas.md)

If an Individual has no data for a field, the field is simply absent from the Data Graph JSON. Handlebars expressions referencing absent fields silently render empty. Must use `{{fallback}}` helper or `{{#if}}` checks.

### Cannot remove DMOs/fields after building

Plan carefully before Save and Build. The platform will not let you remove objects or fields once the build is complete. Incorrect design requires deletion and recreation.

### Data Graph limit in SDOs

SDO/demo orgs are limited to **3 Data Graphs** (confirmed from search results citing April 2026 release notes). Production orgs increased from 10 to 25 as of April 14, 2026.

### Relationship depth limit

A Data Graph supports relationships of up to **6 levels** starting from the primary DMO. For most MCA use cases, 3-4 levels is typical (Unified Individual → Unified Link Individual → Individual → Contact Point Email).

### Configure Basic Personalization must be completed

Even if the Data Graph is built and Active, email builder and Flow cannot access it until you set it as the default in Assisted Setup. This is a common missed step.

### Build time

Build can take 15 minutes to several hours. Learners should not expect immediate availability after clicking Save and Build. The status column shows build progress.

### Einstein features prerequisite

One source mentioned that "Einstein Engagement Scoring and Einstein Engagement Frequency features have been enabled before building" — but this may relate to a specific Data Graph type or use case, not standard marketing Data Graphs. <!-- VERIFY --> Whether this applies to the standard Marketing Content Personalization Data Graph in MCA.

### Sort and Limit Filters (October 2025 feature)

As of October 2025, each DMO in a Data Graph can use Sort and Limit Filters to sort data, limit the number of records retrieved, and define retrieval conditions. This is useful for use cases like "show the last 3 purchases" where you want to limit the Sales Order Product records returned per individual.

**Source:** platform-gotchas.md, multiple sources, search result summaries from Mavlers and The Spot

---

## LEOptical Data Graph Design

### Required DMOs per the Quip guide

The Quip guide specifies these required paths in the Data Graph:

| Path | Fields to include |
|------|-----------------|
| Unified Individual → Unified Link Individual → Individual | Data Source field |
| Unified Individual → Unified Link Individual → Individual → Contact Point Email | Email Address field |
| Unified Individual → Unified Link Individual → Individual → Contact Point Phone | Formatted E164 Phone Number field |

### Optional (MCE-integrated, less relevant for this course)

- Account
- Email Engagement / Bulk Email Message
- Message Engagement
- Marketing Activity Journey Run
- Marketing Journey

### LEOptical-specific DMOs to add

Based on the LEOptical data model and use cases from data-model.md:

| DMO | Path from Unified Individual | Use Case |
|-----|---------------------------|----------|
| **Loyalty Program Member** | Unified Individual → Loyalty Program Member | Loyalty tier personalization, VIP segmentation, points display |
| **Sales Order** | Unified Individual → Individual → Sales Order (via Sold To Customer) | Purchase history display, lapsed buyer segments, order date |
| **Sales Order Product** | Sales Order → Sales Order Product | Recent purchases repeater in email, SeeClear enthusiasts segment |
| **Product** | Sales Order Product → Product | Product name, family for personalization |
| **Eye Exam** | Unified Individual → Individual → Eye Exam (via patient_id) — stretch | Exam overdue segments |

### Rationale for each

**Loyalty Program Member (1:1 with Unified Individual):** Powers the most important LEOptical personalization — loyalty tier (Bronze/Silver/Gold/Platinum), points balance, enrollment date. Required for the Loyalty Tier Notification template and VIP segments.

**Sales Order (1:many):** Powers the Lapsed Buyers segment (Order Date > 180 days ago) and purchase history repeaters in email. Sort and Limit Filter can be used to get "most recent order" or "last 3 orders."

**Sales Order Product and Product:** Required for SeeClear Enthusiasts segment (customers who bought SeeClear family products) and purchase history repeaters showing product names.

**Eye Exam (1:many):** Powers Exam Overdue segment (Exam Date > 12 months ago). Also enables Next Exam Due personalization in Eye Health Reminders emails.

### What NOT to include (keep the graph lean)

Per the "start lean" best practice: avoid including every possible DMO. Comm Subscription Consent is handled separately (consent is checked at send time, not via Data Graph). Account details are available through the Individual path if needed but may not be necessary for LEOptical's use cases.

**Source:** data-model.md, Mavlers guide ("start lean, only add what your use case genuinely requires"), arthurbackouche.com, module-assignments.md

---

## MCE Comparison

### MCE personalization approach

In Marketing Cloud Engagement (MCE / ExactTarget), personalization worked through:
- **Data Extensions:** Flat tables of subscriber data. Personalization required the subscriber record to exist in a Data Extension that was the send audience.
- **AMPscript:** Server-side scripting language that could query Data Extensions at send time using `LookupRows()` or `Lookup()` functions.
- **Contact Builder / Data Designer:** Tool for linking Data Extensions into a relational structure, but joins still had to be written in AMPscript.
- **No unified identity resolution:** MCE had no equivalent to Unified Individual. Each subscriber was a row in a Data Extension, and cross-source data required ETL to pre-join data before import.

### How MCA Data Graphs differ

| MCE | MCA (Data Graph) |
|-----|-----------------|
| AMPscript `Lookup()` queries Data Extensions at send time | Handlebars `$dataGraph` reads pre-computed materialized view |
| Personalization limited to fields in the send audience Data Extension or related DEs queryable via AMPscript | Personalization can traverse the full Data Graph (6 levels deep, many DMOs) |
| Cross-source data required pre-joined Data Extensions | Identity Resolution unifies cross-source data into Unified Individual before the Data Graph is built |
| No unified profile — multiple subscribers per email address possible | Unified Individual is the single resolved identity |
| Data Designer relationships had to be explicitly joined in AMPscript | Data Graph relationships are traversed automatically at send time |
| Personalization required knowing AMPscript syntax | Handlebars is simpler low-code syntax; GUI merge field selector in email builder |

### MCE equivalent of Configure Basic Personalization

No direct MCE equivalent. In MCE, the "send audience" Data Extension implicitly defined what data was available for personalization — there was no separate "configure personalization" setup step.

### What has no MCE equivalent

- Unified Individual (resolved identity across sources)
- Real-time Data Graph (refreshed in milliseconds)
- Sort and Limit Filters on DMOs within the graph
- Data Graph refresh history

**Source:** Salesforce Ben MCE vs Data Cloud article, emailmavlers.com MCE vs MCN comparison, Mavlers MCN guide

---

## Verified Facts

| Claim | Source | Confidence |
|-------|--------|------------|
| Standard Data Graph is the correct type for MCA email personalization | arthurbackouche.com, Mavlers, multiple | High |
| Refresh intervals: hourly, every 4 hours, daily, weekly, monthly | Salesforce Engineering blog | High |
| Cannot remove DMOs/fields after Save and Build | Multiple sources (Trailhead, The Spot, Mavlers) | High |
| Build time: 15 minutes to several hours | Trailhead create-a-data-graph | High |
| Max 6 levels of relationship depth from primary DMO | Multiple search result summaries | High |
| SDOs limited to 3 Data Graphs (production now: 25, up from 10 as of April 14, 2026) | Search result summaries citing Salesforce release notes | High |
| $dataGraph is the Handlebars variable for the default data graph | developer.salesforce.com Handlebars docs | High |
| Missing fields are absent from JSON (not null) | platform-gotchas.md + Handlebars docs | High |
| Configure Basic Personalization path: Setup → Marketing Cloud → Assisted Setup → Reporting and Optimization → Customer Engagement | Mavlers, Genetrix, search result summaries | Medium (exact label varies by source) |
| Traversal path: Unified Individual → Unified Link Individual → Individual → Contact Point Email | the-agentic-marketer.com, Quip guide spec | High |
| Unified Link Individual maps Unified Individual IDs to source Individual IDs | LinkedIn Learning cert prep, multiple | High |
| Sort and Limit Filters available per DMO (October 2025 feature) | Search result summaries | Medium |
| Refresh history viewable in UI (June 2026 feature) | Search result summaries | Medium |

---

## VERIFY Flags

1. **Can you add new DMOs to an existing built Data Graph?** Multiple sources confirm you cannot *remove* after building, but whether *adding* new DMOs to an already-built graph is supported needs SDO verification. The module spec implies additions are possible.

2. **Exact navigation path for Assisted Setup:** Confirmed to be under Marketing Cloud Setup, but exact label sequence varies slightly between sources ("Reporting and Optimization" vs. just "Customer Engagement"). Verify current UI label in SDO.

3. **Manual/on-demand refresh:** Whether a "Run Now" button exists in the Data Graphs UI for manual refresh needs SDO verification.

4. **SDO refresh frequency limitation:** Whether demo/SDO orgs are restricted to certain refresh intervals (e.g., daily only) is not confirmed from official sources.

5. **Einstein Engagement Scoring prerequisite:** One source mentioned Einstein features must be enabled before building — unclear if this applies to the standard Marketing Content Personalization graph. Likely does not apply unless using Einstein-based DMOs.

6. **Delete and re-link behavior:** If a Data Graph is deleted and recreated, whether Configure Basic Personalization automatically reflects the new graph or requires re-selection needs verification.

7. **Sort and Limit Filter UI:** The October 2025 feature for Sort and Limit Filters on DMOs within the graph — confirm current UI location and whether it's available in SDOs.

---

## Data Model Relevance

The Data Graph is the bridge between all DMOs built in earlier modules and the personalization/Flow features in later modules. Every DMO in the LEOptical data model is relevant here.

### DMOs in the LEOptical Data Graph

**Required (from Quip guide):**
- Unified Individual (primary/root DMO)
- Unified Link Individual (traversal bridge, system-generated)
- Individual (source Individual records)
- Contact Point Email (Email Address field — required for email sending)
- Contact Point Phone (Formatted E164 Phone Number — required for SMS)

**LEOptical-specific:**
- Loyalty Program Member (custom fields: `tier`, `points`, Email Address, Status)
- Sales Order (Order Date, Total Amount, Status, Sold To Customer)
- Sales Order Product (Quantity, Unit Price, Line Total)
- Product (Product Name, Product SKU, Product Family)
- Eye Exam (custom DMO, stretch: Exam Date, Exam Type, Provider)

### Key field-level details for personalization

| Use Case | DMO | Field |
|----------|-----|-------|
| Greeting | Unified Individual | First Name |
| Loyalty tier personalization | Loyalty Program Member | Loyalty Tier (custom field) |
| Points display | Loyalty Program Member | Points Balance (custom field) |
| Purchase history repeater | Sales Order Product → Product | Product Name |
| Lapsed buyer segment | Sales Order | Order Date |
| Exam overdue segment | Eye Exam | Exam Date |
| Email sending (activation) | Contact Point Email | Email Address |

### Data Refresh Dependency Chain (from data-model.md)

```
1. Data Streams refresh (CSV + CRM data ingested into DMOs)
       |
2. Identity Resolution runs (records matched and merged into Unified Individuals)
       |
3. Data Graph refreshes (relationships resolved across DMOs)
       |
4. Dynamic content resolves (Handlebars expressions find data in the graph)
```

---

## External Resources

- [Mavlers: Data Graph in Marketing Cloud Next: Setup and Personalization Guide](https://www.mavlers.com/blog/data-graph-in-salesforce-marketing-cloud-next/) — Step-by-step creation walkthrough, hub-and-spoke architecture, Configure Basic Personalization navigation, performance best practices
- [arthurbackouche.com: Understanding Data Graphs in Agentforce Marketing](https://arthurbackouche.com/understanding-data-graphs-in-agentforce-marketing/) — Standard vs Real-Time Data Graph types clearly explained; abandoned cart use case example
- [Salesforce Engineering Blog: How Data Cloud's Data Graph Delivers Sub-Second Insights from 200M Records](https://engineering.salesforce.com/how-data-clouds-data-graph-delivers-sub-second-insights-from-200-million-records/) — Technical pre-computation mechanics, refresh intervals, scale details
- [the-agentic-marketer.com: Easily Enrich Your Unified Individuals in Marketing Cloud Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/enrich-unified-individual/) — Confirmed Unified Link Individual traversal path; Marketing Activities custom DMO example
- [the-agentic-marketer.com: Handlebars Low-Code Scripting](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-handlebars-low-code-scripting/) — $dataGraph variable, get helper syntax, fallback helper for missing fields, map/flatten for arrays
- [Salesforce Developer Docs: Understanding the Data Graph (Handlebars for Marketing Cloud Next)](https://developer.salesforce.com/docs/marketing/handlebars-for-marketing-cloud-next/guide/mcn-handlebars-guide-data-graph-understanding.html) — Official $dataGraph documentation, field access syntax, ssot__ namespace
- [Salesforce Developer Docs: Data Sources (Handlebars for Marketing Cloud Next)](https://developer.salesforce.com/docs/marketing/handlebars-for-marketing-cloud-next/guide/mcn-handlebars-guide-data-sources.html) — Five data source types including Profile Data Graph; mutual exclusivity rules
- [Genetrix Technology: Optimizing Audience Paths in Salesforce Marketing Cloud Growth — Decision Split Using Data Graphs](https://genetrix.tech/blogs/salesforce-marketing-cloud-growth-audience-segmentation-in-flows-decision-split-using-data-graphs/) — Decision Split configuration using Data Graph fields; Configure Basic Personalization prerequisite confirmed
- [Trailhead: Data Graphs in Data 360 module](https://trailhead.salesforce.com/content/learn/modules/data-graphs-in-data-cloud) — Official Trailhead module covering get-to-know, create, and manage units; 55 minutes, 1,500 points
- [Trailhead: Learn to Create and Manage Data Graphs Effectively](https://trailhead.salesforce.com/content/learn/modules/data-graphs-in-data-cloud/create-a-data-graph) — Step-by-step creation with Save and Build, refresh schedule options, build time estimates
- [Trailhead: Email Personalization — Explore Data Sources for Email Personalization](https://trailhead.salesforce.com/content/learn/modules/email-personalization-in-marketing-cloud-next/explore-data-sources-for-email-personalization) — Default Data Graph in email builder, merge field selection, repeaters
- [Salesforce Ben: Cross-Object Merge Fields in Marketing Cloud](https://www.salesforceben.com/achieve-enhanced-personalization-in-marketing-cloud-growth-and-advanced-editions/) — Use cases, Unified Individual as root, performance best practice (only include required data), hub-and-spoke structure
- [The Spot (Pardot): Building Data Graphs in Marketing Cloud Growth and Advanced Edition](https://thespotforpardot.com/2025/06/25/building-data-graphs-in-marketing-cloud-growth-and-advanced-edition/) — Article from June 2025 covering the complete workflow (could not fetch body content due to JS rendering)
- [SFMC Tips #96 (Medium): Marketing Cloud Next — How to Configure Data Graphs](https://medium.com/@marketingcloudtips/marketing-cloud-on-core-personalization-1af8d9aa9026) — Could not fetch (403 error); cited by multiple sources as comprehensive walkthrough

---

## Source Log

- `https://medium.com/@marketingcloudtips/marketing-cloud-on-core-personalization-1af8d9aa9026` — 403 error; cited widely as comprehensive Data Graph setup guide
- `https://thespotforpardot.com/2025/06/25/building-data-graphs-in-marketing-cloud-growth-and-advanced-edition/` — JS-only response; article exists (1,459 words by Cate Godley, June 2025); body content not accessible
- `https://www.mavlers.com/blog/data-graph-in-salesforce-marketing-cloud-next/` — Fetched successfully; comprehensive guide on creation, architecture, Configure Basic Personalization
- `https://arthurbackouche.com/understanding-data-graphs-in-agentforce-marketing/` — Fetched successfully; Standard vs Real-Time types, hub-and-spoke, personalization use cases
- `https://engineering.salesforce.com/how-data-clouds-data-graph-delivers-sub-second-insights-from-200-million-records/` — Fetched successfully; technical pre-computation, refresh intervals, scale
- `https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/enrich-unified-individual/` — Fetched successfully; Unified Link Individual traversal path confirmed
- `https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-handlebars-low-code-scripting/` — Fetched successfully; $dataGraph syntax, get/fallback helpers
- `https://developer.salesforce.com/docs/marketing/handlebars-for-marketing-cloud-next/guide/mcn-handlebars-guide-data-graph-understanding.html` — Fetched successfully; official Salesforce developer docs on $dataGraph
- `https://developer.salesforce.com/docs/marketing/handlebars-for-marketing-cloud-next/guide/mcn-handlebars-guide-data-sources.html` — Fetched successfully; five data source types
- `https://genetrix.tech/blogs/salesforce-marketing-cloud-growth-audience-segmentation-in-flows-decision-split-using-data-graphs/` — Fetched successfully; Decision Split with Data Graph, Configure Basic Personalization confirmed prerequisite
- `https://trailhead.salesforce.com/content/learn/modules/data-graphs-in-data-cloud` — Fetched successfully; module overview, 3 units
- `https://trailhead.salesforce.com/content/learn/modules/data-graphs-in-data-cloud/create-a-data-graph` — Fetched successfully; creation steps, build time, Save and Build
- `https://trailhead.salesforce.com/content/learn/modules/data-graphs-in-data-cloud/get-to-know-data-graphs` — 404 error; unit may have been renamed or moved
- `https://trailhead.salesforce.com/content/learn/modules/data-graphs-in-data-cloud/manage-a-data-graph` — 404 error
- `https://trailhead.salesforce.com/content/learn/modules/email-personalization-in-marketing-cloud-next/explore-data-sources-for-email-personalization` — Fetched successfully; Default Data Graph in email builder
- `https://www.salesforceben.com/introducing-data-graphs-in-data-cloud/` — Fetched; content described AI/Copilot use case, not MCA marketing personalization; partially useful
- `https://www.salesforceben.com/achieve-enhanced-personalization-in-marketing-cloud-growth-and-advanced-editions/` — Fetched successfully; cross-object merge fields, use cases, best practices
- `https://www.salesforceben.com/what-does-data-cloud-have-that-marketing-cloud-engagement-doesnt/` — Fetched; MCE comparison points, Data Cloud capabilities
- `https://help.salesforce.com/s/articleView?id=sf.c360_a_build_and_manage_data_graphs.htm` — Fetched but only JavaScript/page infrastructure returned; no article content
- `https://help.salesforce.com/s/articleView?id=data.c360_a_refresh_a_data_graph.htm` — Fetched but only JavaScript/page infrastructure returned; no article content
- `https://help.salesforce.com/s/articleView?language=en_US&id=sf.mktg_data_graph_setup.htm` — Fetched but only JavaScript/page infrastructure returned; no article content
- `https://help.salesforce.com/s/articleView?id=mktg.persnl_setup_data_graphs_using.htm` — Fetched but only JavaScript/page infrastructure returned; no article content
- `https://help.salesforce.com/s/articleView?id=sf.c360_a_limits_and_guidelines.htm` — Fetched but only JavaScript/page infrastructure returned; no article content
- `https://help.salesforce.com/s/articleView?id=data.c360_a_identity_resolution_data_modeling_unified_and_link_objects.htm` — Fetched but only JavaScript/page infrastructure returned; no article content
- `https://twopirconsulting.com/blog/introducing-data-graphs-in-data-cloud/` — Fetched; conceptual/introductory only; no implementation specifics
- `https://admin.salesforce.com/blog/2025/rethinking-golden-record-advantages-of-data-cloud-unified-profile` — Fetched; useful conceptual framing of Unified Profile as "key ring"
- `https://medium.com/@derrick.ellis/looking-beyond-the-golden-record-unified-profiles-in-salesforce-data-cloud-ec23bf17bfb5` — 403 error
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-troubleshooting-decision-splits-73e2ab3ac40f` — 403 error
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-basic-setup-procedure-for-the-demo-environment-be441f7c37d8` — 403 error
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-ad-hoc-filters-for-data-graphs-466c231740fe` — 403 error
