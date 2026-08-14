---
sidebar_position: 2
title: "Configuring LEOptical's Data Graph"
description: "Step-by-step walkthrough for building the LEOptical Data Graph rooted on Unified Individual and linking it to Marketing Cloud Next."
---

## Overview

The conceptual module explained what a Data Graph is and how it works. This lesson is the build. You will open your SDO, find the Data Graph that <ModuleLink slug="getting-started" /> had you create, and extend it with the full set of DMOs that LEOptical's personalization and segmentation use cases require.

By the end of this lesson, the Data Graph is built, Active, and linked to Marketing Cloud Next as the default for email and Flow personalization. Every module from here that uses Handlebars or Data Graph Decision Splits depends on this work being done correctly.

One thing to know going in: after you click **Save and Build**, removing DMOs or fields is not possible. You can add new ones, but you cannot remove anything already built. Read the LEOptical graph design carefully before you build.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Navigating to the Data Graphs tab in Data 360.
- Opening the existing graph for editing.
- Adding the LEOptical-specific DMOs: Loyalty Program Member, Sales Order, Sales Order Product, and Product.
- Setting the refresh schedule and triggering the build.
- Monitoring build status.
- Running Configure Basic Personalization in Salesforce Setup.
- Verifying the graph in the email builder.

## Navigating to Data Graphs

Data Graphs live in the Data 360 app, not in Salesforce Setup.

1. Click the **App Launcher** (nine-dot grid in the top-left navigation bar).
2. Search for and select **Data Cloud**.
3. In the Data 360 tab bar, look for **Data Graphs**. If it is not visible, click **More** at the end of the tab bar to find it.

<Screenshot src="/img/data-graphs/data-graphs-more.png" alt="Data 360 app tab bar with the More dropdown open, showing Data Graphs as a menu item" caption="Data Graphs may be hidden under the More dropdown if your tab bar is full." />

4. You should see the Data Graphs list view with the **Marketing Content Personalization** graph from Getting Started.

<Screenshot src="/img/data-graphs/personalization-data-graph-list-view.png" alt="Data Graphs list view showing the Marketing Content Personalization graph with Active status, Daily schedule, and a recent Last Refreshed On timestamp" caption="The Data Graphs list view. Each row shows the graph's status, schedule, and last refresh time." />

:::info
If you do not see "Marketing Content Personalization" in the list, you may have skipped or not completed that step in Getting Started. In that case, click **New** to create it from scratch with Unified Individual as the primary DMO.
:::

## Opening the graph for editing

This is a step many people miss. Clicking the graph's name in the list view opens a read-only detail view. To edit the graph and add DMOs or fields, you must use the row dropdown.

1. Scroll to the right end of the **Marketing Content Personalization** row in the list view.
2. Click the **dropdown arrow** ( ⌄ ) at the far right of the row.
3. Select **Edit** from the dropdown menu.

<Screenshot src="/img/data-graphs/edit-data-graph.png" alt="Data Graphs list view with the row dropdown open on the Marketing Content Personalization row, showing options including Edit, Clone, Refresh Now, Update Status, Schedule, and Refresh History" caption="Use the row dropdown to access Edit. Clicking the graph name opens a read-only view." />

The graph editor opens with the left panel showing the current DMO tree and the right panel showing fields for whatever object is selected.

## Adding the LEOptical DMOs

You will add four LEOptical-specific DMOs: Loyalty Program Member, Sales Order, Sales Order Product, and Product.

:::warning
You cannot remove DMOs or fields after clicking **Save and Build**. Add only what is listed here. Extra DMOs slow down build time and increase graph size without benefit.
:::

### Add Loyalty Program Member

Loyalty Program Member connects to **Individual**, not directly to Unified Individual. In the graph tree, you will find Individual nested under Unified Link Individual.

1. In the left panel, expand **Unified Link Individual**, then expand **Individual** to find it in the tree.
2. Click the **+** (add) icon next to **Individual**.
3. A DMO picker appears. Search for **Loyalty Program Member** and select it.

<Screenshot src="/img/data-graphs/add-loyalty-member.png" alt="Data Graph editor left panel showing the tree expanded to Individual, with the DMO picker open and Loyalty Program Member highlighted as a search result" caption="Search for Loyalty Program Member and select it from the picker. The + button is next to Individual, not Unified Individual." />

