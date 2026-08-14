---
sidebar_position: 5
title: "Consent Fundamentals"
description: "How MCA's explicit opt-in consent model works, the five consent objects and their relationships, and the platform gotchas that will break your sends if you don't know them."
---

## Overview

LEOptical has been sending batch-and-blast newsletters for years with no consent framework. Their previous ESP treated everyone as contactable by default. MCA does not. Before a single marketing email can go out, every customer needs an explicit consent record in Data 360. This is not a configuration choice you can skip. It is how the platform works at the enforcement layer.

This module covers the consent model in full: the five components that make up a consent record, how consent is checked at send time, and the gotchas that cause consent failures. When MCA blocks a send for consent reasons, the contact appears in send reporting as not sent with a reason indicating they were not opted in. The send does not raise a delivery error or a bounce. If you do not understand the consent model before you start building, you will spend a lot of time chasing consent failures in send logs without knowing what to look for.

<ModuleLink slug="consent-configuration" /> builds the flow that creates consent records for LEOptical's customers. This module is the prerequisite. Understand the model here, and the configuration in <ModuleLink slug="consent-configuration" /> will make sense. Skip this, and <ModuleLink slug="consent-configuration" /> will feel like following steps without knowing why.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- How MCA's explicit opt-in model differs from an opt-out model.
- The five consent components: Contact Point, Communication Subscription, Engagement Channel Type, Communication Subscription Channel Type, and Communication Subscription Consent.
- The Consent Audit Trail DLO and why it is not used at send time.
- How the Communication Subscription Consent DMO stores consent status and what fields matter.
- The Party field gotcha and the Contact Point Email workaround.
- The 90-day consent cache and why direct DMO writes do not work.
- How consent is enforced at send time and what the send record shows when a contact is blocked.
- The five valid methods for creating consent records and why direct DMO writes do not work.
- Transactional vs. marketing messages and when consent is not required.
- LEOptical's four Communication Subscriptions and how they map to the consent model.

## Explicit Opt-In, Not Opt-Out

MCA operates on what the platform calls an "implicit opt-out" model. The name is confusing. What it means in practice is simple: if no explicit OPT_IN record exists for a contact, MCA treats them as opted out and will not send to them.

This is the opposite of how most email platforms work. Your previous MCE implementation, your client's old ESP, virtually every batch-send tool before the GDPR era: they all started from "contactable by default" and let subscribers opt out. MCA flips this. New contacts default to opted out. They can only receive marketing emails after an explicit OPT_IN record is created for them.

:::tip[Coming from MCE?]
In MCE, subscribers in the All Subscribers list were contactable unless they were on the unsubscribe list or had bounced. The default assumption was: "send unless blocked." In MCA, the default assumption is: "block unless explicitly permitted." This is a fundamental shift, not a setting you can adjust per campaign.

- MCE tracked consent at the subscriber/list level using Publication Lists and the All Subscribers list.
- MCA tracks consent per email address, per Communication Subscription, per channel in the Communication Subscription Consent DMO.
- MCE had a native "double opt-in" toggle on subscriber lists. MCA has no native toggle. Double opt-in must be built as a custom Flow.
- MCE Subscriber Key was the system identity anchor. MCA has no Subscriber Key concept. Identity is resolved via Identity Resolution into Unified Individuals.
:::

For LEOptical, this means every existing customer needs an explicit consent record before they can receive anything. That's the problem <ModuleLink slug="consent-configuration" /> solves. This module gives you the model you need to understand what <ModuleLink slug="consent-configuration" /> is building.

## The Five Consent Components

