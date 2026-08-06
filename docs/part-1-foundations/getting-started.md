---
sidebar_position: 1
title: "Module 1: Getting Started"
description: "Provision your SDO, set up Data 360 and MCA, install the Marketing Data Kit, and seed the org with LEOptical's CRM data."
---

## Overview

LEOptical just signed their Salesforce contract. Day one of the engagement. Your job is to get the MCA environment provisioned and ready for configuration. This module gets you there.

The environment you will work in throughout this course is an SDO (Simple Demo Org), Salesforce's partner demo environment. Think of it as LEOptical's org for the duration of the course. It is not a sandbox. It is not a Developer Edition. It has specific characteristics, specific limitations, and a 30-day expiry you need to address immediately. Every configuration decision you make here maps to what a real MCA implementation would require.

This module covers a lot of ground: SDO provisioning, permission sets, Data 360 setup, Marketing Cloud setup, Data Kit installation, Identity Resolution configuration, a Data Graph, segmentation features, Einstein Engagement Scoring, Agentforce, and Send Time Optimization. Several of these steps kick off automated processes that take hours or days to complete. You are not expected to finish this in a single sitting. Plan for 1-3 days to get through the full setup.

Some concepts introduced here (Identity Resolution, Data Graphs, Unified Individuals) will not make full sense yet. That is intentional. Modules 8 and 9 cover those in depth. For now, you are configuring the infrastructure. You will understand why each piece matters once you start using it.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What an SDO is and how it differs from other Salesforce environments.
- How to provision an SDO from Partner Learning Camp and extend its expiry.
- What permission sets are required and how to assign them.
- How to run Data 360 setup and confirm it is complete.
- How to connect a Marketing Cloud Engagement demo account to your org.
- How to install Marketing Cloud Data Kits and handle common installation failures.
- How to configure two Identity Resolution rulesets (name+email and MCE Subscriber Key).
- How to create a Data Graph for personalization.
- How to enable advanced segmentation features, Einstein Engagement Scoring, Agentforce, and Send Time Optimization.
- How to seed the org with LEOptical's CRM data.

## Your Environment: The SDO

The SDO (Simple Demo Org) is Salesforce's primary partner demo environment. It is not a Developer Edition, not a sandbox, and not a trial. It comes pre-populated with demo data, pre-installed packages, and tooling that standard orgs do not have. You access SDOs through Partner Learning Camp, and they are available only to Salesforce partners.

Key characteristics of the SDO:

- Expires 30 days after provisioning by default.
- Can be extended up to 12 months via a Partner Community request (do this immediately).
- Takes approximately 1 hour to provision, sometimes longer.
- Has one data space. Business units cannot be enabled. Always select "default" as your data space throughout this course.
- AutoNTO accounts cannot be connected.

:::warning
Extend your SDO expiry before you do anything else. Navigate to the Partner Community and ask the Agent to extend your SDO expiry date by one year. If you forget, your org expires in 30 days and you lose everything you have built.
:::

:::tip Coming from MCE?
MCE practitioners typically used a personal MCE trial account or an MCE sandbox tied to a production org. MCA lives entirely inside a Core Salesforce org. There is no separate "Marketing Cloud" login. You log into Salesforce and MCA is an app in the App Launcher. This is a fundamental shift, and it takes some getting used to.
:::

### Provisioning your SDO

{/* VERIFY: Is PLC course completion ("Simple Demo Org Fundamentals") required before the Demo Org tab appears. */}

Before you start, confirm you have the following:

- An active Salesforce Partner account.
- Login credentials for the Partner Community.
- Access to your email inbox (for the SDO activation email).
- A browser with private/incognito window support.

To provision your SDO:

