# Research: Consumption and Entitlements

Generated: 2026-08-12
Module: consumption-entitlements
Sources: 24 consulted, 17 included in research

---

## Module Context

### From module-assignments.md

**Module 10 — Consumption & Entitlements**

> **The client wants:** Before LEOptical goes live, they need to understand how their Data 360 usage impacts their entitlements.

**Assignment:**
- Review Data 360 consumption metrics in your org
- Use the [credit consumption calculator](https://calculate.endpoint.marketing/) to estimate LEOptical's consumption footprint
- Calculate the impact of current design decisions: data streams, unified profiles, segment refresh frequency, data retention
- Identify which design decisions have the biggest consumption impact
- Assess the consumption impact of dirty data: how many credits are consumed by duplicate records, unresolved identities, and orphaned data? What would cleanup save?
- Write a recommendation memo: what should LEOptical monitor as they scale from 80,000 to 600,000 customers?

**Success Criteria:**
- [ ] Consumption metrics are reviewed and documented
- [ ] Credit consumption calculator has been used to model LEOptical's usage
- [ ] Impact of design decisions on consumption is assessed
- [ ] Dirty data consumption impact is assessed (duplicates, orphans, unresolved identities)
- [ ] Scaling recommendation memo is written (1 page)
- [ ] You can advise a client on consumption optimization without sacrificing functionality

> **Terminology note:** The product is called **Data 360**, not "Data Cloud." We use "Data 360" consistently throughout this course.

---

## Platform Concepts

### The Credit Consumption Model

Data 360 uses consumption-based pricing. Credits are consumed each time a billable operation runs, not just when it is initially configured. The fundamental formula is:

**Credits = (Data Volume / 1,000,000) × Operation Multiplier**

Example: Processing 2 million rows through batch Calculated Insights at multiplier 15 = (2,000,000 / 1,000,000) × 15 = 30 credits.

Credits are deducted from a pool defined by your contract (entitlement). When the pool is exhausted, operations fail or are throttled — there is no automatic overage billing. You must purchase additional credits through your Salesforce Account Executive.

Source: [Szymon Lewandowski Data 360 Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide), [Vantagepoint Flex Credits Guide](https://vantagepoint.io/blog/sf/data-360-agentforce-pricing-flex-credits-guide), [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/)

### Credit Types (as of March 2026)

Salesforce reorganized credit types with a pricing overhaul effective March 2, 2026. Orgs that purchased or renewed after February 24, 2026 may use either **Data Services Credits** or **Flex Credits**. Legacy orgs (purchased before February 24, 2026) continue on the pre-March model.

**Data Services Credits** cover data processing operations: ingestion, identity resolution, transforms, calculated insights, segmentation, activation, queries.

**Segmentation and Activation Credits** were a separate pool historically but have been merged into the unified system for newer orgs.

**Flex Credits** are a poolable universal currency covering Data 360 operations, Agentforce actions, AI/LLM prompts, and speech services. They are shared across products — which introduces risk of cross-team credit contention.

**Messaging Credits** (Salesforce Message Credits) are a separate entitlement for email, SMS, and WhatsApp sends. These are not the same as Data Services or Flex Credits.

Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/), [Szymon Lewandowski Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide), [Deloitte Digital consumption evolution](https://www.deloittedigital.com/us/en/insights/perspective/salesforce-data-360-credit-consumption.html)

### MCA Edition Entitlements

**Marketing Cloud Growth Edition** ($1,500/org/month, billed annually):
- Included annually: ~240,000 Data Cloud Service credits, ~10,000 Segment and Activation credits, ~180,000 Email Credits, ~20,000 AI Request Credits, 1 TB storage
- Limited to 10,000 unified profiles (<!-- VERIFY --> confirm current cap)
- Email included; SMS and WhatsApp are add-ons

**Marketing Cloud Advanced Edition** ($3,250/org/month, billed annually):
- Included annually: ~480,000 Data Cloud Service credits, ~20,000 Segment and Activation credits, ~360,000 Email Credits, ~100,000 AI Request Credits, 1 TB storage
- Email included; SMS and WhatsApp are add-ons at $10/1,000 credits
- Additional email sends beyond base: $10/1,000 credits

**Important caveat:** These specific credit allocation numbers come from a single community source (The Agentic Marketer) and have not been confirmed from an official Salesforce help page. Official pricing pages list starting prices and add-on rates but do not publish included credit allocations publicly. <!-- VERIFY --> with Salesforce documentation or order form. Treat these numbers as approximate until confirmed.

**Data 360 Provisioning (Free):** Enterprise and Unlimited editions with Salesforce Foundations receive 250,000 credits and 1 TB storage at no additional cost. This is the baseline many orgs operate from.

**Data 360 Starter for Marketing** (commercial license): 10,000,000 credits, 5 TB storage, at $60,000/year starting list price.

Source: [The Agentic Marketer Data Cloud Survival Guide](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/data-cloud-survival-guide-for-marketers/), [Szymon Lewandowski Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide), [Salesforce Official Calculator](https://www.salesforce.com/data/pricing/calculator/), [cyntexa pricing 2026](https://cyntexa.com/blog/salesforce-marketing-cloud-pricing/)

### Operation Credit Rate Card

This is the complete multiplier table (credits consumed per 1 million units processed). Credits are consumed every time an operation runs, not just on first run.

| Operation | Batch (per 1M rows) | Streaming (per 1M rows) | Notes |
|-----------|-------------------|----------------------|-------|
| Salesforce CRM Ingestion (internal) | 0 | 0 | Free — Sales, Service, MCE, Personalization, Commerce Cloud native connectors |
| External Data Pipeline | 2,000 | 5,000 | Third-party sources: Snowflake, S3, BigQuery, Databricks, etc. |
| Data Transforms | 400 | 5,000 | Cleaning, field mapping, deduplication steps |
| Data Federation (Zero-Copy) | 70 | 70 | Per row accessed per query — see federation economics below |
| Unstructured Data | 60 per MB | 60 per MB | PDFs, transcripts, vector processing |
| Profile Unification (Identity Resolution) | 100,000 | 100,000 | **Most expensive operation by far** — see detail below |
| Real-Time Events | 70,000 | — | Web/Mobile SDK event tracking |
| Calculated Insights | 15 | 800 | Batch is 53x cheaper than streaming |
| Data Queries | 2 | — | Cheapest operation |
| Segmentation | 20 | — | Processes all source DMO records, not just output segment size |
| Batch Activation | 10 | — | Segment to destination |
| Streaming Activation (DMO) | — | 1,600 | Real-time activation (e.g., Meta Conversion API) |
| AI Inferences | 3,500 | — | Einstein Studio model outputs |

Note: Flex Credit multipliers may differ slightly from legacy Data Services Credit multipliers. Flex Credit example from Vantagepoint: Unification = 75,000 credits/million (vs. 100,000 in legacy). Verify current rate card with your Salesforce contract terms.

Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/), [Szymon Lewandowski Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide), [calculate.endpoint.marketing calculator](https://calculate.endpoint.marketing/), [Vantagepoint Flex Credits Guide](https://vantagepoint.io/blog/sf/data-360-agentforce-pricing-flex-credits-guide)

### Identity Resolution: The Most Expensive Operation

Identity Resolution (Profile Unification) costs 100,000 credits per million source profiles processed. This is:
- 50x more expensive than external batch ingestion (2,000 credits/million)
- 6,667x more expensive than batch Calculated Insights (15 credits/million)

**Key clarification on what gets counted:** Credits are based on source profiles processed, not unified profiles produced. A "source profile" is an individual and their related records (contact points, party identifiers) included in the identity ruleset. So 500K records from S3 + 700K from CRM + 200K from Marketing Cloud = 1.4M source profiles = 140,000 credits consumed.

**What triggers a full IDR re-run:**
- Modifying Identity Resolution matching rules (triggers full refresh of all records, not just new ones)
- Any modification, deletion, or suppression in source data also triggers reprocessing at next run

**At LEOptical scale:** With ~49K CRM contacts + ~40K loyalty members + ~100K order records + ~exam records, the identity resolution credit consumption is relatively modest compared to enterprise-scale implementations. But dirty data (duplicates, unresolved identities) forces IDR to process records that would not exist in a clean dataset.

Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/), [Szymon Lewandowski Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide), [davidpalencia IDR guide](https://davidpalencia.com/salesforce-data-cloud-pricing-credit-consumption/)

### Refresh Frequency: Compounding Credit Impact

Credits are consumed every time a process runs, not just at initial setup. Refresh frequency has a dramatic compounding effect.

**Calculated Insights example (50 insights, 100M rows each):**
| Frequency | Monthly Credits | vs. Hourly |
|-----------|----------------|-----------|
| Hourly (every 1h) | 54,000,000 | Baseline |
| Every 4 hours | 13,500,000 | 75% savings |
| Daily | 2,250,000 | 96% savings |
| Weekly | 321,000 | 99.4% savings |

This is the single highest-impact optimization decision after avoiding unnecessary streaming operations.

**Segment refreshes:** Each segment refresh processes all source DMO records at 20 credits/million. A segment over a 49K contact dataset at daily refresh consumes negligible credits, but at enterprise scale or with many segments, this compounds quickly.

Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/)

### Streaming vs. Batch: The 53x Cost Gap

For Calculated Insights, batch costs 15 credits/million while streaming costs 800 credits/million — a 53x difference. For ingestion, batch costs 2,000/million while streaming costs 5,000/million — a 2.5x difference.

**Design principle:** Default to batch for all operations unless real-time processing is a stated business requirement. For most marketing use cases (daily or weekly segment refreshes, periodic calculated insights), batch is sufficient.

Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/)

### Federation Economics

Data Federation (Zero-Copy) costs 70 credits per million rows accessed per query. This is per query — if you access the same external dataset repeatedly, credits compound.

**Break-even calculation:** If you access an external dataset more than ~29 times, one-time batch ingestion (2,000 credits/million) becomes cheaper than repeated federation queries (70 × 29 = 2,030 credits/million). Federation is economical for low-frequency or exploratory access; ingestion is better for data you query regularly.

Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/)

