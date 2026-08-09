---
sidebar_position: 5
title: "Consent Configuration"
description: "Configure Communication Subscriptions, set up the preference page and web tracking consent banner, and add the Privacy Consent Status component to CRM record pages."
---

## Overview

LEOptical has never had a consent management framework. Their previous ESP sent newsletters to whoever was in the list. MCA works differently. Before a marketing email can leave the platform, the recipient needs an explicit OPT_IN record for the relevant Communication Subscription. If no OPT_IN record exists, the send is blocked. The contact appears in send reporting as not sent, with a reason indicating they were not opted in.

This module is where you build the plumbing that makes consent work. You will create the Communication Subscriptions that define LEOptical's marketing categories, configure a preference page so subscribers can manage their own opt-ins, set up the web tracking consent banner for landing pages, and use CSV import to create OPT_IN records for your protagonist contacts. You will also add the Privacy Consent Status component to Lead and Contact pages so your team can see consent status at a glance without opening Data 360.

The consent automation flow is covered in a separate Project page. That page walks through the trigger mechanism and full flow architecture once the POC is validated. This module covers everything else: Communication Subscriptions, the preference page, the Privacy Consent Status component, CSV import, and the web tracking consent banner.

This module builds on the data work from Modules 2-4. The Communication Subscription Consent DMO that you write records to here connects to Contact Point Email in the Data Graph you will build in Module 8.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- How to create LEOptical's three marketing Communication Subscriptions in the MCA Consent tab.
- How to configure the default preference page so subscribers can manage their email opt-ins.
- What the web tracking consent banner is and how it differs from the email preference center.
- What the "Create Consent" flow element requires and how it differs from a standard Create Records element.
- How to add the Privacy Consent Status component to Lead and Contact record pages.
- How to use CSV import to create bulk OPT_IN records for existing contacts.

## Communication Subscriptions

LEOptical's four Communication Subscriptions are defined in the Consent Fundamentals module. This section covers how to create them in the platform. Communication Subscriptions are created and managed in the MCA Consent tab, separate from Salesforce Setup.

MCA auto-creates a default "Marketing" Communication Subscription when the org is configured. You can use it, rename it, or ignore it in favor of creating your own. For LEOptical, create the three named marketing subscriptions as your primary marketing categories. Order Updates is transactional. You will not build consent automation for it and it does not appear on the preference page.

### Create a Communication Subscription

Navigate to **Marketing Cloud App > Consent > Preference Pages and Subscriptions**. Click the **Subscriptions** tab in the left sidebar.

1. Click **+ New Subscription**.

<Screenshot src="/img/consent-configuration/08-new-subscription-dialog.png" alt="New communication subscription dialog with Subscription Name and Channels fields" caption="The New communication subscription dialog. Enter a name and select the Email channel." />

2. Enter the subscription name: `Promotional Offers`.
3. Select **Email** as the communication channel.
4. Click **Save**.
5. Repeat for `VisionCare Rewards Updates` and `Eye Health Reminders`.

After saving each subscription, MCA creates a **Communication Subscription Channel Type** record in the background. This junction record links the subscription to the email channel and is what the consent flow references when writing records.

<Screenshot src="/img/consent-configuration/01-subscription-list.png" alt="Consent Subscriptions list showing four Communication Subscriptions: Eye Health Reminders, Marketing, Promotional Offers, and VisionCare Rewards Updates, all with Email channel" caption="The Subscriptions list after creating LEOptical's three marketing subscriptions. The default Marketing subscription is also visible." />

## The default preference page

The preference page is where subscribers manage their own opt-ins. MCA provides a default hosted page out of the box. You need to add your three marketing subscriptions to it so they appear as toggles when a subscriber visits the page.

### Add subscriptions to the default preference page

Navigate to **Marketing Cloud App > Consent > Preference Pages and Subscriptions**.

