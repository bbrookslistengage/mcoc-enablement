---
sidebar_position: 1
title: "Getting Started"
description: "Provision your SDO, set up Data 360 and MCA, and seed the org with LEOptical's CRM data."
---

## Overview

LEOptical just signed their Salesforce contract. Day one of the engagement. Your job is to get the MCA environment provisioned and ready for configuration. This module gets you there.

The environment you will work in throughout this course is an SDO (Simple Demo Org), Salesforce's partner demo environment. Think of it as LEOptical's org for the duration of the course. It is not a sandbox. It is not a Developer Edition. It has specific characteristics, specific limitations, and a 30-day expiry you need to address immediately. Every configuration decision you make here maps to what a real MCA implementation would require.

This module covers a lot of ground: SDO provisioning, Data 360 setup, Marketing Cloud setup, Identity Resolution configuration, a Data Graph, segmentation features, Einstein Engagement Scoring, Agentforce, and Send Time Optimization. Several of these steps kick off automated processes that take hours or days to complete. You are not expected to finish this in a single sitting. Plan for 1-3 days to get through the full setup.

Some concepts introduced here (Identity Resolution, Data Graphs, Unified Individuals) will not make full sense yet. That is intentional. Modules 8 and 9 cover those in depth. For now, you are configuring the infrastructure. You will understand why each piece matters once you start using it.

At the end of this module, you will seed your org with LEOptical's fictional customer data: approximately 60,000 Contacts, Accounts, Products, and Campaigns. This is the data you will work with throughout the course. Several of the AI features you configure during setup (Einstein Engagement Scoring, Send Time Optimization) require real email engagement history to produce results. The seed data does not include that history, so those features will be infrastructure-only for now.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What an SDO is and how it differs from other Salesforce environments.
- How to provision an SDO from Partner Learning Camp and extend its expiry.
- How to run Data 360 setup and confirm it is complete.
- How to install the Marketing Performance App.
- How to configure Identity Resolution rulesets.
- How to create a Data Graph for personalization.
- How to enable advanced segmentation features, Einstein Engagement Scoring, Agentforce, and Send Time Optimization.
- How to seed the org with LEOptical's CRM data.

## Setup

