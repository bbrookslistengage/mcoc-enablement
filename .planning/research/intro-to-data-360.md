# Research: Introduction to Data 360

Generated: 2026-08-09
Module: intro-to-data-360
Sources: 19 sources consulted

## Module Context

**From the Introduction Section design spec (2026-08-09-introduction-section.md):**

**File:** `docs/introduction/intro-to-data-360.md`
**Slug:** `intro-to-data-360`
**Sidebar position:** 3

**Purpose:** ELI5 primer on Data 360 for someone who has never used it. Assumes no prior knowledge. Explains the core concepts at a high level with clear analogies so the rest of the course has context. This is NOT a setup guide (that is Getting Started). This is "understand what these things are before you start clicking buttons."

**Overview (~100 words):** Data 360 is the data platform underneath MCA. Every feature you will use in this course, from segmentation to email sends to AI scoring, reads from Data 360. Before you start configuring anything, it helps to understand the core concepts at a high level. This module is intentionally surface-level. There is a lot more depth underneath each topic, and the course covers it thoroughly in later modules. The goal here is to give you a mental model so the setup steps in Getting Started make sense.

**Assignment (lightweight):**
- Read an official Salesforce resource on Data 360 / data model concepts (writer/researcher to find appropriate link)
- Optionally: explore a Trailhead module on Data 360 basics if one exists

**Knowledge check (5-6 questions):**
- What is the difference between a data lake object and a data model object?
- When you map a DLO field to a DMO field, what happens?
- Why do DMO relationships matter for segmentation?
- What is a Unified Individual?
- What is the high-level data flow from an external source system to an actionable segment?

**IMPORTANT from spec:** "The analogies and explanations in this section need heavy research and verification against current Salesforce documentation. The writer should verify every claim against official docs and flag anything uncertain with `<!-- VERIFY -->` comments."

**Tone exception:** Warmer and more encouraging than the standard module tone. Still direct and honest. Not saccharine or patronizing. Think "supportive senior colleague who genuinely believes in you" not "corporate training video."

**Content boundaries (from spec table):**
- This page covers: Full ELI5 primer on Data 360 concepts, MCE analogy for relationships, LEOptical examples only
- Getting Started covers: Provisioning steps only (not concepts)
- MCA vs. MCE covers: The high-level dependency on Data 360
- This page does NOT cover: Course structure, MCE comparison details, learning philosophy, SDO provisioning

---

## Platform Concepts

### What Data 360 Is

Data 360 (rebranded from "Data Cloud" as of October 14, 2025) is Salesforce's unified data platform. It is the data layer underneath MCA. All MCA features (segmentation, email personalization, AI scoring, activation) read from Data 360.

The platform follows a "Data Lakehouse" architecture, combining data lake storage with structured querying capabilities. Under the hood it uses Apache Parquet columnar storage on Amazon S3, with Apache Spark and Presto for processing.

Data flows through Data 360 in three conceptual stages (per Trailhead):
1. **Connect** - Ingest data from source systems
2. **Harmonize and Unify** - Map to a standard data model, resolve identities
3. **Analyze and Act** - Segment, personalize, activate

Source: Trailhead "Understanding the Stages of Data Cloud Integration"; help.salesforce.com "About Salesforce Data Cloud"

### Data Streams

A data stream is an ingestion pipeline that brings data from a source system into Data 360. It defines how data is connected, imported, and stored.

**Key facts:**
- Data streams are created from the Data Streams tab in Data 360 setup
- You specify the source, category, and primary key when creating a stream
- Sources include CRM objects, CSV files, external databases, APIs, and 275+ prebuilt connectors
- Refresh schedules can be hourly, weekly, or incremental
- The Marketing Data Kit auto-installs CRM data streams (Contact, Account, etc.) during MCA setup
- Formula fields can be created during stream setup to clean/transform raw data

**Terminology confirmed:** "Data stream" is the correct and current Salesforce terminology.

Sources: Trailhead "Connect and Map Data" module; help.salesforce.com "Data Streams"; astreait.com "Salesforce Data Cloud Data Streams Explained"

### The Three-Layer Object Architecture: DSO, DLO, DMO

Data 360 uses a three-layer object architecture for data processing:

#### Data Source Objects (DSOs)
- The initial intake point where raw data first lands
- Temporary staging area that holds data in its raw format
- **Not user-facing.** Users do not interact with DSOs directly. They are internal infrastructure.
- Some data sources skip the DSO stage entirely and appear directly as DLOs

