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

1. Navigate to **Data 360 Setup > Data Streams**.
2. Click **New**.
3. Select the **File Upload** tile.
4. Click **Upload Files** (or drag your CSV onto the upload area). Wait for the upload notification, then click **Next**.
5. Review the data preview. Verify that columns and values parsed correctly.
6. Select the DLO **category**: Profile, Engagement, or Other. This choice matters because it determines which DMOs this DLO can map to (more on this below).
7. Designate a **primary key** column. This is the field that uniquely identifies each record in the file.
8. Name the DLO (or accept the auto-generated name).
9. Review the auto-detected data types on the **Supported Fields** tab. Modify column labels or API names if needed.
10. Click **Deploy**.

After deployment, the data stream ingests the CSV. For smaller files, this completes within seconds.

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

:::warning
DMO category inheritance is permanent. A DMO inherits its category (Profile, Engagement, or Other) from the first DLO mapped to it. After that, only DLOs with the same category can map to it. If you assign the wrong category to your DLO, you cannot change the DMO's category later. Choose carefully on the first mapping.
:::

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

Most B2C concepts fit the standard data model. Industry-specific concepts (insurance policies, patient records, eye exams) typically need custom DMOs.

:::tip[Coming from MCE?]
- In MCE, all data extensions are custom-created. You define every field yourself. In Data 360, standard DMOs exist for common entities and custom DMOs are the exception. This is the opposite pattern.
- In MCE, you define data extension fields directly (name, type, length). In Data 360, you map DLO fields to DMO fields. The mapping indirection (DLO to DMO) has no MCE equivalent.
- Custom DMOs are the closest thing to a "create a new data extension" workflow, but they live within a shared data model with defined relationships rather than as standalone tables.
:::

## Field mapping

After deploying a data stream, you map its DLO fields to DMO fields. This is where the source data gets structured into the data model.

### How mapping works

1. From the data stream detail page, start the mapping experience.
2. The mapping canvas shows the source DLO on one side and the target DMO on the other.
3. Search for the target DMO you want to map to.
4. Map individual source fields to target DMO fields.
5. Focus on identifiers (emails, IDs, names) first. These are critical for identity resolution.

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

1. Navigate to **Data Cloud > Data Model**.
2. Click **New**.
3. Select **New** (for original creation, not "From Existing").
4. Fill in the form:
   - **Object Label:** Eye Exam
   - **Object API Name:** Eye_Exam (auto-generated from label)
   - **Object Category:** Other (eye exams are neither Profile nor Engagement data)
   - **Description:** Eye exam records from LEOptical optical clinics
5. Use **Add Field** to create each field from the Eye Exam mapping table above. Set appropriate data types (Text, Email, Date).
6. Assign `Eye Exam Id` as the **Primary Key**.
7. Click **Save**.

After saving, you can map the `exam_history.csv` DLO fields to this custom DMO using the same mapping process described above.

:::warning
Editing field structure on a DMO after creation can impact dependent segments, identity resolution rules, and activations. Get the field definitions right before you start building downstream configurations. Only custom DMOs can be deleted, and only after removing all downstream dependencies.
:::

:::warning
Relationship cardinality between DMOs cannot be changed after the relationship is created. Cardinality affects segmentation and activation behavior. Plan your relationships before creating them. The next subpage covers the full LEOptical data model and relationship design.
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

1. Open the data stream detail page and check the **Refresh History**. It shows record counts per refresh.
2. Compare the record count to the number of rows in your source CSV. If the numbers differ, some records failed.
3. Use **Data Explorer** (accessible from the **Data Cloud** menu) to preview the ingested data and verify records. Data Explorer supports basic filtering.
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
