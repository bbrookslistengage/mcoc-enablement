---
sidebar_position: 2
title: "Building LEOptical's Segments"
description: "A guided walkthrough for the VIP Customers segment, followed by three segments to build independently."
---

## Overview

The previous lesson covered the mechanics. This lesson is the build.

You will walk through one segment together (VIP Customers) step by step, seeing every canvas mechanic in context. Then you build three more segments on your own: Lapsed Buyers, SeeClear Enthusiasts, and Exam Overdue. Each one uses a different pattern. By the end, LEOptical has four published segments ready for their first campaign wave.

The work from <ModuleLink slug="identity-resolution" /> and <ModuleLink slug="data-graphs" /> is a prerequisite. IDR must have run and produced Unified Individuals. The Data Graph must be built and Active. If either is missing, the segment builder will not have the attributes you need.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Navigating to Segments in Data 360 and creating a new Standard segment.
- Setting Segment On to Unified Individual.
- Filtering on Loyalty Tier as a related attribute: dragging to canvas, container creation, and value filtering.
- Triggering an on-demand population count.
- Publishing the segment and confirming member count.
- Building three additional segments independently: Lapsed Buyers, SeeClear Enthusiasts, and Exam Overdue.

## Navigating to Segments

1. Click the **App Launcher** (nine-dot grid in the top-left navigation bar).
2. Search for and select **Data Cloud**.
{/* VERIFY: Research confirms the Segments tab exists in the Data 360 tab bar but does not confirm whether it appears in the overflow "More" menu. Verify this navigation in SDO. */}
3. In the Data 360 tab bar, find the **Segments** tab. If it is not immediately visible, click **More** at the end of the tab bar.

<ScreenshotPlaceholder alt="Data 360 app tab bar showing the Segments tab, with the More dropdown open showing additional navigation items" />

4. You are on the Segments list view. All existing segments appear here with their status, last published date, and member count.

<ScreenshotPlaceholder alt="Segments list view showing a table with columns for Segment Name, Status, Member Count, and Last Published date, with a New Segment button in the top right" />

## Creating the VIP Customers segment

1. Click **New Segment**.
2. A dialog or wizard appears. Select **Use Visual Builder** if prompted.
3. Select **Standard** as the segment type.

{/* VERIFY: Research does not confirm which segment types appear in the creation dialog. Research lists 5 types (Standard, Real-Time, Waterfall, Nested, Dynamic). Verify the exact options shown in the creation dialog in SDO. */}
<ScreenshotPlaceholder alt="New segment creation dialog showing segment type options: Standard, Waterfall, and Real-Time, with Standard selected" />

4. Fill in the segment details:
   - **Name:** VIP Customers
   - **Segment On:** Unified Individual
   - **Description:** Gold or Platinum loyalty tier members (optional but useful for team documentation)
5. For **Publish Type**, select **Standard Publish**.
6. For **Publish Schedule**, select **Do Not Schedule** for now. You will publish manually after building the segment.

<ScreenshotPlaceholder alt="Segment creation form showing Name field with 'VIP Customers' entered, Segment On dropdown showing Unified Individual selected, Publish Type set to Standard Publish, and Publish Schedule set to Do Not Schedule" />

{/* VERIFY: Research confirms this step enters the canvas after saving, but does not confirm the exact button label. Verify whether it is "Save" or "Next" in the SDO segment creation wizard. */}
7. Click **Save** or **Next** to enter the canvas.

## Building the Include criteria

VIP Customers are Gold or Platinum loyalty tier members. The Loyalty Tier field lives on the Loyalty Program Member DMO, which has a relationship to Unified Individual. This makes Loyalty Tier a related attribute, not a direct attribute. You will need a container.

:::warning
Loyalty Program Member appears in the **Related Attributes** section of the attribute sidebar, not the Direct Attributes section. If you do not see it at first, look for an expand button or scroll down in the sidebar.
:::

1. On the segment canvas, confirm you are on the **Include** tab.
2. In the attribute sidebar on the right, find the **Related Attributes** section.
3. Expand the related attributes list to find **Loyalty Program Member**.
4. Expand **Loyalty Program Member** to see its fields. Find **Loyalty Tier**.

<ScreenshotPlaceholder alt="Attribute sidebar with Related Attributes section expanded, showing Loyalty Program Member with its fields including Loyalty Tier highlighted" />

5. Drag **Loyalty Tier** onto the canvas. The platform creates a container for the Loyalty Program Member DMO.

<ScreenshotPlaceholder alt="Segment canvas after dragging Loyalty Tier onto it, showing a newly created Loyalty Program Member container with an empty filter row inside" />

6. Inside the container, set the filter:
   - Field: **Loyalty Tier**
   - Operator: **Is In** (or, if "Is In" is not available, set Loyalty Tier **Is Equal To** Gold, then add an OR condition and set Loyalty Tier **Is Equal To** Platinum)
   - Value: **Gold, Platinum**

{/* VERIFY: Whether "Is In" operator is available for text fields in the Summer '26 segment builder UI. If not, document the OR approach instead. */}

