# Research: Segmentation

Generated: 2026-08-10
Module: segmentation
Sources: 18 sources consulted, 12 included in research

---

## Module context

This is Module 9 in Part 2 (Data & Audiences), positioned at `sidebar_position: 4` in the restructured part (per `2026-08-09-part2-restructure.md`). By the time learners reach this module they have:

- Provisioned MCA and Data 360, ingested seed data (Module 6 — Working with Data 360)
- Configured Identity Resolution and have Unified Individuals (Module 7)
- Built a Data Graph connecting all LEOptical DMOs (Module 8)
- Learned the refresh chain (data streams → IDR → Data Graph)

Segmentation is the first module where the learner **acts on** the unified data. It unlocks all downstream modules: flows, activation templates, and email sends all require a segment as the entry point. This module also inherits the Actionable List assignment from the now-removed CRM Data Ingestion module.

**From module-assignments.md (Module 10 — Segmentation):**

> **The client wants:** With unified data in place, LEOptical needs audience segments for their marketing campaigns.

**Assignment (verbatim from module-assignments.md):**
Build four segments using Data 360 segmentation:

1. "VIP Customers" — Gold or Platinum loyalty tier members
2. "Lapsed Buyers" — Customers with no purchase in the last 180 days
3. "SeeClear Enthusiasts" — Customers who've purchased any SeeClear product family lens
4. "Exam Overdue" — Customers whose last eye exam was more than 12 months ago (stretch — requires clinic data)

For each segment, verify the member count and spot-check profiles to confirm accuracy.

Additionally, learn how to query segment members directly via the **Unified Individual - Latest** DMO.

**Success Criteria (verbatim):**
- [ ] Four segments are created and populated
- [ ] Each segment's membership count is reasonable given your seed data
- [ ] You've spot-checked at least 2 profiles per segment
- [ ] You can explain the filter logic for each segment
- [ ] You've queried the Unified Individual - Latest DMO to view segment membership

**From 2026-08-09-part2-restructure.md:**
Segmentation sidebar_position changes from 5 to 4. Also inherits the Actionable List assignment from old Module 7 — add as a section or stretch goal (create an Actionable List from Campaign Members). The spec notes: "It's a CRM-native feature that doesn't go through the full DMO/segment pipeline. Might deserve its own callout box rather than a full section."

---

## Module structure decision

**Lesson → Walkthrough → Assignment** (three distinct sections in one module page)

**Rationale:**
- Lesson: Full coverage of segmentation concepts so learners understand what they're building before touching the UI
- Walkthrough: Instructor-guided segment build ("VIP Customers") that demonstrates every canvas mechanic: Segment On selection, adding a related attribute (Loyalty Program Member), container creation, AND/OR logic, lookback window, population count, publish
- Assignment: Learner builds the other three segments independently, applying everything from the walkthrough — each one uses a different pattern (date-based, traversal through multiple hops, direct date field)

The four segments cover all major segmentation patterns:
- VIP Customers: related attribute with value filter (text equality)
- Lapsed Buyers: related attribute with date aggregation (max date, relative date filter)
- SeeClear Enthusiasts: multi-hop traversal (Sales Order → Sales Order Product → Product)
- Exam Overdue: date field filter (either on Individual direct attribute or Eye Exam DMO)

---

## Segment types reference

### 1. Standard Segment
**What it is:** The default type. Built on a DMO (almost always Unified Individual in MCA). Supports the full set of refinement levers — include/exclude, related attributes, containers, nested segments, aggregation, lookback window.

**Publish cadence:** Every 12 hours or every 24 hours (or manual). Can also use Rapid Publish mode (see below).

**Data window:** Up to 2 years of engagement/transaction data.

**Activation targets:** All supported target types (MCA, MCE, B2C Commerce, cloud file storage, Marketing Cloud Personalization, external platforms, Loyalty).

**Limits (production org):** 9,950 active segments per production org; 25 per Dev Org. (Source: davidpalencia.com)

**Use when:** The default choice for virtually every campaign audience. Use unless you have a specific reason to use another type.

---

### 2. Rapid Publish (publish mode, NOT a segment type)
**CONFIRMED:** Rapid Publish is a **publish mode** (scheduling option), not a distinct segment type. It is a setting applied to a Standard Segment. (Source: Trailhead "Advanced Segmentation in Data 360"; multiple secondary sources confirm this.)

**Cadences:** Every 1 hour or every 4 hours.

**Data window:** Last 7 days of engagement data only (not the full 2-year window).

**Activation targets:** MCE and cloud file storage only. NOT available for all activation targets.

**Limits:** Max 20 rapid segments per org. (Source: salesforcegeek.in, szymonlewandowski.pl)

**Waterfall segments:** Rapid Publish is NOT available for waterfall segments.

**Use when:** Near-real-time audience updates are needed, target is MCE or file storage, and you only need recent engagement data (7 days).

---

### 3. Real-Time Segment
**What it is:** Evaluates on demand and completes in milliseconds. Built on a real-time data graph (not the batch data graph). Designed for instant decisioning — next-best-action on websites, real-time personalization.

**Publish behavior:** Evaluation on demand only. No scheduled publishing. No manual publish.

**Restrictions (confirmed from multiple sources):**
- No exclusion criteria (no Exclude tab)
- No nested batch segments
- No segment counts / population counts
- No manual publish

