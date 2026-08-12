---
sidebar_position: 4
title: "Consumption and Entitlements"
description: "How Data 360 consumption-based pricing works, what operations cost credits, and how your design decisions compound into real credit spend at client scale."
---

## Overview

Data 360 does not bill for seats or features. It bills for operations. Every time an identity resolution job runs, every time a segment refreshes, every time a batch ingestion pulls in records, credits are consumed from a pool defined by your contract. When that pool runs out, operations stop. There is no automatic overage. Things simply fail.

This is a fundamentally different model from anything in Marketing Cloud Engagement (MCE). In MCE, the primary cost variables were contact count and message volume. Data processing was included and not separately metered. In MCA, a third dimension exists: Data Services Credits that tick down every time the platform does work on your data. Consultants who miss this dimension get clients into trouble at scale.

This module is worth reading carefully before going into any sizing or scoping conversation. The credit rate card here is the same rate card your client's Salesforce Account Executive uses. Knowing it lets you give credible advice about where their money goes and where to be careful with design decisions.

The concepts in this module will come up again throughout the course as you build data streams, configure identity resolution, define segments, and set up activation. Reading this now means the credit implications will be in the back of your mind as you make design decisions in each of those areas, rather than discovering them after the fact.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- How the credit consumption formula works and what it means in practice.
- The two credit types in MCA (Data Services Credits and Messaging Credits) and how they differ from each other.
- What each major platform operation costs, from free CRM ingestion to the most expensive operation on the rate card.
- Why identity resolution is the single costliest operation and what triggers a full re-run.
- How refresh frequency compounds credit consumption over time.
- How dirty data in LEOptical's dataset drives unnecessary credit spend.
- How to read Salesforce Digital Wallet and what its limitations are.
- How to project credit consumption as LEOptical scales from 80,000 to 600,000 customers.

## The credit consumption model

Data 360 uses a formula for every billable operation:

```
Credits = (Data Volume / 1,000,000) × Operation Multiplier
```

A concrete example: batch Calculated Insights over 2 million rows at a multiplier of 15 costs (2,000,000 / 1,000,000) × 15 = 30 credits.

Credits are consumed each time an operation runs, not just when it is first configured. If you schedule a segment to refresh daily, you pay the segmentation cost every day. If you schedule it hourly, you pay 24 times per day. The formula is the same. The frequency is where costs compound.

Credits come from a pool allocated by your Salesforce contract (your "entitlement"). Once the pool is exhausted, operations fail or are throttled. You cannot buy a temporary top-up online. You contact your Salesforce Account Executive to purchase additional credits.

:::warning
Unused credits expire at the Order End Date on your Order Form. Credits do not roll over into the next contract period. Plan usage accordingly, especially in the first months of an implementation when consumption may be low.
:::

## Credit types

Credits in MCA fall into two distinct pools. They are not interchangeable.

**Data Services Credits** cover data processing operations: ingestion, identity resolution, data transforms, calculated insights, segmentation, activation, and data queries. These are the credits that tick down as Data 360 does work on your data.

**Salesforce Message Credits** cover email, SMS, and WhatsApp sends. These are separate from Data Services Credits. Running a segmentation job does not consume Message Credits. Sending an email does not consume Data Services Credits.

Salesforce reorganized credit types with a pricing overhaul effective March 2, 2026. Orgs that purchased or renewed after February 24, 2026 may also use **Flex Credits**, a poolable universal currency that covers Data 360 operations, Agentforce actions, AI/LLM prompts, and speech services. Flex Credits are shared across products.

:::warning
Flex Credits introduce cross-team credit contention. If your client's org uses Flex Credits and their Sales team runs Agentforce agents heavily, those actions draw from the same pool as your marketing data processing. There is no built-in mechanism to allocate Flex Credits to specific teams or departments. This is a governance problem that must be addressed at the contract and administration level, not in MCA configuration.
:::

:::tip[Coming from MCE?]
- MCE used **SuperMessages** as its primary consumption unit for email, SMS, and push sends. MCA uses Salesforce Message Credits for messaging. The concept is similar (per-send billing with channel multipliers), but the name and rate structure differ.
- MCE contracts specified a **contact tier**, a ceiling on the number of stored contact records. MCA replaces this with Unified Individual profiles as the profile-based entitlement metric.
- MCE had **no equivalent to Data Services Credits**. In MCE, data processing (SQL queries via Query Activity, audience building, deduplication) was included and not separately metered. This entire dimension of MCA billing is new for MCE consultants.
- The **Digital Wallet** is new in MCA. MCE had limited self-service visibility into consumption. Tracking consumption typically required working with a Salesforce Account Executive.
:::