4. In the right panel, select these fields:
   - `Enrollment Date`
   - `Loyalty Tier`
   - `Points Balance`

<Screenshot src="/img/data-graphs/loyalty-member-fields.png" alt="Right panel showing the Loyalty Program Member field list with Enrollment Date, Loyalty Tier, and Points Balance checked" caption="Select Enrollment Date, Loyalty Tier, and Points Balance. Leave all other fields unchecked." />

5. Loyalty Program Member now appears under Individual in the left panel tree.

### Add Sales Order

Sales Order also connects to **Individual**. A single unified profile may have many orders (1:many relationship).

1. Click the **+** icon next to **Individual** again.
2. Search for **Sales Order** and select it.

<Screenshot src="/img/data-graphs/sales-order-search.png" alt="Data Graph editor left panel with the DMO picker open and Sales Order highlighted as a search result, showing the existing tree with Individual, Contact Point Email, Email Engagement, Bulk Email Message, Message Engagement, Contact Point Phone, Account, and Loyalty Program Member already added" caption="Search for Sales Order in the DMO picker with Individual selected." />

3. In the right panel, select these fields:
   - `Order Start Date`
   - `Status Reason`
   - `Total Amount`

<Screenshot src="/img/data-graphs/sales-order-fields-added.png" alt="Right panel showing the Sales Order field list with Order Start Date, Status Reason, and Total Amount checked" caption="Select Order Start Date, Status Reason, and Total Amount for Sales Order." />

### Add Sales Order Product

Sales Order Product connects to Sales Order, not to Individual directly. Add it as a child of Sales Order.

1. Click the **+** icon next to **Sales Order** in the left panel.
2. Search for and select **Sales Order Product**.
3. In the right panel, select these fields:
   - `Ordered Quantity`
   - `Total Line Amount`
   - `Unit Price Amount`

<Screenshot src="/img/data-graphs/sales-order-product-fields-added.png" alt="Data Graph editor showing Sales Order Product selected in the left panel tree nested under Sales Order, with Ordered Quantity, Total Line Amount, and Unit Price Amount checked in the right panel" caption="Sales Order Product sits under Sales Order in the tree. Select Ordered Quantity, Total Line Amount, and Unit Price Amount." />

### Add Product

Product connects to Sales Order Product.

1. Click the **+** icon next to **Sales Order Product** in the left panel.
2. Search for and select **Product**.
3. In the right panel, select these fields:
   - `Product Family`
   - `Product Name`
   - `Product SKU`

<Screenshot src="/img/data-graphs/product-fields.png" alt="Right panel showing the Product field list with Product Family, Product Name, and Product SKU checked" caption="Select Product Family, Product Name, and Product SKU for the Product DMO." />

### Review the complete graph structure

Before building, confirm the graph matches this structure in the left panel:

```
Unified Individual
  ├── Unified Link Individual
  │     └── Individual
  │           ├── Contact Point Email
  │           ├── Contact Point Phone
  │           ├── Loyalty Program Member
  │           └── Sales Order
  │                 └── Sales Order Product
  │                       └── Product
  └── Unified Indv Contact Point Phone
  └── Unified Indv Contact Point Email
```

If the structure matches, proceed to build.

## Building the graph

1. Click **Save and Build** in the top-right corner of the editor.

<Screenshot src="/img/data-graphs/save-and-build.png" alt="Data Graph editor toolbar showing the Save and Build button highlighted in the top-right corner, with 15/25 objects selected and 19/200 non-key fields selected shown in the left panel header" caption="Click Save and Build when your DMO tree and field selections are complete." />

2. A dialog appears asking you to set the refresh schedule. Leave it set to **Daily** and click **Save and Build** to confirm.

<Screenshot src="/img/data-graphs/data-graph-schedule.png" alt="Set Your Data Graph's Refresh Schedule dialog showing a Refresh Interval dropdown set to Daily and a Save and Build button" caption="Daily refresh is appropriate for LEOptical's email marketing use cases." />

3. You are returned to the Data Graphs list view. The graph's Last Run Status will show a processing state while the build runs.

<Screenshot src="/img/data-graphs/data-graph-processing.png" alt="Data Graphs list view showing the Marketing Content Personalization row with Active status and a recent Last Refreshed On timestamp after a successful build" caption="The graph moves to Active status once the build completes. Build time ranges from 15 minutes to several hours depending on data volume." />