### Messaging Credits: How Email, SMS, and WhatsApp Are Metered

Messaging consumes Salesforce Message Credits, separate from Data Services Credits.

- **Email:** Each email sent to each recipient = 1 credit. CC recipients also consume credits. If you send to 10,000 contacts and CC 4 addresses per email, total = 50,000 email credits (10,000 × 5).
- **SMS:** Credits vary by country and phone number type. Messages exceeding character limits consume additional credits (one SMS = one credit up to the character limit, then additional credits per segment). Multipliers change by contract date and channel.
- **WhatsApp:** Credit-based, priced per message with country multipliers.

**Without an Activation Template:** MCA sends to every Contact Point Email on a Unified Individual. A customer with 3 email addresses receives 3 emails = 3 email credits consumed. This is a direct messaging credit waste vector (also documented in platform-gotchas.md).

Source: [Salesforce Message Credits page](https://www.salesforce.com/marketing/salesforce-message-credits/), [cyntexa pricing guide](https://cyntexa.com/blog/salesforce-marketing-cloud-pricing/), [Salesforce Ben Digital Wallet article](https://www.salesforceben.com/calculate-credit-consumption-with-digital-wallet-in-marketing-cloud-next/)

### What Counts as "Internal" (Free) Ingestion

The following native Salesforce connectors ingest data at zero credit cost (as of August 2025):
- Sales Cloud
- Service Cloud
- Marketing Cloud Engagement (MCE)
- Marketing Cloud Personalization
- Commerce Cloud

**For LEOptical:** CRM data (Contacts, Accounts, Products) ingested via the Marketing Data Kit uses internal pipeline = free. The three CSV data streams (Loyalty, Ecommerce, Exam History) are external/manual uploads, not third-party streaming connections — check whether CSV file uploads are billed as external batch ingestion or handled differently. <!-- VERIFY --> whether manual CSV uploads count as external batch ingestion (2,000 credits/million rows) or are free.

Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/), [Szymon Lewandowski Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide)

