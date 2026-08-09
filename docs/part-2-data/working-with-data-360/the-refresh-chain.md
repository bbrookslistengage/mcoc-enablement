---
sidebar_position: 2
title: "The Refresh Chain"
description: "The dependency chain that governs how data moves through Data 360: data streams, identity resolution, and Data Graphs."
---

## Overview

Every time you add, update, or delete data in your SDO and it does not show up where you expect, the answer is almost always the same: one of the steps in the refresh chain has not run yet. This page explains exactly which steps need to happen, in what order, and why skipping one breaks everything downstream.

Bookmark this page. You will come back to it throughout the course. The [Introduction to Data 360](/introduction/intro-to-data-360) module gave you the end-to-end flow from source system to segment. This page zooms in on the operational dependency between each step and what happens when things are out of sync.

This is a reference page. There is no assignment. Read it, understand the chain, and return here whenever something is not showing up.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- The three-step dependency chain: data stream refresh, identity resolution, Data Graph refresh
- What happens when you skip a step or run steps out of order
- How refresh mechanics differ between SDOs and production orgs
- What a Data Graph is and why it must refresh after identity resolution
- What Data Transforms are and where they fit in the pipeline

## The dependency chain

When you add, update, or delete data, three things must happen in order before that change is visible across the platform.

### Step 1: Data stream refreshes

New or updated records flow from the source system into the DLO. Until this happens, Data 360 does not know the record exists or changed.

If you create a Contact in CRM and immediately check the Individual DMO, the new record is not there. The data stream has not refreshed. Data 360 is still looking at the last snapshot it took.

### Step 2: Identity resolution runs

Identity resolution (IDR) reads the DMOs, applies matching rules, and creates or updates Unified Individuals. Until IDR runs, the record exists in the data model but is not linked to a unified identity. It will not appear in segments that filter on Unified Individuals.

If you refresh the data stream but skip IDR, the record is in the DMO. You can see it in Data Explorer. But no Unified Individual exists for it (or the existing Unified Individual does not know about the new data). Segments will not find it.

### Step 3: Data Graph refreshes

The Data Graph is a pre-computed snapshot of related records for each Unified Individual. It powers Handlebars personalization in emails. Until the Data Graph refreshes, newly unified records will not appear in merge fields.

If IDR runs but the Data Graph has not refreshed, the Unified Individual exists and segments can find it. But any personalization that relies on the Data Graph (like `{{FirstName}}` in an email) will not have the latest data.

### What goes wrong when you skip a step

| You did this | But skipped this | Result |
|---|---|---|
| Created a Contact in CRM | Data stream refresh | Data 360 does not know the record exists |
| Refreshed the data stream | Identity resolution | Record is in the DMO but not linked to a Unified Individual. Segments cannot find it. |
| Ran identity resolution | Data Graph refresh | Unified Individual exists. Segments work. But Handlebars personalization still shows stale data. |
| Ran IDR before the data stream refreshed | Data stream refresh | IDR runs against stale DMO data. The new record is not processed. You need to refresh the data stream and then run IDR again. |

The chain is strictly sequential. Each step depends on the output of the previous one.

:::tip[Coming from MCE?]
- In MCE, importing data into a data extension makes it available immediately. There is no refresh chain. The moment you import or an automation writes records, they are queryable.
- In Data 360, there is always a delay between "data exists in the source" and "data is usable for marketing." The three-step chain (data stream, IDR, Data Graph) is a fundamental operational difference.
- The closest MCE analogy is an Automation Studio workflow that imports data, then runs a query, then updates a sendable data extension. But in MCE, that is optional complexity. In Data 360, it is the default.
:::

## Refresh mechanics in SDOs vs production

{/* VERIFY: Do SDOs truly prevent scheduling automatic data stream refreshes? No official source confirms this specific limitation. Confirm by checking the SDO UI directly. */}

| | SDO | Production |
|---|-----|-----------|
| CRM data stream refresh | Manual only | Hourly upsert. Full refresh every ~2 weeks. |
| CSV/external data stream refresh | Manual only | Configurable schedule |
| Identity resolution | Manual trigger | Configurable schedule |
| Data Graph refresh | Manual trigger | Configurable schedule |

In production, these steps run on automated schedules. CRM data streams upsert hourly, bringing in records where the Last Modified Date changed since the last refresh. A full refresh (which deletes all DLO records and re-ingests from scratch) runs automatically every two weeks.

