---
sidebar_position: 1
title: "Identity Resolution"
description: "How IDR works: the three-object architecture, match rules, reconciliation rules, and what the default ruleset covers."
---

## Overview

LEOptical is a classic multi-source identity problem. The same customer exists in at least three systems: Salesforce CRM with a work email, the VisionCare Rewards loyalty program with a personal email, and the ecommerce customer master with yet another email. Without something to connect those records, Marketing Cloud Next cannot tell they are the same person. Every segment query counts her three times. Every email send reaches her three times. Every personalization lookup fails to see her complete purchase history.

Identity Resolution (IDR) is the process that solves this. It reads your source Individual records, runs them through configurable match rules, and produces a single **Unified Individual** record per resolved real person. Every downstream Marketing Cloud Next feature (segmentation, Data Graphs, activation templates) operates against Unified Individuals, not raw source records. IDR is not optional. It is the engine that makes the single-customer view possible.

This page covers how IDR works: the data model, when it runs, what it costs, and how match and reconciliation rules are structured. The next page walks through configuring IDR for LEOptical's data.

Web tracking adds another layer of identity stitching (anonymous visitors identifying themselves via form submissions). That is covered in the web connector module. The Device to Known rule is already there waiting for it.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- The three-object architecture: Individual, Unified Individual, and Unified Link Individual.
- Why Unified Individual is the required foundation for segmentation, Data Graphs, and activation.
- When IDR runs and how to trigger it manually.
- Credit costs and why run frequency matters.
- Match rules: Exact, Exact Normalized, and Fuzzy match methods.
- How multiple criteria within a rule work (AND logic) and how rules in a ruleset work (OR logic).
- The default ruleset Marketing Cloud Next generates and what it covers for LEOptical's data.
- Reconciliation rules: Most Recent, Most Frequent, and Source Priority.

## Individual vs. Unified Individual

### The source layer: Individual

The **Individual DMO** is the input layer for IDR. Each row represents one person record from one source system. When CRM Contacts are ingested via the Marketing Data Kit, each Contact becomes one Individual row. When the loyalty CSV is ingested, each loyalty member row becomes one Individual row. When the ecommerce customer file is ingested, each ecommerce customer record becomes one Individual row.

One real person can have multiple Individual records if they appear in multiple source systems. Maria Chen is three Individual records before IDR runs. That is expected. The Individual DMO is not the problem. IDR is the fix.

### The output layer: Unified Individual

The **Unified Individual DMO** is the IDR output layer. Each row represents one resolved real person, regardless of how many source systems they appeared in. Maria Chen's three Individual records collapse into one Unified Individual record after IDR runs with a rule that matches her across email addresses.

The Unified Individual contains reconciled field values (more on reconciliation rules below). It does not replace the source Individual records. Those persist unchanged. IDR is non-destructive.

### The bridge layer: Unified Link Individual

The **Unified Link Individual** DMO (API name: `IndividualIdentityLink__dlm`) is a junction table that maps each source Individual ID to its parent Unified Individual ID.

If Sarah has four source profiles across CRM, loyalty, ecommerce, and clinic systems, the Unified Link Individual table contains four rows:

```
Sarah Source Profile #001 → Sarah Unified Individual #0123
Sarah Source Profile #002 → Sarah Unified Individual #0123
Sarah Source Profile #003 → Sarah Unified Individual #0123
Sarah Source Profile #004 → Sarah Unified Individual #0123
```

The fourth source profile (clinic) is only present if you completed the clinic data stretch goal. If you skipped it, Sarah resolves from three source profiles instead of four.

This is the "key ring" model. IDR does not merge records. It creates a mapping from many source IDs to one unified ID. If source data changes, IDR re-runs and updates the links without losing any original data.

### The complete picture

A fully resolved identity in Data 360 consists of three objects working together:

| Object | What it contains | Created by |
|--------|-----------------|------------|
| Individual DMO | Raw source record, one per source system | Data stream ingestion |
| Unified Individual DMO | Reconciled single record per real person | IDR |
| Unified Link Individual DMO | Many-to-one mapping from source to unified | IDR |

IDR also creates **Unified Contact Point** objects (Unified Contact Point Email, etc.) that collect all contact points from all matched sources. After IDR, a Unified Individual may have multiple Contact Point Email records. This is correct behavior. Activation templates must specify which email address to use when sending to that Unified Individual. More on this in <ModuleLink slug="activation-templates" />.

