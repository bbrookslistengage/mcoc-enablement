# Data Model Audit Report

Date: 2026-08-12

Authoritative new data model spec: `.planning/specs/2026-08-12-data-360-data-model-design.md`

This report identifies every reference to the old data model across the entire repository. It covers four deliverables: stale reference report, files to delete or replace, script audit, and content change summary by part.

---

## Deliverable 1: Stale Reference Report

### .planning/specs/data-model.md

**Status: ENTIRELY SUPERSEDED.** Every section reflects the old 3-CSV model. Should be deleted (see Deliverable 2). Key stale elements for reference:

1. **Lines 47–55:** `LOYALTY_MEMBERSHIP` ERD entity uses `membership_number PK`, `loyalty_tier`, `points_balance`, `enrollment_date`.
   **Issue:** All four column names are old. New: `loyalty_member_id`, `tier`, `points`, `join_date`. Missing `email_optin`.
   **Fix:** N/A — file should be deleted.

2. **Lines 59–64:** `ORDER` ERD entity uses `customer_email` and `order_source`.
   **Issue:** `customer_email` replaced by `ecom_customer_id` FK. `order_source` removed entirely.

3. **Lines 85–92:** `EYE_EXAM` ERD entity uses `patient_email`, `patient_first_name`, `patient_last_name`.
   **Issue:** All three removed. New schema: `exam_id`, `patient_id` (FK), `exam_date`, `exam_type`, `provider`.

4. **Lines 111–157:** Mermaid data flow diagram references `loyalty_members.csv`, `ecommerce_orders.csv`, `exam_history.csv`. Ingestion arrows show `CSV1 --> LPM`, `CSV2 --> SO & SOP`, `CSV3 --> EXAM`.
   **Issue:** All filenames wrong. All mapping arrows wrong (loyalty now maps to 3 DMOs, ecommerce is 3 files, clinic is stretch).

5. **Lines 178–190:** DMO mapping table says Contact Point Email is "created during IDR from CSV email fields."
   **Issue:** CPE records are now created from explicit field mappings in Profile-category data streams, not during IDR.

6. **Lines 254–265:** Loyalty Program Member field table uses `membership_number`, `enrollment_date`, `loyalty_tier`, `points_balance`, `unsubscribed_date`.
   **Issue:** All renamed or removed.

7. **Lines 279–285:** Sales Order field table includes `customer_email` and `order_source`.
   **Issue:** Both removed.

8. **Lines 296–309:** Eye Exam field table includes `patient_email`, `patient_first_name`, `patient_last_name`.
   **Issue:** All removed. FK is now `patient_id`.

9. **Lines 346–379:** Data Graph diagram and traversal table show direct connections via email fields.
   **Issue:** New model connects via explicit FK relationships (`SoldToCustomerId`, `patient_id`).

---

### .planning/specs/seed-data.md

**Status: NEEDS FULL REWRITE.** Every section describes the old 3-CSV structure.

1. **Line 5:** References "loyalty, ecommerce, exams" as three outputs.
   **Issue:** Now 6 files (4 required + 2 stretch).

2. **Lines 89–91:** CSV file table lists `loyalty_members.csv`, `ecommerce_orders.csv`, `exam_history.csv` with old DMO targets and record counts.
   **Issue:** All filenames, DMO targets, and descriptions are wrong.

3. **Lines 97–99:** Simulation CSV table presents them as current/valid.
   **Issue:** All three simulation CSVs need redesign per new schemas.

4. **Lines 119–128:** Dirty data table references cross-source email matching with old file labels.
   **Issue:** Should reference `ecom_customers.csv` and `clinic_patients.csv`.

5. **Lines 143–145:** Consent dirty data references `unsubscribed_date`.
   **Issue:** `unsubscribed_date` removed entirely. New scenario: `email_optin=true` in loyalty but `email_optin=false` in `ecom_customers`.

---

### .planning/specs/2026-08-09-part2-restructure.md

1. **Lines 251–254:** `ingesting-external-data.md` lesson body says "three external data sources" and lists `loyalty_members.csv`, `ecommerce_orders.csv`, `exam_history.csv`.
   **Issue:** Now four required sources producing 4 CSV files plus 2 stretch. All filenames wrong.
   **Fix:** Update to 4 required files (`loyalty.csv`, `ecom_customers.csv`, `ecom_orders.csv`, `ecom_order_items.csv`) plus 2 stretch.

2. **Lines 257–260:** Standard vs custom DMO description omits that `loyalty.csv` maps to 3 DMOs and that ecommerce is now split across 3 files.
   **Issue:** Incomplete mapping description.
   **Fix:** Describe the 3-DMO pattern for loyalty and the customer master + transaction file split.

3. **Lines 276–280:** Assignment lists old filenames and wrong mapping descriptions.
   **Issue:** All filenames wrong. Eye Exam is stretch, not required.
   **Fix:** Update filenames. Move Eye Exam to stretch goal.