In your SDO, none of this is automated. Every time you add or change data, you follow this workflow:

1. Create or update the record in CRM (or upload a CSV).
2. Navigate to **Data 360 Setup > Data Streams**, find the relevant stream, and click **Refresh Now**.
3. Wait for the refresh to complete.
4. Run identity resolution.
5. Refresh the Data Graph.

This is tedious. It is also the reality of working in an SDO. You will do this many times throughout the course. It gets faster once it becomes habit.

:::warning
Incremental (upsert) refreshes only pick up records where the Last Modified Date changed since the last refresh. Formula fields on CRM objects can change value without updating the Last Modified Date. When this happens, incremental refreshes miss the change. Only a full refresh catches it. If you suspect stale formula field data, trigger a full refresh.
:::

## What is a Data Graph?

A Data Graph is a pre-computed snapshot of connected records for each Unified Individual. You already created one in Getting Started: the Marketing Content Personalization graph. That graph is what Handlebars expressions read from when resolving merge fields in emails.

The Data Graph is not a live query. It is a snapshot that gets rebuilt when you trigger a refresh. This is why it sits at the end of the refresh chain. It needs to wait for IDR to finish so it can include the latest unified data.

The <ModuleLink slug="data-graphs" /> module covers Data Graph configuration in detail. For now, three things matter:

1. The Data Graph exists and it needs to refresh after IDR.
2. Personalization depends on it. If merge fields are empty or stale, the Data Graph probably needs a refresh.
3. If a Unified Individual lacks data for a field, the Data Graph omits that field entirely from its JSON. The field is not null. It is not an empty string. It does not exist. This matters when you write Handlebars expressions, and you will deal with it in the personalization modules.

:::warning
Missing fields in the Data Graph JSON are absent, not null. A Handlebars expression like `{{FirstName}}` silently renders as empty if the field does not exist in the graph. You need `{{#if}}` checks or default values to handle this. The personalization module covers the pattern.
:::

## Data Transforms

Data Transforms reshape, filter, or enrich data between the DLO and DMO layers. They read from a source DLO, apply SQL transformations, and write to a target DLO or DMO.

There are two types:

| | Batch transforms | Streaming transforms |
|---|---|---|
| **What they do** | Complex operations: aggregations, joins between DLOs, filtering | Basic SQL on a single DLO (no joins) |
| **When they run** | Manually or on a schedule | Near real-time, as data arrives |
| **Output** | DLOs or DMOs | DLOs only |
| **Org limit** | 100 per org | 25 per org |
| **Best for** | Historical data, complex reshaping | Simple field transforms, filtering |

Common use cases include combining fields, filtering out test records, type conversions, and data normalization.

LEOptical does not use Data Transforms in this course. The seed data is pre-formatted to map directly to DMOs. But you should know transforms exist. On client engagements where source data does not match the target data model cleanly, transforms sit between raw ingestion and the data model to bridge the gap.

Two things to keep in mind about transforms for real engagements: processing usage directly impacts licensing costs, and the platform intentionally limits transform capabilities because Data 360 expects pre-cleaned data. Heavy transformation work should happen upstream in the source system or an ETL tool, not inside Data 360.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What are the three steps that must happen (in order) after you create a new CRM record before that record appears in a segment?
- What happens if you run identity resolution before the data stream has refreshed?
- Why does the Data Graph need to refresh after identity resolution?
- In an SDO, why must data stream refreshes be triggered manually?
- How does a Data Transform fit into the dependency chain relative to the three main steps?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Creating Data Streams Using Salesforce CRM Connector (HeiChat)](https://heichat.net/blogs/tbGE71MEV4E/Creating-Data-Streams-Using-Salesforce-CRM-Connector-%7C-Data-Cloud-Decoded/) - Detailed walkthrough of CRM data stream refresh schedules (hourly incremental, biweekly full) and the data stream detail page.
- [Salesforce Data Transforms (Salesforce Ben)](https://www.salesforceben.com/salesforce-data-transforms-what-is-this-key-component-of-data-cloud/) - Overview of batch and streaming transforms, org limits, and cost implications.
- [Streaming Data Transforms Quick Look (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/streaming-data-transforms-quick-look/get-started-with-streaming-data-transforms-in-data-cloud) - Streaming transform capabilities with a phone normalization example.
