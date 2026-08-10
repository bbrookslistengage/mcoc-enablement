---
sidebar_position: 2
title: "Configuring LEOptical's Data Graph"
description: "Step-by-step walkthrough for building the LEOptical Data Graph rooted on Unified Individual and linking it to MCA."
---

## Overview

The conceptual module explained what a Data Graph is and how it works. This lesson is the build. You will open your SDO, find the Data Graph that <ModuleLink slug="getting-started" /> had you create, and extend it with the full set of DMOs that LEOptical's personalization and segmentation use cases require.

By the end of this lesson, the Data Graph is built, Active, and linked to MCA as the default for email and Flow personalization. Every module from here that uses Handlebars or Data Graph Decision Splits depends on this work being done correctly.

One thing to know going in: after you click **Save and Build**, removing DMOs or fields is not possible. You can add new ones, but you cannot remove anything already built. Read the LEOptical graph design carefully before you build.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Navigating to the Data Graphs tab in Data 360.
- Reviewing the "Marketing Content Personalization" graph from Getting Started.
- Adding the LEOptical-specific DMOs: Loyalty Program Member, Sales Order, Sales Order Product, Product, and Eye Exam.
- Setting the refresh schedule.
- Monitoring build status.
- Running Configure Basic Personalization in MCA Setup.
- Verifying the graph in the email builder.

## Navigating to Data Graphs

Data Graphs live in the Data 360 app, not in MCA Setup.

1. Click the **App Launcher** (nine-dot grid in the top-left navigation bar).
2. Search for and select **Data Cloud**.
3. In the Data 360 tab bar, look for **Data Graphs**. If it is not visible, click **More** at the end of the tab bar to find it.

<ScreenshotPlaceholder alt="Data 360 app tab bar showing Data Graphs tab, with 'More' dropdown open in case it is not immediately visible" />

4. You should see the Data Graphs list view. If the "Marketing Content Personalization" graph from Getting Started is present, it appears here with a Last Run Status.

<ScreenshotPlaceholder alt="Data Graphs list view showing Marketing Content Personalization graph with columns for Name, Primary DMO, Last Run Status, and Last Run date" />

:::info
If you do not see "Marketing Content Personalization" in the list, you may have skipped or not completed that step in Getting Started. In that case, you will create the graph from scratch in the walkthrough below. The steps are identical.
:::

## Reviewing the existing graph

Before you modify anything, look at what was built.

1. Click **Marketing Content Personalization** to open the graph.
2. The left panel shows the graph structure: the primary DMO at the top (Unified Individual) and any related DMOs added beneath it.
3. The right panel shows the selected fields for whatever object is highlighted in the left panel.

<ScreenshotPlaceholder alt="Data Graph detail view showing the left panel with Unified Individual at the top of the graph tree, and the right panel listing selected fields like First Name, Last Name, Individual ID" />

Note which DMOs and fields are already included. The Getting Started walkthrough included the basic path from Unified Individual through Unified Link Individual to Individual, Contact Point Email, and Contact Point Phone. If those are present, you are in the right state to continue.

If the graph has fewer objects than expected, the next section adds what is missing.

## Adding the LEOptical DMOs

You will add five LEOptical-specific DMOs to the graph: Loyalty Program Member, Sales Order, Sales Order Product, Product, and Eye Exam.

:::warning
You cannot remove DMOs or fields after clicking **Save and Build**. Add only what is listed here. Extra DMOs slow down build time and increase graph size without benefit.
:::

### Add Loyalty Program Member

Loyalty Program Member connects directly to Unified Individual. This is a 1:1 relationship for LEOptical (each unified profile has one loyalty record, if any).

1. In the graph editor, click the **+** (add) icon next to **Unified Individual** in the left panel.

<ScreenshotPlaceholder alt="Data Graph editor left panel showing Unified Individual with a + icon button to add a related DMO" />

2. A DMO picker appears. Search for **Loyalty Program Member** and select it.

<ScreenshotPlaceholder alt="DMO picker modal with a search field containing 'loyalty', showing Loyalty Program Member as a search result" />

3. In the right panel, select these fields:
   - `Loyalty Tier` (your custom field)
   - `Points Balance` (your custom field)
   - `Enrollment Date`
   - `Status`
   - `Email Address` (the field used for matching if needed)

<ScreenshotPlaceholder alt="Right panel showing Loyalty Program Member field list with checkboxes, with Loyalty Tier, Points Balance, Enrollment Date, Status, and Email Address fields checked" />

4. The Loyalty Program Member node now appears under Unified Individual in the left panel.

### Add Sales Order

Sales Order also connects directly to Unified Individual. This is a 1:many relationship. A single unified profile may have many orders.

1. Click the **+** icon next to **Unified Individual** again.
2. Search for and select **Sales Order**.
3. Select these fields:
   - `Order Date`
   - `Total Amount`
   - `Status`
   - `Customer Email`

<ScreenshotPlaceholder alt="Right panel showing Sales Order field list with Order Date, Total Amount, Status, and Customer Email checked" />

