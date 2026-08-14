---
sidebar_position: 3
title: "Ingesting External Data"
description: "Create CSV data streams for LEOptical's loyalty, ecommerce, and eye exam data. Map fields to standard and custom DMOs and configure the relationships the platform does not wire up automatically."
---

## Overview

Up to this point, all the data in your SDO came from CRM via the Marketing Data Kit. That covers LEOptical's 49K Salesforce contacts, their products, and their campaigns. It does not cover their loyalty platform, their ecommerce store, or their optical clinics. Those three systems export as CSV files, and all of them need to land in Data 360 before you can build a meaningful data model.

This module has you build five required data streams from scratch. Each one involves choosing the right DLO category, setting a primary key, and mapping source fields to the correct DMO fields. The loyalty data stream maps to three DMOs simultaneously and requires adding custom fields to a standard DMO, a pattern you will use repeatedly on real engagements. This module is dense. Work through it in order and do not skip the relationships section at the end.

After ingestion, you will configure two DMO relationships that the platform does not set up automatically. This is the step most learners skip, and it breaks segmentation and personalization downstream. Do not skip it.

The stretch goal introduces custom DMO creation. Eye exam records have no standard DMO equivalent, so you build one. The requirements are covered at the end. No walkthrough is provided.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- How to create a CSV data stream using the File Upload connector
- How to choose between Profile, Engagement, and Other DLO categories
- How to set a primary key and what happens if you choose the wrong one
- How to map a single DLO to multiple DMOs
- How to add custom fields to a standard DMO during field mapping
- How to configure relationships that do not activate automatically
- How to check ingestion record counts and investigate failures
- How to create a custom DMO (stretch goal)

## The required data streams

LEOptical has five data streams that must be set up before identity resolution, segmentation, or personalization can work. Two stretch streams are covered at the end.

| Data Stream | DLO Category | Target DMOs | Approx Records |
|-------------|-------------|-------------|----------------|
| `Loyalty_Members` | Profile | Individual, Contact Point Email, Loyalty Program Member | ~33K |
| `Ecommerce_Customers` | Profile | Individual, Contact Point Email | ~23K |
| `Product` | Other | Product | ~200 |
| `Ecom_Orders` | Engagement | Sales Order | ~62K |
| `Ecom_Order_Items` | Other | Sales Order Product | ~92K |

The first two are customer master files: they describe who a person is. Product is reference data. The last two are transaction files: they describe what a person bought. This distinction drives the DLO category choice, which is covered in each walkthrough below.

## DLO categories

Before the walkthroughs, you need to understand what the DLO category controls. You cannot change it after you deploy the data stream.

**Profile**: Demographic and contact point data that describes who a person or account is. Requires a unique identifier per record. Profile DLOs can map to Profile-category DMOs like Individual and Contact Point Email. This is the only category that participates in identity resolution. If a customer record lands in a non-Profile DLO, identity resolution cannot find it, cannot match it against other sources, and cannot include it in a Unified Individual.

**Engagement**: Behavioral and transactional data that records what happened at a specific point in time. Requires a DateTime field designated as the Event Date. The critical constraint: that DateTime value must be immutable. It represents when the event occurred and will never change. Order date, session timestamp, and click datetime are all immutable. Use Engagement for data like that. Engagement DLOs map to Engagement-category DMOs like Sales Order. Engagement-category data also unlocks specific segment builder capabilities: you can filter segments by event counts, recency, and frequency within a lookback window. For example, "purchased more than twice in the last 90 days" is a segment filter that only works when order data is in an Engagement-category DMO. Engagement data also surfaces in the Activity timeline in Profile Explorer, giving you a per-profile view of behavioral history.

**Other**: Everything that does not fit Profile or Engagement. This includes non-demographic, non-behavioral reference data (products, locations, lookup tables) and transactional data where the DateTime field is mutable. A "last updated" timestamp that changes on re-export is a good example. The Eye Exam data in this module uses Other because exam records are mutable clinical records, not frozen-in-time events.

**Why not just use Other for everything?** Other is the most permissive category, but permissive means it opts out of platform features. Profile data earns identity resolution. Engagement data earns time-based segment filters and the Activity timeline in Profile Explorer. Data in the Other category gets neither. It sits in the data model but does not contribute to unified profiles or event-count segmentation. Use the right category for the right data, or those features will not work.

**Why this matters for mapping**: Category also determines which DMOs a DLO can map to. A DMO inherits its category from the first DLO mapped to it, and that is permanent. Once a DMO is categorized as Profile, only Profile DLOs can map to it. Pick the wrong category on a DLO, delete the data stream, and start over.

:::tip[Coming from MCE?]
In MCE, you decide what a data extension is for based on how you use it. There is no enforced category. In Data 360, category is a first-class platform concept that controls which DMOs are available for mapping, whether records participate in identity resolution, and how data behaves in segment filters. There is no equivalent decision point in MCE.
:::

## Walkthrough: Loyalty members

The `loyalty.csv` file comes from VisionCare Rewards, LEOptical's loyalty platform. It contains ~33K member records. This data stream is the most complex of the five: it maps to three DMOs, and it requires custom fields on one of them.

Download [`loyalty.csv`](/seed-data/loyalty.csv) before starting.

