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
3. In the Data 360 tab bar, click **More** at the end of the tab bar. **Segments** appears in the dropdown.

<Screenshot src="/img/segmentation/segments-more.png" alt="Data 360 navigation bar with the More dropdown open, showing Segments highlighted in the list alongside Activation Targets, Activations, Data Spaces, and other items" />

4. Click **Segments**. You are on the Segments list view. All existing segments appear here with their segment status, publish type, population count, and last modified date.

<Screenshot src="/img/segmentation/all-segments.png" alt="Segments list view showing a table with columns for Segment Name, Data Space, Publish Type, Segment Status, Population, and Created Date, with a New button in the top right" />

## Creating the VIP Customers segment

The new segment wizard has three steps. Complete them in order.

**Step 1: Choose creation method and segment type**

1. Click **New**.
2. Under "How do you want to create your segment?", select **Use a Visual Builder**.
3. Under "What type of segment do you want to create?", select **Standard Segment**.

<Screenshot src="/img/segmentation/new-segment.png" alt="New Segment wizard step 1 showing two sections: creation method (Use a Visual Builder selected) and segment type (Standard Segment selected, with Waterfall Segment and Real-Time Segment also visible)" />

4. Click **Next**.

**Step 2: Segment properties**

5. Fill in the segment details:
   - **Segment Name:** VIP Customers
   - **Segment On:** Unified Individual
   - **Description:** Gold or Platinum loyalty tier members

<Screenshot src="/img/segmentation/segment-details.png" alt="New Segment wizard step 2 showing Segment Properties form with Data Space set to default, Segment Name set to VIP Customers, Segment On set to Unified Individual, and Description set to Gold or Platinum loyalty tier members" />

6. Click **Next**.

**Step 3: Publish type and schedule**

7. For **Publish Type**, select **Standard Publish**.
8. For **Publish Schedule**, select **Do Not Schedule** for now. You will publish manually after building the segment.
9. The **Lookback Window** defaults to 90 days. Leave it at 90 days for VIP Customers. For segments that need to look further back (like Lapsed Buyers or Exam Overdue), you would increase this here. This setting cannot be changed after the segment is created.

<Screenshot src="/img/segmentation/segment-schedule.png" alt="New Segment wizard step 3 showing Publish Type options (Standard Publish selected, Rapid Publish available), Publish Schedule with Do Not Schedule selected, and Lookback Window set to 90 Days" />

10. Click **Save** to create the segment and open the canvas.

## Building the Include criteria

VIP Customers are Gold or Platinum loyalty tier members. The Loyalty Tier field lives on the Loyalty Program Member DMO, which has a relationship to Unified Individual. This makes Loyalty Tier a related attribute, not a direct attribute. You will need a container.

1. On the segment canvas, confirm you are on the **Include** tab.
2. In the attribute sidebar on the right, click the **Attributes** tab, then click **Resources** in the sub-navigation.
3. Expand **Attributes** to see the three sections: Unified Individual fields at the top, Direct Data Model Objects, and Related Data Model Objects.
4. Under **Related Data Model Objects**, find and expand **Loyalty Program Member**. Find **Loyalty Tier**.

<Screenshot src="/img/segmentation/loyalty-tier.png" alt="Attribute sidebar showing Attributes tab active, with Resources > Unified Individual > Loyalty Program Member breadcrumb. The sidebar lists attributes in the Loyalty Program Member DMO including Loyalty Tier, with the canvas showing the empty Build your Segment state" />

5. Drag **Loyalty Tier** onto the canvas. The platform creates a container for the Loyalty Program Member DMO with an empty filter row.

<Screenshot src="/img/segmentation/loyalty-tier-container.png" alt="Segment canvas showing a Loyalty Program Member container just created, with a filter row showing Object: Loyalty Program Member, Attribute: Loyalty Tier, Operator: Is Equal To, and an empty Value field with a Complete this field warning" />

6. Inside the container, set the filter:
   - Field: **Loyalty Tier** (already set)
   - Operator: **Is In**
   - Value: Search for and select **Gold**, then **Platinum**

<Screenshot src="/img/segmentation/gold-platinum.png" alt="Loyalty Program Member container with a filter row showing Loyalty Tier, Is In operator, and 2 Value(s) Selected with Gold and Platinum tags. The Segment Population shows 53,763." />

7. Look at the population count that appears. This is a preview estimate of how many Unified Individuals have a Loyalty Program Member record with Tier = Gold or Platinum. Write this number down. You will use it to gut-check the published member count.

8. Click **Save** to save the segment without publishing.

### About the traversal path