### Data Model Design Impact on Consumption

Segmentation processes all source DMO records the query must traverse. Each DMO hop in a segment query adds to the row count processed. Complex data models with many joins multiply the rows processed per segment run.

**Concrete example from research:** Poor data model design requiring complex joins costs 20–40% more in activation credits than a flatter model.

**Design principle:** Only create DMO relationships your segments actually need to traverse. Target 1–2 DMO hops maximum for frequently-run operations. Consolidate related fields into fewer DMOs where possible.

**For LEOptical:** The current data model has multiple hops (Unified Individual → Sales Order → Sales Order Product → Product for SeeClear segment). This is necessary for the use case but is worth noting as a consumption consideration when segment refresh frequency is set.

Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/)

### Impact of Dirty Data on Consumption

Dirty data drives consumption in several ways:

1. **Duplicate records force unnecessary IDR processing.** IDR processes source profiles, not distinct people. If LEOptical has duplicate contacts in the CRM (same person, two Contact records), IDR processes both. Clean deduplication before ingestion reduces IDR credit consumption.

2. **Unresolved identities create fragmented Unified Individuals.** If a customer's CRM email doesn't match their loyalty email and IDR fails to merge them, you get two separate Unified Individuals for one person. Both consume IDR credits on every run. Both appear in segments independently, potentially causing duplicate sends — which wastes messaging credits and damages customer experience.