### CSV schema

```
loyalty_member_id, email, first_name, last_name, phone, tier, points, join_date, email_optin
```

The primary key is `loyalty_member_id`. Each value is unique (e.g., `LM-00001`). This is the field Data 360 uses to deduplicate and upsert records on future uploads.

### Step 1: Create the data stream

1. Navigate to **Data 360 > Data Streams**.
2. Click **New**.
3. Under "Other Sources," select the **File Upload** tile.

<Screenshot src="/img/ingesting-external-data/03-file-upload-connector.png" alt="New Data Stream connector selection screen showing Connected Sources (Ingestion API, Mobile App, Salesforce CRM) and Other Sources (File Upload, Installed Data Kits and Packages). File Upload is selected." />

4. Click **Upload Files** and select `loyalty.csv`, or drag the file onto the upload area. Wait for the upload confirmation, then click **Next**.

<Screenshot src="/img/ingesting-external-data/03-loyalty-upload-complete.png" alt="File Upload Complete screen showing loyalty.csv uploaded (3.06/3.06 MB), with a progress bar and spinner indicating the platform is processing the file." />

### Step 2: Configure category and primary key

5. On the data preview screen, set **Category** to **Profile**. This file contains customer identity data. Profile is correct.

<Screenshot src="/img/ingesting-external-data/03-loyalty-category-primarykey.png" alt="New Data Stream configuration screen for Loyalty_Members. Left panel shows Category set to Profile and Primary Key set to loyalty_member_id. Right panel shows the Sample Data tab with parsed CSV columns and sample records." />

6. Open the **Primary Key** dropdown and select `loyalty_member_id`.

7. In the **Data Stream Name** field, enter `Loyalty_Members`. Do not accept an auto-generated name here. The name becomes the DLO API name and appears throughout the data model.

8. Review the **Supported Fields** tab. Check that data types were auto-detected correctly:

| Column | Expected Type |
|--------|--------------|
| `loyalty_member_id` | Text |
| `email` | Email |
| `first_name` | Text |
| `last_name` | Text |
| `phone` | Phone |
| `tier` | Text |
| `points` | Number |
| `join_date` | DateTime |
| `email_optin` | Boolean |

Data 360 requires DateTime (not Date) for all date fields used in mappings. The `join_date` values in the CSV are formatted as `YYYY-MM-DD HH:MM:SS`. If the platform auto-detects this as Date rather than DateTime, correct it here before deploying.

If any type is wrong, correct it here. You cannot change field types after deployment.

<Screenshot src="/img/ingesting-external-data/03-loyalty-supported-fields.png" alt="Supported Fields tab for Loyalty_Members showing all nine columns with auto-detected data types: email (Email), email_optin (Boolean), first_name (Text), join_date (DateTime), last_name (Text), loyalty_member_id (Text), phone (Phone), points (Number), tier (Text)." />

9. Click **Deploy**. The data stream deploys and begins ingesting.

<Screenshot src="/img/ingesting-external-data/03-loyalty-deploy.png" alt="Final New Data Stream step showing Data Stream Name set to Loyalty_Members, Data Space set to default, and the Deploy button ready to activate the stream." />

### Step 3: Map to Individual

10. On the data stream detail page, find the **Data Mapping** panel on the right side and click **Review** (or **New Mapping** if no mapping exists yet).

<Screenshot src="/img/ingesting-external-data/03-loyalty-stream-detail.png" alt="Loyalty_Members data stream detail page showing Stream Type (Ingest), Data Stream Status (Active), Last Refreshed date, and 32,695 Total Records. The Data Mapping panel on the right shows Fields mapped at 0/0 with a Start button." />

11. The mapping canvas opens. On the right side, search for **Individual** and select it as the target DMO.

<Screenshot src="/img/ingesting-external-data/03-loyalty-select-objects.png" alt="Loyalty_Members Mappings canvas with all DLO fields listed on the left (unmapped) and a 'No objects selected' placeholder on the right with a Select Objects button." />

Click **Select Objects**, then search for **Individual** and select it.

<Screenshot src="/img/ingesting-external-data/03-loyalty-individual-search.png" alt="Select Objects panel with 'individual' typed in the search field and Individual DMO checked in the results list." />

12. Map these fields:

| DLO Field (left) | DMO Field (right) |
|-----------------|------------------|
| `loyalty_member_id` | Individual Id |
| `first_name` | First Name |
| `last_name` | Last Name |
| `join_date` | Created Date |
| `email_optin` | Email Opt-In |

<Screenshot src="/img/ingesting-external-data/03-loyalty-individual-mapping.png" alt="Loyalty_Members Mappings canvas with 9 fields mapped. Contact Point Email DMO shows Contact Point Email Id (Primary Key), Created Date, Email Address, and Party mapped. Individual DMO shows Created Date, Email Opt-In (Custom), First Name, Individual Id (Primary Key), and Last Name mapped." />

:::warning
`loyalty_member_id` maps to **Individual Id** here, not to a custom field. This makes the loyalty member ID the primary key for these Individual records. Data 360 uses this to distinguish loyalty-sourced Individuals from CRM-sourced Individuals. When identity resolution runs later, it merges both into a Unified Individual based on matching email and name, not on matching IDs.
:::

