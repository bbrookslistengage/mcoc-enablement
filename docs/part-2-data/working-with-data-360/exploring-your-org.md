---
sidebar_position: 1
title: "Exploring Your Org"
description: "Tour the CRM data streams, DLOs, DMOs, and field mappings that the Marketing Data Kit auto-installed in your SDO."
---

## Overview

When you provisioned Data 360 in Getting Started, the Marketing Data Kit quietly set up a collection of CRM data streams, data lake objects, and data model objects in your org. You have not looked at any of them yet. This subpage is where you open the hood.

The [Introduction to Data 360](/introduction/intro-to-data-360) module gave you the vocabulary: data streams, DLOs, DMOs, relationships. You know what they are conceptually. Now you are going to see what they actually look like in the Data 360 Setup UI, how they connect to each other, and how data moves between them.

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

{/* VERIFY: Is the navigation path Data 360 Setup > Data Streams, or is it Setup > Data 360 > Data Streams. Confirm in SDO. */}

You should see a list of data streams that the Marketing Data Kit auto-installed when you provisioned Data 360 in <ModuleLink slug="getting-started" />. These are CRM data streams. They bring standard CRM objects (Contact, Account, and others) into Data 360.

Click into the **Contact** data stream. This is the data stream that ingests your CRM Contact records.

{/* VERIFY: What is the exact name of the Contact data stream. Is it "Contact" or something like "Salesforce_Contact". */}

The data stream detail page shows several things:

- **Record status and overview area.** This shows the total number of records processed, the last refresh timestamp, and the associated data lake object name.
- **Mapped fields section.** This shows the field mappings between the data stream and its DLO/DMO targets. You can add fields and create formula fields from this area.
- **Refresh History.** A log of all refresh instances. It distinguishes between full refreshes and incremental updates. If nothing changed since the last refresh, you may see a count of 0.
- **Refresh Now button.** This triggers a manual refresh of the data stream.

{/* VERIFY: What are the exact tab names on the data stream detail page. The research could not confirm these from screenshots. Take screenshots from the SDO. */}

Look at the refresh status. When was this data stream last refreshed? Is there a scheduled refresh configured?

:::warning
SDOs do not support scheduled data stream refreshes. In a production org, CRM data streams refresh hourly via incremental upsert, with a full refresh every two weeks automatically. In your SDO, you must click **Refresh Now** manually every time you want Data 360 to pick up CRM changes. This matters for the rest of the course. Every time you create or update a CRM record, you need to manually refresh the relevant data stream before Data 360 sees the change.
:::

{/* VERIFY: Confirm that SDOs cannot schedule automatic data stream refreshes. Check the scheduling UI in the SDO. */}

### Full refresh vs incremental refresh

There are two types of data stream refresh, and they behave very differently.

**Incremental refresh (upsert)** only brings in records where the `Last Modified Date` changed since the last refresh. If you updated 5 contacts out of 48,000, only those 5 records are re-ingested. This is the default behavior when you click **Refresh Now** or when a production org runs its hourly scheduled refresh.

**Full refresh** removes all existing data in the DLO and re-ingests every record from the source. It rebuilds from scratch. In production, CRM data streams get an automatic full refresh every two weeks. You can also trigger one manually.

:::warning
Incremental refresh does not pick up formula field changes. If a formula field value changes on a CRM record but the record's `Last Modified Date` does not update, the incremental refresh will miss it. Formula fields are only synchronized during the initial ingestion and on full refresh. If you rely on formula fields in your data model, keep this in mind.
:::

When would you use each?

- **Incremental** is the normal operating mode. It is fast and only processes what changed.
- **Full refresh** is needed after changes to identity resolution rulesets, after formula field definition changes, or any time you suspect incremental refreshes have missed records.

## Data lake objects

Navigate to **Data Lake Objects** in Data 360 Setup.

{/* VERIFY: Is the navigation path Data 360 Setup > Data Lake Objects. Confirm in SDO. */}

Find the DLO associated with the Contact data stream and click into it.

As you learned in [Introduction to Data 360](/introduction/intro-to-data-360), a DLO is a raw representation of the source data. The field names and structure mirror what the source system sent. Look at the fields on this DLO. They should look familiar if you know the Contact object in CRM.

DLOs persist and accumulate data over time. They are not temporary staging areas. But you rarely interact with them directly after the initial setup. They sit underneath the data model, holding the raw data that DMOs reference.

### Where do DSOs fit?

You may encounter references to DSOs (Data Source Objects) in documentation or community posts. DSOs are an internal storage layer that sits beneath DLOs in the Data 360 architecture:

**DSO** (internal, raw ingestion) → **DLO** (user-visible, persistent raw data) → **DMO** (virtual structured view)

DSOs capture an exact copy of incoming data with little or no modification. They are a back-end staging layer. You do not interact with them directly. They are not visible in the Data 360 Setup UI. Some data sources skip the DSO stage entirely and appear directly as DLOs.