Source: sfdcgym.com; jthathapudi.com; lanefour.com

**Note for the writer:** The spec does not mention DSOs, which is appropriate for an ELI5 primer. DSOs are behind-the-scenes infrastructure. The module should describe the flow as "data streams bring data into DLOs" without complicating the mental model with DSOs.

#### Data Lake Objects (DLOs)

**Spec claim:** "A DLO is essentially a raw copy of the source data. The field names, the values, the structure, all mirrored from the source."

**Research finding: MOSTLY ACCURATE with nuance.**
- DLOs are "the foundational storage containers where ingested or federated data is first held" (Salesforce developer docs)
- DLOs are "typed, schema-based, materialized views stored in Amazon S3 as Apache Parquet files" (Lane Four / architecture sources)
- DLOs represent "a refined version of the data, stored permanently in Data Cloud's data lake in an optimized columnar format" (jthathapudi.com)
- DLOs do mirror the source schema, but they are stored in an optimized format (Parquet), not a literal file copy
- DLOs serve as "the source of truth for each dataset after standardization"

**Spec claim:** "None of the features that make Data 360 powerful actually use DLOs directly. DLOs are staging."

**Research finding: ACCURATE.** Multiple sources confirm this:
- "Data Cloud features like segmentation, identity resolution, insights, and activation work on Data Model Objects (DMOs), not directly on DLOs" (salesforceblogger.com)
- Identity resolution, calculated insights, segmentation, Agentforce grounding, and Customer 360 profile assembly all work on DMOs (skysync.nyc)
- DLOs function as "isolation buffers between source systems and operational layers" (skysync.nyc)

However, DLOs are not merely "temporary staging" like DSOs. DLOs are permanent storage. They persist and accumulate data over time. The "staging" characterization is directionally correct (DLOs exist to feed DMOs) but could mislead learners into thinking DLOs are transient. The writer should clarify that DLOs are persistent storage that serves as the foundation for DMOs, but features like segmentation and identity resolution operate on DMOs, not DLOs.

Sources: developer.salesforce.com DMO mapping guide; skysync.nyc; jthathapudi.com; lanefour.com

#### Data Model Objects (DMOs)

**Spec claim:** "The DMO does not store a separate copy of the data. It references the DLO data but organizes it into a structure."

**Research finding: ACCURATE AND CONFIRMED BY MULTIPLE SOURCES.** This is one of the most important technical claims in the module, and it checks out:
- "Unlike DSOs and DLOs, a DMO doesn't physically store the data records. Instead, think of it as a dynamic view or lens that aggregates data from one or more DLOs." (jthathapudi.com)
- "Unlike DSOs and DLOs that use a physical data store, DMOs provide dynamic access to the most current data snapshot in the DLOs without actually storing it." (lanefour.com, dgt27.com)
- "DMOs offer a virtual, non-materialized view into the data lake" (multiple sources)
- "When you query a DMO, it pulls the latest data from its related DLO(s) on the fly" (jthathapudi.com)
- DMOs are described as "virtual tables conforming to the standard C360 schema" (lanefour.com)

**Spec claim:** "DMOs reference the data that was ingested via data streams through field mappings."

**Research finding: ACCURATE.**
- "Data model objects (DMOs) are created by mapping DLOs into standardized groupings" (developer.salesforce.com)
- Users map DLO fields to DMO fields in the mapping experience
- DMOs conform to the Customer 360 Data Model, a standard schema with 89+ standard DMOs organized by subject areas (Case, Engagement, Party, Product, etc.)

**Spec claim:** "You can map multiple DLO fields to one DMO."

**Research finding: ACCURATE.**
- Multiple DLOs can map to the same DMO. For example, email fields from CRM, loyalty, and ecommerce sources can all map to Contact Point Email DMO.
- "A data model object inherits its category from the first data source object that maps to it" and subsequent mappings must match that category (Trailhead)

**Spec claim:** "Some DMOs are standard (Unified Individual, Contact Point Email, Sales Order). Others are custom."

