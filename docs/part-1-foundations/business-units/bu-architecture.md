---
sidebar_position: 2
title: "Business Units"
description: "Understand MCA's business unit architecture, the 1:1 relationship with data spaces, and when to create multiple BUs."
---

## Overview

This page is conceptual. You cannot create business units in your SDO. What you can do is understand the architecture well enough to make a real recommendation for LEOptical and document it clearly enough that a client could act on it.

The assignment deliverable here is a written governance recommendation, not a configuration task.

## Business units in MCA

Business units are organizational containers that partition marketing data, campaigns, audiences, and reporting within a single Salesforce org. They became generally available in Spring '26.

{/* VERIFY: Is BU availability limited to Advanced Edition only, or available in both Growth and Advanced? Multiple sources say "Growth & Advanced Edition" but at least one community source implies Advanced only. Confirm against official Salesforce documentation before advising clients on this. */}

The architecture is simple in concept. Each business unit maps to exactly one Data 360 data space. One data space cannot be shared across multiple business units. This means that all the data objects, identity resolution rulesets, data graphs, and segments configured in that data space are scoped to that business unit. Reporting and audiences do not bleed across boundaries.

Within a single org you can have up to 50 business units. Each BU gets its own email channel configuration. Channels like SMS, WhatsApp, and mobile app messaging can be scoped to a specific BU or configured org-wide across all BUs. Phone numbers for SMS and WhatsApp cannot be shared between business units.

{/* VERIFY: Confirm the phone number sharing restriction for SMS/WhatsApp across BUs against official Salesforce documentation. */}

:::caution
Business units cannot be deleted once created. If you create a BU and decide later it was wrong, you cannot remove it. Treat BU design as a permanent architectural decision before you touch the UI in a production org.
:::

:::tip[Coming from MCE?]
MCE business units and MCA business units share a name but not an architecture.

- **MCE BUs** are content and send partitions within a shared ExactTarget subscriber database. Subscribers exist at the enterprise level and can be shared across BUs.
- **MCA BUs** are full data partitions. Each maps to a separate Data 360 data space. There is no shared subscriber database because identity is managed through Unified Individuals, which are resolved per data space.
- **MCE BUs can be deleted.** MCA BUs cannot.
- **MCE uses a proprietary role system** (Administrator, Content Creator, Analyst, Channel Manager, Security Administrator, Viewer) assigned within the BU hierarchy. MCA uses Salesforce permission sets.
- **MCE has a Subscriber Key** for cross-BU identity tracking. MCA has no Subscriber Key. Identity is resolved through the Unified Individual in Data 360 instead.
- The setup location is different: MCE BUs live in Marketing Cloud Setup. MCA BUs live in **Salesforce Setup > Marketing Cloud > Business Units**.
:::

### When to create multiple business units

The decision to add a second business unit should be driven by a genuine need to isolate data, not by an org chart. The right criteria are:

- **Multiple brands** with distinct audiences, communications, and reporting requirements.
- **Regional divisions** where campaigns, consent, or data must be isolated by geography or legal jurisdiction.
- **Product lines or compliance requirements** that demand separate data spaces (for example, a separate regulated entity with its own data sovereignty rules).

For a single-brand, single-region B2C company like LEOptical, one business unit is the right answer. The trigger for adding a second BU would be acquiring a second brand, expanding to a jurisdiction with separate regulatory requirements, or the marketing org fragmenting into autonomous teams that need strict data isolation.

When you do design a multi-BU structure, base it on a single differentiating field. Brand or region, not a combination of criteria. If the business requirement is more complex, build a Salesforce Flow to combine those criteria into one field first, then use that field to drive BU assignment.

### How BUs relate to data spaces

Every MCA org starts with a default data space in Data 360. During MCA Basic Settings setup, the data space selection determines which data space your MCA instance uses. For most orgs, this is the single default space.

When business units are enabled:

1. Enable Business Units in Salesforce Setup.
2. Set up the first business unit. It becomes associated with the default data space.
3. Create additional business units. Each requires its own data space.
4. Filters are added to Marketing Data Lakehouse Objects (DLOs) to align marketing data with the corresponding data space.

{/* VERIFY: Confirm whether DLO filters are added automatically by the platform or require manual configuration. Research cites SFMC Tips #207 but this was not directly fetchable. Based on field experience, automatic filter creation may not always occur. Verify in a live multi-BU org. */}

**What are DLO filters and why do they matter?**