3. **Orphaned records still get processed.** Orphaned Sales Order Products (SKUs that don't exist in the Product DMO) are still ingested and processed. They consume ingestion and transform credits without contributing to useful segments.

4. **Over-broad IDR rules create over-merges.** Over-merged profiles (two different people treated as one) cause incorrect segment membership, which can trigger additional segment refresh runs when downstream sends reveal the error.

5. **Mixed date formats in CSVs (dirty data in exam_history.csv, ecommerce_orders.csv) require data transforms.** Each transform run consumes 400 credits/million rows (batch). More dirty data = more transforms needed.

Source: Research synthesis from [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/), [Szymon Lewandowski Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide), module-assignments.md, data-model.md

### Scaling Projections: LEOptical's Path to 600K Customers

**Current state (LEOptical):** ~49K CRM contacts, ~40K loyalty members, ~100K orders. Relatively modest data volume.

**Projected state:** 600K customers. This is roughly a 12x scale increase. Credit consumption for IDR, segmentation, and ingestion would scale proportionally if design patterns don't change.

**Key scaling risk: Identity Resolution.** At 100,000 credits/million profiles, a 12x scale from current levels does not threaten entitlements immediately, but it means every modification to IDR rules becomes 12x more expensive. At 600K customers with multi-source matching across CRM, loyalty, ecommerce, and exam data, a single IDR rule change could consume several hundred thousand credits in one run.

**Key scaling risk: Segment refresh frequency.** If LEOptical adopts hourly segment refreshes as they scale, the credit cost is 96x higher than daily refreshes (per the calculated insights example). Segments over 600K records refreshed hourly generate significant consumption.

**Key scaling risk: Unstructured data.** At 60 credits/MB, any AI-driven content processing (transcripts, medical records, etc.) at scale would drive significant consumption. Not currently in LEOptical's model, but relevant as a future advisory point.

Source: Data synthesized from [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/), scaling scenario analysis

### The Five Costliest Design Mistakes

These are documented anti-patterns from practitioner research:

1. **Ingesting all data preventively** without defined use cases. Every field ingested is processed on every IDR run and every transform.
2. **Including unnecessary fields in ingestion.** Documented to waste 10%+ of ingestion credits.
3. **Misunderstanding IDR scheduling.** Incremental re-evaluation processes far more rows than just new data — it re-evaluates relationships across all source profiles to check for new matches.
4. **Running unfiltered exploratory queries.** Each Data Query costs 2 credits/million rows, but unfiltered queries across large datasets can consume thousands of credits per execution in aggregate.
5. **Poor data model design requiring complex joins.** 20–40% higher activation costs documented from excessive DMO hops.

Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/)

---

## UI Navigation Paths

