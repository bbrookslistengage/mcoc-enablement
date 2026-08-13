# LEOptical Data 360 Data Model Design

Date: 2026-08-12

## Problem Statement

LEOptical has customer data in four siloed systems: Salesforce CRM, a loyalty platform (VisionCare Rewards), an ecommerce store, and optical clinic scheduling. None of these systems share a common customer ID. The course needs a Data 360 data model that:

1. Ingests data from all sources into the correct DMOs
2. Runs identity resolution to merge matching people into Unified Individuals
3. Builds a Data Graph that powers segmentation, Handlebars personalization, and flow triggers
4. Is realistic enough to mirror real-world challenges without going down rabbit holes

## Design Decisions

### Customer master files separate from transaction files

Each external system exports two types of data: customer profiles (who the person is) and transactions (what they did). These are separate CSV files because:

- Data 360 locks each data stream to a single DLO category. Profile DMOs (Individual, Contact Point Email) require a Profile-category DLO. Transactional DMOs (Sales Order, Eye Exam) use Engagement or Other categories. A single CSV cannot feed both.
- Profile records should originate from customer master data, not be derived from transaction rows. This mirrors how real ecommerce platforms and practice management systems structure their exports.

### Foreign keys are explicit generated IDs

All foreign keys are generated IDs written into both sides of each relationship by the seed data generator. No formula fields, derived keys, or email-based joins are required at ingestion time. Email is used only for IDR matching, which is its proper role.

### Emails are lowercased and consistent within each file

Cross-source email variations exist (the same person may use different emails in different systems), but within a single file, emails are consistent and lowercased. This ensures foreign key relationships resolve cleanly while still providing realistic IDR scenarios.

### Orders are split into headers and line items

`ecom_orders.csv` holds one row per checkout (order-level data). `ecom_order_items.csv` holds one row per product purchased. They are different grains. The line item file maps to Sales Order Product and carries the SKU join to Product, which enables product family segmentation and purchase history personalization.

### Clinic data is a stretch goal

Clinic patients and eye exams are optional. The core data model works without them. Learners who complete the stretch goal get extra practice (including custom DMO creation) and unlock the Exam Overdue segment. All other segments, personalization, and flows work with just CRM, loyalty, and ecommerce data.

### email_optin means consent was captured, not that absence means opt-out

The `email_optin` field on customer master files indicates whether the source system captured an explicit opt-in. `false` means no consent was captured — not that the person explicitly opted out. Only records with `email_optin=true` produce Communication Subscription Consent records during the one-time consent migration later in the course. Everyone else has no consent record and cannot receive marketing emails until they opt in through MCA-native mechanisms.

### Party Identification is conceptual only

Party Identification is a powerful IDR tool for matching on external system IDs (loyalty member number, ecommerce customer ID, etc.). The course teaches it conceptually in the IDR module as a best practice for real engagements. Learners do not configure it — email-based IDR matching is sufficient for the course exercises.

## Data Sources and Ingestion

### CRM (auto-ingested via Marketing Data Kit)

| CRM Object | Target DMO | Notes |
|-----------|-----------|-------|
| Contact (~49K) | Individual | Contact ID becomes Individual ID |
| Contact.Email | Contact Point Email | Linked to Individual via PartyId |
| Contact.Phone | Contact Point Phone | Linked to Individual via PartyId |
| Account (1) | Account | Single shared "LEOptical Customers" account |
| Product (5) | Product | Created via anonymous Apex |
| Campaign (3) | Campaign | Created via anonymous Apex |

### CSV Data Streams — Required (4 files)

| File | DLO Category | Target DMOs | Approx Records |
|------|-------------|-------------|----------------|
| `loyalty.csv` | Profile | Individual, Contact Point Email, Loyalty Program Member | ~40K |
| `ecom_customers.csv` | Profile | Individual, Contact Point Email | ~30K |
| `ecom_orders.csv` | Engagement | Sales Order | ~100K |
| `ecom_order_items.csv` | Engagement | Sales Order Product | ~147K |

### CSV Data Streams — Stretch Goal (2 files)

| File | DLO Category | Target DMOs | Approx Records |
|------|-------------|-------------|----------------|
| `clinic_patients.csv` | Profile | Individual, Contact Point Email | ~25K |
| `clinic_exams.csv` | Other | Eye Exam (custom DMO) | ~34K |

### IDR Sources

