# Research: Working with Data 360

Generated: 2026-08-09
Module: working-with-data-360
Sources: 28 sources consulted

## Module Context

**From module-assignments.md (Module 6 -- Data 360 & Data Model Objects):**

> **The client wants:** LEOptical has customer data in three places: Salesforce CRM (from the seed data), their VisionCare Rewards loyalty platform (CSV), and their ecommerce store (CSV). They need all of this in Data 360 so they can build a unified view of their customers.

**Assignment:**
- Review the Data Model Object (DMO) schema in Data 360 -- understand Individual, Contact Point Email, Sales Order, and other standard DMOs
- Review the target data model for LEOptical (provided in the lesson) and understand why each DMO and relationship was chosen
- Download `loyalty_members.csv` and `ecommerce_orders.csv` from the course resources
- Create Data Streams for each CSV source and ingest them into Data 360
- Map the incoming fields to appropriate DMOs (standard or custom as specified in the target data model)
- Verify data is flowing: check record counts in each DMO after ingestion

**Success Criteria:**
- [ ] You understand the target LEOptical data model and can explain the DMO relationships
- [ ] Two Data Streams are configured (loyalty, ecommerce)
- [ ] CSV data is ingested and visible in Data 360
- [ ] Fields are mapped to the correct DMOs per the target data model
- [ ] You've investigated any record count discrepancies between source files and ingested DMOs
- [ ] You can explain why some records may fail to ingest (missing required fields, format mismatches)

**Note:** Per the Part 2 restructure spec (2026-08-09-part2-restructure.md), this module has been expanded into a 4-subpage multi-page module that also absorbs the old Module 7 (CRM Data Ingestion). The subpages are: Exploring Your Org, The Refresh Chain, Ingesting External Data, and The LEOptical Data Model. The full subpage specs are in the restructure document.

**Content boundaries:** The Introduction to Data 360 module already teaches the concepts (what data streams, DLOs, DMOs, IDR, and segments are). This module shows what those things look like in practice, teaches operational mechanics, and has learners build the LEOptical data model hands-on. Do NOT re-teach concepts already covered in the intro. See the detailed conflict table in the restructure spec.

---

## Platform Concepts

### Data Stream Detail Page UI

When you navigate to a data stream's detail page (by clicking on it from the Data Streams list), the page shows:

- **Record status / overview area**: Shows the total number of records processed, the last refresh timestamp, and the associated data lake object name. (Source: heichat.net, Trailhead Connect and Map Data module)
- **Mapped fields section**: Shows the field mappings between the data stream and its DLO/DMO targets. You can add fields and create formula fields from this area. (Source: Trailhead Connect and Map Data module)
- **Refresh History tab**: A log of all refresh instances, distinguishing between full refreshes and incremental updates. Shows 0 if no changes since last update. (Source: heichat.net, Salesforce Help c360_a_datastream_dlo_refresh_history.htm)
- **Refresh Now button**: Available on the data stream record page to trigger a manual refresh. (Source: Salesforce Help, heichat.net)
- **Mapping experience**: Once a data stream is deployed, you can start the mapping process directly from the data stream detail page. (Source: Trailhead Connect and Map Data)

**Writer note:** The exact tab names on the data stream detail page could not be confirmed from screenshots (Salesforce Help pages are JS-rendered and did not load content). The writer should add `<!-- VERIFY -->` tags for exact tab names and take screenshots from the SDO to confirm.

### Full Refresh vs Incremental Refresh

**Incremental refresh (upsert):**
- Updates only records where the Last Modified Date changed since the last refresh
- Does NOT bring in records where the Last Modified Date did not change
- Important limitation: if a field value changes but the Last Modified Date does not update (e.g., formula fields), the revised values will not be picked up during an incremental refresh
- Formula fields on CRM objects are only synchronized during the initial data ingestion and on full refresh (Source: search results from certempire.com exam question, Salesforce Help)

**Full refresh:**
- Existing data in the DLO is removed and rebuilt from scratch using the latest values from the source
- Provides the current state of all records
- Required after: changes to identity resolution rulesets, changes to formula field definitions, any scenario where incremental misses are suspected
- CRM data streams: every 14 days (biweekly) by default, automatically performed by Data 360
- A full refresh occurs automatically during initial deployment or modification of a data stream (Source: heichat.net)