## The operation rate card

This table shows credits consumed per 1 million units processed. These are the numbers that define where your client's money goes.

| Operation | Batch (per 1M rows) | Streaming (per 1M rows) | Notes |
|---|---|---|---|
| CRM Ingestion (internal) | 0 | 0 | Sales Cloud, Service Cloud, MCE, Personalization, Commerce Cloud native connectors are free |
| External Data Pipeline | 2,000 | 5,000 | Third-party sources: Snowflake, S3, BigQuery, Databricks, etc. |
| Data Transforms | 400 | 5,000 | Cleaning, field mapping, deduplication steps |
| Data Federation (Zero-Copy) | 70 | 70 | Per row accessed per query |
| Unstructured Data | 60 per MB | 60 per MB | PDFs, transcripts, vector processing |
| Profile Unification (IDR) | 100,000 | 100,000 | The most expensive operation on the rate card |
| Real-Time Events | 70,000 | N/A | Web/Mobile SDK event tracking |
| Calculated Insights | 15 | 800 | Batch is 53x cheaper than streaming |
| Data Queries | 2 | N/A | Cheapest metered operation |
| Segmentation | 20 | N/A | Processes all source DMO records traversed, not just segment output size |
| Batch Activation | 10 | N/A | Segment to destination |
| Streaming Activation (DMO) | N/A | 1,600 | Real-time activation (e.g., Meta Conversion API) |
| AI Inferences | 3,500 | N/A | Einstein Studio model outputs |

Source: Practitioner rate cards from [jitendrazaa's Data 360 Credit Optimization Guide (March 2026)](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/) and [Szymon Lewandowski's Data 360 Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide). Flex Credit multipliers may differ slightly from legacy Data Services Credit multipliers. Verify current rates against your client's contract terms.

Two patterns in this table are worth noting immediately:

**CRM ingestion is free.** LEOptical's Contacts, Accounts, and Products pull from Salesforce CRM through the Marketing Data Kit. That ingestion costs nothing. The cost enters when you add non-CRM data sources.

**The streaming/batch gap is large.** Batch Calculated Insights cost 15 credits/million. Streaming Calculated Insights cost 800 credits/million. That is a 53x difference for the same computation, with the only distinction being when results are needed. Default to batch unless real-time is a stated business requirement.

{/* VERIFY: Whether manual CSV file uploads (used for LEOptical's loyalty, ecommerce, and exam history data streams) count as external batch ingestion at 2,000 credits/million rows, or are billed differently from API-connected external pipelines */}

## Identity resolution: the expensive one

Profile Unification (Identity Resolution) costs 100,000 credits per million source profiles processed. Put that in context:

- 50x more expensive than external batch ingestion (2,000 credits/million)
{/* VERIFY: Research file lists only the 50x (vs. external batch ingestion) and 6,667x (vs. Calculated Insights) comparisons explicitly. The 5,000x figure is mathematically correct from the confirmed rate card values (100,000 / 20 = 5,000) but the research file does not state this comparison */}
- 5,000x more expensive than batch segmentation (20 credits/million)
- 6,667x more expensive than batch Calculated Insights (15 credits/million)

Credits are charged based on source profiles processed, not on the number of unified profiles produced. A "source profile" is an individual and their related records (contact points, party identifiers) included in the identity ruleset. At LEOptical, that means CRM Contacts, Loyalty Member records, and their associated email and phone contact points all count as source profiles going into the IDR run.

:::warning
Modifying identity resolution matching rules triggers a full reprocessing of all source profiles at the next IDR run. It does not process only new or changed records. It re-evaluates everything. At LEOptical's current scale (~49K contacts), a full IDR re-run is inexpensive. At 600K customers with a multi-source ruleset, a single rule tweak consumes hundreds of thousands of credits in one run. Lock down your IDR ruleset before go-live.
:::

The reason IDR is so expensive per unit is that it does real work: comparing records across sources, running matching logic, and deciding which source records represent the same real person. The cost reflects the computational complexity, not a pricing arbitrage decision.