Three required systems contribute Individual records (CRM, loyalty, ecommerce). Optionally four with clinic. A single person like Maria Chen may have up to four Individual records — one per source system. IDR merges them into one Unified Individual based on email and name matching.

## CSV Schemas

### loyalty.csv

```
loyalty_member_id, email, first_name, last_name, phone, tier, points, join_date, email_optin
```

| Column | Type | Notes |
|--------|------|-------|
| `loyalty_member_id` | Text | Primary key (e.g., LM-00001) |
| `email` | Email | Often differs from CRM email — key IDR scenario |
| `first_name` | Text | |
| `last_name` | Text | ~5% missing (dirty data) |
| `phone` | Phone | Mixed formats (dirty data) |
| `tier` | Text | Bronze / Silver / Gold / Platinum |
| `points` | Number | Some rows have tier/points mismatch (dirty data) |
| `join_date` | Date | |
| `email_optin` | Boolean | true = consent captured at enrollment |

### ecom_customers.csv

```
ecom_customer_id, email, first_name, last_name, created_date, email_optin
```

| Column | Type | Notes |
|--------|------|-------|
| `ecom_customer_id` | Text | Primary key (e.g., EC-10001) |
| `email` | Email | May differ from CRM/loyalty email |
| `first_name` | Text | |
| `last_name` | Text | |
| `created_date` | Date | Account creation date |
| `email_optin` | Boolean | true = checked "send me promotions" at signup |

### ecom_orders.csv

```
order_id, ecom_customer_id, order_date, order_total, order_status
```

| Column | Type | Notes |
|--------|------|-------|
| `order_id` | Text | Primary key (e.g., ORD-100001) |
| `ecom_customer_id` | Text | FK to ecom_customers.ecom_customer_id |
| `order_date` | DateTime | |
| `order_total` | Number | |
| `order_status` | Text | Completed / Cancelled / Returned |

### ecom_order_items.csv

```
order_item_id, order_id, sku, quantity, unit_price, line_total
```

| Column | Type | Notes |
|--------|------|-------|
| `order_item_id` | Text | Primary key (e.g., ORD-100001-LI1) |
| `order_id` | Text | FK to ecom_orders.order_id |
| `sku` | Text | FK to Product (e.g., SEC-DLF-001). Some reference non-existent SKUs (dirty data) |
| `quantity` | Number | |
| `unit_price` | Number | |
| `line_total` | Number | |

### clinic_patients.csv (stretch goal)

```
patient_id, email, first_name, last_name, email_optin
```

| Column | Type | Notes |
|--------|------|-------|
| `patient_id` | Text | Primary key (e.g., PT-20001) |
| `email` | Email | May differ from CRM/loyalty/ecom email |
| `first_name` | Text | |
| `last_name` | Text | |
| `email_optin` | Boolean | true = opted in during patient intake |

### clinic_exams.csv (stretch goal)

```
exam_id, patient_id, exam_date, exam_type, provider
```

| Column | Type | Notes |
|--------|------|-------|
| `exam_id` | Text | Primary key (e.g., EX-50001) |
| `patient_id` | Text | FK to clinic_patients.patient_id |
| `exam_date` | Date | |
| `exam_type` | Text | Comprehensive / Follow-up / Contact Lens Fitting |
| `provider` | Text | Examining doctor name |

## Field Mappings (DLO → DMO)

### loyalty.csv → Individual

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `loyalty_member_id` | Individual Id | Primary key for this source's Individuals |
| `first_name` | First Name | |
| `last_name` | Last Name | |

### loyalty.csv → Contact Point Email

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `email` | Email Address | |
| `loyalty_member_id` | Party Id | Links this email to the Individual |

### loyalty.csv → Loyalty Program Member

| CSV Column | DMO Field | Type | Notes |
|-----------|-----------|------|-------|
| `loyalty_member_id` | Membership Number | Standard | Primary key |
| `loyalty_member_id` | Party Id | Standard | FK to Individual |
| `first_name` + `last_name` | Name | Standard | Concatenated |
| `tier` | Loyalty Tier | Custom | Bronze / Silver / Gold / Platinum |
| `points` | Points Balance | Custom | |
| `join_date` | Enrollment Date | Standard | |
| `email` | Email Address | Custom | Reference field, not the IDR key |
| `phone` | Phone | Custom | |
| `email_optin` | Email Opt-In | Custom | Used later for consent backfill |

