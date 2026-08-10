---
sidebar_position: 1
title: "Segmentation"
description: "How segmentation works in Data 360: segment types, the builder canvas, containers, traversal paths, and the publish lifecycle."
---

## Overview

You have Unified Individuals. Now you use them. Segmentation is the first place in MCA where all the upstream work pays off: the ingested data, the identity resolution, the Data Graph. A segment takes that unified view and answers one question: who is in this audience?

This lesson covers the mechanics of the segment builder in full. You will learn what each segment type is for, how the canvas is structured, how containers work, how the lookback window affects evaluation, and exactly what happens when you click Publish. You need all of this before you touch the UI, because the segment builder has several behaviors that are not obvious from context and that will cost you hours of debugging if you encounter them without warning.

The guided walkthrough and the four LEOptical segments are in the next lesson. Read this one first.

:::tip[Coming from MCE?]
In MCE, building an audience meant creating a filtered Data Extension and running a Filter Activity to populate it before each send. The filter operated on a flat, pre-joined DE. You had to pre-calculate fields like "total spend" or "most recent order date" before you could filter on them.

MCA's segment builder is a different mental model:

- You segment against the **Unified Individual DMO**, not a flat DE. Cross-source data is already merged.
- **Containers** handle one-to-many relationships natively. You do not pre-join or pre-aggregate data.
- **Aggregation** (count, sum, average, min, max) runs at segment evaluation time. No pre-calculated fields needed.
- **Include/Exclude** tabs replace MCE's exclude lists, which lived in the Send Definition rather than in the audience definition itself.
- MCE had no native lookback window. Date filters required manual field management.
:::

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What the five segment types are and when to use each.
- The segment builder canvas: Segment On, Include/Exclude tabs, and the attribute sidebar.
- Direct attributes vs related attributes, and why the distinction matters.
- Containers: how they evaluate, what aggregation options are available, and how the lookback window works.
- Traversal paths: when they appear and how to choose.
- Logic operators at the filter level and the container level.
- Population counts and the on-demand preview.
- The publish lifecycle: why a Draft segment has no members and what happens during first publish.
- Publish schedule options and Rapid Publish mode.
- Exclusions and common suppression patterns.

## Segment types

MCA supports five segment types. This course builds **Standard** segments throughout. You should know the others exist so you recognize them when clients ask.

| Type | What it is | Cadence | Data window | Targets |
|------|-----------|---------|-------------|---------|
| **Standard** | DMO-based segment with persisted membership. The default. | 12 hrs or 24 hrs | Up to 2 years | All activation targets |
{/* VERIFY: Research describes Real-Time as designed for instant decisioning and real-time personalization, not specifically "Agentforce interactions." Confirm the correct label for supported targets in current docs. */}
| **Real-Time** | Evaluates in milliseconds against a real-time data graph | On demand only | Current state | Agentforce interactions |
{/* VERIFY: Research confirms Waterfall uses Standard Publish only and data window up to 2 years, but does not explicitly confirm supported activation targets. Confirm in official docs. */}
| **Waterfall** | Ordered list of segments, each member lands in first match only | Standard only | Up to 2 years | All activation targets |
{/* VERIFY: Cadence, data window, and activation targets for Nested segments are not confirmed in research. Confirm in official docs or SDO. */}
| **Nested** | An existing published segment used as a filter criterion inside another segment | Inherits parent schedule | Inherits parent | All activation targets |
{/* VERIFY: Research confirms Dynamic segments are API-triggered, but does not confirm the data window as "Varies" or activation targets. Confirm both in official docs. */}
| **Dynamic** | Parameterized definition. External API caller passes values at runtime. | API-triggered | Varies | All activation targets |

**Standard** is the right choice for virtually every email campaign audience. Use the others when you have a specific reason to.

**Rapid Publish** is not a segment type. It is a publish mode you can enable on a Standard segment when you need 1-hour or 4-hour refresh cadences. It has restrictions: it only looks at the last 7 days of data, is limited to 20 segments per org, and only activates to MCE and cloud file storage targets.