4. **Lines 283–290:** Success criteria say "Three data streams" and only map loyalty to LPM.
   **Issue:** Now four required streams. Loyalty maps to 3 DMOs.
   **Fix:** Update count and DMO targets.

5. **Line 305:** References `.planning/specs/data-model.md` as the ERD source.
   **Issue:** Superseded file.
   **Fix:** Point to `2026-08-12-data-360-data-model-design.md`.

---

### .planning/specs/module-assignments.md

1. **Lines 220–223:** Module 7 assignment lists `loyalty_members.csv` and `ecommerce_orders.csv`.
   **Issue:** Old filenames. Should be the 4 new required files.
   **Fix:** Update filenames.

2. **Lines 228–235:** Success criteria say "Two Data Streams."
   **Issue:** Now four required data streams.
   **Fix:** Update to four.

3. **Line 238:** Cross-reference points to `data-model.md`.
   **Issue:** Superseded file.
   **Fix:** Update to `2026-08-12-data-360-data-model-design.md`.

4. **Line 306:** "Exam Overdue" listed as a required segment.
   **Issue:** Requires clinic data (stretch goal).
   **Fix:** Move to stretch goal section.

---

### .planning/specs/leoptical-index.md

1. **Line 8:** Index entry for `seed-data.md` presents it as current.
   **Issue:** Superseded.
   **Fix:** Add deprecation note pointing to `2026-08-12-data-360-data-model-design.md`.

2. **Line 9:** Index entry for `data-model.md` presents it as authoritative.
   **Issue:** Superseded.
   **Fix:** Add deprecation note pointing to `2026-08-12-data-360-data-model-design.md`.

---

### .planning/specs/2026-08-06-content-pipeline-design.md

1. **Line 94:** Researcher agent told to read `.planning/specs/data-model.md`.
   **Issue:** Superseded file. Researcher agents will pull stale data model info.
   **Fix:** Update to reference `2026-08-12-data-360-data-model-design.md`.

---

### .planning/plans/2026-08-06-content-pipeline.md

1. **Lines 91–93:** Researcher agent Step 1 references `.planning/specs/data-model.md`.
   **Issue:** Superseded file.
   **Fix:** Update to `2026-08-12-data-360-data-model-design.md`.

---

### .planning/PROGRESS.md

1. **Line 23:** `- [x] \`loyalty_members.csv\` generated`
   **Issue:** Old filename. New: `loyalty.csv`.
   **Fix:** Rename and un-check (needs regeneration).

2. **Line 24:** `- [x] \`ecommerce_orders.csv\` generated`
   **Issue:** Old filename. Now 3 separate files.
   **Fix:** Replace with 3 items for `ecom_customers.csv`, `ecom_orders.csv`, `ecom_order_items.csv`, all unchecked.

3. **Line 25:** `- [x] \`exam_history.csv\` generated`
   **Issue:** Old filename. Now `clinic_patients.csv` + `clinic_exams.csv` (stretch).
   **Fix:** Replace with 2 items, unchecked, marked stretch.

4. **Lines 26–27:** `new_signups_july.csv` and `new_orders_july.csv` marked complete.
   **Issue:** Both need redesign per new schemas.
   **Fix:** Un-check and note redesign needed.

---

### .planning/research/working-with-data-360.md

1. **Lines 17–19:** Assignment lists `loyalty_members.csv` and `ecommerce_orders.csv`.
   **Issue:** Old filenames. Now 4 required files.
   **Fix:** List new filenames.

2. **Lines 25–27:** Success criteria say "Two Data Streams."
   **Issue:** Now four.
   **Fix:** Update count.

3. **Lines 427–438:** DMO table lists `loyalty_members.csv`, `ecommerce_orders.csv`, `exam_history.csv`.
   **Issue:** All filenames wrong. Missing Individual and CPE rows for CSV sources.
   **Fix:** Update filenames. Add Individual/CPE rows.

4. **Lines 443–445:** Loyalty field details use old column names and reference `unsubscribed_date`.
   **Issue:** Column names renamed. `unsubscribed_date` removed.
   **Fix:** Update names. Remove `unsubscribed_date`.

5. **Lines 447–450:** Sales Order field details include `Customer Email` and `Order Source`.
   **Issue:** Both removed. Replaced by `Sold To Customer` FK.
   **Fix:** Update accordingly.

6. **Lines 453–458:** Eye Exam field details include `Patient Email`, `Patient First Name`, `Patient Last Name`, `Next Exam Due`.
   **Issue:** All removed from Eye Exam DMO. FK is now `patient_id`.
   **Fix:** Replace with new schema.

7. **Line 462:** Data Graph structure implies direct connection from Unified Individual to Sales Order and Eye Exam.
   **Issue:** Now connects through Individual via explicit FKs.
   **Fix:** Update traversal paths.

---

### .planning/research/data-graphs.md

