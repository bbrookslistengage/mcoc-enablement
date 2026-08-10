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

| | SDO | Production |
|---|-----|-----------|
| CRM data stream refresh | Auto every ~10 min (batch). Manual refresh available anytime. | Every 10 min (batch) or near-real-time (streaming). |
| CSV/external data stream refresh | Manual only (re-upload) | Configurable schedule |
| Full refresh (CRM) | Configurable: None (default), 10 days, 25 days, 50 days. Manual via **Refresh Now**. | Same configurable options. |
| Identity resolution | Manual trigger or configurable schedule | Configurable schedule |
| Data Graph refresh | Configurable: every 30 minutes, hourly, every 4 hours, daily (default), weekly, monthly. Manual via **Refresh Now**. | Same configurable options. |

See [Data Stream Schedule in Data 360](https://help.salesforce.com/s/articleView?id=data.c360_a_data_stream_schedule.htm&type=5) and [Configure Periodic Full Refresh Interval](https://help.salesforce.com/s/articleView?id=data.c360_a_crm_data_full_refresh_interval.htm&type=5) for the official documentation on these schedules.

CRM data streams refresh incrementally every ~10 minutes in batch mode, picking up records where `LastModifiedDate` changed since the last refresh. Streaming mode (near-real-time) is available for CDC-enabled objects that do not use formula fields. Full refresh is disabled by default. You can configure it to run every 10, 25, or 50 days, or trigger it manually with **Refresh Now**.

In your SDO, CRM data streams auto-refresh roughly every 10 minutes, so data does flow in without manual intervention. But when you are actively working and need changes reflected immediately, waiting 10 minutes is impractical. That is when you use the manual workflow:

1. Create or update the record in CRM (or upload a CSV).
2. Navigate to **Data Streams**, find the relevant stream, and click **Refresh Now**.
3. Wait for the refresh to complete.
4. Run identity resolution by navigating to **Identity Resolution**, opening the ruleset, and clicking **Run Ruleset**.
5. Refresh the Data Graph by navigating to **Data Graphs**, opening the row actions dropdown, and clicking **Refresh Now**.

<Screenshot src="/img/the-refresh-chain/02-identity-resolution-run.png" alt="CohortMCG Identity Resolution ruleset detail page showing Run Ruleset button, Ruleset Status Published, Last Job Status Succeeded, and Resolution Summary sidebar showing 1.04K Unified Profiles from 1.08K source profiles" caption="Step 4: Click Run Ruleset to trigger identity resolution manually." />

You will use this workflow many times throughout the course. It gets faster once it becomes habit.

:::warning
Incremental (upsert) refreshes only pick up records where `LastModifiedDate` changed since the last refresh. Formula fields recalculate their values when queried, but updating a formula field's result does not update `LastModifiedDate` on the record unless a tracked field also changed. When this happens, the incremental refresh misses the change. Formula fields also force batch mode (they prevent streaming/CDC-based ingestion). If you suspect stale formula field data, trigger a full refresh. See [Configure Periodic Full Refresh Interval](https://help.salesforce.com/s/articleView?id=data.c360_a_crm_data_full_refresh_interval.htm&type=5) for details.
:::

## What is a Data Graph?

A Data Graph is a pre-computed snapshot of connected records for each Unified Individual. You already created one in Getting Started: the Marketing Content Personalization graph. That graph is what Handlebars expressions read from when resolving merge fields in emails.

The Data Graph is not a live query. It is a snapshot that gets rebuilt on a schedule or when you trigger a manual refresh. Trigger a manual refresh from the Data Graphs list view via the row actions dropdown.

<ScreenshotPlaceholder alt="Data Graphs list view with the row actions dropdown open on one graph, showing Refresh Now, Schedule, and Refresh History options" />

To change the schedule, select **Schedule** from the same dropdown.

<ScreenshotPlaceholder alt="Set Your Data Graph's Refresh Schedule modal with the interval dropdown open showing Every 30 Minutes, Every 1 Hour, Every 4 Hours, Daily, Weekly, Monthly, and Streaming options" />

You cannot control the exact time of day the scheduled refresh runs. See [Get to Know Data Graphs (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-graphs-in-data-cloud/get-to-know-data-graphs) for more on how Data Graphs work.

This is why the Data Graph sits at the end of the refresh chain. It needs to wait for IDR to finish so it can include the latest unified data.

The <ModuleLink slug="data-graphs" /> module covers Data Graph configuration in detail. For now, three things matter:

1. The Data Graph exists and it needs to refresh after IDR.
2. Personalization depends on it. If merge fields are empty or stale, the Data Graph probably needs a refresh.
3. If a Unified Individual lacks data for a field, the Data Graph omits that field entirely from its JSON. The field is not null. It is not an empty string. It does not exist. This matters when you write Handlebars expressions, and you will deal with it in the personalization modules.

:::warning
Missing fields in the Data Graph JSON are absent, not null. A Handlebars expression like `{{FirstName}}` silently renders as empty if the field does not exist in the graph. You need `{{#if}}` checks or default values to handle this. The personalization module covers the pattern.
:::

## Data Transforms

Data Transforms reshape, filter, or enrich data within the Data 360 data pipeline. They exist because Data 360 does not provide an ad-hoc SQL query layer for reshaping data inline. When source data does not match the target data model cleanly, transforms bridge the gap without requiring an external ETL tool.

There are two types, and they work very differently:

| | Batch transforms | Streaming transforms |
|---|---|---|
| **Interface** | Visual drag-and-drop node builder | SQL query editor |
| **Source** | DLOs or DMOs | Single DLO only |
| **Operations** | Aggregations, joins, filters, calculated fields, append (union) | SELECT, WHERE, CASE, CONCAT, type conversions (no joins) |
| **When they run** | Manually or on a schedule | Near real-time, as data arrives |
| **Output** | DLOs or DMOs | DLOs only |
| **Org limit** | 100 per org | 25 per org |

Batch transforms use a visual builder where you drag nodes onto a canvas and connect them. You do not write SQL for batch transforms. Streaming transforms are the SQL-based option, but they are limited to a single DLO source with no joins.

Common use cases include combining fields, filtering out test records, type conversions, and data normalization.

See the Trailhead modules on [Batch Data Transforms](https://trailhead.salesforce.com/content/learn/modules/batch-data-transforms-in-data-cloud-quick-look/get-started-with-batch-data-transforms-in-data-360) and [Streaming Data Transforms](https://trailhead.salesforce.com/content/learn/modules/streaming-data-transforms-quick-look/get-started-with-streaming-data-transforms-in-data-cloud) for hands-on examples.

:::tip[Coming from MCE?]
- Data Transforms fill a similar role to SQL queries in Automation Studio. In MCE, you write SQL against data extensions to reshape, filter, and join data. In Data 360, batch transforms handle joins and aggregations through a visual builder (no SQL), while streaming transforms use SQL but are limited to single-source, simple operations.
- There is no direct equivalent to writing a freeform SQL query against your entire data model. Transforms are scoped and purpose-built.
:::

LEOptical does not use Data Transforms in this course. The seed data is pre-formatted to map directly to DMOs. But you should know transforms exist. On client engagements where source data does not match the target data model cleanly, transforms sit between raw ingestion and the data model to bridge the gap.

Two things to keep in mind about transforms for real engagements: processing usage directly impacts licensing costs, and the platform intentionally limits transform capabilities because Data 360 expects pre-cleaned data. Heavy transformation work should happen upstream in the source system or an ETL tool, not inside Data 360.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What are the three steps that must happen (in order) after you create a new CRM record before that record appears in a segment?
- What happens if you run identity resolution before the data stream has refreshed?
- Why does the Data Graph need to refresh after identity resolution?
- How often do CRM data streams refresh incrementally in an SDO?
- What is the difference between batch transforms and streaming transforms in terms of interface and capabilities?
- How does a Data Transform fit into the dependency chain relative to the three main steps?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Data Stream Schedule in Data 360 (Salesforce Help)](https://help.salesforce.com/s/articleView?id=data.c360_a_data_stream_schedule.htm&type=5) - Official documentation on data stream refresh schedules and modes.
- [Configure Periodic Full Refresh Interval (Salesforce Help)](https://help.salesforce.com/s/articleView?id=data.c360_a_crm_data_full_refresh_interval.htm&type=5) - How to configure full refresh intervals for CRM data streams.
- [Get to Know Data Graphs (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-graphs-in-data-cloud/get-to-know-data-graphs) - Overview of Data Graph concepts and refresh behavior.
- [Batch Data Transforms Quick Look (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/batch-data-transforms-in-data-cloud-quick-look/get-started-with-batch-data-transforms-in-data-360) - Hands-on introduction to the visual batch transform builder.
- [Streaming Data Transforms Quick Look (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/streaming-data-transforms-quick-look/get-started-with-streaming-data-transforms-in-data-cloud) - Streaming transform capabilities with a phone normalization example.
- [Salesforce Data Transforms (Salesforce Ben)](https://www.salesforceben.com/salesforce-data-transforms-what-is-this-key-component-of-data-cloud/) - Overview of batch and streaming transforms, org limits, and cost implications.
