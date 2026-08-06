# Platform Gotchas

Confirmed quirks, unexpected behaviors, and workarounds in MCA/Data 360. Reference this file before writing any module content that touches these areas.

Each entry must include the date it was confirmed and the Salesforce release version.

---

## Consent

### MCA does not auto-create consent records
**Confirmed:** 2026-08-06
**Release:** Summer '26

MCA requires an explicit consent record (Communication Subscription Consent) for every Individual before you can send marketing emails. The platform does not create these automatically when a Contact or Lead is created. You must build automation (a Data 360 Triggered Flow) to handle this.

### Party field on Comm Sub Consent is not populated by MCA
**Confirmed:** 2026-08-06
**Release:** Summer '26

Communication Subscription Consent has a `Party` field that is supposed to link to Individual via `Individual ID`. MCA does not populate this field. The workaround is to relate Comm Sub Consent to Contact Point Email using `Email Address = Consent Value` instead of using the Party relationship.

### Preference center updates Comm Sub Consent DMO directly
**Confirmed:** 2026-08-06
**Release:** Summer '26

When someone opts in or out via the preference center, MCA writes OPT_IN or OPT_OUT to the Communication Subscription Consent DMO. This is the source of truth for consent status at send time.

---

## Data Graphs

### Missing fields are absent from graph JSON, not null
**Confirmed:** 2026-08-06
**Release:** Summer '26

If an Individual does not have data for a field, the Data Graph JSON does not include that field at all. It is not null or empty. It simply does not exist in the JSON. Handlebars expressions referencing missing fields silently render as empty. You must use `{{#if}}` checks or default values to handle this.

---

## Identity Resolution

### IDR auto-creates a default ruleset during MCA setup
**Confirmed:** 2026-08-06
**Release:** Summer '26

MCA setup can auto-create a default IDR ruleset. This is not required and learners can configure IDR directly in Data 360. The auto-generated ruleset may or may not be appropriate for the client's data.

---

## Domain and Sending

### SDOs do not have a default sending domain
**Confirmed:** 2026-08-06
**Release:** Summer '26

SDO orgs do not come with a pre-configured email sending domain. Learners must configure domain authentication (SPF, DKIM, DMARC) with their own domain before they can send emails.

---

## Activation Templates

### Without activation template, all emails on a unified profile get sent to
**Confirmed:** 2026-08-06
**Release:** Summer '26

If you send to a segment without an Activation Template configured, MCA sends to every Contact Point Email associated with the Unified Individual. A customer with 3 email addresses gets 3 emails. The Activation Template lets you specify which contact point to use.

---

## SDO Limitations

### SDOs have one data space
**Confirmed:** 2026-08-06
**Release:** Summer '26

SDO orgs only have a single data space. Business units cannot be enabled. Module 3 (Business Units and Governance) is conceptual for BU content and hands-on only for roles, permissions, and CMS workspaces.

---

## Einstein / Predictive AI

### Einstein Engagement Scoring requires real engagement history
**Confirmed:** 2026-08-06
**Release:** Summer '26

Engagement Scoring needs 1,000+ engagement events (sends, opens, clicks, bounces, unsubscribes) across the business unit in the prior 90 days. Each contact needs at least 1 email send to receive a score. Will not produce results with seed data.

### Einstein Engagement Frequency requires sustained sending
**Confirmed:** 2026-08-06
**Release:** Summer '26

Engagement Frequency requires 5+ promotional emails sent in the past 28 days to 10+ subscribers across 5 different send intervals. Contacts without enough history fall into "Default" bucket.

---

## Reporting

### Marketing Performance Intelligence requires reinstall each release
**Confirmed:** 2026-08-06
**Release:** Summer '26

The Marketing Performance Intelligence analytics package (Tableau Next) must be uninstalled and reinstalled once per Salesforce release (3x/year). It does not auto-update.

---

## Adding New Entries

When you discover a gotcha:

1. Verify it in a live SDO
2. Add it here with the confirmation date and release version
3. Reference it in the relevant module content with a `:::warning` admonition
4. If it contradicts something already documented, update the existing entry