The build takes 15 minutes to several hours depending on data volume. Do not proceed to the next step until the Last Run Status shows **Active**.

:::warning
If you click **Save and Build** and the graph shows an error or reverts, you may have attempted to remove a DMO that was already built. You cannot remove built objects. If the graph is in a broken state, delete it and recreate from scratch.
:::

## Monitoring build status

1. From the Data Graphs list, check the **Last Run Status** column periodically.
2. When status shows **Active** and **Last Refreshed On** reflects a recent timestamp, the build is complete.

<Screenshot src="/img/data-graphs/processing-complete.png" alt="Data Graphs list view with the Marketing Content Personalization row showing Active status and a recent Last Refreshed On timestamp of 1:38 PM" caption="Active status with a recent Last Refreshed On timestamp confirms the build completed successfully." />

## Configuring Basic Personalization in Salesforce Setup

Building the Data Graph is not sufficient on its own. You must also tell Marketing Cloud Next to use it as the default data graph for email, Flow, and dynamic content.

1. Click the **App Launcher** and navigate to **Setup** (the gear icon in the top-right navigation, then **Setup**).
2. In the left Setup menu, navigate to **Reports and Optimization → Customer Engagement**.

<Screenshot src="/img/data-graphs/data-graph-default.png" alt="Customer Engagement setup page showing Customize Scoring Rules, Set Up Salesforce Personalization, and Configure Basic Personalization sections" caption="Setup → Reports and Optimization → Customer Engagement. Configure Basic Personalization is at the bottom." />

3. Click **Go to Data Graphs** next to the Configure Basic Personalization item (or click the item itself if it shows **Edit**).
4. In the **Data Graph** dropdown, select **Marketing Content Personalization**.

<Screenshot src="/img/data-graphs/data-graph-update.png" alt="Configure Basic Personalization with the Data Graph dropdown open showing Marketing Content Personalization as an option" caption="Select your Data Graph from the dropdown and click Update." />

5. Click **Update** to save.

After saving, the email builder's Data Sources tab will show the Data Graph as a selectable source, and Flow elements that reference Data Graph fields become configurable.

## Verifying the graph in the email builder

This is a quick smoke test to confirm the setup is working end-to-end.

To create a draft email and reach the Data Sources tab:

1. Click the **App Launcher** and search for **Marketing**, then select **Marketing**.

<Screenshot src="/img/data-graphs/navigate-to-marketing-tab.png" alt="App Launcher with 'marketing' typed in the search field and Marketing highlighted in the Apps list" caption="Search for Marketing in the App Launcher to navigate to Marketing Cloud Next." />

2. In the top navigation bar, click **Content**.
3. On the All CMS Workspaces page, select **LEOptical Marketing**.

<Screenshot src="/img/data-graphs/navigate-to-leoptical-workspace.png" alt="All CMS Workspaces page showing 11 workspaces with LEOptical Marketing highlighted at the top of the list" caption="Select the LEOptical Marketing workspace to access your content." />

4. In the workspace, click **Add** in the top-right corner and select **Content**.

<Screenshot src="/img/data-graphs/add-content.png" alt="LEOptical Marketing workspace with the Add dropdown open showing Content and Folder as options" caption="Click Add, then Content to create a new piece of content." />

5. In the Create CMS content dialog, select **Email** and click **Create**.

<Screenshot src="/img/data-graphs/select-email.png" alt="Create CMS content dialog showing content type options including Audio, Brand, Consent Banner, Email (selected), Email Template, Expression, Form, Form Handler, and Image" caption="Select Email from the content type list." />

6. When prompted to select an email creation method, choose **Use Components** and click **Select**.

<Screenshot src="/img/data-graphs/use-components.png" alt="Select an email creation method dialog showing Select a Template, Use Components (selected with a blue checkmark), and Create with HTML as options" caption="Use Components opens the drag-and-drop email builder." />

7. The email builder opens. Click the **Data Sources** tab in the right panel.

<Screenshot src="/img/data-graphs/data-sources-tab.png" alt="Email builder showing the canvas on the left, and the right panel with Settings, Style, and Data Sources tabs, with Data Sources selected and Marketing Content Personalization listed under Manage Data Sources with a Default badge" caption="The Data Sources tab shows the Data Graph linked to this email. Marketing Content Personalization should appear here automatically as the default." />