**Limits:** Maximum 35 real-time segments per org. (Source: davidpalencia.com)

**Use when:** Millisecond response is required. Triggered campaign flows requiring instant evaluation. NOT appropriate for batch email campaigns.

---

### 4. Waterfall Segment
**What it is:** An ordered list of up to 20 existing segments evaluated sequentially in priority order. A Unified Individual qualifies for at most one segment in the waterfall — whichever bucket they match first (highest priority). Ensures mutual exclusivity.

**Requirements:** All constituent segments must share the same Segment On entity AND must be active (published).

**Restrictions:**
- Cannot contain nested segments
- Cannot be nested in another segment
- Cannot be used in multiple waterfalls simultaneously (Source: davidpalencia.com)
- Rapid Publish NOT available — Standard Publish only

**Max segments in a waterfall:** 20. (Source: Trailhead "Advanced Segmentation in Data 360")

**Use when:** Tiered offer programs where each customer should receive only one treatment (e.g., offer tiers based on LTV, loyalty tier priority ranking).

---

### 5. Nested Segment
**What it is:** Using an existing published segment as a criteria block inside another segment. Allows reuse of segment logic without rebuilding it.

**How it works in the builder:** A published segment can be dragged onto the canvas as if it were an attribute. The platform evaluates membership in the nested segment as a filter criterion.

**Restrictions:** Cannot be used inside a waterfall segment. Real-time segments cannot include nested batch segments.

**Use when:** A reusable audience definition (e.g., "All consented customers") needs to be combined with additional criteria across multiple segments without duplicating the logic.

---

### 6. Dynamic Segment
**What it is:** Uses parameterized filter values (variables) instead of static criteria. An external service calls an API to pass the parameter values at runtime. No persisted membership. No UI schedule.

**Behavior:** The segment definition is static; the audience changes with each execution based on the runtime parameters passed by the external caller.

**Use when:** Audience criteria change between runs without editing the segment definition. Requires API integration. Advanced use case.

---

## Segment builder canvas — mechanics

### Navigation path
Segments tab (in Data 360 / MCA) > New > Use Visual Builder > Standard Segment (Source: Trailhead project "Build a Segment and Report")

### Segment On
- The foundation DMO selection. Determines what level the segment operates at and which attributes are available.
- In MCA with Identity Resolution configured: always use **Unified Individual**.
- Using Individual (not Unified Individual) results in duplicate counts and skipped profiles.
- Other options exist (Unified Household, Account, Unified Account) for non-MCA B2C use cases.
- The Segment On selection controls what appears in the attribute sidebar.

### Include / Exclude tabs
- **Include tab:** Criteria that qualify a Unified Individual for segment membership. At least one Include rule is required.
- **Exclude tab:** Criteria that disqualify a Unified Individual even if they meet the Include criteria. Processed as a subtraction after Include is evaluated.
- **Real-time segments:** No Exclude tab. Exclusion criteria are not supported.

### Attribute sidebar
- Displays two categories of attributes based on the Segment On DMO and its relationships.
- **Direct attributes:** Fields with a one-to-one relationship to the Segment On DMO (e.g., First Name, Birth Date on Individual). Only one value per Unified Individual per field.
- **Related attributes:** Fields from DMOs with a one-to-many relationship to the Segment On DMO (e.g., Sales Orders, Eye Exams, Email Opens). Multiple records per Unified Individual.
- To find related attributes, click "Expand Related Attributes" in the sidebar. Browse up through the relationship graph.
- Dragging a direct attribute onto the canvas adds it as a simple filter.
- Dragging a related attribute onto the canvas creates a **container** for that related DMO.

### Population count
- Displayed per filter and per container after saving or triggering an on-demand count.
- **CRITICAL:** Population count in the builder is a PREVIEW. It is NOT segment membership. Membership only exists after publishing.
- "The population is the number of records within your current segment. This is refreshed after publishing or performing an on-demand count." (Source: Trailhead navigation unit)
- An on-demand count button allows a count refresh without publishing.
- Real-time segments do NOT display segment counts.

### Publish schedule configuration
- During segment creation, select Publish Type: **Standard Publish** (default) or **Rapid Publish**.
- Publish Schedule options: 1 hour (Rapid only), 4 hours (Rapid only), 12 hours (Standard), 24 hours (Standard), Manual, Do Not Schedule.
- Segment is created in Draft status until first publish.

---

## Direct attributes — mechanics

- Added by dragging from the attribute sidebar onto the canvas.
- One value per Unified Individual — no aggregation needed or available.
- Examples for LEOptical: Individual First Name, Individual Last Name, Individual Last Exam Date (custom field from CRM Contact).
- Filter operators vary by data type (see Operators section below).
- Filters within the Include or Exclude section are combined with AND/OR logic.

---

## Related attributes and containers — MOST IMPORTANT SECTION

### What a container is
When a related attribute (from a 1:N DMO relationship) is added to the canvas, the builder creates a **container** for that related DMO. A container groups one or more filters that evaluate against ALL records in that related DMO for each Unified Individual.

**Why containers matter:** Without containers, AND logic between related attribute filters would require a single record to satisfy all conditions simultaneously — which is often not the intent. Containers let you control whether conditions evaluate against the SAME related record or INDEPENDENTLY.