**How to trigger each:**
- Incremental: happens automatically on schedule (hourly for CRM); can also be triggered manually via the "Refresh Now" button
- Full refresh: happens automatically every ~2 weeks for CRM streams; can also be triggered manually (Source: Salesforce Help article 000389693)

**For CSV/local file upload data streams:**
- Full Refresh (re-upload) capability was introduced June 2025
- Upsert option was added November 2025
- These are triggered manually by re-uploading the file (Source: developer.salesforce.com blog)

Sources: heichat.net, Salesforce Help (c360_a_data_stream_edit_settings.htm, 000389693), certempire.com exam questions

### CRM Data Stream Refresh Cadence (Production)

**Research finding: The "every 15 minutes" claim in the spec is NOT confirmed.**

Multiple sources consistently state:
- **Incremental updates: hourly** (not every 15 minutes)
- **Full refresh: every 2 weeks (biweekly)**, automatically, no user action required
- The full refresh cadence was previously fixed at 2 weeks but may now be configurable (one source mentions the interval "can be changed" but does not list the available options)

The spec states "every ~15 min (upsert)" for production CRM data stream refresh. This appears to be inaccurate based on available documentation. All sources indicate hourly incremental upserts.

**Writer action:** Use "hourly" instead of "every 15 minutes" for the production CRM refresh cadence. Flag with `<!-- VERIFY -->` if desired, but multiple independent sources agree on hourly.

Sources: heichat.net CRM connector blog, Trailhead Connect and Map Data module, Salesforce Help c360_a_data_stream_schedule.htm (title only, page did not render)

### SDO Scheduling Limitations

**Research finding: Could not find SDO-specific documentation about scheduling limitations.**

The spec claims SDOs cannot schedule automatic data stream refreshes and require manual refresh. This is plausible (SDOs have many limitations compared to production orgs), but no official source was found that explicitly confirms this specific limitation.

What was found:
- Sandbox considerations documentation exists (help.salesforce.com c360_a_data_cloud_sandbox_consideration.htm) but the page content could not be rendered
- Data Cloud in Sandbox is documented as a Beta feature with its own considerations
- SDOs are distinct from sandboxes -- they are demo orgs, not developer or partial/full copy sandboxes

**Writer action:** The claim about SDO scheduling limitations should be stated with a `<!-- VERIFY -->` flag. Confirm by checking the SDO directly during content development.

Source: Salesforce Help (c360_a_data_cloud_sandbox.htm, c360_a_data_cloud_sandbox_consideration.htm -- pages did not render)

### DSO (Data Source Object) History

DSOs are the initial intake point in the three-layer Data 360 architecture:

**Architecture position:** DSO (raw ingestion) -> DLO (persistent storage) -> DMO (virtual view)

**What DSOs are:**
- Temporary staging areas that hold data in its raw, original format
- Capture an "exact copy of your incoming data with little or no modification"
- Only minor transformations happen at the DSO level (e.g., date reformatting, field combination through formulas)
- Not user-facing -- users do not query or interact with DSOs directly
- Described as "a back-end staging layer" (Source: jthathapudi.com)
- Some data sources skip the DSO stage entirely and appear directly as DLOs (Source: intro-to-data-360 research)

**Historical visibility:**
- No source was found that documents when DSOs were user-visible vs when they were hidden from the UI
- Current documentation treats DSOs as internal infrastructure that users do not interact with
- The intro-to-data-360 research file confirms: "Not user-facing. Users do not interact with DSOs directly. They are internal infrastructure."
- Multiple community blog sources (jthathapudi.com, gearset.com, sfdcgym.com) document the three-layer architecture but none provide historical context about UI visibility changes

**Writer action:** The spec says to provide "a brief history of DSOs" including when they were user-visible and when they were hidden. No source confirms this history. The writer should mention that DSOs exist as an internal storage layer beneath DLOs but should NOT claim they were once user-visible unless that can be confirmed. Present it as architecture context, not history.

Sources: jthathapudi.com, gearset.com, sfdcgym.com, lanefour.com

### Standard DMO Advantages

**What standard DMOs provide:**

1. **Pre-defined fields and schema**: Standard DMOs have canonical data model attributes, presented as standard objects similar to traditional Salesforce objects. 89+ standard DMOs exist across subject areas (Party, Engagement, Commerce, Marketing, Loyalty, Privacy, Product, Sales Order, Case). (Source: developer.salesforce.com, ateko.com)

