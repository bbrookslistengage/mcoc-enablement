---
sidebar_position: 1
title: "Exploring Your Org"
description: "Tour the CRM data streams, DLOs, DMOs, and field mappings that the Marketing Data Kit auto-installed in your SDO."
---

## Overview

When you provisioned Data 360 in Getting Started, the Marketing Data Kit quietly set up a collection of CRM data streams, data lake objects, and data model objects in your org. This lesson is where you open the hood.

The [Introduction to Data 360](/introduction/intro-to-data-360) module gave you the vocabulary: data streams, DLOs, DMOs, relationships. You know what they are conceptually. Now you are going to see how they look in Data 360 Setup, how they connect to each other, and how data moves between them.

This is a tour, not a build. You are not creating anything new yet. You are exploring what already exists and understanding the mechanics that will matter for the rest of the course.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What CRM data streams look like in the Data 360 Setup UI
- How to manually refresh a data stream in an SDO
- The difference between a full refresh and an incremental refresh
- What data lake objects look like and how they relate to data streams
- Where DSOs fit in the architecture (and why you do not interact with them)
- How field mappings connect DLOs to DMOs
- How a single DLO can map to multiple DMOs

## Data streams in your org

Open **Data 360 Setup**. Navigate to **Data Streams**.

You should see a list of data streams that the Marketing Data Kit auto-installed when you provisioned Data 360 in <ModuleLink slug="getting-started" />. These are CRM data streams. They bring standard CRM objects (Contact, Account, and others) into Data 360.

<Screenshot src="/img/exploring-your-org/01-data-streams-list.png" alt="Data Streams list filtered to 'contact', showing Contact_Home with Salesforce CRM connector type, Ingest stream type, Success status, and 48,564 total records" />

Click into the **Contact_Home** data stream. This is the data stream that ingests your CRM Contact records.

The data stream detail page has three tabs: **Fields**, **Details**, and **Refresh History**. Together they show you everything about how this stream is configured and what it has done.

<Screenshot src="/img/exploring-your-org/01-contact-home-fields.png" alt="Contact_Home data stream Fields tab showing 134 fields, Object Category of Profile, and the Data Mapping sidebar showing 42 of 140 fields mapped with READY status" />

The **Fields** tab shows:

- **Data Properties area.** Object Category (Profile), Data Lake Object Name (`Contact_Home`), and Object API Name.
- **Field list.** All 134 fields this data stream tracks from the CRM Contact object.
- **Data Mapping sidebar.** The count of how many fields are mapped to DMOs (`42/140`) and the overall readiness status.

The **Details** tab shows configuration metadata: when the stream was created, its last run status, total record count, refresh frequency, and refresh mode.

<Screenshot src="/img/exploring-your-org/01-contact-home-details.png" alt="Contact_Home Details tab showing Data Stream Status Active, Last Run Status Success, Total Records 48,564, Frequency Batch, and empty Refresh Day and Hours fields" caption="The empty Refresh Day and Refresh Hours fields confirm that no scheduled full refresh is configured in this SDO." />

The **Refresh History** tab is a log of every refresh that has run. Each row shows the refresh mode (Upsert or Total Replace), duration, status, and record counts.

<Screenshot src="/img/exploring-your-org/01-contact-home-refresh-history.png" alt="Contact_Home Refresh History tab showing 50 Upsert refreshes all with Success status and 0 records processed" caption="All-zero record counts are normal. Incremental refreshes only process records whose LastModifiedDate changed since the last run. If nothing changed, nothing is processed." />

Look at the refresh status. When was this data stream last refreshed? Is there a scheduled refresh configured?

:::warning
SDOs auto-refresh CRM data streams, but the cadence may not be fast enough when you are actively working. When you create or update a CRM record and want Data 360 to pick up the change immediately, click **Refresh Now** on the relevant data stream rather than waiting for the next automatic refresh. You will use this frequently throughout the course.
:::

<Screenshot src="/img/exploring-your-org/01-refresh-now-button.png" alt="Contact_Home header with the Refresh Now button highlighted in a red circle" />

### Full refresh vs incremental refresh

There are two types of data stream refresh, and they behave very differently.