## Refresh frequency and compounding costs

Credits are consumed every time a process runs. Refresh frequency is where costs multiply.

Consider Calculated Insights across 100 million rows run at different frequencies:

| Frequency | Monthly Credits | Savings vs. Hourly |
|---|---|---|
| Hourly | 54,000,000 | Baseline |
| Every 4 hours | 13,500,000 | 75% |
| Daily | 2,250,000 | 96% |
| Weekly | 321,000 | 99.4% |

Source: [jitendrazaa's Data 360 Credit Optimization Guide (March 2026)](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/)

The same math applies to segment refreshes and IDR runs. A segment that refreshes hourly over a large dataset can consume 96x the credits of a daily refresh for identical results in most marketing use cases. Daily segment refreshes are appropriate for most B2C programs. Hourly refreshes are appropriate for real-time personalization or time-sensitive triggered sends. Weekly refreshes are appropriate for segments that power newsletters or low-cadence campaigns.

The consulting discipline here is asking "how fresh does this actually need to be?" for every scheduled operation, then setting the frequency to match the answer rather than defaulting to the most aggressive schedule.

## How dirty data drives credit consumption

The LEOptical dataset has known data quality issues. These are not just correctness problems. They are credit consumption problems.

**Duplicate contacts force unnecessary IDR processing.** IDR processes source profiles, not distinct people. If LEOptical has two Contact records for the same person (a not-uncommon state in retail CRM data), IDR processes both on every run. Deduplicating the CRM before ingestion reduces the profile count IDR works through.

**Unresolved identities create fragmented Unified Individuals.** If a customer's CRM email doesn't match their loyalty program email and IDR fails to merge them, you get two separate Unified Individuals for one person. Both consume IDR credits on every run. Both appear in segments independently and can trigger duplicate sends. That wastes both Data Services Credits (extra segment processing) and Message Credits (duplicate email sends).

**Orphaned records still get ingested and processed.** LEOptical's ecommerce dataset has Sales Order Products that reference SKUs with no matching Product record. Those orphaned rows are still ingested and traversed during segmentation. They consume ingestion and transform credits without contributing to any useful segment output.

**Mixed data formats require transforms.** LEOptical's `exam_history.csv` uses DD-Mon-YYYY date format. The ecommerce orders use MM/DD/YYYY. Transform jobs normalize these to a standard format. Each transform run costs 400 credits/million rows (batch). More dirty data means more transform work per ingestion cycle.

**Contradictory consent data causes processing overhead.** LEOptical's loyalty CSV has records with `email_optin=true` and an `unsubscribed_date` set simultaneously. These contradictory records require additional logic to resolve during consent processing and can trigger segment recalculations when they cause unexpected membership changes.

The assignment at the end of this module asks you to quantify the credit impact of dirty data cleanup vs. tolerating it. The calculation is not complicated: estimate the reduced source profile count after deduplication, multiply by the IDR rate, and compare to the ongoing cost of running IDR against the inflated dataset.

## Data model complexity and segmentation costs

Segmentation costs 20 credits per million rows processed, but "rows processed" means all DMO records traversed during the query. It is not just the output segment size.

LEOptical's data graph has segments with different traversal depths:

- **Lapsed Buyers segment:** Unified Individual to Sales Order (1 hop)
- **VIP Customers segment:** Unified Individual to Loyalty Program Member (1 hop)
- **Exam Overdue segment:** Unified Individual to Eye Exam (1 hop)
- **SeeClear Enthusiasts segment:** Unified Individual to Sales Order to Sales Order Product to Product (3 hops)

The SeeClear Enthusiasts segment traverses 3 DMO relationships. Each hop multiplies the row count the segment query must process. At LEOptical's current scale this difference is small in absolute credits, but the pattern matters for advice you give as the data model grows.

Research from practitioner guides suggests that data models requiring complex joins can cost 20-40% more in activation credits than flatter models producing the same output ([jitendrazaa, March 2026](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/)). {/* VERIFY: The 20-40% figure comes from a single practitioner source and is not corroborated by a second independent source or official Salesforce documentation. Treat as a practitioner estimate, not a published Salesforce specification */} The design principle is to create only the DMO relationships that segments actually need to traverse, and to target 1-2 DMO hops for frequently-run operations.

## Messaging credit mechanics

Salesforce Message Credits are consumed per recipient per send:

- **Email:** Each email sent to each recipient = 1 credit. CC recipients also consume credits. If you send to 10,000 contacts and CC 4 addresses per email, the total is 50,000 email credits (10,000 × 5).
- **SMS:** Credits vary by country and phone number type. Messages exceeding character limits consume additional credits per segment.
- **WhatsApp:** Credit-based, priced per message with country multipliers.

:::warning
Without an Activation Template configured, MCA sends to every Contact Point Email on a Unified Individual. A customer with 3 email addresses receives 3 emails and 3 email credits are consumed. This is both a messaging credit waste problem and a customer experience problem. The Activation Template is how you specify which contact point to use. This is covered in the <ModuleLink slug="personalization-project" /> module.
:::

## Edition entitlements

MCA ships with different credit allocations depending on the edition purchased.

**Marketing Cloud Growth Edition** (~$1,500/org/month, billed annually) includes approximately 240,000 Data 360 Service credits, 10,000 Segment and Activation credits, 180,000 Email Credits, and 20,000 AI Request Credits annually, with 1 TB storage.

**Marketing Cloud Advanced Edition** (~$3,250/org/month, billed annually) includes approximately 480,000 Data 360 Service credits, 20,000 Segment and Activation credits, 360,000 Email Credits, and 100,000 AI Request Credits annually, with 1 TB storage.

Source: [The Agentic Marketer, MCN Survival Guide for Marketers](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/data-cloud-survival-guide-for-marketers/). {/* VERIFY: These credit allocation numbers come from a single community source and have not been confirmed against an official Salesforce help page or order form. Official pricing pages list starting prices but do not publish included credit allocations publicly. Treat these as approximate until confirmed against Salesforce documentation or a client order form */}

Both editions include email sends. SMS and WhatsApp are add-ons.

For clients on Enterprise or Unlimited Edition with Salesforce Foundations, Data 360 is provisioned at no additional cost with 250,000 credits and 1 TB storage. This is the baseline many larger orgs operate from before purchasing a dedicated MCA license.

## Monitoring with Digital Wallet

Digital Wallet is the self-service consumption dashboard in Salesforce. To access it:

1. Click the App Launcher and search for **Consumption Cards**.
2. Alternatively, navigate to the **Your Account** app and select the **Consumption Cards** tab.

Digital Wallet shows Consumption Cards for each credit type: total allocation, amount consumed, and amount remaining. Time period views include Last 24 Hours, Last 7 Days, Last 30 Days, and Last 90 Days. There is no custom date range option. Data refreshes approximately hourly.

To see Digital Wallet, your user profile or permission set must include the **View Consumption** system permission.

{/* SCREENSHOT: Digital Wallet Consumption Cards showing credit types, amounts, and usage trend */}

:::warning
Digital Wallet shows near-real-time estimates, not contractually billed amounts. Salesforce explicitly warns against treating Digital Wallet data as the authoritative source of truth. The Monthly Account Summary email sent to the primary billing contact on the 10th of each month is the definitive consumption record. Use Digital Wallet for trend monitoring and operational alerting. Use the billing email for contract discussions.
:::

Digital Wallet tracks four consumption categories in an MCA context:

- **Messaging:** Email, SMS, and WhatsApp sends
- **Segmentations and activations:** Data 360 processing operations
- **Data storage:** Storage allocation used vs. provisioned
- **Einstein requests:** AI feature usage

{/* VERIFY: Whether SDO orgs used for this course have their own credit entitlement or are effectively unlimited for demo purposes. This matters for the assignment where learners review consumption metrics in their org */}

Szymon Lewandowski's [How to Use Digital Wallet in Data 360](https://www.szymonlewandowski.pl/blog/data-360/digital-wallet) covers the navigation and UI in detail, including how to read each consumption card and set up consumption alerts.

## Five design mistakes that drive unnecessary credit spend

These are documented anti-patterns from practitioner research:

1. **Ingesting all available data without defined use cases.** Every field ingested is processed on every IDR run and every transform. Only ingest data you have a segment or personalization use case for.

2. **Including unnecessary fields in ingestion.** Research documents this pattern wasting 10% or more of ingestion credits. Audit your field list against actual segment and personalization needs before finalizing data streams.

3. **Misunderstanding IDR incremental processing.** Incremental re-evaluation does not process only new records. It re-evaluates relationships across all source profiles to check for new matches. At scale, "incremental" IDR runs can still process millions of records.

4. **Running unfiltered exploratory queries.** Data Queries cost only 2 credits/million rows, but unfiltered queries across large datasets accumulate in aggregate when run frequently. Always filter before running exploratory queries against production data.

5. **Over-complex data models that force deep DMO traversal.** 20-40% higher activation costs have been documented from data models requiring excessive DMO hops ([jitendrazaa, March 2026](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/)). {/* VERIFY: Same single-source figure as noted above — practitioner estimate, not a Salesforce-published specification */} Design your data model against actual query patterns, not theoretical completeness.

## Scaling considerations for LEOptical

LEOptical currently has approximately 49K CRM contacts, 40K loyalty members, and 100K order records. This is a small data footprint. The credit math at this scale is forgiving.

The engagement scope is 600K customers. That is roughly a 12x increase from the current dataset. Credit consumption for IDR, segmentation, and ingestion scales proportionally if design patterns stay the same.

Three scaling risks stand out:

**Identity Resolution at scale.** At 600K customers with multi-source matching across CRM, loyalty, ecommerce, and exam data, a single IDR rule change could consume several hundred thousand credits in one run. Finalize the IDR ruleset before go-live and treat changes as high-cost operations requiring change management.

**Segment refresh frequency.** If LEOptical adopts aggressive refresh schedules as they scale, the credit cost difference between hourly and daily refreshes is 96x. At 600K records this compounds quickly. Set refresh frequencies that match actual business need.

**Unstructured data.** Unstructured data costs 60 credits/MB. LEOptical does not currently process unstructured data, but this is worth flagging as a future advisory point if they move toward AI-driven content or medical record processing.

The assignment memo asks you to write a scaling recommendation. The frame is: what must LEOptical monitor as they grow, and what design decisions should they make now to avoid credit problems at 600K scale?

## Assignment

> **The client wants:** Before LEOptical goes live, they need to understand how their Data 360 usage impacts their entitlements and what they should monitor as they scale.

1. Navigate to **Digital Wallet** in your SDO (App Launcher > **Consumption Cards**). Review the current consumption state for each credit category. Take a screenshot of the Consumption Cards view.

2. Use the [Endpoint Marketing credit consumption calculator](https://calculate.endpoint.marketing/) to model LEOptical's consumption footprint. Use the data from your SDO configuration: the number of data streams, source record counts, segment count and refresh frequency, and your current IDR ruleset. Document your inputs and the credit estimate it returns.

3. Using the operation rate card in this module, manually calculate the annual credit cost for each major operation in your LEOptical configuration:
   - CRM ingestion (Contacts, Accounts, Products via Marketing Data Kit)
   - CSV data streams (Loyalty, Ecommerce, Exam History): use your row counts from those data streams
   - Identity Resolution: use your source profile count across all connected DMOs
   - Each segment: use your configured refresh frequency and source DMO record counts
   - Calculated Insights: use your current insight definitions and their source data volumes

4. Assess the consumption impact of dirty data in the LEOptical dataset. For each dirty data type documented in the data model (duplicate contacts, unresolved loyalty-CRM email mismatches, orphaned Sales Order Products, mixed date formats requiring transforms), estimate the credit cost of the dirty state vs. the credit cost after cleanup. Which cleanup gives the best credit-per-effort return?

5. Write a one-page scaling recommendation memo for LEOptical. Address: which design decisions have the largest credit consumption impact today, what changes in monitoring and governance they should put in place before scaling to 600K customers, and what the three highest-risk credit consumption scenarios are at that scale.

6. **(Stretch)** Read the [jitendrazaa Data 360 Credit Optimization Guide (March 2026)](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/) in full. Compare its five costliest design mistakes against the LEOptical configuration you have built. Identify which of those patterns you have already introduced, and how you would refactor them.

## Success Criteria

- [ ] Digital Wallet has been accessed in your SDO and a screenshot of the Consumption Cards view is saved.
- [ ] The Endpoint Marketing calculator has been used with LEOptical-specific inputs and a credit estimate has been documented.
- [ ] Manual credit calculations are completed for each major operation in your SDO configuration, using the formula and rate card from this module.
- [ ] Dirty data impact has been assessed for at least three dirty data types from the LEOptical dataset, with credit cost estimates for the dirty vs. clean state.
- [ ] The scaling recommendation memo is written (one page) and addresses monitoring, governance, and the three highest-risk credit scenarios at 600K customers.
- [ ] You can explain to a client why IDR rule changes are high-cost operations and what the operational governance implication is.
- [ ] You can articulate the difference between Data Services Credits and Salesforce Message Credits and why they are tracked separately.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the credit consumption formula for a Data 360 operation? Apply it to batch segmentation over a dataset of 3 million records.
- Identity Resolution is the most expensive operation on the rate card. What specifically does it count as the "unit" for billing purposes, and why does this matter when LEOptical has duplicate CRM contacts?
- A colleague proposes scheduling Calculated Insights to run every hour so segment data is always fresh. What is the credit cost difference between hourly and daily refresh for a large dataset, and what question would you ask before agreeing to the hourly schedule?
- What happens when a client's Data Services Credit pool runs out mid-month? How does this differ from messaging credit exhaustion?
- Explain in plain terms why modifying an IDR matching rule is a high-cost operation that should be treated as a change-controlled event at client scale.
- LEOptical's loyalty CSV has some contacts whose email address differs from their CRM Contact email, preventing IDR from merging them. Name two distinct credit cost consequences of leaving these unresolved vs. fixing the data before ingestion.
- Digital Wallet refreshes approximately hourly and shows near-real-time consumption estimates. A client sees a spike in their segmentation credits and asks if they have been billed. What do you tell them, and what is the authoritative source of their billing data?
- As LEOptical scales from 80K to 600K customers without changing their IDR ruleset or segment refresh schedules, which single operation will drive the largest proportional increase in Data Services Credit consumption, and why?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Maximize Your Data 360 Credits for Effective Usage (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-credit-consumption-quick-look/get-started-with-data-cloud-credit-consumption). Official Trailhead quick-look covering the six operation categories and the consumption formula. Good as a 30-minute reinforcement of this module's concepts.
- [Salesforce Digital Wallet (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/salesforce-digital-wallet-quick-look/get-to-know-salesforce-digital-wallet). Official Trailhead module on Digital Wallet navigation, permissions, and consumption categories.
- [jitendrazaa: Data 360 Credit Optimization Guide (March 2026)](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/). The most detailed publicly available practitioner guide to credit consumption. Covers the full multiplier rate card, five costliest mistakes, calculated insights frequency comparison, and sandbox credit changes. Primary source for much of this module.
- [Szymon Lewandowski: Data 360 Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide). Highly detailed reference for credit types, multiplier tables, sandbox discounts, and optimization patterns.
- [Szymon Lewandowski: How to Use Digital Wallet in Data 360](https://www.szymonlewandowski.pl/blog/data-360/digital-wallet). Step-by-step guide to accessing and reading Digital Wallet, including the authoritative source caveat and how to set consumption alerts.
- [Vantagepoint: Data 360 and Agentforce Pricing (Flex Credits Guide)](https://vantagepoint.io/blog/sf/data-360-agentforce-pricing-flex-credits-guide). Covers the Flex Credits model, cross-product contention, and what happens operationally when credits run out.
- [Deloitte Digital: Data 360 Credit Consumption Evolution](https://www.deloittedigital.com/us/en/insights/perspective/salesforce-data-360-credit-consumption.html). Context on the shift from entitlement-based to credits-based pricing, with five optimization strategies from a practitioner perspective.
- [Digital Mass: Hidden Costs of Data 360, Real TCO Analysis for 2026](https://digitalmass.com/how-we-think/the-hidden-costs-of-data-360-a-real-tco-analysis-for-2026/). Analysis of common underestimation patterns: storage costs, specialist talent costs, and data cleanup costs. Useful background for the scaling memo assignment.
- [Data Services Billable Usage Types (Salesforce Help)](https://help.salesforce.com/s/articleView?id=data.c360_a_data_usage_types.htm&language=en_US&type=5). Official Salesforce Help article listing billable usage types. The page is JavaScript-heavy. Open it directly in your browser.
- [Reduce Credit Consumption in Data 360 (Salesforce Help)](https://help.salesforce.com/s/articleView?id=data.c360_a_reduce_credit_consumption.htm&language=en_US&type=5). Official Salesforce Help article on optimization strategies. Open directly in your browser.
