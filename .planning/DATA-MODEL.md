# LEOptical Data Model Reference

This is the canonical reference for LEOptical's Data 360 data model. Every module, script, and planning document must align with this file. The full design rationale lives in `.planning/specs/2026-08-12-data-360-data-model-design.md`.

## Data Sources

LEOptical has four data sources. Three are required; one (clinic) is a stretch goal.

| Source | System | What It Provides |
|--------|--------|-----------------|
| CRM | Salesforce | Contacts, Products, Campaigns. Auto-ingested via Marketing Data Kit. |
| Loyalty | VisionCare Rewards platform | Member profiles + loyalty tier/points. CSV import. |
| Ecommerce | Online store | Customer accounts + order history. CSV import. |
| Clinic | Optical clinic scheduling | Patient profiles + eye exam records. CSV import. **Stretch goal.** |

## CSV Files

### Required (4 files)

| File | DLO Category | Target DMOs | Records |
|------|-------------|-------------|---------|
| `loyalty.csv` | Profile | Individual, Contact Point Email, Loyalty Program Member | ~40K |
| `ecom_customers.csv` | Profile | Individual, Contact Point Email | ~30K |
| `ecom_orders.csv` | Engagement | Sales Order | ~100K |
| `ecom_order_items.csv` | Engagement | Sales Order Product | ~147K |

### Stretch Goal (2 files)

| File | DLO Category | Target DMOs | Records |
|------|-------------|-------------|---------|
| `clinic_patients.csv` | Profile | Individual, Contact Point Email | ~25K |
| `clinic_exams.csv` | Other | Eye Exam (custom DMO) | ~34K |

### CRM Seed Data (not Data 360 CSV streams)

| File | Purpose |
|------|---------|
| `contacts.csv` | ~49K CRM Contacts imported via Data Import Wizard |
| `seed-products-campaigns.apex` | 5 Products + 3 Campaigns via anonymous Apex |

### Simulation CSVs (later modules, design deferred)

| File | Records | Purpose |
|------|---------|---------|
| `new_signups_july.csv` | ~50 | New loyalty members for welcome flow testing |
| `new_orders_july.csv` | ~100 | Recent purchases for post-purchase flow testing |
| `new_contacts_batch1.csv` | ~20 | New CRM Contacts for consent flow testing |

## CSV Schemas

### loyalty.csv

```
loyalty_member_id, email, first_name, last_name, phone, tier, points, join_date, email_optin
```

- PK: `loyalty_member_id` (e.g., LM-00001)
- Maps to 3 DMOs from one Profile-category data stream

### ecom_customers.csv

```
ecom_customer_id, email, first_name, last_name, created_date, email_optin
```

- PK: `ecom_customer_id` (e.g., EC-10001)

### ecom_orders.csv

```
order_id, ecom_customer_id, order_date, order_total, order_status
```

- PK: `order_id` (e.g., ORD-100001)
- FK: `ecom_customer_id` references `ecom_customers.ecom_customer_id`

### ecom_order_items.csv

```
order_item_id, order_id, sku, quantity, unit_price, line_total
```

- PK: `order_item_id` (e.g., ORD-100001-LI1)
- FK: `order_id` references `ecom_orders.order_id`
- FK: `sku` references Product

### clinic_patients.csv (stretch)

```
patient_id, email, first_name, last_name, email_optin
```

- PK: `patient_id` (e.g., PT-20001)

### clinic_exams.csv (stretch)

```
exam_id, patient_id, exam_date, exam_type, provider
```

- PK: `exam_id` (e.g., EX-50001)
- FK: `patient_id` references `clinic_patients.patient_id`

### contacts.csv (CRM seed, not a Data 360 stream)

```
Account Name, FirstName, LastName, Email, Phone, MailingState
```

No loyalty, exam, or ecommerce fields on the CRM Contact. Those values live in their respective DMOs.

## DMO Field Mappings

### Loyalty Program Member (from loyalty.csv)

| CSV Column | DMO Field | Type | Notes |
|-----------|-----------|------|-------|
| `loyalty_member_id` | Membership Number | Standard | PK |
| `loyalty_member_id` | Party Id | Standard | FK to Individual |
| `first_name` + `last_name` | Name | Standard | Concatenated |
| `tier` | Loyalty Tier | Custom | Bronze / Silver / Gold / Platinum |
| `points` | Points Balance | Custom | |
| `join_date` | Enrollment Date | Standard | |
| `email` | Email Address | Custom | Reference field, not the IDR key |
| `phone` | Phone | Custom | |
| `email_optin` | Email Opt-In | Custom | Used for consent backfill |

### Sales Order (from ecom_orders.csv)

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `order_id` | Sales Order Id | PK |
| `ecom_customer_id` | Sold To Customer | FK to Individual |
| `order_date` | Order Date | |
| `order_total` | Total Amount | |
| `order_status` | Status | Completed / Cancelled / Returned |