**Incremental refresh (upsert)** only brings in records where the `LastModifiedDate` changed since the last refresh. If you updated 5 contacts out of 48,000, only those 5 records are re-ingested. This is the default behavior when you click **Refresh Now**. In a production org, CRM data streams run incremental refreshes [every 10 minutes in batch mode](https://help.salesforce.com/s/articleView?id=data.c360_a_data_stream_schedule.htm&type=5). If the data stream is eligible for streaming mode (CDC-enabled object, no formula fields, no filters), changes reflect with near-real-time latency. See [CRM Connector Streaming](https://help.salesforce.com/s/articleView?id=data.c360_a_crm_connector_streaming.htm&type=5) for the eligibility requirements.

**Full refresh** removes all existing data in the DLO and re-ingests every record from the source. It rebuilds from scratch. Full refresh is [disabled by default](https://help.salesforce.com/s/articleView?id=data.c360_a_crm_data_full_refresh_interval.htm&type=5) for new data streams. You can configure a periodic full refresh interval of 10, 25, or 50 days, or leave it set to None. You can also trigger a full refresh manually.

:::warning
Formula fields and incremental refresh interact in a way that catches people off guard. If a record's own `LastModifiedDate` updates, formula fields on that record ARE recalculated during the incremental refresh. The problem arises when a formula references a field on a *related* record that changed, but the formula record's own `LastModifiedDate` did not update. In that case, the incremental refresh misses the stale formula value. A full refresh picks it up. Also note: formula fields [disqualify a data stream from streaming mode](https://help.salesforce.com/s/articleView?id=data.c360_a_crm_connector_streaming.htm&type=5), forcing it into batch mode.
:::

When would you use each?

- **Incremental** is the normal operating mode. It is fast and only processes what changed.
- **Full refresh** is needed after changes to identity resolution rulesets, after formula field definition changes on the data stream itself, or any time you suspect incremental refreshes have missed records.

### Credit consumption

CRM connector data streams do not consume ingestion credits. This applies to both incremental and full refresh. For non-CRM data streams (like the CSV streams you create later in this course), incremental refresh incurs credit consumption only for updated records, while full refresh incurs cost for all source records. See [Data 360 Credit Consumption (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-credit-consumption-quick-look/get-started-with-data-cloud-credit-consumption) for the full breakdown.

### Record deletion behavior

Full refresh replaces all destination data, which naturally removes records deleted in the source. For CRM data streams specifically, the connector also detects deletions during incremental refresh. Deleted records are processed in the next incremental cycle.

For non-CRM data streams using upsert mode, incremental upsert does not remove records that were deleted in the source. Only a full refresh (or re-uploading the full dataset) clears out deleted records.

## Data lake objects

Navigate to **Data Lake Objects** in the top nav.

<Screenshot src="/img/exploring-your-org/01-dlo-list.png" alt="Data Lake Objects list view showing 50+ DLOs sorted by name, with columns for Category, Storage, Data Lake status, Last Updated On, Total Records, and Total Fields" />

Find the DLO associated with the Contact data stream - it is named `Contact_Home` - and click into it.

<Screenshot src="/img/exploring-your-org/01-contact-home-dlo-detail.png" alt="Contact_Home DLO detail page showing Category Profile, Status Active, 551 Total Records, Linked Data Stream Contact_Home, and a field list with 155 fields" caption="Notice the DLO shows 155 fields - more than the 134 on the data stream. The DLO also stores platform system fields that are not part of the source object." />

As you learned in [Introduction to Data 360](/introduction/intro-to-data-360), a DLO is a raw representation of the source data. The field names and structure mirror what the source system sent. Look at the fields on this DLO. They should look familiar if you know the Contact object in CRM.

DLOs persist and accumulate data over time. They are not temporary staging areas. But you rarely interact with them directly after the initial setup. They sit underneath the data model, holding the raw data that DMOs reference.

### Where do DSOs fit?

You may encounter references to DSOs (Data Source Objects) in documentation or community posts. DSOs are an internal storage layer that sits beneath DLOs in the Data 360 architecture:

**DSO** (internal, raw ingestion) → **DLO** (user-visible, persistent raw data) → **DMO** (virtual structured view)

DSOs capture an exact copy of incoming data with little or no modification. They are a back-end staging layer. You do not interact with them directly. They are not visible in the Data 360 Setup UI. Some data sources skip the DSO stage entirely and appear directly as DLOs.

The reason this matters: if you see "DSO" in older blog posts or architecture diagrams, now you know where it fits. For day-to-day implementation work, DLOs and DMOs are what you work with.

## Field mappings and DMO relationships

From the `Contact_Home` DLO detail page, look at the **Data Mapping** sidebar on the right. Click **Review** to open the field mappings screen.

The mapping screen shows how source fields (from the DLO) connect to target fields (on DMOs). This is the bridge between raw ingested data and the structured data model.

Here is the key thing to observe: the Contact DLO maps to more than one DMO. It maps fields to the **Individual** DMO (name fields, identifiers) and to the **Contact Point Email** DMO (email address). One DLO, multiple DMO targets. This is Data 360 breaking apart a flat source record into a normalized data model.

<Screenshot src="/img/exploring-your-org/01-contact-home-mappings.png" alt="Contact_Home Mappings screen showing source fields on the left connected by lines to three DMO targets on the right: Account Contact, Individual, and Contact Point Address" caption="One DLO, multiple DMO targets. The lines show which source fields map to which DMO fields." />

:::tip[Coming from MCE?]
In MCE, Contact Builder is an optional metadata layer that links data extensions to the contact record. It enables Audience Builder segmentation and Contact Data access in decision splits. Many MCE practitioners bypass Contact Builder entirely and use SQL queries in Automation Studio instead.

In MCA, DMO relationships are not optional. Segmentation, activation, and personalization all query DMOs directly. There is no SQL workaround and no need for one. Think of it this way: Contact Builder was a way to describe your data to MCE. In MCA, the data model *is* the platform.
:::

### Touring the existing DMOs

Navigate to **Data Model** in the top nav.

<Screenshot src="/img/exploring-your-org/01-data-model-canvas.png" alt="Data Model list view showing 93 mapped DMOs with columns for Object Label, Object API Name, Category, Data Streams, Data Lake Objects, Data Space, Type, and Status" />

You should see the DMOs that the Marketing Data Kit set up. Look at these three:

- **Individual** - Maps from CRM Contact. Holds person-level fields like name and identifiers.
- **Contact Point Email** - Maps from CRM Contact (specifically the email field). Holds email addresses tied to individuals.
- **Account** - Maps from CRM Account. Holds account-level information.

Click into the **Individual** DMO to see its detail page.

<Screenshot src="/img/exploring-your-org/01-individual-dmo-detail.png" alt="Individual DMO detail page showing Type Standard, Object Status Ready, 12 mapped data streams, 13 mapped data lake objects, Category PROFILE, and a Relationships tab" />

Standard DMOs have several advantages over custom DMOs:

- **Pre-defined fields and non-editable API names.** The schema is consistent across every Data 360 org.
- **Automatic relationships.** Standard DMOs come with built-in relationships that activate once there is at least one mapping between the related DMOs. You do not need to wire these up manually.
- **Category inheritance.** DMOs inherit their category (Profile, Engagement, or Other) from the first DLO mapped to them. Standard DMOs of the Profile category (like Individual) are pre-configured for segmentation.
- **Regular updates.** Salesforce expands standard DMO fields over time.

You will work more with DMOs in the remaining lessons of this module. For now, the goal is to see how data streams, DLOs, and DMOs connect in practice.

### The Unified Individual is the target

As you explore the data model, keep one thing in mind: MCA operates on Unified Individuals. Under almost every circumstance, you need a Unified Individual to send to. The Individual DMO holds source records from your CRM contacts, but MCA sends to the Unified Individual that identity resolution creates by matching and merging those source records.

This means two things must happen before a person is reachable in MCA: their profile data must be ingested (through the data streams you are looking at now), and they must run through identity resolution to become a Unified Individual. You will configure identity resolution in a later lesson, but keep this dependency in mind as you explore. Data ingestion alone is not enough.

## Assignment

1. Open the Contact_Home data stream in **Data Streams**. Document what you see on each tab (Fields, Details, Refresh History).
2. Navigate from the Contact_Home data stream to its associated DLO. Note the DLO name and scan its fields.
3. From the DLO, open the field mappings via the Data Mapping sidebar. Identify which DMOs the Contact_Home DLO maps to.
4. Find at least one example of a single DLO mapping to multiple DMOs. Document which DLO it is and which DMOs it maps to.
5. Manually refresh the Contact_Home data stream by clicking **Refresh Now**. Note how long the refresh takes to complete.
6. Open the **Data Model** view and browse the existing DMOs. Identify which ones are standard and which relationships are already defined.

## Success criteria

- [ ] You can navigate to the Data Streams list in Data 360 Setup
- [ ] You have opened the Contact_Home data stream detail page and can describe what each tab shows
- [ ] You have identified at least one DLO that maps to multiple DMOs
- [ ] You have manually refreshed a data stream and confirmed it completed
- [ ] You have browsed the existing DMOs in the Data Model view

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between a full refresh and an incremental refresh?
- Why do you need to manually refresh data streams in an SDO?
- How does a DLO relate to its source data stream?
- Can a single DLO map to more than one DMO? Give an example from your org.
- When can incremental refresh miss a formula field change?
- How does the Contact DLO's mapping to multiple DMOs relate to LEOptical's need for a unified customer view?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Data 360 Connectors and Integrations: Connect and Map Data (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-connectors-and-integrations/connect-and-map-data) - Covers data stream creation, field mapping, DMO relationships, and category inheritance. Good reference for the mapping concepts introduced here.
- [Creating Data Streams Using Salesforce CRM Connector (HeiChat)](https://heichat.net/blogs/tbGE71MEV4E/Creating-Data-Streams-Using-Salesforce-CRM-Connector-%7C-Data-Cloud-Decoded/) - Detailed walkthrough of CRM data stream creation and refresh schedules.
- [From Raw to Ready: DSOs, DLOs, and DMOs (Jayanth Thathapudi)](https://www.jthathapudi.com/blog/from-raw-to-ready-understanding-dsos-dlos-and-dmos-in-salesforce-data-cloud) - Deeper look at the three-layer architecture (DSO, DLO, DMO) if you want more context on how data flows through each layer.