13. Click **Save**.

### Step 4: Map to Contact Point Email

14. Add a second DMO mapping. Click **Add Mapping** or the **+** button on the mapping canvas, then search for and select **Contact Point Email**.

<Screenshot src="/img/ingesting-external-data/03-loyalty-cpe-search.png" alt="Select Objects panel with 'contact point email' typed in the search field and Contact Point Email DMO checked. The mapping canvas behind it already shows the Individual mappings." />

15. Map these fields:

| DLO Field (left) | DMO Field (right) |
|-----------------|------------------|
| `loyalty_member_id` | Contact Point Email Id |
| `email` | Email Address |
| `loyalty_member_id` | Party Id |
| `join_date` | Created Date |

<Screenshot src="/img/ingesting-external-data/03-loyalty-cpe-mapping.png" alt="Loyalty_Members Mappings canvas showing Contact Point Email DMO with Contact Point Email Id (Primary Key), Created Date, Email Address, and Party mapped. Individual DMO is also visible below with its four mappings." />

`Contact Point Email Id` is the primary key for this DMO. Use `loyalty_member_id` since each loyalty member has one email record. `Party Id` is the foreign key that links this Contact Point Email back to its Individual. Both fields receive the same source value because `loyalty_member_id` is also the Individual Id set in the previous step.

16. Click **Save**.

### Step 5: Map to Loyalty Program Member

17. Add a third DMO mapping. Search for and select **Loyalty Program Member**.

<Screenshot src="/img/ingesting-external-data/03-loyalty-lpm-search.png" alt="Select Objects panel with 'loyalty program member' typed in the search field showing Loyalty Program Member and Loyalty Program Member Attribute Value as results. Loyalty Program Member is checked." />

18. Map the standard fields first:

| DLO Field (left) | DMO Field (right) | Notes |
|-----------------|------------------|-------|
| `loyalty_member_id` | Membership Number | Primary key for this DMO |
| `loyalty_member_id` | Party Id | FK linking to Individual |
| `join_date` | Enrollment Date | |

For the **Name** field on Loyalty Program Member, the DMO expects a single combined field but your CSV has separate `first_name` and `last_name` columns. Map `first_name` for now. You can concatenate in a formula field later if needed, or leave Name partially populated. It does not affect segmentation.

19. The remaining CSV columns (`tier`, `points`, `email`, `phone`) do not exist as fields on the standard Loyalty Program Member DMO. You need to add them as custom fields. `email_optin` is mapped to Individual instead. That is where consent signals belong for identity resolution.

    Click **Add Field** or the custom field option in the Loyalty Program Member mapping section.

<Screenshot src="/img/ingesting-external-data/03-loyalty-lpm-initial-mapping.png" alt="Loyalty_Members Mappings canvas showing the initial Loyalty Program Member mappings: Created Date, Enrollment Date, Loyalty Program Member Id (Primary Key), and Party. Contact Point Email and Individual sections are also visible above." />

20. Add these custom fields one at a time. Enter the field label and type. The platform appends `__c` to the API name automatically after the field is created:

| Field Label | API Name | Type |
|------------|----------|------|
| Loyalty Tier | Loyalty_Tier | Text |
| Points Balance | Points_Balance | Number |
| Email Address | Email_Address | Email |
| Phone | Phone | Phone |

After adding each custom field, map the corresponding DLO column to it:

| DLO Field (left) | DMO Field (right) |
|-----------------|------------------|
| `tier` | Loyalty Tier |
| `points` | Points Balance |
| `email` | Email Address |
| `phone` | Phone |

<Screenshot src="/img/ingesting-external-data/03-loyalty-lpm-full-mapping.png" alt="Loyalty_Members Mappings canvas showing the completed Loyalty Program Member section with mapped fields: Created Date, Email Address (Custom), Enrollment Date, Loyalty Program Member Id (Primary Key), Loyalty Tier (Custom), Party, Phone (Custom), and Points Balance (Custom)." />

21. Click **Save** and then **Deploy** the mapping.

### Step 6: Verify ingestion

22. Click the **Refresh History** tab on the data stream detail page. After the data stream finishes processing, check the record count against the number of rows in `loyalty.csv`.

<Screenshot src="/img/ingesting-external-data/03-loyalty-refresh-history.png" alt="Refresh History tab for Loyalty_Members showing one completed refresh on 8/13/2026 at 3:31 PM. Refresh Mode is Total Replace, Duration is 0:0:2, Status is Success, Records Processed is 32,695, Records Added is 32,695, Records Removed is 0." />

---

## Walkthrough: Ecommerce customers

The `ecom_customers.csv` file comes from LEOptical's online store. It contains ~23K customer accounts. This is the customer master for the ecommerce system: who the online shoppers are, not what they ordered. Orders are a separate file.

Download [`ecom_customers.csv`](/seed-data/ecom_customers.csv) before starting.

### CSV schema

```
ecom_customer_id, email, first_name, last_name, created_date, email_optin
```

The primary key is `ecom_customer_id` (e.g., `EC-10001`).

### Step 1: Create the data stream