8. Confirm that **Marketing Content Personalization** appears under **Manage Data Sources** with a **Default** badge.

If the Data Graph appears in the Data Sources tab, the configuration is complete. You can discard this draft email.

## Assignment

> **The client wants:** LEOptical needs to answer questions like "Show me Gold loyalty members who purchased SeeClear lenses online in the last 90 days." Build the Data Graph that makes this possible.

1. Complete the full walkthrough above. Confirm that the Data Graph named **Marketing Content Personalization** is Active in your SDO.
2. Run **Configure Basic Personalization** in Salesforce Setup and select your Data Graph.
3. Open the email builder and verify that the Data Graph appears in the Data Sources tab.
4. Navigate to a Unified Individual profile in Data 360 and confirm that related DMO data is visible. Check that a protagonist contact shows loyalty tier and recent order data if they have records in those DMOs.
5. Write down your answers to these questions (you will not submit them, but you will need them for the Personalization module):
   - What is the `ssot__` field name for First Name on the Unified Individual?
   - How would you access the Loyalty Tier field in a Handlebars expression?
   - If a contact has no orders, what will a Handlebars expression referencing `Order Start Date` return?
6. **(Stretch)** If you completed the clinic data stretch goal in <ModuleLink slug="ingesting-external-data" />, add the Eye Exam DMOs to your Data Graph. The clinic data model has two custom DMOs: one for clinic patient records (which maps to Individual) and one for Eye Exam records (which relates to Individual via the patient ID). Using the same pattern you followed for Loyalty Program Member and Sales Order, add the Eye Exam DMO as a child of Individual. Include at minimum these fields: `Exam Date`, `Exam Type`, and `Provider`. You will not get step-by-step screenshots for this one. Use what you learned above.

## Success Criteria

- [ ] The Data Graph named **Marketing Content Personalization** shows **Active** status in the Data Graphs list view.
- [ ] The Last Refreshed On timestamp reflects a completed build (not still building).
- [ ] The graph structure includes Loyalty Program Member, Sales Order, Sales Order Product, and Product under Individual.
- [ ] **Configure Basic Personalization** in Salesforce Setup points to **Marketing Content Personalization**.
- [ ] The email builder Data Sources tab shows the Data Graph with a Default badge.
- [ ] You can navigate to a protagonist Unified Individual profile in Data 360 and see loyalty and/or order data (if that contact has records in those DMOs).
- [ ] You understand that a missing field in the Data Graph is absent from the JSON entirely, not null.
- [ ] You understand the full dependency chain: Data Stream refresh → Identity Resolution → Data Graph refresh → email personalization resolves.
- [ ] **(Stretch)** Eye Exam DMO is included in the graph if clinic data was ingested.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you cannot answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- Why does the LEOptical Data Graph reach Loyalty Program Member through Individual rather than directly off Unified Individual? What does that tell you about how the graph resolves relationships?
- What is the consequence of choosing a daily refresh schedule for a time-sensitive use case like a real-time post-purchase email?
- A colleague added Contact Point Address to the Data Graph but now wants to remove it. Can they? What are their options?
- After clicking Save and Build, the Data Graph shows a processing state for two hours. Is this a problem? What should you check?
- Why does **Configure Basic Personalization** need to be run separately from building the Data Graph? What breaks if you skip it?
- A protagonist contact placed a new order this morning. The Data Graph last refreshed at 2:00 AM. When you preview an email against that contact at 10:00 AM, will the new order appear in the personalization data?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Mavlers: Data Graph in Marketing Cloud Next Setup and Personalization Guide](https://www.mavlers.com/blog/data-graph-in-salesforce-marketing-cloud-next/). Step-by-step creation walkthrough with screenshots. Check against your SDO if UI labels differ.
- [Genetrix Technology: Decision Splits Using Data Graphs](https://genetrix.tech/blogs/salesforce-marketing-cloud-growth-audience-segmentation-in-flows-decision-split-using-data-graphs/). Covers the Configure Basic Personalization prerequisite and how Data Graph fields appear in Flow Decision Splits.
- [Salesforce Developer Docs: Understanding the Data Graph (Handlebars)](https://developer.salesforce.com/docs/marketing/handlebars-for-marketing-cloud-next/guide/mcn-handlebars-guide-data-graph-understanding.html). Official documentation on the `$dataGraph` variable and field access syntax.