**Real-Time** segments are for Agentforce use cases where a millisecond response is required. They do not support exclusion criteria, do not show population counts, and cannot contain nested batch segments. Do not use them for email campaigns.

**Waterfall** segments enforce mutual exclusivity. Each Unified Individual lands in exactly one segment in the waterfall, whichever they qualify for first. The waterfall can contain up to 20 segments. You would use this for tiered offer programs where Gold members should receive a Gold offer and never see the Bronze offer, even if they technically qualify for both.

**Nested** segments let you use a published segment as a building block inside another segment. The use case is reuse: if "All Consented Customers" is a shared definition, multiple teams can reference it without duplicating the filter logic.

**Dynamic** segments require API integration and are an advanced use case. They are not covered in this course.

## The segment builder canvas

When you create a Standard segment and open the builder, the canvas has three elements worth understanding before you build anything.

<ScreenshotPlaceholder alt="Segment builder canvas in its empty state showing the Segment On selector at the top, Include and Exclude tabs, and the attribute sidebar on the right with Direct Attributes and Related Attributes sections visible" />

### Segment On

**Segment On** is the DMO the segment counts members of. Every filter you add returns a count of distinct members of this DMO. For all MCA use cases with Identity Resolution configured, this should always be **Unified Individual**.

If you segment on the raw Individual DMO instead, you count the same real person multiple times (once per source record). A customer who appears in CRM, the loyalty system, and ecommerce orders would count as three members. Do not do this.

### Include and Exclude tabs

The **Include tab** is where you define who qualifies for the segment. At least one Include rule is required.

The **Exclude tab** is where you define who gets removed from the segment even if they meet the Include criteria. Exclusions run after Include is evaluated, as a subtraction. The Exclude tab supports the same attribute sidebar, container logic, and operators as the Include tab.

Real-Time segments do not have an Exclude tab.

### The attribute sidebar

The attribute sidebar shows all available filters, organized into two categories:

- **Direct attributes:** fields with a one-to-one relationship to the Segment On DMO. One value per Unified Individual. Examples: first name, birth date, city.
- **Related attributes:** fields from DMOs with a one-to-many relationship to the Segment On DMO. Multiple records per Unified Individual. Examples: Sales Orders, Eye Exams, email engagement events.

Dragging a direct attribute onto the canvas adds a simple filter. Dragging a related attribute creates a **container** for that DMO.

## Direct attributes

A direct attribute is a field that has exactly one value per Unified Individual. Drag it onto the canvas and it adds a filter row with an operator and a value input.

Filter operators vary by data type:

| Data type | Available operators |
|-----------|-------------------|
| Text | Contains, Begins With, Is In, Is Not In, Is Equal To, Is Not Equal To |
| Number | Is Equal To, Is Not Equal To, Is Less Than, Is Less Than Or Equal To, Is Greater Than, Is Greater Than Or Equal To, Is Between |
| Date / DateTime | Is Anniversary Of, Is Before, Is After, Is Between, Last Number Of Days, Next Number Of Days, Day Of Week |
| Boolean | Has Value, Has No Value, Is True, Is False |

{/* VERIFY: Full operator list per type in the current Summer '26 UI — the research confirmed these from Trailhead but the platform may show slightly different labels. Particularly confirm "Is In" for text (needed for Loyalty Tier = Gold OR Platinum in one filter) and "Last Number Of Days" for date (needed for Lapsed Buyers). */}

You can combine multiple direct attribute filters with AND or OR logic. The population count updates per filter as you build.

<ScreenshotPlaceholder alt="Segment canvas showing a direct attribute filter on Individual First Name with an Is Equal To operator and a text value, and the population count displayed below the filter row" />

For LEOptical, direct attributes you might filter on include: first name, city, or a custom field like `Last_Exam_Date__c` if it is mapped directly to the Individual DMO from the CRM Contact.

## Related attributes and containers