**Example (from Trailhead):**
- One container with Product_Category = "Scarves" AND Color = "Yellow" → finds customers who bought a yellow scarf (same record must satisfy both conditions).
- Two separate containers: Container A has Product_Category = "Scarves"; Container B has Color = "Yellow" → finds customers who bought any scarf AND also any yellow item (from any separate records).

This means: **AND between filters INSIDE a container = both conditions on the SAME related record. AND between containers = must have records satisfying each container independently.**

### Aggregation options
Aggregation is available for related attributes inside a container. Five types (Source: Trailhead "Create Filtered Segments"):

| Aggregation | Behavior | Example |
|------------|---------|---------|
| **Count** | How many times the criteria must be met | Count >= 3 means at least 3 orders |
| **Sum** | Total across all values | Sum(order_total) > 500 means lifetime spend over $500 |
| **Average** | Mean across all records | Average(unit_price) > 100 |
| **Max** | Maximum value in the set | Max(order_date) within last 30 days = purchased recently |
| **Min** | Minimum value in the set | Min(unit_price) > 5 |

- Count works with any data type. Sum, Average, Min, Max require numeric or date data.
- **Aggregation is the mechanism for "at least X" logic** — you cannot say "has 3+ orders" without using Count.
- The builder presents aggregation selection as the first step after adding a related attribute to a container.

### Container logic
- AND/OR between **filters within a container**: all conditions apply to records in that container's DMO
- AND/OR between **containers**: an individual must satisfy Container A's conditions AND/OR Container B's conditions
- Up to 10 nesting levels of operator logic supported (Source: davidpalencia.com, may need SDO verification)
- Multiple containers can reference different DMOs

### Up to 5 containers confirmed from one source (<!-- VERIFY --> this limit in SDO — the prompt context said 20 filters per container and 5 levels of nesting, but sources mention different numbers. One source says "up to 5 containers" for hierarchical aggregation for Account-based segments. Standard segments may differ.)

### Lookback window
- **Per-segment setting:** Set when creating or editing the segment. Default: 90 days. Max: 2 years (1 day–360 days or 1–2 years).
- **Per-container override:** Container-level lookback overrides the segment-level setting. "If the segment-level lookback is set to 90 days but a filter container uses 60 days, the container rule wins." (Source: search result summary citing salesforcegeek.in and another source)
- Engagement data (clicks, opens, etc.) defaults to 90 days. Profile data (direct attributes) has no lookback window — it reads the current value.
- Rapid Publish segments: data window locked to 7 days regardless of lookback setting.
- Longer lookback windows consume more credits during segment processing.

<!-- VERIFY --> Confirm in SDO: Is the lookback window set at segment level on the initial creation screen? Or is it per-container? The research is somewhat contradictory — some sources say "configured when creating a standard segment" (segment-level), others describe container-level lookback. The clearest statement found: both exist, and container-level lookback overrides segment-level.

### Traversal path (container path)
- When a related attribute can be reached from the Segment On DMO via **multiple relationship chains**, the builder prompts the user to select which path to use.
- Example: a product attribute might be reachable via (1) Sales Orders → Sales Order Products → Product, or (2) a separate data stream from Service Cloud cases → Product.
- The platform may default to the shortest path when unambiguous.
- Selection determines which data relationship the segment engine follows for evaluation.
- "The values of linked records must match exactly" — path traversal is case-sensitive. A value of `c12d3` won't link to `C12D3`. (Source: Trailhead "Create Filtered Segments")
- Only one traversal path per container.
- Best practices: choose shortest paths, avoid cyclic paths, limit the amount of data processed. (Source: Trailhead "Create Filtered Segments")

<!-- VERIFY --> Exact UI behavior of the traversal path prompt: when does it appear (automatically when you add the attribute, or when you try to save?), what does the UI look like, does it show both path options with DMO names?

