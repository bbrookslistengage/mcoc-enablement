---
has_assignment: false
sidebar_position: 2
title: "MCN vs. MCE"
description: "A high-level orientation to Marketing Cloud Next's architecture and how it differs from Marketing Cloud Engagement."
---

## Overview

Whether you are coming from MCE or encountering marketing automation on the Salesforce platform for the first time, this module gives you the big-picture context for what Marketing Cloud Next is and how its architecture differs from its predecessor. You do not need MCE experience to follow along. Everything here stands on its own.

Throughout this course, you will see "Coming from MCE?" callouts that draw specific comparisons where they are relevant. This module is the wide-angle view. Those callouts are the close-ups.

If you have never touched MCE, that is completely fine. You will not be at a disadvantage. The MCE comparisons exist as reference points for those who find them helpful, and they are easy to skip.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What Marketing Cloud Next is and where it fits in the Salesforce product family.
- The key architectural differences between Marketing Cloud Next and MCE.
- Why Marketing Cloud Next depends on a fully configured data layer before marketing features work.
- How "Coming from MCE?" callouts work throughout the course.

## What is Marketing Cloud Next

Marketing Cloud Next is Salesforce's current-generation marketing automation platform. It is built natively on the core Salesforce platform (Lightning Platform) and on Data 360. It uses the same objects as the core platform, like Contacts, Accounts, and Campaigns.

Marketing Cloud Next is not a rebranding of MCE. It is not MCE with a new coat of paint. It is a fundamentally different product built on a fundamentally different architecture.

### A note on naming