1. Navigate to **Data 360 > Data Streams** and click **New**.
2. Select **File Upload** under "Other Sources."
3. Upload `ecom_customers.csv` and click **Next**.
4. Set **Category** to **Profile**. Same reasoning as loyalty: this is customer identity data.
5. Set **Primary Key** to `ecom_customer_id`.
6. Name the DLO `Ecommerce_Customers`.

<Screenshot src="/img/ingesting-external-data/03-ecom-customers-supported-fields.png" alt="New Data Stream configuration screen for Ecommerce_Customers. Left panel shows Category set to Profile, Primary Key set to ecom_customer_id. Right panel shows the Supported Fields tab with six fields auto-detected: created_date (DateTime), ecom_customer_id (Text), email (Email), email_optin (Boolean), first_name (Text), last_name (Text)." />

7. Review the Supported Fields tab. Expected types:

| Column | Expected Type |
|--------|--------------|
| `ecom_customer_id` | Text |
| `email` | Email |
| `first_name` | Text |
| `last_name` | Text |
| `created_date` | DateTime |
| `email_optin` | Boolean |

8. Click **Deploy**.

<Screenshot src="/img/ingesting-external-data/03-ecom-customers-category-primarykey.png" alt="Data stream detail page for Ecom_Customers after deployment showing Stream Type (Ingest), Data Stream Status (Active), and the Data Mapping panel with Fields mapped at 0/0 and a Start button." />

### Step 2: Map to Individual

9. Open the **Data Mapping** panel and click **Review**.
10. Select **Individual** as the target DMO.
11. Map these fields:

| DLO Field | DMO Field |
|-----------|-----------|
| `ecom_customer_id` | Individual Id |
| `first_name` | First Name |
| `last_name` | Last Name |
| `created_date` | Created Date |
| `email_optin` | Email Opt-In |

<Screenshot src="/img/ingesting-external-data/03-ecom-customers-individual-mapping.png" alt="Ecommerce_Customers Mappings canvas showing both Contact Point Email (top) and Individual (bottom) DMOs mapped. Contact Point Email has four fields mapped. Individual shows five fields mapped: Created Date, Email Opt-In (Custom), First Name, Individual Id (Primary Key), and Last Name." />

13. Click **Save**.

### Step 3: Map to Contact Point Email

14. Add a second mapping. Select **Contact Point Email** as the target DMO.
15. Map these fields:

| DLO Field | DMO Field |
|-----------|-----------|
| `ecom_customer_id` | Contact Point Email Id |
| `email` | Email Address |
| `ecom_customer_id` | Party Id |
| `created_date` | Created Date |

<Screenshot src="/img/ingesting-external-data/03-ecom-customers-cpe-mapping.png" alt="Ecommerce_Customers Mappings canvas showing Contact Point Email DMO with four fields mapped: ecom_customer_id to Contact Point Email Id (Primary Key), Created Date, email to Email Address, and ecom_customer_id to Party. Individual DMO is visible below with Email Opt-In (Custom) partially visible." />

16. Click **Save** and **Deploy** the mapping.

### Step 4: Verify ingestion

17. Check the **Refresh History** tab after processing completes. Compare the record count to the row count in `ecom_customers.csv`.

<Screenshot src="/img/ingesting-external-data/03-ecom-customers-refresh-history.png" alt="Refresh History tab for Ecommerce_Customers showing one completed refresh on 8/13/2026 at 4:30 PM. Refresh Mode is Total Replace, Duration is 0:0:2, Status is Success, Records Processed is 22,679, Records Added is 22,679, Records Removed is 0." />

---

## Walkthrough: Ecommerce orders

The `ecom_orders.csv` file contains ~62K order records from LEOptical's online store. Each row is one order header. This is transactional data, not customer identity data. That changes the DLO category.

Download [`ecom_orders.csv`](/seed-data/ecom_orders.csv) before starting.

### CSV schema

```
order_id, ecom_customer_id, order_date, order_total, order_status
```

The primary key is `order_id` (e.g., `ORD-100001`).

### Step 1: Create the data stream

1. Navigate to **Data Streams** and click **New**.
2. Select **File Upload**.
3. Upload `ecom_orders.csv` and click **Next**.
4. Set **Category** to **Engagement**. Orders are events that happened at a point in time, not records describing who someone is. The Sales Order DMO is an Engagement-category DMO, and only Engagement-category DLOs can map to it.
5. Set **Primary Key** to `order_id`.
6. The platform will ask you to designate an **Event Date** field. Select `order_date`. This field records when the order occurred and cannot be changed after deployment.

<Screenshot src="/img/ingesting-external-data/03-ecom-orders-category-primarykey.png" alt="New Data Stream configuration screen for Ecommerce_Orders. Left panel shows Category set to Engagement, Event Time Field set to order_date, and Primary Key set to order_id. Right panel shows the Supported Fields tab with five fields: ecom_customer_id (Text), order_date (DateTime), order_id (Text), order_status (Text), order_total (Number)." />

7. Name the DLO `Ecom_Orders`.
8. Review the Supported Fields tab. Expected types:

| Column | Expected Type |
|--------|--------------|
| `order_id` | Text |
| `ecom_customer_id` | Text |
| `order_date` | DateTime |
| `order_total` | Number |
| `order_status` | Text |

