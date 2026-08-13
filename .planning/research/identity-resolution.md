# Research: Identity Resolution

Generated: 2026-08-10
Module: identity-resolution
Part: part-2-data
Sources: 28 sources consulted

---

## Module Context

### From module-assignments.md (Module 9 — Identity Resolution)

> **The client wants:** The same customer might be `maria.chen@example.com` in Salesforce, `m.chen@gmail.com` in the loyalty program, and `maria.c@work.com` in ecommerce orders. They need these resolved into unified profiles.

**Assignment:**
- Review the auto-generated IDR ruleset created during MCA setup (explain that setup can auto-create a default ruleset, but it's not required — you can also configure IDR directly in Data 360)
- Evaluate the default ruleset: does it work for LEOptical's data? What matching rules does it use?
- Customize the ruleset: add or adjust matching rules using email match, fuzzy name + email domain, and loyalty ID cross-reference
- Run identity resolution and review the results — how many profiles were unified?
- Investigate match quality: find cases where rules matched incorrectly or missed valid matches, and adjust
- Document your final ruleset configuration and matching strategy
- Discuss: which fields should you discuss with a client for IDR? Why does this conversation matter?

**Success Criteria:**
- [ ] Auto-generated IDR ruleset is reviewed and understood
- [ ] Custom matching rules are configured (at least 3 rules)
- [ ] Identity resolution has run and unified profiles are visible
- [ ] Match results are reviewed and at least one rule is adjusted
- [ ] Unified profile count is documented and reasonable
- [ ] Written explanation of matching strategy, trade-offs, and fields discussed with client

**Stretch Goal:**
- Create a scheduled flow that runs IDR on a recurring basis

### From identity-resolution-brief.md

Key requirements from course author:
- IDR is the most expensive credit operation in MCA: **100,000 credits per 1 million rows processed**
- Assume the learner knows nothing about IDR
- Explain Individual (source DMO) vs Unified Individual (IDR output DMO)
- Emphasize why Unified Individual is critical for downstream features
- Cover match rules: exact, fuzzy, normalized, priority
- Cover reconciliation rules thoroughly
- Include custom IDR rules for LEOptical's data model
- Course arc: base rules here, web tracking rules deferred to a later module
- Link sources inline throughout

---

## Overview

Identity Resolution (IDR) is the process by which Data 360 matches records from multiple source systems that belong to the same real person and merges them into a single unified identity record called a **Unified Individual**. This is the foundational operation that makes MCA's single-customer-view possible.

Without IDR, Maria Chen exists as three separate, disconnected records:
- `maria.chen@example.com` in Salesforce CRM
- `m.chen@gmail.com` in the VisionCare Rewards loyalty system
- `maria.c@work.com` in ecommerce customer account

After IDR runs, those three records are linked into one Unified Individual. Every downstream MCA feature — segmentation, email personalization via Handlebars, activation templates — operates against the Unified Individual, not the raw source records.

Source: [Salesforce Developer Blog, "Building a Complete View of Your Customers with Data Cloud and Identity Resolution"](https://developer.salesforce.com/blogs/2024/10/data-cloud-and-identity-resolution)

---

## Credit Cost and Billing

### Rate

**100,000 credits per 1 million source profiles processed** (batch mode).

- Sandbox environment: **80,000 credits per 1 million rows** (20% discount).
- Standard credit pricing: $500 per 100,000 credits, meaning processing 1 million records through IDR costs approximately $500 at list price.
- This makes IDR the single most expensive operation in Data 360 — roughly 50x more expensive than external data ingestion (2,000 credits per million rows).

Source: [Szymon Lewandowski, "Salesforce Data Cloud Credits Guide"](https://www.szymonlewandowski.pl/blog/data-cloud-credits-guide-salesforce) — confirmed October 2024, updated October 2025.

Source: [Jitendra Zaa, "Salesforce Data 360 Credit Optimization Guide, March 2026"](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/)

### What Counts as a Row

A "row" or "source profile" is one Individual record plus all related records (contact points, party identifiers), counted as one unified unit — not counted separately per related record.

When IDR processes 1.4 million source profiles from multiple connectors, you consume 140,000 credits regardless of how many Unified Individuals result from the matching process.

### Re-Run Costs

**Every reprocess consumes credits at the same rate.** There is no discount for re-running the same data after rule changes.

The granular cost is approximately **0.1 credit per modified source profile** per run. "Every small change, no matter if we modify 1, 5, or 50 attributes in one record, even in the related DMO, will process the source profile once again."

### Incremental vs. Full Batch

IDR does not exclusively run as a nightly batch job. It also operates incrementally as new data arrives throughout the day. When 10,000 new records arrive, the engine may re-evaluate 20,000–30,000 existing unified profiles because rules run against both new and potentially affected existing profiles. This can result in 2–3x higher total credit consumption than teams expect if they assume IDR is purely a single daily batch.

Source: [Jitendra Zaa, "Salesforce Data 360 Credit Optimization Guide, March 2026"](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/)

### Credit Optimization Tips (for the Consumption module, not IDR module)

- Keep source data clean before ingestion (dirty data multiplies processing)
- Limit the number of match rules (more rules = more records evaluated)
- Disable automatic daily runs if incremental data is infrequent
- Do not run multiple rulesets unless you need to A/B test rule configurations

---

## When IDR Processes Records (All Triggers)

### 1. Daily Scheduled Run (Default)

By default, IDR rulesets run automatically every day in batch. The scheduled run evaluates all source profiles against the configured rules and updates Unified Individuals accordingly.

**Exception:** If there are no changes to source data, object mappings, or ruleset configurations, the daily run is **skipped** — credits are not consumed for an unchanged dataset.

Source: [Salesforce Help — Identity Resolution Rulesets](https://help.salesforce.com/s/articleView?language=en_US&id=data.c360_a_identity_resolution_ruleset.htm&type=5)

### 2. First Publication of a Ruleset

When you publish a ruleset for the first time, IDR runs immediately. Initial ruleset publication creates unified profiles within 24 hours. This is a full run against all source records.

Source: [Trailhead — Configure Identity Resolution Rules](https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/configure-identity-resolution-rules)

### 3. New Data Ingested (Net-New Profiles)

When new records arrive via data streams, they are evaluated against existing rules during the next scheduled or manual run. Net-new source profiles are matched against all existing records to determine if they merge with an existing Unified Individual or create a new one.

### 4. Updates to Existing Source Records

When an existing source record is modified (field value updated, new contact point added, etc.), IDR re-evaluates that source profile on the next run. The modification triggers re-matching against existing rules.

"Every small change, no matter if we modify 1, 5, or 50 attributes in one record, even in the related DMO, will process the source profile once again."

Source: [Jitendra Zaa, "Salesforce Data 360 Credit Optimization Guide, March 2026"](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/)

### 5. Manual "Run Now" (On-Demand)

You can trigger an on-demand run at any time from the ruleset UI. This is useful after making rule changes to see the effect immediately.

**Rate limit: 4 manual runs per ruleset per data space per 24-hour period.**

Source: [Salesforce Help — "Run Identity Resolution Ruleset Jobs at Any Time" (Spring '23)](https://help.salesforce.com/s/articleView?id=release-notes.cdp_rn_2023_spring_ir_run_now.htm&language=en_US&release=242&type=5)

### 6. Changes to Match Rules or Reconciliation Rules

When you modify a ruleset — adding, removing, or changing match rules or reconciliation rules — the changes are applied on the next run. This can be immediately via Run Now or on the next scheduled daily run.

**Open question / flag for VERIFY:** Whether modifying match rules triggers a full reprocessing of all records or an incremental reprocess of only affected profiles is not definitively confirmed in available documentation. One source states changes "apply on demand and refresh instantly," but whether "refresh" means full or incremental is unclear. The conservative assumption is that rule changes can trigger substantial reprocessing. <!-- VERIFY -->

### 7. Real-Time Matching

Salesforce Data Cloud supports real-time matching for specific personalization use cases. In real-time mode, match rules are evaluated using **Exact or Exact Normalized methods only** (fuzzy matching is not supported in real-time mode). This is separate from the batch scheduled runs and is used for scenarios like website personalization where immediate identity resolution is needed.

Source: [Salesforce Help — Scheduled and Real-Time Matching in Identity Resolution](https://help.salesforce.com/s/articleView?id=sf.c360_a_identity_resolution_match_type_compare.htm&language=en_US&type=5)

### 8. No Changes = No Run (Skipped)

If source data, object mappings, and ruleset configuration are all unchanged, the daily scheduled run is automatically skipped. Credits are not consumed.

---

## Individual vs. Unified Individual

### The Individual DMO

The **Individual** DMO is the source-record layer. Each row represents one person record from one source system. When CRM Contacts are ingested via the Marketing Data Kit, each Contact becomes one Individual row. When the loyalty CSV is ingested, each loyalty member row becomes one Individual row.

Key characteristics:
- One Individual per source record per source system
- Multiple Individuals can represent the same real person if they came from different sources
- The Individual DMO is what IDR reads as its input
- Individuals carry the raw, source-specific data (CRM email, loyalty email, exam email — each on a different Individual row)

### The Unified Individual DMO

The **Unified Individual** DMO is the IDR output layer. Each row represents one resolved real person, regardless of how many source systems they appeared in. If Maria Chen had three source records (CRM + loyalty + ecommerce), those three Individual rows collapse into one Unified Individual row.

Key characteristics:
- One Unified Individual per resolved real person
- The Unified Individual contains reconciled field values (determined by reconciliation rules)
- The Unified Individual does NOT delete or overwrite the source Individual records — those persist unchanged
- The relationship between Unified Individual and its source Individuals is stored in a separate **Unified Link Individual** DMO

### The Unified Link Individual DMO

The **Unified Link Individual** (also written as `IndividualIdentityLink__dlm` in the API) is a junction/bridge table that maps each source Individual ID to its parent Unified Individual ID.

If Sarah has four source profiles across CRM, loyalty, ecommerce, and exam systems, the Unified Link Individual table contains four rows:
```
Sarah Source Profile #001 → Sarah Unified Profile #0123
Sarah Source Profile #002 → Sarah Unified Profile #0123
Sarah Source Profile #003 → Sarah Unified Profile #0123
Sarah Source Profile #004 → Sarah Unified Profile #0123
```

This is why the data model is **non-destructive**: source records are preserved. IDR creates a "key ring" mapping many Individual IDs to one Unified Individual ID.

Source: [Salesforce Admins Blog — "Rethinking the Golden Record: Advantages of Data Cloud's Unified Profile"](https://admin.salesforce.com/blog/2025/rethinking-golden-record-advantages-of-data-cloud-unified-profile)

Source: [Trailhead — Understand Unified Profiles](https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/get-to-know-unified-profiles)

Source: [Medium — "Looking Beyond the Golden Record: Unified Profiles in Salesforce Data Cloud"](https://medium.com/@derrick.ellis/looking-beyond-the-golden-record-unified-profiles-in-salesforce-data-cloud-ec23bf17bfb5)

### The Three-Object Architecture

A complete unified profile consists of:
1. **Individual DMO** — source records (input to IDR)
2. **Unified Individual DMO** — reconciled single record (IDR output)
3. **Unified Link Individual DMO** — bridge connecting source to unified (created by IDR)

Plus, during IDR, unified contact point objects are created (Unified Contact Point Email, etc.) that consolidate contact points from all matched sources.

---

## Why the Unified Individual Matters in MCA

### Segmentation

The best practice — and in most cases the requirement — is to build segments that target the **Unified Individual DMO**, not the raw Individual DMO.

"If your data stems from various sources, the Unified Individual DMO should be used as the 'Segment On' entity because Identity Resolution rules merge 'similar' individual records into one."

If you segment on raw Individual records instead of Unified Individual, you may:
- Count the same person multiple times (once per source record)
- Miss cross-source behavioral patterns (e.g., a loyalty member who also has exam history)
- Deliver duplicate emails to the same person

Source: [Salesforce Data Cloud Segmentation Best Practices](https://www.salesforceblogger.com/2023/11/15/data-cloud-segmentation-best-practices/)

**There is a valid use case for segmenting on Individual directly**: when you intentionally want to query raw source data, bypassing IDR (e.g., segmenting specifically on loyalty members only, regardless of CRM presence). This is an advanced pattern, not the default.

Source: [salesforceblogger.com — "Architecting Data 360: Unlocking Advanced Segmentation with Individual vs. Unified Individual DMOs" (July 2026)](https://www.salesforceblogger.com/2026/07/09/architecting-data-36o-unlocking-advanced-segmentation-with-individual-vs-unified-individual-dmos/)

### Data Graphs

The LEOptical Data Graph is rooted on **Unified Individual** (per the data-model.md spec). Data Graphs must be rooted on the Unified Individual to provide an identity-aware traversal across DMOs. Without IDR running, the Unified Individual records do not exist, and the Data Graph cannot be built.

The dependency chain: Data Streams refresh → IDR runs → Data Graph refreshes → Handlebars personalization resolves.

### Activation Templates

Activation templates control which contact point (email address) to use when sending to a Unified Individual. Without IDR, there is no Unified Individual to activate against. Without an activation template, MCA sends to every contact point email associated with the Unified Individual — a customer with 3 email addresses gets 3 copies of the email.

Source: Platform-gotchas.md (confirmed 2026-08-06, Summer '26)

### Downstream Dependencies Summary

| Feature | Dependency on Unified Individual |
|---------|--------------------------------|
| Segmentation | Best practice: segment ON Unified Individual for cross-source data |
| Data Graphs | Root object is Unified Individual — required for graph to exist |
| Handlebars personalization | Reads from Data Graph, which requires Unified Individual |
| Activation Templates | Target Unified Individual; select which contact point to use |
| Journey Builder / Flow targeting | Operates against Unified Individual segments |

---

## Match Rules

### What a Match Rule Is

A match rule is a set of one or more criteria that, when all met, cause two or more Individual records to be considered the same person. If any single match rule in a ruleset is satisfied, the records are unified.

A single ruleset can contain up to **10 match rules**. Each match rule can contain up to **10 match criteria**. Criteria within a rule are joined by AND logic. Match rules in a ruleset are joined by OR logic (any rule matching is sufficient to unify records).

Source: [salesforceblogger.com — "Balance Precision and Consolidation with Better Identity Resolution Match Rules" (June 2025)](https://www.salesforceblogger.com/2025/06/11/balance-precision-and-consolidation-with-better-identity-resolution-match-rules/)

### Match Methods: Three Types

#### 1. Exact

Literal character-by-character match. No tolerance for typos, casing differences, or formatting variation.

Use for: stable, machine-generated identifiers where an exact match is meaningful — loyalty membership numbers, CRM Contact IDs, external system customer IDs.

Risk: A person who enters `Maria.Chen@example.com` in one system and `maria.chen@example.com` in another will NOT match on Exact (case sensitivity). Normalized Email handles this.

#### 2. Exact Normalized

Matches after applying standardization transformations. The system normalizes the values before comparing, so formatting differences do not prevent a match.

Normalization applied per field type:
- **Email**: Lowercased, leading/trailing whitespace removed
- **Phone**: Strips non-numeric characters, normalizes to E.164 format
- **Address**: Standardizes abbreviations, case, whitespace

Use for: email addresses, phone numbers, mailing addresses — fields where humans and systems introduce formatting variation without changing the underlying data.

Source: [Trailhead — Learn to Create and Manage Identity Resolution Rulesets](https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/select-identity-resolution-match-rules)

#### 3. Fuzzy

Approximate string matching that tolerates typos, misspellings, nicknames, and cultural name variations.

**Important limitation: Fuzzy matching is currently only available for First Name fields.** It is not available for email, phone, last name, or other fields.

Fuzzy matching uses a fine-tuned Large Language Model (LLM) based on BERT (Bidirectional Encoder Representations from Transformers), trained on data from 150+ countries, 3 billion English words, and 20 million names. It is **not** Levenshtein distance or a classic edit-distance algorithm — it uses semantic similarity scoring.

Precision levels:
- **Low Precision**: Loose similarities (e.g., Lisa / Liza, Lucia / Luc)
- **Medium Precision**: Initials, gender variants, shuffled names (e.g., S. / Sharon, Gabriel / Gabrielle)
- **High Precision**: Nicknames, punctuation variations, cross-cultural spellings (e.g., William / Bill, Beatriz / Beatrice)

Source: [Salesforce Blog — "Unify Profiles with Salesforce Data Cloud Identity Resolution Soft-Matching"](https://www.salesforce.com/blog/data-cloud-identity-resolution/)

Source: [Salesforce Engineering Blog — "AI-based Identity Resolution: Linking Diverse Customer Data"](https://engineering.salesforce.com/ai-based-identity-resolution-the-key-for-linking-diverse-customer-data/)

### Match Criteria Available

Match rules are configured by selecting:
1. **Object** — which DMO the criterion reads from (Individual, Contact Point Email, Contact Point Phone, Contact Point Address, Party Identification, Device, etc.)
2. **Field** — which field on that object to evaluate
3. **Match method** — Exact, Exact Normalized, or Fuzzy (Fuzzy only available for First Name)

Common criteria used in practice:
- Normalized Email (Contact Point Email → Email Address, Exact Normalized)
- Normalized Phone (Contact Point Phone → Telephone Number, Exact Normalized)
- Exact Party ID / Identification Number (Party Identification DMO, Exact)
- Fuzzy First Name + Exact Last Name + Normalized Address combination
- Fuzzy First Name + Normalized Phone
- Lead to Contact (built-in rule matching Salesforce Lead conversions to Contacts)
- Device to Known (built-in rule matching anonymous web visitors to known profiles)

### Default Ruleset (Generated by MCA Setup)

When you click "Generate Rule Set" during MCA setup (Basic Settings step 3), the platform creates a default ruleset for the Individual DMO with three match rules:

1. **Normalized Email** — matches Individuals sharing the same email address (after normalization)
2. **Lead to Contact** (added Winter '26) — prevents duplication when a Salesforce Lead is converted to a Contact
3. **Device to Known** (added Winter '26) — matches anonymous web visitor profiles to known Individuals when they complete a form or identify themselves

Source: [Salesforce Help — Configure Identity Resolution Rulesets for Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_data_identity_resolution.htm&language=en_US&type=5)

**Note:** If you set up MCA before the Winter '26 release, your auto-generated ruleset may only include Normalized Email. You can manually add Lead to Contact and Device to Known.

Source: [SFMC Tips #183 — Marketing Cloud Next: Smarter Identity Resolution Match Rules](https://medium.com/@marketingcloudtips/marketing-cloud-next-smarter-identity-resolution-match-rules-ea432cbb5cc5)

### Rule Priority

Match rules within a ruleset are OR conditions — if any rule matches, profiles are unified. The order of rules does not determine which match "wins"; it determines evaluation order. However, for performance and credit efficiency, put higher-confidence, more precise rules first.

If profiles match via multiple rules, they still create one Unified Individual. All matching source records are linked in the Unified Link table.

### Limitations

- Maximum 2 rulesets per data space (allows one production ruleset and one A/B test ruleset)
- Ruleset ID is a 4-character string assigned at creation; **it cannot be changed** after the ruleset is created
- Maximum 10 match rules per ruleset
- Maximum 10 criteria per match rule
- Fuzzy matching is only available for First Name
- Real-time matching (for personalization flows) supports Exact and Exact Normalized only — no fuzzy in real-time mode
- Party Identification can only have one Identification Number mapped from a source DLO per DMO row

---

## Reconciliation Rules

### What Reconciliation Rules Are

Reconciliation rules determine which field value to write to the Unified Individual when multiple matched source records contain different values for the same field.

Example: CRM has Maria Chen with First Name "Maria." The loyalty record has "M." The exam record has "Mary" (a typo). All three are matched into one Unified Individual. Reconciliation rules determine whether the Unified Individual's First Name becomes "Maria," "M.," or "Mary."

Reconciliation rules are the "editorial policy" for the unified record — they define what is considered the authoritative value for each field.

Source: [Mavlers — "What is Identity Resolution in Salesforce Data Cloud"](https://www.mavlers.com/blog/identity-resolution-salesforce-data-cloud/)

### Reconciliation Rule Levels

Reconciliation rules can be set at two levels:

1. **Object level** — a default strategy applied to all fields on a given DMO (e.g., "For all Individual fields, use Most Recent")
2. **Field level** — an override for a specific field that differs from the object-level default (e.g., "For the Loyalty Tier field specifically, use Source Priority with loyalty system ranked first")

Field-level rules override object-level rules.

### Three Reconciliation Strategies

#### 1. Most Recent (Last Updated)

The value from the source record that was most recently updated wins.

Use case: Fields that change over time and the latest state is the truth (e.g., email address, address, phone number).

Example: CRM has email updated 30 days ago; loyalty system has email updated 5 days ago → loyalty email wins.

#### 2. Most Frequent

The value that appears most often across matched source records wins.

Use case: Fields where agreement across sources is a signal of accuracy (e.g., First Name — if three sources say "Maria" and one says "M.", "Maria" wins).

This is often the default reconciliation strategy.

#### 3. Source Priority (Source Sequence)

You rank source DMOs in a priority order, and the value from the highest-ranked source that has a value for that field wins.

Use case: When one source is definitively the system of record for a specific field (e.g., CRM is the system of record for legal name; loyalty is the system of record for loyalty tier and points balance).

Example configuration: For Individual Name, rank Contact > Lead > Loyalty. For Loyalty Tier, rank Loyalty Program Member DMO first.

Source: [Trailhead — Explore Data Cloud Core Functionality: Unify Your Data](https://trailhead.salesforce.com/content/learn/projects/explore-data-cloud-core-functionality/unify-your-data) — confirmed this unit specifically covers all three strategies with examples.

Source: [The Agentic Marketer — "Add new fields to the Unified Individual DMO for use in Marketing Cloud Next"](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/new-fields-unified-individual-dmo/) — confirms: Last Updated, Most Frequent, Source Priority as three strategies.

### Reconciliation Configuration Steps

1. In the ruleset UI, navigate to the Reconciliation Rules tab (or section)
2. Set the object-level default strategy for each DMO
3. Override specific fields where the default does not apply
4. Common pattern: Most Recent as default for contact points; Source Priority for identity fields like CRM Contact ID

### Reconciliation Output: Unified Contact Points

Beyond the Unified Individual, IDR also creates **Unified Contact Point** objects. Unlike the Unified Individual (which holds one reconciled value per field), the Unified Contact Point objects collect ALL contact points from all matched sources. This is why a Unified Individual can have multiple Contact Point Emails — one from CRM, one from loyalty, one from ecommerce.

This is relevant for the activation template decision: you must select which contact point to use when sending, because the Unified Individual has many.

---

## Proposed LEOptical IDR Configuration (Base Rules)

Based on LEOptical's data model (from data-model.md) and the course structure, here are the match rules to configure in this module. Web tracking rules are explicitly deferred.

### Data Sources Contributing to IDR

Per the data model, three DMOs feed into IDR for LEOptical:
- **Individual** (from CRM Contact via Marketing Data Kit)
- **Contact Point Email** (from CRM Contact — primary email; also created during IDR from loyalty, ecommerce, and exam CSV email fields)
- **Loyalty Program Member** (custom fields include `Email Address` — often differs from CRM email; this is the key cross-source link)

Clinic patient data (stretch goal) contributes Individual + Contact Point Email records for IDR matching via `clinic_patients.csv`.

### Proposed Base Match Rules

#### Rule 1: Normalized Email (Primary)

**Object:** Contact Point Email
**Field:** Email Address
**Method:** Exact Normalized

This is the highest-confidence rule. If two source records share any email address (after normalization), they are the same person. This rule covers:
- CRM email matching loyalty email (the most common case for LEOptical)
- CRM email matching ecommerce order email

The Contact Point Email DMO already contains email addresses from the CRM data stream. The loyalty and ecommerce email addresses need to be mapped to Contact Point Email during data stream configuration (or IDR creates them automatically when it matches across the email field). <!-- VERIFY: confirm whether mapping loyalty/ecommerce emails to Contact Point Email DMO directly, or whether IDR creates these CPE records -->

#### Rule 2: Loyalty Membership Email Match

**Object:** Loyalty Program Member (custom DMO)
**Field:** Email Address (custom field)
**Method:** Exact Normalized

The Loyalty Program Member DMO has a custom `Email Address` field that holds the email used for the loyalty account. This may differ from the CRM email (e.g., Maria uses her work email for CRM, her personal email for loyalty). This rule catches cases where the emails don't match but the loyalty email matches a known contact point.

**Note:** For this rule to work, the Loyalty Program Member DMO must be related to Individual in the data model (via a party relationship or field mapping). <!-- VERIFY: confirm exact relationship setup required for LPM to be usable as IDR criteria -->

#### Rule 3: Fuzzy First Name + Normalized Last Name + Normalized Email Domain

<!-- VERIFY: Whether email domain matching is a supported match criterion. The research found fuzzy first name is supported, normalized email is supported, but "email domain" as a separate criterion is not confirmed. The course author mentioned this in the brief but it may not be a native IDR feature. An alternative is First Name + Last Name + normalized email on a separate DMO. -->

A possible alternative to an email domain rule:

**Rule 3 Alternative: Fuzzy First Name + Exact Last Name + Normalized Phone**

**Criteria (all must match, AND logic):**
1. Individual → First Name → Fuzzy (Medium Precision)
2. Individual → Last Name → Exact
3. Contact Point Phone → Telephone Number → Exact Normalized

This rule catches cases where a person uses different email addresses across systems but their name and phone number are consistent. Phone normalization handles the dirty phone data in the seed data.

#### Deferred: Eye Exam Email Match

Clinic patient data (stretch goal) maps `email` from `clinic_patients.csv` to Contact Point Email, which participates in email-based IDR matching. However, because clinic records may be for different family members booked under the same email, this rule requires careful validation before enabling.

**Recommended:** Configure this as an additional rule after evaluating Rule 1 and 2 results. Include in the module's investigation phase (review match quality, find missed matches, decide whether to add).

### What the Default Ruleset Covers (and Doesn't)

The auto-generated default ruleset (Normalized Email + Lead to Contact + Device to Known) covers:
- Email-based matching: Yes (good baseline for LEOptical)
- Lead-to-contact deduplication: Yes (relevant if LEOptical ever had Leads in Salesforce)
- Anonymous web visitor stitching: Yes — but this is only useful once the web connector is configured (Module X)
- Loyalty ID cross-matching: **No** — this is LEOptical's gap to fill
- Phone-based fallback matching: **No** — the dirty phone data makes this risky without normalization

The assignment asks learners to evaluate the default ruleset, identify what it misses for LEOptical's multi-source data, then add custom rules.

---

## Course Arc: What We Defer to the Web Connector Module

### In This Module (Base Rules)

Configure rules that work with data already in the system at this point:
- Rule 1: Normalized Email (covers CRM, loyalty, ecommerce email matching)
- Rule 2: Loyalty membership email cross-reference
- Rule 3: Name + Phone fallback (or equivalent)
- Run IDR and review results
- Evaluate and adjust based on match quality investigation

### Deferred to the Web Connector Module

When the web connector is added later in the course, it introduces:
- Anonymous web visitor profiles (identified by device/cookie)
- Web form submission events (where an anonymous visitor identifies themselves by email)

This requires additional IDR rules:
- **Device to Known**: Already in the default ruleset but not yet meaningful until web data exists
- Possibly: custom rule matching web form submission email to existing Contact Point Email

The module should acknowledge: "We'll revisit the IDR ruleset in the web connector module when we add web tracking data. The Device to Known rule in the default ruleset is already there — it just has nothing to match against yet."

---

## UI Navigation Paths

### MCA Setup Path (Basic Settings — Auto-Generate Ruleset)

From MCA Setup:
**Setup > Assistant Home > Basic Settings > Step 3: Configure Identity Resolution Rulesets > Generate Rule Set**

This generates the default ruleset (Normalized Email + Lead to Contact + Device to Known) and is the starting point for the module.

Source: [arthurbackouche.com — "How to set up Marketing Cloud Next"](https://arthurbackouche.com/docs/marketing-cloud-next/foundation-setup/how-to-set-up-marketing-cloud-next/)

Alternate path per Salesforce Help: From Setup, Quick Find box, enter "Basic" and select "Basic Settings." Scroll to the Identity Resolution Rulesets section.

Source: [Salesforce Help — Configure Identity Resolution Rulesets for Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_data_identity_resolution.htm&language=en_US&type=5)

### Data 360 Direct Path (For Rule Configuration)

**Data Cloud (Data 360) > Identity Resolutions tab > [Select Ruleset] > Edit**

Or to create a new ruleset:
**Data Cloud (Data 360) > Identity Resolutions tab > New**

Steps for new ruleset:
1. Select Primary Data Model Object: Individual
2. Assign a Ruleset ID (4-character, immutable — choose carefully)
3. Name the ruleset
4. Configure match rules via Ruleset Properties panel
5. Set reconciliation rules
6. Publish

Source: [Trailhead — Configure Identity Resolution Rules](https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/configure-identity-resolution-rules)

### Run Identity Resolution Manually

From the ruleset detail page:
**Run Now button** — limited to 4 times per 24 hours per ruleset per data space.

Source: [Salesforce Help — Run Identity Resolution Ruleset Jobs at Any Time (Spring '23)](https://help.salesforce.com/s/articleView?id=release-notes.cdp_rn_2023_spring_ir_run_now.htm&language=en_US&release=242&type=5)

### View Processing Results

After IDR runs, processing history and match statistics are available on the ruleset detail page:
- Total unified profiles created
- Source profiles processed
- Match rate
- Error/warning count

Source: [Salesforce Help — Identity Resolution Ruleset Processing Results](https://help.salesforce.com/s/articleView?id=sf.c360_a_resolution_summary.htm&language=en_US&type=5)

---

## Platform Gotchas

### From platform-gotchas.md

**IDR auto-creates a default ruleset during MCA setup**
Confirmed: 2026-08-06, Summer '26

MCA setup can auto-create a default IDR ruleset. This is not required — learners can configure IDR directly in Data 360. The auto-generated ruleset may or may not be appropriate for the client's data.

### Newly Identified During Research

**Ruleset ID is immutable — choose carefully**

The 4-character ruleset ID assigned at creation cannot be changed. If you create a ruleset and then want to rename or change the ID, you must delete the ruleset and start over. This affects the API names of all objects generated by IDR (Unified Individual ID format includes the ruleset ID).

Source: [Salesforce Help — Test Multiple Identity Resolution Rulesets Faster (Spring '22)](https://help.salesforce.com/s/articleView?id=release-notes.cdp_rn_2022_spring_identity_resolution_ruleset_ID.htm&language=en_US&release=236&type=5)

**Maximum 2 rulesets per org**

Only 2 identity resolution rulesets are allowed per data space. This means you cannot freely experiment with multiple configurations — the second ruleset slot is designed for A/B testing. Once you settle on a production ruleset, delete any test rulesets if you want to free up the slot.

Source: Multiple sources confirmed this limit.

**Real-time matching excludes fuzzy rules**

If you are using real-time identity resolution (for personalization flows), only Exact and Exact Normalized match methods are supported. Fuzzy first name matching only runs in batch/scheduled mode.

Source: [Salesforce Help — Real-Time Identity Resolution for Personalization](https://help.salesforce.com/s/articleView?id=sf.persnl_setup_real_time_identity_resolution_for_einstein_personalization.htm&language=en_US&type=5)

**Run Now is rate-limited to 4 times per 24 hours**

If you are iterating on rules during configuration and want to test the effects, you can only trigger Run Now 4 times per ruleset per data space per 24 hours. Plan your testing accordingly — make multiple rule changes before running, rather than running after each individual change.

**IDR skips the daily run if nothing changed**

The daily scheduled run is skipped if there are no changes to source data, object mappings, or ruleset configuration. This is good for cost management but means IDR is not guaranteed to run every day.

**Daily runs consume credits even on unchanged records if rules changed**

If you change your match rules, the next IDR run re-evaluates all records, including records that haven't changed. This is equivalent to a full reprocessing cost. <!-- VERIFY: Confirm this is a full reprocess or only incremental for changed records. Research found conflicting signals: one source says "changes apply on demand and refresh instantly" but another says "every modified source profile costs 0.1 credit" implying incremental. -->

**Activation without activation template sends to all contact points**

A customer unified from 3 source records (3 different emails) will receive 3 copies of any email send if you do not configure an Activation Template to specify which Contact Point Email to use. This is confirmed in platform-gotchas.md (2026-08-06, Summer '26).

**IDR does not merge records — it links them**

A common misconception: IDR does not merge or delete source records. It creates a Unified Individual and a Unified Link table entry. The original source records remain intact. If source data changes, IDR can re-run and update the links without data loss.

Source: [Mavlers — "What is Identity Resolution in Salesforce Data Cloud"](https://www.mavlers.com/blog/identity-resolution-salesforce-data-cloud/)

---

## MCE Comparison Points

This module does not have a direct MCE equivalent. MCE (Marketing Cloud Engagement) does not have a native identity resolution system comparable to Data 360's IDR.

The closest MCE equivalents are:
- **Contact/Subscriber key matching**: In MCE, a subscriber's identity is determined by their Subscriber Key (typically the CRM Contact ID or email address). There is no automated cross-source matching — a customer who used two different email addresses in two different systems would exist as two separate subscribers in MCE. Deduplication had to be handled manually or via custom AMPscript logic.
- **MC Connect / Synchronized Data Extensions**: MCE's integration with Salesforce CRM (via Marketing Cloud Connect) allowed CRM data into MCE but did not attempt to unify identities across non-CRM sources.
- **Einstein ID Matching**: Some later MCE features included basic identity stitching for certain use cases (e.g., web tracking via Collect Tracking Code → Marketing Cloud Person), but this was narrow in scope and not a general-purpose IDR system.

In MCA, IDR is a core platform capability that handles multi-source identity matching at scale, with configurable rules, fuzzy matching powered by LLMs, and credit-tracked processing — none of which existed in the MCE paradigm.

---

## External Resources

- [Salesforce Help — Configure Identity Resolution Rulesets for Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_data_identity_resolution.htm&language=en_US&type=5) — The official MCA-specific help article for IDR configuration. Primary reference for UI navigation and setup steps.

- [Salesforce Help — Identity Resolution Match Rules](https://help.salesforce.com/s/articleView?id=data.c360_a_match_rules.htm&language=en_US&type=5) — Reference for available match methods, criteria objects, and how rules are structured.

- [Salesforce Help — Identity Resolution Reconciliation Rules](https://help.salesforce.com/s/articleView?language=en_US&id=sf.c360_a_reconciliation_rules.htm&type=5) — Reference for reconciliation strategies and configuration.

- [Salesforce Help — Run Identity Resolution Ruleset Jobs at Any Time (Spring '23)](https://help.salesforce.com/s/articleView?id=release-notes.cdp_rn_2023_spring_ir_run_now.htm&language=en_US&release=242&type=5) — Documents the manual Run Now capability and 4/day rate limit.

- [Trailhead — Configure Identity Resolution Rules](https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/configure-identity-resolution-rules) — Hands-on module covering reconciliation rules with examples of all three strategies (Most Recent, Frequency, Source Priority).

- [Trailhead — Explore Data Cloud Core Functionality: Unify Your Data](https://trailhead.salesforce.com/content/learn/projects/explore-data-cloud-core-functionality/unify-your-data) — Project-based Trailhead covering IDR configuration end-to-end, including match rules and reconciliation.

- [Trailhead — Learn to Create and Manage Identity Resolution Rulesets](https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/select-identity-resolution-match-rules) — Covers match rule types (Exact, Normalized, Fuzzy) and configuration structure.

- [Salesforce Blog — "Unify Profiles with Salesforce Data Cloud Identity Resolution Soft-Matching"](https://www.salesforce.com/blog/data-cloud-identity-resolution/) — Official explanation of fuzzy/soft matching: precision levels, LLM approach, examples.

- [Salesforce Engineering Blog — "AI-based Identity Resolution: Linking Diverse Customer Data"](https://engineering.salesforce.com/ai-based-identity-resolution-the-key-for-linking-diverse-customer-data/) — Technical deep dive into the LLM and MLP approach behind fuzzy name matching.

- [Salesforce Engineering Blog — "Scaling Identity Resolution in Data Cloud with Lucene, Spark, and Fuzzy Matching"](https://engineering.salesforce.com/scaling-identity-resolution-in-data-cloud-with-lucene-spark-and-fuzzy-matching/) — Technical deep dive into LSH and embedding-based candidate generation for fuzzy matching.

- [Salesforce Developer Blog — "Building a Complete View of Your Customers with Data Cloud and Identity Resolution" (October 2024)](https://developer.salesforce.com/blogs/2024/10/data-cloud-and-identity-resolution) — High-level conceptual overview of IDR; covers Individual vs Unified Individual distinction.

- [Szymon Lewandowski — "Salesforce Data Cloud Credits Guide"](https://www.szymonlewandowski.pl/blog/data-cloud-credits-guide-salesforce) — Detailed credit consumption breakdown with exact rates for IDR and comparison to other operations.

- [Jitendra Zaa — "Salesforce Data 360 Credit Optimization Guide, March 2026"](https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/) — Covers incremental vs batch behavior and the 2–3x credit consumption surprise.

- [Salesforce Admins Blog — "Rethinking the Golden Record: The Advantages of Data Cloud's Unified Profile"](https://admin.salesforce.com/blog/2025/rethinking-golden-record-advantages-of-data-cloud-unified-profile) — Accessible explanation of why Data 360's non-destructive approach is better than traditional "golden record" merge.

- [Ryan Hernalsteen (Medium) — "Planning for Identity Resolution in Salesforce Data Cloud"](https://hernalsteen.medium.com/planning-for-identity-resolution-in-salesforce-data-cloud-2ea2ab816de7) — Practitioner's guide to IDR strategy; covers the "art vs. science" framing.

- [Revenue Pulse — "EP 4: Identity Resolution"](https://www.revenuepulse.com/blog/episode-4-identity-resolution/) — MCA-specific coverage of default rules (Normalized Email, Lead to Contact, Device to Known) and reconciliation rule defaults.

- [The Agentic Marketer — "Add new fields to the Unified Individual DMO for use in Marketing Cloud Next"](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/new-fields-unified-individual-dmo/) — MCA-specific guide covering how to extend the Unified Individual DMO and confirms reconciliation strategies (Last Updated, Most Frequent, Source Priority).

- [Salesforce Ben — "Party Identification in Data Cloud: Your Complete Set Up Guide"](https://www.salesforceben.com/party-identification-in-data-cloud-your-complete-set-up-guide/) — Covers Party Identification DMO for external identifier matching; relevant if LEOptical loyalty ID matching is configured.

- [SFMC Tips #183 — Marketing Cloud Next: Smarter Identity Resolution Match Rules](https://medium.com/@marketingcloudtips/marketing-cloud-next-smarter-identity-resolution-match-rules-ea432cbb5cc5) — MCA-specific coverage of the Winter '26 default ruleset update (Lead to Contact, Device to Known).

---

## Data Model Relevance

### DMOs That Feed into IDR

Per data-model.md, the IDR inputs for LEOptical are:

**Individual DMO** (from CRM Contact via Marketing Data Kit)
- Key fields for IDR: First Name, Last Name, Birth Date
- Email is on Contact Point Email, not Individual directly

**Contact Point Email DMO** (from CRM Contact)
- Key fields for IDR: Email Address (Exact Normalized)
- Additional CPE rows created from loyalty, ecommerce, exam email fields during data stream mapping <!-- VERIFY: confirm whether CPE rows from non-CRM sources are created at ingestion time or by IDR -->

**Loyalty Program Member DMO** (from loyalty.csv)
- Key field for IDR: Email Address (custom field) — "often differs from CRM email — key for IDR"
- Also has Phone (custom field, mixed formats — dirty data)

**Eye Exam DMO** (from clinic_exams.csv, stretch goal)
- FK: patient_id (links to Individual via clinic_patients.csv)

### Dirty Data Implications for IDR

The seed data contains intentional dirty data that affects IDR:

- **Contacts**: ~5% have missing Last Name (from data-model.md)
- **Phone**: Mixed formats across CRM and Loyalty ("dirty data" noted explicitly)
- **Loyalty email vs. CRM email**: Intentionally differ for many records — this is the primary IDR challenge
- **Ecommerce email**: from `ecom_customers.csv`, may differ from CRM and loyalty emails
- **Clinic email**: from `clinic_patients.csv` (stretch goal), may belong to a family member

### Contact Point Email Behavior After IDR

From data-model.md: "Additional Contact Point Email records are created during IDR from loyalty, ecommerce, and exam CSV email addresses."

This means the CPE DMO will have multiple rows per Unified Individual after IDR runs — one for the CRM primary email, and potentially one each for loyalty, ecommerce, and exam emails if they differ. This is why activation templates must specify which CPE to use for sending.

### Unified Individual as Root of Data Graph

Per data-model.md, the Data Graph is rooted on Unified Individual. The graph traversal:
- Unified Individual → Contact Point Email → Communication Subscription Consent
- Unified Individual → Loyalty Program Member (1:1)
- Unified Individual → Sales Order (1:many)
- Unified Individual → Eye Exam (1:many)

IDR must run before the Data Graph can be built. Data Graph refresh must follow IDR run in the dependency chain.

---

## Open Questions

These items could not be definitively confirmed from available documentation and should be flagged with `<!-- VERIFY -->` comments in the module draft:

1. **Does changing match rules trigger a full reprocess or incremental?** Research found conflicting signals. Conservative assumption: any rule change triggers reprocessing of a substantial portion of records. The exact scope is unclear. <!-- VERIFY -->

2. **Email domain matching as a native IDR criterion**: The course brief mentions "fuzzy name + email domain" as a match rule. Email domain as a standalone criterion is not confirmed as a native IDR feature in any documentation reviewed. This may need to be reframed as "Fuzzy First Name + Exact Last Name + Normalized Phone" or similar. <!-- VERIFY -->

3. **How CPE rows from non-CRM sources are created**: The data-model.md states CPE rows are "created during IDR from loyalty, ecommerce, and exam CSV email addresses." It is not confirmed whether this happens at data stream ingestion time (by mapping the email field to CPE) or as a side effect of IDR running. This affects whether learners need to configure data stream field mappings to CPE before IDR runs. <!-- VERIFY -->

4. **LPM relationship to Individual for IDR criteria**: For the Loyalty Program Member's email address to be usable as an IDR match criterion, the LPM DMO must have a relationship to the Individual DMO. The exact relationship type and configuration required is not confirmed. <!-- VERIFY -->

5. **What "refresh instantly" means for manual rule changes**: One source states rule changes "apply on demand and refresh instantly." It is unclear whether this means the Unified Individual records are immediately updated or whether a subsequent run is required. <!-- VERIFY -->

---

## Source Log

- https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_data_identity_resolution.htm — Official MCA IDR config page. Returned JS-only content on direct fetch; extracted key info from search result snippets. Primary reference for MCA-specific setup.
- https://help.salesforce.com/s/articleView?id=data.c360_a_match_rules.htm — Match rules reference. JS-only on fetch; used search snippets.
- https://help.salesforce.com/s/articleView?id=sf.c360_a_reconciliation_rules.htm — Reconciliation rules reference. JS-only on fetch; used search snippets.
- https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/configure-identity-resolution-rules — INCLUDED. Reconciliation rule strategies confirmed here (Most Recent, Frequency, Source Priority with examples).
- https://trailhead.salesforce.com/content/learn/projects/explore-data-cloud-core-functionality/unify-your-data — INCLUDED. IDR configuration process, match rule types, output objects explained.
- https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/select-identity-resolution-match-rules — INCLUDED. Match methods (Exact, Normalized, Fuzzy), field selection, configuration structure.
- https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/get-to-know-unified-profiles — INCLUDED. Three-object unified profile architecture (Individual, Unified Individual, Unified Link Individual).
- https://developer.salesforce.com/blogs/2024/10/data-cloud-and-identity-resolution — INCLUDED. Individual vs Unified Individual conceptual distinction, October 2024.
- https://www.salesforce.com/blog/data-cloud-identity-resolution/ — INCLUDED. Fuzzy/soft matching explanation, precision levels (Low/Medium/High).
- https://engineering.salesforce.com/ai-based-identity-resolution-the-key-for-linking-diverse-customer-data/ — INCLUDED. LLM/BERT technical approach to fuzzy name matching, not Levenshtein.
- https://engineering.salesforce.com/scaling-identity-resolution-in-data-cloud-with-lucene-spark-and-fuzzy-matching/ — INCLUDED. LSH + embedding-based two-phase fuzzy matching architecture.
- https://www.szymonlewandowski.pl/blog/data-cloud-credits-guide-salesforce — INCLUDED. Credit rate confirmed: 100,000 per 1M rows. Sandbox discount (80,000). Updated October 2025.
- https://www.jitendrazaa.com/blog/salesforce/salesforce-data-360-credit-optimization-guide-march-2026/ — INCLUDED. Incremental vs batch behavior, 0.1 credit per modified profile, 2-3x surprise cost.
- https://www.fastslowmotion.com/data-cloud-identity-resolution-guide/ — INCLUDED. Match methods, reconciliation strategies, common failure modes.
- https://www.mavlers.com/blog/identity-resolution-salesforce-data-cloud/ — INCLUDED. Non-destructive architecture; Unified Link Individual explained; when to re-run.
- https://www.revenuepulse.com/blog/episode-4-identity-resolution/ — INCLUDED. MCA-specific; default ruleset (Normalized Email + Lead to Contact + Device to Known); daily run cadence; reconciliation default "last updated."
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/new-fields-unified-individual-dmo/ — INCLUDED. MCA-specific. Unified Individual DMO field types, reconciliation strategies (Last Updated, Most Frequent, Source Priority). Confirms platform is MCA/Marketing Cloud Next.
- https://admin.salesforce.com/blog/2025/rethinking-golden-record-advantages-of-data-cloud-unified-profile — INCLUDED. Unified Link Individual as key ring; non-destructive model explanation.
- https://medium.com/@derrick.ellis/looking-beyond-the-golden-record-unified-profiles-in-salesforce-data-cloud-ec23bf17bfb5 — Returned 403. Used search snippet for Unified Link Individual architecture.
- https://www.salesforceblogger.com/2026/07/09/architecting-data-36o-unlocking-advanced-segmentation-with-individual-vs-unified-individual-dmos/ — Returned CSS-only content on fetch. Used search snippets. July 2026 article on Individual vs Unified Individual for segmentation.
- https://www.salesforceblogger.com/2025/06/11/balance-precision-and-consolidation-with-better-identity-resolution-match-rules/ — Returned CSS-only on fetch. Search snippet confirmed 10 match rules, 10 criteria per rule limits.
- https://arthurbackouche.com/docs/marketing-cloud-next/foundation-setup/how-to-set-up-marketing-cloud-next/ — INCLUDED. MCA-specific Setup path: Basic Settings > Configure Identity Resolution Rulesets.
- https://help.salesforce.com/s/articleView?id=release-notes.cdp_rn_2023_spring_ir_run_now.htm — Run Now capability (Spring '23). 4/day limit confirmed from search snippets.
- https://help.salesforce.com/s/articleView?id=sf.c360_a_identity_resolution_match_type_compare.htm — Scheduled vs real-time matching. JS-only fetch; real-time = Exact/Normalized only confirmed from search.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-smarter-identity-resolution-match-rules-ea432cbb5cc5 — Returned 403. Search snippet confirmed Winter '26 default ruleset update.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-scheduling-identity-resolution-and-data-graph-a63aecf1904a — Returned 403.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-key-points-to-be-careful-about-in-identity-resolution-ffa5f9484aed — Returned 403.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-configuring-identity-resolution-filters-72508fa04654 — Returned 403. Note: IDR Filters feature added July 2026 — pre-filter data before IDR runs. Could be relevant for future module updates but not covered in base module.
- https://www.salesforceben.com/party-identification-in-data-cloud-your-complete-set-up-guide/ — INCLUDED. Party Identification DMO for external ID matching; relevant for loyalty ID cross-reference rule.
- https://hernalsteen.medium.com/planning-for-identity-resolution-in-salesforce-data-cloud-2ea2ab816de7 — Returned 403.
- https://scandiweb.com/blog/identity-resolution-in-salesforce-data-cloud/ — Returned JS/CSS-only on fetch. Limited direct value.
- https://thespotforpardot.com/2025/09/09/exciting-updates-for-marketing-cloud-next-for-winter-26/ — Returned JS-only. Winter '26 IDR changes confirmed via search snippets.
- https://help.salesforce.com/s/articleView?id=sf.c360_a_resolution_summary.htm — Processing results page. JS-only; used search snippet confirmation.
- https://help.salesforce.com/s/articleView?id=data.c360_a_identity_resolution_ruleset.htm — Identity Resolution Rulesets reference. JS-only; daily run skip behavior confirmed from search.

---

## Course Author Additions (post-research)

### Multiple IDR Rulesets
- You **can** create multiple IDR rulesets in Data 360, but it is **not recommended**
- Each ruleset produces its own separate Unified Individual DMO — two rulesets = two separate unified identity spaces
- This creates downstream confusion: segments, data graphs, and activations must explicitly choose which Unified Individual DMO to use, and the two sets of profiles cannot be cross-queried
- The module should briefly acknowledge that multiple rulesets are possible but steer learners firmly toward a single ruleset
- Salesforce's own guidance recommends one ruleset per org

### Advanced IDR Patterns (mention-only, out of scope)
- **Household IDR**: Data 360 supports resolving individuals into household groups (useful for B2C retailers, financial services, etc.)
  - Further reading: https://help.salesforce.com/s/articleView?id=sf.c360_a_household_resolution.htm
- **Account IDR**: Data 360 also supports resolving business account records (B2B use cases)
  - Further reading: https://help.salesforce.com/s/articleView?id=sf.c360_a_account_resolution.htm
- This course focuses exclusively on individual person IDR (B2C)
- The module should name-drop both patterns with links and explicitly note they are out of scope
- https://help.salesforce.com/s/articleView?id=release-notes.cdp_rn_2022_spring_identity_resolution_ruleset_ID.htm — Ruleset ID immutability confirmed (Spring '22 release notes).