The naming history around this product is messy. At various points, Salesforce has called the platform Marketing Cloud on Core, Marketing Cloud Next, and (as of Spring '26) Agentforce Marketing. Marketing Cloud Next comes in two edition tiers: Growth (MCG) and Advanced (MCA). Growth and Advanced are not separate products. They are tiers of the same platform, with Advanced including additional features like Einstein Engagement Scoring, Einstein Engagement Frequency, Path Experiments, and SMS.

This course covers the Advanced edition (MCA). When you see "MCA" throughout this course, it refers to the Advanced edition tier specifically. When you see "Marketing Cloud Next," it refers to the platform as a whole. If you see "MCG" in Salesforce documentation, it refers to the Growth edition tier of the same platform.

## The architectural shift

Marketing Cloud Next is not MCE with a new UI. The architecture is different at every layer.

MCE (originally ExactTarget) was a standalone platform. It had its own data layer (data extensions and subscriber lists), its own automation engines (a visual campaign orchestrator and Automation Studio), its own content tools (Content Builder), and its own sending infrastructure. You could run MCE without a Salesforce CRM license. Everything was self-contained.

Marketing Cloud Next takes a different approach. It does not have its own data layer. It uses Data 360. It does not have its own automation engine. It uses Salesforce Flow. The marketing-specific features (email builder, landing pages, segments, forms) are built on top of existing platform services: Data 360 for data, Flow for automation, Salesforce CMS for content, and Digital Experiences for landing pages.

Here is how the responsibilities break down:

| Function | What handles it in Marketing Cloud Next |
|----------|----------------------|
| Data unification and segmentation | Data 360 |
| Automation and workflows | Flow Builder, Campaign object |
| Content creation and management | Salesforce CMS (Digital Experiences app) |
| Consent and privacy | Privacy Center |
| AI and scoring | Einstein + Agentforce |
| Reporting | Data 360 + Tableau Next |

The key framing for this course: **Marketing Cloud Next is mostly Data 360 with a thin marketing layer on top.** The marketing-specific additions are the email builder, segments, marketing flow elements, and landing pages. Everything else is a platform service that exists independently of Marketing Cloud Next.

:::tip[Coming from MCE?]
The biggest mental shift: MCE was a self-contained marketing platform. Marketing Cloud Next is a marketing layer on top of platform services. Here is how the major components map:

- **Data extensions / subscriber lists** become Data 360 DMOs (Data Model Objects)
- **MCE's campaign orchestrator / Automation Studio** become Salesforce Flow (with 8 marketing-specific flow types)
- **Content Builder** becomes Salesforce CMS
- **CloudPages** become Digital Experiences landing pages
- **AMPscript / SSJS** are largely replaced by Handlebars (with partial AMPscript support)
- **Subscriber key** is replaced by identity resolution, which produces Unified Individuals through fuzzy matching across sources

MCE could run standalone without a CRM license. Marketing Cloud Next requires an Enterprise+ CRM license. It is natively part of the Salesforce platform, not a separate system connected via Marketing Cloud Connect.
:::

### Flow as the automation engine

All automation in Marketing Cloud Next runs through Salesforce Flow. There is no separate automation engine like MCE's visual campaign orchestrator or Automation Studio.

Flow in Marketing Cloud Next includes 8 marketing-specific flow types:

1. **Segment Triggered Flow** (the most common campaign flow type)
2. **Automation Event-Triggered Flow** (email clicks, form submissions)
3. **Salesforce Record Triggered Flow**
4. **Data Cloud Record Triggered Flow**
5. **On-Demand Flow** (via REST API)
6. **Broadcast Flow** (related to Dynamic Segments)
7. **Activation-Triggered Flow**
8. **Autolaunched Flow** (reusable sub-flows)

If you have used Flow Builder in Sales Cloud or Service Cloud, you already know the interface. Marketing Cloud Next adds marketing-specific elements (like send email actions and wait steps) to the same tool.

## What this means in practice

In MCE, you could build an email, create a data extension, write a SQL query, and send. The data and marketing tools were tightly coupled and self-contained. You could go from zero to sending in a single platform.

In Marketing Cloud Next, before you can send anything, you need:

1. Data streams ingesting data into Data 360
2. Data mapped into DMOs (Data Model Objects)
3. Identity resolution running to produce Unified Individuals
4. Segments built from the unified data model

The marketing tools depend entirely on the data layer. If Data 360 is not configured properly, the marketing features have nothing to work with. There is no data extension you can quickly spin up and populate with a SQL query. The data has to flow through the full pipeline first.

This is not a criticism. It is the architectural reality. Once the data layer is solid, the marketing features are clean and well-integrated with the rest of the Salesforce platform. Getting there takes more upfront configuration than MCE required. Most of what you will spend your time on in the first half of this course is data architecture, not marketing features. That is by design.

## Coming from MCE? callouts throughout the course

Every module that covers a concept with an MCE equivalent includes a "Coming from MCE?" callout. These callouts look like the one earlier in this module. They map the Marketing Cloud Next concept to its MCE counterpart, note what changed, and flag cases where there is no MCE equivalent at all.

The callouts are placed at the point in each lesson where the comparison is most useful. They are not grouped at the end of the module. Some modules have multiple callouts if they cover several concepts with MCE parallels.

If you have no MCE background, skip these callouts. They are supplementary context, not required reading. The lesson content stands on its own without them.

## Assignment

1. Complete the [Marketing Cloud Next Basics](https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-basics) Trailhead module. It takes about 20 minutes and covers the core platform concepts at a high level. Pay attention to the relationship between Data 360, Flow, and the marketing features.
2. If you have MCE experience: write down 3 things you expect to be different in MCA based on what you learned in this module. Keep this list somewhere you can find it. You will revisit it at the end of the course.

## Success Criteria

- [ ] You have completed the Marketing Cloud Next Basics Trailhead module (or read the [Get to Know Marketing Cloud Next](https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-basics/get-to-know-marketing-cloud-next) unit at minimum)
- [ ] You can describe MCA's architecture in one sentence (hint: thin marketing layer on Data 360)
- [ ] If you have MCE experience: you have a written list of 3 expected differences

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the foundational data platform that Marketing Cloud Next is built on?
- How does Marketing Cloud Next's data layer differ from MCE's data extensions and subscriber lists?
- Why does this course describe Marketing Cloud Next as "mostly Data 360 with a thin marketing layer on top"?
- What automation engine does Marketing Cloud Next use, and what does it replace from MCE?
- What should you do with the "Coming from MCE?" callouts if you have no MCE background?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Marketing Cloud Next for Marketing Cloud Engagement Foundations (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-for-marketing-cloud-engagement-foundations) - For learners with MCE background. Covers the four-layer architecture and how MCA works alongside MCE. Good supplementary reading if you are transitioning from MCE.
- [What is Marketing Cloud Advanced Edition? (Salesforce Blog)](https://www.salesforce.com/blog/marketing-cloud-advanced-edition/) - Official Salesforce blog post describing the Advanced edition tier, pricing, and features unique to Advanced.
- [What is the difference between SF Marketing Clouds? (Mateusz Dabrowski)](https://mateuszdabrowski.pl/sites/faq/salesforce/what-is-the-difference-between-sf-marketing-clouds/) - Community resource with the clearest naming history timeline across all Salesforce marketing products.
- [The 8 Main Marketing Flow Types (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/) - Detailed breakdown of all 8 marketing flow types available in MCA.