9. Click **Deploy**.

<Screenshot src="/img/ingesting-external-data/03-ecom-orders-deployed.png" alt="Ecommerce_Orders data stream detail page showing Data Stream Status (Active), Object Category (Engagement), Total Records 61,702, and the Data Mapping panel with Fields mapped at 0/0 and a Start button." />

### Step 2: Map to Sales Order

10. Open the **Data Mapping** panel and click **Review**.
11. Select **Sales Order** as the target DMO.
12. Map these fields:

| DLO Field | DMO Field |
|-----------|-----------|
| `order_id` | Sales Order Id |
| `ecom_customer_id` | Sold To Customer |
| `order_date` | Order Start Date |
| `order_date` | Order End Date |
| `order_total` | Total Amount |
| `order_status` | Status Reason |

`order_date` maps to both Order Start Date and Order End Date because the ecommerce data has a single order date rather than a date range. Sales Order treats these as the bounds of the order period. Mapping the same value to both is correct when you have only one date.

<Screenshot src="/img/ingesting-external-data/03-ecom-orders-mapping.png" alt="Ecommerce_Orders Mappings canvas showing Sales Order DMO on the right with six fields mapped: ecom_customer_id to Sold To Customer, order_date to Order Start Date and Order End Date, order_id to Sales Order Id (Primary Key), order_status to Status Reason, and order_total to Total Amount." />

:::warning
`ecom_customer_id` maps to **Sold To Customer**, not to a custom field. This is the foreign key that will link each Sales Order to an Individual. The `ecom_customer_id` value in this file matches the `ecom_customer_id` value used as Individual Id in the ecom_customers data stream. Data 360 uses this to resolve the relationship between orders and customers after you configure the relationship explicitly. That step is covered in the "Setting up DMO relationships" section below.
:::

13. Click **Save** and **Deploy** the mapping.

### Step 3: Verify ingestion

14. Check the **Refresh History** tab. With ~62K rows, ingestion may take a few minutes.

<Screenshot src="/img/ingesting-external-data/03-ecom-orders-refresh-history.png" alt="Refresh History tab for Ecommerce_Orders showing one completed refresh on 8/13/2026 at 4:47 PM. Status is Success, Records Processed is 61,702, Records Added is 61,702, Records Removed is 0." />

---

## Walkthrough: Ecommerce order items

The `ecom_order_items.csv` file contains ~92K line item records, one row per product within an order. Each row links back to an order in `ecom_orders.csv` via `order_id`, and to a product in the Product DMO via `sku`.

Download [`ecom_order_items.csv`](/seed-data/ecom_order_items.csv) before starting.

### CSV schema

```
order_item_id, order_id, sku, quantity, unit_price, line_total
```

The primary key is `order_item_id` (e.g., `ORD-100001-LI1`).

### Step 1: Create the data stream

1. Navigate to **Data Streams** and click **New**.
2. Select **File Upload**.
3. Upload `ecom_order_items.csv` and click **Next**.
4. Set **Category** to **Other**. Order items have no date column of their own. They inherit timing context from the parent Sales Order. Because there is no immutable DateTime field in this file, Engagement category is not an option. Other is correct here.
5. Set **Primary Key** to `order_item_id`.

<Screenshot src="/img/ingesting-external-data/03-order-items-category-primarykey.png" alt="New Data Stream configuration screen for Ecommerce_Order_Items. Left panel shows Category set to Other and Primary Key set to order_item_id. Right panel shows the Supported Fields tab with six fields: line_total (Number), order_id (Text), order_item_id (Text), quantity (Number), sku (Text), unit_price (Number)." />

7. Name the DLO `Ecom_Order_Items`.
8. Review the Supported Fields tab. Expected types:

| Column | Expected Type |
|--------|--------------|
| `order_item_id` | Text |
| `order_id` | Text |
| `sku` | Text |
| `quantity` | Number |
| `unit_price` | Number |
| `line_total` | Number |

9. Click **Deploy**.

<Screenshot src="/img/ingesting-external-data/03-order-items-deployed.png" alt="Ecommerce_Order_Items data stream detail page showing Data Stream Status (Active), Object Category (Other), Total Records 92,431, and the Data Mapping panel with Fields mapped at 0/0 and a Start button." />

### Step 2: Map to Sales Order Product

10. Open the **Data Mapping** panel and click **Review**.
11. Select **Sales Order Product** as the target DMO.
12. Map these fields:

| DLO Field | DMO Field |
|-----------|-----------|
| `order_item_id` | Sales Order Product Id |
| `order_id` | Sales Order |
| `sku` | Product |
| `quantity` | Ordered Quantity |
| `unit_price` | Unit Price Amount |
| `line_total` | Total Line Amount |

<Screenshot src="/img/ingesting-external-data/03-order-items-mapping.png" alt="Ecommerce_Order_Items Mappings canvas showing Sales Order Product DMO on the right with six fields mapped: line_total to Total Line Amount, order_id to Sales Order, order_item_id to Sales Order Product Id (Primary Key), quantity to Ordered Quantity, sku to Product, and unit_price to Unit Price Amount." />

13. Click **Save** and **Deploy** the mapping.

### Step 3: Verify ingestion