2. **Standard relationships**: Standard DMOs can have standard relationships with other DMOs. Standard data relationships are "built-in relationships that are enabled once there is at least one mapping between the related DMOs." (Source: Trailhead Connect and Map Data, search results)

3. **Non-editable API names and primary keys**: API names and primary keys on standard DMOs are fixed (cannot be modified), ensuring consistency. (Source: developer.salesforce.com standard DMOs page)

4. **Data space agnostic**: Standard DMOs work consistently across all data environments. (Source: developer.salesforce.com)

5. **Regular field updates**: Standard DMOs receive regular updates to expand functional capabilities. (Source: developer.salesforce.com)

6. **Category inheritance**: DMOs inherit their category (Profile, Engagement, Other) from the first DLO mapped to them. After a DMO inherits a category, only DLOs with that same category can map to it. This is permanent. (Source: Trailhead Connect and Map Data, ateko.com)

7. **Segmentation integration**: Segments can only be created on Profile-type DMOs (Individual, Unified Individual, Account). Standard DMOs of the Profile category are pre-configured for this. (Source: intro-to-data-360 research, davidpalencia.com)

**What custom DMOs require that standard DMOs get automatically:**
- Custom DMOs require explicit relationship definitions to other DMOs (standard DMOs get built-in relationships when mapped)
- Custom DMOs must have categories set correctly for segmentation to work
- Custom DMOs can be deleted (after removing dependencies) while standard DMOs cannot be removed

**Tradeoff discussion:**
- "Use standard DMOs before creating custom ones" is the official recommendation (Source: astreait.com)
- Custom DMOs are appropriate when no standard equivalent exists (e.g., Eye Exam for LEOptical)
- "Most B2C concepts fit [the standard model]; industry-specific concepts (Insurance Policy, Patient Record) may need custom DMOs" (Source: salesforcedictionary.com)
- Salesforce recommends: "Although Data Cloud is not BYO Data Model, you may extend the capabilities of the canonical data model and add custom objects, but recommendation is to do so only when really necessary" (Source: davidpalencia.com)

### Custom DMO Creation

**Steps to create a custom DMO:**

1. Navigate to Data Cloud > Data Model in Salesforce Setup
2. Click the **New** button
3. Select "New" (for original creation) or "From Existing" (to modify)
4. Complete the Custom Data Model Object form:
   - Object Label
   - Object API Name
   - Object Category (Profile, Engagement, or Other -- determines billing and profile counting)
   - Description
5. Use "Add Field" to define attributes; assign a Primary Key to uniquely identify records
6. Click Save

(Source: astreait.com, salesforcedictionary.com)

**Important:** Editing field structure or removing fields after creation may impact dependent segments, identity resolution rules, and activations. Only custom DMOs can be deleted, and only after removing all downstream dependencies. (Source: astreait.com)

### DMO Relationship Definition

**Steps to define relationships between DMOs:**

1. Access the DMO's **Relationships tab** and click **Edit**
2. Click **+ New Relationship** in the Edit Relationships box
3. Set the **cardinality** (1:1, 1:N, N:1)
4. Select the **related object** in Data 360
5. Select the **related field** in the target object
6. Save

(Source: salesforcedictionary.com)

**Relationship types available:**
- Many-to-one lookup
- One-to-many child
- Many-to-many bridge

(Source: salesforcedictionary.com)

**Critical constraint:** "Cardinality between objects has implications for segmentation and activation and can't be changed after the relationship is created." (Source: Trailhead Connect and Map Data)

**Standard vs custom relationships:**
- Standard relationships are built-in and are automatically enabled once there is at least one mapping between the related DMOs
- Custom relationships must be explicitly defined by the user
- A custom data relationship is deleted automatically when the mapping for at least one field is removed
- You can delete or deactivate a custom data relationship
(Source: search results referencing Trailhead and Salesforce Help)

### Data Transforms

**What they are:** Data Transforms enable data preparation directly within Data 360. They modify data as it moves through the pipeline.

**Where they fit:** Between raw data ingestion (DLOs) and the data model (DMOs). A transform reads from a source DLO, applies SQL transformations, and writes to a target DLO or DMO.

**Two types:**