<ScreenshotPlaceholder alt="Loyalty Program Member container showing a Loyalty Tier filter with Is In operator and Gold, Platinum as selected values" />

7. Look at the population count that appears. This is a preview estimate of how many Unified Individuals have a Loyalty Program Member record with Tier = Gold or Platinum. Write this number down. You will use it to gut-check the published member count.

8. Click **Save** to save the segment without publishing.

### About the traversal path

Loyalty Program Member connects to Unified Individual through a direct relationship in the LEOptical data model. There is only one path from Unified Individual to Loyalty Tier, so the platform should not prompt you to choose a traversal path. If a path selection prompt does appear, select the path that goes directly through **Loyalty Program Member**.

{/* VERIFY: Confirm in SDO whether the traversal path prompt appears when adding Loyalty Program Member. Expect it does not appear given only one path exists. */}

## Publishing VIP Customers

A Draft segment has zero members. You need to publish before any flow or activation can use this segment.

1. On the segment canvas or the segment detail view, click **Publish** (or **Publish Now**).
2. A dialog appears. Select a publish schedule:
   - For this exercise, select **Manual** or keep **Do Not Schedule**.
   {/* VERIFY: Research confirms 12-hour and 24-hour cadence options exist but does not confirm the exact label wording in the publish dialog. Verify the precise option labels in SDO. */}
   - In a client org, you would select **Standard — Every 12 hours** or **Standard — Every 24 hours**.

<ScreenshotPlaceholder alt="Publish dialog showing schedule options: Standard Every 12 hours, Standard Every 24 hours, Rapid Every 1 hour, Rapid Every 4 hours, and Manual, with Standard Every 24 hours selected" />

3. Click **Publish** or **Confirm**.
4. The segment status changes to **Processing** or **Publishing**.

<ScreenshotPlaceholder alt="Segment detail view showing the status badge reading 'Processing' with a spinner, and the member count showing dashes or zero" />

5. Wait for the status to change to **Published** or **Active**. In an SDO with seed data, this should complete within a few minutes.

{/* VERIFY: Typical publish time for VIP Customers segment with LEOptical seed data (~48K contacts) in SDO. Update this estimate once confirmed. */}

6. Once published, confirm the member count. It should be a non-zero subset of the total contact population (specifically, the contacts who have Gold or Platinum loyalty records). Compare it against your population count estimate from the builder.

<ScreenshotPlaceholder alt="Segment detail view showing Published status badge, a non-zero member count, and a Last Published timestamp reflecting the recent publish time" />

:::warning
If the member count after publish is zero but your population count in the builder showed thousands, the most likely cause is that the Loyalty Program Member DMO relationship was not correctly configured in the Data Graph, or IDR has not yet linked the Loyalty Program Member records to Unified Individuals. Check your Data Graph configuration and confirm IDR has run.
:::

## Assignment

> **The client wants:** With VIP Customers in place, LEOptical needs three more segments for their first campaign wave.

Build the following three segments in your SDO. Each one uses a different pattern. Apply what you practiced in the VIP Customers walkthrough. Publish each segment and confirm a plausible member count.

---

**Segment 1: Lapsed Buyers**

Goal: Customers with no purchase in the last 180 days.

The Exclude approach is recommended: Include all Unified Individuals with no filter conditions, then Exclude anyone who has a Sales Order in the last 180 days. The remaining population is everyone without a recent purchase.

Alternative approach: Add a Sales Order container on the Include tab, set Aggregation to **Max**, apply it to **Order Date**, and filter: Max(Order Date) **Is Before** [relative date: 180 days ago]. This finds individuals whose most recent order date is older than 180 days.

{/* VERIFY: Which approach works more cleanly in the Summer '26 builder — the Exclude method or the Max(Order Date) Is Before method. Document both for learners but recommend the one that works. */}

Set the lookback window appropriately for a 180-day look-back requirement.

{/* VERIFY: Whether contacts with no Sales Order records at all (never purchased) appear in the Lapsed Buyers segment. If the Exclude approach is used, contacts with zero Sales Orders have nothing to exclude them, so they would be included. If the Max(Order Date) approach is used, contacts with no orders have no Max(Order Date) value and may or may not appear. Verify in SDO and note the behavior in the module. */}

For each segment you build: confirm the member count looks plausible, then spot-check two or three individual Unified Individual profiles to verify they actually match the criteria.

---

**Segment 2: SeeClear Enthusiasts**

Goal: Customers who have purchased any product in the SeeClear product family.

This segment requires traversal through three relationship hops: Unified Individual → Sales Order → Sales Order Product → Product. Product Family is a field on the Product DMO.

In the attribute sidebar, browse through Sales Order → Sales Order Product → Product to find **Product Family**. Drag it onto the canvas. A container is created.

Filter: Product Family **Is Equal To** SeeClear

:::warning
Product Family = "SeeClear" must match the exact value stored in your seed data, including case. If the seed data uses a different capitalization or spelling, the filter will return zero results. Check the actual value in a Product record if the count looks wrong.
:::