1. Log in to [Partner Learning Camp](https://partnerlearningcamp.salesforce.com/).
2. Navigate to the **Demo Org** tab.
3. Request a **Simple Demo Org**. The provisioning email arrives within approximately 1 hour.
4. When you receive the activation email, open it in a **private/incognito window**. This avoids session conflicts with any existing Salesforce logins.
5. Complete the activation flow. Set a password you will remember.
6. After logging in, go to the **Partner Community** and ask the Agent to extend your SDO expiry by one year.

:::warning
After receiving the activation email, some background installation tasks may still be running in the org. Accessing your user record in Setup may be slow for the first several minutes. This is expected.
:::

## Permission Sets

Before configuring anything, assign the two required permission sets to your user. Without these, you cannot access the MCA and Data 360 setup flows.

The two permission sets are:

1. **Data Cloud Architect (Admin)**: grants access to Data 360 setup and configuration.
2. **Marketing Cloud Admin**: grants access to MCA features.

{/* VERIFY: Confirm the "Data Cloud Architect (Admin)" permission set name in Summer '26 SDOs. Some sources call it "Data Cloud Admin." The UI label may differ between releases. */}

To assign them:

1. Navigate to **Setup > Users > Users**.
2. Click your username.
3. Scroll to **Permission Set Assignments** and click **Edit Assignments**.
4. Move **Data Cloud Architect (Admin)** and **Marketing Cloud Admin** from the Available list to the Enabled list.
5. Click **Save**.

:::tip Coming from MCE?
MCE managed users, roles, and business unit access inside the MCE application itself. MCA uses standard Salesforce permission sets. If your client already uses Salesforce, their admins can manage MCA access through the same tools they use for everything else.
:::

## Company Information

Email sending requires a physical mailing address in the org (CAN-SPAM compliance). Set this up now before the sending configuration steps.

1. Navigate to **Setup > Company Settings > Company Information**.
2. Click **Edit**.
3. Fill in **Street**, **City**, **State/Province**, **Zip/Postal Code**, and **Country**.
4. Click **Save**.

## Data 360 Setup

Data 360 setup runs as an automated process inside your org. The process creates the data infrastructure that MCA depends on.

1. Click the **Setup** gear icon in the top-right corner.
2. Navigate to **Data Cloud Setup**.
3. Click **Get Started**.

The setup process runs automatically. When it finishes, you will see a **Tenant Endpoint** in the Data 360 setup page. That endpoint is your confirmation that Data 360 is fully provisioned.

:::warning
Data 360 setup can take up to 2 hours. Do not proceed with Marketing Cloud setup steps until the Tenant Endpoint appears. If you continue before setup completes, you may encounter errors in the Assisted Setup wizard.
:::

## Marketing Cloud Engagement Connection

MCA can send email natively, but for this course you will also connect a Marketing Cloud Engagement (MCE) demo account. This connection lets MCE subscriber data (including Subscriber Keys and email engagement history) flow into Data 360.

Only one MCE demo account is provisioned per partner organization. Check with your team before requesting a new one. If your partner org already has one, get the credentials from the person who set it up.

If you need to request a new MCE demo account, follow the instructions at [Marketing Cloud Engagement Demo Accounts for Partners](https://help.salesforce.com/s/articleView?id=000390865&type=1). Account provisioning can take several days.

:::warning
MCE demo account provisioning can take several days after submitting the partner benefits case. If you are waiting on an MCE account, you can complete the rest of this module's setup steps (Data 360 setup, Data Kits, IDR, Data Graph, Einstein features) and come back to the MCE connection when the account is ready. Some Data Kit steps require an active MCE account.
:::

{/* VERIFY: Does the MCE connection require an active MCE account, or can Module 1 be completed without it? Clarify which steps are blocked by MCE and which are not. */}

When your MCE credentials are ready:

1. Navigate to **Setup > Marketing Cloud > Assisted Setup > Assistant Home**.
2. Find the **Connect Data and Start Setup** card and click **Go to Setup**.
3. Under **Required Setup**, click **Go to Data Cloud Setup**.
4. Enter your MCE account credentials.

For the MCE connection to work, the MCE user must:
- Have the **Marketing Cloud Admin** role and **Administrator** role in MCE.
- Be designated as an **API User** in MCE Setup > Users.
- Belong to an Enterprise 2.0 account type.

:::tip Coming from MCE?
In MCE, you worked directly inside the Marketing Cloud application. In MCA, MCE becomes a data source connected to Data 360. The two products are peers now, not the same thing. Your MCE instance feeds subscriber data into MCA's unified data model, but MCA controls the sending logic.
:::

## Marketing Cloud Basic Settings and Data Kits

Marketing Cloud Data Kits are pre-built connectors that wire CRM objects (Contacts, Accounts, Campaigns, and more) into Data 360 as Data Model Objects (DMOs). Installing them is one of the first real configuration steps.

1. Navigate to **Setup > Marketing Cloud > Assisted Setup > Basic Settings**.
2. Select **default** as your data space.
3. Click through to **Install Marketing Cloud Data Kits** and start the installation.

{/* VERIFY: Confirm the Data Kit names shown in the UI match what the guide describes. Data Kit names may be updated between releases. */}

:::warning
Data Kit installation failures are normal. Do not assume something is broken. Use the **Retry** button when a kit shows an error. Keep retrying until all kits show a status of **Deployed**. This can take a while.
:::

:::warning
The Sales Data Kit can fail due to missing Account permissions on the **Data Cloud Salesforce Connector** permission set. If it does, navigate to **Setup > Permission Sets > Data Cloud Salesforce Connector > Object Settings > Accounts** and confirm all permissions (Read, Create, Edit, and any others listed) are enabled. Then retry the Sales Data Kit installation.
:::

:::warning
On some SDOs, Data Kit installation fails with: "A required package is missing. Package 'Salesforce Standard Data Model', Version x or later must be installed first." If you see this error, install the package from [https://help.salesforce.com/s/articleView?id=002234049&type=1](https://help.salesforce.com/s/articleView?id=002234049&type=1) and then retry.
:::

:::tip Coming from MCE?
MCE had Contact Builder connectors and synchronized data extensions to pull CRM data into Marketing Cloud. Data Kits are the MCA equivalent. The concept is similar: pre-built bundles that map CRM objects to a marketing data model. The implementation is entirely different. Data Kits map to Data 360 DMOs, not synchronized data extensions.
:::

## Identity Resolution

Identity Resolution (IDR) is how MCA figures out that two records in different systems represent the same real person. It runs matching rules against your data and produces **Unified Individual** records. You will configure two rulesets.

This module does not go deep on how IDR works. Module 9 covers that. For now, follow the steps to get the infrastructure in place.

:::warning
MCA setup can auto-create a default IDR ruleset. Before creating either ruleset below, navigate to **App Launcher > Identity Resolutions** and check whether a ruleset already exists. Creating duplicates is harmless but confusing. If a default ruleset exists, review its configuration against what is described below.
:::

:::tip Coming from MCE?
MCE used Subscriber Key as its primary identifier for contacts. Data 360 has no concept of a Subscriber Key by default. The second IDR ruleset you configure below (MCE Subscriber Key matching) is specifically designed to bridge the MCE identifier into the MCA data model, so that MCE subscriber history maps to the right Unified Individual records.
:::

### Ruleset 1: Name and Email Matching

This ruleset identifies the same person across different source systems using name and email address.

1. Navigate to **App Launcher > Identity Resolutions**.
2. Click **New Ruleset**.
3. Set **Primary DMO** to **Individual** and **Match DMO** to **Individual**.
4. Set Match Rule to **Custom** and add the following fields:
   - **First Name**, Method: **Fuzzy - Medium Precision**
   - **Last Name**, Method: **Exact**
   - **Contact Point Email > Email Address**, Method: **Exact Normalized**
5. Save the ruleset. IDR will run the first match job automatically.

### Ruleset 2: MCE Subscriber Key Matching

{/* VERIFY: Does Spring '26 auto-create the Subscriber Key IDR ruleset when MCE+ is enabled? If so, learners may encounter a pre-existing ruleset and should verify its configuration rather than creating a new one. */}

This ruleset maps MCE Subscriber Keys to Individual records in Data 360.

1. In **App Launcher > Identity Resolutions**, create a new ruleset.
2. Set **Primary DMO** to **Individual** and **Match DMO** to **Individual**.
3. Set Match Rule to **Custom** and add:
   - **DMO**: Party Identification, **Field**: Identification Number, **Method**: Exact
   - Set **Party Identification Type** to "Person Identifier"
   - Set **Party Identification Name** to "MC Subscriber Key"
4. Save the ruleset.
{/* VERIFY: Research file lists this path as "Setup > Marketing Cloud > Assisted Setup > Assistant Home > Basic Settings > Go to Basic Settings > Configure Identity Resolution Rulesets" - the draft omits the "Go to Basic Settings" step in the middle. Confirm the exact path in a live SDO. */}
5. After saving, navigate to **Setup > Marketing Cloud > Assisted Setup > Assistant Home > Basic Settings > Configure Identity Resolution Rulesets**.
6. Select `UnifiedssotIndividual1__dlm` as the account Unified Individual object.

{/* VERIFY: Does the "UnifiedssotIndividual1__dlm" field name remain consistent across SDOs? Verify this is the correct value in a fresh Summer '26 SDO. */}

## Data Graph

A Data Graph is a pre-computed JSON snapshot of connected records for each Unified Individual. You use it for personalization (Handlebars merge fields in email content). The graph is computed on a schedule and accessed at send time.

You are creating this now to enable personalization when you start building emails. Module 8 covers Data Graphs in depth.

1. Navigate to **App Launcher > Data Cloud > Data Graphs tab**.
2. Click **New > Start from Scratch > Standard Data Graph**.
3. Configure:
   - **Data Graph Name**: Marketing Content Personalization
   - **Data Space**: default
   - **Primary DMO**: Unified Individual
   - **Refresh Schedule**: Daily
4. Add the following DMO chain:
   - Unified Individual fields (select all fields you want available for personalization)
   - Unified Individual > Unified Link Individual > Individual (include Data Source field)
   - Unified Individual > Unified Link Individual > Individual > Contact Point Email (include Email Address field)
   - Unified Individual > Unified Link Individual > Individual > Contact Point Phone (include Formatted E164 Phone Number field)
5. Save the Data Graph.
6. Navigate to **Setup > Marketing Cloud > Assisted Setup > Reporting and Optimization > Customer Engagement > Configure Basic Personalization**.
7. Select **Marketing Content Personalization** in the dropdown.

## Advanced Segmentation Features

Three segmentation features are disabled by default and need to be turned on manually.

1. Navigate to **Setup > Data Cloud > Feature Management > Feature Manager**.
2. Enable **Approximate Segment Population**.
3. Enable **Segment Preview**.
4. Enable **Einstein Segment Creation**.

## Einstein Engagement Scoring

Einstein Engagement Scoring predicts how likely a contact is to engage with an email. You are setting up the model now as infrastructure. It will not produce results in the SDO with seed data alone.

:::warning
Engagement Scoring requires 1,000 or more real email engagement events (sends, opens, clicks, bounces, unsubscribes) in the prior 90 days. The seed data does not include real engagement history. The model will not produce scores until you have real sending history. Module 23 covers how to interpret scoring results when they do appear.
:::

1. Navigate to **Setup > Marketing Cloud > Assisted Setup > Reporting and Optimization > Customer Engagement**.
2. Click **Go to Scoring Setup > New**.
3. Configure:
   - **Model name**: Default
   - **Score on**: People
   - **Identity Resolution**: Unified Individual
4. Save.

## Agentforce Campaign Creation Agent

The Campaign Creation Agent is an AI agent that helps build campaign briefs and suggests email content. Enabling it requires two steps: turning on Einstein, then setting up the agent.

### Enable Einstein

1. Navigate to **Setup > Einstein > Einstein Generative AI > Einstein Setup**.
2. Toggle **Einstein** on.
3. Turn on **Global Languages**.
4. Turn on **Deploy Prompt Templates**.

### Set Up the Campaign Creation Agent

{/* VERIFY: Does the Spring '26 Agentforce setup flow still apply in Summer '26 SDOs? The legacy Agentforce Builder is scheduled to be phased out for new agent creation starting approximately mid-July 2026. The exact UI may differ. */}

1. Navigate to **Setup > Einstein > Einstein Generative AI > Agentforce Studio > Agentforce Agents**. If the option is not visible, refresh the page.
2. Turn on **Agentforce**.
3. Click **+ New Agent**.
4. Select **Campaign Creation**.
5. Name it **Campaign Creation Agent**.
6. Click **Let's Go**.
7. Review the default subagent descriptions.
8. Click **Save and Commit**.

Grant the agent to the System Administrator profile:

1. Navigate to **Setup > Users > Profiles > System Administrator > Agent Access**.
2. Click **Edit**.
3. Assign the **Campaign Creation Agent** to this profile.
4. Save.

## Send Time Optimization

Send Time Optimization (STO) predicts the best time to send email to each individual contact based on their past engagement. Like Engagement Scoring, it requires real engagement history to produce results. Enabling it now sets up the infrastructure.

1. Navigate to **Setup > Marketing Cloud > Assisted Setup > Channels > Email**.
2. Find the **Activate Einstein Send Time Optimization** section.
3. Click **Go to Einstein Settings**.
4. Select **Enable with your org-specific data**.
5. Click **Enable**.

:::warning
STO activation can take up to 48 hours to complete. It will not produce meaningful results with seed data only. Real engagement history is required. This is infrastructure setup only for now.
:::

## Marketing Performance App (Optional)

The Marketing Performance App provides email analytics through Tableau Next. Setting it up now means your reporting infrastructure is ready when you start sending.

1. Navigate to **Setup > Marketing Cloud > Marketing Features > Marketing Performance > Go to Data Streams > New > Marketing Cloud > Next**.
2. Map your MC Engagement Business Units to the Default Data Space.
3. Select the **Email Studio Starter Data Bundle**.
4. Include the **SFMC Journey Activity Run Data Streams**.
5. Confirm the field mappings and click **Deploy**.
6. Repeat the above for the **MobileConnect data bundle**.
7. Navigate to **Setup > Marketing Cloud > Marketing Features > Marketing Performance > Install**.

{/* VERIFY: Research file lists the Flows bundle workaround path as "Data 360 > Data Streams > New" - the draft says "App Launcher > Data Cloud > Data Streams > New." These may refer to the same destination, but confirm the exact navigation label in a live SDO. */}
If you see errors about `template_requirement_flow`, manually install the Flows Salesforce Data Bundle via **App Launcher > Data Cloud > Data Streams > New**, select Salesforce, and find the Flows bundle.

After installation, assign the **Tableau Next Included App Business User** permission set to any users who need access to the Marketing Performance reports.

:::warning
The Marketing Performance Intelligence package must be uninstalled and reinstalled once per Salesforce release (three times per year). It does not auto-update. If your SDO crosses a release boundary during the course, you will need to reinstall it.
:::

## Seeding LEOptical's CRM Data

The seed script populates your SDO with LEOptical's fictional customer data: approximately 60,000 Contacts, Accounts, Products, and Campaigns. This data is what you will work with throughout the course.

1. In your org, navigate to the **Developer Console** (via the gear icon or Setup).
2. Open **Execute Anonymous**.
3. Paste in the contents of `seed_crm_data.apex`.
4. Run the script. It will take several minutes to complete.
5. After the script completes, navigate to **Contacts** in the App Launcher and confirm approximately 60,000 Contacts are present.

Next, update the 10 protagonist contacts. These are the specific contacts you will use throughout the course to receive and verify test emails. They need to have your email address so that emails you send actually reach you.

6. Navigate to each of the 10 protagonist contacts and update their email address using an alias pattern: `yourname+maria@gmail.com`, `yourname+james@gmail.com`, and so on. The exact protagonist names are listed in your course materials.

Finally, note the Campaign IDs for the seeded campaigns. You will need these in later modules.

7. Navigate to **Campaigns** in the App Launcher.
8. Open each seeded campaign and copy its Salesforce Record ID from the URL.
9. Save these IDs somewhere accessible (a notes file, a spreadsheet, anywhere you can reference them later).

## Assignment

This module is foundational setup. Your job is to get from zero to a working, seeded MCA environment.

1. Provision your SDO from Partner Learning Camp. Extend the expiry to 12 months via the Partner Community before doing anything else.
2. Assign the **Data Cloud Architect (Admin)** and **Marketing Cloud Admin** permission sets to your user.
3. Add a full company mailing address to the org under **Company Information**.
4. Run Data 360 setup and wait for the Tenant Endpoint to appear before continuing.
5. Connect your MCE demo account (or request one if your partner org does not have one). If provisioning takes more than a day, skip this and return to it.
6. Run Marketing Cloud Assisted Setup. Install the Marketing Cloud Data Kits. Retry any that fail until all show **Deployed**.
7. Configure the two Identity Resolution rulesets: name+email matching and MCE Subscriber Key matching.
8. Create the **Marketing Content Personalization** Data Graph and set it as the default for Basic Personalization.
9. Enable the three advanced segmentation features in Feature Manager.
10. Set up the Einstein Engagement Scoring model.
11. Enable Einstein and create the Campaign Creation Agent in Agentforce.
12. Enable Send Time Optimization.
13. Run `seed_crm_data.apex` in the Developer Console and confirm approximately 60,000 Contacts are present.
14. Update the 10 protagonist contacts with your email address using alias patterns.
15. Document the Campaign IDs for the seeded campaigns. You will need these in later modules.
16. Take a platform tour: navigate to MCA (App Launcher), Data 360 setup, and Salesforce CMS. Orient yourself to where things live.
17. **(Stretch)** Explore the dynamic sending configuration concepts in the Marketing Cloud Assisted Setup. Note what is available and what each setting does. You do not need to configure anything, just explore.

## Success Criteria

- [ ] MCA is accessible from the App Launcher.
- [ ] Data 360 is provisioned and a Tenant Endpoint is visible in **Data Cloud Setup**.
- [ ] Marketing Data Kits are all installed and show a status of **Deployed**.
- [ ] **Data Cloud Architect (Admin)** and **Marketing Cloud Admin** permission sets are assigned to your user.
- [ ] Seed data is visible: approximately 60,000 Contacts, 4 Products, and Campaigns exist in the org.
- [ ] All 10 protagonist contacts have been updated with your email address using alias patterns.
- [ ] Campaign IDs for all seeded campaigns are documented and saved somewhere accessible.
- [ ] Two Identity Resolution rulesets are configured: one for name+email matching, one for MCE Subscriber Key matching.
- [ ] The **Marketing Content Personalization** Data Graph exists and is set as the default for Basic Personalization.
- [ ] Approximate Segment Population, Segment Preview, and Einstein Segment Creation are enabled in Feature Manager.
- [ ] An Einstein Engagement Scoring model named **Default** exists.
- [ ] The Campaign Creation Agent is created and accessible from the System Administrator profile.
- [ ] Send Time Optimization is enabled.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is an SDO and how does it differ from a Developer Edition or sandbox org?
- Why does the SDO have only one data space, and what does this mean for how you configure things throughout this course?
- What is the purpose of the Tenant Endpoint, and why should you wait for it before proceeding with Marketing Cloud setup?
- What are Data Kits, and what CRM objects do they wire into Data 360?
- Why are two separate Identity Resolution rulesets configured in this module? What does each one do?
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