A Data Lakehouse Object (DLO) is a read-only view of CRM data (Contacts, Leads, Opportunities, etc.) made available to MCA for segmentation and campaign targeting. When you have multiple business units, each with its own data space, DLO filters control which CRM records are visible within each BU's data space. Without the right filters, a business unit might see CRM records that belong to a different brand or region.

For example, if LEOptical ever created a second BU for a new brand, you would need a DLO filter on the Contact object to ensure that each BU only sees the contacts that belong to it. Without the filter, both BUs would see all contacts in the org.

For LEOptical's single-BU setup, DLO filters are not a concern. All CRM data flows into the single default data space.

For further reading: the Salesforce Help article [Configure Data Lakehouse Object Filters for Business Units](https://help.salesforce.com/s/articleView?id=mktg.configure_dlo_filters_for_bu.htm&type=5) covers the filter configuration, and SFMC Tips has a practical walkthrough in [How to Configure Data Space Filters](https://medium.com/@marketingcloudtips/marketing-cloud-next-how-to-configure-data-space-filters-6880c21093bd).

:::warning
The **Select Data Space** dropdown in MCA Basic Settings is greyed out unless the user has the Marketing Cloud Admin permission set. Assign the permission set before attempting to configure data space selection.
:::

### Shared asset library (Summer '26)

Before Summer '26, there was no cross-BU content sharing in MCA. Each business unit's CMS workspace was fully isolated. If a marketing team wanted to use the same email template across two BUs, they had to recreate it in each workspace manually. At scale, this meant brand inconsistency and duplicated effort.

In Summer '26, Salesforce added a shared asset library. Marketing administrators can publish content to a shared library, and other business units can copy it into their own workspace. This solves the brand consistency problem without compromising data isolation: content is shared, customer data is not.

For LEOptical's single-BU setup, this does not apply yet. If LEOptical ever acquires a second brand and a second BU is created, the shared asset library is the right way to distribute approved email templates and brand assets across BUs. (Source: SFMC Tips #285 Summer '26 highlights)

### SDO limitation

:::warning
Business units cannot be enabled in SDOs. SDOs have only a single data space, and the platform does not allow BU creation in that environment. The BU section of this module is intentionally conceptual. Do the reading, understand the architecture, and complete the written deliverable. The permission sets and CMS workspace work in the assignment is hands-on.
:::

### Einstein features and BU awareness

Einstein features in MCA (Send Time Optimization, Einstein Engagement Scoring, Agentforce) became business-unit aware in Spring '26. Each feature operates within the context of the active business unit. This is worth noting when advising clients who plan to use Einstein at scale in a multi-BU org: engagement data, scoring, and AI recommendations are scoped per BU, not shared org-wide.

For LEOptical's single-BU setup, this has no practical effect on current implementation work.

## Assignment

> **The client wants:** LEOptical currently operates as a single brand. They want to understand their options and get clear guidance on whether they need multiple business units now or in the future.

1. Read the [Top 10 Spring '26 Updates for Salesforce Marketers](https://www.salesforceben.com/top-10-spring-26-updates-for-salesforce-marketers/) article from Salesforce Ben. Focus on the business units section. Note what changed in Spring '26 and how BU data isolation works.

2. Read [Business Units in Marketing Cloud](https://mateuszdabrowski.pl/docs/salesforce/marketing-cloud/config/business-units/) by Mateusz Dabrowski. This is the most thorough community reference on BU configuration, data space relationships, and multi-BU governance. Pay attention to the sections on data isolation and setup sequence.

3. Write a brief governance recommendation (one page or less) for LEOptical. Your recommendation must include:
   - Why LEOptical does not need multiple business units today.
   - The specific criteria that would trigger BU creation in the future (at least three distinct scenarios).
   - A note on why the BU decision is permanent and what that means for how LEOptical should think about brand or regional expansion before it happens.

## Success Criteria

- [ ] A written governance recommendation exists documenting why LEOptical does not need multiple BUs today and the criteria that would change that.
- [ ] At least three specific BU creation triggers are documented in the recommendation.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the relationship between a business unit and a Data 360 data space in MCA?
- Why does creating a business unit require more careful upfront planning in MCA than in MCE?
- A client has two brands and one Salesforce org. They want to use MCA for both brands but keep audience data strictly separated. What is the correct architectural approach?
- How does MCA handle identity across the org if there are no Subscriber Keys and no shared subscriber database?
- For LEOptical, the decision today is one business unit. What event or business change would make you revisit that recommendation?