1. **Batch Transforms**
   - Support complex operations: aggregations, joins between data lake objects, filtering
   - Can output to either DLOs or DMOs
   - Run manually or on a schedule
   - Ideal for historical or static datasets
   - Org limit: 100 batch transforms per org

2. **Streaming Transforms**
   - Process data in near real-time as it arrives
   - Limited to basic SQL on a single data object (no joins)
   - Read, reshape, and write data to target DLOs continuously
   - Output cannot be used directly for segmentation and activation
   - Org limit: 25 streaming transforms per org
   - SQL capabilities: SELECT, WHERE, UNION, CONCAT, ISNOTNULL, filtering

**Common use cases:**
- Data normalization (e.g., transposing flat-file phone contacts into separate records)
- Pre-processing and source creation (joining DLOs for identity resolution)
- Calculated dimensions (generating new insights)
- Merging data from multiple pipelines
- Removing duplicates and errors
- Type conversions and format standardization

**Limitations:**
- Intentionally limited since Data 360 expects pre-cleaned data
- Processing usage directly impacts licensing costs (credit consumption)
- Streaming transforms cannot join across objects
- Batch transforms require scheduling or manual execution

**SDO limitations:** No explicit SDO-specific limitations were documented for Data Transforms.

**LEOptical relevance:** The spec states LEOptical does not use Data Transforms in this course, but learners should know they exist. This should be a "light touch" section.

Sources: salesforceben.com, Trailhead streaming-data-transforms module, sfdcgym.com

### CSV Data Stream Creation

**Steps to create a CSV/local file upload data stream:**

1. Navigate to Data Cloud Setup > Data Streams
2. Click **New**
3. Select the **File Upload** tile (or "Local File Upload" connector)
4. Click **Upload Files** or drag-and-drop your CSV onto the interface
5. Wait for upload notification, click **Next**
6. Review the data preview to verify correct file parsing
7. Select the DLO **category** (Profile, Engagement, or Other)
8. Designate a **primary key**
9. Provide a DLO name (or accept auto-generated name)
10. Review auto-detected data types on the **Supported Fields** tab; modify column labels or API names as needed
11. Deploy the data stream

**File requirements and limits (as of late 2025):**
- CSV format with required header row
- Maximum file size: 2 GB (increased from 10 MB in March 2025, then 100 MB, then 2 GB in November 2025)
- Maximum: 100 columns per file
- Ingestion usually completes within seconds for smaller files

**Refresh options for CSV streams:**
- Full Refresh (re-upload): available since June 2025
- Upsert: available since November 2025
- For upsert: CSV header row must match the fields in the defined data stream

**Pre-requisite (Beta period):** Navigate to Data Cloud Setup > Feature Manager and enable Beta connectors. A Local File Upload connection is automatically created. (Note: this may no longer apply if the feature is GA -- writer should verify current state.)

Sources: developer.salesforce.com blog (Feb 2025), search results

### Ingestion Failure Debugging

**Where failed records appear:**
- Data 360 separates "problem records" from successfully ingested records. The batch does not fail entirely -- successful records continue processing while problematic ones are isolated for review. (Source: search results)
- The data stream detail page shows processed record counts, which may differ from source CSV row counts
- The **Refresh History** on the data stream record page shows record counts per refresh

**Common failure causes:**
- Data type mismatches (e.g., text in a number field)
- Missing required fields
- Date format mismatches (e.g., DD-Mon-YYYY vs expected ISO format)
- Values the platform does not recognize
- Orphaned foreign keys (e.g., a product SKU that does not exist in the Product DMO)

**Debugging approach:**
- Use **Data Explorer** (accessible from the Data Cloud menu) to preview ingested data and verify records. Supports basic filtering. (Source: heichat.net)
- Compare record counts between source file and DLO/DMO
- Check the Refresh History tab for error counts
- Monitor the data stream's "Last Run Status" field for failure indicators (Source: vagminecloud.com)
- Maintain a failure log with timestamps, source, error type, and resolution steps (best practice)

**Proactive monitoring:**
- You can create a Salesforce Flow triggered on the Data Stream object's "Last Run Status" field to send email alerts when ingestion fails (Source: vagminecloud.com)

**Writer note:** The exact UI for viewing problem records could not be confirmed from documentation (Salesforce Help pages did not render). The writer should explore the SDO to find where problem records appear and take screenshots. Add `<!-- VERIFY -->` flags for the exact problem records UI location.

