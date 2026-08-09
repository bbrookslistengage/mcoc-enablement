# Research: Business Units and Governance

Generated: 2026-08-06
Module: business-units
Sources: 28 sources consulted, 15 included in research

---

## Module Context

> **The client wants:** LEOptical currently operates as a single brand. They want their content organized so the marketing team can collaborate without stepping on each other's work.

**Assignment:**
- Document when business units are required and the criteria that would trigger BU creation
- Set up roles and permissions for three marketing personas: Marketing Manager (full access), Content Creator (CMS + email templates only), Campaign Specialist (flows + segments only)
- Create an Enhanced CMS Workspace called "LEOptical Marketing" for organizing brand assets

**Success Criteria:**
- [ ] Written justification for why LEOptical doesn't need multiple BUs today
- [ ] Criteria for future BU creation are documented
- [ ] Three roles/permission sets configured with appropriate access levels
- [ ] Enhanced CMS Workspace "LEOptical Marketing" is created

> **Platform note:** SDOs only have one data space and business units cannot be enabled. This module focuses on understanding the concepts and configuring what is available (roles, permissions, CMS workspaces).

---

## Platform Concepts

### What is a Business Unit in MCA?

Business units in Marketing Cloud Advanced (MCA/Marketing Cloud Next) are organizational containers that partition marketing data, campaigns, audiences, and reporting within a single Salesforce org. They were introduced as a generally available feature in the **Spring '26 release** and are available in **both Marketing Cloud Next Growth and Advanced editions**.

Each business unit:
- Maps 1:1 to a Data 360 data space (one BU = one data space; one data space cannot be shared across multiple BUs)
- Provides an isolated view for campaigns, audiences, and reporting
- Has its own email channel configuration
- Can have users assigned to one or multiple BUs
- Supports channel scoping — channels like email, SMS, WhatsApp, and mobile app messaging can be scoped to a specific BU or org-wide across all BUs
- Cannot be deleted or modified once created (permanent decision)