For LEOptical's data model, there is only one path from Unified Individual to Product (through Sales Order → Sales Order Product). The traversal path prompt may not appear. If it does appear, select the path through **Sales Order → Sales Order Product → Product**.

{/* VERIFY: Whether the traversal path prompt appears in SDO when adding Product Family to the segment canvas. The LEOptical data model has only one path, so the prompt is not expected. */}

---

:::info
This segment requires Eye Exam data from the clinic data stretch goal in the <ModuleLink slug="ingesting-external-data" /> module. Skip if you did not ingest clinic data.
:::

**Segment 3: Exam Overdue**

Goal: Customers whose last eye exam was more than 12 months ago.

Use the Eye Exam DMO. In the attribute sidebar, find Eye Exam under Related Attributes. Drag **Exam Date** onto the canvas.

Set Aggregation to **Max** (this gives you the most recent exam date). Filter: Max(Exam Date) **Is Before** [relative date: 365 days ago].

{/* VERIFY: Whether "Is Before" with a relative date of 365 days is the correct operator in the Summer '26 builder, or whether the operator label is different (e.g., "Last Number Of Days" with negation, or a different date arithmetic approach). */}

Decide what to do about contacts with no Eye Exam records at all. Contacts with no records in the Eye Exam DMO have no Max(Exam Date) value. The platform may include or exclude them depending on how it handles missing aggregation values.

{/* VERIFY: Whether contacts with zero Eye Exam records appear in a segment that uses Max(Exam Date) Is Before 365 days ago. This is a key design decision for the Exam Overdue segment. Verify in SDO by checking whether protagonist contacts who have no clinic exam records appear in the segment. */}

Document your decision: should contacts with no exam history appear in Exam Overdue? If yes, what approach handles them correctly? If not, add an explicit filter to exclude them. You may need to explain this decision to LEOptical.

---

:::info
**What about Actionable Lists?**

Once you publish a segment, you can expose its members inside Salesforce CRM as an Actionable List. From the App Launcher, find **List Builder for Data 360 Segment**. Create a new Actionable List, select your segment, choose which fields to display, and select the target CRM object type (Contact, Lead, Account, or Opportunity). The list syncs with segment membership on a schedule: records removed from the segment are suppressed in the list.

Actionable Lists are not used for MCA email campaigns. They are the bridge between Data 360 segments and CRM-based sales outreach. If LEOptical's sales team wants to call VIP Customers who have lapsed, an Actionable List is how they get that list into their CRM queue.

{/* VERIFY: Exact navigation path for List Builder for Data 360 Segment in Summer '26. Confirm the feature name in the App Launcher. */}

No action needed here during this assignment. Know the pattern exists.
:::

## Success Criteria

- [ ] VIP Customers segment is Published with a non-zero member count. The count is consistent with the number of Gold and Platinum loyalty tier members in your seed data.
- [ ] Lapsed Buyers segment is Published. Member count is plausible given a 180-day window across approximately 48,000 contacts.
- [ ] SeeClear Enthusiasts segment is Published. You can explain which traversal path was used to reach Product Family.
- [ ] Exam Overdue segment is Published. You have made an explicit decision about whether contacts with no Eye Exam records are included or excluded, and you can explain that decision.
- [ ] You have spot-checked at least two individual Unified Individual profiles per segment to confirm they match the filter criteria.
- [ ] You can explain the difference between the Exclude approach and the Max aggregation approach for Lapsed Buyers, and which one you used.
- [ ] You understand why the Exam Overdue segment requires a lookback window of at least 365 days.
- [ ] You understand why segment membership does not update between publishes.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- A customer placed an order yesterday. Your Lapsed Buyers segment last published at midnight. It is now 10:00 AM. Does that customer appear in the Lapsed Buyers segment right now?
- The SeeClear Enthusiasts segment traverses Sales Order → Sales Order Product → Product. Why does the path through which you reach Product matter? What would happen if a shorter alternative path existed and you chose the wrong one?
- A contact has no Eye Exam records in your org. Did they appear in the Exam Overdue segment? Should they? How would you handle this in a production implementation?
- LEOptical wants a "Gold Members who have NOT purchased in 90 days" segment. Would you build this as a single segment with Include and Exclude criteria, or as two separate segments combined in a flow? What is the trade-off?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Filtered Segments for Data 360 (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/customer-360-audiences-segmentation/create-filtered-segments). Container logic, aggregation options, traversal paths, and filter operators by data type. The most thorough official source for container mechanics.
- [Advanced Segmentation in Data 360 (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/advanced-segmentation-in-data-360/match-segment-types-to-your-use-case). Covers segment types in depth including Waterfall, Dynamic, and Real-Time with use case examples.
- [2 Methods to List Your Segment Members in Marketing Cloud Next (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/list-your-segment-members/). How to query the Unified Individual - Latest DMO to see who is in a segment, including a SOQL approach via the Query Editor.
- [Segmentation Reference (David Palencia)](https://davidpalencia.com/salesforce-data-cloud-segmentation/). Reference for publish statuses, segment limits, canvas mechanics, and the full operator list by data type.