1. **Lines 496–509:** LEOptical DMO table shows `Unified Individual → Sales Order` and `Unified Individual → Eye Exam` as direct paths.
   **Issue:** Both now traverse through Individual via explicit FK relationships.
   **Fix:** Update paths to `Unified Individual → Individual → Sales Order (via Sold To Customer)` and `Unified Individual → Individual → Eye Exam (via patient_id) — stretch`.

2. **Lines 597–612:** Field detail table uses `Loyalty Tier`, `Points Balance`, `Customer Email`.
   **Issue:** Old column names. `Customer Email` removed from Sales Order.
   **Fix:** Update names. Remove `Customer Email`. Add `Sold To Customer`.

3. **Lines 609–612:** Personalization table references `Next Exam Due`.
   **Issue:** Removed from Eye Exam DMO.
   **Fix:** Remove that row.

---

### .planning/research/identity-resolution.md

1. **Lines 55–61:** IDR scenario references "ecommerce orders" as the third email source.
   **Issue:** Email comes from `ecom_customers.csv` (customer master), not orders.
   **Fix:** Change "ecommerce orders" to "ecommerce customer account."

---

### .planning/research/identity-resolution-brief.md

1. **Lines 24–29:** Lists "Eye exam records" as a required IDR source.
   **Issue:** Clinic data is stretch. Email comes from `clinic_patients.csv`, not exam records.
   **Fix:** Change to "Clinic patient records (stretch goal)."

---

### .planning/research/segmentation.md

1. **Line 32:** "Exam Overdue" segment listed as equally required alongside VIP, Lapsed Buyers, SeeClear Enthusiasts.
   **Issue:** Requires clinic data (stretch goal).
   **Fix:** Add stretch qualification.

---

### docs/introduction/how-this-course-works.md

1. **Line 72:** `Look at \`contacts.csv\`, \`ecommerce_orders.csv\`, \`loyalty_members.csv\`, and \`exam_history.csv\`.`
   **Issue:** Three old filenames.
   **Fix:** Update to `contacts.csv`, `loyalty.csv`, `ecom_customers.csv`, `ecom_orders.csv`, `ecom_order_items.csv`. Note clinic files as stretch.

---

### docs/part-1-foundations/consumption-entitlements.md

1. **Line 97:** VERIFY comment references "exam history data streams."
   **Issue:** Now "clinic data streams" (stretch).
   **Fix:** Update terminology.

2. **Line 108:** Says only CRM Contacts and Loyalty Members count as IDR source profiles.
   **Issue:** Missing ecommerce customers (`ecom_customers.csv`).
   **Fix:** Add ecommerce customer records.

3. **Line 145:** References `exam_history.csv` by filename.
   **Issue:** Old filename. Now `clinic_exams.csv`.
   **Fix:** Update filename.

4. **Line 147:** References `unsubscribed_date` on loyalty CSV.
   **Issue:** Field removed.
   **Fix:** Remove or rewrite with the new cross-source `email_optin` contradiction scenario.

---

### docs/part-2-data/working-with-data-360/index.md

1. **Line 11:** "three external data sources (loyalty members, ecommerce orders, and eye exam records)"
   **Issue:** Now 4 required data streams + 2 stretch. Eye exams are stretch.
   **Fix:** Update to "loyalty members, ecommerce customer records, and ecommerce orders." Note clinic as stretch.

2. **Line 27:** Lesson overview bullet lists "loyalty, ecommerce, and eye exam data."
   **Issue:** Same framing problem.
   **Fix:** Update and add stretch qualification for clinic.

---

### docs/part-2-data/working-with-data-360/the-leoptical-data-model.md

This file has the heaviest concentration of stale references in the entire repository.

1. **Lines 71–78:** `LOYALTY_MEMBERSHIP` ERD entity uses `membership_number PK`, `loyalty_tier`, `points_balance`, `enrollment_date`.
   **Issue:** All renamed. Missing `email_optin`.
   **Fix:** Update to `loyalty_member_id`, `tier`, `points`, `join_date`. Add `email_optin`.

2. **Lines 80–87:** `ORDER` ERD entity uses `customer_email` and `order_source`.
   **Issue:** Both removed. FK is now `ecom_customer_id`.
   **Fix:** Replace `customer_email` with `ecom_customer_id FK`. Remove `order_source`.

3. **Lines 106–115:** `EYE_EXAM` ERD entity uses `patient_email`, `patient_first_name`, `patient_last_name`, `next_exam_due`.
   **Issue:** All removed. FK is now `patient_id`.
   **Fix:** Replace with new schema.

4. **Lines 131–143:** DMO mapping table lists `loyalty_members.csv`, `ecommerce_orders.csv`, `exam_history.csv`.
   **Issue:** All filenames wrong. Loyalty maps to 1 DMO (should be 3). Ecommerce is 1 file (should be 3). Exam is required (should be stretch).
   **Fix:** Rebuild table with new filenames, multi-DMO mappings, and stretch labels.