- **Digital Wallet / Consumption Cards**: App Launcher → search "Consumption Cards" (Source: [Szymon Lewandowski Digital Wallet guide](https://www.szymonlewandowski.pl/blog/data-360/digital-wallet), [Salesforce Ben Digital Wallet article](https://www.salesforceben.com/monitor-your-product-consumption-with-salesforce-digital-wallet/))
- **Alternate path**: Your Account app → Consumption Cards tab (Source: [Salesforce Ben](https://www.salesforceben.com/monitor-your-product-consumption-with-salesforce-digital-wallet/))
- **Permissions required**: "View Consumption" system permission must be added to user Profile or Permission Set (Source: [Szymon Lewandowski Digital Wallet guide](https://www.szymonlewandowski.pl/blog/data-360/digital-wallet), [Salesforce Ben](https://www.salesforceben.com/monitor-your-product-consumption-with-salesforce-digital-wallet/))
- **Credit consumption calculator (external)**: https://calculate.endpoint.marketing/ — unofficial tool from Endpoint Marketing (Source: module-assignments.md, [calculate.endpoint.marketing](https://calculate.endpoint.marketing/))
- **Official Salesforce Data 360 pricing calculator**: https://www.salesforce.com/data/pricing/calculator/ (Source: [Salesforce official](https://www.salesforce.com/data/pricing/calculator/))
- **Open-source community calculator**: https://rammc.github.io/data360-credit-calculator/ (Source: [Capgemini Medium article](https://medium.com/capgemini-salesforce-architects/why-we-built-an-open-source-data-360-credit-calculator-7388a97adb39))

### What Digital Wallet Shows

- Consumption Cards for each credit type: total allocation, amount consumed, amount remaining
- Time period views: Last 24 Hours, Last 7 Days, Last 30 Days, Last 90 Days (no custom date ranges currently)
- Usage trends with table or chart display
- Breakdown by usage type and by org (production vs. sandbox)
- Data refreshes hourly (delays can occur)
- Monthly Account Summary email sent to primary billing contact on the 10th of each month

**Critical limitation documented by practitioners:** Salesforce warns not to treat Digital Wallet data as the authoritative source of truth. Monthly billing emails are the definitive consumption record. Digital Wallet shows near-real-time estimates, not the contractually billed amounts.

Source: [Szymon Lewandowski Digital Wallet guide](https://www.szymonlewandowski.pl/blog/data-360/digital-wallet), [Salesforce Ben](https://www.salesforceben.com/monitor-your-product-consumption-with-salesforce-digital-wallet/)

### Tracked Consumption Categories in Digital Wallet (MCA context)

1. **Messaging** — Email, SMS, and WhatsApp sends
2. **Segmentations and activations** — Data 360 operations
3. **Data storage** — Storage allocation used vs. provisioned
4. **Einstein requests** — AI feature usage
5. (Campaign Calendar forecasting available in Digital Wallet for MCN — visual campaign timeline with segment size impact on projected credits)

Source: [Salesforce Ben Digital Wallet MCN article](https://www.salesforceben.com/calculate-credit-consumption-with-digital-wallet-in-marketing-cloud-next/), [Brinkview Digital Wallet article](https://brinkview.com/how-using-digital-wallet-in-marketing-cloud-next-shapes-your-credit-usage-consumption-patterns-and-campaign-costs/)

---

## Platform Gotchas

### From platform-gotchas.md (relevant to this module)

**SDOs have one data space** (confirmed 2026-08-06, Summer '26): SDO orgs only have a single data space. This limits certain consumption modeling scenarios.

**Einstein Engagement Scoring requires real engagement history** (confirmed 2026-08-06, Summer '26): Will not produce results with seed data alone. This means AI Request Credits (which are part of edition entitlements) will not be meaningfully consumed by Einstein engagement features in an SDO environment — learners can observe the credit category in Digital Wallet but cannot generate representative consumption data.

### New Gotchas Identified During Research

**Sandbox consumption now routes to the production credit pool.**
Confirmed as of June 2025 (from Digital Wallet sandbox usage alerts blog, May 2025 rollout): Starting May 2025, sandbox usage of Einstein Requests and Flex Credits routes to the production card in Digital Wallet. Sandbox data streams replicated from production begin ingesting immediately and consume the shared credit pool. Sandbox operations apply a 20% discount multiplier (e.g., Profile Unification in sandbox = 80,000 credits/million vs. 100,000 in production).
Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/), [Szymon Lewandowski Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide), search results citing Digital Wallet Sandbox Usage Alerts blog (June 2025)

**SDO orgs used for this course are Demo Orgs, not sandboxes.** The sandbox credit routing policy applies to sandbox environments connected to production. SDO (demo org) credit pools are separate from any production customer org. Learners using SDOs for course exercises are not burning client production credits.
<!-- VERIFY --> whether SDO orgs have their own credit entitlement or are effectively unlimited for demo purposes. This matters for the assignment where learners review consumption metrics.

**Modifying IDR rules triggers full reprocessing.** Any change to identity resolution matching rules — even minor tweaks — triggers a full refresh of all source profiles at the next IDR run, not just incremental processing. At scale, this is the single most dangerous cost driver.
Source: [davidpalencia IDR guide](https://davidpalencia.com/salesforce-data-cloud-pricing-credit-consumption/), [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/)

**Digital Wallet is a near-real-time estimate, not the billing record.** Salesforce explicitly warns not to treat Digital Wallet data as the authoritative source of truth. Monthly billing emails are definitive.
Source: [Szymon Lewandowski Digital Wallet guide](https://www.szymonlewandowski.pl/blog/data-360/digital-wallet)

**Credits do not roll over.** Unused credits expire at the Order End Date on your Order Form. Credits must be used within the contract period.
Source: [Vantagepoint Flex Credits Guide](https://vantagepoint.io/blog/sf/data-360-agentforce-pricing-flex-credits-guide)

**When credits run out, operations fail — no automatic overage.** Unlike some SaaS products that charge overage fees, Salesforce Data 360 operations that require credits simply fail or are throttled when the credit pool is exhausted. Messaging overages for Marketing Cloud are handled differently (overage charges apply). Data 360 processing operations stall until additional credits are purchased.
Source: [Vantagepoint Flex Credits Guide](https://vantagepoint.io/blog/sf/data-360-agentforce-pricing-flex-credits-guide), search results synthesis

**Classification of data pipeline type is locked post-ingestion.** Whether a data pipeline is classified as Engagement, Profile, or Other type is set at ingestion and cannot be changed after the fact. This has billing implications because some operations may have different costs by classification. <!-- VERIFY --> specific classification options and whether this is still locked in Summer '26.
Source: [jitendrazaa Credit Optimization Guide](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-consumption-guide-march-2026/)

**Flex Credit cross-team contention is an unresolved governance problem.** When Flex Credits are shared across Salesforce products (Data 360, Agentforce, Slack), there is no built-in mechanism to allocate credits to specific teams or departments. Marketing credits can be consumed by Sales or Service team Agentforce usage.
Source: [Salesforce Ben Digital Wallet MCN article](https://www.salesforceben.com/calculate-credit-consumption-with-digital-wallet-in-marketing-cloud-next/), [Brinkview Digital Wallet article](https://brinkview.com/how-using-digital-wallet-in-marketing-cloud-next-shapes-your-credit-usage-consumption-patterns-and-campaign-costs/)

---

## MCE Comparison Points

**MCE equivalent concept: SuperMessages**
MCE used "SuperMessages" as its primary consumption unit for email, SMS, and push sends. SuperMessages were counted on a per-send basis with multipliers for certain channel types (mobile push was more expensive than email). MCE contracts included a SuperMessage allowance per year.

**MCE equivalent for contact limits:** MCE contracts specified a "contact tier" — a ceiling on the number of contact records stored in the platform. Once exceeded, additional contact blocks could be purchased.

**What changed in MCA/MCN:**
- SuperMessages are replaced by Salesforce Message Credits (different name, similar concept for messaging).
- Contact tiers are replaced by Unified Individual profiles as the profile-based entitlement metric (Data 360 profiles: $240–$420 per 1,000 annually as an add-on).
- MCA adds a new category of entitlement that MCE did not have: **Data Services Credits** for platform operations (ingestion, IDR, transforms, segmentation, activation). MCE consultants will be unfamiliar with this model — in MCE, data processing was included and not separately metered.
- MCE had no equivalent to Identity Resolution as a separately metered operation. MCE used subscriber keys for identity; there was no credit cost for deduplication or profile unification.
- MCE had no equivalent to Calculated Insights credits. MCE SQL queries run through Query Activity were not separately metered.
- The Digital Wallet is new in MCA — MCE had limited self-service visibility into consumption; tracking required working with a Salesforce Account Executive.

**What has no MCE equivalent:**
- Data Services Credits (ingestion, IDR, transforms, queries) — entirely new in MCA
- Segment and Activation Credits — MCE had subscriber-based segmentation without per-run metering
- Einstein/AI Request Credits — MCE had Einstein Engagement Scoring as a feature but without this credit model

**Practical implication for MCE consultants:** The jump from MCE to MCA means learning an entirely new entitlement framework. In MCE, the primary cost variables were contact count and message volume. In MCA, those still exist, but a third dimension — data processing credits — adds significant complexity and new optimization considerations.

---

## External Resources

- [Data Services Billable Usage Types for Data 360](https://help.salesforce.com/s/articleView?id=data.c360_a_data_usage_types.htm&language=en_US&type=5) — Official Salesforce Help article listing billable usage types. JavaScript-heavy page that did not render fully during research; visit directly in browser.
- [Reduce Credit Consumption in Data 360](https://help.salesforce.com/s/articleView?id=data.c360_a_reduce_credit_consumption.htm&language=en_US&type=5) — Official Salesforce Help article on optimization strategies. Same rendering issue; visit directly.
- [Maximize Your Data 360 Credits for Effective Usage (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-credit-consumption-quick-look/get-started-with-data-cloud-credit-consumption) — Trailhead quick-look module on credit consumption. Covers the six operation categories and the consumption formula.
- [Salesforce Digital Wallet (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/salesforce-digital-wallet-quick-look/get-to-know-salesforce-digital-wallet) — Official Trailhead module on Digital Wallet. Good for learners to complete as part of the assignment.
- [Digital Wallet overview — salesforce.com](https://www.salesforce.com/agentforce/digital-wallet/) — Official product page. Covers monitoring capabilities, alert thresholds, and Tableau Next forecasting.
- [Szymon Lewandowski: Data 360 Credits Guide](https://www.szymonlewandowski.pl/blog/data-360/credits-guide) — Highly detailed practitioner reference for credit types, multiplier tables, sandbox discounts, and optimization strategies. One of the most complete publicly available references.
- [Szymon Lewandowski: How to Use Digital Wallet in Data 360](https://www.szymonlewandowski.pl/blog/data-360/digital-wallet) — Step-by-step guide to accessing and reading Digital Wallet, including the "not a source of truth" caveat.
- [jitendrazaa: Salesforce Data 360 Credit Optimization Guide (March 2026)](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/) — Comprehensive practitioner guide with complete multiplier rate card, all five costliest mistakes, calculated insights frequency comparison table, and sandbox credit change details. Primary research source for this module.
- [Salesforce Ben: Calculate Credit Consumption With Digital Wallet in Marketing Cloud Next](https://www.salesforceben.com/calculate-credit-consumption-with-digital-wallet-in-marketing-cloud-next/) — Covers the MCN-specific Digital Wallet experience including Campaign Calendar forecasting feature.
- [Salesforce Ben: Monitor Your Product Consumption with Digital Wallet](https://www.salesforceben.com/monitor-your-product-consumption-with-salesforce-digital-wallet/) — Navigation paths, UI features, and permission requirements.
- [Deloitte Digital: Data 360's Credit Consumption Evolution](https://www.deloittedigital.com/us/en/insights/perspective/salesforce-data-360-credit-consumption.html) — Context on the transition from entitlement-based to credits-based model; five optimization strategies.
- [The Agentic Marketer: Data Cloud Survival Guide for MCN Marketers](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/data-cloud-survival-guide-for-marketers/) — Source for Growth/Advanced edition included credit allocations (<!-- VERIFY -->) and operation-level credit costs.
- [Digital Wallet (Endpoint Marketing calculator)](https://calculate.endpoint.marketing/) — Unofficial but widely referenced third-party credit consumption calculator. Used in the assignment.
- [Salesforce Official Data 360 Pricing Calculator](https://www.salesforce.com/data/pricing/calculator/) — Official Salesforce calculator tool. Shows starter SKU pricing and credit rates.
- [Vantagepoint: Data 360 & Agentforce Pricing — Flex Credits Guide](https://vantagepoint.io/blog/sf/data-360-agentforce-pricing-flex-credits-guide) — Covers Flex Credits model, cross-product credit contention, and what happens when credits run out.
- [Brinkview: How Digital Wallet Shapes MCN Credit Usage](https://brinkview.com/how-using-digital-wallet-in-marketing-cloud-next-shapes-your-credit-usage-consumption-patterns-and-campaign-costs/) — MCN-specific view of Digital Wallet and credit consumption patterns.
- [Hidden Costs of Data 360: Real TCO Analysis for 2026 (Digital Mass)](https://digitalmass.com/how-we-think/the-hidden-costs-of-data-360-a-real-tco-analysis-for-2026/) — Practitioner analysis of common underestimation patterns; storage costs, specialist talent, data cleanup costs. Useful for the scaling memo assignment.

---

## Data Model Relevance

This module does not involve configuring the data model. However, data model decisions made in earlier modules directly determine consumption patterns in this module.

**DMOs and consumption:**
- **Individual + Contact Point Email + Contact Point Phone + Account** (CRM via Marketing Data Kit): Ingested via internal Salesforce connector = free.
- **Loyalty Program Member** (CSV data stream): External batch ingestion = 2,000 credits/million rows per refresh.
- **Sales Order + Sales Order Product** (CSV data stream): External batch ingestion = 2,000 credits/million rows per refresh.
- **Eye Exam** (CSV data stream, custom DMO): External batch ingestion = 2,000 credits/million rows per refresh.
- **Unified Individual** (post-IDR): Created via Identity Resolution = 100,000 credits/million source profiles per IDR run.
- **Communication Subscription Consent** (flow-created): Created by Triggered Flow; no direct ingestion credit cost, but the records participate in the data graph and are traversed during segmentation.

**Data graph and segmentation costs:**
The current LEOptical data graph has segments that require multiple DMO hops:
- SeeClear Enthusiasts: Unified Individual → Sales Order → Sales Order Product → Product (3 hops)
- Lapsed Buyers: Unified Individual → Sales Order (1 hop)
- VIP Customers: Unified Individual → Loyalty Program Member (1 hop)
- Exam Overdue: Unified Individual → Eye Exam (1 hop)

Deeper traversal (SeeClear segment) costs more per segment run than shallower segments.

**Dirty data in the data model (from data-model.md):**
- ~5% of Contacts have missing Last Name (dirty data)
- Phone numbers in mixed formats
- Ecommerce orders with mixed date formats (MM/DD/YYYY in CSV)
- Exam history with DD-Mon-YYYY format
- Orphaned Sales Order Products (SKUs that don't match Products)
- Loyalty CSV: email_optin=true records with unsubscribed_date set (contradictory)
- Loyalty CSV: some rows have different email than CRM Contact (IDR matching challenge)

These dirty data scenarios drive transform consumption and IDR reprocessing. Learners can calculate the credit impact of cleanup vs. tolerating dirty data as part of the assignment.

**Communication Subscriptions (4 subscriptions):** Each subscriber consent record is traversed during activation template resolution. Not a major credit driver at LEOptical scale, but relevant at 600K.

---

## Source Log

- https://help.salesforce.com/s/articleView?id=data.c360_a_data_usage_types.htm — Salesforce Help official page for billable usage types; JavaScript rendering prevented content extraction. Visit directly in browser.
- https://help.salesforce.com/s/articleView?id=data.c360_a_reduce_credit_consumption.htm — Salesforce Help official page for credit reduction strategies; same rendering issue.
- https://help.salesforce.com/s/articleView?id=004652693&language=en_US&type=1 — Salesforce Help: Data 360 Credit Consumption for Data Federation; rendering issue, no content extracted.
- https://help.salesforce.com/s/articleView?id=xcloud.wallet_monitor_usage.htm — Salesforce Help: Monitor Usage with Digital Wallet; rendering issue, no content extracted.
- https://help.salesforce.com/s/articleView?id=mktg.mc_overview_limits.htm — Salesforce Help: Marketing Cloud Limits and Guidelines; rendering issue, no content extracted.
- https://help.salesforce.com/s/articleView?id=mktg.um_credit_usage.htm — Salesforce Help: Unified Messaging credit usage; rendering issue, no content extracted.
- https://help.salesforce.com/s/articleView?id=004924080&language=en_US&type=1 — Salesforce Help: Data 360 Sandbox Credit Merge; rendering issue, no content extracted.
- https://trailhead.salesforce.com/content/learn/modules/data-cloud-credit-consumption-quick-look/get-started-with-data-cloud-credit-consumption — Trailhead: Data 360 Credit Consumption Quick Look; useful — covers six operation categories and consumption formula.
- https://trailhead.salesforce.com/content/learn/modules/salesforce-digital-wallet-quick-look/get-to-know-salesforce-digital-wallet — Trailhead: Digital Wallet Quick Look; useful — navigation, permissions, consumption types tracked.
- https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/ — Primary research source; complete multiplier table, optimization strategies, sandbox credits, refresh frequency analysis.
- https://www.szymonlewandowski.pl/blog/data-360/credits-guide — Highly detailed credits guide with multiplier table, edition allocations, sandbox discount (20%), optimization strategies.
- https://www.szymonlewandowski.pl/blog/data-360/digital-wallet — Digital Wallet navigation guide including the "not a source of truth" caveat.
- https://www.salesforceben.com/calculate-credit-consumption-with-digital-wallet-in-marketing-cloud-next/ — MCN-specific Digital Wallet features including Campaign Calendar.
- https://www.salesforceben.com/monitor-your-product-consumption-with-salesforce-digital-wallet/ — Digital Wallet navigation paths and UI features.
- https://www.deloittedigital.com/us/en/insights/perspective/salesforce-data-360-credit-consumption.html — Deloitte: credit consumption evolution and optimization strategies.
- https://www.salesforce.com/agentforce/digital-wallet/ — Official Salesforce Digital Wallet product page; features, supported products.
- https://www.salesforce.com/data/pricing/calculator/ — Official Data 360 pricing calculator; SKU pricing confirmed.
- https://calculate.endpoint.marketing/ — Endpoint Marketing unofficial calculator; full input parameter list and credit rate card extracted.
- https://vantagepoint.io/blog/sf/data-360-agentforce-pricing-flex-credits-guide — Flex Credits model, cross-product contention, what happens when credits run out.
- https://digitalmass.com/how-we-think/the-hidden-costs-of-data-360-a-real-tco-analysis-for-2026/ — TCO analysis; useful for scaling memo context.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/data-cloud-survival-guide-for-marketers/ — MCN-specific credit allocations per edition (<!-- VERIFY -->).
- https://brinkview.com/how-using-digital-wallet-in-marketing-cloud-next-shapes-your-credit-usage-consumption-patterns-and-campaign-costs/ — MCN Digital Wallet and credit patterns.
- https://www.midcai.com/post/what-is-salesforce-marketing-cloud-next — General MCN guide; limited consumption details.
- https://noltic.com/stories/salesforce-marketing-cloud-editions-explained — Edition comparison; no credit allocation specifics.
- https://cyntexa.com/blog/salesforce-marketing-cloud-pricing/ — 2026 pricing guide; add-on credit rates confirmed ($10/1,000 for SMS/WhatsApp/additional email).
- https://www.salesforce.com/marketing/marketing-cloud-editions/pricing/ — Official pricing page; confirmed edition prices and add-on rates, but no included credit allocations listed.
- https://www.mavlers.com/blog/salesforce-data-cloud-pricing-explained/ — General Data Cloud pricing overview; useful context.
- https://davidpalencia.com/salesforce-data-cloud-pricing-credit-consumption/ — IDR credit detail and the "credits consumed every time a process runs" clarification.
- https://ateko.com/en/blog/everything-you-need-to-know-about-salesforce-data-cloud-credits/ — Credit types reference; confirmed batch/streaming multipliers.
- https://www.salesforceblogger.com/2025/06/26/digital-wallet-sandbox-usage-alerts/ — Discarded: CSS/markup only, no article content extracted.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-testing-with-sandbox-22f23d92eef0 — Discarded: 403 error.
- https://medium.com/capgemini-salesforce-architects/why-we-built-an-open-source-data-360-credit-calculator-7388a97adb39 — Discarded: 403 error.
- https://www.salesforce.com/blog/next-gen-marketing-cloud-details/ — Discarded: MCE/Engagement+ pricing, not MCA credit details.
- https://concret.io/blog/marketing-cloud-next-growth-and-advanced-editions — Discarded: feature comparison only, no credit allocation specifics.
