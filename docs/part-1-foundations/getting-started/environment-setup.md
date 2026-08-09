---
sidebar_position: 1
title: "Environment Setup"
description: "Provision your SDO and configure Data 360, Marketing Cloud, Identity Resolution, and the AI features MCA depends on."
---

## Setup

The authoritative setup guide for MCA in an SDO is the [MCA SDO Setup Guide](https://quip.com/rSLuAs4M0ak3). Complete the following sections from that doc in order. The notes below each section flag things the doc does not cover or where SDO behavior differs.

:::tip[Coming from MCE?]
MCA lives entirely inside a Core Salesforce org. There is no separate "Marketing Cloud" login. You log into Salesforce and MCA is an app in the App Launcher. This is a fundamental shift from MCE, which had its own separate application and login.
:::

### Get your own Simple Demo Org (SDO) from Partner Learning Camp (PLC)

Follow the guide to provision your SDO.

### Extend your SDO expiry

Extend your SDO before you do anything else. The default expiry is 30 days. If it lapses before you finish the course, you lose everything you have built.

Salesforce does not have a self-serve extension option. You need to log a support case through the Partner Community. Follow the [How to Submit a Case to Extend Your Demo Org](https://help.salesforce.com/s/articleView?id=002718163&type=1) guide. The screenshot below shows where to find the case submission option.

<Screenshot src="/img/getting-started/01-log-a-case-partner-support.png" alt="Partner Community help menu with Log a Case for Help option highlighted" />

Use this template for the case description. Find your Org ID under **Setup > Company Information**.

```
Subject: SDO Expiry Extension Request

Product: Sales
Severity: S3

Hello,

I am requesting a 12-month extension on my Simple Demo Org (SDO).

Org ID: [YOUR ORG ID]
Org URL: [YOUR ORG URL]
Current expiry date: [CURRENT EXPIRY DATE]

I am using this org for MCA enablement training and need the additional
time to complete the course curriculum.

Thank you.
```

The SDO has one data space. Business units cannot be enabled. Always select **default** as your data space throughout this course.

### Data 360 Setup

Follow the guide. Data 360 setup runs as an automated process. When it finishes, you will see a **Tenant Endpoint** in the Data 360 Setup page. That is your confirmation it is complete.

<Screenshot src="/img/getting-started/02-tenant-endpoint.png" alt="Data 360 Setup page showing Your Home Org Details with the Tenant Endpoint populated, confirming that Data 360 provisioning is complete" />

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

<Screenshot src="/img/environment-setup/01-identity-resolution-ruleset.png" alt="Identity Resolutions list view showing one ruleset: Individual Identity Resolution, data space default, Primary Data Object Individual, Ruleset Status Published" caption="If your SDO already has a default ruleset like this, review it rather than creating a new one." />

:::tip[Coming from MCE?]
MCA has no concept of a Subscriber Key. There is no single primary identifier for contacts. Instead, Identity Resolution combines records from multiple sources and produces a **Unified Individual**: the resolved identity that MCA uses for segmentation, personalization, and sending.
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

## Assignment

1. Provision your SDO from Partner Learning Camp. Extend the expiry to 12 months via the Partner Community before doing anything else.
2. Complete all setup sections in the [MCA SDO Setup Guide](https://quip.com/rSLuAs4M0ak3) listed above. Work through them in order.
3. Take a platform tour: navigate to MCA in the App Launcher, open Data 360 Setup, and find Salesforce CMS. Orient yourself to where things live.
4. **(Stretch)** Explore the dynamic sending configuration options in the Marketing Cloud Assisted Setup. Note what is available and what each setting does. You do not need to configure anything.

## Success Criteria

- [ ] MCA is accessible from the App Launcher.
- [ ] Data 360 is provisioned and a Tenant Endpoint is visible in **Data 360 Setup**.
- [ ] Marketing Data Kits are all installed and show a status of **Deployed**.
- [ ] At least one Identity Resolution ruleset is configured.
- [ ] The **Marketing Content Personalization** Data Graph exists and is set as the default for Basic Personalization.
- [ ] Approximate Segment Population, Segment Preview, and Einstein Segment Creation are enabled in Feature Manager.
- [ ] An Einstein Engagement Scoring model exists.
- [ ] The Campaign Creation Agent is created and accessible from the System Administrator profile.
- [ ] Send Time Optimization is enabled.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is an SDO and how does it differ from a Developer Edition or sandbox org?
- Why does the SDO have only one data space, and what does this mean for how you configure things throughout this course?
- What is the purpose of the Tenant Endpoint, and why should you wait for it before proceeding with Marketing Cloud setup?
- What are Data Kits, and what CRM objects do they wire into Data 360?
- What is Identity Resolution, and what does it produce? Why does it matter for a client like LEOptical who has customer data spread across multiple systems?
- What is a Data Graph, and why do you need one before you can use Handlebars personalization in emails?
- Einstein Engagement Scoring and Send Time Optimization are both configured in this module but will not produce results. Why not, and when will they start working?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [SFMC Tips #151: Marketing Cloud Next Setup for SDO](https://medium.com/@marketingcloudtips/marketing-cloud-next-basic-setup-procedure-for-the-demo-environment-be441f7c37d8): Step-by-step SDO setup walkthrough for MCA, written for partners. Covers permission sets, Data 360 setup, Data Kits, IDR, and domain configuration.
- [Marketing Cloud Next: From Zero to First Email (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/first-email/): 16-step setup guide. Corroborates the setup sequence and notes common failure points including CMS workspace creation issues.
- [SFMC Tips #263: SubscriberKey Identity Resolution Match Rule](https://medium.com/@marketingcloudtips/marketing-cloud-next-subscriberkey-identity-resolution-match-rule-ce345a3ae072): Covers the MCE Subscriber Key IDR ruleset configuration in detail. Notes Spring '26 behavior around automatic ruleset creation.
- [Campaign Creation Agent Setup (arthurbackouche.com)](https://arthurbackouche.com/docs/marketing-cloud-next/agentforce-agents/how-to-set-up-the-campaign-creation-agent-in-agentforce-marketing/): Confirms Agentforce setup steps and notes the Agentforce Builder transition in mid-2026.
- [How to Request a Salesforce Demo Org in Partner Learning Camp (DYDC)](https://dineshyadav.com/how-to-request-a-salesforce-demo-org-in-partner-learning-camp/): SDO provisioning walkthrough including Partner Learning Camp navigation steps.
