# Research: Salesforce CMS and Content Management

Generated: 2026-08-12
Module: salesforce-cms
Sources: 22 sources consulted, 15 included in research

## Module Context

### Client Ask (from module-assignments.md)
> **The client wants:** A central place for marketing assets — logos, product images, legal copy, reusable content blocks.

### Full Assignment (Module 11 — Salesforce CMS & Content Management)
- In the "LEOptical Marketing" CMS Workspace (created in the Business Units & Governance module), create a content organization structure with collections for: Brand Assets, Product Images, Email Content Blocks, Legal/Compliance
- Upload LEOptical brand assets (logo, product images — provided in course resources)
- Create reusable CMS content items: standard email header, standard footer with legal disclaimer, and product description blocks for each of the 4 lens families
- Understand content types and how to create structured content (e.g., a "Product Feature" type with fields for name, description, image, price)

### Success Criteria
- [ ] CMS Workspace has organized collections
- [ ] Brand assets are uploaded and accessible
- [ ] Reusable content blocks exist for header, footer, and all 4 products
- [ ] Content is organized so another marketer could navigate it

### Note on Workspace Creation
The CMS workspace "LEOptical Marketing" is created in Module 3 (Business Units & Governance). Module 11 uses that workspace — it does not create it from scratch. The hands-on workspace creation belongs in `building-leoptical-content-library.md`.

## Platform Concepts

### What Salesforce CMS Is

Salesforce CMS is a hybrid content management system built into the Salesforce platform. It enables organizations to create, organize, publish, and reuse content across Salesforce channels — including Marketing Cloud Next emails, landing pages, Experience Cloud sites, Commerce stores, and external platforms via headless APIs. The system separates content authoring from delivery, so a team can manage assets in one place and distribute them to multiple endpoints.

Content in Salesforce CMS is author-owned. It lives in workspaces, and publishing makes it available to channels connected to those workspaces.

In MCA (Marketing Cloud Advanced), Salesforce CMS is the underlying system for the **Content tab** in the Marketing Cloud app. When learners click "Content" in the MCA navigation, they are inside the Salesforce CMS — specifically, inside the marketing workspace that was provisioned when MCA was set up.

Source: salesforcetutorial.com/salesforce-cms, trailhead.salesforce.com CMS Basics module, the-agentic-marketer.com CMS Workspaces article

---

### The Default Marketing Workspace

When MCA is provisioned, the setup process automatically creates a default CMS workspace. This workspace is called **"Content Workspace for Marketing Cloud"** with an API name of `Default_Content_Workspace`. Its description is "Content for your marketing campaigns."

This is the workspace that appears when you navigate to Content in the MCA app. All emails, landing pages, forms, SMS content, and content blocks created from within MCA go into this default workspace by default.