The reason this matters: if you see "DSO" in older blog posts or architecture diagrams, now you know where it fits. For day-to-day implementation work, DLOs and DMOs are what you work with.

## Field mappings and DMO relationships

From the Contact DLO, navigate to the field mappings. This is where DLO fields are mapped to DMO fields.

{/* VERIFY: How do you navigate from a DLO to its field mappings. Is there a tab or button on the DLO detail page. */}

The mapping screen shows how source fields (from the DLO) connect to target fields (on DMOs). This is the bridge between raw ingested data and the structured data model.

Here is the key thing to observe: the Contact DLO maps to more than one DMO. It maps fields to the **Individual** DMO (name fields, identifiers) and to the **Contact Point Email** DMO (email address). One DLO, multiple DMO targets. This is Data 360 breaking apart a flat source record into a normalized data model.

:::tip[Coming from MCE?]
- In MCE, you define data extension fields directly (name, type, length). In Data 360, you map DLO fields to DMO fields. The mapping layer between raw data and structured data has no MCE equivalent.
- In MCE, all data extensions are custom-created. In Data 360, standard DMOs exist for common entities (Individual, Contact Point Email, Account) and custom DMOs are the exception. This is the opposite pattern.
- In MCE, Contact Builder relationships connect data extensions for filtering and automation. DMO relationships serve a similar purpose, but standard DMOs come with built-in relationships that activate automatically once mappings exist.
:::

### Touring the existing DMOs

Navigate to **Data Model** in Data 360 Setup.

{/* VERIFY: Is the navigation path Data 360 Setup > Data Model, or is it Setup > Data 360 > Data Model. Confirm in SDO. */}

You should see the DMOs that the Marketing Data Kit set up. Look at these three:

- **Individual** - Maps from CRM Contact. Holds person-level fields like name and identifiers.
- **Contact Point Email** - Maps from CRM Contact (specifically the email field). Holds email addresses tied to individuals.
- **Account** - Maps from CRM Account. Holds account-level information.

Standard DMOs have several advantages over custom DMOs:

- **Pre-defined fields and non-editable API names.** The schema is consistent across every Data 360 org.
- **Automatic relationships.** Standard DMOs come with built-in relationships that activate once there is at least one mapping between the related DMOs. You do not need to wire these up manually.
- **Category inheritance.** DMOs inherit their category (Profile, Engagement, or Other) from the first DLO mapped to them. Standard DMOs of the Profile category (like Individual) are pre-configured for segmentation.
- **Regular updates.** Salesforce expands standard DMO fields over time.

You will work more with DMOs in the remaining subpages of this module. For now, the goal is to see how data streams, DLOs, and DMOs connect in practice.

## Assignment

1. Open the Contact data stream in **Data 360 Setup > Data Streams**. Document what you see on each area of the detail page (record overview, mapped fields, refresh history).
2. Navigate from the Contact data stream to its associated DLO. Note the DLO name and scan its fields.
3. From the DLO, navigate to the field mappings. Identify which DMOs the Contact DLO maps to.
4. Find at least one example of a single DLO mapping to multiple DMOs. Document which DLO it is and which DMOs it maps to.
5. Manually refresh the Contact data stream by clicking **Refresh Now**. Note how long the refresh takes to complete.
6. Open the **Data Model** view and browse the existing DMOs. Identify which ones are standard and which relationships are already defined.

## Success criteria

- [ ] You can navigate to the Data Streams list in Data 360 Setup
- [ ] You have opened the Contact data stream detail page and can describe what each area shows
- [ ] You have identified at least one DLO that maps to multiple DMOs
- [ ] You have manually refreshed a data stream and confirmed it completed
- [ ] You have browsed the existing DMOs in the Data Model view

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between a full refresh and an incremental refresh?
- Why do you need to manually refresh data streams in an SDO?
- How does a DLO relate to its source data stream?
- Can a single DLO map to more than one DMO? Give an example from your org.
- Why are formula field changes missed by incremental refresh?
- How does the Contact DLO's mapping to multiple DMOs relate to LEOptical's need for a unified customer view?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Data 360 Connectors and Integrations: Connect and Map Data (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-connectors-and-integrations/connect-and-map-data) - Covers data stream creation, field mapping, DMO relationships, and category inheritance. Good reference for the mapping concepts introduced here.
- [Creating Data Streams Using Salesforce CRM Connector (HeiChat)](https://heichat.net/blogs/tbGE71MEV4E/Creating-Data-Streams-Using-Salesforce-CRM-Connector-%7C-Data-Cloud-Decoded/) - Detailed walkthrough of CRM data stream creation and refresh schedules.
- [From Raw to Ready: DSOs, DLOs, and DMOs (Jayanth Thathapudi)](https://www.jthathapudi.com/blog/from-raw-to-ready-understanding-dsos-dlos-and-dmos-in-salesforce-data-cloud) - Deeper look at the three-layer architecture (DSO, DLO, DMO) if you want more context on how data flows through each layer.
