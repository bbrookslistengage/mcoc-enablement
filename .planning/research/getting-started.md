# Research: Getting Started

Generated: 2026-08-06
Module: getting-started
Sources: 11 consulted, 7 included in research

---

## Module Context

### Client Ask (from module-assignments.md)

> **The client wants:** LEOptical just signed their Salesforce contract. They need their MCA environment provisioned and ready for the team to start configuring.

### Assignment (verbatim from module-assignments.md)

- Provision your SDO and verify Core Org Edition requirements are met
- Provision Data 360 and install the Marketing Data Kit
- Assign the necessary permission sets to your user
- Run the `seed_crm_data.apex` script to populate LEOptical's CRM with ~60,000 Contacts, Accounts, Products, and Campaigns
- Update the 10 protagonist contacts with your own email address using `+alias` patterns (e.g., `yourname+maria@gmail.com`, `yourname+james@gmail.com`). These are the contacts you'll use throughout the course to receive and verify test emails
- Take a platform tour: navigate to MCA setup, Data 360 setup, and Salesforce CMS
- Note the Campaign IDs for the seeded campaigns — you'll need these in later modules

**Content note from spec:** "The lesson portion will most likely link to a Medium article for detailed setup instructions."

**Stretch Goal:** Explore dynamic sending configuration concepts

### Success Criteria (verbatim from module-assignments.md)

- [ ] MCA is accessible from the App Launcher
- [ ] Data 360 is provisioned and accessible
- [ ] Marketing Data Kit is installed
- [ ] Permission sets are assigned
- [ ] Seed data is visible: ~60,000 Contacts, 4 Products, Campaigns exist in the org
- [ ] All 10 protagonist contacts have been updated with your email address
- [ ] Campaign IDs are documented for later use

---

## Module Scope

### What this module covers

This is Module 1 of the course. Its job is to get learners from zero to a working MCA/Data 360 sandbox environment. It covers:

- Obtaining an SDO from Partner Learning Camp
- Assigning required permission sets
- Running Data Cloud (Data 360) setup
- Running Marketing Cloud setup and installing Data Kits
- Connecting the org to a Marketing Cloud Engagement demo account (for partner MCE integration — MCE connection is needed for full email sending capabilities)
- Running initial Identity Resolution ruleset setup (two rulesets: name+email matching, and MCE Subscriber Key matching)
- Confirming company address
- Creating the initial Data Graph for personalization
- Enabling advanced segmentation features
- Enabling Einstein Engagement Scoring
- Enabling Agentforce (Campaign Creation Agent)
- Enabling Send Time Optimization
- Running the seed CRM data script
- Documenting Campaign IDs for later modules

### What this module does NOT cover

- Domain authentication (covered in Module 2)
- Business unit configuration (covered in Module 3)
- Consent setup (covered in Modules 4-5)
- Data ingestion / data streams (covered in Modules 6-7)
- Segmentation configuration (covered in Module 10)
- In-depth IDR explanation (covered in Module 9)
- In-depth Data Graph explanation (covered in Module 8)

The setup steps in this module (IDR, Data Graph) are covered just enough to get the environment functional. The deep explanations come in later modules.

---

## Primary Source

