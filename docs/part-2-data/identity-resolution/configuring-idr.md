---
sidebar_position: 2
title: "Configuring IDR for LEOptical"
description: "Step-by-step walkthrough for reviewing the default ruleset, configuring reconciliation rules, publishing, and reading results."
---

## Overview

This page is the hands-on companion to the Identity Resolution concepts page. You will open your SDO, confirm the ruleset that was created during the Marketing Cloud Next setup steps, configure reconciliation rules, and run IDR for the first time. By the end, you will have unified profiles for LEOptical's multi-source customer data.

Read the concepts page before starting here.

## Getting to the ruleset

During the Marketing Cloud Next setup steps in the onboarding quip doc, you configured an IDR ruleset as part of Basic Settings. That ruleset should already exist in your SDO. This page walks you through reviewing and configuring it, not creating a new one.

Navigate to **Data 360 > Identity Resolutions** and open your existing ruleset.

<Screenshot src="/img/configuring-idr/05-new-idr-ruleset.png" alt="Identity Resolutions list view in Data 360 showing one ruleset: Individual Identity Resolution, with Data Space set to default, Primary Data Model Object set to Individual, and Ruleset Status set to Published." />

:::tip[Didn't configure IDR during setup?]
If you skipped the IDR step in the quip doc, you can generate the default ruleset now. Navigate to **Setup > Assistant Home > Basic Settings**, scroll to step 3 (**Configure Identity Resolution Rulesets**), and click **Generate Rule Set**.

<Screenshot src="/img/configuring-idr/05-idr-mca-setup.png" alt="Marketing Cloud Next Setup Basic Settings page showing the Configure Identity Resolution Rulesets step with a callout circle around it. The Unified Individual Object field is set to UnifiedIndividual__dlm." />

After generating, navigate to **Data 360 > Identity Resolutions** to open the ruleset and continue with the steps below.
:::

## Reviewing the default match rules

{/* VERIFY: Confirm the exact navigation path and button labels to open the match rule editor in the Summer '26 UI. */}

Open your ruleset. You should see the four default match rules: **MC Subscriber Key**, **Fuzzy Name and Normalized Email**, **Fuzzy Name and Normalized Address**, and **Fuzzy Name and Normalized Phone**.

<Screenshot src="/img/configuring-idr/05-mca-default-ruleset.png" alt="Identity resolution ruleset detail view showing the four default match rules: MC Subscriber Key, Fuzzy Name and Normalized Email, Fuzzy Name and Normalized Address, and Fuzzy Name and Normalized Phone, each listed with an Add Match Rules button" />

Click each rule to review its criteria. Each fuzzy name rule combines a First Name (Fuzzy) criterion with a normalized contact point criterion (email, address, or phone). The MC Subscriber Key rule links legacy Marketing Cloud Engagement subscriber keys to CRM Contact records.

<Screenshot src="/img/configuring-idr/05-fuzzy-precision.png" alt="Configure Match Criteria screen for Fuzzy Name and Normalized Email rule, showing the match method dropdown open with Fuzzy - Medium Precision selected for the First Name field" />

For LEOptical's seed data, these four rules cover the most common cross-source match scenarios. You do not need to add custom rules for this assignment unless your review identifies a gap. The assignment asks you to make that judgment explicitly.

## Configuring reconciliation rules

Reconciliation rules determine which field values end up on the Unified Individual when source records disagree. You configure them separately from match rules.

{/* VERIFY: Confirm whether Reconciliation Rules is a separate tab, a section below match rules, or accessed via a different navigation path in the Summer '26 ruleset editor UI. */}

**Recommended starting configuration for LEOptical:**

1. For the **Individual DMO**, set the object-level default to **Most Frequent**. Name fields benefit from agreement across sources. If three records say "Maria" and one says "M.", Most Frequent picks "Maria."

<Screenshot src="/img/configuring-idr/05-most-frequent-reconciliation.png" alt="Individual Identity Resolution reconciliation rules table showing the Individual DMO fields. First Name row is selected and highlighted, with Reconciliation Rule set to Most Frequent. All other fields show Last Updated." />

2. For certain fields like **Title**, add a **Source Priority** override and rank your most authoritative source first. CRM data is typically the system of record for demographic fields. Rank it highest so that CRM values win when sources disagree.

<Screenshot src="/img/configuring-idr/05-reconciliation-source-priority.png" alt="Edit Reconciliation Rule panel for the Title field showing Source Priority strategy. Source list shows Contact_Home ranked 1, Loyalty_Members ranked 2, Ecommerce_Customers ranked 3, Lead_Home ranked 4, Marketing Intelligence Profile ranked 5, and MobileAppMessagingV2 ranked 6." />

3. For **Contact Point Email** fields, the default Last Updated strategy is often appropriate. The most recently updated email address is likely the active one. Review the Contact Point Email DMO reconciliation table to confirm defaults look reasonable before publishing.

<Screenshot src="/img/configuring-idr/05-reconciliation-rules.png" alt="Individual Identity Resolution reconciliation rules showing the Contact Point Email DMO section. All fields including Email Address, Contact Point Email Id, Party, and others are set to Last Updated reconciliation rule." />

:::warning
Fuzzy name matching is an LLM-based operation and has a higher false-positive risk than exact matching. A Fuzzy First Name + Normalized Email rule can match people who share a first name and a work email domain. Review results carefully. If you see obvious over-matches in the protagonist contacts, adjust or remove the rule that caused them.
:::

## Publishing and running

{/* VERIFY: Confirm exact UI button labels for Publish and Run Now in the current Summer '26 release of the IDR ruleset editor. */}

When your rules are configured, click **Run Ruleset** in the top-right corner of the ruleset detail page. This publishes and triggers the run in one step.

<Screenshot src="/img/configuring-idr/05-run-ruleset-idr.png" alt="Individual Identity Resolution ruleset detail page showing the Ruleset Properties tab with Match Rules and Reconciliation Rules sections. The Run Ruleset button is highlighted in the top-right corner. Resolution Summary shows 0 Total Unified Profiles and 0% Consolidation Rate before the first run." />

To run again after making rule changes, use **Run Ruleset** again. Remember the 4-per-day limit. Make all your rule changes before triggering a run.

## Reading the results

After IDR runs, the ruleset detail page shows processing history:

- Total unified profiles created
- Source profiles processed
- Match rate
- Error and warning count

<Screenshot src="/img/configuring-idr/05-idr-results.png" alt="Individual Identity Resolution ruleset detail page with Processing History tab selected. Daily Processing Summary table shows one row for 2026-08-14 with 104,294 total source profiles, 53,763 total unified profiles, 48% consolidation rate, and status Succeeded. Resolution Summary panel shows 53.76K Total Unified Profiles from 104.29K source profiles." />

A match rate that seems too high (e.g., 90%+ of records unified into a small number of profiles) suggests over-matching. Your rules may be too loose. A match rate that seems too low suggests under-matching or a configuration problem.

For LEOptical's seed data, expect most records to have at least one email-based match. The cross-source duplicates are intentional. Check the protagonist contacts (the named individuals with `@example.com` emails) first. They should appear as unified across their multiple source records.

## Assignment

> **The client wants:** The same customer might be `maria.chen@example.com` in Salesforce, `m.chen@gmail.com` in the loyalty program, and `maria.c@work.com` in the ecommerce customer master. They need these resolved into unified profiles.

Using the data streams you configured in the previous modules, configure Identity Resolution for LEOptical's multi-source data.

1. Navigate to the default IDR ruleset. If the auto-generated ruleset was not created during Marketing Cloud Next setup, create one now from **Data Cloud > Identity Resolutions > New**. Document what rules are in the default ruleset.

2. Evaluate the default ruleset against LEOptical's data model. Write a short assessment (a few sentences is fine): what does it catch? What does it miss? Are the four default rules appropriate for LEOptical's data, or do you need to add or remove any?

3. Review and configure reconciliation rules. Set object-level defaults and add field-level overrides where appropriate (consider: what is the system of record for name? For loyalty tier? For email?).

4. Publish the ruleset and trigger **Run Now**. Review the processing results: how many Unified Individuals were created? Does the match rate look reasonable?

5. Investigate match quality. Check the protagonist contacts by name in the Unified Individual records. Do they show as unified across their source records? Find at least one case where a rule matched incorrectly (over-match) or missed a valid match (under-match), and adjust your ruleset to address it.

6. Document your final ruleset configuration: the rules, their criteria, the match methods, and your reconciliation strategy. Write a brief explanation of the trade-offs you made and which fields you would discuss with a LEOptical stakeholder before going live.

7. **(Stretch)** Create a Schedule-Triggered Flow that invokes IDR at a specific time of day. The ruleset scheduler UI does not expose time-of-day control. A flow is the only way to pin IDR to a specific hour. Research the pattern for invoking IDR from a flow and document the steps.

## Success Criteria

- [ ] The default IDR ruleset is reviewed and its match rules are documented (rules, fields, methods).
- [ ] A written assessment exists explaining what the default ruleset covers and what it misses for LEOptical's multi-source data.
- [ ] Reconciliation rules are configured with at least one object-level default and one field-level override.
- [ ] IDR has been published and Run Now has been triggered at least once.
- [ ] Processing results are visible on the ruleset detail page (unified profile count, source profiles processed).
- [ ] Protagonist contacts are visible as Unified Individuals with multiple source records linked in the Unified Link Individual table.
- [ ] At least one match quality issue is identified and at least one rule adjustment is made in response.
- [ ] A written explanation of the matching strategy, trade-offs, and which fields to discuss with the client is complete.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- You change two match rules in your ruleset and click Run Now twice in the afternoon. The next morning, you need to run again to evaluate another rule change. Can you? What is the rate limit?
- LEOptical's head of marketing asks why the same customer is receiving duplicate emails. You have IDR configured. What is the likely configuration gap, and what module covers the fix?
- Why can't you set a specific time of day for IDR to run from within the ruleset UI? What is the workaround?
- A fuzzy First Name + Normalized Phone rule fires for two records. One belongs to a parent and one to an adult child living at the same address with the same last name. What kind of matching error is this, and how would you adjust the ruleset to reduce it?