This is the most important concept in the segment builder. Spend time here.

### What a container is

When you drag a related attribute onto the canvas, the builder creates a **container** for that related DMO. A container is a group of filters that evaluate against all records in that related DMO for each Unified Individual.

The key behavior: the platform looks at every record for that individual in the related DMO. The individual qualifies for the container if their collective records satisfy the criteria.

This distinction between same-record evaluation and across-records evaluation matters a lot.

Consider this example: you want customers who bought a yellow scarf.

- **One container** with Product Category = "Scarves" AND Color = "Yellow" finds customers who have a single order record where the category is Scarves and the color is Yellow. Both conditions evaluate against the same record.
- **Two separate containers**, Container A with Product Category = "Scarves" and Container B with Color = "Yellow", finds customers who have any scarf order AND any yellow order, even if those are two different order records. The containers evaluate independently.

AND logic between filters inside a container: both conditions must be true on the same related record.

AND logic between two containers: the individual must satisfy each container's criteria, but the records satisfying each container do not need to be the same record.

<ScreenshotPlaceholder alt="Segment canvas showing a Sales Order container with two filters inside it connected by AND: Order Date Last Number Of Days 30 AND Total Amount Is Greater Than 100" />

### Aggregation options

Inside a container, you choose how to aggregate the related records before applying the filter. Five options:

| Aggregation | What it evaluates | LEOptical example |
|------------|------------------|------------------|
| **Count** | Number of matching records | "Has placed at least 3 orders" |
| **Sum** | Total of a numeric field across matching records | "Total order spend over $500" |
| **Average** | Mean of a numeric field across matching records | "Average order value over $100" |
| **Min** | Lowest value in a numeric or date field | "Earliest exam date before 2024" |
| **Max** | Highest value in a numeric or date field | "Most recent order within the last 30 days" |

Count works with any data type. Sum, Average, Min, and Max require a numeric or date field.

The aggregation you choose determines what the filter operator applies to. If you choose Max(Order Date), the operator compares against the most recent order date, not any individual order date.

### The lookback window

The lookback window limits how far back in time the segment engine looks at related records. The default is 90 days.

For a Sales Order container with a 90-day lookback, the engine only considers orders placed in the last 90 days. An order from two years ago does not exist from the segment's perspective.

{/* VERIFY: Exact location of the lookback window setting in the Summer '26 UI — research indicates it may be at the segment level (set during segment creation), at the container level (override per container), or both. One source says container-level overrides segment-level. Confirm in SDO. */}

The lookback window is a design decision, not just a setting. A shorter lookback is faster to process and consumes fewer credits. A longer lookback captures more history but increases processing time and cost. For LEOptical's Exam Overdue segment (detecting contacts with no exam in 12 months), a lookback window of at least 365 days or more is required, or the segment will miss contacts whose last exam was more than 90 days ago.

Rapid Publish segments lock the data window to 7 days regardless of your lookback setting. This is a hard constraint, not a configuration choice.

Profile data (direct attributes on Unified Individual) has no lookback window. Lookback only applies to related attribute containers.

### Filters within a container

You can add multiple filters inside a single container and combine them with AND or OR logic. The filters all evaluate against the same related DMO's records.

{/* VERIFY: Maximum number of filters per container in the current UI — the prompt context cited 20 filters per container but this could not be confirmed from the research sources. Verify in SDO. */}

### Between containers

An individual must satisfy each container's criteria to qualify when containers are connected by AND. The containers evaluate independently. The records satisfying Container A do not need to be the same records satisfying Container B.

When containers are connected by OR, qualifying for either container is enough.

<ScreenshotPlaceholder alt="Segment canvas showing two containers (a Loyalty Program Member container and a Sales Order container) connected by an AND operator between them, each with their own filters" />

### Nesting

You can nest operator logic multiple levels deep inside a segment. This enables complex boolean expressions. The platform supports multiple levels of nesting.

