---
sidebar_position: 3
title: "Landing Page Domain"
description: "Configure a branded subdomain for MCA-hosted landing pages using the Salesforce CDN option."
---

## Overview

MCA landing pages default to a Salesforce CDN URL. Replacing it with a branded subdomain (e.g., `pages.leoptical.com`) makes your landing page URLs look like they belong to LEOptical rather than Salesforce.

The good news: this is the easier of the two optional domain configurations. The Salesforce CDN option handles SSL for free through Cloudflare. You add two DNS records, configure the domain in Setup, and you are done.

## How It Works

When you choose the CDN hosting option in Setup, Salesforce uses Cloudflare as the CDN partner (source: SFMC Tips #171). Cloudflare provides a shared SSL certificate, so your custom domain gets HTTPS without you managing certificates separately. This is the recommended path.

The DNS records use your org's 15-digit org ID as part of the CNAME target. MCA provides the exact values in the setup UI when you configure the domain.

:::warning
Your DNS provider must support ANAME or ALIAS records, or CNAME flattening, if you want to use a root domain (e.g., `leoptical.com`) as the landing page domain. Standard CNAME records cannot be placed at a zone apex. For a subdomain (e.g., `pages.leoptical.com`), standard CNAMEs work fine. Use a subdomain.
:::

The landing page domain must be a different subdomain from your tracking/link branding domain. You cannot use the same subdomain for both.

## Setup Walkthrough

SFMC Tips #171, ["Setting Domains for Landing Pages"](https://medium.com/@marketingcloudtips/marketing-cloud-next-landing-page-domain-settings-6367a4c1e663), covers this configuration with screenshots. Follow it as your primary reference. The steps below provide the structure.

{/* VERIFY: Confirm the exact Setup navigation path for landing page domain configuration. Research cites "Setup > Domain Settings > Add a Domain" but this path was not confirmed against a live SDO. SFMC Tips #171 covers this but was not directly fetchable (403). */}

1. Navigate to **Setup > Domain Settings**.
2. Click **Add a Domain**.
3. Enter your subdomain (e.g., `pages.leoptical.com`).
4. Select **Serve the domain with the Salesforce Content Delivery Network (CDN)**. This enables the free Cloudflare SSL option.

<Screenshot src="/img/domain-setup/03-landing-page-domain-cdn-option.png" alt="Domain Edit screen in Salesforce Setup showing the CDN hosting option selected for a landing page subdomain" />

5. MCA displays two CNAME records using your org's ID. Copy them.
6. Add both records at your registrar:
   - `pages.[yourdomain].com` pointing to `pages.[yourdomain].com.[orgId].live.siteforce.com`
   - `_acme-challenge.pages.[yourdomain].com` (for SSL certificate validation)
7. Return to Setup and save the configuration.

After adding the records, propagation follows the same timing as the sending domain (up to 72 hours, source: SFMC Tips #171).

## Assignment

> **The client wants:** LEOptical's landing pages should serve from a branded URL, not a Salesforce CDN address.

1. Configure a landing page domain in your SDO using a subdomain different from your authenticated sending domain (e.g., `pages.[yourdomain].com`).
2. Select the CDN hosting option.
3. Add the two required CNAME records at your registrar.
4. Document the records in your IT handoff document alongside the sending domain records from the previous step.

## Success Criteria

- [ ] A landing page domain is configured in MCA Domain Settings using the CDN option.
- [ ] Both CNAME records for the landing page domain have been added at the registrar.
- [ ] The landing page subdomain is different from the authenticated sending domain and the link branding domain.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- The landing page domain uses the Salesforce CDN option. What does that mean for SSL certificate management, compared to the link branding domain?
- Why can't you use a root domain (e.g., `leoptical.com`) with a standard CNAME record for the landing page domain?
- What is the `_acme-challenge` CNAME record for?