Loyalty Program Member connects to Unified Individual through a direct relationship in the LEOptical data model. There is only one path from Unified Individual to Loyalty Tier, so the platform does not prompt you to choose a traversal path. The breadcrumb in the attribute sidebar (Resources > Unified Individual > Loyalty Program Member) confirms the path being used.

## Publishing VIP Customers

A segment with no publish history has zero members. You need to publish before any flow or activation can use this segment.

1. On the segment canvas, click **Save**.
2. Click **Done** to exit the canvas and return to the segment detail view.
3. On the segment detail view, click the **dropdown arrow** next to the Copy button in the top-right. Select **Publish Now**.

<Screenshot src="/img/segmentation/publish-now.png" alt="Segment detail view for VIP Customers showing the dropdown menu open next to the Copy button, with Publish Now highlighted. The detail view shows Segment Status: Active, Segment Population: 9,712, and Activations: 0." />

4. The Publish Status changes to **Publishing**.

<Screenshot src="/img/segmentation/publishing.png" alt="Segment detail view for VIP Customers showing Publish Status: Publishing in the status bar, with Segment Population: 9,712 and Segment Status: Active" />

5. Wait for the Publish Status to change to a completed state. In an SDO with seed data, this should complete within a few minutes.

{/* VERIFY: Typical publish time for VIP Customers segment with LEOptical seed data (~48K contacts) in SDO. Update this estimate once confirmed. */}

6. Once published, confirm the member count. It should be a non-zero subset of the total contact population (specifically, the contacts who have Gold or Platinum loyalty records). Compare it against your population count estimate from the builder.

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

{/* VERIFY: Which approach works more cleanly in the Summer '26 builder -- the Exclude method or the Max(Order Date) Is Before method. Document both for learners but recommend the one that works. */}

Set the lookback window appropriately for a 180-day look-back requirement.

{/* VERIFY: Whether contacts with no Sales Order records at all (never purchased) appear in the Lapsed Buyers segment. If the Exclude approach is used, contacts with zero Sales Orders have nothing to exclude them, so they would be included. If the Max(Order Date) approach is used, contacts with no orders have no Max(Order Date) value and may or may not appear. Verify in SDO and note the behavior in the module. */}

For each segment you build: confirm the member count looks plausible, then spot-check two or three individual Unified Individual profiles to verify they actually match the criteria.

---

**Segment 2: SeeClear Enthusiasts**

Goal: Customers who have purchased any product in the SeeClear product family.

This segment requires traversal through three relationship hops: Unified Individual → Sales Order → Sales Order Product → Product. Product Family is a field on the Product DMO.

In the attribute sidebar, go to Attributes tab > Resources > Attributes > Related Data Model Objects. Browse through Sales Order to find Sales Order Product, then Product, and find **Product Family**. Drag it onto the canvas. A container is created.

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

Use the Eye Exam DMO. In the attribute sidebar, go to Attributes tab > Resources > Attributes > Related Data Model Objects. Find Eye Exam and drag **Exam Date** onto the canvas.

Set Aggregation to **Max** (this gives you the most recent exam date). Filter: Max(Exam Date) **Is Before** [relative date: 365 days ago].

{/* VERIFY: Whether "Is Before" with a relative date of 365 days is the correct operator in the Summer '26 builder, or whether the operator label is different (e.g., "Last Number Of Days" with negation, or a different date arithmetic approach). */}

Decide what to do about contacts with no Eye Exam records at all. Contacts with no records in the Eye Exam DMO have no Max(Exam Date) value. The platform may include or exclude them depending on how it handles missing aggregation values.

{/* VERIFY: Whether contacts with zero Eye Exam records appear in a segment that uses Max(Exam Date) Is Before 365 days ago. This is a key design decision for the Exam Overdue segment. Verify in SDO by checking whether protagonist contacts who have no clinic exam records appear in the segment. */}

Document your decision: should contacts with no exam history appear in Exam Overdue? If yes, what approach handles them correctly? If not, add an explicit filter to exclude them. You may need to explain this decision to LEOptical.

---

:::info
**What about Actionable Lists?**

Once you publish a segment, you can expose its members inside Salesforce CRM as an Actionable List. From the App Launcher, find **List Builder for Data 360 Segment**. Create a new Actionable List, select your segment, choose which fields to display, and select the target CRM object type (Contact, Lead, Account, or Opportunity). The list syncs with segment membership on a schedule: records removed from the segment are suppressed in the list.

Actionable Lists are not used for Marketing Cloud Next email campaigns. They are the bridge between Data 360 segments and CRM-based sales outreach. If LEOptical's sales team wants to call VIP Customers who have lapsed, an Actionable List is how they get that list into their CRM queue.

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
