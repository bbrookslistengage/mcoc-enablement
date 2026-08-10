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
- How to create a custom DMO from scratch
- How to troubleshoot records that fail to ingest

## CSV data streams

LEOptical has three external data sources that arrive as CSV files:

- `loyalty_members.csv` from the VisionCare Rewards loyalty platform (~40K members)
- `ecommerce_orders.csv` from the online store (~100K orders)
- `exam_history.csv` from the optical clinic scheduling tool

Each one needs its own data stream. The process is the same for all three, so the walkthrough below covers one file. You will repeat it for the other two in the assignment.

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

- `loyalty_members.csv`: `membership_number` (each loyalty membership is unique)
- `ecommerce_orders.csv`: `order_id` (each order is unique, while line items use `line_item_id`)
- `exam_history.csv`: `exam_id` (each exam record is unique)

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

| Data Source | Target DMO | Type | Why |
|------------|-----------|------|-----|
| `loyalty_members.csv` | Loyalty Program Member | Standard + custom fields | Standard DMO exists for loyalty. Add custom fields for `Loyalty Tier`, `Points Balance`, etc. |
| `ecommerce_orders.csv` | Sales Order | Standard | Standard DMO exists for order headers. |
| `ecommerce_orders.csv` | Sales Order Product | Standard | Standard DMO exists for order line items. |
| `exam_history.csv` | Eye Exam | Custom | No standard DMO exists for eye exam records. This is industry-specific. |

Here is why each DMO was chosen:

- **Individual**: Represents a person. Maps from CRM Contact records. This is the core profile DMO that identity resolution uses to create Unified Individuals.
- **Contact Point Email**: Represents an email address associated with a person. A single Individual can have multiple Contact Point Email records (work email, personal email, loyalty email). This separation is critical for identity resolution.
- **Loyalty Program Member**: Represents a membership in a loyalty program. The standard DMO covers common loyalty fields (membership number, enrollment date, status). LEOptical adds custom fields for tier and points balance.
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

Here are the key field mappings for each data source. The full field-level detail is in the data model spec, but these are the fields you need to get right during initial setup.

**Loyalty Program Member** (standard DMO + custom fields):

| CSV Column | DMO Field | Standard/Custom | Notes |
|-----------|-----------|-----------------|-------|
| `membership_number` | Membership Number | Standard | Primary key |
| `first_name` + `last_name` | Name | Standard | Concatenated |
| `enrollment_date` | Enrollment Date | Standard | |
| `status` | Loyalty Program Member Status | Standard | Active / Inactive |
| `loyalty_tier` | Loyalty Tier | Custom | Bronze / Silver / Gold / Platinum |
| `points_balance` | Points Balance | Custom | |
| `email` | Email Address | Custom | Often differs from CRM email |
| `email_optin` | Email Opt-In | Custom | Dirty data: sometimes contradicts `unsubscribed_date` |

**Sales Order** (standard DMO):

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `order_id` | Sales Order Id | Primary key |
| `order_date` | Order Date | Dirty data: mixed MM/DD/YYYY formats |
| `order_total` | Total Amount | |
| `order_status` | Status | Completed / Cancelled / Returned |
| `customer_email` | Customer Email | Used for identity resolution |
| `order_source` | Order Source | "ecommerce" |

**Sales Order Product** (standard DMO):

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `line_item_id` | Sales Order Product Id | Primary key |
| `order_id` | Sales Order | Foreign key to Sales Order |
| `product_sku` | Product | Foreign key to Product. Dirty data: some SKUs do not exist |
| `quantity` | Quantity | |
| `unit_price` | Unit Price | |
| `line_total` | Line Total | |

**Eye Exam** (custom DMO, covered in the next section):

| CSV Column | DMO Field | Notes |
|-----------|-----------|-------|
| `exam_id` | Eye Exam Id | Primary key |
| `patient_email` | Patient Email | Used for identity resolution |
| `patient_first_name` | Patient First Name | |
| `patient_last_name` | Patient Last Name | |
| `exam_date` | Exam Date | Dirty data: DD-Mon-YYYY format |
| `next_exam_due` | Next Exam Due | |
{/* VERIFY: Data model spec lists Exam Type values as "Comprehensive / Follow-up / Contact Lens Fitting" but this table says "Full / Follow-up / Contact Lens Fitting". Check which is correct. */}
| `exam_type` | Exam Type | Full / Follow-up / Contact Lens Fitting |
| `provider_name` | Provider | |

## Creating a custom DMO

Eye exam records have no standard DMO equivalent. You need to create one.

### Walkthrough

1. Navigate to **Data Model**.
2. Click **New DMO**.
3. Fill in the form:
   - **Object Label:** Eye Exam
   - **Object API Name:** Eye_Exam (auto-generated from label)
   - **Object Category:** Other (eye exams are neither Profile nor Engagement data)
   - **Description:** Eye exam records from LEOptical optical clinics