{/* VERIFY: Exact maximum nesting depth in Summer '26 — research found conflicting numbers (5 vs 10 levels). Verify in SDO. */}

## Traversal paths

A traversal path defines the relationship chain the segment engine follows to reach a related attribute.

When a related attribute can be reached from the Segment On DMO via only one relationship chain, the engine uses that chain automatically and no prompt appears.

When the same attribute can be reached via more than one relationship chain, the builder prompts you to choose which path to use.

{/* VERIFY: Exact UI behavior when a traversal path prompt appears — does it appear inline on the canvas when you drop the attribute, or as a modal dialog? Confirm in SDO when building SeeClear Enthusiasts. */}

For LEOptical, this situation arises if the same DMO is connected to Unified Individual through multiple different relationship paths. The correct path depends on what you want the segment to mean.

An important constraint: **linked field values are case-sensitive**. If the join key value is `SeeClear` in one DMO and `seeclear` in another, the relationship does not resolve. This matters when filtering on text fields that traverse DMO relationships.

Only one traversal path per container.

<ScreenshotPlaceholder alt="Traversal path selection UI showing a dropdown or modal with two relationship chain options to reach the Product DMO, with one option highlighted" />

## Exclusions

The Exclude tab works exactly like the Include tab. The same attribute sidebar, the same containers, the same operators. The only difference is that criteria placed here remove individuals from the segment rather than qualify them.

Common patterns for LEOptical:

- Exclude individuals who opted out of a specific Communication Subscription. This is your suppression layer for promotional sends.
- Exclude individuals who already received a specific campaign within the last 30 days. This prevents over-messaging.
- Exclude individuals already in a higher-priority segment, if you are building manual mutual exclusivity without a Waterfall segment.

One approach for the Lapsed Buyers segment is to use the Exclude tab: Include everyone, Exclude anyone with a Sales Order in the last 180 days. This is often more readable than an aggregation-based filter on the Include side, though both approaches produce the same result.

<ScreenshotPlaceholder alt="Exclude tab active on the segment canvas showing a Sales Order container that excludes individuals with any order in the last 180 days" />

## Population counts and previews

As you add filters and containers, the builder displays a population count per filter and per container. You can also trigger an on-demand count refresh without publishing.

The count is a preview estimate based on the current data state. It is not segment membership.

A segment in Draft status that shows 12,000 in the population count has zero actual members available for activation. Zero emails will send if you reference this segment in a flow or activation without publishing first.

:::warning
**The population count in the builder is not segment membership.** A Draft segment has zero members regardless of what the preview count shows. You must publish the segment before any activation or flow can use its members.
:::

Use population counts to gut-check your filter logic while building. If a filter drops the count to zero when you expect thousands, the operator or value is probably wrong.

## The publish lifecycle

This section is the most important one for avoiding errors in production.

### Segment statuses

| Status | What it means |
|--------|--------------|
| **Draft** | Segment created, never published. Zero members. Population count in the builder is a preview only. |
| **Processing / Publishing** | First publish or scheduled refresh in progress. Zero members available downstream. |
| **Active / Published** | Member list is materialized and current as of last publish. Members are available in activations, flows, and list views. |
| **Recounting** | Population count recalculation in progress. |
| **Deferred** | Queued due to concurrent publish limits. Will run when capacity is available. |
| **Skipped** | Delayed due to concurrent publish load. Will retry. |
| **Error / Failed** | Publish errored. Investigate the run log. |
| **Inactive** | Segment is deactivated. Cannot be published. Can be deleted. |

### What happens at first publish

When you click Publish for the first time, the platform materializes the member list. This process:

{/* VERIFY: Research confirms first publish materializes the member list but does not enumerate these four steps explicitly. The phrase "in the data space" is not confirmed by research sources. Confirm the accurate technical description of the first publish process in official docs. */}
1. Reads all Unified Individual records in the data space
2. Evaluates Include criteria for each individual
3. Evaluates Exclude criteria and removes matching individuals
4. Writes the resulting member list to the segment membership DMO