The authoritative setup guide for MCA in an SDO is the [MCA SDO Setup Guide](https://quip.com/rSLuAs4M0ak3). Complete the following sections from that doc in order. The notes below each section flag things the doc does not cover or where SDO behavior differs.

:::tip[Coming from MCE?]
MCA lives entirely inside a Core Salesforce org. There is no separate "Marketing Cloud" login. You log into Salesforce and MCA is an app in the App Launcher. This is a fundamental shift from MCE, which had its own separate application and login.
:::

### Get your own Simple Demo Org (SDO) from Partner Learning Camp (PLC)

Follow the guide to provision your SDO.

:::warning
Extend your SDO expiry before you do anything else. Navigate to the Partner Community and ask the Agent to extend your SDO expiry date by one year. If you forget, your org expires in 30 days and you lose everything you have built.
:::

The SDO has one data space. Business units cannot be enabled. Always select **default** as your data space throughout this course.

### Data 360 Setup

Follow the guide. Data 360 setup runs as an automated process. When it finishes, you will see a **Tenant Endpoint** in the Data 360 Setup page. That is your confirmation it is complete.

The Tenant Endpoint is a unique URL that identifies your org's Data 360 instance. It is what other Salesforce services use to communicate with Data 360: Marketing Cloud, Identity Resolution, and the Assisted Setup wizard all depend on it. If it is not present, those services cannot connect, and subsequent setup steps will fail with confusing errors.

:::warning
Data 360 setup can take up to 2 hours. Do not proceed with Marketing Cloud setup steps until the Tenant Endpoint appears.
:::

### Marketing Cloud Setup

Follow the guide. This runs the Assisted Setup wizard and installs the Marketing Cloud Data Kits, which wire CRM objects (Contacts, Accounts, Campaigns, and more) into Data 360 as Data Model Objects.

:::warning
Data Kit installation failures are normal. Use the **Retry** button when a kit shows an error. Keep retrying until all kits show a status of **Deployed**.
:::

:::warning
The Sales Data Kit can fail due to missing Account permissions on the **Data Cloud Salesforce Connector** permission set. If it does, navigate to **Setup > Permission Sets > Data Cloud Salesforce Connector > Object Settings > Accounts**, confirm all permissions are enabled, then retry.
:::

:::tip[Coming from MCE?]
MCE had Contact Builder connectors and synchronized data extensions to pull CRM data into Marketing Cloud. Data Kits are the MCA equivalent. The concept is similar: pre-built bundles that map CRM objects to a marketing data model. The implementation is entirely different. Data Kits map to Data 360 DMOs, not synchronized data extensions.
:::

### Install the Marketing Performance App

Follow the guide.

:::warning
The Marketing Performance Intelligence package must be uninstalled and reinstalled once per Salesforce release (three times per year). It does not auto-update. If your SDO crosses a release boundary during the course, you will need to reinstall it.
:::

### Define an Identity Resolution Ruleset

Follow the guide to set up Identity Resolution (IDR). IDR is how MCA determines that two records in different systems represent the same real person. It produces **Unified Individual** records.

You can access Identity Resolution through the setup menu as the guide describes, or directly via **App Launcher > Identity Resolutions**. Both get you to the same place.

:::warning
MCA setup can auto-create a default IDR ruleset. Before creating any ruleset, navigate to **App Launcher > Identity Resolutions** and check whether one already exists. If a default ruleset is there, review its configuration rather than creating a duplicate.
:::

:::tip[Coming from MCE?]
MCE used Subscriber Key as its primary identifier for contacts. Data 360 has no concept of a Subscriber Key by default. Configuring IDR to match on Party Identification is what bridges MCE subscriber history into the MCA data model so it maps to the right Unified Individual records.
:::

### Confirm Company Information includes Address

Follow the guide. This is a CAN-SPAM compliance requirement. Email sending will fail without a physical mailing address in the org.

### Create a Data Graph for Personalization

Follow the guide to create a Data Graph. A Data Graph is a pre-computed snapshot of connected records for each Unified Individual. You use it for personalization (Handlebars merge fields in email content).

Module 8 covers Data Graphs in depth. For now, you are creating the infrastructure.

### Turn on Advanced Segmentation Features

Follow the guide to enable Approximate Segment Population, Segment Preview, and Einstein Segment Creation. All three are disabled by default.

### Enable Einstein Engagement Scoring

Follow the guide.

:::warning
Engagement Scoring requires 1,000 or more real email engagement events in the prior 90 days. The seed data does not include real engagement history, so the model will not produce scores yet. Module 23 covers how to interpret scoring results when they do appear.
:::

### Enable Agentforce

Follow the guide to enable Einstein and set up the Campaign Creation Agent.

### Enable Send Time Optimization

Follow the guide.

:::warning
STO activation can take up to 48 hours. It will not produce meaningful results with seed data only. This is infrastructure setup.
:::

## Seeding LEOptical's CRM Data

The seed script (`seed_crm_data.apex`) is in the course repo under `static/seed-data/`. It populates your SDO with approximately 60,000 Contacts, 5 Products, Campaigns, and related records. All data is self-contained in the script. There is no CSV dependency at this stage. This is the data you will work with throughout the course.

### Run the seed script

The Apex script runs through the Developer Console's Execute Anonymous window.

1. Click the **gear icon** in the top-right corner of your org and select **Developer Console**.

   {/* SCREENSHOT: Developer Console option in the gear menu */}

2. In the Developer Console, go to **Debug > Open Execute Anonymous Window** (or press **Ctrl+E** / **Cmd+E**).

   {/* SCREENSHOT: Developer Console with the Debug menu open */}

3. Open `static/seed-data/seed_crm_data.apex` from the course repo and copy its entire contents.
4. Paste the script into the Execute Anonymous window.
5. Check **Open Log** at the bottom of the window, then click **Execute**.

   {/* SCREENSHOT: Execute Anonymous window with script pasted and Open Log checked */}

6. The log window will open. The script takes 2-5 minutes to complete. When it finishes, the last log line will read `Execution finished`.

   {/* SCREENSHOT: Log window showing "Execution finished" */}

:::warning
If the log shows an error (red text or an exception), do not proceed. Copy the error message and check the troubleshooting notes in the course repo's `README.md`. The most common cause is hitting DML governor limits. The script is designed to run on a fresh SDO, not an org that already has data.
:::

### Confirm the data is present

7. Close the Developer Console and navigate to **Contacts** in the App Launcher.
8. Switch the list view to **All Contacts**. You should see approximately 60,000 records.

   {/* SCREENSHOT: Contacts list view showing record count near 60,000 */}

9. Navigate to **Products** in the App Launcher and confirm 5 Product records are present: the 4 lens families plus frames.
10. Navigate to **Campaigns** and confirm the seeded campaigns are present (Spring Collection 2026, VisionCare Rewards Launch, Back to School).

### Update the protagonist contacts

The 10 protagonist contacts are the ones you will actually receive emails from. They are pre-configured with specific loyalty tiers, purchase histories, and exam statuses to let you test different personalization scenarios. The script creates them with placeholder emails (`YOURNAME+maria@example.com` style) that you need to replace with your own address.

Use Gmail's plus-alias pattern: `yourname+maria@gmail.com`, `yourname+james@gmail.com`, and so on. Each alias routes to your inbox but arrives as a distinct address, so you can tell which contact received which email.

The 10 protagonists and what they are designed to test:

| Name | Loyalty Tier | What they test |
|------|-------------|----------------|
| Maria Chen | Gold | VIP customer with overdue eye exam and multiple products |
| James Okafor | Platinum | Top tier, recent exam |
| Sofia Reyes | Bronze | New signup, no purchases, no engagement |
| David Kim | Silver | Lapsed buyer (last purchase over 200 days ago), overdue exam |
| Aisha Patel | Gold | VIP, single product family |
| Carlos Mendez | Bronze | Low tier, one purchase |
| Wei Zhang | Platinum | Power buyer, all 4 products, recent exam |
| Fatima Al-Hassan | Silver | Tier boundary case (exactly 25,000 points) |
| Ryan O'Brien | Bronze | Has had an exam but no purchases |
| Priya Sharma | Gold | Multi-product Visionaire buyer, recent exam |

To update each contact:

11. In the **Contacts** list, search for each protagonist by name.
12. Open the contact record and click **Edit**.
13. Update the **Email** field to your alias: `yourname+[firstname]@gmail.com`.
14. Save.

Repeat for all 10. When you start sending emails in later modules, these are the contacts whose inboxes you will check.

{/* SCREENSHOT: A protagonist contact record with the email field updated to the alias pattern */}

### Record the Campaign IDs

The seeded campaigns have Salesforce Record IDs you will reference in later modules when building segments and journeys.

15. Navigate to **Campaigns** in the App Launcher.
16. Open each seeded campaign and copy the 18-character Salesforce Record ID from the URL (the portion after `/lightning/r/Campaign/` and before `/view`).
17. Save the IDs somewhere accessible: a notes file, a spreadsheet, anywhere you can find them later.

The campaigns to record: Spring Collection 2026, VisionCare Rewards Launch, Back to School.

## Assignment

This module is foundational setup. Your job is to get from zero to a working, seeded MCA environment.

1. Provision your SDO from Partner Learning Camp. Extend the expiry to 12 months via the Partner Community before doing anything else.
2. Complete all setup sections in the [MCA SDO Setup Guide](https://quip.com/rSLuAs4M0ak3) listed in the Setup section above. Work through them in order.
3. Run `seed_crm_data.apex` in the Developer Console and confirm approximately 60,000 Contacts are present.
4. Update the 10 protagonist contacts with your email address using alias patterns.
5. Document the Campaign IDs for the seeded campaigns. You will need these in later modules.
6. Take a platform tour: navigate to MCA (App Launcher), Data 360 setup, and Salesforce CMS. Orient yourself to where things live.
7. **(Stretch)** Explore the dynamic sending configuration concepts in the Marketing Cloud Assisted Setup. Note what is available and what each setting does. You do not need to configure anything, just explore.

## Success Criteria

- [ ] MCA is accessible from the App Launcher.
- [ ] Data 360 is provisioned and a Tenant Endpoint is visible in **Data Cloud Setup**.
- [ ] Marketing Data Kits are all installed and show a status of **Deployed**.
- [ ] At least one Identity Resolution ruleset is configured.
- [ ] The **Marketing Content Personalization** Data Graph exists and is set as the default for Basic Personalization.
- [ ] Approximate Segment Population, Segment Preview, and Einstein Segment Creation are enabled in Feature Manager.
- [ ] An Einstein Engagement Scoring model exists.
- [ ] The Campaign Creation Agent is created and accessible from the System Administrator profile.
- [ ] Send Time Optimization is enabled.
- [ ] Seed data is visible: approximately 60,000 Contacts, 4 Products, and Campaigns exist in the org.
- [ ] All 10 protagonist contacts have been updated with your email address using alias patterns.
- [ ] Campaign IDs for all seeded campaigns are documented and saved somewhere accessible.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is an SDO and how does it differ from a Developer Edition or sandbox org?
- Why does the SDO have only one data space, and what does this mean for how you configure things throughout this course?
- What is the purpose of the Tenant Endpoint, and why should you wait for it before proceeding with Marketing Cloud setup?
- What are Data Kits, and what CRM objects do they wire into Data 360?
- What is Identity Resolution, and what does it produce? Why does it matter for a client like LEOptical who has customer data spread across multiple systems?
- What is a Data Graph, and why do you need one before you can use Handlebars personalization in emails?
- Einstein Engagement Scoring and Send Time Optimization are both configured in this module but will not produce results. Why not, and when will they start working?
- For a real client like LEOptical (who comes from a basic ESP with no unified customer view), which setup step in this module represents the biggest architectural shift from their previous state?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [SFMC Tips #151: Marketing Cloud Next Setup for SDO](https://medium.com/@marketingcloudtips/marketing-cloud-next-basic-setup-procedure-for-the-demo-environment-be441f7c37d8): Step-by-step SDO setup walkthrough for MCA, written for partners. Covers permission sets, Data 360 setup, Data Kits, IDR, and domain configuration.
- [Marketing Cloud Next: From Zero to First Email (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/first-email/): 16-step setup guide. Corroborates the setup sequence and notes common failure points including CMS workspace creation issues.
- [SFMC Tips #263: SubscriberKey Identity Resolution Match Rule](https://medium.com/@marketingcloudtips/marketing-cloud-next-subscriberkey-identity-resolution-match-rule-ce345a3ae072): Covers the MCE Subscriber Key IDR ruleset configuration in detail. Notes Spring '26 behavior around automatic ruleset creation.
- [Campaign Creation Agent Setup (arthurbackouche.com)](https://arthurbackouche.com/docs/marketing-cloud-next/agentforce-agents/how-to-set-up-the-campaign-creation-agent-in-agentforce-marketing/): Confirms Agentforce setup steps and notes the Agentforce Builder transition in mid-2026.
- [How to Request a Salesforce Demo Org in Partner Learning Camp (DYDC)](https://dineshyadav.com/how-to-request-a-salesforce-demo-org-in-partner-learning-camp/): SDO provisioning walkthrough including Partner Learning Camp navigation steps.
