---
sidebar_position: 3
title: "Ingesting External Data"
description: "Create CSV data streams for LEOptical's loyalty, ecommerce, and eye exam data. Map fields to standard and custom DMOs."
---

## Overview

Up to this point, all the data in your SDO came from CRM via the Marketing Data Kit. That is only one of LEOptical's data sources. The client also has a loyalty platform (VisionCare Rewards), an ecommerce store, and eye exam records from their optical clinics. All three export as CSV files, and all three need to land in Data 360.

This is the first time you create your own data streams from scratch. The CRM data streams were auto-installed. These are not. You will upload CSV files, choose target DMOs, map fields, and deal with records that fail to ingest. The seed data has intentional dirty data in it, so expect some records to fail. That is by design.

You will also create your first custom DMO. Most of LEOptical's data fits into standard DMOs (Loyalty Program Member, Sales Order, Sales Order Product). Eye exam records do not have a standard equivalent, so you build one. The [Introduction to Data 360](/introduction/intro-to-data-360) module introduced the distinction between standard and custom DMOs. This page goes deeper on the tradeoffs and has you actually make the choice.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- How to create a CSV data stream using the File Upload connector
- File size and column limits for CSV uploads
- The difference between standard and custom DMOs in practice
- How to map DLO fields to DMO fields (including mismatched names and types)
- How to create a custom DMO from the field mapping screen
- How to troubleshoot records that fail to ingest

## CSV data streams

LEOptical has external data sources that arrive as CSV files. Four are required. Two are stretch goals.

**Required (4 files):**

- [`loyalty.csv`](/seed-data/loyalty.csv) from the VisionCare Rewards loyalty platform (~40K members). Maps to Individual, Contact Point Email, and Loyalty Program Member.
- [`ecom_customers.csv`](/seed-data/ecom_customers.csv) from the online store (~30K customers). Maps to Individual and Contact Point Email.
- [`ecom_orders.csv`](/seed-data/ecom_orders.csv) from the online store (~100K orders). Maps to Sales Order.
- [`ecom_order_items.csv`](/seed-data/ecom_order_items.csv) from the online store (~147K line items). Maps to Sales Order Product.

**Stretch goal (2 files):**

- [`clinic_patients.csv`](/seed-data/clinic_patients.csv) from the optical clinic scheduling tool (~25K patients). Maps to Individual and Contact Point Email.
- [`clinic_exams.csv`](/seed-data/clinic_exams.csv) from the optical clinic scheduling tool (~34K exams). Maps to Eye Exam (custom DMO).

Each file needs its own data stream. The process is the same for all of them, so the walkthrough below covers one file. You will repeat it for the others in the assignment.

### Creating a CSV data stream

1. Navigate to **Data Streams**.
2. Click **New**.
3. Select the **File Upload** tile under "Other Sources."

<Screenshot src="/img/ingesting-external-data/03-new-data-stream-connectors.png" alt="New Data Stream connector selection screen showing Connected Sources (Ingestion API, Salesforce CRM, Website) and Other Sources (File Upload, Installed Data Kits and Packages)" caption="File Upload is under Other Sources, not Connected Sources. Connected Sources require a pre-configured connection." />

4. Click **Upload Files** (or drag your CSV onto the upload area). Wait for the upload notification, then click **Next**.
5. Review the data preview. Verify that columns and values parsed correctly. On the left panel, select the DLO **category**: Profile, Engagement, or Other. This choice matters and cannot be changed after you deploy the data stream.

<Screenshot src="/img/ingesting-external-data/03-csv-data-preview.png" alt="New Data Stream step 2 showing the left panel with Category radio buttons (Profile selected, Engagement, Other) and Primary Key dropdown, alongside the right panel showing parsed CSV sample data with columns FirstName, LastName, Email, BirthDate and 3 sample rows" caption="Category selection and data preview are on the same screen. Choose your category before reviewing the fields." />

6. Designate a **primary key** column. This is the field that uniquely identifies each record in the file.
7. Name the DLO (or accept the auto-generated name).
8. Review the auto-detected data types on the **Supported Fields** tab. Modify column labels or API names if needed.
9. Click **Deploy**.

After deployment, the data stream ingests the CSV. For smaller files, this completes within seconds.

### DLO categories

Step 5 asks you to select a category. This choice has permanent downstream consequences, so it is worth understanding each option.

**Profile**: Contains demographic and descriptive information about individuals or accounts. Think of it as "who someone is." Profile data is treated as upsert data, meaning new records update existing ones based on the primary key. Requires a unique identifier. This is the default selection.