### Field Mapping Process

**How field mapping works:**

1. From the data stream detail page (after deployment), access the mapping experience
2. The mapping canvas shows the source data structure (DLO) and target data model (DMO)
3. Search available DLOs and DMOs/entities
4. Map specific source fields to target DMO fields
5. Focus on identifiers: names, IDs, emails, phone numbers (these are critical for building unified profiles)
6. You can map to existing standard DMOs or create new custom DMOs

**Key facts about mapping:**
- One DLO can map to multiple DMOs (e.g., Contact DLO maps to both Individual and Contact Point Email)
- Multiple DLOs can map to the same DMO (e.g., email fields from CRM, loyalty, and ecommerce all map to Contact Point Email)
- Category inheritance: a DMO inherits its category from the first DLO mapped to it. Subsequent DLOs must have the same category.
- Category inheritance is permanent (cannot be changed after creation)

**Handling mismatches:**
- Field name mismatches: the mapping UI lets you map source field "order_total" to DMO field "TotalAmount" (names do not need to match)
- Data type mismatches: some type coercion happens automatically, but mismatched types can cause ingestion failures for individual records

Sources: Trailhead Connect and Map Data, davidpalencia.com data modelling

---

## UI Navigation Paths

- **Data Streams list**: Data 360 Setup > Data Streams (Source: Trailhead Connect and Map Data)
- **Data Stream detail page**: Data 360 Setup > Data Streams > [click on stream name] (Source: heichat.net, Trailhead)
- **Manual refresh**: Data Stream detail page > Refresh Now button (Source: Salesforce Help, heichat.net)
- **Data Lake Objects**: Data 360 Setup > Data Lake Objects (Source: inferred from Salesforce Help article titles)
- **Data Model / DMOs**: Data Cloud > Data Model (Source: astreait.com, salesforcedictionary.com)
- **Create custom DMO**: Data Cloud > Data Model > New (Source: astreait.com)
- **DMO Relationships**: Data Model > [select DMO] > Relationships tab > Edit > + New Relationship (Source: salesforcedictionary.com)
- **Data Explorer**: Data Cloud menu > Data Explorer (Source: heichat.net)
- **Data Transforms**: <!-- VERIFY --> exact navigation path not confirmed from sources
- **Feature Manager (for Beta connectors)**: Data Cloud Setup > Feature Manager (Source: developer.salesforce.com blog)
- **Data Model graph view**: Data Model tab > graph view (Source: search results referencing Trailhead)

---

## Platform Gotchas

**From platform-gotchas.md (directly relevant):**