14. Check the **Refresh History** tab. With ~92K rows, ingestion takes a few minutes.

<Screenshot src="/img/ingesting-external-data/03-ecom-order-items-refresh-history.png" alt="Refresh History tab for Ecommerce_Order_Items showing a completed refresh with Status Success and all records ingested." />

---

## Walkthrough: Product

The Salesforce CRM connector brings in Product records via the Marketing Data Kit, but it does not automatically create a data stream. You need to deploy one manually and control exactly which fields come in.

### Step 1: Deploy the Product data stream

1. Navigate to **Data 360 > Data Streams**.
2. Find the **Product** data stream in the list. It was created by the CRM connector but has not been deployed yet. Open it.
3. Click the **Supported Fields** tab. The platform shows all standard and custom fields from the Salesforce Product2 object.
4. **Uncheck all standard fields** and **uncheck all custom fields**. Start with nothing selected.
5. Use the search box to find and check only these four fields:

| Salesforce Field | DLO Field Label | Notes |
|-----------------|-----------------|-------|
| `ProductCode` | Product Code | The SKU (e.g., VIS-ULX-001). This is the join key to Sales Order Product |
| `Name` | Name | Product display name |
| `Family` | Product Family | Used for SeeClear Enthusiasts segmentation |
| `Description` | Description | |

<Screenshot src="/img/ingesting-external-data/03-product-unchecked-standard-fields.png" alt="Product data stream Supported Fields tab with all standard fields unchecked." />

<Screenshot src="/img/ingesting-external-data/03-product-unchecked-custom-fields.png" alt="Product data stream Supported Fields tab with all custom fields unchecked." />

<Screenshot src="/img/ingesting-external-data/03-product-code-search.png" alt="Supported Fields search showing ProductCode field checked." />

6. Click **Deploy**.

<Screenshot src="/img/ingesting-external-data/03-product-deploy-confirmation.png" alt="Product data stream deploy confirmation screen." />

### Step 2: Map to Product DMO

7. Open the **Data Mapping** panel and click **Review**.
8. Select **Product** as the target DMO.
9. Map these fields:

| DLO Field | DMO Field |
|-----------|-----------|
| `ProductCode` | Product Code |
| `Name` | Name |
| `Family` | Product Family |
| `Description` | Description |

<Screenshot src="/img/ingesting-external-data/03-product-mapping.png" alt="Product Mappings canvas showing Product DMO with four fields mapped: ProductCode to Product Code, Name to Name, Family to Product Family, Description to Description." />

10. Click **Save** and **Deploy** the mapping.

### Step 3: Verify ingestion

11. Check the **Refresh History** tab after processing completes.

<Screenshot src="/img/ingesting-external-data/03-product-refresh-result.png" alt="Refresh History tab for Product data stream showing a successful ingestion." />

---

## Setting up DMO relationships

Four data streams are deployed and mapped. Now you need to configure two relationships that the platform does not set up automatically.

First, understand which relationships are automatic and which are not.

### Automatic relationships

These relationships activate on their own once both DMOs have field mappings with data:

| From DMO | Cardinality | To DMO | Activated by |
|----------|-------------|--------|--------------|
| Contact Point Email | N:1 | Individual | `Party Id` mapping |
| Contact Point Phone | N:1 | Individual | `Party Id` mapping |
| Loyalty Program Member | N:1 | Individual | `Party Id` mapping |
| Sales Order Product | N:1 | Sales Order | `Sales Order` mapping |

You already configured the `Party Id` mappings for Contact Point Email and Loyalty Program Member, and the `Sales Order` mapping for Sales Order Product. Those relationships are active.

### Relationships requiring explicit configuration

These two do not activate automatically. You need to define them manually in the Data Model:

| From DMO | Field | Cardinality | To DMO | Notes |
|----------|-------|-------------|--------|-------|
| Sales Order | Sold To Customer | N:1 | Individual | Connects orders to the customers who placed them |
| Sales Order Product | Product | N:1 | Product | Joins on Product Code (SKU), not Product Id |

Without the Sales Order → Individual relationship, you cannot build the Lapsed Buyers segment or the purchase history personalization. Without Sales Order Product → Product, you cannot build the SeeClear Enthusiasts segment (filtering by product family). Configure both now.

### Configuring Sales Order → Individual

1. Navigate to **Data 360 > Data Model** (not Data Streams).
2. Find **Sales Order** in the DMO list and open it.

<Screenshot src="/img/ingesting-external-data/03-relationships-initial-sales-order.png" alt="Sales Order DMO detail page in Data Model with the Relationships tab selected. Shows one existing relationship: Sales Order Product → Sales Order (ManyToOne) via KQ_SalesOrderId and Sales Order Id." />

3. Click the **Relationships** tab on the Sales Order DMO detail page.

<Screenshot src="/img/ingesting-external-data/03-sales-order-relationship-final.png" alt="Edit Relationships modal showing two rows: Sales Order Product → Sales Order (N:1, Sales Order Id, Active) and Sales Order → Individual (N:1, Individual Id, being configured with Sold To Customer as the field)." />

4. Click **New Relationship** (or the equivalent add button).
5. Fill in the relationship details:

| Field | Value |
|-------|-------|
| Related Object | Individual |
| Relationship Field (this object) | Sold To Customer |
| Relationship Field (related object) | Individual Id |
| Cardinality | N:1 |


6. Click **Save**.

:::warning
Cardinality cannot be changed after you create a relationship. N:1 means many Sales Orders can belong to one Individual. That is correct: one customer can have many orders. If you accidentally set 1:1, delete the relationship and recreate it with N:1.
:::


### Configuring Sales Order Product → Product

7. Navigate back to the DMO list and open **Sales Order Product**.
8. Click the **Relationships** tab.
9. The platform creates an out-of-the-box relationship between Sales Order Product and Product that joins on Product Id. That relationship does not match the LEOptical data, where `sku` in the order items file corresponds to `Product Code` on the Product DMO. You need to inactivate the default relationship and create the correct one.

    Find the existing Sales Order Product → Product relationship and set its status to **Inactive**.

10. Click **New Relationship**.
11. Fill in the relationship details:

| Field | Value |
|-------|-------|
| Related Object | Product |
| Relationship Field (this object) | Product |
| Relationship Field (related object) | Product Code |
| Cardinality | N:1 |

<Screenshot src="/img/ingesting-external-data/03-sales-order-product-relationship.png" alt="Edit Relationships modal for Sales Order Product showing multiple existing relationships and a new row being added: Sales Order Product → Product (N:1) with Related Field set to Product Code." />

12. Click **Save**.


## Troubleshooting ingestion

Data 360 does not reject an entire batch when individual records fail. Successful records continue processing while failed records are isolated. Your DMO will have data even if some source rows did not ingest.

### Checking record counts

1. Open any data stream detail page and click the **Refresh History** tab.
2. Compare the ingested record count to the source CSV row count.

<Screenshot src="/img/ingesting-external-data/03-loyalty-refresh-history.png" alt="Refresh History tab for Loyalty_Members showing one completed refresh on 8/13/2026 at 3:31 PM. Status is Success, Records Processed is 32,695, Records Added is 32,695. Compare this count to your source CSV row count to catch any failures." />

3. Use **Data Explorer** (accessible from the top nav or the app launcher) to preview what landed in the DMO.

<Screenshot src="/img/ingesting-external-data/03-data-explorer.png" alt="Data Explorer screen showing the DMO selector on the left and a preview of ingested records in the main panel." />

### Problem Records DLOs

For some connector types, Data 360 automatically creates a companion Problem Records DLO alongside the main data stream DLO. You can query it in Query Editor to see exactly which rows failed and why. This is the fastest way to diagnose ingestion issues on real engagements.

File Upload (CSV) data streams do not get a Problem Records DLO. That feature is available for structured ingest connectors, Web and Mobile App connectors, and the Ingestion API. For CSV uploads, Refresh History and Data Explorer are your primary tools.