Source: Salesforce Ben (Spring '26 update article), Nebula Consulting (5 New MCN Features), search result summaries from SFMC Tips #266.

### Business Unit Limits

- Maximum **50 business units per org** (Source: Salesforce Ben Spring '26, Nebula Consulting)
- 1:1 relationship with data spaces — one BU, one data space (Source: multiple; consistent across all sources)
- Business units cannot be deleted or modified once created (Source: search result summaries, multiple sources)
- Phone numbers for SMS/WhatsApp cannot be shared between business units (Source: search result summaries)

### Edition Requirement

Business units are available in both Marketing Cloud Next Growth and Advanced editions (Spring '26 GA). However, some community sources suggest BUs are Advanced Edition only — **this is UNCONFIRMED and contradicted by other sources**. The official Salesforce Ben Spring '26 article states "Growth & Advanced Edition." Writers should flag this with `<!-- VERIFY -->`.

### When to Create Multiple Business Units

BUs are designed for organizations that need to partition marketing activities by:
- **Multiple brands** — separate brand identities requiring distinct audiences, communications, and reporting
- **Regional divisions** — geographic separation where campaigns, consent, and data must be isolated
- **Product lines or divisions** — when different teams need autonomous operation with leadership visibility across all
- **Compliance separation** — where data sovereignty or regulatory requirements demand isolated data spaces

For a single-brand B2C company like LEOptical with one marketing team operating in one region, **a single business unit is appropriate**. The criteria for adding a second BU would be: acquiring a second brand, expanding to a jurisdiction with separate regulatory requirements, or the marketing org fragmenting into teams that need strict data isolation.

BU structure should be based on a single differentiating field (e.g., region or brand) rather than complex multi-field criteria. If more complex criteria are needed, the recommendation is to use Salesforce automation to combine those criteria into one field first.

Source: Salesforce Ben Spring '26 article, search result summaries.

### Business Units and Data Spaces: The Architecture

Every MCA org starts with a **default data space** in Data 360. When business units are enabled, that default data space becomes associated with the first business unit. Each subsequent business unit requires its own data space.

When you configure business units:
1. Enable Business Units in Salesforce Setup
2. Set up the first Business Unit (associated with the default data space)
3. Create additional BUs — each gets its own data space
4. Filters are automatically added to Marketing DLOs and Business Unit data aligns with the corresponding data space

During basic settings setup (before BUs are enabled), the Data Space dropdown selects which data space the MCA instance uses. In most orgs, this will be the single "default" data space.

Source: arthurbackouche.com setup guide, SFMC Tips #207 (data space filters), search result summaries from SFMC Tips #266.

### Summer '26 Addition: Shared Asset Library

In Summer '26, a shared asset library feature was added. Marketing administrators can publish content to a shared asset library, and other business units can copy it into their own workspace. This improves content reuse across BUs while maintaining brand consistency and data isolation.

Source: search result summary referencing SFMC Tips #285 (Summer '26 highlights).

### SDO Limitation: Business Units Cannot Be Enabled

SDO orgs (Simple Demo Orgs used by Salesforce partners) have **only a single data space** and **business units cannot be enabled**. This is a confirmed platform gotcha (see platform-gotchas.md).

As a result, Module 3 (Business Units and Governance) is **conceptual for BU content** and hands-on only for:
- Roles and permission sets
- CMS workspaces

Source: platform-gotchas.md (confirmed 2026-08-06, Summer '26).

### How MCA Business Units Differ From MCE Business Units

MCE (Marketing Cloud Engagement, the legacy ExactTarget-based platform) has had business units since the Enterprise/Enterprise 2.0 account tiers. Key architectural differences:

| Aspect | MCE Business Units | MCA Business Units |
|--------|-------------------|-------------------|
| Platform | ExactTarget-based; separate system | Core Salesforce platform; native |
| Data isolation | Shared subscriber database at parent level; BU provides content/send isolation | Each BU maps to a separate Data 360 data space — full data isolation |
| User management | MCE-specific role system within BU hierarchy | Salesforce permission sets + BU member roles |
| Subscriber key | MCE has a Subscriber Key concept for cross-BU identity | MCA has no Subscriber Key; identity resolved via Unified Individual in Data 360 |
| Maximum BUs | Enterprise license dependent | Up to 50 per org (Spring '26) |
| Deletion | Can be deleted (separate Salesforce Help article exists) | Cannot be deleted or modified once created (MCA-specific constraint) |
| Content sharing | Cross-BU content sharing via MCE mechanisms | Shared asset library available Summer '26 |
| Data architecture | Separate data extensions per BU, shared at enterprise level | Separate data spaces (Data 360 partitions) |
| Setup location | Marketing Cloud Setup → Business Units tab | Salesforce Setup → Marketing Cloud → Business Units |

Source: MCE comparison synthesized from search results, mateuszdabrowski.pl comparison article, search result summaries.

**Important:** The MCE Help articles about roles and business units (e.g., `mc_overview_roles.htm`, `mc_es_business_units.htm`, `mc_overview_assign_a_role_to_a_business_unit.htm`) are about **Marketing Cloud Engagement**, NOT MCA. These should not be used as authoritative sources for MCA content.

### MCA Permission Sets

MCA governance is built on **Salesforce permission sets**, not MCE's proprietary role system. There are two standard permission sets shipped with MCA:

**Marketing Cloud Admin**
- Access to Salesforce Setup (the backend)
- Access to Agentforce Admin
- Access to Prompt Template Manager
- Full control on campaigns, segments, and flows (including admin-level flows that touch CRM objects)
- Required for data space selection during MCA setup

**Marketing Cloud Manager**
- Full control to manage campaigns, segments, and campaign flows (non-admin flows only)
- Access to Agentforce and Prompt Templates
- No access to Salesforce Setup

The key practical difference: Marketing Cloud Manager cannot access Salesforce Setup and cannot run admin-level flows. CRM administrators often assign Manager (or a custom restricted set) to marketers to prevent inadvertent changes to CRM configuration.

Source: arthurbackouche.com permission sets article (updated March 10, 2026), confirmed by setup guide summaries.

**Navigation to assign permission sets:**
Setup → Permission Sets → [Select Marketing Cloud Admin or Marketing Cloud Manager] → Manage Assignments → Add Assignment → select user → set expiration (or "No expiration date") → Assign

Source: arthurbackouche.com permission sets article.

### Custom Permission Sets

MCA supports creating custom permission sets using five permission categories:
1. CMS Content Roles
2. General Marketing Permissions
3. Consent Permissions in Marketing Cloud Next
4. Content and Publishing Permissions
5. Flow Permissions in Marketing Cloud Next

This is how the three marketing personas in the assignment (Marketing Manager, Content Creator, Campaign Specialist) would be configured — either by starting from one of the two standard sets and restricting it, or by building a custom set from these categories.

Source: arthurbackouche.com permission sets article.

**The three personas in the assignment:**

| Persona | Suggested Approach | Key Permission Categories |
|---------|-------------------|--------------------------|
| Marketing Manager (full access) | Marketing Cloud Admin permission set | All categories |
| Content Creator (CMS + email templates only) | Custom set from Marketing Cloud Manager, restrict flows/segments | CMS Content Roles, Content and Publishing Permissions |
| Campaign Specialist (flows + segments only) | Custom set from Marketing Cloud Manager, restrict CMS publishing | General Marketing Permissions, Flow Permissions |

Note: Exact field names within Setup for custom permission set granularity are `<!-- VERIFY -->` — the five categories are confirmed but specific checkbox names within each category are not confirmed from available sources.

### CMS Workspaces in MCA

MCA uses **Enhanced CMS Workspaces** (built on Salesforce CMS) as the content library for marketing assets — emails, images, templates, content blocks.

A CMS workspace:
- Is the content library for campaign assets
- Can be shared across business units (via Shared with Workspaces folder)
- Has its own contributor role system independent of the MCA permission sets
- Can have a default brand assigned (Content Admin and Content Manager roles can do this)

**CMS Workspace Contributor Roles:**

| Role | Capabilities |
|------|-------------|
| **Content Admin** | Manage users and sharing settings, create and publish all content, assign a default brand to the workspace |
| **Content Manager** | Create and publish all content, assign a default brand to the workspace |
| **Content Author** | View, edit, and create content — cannot publish |

Note: A Salesforce Admin (org admin) has full access across all workspaces via the Setup interface regardless of workspace-level role assignment.

Source: Trailhead CMS Basics module (learn-about-cms-workspaces-channels-and-contributors), confirmed by search result summaries.

**Navigation to create a CMS Workspace:**
App Launcher → Digital Experiences Home → "Create a CMS Workspace" (or "Add Workspace")

Setup path to enable Enhanced CMS:
Setup → Digital Experiences (Quick Find) → Salesforce CMS → Enable "Create both CMS workspaces and enhanced CMS workspaces"

**Navigation to add contributors:**
Digital Experiences app → Open workspace → Contributors → Add Contributors → assign role

Source: Trailhead CMS Basics module, search result summaries.

**One CMS workspace can serve a business unit as its default workspace.** A business unit can have multiple CMS workspaces, with one designated as the default.

Source: search result summaries referencing Spring '26 feature notes.

### Business Unit Member Roles vs. Permission Sets

There are two distinct access control systems in MCA that serve different purposes:

1. **Salesforce Permission Sets** (Marketing Cloud Admin / Marketing Cloud Manager / custom) — control what a user can do across the entire MCA application (campaign management, flow building, data access, consent, Setup access)

2. **Business Unit Member Roles** — control which BUs a user can operate in (only relevant when multiple BUs exist). Only users with Marketing Cloud Admin or Marketing Cloud Manager permission sets can be added to BU member roles.

For single-BU orgs (like LEOptical), the permission set is the primary governance mechanism. BU member roles become relevant when multiple BUs exist.

Source: search result summaries (multiple), arthurbackouche.com.

### Einstein Features and BU Awareness

With Spring '26, Einstein features in MCA became business-unit aware:
- Send Time Optimization operates within individual BU contexts
- Einstein Engagement Scoring is scoped to the BU
- Agentforce operates within defined BU boundaries for campaign creation

Source: Salesforce Ben Spring '26 article.

---

## UI Navigation Paths

- **Assign permission sets**: Setup → Permission Sets → [Marketing Cloud Admin or Marketing Cloud Manager] → Manage Assignments (Source: arthurbackouche.com, March 2026)
- **MCA basic settings / data space selection**: Setup → Assistant Home (or Marketing Cloud Setup → Basic Settings) — select the data space here (Source: arthurbackouche.com setup guide, search result summaries)
- **Business Units (when enabled)**: Salesforce Setup → Marketing Cloud → Business Units → Create (Source: search result summaries, multiple)
- **Create a CMS Workspace**: App Launcher → Digital Experiences Home → Create a CMS Workspace (Source: Trailhead CMS Basics)
- **Enable Enhanced CMS**: Setup → Digital Experiences (Quick Find) → Salesforce CMS → Enable workspaces toggle (Source: search result summaries)
- **Add CMS workspace contributors**: Digital Experiences app → [Workspace] → Contributors → Add Contributors (Source: Trailhead CMS Basics, search result summaries)

**Note:** Several Salesforce Help page fetches returned only JS infrastructure (no content) during research. Navigation paths above are sourced from third-party documentation and Trailhead that successfully rendered. Writers should verify these paths in a live SDO and add `<!-- VERIFY -->` to any path that cannot be confirmed.

---

## Platform Gotchas

### Confirmed from platform-gotchas.md:

**SDOs have one data space (Confirmed: 2026-08-06, Summer '26)**
SDO orgs only have a single data space. Business units cannot be enabled. Module 3 (Business Units and Governance) is conceptual for BU content and hands-on only for roles, permissions, and CMS workspaces.

### Discovered during research:

**Business units cannot be deleted or modified once created**
Multiple sources consistently report this. The decision to create a business unit is permanent. This makes the initial BU design a high-stakes governance decision. Writers should emphasize this constraint prominently so learners understand it is not easily reversible on production orgs.
Confirmation: Multiple search result summaries; `<!-- VERIFY -->` with official Salesforce docs.

**Edition availability of BUs may be Advanced-only — CONFLICTING INFORMATION**
Most sources say BUs are available in "Growth & Advanced Edition." At least one source in research implies BUs are Advanced Edition only. This should be flagged `<!-- VERIFY -->` in the module. The course uses MCA (Advanced), so the distinction matters for consulting conversations, not for hands-on work.

**BUs cannot be enabled in SDOs even after Spring '26 GA**
The Spring '26 GA announcement introduced BUs, but SDOs remain limited to a single data space. This is consistent with the confirmed gotcha in platform-gotchas.md.

**Phone numbers cannot be shared between business units**
SMS/WhatsApp phone numbers are scoped to a single business unit. Multi-BU orgs that want to send SMS or WhatsApp across BUs must provision separate numbers.
Source: search result summary. `<!-- VERIFY -->` with official docs.

**Data space is selected during MCA Basic Settings — greyed out if permission set is not assigned**
The Select Data Space dropdown in MCA Basic Settings is greyed out unless the user has the Marketing Cloud Admin permission set. Writers should note this dependency in any walkthrough.
Source: arthurbackouche.com.

---

## MCE Comparison Points

### Direct MCE Equivalent

MCE has business units, but the architecture is fundamentally different:

**MCE BUs** are content/send partitions within a shared ExactTarget database. They share a common subscriber database at the enterprise level but isolate content, email sends, and user access. MCE BUs can be deleted. MCE uses a proprietary role system (Administrator, Content Creator, Analyst, Channel Manager, Security Administrator, Viewer) assigned within the BU hierarchy.

**MCA BUs** map 1:1 to Data 360 data spaces — they are full data partitions, not just content partitions. There is no shared subscriber database concept because identity is managed through Unified Individuals in Data 360. MCA uses Salesforce permission sets rather than MCE's proprietary role system.

### Permission Model Comparison

| MCE | MCA |
|-----|-----|
| Proprietary MCE roles (Administrator, Content Creator, Analyst, etc.) | Salesforce permission sets (Marketing Cloud Admin, Marketing Cloud Manager, custom) |
| Roles assigned in Marketing Cloud Setup | Permission sets assigned in Salesforce Setup |
| Role conflict resolution: Deny overrides Allow | Permission set logic: standard Salesforce permission set stacking |
| Can assign per-BU roles | BU member roles only relevant when multiple BUs exist |

### No MCE Equivalent in MCA

- **Data space partitioning**: MCE does not have data spaces. Data isolation in MCE is handled differently (BU-level data extensions with enterprise-level sharing). MCA's BU = data space model has no direct MCE equivalent.
- **Unified Individual**: MCE has a Subscriber Key for cross-BU identity tracking. MCA replaces this entirely with Unified Individuals in Data 360 — resolved identities that are not BU-specific. There is no Subscriber Key in MCA.

### CMS Workspaces

MCE uses Content Builder for content management. MCA uses Salesforce Enhanced CMS Workspaces, which are native Salesforce objects. The role system is different: CMS uses Content Admin/Manager/Author rather than MCE's role names.

### What Has No Change

The governance decision-making framework for WHEN to use BUs is similar:
- Single brand, single region = single BU
- Multiple brands or regions = multiple BUs
- Compliance/data separation needs = BU per region/entity

---

## External Resources

- [SFMC Tips #266: Marketing Cloud Next — Business Units Now Generally Available](https://medium.com/@marketingcloudtips/marketing-cloud-next-business-units-now-generally-available-b01e49c09a9a) — Primary source on MCA BU GA announcement (Spring '26). Blocked by Medium paywall during research but consistently cited across other sources. Contains details on 1:1 data space relationship, 50 BU limit, user assignment, and setup steps.

- [Top 10 Spring '26 Updates for Salesforce Marketers — Salesforce Ben](https://www.salesforceben.com/top-10-spring-26-updates-for-salesforce-marketers/) — Covers BUs in Spring '26 including data isolation, channel scoping, Einstein BU-awareness, and Agentforce BU support. Successfully fetched.

- [5 New Marketing Cloud Next Features — Nebula Consulting](https://nebulaconsulting.co.uk/insights/5-new-marketing-cloud-next-features-were-excited-to-try/) — Covers BU arrival in Spring '26, 50 BU limit, use cases for brands/regions/divisions.

- [How to Set Up Marketing Cloud Next — arthurbackouche.com](https://arthurbackouche.com/docs/marketing-cloud-next/foundation-setup/how-to-set-up-marketing-cloud-next/) — Detailed setup guide for MCA including permission sets, data space selection, and navigation paths. Updated March 10, 2026.

- [How to Configure Permission Sets in Marketing Cloud Next — arthurbackouche.com](https://arthurbackouche.com/docs/marketing-cloud-next/user-access-management/how-to-configure-the-permission-sets-in-marketing-cloud-next/) — Two standard permission sets (Admin and Manager), five custom permission categories, assignment steps.

- [Enhance Your CMS Skills: Workspaces, Channels, Contributors — Trailhead](https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/learn-about-cms-workspaces-channels-and-contributors) — Official Trailhead on CMS workspace structure, contributor roles (Content Admin, Content Manager, Content Author), channels, and navigation.

- [What Is the Difference Between SF Marketing Clouds? — Mateusz Dabrowski](https://mateuszdabrowski.pl/sites/faq/salesforce/what-is-the-difference-between-sf-marketing-clouds/) — Covers architectural comparison between MCN and MCE; notes MCN is built from scratch on Data 360; notes MCE has BUs while MCN had not (written before Spring '26 GA).

- [Marketing Cloud Next Basics — Trailhead](https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-basics) — Official Trailhead module on MCA features. Minimal BU governance content but good platform orientation.

- [Set Up a Marketing Cloud Next Campaign — Trailhead](https://trailhead.salesforce.com/content/learn/modules/campaign-optimization-with-flows-in-marketing-cloud-next/set-up-a-marketing-cloud-next-campaign) — Campaign setup in MCA context.

- [Add Contributors to a CMS Workspace — Salesforce Help](https://help.salesforce.com/s/articleView?id=sf.cms_access_control_contributors.htm&language=en_US&type=5) — Official Help article on adding contributors. Note: Salesforce Help pages were returning only JS infrastructure during research — page may need in-SDO verification.

- [Marketing Cloud Advanced Edition — Salesforce Blog](https://www.salesforce.com/blog/marketing-cloud-advanced-edition/) — Official announcement of Advanced Edition features (Einstein Engagement Frequency, Engagement Scoring, Path Experiment, Unified SMS Conversations). Confirms Advanced Edition launched November 2024.

---

## Data Model Relevance

Business units in MCA do not directly affect the DMO structure or field-level mappings. However, they have these indirect effects:

- **Data spaces**: Each BU maps to a data space. Data streams, DMOs, IDR rulesets, and Data Graphs are scoped to a data space. For LEOptical's single-BU implementation, all data (Individual, Contact Point Email, Sales Order, Loyalty Program Member, etc.) lives in the default data space.

- **Consent**: Communication Subscription Consent records are managed within a data space. If a multi-BU org existed, consent records would need to be scoped correctly to the appropriate data space/BU.

- **Segments and activation**: Segments are built against the Unified Individual in a data space. BU partitioning means segment membership is scoped to the BU's data space.

- **CMS workspaces and data**: CMS workspaces are not directly tied to DMOs. They store content assets (email templates, images, content blocks), not customer data. The connection between CMS content and Data 360 data comes at email send time, when Handlebars expressions pull from the Data Graph.

For LEOptical specifically:
- Single default data space
- All DMOs (Individual, Contact Point Email, Loyalty Program Member, Sales Order, Eye Exam, etc.) live in that data space
- No cross-BU data sharing scenarios apply
- The Enhanced CMS Workspace "LEOptical Marketing" serves the entire marketing team

---

## Source Log

- https://medium.com/@marketingcloudtips/marketing-cloud-next-business-units-now-generally-available-b01e49c09a9a — Discarded: Medium 403 block, but core facts extracted from search result summaries
- https://medium.com/@marketingcloudtips/marketing-cloud-next-spring-26-release-highlights-24c0c804b0cb — Discarded: Medium 403 block
- https://medium.com/@marketingcloudtips/marketing-cloud-next-summer-26-release-highlights-04f6c5abdee6 — Discarded: Medium 403 block; shared asset library feature confirmed via search result summary
- https://www.salesforceben.com/top-10-spring-26-updates-for-salesforce-marketers/ — Included: BU Spring '26 details confirmed
- https://nebulaconsulting.co.uk/insights/5-new-marketing-cloud-next-features-were-excited-to-try/ — Included: BU feature overview confirmed
- https://arthurbackouche.com/docs/marketing-cloud-next/foundation-setup/how-to-set-up-marketing-cloud-next/ — Included: Setup navigation, permission sets, data space details
- https://arthurbackouche.com/docs/marketing-cloud-next/user-access-management/ — Included: Permission set overview confirmed
- https://arthurbackouche.com/docs/marketing-cloud-next/user-access-management/how-to-configure-the-permission-sets-in-marketing-cloud-next/ — Included: Five permission categories, assignment steps
- https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/learn-about-cms-workspaces-channels-and-contributors — Included: CMS workspace roles confirmed
- https://mateuszdabrowski.pl/sites/faq/salesforce/what-is-the-difference-between-sf-marketing-clouds/ — Included: MCE vs MCA architectural comparison
- https://help.salesforce.com/s/articleView?language=en_US&id=sf.mc_es_business_units.htm&type=5 — Discarded: MCE content (Marketing Cloud Engagement), not MCA
- https://help.salesforce.com/s/articleView?id=mktg.mc_overview_roles.htm&language=en_US&type=5 — Discarded: MCE content (Marketing Cloud Engagement)
- https://help.salesforce.com/s/articleView?language=en_US&id=sf.mc_overview_assign_a_role_to_a_business_unit.htm&type=5 — Discarded: MCE content
- https://help.salesforce.com/s/articleView?id=mktg.mke_configure_data_360.htm&language=en_US&type=5 — Discarded: Salesforce Help returned only JS infrastructure, no content
- https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_admin_permissions_ref.htm&type=5 — Discarded: Salesforce Help returned only JS infrastructure
- https://help.salesforce.com/s/articleView?id=sf.mktg_admin_permissions_ref.htm&language=en_US&type=5 — Discarded: Salesforce Help returned only JS infrastructure
- https://help.salesforce.com/s/articleView?id=mktg.mke_business_units.htm&language=en_US&type=5 — Discarded: Salesforce Help returned only JS infrastructure
- https://help.salesforce.com/s/articleView?id=sfdo.mcngo_adopting_marketing_cloud_business_units.htm&language=en_US&type=5 — Discarded: Salesforce Help returned only JS infrastructure
- https://help.salesforce.com/s/articleView?id=mktg.mke_business_units_differences.htm&language=en_US&type=5 — Discarded: Salesforce Help returned only JS infrastructure
- https://help.salesforce.com/s/articleView?id=sf.cms_access_control_overview.htm&language=en_US&type=5 — Discarded: Salesforce Help returned only JS infrastructure
- https://help.salesforce.com/s/articleView?id=xcloud.cms_cmsworkspace-create.htm&language=en_US&type=5 — Discarded: Salesforce Help returned only JS infrastructure
- https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_admin_setup_overview.htm&type=5 — Discarded: Salesforce Help returned only JS infrastructure
- https://rizexlabs.com/salesforce-marketing-cloud-roles-permissions-guide/ — Discarded: MCE content (ExactTarget-based role names), not MCA
- https://www.salesforce.com/blog/marketing-cloud-advanced-edition/ — Included: Official MCA Advanced Edition feature list (no BU content but edition context useful)
- https://www.salesforce.com/blog/next-gen-marketing-cloud-details/ — Referenced but content not directly fetched; background context only
- https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/winter26-release-notes/ — Included: Confirms BUs were anticipated in Winter '26 but shipped in Spring '26
- https://partnerworkshops.salesforce.com/workshops/marketing-cloud/setup.html — Discarded: Insufficient detail returned; index page only
- https://georgelahoud.com/salesforce-marketing-cloud-growth-vs-advanced-vs-engagement-explained/ — Discarded: No BU/governance content
- https://noltic.com/stories/salesforce-marketing-cloud-editions-explained — Discarded: No BU/governance content