Until this process completes, the segment has no members. Status shows Processing or Publishing during this time.

With LEOptical's seed data in an SDO (approximately 48,000 contacts), this process is faster than in a production org. In a production org with millions of records, first publish can take 15 to 30 minutes or longer.

{/* VERIFY: Typical first publish timing in SDO with LEOptical seed data. Note in the walkthrough once confirmed. */}

### Between publishes

After first publish, the member list is locked until the next scheduled refresh or a manual publish. A customer who places an order five minutes after the last publish does not enter the segment until the next refresh. A customer who cancels their loyalty membership five minutes after the last publish does not exit the segment until the next refresh.

This is correct and expected behavior, not a bug.

:::warning
**Segment-triggered flows against unpublished segments show "Completed" status but send nothing.** When a flow runs against a Draft segment, it queries the membership DMO and finds zero records. The flow marks itself Completed (zero interviews run) and exits without error or warning. You will not know anything went wrong until you check the send report. Always publish a segment before activating a campaign flow that references it.
:::

### After publish

Two system-generated DMOs exist per published segment:

- **Latest DMO:** current publish snapshot, who is in the segment right now
- **History DMO:** last 30 days of membership snapshots

Both are queryable via the Data 360 Query Editor. This is useful for auditing segment membership or building reports of who entered or exited a segment over time.

<ScreenshotPlaceholder alt="Segment list view showing three segments with different status badges: one in Draft, one in Processing, and one Published/Active, with member count and last published timestamp visible" />

:::warning
**SDOs only support manual segment publishing.** In your SDO, segments will not refresh on a schedule. You must publish manually each time. Production client orgs use the scheduled publish cadence you configure. This means that testing in your SDO requires intentional manual publishes to see updated membership.
:::

## Publish schedule options

When you create a segment, you choose a publish type and schedule.

| Mode | Cadence options | Data window | Available targets |
|------|----------------|-------------|------------------|
| **Standard** | 12 hours, 24 hours, or Manual | Up to 2 years | All activation targets |
| **Rapid Publish** | 1 hour or 4 hours | Last 7 days only | MCE and cloud file storage only |

Standard Manual means you publish on demand. The segment does not refresh automatically.

Rapid Publish is a publish mode you enable per segment. The max is 20 Rapid Publish segments per org. The 7-day data window is a hard limit. If a Lapsed Buyers segment needs to look back 180 days, Rapid Publish is the wrong choice for that segment.

:::tip[Coming from MCE?]
MCE had no concept of a scheduled audience refresh cadence. The send would run a Filter Activity at send time, then use the resulting DE. There was no pre-computed, periodically refreshed member list.

MCA's publish cycle is a fundamentally different model. The audience is computed ahead of time on a schedule. The send uses the pre-computed list, not a fresh query. This means:

- Faster sends for large audiences (no filter evaluation at send time)
- Audiences that are always slightly stale by design
- A segment must be published before you can use it, not just created

There is no MCE equivalent to a 12-hour or 24-hour audience refresh cycle.
:::

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between a direct attribute and a related attribute? Give an example of each from the LEOptical data model.
- You add a Product Category = "Scarves" filter inside one container AND a Color = "Yellow" filter inside a second container, then connect the containers with AND. What does the segment find? How is this different from putting both filters inside the same container?
- A segment in Draft status shows a population count of 4,200 in the builder. How many members does this segment have available for activation?
- What is the lookback window and how does it affect a segment's behavior? What lookback window would the Exam Overdue segment require and why?
- You want to exclude anyone who opted out of promotional communications from a segment. Which tab do you use, and why can you not express this on the Include tab?
- What is the difference between Rapid Publish mode and a Real-Time segment? When would you use each?
- A colleague's segment-triggered flow shows "Completed" but no emails were sent. What is the most likely cause?
- A Waterfall segment assigns each individual to exactly one group. When would you use this instead of separate independent segments, and what is the maximum number of segments a waterfall can contain?