:::info
Sales Order supports Sort and Limit Filters (a feature released in October 2025). You can use these to limit the graph to, for example, the 5 most recent orders per individual. For now, leave Sort and Limit at the default. You can edit the graph to add these later if needed.

{/* VERIFY: Whether Sort and Limit Filters are available in the current SDO UI and where the option appears in the graph editor. */}
:::

### Add Sales Order Product

Sales Order Product connects to Sales Order, not to Unified Individual directly. You add it as a child of Sales Order.

1. Click the **+** icon next to **Sales Order** in the left panel.
2. Search for and select **Sales Order Product**.
3. Select these fields:
   - `Quantity`
   - `Unit Price`
   - `Line Total`

<ScreenshotPlaceholder alt="Data Graph editor left panel showing Sales Order expanded with Sales Order Product nested beneath it, and the right panel showing Sales Order Product fields" />

### Add Product

Product connects to Sales Order Product.

1. Click the **+** icon next to **Sales Order Product**.
2. Search for and select **Product**.
3. Select these fields:
   - `Product Name`
   - `Product SKU`
   - `Product Family`

<ScreenshotPlaceholder alt="Right panel showing Product field list with Product Name, Product SKU, and Product Family checked" />

### Add Eye Exam

Eye Exam is a custom DMO that connects directly to Unified Individual.

1. Click the **+** icon next to **Unified Individual**.
2. Search for **Eye Exam** and select it.
3. Select these fields:
   - `Exam Date`
   - `Next Exam Due`
   - `Exam Type`
   - `Provider`

<ScreenshotPlaceholder alt="Right panel showing Eye Exam custom DMO fields with Exam Date, Next Exam Due, Exam Type, and Provider checked" />

### Review the complete graph structure

Before building, confirm the graph matches this structure in the left panel:

```
Unified Individual
  ├── Unified Link Individual
  │     └── Individual
  │           ├── Contact Point Email
  │           └── Contact Point Phone
  ├── Loyalty Program Member
  ├── Sales Order
  │     └── Sales Order Product
  │           └── Product
  └── Eye Exam
```

<ScreenshotPlaceholder alt="Data Graph editor left panel showing the complete LEOptical graph tree with all DMOs expanded as listed in the structure above" />

If the structure matches, proceed to build.

## Building the graph

1. Click **Save and Build**.

<ScreenshotPlaceholder alt="Data Graph editor toolbar showing the Save and Build button in the top-right corner" />

2. A dialog appears asking you to confirm the refresh schedule. Select **Daily**. This is appropriate for LEOptical's email marketing use cases.

<ScreenshotPlaceholder alt="Refresh schedule dialog with options Hourly, Every 4 hours, Daily (selected), Weekly, and Monthly" />

3. Click **Save and Build** again to confirm.
4. You are returned to the Data Graphs list view. The Last Run Status for your graph shows **Building** or a similar in-progress state.

<ScreenshotPlaceholder alt="Data Graphs list view with Marketing Content Personalization row showing Last Run Status as 'Building'" />

The build takes 15 minutes to several hours depending on data volume. Check back. Do not proceed to the next step until the Last Run Status shows **Active**.

:::warning
If you click **Save and Build** and the dialog does not appear (the graph saves but shows an error or reverts), you may have attempted to remove a DMO that was already built. You cannot remove built objects. If the graph is in a broken state, delete it and recreate from scratch.
:::

## Monitoring build status

1. From the Data Graphs list, check the **Last Run Status** column periodically.
2. When status shows **Active** and **Last Run** reflects a recent timestamp, the build is complete.

<ScreenshotPlaceholder alt="Data Graphs list view with Marketing Content Personalization row showing Last Run Status as 'Active' and a recent Last Run timestamp" />

{/* VERIFY: Whether Summer '26 refresh history UI is accessible in SDO, and where it appears. The Data Graph list view may have a 'View History' option per graph. */}

## Configuring Basic Personalization in MCA Setup

Building the Data Graph is not sufficient on its own. You must also tell MCA to use it as the default data graph for email, Flow, and dynamic content.

1. Click the **App Launcher** and navigate to **Setup** (the gear icon in the top-right navigation, then **Setup**).
2. In the left Setup menu, search for or navigate to **Marketing Cloud > Assisted Setup**.

{/* VERIFY: Exact label path in current SDO. Sources describe it as: Setup > Marketing Cloud > Assisted Setup > Reporting and Optimization > Customer Engagement > Configure Basic Personalization. The label 'Reporting and Optimization' may differ from what appears in your org. */}

3. Find the **Configure Basic Personalization** item under Customer Engagement.

<ScreenshotPlaceholder alt="MCA Assisted Setup page showing the Customer Engagement section with Configure Basic Personalization listed as a setup item" />

4. Click **Configure Basic Personalization** (or **Edit** if it was previously configured).
5. In the dropdown, select **Marketing Content Personalization** (your Data Graph).

<ScreenshotPlaceholder alt="Configure Basic Personalization step showing a dropdown labeled 'Data Graph' with Marketing Content Personalization selected" />