**For LEOptical SeeClear Enthusiasts:** The path Unified Individual → Sales Order → Sales Order Product → Product is the only available path (there's no alternate route to Product in the LEOptical data model), so the traversal path prompt may not appear. This is worth confirming in the SDO.

---

## Filter operators by data type

From Trailhead "Create Filtered Segments" and saisocial.substack.com:

| Data Type | Operators |
|-----------|-----------|
| **Date / DateTime** | Is Anniversary Of, Is Before, Is After, Is Between, Last Number Of Days, Next Number Of Days, Day Of Week |
| **Number** | Is Equal To, Is Not Equal To, Is Less Than, Is Less Than Or Equal To, Is Greater Than, Is Greater Than Or Equal To, Is Between |
| **Text** | Contains, Begins With, Is In, Is Not In, Is Equal To, Is Not Equal To |
| **Boolean** | Has Value, Has No Value, Is True, Is False |

<!-- VERIFY --> Full operator list per type in the current UI — the sources gave partial lists. Particularly: does "Is In" exist for text (useful for Gold/Platinum multi-value filter)? Does "Last Number Of Days" exist as a date operator (critical for Lapsed Buyers)?

---

## Publish lifecycle

### Segment statuses
Multiple sources provide overlapping (not fully consistent) status lists. Consolidated view:

| Status | Meaning |
|--------|---------|
| **Draft** (or "Blank") | Segment created, never published. Has NO members. Population count in builder is a preview only, not persisted membership. |
| **Processing** / Publishing | First publish or republish is in progress. No members yet accessible. |
| **Active** / Published | Member list exists and is current as of last publish. Fully usable by flows, activations. |
| **Recounting** | Population count recalculation in progress. |
| **Error** / Failed | Publish errored. Investigate error details. |
| **Deferred** | Queued pending system capacity. Will run when capacity frees. |
| **Skipped** | Delayed (approx. 30 minutes) due to concurrent publish limits. (Source: davidpalencia.com) |
| **Inactive** | Segment is deactivated; can be deleted but not published. |

### First publish behavior
- A segment in Draft status has ZERO members. The population count displayed during building is a preview — it is NOT membership.
- First publish materializes the member list. Until first publish completes, the segment has no members.
- Time to first publish varies by segment size and org load. With LEOptical seed data (~48K contacts), expect faster than production. In production with millions of records, first publish can take 15–30+ minutes. <!-- VERIFY --> typical range in SDO with LEOptical seed data.

### After publish
- Members are locked until the next scheduled publish.
- New qualifiers do NOT enter the segment between publishes.
- Disqualifiers do NOT exit the segment between publishes.
- Manual publish (Publish Now) overrides the schedule and triggers an immediate refresh.

### Concurrency and queuing
- If too many segments publish simultaneously, the system queues and defers. A segment may not run at its exact scheduled time if system capacity is constrained.
- "Publish succeeded/failed/skipped/in progress/deferred" are publish-level statuses (separate from segment-level statuses). (Source: davidpalencia.com)
- Concurrent publish limit: 50 simultaneous operations. (Source: davidpalencia.com) <!-- VERIFY -->
- Dev Org scheduled publishes: 0 (manual only). (Source: davidpalencia.com) — this aligns with SDO behavior.

### Segment membership DMOs
After publish, two DMOs are automatically created/updated:
- **Latest DMO** (`Individual_Unified_SM_[ID]__dlm`): Current publish snapshot — who is in the segment right now.
- **History DMO** (`Individual_Unified_SM_H__dlm`): Last 30 days of membership snapshots.

When someone no longer meets criteria, they are removed from the Latest DMO during the next publish. The History DMO retains records of prior membership for 30 days.

---

## CRITICAL GOTCHA: Segment-Triggered Flows Against Unpublished Segments

**Confirmed from Salesforce Help (article ID 002061722):**

A segment-triggered flow (Broadcast Flow) will **show a "Completed" status but send nothing** if the underlying segment has never been published. The flow activates without warning even when the segment is in Draft status.

**Why it happens:** When the flow runs, it queries the segment membership DMO. A Draft segment has no membership records. The flow finds zero members, marks itself as Completed (zero interviews run), and exits cleanly. No error is thrown. No warning is surfaced.

**How to prevent it:** Publish the segment BEFORE activating the campaign flow that references it. Alternatively, configure the flow to republish the segment immediately before it runs.

**Teaching moment:** This is one of the most common mistakes on a first implementation. The learner sees "Completed" in the flow run log and assumes everything worked, then discovers no emails were sent. Always publish segments before referencing them in flows.

---

## LEOptical segment designs

### Segment 1: "VIP Customers" (Walkthrough)

**Goal:** Gold or Platinum loyalty tier members.

**Segment On:** Unified Individual

**DMO path:** Unified Individual → Loyalty Program Member → Loyalty Tier (custom field)

**Filter design:**
- Add related attribute: Loyalty Program Member > Loyalty Tier (custom field)
- This creates a container for Loyalty Program Member
- Inside the container:
  - No aggregation needed — this is a value filter, not a count/sum
  - Actually: <!-- VERIFY --> whether Loyalty Tier as a text field on Loyalty Program Member DMO requires aggregation or can be filtered directly. If Loyalty Program Member has a 1:1 relationship to Unified Individual (each person has at most one loyalty record), it may be treated as a direct attribute rather than requiring a container with aggregation.
  - Filter: Loyalty Tier "Is In" [Gold, Platinum] — or two separate conditions with OR: Loyalty Tier = Gold OR Loyalty Tier = Platinum
- Include tab only (no exclusions needed)

**Expected behavior:** Returns all Unified Individuals whose Loyalty Program Member record has Loyalty Tier = Gold or Platinum.

**Field reference (from data-model.md):**
- DMO: Loyalty Program Member
- Field: Loyalty Tier (custom) — values: Bronze, Silver, Gold, Platinum
- Relationship: Loyalty Program Member is linked to Unified Individual via email address match through IDR

**Walkthrough steps for writer:**
1. Navigate to Segments in MCA / Data 360
2. New > Use Visual Builder > Standard Segment
3. Segment On: Unified Individual
4. Name: "VIP Customers"
5. Publish Type: Standard Publish; Publish Schedule: Do Not Schedule (will publish manually)
6. Save
7. On the canvas, expand Related Attributes in the attribute sidebar
8. Find Loyalty Program Member > Loyalty Tier
9. Drag onto the Include canvas — container is created
10. Set filter: Loyalty Tier Is In [Gold, Platinum] (or Loyalty Tier = Gold OR Loyalty Tier = Platinum)
11. Click on-demand count — note the population count
12. Save the segment
13. Publish Now
14. Wait for status to change from Processing to Active/Published
15. Check member count

---

### Segment 2: "Lapsed Buyers" (Assignment)

**Goal:** Customers with no purchase in the last 180 days.

**Segment On:** Unified Individual

**DMO path:** Unified Individual → Sales Order → Order Date

**Filter design:**
- Add related attribute: Sales Order > Order Date
- This creates a container for Sales Order
- Aggregation: **Max** of Order Date (= "most recent order date")
- Filter: Max(Order Date) **Is Before** [relative date: 180 days ago] — i.e., most recent order was more than 180 days ago
- Alternatively: use "Last Number Of Days" operator with negation, or "Is Before" with a calculated date <!-- VERIFY --> exact operator that expresses "max date older than 180 days ago"

**Alternative approach:** Use the Exclude tab.
- Include: All Unified Individuals (no filters — everyone is in)
- Exclude: Sales Order > Order Date > Last 180 Days, Count >= 1 (= exclude anyone who has an order in the last 180 days)
- This approach may be more intuitive for learners

**Note on "Lapsed":** The spec says "no purchase in the last 180 days" — this could include people who have NEVER purchased. If the intent is "had a purchase but not recently," an additional filter for Count >= 1 total orders would be needed. <!-- VERIFY --> spec intent — assume it means "no order in the last 180 days" including non-purchasers, since the goal is re-engagement.

**Field reference (from data-model.md):**
- DMO: Sales Order
- Field: Order Date (DateTime) — maps from CSV column `order_date`
- Relationship: Sales Order linked to Individual via Sold To Customer (ecom_customer_id FK)

---

### Segment 3: "SeeClear Enthusiasts" (Assignment)

**Goal:** Customers who have purchased any SeeClear product family lens.

**Segment On:** Unified Individual

**DMO traversal:** Unified Individual → Sales Order → Sales Order Product → Product → Product Family

**Filter design:**
- This requires traversal through THREE hops: Sales Order → Sales Order Product → Product
- Add related attribute: Product > Product Family (reached via Sales Order > Sales Order Product)
- The traversal path prompt may appear — select the path via Sales Order > Sales Order Product
- Inside the container:
  - Filter: Product Family = "SeeClear"
  - No aggregation needed for the basic use case (any purchase qualifies); could add Count >= 1 for clarity
- Include tab

**SeeClear products (from data-model.md):**
- SeeClear DailyFocus (SEC-DLF-001)
- SeeClear SunSync (SEC-SNS-001)
- Product Family value: "SeeClear" (standard Salesforce Family field, exact value from seed data)

**Case sensitivity warning:** Product Family = "SeeClear" must match exactly. If seed data uses "seeclear" or "SeeClear Lenses" the filter will miss records. <!-- VERIFY --> exact Product Family value in seed data — from data-model.md it says Family = "SeeClear" (matching the product catalog table).

**Traversal path note:** In the LEOptical data model, the only path from Unified Individual to Product is via Sales Order → Sales Order Product → Product. There is no alternate path, so the traversal path prompt may not appear. If it does appear, select the Sales Order path.

---

### Segment 4: "Exam Overdue" (Assignment)

**Goal:** Customers whose last eye exam was more than 12 months ago.

**Two possible approaches:**

**Approach A — Using Eye Exam DMO (recommended, uses actual exam records):**
- DMO path: Unified Individual → Eye Exam → Exam Date
- Add related attribute: Eye Exam > Exam Date
- Aggregation: **Max** of Exam Date (= most recent exam date)
- Filter: Max(Exam Date) Is Before [relative date: 12 months / 365 days ago]
- This approach uses the actual exam data from clinic_exams.csv (stretch goal)

**Approach B — Using Individual direct attribute (simpler if available):**
- Eye Exam data lives in the Eye Exam DMO (from clinic_exams.csv, stretch goal), not on Individual
- This could be a direct attribute filter: Last Exam Date Is Before [365 days ago]
- Simpler but depends on whether this field is populated for all contacts (it comes from CRM Contact, not clinic_exams.csv)

**Recommendation for walkthrough:** Use Approach A (Eye Exam DMO) to demonstrate multi-hop traversal and aggregation. This also ensures the segment picks up exam records that were ingested via clinic_exams.csv (stretch goal), not just what's in the CRM.

**Field reference (from data-model.md):**
- DMO: Eye Exam (custom)
- Field: Exam Date (Date) — maps from CSV column `exam_date`
- Relationship: Eye Exam linked to Individual via patient_id FK (stretch goal)

<!-- VERIFY --> Whether the Eye Exam DMO relationship is correctly configured in the Data Graph so that it appears as a related attribute in the segment builder. If the relationship between Eye Exam and Unified Individual is not in the Data Graph, the Eye Exam attributes will not appear in the segment builder's related attributes panel.

---

## Actionable Lists

**What they are:** An Actionable List is a CRM object — a list of Contacts, Leads, Accounts, or Opportunities — derived FROM a Data 360 segment. It is not built independently; it is created through a feature called "List Builder for Data 360 Segment."

**Flow:** Build segment in Data 360 → App Launcher > List Builder for Data 360 Segment → Create Actionable List → select segment → select up to 10 fields to show → select target CRM object type (Contact, Lead, Account, Opportunity) → list populates.

**Sync behavior:** The Actionable List syncs periodically with the segment membership. Records removed from the segment are suppressed in the list.

**Use case:** Bridge segments to CRM-based sales processes. Enables sales reps to act on marketing segments directly in Salesforce CRM without leaving their workflow. NOT a replacement for MCA email sends — it's a CRM-side feature that exposes segment membership as a usable list in Sales/Service Cloud.

**Navigation path:** App Launcher > "List Builder for Data 360 Segment" > New (Source: Salesforce Help search result)

**From 2026-08-09-part2-restructure.md decision:** Cover Actionable Lists as a callout box (not a full section). The callout box treatment aligns with the spec's open question resolution: "It's a CRM-native feature that doesn't go through the full DMO/segment pipeline."

**Assignment connection:** Per the spec, learners should create an Actionable List from Campaign Members (inherited from old Module 7). This means: use the "VisionCare Rewards Launch" Campaign in CRM, build a segment that maps to Campaign Members, then create an Actionable List from it — OR create an Actionable List from the VIP Customers segment and show how it appears in CRM. <!-- VERIFY --> exact assignment intent: the spec says "create an Actionable List from Campaign Members" (old Module 7 language) but in context it may mean creating an Actionable List from a Data 360 segment of campaign members. This needs clarification — as a stretch goal, learners can create an Actionable List from their VIP Customers or other segment.

---

## Screenshot placeholders needed

Listed in order of criticality for the walkthrough:

1. **Segment list view** — showing New button and type options (Visual Builder, Standard Segment)
2. **Segment creation wizard** — showing Segment On dropdown, Publish Type selection, Publish Schedule
3. **Canvas empty state** — showing Include/Exclude tabs, attribute sidebar with Direct/Related sections
4. **Attribute sidebar expanded** — showing Loyalty Program Member in the Related Attributes list
5. **Container created** — after dragging Loyalty Tier onto canvas; showing the container UI with aggregation dropdown, operator, value field
6. **Completed "VIP Customers" filter** — showing Loyalty Tier Is In [Gold, Platinum] in the container
7. **Population count** — showing the count displayed in the segment header/canvas
8. **Traversal path prompt** — if it appears during SeeClear Enthusiasts build (may not appear in LEOptical model)
9. **Publish Now dropdown** — showing the Publish Now button and schedule options
10. **Published segment** — showing Published/Active status and member count
11. **Unified Individual - Latest DMO query** — in Query Editor, showing segment membership

---

## VERIFY items

All items requiring SDO confirmation before writing:

1. **Rapid Publish: type vs. mode** — RESOLVED: Rapid Publish is a publish mode (setting on a Standard Segment), not a distinct segment type. Multiple sources confirm. No further verification needed.

2. **Loyalty Program Member relationship type** — Is Loyalty Program Member a 1:1 or 1:N relationship to Unified Individual? If 1:1 (each person has at most one loyalty record), filtering on Loyalty Tier may be a direct attribute behavior (no aggregation needed). If 1:N (possible if email address changes create multiple records), a container with aggregation is needed. <!-- VERIFY in SDO -->

3. **Lookback window: per-segment vs. per-container** — Sources indicate both exist. Segment-level lookback is set at creation; container-level overrides it. <!-- VERIFY exact UI location in SDO: is lookback in the segment creation wizard? In each container? Both? -->

4. **Traversal path prompt for SeeClear Enthusiasts** — In the LEOptical data model, is there only one path from Unified Individual to Product (via Sales Order → Sales Order Product → Product)? If so, no prompt appears. <!-- VERIFY in SDO -->

5. **"Is In" operator for text fields** — Does the segment builder have an "Is In" operator for text type (to filter Loyalty Tier = Gold OR Platinum in one filter)? <!-- VERIFY in SDO -->

6. **"Last Number Of Days" date operator** — Does this exist in the current segment builder? Critical for Lapsed Buyers segment. <!-- VERIFY in SDO -->

7. **Lapsed Buyers filter design** — What is the correct way to express "no purchase in the last 180 days" in the builder? The approach using Max(Order Date) Is Before [date 180 days ago] or the Exclude approach? <!-- VERIFY which works correctly in SDO -->

8. **Eye Exam DMO in segment builder** — Confirm that Eye Exam DMO appears as a related attribute for Unified Individual in the segment builder. This requires that the relationship is defined in the Data Graph. <!-- VERIFY in SDO -->

9. **First publish timing with LEOptical seed data** — How long does the first publish take with ~48K contacts in an SDO? <!-- VERIFY in SDO so the walkthrough can give accurate timing guidance -->

10. **Container limits** — How many containers can be added to one segment? One source cited 5 containers for hierarchical aggregation (Account segments). Standard Unified Individual segments may differ. <!-- VERIFY in SDO -->

11. **Max nesting levels** — Multiple sources cite different numbers (5 or 10). <!-- VERIFY in SDO -->

12. **Concurrent publish limit** — Cited as 50 simultaneous publishes by one source. <!-- VERIFY in SDO or official docs -->

13. **Lookback range** — Exact range options in the UI: "1 day–360 days" and "1–2 years" were cited by the original prompt context. <!-- VERIFY exact options in SDO creation wizard -->

14. **Actionable List assignment scope** — Confirm the exact assignment: should learners create an Actionable List from VIP Customers segment, or specifically from Campaign Members? The spec inheritance from Module 7 says "Campaign Members" but the practical approach may differ now that Module 7 is removed. <!-- Clarify with course designer -->

---

## MCE comparison points

| Concept | MCE Equivalent | What Changed in MCA |
|---------|---------------|-------------------|
| Segment | Data Extension + Filter Activity + Group | Replaced entirely. MCA segments are defined once in Data 360, not as a combination of a data extension and filter activity. |
| Segment On | No direct equivalent. MCE filtered against a single DE. | MCA segments operate on a unified identity layer (Unified Individual). All data sources are merged before segmentation. |
| Include/Exclude tabs | MCE had Exclude lists in Send Definition, not in the filter builder itself. | MCA builds exclusions directly into the segment definition. |
| Containers | No direct equivalent in MCE. MCE used AND/OR groups within a single DE filter. | Containers enable multi-hop relationship traversal and aggregation across related DMOs. No MCE equivalent. |
| Traversal path | No equivalent. MCE segmented from a single flat DE. | MCA can traverse multiple relationship hops (e.g., Individual → Order → Product). MCE required pre-joined DEs. |
| Aggregation (Count/Sum/Avg) | MCE had no native aggregation in filter builder. Required pre-calculated fields in the DE. | MCA computes aggregations (count, sum, average, min, max) at segment-build time without pre-calculating. |
| Lookback window | MCE had no built-in lookback. Required date field filters against pre-calculated data. | MCA has configurable lookback windows (90-day default, up to 2 years) applied at segment evaluation time. |
| Rapid Publish | No equivalent. MCE used Send Activities for scheduling. | MCA's Rapid Publish gives 1–4 hour refresh cadences for near-real-time audiences. |
| Segment membership DMO | No equivalent. MCE segment membership was not a queryable data object. | MCA creates Latest and History DMOs per segment, queryable via the Query Editor. |
| Waterfall Segment | MCE had no native waterfall. Required manual exclusion logic in each subsequent DE. | MCA Waterfall Segments automate mutual exclusivity across up to 20 segments. |
| Nested Segment | MCE had no nested segments. | MCA allows using a published segment as a building block inside another segment. |
| Actionable List | MCE had Campaign Activity lists but no "List Builder for Data Cloud Segment" feature. | MCA Actionable Lists bridge Data 360 segments to CRM objects (Contact, Lead, etc.) natively. |

---

## Platform gotchas

**From platform-gotchas.md — all entries relevant to this module:**

### Segment-triggered flows against unpublished segments (CONFIRMED from Salesforce Help)
A segment-triggered flow shows "Completed" status but does nothing if the segment has never been published. The flow finds zero membership records and exits cleanly. No error is thrown. Publish the segment BEFORE activating the campaign flow. (Confirmed: 2026-08-10; Release: Summer '26)

### Activation template required to target a specific email address
Without an Activation Template, MCA sends to ALL Contact Point Emails on a Unified Individual. This is covered in the Activation Templates module but learners should know it exists — segments don't control which email to send to. (Confirmed: 2026-08-06; per platform-gotchas.md)

**New gotchas identified during research:**

### Case sensitivity in traversal path / field value matching
Linked field values must match exactly. A path key value of `c12d3` will NOT link to `C12D3`. When filtering related attributes that traverse DMO relationships, the join keys are case-sensitive. This is relevant for the SeeClear Enthusiasts segment where Product Family = "SeeClear" must match the exact value in the Product DMO. (Source: Trailhead "Create Filtered Segments")

### Draft segment: population count ≠ membership
The population count shown in the segment builder canvas is a PREVIEW estimate. A segment in Draft status has ZERO actual members. This is a common point of confusion — learners build a segment, see a count of 12,000, and assume 12,000 people are ready to receive emails. They are not. First publish is required to materialize the member list. (Source: multiple sources; Salesforce Help article 002061722)

### Dev Org: no scheduled segment publishes
Dev Orgs (SDOs) support only manual segment publishing — no scheduled refreshes. This matches the SDO limitation for data stream refreshes. In a production client org, segments publish on the configured schedule. In the SDO, learners must always publish manually. (Source: davidpalencia.com)

### Concurrent publish queuing
If too many segments publish simultaneously, the system queues and defers them. A segment marked "Deferred" or "Skipped" will run when capacity frees. This means a segment may not publish at its exact scheduled time during high-load periods. (Source: davidpalencia.com)

---

## External resources

- [Create Segments in Data 360 | Salesforce Help](https://help.salesforce.com/s/articleView?language=en_US&id=data.c360_a_segments.htm&type=5) — Primary documentation. JS-heavy and did not render, but URL is confirmed from search results.
- [Segment Types and Their Applications in Business Scenarios — Trailhead](https://trailhead.salesforce.com/content/learn/modules/advanced-segmentation-in-data-360/match-segment-types-to-your-use-case) — Most authoritative source on segment types (Standard, Waterfall, Dynamic, Real-Time, Rapid Publish as mode). Used extensively.
- [Filtered Segments for Data Cloud — Trailhead](https://trailhead.salesforce.com/content/learn/modules/customer-360-audiences-segmentation/create-filtered-segments) — Container logic, aggregation options (Count/Sum/Average/Min/Max), traversal path, filter operators by data type. Used extensively.
- [Salesforce Data Cloud Segmentation | David Palencia](https://davidpalencia.com/salesforce-data-cloud-segmentation/) — Comprehensive reference. Include/Exclude tabs, containers, aggregation, operators by data type, publish statuses, segment limits. Used extensively.
- [Segments in Salesforce Data Cloud | Salesforce Geek](https://salesforcegeek.in/segments-in-data-cloud/) — Segment types overview, publish lifecycle, membership DMOs (Latest/History). Used.
- [Segment Types and Applications | szymonlewandowski.pl](https://www.szymonlewandowski.pl/blog/data-360/segmentation/concepts) — Confirmed Rapid Publish as publish mode, not type. Direct vs related attributes. Container lookback behavior.
- [2 Methods to list your Segment members in Marketing Cloud Next | The Agentic Marketer](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/list-your-segment-members/) — Unified Individual — Latest DMO queries, SOQL method. UI preview method. Used.
- [Segment-Triggered Flows with Unpublished Segments Show Completed Status (Salesforce Help 002061722)](https://help.salesforce.com/s/articleView?id=002061722&language=en_US&type=1) — CRITICAL GOTCHA. Confirmed via search result summary. Direct page fetch was JS-only.
- [Create an Actionable List from a Data Cloud Segment | Salesforce Help](https://help.salesforce.com/s/articleView?id=sf.list_builder_for_data_cloud_segment_create_actionable_list.htm&language=en_US&type=5) — Actionable List mechanics. Direct page fetch was JS-only; content confirmed via search result summary.
- [How to Create Segments in Salesforce Marketing Cloud Next | Mavlers](https://www.mavlers.com/blog/marketing-cloud-next-segmentation-guide/) — Segment types, publish types vs publish schedules, builder interface. Used.
- [Create Segments and Reports with Data 360 Insights — Trailhead](https://trailhead.salesforce.com/content/learn/projects/explore-data-cloud-core-functionality/build-a-segment-and-report) — Step-by-step UI walkthrough for segment creation. Navigation path confirmed. Used.
- [Lookback Window on Engagement Data in Segments | Salesforce Help](https://help.salesforce.com/s/articleView?id=000395460&language=en_US&type=1) — Lookback window details. JS-only page; confirmed via search result summary.

---

## Source log

- https://help.salesforce.com/s/articleView?language=en_US&id=data.c360_a_segments.htm&type=5 — JS-heavy page, did not render article content. URL valid per search results.
- https://trailhead.salesforce.com/content/learn/modules/advanced-segmentation-in-data-360/match-segment-types-to-your-use-case — USED. Best source for segment type taxonomy. Confirmed Rapid is a publish mode.
- https://trailhead.salesforce.com/content/learn/modules/customer-360-audiences-segmentation/create-filtered-segments — USED. Best source for container mechanics, aggregation, traversal path, operators.
- https://trailhead.salesforce.com/content/learn/modules/customer-360-audiences-segmentation/navigate-customer-360-audiences-segmentation- — USED. Canvas overview, attribute types, population count.
- https://trailhead.salesforce.com/content/learn/projects/explore-data-cloud-core-functionality/build-a-segment-and-report — USED. Step-by-step UI walkthrough, navigation path.
- https://davidpalencia.com/salesforce-data-cloud-segmentation/ — USED. Comprehensive reference. Segment types, canvas mechanics, publish lifecycle, limits.
- https://salesforcegeek.in/segments-in-data-cloud/ — USED. Segment types, publish lifecycle, membership DMOs.
- https://www.szymonlewandowski.pl/blog/data-360/segmentation/concepts — USED. Confirmed Rapid as publish mode; direct vs related attributes; lookback override behavior.
- https://www.mavlers.com/blog/marketing-cloud-next-segmentation-guide/ — USED. Segment types, publish type vs schedule distinction.
- https://saisocial.substack.com/p/data-360-what-is-segmentation-what — USED. Direct vs related attribute definitions; aggregation options list.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/list-your-segment-members/ — USED. Unified Individual - Latest DMO, SOQL queries for segment membership.
- https://medium.com/salesforce-architects/optimizing-marketing-strategies-with-data-clouds-segment-membership-data-model-object-08b71f6a4765 — Fetch returned 403 error. Not used.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-segment-triggered-flow-39957ec68f06 — Fetch returned 403 error. Content confirmed via search result summary.
- https://medium.com/@marketingcloudtips/marketing-cloud-on-core-waterfall-segment-fbe99d4af303 — Fetch returned 403 error. Not used directly.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-leveraging-real-time-segments-868c0f591205 — Fetch returned 403 error. Not used directly.
- https://help.salesforce.com/s/articleView?id=002061722&language=en_US&type=1 — JS-heavy. Content confirmed via search result summary. CRITICAL GOTCHA documented.
- https://help.salesforce.com/s/articleView?id=sf.list_builder_for_data_cloud_segment_create_actionable_list.htm&language=en_US&type=5 — JS-heavy. Content confirmed via search result summary.
- https://help.salesforce.com/s/articleView?id=000395460&language=en_US&type=1 — JS-heavy. Lookback window details confirmed via search result summary.
- https://sfdcgym.com/segmentation-and-its-types-in-data-cloud/ — USED. Segment types overview including Nested and Einstein Lookalike.
- https://help.salesforce.com/s/articleView?id=sf.c360_a_use_a_container.htm&language=en_US&type=5 — JS-heavy, no content rendered.
- https://help.salesforce.com/s/articleView?id=data.c360_a_container_path.htm&language=en_US&type=5 — JS-heavy, no content rendered.
- https://help.salesforce.com/s/articleView?id=data.c360_a_nested_segments.htm&language=en_US&type=5 — JS-heavy, no content rendered.
- https://help.salesforce.com/s/articleView?id=data.c360_a_rapid_segment_publish.htm&language=en_US&type=5 — JS-heavy, no content rendered.
- https://help.salesforce.com/s/articleView?id=data.c360_a_publish_segment.htm&language=en_US&type=5 — JS-heavy, no content rendered.
