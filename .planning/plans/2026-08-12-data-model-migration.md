# Data Model Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update every file in the repository to reflect the new LEOptical data model, eliminating all references to the old 3-CSV structure.

**Architecture:** Six phases with dependency ordering. Phase 1 (infrastructure) blocks everything. Phases 2-5 are parallelizable after Phase 1 completes. Phase 6 (verification) runs last. Within each phase, tasks are independent and can run as parallel subagents.

**Audit report:** `.planning/specs/2026-08-12-data-model-audit-report.md`

**Canonical data model:** `.planning/DATA-MODEL.md`

## Global Constraints

- **Surgical edits only.** Each subagent makes ONLY the changes specified in its task. No prose rewrites, no style improvements, no refactoring, no "while I'm here" changes. If a line is not listed in the task, do not touch it.
- **No new content.** Do not add explanatory paragraphs, comments, or documentation beyond what is specified. Match the existing voice and style of surrounding text.
- **Terminology:** Use `.planning/DATA-MODEL.md` Terminology table for all replacements. If unsure about a term, check the table before writing.
- **Linter compliance:** All edited `.md` files in `docs/` must pass `npm run lint:content`. Do not introduce em dashes, exclamation marks, banned words, or `:::note`/`:::danger` admonitions. Do not use numbered module references (`Module \d+`).
- **No test changes.** This project has no test suite. Skip all test-related steps.
- **Commit convention:** `fix: update data model references in [scope]`

---

## Phase 1: Infrastructure (blocks all other phases)

### Task 1: Delete old spec and fix pipeline references

**Files:**
- Delete: `.planning/specs/data-model.md`
- Modify: `.planning/specs/2026-08-06-content-pipeline-design.md:94`
- Modify: `.planning/plans/2026-08-06-content-pipeline.md:91-93`
- Modify: `.planning/specs/leoptical-index.md:8-9`

**Produces:** All agent-facing references to the data model now point to the correct spec.

- [ ] **Step 1: Delete the old data model spec**

Delete the file `.planning/specs/data-model.md`. It is entirely superseded by `.planning/specs/2026-08-12-data-360-data-model-design.md`.

- [ ] **Step 2: Fix content pipeline design spec**

In `.planning/specs/2026-08-06-content-pipeline-design.md`, find line 94 (or nearby) referencing `.planning/specs/data-model.md`. Replace with `.planning/specs/2026-08-12-data-360-data-model-design.md`.

- [ ] **Step 3: Fix content pipeline plan**

In `.planning/plans/2026-08-06-content-pipeline.md`, find lines 91-93 (or nearby) referencing `.planning/specs/data-model.md`. Replace with `.planning/specs/2026-08-12-data-360-data-model-design.md`.

- [ ] **Step 4: Update leoptical-index.md**

In `.planning/specs/leoptical-index.md`:
- Line 8: Add `**DEPRECATED** — ` prefix to the `seed-data.md` row description. Append: `See \`2026-08-12-data-360-data-model-design.md\` for current data model.`
- Line 9: Replace the `data-model.md` row entirely. Change the link target to `2026-08-12-data-360-data-model-design.md` and update the description to match.

- [ ] **Step 5: Commit**

```
fix: remove old data-model.md and update pipeline references
```

---

## Phase 2: Seed Data Script (blocks Phase 6 verification; independent of Phases 3-5)

### Task 2: Rewrite generate-seed-data.py

This is the largest single task. The subagent must read the entire current script, understand all functions, and rewrite it to produce the new CSV structure.

**Files:**
- Modify: `scripts/generate-seed-data.py` (full file)

**Reference:** Read `.planning/DATA-MODEL.md` for all CSV schemas. Read `.planning/specs/2026-08-12-data-model-audit-report.md` Deliverable 3 for the complete function-by-function audit.

**Produces:** Running `python scripts/generate-seed-data.py` generates correct CSV files in `static/seed-data/`.

- [ ] **Step 1: Update constants**

Replace the old constants block with:

```python
LOYALTY_COUNT = 40_000
ECOM_CUSTOMER_COUNT = 30_000
ECOM_ORDER_COUNT = 100_000
CLINIC_PATIENT_COUNT = 25_000
CLINIC_EXAM_COUNT = 34_000
```

Remove `ORDER_COUNT` and `EXAM_COUNT`.

- [ ] **Step 2: Update `class Person` slots**