1. Select the default preference page from the list.
2. Click **Edit Form**.
3. Drag the subscription component onto the form for **Promotional Offers**.
4. Drag the subscription component for **VisionCare Rewards Updates**.
5. Drag the subscription component for **Eye Health Reminders**.
6. Click **Save**.
7. Click **View Page** to verify all three subscriptions appear.

Do not add Order Updates to the preference page. Transactional communications should not be opt-in managed through a marketing preference center.

<Screenshot src="/img/consent-configuration/10-preference-page-editor.png" alt="Email Preference Page editor showing four subscription toggles: Marketing, Promotional Offers, VisionCare Rewards Updates, and Eye Health Reminders, all set to Active, with Unsubscribe from All and Subscribe buttons at the bottom" caption="The preference page editor with all four subscriptions added as active toggles. The component palette on the left lets you add headings, dividers, and other content around the subscription toggles." />

### Add a preference center link to emails

When you build emails in later modules, you will insert a preference center link so subscribers can manage their preferences. In the email builder:

1. Add a text component to the email footer.
2. Type the link text, such as `Manage Preferences`.
3. Select the text and click the **Merge Field** option.
4. Choose **Link > Preference Center**.
5. Save the email.

This inserts a tokenized URL that identifies the recipient when they visit the page. MCA uses this token to pre-populate their current subscription status.