6. Click **Save** or **Confirm**.

After saving, the email builder's Data Sources tab will show the Data Graph as a selectable source, and Flow elements that reference Data Graph fields become configurable.

## Verifying the graph in the email builder

This is a quick smoke test to confirm the setup is working end-to-end.

1. Navigate to **Marketing Cloud > Content > Emails** (or create a new draft email).
2. Open or create a draft email and switch to the **Data Sources** tab (may also be labeled **Personalization** depending on your UI version).
3. Confirm that **Marketing Content Personalization** appears as a data source option.

<ScreenshotPlaceholder alt="Email builder Data Sources tab showing Marketing Content Personalization listed as an available data source" />

4. Navigate the field tree. You should see Unified Individual at the root, with branches for the DMOs you added (Loyalty Program Member, Sales Order, Eye Exam).

<ScreenshotPlaceholder alt="Email builder field picker showing the Data Graph field tree with Unified Individual at root and Loyalty Program Member, Sales Order, and Eye Exam visible as branches" />

If the Data Graph is present in the Data Sources tab and the field tree reflects your DMOs, the configuration is complete.

## Assignment

> **The client wants:** LEOptical needs to answer questions like "Show me Gold loyalty members who purchased SeeClear lenses online in the last 90 days." Build the Data Graph that makes this possible.

1. Complete the full walkthrough above. Confirm that the Data Graph named **Marketing Content Personalization** is Active in your SDO.
2. Run **Configure Basic Personalization** in MCA Setup and select your Data Graph.
3. Open the email builder and verify that the Data Graph appears in the Data Sources tab with the correct field tree.
4. Navigate to a Unified Individual profile in Data 360 and confirm that related DMO data is visible. Check that a protagonist contact shows loyalty tier and recent order data if they have it.
5. Write down your answers to these questions (you will not submit them, but you will need them for the Personalization module):
   - What is the `ssot__` field name for First Name on the Unified Individual?
   - How would you access the Loyalty Tier field in a Handlebars expression?
   - If a contact has no eye exam records, what will a Handlebars expression referencing `Exam Date` return?
6. **(Stretch)** Read the [the-agentic-marketer.com Handlebars guide](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-handlebars-low-code-scripting/) section on `$dataGraph`. Try inserting a basic merge field from your Data Graph into a draft email and preview it against one of your protagonist contacts.

## Success Criteria

- [ ] The Data Graph named **Marketing Content Personalization** shows **Active** status in the Data Graphs list view.
- [ ] The Last Run timestamp on the Data Graph reflects a completed build (not still building).
- [ ] The graph structure includes all five LEOptical DMOs: Loyalty Program Member, Sales Order, Sales Order Product, Product, and Eye Exam.
- [ ] The graph includes the Unified Link Individual → Individual → Contact Point Email traversal path.
- [ ] **Configure Basic Personalization** in MCA Setup points to **Marketing Content Personalization**.
- [ ] The email builder Data Sources tab shows the Data Graph with the correct field tree.
- [ ] You can navigate to a protagonist Unified Individual profile in Data 360 and see loyalty and/or order data (if that contact has records in those DMOs).
- [ ] You understand that a missing field in the Data Graph is absent from the JSON entirely, not null.
- [ ] You understand the full dependency chain: Data Stream refresh → Identity Resolution → Data Graph refresh → email personalization resolves.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you cannot answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- Why does the LEOptical Data Graph traversal to Contact Point Email pass through Unified Link Individual? What would happen if you tried to add Contact Point Email directly off Unified Individual?
- What is the consequence of choosing a daily refresh schedule for a time-sensitive use case like a real-time post-purchase email?
- A colleague added Contact Point Address to the Data Graph but now wants to remove it. Can they? What are their options?
- After clicking Save and Build, the Data Graph shows "Building" for two hours. Is this a problem? What should you check?
- Why does **Configure Basic Personalization** need to be run separately from building the Data Graph? What breaks if you skip it?
- A protagonist contact placed a new order this morning. The Data Graph last refreshed at 2:00 AM. When you preview an email against that contact at 10:00 AM, will the new order appear in the personalization data?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Mavlers: Data Graph in Marketing Cloud Next Setup and Personalization Guide](https://www.mavlers.com/blog/data-graph-in-salesforce-marketing-cloud-next/). Step-by-step creation walkthrough with screenshots. Check against your SDO if UI labels differ.
- [Genetrix Technology: Decision Splits Using Data Graphs](https://genetrix.tech/blogs/salesforce-marketing-cloud-growth-audience-segmentation-in-flows-decision-split-using-data-graphs/). Covers the Configure Basic Personalization prerequisite and how Data Graph fields appear in Flow Decision Splits.
- [Salesforce Developer Docs: Understanding the Data Graph (Handlebars)](https://developer.salesforce.com/docs/marketing/handlebars-for-marketing-cloud-next/guide/mcn-handlebars-guide-data-graph-understanding.html). Official documentation on the `$dataGraph` variable and field access syntax.