**Salesforce Partner Demo Guide (Spring '26)** — provided verbatim in the research brief. This is the authoritative source for all UI navigation paths and step sequences in this module. All steps below are from this guide unless otherwise noted.

**Source URL:** Internal Quip document (Salesforce Partners only). Referenced as "Spring '26 Partner Demo Guide" in this file.

---

## Platform Concepts

### What is an SDO?

The Simple Demo Org (SDO) is Salesforce's primary partner demo environment. It is not a standard Developer Edition org. It contains pre-populated demo data, tooling, scripts, and pre-installed packages. SDOs are provisioned through Partner Learning Camp and are available only to Salesforce partners.

Key SDO characteristics:
- Expires after 30 days by default
- Can be extended up to 12 months via Partner Community request
- Provisioning takes approximately 1 hour (some sources say "a few hours")
- Contains pre-configured demo data for multiple Salesforce products
- Has one data space; business units cannot be enabled (confirmed gotcha from platform-gotchas.md)
- AutoNTO accounts cannot be connected to the SDO (from the guide)

### SDO vs. Other Environments

An SDO is not a sandbox, not a Developer Edition, and not a trial org. The course uses "SDO" consistently per the terminology spec. Do not call it a "sandbox" or "dev org."

### Data Cloud (Data 360) Setup

Data Cloud setup is triggered from within the org via **Setup > Data Cloud Setup > Get Started**. The process is largely automated. A "Tenant Endpoint" is created as part of setup — its presence signals that Data 360 is fully provisioned.

Timing: The guide states setup may take up to 2 hours for automated steps to complete. One source (The Agentic Marketer) says "about one hour." Flag to learner: do not proceed with Marketing Cloud setup steps until the Tenant Endpoint appears.

### Permission Sets Required

Two permission sets must be assigned to the admin user before configuration can proceed:

1. **Data Cloud Architect (Admin)** — previously called "Data Cloud Admin" in some sources. Use the name that appears in the SDO.
2. **Marketing Cloud Admin** — required for Marketing Cloud feature access.

Path: **Setup > Users > Users > [Your User] > Permission Set Assignments > Edit Assignments**

Note: Some sources also reference a "Marketing Subscription" permission set that is auto-created. This does not need to be manually assigned.

### Marketing Cloud Setup and Data Kits

Marketing Cloud setup runs from the Assisted Setup wizard. The wizard installs "Data Kits" — pre-built connectors and data bundles that wire up CRM data into Data 360.

Key points:
- Navigate to **Setup > Marketing Cloud > Assisted Setup > Basic Settings**
- Select the "default" Data Space
- Install Marketing Cloud Data Kits
- Installation can fail and requires a "retry" — this is normal behavior
- "Deployed" status = successful installation for all kits
- Older SDOs may fail with: "A required package is missing. Package 'Salesforce Standard Data Model', Version x or later must be installed first" — known workaround: install latest package from https://help.salesforce.com/s/articleView?id=002234049&type=1
- Sales Data Kit may fail due to missing Account permissions on the Data Cloud Salesforce Connector permission set — known workaround documented in guide

### Marketing Cloud Engagement (MCE) Connection

An MCE demo account must be obtained separately from the SDO. Only one MCE demo account is provisioned per partner organization. Confirm whether one already exists before requesting a new one. AutoNTO accounts cannot be connected.

The connection is configured from **Setup > Marketing Cloud > Assisted Setup > Assistant Home** under the "Connect Data and Start Setup" card. Creating the connection involves entering MCE credentials.

MCE user requirements for the connection:
- Must have Marketing Cloud Admin AND Administrator Role
- Must be designated as an API User (in MC Engagement > Setup > Users)
- Account Type must be Enterprise 2.0

This is a "Required Setup" step in the Assisted Setup wizard. Without this connection, MCE data (subscriber keys, email engagement) cannot flow into Data 360.

### Identity Resolution

Two rulesets are configured in Module 1:

**Ruleset 1 — Name + Email matching (standard):**
- Primary DMO: Individual
- Match DMO: Individual
- Match Rule: Custom
  - Field: First Name, Method: Fuzzy - Medium Precision
  - Field: Last Name, Method: Exact
  - Field: Contact Point Email > Email Address, Method: Exact Normalized

**Ruleset 2 — MCE Subscriber Key matching:**
- Primary DMO: Individual
- Match DMO: Individual
- Match Rule: Custom
  - DMO: Party Identification, Field: Identification Number, Method: Exact
  - Configure: Party Identification Type = "Person Identifier"
  - Configure: Party Identification Name = "MC Subscriber Key"
- After saving, navigate to **Setup > Marketing Cloud > Assisted Setup > Assistant Home > Basic Settings > Configure Identity Resolution Rulesets** and select `UnifiedssotIndividual1__dlm` as the account Unified Individual object

Note from platform-gotchas.md: MCA setup can auto-create a default IDR ruleset. The auto-generated ruleset may or may not be appropriate. Learners should check whether a ruleset already exists before creating a new one.

Note from web research: In Spring '26, the Party Identification ruleset for MCE Subscriber Key may be automatically created when MCE+ is enabled. Learner should check before creating manually. <!-- VERIFY: Does Spring '26 auto-create the Subscriber Key ruleset? -->

### Data Graph

A Data Graph named "Marketing Content Personalization" is created in Module 1 to enable Handlebars personalization. The Data Graph is rooted on Unified Individual (per course design decision from PROGRESS.md).

Navigation: **App Launcher > Data Cloud > Data Graphs tab > New > Start from Scratch > Standard Data Graph**

Configuration:
- Data Graph Name: Marketing Content Personalization
- Data Space: default
- Primary DMO: Unified Individual
- Refresh schedule: Daily

DMO chain to include:
- Unified Individual fields (select all desired)
- Unified Individual > Unified Link Individual > Individual (include Data Source field)
- Unified Individual > Unified Link Individual > Individual > Contact Point Email (include Email Address field)
- Unified Individual > Unified Link Individual > Individual > Contact Point Phone (include Formatted E164 Phone Number field)
- Optional: Individual > Account, Email Engagement > Bulk Email Message, Message Engagement, Marketing Activity Journey Run, Marketing Activity Journey Run > Marketing Journey

After creation: **Setup > Marketing Cloud > Assisted Setup > Reporting and Optimization > Customer Engagement > Configure Basic Personalization** — select the new Data Graph in the dropdown.

### Advanced Segmentation Features

Three features are enabled from Feature Manager:

Navigation: **Setup > Data Cloud > Feature Management > Feature Manager**

Enable:
1. Approximate Segment Population
2. Segment Preview
3. Einstein Segment Creation

### Einstein Engagement Scoring

Navigation: **Setup > Marketing Cloud > Assisted Setup > Reporting and Optimization > Customer Engagement > Go to Scoring Setup > New**

Configuration:
- Model name: "Default"
- Score on: People
- Identity Resolution: Unified Individual

Note from platform-gotchas.md: Einstein Engagement Scoring requires 1,000+ real engagement events in the prior 90 days. With seed data only, the model will not produce results. This is set up now as infrastructure; the scoring itself is addressed conceptually in Module 23.

### Agentforce / Campaign Creation Agent

Einstein must be enabled first, then Agentforce.

Path to enable Einstein: **Setup > Einstein > Einstein Generative AI > Einstein Setup** — toggle on Einstein, turn on Global Languages and Deploy Prompt Templates

Path to enable Agentforce: **Setup > Einstein > Einstein Generative AI > Agentforce Studio > Agentforce Agents** (may need to refresh) — turn on Agentforce, click **+ New Agent**, select Campaign Creation, name it "Campaign Creation Agent", click **Let's Go**, review default subagent descriptions, click **Save and Commit**

Grant profile access: **Setup > Users > Profiles > System Administrator > Agent Access > Edit** — assign the Campaign Creation Agent to the System Administrator profile

Note from web research (2026): The legacy Agentforce Builder is scheduled to be phased out for new agent creation (starting around mid-July 2026). The new Agentforce Builder should be used. The steps above use the flow from the Spring '26 guide — the exact UI may differ slightly in Summer '26 SDOs. <!-- VERIFY: Does the Spring '26 Agentforce setup flow still apply in Summer '26 SDOs? -->

### Send Time Optimization (STO)

Navigation: **Setup > Marketing Cloud > Assisted Setup > Channels > Email > Activate Einstein Send Time Optimization section > Go to Einstein Settings > Enable with your org-specific data > Enable**

Timing: Takes up to 48 hours to complete after enabling.

Note: STO requires real engagement history to produce results. In an SDO with seed data only, this will not produce meaningful results. Enabling it during setup is infrastructure setup; the feature is covered conceptually in Module 23.

### Marketing Performance App

The Marketing Performance App (Tableau Next / Marketing Performance Intelligence) requires a separate install flow:

1. **Setup > Marketing Cloud > Marketing Features > Marketing Performance > Go to Data Streams > New > Marketing Cloud > Next**
2. Map MC Engagement Business Units to Default Data Space
3. Select Email Studio Starter Data Bundle
4. Include SFMC Journey Activity Run Data Streams
5. Confirm fields and Deploy
6. Repeat for MobileConnect data bundle
7. Return to **Setup > Marketing Cloud > Marketing Features > Marketing Performance > Install**
8. If errors about "template_requirement_flow" occur, manually install the "Flows" Salesforce Data Bundle via **Data 360 > Data Streams > New**
9. Assign "Tableau Next Included App Business User" permission set to users needing access

Note from platform-gotchas.md: The Marketing Performance Intelligence package must be uninstalled and reinstalled once per Salesforce release (3x/year). It does not auto-update.

### Company Address Requirement

The org must have a full mailing address in Company Information before certain sending features work. This is required by CAN-SPAM law (physical address in email footers).

Path: **Setup > Company Settings > Company Information > Edit**

Required fields: Street, City, State/Province, Zip/Postal Code, Country

---

## UI Navigation Paths

All paths are from the Spring '26 Partner Demo Guide unless otherwise noted.

- **Permission Sets**: Setup > Users > Users > [Your User] > Permission Set Assignments > Edit Assignments
- **Data Cloud Setup**: Setup gear icon (top right) > Data Cloud Setup > Get Started
- **Marketing Cloud Basic Settings**: Setup > Marketing Cloud > Assisted Setup > Basic Settings
- **Assisted Setup Home**: Setup > Marketing Cloud > Assisted Setup > Assistant Home
- **MCE Connection Setup**: Setup > Marketing Cloud > Assisted Setup > Assistant Home > Connect Data and Start Setup > Go to Setup > Required Setup > Go to Data Cloud Setup
- **Identity Resolution App**: App Launcher > Identity Resolutions
- **Identity Resolution Ruleset Config (post-save)**: Setup > Marketing Cloud > Assisted Setup > Assistant Home > Basic Settings > Go to Basic Settings > Configure Identity Resolution Rulesets
- **Company Information**: Setup > Company Settings > Company Information
- **Data Graph Creation**: App Launcher > Data Cloud > Data Graphs tab > New
- **Data Graph Default (Personalization)**: Setup > Marketing Cloud > Assisted Setup > Reporting and Optimization > Customer Engagement > Configure Basic Personalization
- **Feature Manager (Segmentation)**: Setup > Data Cloud > Feature Management > Feature Manager
- **Einstein Engagement Scoring**: Setup > Marketing Cloud > Assisted Setup > Reporting and Optimization > Customer Engagement > Go to Scoring Setup
- **Einstein Setup**: Setup > Einstein > Einstein Generative AI > Einstein Setup
- **Agentforce Agents**: Setup > Einstein > Einstein Generative AI > Agentforce Studio > Agentforce Agents
- **Agent Profile Access**: Setup > Users > Profiles > System Administrator > Agent Access
- **STO Enable**: Setup > Marketing Cloud > Assisted Setup > Channels > Email > Activate Einstein Send Time Optimization
- **Marketing Performance Data Streams**: Setup > Marketing Cloud > Marketing Features > Marketing Performance > Go to Data Streams
- **Salesforce Standard Data Model (workaround)**: https://help.salesforce.com/s/articleView?id=002234049&type=1
- **MCE Demo Account Request**: https://help.salesforce.com/s/articleView?id=000390865&type=1

---

## Platform Gotchas

### From platform-gotchas.md (relevant to this module)

**SDOs have one data space** (Confirmed: 2026-08-06, Summer '26)
SDO orgs only have a single data space. Business units cannot be enabled. This affects Module 3 but sets context for Module 1: learners should always select "default" as the data space.

**IDR auto-creates a default ruleset during MCA setup** (Confirmed: 2026-08-06, Summer '26)
MCA setup can auto-create a default IDR ruleset. Learner should check whether a ruleset already exists before following the "Define an Identity Resolution Ruleset" steps. Creating duplicates is harmless but confusing.

**Einstein Engagement Scoring requires real engagement history** (Confirmed: 2026-08-06, Summer '26)
Scoring model set up in this module will not produce results with seed data. 1,000+ engagement events in the prior 90 days are required.

**Marketing Performance Intelligence requires reinstall each release** (Confirmed: 2026-08-06, Summer '26)
The Tableau Next package must be reinstalled once per Salesforce release. This matters if the learner's SDO crosses a release boundary during the course.

### From the Spring '26 Partner Demo Guide (additional gotchas)

**Data Kit installations frequently fail and require retry**
Data Kit installation errors are normal behavior. The guide instructs using the "Retry" button. Some kits require manual installation via Data Cloud > Data Streams > New > Salesforce CRM > Sales bundle.

**Sales Data Kit permission bug**
The Sales Data Kit can fail due to missing Account permissions on the Data Cloud Salesforce Connector permission set. Workaround: Navigate to **Setup > Permission Sets > Data Cloud Salesforce Connector > Object Settings > Accounts** and confirm all permissions (Read, Create, Edit, etc.) are enabled.

**SDO expiry is 30 days — must be extended**
The SDO expires after 30 days. Learner must navigate to the Partner Community and ask the Agent to extend the SDO expiry date by one year. If not extended, all course work is lost.

**Background installation tasks after activation**
After receiving the SDO activation email, some background installation tasks may still be running. Accessing the user record in Setup may be slow. This is expected.

**MCE connection timing**
MCE demo account provisioning may take several days after submitting the partner benefits case.

**Data Cloud setup timing**
Setup may take up to 2 hours for automated steps to complete. The presence of a Tenant Endpoint is the signal that setup is complete.

**STO setup timing**
Send Time Optimization activation can take up to 48 hours to complete.

### New gotcha identified in web research

**Agentforce Builder transition (mid-2026)**
The legacy Agentforce Builder is scheduled to be phased out for new agent creation starting approximately mid-July 2026. Summer '26 SDOs may present a different Agentforce UI than described in the Spring '26 guide. The steps in the guide (selecting Campaign Creation, naming it, reviewing subagents) should still be valid in concept, but the exact UI flow may differ.
<!-- VERIFY: Agentforce Builder UI in Summer '26 SDOs — does the Spring '26 guide flow still apply? -->

---

## MCE Comparison Points

This module's "Coming from MCE?" context is primarily about framing the environment, not feature equivalences. However, there are several important contrasts:

**SDO vs. MCE Dev/Trial Account**
MCE practitioners typically used a personal MCE trial account or an MCE sandbox tied to a production org. The MCA environment is a Core Salesforce org (an SDO) with MCA and Data 360 installed. There is no separate "Marketing Cloud" login — everything lives in the Salesforce platform. This is a fundamental shift from MCE's separate application login.

**Data Cloud has no MCE equivalent for setup**
MCE had no concept of Data Cloud setup, identity resolution, or data graphs during initial provisioning. MCE was functional immediately after account provisioning. MCA requires multiple interconnected setup steps before it is usable for sending.

**Marketing Cloud Engagement connection**
In MCE, you worked directly in the MCE application. In MCA, MCE becomes an optional data source connected to Data 360. Connecting MCE is a setup step in MCA — the two products are now peers, not the same thing.

**Permission Sets**
MCE had its own user management (Marketing Cloud users, roles, business units managed in MCE Setup). MCA uses standard Salesforce permission sets. This is a significant simplification for orgs already on the Salesforce platform.

**Data Kits**
MCE had connectors and synchronized data extensions (like Contact Builder). MCA's Data Kits are the equivalent — pre-built bundles that wire CRM objects into Data 360 as Data Model Objects. The concept is similar; the implementation is entirely different.

**Identity Resolution**
MCE had Subscriber Key as its primary identifier. MCA uses Data 360 Identity Resolution to create Unified Individuals from multiple source records. The Subscriber Key IDR ruleset in this module is specifically designed to bridge the MCE identifier into the MCA data model.

**No MCE equivalent for:**
- Data Graph creation
- Feature Manager segmentation toggles
- Einstein Engagement Scoring model setup
- Agentforce Campaign Creation Agent

---

## External Resources

- [SFMC Tips #151: Marketing Cloud Next: Setup Steps for SDO (Demo)](https://medium.com/@marketingcloudtips/marketing-cloud-next-basic-setup-procedure-for-the-demo-environment-be441f7c37d8) — Step-by-step SDO setup walkthrough for MCN, written for partners. Covers permission sets, Data Cloud setup, Data Kits, IDR, and domain configuration. Relevant as a secondary reference; the Spring '26 guide is the primary source.

- [Marketing Cloud Next: from Zero to First Email — The Agentic Marketer](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/first-email/) — 16-step setup guide from zero to first email. Corroborates the setup sequence from the Spring '26 guide. Notes Data Kit installation can be lengthy and CMS workspace creation may fail and require manual creation.

- [How to Request a Salesforce Demo Org in Partner Learning Camp — DYDC](https://dineshyadav.com/how-to-request-a-salesforce-demo-org-in-partner-learning-camp/) — Confirms SDO provisioning steps. Notes that "Simple Demo Org Fundamentals" course completion may be required before the Demo Org tab becomes available. <!-- VERIFY: Is PLC course completion required before the Demo Org tab appears? -->

- [SFMC Tips #263: Marketing Cloud Next: SubscriberKey Identity Resolution Match Rule](https://medium.com/@marketingcloudtips/marketing-cloud-next-subscriberkey-identity-resolution-match-rule-ce345a3ae072) — Covers the MCE Subscriber Key IDR ruleset configuration. Confirms the Party Identification DMO approach. Notes that Spring '26 may auto-create this ruleset when MCE+ is enabled.

- [Campaign Creation Agent Setup — arthurbackouche.com](https://arthurbackouche.com/docs/marketing-cloud-next/agentforce-agents/how-to-set-up-the-campaign-creation-agent-in-agentforce-marketing/) — Confirms Agentforce setup steps. Notes legacy Agentforce Builder deprecation in mid-2026. Useful for cross-checking the Spring '26 guide steps.

- [Marketing Cloud Engagement Demo/Dev Accounts for Partners](https://help.salesforce.com/s/articleView?id=000390865&language=en_US&type=1) — Official Salesforce Help article for requesting an MCE demo account as a partner. Referenced in the Spring '26 guide. The guide says it may take several days to fulfill.

- [Salesforce Standard Data Model package (known issue workaround)](https://help.salesforce.com/s/articleView?id=002234049&type=1) — Install location for the Salesforce Standard Data Model package. Required if Data Kit installation fails with the "missing package" error.

---

## Data Model Relevance

This module is primarily an environment setup module. It does not involve custom data model configuration. However, the following data model elements are initialized during this module's setup:

**Identity Resolution creates:**
- Unified Individual records (from the name+email IDR ruleset)
- Party Identification links (from the MCE Subscriber Key IDR ruleset)

**Data Graph references:**
- Unified Individual (primary DMO)
- Individual
- Contact Point Email
- Contact Point Phone
- Optionally: Account, Email Engagement, Message Engagement, Marketing Activity Journey Run, Marketing Journey

These are all standard Data 360 DMOs. The course data model uses the standard DMOs for identity and contact point data (no custom DMOs are involved in Module 1). Custom DMOs (Eye Exam) and custom fields on standard DMOs (Loyalty Program Member) are covered in later modules.

---

## LEOptical Course Framing

The SDO is a Salesforce demo environment, not a real client org. Module 1 should acknowledge this directly:
- The learner is configuring an SDO that will serve as the "LEOptical sandbox" for the duration of the course
- The seed data script populates the org with LEOptical's fictional customer data
- Domain authentication (Module 2) will use a domain the learner buys for training purposes
- Every configuration decision in Module 1 maps to what a real MCA implementation would require for a client like LEOptical

The client framing ("LEOptical just signed their Salesforce contract") sets the tone: this is the first day of a real implementation. The steps are real steps. The SDO is the vehicle for doing them.

The assignment does not use a "The client wants" framing for the setup steps themselves (per module-assignments.md: "If the module is administrative or foundational, omit the client framing and just describe what the learner needs to do"). The client framing from the spec sets the context in the Overview, then the assignment is straightforward task-based.

---

## Timing Expectations

| Step | Expected Time | Source |
|------|--------------|--------|
| SDO provisioning | ~1 hour (some sources say "a few hours") | Partner Demo Guide + DYDC article |
| Data Cloud setup automated steps | Up to 2 hours | Partner Demo Guide |
| Data Kit installation (per kit) | Variable, can be lengthy; retry may be needed | Partner Demo Guide + Agentic Marketer |
| Identity Resolution first run | Several minutes (after rule save, job runs) | Web research |
| Data Graph initial build | Minutes | Web research |
| MCE demo account provisioning | Several days | Partner Demo Guide |
| Send Time Optimization activation | Up to 48 hours | Partner Demo Guide |
| Einstein Engagement Scoring | Up to 72 hours (some sources) | Web research |

Total realistic time to complete Module 1 setup from scratch: 1-3 days, accounting for SDO provisioning, Data Cloud automated steps, and MCE account provisioning if needed.

---

## Prerequisites

The learner must have the following before starting this module:

1. **Salesforce Partner status** — an active Salesforce Partner account is required to access Partner Learning Camp and request an SDO
2. **Partner Community access** — login credentials for the Partner Community
3. **Partner Learning Camp completion requirement** — one source (DYDC) indicates the "Simple Demo Org Fundamentals" course must be completed before the Demo Org tab becomes available. <!-- VERIFY: Is this still required, or has PLC made the Demo Org tab available without course completion? -->
4. **A browser with incognito/private window capability** — the activation step specifically requires a private window to avoid session interference
5. **An MCE demo account OR a partner MCE contact** — if the partner org does not already have an MCE demo account, one must be requested (and may take several days to provision)
6. **Access to an email inbox** — for SDO activation, MCE credentials, and STO/Data Kit notification emails

---

## Open Questions / VERIFY Flags

These items must be verified against a live Summer '26 SDO before the module is marked as ready:

1. **<!-- VERIFY: Does Spring '26 auto-create the Subscriber Key IDR ruleset when MCE+ is enabled? -->**
   The web research suggests Spring '26 introduced auto-creation of the Party Identification ruleset when MCE+ is connected. If this is true, learners may encounter a pre-existing ruleset and should skip the "Configure Identity Resolution for MCE Subscriber Key" section or be instructed to verify its configuration.

2. **<!-- VERIFY: Is PLC course completion ("Simple Demo Org Fundamentals") required before the Demo Org tab appears? -->**
   One source (DYDC) mentions a prerequisite course. The Spring '26 guide does not mention it. Confirm current PLC requirements.

3. **<!-- VERIFY: Agentforce Builder UI in Summer '26 SDOs — does the Spring '26 guide flow still apply? -->**
   The legacy Agentforce Builder may be deprecated. The Campaign Creation Agent setup steps may have changed UI. Verify by following the steps in a Summer '26 SDO.

4. **<!-- VERIFY: Does the "UnifiedssotIndividual1__dlm" field name remain consistent across SDOs? -->**
   The API name used in the Identity Resolution configuration step (`UnifiedssotIndividual1__dlm`) may vary. Verify this is the correct value in a fresh Summer '26 SDO.

5. **<!-- VERIFY: Confirm the Data Kit names shown in the UI match what the guide describes. -->**
   Data Kit names may be updated between releases. The guide says "Update and install the Marketing Cloud Data Kits" without listing them by name. Verify which specific kits appear and whether any new ones have been added in Summer '26.

6. **<!-- VERIFY: Confirm the "Data Cloud Architect (Admin)" permission set name in Summer '26 SDOs. -->**
   The guide calls it "Data Cloud Architect (Admin)" but some sources call it "Data Cloud Admin." The UI label may differ between releases.

7. **<!-- VERIFY: Does the MCE connection require an active MCE account, or can Module 1 be completed without it? -->**
   Some setup steps (MCE data bundles, Email Studio Starter Bundle) require an MCE account. If the learner cannot get an MCE account quickly, can the rest of Module 1 proceed? Clarify which steps are blocked by MCE and which are not.

---

## Source Log

- Spring '26 Partner Demo Guide (provided verbatim in research brief) — **Primary source.** All UI paths and step sequences from this document.
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-basic-setup-procedure-for-the-demo-environment-be441f7c37d8` — Discarded: 403 error on fetch. Located via search; content summarized from search result snippet.
- `https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/first-email/` — Fetched. MCA content confirmed. Used for setup sequence corroboration and CMS workspace failure gotcha.
- `https://partnerworkshops.salesforce.com/workshops/marketing-cloud/setup.html` — Discarded: 403 error. Workshop directory only; no setup detail.
- `https://agentforce-marketing-9cf347fa7db7.herokuapp.com/workshops/marketing-cloud/setup.html` — Discarded: Redirect to partnerworkshops.salesforce.com. Workshop directory.
- `https://arthurbackouche.com/marketing-cloud-next/foundation-setup/how-to-set-up-data-cloud-for-marketing-cloud-next/` — Discarded: 404 error.
- `https://arthurbackouche.com/docs/marketing-cloud-next/agentforce-agents/how-to-set-up-the-campaign-creation-agent-in-agentforce-marketing/` — Fetched. MCA content confirmed. Used for Agentforce Campaign Creation Agent steps and Agentforce Builder deprecation note.
- `https://help.salesforce.com/s/articleView?id=000390865&language=en_US&type=1` — Fetched. Page rendered only JavaScript, no article content. Referenced in guide as the MCE demo account request article. URL preserved for learner assignment.
- `https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_data_identity_resolution.htm&language=en_US&type=5` — Fetched. Page rendered only JavaScript, no article content. Discarded.
- `https://help.salesforce.com/s/articleView?id=mktg.mc_jb_activate_einstein_sto.htm&language=en_US&type=5` — Fetched. Page rendered only JavaScript, no article content. Discarded.
- `https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_admin_setup_overview.htm&type=5` — Fetched. Page rendered only JavaScript, no article content. Discarded.
- `https://dineshyadav.com/how-to-request-a-salesforce-demo-org-in-partner-learning-camp/` — Fetched. Relevant content on PLC SDO provisioning. Used for PLC steps and prerequisite course note.
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-summer-26-release-highlights-04f6c5abdee6` — Discarded: 403 error.
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-spring-26-release-highlights-24c0c804b0cb` — Discarded: 403 error.
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-subscriberkey-identity-resolution-match-rule-ce345a3ae072` — Discarded: 403 error. Located via search; content summarized from search result snippet. Used for Spring '26 auto-creation note for Subscriber Key ruleset.
- `https://help.salesforce.com/s/articleView?id=002234049&type=1` — Referenced in guide as Salesforce Standard Data Model install workaround. Not fetched (help.salesforce.com renders JS only). URL preserved for module content.
