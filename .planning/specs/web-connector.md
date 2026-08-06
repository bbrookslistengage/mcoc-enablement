# LEOptical — Interactions SDK & Web Connector

## Overview

Data 360's web connector captures behavioral data from websites via the Interactions SDK (JavaScript beacon). Each learner deploys a simple LEOptical site and connects it to their Data 360 org.

## Netlify Site

**What we provide:** A downloadable zip file containing 2-3 static HTML pages with LEOptical branding:

- `index.html` — Homepage
- `products.html` — Product listing (4-6 eyewear products)
- `contact.html` (or `appointment.html`) — Contact form with name + email + submit

The beacon/SDK JavaScript is pre-written in the HTML with a placeholder where learners paste their connector-specific configuration value. Learners do not write JavaScript from scratch.

**Deployment:** Learners download the zip, paste their beacon config, and drag-and-drop the folder into Netlify's free tier deploy UI. No git, no build tools, no CLI required.

## Out-of-the-Box Events

The beacon automatically captures these without custom code:

- **PageView** — page URL, title, referrer (automatic on every page load)
- **WebSession** — session-level data
- **Device** — anonymous profile with cookie-based device ID

**Stretch goals (optional):** Learners can add custom behavioral events (e.g., `ProductView`, `BookAppointment`) using `SalesforceInteractions.sendEvent()`. This is not required.

## Cookie Consent

Salesforce provides an OOTB consent banner that can be enabled in the web connector configuration. Learners enable this as part of the web connector setup.

## Identity Events — Open Technical Problem

The identity event is how an anonymous Device gets linked to a known Individual. When a visitor's email is captured and passed to the SDK via an identity event, Data 360 can match it to existing CRM data through IDR.

**The challenge:** Embedded Salesforce forms (LWC) do not expose form field values on submit in a way that allows intercepting the email address to pass to the Interactions SDK's identity event call. Once the form submits, the LWC component unmounts and the email value is no longer accessible.

**Approaches to explore:**

1. **Plain HTML form** — Since we own the Netlify page entirely, use a simple HTML form (not an embedded LWC) that captures the email value via JavaScript and calls the SDK's identity method on submit. This is the most straightforward approach since we control the full page.
2. **URL parameter from MCA email click-through** — When learners send emails from MCA, links in the email could append a parameter (e.g., `?uid={contactId}`) to the Netlify URL. Page JavaScript reads the parameter and fires the identity event. This ties the web connector story to the email sending story in a realistic way. Note: using plaintext email in URL parameters has security concerns (leaks via referrer headers, browser history, logs). A hashed or ID-based approach would be more appropriate.
3. **Hybrid** — Combine both approaches.

> **Status:** This is parked for now. The identity capture mechanism needs further investigation before the web connector module content is written.

## Identity Resolution (IDR) Rules

The web connector module works in tandem with the IDR module. Learners configure:

- **Match rule:** Contact Point Email from web (identity event) exact-matches Contact Point Email from CRM seed data -> links Device to Individual
- **Reconciliation rule:** CRM-sourced data takes precedence over web-sourced data for profile fields

This is a **guided walkthrough** — learners follow steps to configure the rules and understand what they do, rather than designing rules from scratch.

## Anonymous-to-Known Flow

The end-to-end flow learners should understand (and ideally observe in real time):

1. Learner deploys site to Netlify and browses it
2. Beacon creates an anonymous **Device** record (cookie-based ID)
3. **PageView** events are logged against that Device
4. Visitor identity is captured (mechanism TBD — see above) with an email that exists in CRM seed data
5. Identity event fires, creating a **Contact Point Email** linked to the Device
6. IDR runs (near real-time or batch) -> matches web Contact Point Email to CRM Contact Point Email
7. Device is linked to the existing **Individual**
8. All prior anonymous PageView events are now attributed to that known person

## Downstream Value

Once web behavioral data flows and is linked to known Individuals:

- **Segments** can include web behavior criteria (e.g., "visited products page in last 7 days")
- **Calculated Insights** can aggregate page views per Individual
- **Data Graphs** (rooted on Unified Individual) automatically include web data
- **Flows** could potentially trigger on web events (stretch)