5. **Lines 148–149:** Loyalty Program Member field descriptions use old column names and omit the 3-DMO pattern.
   **Issue:** Old names and incomplete architecture description.
   **Fix:** Update column names. Add note about 3-DMO mapping.

6. **Lines 163–164:** Individual to Contact Point Email relationship is correct but does not explain the new explicit design.
   **Issue:** Enhancement opportunity — should explain that each source explicitly maps to Individual + CPE.
   **Fix:** Add clarity about the Profile-category data stream design.

7. **Lines 167–168:** Individual to Sales Order relationship does not mention the FK mechanism.
   **Issue:** Should note `SoldToCustomerId` populated from `ecom_customer_id`.
   **Fix:** Add FK mechanism description.

8. **Lines 172–173:** Individual to Eye Exam relationship does not mention it is a stretch goal or the FK change.
   **Issue:** Should note `patient_id` FK and stretch status.
   **Fix:** Add both.

9. **Lines 183–185:** Exam Overdue segment traversal not marked stretch.
   **Issue:** Requires clinic data (stretch).
   **Fix:** Add "(Stretch)" label.

10. **Lines 251–252:** Success criteria list Eye Exam as required.
    **Issue:** Stretch goal.
    **Fix:** Add "(Stretch)" qualifier.

---

### docs/part-2-data/working-with-data-360/ingesting-external-data.md

This file has the most pervasive stale references of any single file.

1. **Lines 29–33:** Lists 3 CSV files with old filenames and download links.
   **Issue:** All filenames wrong. Now 4 required + 2 stretch.
   **Fix:** Replace with new file list, correct download paths, correct DMO targets.

2. **Lines 78–80:** Primary keys section lists `loyalty_members.csv: membership_number`, `ecommerce_orders.csv: order_id`, `exam_history.csv: exam_id`.
   **Issue:** Old filenames and old PK name (`membership_number` → `loyalty_member_id`). Missing new files.
   **Fix:** List all 6 files with correct PKs.

3. **Lines 130–134:** Standard vs custom DMO table uses old filenames throughout.
   **Issue:** All filenames wrong. Missing ecom_customers → Individual+CPE. Missing 3-DMO pattern for loyalty.
   **Fix:** Rebuild table.

4. **Lines 140–143:** Loyalty DMO description uses old field names.
   **Issue:** `membership number` → `loyalty_member_id`, `enrollment date` → `join_date`.
   **Fix:** Update names. Add 3-DMO pattern note.

5. **Lines 177–189:** Loyalty Program Member field mapping table uses old column names throughout and includes `unsubscribed_date`.
   **Issue:** 5 columns renamed, 1 removed.
   **Fix:** Update all column names. Remove `unsubscribed_date`.

6. **Lines 193–202:** Sales Order field mapping table includes `customer_email` and `order_source`.
   **Issue:** Both removed.
   **Fix:** Replace with `ecom_customer_id` → `Sold To Customer`. Remove `order_source`.

7. **Lines 214–225:** Eye Exam field mapping table includes `patient_email` and references `exam_history.csv`.
   **Issue:** `patient_email` removed. Old filename.
   **Fix:** Replace with `patient_id` FK. Update filename to `clinic_exams.csv`. Mark as stretch.

8. **Line 229:** References `exam_history.csv` for custom DMO creation.
   **Issue:** Old filename.
   **Fix:** Change to `clinic_exams.csv`.

9. **Lines 290–299:** Assignment lists old filenames and wrong mapping architecture.
   **Issue:** All filenames wrong. Loyalty mapped to 1 DMO (should be 3). Eye Exam is required (should be stretch).
   **Fix:** Rewrite with 4 required steps + 1 stretch step.

10. **Lines 301–308:** Success criteria say "Three data streams" and map loyalty only to LPM.
    **Issue:** Now 4 required streams. Loyalty maps to 3 DMOs.
    **Fix:** Update count, targets, and move Eye Exam to stretch.

11. **Lines 318–320:** Knowledge check references "ecommerce data stream" mapping to "two different DMOs."
    **Issue:** Ecommerce is now 2 separate files, not one stream mapping to two DMOs.
    **Fix:** Reframe around the normalized split-file architecture.

---

### docs/part-2-data/identity-resolution/index.md

1. **Line 9:** References "ecommerce orders" as an email source.
   **Issue:** Email now comes from `ecom_customers.csv`, not orders.
   **Fix:** Change to "the ecommerce system" or "the ecommerce customer master."

2. **Lines 55–56:** Example shows 4 source profiles without noting the 4th (clinic) is stretch.
   **Issue:** Clinic data is optional.
   **Fix:** Note that the 4th source is optional.

3. **Line 108:** IDR source profiles list omits ecommerce customers.
   **Issue:** `ecom_customers.csv` now produces Individual + CPE records for IDR.
   **Fix:** Add ecommerce customer records to the list.

---