1. **SDOs have one data space** (Confirmed 2026-08-06, Summer '26): SDO orgs only have a single data space. Business units cannot be enabled. Relevant because the data model is configured within this single data space.

2. **Missing fields are absent from graph JSON, not null** (Confirmed 2026-08-06, Summer '26): If a Unified Individual does not have data for a field, the Data Graph JSON does not include that field at all. Relevant for the Refresh Chain subpage where Data Graphs are introduced.

3. **IDR auto-creates a default ruleset during MCA setup** (Confirmed 2026-08-06, Summer '26): MCA setup can auto-create a default IDR ruleset. Relevant context for the Refresh Chain discussion of IDR's role.

**From intro-to-data-360 research (carry forward):**

4. **DMO category inheritance is permanent**: A DMO inherits its category from the first data source object that maps to it, and subsequent mappings must match the original category. This cannot be changed after creation. (Source: Trailhead Connect and Map Data)

5. **DMO relationship cardinality cannot be modified after creation**: Once set, the cardinality of a relationship between DMOs is permanent. (Source: Trailhead Connect and Map Data)

**New gotchas discovered during research:**

6. **Incremental refresh does not pick up formula field changes**: Formula fields on CRM objects are only synchronized during the initial data ingestion and on full refresh of the data stream. If a formula field changes value but the record's Last Modified Date does not update, incremental refresh will miss it. (Source: certempire.com Data Cloud Consultant exam question, multiple search results)

7. **CRM data stream refresh is hourly, not every 15 minutes**: Multiple sources confirm hourly incremental upserts for CRM data streams, not the 15-minute cadence stated in the spec. Full refresh is biweekly. (Source: heichat.net, Trailhead)

8. **Data Transform org limits**: Maximum 100 batch transforms and 25 streaming transforms per organization. (Source: salesforceben.com)

9. **Local File Upload CSV limits**: Maximum 2 GB file size, 100 columns per file. Header row required. (Source: developer.salesforce.com blog)

---

## MCE Comparison Points

The Introduction to Data 360 module already covers the core MCE comparisons (DLOs ~ data extensions, DMO relationships ~ Contact Builder, segments ~ filtered DEs). This module should NOT repeat those. Instead, it can add operational-level comparisons:

1. **Data refresh mechanics**: In MCE, data extensions are updated immediately when you import data or when an automation runs. In Data 360, there is a refresh dependency chain (data stream > IDR > Data Graph) and each step has its own timing. This is a fundamental operational difference.

2. **Field mapping**: In MCE, you define data extension fields directly (name, type, length). In Data 360, you map DLO fields to DMO fields. The mapping indirection (DLO -> DMO) has no MCE equivalent.

3. **Custom objects**: In MCE, all data extensions are custom-created. In Data 360, standard DMOs exist for common entities and custom DMOs are the exception. This is the opposite pattern from MCE.

4. **Data Transforms**: MCE has SQL activities and script activities in Automation Studio for data transformation. Data 360 has Data Transforms (batch and streaming). The concept is similar but the implementation and pipeline position differ.

5. **Ingestion troubleshooting**: In MCE, import errors are shown immediately as a list of failed rows with error descriptions. In Data 360, problem records are separated but the debugging experience is different (Data Explorer, refresh history). Cannot confidently map the exact MCE equivalent debugging workflow.

---

## External Resources

- [Data Cloud Connectors and Integrations: Connect and Map Data (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-connectors-and-integrations/connect-and-map-data) -- Covers data stream creation, field mapping, DMO relationships, cardinality, and category inheritance. Key reference for the mapping and relationship sections.

- [Creating Data Streams Using Salesforce CRM Connector (HeiChat)](https://heichat.net/blogs/tbGE71MEV4E/Creating-Data-Streams-Using-Salesforce-CRM-Connector-%7C-Data-Cloud-Decoded/) -- Detailed walkthrough of CRM data stream creation, refresh schedules (hourly incremental, biweekly full), and the data stream detail page.

- [Standard DMOs (Salesforce Developers)](https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-si-entity-interface-dmos-introduction.html) -- Official reference for standard DMOs. Confirms non-editable API names, data space agnosticism, and regular field updates.

- [Data Model Objects in Salesforce Data Cloud (Astreit)](https://astreait.com/data-model-objects-in-salesforce-data-cloud/) -- Complete guide to DMO creation, standard vs custom, relationships, and deletion requirements.

- [How to: Data Model Object (Salesforce Dictionary)](https://salesforcedictionary.com/how-to/data-model-object) -- Step-by-step guide for creating custom DMOs and defining relationships.

- [Salesforce Data Cloud Data Modelling (David Palencia)](https://davidpalencia.com/salesforce-data-cloud-data-modelling/) -- Data modeling phases, Customer 360 Data Model structure, consent model, and relationship configuration best practices.

- [Salesforce Data Transforms (Salesforce Ben)](https://www.salesforceben.com/salesforce-data-transforms-what-is-this-key-component-of-data-cloud/) -- Overview of batch and streaming transforms, use cases, org limits, and cost implications.

- [Streaming Data Transforms Quick Look (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/streaming-data-transforms-quick-look/get-started-with-streaming-data-transforms-in-data-cloud) -- Streaming transforms pipeline, SQL capabilities, phone normalization example.

- [Introducing Local File Upload Connector in Data Cloud (Salesforce Developers Blog)](https://developer.salesforce.com/blogs/2025/02/introducing-local-file-upload-connector-in-data-cloud) -- CSV upload steps, file size limits, Beta connector enablement.

- [From Raw to Ready: DSOs, DLOs, and DMOs (Jayanth Thathapudi)](https://www.jthathapudi.com/blog/from-raw-to-ready-understanding-dsos-dlos-and-dmos-in-salesforce-data-cloud) -- Three-layer architecture overview, DSO as staging, DLO persistence, DMO virtual nature.

- [Understanding Data Transforms in Data Cloud (SFDC Gym)](https://sfdcgym.com/understanding-data-transforms-in-data-cloud/) -- Batch vs streaming transforms, common use cases by industry.

- [How to Set Up Email Alerts for Data Cloud Ingestion Failure (Vagmine Cloud)](https://vagminecloud.com/how-to-set-up-email-alerts-for-salesforce-data-cloud-ingestion-failure/) -- Proactive monitoring approach using Flows on the Data Stream object.

- [Data Cloud Model Explained (Ateko)](https://ateko.com/en/blog/salesforce-data-cloud-model-explained/) -- DMO categories, category inheritance, 89 standard DMOs across subject areas.

---

## Data Model Relevance

This module is the primary module for teaching the LEOptical data model. All DMOs, fields, and relationships from data-model.md are directly relevant.

### DMOs and Their Sources

| DMO | Type | Source | Ingestion |
|-----|------|--------|-----------|
| Individual | Standard | CRM Contact | Auto (Marketing Data Kit) |
| Contact Point Email | Standard | CRM Contact + CSV email fields via IDR | Auto + IDR |
| Contact Point Phone | Standard | CRM Contact | Auto |
| Account | Standard | CRM Account | Auto |
| Loyalty Program Member | Standard + custom fields | loyalty_members.csv | CSV data stream |
| Sales Order | Standard (manually enabled) | ecommerce_orders.csv | CSV data stream |
| Sales Order Product | Standard (manually enabled) | ecommerce_orders.csv | CSV data stream |
| Product | Standard | CRM Product (Apex script) | Auto |
| Eye Exam | **Custom** | exam_history.csv | CSV data stream |
| Comm Subscription Consent | Standard | Flow-created (Module 5) | Flow/form |
| Unified Individual | Standard | System-generated post-IDR | Automatic |

### Key Field-Level Details for This Module

**Loyalty Program Member** (standard DMO + custom fields):
- Standard fields: Membership Number (PK), Name, Enrollment Date, Status
- Custom fields: Loyalty Tier, Points Balance, Email Address, Phone, Email Opt-In, Unsubscribed Date
- Dirty data: email_optin sometimes contradicts unsubscribed_date

**Sales Order** (standard DMO):
- Fields: Sales Order Id (PK), Order Date, Total Amount, Status, Customer Email, Order Source
- Dirty data: Order Date has mixed MM/DD/YYYY formats

**Sales Order Product** (standard DMO):
- Fields: Sales Order Product Id (PK), Sales Order (FK), Product (FK to Product SKU), Quantity, Unit Price, Line Total
- Dirty data: some product SKUs do not exist (orphaned orders)

**Eye Exam** (custom DMO):
- Fields: Eye Exam Id (PK), Patient Email, Patient First Name, Patient Last Name, Exam Date, Next Exam Due, Exam Type, Provider
- Dirty data: Exam Date format is DD-Mon-YYYY in CSV

### Data Graph Structure

Rooted on Unified Individual. Includes: Contact Point Email (1:many), Contact Point Phone (1:many), Account (many:1), Sales Order (1:many), Sales Order Product (1:many via Sales Order), Product (many:1 via SOP), Loyalty Program Member (1:1), Eye Exam (1:many), Comm Subscription Consent (via email match).

### Refresh Dependency Chain

```
1. Data Streams refresh (CSV + CRM data ingested into DLOs -> DMOs)
       |
2. Identity Resolution runs (records matched & merged into Unified Individuals)
       |
3. Data Graph refreshes (relationships resolved across DMOs)
       |
4. Dynamic content resolves (Handlebars expressions find data in the graph)
```

---

## Source Log

- https://help.salesforce.com/s/articleView?id=sf.c360_a_data_streams_tab.htm -- Discarded: JS-rendered page, no content extractable
- https://help.salesforce.com/s/articleView?id=sf.c360_a_data_stream_edit_settings.htm -- Discarded: JS-rendered page, no content extractable
- https://help.salesforce.com/s/articleView?id=sf.c360_a_data_stream_schedule.htm -- Discarded: JS-rendered page, no content extractable (title confirms scheduling topic)
- https://help.salesforce.com/s/articleView?id=000389693&language=en_US&type=1 -- Discarded: JS-rendered page, no content (topic: full refresh for CRM streams)
- https://help.salesforce.com/s/articleView?id=data.c360_a_data_stream_edit_settings.htm -- Discarded: JS-rendered page
- https://help.salesforce.com/s/articleView?id=data.c360_a_data_cloud_sandbox_consideration.htm -- Discarded: JS-rendered page (topic: sandbox considerations)
- https://help.salesforce.com/s/articleView?id=sf.c360_a_data_cloud_sandbox.htm -- Discarded: JS-rendered page (topic: Data Cloud in sandbox beta)
- https://help.salesforce.com/s/articleView?id=data.c360_a_datastream_dlo_refresh_history.htm -- Discarded: JS-rendered page (title confirms refresh history topic)
- https://help.salesforce.com/s/articleView?id=sf.dato_data_adv_streams_refresh.htm -- Discarded: JS-rendered page
- https://medium.com/@marketingcloudtips/data-cloud-full-refresh-for-crm-and-sfmc-data-streams-62b30ba01b10 -- Discarded: 403 Forbidden
- https://medium.com/@marketingcloudtips/data-cloud-local-file-upload-dab22b9dd918 -- Not fetched, referenced in search results for file size limits
- https://astreait.com/data-model-objects-in-salesforce-data-cloud/ -- Included: DMO creation steps, standard vs custom, deletion requirements
- https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-si-entity-interface-dmos-introduction.html -- Included: Standard DMO characteristics (non-editable, data space agnostic)
- https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-datamodelobjects.html -- Referenced in search results
- https://heichat.net/blogs/tbGE71MEV4E/Creating-Data-Streams-Using-Salesforce-CRM-Connector-%7C-Data-Cloud-Decoded/ -- Included: CRM data stream refresh cadences, detail page features, Data Explorer
- https://trailhead.salesforce.com/content/learn/modules/data-cloud-connectors-and-integrations/connect-and-map-data -- Included: Data stream creation, mapping, cardinality, category inheritance
- https://salesforcedictionary.com/how-to/data-model-object -- Included: Custom DMO creation steps, relationship definition steps
- https://davidpalencia.com/salesforce-data-cloud-data-modelling/ -- Included: Data modeling phases, Customer 360 model, consent model, best practices
- https://venkateshsfmc.medium.com/data-mapping-in-salesforce-data-cloud-data-360 -- Discarded: 403 Forbidden
- https://www.jthathapudi.com/blog/from-raw-to-ready-understanding-dsos-dlos-and-dmos-in-salesforce-data-cloud -- Included: DSO architecture, staging role
- https://www.salesforceben.com/salesforce-data-transforms-what-is-this-key-component-of-data-cloud/ -- Included: Batch vs streaming transforms, org limits, use cases
- https://trailhead.salesforce.com/content/learn/modules/streaming-data-transforms-quick-look/get-started-with-streaming-data-transforms-in-data-cloud -- Included: Streaming transform SQL capabilities, phone normalization example
- https://sfdcgym.com/understanding-data-transforms-in-data-cloud/ -- Included: Transform types, common use cases
- https://developer.salesforce.com/blogs/2025/02/introducing-local-file-upload-connector-in-data-cloud -- Included: CSV upload steps, file size limits, Beta connector enablement
- https://vagminecloud.com/how-to-set-up-email-alerts-for-salesforce-data-cloud-ingestion-failure/ -- Included: Proactive monitoring via Flows on Data Stream object
- https://gearset.com/blog/understanding-salesforce-data-cloud/ -- Included: DSO/DLO/DMO architecture descriptions
- https://ateko.com/en/blog/salesforce-data-cloud-model-explained/ -- Included: DMO categories, 89 standard DMOs, category inheritance
- https://salesforcechronicles.com/?p=1802 -- Discarded: page content did not render (CSS only)
- https://scandiweb.com/blog/data-ingestion-in-salesforce-data-cloud/ -- Discarded: page content did not render (CSS/fonts only)
- https://certempire.com/exam/data-cloud-consultant-exam-questions/question/15/ -- Referenced in search results: confirms formula field refresh behavior
- https://d5meta.com/data-transforms-in-salesforce-data-cloud/ -- Discarded: page content did not render
- https://ceptes.com/blogs/understanding-salesforce-data-cloud-architecture/ -- Discarded: 404 error
- https://trailhead.salesforce.com/content/learn/projects/create-a-data-stream-in-data-cloud/create-a-data-stream -- Discarded: 404 error
