---
sidebar_position: 2
title: "Authenticated Sending Domain"
description: "Configure DKIM/SPF authentication for LEOptical's email sending domain and set up From Addresses in Unified Messaging."
---

## Overview

This page covers the authenticated sending domain setup: the subdomain that appears in your emails' `From:` address and that proves to receiving mail servers that MCA is authorized to send on behalf of your domain.

This is the prerequisite for everything else. No authenticated domain means no email. Do this first.

## Before You Start

Decide on your subdomain. Salesforce recommends using a subdomain rather than the root domain (source: arthurbackouche.com). A subdomain like `e.leoptical.com` isolates your email sending reputation from your website traffic. If your website has a deliverability problem, your email sending is unaffected.

For this course, pick a subdomain on the throwaway domain you registered. Something like `e.[yourdomain].com` works fine.

## If Authenticated Domains Does Not Appear in Setup

In some orgs, the **Authenticated Domains** page is missing from Setup entirely. This happens when the org has not yet been migrated from the legacy Organization-Wide Email Address infrastructure to the new Unified Messaging email sending architecture.

:::warning
This migration step is a troubleshooting fallback, not a standard setup step. Only do this if **Authenticated Domains** is missing from Setup. If the page is already there, skip this entirely.
:::

The migration path, as documented by The Agentic Marketer in ["Fix 'Authenticated Domains' Setup Not Enabled in Marketing Cloud Next"](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/authenticated-domains-not-enabled/), is:

1. In Setup, use Quick Find to search for "Migration."
2. Navigate to **Unified Messaging > Email > Migration**.
3. Click **Transfer**.
4. Any running campaigns must be paused or completed before the migration can proceed.
5. Wait up to 24 hours. The **Authenticated Domains** page will appear after the migration completes.

After completing the migration (or if the page was already there), continue with the main setup flow below.

## Adding Your Sending Domain