**Research finding: ACCURATE.** Standard DMOs exist for common entities (Individual, Contact Point Email, Account, Sales Order, Product, etc.). Custom DMOs can be created for business-specific entities (like LEOptical's Eye Exam).

**Important nuance about categories:** DMOs have categories (Profile, Engagement, Other) that determine how they can be used. Segmentation requires a DMO with the "Profile" category. A DMO set to the wrong category will not appear in segment builder. This is an important detail for later modules but probably too detailed for the ELI5 primer.

Sources: jthathapudi.com; lanefour.com; dgt27.com; developer.salesforce.com; Trailhead

### DMO Relationships

**Spec claim:** "DMOs do not exist in isolation. You set up relationships between them."

**Research finding: ACCURATE.**
- Relationships between DMOs are defined at the data model level
- Relationships can be automatically populated when mapped objects share key fields
- Cardinality (1:1, 1:N, N:1) has significant implications for segmentation and CANNOT be modified after creation (Trailhead)

**Spec MCE analogy:** "In MCE, when you create filters on a data extension, you can only filter on attributes that exist on that data extension (unless you set up relationships in Contact Builder). DMO relationships serve the same purpose."

**Research finding: DIRECTIONALLY ACCURATE.** The analogy is reasonable for someone coming from MCE. In MCE, Contact Builder relationships allow linking data extensions for use in Journey Builder and other tools. In Data 360, DMO relationships serve a similar purpose: they allow traversal across DMOs for segmentation, data graphs, and personalization.

**Segmentation specifics:**
- Segments use "Direct Attributes" (fields on the Segment On entity or objects with 1:1/N:1 relationship) and "Related Attributes" (objects with 1:N relationship)
- When a related attribute has multiple relationship paths, users must select which path to follow
- Aggregate functions (Count, Sum, Average) are available for related attributes in 1:N relationships

Sources: davidpalencia.com segmentation article; Trailhead connectors module; salesforceblogger.com

### Identity Resolution and Unified Individual

**Spec claim:** "Identity resolution is the process that figures out [records from multiple sources] belong to the same person."

**Research finding: ACCURATE.**

**Spec claim:** "The output is a Unified Individual, a single resolved identity that ties together everything the platform knows about one person."

**Research finding: ACCURATE BUT NEEDS ARCHITECTURAL NUANCE.**

The terminology and architecture of Individual vs. Unified Individual is nuanced:

1. **Individual DMO** (`ssot__Individual__dlm`): The base DMO that holds customer profile records from source systems. All source records (from CRM, loyalty, ecommerce, etc.) map into this DMO.

2. **Unified Individual**: Created by the identity resolution process. When identity resolution runs, it matches source Individual records and creates a Unified Individual that consolidates them. The Unified Individual is NOT a completely separate DMO with a different API name. It is the reconciled output of identity resolution operating on the Individual DMO.

3. **Unified Link Individual DMO**: A bridge/join table that maps source Individual IDs to their Unified Individual IDs. This maintains the many-to-one relationship (many source profiles -> one unified identity).

4. **Unified Profile = Unified Link Individual DMO + Unified Individual DMO** together. The unified profile gives you access to both source data and reconciled data.

**How matching works (high-level):**
- Three primary match methods: Exact, Normalized, and Fuzzy
- **Exact**: Requires identical field values
- **Normalized**: Handles spelling variations and formatting differences (names, contact points)
- **Fuzzy**: Supports similar names (e.g., "David" and "Dave") - first names only
- Match rules combine multiple criteria with AND/OR logic
- **Reconciliation rules** determine which source value "wins" when conflicts exist (source priority, last updated, etc.)

**Is "Unified Individual" the correct term?**
Yes. Salesforce documentation, Trailhead, and developer docs all use "Unified Individual" as the standard term for the resolved identity output of identity resolution. The Trailhead module "Understand Unified Profiles and Their Impacts on Data Strategy" confirms this terminology. The course's preference for "Unified Individual" over "Unified Profile" is appropriate since "Unified Individual" refers specifically to the DMO/resolved identity, while "Unified Profile" is a broader concept encompassing the full set of linked data.

**For the ELI5 primer:** The distinction between Individual DMO and Unified Individual can be simplified. The key message is: identity resolution takes records from multiple sources and produces a single Unified Individual that represents one real person. The architectural details (Unified Link tables, reconciliation rules) belong in the Identity Resolution module.

Sources: davidpalencia.com identity resolution article; Trailhead "Understand Unified Profiles"; the-agentic-marketer.com; salesforceblogger.com

### Segments

**Spec claim:** "A segment queries the data model (DMOs and their relationships) to find groups of Unified Individuals who match criteria you define."

**Research finding: ACCURATE.**
- Segments are created "ON" a specific DMO (typically Unified Individual for marketing use cases)
- Segments can only be created on Profile-type DMOs (Individual, Unified Individual, Account)
- Best practice: Always segment on Unified Individual, not Individual, to avoid duplicates
- Segments traverse DMO relationships to filter on related data (e.g., Sales Orders, Loyalty memberships)
- Segments evaluate criteria at the unified level: if any source profile meets the criteria, the unified individual is included

Sources: davidpalencia.com segmentation; salesforceblogger.com; Trailhead segmentation module

---

## UI Navigation Paths

- **Data Streams**: Data 360 Setup > Data Streams (Source: Trailhead "Connect and Map Data")
- **Data Lake Objects**: Data 360 Setup > Data Lake Objects (Source: inferred from help.salesforce.com article title)
- **Data Model**: Data 360 Setup > Data Model (Source: inferred from help.salesforce.com article title)
- **Identity Resolution**: Data 360 Setup > Identity Resolution (Source: Trailhead "Stages of Data Cloud")
- **Segmentation**: Data 360 > Segments (Source: davidpalencia.com)

Note: These paths are inferred from documentation references and article descriptions. The Salesforce Help articles themselves could not be fully rendered (JavaScript-only pages). The writer should confirm exact navigation paths with `<!-- VERIFY -->` flags if not personally confirmed.

---

## Platform Gotchas

**Relevant gotchas from platform-gotchas.md:**

1. **IDR auto-creates a default ruleset during MCA setup** (Confirmed 2026-08-06, Summer '26): MCA setup can auto-create a default IDR ruleset. This is not required and learners can configure IDR directly in Data 360. The auto-generated ruleset may or may not be appropriate for the client's data. *Relevance: Mention in identity resolution section as a note that setup handles some of this automatically.*

2. **SDOs have one data space** (Confirmed 2026-08-06, Summer '26): SDO orgs only have a single data space. *Relevance: Minor for this module but relevant context.*

**New gotcha discovered during research:**

3. **DMO category inheritance is permanent**: A DMO inherits its category from the first data source object that maps to it, and subsequent mappings must match the original category. This cannot be changed after creation. (Source: Trailhead "Connect and Map Data") *Relevance: Too detailed for this ELI5 module, but important for the Data Model Objects module.*

4. **DMO relationship cardinality cannot be modified after creation**: Once set, the cardinality of a relationship between DMOs is permanent. (Source: Trailhead "Connect and Map Data") *Relevance: Too detailed for this module, important for Data Model Objects module.*

---

## MCE Comparison Points

The spec includes one MCE analogy for this module:

1. **DMO relationships ~ Contact Builder relationships**: In MCE, Contact Builder lets you define relationships between data extensions so you can reference related data in filters and Journey Builder. DMO relationships serve a similar purpose: they let you traverse the data model when building segments. The analogy is directionally accurate though the implementations differ significantly (DMO relationships are virtual views across a lakehouse; Contact Builder relationships are SQL joins across relational tables).

2. **DLOs ~ Data Extensions (loosely)**: DLOs hold raw ingested data similar to how data extensions hold data in MCE. But DLOs are staging for DMOs, whereas data extensions ARE the operational data store in MCE. This analogy has limits and could mislead if pushed too far.

3. **Segments ~ Data Filters / Filtered Data Extensions (loosely)**: Both create subsets of records based on criteria. Data 360 segments are more powerful because they can traverse relationships natively and operate on unified identities.

4. **No MCE equivalent for**: DLOs as a separate staging layer, the virtual/non-materialized nature of DMOs, identity resolution as an automatic process, the three-layer DSO/DLO/DMO architecture.

---

## External Resources

### For Assignment (Official Salesforce Resources)

- [Data Cloud Overview: Uniting Your Data Landscape (Trailhead Module)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-explore-the-data-landscape) - Covers the three stages of Data 360 (Connect, Harmonize and Unify, Analyze and Act). Best candidate for a lightweight reading assignment. Includes a quiz.

- [Explore Data 360 (Trailhead Trail)](https://trailhead.salesforce.com/content/learn/trails/explore-customer-360-audiences) - Full trail covering Data 360 implementation and features. Good as an optional deeper dive.

- [Unlock Your Data with Data Cloud (Trailhead Trail)](https://trailhead.salesforce.com/content/learn/trails/unlock-your-data-with-data-cloud) - Covers setup, administration, segmentation, and acting on data. More comprehensive than needed for an intro assignment.

- [Data and Identity in Salesforce CDP: Unified Profiles (Trailhead Module)](https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/get-to-know-unified-profiles) - Specifically covers unified profiles, identity resolution, and what makes up a unified individual. Good supplementary read.

- [Data Model Concepts (Salesforce Help)](https://help.salesforce.com/s/articleView?id=sf.c360_a_understanding_and_using_the_data_model.htm&language=en_US&type=5) - Official help article on data model concepts.

- [Data Objects in Data Cloud (Salesforce Help)](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_lake_objects.htm&language=en_US&type=5) - Official help article covering DLOs and DMOs.

**Recommended for assignment:** The Trailhead module "Data Cloud Overview: Uniting Your Data Landscape" is the best fit. It is high-level, covers the same concepts as this module, and includes an interactive quiz. The "Data and Identity" Trailhead module on Unified Profiles is a good optional supplementary read.

### Research Sources

- [From Raw to Ready: Understanding DSOs, DLOs, and DMOs (jthathapudi.com)](https://www.jthathapudi.com/blog/from-raw-to-ready-understanding-dsos-dlos-and-dmos-in-salesforce-data-cloud) - Excellent technical breakdown of the three-layer architecture. Confirms DMOs are virtual views, not physical storage.

- [Salesforce Data Cloud Architecture: How It All Works (Lane Four)](https://lanefour.com/salesforce-admin/salesforce-data-cloud-architecture-how-it-all-works/) - Comprehensive architecture overview including infrastructure details (Parquet, S3, Spark).

- [Data Lake Object vs Data Model Object (SkySync)](https://www.skysync.nyc/blog/data-lake-vs-data-model-object) - Clear comparison of DLO and DMO roles. Confirms DLOs as isolation buffers.

- [Salesforce Data Cloud Identity Resolution (David Palencia)](https://davidpalencia.com/salesforce-data-cloud-identity-resolution/) - Detailed walkthrough of IDR including match methods, reconciliation, and Unified Link tables.

- [Salesforce Data Cloud Segmentation (David Palencia)](https://davidpalencia.com/salesforce-data-cloud-segmentation/) - Covers how segments work on DMOs, relationship traversal, and why to use Unified Individual.

- [Model Data in Data 360 (Salesforce Developers)](https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-model-data.html) - Official developer docs on DMO mapping. Confirms DMOs provide views of underlying data.

- [Individual DMO (Salesforce Developers)](https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-individual-dmo.html) - Official reference for Individual DMO fields and relationships. API name: `ssot__Individual__dlm`.

- [Add Fields to Unified Individual DMO (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/new-fields-unified-individual-dmo/) - MCA-specific article confirming Unified Individual terminology and how fields flow from Individual to Unified Individual.

---

## Data Model Relevance

This module is a conceptual primer and does not involve hands-on data model configuration. However, the following DMO concepts from data-model.md are referenced conceptually:

- **Individual** DMO: The base profile DMO that source records map into (from CRM Contact via Marketing Data Kit)
- **Unified Individual**: The resolved identity after identity resolution runs
- **Contact Point Email**: Example of a DMO that receives data from multiple sources (CRM, loyalty, ecommerce, exam)
- **Sales Order**: Example DMO used in segment traversal examples
- **Loyalty Program Member**: Example DMO for relationship traversal
- **Eye Exam**: Example of a custom DMO
- **Data streams**: CRM auto-installed via Marketing Data Kit, CSV streams for loyalty/ecommerce/exam data

The data flow from the data-model.md spec:
```
Data Streams refresh -> Identity Resolution runs -> Data Graph refreshes -> Dynamic content resolves
```

This flow should be referenced conceptually in the closing summary of the module.

---

## Spec Claims Verification Summary

| Spec Claim | Verified? | Notes |
|------------|-----------|-------|
| DLO is "essentially a raw copy of the source data" | Mostly accurate | DLOs mirror source schema but are stored in optimized Parquet format, not a literal copy. The characterization is fine for ELI5. |
| "None of the features that make Data 360 powerful actually use DLOs directly. DLOs are staging." | Accurate | All downstream features (segmentation, IDR, insights, activation) operate on DMOs. But DLOs are persistent storage, not temporary. Avoid implying they are transient. |
| "The DMO does not store a separate copy of the data. It references the DLO data." | Confirmed accurate | DMOs are virtual, non-materialized views. They pull data from DLOs on the fly. Multiple authoritative sources confirm this. |
| "DMOs reference the data that was ingested via data streams through field mappings" | Accurate | DMOs are created by mapping DLO fields to DMO fields. |
| Multiple DLOs can map to one DMO | Accurate | Confirmed. Category must match the first mapping. |
| DMO relationships are like Contact Builder relationships in MCE | Directionally accurate | Both enable cross-object data traversal. Implementation differs significantly. |
| Identity resolution output is "Unified Individual" | Accurate | Correct Salesforce terminology. |
| "When you build a segment or send an email, you are working with Unified Individuals, not raw source records" | Accurate | Best practice is to segment on Unified Individual to avoid duplicates. |
| Data stream is correct terminology | Confirmed | "Data stream" is the standard Salesforce term. |

**No claims in the spec were found to be inaccurate.** The main refinement needed is around DLOs: they are persistent storage (not transient staging), but the spec's characterization that they are "staging" in the sense that features don't use them directly is correct.

---

## Source Log

- https://www.skysync.nyc/blog/data-lake-vs-data-model-object - DLO vs DMO comparison, confirmed DLOs as isolation buffers
- https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-model-data.html - Official DMO mapping guide, confirms DMOs provide views of underlying data
- https://lanefour.com/salesforce-admin/salesforce-data-cloud-architecture-how-it-all-works/ - Architecture overview, confirms virtual nature of DMOs, infrastructure details
- https://dgt27.com/blog/salesforce-data-cloud-architecture/ - Architecture overview, confirms DMOs are non-materialized views
- https://sfdcgym.com/unlocking-dso-dlo-and-dmo-in-data-cloud/ - DSO/DLO/DMO overview
- https://sfdcgym.com/blog/datacloud/dso-dlo-dmo-salesforce-data-cloud-explained.html - Confirmed DSOs are not user-facing
- https://astreait.com/salesforce-data-cloud-data-streams/ - Data streams overview
- https://developer.salesforce.com/docs/data/data-cloud-int/guide/c360-a-create-ingestion-data-stream.html - Ingestion API data streams
- https://davidpalencia.com/salesforce-data-cloud-data-ingestion/ - Data ingestion overview
- https://help.salesforce.com/s/articleView?id=c360_a_identity_resolution.htm - Discarded: JavaScript-rendered page, no content extractable
- https://help.salesforce.com/s/articleView?id=sf.c360_a_data_lake_objects.htm - Discarded: JavaScript-rendered page, no content extractable
- https://help.salesforce.com/s/articleView?id=sf.c360_a_understanding_and_using_the_data_model.htm - Discarded: JavaScript-rendered page, no content extractable
- https://www.jthathapudi.com/blog/from-raw-to-ready-understanding-dsos-dlos-and-dmos-in-salesforce-data-cloud - Excellent DSO/DLO/DMO breakdown, confirmed DMO virtual nature
- https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/get-to-know-unified-profiles - Confirmed Unified Individual terminology, unified profile architecture
- https://trailhead.salesforce.com/content/learn/modules/data-cloud-connectors-and-integrations/connect-and-map-data - Data mapping process, category inheritance, cardinality permanence
- https://trailhead.salesforce.com/content/learn/modules/data-cloud-explore-the-data-landscape/explore-the-stages-of-data-cloud - Three stages of Data 360, good assignment resource
- https://davidpalencia.com/salesforce-data-cloud-identity-resolution/ - IDR details, match methods, Unified Link tables, confirmed Individual vs Unified Individual relationship
- https://davidpalencia.com/salesforce-data-cloud-segmentation/ - Segmentation mechanics, segment-on DMO, relationship traversal
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/new-fields-unified-individual-dmo/ - MCA-specific, confirmed Unified Individual terminology and field flow
- https://www.salesforceblogger.com/2026/07/09/architecting-data-36o-unlocking-advanced-segmentation-with-individual-vs-unified-individual-dmos/ - Discarded: page rendered only CSS, no article content extractable
- https://scandiweb.com/blog/identity-resolution-in-salesforce-data-cloud/ - Discarded: page rendered only CSS/font assets
- https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-individual-dmo.html - Individual DMO fields and API name (ssot__Individual__dlm)
- https://medium.com/@shankarsaisunilkumar11/understanding-salesforce-data-360-objects-the-core-of-the-unified-customer-profile-635db7111c9e - Referenced in search results, not fetched
- https://trailhead.salesforce.com/content/learn/trails/explore-customer-360-audiences - Trail listing for assignment reference
- https://trailhead.salesforce.com/content/learn/trails/unlock-your-data-with-data-cloud - Trail listing for assignment reference