Key facts:
- Assets created through Campaign triggers (segment-triggered flows, form-triggered flows) automatically populate the default workspace — there is no option to specify an alternative workspace during campaign creation.
- The default workspace is an Enhanced CMS Workspace (as of Winter '25, all new workspaces are enhanced by default).
- The workspace name "Content Workspace for Marketing Cloud" is the system default name. Organizations can create additional workspaces with custom names (such as "LEOptical Marketing") through the Digital Experiences app.

Source: the-agentic-marketer.com CMS Workspaces, search result summary of default workspace API name

<!-- VERIFY: Confirm the exact default workspace API name ("Default_Content_Workspace") in a live SDO. This was sourced from search result summaries, not confirmed in the Salesforce help article directly. -->

---

### Enhanced CMS Workspaces vs. Standard Workspaces

As of **Winter '25**, any new CMS workspace created is an Enhanced CMS Workspace by default. Enhanced workspaces support additional lifecycle features:

- Translation lifecycle management (multi-language content support)
- Manual collections for Lightning Web Runtime (LWR) sites
- Approval workflows
- Workspace sharing (share content to other workspaces via a "Shared With Workspace" folder)
- Import/export of assets as JSON files for migration

Standard (non-enhanced) workspaces are legacy configurations. Any workspace created in MCA today will be enhanced.

To create an Enhanced CMS Workspace, you must enter an API name during creation (cannot be edited later).

Source: salesforcetutorial.com/salesforce-cms, search result from help.salesforce.com Enhanced Workspaces article

---

### Content Types in MCA

Within the MCA content workspace, the following content types exist:

**Marketing-specific content types (created from within MCA):**
- **Email** — drag-and-drop email content (or code mode)
- **Content Block: Email** — a reusable email content section that can be dragged into multiple emails
- **Landing Page** — web page with forms and content
- **Form** — standalone data capture form
- **SMS Message** — short message for SMS channel
- **WhatsApp Message** — WhatsApp template and session messages
- **Expression** — saved merge field logic (reusable Handlebars/merge field template)
- **Brand** — reusable visual identity definition (colors, fonts, button styles)
- **Email Template** — reusable email structure (starting point for email creation)

**Media/Document types (standard Salesforce CMS types):**
- **Image** — managed images with captions, URL links, and dynamic content configuration
- **Document** — PDF and document files
- **Audio** — audio files
- **Video** — video files

**RCS Message** — Added in Summer '26, allows creating Rich Communication Services messages combining text with images/videos and interactive suggestions.

**Custom content types** are also supported through Salesforce CMS, using a tool called CMS Content Type Manager (available from Salesforce Labs). Custom types can have up to 15 fields ("nodes") each, and an org can have up to 100 content types. This enables structured content like a "Product Feature" type with fields for name, description, image, and price.

Source: mavlers.com content creation guide, the-agentic-marketer.com reusability article, search results (Summer '26 highlights)

<!-- VERIFY: Confirm the exact list of available content types in the MCA content workspace Add menu, and whether "custom content types" from CMS Content Type Manager are distinct from the marketing-specific types. -->

---

### Folders vs. Collections

Two mechanisms exist for organizing content inside a workspace:

**Folders:**
- Internal organizational tool for content creators inside the workspace
- Only visible to workspace contributors
- Do not affect how content displays in channels or emails
- Every workspace has a root folder; contributors can create subfolders
- Assets can be moved to folders via Manage > Move

**Collections:**
- Curate groups of CMS content items for reusable display
- Available in two types:
  - **Static collections** — manually selected items assembled into a group
  - **Dynamic collections** — automatically populated based on content taxonomy tags and defined conditions; continuously updates as new content meets criteria
- Collections connect workspaces to display in channels (Experience Cloud sites, Commerce stores)
- For MCA email/landing page purposes, collections are less central than folders — the primary organizational tool within the MCA content tab is folders

Source: salesforcetutorial.com/salesforce-cms, search results from help.salesforce.com Collections article, trailhead CMS Basics module

<!-- VERIFY: Confirm whether collections have a specific role in MCA email/landing page workflows beyond general organization. The research suggests collections are primarily for Experience Cloud site display, not email builder access. -->

---

### Contributor Roles

Access to a CMS workspace is controlled by workspace-level contributor roles. There are four levels:

| Role | Capabilities |
|------|-------------|
| **Salesforce Admin** | Full access across all workspaces and Digital Experiences settings; manages CMS workflows and approvals |
| **Content Admin** | Full content control; manages contributors, channels, publishing; can assign default brand |
| **Content Manager** | Full content access; can create and publish; processes approval workflow submissions |
| **Content Author** | Can view, edit, and create content in the workspace; cannot publish content independently |

To add contributors: open Salesforce CMS from the App Launcher, select the workspace, navigate to Contributors, click Add Contributors, search for the user, assign the role, and finish.

Workspace visibility is controlled by contributor assignment — users only see workspaces they have been explicitly added to.

Source: trailhead.salesforce.com CMS Basics (Workspaces, Channels, Contributors), search results from help.salesforce.com Add Workspace Contributors article

---

### Channels

A CMS channel is the delivery connection between a workspace and a distribution endpoint. Content published to a workspace becomes available to channels connected to that workspace.

For MCA purposes:
- The default marketing workspace has a **Marketing Channel** connected to it during MCA provisioning
- This channel enables MCA to access CMS content (emails, landing pages, forms, content blocks, images) from within the marketing app
- Additional channels can be added to connect workspace content to Experience Cloud sites, Commerce stores, or external platforms (headless delivery via REST API)

In the context of Module 11 (LEOptical's content library), learners do not need to configure new channels — they work within the existing marketing channel on the workspace created in Module 3.

Source: the-agentic-marketer.com CMS Workspaces, marcloudconsulting.com Salesforce CMS guide, search results

---

### Reusable Content Blocks

Content blocks are one of MCA's primary reusability tools. They are:
- Bits of reusable email content (banners, footers, terms & conditions, buttons) built from standard components
- Stored in the CMS workspace
- Available in the email builder's **Components Panel** under "Layout Components"
- Created by navigating in the CMS workspace: **Add > Content Block: Email**

**Key behavior:** When a content block is updated and republished, every email using that block reflects the updated content automatically. This is a live link — not a copy.

**"Convert to Section" behavior:** A content block can be converted to a Section in an email. This breaks the live link — the block's components are copied locally into the email. Future updates to the original content block no longer affect that email.

**Publishing behavior:**
- Content blocks can be added to an email canvas even before the block is published
- Once the email is published, any draft content blocks are published simultaneously
- The latest saved version of a block is reflected in the canvas, preview, and CMS details page regardless of publication status

**Restrictions:**
- Content blocks cannot contain nested content blocks
- Sections cannot be nested inside content blocks
- Content variations (A/B) are not available inside content blocks

Source: the-agentic-marketer.com reusability article, search results (Winter '26 release notes, content blocks), mavlers.com content creation guide

---

### Email Builder and CMS Integration

The MCA email builder accesses CMS assets in two ways:

1. **Content Block component (Layout tab):** Drag a Content Block component onto the canvas; it shows all content blocks stored in the workspace for selection.

2. **Image component (Media tab):** The Image component can pull images from CMS-managed assets, including captions, URL links, and dynamic content configuration.

The **Components Panel** in the email builder is organized into:
- **Basics:** Button, Divider, Heading, HTML, List, Paragraph
- **Layout:** Section, Repeater, Content Block
- **Media:** Image

Content blocks created in the CMS appear in the Components Panel under Layout after the Winter '26 release.

When creating an email, the following information is required before entering the builder:
- Email Name
- API Reference Name
- CAN-SPAM Classification (Promotional or Transactional)

Source: mavlers.com content creation guide, the-agentic-marketer.com reusability article, emailmavlers.com MCN vs MCE comparison

---

### Approval Workflows

Workspaces can be configured with approval workflows. When enabled:
- Content Authors submit content through the workflow
- Content Managers review and process submissions
- Content Admins have full publishing authority

Approval workflows can be disabled per asset type or entirely for the workspace. The recommendation from practitioners is to disable approval workflows if they are not being used, to reduce confusion for content authors.

Source: the-agentic-marketer.com CMS Workspaces

---

### Workspace Sharing and Export/Import

**Workspace sharing:** A source workspace can expose content to a target workspace. Shared content appears in a "_Shared With Workspace_" folder in the target workspace. Source workspace admins control sharing permissions.

**Export/Import:** Assets can be exported from a workspace as JSON files containing content properties, metadata, media files, and translation variant definitions. This is primarily used for migrating content between environments.

Source: the-agentic-marketer.com CMS Workspaces

---

### Asset Management

Key asset management capabilities:
- **Clone:** Every asset type can be cloned directly from the workspace without opening it
- **Move:** Assets can be moved to different folders (Manage > Move)
- **Public URLs:** Images have public URLs using org domain, channel ID, org ID, and content key
- **Default Brand:** Workspaces support assigning a default brand; new assets automatically inherit brand settings (colors, fonts, buttons)
- **Default Images:** Workspaces can set default images for auto-generated emails and landing pages

Source: the-agentic-marketer.com CMS Workspaces

---

### MCN Summer '26 Content Features

Relevant features added in Summer '26 (current release as of this research date):
- **Multilingual Content Variations:** Language support through Content Variations for emails, images, headers, footers, and content blocks. Translations managed within a single email or content block for global campaign operations.
- **RCS Message content type:** New content type for Rich Communication Services messaging (text + media, rich cards, interactive suggestions)
- **Plain Text Email Auto-generation:** For published HTML emails, plain-text version is automatically populated from HTML content
- **Dynamic From Address:** Salesforce contact/account data can now be used in From Address and Reply-To Address fields

Source: search results summary of Summer '26 highlights (medium.com/@marketingcloudtips)

## UI Navigation Paths

<!-- VERIFY: All paths below should be verified in a live SDO. Some are confirmed from multiple sources; others are from third-party guides and marked accordingly. -->

- **Access MCA content (Content tab):** MCA App > Content (in nav bar) > opens Content Workspace for Marketing Cloud
- **Access Digital Experiences (for workspace admin):** App Launcher > Digital Experiences > CMS Workspaces
- **Create a new Enhanced CMS Workspace:** Digital Experiences app > CMS Workspaces > Add Workspace > Name it > enter API name (cannot edit later) > add channels (optional) > set language > Finish
- **Enable Enhanced Workspaces in Setup:** Setup > Quick Find: "Digital Experiences" > Salesforce CMS > Enable "Create both CMS workspaces and enhanced CMS workspaces"
- **Create content in MCA workspace:** MCA App > Content > [workspace] > Add > select content type (Email, Content Block: Email, Landing Page, Form, etc.)
- **Create a Content Block:** MCA App > Content > [workspace] > Add > Content Block: Email
- **Add workspace contributors:** App Launcher > Digital Experiences (or Salesforce CMS) > select workspace > Contributors > Add Contributors > search user > assign role (Content Admin / Manager / Author) > Next > Finish
- **Create a folder:** MCA App > Content > [workspace] > New Folder (or equivalent)
- **Move content to folder:** Select asset > Manage > Move > select target folder
- **Clone an asset:** Select asset in workspace > Clone (available directly from workspace list without opening asset)
- **Use a content block in email:** Email builder > Components Panel > Layout tab > Content Block > drag onto canvas > select block from workspace

Source: search results aggregated from help.salesforce.com, the-agentic-marketer.com, mavlers.com

## Platform Gotchas

### Campaign assets always go to the default workspace
**Confirmed by:** the-agentic-marketer.com (2026)

When assets are created through Campaign triggers (segment-triggered flows, form-triggered flows), they automatically populate into the default workspace. There is no option to specify which workspace receives these assets. If an organization uses multiple workspaces, campaign-generated assets will always land in the default one.

---

### Workspaces cannot be deleted
**Source:** marcloudconsulting.com Salesforce CMS guide

Once a workspace is created, it cannot be deleted. The name and description can be edited, but the workspace itself persists. This matters for Module 3 (where learners create "LEOptical Marketing") — they should name it thoughtfully, as they cannot undo the creation.

---

### API name for workspace cannot be changed after creation
**Source:** Search results from help.salesforce.com workspace creation article

When creating an Enhanced CMS Workspace, you must enter an API name. This API name cannot be edited after the workspace is created. Name it intentionally.

---

### Content block restrictions: no nesting
**Source:** the-agentic-marketer.com reusability article

Content blocks cannot contain nested content blocks. Sections cannot be nested inside content blocks. This limits how complex a reusable block can be.

---

### Approval workflow can confuse content authors if left enabled but unused
**Source:** the-agentic-marketer.com CMS Workspaces

If the approval workflow is enabled but not actively managed, content authors submit work and it disappears from their view (pending review). Disable the workflow if the team does not use it.

---

### MCE content blocks vs. MCA content blocks: different architecture
The "content blocks" in MCE (Marketing Cloud Engagement / ExactTarget) are different objects from MCA content blocks. In MCE, Content Builder blocks live in folders within Content Builder and are managed via the MCE interface. In MCA, content blocks are CMS assets stored in the Salesforce CMS workspace. Do not conflate the two when training MCE-experienced users.

---

### Unsubscribe link is not validated
**Source:** mavlers.com content creation guide

MCA will not throw a validation error if a promotional email is missing an unsubscribe link. This is legally required under CAN-SPAM. The platform does not catch it — the sender is fully responsible for verifying that a working unsubscribe link is present before every promotional send.

---

### Physical address placeholder is required
**Source:** mavlers.com content creation guide

Promotional emails require the `{!$organization.Address}` merge field placeholder. If this field is not configured in the org, sending will be blocked.

## MCE Comparison Points

| Concept | MCE (Marketing Cloud Engagement) | MCA (Marketing Cloud Advanced) |
|---------|----------------------------------|-------------------------------|
| Content management system | Content Builder (standalone MCE tool) | Salesforce CMS (platform-native, within Digital Experiences app) |
| Asset storage | Content Builder folders and assets | CMS workspace folders |
| Content types | Emails, images, templates, documents, blocks | Emails, landing pages, forms, SMS, WhatsApp, content blocks, brands, expressions, images, documents, RCS (Summer '26) |
| Reusable content blocks | Content Builder blocks (HTML-based, folder-organized) | CMS content blocks (component-based, live-linked to all emails using them) |
| Email templates | Content Builder template functionality | CMS-stored email templates (starting point only; changes don't cascade) |
| Template governance | Some locking capability | Stricter governance: lock content regions, subject line, preheader |
| Content organization | Folder hierarchy in Content Builder | Folder hierarchy in CMS workspace + collections |
| Personalization approach | AMPscript, HTML-heavy dynamic content blocks | Repeater components, Handlebars, visual merge field UI |
| Access path | Marketing Cloud app > Email Studio > Content Builder | MCA app > Content tab > CMS workspace |
| Roles | Content Builder roles within SFMC BU | Workspace-level roles (Content Admin, Manager, Author) |

**Key differences for MCE-experienced practitioners:**
1. Content builder is gone as a standalone app. Everything lives in CMS.
2. Content blocks in MCA are live-linked — update the block, every email updates. In MCE, blocks were more like inserted copies (behavior varied by implementation).
3. Workspace sharing and import/export are CMS-native capabilities that MCE Content Builder did not have in the same way.
4. The Content tab in MCA is not just for email assets — it houses ALL content types for all channels (email, SMS, landing pages, forms, etc.) in one unified workspace.

## External Resources

- [Unlock your CMS Workspaces in Marketing Cloud Next: 8 features you need to know](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/) — Comprehensive practitioner guide covering all 8 key CMS workspace features with specific details on navigation, asset management, approval workflows, import/export, and workspace sharing. Most detailed hands-on source found.
- [Marketing Cloud Next Content Creation: Complete Guide](https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/) — Covers content creation navigation paths, component types in the email builder, content block creation, and critical compliance gotchas (missing unsubscribe link, physical address).
- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) — Detailed breakdown of all five reusability features: Expressions, Content Blocks, Personalization Points, Brands, and Email Templates. Includes gotchas and "Convert to Section" behavior.
- [Enhance Your CMS Skills: Workspaces, Channels, Contributors](https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/learn-about-cms-workspaces-channels-and-contributors) — Trailhead module covering workspace structure, contributor roles, and channel configuration. Confirmed four-role hierarchy.
- [Explore Salesforce CMS for Effective Content Management](https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/get-started-with-salesforce-cms) — Trailhead intro to Salesforce CMS: what it is, workspace types, access via Digital Experiences app.
- [Marketing Cloud Next vs Marketing Cloud Engagement for Email Templates](https://emailmavlers.com/blog/marketing-cloud-next-vs-marketing-cloud-engagement-email-templates/) — Useful MCE vs. MCN comparison covering CMS workspace, content governance, personalization mechanics, and AI integration differences.
- [Salesforce CMS Guide](https://www.salesforcetutorial.com/salesforce-cms/) — Comprehensive Salesforce CMS overview including Enhanced workspaces, contributor roles, channels, collections, developer integration (LWC, REST API), and best practices.
- [Marketing Cloud Next Content Types and Statuses](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_status_ref.htm&language=en_US&type=5) — Official Salesforce Help article on content types and statuses in MCN. (Page infrastructure did not render — article confirmed to exist.)
- [Manage Content in Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_content.htm&language=en_US&type=5) — Official Salesforce Help article on content management in MCN. (Page infrastructure did not render — article confirmed to exist.)
- [Add Workspace Contributors to Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_setup_contributors_workspace.htm&language=en_US&type=5) — Official Salesforce Help on adding contributors. (Page infrastructure did not render — article confirmed to exist.)
- [Create and Manage a Reusable Content Block](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_reusable_content_blocks.htm&language=en_US&type=5) — Official Salesforce Help on content blocks. (Page infrastructure did not render — confirmed to exist.)
- [Marketing Cloud Next - Winter '26 Release Notes Highlights](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/winter26-release-notes/) — Key Winter '26 features including reusable content blocks in Components Panel, email templates, landing page improvements (hidden fields, form handler, merge fields), and what was NOT included.

## Data Model Relevance

This module does not directly involve data model configuration. CMS workspaces and content management operate independently of Data 360 DMOs, Identity Resolution, and Data Graphs.

However, there are indirect connections:
- **Content blocks for product families:** The 4 LEOptical product families (Visionaire UltraLux, Visionaire ChromaShift, SeeClear DailyFocus, SeeClear SunSync) map to products in the CRM Product DMO. Content blocks built in this module correspond to those product SKUs (VIS-ULX-001, VIS-CHS-001, SEC-DLF-001, SEC-SNS-001).
- **Email headers/footers and legal copy:** The footer content block will include the unsubscribe link and physical address, which connects to the consent infrastructure built in Modules 4-5.
- **CMS content in personalized emails:** The content blocks created here will be used in email templates (Module 14) and personalized emails (Modules 15-19). The Image component in the email builder accesses CMS-managed images.

## Source Log

- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/ — Primary source. Comprehensive CMS workspace guide for MCN. Fetched successfully.
- https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/ — Fetched successfully. Good content on builder components, navigation paths, and compliance gotchas.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/ — Fetched successfully. Excellent detail on content blocks, expressions, brands, templates, personalization points.
- https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/winter26-release-notes/ — Fetched successfully. Good Winter '26 feature summary including content block launch.
- https://www.salesforcetutorial.com/salesforce-cms/ — Fetched successfully. Comprehensive CMS overview covering Enhanced workspaces, roles, collections.
- https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/get-started-with-salesforce-cms — Fetched successfully. Official Trailhead CMS intro.
- https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/learn-about-cms-workspaces-channels-and-contributors — Fetched successfully. Workspace/channel/contributor detail.
- https://emailmavlers.com/blog/marketing-cloud-next-vs-marketing-cloud-engagement-email-templates/ — Fetched successfully. MCE vs MCN comparison.
- https://marcloudconsulting.com/sf-basics/salesforce-content-management-system/ — Fetched successfully. Good CMS overview; "Workspaces cannot be deleted" gotcha confirmed.
- https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-for-marketing-cloud-account-engagement-basics/access-next-gen-features — Fetched successfully. Access patterns for MCN.
- https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-setup-quick-look/know-marketing-cloud — Fetched successfully. MCN features table including Digital Experiences for content.
- https://the-agentic-marketer.com/marketing-cloud-next-learning-path/content-channels/ — Fetched successfully. Content and channels learning path overview.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_content.htm — Not usable: Salesforce Help portal renders JavaScript-only; no article content extracted.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_content_status_ref.htm — Not usable: same JavaScript-only issue.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_setup_contributors_workspace.htm — Not usable: same JavaScript-only issue.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_content_reusable_content_blocks.htm — Not usable: same JavaScript-only issue.
- https://help.salesforce.com/s/articleView?id=xcloud.cms_cmsworkspace-create.htm — Not usable: same JavaScript-only issue.
- https://help.salesforce.com/s/articleView?id=sf.cms_content_collections.htm — Not usable: same JavaScript-only issue.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-introduction-of-reusable-content-blocks-2b50a771fd8c — 403 forbidden.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-winter-26-release-highlights-81240775f843 — 403 forbidden.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-spring-26-release-highlights-24c0c804b0cb — 403 forbidden.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-summer-26-release-highlights-04f6c5abdee6 — 403 forbidden.
- https://github.com/salesforce-marketingcloud/salesforce-cms-content/blob/main/README.md — Fetched. Legacy MCE CMS integration repo (Node.js + Block SDK), not relevant to MCA CMS. Discarded.
- https://www.salesforceben.com/salesforce-marketing-cloud-next-vs-mce-mcae-mcg-mca/ — 403 forbidden.
- https://resources.docs.salesforce.com/rel1/doc/en-us/static/pdf/mktg_implementation_guide.pdf — SSL error.
- https://greenkeydigital.com/wp-content/uploads/2025/08/mktg_implementation_guide.pdf — PDF binary returned, not parseable.