See [Problem Record Data Lake Objects](https://help.salesforce.com/s/articleView?id=data.c360_a_datastream_dlo_problem_record.htm&type=5) for the full list of supported connectors.

### Common failure causes

- **Data type mismatches.** A Text value in a Number field, or a date string the platform cannot parse. Records with these values fail individually.
- **Missing required fields.** Records missing a value for a required DMO field are rejected.
- **Duplicate primary keys.** If a file contains two rows with the same primary key value, one will be rejected.

## Stretch goal: Eye exam data

This section is not required to complete the course. Later modules have their own stretch goals that build on the eye exam data, but all required segments, flows, and personalization use the loyalty and ecommerce data only. Skip this if you want to move on.

Eye exam records have no standard DMO equivalent. This stretch goal has you build the data model from scratch: a custom DMO, two data streams, and a relationship. No walkthrough is provided. Use what you learned in the required section to figure out the steps.

Download [`clinic_patients.csv`](/seed-data/clinic_patients.csv) and [`clinic_exams.csv`](/seed-data/clinic_exams.csv) before starting.

### What you need to build

**Clinic patients** (`clinic_patients.csv`) is a customer master file. Its schema:

```
patient_id, email, first_name, last_name, email_optin
```

Create a Profile data stream named `Clinic_Patients`. Map it to Individual and Contact Point Email using the same pattern as the loyalty and ecommerce customer streams.

**Clinic exams** (`clinic_exams.csv`) is exam record data. Its schema:

```
exam_id, patient_id, exam_date, exam_type, provider
```

There is no standard DMO for eye exams. You need to create a custom DMO before you can map to it. The Eye Exam DMO should use the **Other** category. Exam records are mutable clinical data, not frozen-in-time events, so Engagement is wrong.

Create the Eye Exam DMO with these fields:

| Field Label | Type | Notes |
|------------|------|-------|
| Eye Exam Id | Text | Primary key |
| Patient Id | Text | FK to Individual |
| Exam Date | DateTime | |
| Exam Type | Text | Full / Follow-up / Contact Lens Fitting |
| Provider | Text | Examining doctor name |

Then create an **Other** category data stream named `Clinic_Exams`. Map it to the Eye Exam DMO.

Finally, configure a relationship from Eye Exam to Individual: N:1, joining on Patient Id to Individual Id. No custom relationship is needed for Clinic Patients. The Contact Point Email to Individual relationship activates automatically via the Party Id mapping, same as the other profile streams.

---

## Assignment

> **The client wants:** LEOptical's loyalty platform, ecommerce store, and CRM are all live. The client needs all customer and transaction data in Data 360 before identity resolution can run and before any segments can be built.

Complete each step below. The required steps must be done before identity resolution. The stretch goal is optional.

1. Create a data stream for `loyalty.csv`. Follow the walkthrough above. Map to all three DMOs: Individual, Contact Point Email, and Loyalty Program Member. Add the four custom fields to Loyalty Program Member.
2. Create a data stream for `ecom_customers.csv`. Map to Individual and Contact Point Email.
3. Deploy the Product data stream. Select only ProductCode, Name, Family, and Description. Map to the Product DMO.
4. Create a data stream for `ecom_orders.csv`. Map to Sales Order.
5. Create a data stream for `ecom_order_items.csv`. Map to Sales Order Product.
6. Configure the **Sales Order → Individual** relationship on the Sales Order DMO (via Sold To Customer field, N:1).
7. Inactivate the default Sales Order Product → Product relationship. Configure a new one joining on Product → Product Code (N:1).
8. Verify record counts for all five data streams. Check the Refresh History tab for each and confirm the ingested count matches the source CSV row count.
9. **(Stretch)** Create the Eye Exam custom DMO. Ingest `clinic_patients.csv` and `clinic_exams.csv`. Configure the Eye Exam → Individual relationship.

## Success Criteria

- [ ] Five data streams are created and in Active status: Loyalty_Members, Ecommerce_Customers, Product, Ecom_Orders, Ecom_Order_Items
- [ ] Loyalty data is mapped to Individual (5 fields including Email Opt-In and Created Date), Contact Point Email (4 fields including Contact Point Email Id and Party Id), and Loyalty Program Member (standard fields + 4 custom fields)
- [ ] Loyalty Program Member has four custom fields: Loyalty Tier, Points Balance, Email Address, Phone
- [ ] Ecommerce_Customers is mapped to Individual (5 fields including Email Opt-In and Created Date) and Contact Point Email (4 fields including Contact Point Email Id and Party Id)
- [ ] Product data stream maps only ProductCode, Name, Family, and Description to the Product DMO
- [ ] Ecom order data maps order_date to both Order Start Date and Order End Date, and order_status to Status Reason
- [ ] Ecom order item data maps to Sales Order Product using Ordered Quantity, Unit Price Amount, and Total Line Amount
- [ ] Sales Order → Individual relationship is configured (N:1, via Sold To Customer)
- [ ] Default Sales Order Product → Product relationship is inactivated
- [ ] New Sales Order Product → Product relationship is configured (N:1, joining Product → Product Code)
- [ ] Record counts for all five data streams are verified against source CSV row counts

**Stretch:**

- [ ] Eye Exam custom DMO exists with Other category and all five fields (Eye Exam Id as primary key, Patient Id, Exam Date as DateTime, Exam Type, Provider)
- [ ] Clinic_Patients data stream (Profile) is mapped to Individual and Contact Point Email with the same pattern as other profile streams
- [ ] Clinic_Exams data stream (Other) is mapped to Eye Exam DMO with all five fields
- [ ] Eye Exam → Individual relationship is configured (N:1, via Patient Id → Individual Id)

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between Profile, Engagement, and Other DLO categories? Why can't you use Other for everything?
- What makes a DateTime field "immutable" in the context of Engagement category, and why does that matter for category selection?
- Why does `loyalty.csv` map to three DMOs while `ecom_customers.csv` maps to two?
- What role do `Contact Point Email Id` and `Party Id` play in Contact Point Email mappings, and why do both receive the same source value in these walkthroughs?
- Why is `email_optin` mapped to Individual rather than Loyalty Program Member?
- What is the `Sold To Customer` field on Sales Order, and why does it need an explicit relationship configured?
- Why does the default Sales Order Product → Product relationship need to be inactivated, and what is wrong with it for LEOptical's data?
- Which relationships in the LEOptical data model activate automatically, and which require explicit configuration?
- How do you verify that a data stream ingested the correct number of records, and where do you look if counts don't match?
- A learner deploys the five data streams and field mappings but skips the relationships section. What breaks downstream?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Connect and Map Data (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-connectors-and-integrations/connect-and-map-data):Covers data stream creation, field mapping, DMO relationships, cardinality, and category inheritance.
- [Standard DMOs (Salesforce Developers)](https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-si-entity-interface-dmos-introduction.html):Official reference for the 89+ standard DMOs. Covers API names, categories, and subject areas.
- [How to: Data Model Object (Salesforce Dictionary)](https://salesforcedictionary.com/how-to/data-model-object):Step-by-step guide for creating custom DMOs and defining relationships.
- [Introducing Local File Upload Connector (Salesforce Developers Blog)](https://developer.salesforce.com/blogs/2025/02/introducing-local-file-upload-connector-in-data-cloud):Details on CSV upload steps, file size limits, and the File Upload connector.
- [Data Model Objects in Data 360 (Astreit)](https://astreait.com/data-model-objects-in-salesforce-data-cloud/):Guide to DMO creation, standard vs custom tradeoffs, and deletion requirements.