:::warning
The standard **Preference Center** merge field does not work with custom preference pages (the branded option added in Spring '26). If you switch to a custom preference page later, the link mechanism is different. Confirm the correct link approach before deploying custom preference pages.
:::

:::tip[Coming from MCE?]
- MCE had a native hosted preference center tied to Publication Lists, configured in Email Studio.
- MCA's preference page is tied to Communication Subscriptions, configured in the Consent tab.
- MCE's preference center worked with all email types. MCA's custom preference pages (Spring '26 feature) do not support transactional emails. The standard default preference page does not have this restriction.
:::

## Privacy Consent Status component

The Privacy Consent Status component is a Lightning Web Component that surfaces consent status for all Communication Subscriptions on a CRM record page. It lets your team see whether a contact is opted in or out of each subscription, and make manual updates without opening Data 360.

Add it to both the Contact and Lead record pages.

### Add the component to the Contact page

1. Navigate to a Contact record.
2. Click the **Setup gear icon** at the top right.
3. Select **Edit Page**. This opens Lightning App Builder.
4. In the left panel, search for **Privacy Consent Status**.
5. Drag the component onto the page canvas. A dedicated tab works well. Name the tab `Consent`.
6. Click **Save**.
7. Click **Activate** and select the appropriate audience (All users, or the profile group for your team).
8. Repeat for the Lead object (**Setup > Object Manager > Lead > Lightning Record Pages**).

**[INSERT SCREENSHOT: Privacy Consent Status component on a Contact record page showing the three LEOptical subscriptions with OPT_IN/OPT_OUT status rows]**

**What the component shows:** Each Communication Subscription appears as a row with its current consent status for the contact's email address. Status is OPT_IN or OPT_OUT.

**Manual updates:** Click the dropdown on the right of any subscription row and select the new status. The consent cache updates immediately. The Communication Subscription Consent DMO in Data 360 reflects the change within approximately 2-3 minutes.

:::warning
The Privacy Consent Status component updates the consent cache immediately, but the Communication Subscription Consent DMO update takes approximately 2-3 minutes. If you query the DMO right after making a manual change, the old value may still appear briefly. This is expected behavior. Confirmed as of Summer '26.
:::

The component also works on Person Account records as of Spring '26. If LEOptical moves to a Person Account model in the future, the component transfers without reconfiguration.

:::tip[Coming from MCE?]
MCA has no direct equivalent to several of the consent mechanics you used in MCE:
- The **Create Consent Request** flow element (`MessagingConsent.MessagingConsent`) has no MCE counterpart. MCE did not have a platform-native consent write action.
- The **Privacy Consent Status LWC** on record pages is MCA-specific. MCE required custom development or third-party tools to surface consent status in the CRM.
- The **Communication Subscription Consent DMO** is MCA-specific. MCE used the Subscriber object and Publication List relationship.
- In MCE, global unsubscribe permanently removed a subscriber from all sends. MCA's global unsubscribe opts out all existing subscriptions but does not block future subscriptions.
- MCE had no consent check for transactional emails and no configuration option to add one. MCA defaults to no consent check for transactional sends, but this setting is configurable at the org level.
:::

## CSV consent import

For bulk consent creation when you have a list of known opt-ins that were not processed through the flow, MCA provides a CSV import path.

Navigate to **Marketing Cloud App > Consent > Consent Imports**.

<Screenshot src="/img/consent-configuration/05-consent-imports-landing.png" alt="Consent Imports page showing 0 items with an Import button highlighted in the top right corner" caption="The Consent Imports landing page. Click + Import to start a new consent import." />

Click **+ Import**. The import wizard walks through two steps:

<Screenshot src="/img/consent-configuration/06-consent-import-wizard-step1.png" alt="Import Consent Data wizard step 1 showing Channel set to Email, Communication Subscription set to Marketing, and Opt In or Opt Out selection" caption="Step 1: Select the channel, the target subscription, and whether this import sets Opt In or Opt Out status." />

1. Select the communication channel (**Email**).
2. Select the target subscription (e.g., **Promotional Offers**).
3. Select **Opt In** or **Opt Out**. The status you select applies to every row in the file.
4. Click **Next**.

<Screenshot src="/img/consent-configuration/07-consent-import-wizard-step2.png" alt="Upload Import File wizard step showing a file upload area and a link to download a sample file" caption="Step 2: Upload a CSV file. Each row is one email address. Use the sample file link to see the expected format." />

5. Upload the CSV file. Each row is one email address with a consent timestamp.
6. Click **Next** to review, then confirm the import.

One import file handles one subscription. To import consent for three subscriptions, run three separate imports.

:::warning
You cannot mix OPT_IN and OPT_OUT records in a single CSV import file. All rows in one file receive the same consent status. Plan your import files accordingly.
:::

The CSV import updates the consent cache. Contact points must already exist in the system. The import does not create new Leads or Contacts.

## The Create Consent Request flow element

This is the platform-native flow element for writing consent records. It is the only method that updates both the Communication Subscription Consent DMO and the consent cache at the same time. If you write directly to the DMO using a standard Create Records element, the cache is not updated and the consent status MCA checks at send time will not reflect the change.

In Flow Builder, add a **Create Consent** element to the canvas. The element's input panel has four fields:

| Field | What you set |
|---|---|
| **Consent Status** | Select **Opt In** or **Opt Out** from the dropdown |
| **Contact Point** | The email address variable from the flow's trigger or a Get Records lookup |
| **Channel** | Select **Email** from the dropdown |
| **Communication Subscription** | Select one or more subscriptions from the picker (e.g., "Promotional Offers") |

<Screenshot src="/img/consent-configuration/04-create-consent-request-element.png" alt="Flow Builder canvas showing a Create Consent element with Consent Status set to Opt In, Contact Point set to emailAddress, Channel set to Email, and Communication Subscription set to Marketing" caption="The Create Consent element in Flow Builder. You select the consent status, contact point, channel, and subscription directly from the UI." />

You can select multiple Communication Subscriptions in a single Create Consent element. For LEOptical's three marketing subscriptions, one element with all three selected is sufficient.

The element's internal API name is `MessagingConsent.MessagingConsent`, which appears in documentation and SOQL references. The [arthurbackouche.com consent management guide](https://arthurbackouche.com/docs/marketing-cloud-next/consent-management/how-to-manage-consent-in-marketing-cloud-next/) covers the underlying field-level reference if you need it for debugging.

## Web tracking consent banner

The consent banner is about web tracking consent, not email subscription management. These are two separate systems. The email preference page manages which marketing subscriptions a contact is opted into. The web tracking consent banner asks visitors for permission to collect behavioral data (clicks, page views, session data) before tracking begins. This feeds the web analytics and behavioral tracking in Data 360.

There are two places the consent banner can appear, and each has its own configuration path.

### MCA landing pages

For MCA-hosted landing pages, the consent banner is enabled through the Marketing Landing Page site builder. The setup has three steps:

1. **Design the banner.** Navigate to **Setup > Quick Find > Web Tracking**. Open the **Consent Banner** section and toggle **Require Consent Banner** to enabled. Configure the banner position, font, colors, and link text. The Accept and Reject button labels are not customizable in the default banner. Save your changes.

{/* VERIFY: Summer '26 added the ability to create custom consent banners via Content > Create New Content > Consent Banner. This provides full control over button text and layout. Confirm whether the Setup-level banner settings still apply when a custom banner is used, or whether the custom banner replaces them entirely. */}

2. **Enable the integration.** Navigate to **Setup > Quick Find > All Sites**. Open the **Marketing Landing Page** builder. Click the **Settings gear icon**, then select **Integrations**. Click **+ Add to Site** under the Data 360 integration, enable the toggle, associate your data space, and save. Then click **+ Add to Site** under the web tracking consent banner integration, enable the toggle, and save. Wait for both integrations to show a green enabled status.

{/* Screenshot alt/caption use "Data Cloud" because that is the label in the Salesforce UI */}
<Screenshot src="/img/consent-configuration/03-site-builder-integrations.png" alt="Marketing Landing Page site builder Integrations page showing the two integration cards with Add to Site buttons" caption="The Integrations page in the Marketing Landing Page site builder. Both integrations must be added and enabled." />

3. **Publish the site.** Click **Publish** in the site builder. The consent banner does not appear until the site is published. If you change any banner settings after publishing, you must republish.

:::warning
The first page view of a website visitor is not recorded when consent is required. Tracking begins only after the visitor accepts the consent banner. This is expected behavior.
:::

### External websites (web connector)

For external websites (like the LEOptical Netlify site you will build later), tracking is handled by a **web connector** that embeds a tracking beacon on the external site. The web connector has its own toggle that controls whether the MCA consent banner is displayed.

Not every client will use the MCA consent banner on their external sites. Some clients use their own consent management platform (OneTrust, Cookiebot, or similar) and do not want a second consent banner from MCA. The web connector toggle lets you disable the MCA banner in those cases while still capturing behavioral data once the visitor has consented through the client's own tool.

Web connector setup is covered in Modules 17-18. For now, understand that the MCA consent banner for landing pages and the web connector consent toggle are independent configurations.

## Org-wide consent settings

MCA has org-level settings that control which message types require consent checks.

The default configuration:
- Promotional emails: consent checks enabled
- Transactional emails: consent checks disabled
- SMS: consent checks enabled
- WhatsApp: consent checks enabled

{/* VERIFY: Exact navigation path to org-wide consent settings in Setup. The research file notes "Salesforce Setup > [exact path UNVERIFIED]." Confirm the full path in a live SDO before the module is marked verified. */}

The default configuration is correct for LEOptical's current setup. Order Updates (transactional) do not require consent under default settings. Do not change the transactional email consent setting without discussing the implications with the client. Enabling it will block Order Updates to any contact without an explicit OPT_IN for that subscription.

Even if you disable consent management globally, consent is still checked for any send that explicitly references a Communication Subscription. The global off switch does not fully bypass subscription-level enforcement.

## Assignment

> **The client wants:** Consent infrastructure in place so that marketing emails can go out. The team needs to see consent status on CRM record pages without logging into Data 360. Protagonist contacts need consent records so they can receive test emails in later modules.

1. Create three Communication Subscriptions in **Marketing Cloud App > Consent > Preference Pages and Subscriptions**: `Promotional Offers`, `VisionCare Rewards Updates`, and `Eye Health Reminders`. Email channel only.
2. Confirm each subscription has the **Email** channel associated. The Communication Subscription Channel Type records (the junction between subscription and channel) are created automatically when you save.
3. Add all three marketing subscriptions to the default preference page and verify they appear when you click **View Page**.
4. Configure the web tracking consent banner: enable the banner in **Setup > Quick Find > Web Tracking**, configure basic display settings, then add the Data 360 and web tracking consent banner integrations to the Marketing Landing Page site via **All Sites > Marketing Landing Page > Builder > Settings > Integrations**. Publish the site.
5. Add the **Privacy Consent Status** component to the Contact and Lead record pages in Lightning App Builder.
6. **Consent records for protagonist contacts (CSV import):** The consent automation flow is not yet available. Use the CSV import method to create OPT_IN records for your 10 protagonist contacts. Run three separate imports, one per marketing subscription. Verify OPT_IN status appears for all three subscriptions on the **Privacy Consent Status** component on each protagonist Contact record. Contacts without consent records will not receive test emails in Modules 14 onward.

## Success Criteria

- [ ] Three Communication Subscriptions exist in the Consent tab: Promotional Offers, VisionCare Rewards Updates, Eye Health Reminders
- [ ] All three subscriptions appear on the default preference page (confirmed via **View Page**)
- [ ] Web tracking consent banner is enabled in Setup
- [ ] Privacy Consent Status component is present on the Contact record page layout
- [ ] Privacy Consent Status component is present on the Lead record page layout
- [ ] All 10 protagonist contacts show OPT_IN for all three marketing subscriptions in the Privacy Consent Status component
- [ ] You can explain why MCA does not auto-create consent records and what happens to sends when no record exists

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the default consent status for a new Individual in MCA, and what does that mean for marketing sends?
- What four inputs does the "Create Consent" flow element require, and how does it differ from writing directly to the Communication Subscription Consent DMO?
- Why can you not write directly to the Communication Subscription Consent DMO using a standard Create Records flow element?
- What is the difference between the web tracking consent banner and the email preference page? Where is each one configured?
- A colleague deletes a Communication Subscription that had 5,000 OPT_IN records. What happens to those records?
- A test contact is not receiving test emails in Module 14. What is the first thing you check?
- How does the consent behavior for Order Updates (transactional) differ from the three marketing subscriptions in LEOptical's org, and why?
- The Privacy Consent Status component shows OPT_IN for a contact, but a query of the Communication Subscription Consent DMO in Data 360 still shows the old value. Is this a problem, and how long should you wait before escalating?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Understanding Consent Management in Marketing Cloud Next (Mavlers)](https://www.mavlers.com/blog/marketing-cloud-next-consent-management/): Practical walkthrough covering Communication Subscription creation, Preference Center setup, CSV import, and org-wide consent settings. Useful if you want UI screenshots alongside the steps in this module.
- [Consent Management in Marketing Cloud Next (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/consent-management/): Covers the DMO structure, consent cache behavior, and all five valid methods for creating or updating consent records.
- [How to Keep Consent in Sync (modrzejewski.it)](https://modrzejewski.it/blog/how-to-keep-consent-in-sync-between-salesforce-data-360-and-marketing-cloud-next/): The three-flow bidirectional consent sync architecture. Required reading if you are building Flows 2 and 3 for the stretch goal.
- [How to Manage Consent in Marketing Cloud Next (arthurbackouche.com)](https://arthurbackouche.com/docs/marketing-cloud-next/consent-management/how-to-manage-consent-in-marketing-cloud-next/): Field-level reference for the `MessagingConsent.MessagingConsent` flow action, including the ConsentId formula construction and all six required input fields.
- [Surfacing Subscription Consents on Person Accounts (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/subscription-consents-person-accounts/): Covers the Party field workaround in depth and documents the MessagingConsentV2 DSO. Relevant if you encounter client orgs with duplicate consent records or Person Account data models.