### docs/part-2-data/identity-resolution/configuring-idr.md

1. **Line 99:** References email "in ecommerce orders."
   **Issue:** Email comes from `ecom_customers.csv`, not orders.
   **Fix:** Change to "in the ecommerce customer master."

---

### docs/part-2-data/data-graphs/index.md

1. **Lines 174–188:** "What gets included" table lists Eye Exam without stretch label.
   **Issue:** Eye Exam is stretch.
   **Fix:** Add "(Stretch)" label.

---

### docs/part-2-data/data-graphs/configuring-leoptical-data-graph.md

1. **Lines 83–103:** Sales Order field selection includes `Customer Email`.
   **Issue:** `Customer Email` no longer exists on Sales Order DMO.
   **Fix:** Remove from field list.

2. **Lines 136–148:** "Add Eye Exam" section presented as required.
   **Issue:** Stretch goal. Only available if clinic data was ingested.
   **Fix:** Add info admonition noting stretch requirement. Add "(Stretch)" to heading.

3. **Lines 151–168:** Graph structure diagram shows Eye Exam without stretch label.
   **Issue:** Stretch goal.
   **Fix:** Add "(Stretch)" annotation.

4. **Lines 257–258:** Success criteria require Eye Exam in the graph.
   **Issue:** Stretch goal.
   **Fix:** Move Eye Exam to stretch criteria.

---

### docs/part-2-data/segmentation/building-leoptical-segments.md

1. **Lines 172–187:** Exam Overdue segment presented as required.
   **Issue:** Requires clinic data (stretch goal).
   **Fix:** Add info admonition noting stretch requirement.

---

### static/seed-data/SEED-INSTRUCTIONS.md

1. **Line 3:** Uses "Module 1" (banned numbered reference).
   **Issue:** Linter violation.
   **Fix:** Use module name or `<ModuleLink>`.

2. **Line 11:** Contact count "~60,000."
   **Issue:** Now ~48,672.
   **Fix:** Update count.

3. **Lines 40–56:** References deploying `LEOpticalSeedBatch.cls` and running via `Database.executeBatch`.
   **Issue:** Batch class was deleted. New method is Data Import Wizard for contacts.
   **Fix:** Rewrite seeding steps.

4. **Line 43:** Links to non-existent `LEOpticalSeedBatch.cls`.
   **Issue:** File deleted.
   **Fix:** Remove link.

5. **Lines 66, 83:** Contact counts "~60,000" and "60,010."
   **Issue:** Stale counts.
   **Fix:** Update.

6. **Line 97:** References Data Loader for cleanup.
   **Issue:** New approach uses `DeleteSeedData.apex`.
   **Fix:** Reference correct file.

7. **Line 108:** Uses "Module 4" (banned numbered reference).
   **Issue:** Linter violation.
   **Fix:** Use `<ModuleLink>`.

---

### src/components/SeedScript.tsx

