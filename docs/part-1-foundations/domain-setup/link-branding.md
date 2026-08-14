---
sidebar_position: 4
title: "Link Branding Domain"
description: "Configure a branded subdomain for click-tracking URLs in Marketing Cloud Next emails, including the SSL certificate requirement."
---

## Overview

Every link in a Marketing Cloud Next email is rewritten through a click-tracking URL. By default, that URL looks like `xxxxx.tracking.e360.salesforce.com/click/[trackingcode]`. Configuring a link branding domain replaces the Salesforce domain with your own subdomain, so tracked links in LEOptical emails look like `links.leoptical.com/click/[trackingcode]` instead.

Branded tracking links matter for two reasons. Some spam filters penalize messages with third-party tracking domains. And DMARC alignment is easier to maintain when your tracking domain shares a parent domain with your sending domain.

This is the most operationally demanding of the three domain configurations, because it requires a CA-signed SSL certificate that you create and maintain yourself.

## The SSL Certificate Requirement

Unlike the landing page domain (which uses Salesforce's free CDN/Cloudflare SSL), the link branding domain requires you to create and upload a CA-signed SSL certificate in Salesforce.

:::warning
Free CA certificates (from providers like Let's Encrypt or ZeroSSL) expire every 90 days. Salesforce sends reminder emails 10 days and 1 day before expiration, but does not auto-renew. If the certificate expires, click-tracking breaks for all emails using this domain. (Source: SFMC Tips #172)

This is an ongoing IT coordination commitment. Factor it into your implementation handoff plan.
:::

Only one tracking domain is allowed per org (source: SFMC Tips #172). You cannot configure separate tracking domains for different campaigns or brands within the same Marketing Cloud Next org.

## Setup Walkthrough

SFMC Tips #172, ["Setting Domains for Email Tracking Links"](https://medium.com/@marketingcloudtips/marketing-cloud-next-setting-domains-for-email-tracking-links-1195027cb56d), covers this configuration with screenshots. Follow it as your primary reference for the full setup. The steps below provide the structure.

### Step 1: Create the SSL Certificate

1. Navigate to **Setup > Certificate and Key Management**.
2. Click **Create CA-Signed Certificate**.
3. Fill in the certificate details (common name should be your tracking subdomain, e.g., `links.leoptical.com`).
4. Download the CSR (Certificate Signing Request) file.
5. Submit the CSR to a Certificate Authority. Free options like ZeroSSL or Let's Encrypt work. Note that these certificates are valid for 90 days.
6. Once the CA returns the signed certificate, upload it back to Salesforce in **Certificate and Key Management**.

### Step 2: Configure the Tracking Domain

{/* VERIFY: Confirm exact Setup navigation path for link branding/tracking domain configuration. Research notes the path is under "Domain Settings" but the exact path was not confirmed from primary documentation. SFMC Tips #172 covers this but was not directly fetchable (403). */}

1. Navigate to **Setup > Domain Settings** (path needs verification in a live SDO).
2. Add a new domain and select the tracking/link branding domain option.
3. Enter your subdomain (e.g., `links.leoptical.com`).
4. Select the certificate you uploaded in Step 1.
5. Marketing Cloud Next provides a CNAME value to point your subdomain at.
6. Add the CNAME record at your registrar.

### Certificate Renewal

Set a calendar reminder at 60 days to renew the certificate before the 90-day expiry. The renewal process repeats Steps 1 and 2 above. When you hand off this implementation to the client, document the renewal cadence clearly. It is easy to forget until click-tracking suddenly breaks.

## Assignment

> **The client wants:** Click-tracking links in LEOptical emails should use a branded domain, not a Salesforce domain.

1. Read SFMC Tips #172, ["Setting Domains for Email Tracking Links"](https://medium.com/@marketingcloudtips/marketing-cloud-next-setting-domains-for-email-tracking-links-1195027cb56d), before starting. It covers the full setup flow with screenshots.
2. Create a CA-signed certificate in **Setup > Certificate and Key Management**. Use a subdomain different from your sending and landing page domains (e.g., `links.[yourdomain].com`).
3. Submit the CSR to a free Certificate Authority and upload the returned certificate back to Salesforce.
4. Configure the link branding domain in Setup, pointing it at the CNAME value Marketing Cloud Next provides.
5. Add the CNAME record at your registrar.
6. Write a maintenance note for LEOptical's IT team documenting the 90-day certificate renewal process. Include: what happens if the cert expires, how to renew it, and where the reminder emails come from.

This is a stretch task relative to the other two domain configurations. It requires more IT coordination and has ongoing maintenance. If your SDO setup is blocked on certificate availability, document the steps and skip to the next module.

## Success Criteria

- [ ] A CA-signed SSL certificate for the link branding subdomain has been created in **Setup > Certificate and Key Management**.
- [ ] The link branding domain is configured in Domain Settings with the certificate attached.
- [ ] The CNAME record for the link branding domain has been added at the registrar.
- [ ] A maintenance note documenting the 90-day certificate renewal process has been written.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- Why does the link branding domain require a CA-signed certificate, while the landing page domain does not?
- What happens to click-tracking in existing emails if the SSL certificate on the link branding domain expires?
- Only one link branding domain is allowed per Marketing Cloud Next org. What are the implications of this constraint for a client that has multiple brands?
- How would you explain the 90-day certificate renewal requirement to a client's IT team that has never managed Salesforce domain configuration before?