Before reading the sections below, look at [The Agentic Marketer's consent management diagram](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/consent-management/). Their diagram shows how these five objects connect to each other. The prose below explains what each one does and where the gotchas are.

MCA's consent model has five interrelated components. You need to understand all five before the consent record structure makes sense.

For background on MCA's Data Model Objects (DMOs), how they relate to Salesforce objects, and how they work within Data 360, the [Understand Consent Management for Effective Marketing Trailhead module](https://trailhead.salesforce.com/content/learn/modules/consent-management-fundamentals-for-marketing-cloud-next/get-started-with-consent-management) and [The Agentic Marketer consent deep dive](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/consent-management/) are both good starting points. The assignment at the end of this module includes both.

### Contact Point

A Contact Point is a specific communication endpoint: an email address or a phone number. In Data 360, each email address or phone number is its own Contact Point record. Consent is tracked at the contact point level, not at the Individual or Contact record level.

This has two practical consequences. First, a customer with two email addresses can have different consent status for each address. They might be opted into Promotional Offers at their personal address and opted out at their work address. Second, if a customer changes their email address, their old consent does not transfer to the new address. A new OPT_IN record must be created for the new address.

:::warning
Consent does not follow the customer. It follows the email address. If a Contact record's email address changes in the CRM, the existing consent records remain attached to the old address. The new address starts with no consent. Build your consent flow with this in mind.
:::

### Communication Subscription

A Communication Subscription is a named category of marketing content that a person can opt into. Examples: "Promotional Offers," "VisionCare Rewards Updates," "Eye Health Reminders." Opting into one subscription has no effect on any other subscription.

MCA auto-creates a default "Marketing" subscription. Most organizations add additional custom subscriptions on top of that. The Communication Subscription is the thing a customer is actually consenting to receive. It is configured in **Marketing Cloud App > Consent > Preference Pages and Subscriptions**.

### Engagement Channel Type

The delivery channel: Email, SMS, or WhatsApp. Consent is tracked separately per channel. A customer could be opted into "Promotional Offers" via email but not via SMS. These are independent consent records.

LEOptical's initial build is email-only. SMS and WhatsApp require paid add-ons. Channel-level granularity matters when those channels are active.

### Communication Subscription Channel Type

This is a junction object in Data 360 that uniquely identifies the combination of a Communication Subscription and an Engagement Channel Type. You do not configure it directly. It is created automatically when you associate a channel with a subscription.

It has its own record ID (IDs begin with `0eB`). It is the mechanism that links a specific subscription to a specific channel. You do not need to look up or reference this ID directly when building consent flows. The Create Consent flow element handles the mapping when you select a subscription and channel from its UI.

### Communication Subscription Consent (DMO)

This is the actual consent record stored in Data 360. The four components above are all context. The Communication Subscription Consent DMO is the source of truth the enforcement layer checks at send time.

<Screenshot src="/img/consent-fundamentals/02-comm-sub-consent-dmo-fields.png" alt="Communication Subscription Consent DMO detail page in Data 360 showing the object label, API name ssot__CommunicationSubscriptionConsent__dlm, Standard type, and 33 fields" caption="The Communication Subscription Consent DMO in Data 360. This is the object that stores the actual consent records the enforcement layer checks at send time." />

Key fields on the Communication Subscription Consent DMO:

| Field | Description |
|---|---|
| Consent Status | `OPT_IN` or `OPT_OUT` |
| Contact Point Value | The email address this consent applies to |
| Communication Subscription | The channel-agnostic subscription ID (IDs begin with `0Xl`) |
| Communication Subscription Channel Type | The channel-specific subscription ID (IDs begin with `0eB`) |
| Consent Date | Timestamp when consent was captured |
| Communication Subscription Consent Id | Composite key: `email#CommunicationSubscriptionChannelTypeId` |

The composite key format, per the arthurbackouche.com implementation guide, looks like this: `user@example.com#0eBHs0000010zyOMAQ`. This key uniquely identifies one consent record for one email address and one subscription-channel combination.

## Global Opt-Out vs. Subscription-Level Opt-Out

MCA supports two levels of unsubscribe. The preference center exposes both.

**Subscription-level:** The Unified Individual's email address is opted out of one subscription. Their consent status for all other subscriptions is unchanged.

**Global opt-out ("Unsubscribe from all"):** Removes the Unified Individual's email address from all existing subscriptions across all channels. This is what the standard email footer unsubscribe link triggers.

One nuance: global opt-out does not permanently block an email address from future subscriptions. If a new Communication Subscription is created after the global opt-out, the email address would not automatically be opted out of the new subscription. It would be absent from it (which is effectively opt-out, since absence = blocked), but it was not explicitly excluded from it. This distinction matters if you are auditing consent coverage across your subscription catalog.

## How Consent is Enforced at Send Time

When a Flow or activation triggers a send, MCA checks consent before delivering the message. The process is:

1. MCA identifies the contact's email address (the Contact Point).
2. The selected Communication Subscription is evaluated against the email address.
3. The system checks the consent cache for an OPT_IN record for that email + subscription + channel combination.
4. If no OPT_IN record exists, or if the cached record shows OPT_OUT, the send is blocked for that contact. The contact appears in send reporting as not sent, with a reason indicating they were not opted in. No delivery error is raised and the contact does not bounce.
5. If an OPT_IN record is confirmed in the cache, the send proceeds.

Step 4 is where consultants get burned. The failure is visible in send reporting, but only if you look at the not-sent records and check the reason. It does not surface as an error on the send itself. If your delivered count looks low and you are not checking the not-sent list, you will miss it.

The other thing to notice: step 3 says "consent cache," not "Communication Subscription Consent DMO." These are not the same thing.

## The Consent Audit Trail

The Consent Audit Trail is a logging mechanism, not part of the enforcement chain described above.

MCA also maintains a `ConsentAuditTrailV2` Data Lake Object (DLO) that logs every consent change event: opt-ins, opt-outs, and updates from any source. Unlike the Communication Subscription Consent DMO, this DLO is not mapped to a DMO and is not used by MCA at send time. It is an append-only log, useful for compliance audits and debugging consent history, but it plays no role in enforcement.

<Screenshot src="/img/consent-fundamentals/04-consent-audit-trail-dlo.png" alt="ConsentAuditTrailV2 Data Lake Object detail page showing Category Other, Total Records 0, and Fields mapped 0/0 in the Data Mapping section" caption="The ConsentAuditTrailV2 DLO in Data 360. Note that it is a Data Lake Object, not a Data Model Object, and has 0 fields mapped. It logs consent changes but plays no role in send-time enforcement. Your org's DLO name will include your org ID." />

## The 90-Day Consent Cache

MCA uses a consent cache to speed up enforcement at send time. When a send occurs, the platform checks the cache, not the live DMO state. The cache has a 90-day TTL.

This creates a compliance risk that is worth understanding before you build anything. An organization might write an OPT_OUT to the Communication Subscription Consent DMO directly (via a data transform, for example), see the DMO update, and believe the contact is suppressed. But if the cache still shows OPT_IN from 3 months ago, sends will continue to go through. Conversely, a contact might opt in via a data stream write, the DMO shows OPT_IN, but the cache was never updated, and sends are still blocked.

**Cache refresh triggers (methods that DO update the cache):**
- Manual updates via the Privacy Consent Status component on Lead/Contact record layouts
- Unsubscribe link clicks in emails
- Preference Center interactions
- CSV consent imports via the Consent tab
- The native `MessagingConsent.MessagingConsent` Flow action (the official "Create Consent" activity)

**What does NOT refresh the cache:**
- Direct writes to the Communication Subscription Consent DMO via data streams
- Batch data transforms
- Any external write that bypasses the transactional consent service

:::caution
Writing consent records directly to the Communication Subscription Consent DMO via a data stream or data transform appears to succeed. The records show up in the DMO. MCA still ignores them at send time. This is a platform-enforced constraint, not a configuration issue. The enforcement layer only trusts the consent cache, and the cache is only updated by the five valid methods listed above. If you use any other method, your consent data is decorative, not functional.
:::

This is, per multiple community sources including [The Agentic Marketer's consent deep dive](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/consent-management/) and [modrzejewski.it's consent sync documentation](https://modrzejewski.it/blog/how-to-keep-consent-in-sync-between-salesforce-data-360-and-marketing-cloud-next/), the most compliance-critical gotcha in MCA consent. Build your consent flow using the valid methods from the start.

## Valid Methods for Creating Consent Records

There are exactly five ways to create or update consent records that MCA will actually honor:

1. **Privacy Consent Status component:** A Lightning component added to Lead and Contact record pages via App Builder. Shows all subscriptions and their current status for the contact's email address. Admins can manually set OPT_IN or OPT_OUT per subscription. Updates the cache.

2. **Preference Center:** The built-in hosted preference page. When a contact opts in or out, MCA writes to the Communication Subscription Consent DMO and refreshes the cache. Added to emails via a merge field in the email builder.

3. **CSV Import:** Bulk consent import via **Marketing Cloud App > Consent > Consent Imports**. Each import file maps to a single channel, a single subscription, and a single consent status. Contact points must already exist. The import does not create new Leads or Contacts. Cache is updated.

4. **Create Consent Request Flow Element:** The recommended method for automated consent creation. A native Flow element (not a custom apex or API call) that writes consent and refreshes the cache. This is what <ModuleLink slug="consent-configuration" /> builds.

5. **Unsubscribe link clicks:** When a subscriber clicks the unsubscribe link in an email, MCA writes OPT_OUT to the DMO and refreshes the cache.

## The Party Field Gotcha

This is the most architecturally confusing aspect of MCA consent. The Communication Subscription Consent DMO has a `Party` field intended to link to the Individual DMO via `Individual ID`. When a person opts in or out, MCA does not populate this field.

<Screenshot src="/img/consent-fundamentals/03-comm-sub-consent-relationships.png" alt="Relationships tab on the Communication Subscription Consent DMO showing two relationships: one to Communication Subscription and one to Individual via the Party field with KQ_PartyId" caption="The Relationships tab shows the Party field relationship to Individual exists in the schema. MCA does not populate the Party field value, so this relationship returns no results." />

The built-in relationship between the Communication Subscription Consent DMO and the Individual DMO does not work. This is confirmed platform behavior as of Summer '26, not a misconfiguration.

**The workaround:** Relate the Communication Subscription Consent DMO to Contact Point Email using the `Contact Point Value` field on the Communication Subscription Consent record matched against the `Email Address` field on Contact Point Email.

:::warning
If you do not build this relationship in the Data Graph, consent status is invisible to your segments and Handlebars personalization expressions. You cannot filter a segment by consent status. You cannot show a customer's consent preference in an email. Build the Contact Point Email to Communication Subscription Consent relationship via email match, not via the Party field.
:::

<ModuleLink slug="data-graphs" /> covers Data Graph configuration in detail. This is where that relationship gets built. For now, understand why the Party field does not work and what the workaround is.

:::tip[Coming from MCE?]
In MCE, there was no equivalent to this architectural issue. Subscriber records were self-contained. In MCA, the consent record and the individual record are separate DMOs that should join via Party ID but do not. This is a known platform gap, not a design choice you made wrong.
:::

## The Preference Center

MCA includes a built-in hosted preference center. Customers access it via a link in an email. The preference center shows only the subscriptions that have been added to the preference page. Subscriptions not added to the page are not visible to the customer, which means customers cannot opt in or out of them from the preference center.

When a customer makes a change in the preference center, MCA writes OPT_IN or OPT_OUT to the Communication Subscription Consent DMO and refreshes the cache. There is typically a 5 to 10 minute delay before the DMO reflects the update.

:::warning
Deleting a Communication Subscription permanently and irrecoverably deletes all related Communication Subscription Consent records. This is not reversible. There is no soft-delete or archive state that preserves consent history. Before removing a subscription, remove it from all Preference Pages first, then retire it rather than deleting it if you need to preserve historical consent data.
:::

How to configure which subscriptions appear on the preference page and how to insert the preference center link in emails is covered in the Consent Configuration module.

## Double Opt-In

Double opt-in (DOI) is not a native platform feature in MCA. There is no toggle to enable it on a Communication Subscription. It must be built as a custom Flow.

The recommended approach uses a Wait Until Event element to listen for the confirmation link click directly in the flow, rather than querying the Email Engagement DMO after a fixed wait period:

1. A signup form or CRM trigger fires the flow.
2. The flow sends a confirmation email via a transactional send. No marketing consent is required to send it because it is transactional.
3. The flow reaches a **Wait Until Event** element configured to listen for a click on the DOI link in that confirmation email.
4. A timeout path is configured on the Wait Until Event element (for example, 48 hours).
5. If the link is clicked within the timeout window: the flow takes the click path and executes the Create Consent Request Flow element to set OPT_IN.
6. If the timeout expires without a click: the flow takes the timeout path and ends without creating consent. The email address remains opted out.

One important constraint: MCA's consent values are binary. OPT_IN or OPT_OUT. There is no "PENDING" consent status in the Communication Subscription Consent DMO. During the DOI window, before the confirmation link is clicked, the email address simply has no consent record, which means it is blocked from marketing sends.

For a full walkthrough of this flow pattern including element configuration, see [The Agentic Marketer's DOI implementation guide](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/double-opt-in-flow/).

DOI is legally required in Germany. It is strongly recommended in Austria, Switzerland, and several other European jurisdictions. GDPR requires demonstrable consent but does not mandate DOI specifically. CASL (Canada) requires express consent and a timestamp. MCA's Consent Date field on the Communication Subscription Consent DMO supports this requirement.

:::tip[Coming from MCE?]
MCE had a native double opt-in toggle on subscriber lists. MCE would send the confirmation email automatically when the toggle was enabled. In MCA, you design the entire confirmation flow yourself using Flow Builder. The flexibility is greater, but so is the implementation effort.
:::

## Legal Compliance Context

MCA's consent architecture positions you to meet the requirements of the three most common email marketing laws. Understanding where each law sits helps you advise clients on how strict their opt-in requirements need to be.

**CAN-SPAM (US):** Does not require prior consent. Allows opt-out model. MCA's mandatory opt-in is actually stricter than what US law requires.

**GDPR (EU):** Requires a lawful basis for marketing. For email, that is typically explicit consent. MCA's OPT_IN model plus the Consent Date field on each record gives you the timestamp evidence GDPR compliance requires.

**CASL (Canada):** Among the strictest globally. Requires express consent before sending commercial electronic messages. Penalties up to $10M CAD. MCA's explicit opt-in with timestamps aligns with CASL requirements.

Practical guidance for multi-jurisdiction senders: follow the strictest applicable standard. MCA itself does not tag consent records with jurisdiction or legal basis. If a client operates under multiple frameworks, that differentiation needs to live in a custom field on the consent record or on the Contact in the CRM.

## V1/V2 DMO Migration (Older Orgs)

If you are working in an org provisioned before Summer '25, you may encounter two versions of the consent data source object:

- Old: `MessagingConsent-MessagingConsent` DSO
- New: `MessagingConsentV2-MessagingConsent` DSO

Both may exist in the same Data 360. The system uses V2 for all new writes. If you see duplicate consent records while debugging, this is likely the cause. LEOptical's SDO is provisioned fresh, so this will not be an issue for this engagement. It is worth knowing for client orgs that have been running MCA for a while.

## LEOptical's Four Communication Subscriptions

LEOptical needs four Communication Subscriptions. Three are marketing subscriptions that require consent. One is transactional and does not.

| Subscription | Type | Consent Required | Preference Center |
|---|---|---|---|
| Promotional Offers | Marketing | Yes | Yes |
| VisionCare Rewards Updates | Marketing | Yes | Yes |
| Eye Health Reminders | Marketing | Yes | Yes |

Post-purchase confirmation emails, shipping notifications, and order-related sends are transactional. MCA does not check consent for transactional messages by default, so those sends can reach customers who have never opted into any marketing subscription.

:::warning
Even transactional emails display the List-Unsubscribe header that email clients (Gmail, Apple Mail) render as a one-click unsubscribe button. This happens at the email client's discretion, not MCA's. A customer who clicks that button on an Order Updates email may end up with a consent change in your system depending on how your preference center is configured. Test this behavior before go-live.
:::

## Assignment

> **The client wants:** LEOptical plans to communicate with customers via email. Before any flow is built, they need a consent strategy document that explains what consent is being captured, where it comes from, how it is enforced, and what the implementation team needs to know about the platform's quirks.

1. Read the [Consent Management in Marketing Cloud Next deep dive on The Agentic Marketer](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/consent-management/). Pay particular attention to the DMO structure section and the cache behavior section.

2. Read the [How to Keep Consent in Sync Between Salesforce, Data 360, and Marketing Cloud Next article on modrzejewski.it](https://modrzejewski.it/blog/how-to-keep-consent-in-sync-between-salesforce-data-360-and-marketing-cloud-next/). This article documents why direct DMO writes do not work and how the valid consent sync architecture is structured.

3. Complete the [Understand Consent Management for Effective Marketing Trailhead module](https://trailhead.salesforce.com/content/learn/modules/consent-management-fundamentals-for-marketing-cloud-next/get-started-with-consent-management). This is approximately 30 minutes and covers the consent model from the official platform perspective.

4. Draw a relationship diagram of the five consent components: Contact Point, Communication Subscription, Engagement Channel Type, Communication Subscription Channel Type, and Communication Subscription Consent. Show how they connect to each other. Show where the Party field sits and why it does not work. Show the Contact Point Email workaround relationship. A whiteboard photo, a diagram in any tool, or a structured text description are all acceptable formats.

5. Write a consent strategy document for LEOptical covering the following:
   - What consent is captured (list the four Communication Subscriptions and their types)
   - How consent is collected (the valid methods you will use and why direct DMO writes are excluded)
   - How consent is enforced at send time (including the cache)
   - The Party field gotcha and the workaround used in the Data Graph
   - The distinction between the Promotional Offers, VisionCare Rewards Updates, Eye Health Reminders subscriptions (marketing) and the Order Updates subscription (transactional)

6. **(Stretch)** Read the [How to Build a Double Opt-In Consent Flow guide on The Agentic Marketer](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/double-opt-in-flow/). Sketch the DOI Flow architecture for a hypothetical LEOptical newsletter signup page. Identify which step creates the consent record and what happens if the confirmation link is never clicked.

## Success Criteria

- [ ] You can name all five consent components and explain what each one does.
- [ ] Your relationship diagram includes the Party field issue and shows the Contact Point Email workaround as the actual join path.
- [ ] Your consent strategy document identifies all four LEOptical Communication Subscriptions and correctly labels Order Updates as transactional.
- [ ] Your consent strategy document explains the 90-day consent cache and lists the valid consent creation methods.
- [ ] You can explain what happens when a send is blocked for consent reasons (contact appears as not sent with an opt-in reason, no delivery error, no bounce).
- [ ] You can explain why writing directly to the Communication Subscription Consent DMO via a data transform does not work.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between an opt-in model and an opt-out model, and which one does MCA use?
- A customer has two email addresses on their Contact record. They opt into Promotional Offers from their personal email. Can MCA send Promotional Offers to their work email?
- What is the Party field on the Communication Subscription Consent DMO, and why does the built-in relationship it creates not work in MCA?
- A developer writes OPT_IN consent records directly into the Communication Subscription Consent DMO via a data transform. The records appear in the DMO. Why might sends still not go through?
- LEOptical wants to send an order confirmation email to a customer who has never opted into any marketing subscription. Is this possible under MCA's default configuration? Why?
- A Unified Individual globally unsubscribes from all emails. Three months later, LEOptical adds a new "Lens Care Tips" Communication Subscription. Is the customer automatically opted out of this new subscription?
- How does MCA's consent model affect how you would approach migrating LEOptical's existing email list from their old batch-and-blast ESP?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [How to Manage Consent in Marketing Cloud Next (arthurbackouche.com)](https://arthurbackouche.com/docs/marketing-cloud-next/consent-management/how-to-manage-consent-in-marketing-cloud-next/): Detailed implementation guide covering the Communication Subscription Consent ID composite key format, the MessagingConsent Flow action field reference, and step-by-step automated flow configuration.

- [Understanding Consent Management in Marketing Cloud Next (Mavlers)](https://www.mavlers.com/blog/marketing-cloud-next-consent-management/): Practical walkthrough of the five consent components, UI navigation paths, the consent cache, and critical gotchas including the subscription deletion risk.

- [Surfacing Subscription Consents on Person Accounts (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/subscription-consents-person-accounts/): Documents the Party field issue and the Contact Point Value workaround in detail. Relevant if you move to a Person Account data model.

- [What Salesforce Isn't Telling You About MC Next Consent Convergence (Robin Leonard)](https://robinleonard.co/blog/mc-next-consent-convergence/): Covers the complexity of running MCE and MCA in parallel during migration. Honest about what the platform does not handle automatically.