<Screenshot src="/img/ingesting-external-data/04-custom-dmo-creation.png" alt="Create a Custom Data Model Object form showing Object Label, Object API Name, Object Category dropdown, Object Description field, and a pre-populated field list with Data Source, Data Source Object, and Internal Organization fields" caption="The form pre-populates three system fields (Data Source, Data Source Object, Internal Organization). Leave these as-is and add your custom fields below them." />

4. Use **Add Field** to create each field from the Eye Exam mapping table above. Set appropriate data types (Text, Email, Date).
5. Assign `Eye Exam Id` as the **Primary Key**.
6. Click **Save**.

After saving, you can map the `exam_history.csv` DLO fields to this custom DMO using the same mapping process described above.

:::warning
DMO relationships use only two cardinality options: N:1 (many-to-one) and 1:1 (one-to-one). To express "one Individual has many Eye Exams," you create the relationship from the Eye Exam DMO (the "many" side) as an N:1 relationship pointing to Individual. The DMO you are editing is always the left side of the relationship.

Cardinality cannot be changed after you create the relationship. If you set it wrong, you must delete the relationship and recreate it. Plan your relationships before creating them. The next lesson covers the full LEOptical data model and relationship design.
:::

## Troubleshooting ingestion

The seed data has intentional dirty data. Some records will fail to ingest. This is normal and expected.

### Common failure causes

- **Data type mismatches.** Text in a number field, or a non-standard date format the platform cannot parse.
- **Missing required fields.** Records missing a value for a required DMO field are rejected.
- **Date format issues.** `exam_history.csv` uses DD-Mon-YYYY format (e.g., "15-Mar-2025"). If the platform expects ISO format, these records may fail.
- **Orphaned foreign keys.** `ecommerce_orders.csv` contains product SKUs that do not exist in the Product DMO. Sales Order Product records referencing those SKUs cannot resolve their foreign key relationship.

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
- Your best explanation for why specific records failed (based on the dirty data patterns described above)

This is the kind of analysis you would do on a real client engagement when source data does not ingest cleanly.

## Assignment

> **The client wants:** LEOptical has customer data in three places: Salesforce CRM (already connected), their VisionCare Rewards loyalty platform (CSV), their ecommerce store (CSV), and eye exam records from their optical clinics (CSV). They need all of this in Data 360.

1. Create a data stream for `loyalty_members.csv`. Set the DLO category to Profile. Map fields to the Loyalty Program Member DMO, adding custom fields as needed.
2. Create a data stream for `ecommerce_orders.csv`. Map fields to both the Sales Order DMO and the Sales Order Product DMO.
3. Create the custom Eye Exam DMO following the walkthrough above.
4. Create a data stream for `exam_history.csv`. Map fields to the Eye Exam DMO.
5. Refresh all three data streams.
6. Verify record counts in each DMO. Compare them to the source CSV row counts.
7. Investigate and document any record count discrepancies. Note which records failed and why.

## Success criteria

- [ ] Three data streams are created (loyalty, ecommerce, eye exams)
- [ ] Loyalty data is mapped to the Loyalty Program Member DMO
- [ ] Ecommerce data is mapped to Sales Order and Sales Order Product DMOs
- [ ] Eye Exam custom DMO is created with all fields from the mapping table
- [ ] Eye exam data is mapped to the Eye Exam DMO
- [ ] All three data streams have been refreshed successfully
- [ ] Record count discrepancies are investigated and documented
- [ ] You can explain the difference between using a standard DMO and creating a custom one

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between a standard DMO and a custom DMO?
- Why does LEOptical need a custom DMO for eye exam records?
- What happens to a DMO's category after the first DLO is mapped to it?
- How do you investigate records that failed to ingest?
- What file size and column limits apply to CSV uploads in Data 360?
- How does the ecommerce data stream map to two different DMOs (Sales Order and Sales Order Product)?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Connect and Map Data (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-connectors-and-integrations/connect-and-map-data) - Covers data stream creation, field mapping, DMO relationships, cardinality, and category inheritance.
- [Standard DMOs (Salesforce Developers)](https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-si-entity-interface-dmos-introduction.html) - Official reference for the 89+ standard DMOs. Covers API names, categories, and subject areas.
- [How to: Data Model Object (Salesforce Dictionary)](https://salesforcedictionary.com/how-to/data-model-object) - Step-by-step guide for creating custom DMOs and defining relationships.
- [Introducing Local File Upload Connector (Salesforce Developers Blog)](https://developer.salesforce.com/blogs/2025/02/introducing-local-file-upload-connector-in-data-cloud) - Details on CSV upload steps, file size limits, and the File Upload connector.
- [Data Model Objects in Data 360 (Astreit)](https://astreait.com/data-model-objects-in-salesforce-data-cloud/) - Guide to DMO creation, standard vs custom tradeoffs, and deletion requirements.