### ecom_customers.csv → Individual

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `ecom_customer_id` | Individual Id | Primary key for this source's Individuals |
| `first_name` | First Name | |
| `last_name` | Last Name | |

### ecom_customers.csv → Contact Point Email

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `email` | Email Address | |
| `ecom_customer_id` | Party Id | Links this email to the Individual |

### ecom_orders.csv → Sales Order

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `order_id` | Sales Order Id | Primary key |
| `ecom_customer_id` | Sold To Customer | FK to Individual (matches Individual Id from ecom_customers) |
| `order_date` | Order Date | |
| `order_total` | Total Amount | |
| `order_status` | Status | |

### ecom_order_items.csv → Sales Order Product

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `order_item_id` | Sales Order Product Id | Primary key |
| `order_id` | Sales Order | FK to Sales Order |
| `sku` | Product | FK to Product DMO. <!-- VERIFY --> whether SKU can be the join key or if Product ID is required |
| `quantity` | Quantity | |
| `unit_price` | Unit Price | |
| `line_total` | Line Total | |

### clinic_patients.csv → Individual (stretch goal)

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `patient_id` | Individual Id | Primary key for this source's Individuals |
| `first_name` | First Name | |
| `last_name` | Last Name | |

### clinic_patients.csv → Contact Point Email (stretch goal)

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `email` | Email Address | |
| `patient_id` | Party Id | Links this email to the Individual |

### clinic_exams.csv → Eye Exam (custom DMO, stretch goal)

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `exam_id` | Eye Exam Id | Primary key |
| `patient_id` | Patient Id | FK to Individual (matches Individual Id from clinic_patients) |
| `exam_date` | Exam Date | |
| `exam_type` | Exam Type | |
| `provider` | Provider | |

## DMO Relationships

### Standard relationships (activate automatically when both DMOs have mapped data)

| From DMO | Field | Cardinality | To DMO | Related Field |
|----------|-------|-------------|--------|---------------|
| Contact Point Email | Party Id | N:1 | Individual | Individual Id |
| Contact Point Phone | Party Id | N:1 | Individual | Individual Id |
| Loyalty Program Member | Party Id | N:1 | Individual | Individual Id |
| Sales Order Product | Sales Order | N:1 | Sales Order | Sales Order Id |

### Relationships requiring explicit configuration

| From DMO | Field | Cardinality | To DMO | Related Field | Notes |
|----------|-------|-------------|--------|---------------|-------|
| Sales Order | Sold To Customer | N:1 | Individual | Individual Id | `ecom_customer_id` populates both sides |
| Sales Order Product | Product | N:1 | Product | Product Id or SKU | <!-- VERIFY --> join key in SDO |
| Eye Exam | Patient Id | N:1 | Individual | Individual Id | Stretch goal. Custom relationship. |

## Data Graph Structure

Rooted on Unified Individual. Powers Handlebars personalization, segmentation, and activation.

```
Unified Individual (root)
  +-- Contact Point Email (1:many)
  |     +-- Comm Subscription Consent (1:many, via email match)
  +-- Contact Point Phone (1:many)
  +-- Loyalty Program Member (1:1)
  +-- Sales Order (1:many, via Sold To Customer)
  |     +-- Sales Order Product (1:many)
  |           +-- Product (N:1)
  +-- Eye Exam (1:many, stretch goal)
```

### Supported use cases

| Use Case | Traversal Path |
|----------|---------------|
| VIP Customers segment | Unified Individual → Loyalty Program Member → tier = Gold/Platinum |
| Lapsed Buyers segment | Unified Individual → Sales Order → order_date (max) > 180 days ago |
| SeeClear Enthusiasts segment | Unified Individual → Sales Order → Sales Order Product → Product → family = "SeeClear" |
| Exam Overdue segment (stretch) | Unified Individual → Eye Exam → exam_date > 12 months ago |
| Handlebars: first name | Unified Individual → First Name |
| Handlebars: loyalty tier | Unified Individual → Loyalty Program Member → tier |
| Handlebars: purchase repeater | Unified Individual → Sales Order → Sales Order Product → Product (last 3) |
| Activation: email selection | Unified Individual → Contact Point Email → Email Address |
| Post-purchase flow trigger | Sales Order (new order event) |
| Consent check | Contact Point Email → Comm Subscription Consent |

## Data Refresh Dependency Chain

