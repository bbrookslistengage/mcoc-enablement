---
sidebar_position: 1
title: "Domain Setup"
description: "Configure email sending domain authentication, link branding, and landing page domains so LEOptical's emails come from a branded address."
---

## Overview

Before LEOptical can send a single email from MCA, you need to configure domain authentication. This is not a "nice to have." MCA Growth and Advanced editions require a DKIM-authenticated domain as the sender address. There is no default sending domain in an SDO. If you skip this, email sending is blocked.

This module covers three distinct domain configurations: the authenticated sending domain (what appears in the `From:` address), the link branding domain (what click-tracking URLs look like), and the landing page domain (what URL your MCA landing pages serve from). Each one is a separate subdomain with its own DNS records and its own setup path. They can all live on the same root domain, but they cannot share a subdomain.

If you are coming from MCE, the most important thing to know upfront is that MCA has no SAP. What SAP bundled together in MCE (authenticated domain, link branding, RMM) is now configured individually through a self-service Setup UI. No procurement step. No Salesforce support ticket. You do it yourself.

The DNS propagation window is real. After you add records and activate your domain, status goes to "Pending" and stays there for up to 72 hours. Plan your time accordingly. Do the domain setup first thing, then work through the conceptual sections while you wait.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Why MCA requires domain authentication before any email can send.
- The three domain roles in MCA and how they differ from each other.
- How to configure an authenticated sending domain, including the DNS records IT needs to create.
- What DMARC is, why MCA does not configure it for you, and how to add it yourself.
- How to set up a From Address after domain activation.
- How to configure a landing page domain using Salesforce's CDN.
- How to configure a link branding domain and what the SSL certificate requirement means in practice.
- How MCA's domain setup compares to MCE's Sender Authentication Package (SAP).

## Why Domain Setup Comes Before Everything Else

MCA enforces DKIM authentication at send time. You cannot use an unverified domain as the sender address (source: cgc-agency.com, SFMC Tips #304). This applies to both the Growth and Advanced editions. The SDO does not ship with a pre-configured sending domain, so there is nothing to inherit.

The practical consequence: every module in this course that involves email sending depends on this configuration being done first. Get this right now, and the rest of the course flows normally. Skip it, and you will hit a wall when you build your first campaign.

:::warning
SDOs do not have a default email sending domain. You must configure domain authentication with a domain you own before any email can be sent. (Confirmed: 2026-08-06, Summer '26)
:::

For the SDO, you will use a domain you own. The cheapest option is to register a throwaway domain on a registrar like Porkbun, which offers domains for roughly $1-2 per year. You do not need to host anything on this domain. You only need to control its DNS records.

## The Three Domains You Need to Think About

MCA uses three separate domains for three separate purposes. They are not interchangeable. Each one is a different subdomain pointing at different Salesforce infrastructure.

| Domain Role | What It Does | Example Subdomain | SSL Handling |
|---|---|---|---|
| Authenticated sending domain | The `From:` address domain. Establishes DKIM/SPF auth. | `e.leoptical.com` | Not applicable |
| Link branding domain | Wraps click-tracking URLs inside emails. | `links.leoptical.com` | CA-signed cert required (you manage it) |
| Landing page domain | Serves MCA-hosted landing pages. | `pages.leoptical.com` | Free via Salesforce CDN (Cloudflare) |

All three can live on the same root domain (`leoptical.com`), but the subdomains must be distinct. You cannot use `links.leoptical.com` for both tracking links and landing pages.

The authenticated sending domain is the most critical. Configure it first. The other two can follow once email sending is unblocked.

:::tip[Coming from MCE?]
In MCE, all three of these capabilities came bundled in the Sender Authentication Package (SAP): a private domain for DKIM/SPF authentication, account branding for link wrapping, and Reply Mail Management. SAP required a purchase and a Salesforce support ticket to provision.

In MCA:
- Domain authentication is self-service in Setup. No purchase, no ticket.
- Link branding is configured separately (and still requires a CA-signed SSL certificate you manage).
- RMM is available in Unified Messaging, configured as part of the From Address setup.
- Subdomain delegation (handing nameserver control to Salesforce) is **not** supported in MCA Growth or Advanced. It was available in legacy MCE. Your IT team must add each DNS record manually at the registrar.
- DKIM keys are 2048-bit by default in MCA. MCE defaulted to 1024-bit.
:::

## What to Do Next

Work through the three setup pages in order. Each one is a separate subdocument with its own walkthrough, assignment, and success criteria.

1. [Authenticated Sending Domain](./authenticated-domain): configure DKIM/SPF, get the DNS records, activate the domain, set up your From Address.
2. [Landing Page Domain](./landing-page-domain): configure a branded subdomain for MCA-hosted landing pages using the free Salesforce CDN option.
3. [Link Branding Domain](./link-branding): configure click-tracking URLs to use a branded subdomain, including the SSL certificate requirement.