:::tip[Coming from MCE?]
MCE does not have a native identity resolution system.

- In MCE, a subscriber's identity is determined by their **Subscriber Key** (typically the CRM Contact ID or the email address). There was no automated cross-source matching. A customer who used two different email addresses in two systems existed as two separate subscribers. Deduplication required custom AMPscript or manual list work.
- **MC Connect / Synchronized Data Extensions** brought CRM data into MCE but did not attempt to unify identities across non-CRM sources.
- Marketing Cloud Next's IDR handles multi-source matching at scale with configurable rules, LLM-powered fuzzy matching, and credit-tracked processing. There is no MCE equivalent to map it to.
:::

## Why Unified Individual matters for everything downstream

IDR is not just an optional data quality step. The rest of Marketing Cloud Next depends on it.

**Segmentation.** The best practice is to build segments against the **Unified Individual DMO**, not the raw Individual DMO. If you segment on raw Individual records, you count the same person multiple times (once per source record) and miss cross-source behavioral patterns. A loyalty member who also has exam history only appears that way on the Unified Individual.

There is a valid advanced use case for segmenting on Individual directly (when you intentionally want to query only one source system's data), but that is not the default pattern.

**Data Graphs.** The LEOptical Data Graph is rooted on **Unified Individual**. Data Graphs must be rooted on Unified Individual to traverse across DMOs in an identity-aware way. Without IDR running, Unified Individual records do not exist, and the Data Graph cannot be built. The dependency chain is: Data Streams refresh → IDR runs → Data Graph refreshes → Handlebars personalization resolves.

**Activation Templates.** Activation templates specify which contact point (email address) to use when sending to a Unified Individual. Without IDR, there is no Unified Individual to activate against.

:::warning
If you send to a segment without an Activation Template configured, Marketing Cloud Next sends to every Contact Point Email associated with each Unified Individual. A customer unified from three source records with three different email addresses receives three copies of the email. Configure an Activation Template before sending. This is covered in <ModuleLink slug="activation-templates" />, but keep it in mind as you build IDR rules that will produce Unified Individuals with multiple contact points.
:::

## When IDR runs

IDR is not a set-it-and-forget-it process. It runs in multiple situations, and each run consumes credits.

**Daily scheduled run.** By default, IDR rulesets run automatically every day in batch. If there are no changes to source data, object mappings, or ruleset configuration, the daily run is skipped and no credits are consumed.

**First publication.** When you publish a ruleset for the first time, IDR runs immediately. Initial ruleset publication creates unified profiles within 24 hours. This is a full run against all source records.

**New data.** When new records arrive via data streams, they are evaluated during the next scheduled or manual run.

**Updated source records.** When an existing source record is modified, IDR re-evaluates that source profile on the next scheduled or manual run. A single field update is enough to queue that profile for re-evaluation. IDR does not run immediately on field changes. Re-evaluation happens in batch at the next run, not record-by-record in real time.

**Manual Run Now.** You can trigger an on-demand run from the ruleset UI at any time.

:::warning
**Run Now is rate-limited to 4 manual triggers per ruleset per data space per 24-hour period.** During rule configuration, you will be tempted to run after every change. Plan your testing so you make multiple rule changes before triggering a run, not one run per change.
:::

**Rule changes.** When you modify a ruleset (adding, removing, or changing match rules or reconciliation rules), the changes apply on the next run.

{/* VERIFY: Does changing match rules trigger a full reprocess of all records or only an incremental reprocess of affected profiles. Research found conflicting signals. Conservative assumption: rule changes can trigger substantial reprocessing. */}

## Credit cost

IDR is the most expensive operation in Data 360.

**Rate: 100,000 credits per 1 million source profiles processed** in batch mode. The sandbox environment runs at 80,000 credits per million rows (20% discount).

For comparison: external data ingestion costs approximately 2,000 credits per million rows. IDR costs 50x more per record than the data ingestion that feeds it.

Every reprocess consumes credits at the same rate. There is no discount for re-running the same data after a rule change.

{/* VERIFY: One source (Jitendra Zaa, March 2026) states IDR runs incrementally throughout the day as new data arrives, re-evaluating 2-3x the number of new records. Confirm whether this applies to MCA or only to Data Cloud enterprise. The user believes IDR runs in batch only, not incrementally throughout the day. */}

**Scheduling.** The IDR ruleset UI lets you set a schedule (daily, weekly, or other intervals), but you cannot control the time of day IDR runs from within the ruleset configuration itself. If you need IDR to run at a specific time, you must schedule it via a Salesforce Flow (a Schedule-Triggered Flow that invokes IDR). This is covered as a stretch goal in the assignment.

You are working in an SDO, so you will not be charged credits for IDR runs during this course. For real client engagements with millions of records, IDR cost must be part of your architecture conversation before the project goes live.

:::info
Data 360 also supports **Household IDR** (grouping individuals into household units, useful for B2C retailers) and **Account IDR** (resolving business accounts, for B2B use cases). This course covers individual person IDR only. If you encounter a client use case that involves household-level targeting, see the [Household Resolution help article](https://help.salesforce.com/s/articleView?id=sf.c360_a_household_resolution.htm).
:::

## Match rules

### How match rules work

A match rule is a set of one or more criteria. If all criteria in a rule are met, two or more Individual records are considered the same person and are unified.

**Criteria within a rule use AND logic.** All criteria must match for the rule to fire.

**Rules within a ruleset use OR logic.** If any single rule fires, the records are unified. You do not need every rule to match.

A single ruleset can contain up to 10 match rules. Each match rule can contain up to 10 match criteria.

### Match methods

#### Exact

Literal character-by-character match. No tolerance for casing, whitespace, or formatting variation.

Use Exact for stable, machine-generated identifiers where an exact match is meaningful: loyalty membership numbers, CRM Contact IDs, external system customer IDs.

Do not use Exact for email addresses. A person who enters `Maria.Chen@example.com` in one system and `maria.chen@example.com` in another will not match on Exact. Use Exact Normalized for email.


#### Exact Normalized

Matches after applying standardization transformations. The system normalizes values before comparing, so formatting differences do not prevent a match.

Normalization by field type:
- **Email**: Lowercased, leading/trailing whitespace removed
- **Phone**: Strips non-numeric characters, normalizes to E.164 format
- **Address**: Standardizes abbreviations, case, whitespace

Use Exact Normalized for email addresses, phone numbers, and mailing addresses.

<Screenshot src="/img/configuring-idr/05-match-rule-exact-normalized.png" alt="Configure Match Criteria screen showing a custom rule with one criterion: Data Model Object set to Contact Point Email, Field set to Email Address, and Match Method set to Exact Normalized." />

#### Fuzzy

Approximate string matching that tolerates typos, misspellings, nicknames, and cultural name variations.

**Fuzzy matching is currently only available for First Name fields.** It is not available for email, phone, last name, or other fields.

Fuzzy matching uses a fine-tuned Large Language Model based on BERT, trained on data from 150+ countries and 20 million names. It is not Levenshtein distance. It uses semantic similarity scoring.

Precision levels:
- **Low Precision**: Loose similarities (e.g., Lisa / Liza, Lucia / Luc)
- **Medium Precision**: Initials, gender variants, shuffled names (e.g., S. / Sharon, Gabriel / Gabrielle)
- **High Precision**: Nicknames, punctuation variations, cross-cultural spellings (e.g., William / Bill, Beatriz / Beatrice)

<Screenshot src="/img/configuring-idr/05-fuzzy-precision.png" alt="Configure Match Criteria screen for a fuzzy match rule, showing the match method dropdown open with Fuzzy - Medium Precision selected for the First Name field" />

:::warning
Fuzzy matching only runs in batch/scheduled mode. If you are using real-time identity resolution (for personalization flows), only Exact and Exact Normalized are supported. Fuzzy rules are ignored in real-time mode.
:::

### The default ruleset

During Marketing Cloud Next setup, the platform can auto-generate a default IDR ruleset (from **Setup > Assistant Home > Basic Settings > Step 3: Configure Identity Resolution Rulesets > Generate Rule Set**). This is not required. You can configure IDR directly in Data 360.

The default ruleset contains four pre-built match rules:

| Rule | What it matches |
|------|----------------|
| MC Subscriber Key | Links legacy Marketing Cloud Engagement subscriber keys to CRM records |
| Fuzzy Name and Normalized Email | First name (fuzzy) plus email address (normalized) |
| Fuzzy Name and Normalized Address | First name (fuzzy) plus mailing address (normalized) |
| Fuzzy Name and Normalized Phone | First name (fuzzy) plus phone number (normalized) |

<Screenshot src="/img/configuring-idr/05-mca-default-ruleset.png" alt="Add Match Rules screen showing the four default match rules: MC Subscriber Key, Fuzzy Name and Normalized Email, Fuzzy Name and Normalized Address, and Fuzzy Name and Normalized Phone" />

The fuzzy name rules are broad. They will catch most email-based and phone-based matches for LEOptical's data. For this course, these defaults are a reasonable starting point. The next page walks through reviewing them and deciding whether to keep, adjust, or add rules.

:::warning
**You can only create 2 rulesets per data space.** The second slot is designed for A/B testing. Once you settle on a production ruleset, delete any test rulesets if you want to free up the slot. Running two rulesets simultaneously means two separate Unified Individual DMOs, which creates confusion for all downstream features (segments, Data Graphs, activations must explicitly choose which to use).
:::

### What the default ruleset covers for LEOptical

| Scenario | Covered by default ruleset? |
|----------|---------------------------|
| CRM email matches loyalty email | Yes (Fuzzy Name and Normalized Email) |
| CRM email matches ecommerce email | Yes (Fuzzy Name and Normalized Email) |
| Name + phone fallback (different emails) | Yes (Fuzzy Name and Normalized Phone) |
| Name + address fallback | Yes (Fuzzy Name and Normalized Address) |
| MCE subscriber key cross-reference | Yes (MC Subscriber Key), if MCE is connected |
| Anonymous web visitor stitching | Not in default, covered when web tracking is configured |

The default ruleset is more capable than it may look. The fuzzy name + normalized contact point rules cover the most common cross-source match scenarios for LEOptical's data. The next page asks you to review these defaults and decide whether they are appropriate or need adjustment.

## Reconciliation rules

### What reconciliation rules decide

When IDR matches two or more Individual records into one Unified Individual, the source records may have different values for the same field. CRM has Maria Chen. Loyalty has M. Chen. Exam records have Mary Chen (a typo from clinic intake). Reconciliation rules determine which value goes onto the Unified Individual.

Reconciliation rules are the editorial policy for the unified record. They define the authoritative value for each field.

### Two levels of configuration

1. **Object level**: A default strategy applied to all fields on a given DMO.
2. **Field level**: An override for a specific field that differs from the object-level default.

Field-level rules override object-level rules.

### Three reconciliation strategies

#### Most Recent (Last Updated)

The value from the source record that was most recently updated wins.

Use this for fields that change over time and where the latest state is the truth: email address, mailing address, phone number.

The Contact Point Email DMO defaults to Last Updated across all its fields. This is a reasonable starting point, as the most recently updated email record is the most likely to be active.

<Screenshot src="/img/configuring-idr/05-reconciliation-rules.png" alt="Individual Identity Resolution reconciliation rules showing the Contact Point Email DMO section expanded. All fields including Contact Point Email Id, Created Date, Data Source, Data Source Object, Email Address, Email Latest Bounce Date Time, Email Latest Bounce Reason Text, Internal Organization, Last Modified Date, and Party are set to Last Updated reconciliation rule." />

#### Most Frequent

The value that appears most often across matched source records wins.

Use this for fields where agreement across sources is a signal of accuracy. If three source records say "Maria" and one says "M.", "Maria" wins.

This is often the default reconciliation strategy for name fields.

<Screenshot src="/img/configuring-idr/05-most-frequent-reconciliation.png" alt="Individual Identity Resolution reconciliation rules table showing Individual DMO fields. First Name row is highlighted with Reconciliation Rule set to Most Frequent. All other fields show Last Updated." />

#### Source Priority (Source Sequence)

You rank source DMOs in a priority order. The value from the highest-ranked source that has a value for the field wins.

Use this when one source is definitively the system of record for a specific field. For LEOptical:
- CRM is the system of record for the legal name and primary contact information.
- The Loyalty Program Member DMO is the system of record for loyalty tier, points balance, and member status.

Example configuration: For Individual Name, rank Contact > Loyalty. For Loyalty Tier, rank Loyalty Program Member DMO first.

<Screenshot src="/img/configuring-idr/05-reconciliation-source-priority.png" alt="Edit Reconciliation Rule panel for the Title field showing Source Priority strategy. Source list shows Contact_Home ranked 1, Loyalty_Members ranked 2, Ecommerce_Customers ranked 3, Lead_Home ranked 4, Marketing Intelligence Profile ranked 5, and MobileAppMessagingV2 ranked 6." />

### Unified Contact Points are additive, not reconciled

The Unified Individual uses reconciliation rules to produce one value per field. The Unified Contact Point objects work differently. They collect all contact points from all matched sources. A Unified Individual who had three email addresses across source systems has three Unified Contact Point Email records. They are all preserved.

This is why you need an activation template to specify which email to send to. The platform cannot guess which of three email addresses you want to use.

## A note on multiple rulesets

Data 360 allows up to two rulesets per data space, which lets you run an A/B test between two rule configurations. Do not do this unless you have a specific reason. Two rulesets produce two separate Unified Individual DMOs. Segments, Data Graphs, and activations must explicitly choose which to use. The two sets of profiles cannot be cross-queried. The second ruleset slot is for controlled testing, not for maintaining two parallel production configurations.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between the Individual DMO and the Unified Individual DMO? Which one does IDR read as input, and which one does it produce as output?
- What is the Unified Link Individual DMO, and why does its existence mean IDR is "non-destructive"?
- A match rule has three criteria. All three must match for the rule to fire. A ruleset has three rules. What logic governs whether records are unified: AND or OR, at each level?
- Why is Fuzzy matching limited to First Name fields? What happens if you rely on a Fuzzy First Name rule for real-time personalization?
- A customer has three different email addresses across CRM, loyalty, and ecommerce. After IDR runs, how many Contact Point Email records does their Unified Individual have? What downstream problem does this create if not addressed?
- What is the difference between Most Recent and Source Priority as reconciliation strategies? Give a concrete example of when you would use each for LEOptical's data.

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Salesforce Help: Configure Identity Resolution Rulesets for Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_data_identity_resolution.htm&language=en_US&type=5). The official MCN help article for IDR configuration. Primary reference for UI navigation and setup steps.
- [Salesforce Help: Identity Resolution Match Rules](https://help.salesforce.com/s/articleView?id=data.c360_a_match_rules.htm&language=en_US&type=5). Reference for available match methods, criteria objects, and how rules are structured.
- [Salesforce Help: Identity Resolution Reconciliation Rules](https://help.salesforce.com/s/articleView?language=en_US&id=sf.c360_a_reconciliation_rules.htm&type=5). Reference for reconciliation strategies and configuration.
- [Trailhead: Configure Identity Resolution Rules](https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/configure-identity-resolution-rules). Hands-on module covering reconciliation rules with examples of all three strategies (Most Recent, Frequency, Source Priority).
- [Trailhead: Explore Data 360 Core Functionality: Unify Your Data](https://trailhead.salesforce.com/content/learn/projects/explore-data-cloud-core-functionality/unify-your-data). Project-based Trailhead covering IDR configuration end-to-end.
- [Salesforce Blog: Unify Profiles with Identity Resolution Soft-Matching](https://www.salesforce.com/blog/data-cloud-identity-resolution/). Official explanation of fuzzy/soft matching: precision levels, the LLM approach, and examples.
- [Jitendra Zaa: Salesforce Data 360 Credit Optimization Guide, March 2026](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/). Covers incremental vs. batch behavior and the 2 to 3x credit consumption surprise in detail.
- [Salesforce Admins Blog: Rethinking the Golden Record, Advantages of the Unified Profile](https://admin.salesforce.com/blog/2025/rethinking-golden-record-advantages-of-data-cloud-unified-profile). Accessible explanation of why the non-destructive key ring model is better than traditional golden record merge approaches.
- [Salesforce Ben: Party Identification in Data 360, Your Complete Set Up Guide](https://www.salesforceben.com/party-identification-in-data-cloud-your-complete-set-up-guide/). Covers the Party Identification DMO for external identifier matching, relevant if you extend the loyalty ID cross-reference rule using party IDs.