The walkthrough on [arthurbackouche.com](https://arthurbackouche.com/docs/marketing-cloud-next/email-channel-configuration/how-to-setup-the-domain-authentication-in-marketing-cloud-next/) and The Agentic Marketer's ["From Zero to First Email"](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/first-email/) both cover this flow with screenshots. Follow one of them as your primary reference. The steps below provide the structure and flag the LEOptical-specific details.

{/* VERIFY: Research file lists two navigation paths for Authenticated Domains: "Setup > Quick Find 'Authenticated' > Authenticated Domains" and "Setup > Unified Messaging > Email > Authenticated Domains" (arthurbackouche). Confirm the exact path in a live SDO. */}

1. Navigate to **Setup > Unified Messaging > Authenticated Domains** (or use Quick Find and search "Authenticated").
2. Click **+ Add Domain**.
3. Enter your subdomain (e.g., `e.leoptical.com`). Click **Submit**.
4. Create a From Address for the domain. Use a recognizable address like `marketing@e.leoptical.com`. This address appears in the `From:` field of every email sent from this domain.
5. Click **Manual DNS Record Information** to view the DNS records MCA has generated for your domain.
6. Add all DNS records at your registrar. See the next section for what these records are and what each one does.

<Screenshot src="/img/domain-setup/02-manual-dns-records.png" alt="Manual DNS Record Information panel showing the generated CNAME records for the authenticated sending domain" />

7. Return to Setup, check the box confirming your DNS changes are complete, and enable **Activate my Domain**.
8. Optionally enter an email address to receive an activation notification.
9. Domain status changes to **Pending**. Activation can take up to 72 hours (source: arthurbackouche.com, The Agentic Marketer "First Email").

:::warning
DNS propagation takes time. After you check the activation box and submit, the status shows "Pending." This is expected. Do not re-submit. Wait up to 72 hours before assuming something is wrong.
:::

You cannot use the From Address until the domain status changes from **Pending** to **Active**. Salesforce sends an email notification when activation completes.

## DNS Records: What to Hand to IT

Understanding what MCA generates lets you write a proper DNS handoff document for LEOptical's IT team. This is a real deliverable on real engagements.

MCA generates approximately 8 CNAME records for an authenticated sending domain (source: arthurbackouche.com, SFMC Tips #140). All of them are CNAME records. There is no separate SPF TXT record.

:::warning
SPF in MCA is handled through the bounce CNAME chain, not a separate TXT record. Do not add a standalone SPF TXT record to your DNS. If you add both an SPF TXT record and the CNAME chain, you risk an SPF conflict that can break deliverability. (Source: multiple Salesforce Help article summaries)
:::

{/* VERIFY: Confirm this is current MCA behavior and not MCE behavior being described. The SPF-via-CNAME mechanism was referenced in search result summaries but not confirmed against a live SDO. */}

Here is what the records do:

| Record Subdomain | Purpose |
|---|---|
| `[subdomain]` (3 CNAME records) | DKIM authentication. 2048-bit keys that prove MCA is authorized to sign email on behalf of your domain. |
| `bounce.[subdomain]` | Bounce handling and SPF. Return-path for bounced messages, and the CNAME chain that establishes SPF authorization. |
| `reply.[subdomain]` | Inbound reply handling. Used by Reply Mail Management (RMM) to process replies to marketing emails. |
| `fbl.[subdomain]` | Feedback loop. Receives spam complaint signals from ISPs. |
| `anonymous.[subdomain]` | Infrastructure routing. |
| `leave.[subdomain]` | Unsubscribe processing. |

{/* VERIFY: Confirm exact CNAME record names and count against a live SDO. Research cites ~8 CNAMEs from arthurbackouche.com and SFMC Tips #140, but exact subdomain prefixes were not confirmed from primary Salesforce documentation. */}

The Salesforce Help article [Authenticating Marketing Cloud Next Emails](https://help.salesforce.com/s/articleView?id=004576430&language=en_US&type=1) is the canonical reference for these records. Read it directly in your browser. The page is JavaScript-rendered and cannot be fetched programmatically.

### What Your IT Handoff Document Should Include

When you deliver DNS instructions to a client's IT team, include:

- The exact record type (all CNAME in this case)
- The exact host/name value for each record (the subdomain prefix)
- The exact value each record should point to (Salesforce provides these in the UI)
- The TTL recommendation. Lower TTL speeds up propagation. 300 seconds is a reasonable starting point.
- A note that SPF is handled by the CNAME chain, not a separate TXT record

Give IT the records as a table, not prose. A DNS administrator reading a paragraph of explanation is slower than one reading a table.

## DMARC: The Part MCA Does Not Configure for You

MCA handles DKIM (via the generated CNAME records) and SPF (via the bounce CNAME chain). DMARC is yours to configure.

DMARC (Domain-based Message Authentication, Reporting, and Conformance) is a TXT record you add to your root domain's DNS. It tells receiving mail servers what to do when an email fails DKIM or SPF checks. Without DMARC, you have no policy enforcement and no visibility into whether someone is spoofing your domain.

DMARC alignment requires that the domain in your `From:` address and the domain used for bounce/return-path share the same parent domain. If your From address is `marketing@e.leoptical.com` and your bounce subdomain is `bounce.e.leoptical.com`, both share the `leoptical.com` parent domain, so alignment holds.

The recommended rollout approach (source: cgc-agency.com):

1. Start with `p=none` to monitor without enforcing. This gives you reporting data without risk.
2. Once you have reviewed the reports and confirmed legitimate senders are authenticated, move to `p=quarantine`.
3. After sustained clean reporting, move to `p=reject`.

A minimal starting DMARC record looks like this:

```
_dmarc.[yourdomain].com  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@[yourdomain].com"
```

The `rua` tag is where aggregate reports get delivered. Use an inbox you actually check.

Do not skip DMARC. Inbox placement rates at major providers (Gmail, Outlook) have tightened requirements around DMARC in recent years, and `p=none` has no deliverability downside while giving you visibility.

## Adding a From Address

After your domain activates, you create From Addresses that use it. You can have multiple From Addresses on a single authenticated domain (e.g., `marketing@e.leoptical.com`, `noreply@e.leoptical.com`, `rewards@e.leoptical.com`).

{/* VERIFY: Confirm the exact navigation path for From Address setup in a live SDO. Research cites Setup > Unified Messaging > From Addresses > + Add From Addresses, but also mentions an "Authorized Email Domains" path. */}

1. Navigate to **Setup > Unified Messaging > From Addresses**.
2. Click **+ Add From Addresses**.
3. Enter the email address and display name (e.g., `marketing@e.leoptical.com`, display name "LEOptical").
4. Click **Save**.

<Screenshot src="/img/domain-setup/01-from-address-active.png" alt="Authenticated From Addresses list in Unified Messaging Setup showing a From Address with Active domain status" />

The From Address is now available to select when building emails and flows.

As of Summer '26, MCA supports dynamic From Addresses. The `From:` and Reply-To can be set from field values on Contact or Lead records (source: cgc-agency.com, SFMC Tips #304). The domain used for dynamic addresses must still be an authenticated domain. You cannot use a Gmail or Outlook address as a dynamic sender.

### Reply Mail Management (Optional)

Reply Mail Management (RMM) is configured in Unified Messaging alongside your From Address setup. It uses the `reply.[subdomain]` CNAME record that was already created during authenticated domain setup.

When enabled, RMM can be configured to:

- Discard out-of-office auto-responders
- Route genuine replies to a forwarding address you specify
- Unsubscribe contacts who reply with keywords like "unsubscribe," "opt-out," "remove," or "stop"

For LEOptical, RMM is worth enabling on the main marketing From Address. Contacts who reply asking to be removed should not require manual handling.

The Agentic Marketer's [RMM deep dive](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/replay-mail-management-rmm/) covers the full configuration. One limitation to note: RMM routes replies to a single designated forwarding address per flow. {/* VERIFY: Research file says "No dynamic sender support — you select one sender per flow," describing a sender constraint. Confirm whether this means one forwarding address per RMM flow, or one sender address per RMM configuration. Check against the Agentic Marketer RMM deep dive. */} It does not support routing to different destinations based on the sender identity.

## Assignment

> **The client wants:** LEOptical's marketing emails should come from a branded domain, not a generic Salesforce address.

Before starting, register a throwaway domain if you do not already own one you can use for testing. Porkbun is a good option at roughly $1-2 per year. You only need DNS control, not hosting.

1. Configure an authenticated sending domain in your SDO. Use a subdomain of the domain you own (e.g., `e.[yourdomain].com`). Follow the [arthurbackouche.com walkthrough](https://arthurbackouche.com/docs/marketing-cloud-next/email-channel-configuration/how-to-setup-the-domain-authentication-in-marketing-cloud-next/) or The Agentic Marketer ["First Email"](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/first-email/) walkthrough as your primary guide.
2. Add all DNS records at your registrar. Enable domain activation in MCA.
3. While waiting for DNS propagation, create a From Address using the authenticated domain (e.g., `marketing@e.[yourdomain].com`).
4. Add a DMARC TXT record to your domain's DNS with `p=none` and an `rua` reporting address.
5. Document the DNS records you added. Write out each record type, host name, and value in a table formatted as if you were handing it to LEOptical's IT team. Include a brief explanation of what each record does.

## Success Criteria

- [ ] An authenticated sending domain is configured in **Setup > Unified Messaging > Authenticated Domains** with a status of **Active** or **Pending**.
- [ ] A From Address is created using the authenticated domain and visible in **Setup > Unified Messaging > From Addresses**.
- [ ] All DNS records for the authenticated domain have been added at the registrar (DKIM CNAMEs, bounce, reply, fbl, anonymous, leave).
- [ ] A DMARC TXT record with `p=none` is present on the root domain's DNS.
- [ ] You have a written DNS record table, formatted as a client IT handoff document, covering all records required for the sending domain.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- Why does Salesforce recommend using a subdomain rather than the root domain for the authenticated sending domain?
- MCA generates approximately 8 CNAME records for an authenticated domain. What does the `bounce.[subdomain]` CNAME handle, and why does it matter for SPF?
- DMARC is not configured automatically by MCA. What does DMARC do, and what is the recommended starting policy value?
- You add a standalone SPF TXT record to your DNS alongside the MCA CNAME records. What problem could this cause?
- LEOptical's IT team has never managed DNS records for a Salesforce implementation before. What would you include in the handoff document to help them add records correctly and avoid common mistakes?
