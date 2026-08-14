---
sidebar_position: 1
title: "Data Graphs"
description: "What Data Graphs are, how they work, and why they are the prerequisite for email personalization and Flow in Marketing Cloud Next."
---

## Overview

You have built the data model. You have run Identity Resolution and produced Unified Individuals. Now you need to answer a question LEOptical has been waiting for since the start of this project: how does a loyalty tier end up inside an email?

The answer is the Data Graph.

A Data Graph is a pre-computed view of your DMO relationships, organized around the Unified Individual. When Marketing Cloud Next sends an email with a Handlebars expression like `{{@root.$dataGraph.ssot__FirstName__c}}`, it is not running a database query. It is reading from a materialized snapshot built ahead of time, one that already has the first name, loyalty tier, last order date, and next exam due date indexed for each unified profile.

That expression breaks down like this:

<HandlebarsAnatomy />

This module covers the concept, the mechanics, and the dependencies. The next lesson has you build the LEOptical Data Graph in your SDO.

:::tip[Coming from MCE?]
A Data Graph is roughly analogous to a pre-joined set of Data Extensions made available to AMPscript at send time. The key differences: it handles identity resolution across multiple source systems, and you do not write the joins yourself. In MCE, you either pre-joined data before import or wrote `Lookup()` calls in AMPscript. In Marketing Cloud Next, the Data Graph handles that at the platform level.
:::

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What a Data Graph is and how it differs from a segment or a DMO query.
- Standard vs. Real-Time Data Graphs and when each applies.
- How pre-computation works and why it enables sub-second lookups.
- The refresh schedule and the dependency chain it sits in.
- What the Unified Link Individual is and why traversal paths go through it.
- The missing field gotcha: why absent data causes send errors, not silent blanks.
- How the Data Graph connects to Handlebars, Flow Decision Splits, and the email builder.

## What a Data Graph is

A Data Graph is a pre-built, pre-computed relationship graph stored as materialized views in Data 360. It reads the normalized DMO tables (which store data relationally and require joins to traverse) and pre-computes a denormalized snapshot for each Unified Individual. That snapshot is indexed for fast lookup at send time.

The result: sub-second access to a unified customer profile that spans 10, 20, or more related DMOs, without executing joins at the moment the email sends.

Here is how it differs from the other tools you already know:

| Tool | What it is | When it runs |
|------|-----------|--------------|
| DMO query | Ad-hoc query against raw DMO tables | At exploration or report time |
| Segment | Filtered population of Unified Individuals matching criteria | On demand or on schedule, used for audience selection |
| Data Graph | Pre-computed relationship graph across multiple DMOs | Refreshed on a schedule and read at send time |

A segment answers "who." The Data Graph answers "what to say to them."

## Standard vs. Real-Time Data Graphs

Two types exist:

**Standard Data Graph** refreshes on a configurable schedule: hourly, every four hours, daily, weekly, or monthly. This is the type used for email personalization, Handlebars expressions, Flow Decision Splits, and dynamic content blocks. Every Marketing Cloud Next email personalization use case uses a Standard Data Graph.

**Real-Time Data Graph** refreshes in milliseconds. It is designed for Agentforce AI agent interactions where data must reflect the customer's current state in the middle of a live conversation. It is not used for email marketing or standard Flow work.

For everything in this course, you use the Standard Data Graph.

## How pre-computation works

The Data Graph engine reads your selected DMOs and traverses the configured relationship paths. It materializes a denormalized JSON view for each Unified Individual, then indexes that view for fast retrieval. The result is a nested JSON object per individual that already contains all the related data you configured when you built the graph.

When an email sends, Marketing Cloud Next looks up the Unified Individual, pulls the pre-computed JSON, and resolves the Handlebars expressions against it. No query runs at send time. This is what enables the system to send to hundreds of thousands of contacts without per-record database joins.

The trade-off: the data is only as current as the last successful refresh. If a customer's loyalty tier changed after the last refresh, the email will use the old tier until the next refresh completes.

## The refresh chain

The Data Graph is the third step in a four-step dependency chain:

```
1. Data Streams refresh
   (data from CSV, CRM, or connectors ingests into DLOs and maps to DMOs)
        |
2. Identity Resolution runs
   (source Individual records merge into Unified Individuals)
        |
3. Data Graph refreshes
   (relationships resolved across DMOs, materialized views built)
        |
4. Dynamic content resolves
   (Handlebars expressions find data in the graph at send time)
```

Each step depends on the one before it. If Identity Resolution has not run since the last Data Stream refresh, the Data Graph may be materializing stale unified profiles. If the Data Graph has not refreshed since IDR ran, new unified profiles will not appear in personalization.

You learned the first two steps in <ModuleLink slug="the-refresh-chain" /> and <ModuleLink slug="identity-resolution" />. This step completes the chain.

:::warning
Build time for a new Data Graph ranges from 15 minutes to several hours, depending on data volume and the number of DMOs included. After you click Save and Build, the graph will show a building status. Do not treat an empty email preview as a Data Graph problem until you confirm the initial build has completed.
:::

### Refresh schedule options

Standard Data Graph refresh intervals:

- Hourly
- Every 4 hours
- Daily (appropriate for most email marketing use cases)
- Weekly
- Monthly

There is no "no refresh" option. A schedule is required at creation time.

For LEOptical's use cases (loyalty tier notifications, purchase history emails, exam reminders) daily refresh is sufficient. If you were building near-real-time post-purchase triggers, hourly might be warranted.

## The Unified Link Individual

When you create a Data Graph rooted on the Unified Individual, you cannot reach Contact Point Email, Contact Point Phone, or other standard Individual-linked objects directly. Those objects are linked to source Individual records, not to the Unified Individual. The Unified Link Individual is the bridge.

After Identity Resolution runs, two system-generated objects exist for each resolved profile:

- **Unified Individual**: the post-IDR merged identity. This is what segments, Data Graphs, and activations work from.
- **Unified Link Individual**: a mapping table that records which source Individual records contributed to each Unified Individual.

The traversal path to reach contact data follows this structure:

```
Unified Individual
  |__ Unified Link Individual  (maps unified to source Individual IDs)
        |__ Individual  (the source CRM record)
              |__ Contact Point Email  (email addresses on that record)
              |__ Contact Point Phone  (phone numbers on that record)
```

You cannot shortcut this path. Adding Contact Point Email directly off Unified Individual without the Unified Link Individual hop is not supported. The relationship does not exist at that level.

:::tip[Coming from MCE?]
- In MCE, there was no unified identity concept. Each subscriber was a row in a Data Extension, and cross-source data required ETL to pre-join before import.
- Marketing Cloud Next's Unified Individual is a post-IDR resolved identity. The Unified Link Individual is the system object that tracks which source records merged into it.
- The Data Graph traversal path (going through Unified Link Individual to reach Contact Point data) has no MCE equivalent. In MCE, you accessed subscriber attributes directly from the audience Data Extension or via AMPscript `Lookup()` against related DEs.
- The concept of a separate "configure personalization" setup step also has no MCE equivalent. In MCE, the send audience DE implicitly defined available personalization data.
:::

## What gets included in the Data Graph

The Data Graph stores:

- All fields you select from the Unified Individual DMO
- Fields from all related DMOs you add to the graph
- The relationship traversal paths between them

The result is a nested JSON object. Field names use the Salesforce namespace convention. For example, `ssot__FirstName__c` for First Name on the Unified Individual, and custom fields from your LEOptical DMOs using whatever API names you assigned.

### The depth limit

A Data Graph supports relationships up to six levels deep from the primary DMO. For most Marketing Cloud Next use cases, three to four levels is typical:

```
Level 1: Unified Individual
Level 2: Unified Link Individual
Level 3: Individual
Level 4: Contact Point Email
```

LEOptical DMOs like Loyalty Program Member and Eye Exam connect directly to the Unified Individual (level 1 to level 2), which keeps the graph shallow for those objects.

### Start lean

A common mistake is adding every DMO you have. More objects means longer build time, larger materialized views, and slower lookups. Only add DMOs that your personalization and segmentation actually reference.

For LEOptical, the Data Graph needs:

| DMO | Why it is included |
|-----|-------------------|
| Unified Individual | Root DMO (required) |
| Unified Link Individual | Bridge to source Individual records |
| Individual | Source record, required to reach Contact Point objects |
| Contact Point Email | Required for email activation |
| Contact Point Phone | Required for SMS (future use) |
| Loyalty Program Member | Loyalty tier, points balance, enrollment date. Core to most LEOptical emails. |
| Sales Order | Purchase history and order date. Powers lapsed buyer segments and purchase display. |
| Sales Order Product | Line items. Powers product name repeaters in email. |
| Product | Product name and family. Connects to Sales Order Product. |
| Eye Exam (Stretch) | Exam date and next exam due. Powers exam reminder emails. Only present if clinic data was ingested. |

:::warning
Once you click **Save and Build**, you cannot remove DMOs or fields from the Data Graph. You can add new ones later, but nothing you build in can be removed. If the design is wrong, delete the graph and recreate from scratch.

SDO orgs are limited to three Data Graphs total. Production orgs allow up to 25.
:::

## The missing field gotcha

If a Unified Individual has no data for a field (for example, a contact imported from CRM who has never placed an ecommerce order), the Data Graph JSON for that individual will not include the Sales Order fields at all. Not null. Not an empty array. The fields simply do not exist in the JSON.

Handlebars expressions that reference a missing field will error. Marketing Cloud Next blocks preview and test sends if the template references a field that is absent from the Data Graph JSON. If your email template has:

```
{{@root.$dataGraph.ssot__FirstName__c}}
```

And that individual's `ssot__FirstName__c` field is absent from the JSON, you will not be able to preview or test the email. The field being absent is different from the field being empty.

The fix is the `{{fallback}}` helper:

```
{{fallback (get (get @root "$dataGraph") "ssot__FirstName__c") "Valued Customer"}}
```

This returns "Valued Customer" when the field is missing. You will use this pattern in the <ModuleLink slug="merge-fields-dynamic-content" /> module. For now, understand the problem. The Data Graph is not null-safe by default.

## Connecting the Data Graph to Marketing Cloud Next

Building the Data Graph is not enough. You also have to tell Marketing Cloud Next to use it.

After your Data Graph is Active, you run **Configure Basic Personalization** from Setup. This step links your Data Graph as the default for:

- The email builder's Data Sources tab
- Flow Decision Split elements that reference Data Graph fields
- Merge Fields in the email builder
- Dynamic content blocks

Without this step, the email builder and Flow have no access to the Data Graph, even if the graph is built and Active. The exact navigation path and the configuration steps are covered in the walkthrough in <ModuleLink slug="configuring-leoptical-data-graph" />.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you cannot answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between a segment and a Data Graph? When does each run, and what does each produce?
- Why does the traversal path to Contact Point Email pass through the Unified Link Individual instead of going directly off the Unified Individual?
- A contact's loyalty tier changed yesterday. The Data Graph refreshes daily at 2:00 AM. An email sends at 10:00 AM today. What loyalty tier will the email reflect?
- What happens to an email send when a Handlebars expression references a field that is absent from the Data Graph JSON for a given contact?
- What must be configured in Salesforce Setup before the email builder can access Data Graph fields?
- A colleague wants to add Sales Order Product to a Data Graph that is already built and Active. Is this possible? What about removing a field that was already built in?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Salesforce Engineering Blog: How Data 360's Data Graph Delivers Sub-Second Insights from 200M Records](https://engineering.salesforce.com/how-data-clouds-data-graph-delivers-sub-second-insights-from-200-million-records/). Technical detail on pre-computation, incremental refresh mechanics, and scale.
- [arthurbackouche.com: Understanding Data Graphs in Agentforce Marketing](https://arthurbackouche.com/understanding-data-graphs-in-agentforce-marketing/). Concise walkthrough of Standard vs. Real-Time Data Graph types with use case framing.
- [the-agentic-marketer.com: Easily Enrich Your Unified Individuals in Marketing Cloud Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/enrich-unified-individual/). Confirms the Unified Link Individual traversal path with a worked example.
- [Trailhead: Data Graphs in Data 360](https://trailhead.salesforce.com/content/learn/modules/data-graphs-in-data-cloud). Official Trailhead module covering creation, management, and use cases. 55 minutes, 1,500 points.