1. **Lines 36–44:** Apex script inserts Contacts with `Loyalty_Tier__c`, `Loyalty_Points__c`, `Last_Exam_Date__c`, `Next_Exam_Due__c`.
   **Issue:** **Critical architectural mismatch.** These fields do NOT belong on the CRM Contact in the new data model. Loyalty data lives in the Loyalty Program Member DMO. Exam data lives in the Eye Exam DMO. Running this Apex will either fail (fields don't exist) or create orphaned CRM-level data.
   **Fix:** Remove all four fields from the Apex Contact constructor and from the `contacts` array.

2. **Line 68:** Comment references "batch class (Step 2)" and "~59,990 contacts."
   **Issue:** Batch class deleted. Count stale (~48,662 background contacts).
   **Fix:** Remove batch class reference. Update count.

3. **Line 216:** UI text says "~59,990 contacts."
   **Issue:** Stale count.
   **Fix:** Update to ~48,662.

---

## Deliverable 2: Files to Delete or Replace

### Files to Delete

| File | Reason |
|------|--------|
| `.planning/specs/data-model.md` | Entirely superseded by `2026-08-12-data-360-data-model-design.md`. Every section reflects the old 3-CSV model. |
| `static/seed-data/loyalty_members.csv` | Old filename and schema. Replaced by `loyalty.csv` (regenerated). |
| `static/seed-data/ecommerce_orders.csv` | Old denormalized file. Replaced by `ecom_customers.csv` + `ecom_orders.csv` + `ecom_order_items.csv`. |
| `static/seed-data/exam_history.csv` | Old file. Replaced by `clinic_patients.csv` + `clinic_exams.csv`. |

### Files Needing Full Rewrite

| File | Reason |
|------|--------|
| `.planning/specs/seed-data.md` | Entire file describes old 3-CSV structure. All CSV filenames, record counts, DMO targets, and dirty data descriptions are wrong. |
| `static/seed-data/SEED-INSTRUCTIONS.md` | References deleted batch class, wrong contact counts, wrong seeding method. |
| `scripts/generate-seed-data.py` | Must produce 6 new files instead of 3 old ones. Major structural changes (see Deliverable 3). |

### Simulation CSVs Needing Redesign

| File | Reason |
|------|--------|
| `static/seed-data/new_signups_july.csv` | Uses old `loyalty_members.csv` schema (wrong column names). |
| `static/seed-data/new_orders_july.csv` | Uses old denormalized `ecommerce_orders.csv` schema. Needs split into header + line item files. |

### Files Not Needing Changes

| File | Reason |
|------|--------|
| `static/seed-data/contacts.csv` | CRM contact file — schema is changing (removing 4 columns) but file is regenerated by script. |
| `static/seed-data/new_contacts_batch1.csv` | CRM contact schema, unaffected by data model changes. |
| `static/seed-data/seed-products-campaigns.apex` | Products and campaigns are unchanged. |
| `static/seed-data/DeleteSeedData.apex` | Cleanup script, unaffected. |

---

## Deliverable 3: Script Audit — scripts/generate-seed-data.py

### Current Outputs

| File | Columns | Records |
|------|---------|---------|
| `contacts.csv` | Account Name, FirstName, LastName, Email, Phone, MailingState, Loyalty Tier, Loyalty Points, Last Exam Date, Next Exam Due | ~48,672 |
| `loyalty_members.csv` | membership_number, first_name, last_name, email, phone, loyalty_tier, points_balance, enrollment_date, status, email_optin, unsubscribed_date | ~40,471 |
| `ecommerce_orders.csv` | order_id, customer_email, order_date, order_total, order_status, order_source, line_item_id, product_sku, quantity, unit_price, line_total | ~100K+ (denormalized) |
| `exam_history.csv` | exam_id, patient_email, patient_first_name, patient_last_name, exam_date, next_exam_due, exam_type, provider_name | ~33,829 |
| `new_signups_july.csv` | (same as loyalty_members.csv) | 50 |
| `new_orders_july.csv` | (same as ecommerce_orders.csv) | 100 |
| `new_contacts_batch1.csv` | FirstName, LastName, Email, Phone, MailingState | 20 |

### Functions and Their Status

| Function | Lines | Status | Notes |
|----------|-------|--------|-------|
| `slugify(name)` | 302–304 | Reusable | No changes needed |
| `make_email(first, last, counter)` | 307–311 | Reusable | No changes needed |
| `make_alt_email(first, last, counter, variant)` | 314–326 | Reusable | No changes needed |
| `make_typo_email(email, rng)` | 329–342 | Reusable | No changes needed |
| `tier_for_points(points)` | 345–352 | Reusable | No changes needed |
| `phone_for_index(i, rng)` | 355–371 | Reusable | No changes needed |
| `random_date_between(start, end, rng)` | 374–379 | Reusable | No changes needed |
| `class Person` | 384–404 | **Needs update** | Rename `ecommerce_email` → `ecom_email`, `exam_email` → `clinic_email`, `in_ecommerce` → `in_ecom`, `in_exams` → `in_clinic`. Add `ecom_customer_id`, `patient_id`, `loyalty_member_id` attributes. |
| `generate_master_registry(rng)` | 407–533 | **Needs update** | Rename attribute references. Remove `loyalty_tier`, `loyalty_points`, `last_exam_date`, `next_exam_due` from CRM Contact generation (they belong in DMOs, not CRM). |
| `assign_cross_file_membership(people, rng)` | 536–670 | **Needs update** | Rename all flag/email attributes. Add `ecom_customer_id` and `patient_id` assignment. Add 20% single-source-only enforcement. |
| `generate_contacts_csv(people)` | 673–698 | **Needs update** | Remove 4 columns (`Loyalty Tier`, `Loyalty Points`, `Last Exam Date`, `Next Exam Due`) — these do not belong on CRM Contact. |
| `generate_loyalty_csv(people, rng)` | 702–769 | **Needs update** | Rename file to `loyalty.csv`. Rename 5 columns. Remove `unsubscribed_date` and `status`. Remove contradictory consent logic that references `unsubscribed_date`. |
| `generate_ecommerce_csv(people, rng)` | 772–920 | **Must be replaced** | Split into 3 new functions. FK changes from email to generated ID. Remove `order_source`. Normalize data. |
| `generate_exam_csv(people, rng)` | 923–980 | **Must be replaced** | Rename to `generate_clinic_exams_csv`. FK changes from `patient_email` to `patient_id`. Remove name/next_due columns. Need new `generate_clinic_patients_csv`. |
| `generate_simulation_csvs(rng)` | 983–1052 | **Needs update** | `new_signups_july.csv` needs column renames. `new_orders_july.csv` needs full redesign (flagged, not redesigned). |
| `main()` | 1057–1097 | **Needs update** | Update function calls, attribute references, summary stats. |

### New Functions Needed

| Function | Output File | Schema |
|----------|-------------|--------|
| `generate_ecom_customers_csv(people)` | `ecom_customers.csv` | ecom_customer_id, email, first_name, last_name, created_date, email_optin |
| `generate_ecom_orders_csv(people, rng)` | `ecom_orders.csv` | order_id, ecom_customer_id, order_date, order_total, order_status |
| `generate_ecom_order_items_csv(orders, rng)` | `ecom_order_items.csv` | order_item_id, order_id, sku, quantity, unit_price, line_total |
| `generate_clinic_patients_csv(people)` | `clinic_patients.csv` | patient_id, email, first_name, last_name, email_optin |

### Constants to Update

```python
# Old
LOYALTY_COUNT = 40_471
ORDER_COUNT = 98_314
EXAM_COUNT = 33_829

# New
LOYALTY_COUNT = 40_000
ECOM_CUSTOMER_COUNT = 30_000
ECOM_ORDER_COUNT = 100_000
# ECOM_ORDER_ITEM_COUNT derived (~147K, avg ~1.47 items/order)
CLINIC_PATIENT_COUNT = 25_000  # stretch
CLINIC_EXAM_COUNT = 34_000     # stretch
```

### Critical Logic Changes

1. **Protagonist orders (lines 781–824):** Hardcoded using `customer_email` as FK. Must switch to looking up `ecom_customer_id` from the Person object.

2. **`contacts.csv` columns (lines 679–684):** Remove `Loyalty Tier`, `Loyalty Points`, `Last Exam Date`, `Next Exam Due` — these values belong in Data 360 DMOs, not on the CRM Contact.

3. **Loyalty consent logic (lines 749–752):** `unsubscribed_date` contradiction removed. Replace with cross-source `email_optin` contradiction (person has `email_optin=true` in loyalty but `false` in ecom_customers).

### Files to Stop Generating

| Old File | Replacement |
|----------|-------------|
| `loyalty_members.csv` | `loyalty.csv` |
| `ecommerce_orders.csv` | `ecom_customers.csv` + `ecom_orders.csv` + `ecom_order_items.csv` |
| `exam_history.csv` | `clinic_patients.csv` + `clinic_exams.csv` |

### Reusable Logic (no changes needed)

- Name generation (slugify, make_email, make_alt_email, make_typo_email)
- Phone format randomization
- Date randomization
- Tier/points distribution and stale-tier injection
- Orphaned SKU logic
- Order status distribution
- Nickname assignment
- Shared household email logic (just rename attributes)
- Case inconsistency logic (just rename attributes)

---

## Deliverable 4: Content Change Summary by Part

### Introduction (docs/introduction/)

| Module | Changes | Severity |
|--------|---------|----------|
| how-this-course-works.md | Line 72: update 3 old CSV filenames to new filenames | Cosmetic |

Other introduction modules (intro-to-data-360, mca-vs-mce, navigating-a-new-platform) are clean.

---

### Part 1: Foundations (docs/part-1-foundations/)

| Module | Changes | Severity |
|--------|---------|----------|
| consumption-entitlements.md | (1) Line 97: "exam history" → "clinic" terminology. (2) Line 108: add ecommerce customers to IDR source profile list. (3) Line 145: `exam_history.csv` → `clinic_exams.csv`. (4) Line 147: remove `unsubscribed_date` reference, replace with cross-source `email_optin` contradiction. | Breaking (lines 145, 147 describe fields/files that no longer exist) |

Other Part 1 modules (getting-started, domain-setup, business-units, consent-fundamentals, consent-configuration) are clean.

---

### Part 2: Data (docs/part-2-data/)

This is the most heavily affected part.

| Module | Changes | Severity |
|--------|---------|----------|
| **working-with-data-360/index.md** | Update "three external data sources" to four required + two stretch. Remove Eye Exam from required list. | Breaking |
| **working-with-data-360/the-leoptical-data-model.md** | (1) Rebuild entire ERD with new field names. (2) Rebuild DMO mapping table with new filenames and 3-DMO pattern. (3) Update all relationship descriptions with new FK mechanisms. (4) Mark Eye Exam as stretch throughout. (5) Update segment traversal table. (6) Update success criteria. | Breaking |
| **working-with-data-360/ingesting-external-data.md** | (1) Replace 3-file list with 4 required + 2 stretch files. (2) Rebuild primary keys section. (3) Rebuild standard vs custom DMO table. (4) Rebuild all 3 field mapping tables (loyalty, sales order, eye exam). (5) Remove `unsubscribed_date` from loyalty table. (6) Replace `customer_email`/`order_source` with `ecom_customer_id`/`Sold To Customer`. (7) Replace `patient_email` with `patient_id`. (8) Rewrite assignment from 4 steps to 5 (including stretch). (9) Rewrite success criteria (4 streams, 3-DMO loyalty). (10) Rewrite knowledge check about ecommerce architecture. | Breaking |
| **identity-resolution/index.md** | (1) "ecommerce orders" → "ecommerce customer master" for email source. (2) 4th source profile (clinic) marked stretch. (3) Add ecommerce customers to IDR source list. | Breaking |
| **identity-resolution/configuring-idr.md** | "ecommerce orders" → "ecommerce customer master" for email source. | Cosmetic |
| **data-graphs/index.md** | Mark Eye Exam as stretch in "What gets included" table. | Breaking |
| **data-graphs/configuring-leoptical-data-graph.md** | (1) Remove `Customer Email` from Sales Order field selection. (2) Mark Eye Exam section as stretch. (3) Update graph structure diagram. (4) Update success criteria. | Breaking |
| **segmentation/building-leoptical-segments.md** | Mark Exam Overdue segment as stretch goal. | Breaking |

exploring-your-org.md, the-refresh-chain.md, and segmentation/index.md are clean.

---

### Part 3: Content (docs/part-3-content/)

No stale data model references. All modules are either stubs or fully written on topics unrelated to the data model (CMS, email builder, content blocks).

---

### Part 4: Personalization (docs/part-4-personalization/)

No stale data model references found. Handlebars modules reference Data Graph fields generically (e.g., `{{FirstName}}`, `{{LoyaltyProgramMember.LoyaltyTier}}`). These may need updates when the Data Graph field names are finalized, but no old CSV column names or file references exist here.

**Potential enhancement:** Handlebars examples could use the new field paths once the Data Graph is rebuilt. Not breaking — current stubs don't have detailed field references.

---

### Part 5: Flows (docs/part-5-flows/)

| Module | Changes | Severity |
|--------|---------|----------|
| consent-flow-project.md | May reference consent migration from `email_optin` fields. Need to verify when this module is drafted whether it accounts for the new multi-source `email_optin` fields (loyalty, ecom_customers, clinic_patients). | Enhancement (stub only — no stale references yet, but writers need the new spec) |

Other Part 5 modules are stubs with no data model references.

---

### Part 6: Web (docs/part-6-web/)

No stale data model references. Web connector modules reference Data 360 integration at a high level without citing specific CSV files or column names.

---

### Part 7: AI (docs/part-7-ai/)

No stale data model references. All stubs.

---

### Part 8: Analytics (docs/part-8-analytics/)

No stale data model references. All stubs.

---

### Part 9: Capstone (docs/part-9-capstone/)

No stale data model references. Stub only.

---

## Planning/Infrastructure Files Summary

| File | Action | Severity |
|------|--------|----------|
| `.planning/specs/data-model.md` | Delete | N/A — superseded |
| `.planning/specs/seed-data.md` | Full rewrite | Breaking |
| `.planning/specs/2026-08-09-part2-restructure.md` | Targeted edits (5 locations) | Breaking |
| `.planning/specs/module-assignments.md` | Targeted edits (4 locations) | Breaking |
| `.planning/specs/leoptical-index.md` | Add deprecation notes (2 rows) | Cosmetic |
| `.planning/specs/2026-08-06-content-pipeline-design.md` | One-line fix (data model reference) | Breaking (affects agent behavior) |
| `.planning/plans/2026-08-06-content-pipeline.md` | One-line fix (data model reference) | Breaking (affects agent behavior) |
| `.planning/PROGRESS.md` | Update CSV checklist items (5 lines) | Cosmetic |
| `.planning/research/working-with-data-360.md` | Targeted edits (7 locations) | Breaking |
| `.planning/research/data-graphs.md` | Targeted edits (3 locations) | Breaking |
| `.planning/research/identity-resolution.md` | One edit (email source terminology) | Cosmetic |
| `.planning/research/identity-resolution-brief.md` | One edit (clinic stretch qualification) | Breaking |
| `.planning/research/segmentation.md` | One edit (Exam Overdue stretch) | Breaking |
| `scripts/generate-seed-data.py` | Major rewrite (see Deliverable 3) | Breaking |
| `src/components/SeedScript.tsx` | Remove 4 CRM fields, update counts | Breaking |
| `static/seed-data/SEED-INSTRUCTIONS.md` | Full rewrite | Breaking |

---

## Appendix: Comprehensive Search Terms Used

The following patterns were searched across all files:

- `loyalty_members.csv` / `loyalty_members`
- `ecommerce_orders.csv` / `ecommerce_orders`
- `exam_history.csv` / `exam_history`
- `customer_email`
- `patient_email`
- `membership_number`
- `points_balance`
- `loyalty_tier` (as a column name, not a concept)
- `enrollment_date`
- `unsubscribed_date`
- `order_source`
- `patient_first_name` / `patient_last_name`
- `next_exam_due`
- `data-model.md` (as a reference to the old spec)
- `seed-data.md` (as a reference to the old spec)
- `three data streams` / `3 CSV` / `three CSV`
- `Module \d+` (numbered module references)
- `LEOpticalSeedBatch`
- `60,000` / `59,990` (old contact counts)