### Sales Order Product (from ecom_order_items.csv)

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `order_item_id` | Sales Order Product Id | PK |
| `order_id` | Sales Order | FK to Sales Order |
| `sku` | Product | FK to Product DMO |
| `quantity` | Quantity | |
| `unit_price` | Unit Price | |
| `line_total` | Line Total | |

### Eye Exam — custom DMO (from clinic_exams.csv, stretch)

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `exam_id` | Eye Exam Id | PK |
| `patient_id` | Patient Id | FK to Individual |
| `exam_date` | Exam Date | |
| `exam_type` | Exam Type | Comprehensive / Follow-up / Contact Lens Fitting |
| `provider` | Provider | |

### Individual (from loyalty.csv, ecom_customers.csv, clinic_patients.csv)

Each Profile-category source maps its PK to Individual Id and its name fields to First Name / Last Name. The PK (`loyalty_member_id`, `ecom_customer_id`, or `patient_id`) becomes that source's Individual Id.

### Contact Point Email (from loyalty.csv, ecom_customers.csv, clinic_patients.csv)

Each Profile-category source maps `email` to Email Address and its PK to Party Id (linking the email to the Individual).

## Key Relationships

| From DMO | Field | To DMO | Relationship | Notes |
|----------|-------|--------|-------------|-------|
| Contact Point Email | Party Id | Individual | N:1 | Auto-activates |
| Contact Point Phone | Party Id | Individual | N:1 | Auto-activates |
| Loyalty Program Member | Party Id | Individual | N:1 | Auto-activates |
| Sales Order Product | Sales Order | Sales Order | N:1 | Auto-activates |
| Sales Order | Sold To Customer | Individual | N:1 | Requires explicit config. `ecom_customer_id` populates both sides. |
| Eye Exam | Patient Id | Individual | N:1 | Stretch. Requires explicit config. Custom relationship. |

## Data Graph

Rooted on Unified Individual.

```
Unified Individual (root)
  +-- Contact Point Email (1:many)
  |     +-- Comm Subscription Consent (1:many)
  +-- Contact Point Phone (1:many)
  +-- Loyalty Program Member (1:1)
  +-- Sales Order (1:many, via Sold To Customer)
  |     +-- Sales Order Product (1:many)
  |           +-- Product (N:1)
  +-- Eye Exam (1:many, stretch goal)
```

### Segment Traversal Paths

| Segment | Path |
|---------|------|
| VIP Customers | Unified Individual → Loyalty Program Member → tier = Gold/Platinum |
| Lapsed Buyers | Unified Individual → Sales Order → order_date (max) > 180 days ago |
| SeeClear Enthusiasts | Unified Individual → Sales Order → Sales Order Product → Product → family = "SeeClear" |
| Exam Overdue (stretch) | Unified Individual → Eye Exam → exam_date > 12 months ago |

## Dirty Data

| Issue | Where | Purpose |
|-------|-------|---------|
| Cross-source email variations (~15%) | Across loyalty, ecom, clinic, CRM | IDR matching exercises |
| Typo emails (~2%) | Any source | IDR edge cases |
| Shared household emails (~50 cases) | loyalty | IDR false positive scenario |
| Single-source-only people (~20% per file) | All files | IDR coverage gaps |
| Name variations (James vs Jim) | Across sources | Fuzzy name matching |
| Missing email (~5%) | loyalty.csv | Incomplete ingestion |
| Missing last name (~5%) | contacts.csv (CRM) | CRM data quality |
| Mixed phone formats | loyalty.csv | Data quality awareness |
| Stale tier (Gold but low points) | loyalty.csv | Data trust discussion |
| Orphaned SKUs | ecom_order_items.csv | Missing product references |
| Consent contradiction | email_optin across sources | Cross-source consent conflict |

## Terminology

| Use | Do NOT Use |
|-----|-----------|
| `loyalty.csv` | `loyalty_members.csv` |
| `ecom_customers.csv` | — (new file, no old equivalent) |
| `ecom_orders.csv` | `ecommerce_orders.csv` |
| `ecom_order_items.csv` | — (new file, no old equivalent) |
| `clinic_patients.csv` | — (new file, no old equivalent) |
| `clinic_exams.csv` | `exam_history.csv` |
| `loyalty_member_id` | `membership_number` |
| `tier` | `loyalty_tier` |
| `points` | `points_balance` |
| `join_date` | `enrollment_date` |
| `ecom_customer_id` | `customer_email` (as FK) |
| `patient_id` | `patient_email` (as FK) |
| Sold To Customer | Customer Email (on Sales Order) |
| Patient Id | Patient Email (on Eye Exam) |
| — | `unsubscribed_date` (removed) |
| — | `order_source` (removed) |
| clinic data (stretch goal) | exam data (as required) |