Rename attributes:
- `ecommerce_email` → `ecom_email`
- `exam_email` → `clinic_email`
- `in_ecommerce` → `in_ecom`
- `in_exams` → `in_clinic`

Add new attributes:
- `loyalty_member_id` (Text, assigned during loyalty CSV generation)
- `ecom_customer_id` (Text, assigned during cross-file membership)
- `patient_id` (Text, assigned during cross-file membership)

Remove attributes that only existed for CRM Contact custom fields:
- `loyalty_tier` and `loyalty_points` stay (they're used for loyalty CSV generation) but must NOT be written to `contacts.csv`
- `last_exam_date` and `next_exam_due` stay (used for clinic exam generation) but must NOT be written to `contacts.csv`

- [ ] **Step 3: Update `generate_master_registry`**

Rename all attribute references from old names to new names (`in_ecommerce` → `in_ecom`, `ecommerce_email` → `ecom_email`, etc.). The protagonist data block (lines ~457-463) must rename `p.in_ecommerce` → `p.in_ecom`, `p.in_exams` → `p.in_clinic`, `p.ecommerce_email` → `p.ecom_email`, `p.exam_email` → `p.clinic_email`.

- [ ] **Step 4: Update `assign_cross_file_membership`**

Rename all flag and email attribute references throughout. Update string literals: `'ecommerce'` → `'ecom'`, `'exam'` → `'clinic'`. Add `ecom_customer_id` assignment for all people with `in_ecom=True` (format: `EC-{counter:05d}`). Add `patient_id` assignment for all people with `in_clinic=True` (format: `PT-{counter:05d}`). Add `loyalty_member_id` assignment for all people with `in_loyalty=True` (format: `LM-{counter:05d}`).

Add 20% single-source-only enforcement: after all cross-file flags are set, iterate each source and unset flags for ~20% to ensure they appear in only one file.

- [ ] **Step 5: Update `generate_contacts_csv`**

Remove 4 columns from header: `Loyalty Tier`, `Loyalty Points`, `Last Exam Date`, `Next Exam Due`. Remove them from the `writer.writerow` call. Output columns become: `Account Name, FirstName, LastName, Email, Phone, MailingState`.

- [ ] **Step 6: Update `generate_loyalty_csv`**

Rename output file: `loyalty_members.csv` → `loyalty.csv`. Update column headers: `membership_number` → `loyalty_member_id`, `loyalty_tier` → `tier`, `points_balance` → `points`, `enrollment_date` → `join_date`. Remove `unsubscribed_date` and `status` columns. Remove the contradictory consent logic that sets `unsubscribed_date` when `email_optin=true`. Reorder columns to match schema: `loyalty_member_id, email, first_name, last_name, phone, tier, points, join_date, email_optin`. Use `p.loyalty_member_id` from the Person object instead of generating inline.

- [ ] **Step 7: Replace `generate_ecommerce_csv` with three functions**

Delete `generate_ecommerce_csv`. Create three new functions:

**`generate_ecom_customers_csv(people)`**: Write `ecom_customers.csv` with columns `ecom_customer_id, email, first_name, last_name, created_date, email_optin`. Iterate people with `p.in_ecom`. Use `p.ecom_customer_id`. Generate `created_date` using existing date logic. Generate `email_optin` with ~85% true rate.

**`generate_ecom_orders_csv(people, rng)`**: Write `ecom_orders.csv` with columns `order_id, ecom_customer_id, order_date, order_total, order_status`. FK is `p.ecom_customer_id` (NOT email). Reuse existing order distribution logic (date ranges, status distribution, protagonist orders). For protagonist orders, look up the protagonist Person by name to get their `ecom_customer_id` instead of hardcoding email strings. Return the list of generated orders (needed by order items function).

**`generate_ecom_order_items_csv(orders, rng)`**: Write `ecom_order_items.csv` with columns `order_item_id, order_id, sku, quantity, unit_price, line_total`. Reuse existing line item generation logic (SKU selection, orphaned SKUs, qty/price calculation). Column renames: `line_item_id` → `order_item_id`, `product_sku` → `sku`. Remove `order_source` from all logic.

- [ ] **Step 8: Replace `generate_exam_csv` with two functions**

Rename `generate_exam_csv` to `generate_clinic_exams_csv`. Update output file: `exam_history.csv` → `clinic_exams.csv`. Update columns: remove `patient_email`, `patient_first_name`, `patient_last_name`, `next_exam_due`. Add `patient_id` (from `p.patient_id`). Rename `provider_name` → `provider`. Final columns: `exam_id, patient_id, exam_date, exam_type, provider`.

Create `generate_clinic_patients_csv(people)`: Write `clinic_patients.csv` with columns `patient_id, email, first_name, last_name, email_optin`. Iterate people with `p.in_clinic`. Use `p.patient_id` and `p.clinic_email`.

- [ ] **Step 9: Update `generate_simulation_csvs`**

For `new_signups_july.csv`: rename columns to match `loyalty.csv` schema (`loyalty_member_id`, `tier`, `points`, `join_date`). Remove `unsubscribed_date` and `status`.

For `new_orders_july.csv`: update to match `ecom_orders.csv` schema. Replace `customer_email` with `ecom_customer_id`. Remove `order_source`. Remove line item columns (line items would need a separate file, but simulation CSV redesign is deferred — just make the header file correct for now). Add a comment: `# TODO: split into separate orders + order_items simulation files`.

- [ ] **Step 10: Update `main()`**

Update function calls to use new function names. Update summary print statements to reference new attribute names (`in_ecom`, `in_clinic`). Add calls to new functions (`generate_ecom_customers_csv`, `generate_ecom_order_items_csv`, `generate_clinic_patients_csv`). Ensure the call order is: contacts → loyalty → ecom_customers → ecom_orders → ecom_order_items → clinic_patients → clinic_exams → simulation.

- [ ] **Step 11: Update module docstring**

Replace old file list with new file list. Remove numbered module references.

- [ ] **Step 12: Run the script and verify output**

```bash
cd /Users/blakebrooks/Documents/repos/MCA/enablement-course
python scripts/generate-seed-data.py
```

Verify that `static/seed-data/` now contains: `contacts.csv`, `loyalty.csv`, `ecom_customers.csv`, `ecom_orders.csv`, `ecom_order_items.csv`, `clinic_patients.csv`, `clinic_exams.csv`, `new_signups_july.csv`, `new_orders_july.csv`, `new_contacts_batch1.csv`.

Verify column headers match the schemas in `.planning/DATA-MODEL.md`.

- [ ] **Step 13: Delete old CSV files**

Delete: `static/seed-data/loyalty_members.csv`, `static/seed-data/ecommerce_orders.csv`, `static/seed-data/exam_history.csv`.

- [ ] **Step 14: Commit**

```
fix: rewrite seed data script for new 6-file data model
```

---

### Task 3: Update SeedScript.tsx

**Files:**
- Modify: `src/components/SeedScript.tsx`

**Reference:** Audit report, src/components/SeedScript.tsx section.

- [ ] **Step 1: Read the file**

Read `src/components/SeedScript.tsx` completely.

- [ ] **Step 2: Remove stale CRM fields from Apex script**

In the `buildScript` function's `contacts` array (around lines 35-44), remove `tier`, `points`, `lastExam`, `nextDue` from each contact entry object.

In the Apex template literal (around lines 50-55), remove `Loyalty_Tier__c`, `Loyalty_Points__c`, `Last_Exam_Date__c`, `Next_Exam_Due__c` from the `new Contact(...)` constructor.

- [ ] **Step 3: Update counts and remove batch class reference**

Around line 68: remove the comment about "batch class (Step 2)" and update "~59,990" to "~48,662".

Around line 216: update "~59,990" to "~48,662".

- [ ] **Step 4: Commit**

```
fix: remove stale CRM fields from SeedScript protagonist Apex
```

---

### Task 4: Rewrite SEED-INSTRUCTIONS.md

**Files:**
- Modify: `static/seed-data/SEED-INSTRUCTIONS.md`

**Reference:** Audit report, SEED-INSTRUCTIONS.md section.

- [ ] **Step 1: Read the file**

Read `static/seed-data/SEED-INSTRUCTIONS.md` completely.

- [ ] **Step 2: Apply all fixes**

1. Line 3: Replace "Module 1" with the module name (e.g., "the Getting Started module" or use slug reference).
2. Line 11: Change "~60,000" to "~48,672".
3. Lines 40-56: Remove all references to `LEOpticalSeedBatch.cls` and `Database.executeBatch`. Replace Step 2 (Deploy the batch class) with instructions to use Data Import Wizard for `contacts.csv`.
4. Line 43: Remove the link to `LEOpticalSeedBatch.cls`.
5. Lines 66, 83: Update contact counts from "~60,000" / "60,010" to match actual count (~48,672 / ~48,682).
6. Line 97: Replace Data Loader reference with `DeleteSeedData.apex`.
7. Line 108: Replace "Module 4" with the module name or slug reference.

- [ ] **Step 3: Commit**

```
fix: update SEED-INSTRUCTIONS.md for new seeding method and counts
```

---

## Phase 3: Planning Doc Updates (independent of Phases 2, 4, 5)

### Task 5: Update PROGRESS.md

**Files:**
- Modify: `.planning/PROGRESS.md:23-27`

- [ ] **Step 1: Read the file**

Read `.planning/PROGRESS.md` completely.

- [ ] **Step 2: Replace CSV checklist items**

Replace lines 23-27 (the old CSV generation checklist) with:

```markdown
- [ ] `loyalty.csv` generated (with dirty data per spec)
- [ ] `ecom_customers.csv` generated
- [ ] `ecom_orders.csv` generated (with dirty data per spec, includes protagonist orders)
- [ ] `ecom_order_items.csv` generated (with orphaned SKUs per spec)
- [ ] `clinic_patients.csv` generated (stretch goal)
- [ ] `clinic_exams.csv` generated (stretch goal)
- [ ] `new_signups_july.csv` redesigned for new loyalty.csv schema
- [ ] `new_orders_july.csv` redesigned for new split ecom schema
```

- [ ] **Step 3: Commit**

```
fix: update PROGRESS.md CSV checklist for new data model
```

---

### Task 6: Update specs (part2-restructure and module-assignments)

**Files:**
- Modify: `.planning/specs/2026-08-09-part2-restructure.md`
- Modify: `.planning/specs/module-assignments.md`

**Reference:** Audit report sections for each file. Use `.planning/DATA-MODEL.md` Terminology table for replacements.

- [ ] **Step 1: Read both files**

Read `.planning/specs/2026-08-09-part2-restructure.md` and `.planning/specs/module-assignments.md` completely.

- [ ] **Step 2: Fix part2-restructure.md (5 edits)**

1. Lines 251-254: Replace "three external data sources" with four required CSV files plus two stretch. Replace all three old filenames with new ones.
2. Lines 257-260: Add that `loyalty.csv` maps to 3 DMOs (Individual, Contact Point Email, Loyalty Program Member). Note ecommerce is split into customer master + transaction files.
3. Lines 276-280: Update filenames. Move Eye Exam to stretch goal.
4. Lines 283-290: Change "Three data streams" to "Four data streams." Update loyalty mapping to include Individual and CPE. Move Eye Exam success criteria to stretch.
5. Line 305: Change `data-model.md` reference to `2026-08-12-data-360-data-model-design.md`.

- [ ] **Step 3: Fix module-assignments.md (4 edits)**

1. Lines 220-223: Replace `loyalty_members.csv` and `ecommerce_orders.csv` with the 4 new required filenames.
2. Lines 228-235: Change "Two Data Streams" to "Four data streams are configured (loyalty, ecom customers, ecom orders, ecom order items). Stretch: two additional streams (clinic patients, clinic exams)."
3. Line 238: Change `data-model.md` reference to `2026-08-12-data-360-data-model-design.md`.
4. Line 306: Add "(Stretch)" before the Exam Overdue segment, or move it to a separate stretch goal section.

- [ ] **Step 4: Commit**

```
fix: update part2-restructure and module-assignments specs for new data model
```

---

### Task 7: Rewrite seed-data.md spec

**Files:**
- Modify: `.planning/specs/seed-data.md`

**Reference:** Audit report seed-data.md section. `.planning/DATA-MODEL.md` for all schemas.

This file needs a full rewrite but the structure can be preserved. Replace every old filename, column name, record count, and DMO target with the new ones.

- [ ] **Step 1: Read the file**

Read `.planning/specs/seed-data.md` completely.

- [ ] **Step 2: Rewrite the CSV file tables**

Replace the 3-file table with the new 6-file structure (4 required + 2 stretch) from `.planning/DATA-MODEL.md` CSV Files section. Update all record counts, DMO targets, and descriptions. Note that `loyalty.csv` maps to 3 DMOs, ecommerce is split into customer master + orders + order items, and clinic is stretch.

- [ ] **Step 3: Update simulation CSV section**

Add a note that these CSVs need redesign to match new schemas. Copy the deferred-design note from the new data model spec.

- [ ] **Step 4: Update dirty data tables**

1. Replace all old file labels (`loyalty CSV` → `loyalty.csv`, etc.).
2. Remove the `unsubscribed_date` contradiction scenario.
3. Add the new cross-source `email_optin` contradiction (true in loyalty, false in ecom_customers).
4. Update the "Missing required fields" row to reference `loyalty.csv`.

- [ ] **Step 5: Update the script output description (line 5)**

Replace "loyalty, ecommerce, exams" with the 6 new filenames.

- [ ] **Step 6: Commit**

```
fix: rewrite seed-data.md spec for new 6-file data model
```

---

## Phase 4: Course Content Updates (independent of Phases 2, 3, 5)

### Task 8: Update Introduction and Part 1 docs

**Files:**
- Modify: `docs/introduction/how-this-course-works.md:72`
- Modify: `docs/part-1-foundations/consumption-entitlements.md:97,108,145,147`

**Reference:** Audit report sections for each file.

- [ ] **Step 1: Read both files**

Read `docs/introduction/how-this-course-works.md` and `docs/part-1-foundations/consumption-entitlements.md` completely.

- [ ] **Step 2: Fix how-this-course-works.md (1 edit)**

Line 72: Replace `ecommerce_orders.csv`, `loyalty_members.csv`, and `exam_history.csv` with `loyalty.csv`, `ecom_customers.csv`, `ecom_orders.csv`, and `ecom_order_items.csv`. Note clinic files as optional stretch data.

- [ ] **Step 3: Fix consumption-entitlements.md (4 edits)**

1. Line 97: Change "exam history data streams" to "clinic data streams" (or "loyalty, ecommerce, and clinic data streams").
2. Line 108: Add "ecommerce customer records" to the list of IDR source profiles (alongside CRM Contacts and Loyalty Member records).
3. Line 145: Change `exam_history.csv` to `clinic_exams.csv`.
4. Line 147: Remove the `unsubscribed_date` reference. Replace with a sentence about cross-source `email_optin` contradictions: some people have `email_optin=true` in loyalty but `email_optin=false` in ecommerce.

- [ ] **Step 4: Run linter on both files**

```bash
npm run lint:content docs/introduction/how-this-course-works.md
npm run lint:content docs/part-1-foundations/consumption-entitlements.md
```

- [ ] **Step 5: Commit**

```
fix: update data model references in introduction and Part 1
```

---

### Task 9: Update Working with Data 360 module (index + data model)

**Files:**
- Modify: `docs/part-2-data/working-with-data-360/index.md:11,27`
- Modify: `docs/part-2-data/working-with-data-360/the-leoptical-data-model.md` (10 edits)

**Reference:** Audit report sections for each file. `.planning/DATA-MODEL.md` for all schemas and terminology.

- [ ] **Step 1: Read both files**

Read `docs/part-2-data/working-with-data-360/index.md` and `docs/part-2-data/working-with-data-360/the-leoptical-data-model.md` completely.

- [ ] **Step 2: Fix index.md (2 edits)**

1. Line 11: Replace "three external data sources (loyalty members, ecommerce orders, and eye exam records)" with "external data sources — loyalty member profiles, ecommerce customer records, and ecommerce orders." Add that clinic patient and exam data is a stretch goal.
2. Line 27: Update the lesson overview bullet similarly. Replace "loyalty, ecommerce, and eye exam data" with "loyalty, ecommerce customer, and ecommerce order data (plus clinic data as a stretch goal)".

- [ ] **Step 3: Fix the-leoptical-data-model.md ERD (3 entity updates)**

1. Lines 71-78: Update `LOYALTY_MEMBERSHIP` entity. Replace `membership_number PK` → `loyalty_member_id PK`, `loyalty_tier` → `tier`, `points_balance` → `points`, `enrollment_date` → `join_date`. Add `email_optin`.
2. Lines 80-87: Update `ORDER` entity. Replace `customer_email` with `ecom_customer_id FK`. Remove `order_source`.
3. Lines 106-115: Update `EYE_EXAM` entity. Remove `patient_email`, `patient_first_name`, `patient_last_name`, `next_exam_due`. Add `patient_id FK`. Keep `exam_id PK`, `exam_date`, `exam_type`, `provider`.

- [ ] **Step 4: Fix DMO mapping table (lines 131-143)**

Rebuild the table with new filenames and DMO targets. Use the table from `.planning/DATA-MODEL.md` CSV Files section as the source. Add rows for Individual and Contact Point Email (from loyalty.csv, ecom_customers.csv, clinic_patients.csv). Update ecommerce to show 3 separate files. Mark Eye Exam as "(Stretch)".

- [ ] **Step 5: Fix field descriptions and relationship text**

1. Lines 148-149: Update loyalty field names. Add note that `loyalty.csv` maps to 3 DMOs.
2. Lines 163-164: Add that each source explicitly maps to Individual + CPE via Profile-category data streams.
3. Lines 167-168: Add that Sales Order connects to Individual via `SoldToCustomerId` populated from `ecom_customer_id`.
4. Lines 172-173: Add that Eye Exam connects via `patient_id` FK. Add "(Stretch)" label.

- [ ] **Step 6: Fix segment traversal and success criteria**

1. Lines 183-185: Add "(Stretch)" to Exam Overdue row.
2. Lines 251-252: Add "(Stretch)" qualifier to Eye Exam in the success criteria DMO list.

- [ ] **Step 7: Run linter**

```bash
npm run lint:content docs/part-2-data/working-with-data-360/index.md
npm run lint:content docs/part-2-data/working-with-data-360/the-leoptical-data-model.md
```

- [ ] **Step 8: Commit**

```
fix: update Working with Data 360 module for new data model
```

---

### Task 10: Update Ingesting External Data module

**Files:**
- Modify: `docs/part-2-data/working-with-data-360/ingesting-external-data.md` (11 edits)

**Reference:** Audit report ingesting-external-data.md section (the most detailed). `.planning/DATA-MODEL.md` for all schemas.

This is the most edit-heavy doc file. Every edit is specified in the audit report. Do NOT rewrite sections that aren't flagged.

- [ ] **Step 1: Read the file completely**

Read `docs/part-2-data/working-with-data-360/ingesting-external-data.md`.

- [ ] **Step 2: Replace CSV file list (lines 29-33)**

Replace the 3-file list with the new structure. Use required (4 files) + stretch (2 files) grouping. Include correct download link paths (`/seed-data/loyalty.csv`, etc.) and DMO targets.

- [ ] **Step 3: Update primary keys section (lines 78-80)**

Replace the 3-file PK list with all 6 files and correct PKs. `loyalty.csv: loyalty_member_id`, `ecom_customers.csv: ecom_customer_id`, `ecom_orders.csv: order_id`, `ecom_order_items.csv: order_item_id`, `clinic_patients.csv (stretch): patient_id`, `clinic_exams.csv (stretch): exam_id`.

- [ ] **Step 4: Rebuild standard vs custom DMO table (lines 130-134)**

Replace with new table showing all files and their DMO targets. Include the 3-DMO pattern note for `loyalty.csv`. Show `ecom_customers.csv` → Individual + CPE. Show separate entries for `ecom_orders.csv` → Sales Order and `ecom_order_items.csv` → Sales Order Product. Mark clinic files as stretch.

- [ ] **Step 5: Update loyalty DMO description (lines 140-143)**

Replace old field names (`membership number` → `loyalty_member_id`, `enrollment date` → `join_date`). Add that `loyalty.csv` maps to 3 DMOs via one Profile-category data stream.

- [ ] **Step 6: Rebuild field mapping tables**

Loyalty Program Member table (lines 177-189): Replace `membership_number` → `loyalty_member_id`, `loyalty_tier` → `tier`, `points_balance` → `points`, `enrollment_date` → `join_date`. Remove `unsubscribed_date` row. Use the table from `.planning/DATA-MODEL.md` DMO Field Mappings section.

Sales Order table (lines 193-202): Remove `customer_email` and `order_source` rows. Add `ecom_customer_id` → `Sold To Customer` row. Use the table from `.planning/DATA-MODEL.md`.

Eye Exam table (lines 214-225): Replace header reference from `exam_history.csv` to `clinic_exams.csv`. Remove `patient_email` row. Add `patient_id` → `Patient Id` row. Add "(Stretch)" label. Use the table from `.planning/DATA-MODEL.md`.

- [ ] **Step 7: Update custom DMO text (line 229)**

Change `exam_history.csv` to `clinic_exams.csv`.

- [ ] **Step 8: Rewrite assignment (lines 290-299)**

Replace the old 4-step assignment with:
1. Create a data stream for `loyalty.csv` (Profile category). Map to Individual, Contact Point Email, and Loyalty Program Member.
2. Create a data stream for `ecom_customers.csv` (Profile category). Map to Individual and Contact Point Email.
3. Create a data stream for `ecom_orders.csv`. Map to Sales Order.
4. Create a data stream for `ecom_order_items.csv`. Map to Sales Order Product.
5. **(Stretch)** Create the custom Eye Exam DMO. Create data streams for `clinic_patients.csv` (Profile) and `clinic_exams.csv`. Map appropriately.

- [ ] **Step 9: Rewrite success criteria (lines 301-308)**

Replace "Three data streams" with "Four data streams are created (loyalty, ecom customers, ecom orders, ecom order items)." Update loyalty criteria to mention Individual and CPE. Move Eye Exam criteria to a stretch section.

- [ ] **Step 10: Update knowledge check (lines 318-320)**

Replace the question about one ecommerce data stream mapping to two DMOs. New question: "The ecommerce data is split across three files (ecom_customers, ecom_orders, ecom_order_items). Why does Data 360 require this separation rather than a single denormalized file?"

- [ ] **Step 11: Run linter**

```bash
npm run lint:content docs/part-2-data/working-with-data-360/ingesting-external-data.md
```

- [ ] **Step 12: Commit**

```
fix: update Ingesting External Data module for new data model
```

---

### Task 11: Update Identity Resolution modules

**Files:**
- Modify: `docs/part-2-data/identity-resolution/index.md:9,55-56,108`
- Modify: `docs/part-2-data/identity-resolution/configuring-idr.md:99`

- [ ] **Step 1: Read both files**

- [ ] **Step 2: Fix index.md (3 edits)**

1. Line 9: Change "ecommerce orders with yet another email" to "the ecommerce customer master with yet another email."
2. Lines 55-56: Add a note that the 4th source profile (clinic) is only present if the learner completed the stretch goal.
3. Line 108: Add "ecommerce customer records" to the IDR source profiles list.

- [ ] **Step 3: Fix configuring-idr.md (1 edit)**

Line 99: Change "in ecommerce orders" to "in the ecommerce customer master."

- [ ] **Step 4: Run linter**

```bash
npm run lint:content docs/part-2-data/identity-resolution/index.md
npm run lint:content docs/part-2-data/identity-resolution/configuring-idr.md
```

- [ ] **Step 5: Commit**

```
fix: update Identity Resolution modules for new data model
```

---

### Task 12: Update Data Graphs and Segmentation modules

**Files:**
- Modify: `docs/part-2-data/data-graphs/index.md:174-188`
- Modify: `docs/part-2-data/data-graphs/configuring-leoptical-data-graph.md:83-103,136-148,151-168,257-258`
- Modify: `docs/part-2-data/segmentation/building-leoptical-segments.md:172-187`

- [ ] **Step 1: Read all three files**

- [ ] **Step 2: Fix data-graphs/index.md (1 edit)**

Lines 174-188: Add "(Stretch)" label to the Eye Exam row in the "What gets included" table. Add note: "Only present if clinic data was ingested."

- [ ] **Step 3: Fix configuring-leoptical-data-graph.md (4 edits)**

1. Lines 83-103: Remove `Customer Email` from the Sales Order field selection list.
2. Lines 136-148: Add `:::info` admonition before the "Add Eye Exam" section: "This step requires clinic data from the stretch goal in the Ingesting External Data module. Skip if you did not ingest clinic data." Add "(Stretch)" to the section heading.
3. Lines 151-168: Add "(Stretch)" annotation to the Eye Exam line in the graph structure diagram.
4. Lines 257-258: Move Eye Exam from required success criteria to stretch: "The graph structure includes Loyalty Program Member, Sales Order, Sales Order Product, and Product. Stretch: Eye Exam is also included if clinic data was ingested."

- [ ] **Step 4: Fix building-leoptical-segments.md (1 edit)**

Lines 172-187: Add `:::info` admonition before the Exam Overdue segment section: "This segment requires Eye Exam data from the clinic data stretch goal. Skip if you did not ingest clinic data."

- [ ] **Step 5: Run linter**

```bash
npm run lint:content docs/part-2-data/data-graphs/index.md
npm run lint:content docs/part-2-data/data-graphs/configuring-leoptical-data-graph.md
npm run lint:content docs/part-2-data/segmentation/building-leoptical-segments.md
```

- [ ] **Step 6: Commit**

```
fix: mark Eye Exam as stretch goal in Data Graphs and Segmentation modules
```

---

## Phase 5: Research File Updates (independent of Phases 2, 3, 4)

### Task 13: Update research files

**Files:**
- Modify: `.planning/research/working-with-data-360.md` (7 edits)
- Modify: `.planning/research/data-graphs.md` (3 edits)
- Modify: `.planning/research/identity-resolution.md` (1 edit)
- Modify: `.planning/research/identity-resolution-brief.md` (1 edit)
- Modify: `.planning/research/segmentation.md` (1 edit)

**Reference:** Audit report sections for each file. `.planning/DATA-MODEL.md` Terminology table.

- [ ] **Step 1: Read all five files**

- [ ] **Step 2: Fix working-with-data-360.md (7 edits)**

1. Lines 17-19: Replace `loyalty_members.csv` and `ecommerce_orders.csv` with the 4 new required filenames.
2. Lines 25-27: Change "Two Data Streams" to "Four Data Streams."
3. Lines 427-438: Update DMO table filenames. Add Individual and CPE rows. Mark Eye Exam as stretch.
4. Lines 443-445: Update loyalty field names. Remove `unsubscribed_date`.
5. Lines 447-450: Remove `Customer Email` and `Order Source`. Add `Sold To Customer`.
6. Lines 453-458: Remove `Patient Email`, `Patient First Name`, `Patient Last Name`, `Next Exam Due`. Add `patient_id`. Mark as stretch.
7. Line 462: Update Data Graph traversal to show connection through Individual via FKs.

- [ ] **Step 3: Fix data-graphs.md (3 edits)**

1. Lines 496-509: Update traversal paths to `Unified Individual → Individual → Sales Order (via Sold To Customer)` and `Unified Individual → Individual → Eye Exam (via patient_id) — stretch`.
2. Lines 597-612: Update field names. Remove `Customer Email`. Add `Sold To Customer`.
3. Lines 609-612: Remove `Next Exam Due` row.

- [ ] **Step 4: Fix identity-resolution.md (1 edit)**

Lines 55-61: Change "ecommerce orders" to "ecommerce customer account."

- [ ] **Step 5: Fix identity-resolution-brief.md (1 edit)**

Lines 24-29: Change "Eye exam records" to "Clinic patient records (stretch goal)."

- [ ] **Step 6: Fix segmentation.md (1 edit)**

Line 32: Add "(stretch — requires clinic data)" after the Exam Overdue segment.

- [ ] **Step 7: Commit**

```
fix: update research files for new data model
```

---

## Phase 6: Verification Sweep (runs after all other phases)

### Task 14: Grep verification

**Files:** All files in repository (read-only scan)

**Produces:** Confirmation that no old data model terms survive, or a list of remaining issues.

- [ ] **Step 1: Grep for old CSV filenames**

Search the entire repository for: `loyalty_members.csv`, `loyalty_members`, `ecommerce_orders.csv`, `ecommerce_orders`, `exam_history.csv`, `exam_history`. Exclude `.planning/specs/2026-08-12-data-model-audit-report.md` (the audit report itself references old terms). Exclude `git` history.

- [ ] **Step 2: Grep for old column names**

Search for: `customer_email` (excluding code comments about the old model), `patient_email`, `membership_number`, `points_balance`, `loyalty_tier` (as a column reference, not as a DMO field label "Loyalty Tier"), `enrollment_date`, `unsubscribed_date`, `order_source`, `patient_first_name`, `patient_last_name`, `next_exam_due`.

- [ ] **Step 3: Grep for old spec references**

Search for: `data-model.md` (excluding the audit report and DATA-MODEL.md itself), `LEOpticalSeedBatch`.

- [ ] **Step 4: Grep for old counts**

Search for: `60,000`, `59,990`, `60,010` in non-git files.

- [ ] **Step 5: Run content linter on all docs**

```bash
npm run lint:content
```

- [ ] **Step 6: Report results**

If any old terms survive, list them with file paths and line numbers. If all clean, confirm the migration is complete.

- [ ] **Step 7: Commit any remaining fixes**

If the grep found survivors, fix them and commit:
```
fix: remove remaining old data model references
```