```
1. Data Streams refresh (CSV + CRM data ingested into DMOs)
       |
2. Identity Resolution runs (Individual + Contact Point Email records
   matched and merged into Unified Individuals)
       |
3. Data Graph refreshes (relationships resolved across DMOs)
       |
4. Dynamic content resolves (Handlebars expressions find data in the graph)
```

## Dirty Data Strategy

### Cross-source email variations (surfaces in IDR module)

- Same person, different email across sources (~15% of cross-file people)
- Same person, typo email in one source (~2%)
- Different people sharing a household email (~50 cases)
- Person exists in only one source (~20% per file)
- Name variations across sources (James vs Jim, abbreviations)

### Data quality issues (surfaces in data ingestion and data graph modules)

- ~5% of loyalty records missing email
- ~5% of CRM contacts missing last name
- Mixed phone formats in loyalty data
- Stale tier data in loyalty (tier says Gold but points are below threshold)
- Some SKUs in ecom_order_items reference products that don't exist (orphaned orders)
- Inconsistent date formats across sources

### Consent contradictions (surfaces when building consent migration)

- Some people have `email_optin=true` in loyalty but `email_optin=false` in ecom_customers
- Teaching moment: source-system consent signals may conflict. MCA-native consent is authoritative once established.

### What is NOT dirty

- Foreign keys within a source are always valid (`ecom_customer_id` in orders always exists in ecom_customers)
- Emails are lowercased and consistent within each file
- IDs are unique within their source

## Module Impact

### Ingesting External Data module (Part 2)

**Guided walkthrough 1:** loyalty.csv — maps to 3 DMOs (Individual, Contact Point Email, Loyalty Program Member with custom fields). Full step-by-step with screenshots.

**Guided walkthrough 2:** ecom_customers.csv + ecom_orders.csv + ecom_order_items.csv — shows customer master → Individual + CPE pattern, then transaction files referencing those IDs. Three data streams that work together.

**Assignment:** clinic_patients.csv + clinic_exams.csv (stretch goal). Learner creates the custom Eye Exam DMO and maps both files.

**Inline callout:** When selecting a target DMO, mention that learners can create a custom DMO directly from the mapping screen. Data 360 auto-generates a DMO with fields matching the data stream.

### Identity Resolution module (Part 2)

- IDR operates on Individual + Contact Point Email records from CRM, loyalty, and ecom sources
- Match rules use email (exact/normalized) and name (fuzzy) matching
- Party Identification taught conceptually as a best practice for real engagements
- Learners see up to 3 Individual records per person merge into one Unified Individual (4 with clinic stretch goal)

### Data Graphs module (Part 2)

- Data Graph rooted on Unified Individual
- Traversal paths defined for all relationships in this spec
- Teaching moment: if a field is absent from the Data Graph JSON, it's missing (not null). Use `{{fallback}}` or `{{#if}}` in Handlebars.

### Segmentation module (Part 2)

- VIP, Lapsed Buyers, SeeClear Enthusiasts segments use required data only
- Exam Overdue segment requires clinic stretch goal data

### Consent modules (Part 5)

- One-time consent migration uses `email_optin=true` records from loyalty, ecom_customers, and clinic_patients (stretch) to create Communication Subscription Consent records
- Ongoing consent automation via flow handles new opt-ins going forward
- Updated customer master CSVs can be re-uploaded to change opt-in values

## Simulation CSVs (later modules)

| File | Records | Purpose |
|------|---------|---------|
| `new_signups_july.csv` | ~50 | New loyalty members to test welcome flows |
| `new_orders_july.csv` | ~100 | Recent purchases to trigger post-purchase flows |
| `new_contacts_batch1.csv` | ~20 | New Contacts for consent flow testing |

These may need to be revised to match the new CSV schemas (e.g., new ecom customers + new orders as separate files). Exact design deferred.

## Verify Items

These must be tested in a live SDO before finalizing the module content:

- [ ] Can Sales Order Product reference Product DMO using SKU as the join key, or is Product ID required?
- [ ] Does the Data Graph traverse from Unified Individual → Individual → Sales Order when `SoldToCustomerId` is populated with the `ecom_customer_id` used as that source's Individual ID?
- [ ] Can a single Profile-category DLO map to three DMOs simultaneously (Individual + Contact Point Email + Loyalty Program Member)?
- [ ] When re-uploading a customer master CSV with changed `email_optin` values, does the data stream upsert correctly?