**Engagement**: Records behavioral interactions and activities over time. Think of it as "what someone did." Engagement data is treated as append data, meaning each record represents a distinct event. Requires a DateTime field representing the event timestamp (the "Event Date"), which cannot be changed after setup.

**Other**: Catches edge cases and mixed data types. Use this for data that does not fit cleanly into Profile or Engagement, or for mutable engagement data where DateTime values change over time.

**Why it matters**: The category determines which DMOs a DLO can map to. A DMO inherits its category from the first DLO mapped to it, and that category is permanent. After that, only DLOs with the same category can map to that DMO. Category also affects how Data 360 treats the data (upsert vs append behavior). Choose carefully. If you pick the wrong category, you must delete the data stream and recreate it.

For more detail on how categories affect ingestion behavior, see [Salesforce Ben: Data Stream Categories](https://www.salesforceben.com/what-are-the-data-stream-categories-in-data-cloud/).

### Primary keys

The primary key is the field that uniquely identifies each record in your data source. Data 360 uses it for deduplication and upsert behavior. When you re-upload a CSV or refresh a data stream, records with the same primary key value are updated rather than duplicated.

Choosing the right primary key is a discovery question on real engagements. You need to understand what makes each record unique in the source system. A wrong primary key causes duplicate records or unintended overwrites.

For LEOptical's CSV files:

- `loyalty.csv`: `loyalty_member_id` (each loyalty membership is unique)
- `ecom_customers.csv`: `ecom_customer_id` (each customer account is unique)
- `ecom_orders.csv`: `order_id` (each order is unique)
- `ecom_order_items.csv`: `order_item_id` (each line item is unique)
- `clinic_patients.csv` (stretch): `patient_id` (each patient record is unique)
- `clinic_exams.csv` (stretch): `exam_id` (each exam record is unique)

### File limits

| Constraint | Limit |
|-----------|-------|
| Maximum file size | 2 GB |
| Maximum columns | 100 |
| Header row | Required |

### Refreshing CSV data streams

CSV data streams support two refresh modes:

- **Full Refresh** (re-upload): replaces all existing records with the new file contents. Available since June 2025.
- **Upsert**: updates existing records and adds new ones based on the primary key. The CSV header row must match the fields defined in the data stream. Available since November 2025.

You trigger both modes manually by re-uploading a file. CSV data streams do not refresh on an automatic schedule the way CRM data streams do.

## Standard vs custom DMOs

The [Introduction to Data 360](/introduction/intro-to-data-360) module introduced the concept: standard DMOs exist for common entities, custom DMOs exist for business-specific data. Here is what that means in practice.

### What standard DMOs give you

Standard DMOs come with several built-in advantages:

- **Pre-defined fields and schema.** Canonical field names and types are already set. You map your source fields to them.
- **Automatic relationships.** Standard relationships between standard DMOs activate automatically once there is at least one field mapping between the related DMOs. You do not need to define these yourself.
- **Non-editable API names and primary keys.** These are fixed, which prevents accidental changes that could break downstream segments or activations.
- **Built-in segment awareness.** Standard DMOs in the Profile category (like Individual) are pre-configured for segmentation. Segments can only be created on Profile-type DMOs.
- **Regular updates.** Salesforce updates standard DMOs to expand their capabilities over time.

There are 89+ standard DMOs across subject areas: Party, Engagement, Commerce, Marketing, Loyalty, Privacy, Product, Sales Order, Case, and more.

### What custom DMOs require

Custom DMOs give you full control over fields and structure, but they need more manual work:

- You must define relationships to other DMOs explicitly (standard DMOs get this automatically when mapped).
- You must set the category correctly for segmentation to work.
- Editing field structure after creation can break dependent segments, identity resolution rules, and activations.

### The tradeoff

The official Salesforce recommendation is to use standard DMOs before creating custom ones. Standard DMOs integrate with platform features automatically. Custom DMOs are appropriate when no standard equivalent exists.

For LEOptical, the mapping looks like this:

| Data Source | Target DMO(s) | Type | Notes |
|------------|--------------|------|-------|
| `loyalty.csv` | Individual + Contact Point Email + Loyalty Program Member | Standard + custom fields | One Profile-category data stream maps to 3 DMOs. Add custom fields for tier, points, etc. |
| `ecom_customers.csv` | Individual + Contact Point Email | Standard | Profile-category. Each customer account resolves to an Individual and a Contact Point Email. |
| `ecom_orders.csv` | Sales Order | Standard | Standard DMO exists for order headers. |
| `ecom_order_items.csv` | Sales Order Product | Standard | Standard DMO exists for order line items. |
| `clinic_patients.csv` (Stretch) | Individual + Contact Point Email | Standard | Profile-category. Same pattern as ecom_customers. |
| `clinic_exams.csv` (Stretch) | Eye Exam | Custom | No standard DMO exists for eye exam records. This is industry-specific. |

Here is why each DMO was chosen:

- **Individual**: Represents a person. Maps from CRM Contact records. This is the core profile DMO that identity resolution uses to create Unified Individuals.
- **Contact Point Email**: Represents an email address associated with a person. A single Individual can have multiple Contact Point Email records (work email, personal email, loyalty email). This separation is critical for identity resolution.
- **Loyalty Program Member**: Represents a membership in a loyalty program. The standard DMO covers common loyalty fields (`loyalty_member_id`, `join_date`, status). LEOptical adds custom fields for tier and points balance. `loyalty.csv` maps to three DMOs from a single Profile-category data stream: Individual, Contact Point Email, and Loyalty Program Member.
- **Sales Order / Sales Order Product**: Represent an order header and its line items. Sales Order holds the order-level data (date, total, status). Sales Order Product holds per-item data (SKU, quantity, price). This split is a standard commerce data pattern.
- **Eye Exam (custom)**: No standard DMO exists for clinical exam records. This is industry-specific data that requires a custom DMO.

Most B2C concepts fit the standard data model. Industry-specific concepts (insurance policies, patient records, eye exams) typically need custom DMOs.

:::tip[Coming from MCE?]
In MCE, you define data extension fields directly. You set the name, data type, and length yourself. In Data 360, DMO fields have defined data types, and the platform [enforces type compatibility at mapping time](https://help.salesforce.com/s/articleView?id=data.c360_a_data_type_field_mappings.htm&type=5). You cannot map a Text DLO field to a Number DMO field, for example. Some types are cross-compatible (Email, Phone, Text, and URL can map to each other), but mismatches like Text-to-Number are blocked before you can save the mapping.

Custom DMOs are the closest thing to "creating a new data extension," but they live within a shared data model with defined relationships rather than as standalone tables.
:::

## Field mapping

After deploying a data stream, you map its DLO fields to DMO fields. This is where the source data gets structured into the data model.

### How mapping works

1. From the data stream detail page, open the **Data Mapping** sidebar and click **Review**.
2. The mapping canvas shows the source DLO on one side and the target DMO on the other.
3. Search for the target DMO you want to map to.
4. Map individual source fields to target DMO fields.
5. Focus on identifiers (emails, IDs, names) first. These are critical for identity resolution.

<Screenshot src="/img/ingesting-external-data/03-field-mapping-canvas.png" alt="Contact_Home data stream Fields tab with the Data Mapping sidebar showing 46 of 155 fields mapped and a READY status badge" caption="The Data Mapping sidebar on any data stream detail page shows your mapping progress and readiness status." />

### Key mapping facts

- **One DLO can map to multiple DMOs.** The ecommerce DLO maps to both Sales Order and Sales Order Product.
- **Multiple DLOs can map to the same DMO.** Email fields from CRM, loyalty, and ecommerce can all map to Contact Point Email.
- **Field names do not need to match.** The mapping UI lets you map a source field called `order_total` to a DMO field called `TotalAmount`. You are defining the correspondence, not relying on name matching.
- **Data type mismatches cause per-record failures.** If a source field contains text and the DMO field expects a number, records with non-numeric values fail individually. The batch does not fail entirely.

### LEOptical field mappings

These are the complete field mappings for each data source. Map every field listed here. Skipping identity fields (email, IDs) or type fields will cause downstream problems in identity resolution and segmentation.

**Loyalty Program Member** (standard DMO + custom fields):

| CSV Column | DMO Field | Type | Standard/Custom | Notes |
|-----------|-----------|------|-----------------|-------|
| `loyalty_member_id` | Membership Number | Text | Standard | PK (e.g., LM-00001) |
| `loyalty_member_id` | Party Id | Text | Standard | FK to Individual |
| `first_name` + `last_name` | Name | Text | Standard | Concatenated |
| `tier` | Loyalty Tier | Text | Custom | Bronze / Silver / Gold / Platinum |
| `points` | Points Balance | Number | Custom | Current points |
| `join_date` | Enrollment Date | DateTime | Standard | |
| `email` | Email Address | Email | Custom | Often differs from CRM email. Key for identity resolution. |
| `phone` | Phone | Phone | Custom | |
| `email_optin` | Email Opt-In | Boolean | Custom | |

**Sales Order** (standard DMO, from `ecom_orders.csv`):

| CSV Column | DMO Field | Type | Notes |
|-----------|-----------|------|-------|
| `order_id` | Sales Order Id | Text | Primary key (e.g., ORD-100001) |
| `ecom_customer_id` | Sold To Customer | Text | FK to Individual |
| `order_date` | Order Date | DateTime | |
| `order_total` | Total Amount | Number | |
| `order_status` | Status | Text | Completed / Cancelled / Returned |

**Sales Order Product** (standard DMO):

| CSV Column | DMO Field | Type | Notes |
|-----------|-----------|------|-------|
| `line_item_id` | Sales Order Product Id | Text | Primary key |
| `order_id` | Sales Order | Text | Foreign key to Sales Order |
| `product_sku` | Product | Text | Foreign key to Product |
| `quantity` | Quantity | Number | |
| `unit_price` | Unit Price | Number | |
| `line_total` | Line Total | Number | |

**Eye Exam** (custom DMO, Stretch: create this before mapping the `clinic_exams.csv` data stream):

| CSV Column | DMO Field | Type | Required | Notes |
|-----------|-----------|------|----------|-------|
| `exam_id` | Eye Exam Id | Text | Yes | Primary key (e.g., EX-50001) |
| `patient_id` | Patient Id | Text | Yes | FK to Individual |
| `exam_date` | Exam Date | Date | Yes | |
| `exam_type` | Exam Type | Text | No | Full / Follow-up / Contact Lens Fitting |
| `provider` | Provider | Text | No | Examining doctor name |

## Creating a custom DMO

Eye exam records have no standard DMO equivalent. You need to create one before you can map the `clinic_exams.csv` data stream.

You can create a custom DMO directly from the field mapping screen. You do not need to navigate to Data Model first. When you reach the step where you select a target DMO for the `clinic_exams` data stream, look for the option to create a new DMO inline. The screenshots in the assignment walkthrough will show this flow.

When creating the Eye Exam DMO, use these values:

- **Object Label:** Eye Exam
- **Object API Name:** Eye_Exam (auto-generated from the label)
- **Object Category:** Other. Eye exams are not Profile data about a person, and they are not time-series Engagement events. They are mutable clinical records.
- **Description:** Eye exam records from LEOptical optical clinics

Add each field from the Eye Exam mapping table above. Set data types to match the Type column (Text, Email, Date). Assign `Eye Exam Id` as the primary key.

:::warning
DMO relationships use only two cardinality options: N:1 (many-to-one) and 1:1 (one-to-one). To express "one Individual has many Eye Exams," you create the relationship from the Eye Exam DMO (the "many" side) as an N:1 relationship pointing to Individual. The DMO you are editing is always the left side of the relationship.

Cardinality cannot be changed after you create the relationship. If you set it wrong, you must delete the relationship and recreate it. Plan your relationships before creating them. The next lesson covers the full LEOptical data model and relationship design.
:::

## Troubleshooting ingestion

Some records will fail to ingest. This is normal behavior on real engagements where source data does not perfectly match the target schema.

### Common failure causes

- **Data type mismatches.** Text in a number field, or a date format the platform cannot parse.
- **Missing required fields.** Records missing a value for a required DMO field are rejected.
- **Orphaned foreign keys.** Records referencing a related record that does not exist in the target DMO cannot resolve their foreign key relationship.

### How Data 360 handles failures

Data 360 separates problem records from successful ones. The batch does not fail entirely. Successful records continue processing while problematic records are isolated.

### Investigating failures

1. Open the data stream detail page and click the **Refresh History** tab. It shows record counts per refresh.
2. Compare the record count to the number of rows in your source CSV. If the numbers differ, some records failed.

<Screenshot src="/img/ingesting-external-data/03-refresh-history-with-records.png" alt="Contact_Home data stream Refresh History tab showing 3 entries: one Total Replace with 552 records processed and 551 added (Success), one Total Replace with 1 record processed and 0 added (Failure), and one Upsert with 0 records (Failure)" caption="A Failure status with low record counts is worth investigating. Row 2 here shows 1 record processed but 0 added - the record was read but rejected." />

3. Use **Data Explorer** (accessible from the top nav) to preview the ingested data and verify records.

<Screenshot src="/img/ingesting-external-data/03-data-explorer.png" alt="Data Explorer Objects page showing a Data Space selector set to 'default', an Object Type selector, and an Object search field, with a 'Select an Object' prompt in the main area" caption="Select an Object Type (DMO or DLO) and then the specific object to preview its records." />

4. Check the data stream's **Last Run Status** field for failure indicators.

{/* VERIFY: Where exactly do problem/failed records appear in the UI? The research could not confirm the exact location for viewing individual failed records. Check the SDO for the specific UI path to see which records failed and why. */}

### What to document

For each data stream, note:

- Total rows in the source CSV
- Total records ingested (from Refresh History or DMO record count)
- The difference between those numbers
- Your best explanation for why specific records failed

This is the kind of analysis you would do on a real engagement when source data does not ingest cleanly.

## Assignment

> **The client wants:** LEOptical has customer data in multiple places: Salesforce CRM (already connected), their VisionCare Rewards loyalty platform (CSV), and their ecommerce store (CSV). They need all of this in Data 360 before segments can be built.

1. Create a data stream for `loyalty.csv`. Set the DLO category to Profile. Map fields to Individual, Contact Point Email, and Loyalty Program Member. Add custom fields to the Loyalty Program Member DMO as needed.
2. Create a data stream for `ecom_customers.csv`. Set the DLO category to Profile. Map fields to Individual and Contact Point Email.
3. Create a data stream for `ecom_orders.csv`. Map fields to the Sales Order DMO.
4. Create a data stream for `ecom_order_items.csv`. Map fields to the Sales Order Product DMO.
5. Refresh all four data streams. Verify record counts in each DMO against the source CSV row counts. Investigate and document any discrepancies.
6. **(Stretch)** Create the custom Eye Exam DMO using the values from the Creating a custom DMO section above. Then create a data stream for `clinic_patients.csv` (Profile category) and map it to Individual and Contact Point Email. Create a data stream for `clinic_exams.csv` and map it to the Eye Exam DMO.

## Success criteria

- [ ] Four data streams are created (loyalty, ecom customers, ecom orders, ecom order items)
- [ ] Loyalty data is mapped to Individual, Contact Point Email, and Loyalty Program Member DMOs
- [ ] Ecom customer data is mapped to Individual and Contact Point Email DMOs
- [ ] Ecom order data is mapped to Sales Order DMO
- [ ] Ecom order item data is mapped to Sales Order Product DMO
- [ ] All four data streams have been refreshed successfully
- [ ] Record count discrepancies are investigated and documented
- [ ] You can explain the difference between using a standard DMO and creating a custom one

**Stretch:**

- [ ] Eye Exam custom DMO is created with all fields from the mapping table
- [ ] Clinic patient data stream is created and mapped to Individual and Contact Point Email
- [ ] Clinic exam data stream is created and mapped to the Eye Exam DMO
- [ ] Eye Exam is connected to Individual via the `patient_id` relationship

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between a standard DMO and a custom DMO?
- Why does LEOptical need a custom DMO for eye exam records?
- What happens to a DMO's category after the first DLO is mapped to it?
- How do you investigate records that failed to ingest?
- What file size and column limits apply to CSV uploads in Data 360?
- The ecommerce data is split across three files (`ecom_customers`, `ecom_orders`, `ecom_order_items`). Why does Data 360 require this separation rather than a single denormalized file?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Connect and Map Data (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-connectors-and-integrations/connect-and-map-data) - Covers data stream creation, field mapping, DMO relationships, cardinality, and category inheritance.
- [Standard DMOs (Salesforce Developers)](https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-si-entity-interface-dmos-introduction.html) - Official reference for the 89+ standard DMOs. Covers API names, categories, and subject areas.
- [How to: Data Model Object (Salesforce Dictionary)](https://salesforcedictionary.com/how-to/data-model-object) - Step-by-step guide for creating custom DMOs and defining relationships.
- [Introducing Local File Upload Connector (Salesforce Developers Blog)](https://developer.salesforce.com/blogs/2025/02/introducing-local-file-upload-connector-in-data-cloud) - Details on CSV upload steps, file size limits, and the File Upload connector.
- [Data Model Objects in Data 360 (Astreit)](https://astreait.com/data-model-objects-in-salesforce-data-cloud/) - Guide to DMO creation, standard vs custom tradeoffs, and deletion requirements.
