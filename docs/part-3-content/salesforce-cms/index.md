---
sidebar_position: 1
title: "Salesforce CMS and Content Management"
description: "CMS setup, Enhanced CMS Workspaces, asset organization, and content types."
---

## Overview

Every email, landing page, form, and reusable content block in Marketing Cloud Next lives in Salesforce CMS. It is not a separate app you bolt on. It is the underlying content infrastructure the marketing app sits on top of. When you click the **Content** tab in Marketing Cloud Next, you are inside a Salesforce CMS workspace.

This matters because Marketing Cloud Next's content model is fundamentally different from Marketing Cloud Engagement's Content Builder. Content in Marketing Cloud Next is workspace-based, permission-controlled, and designed to serve multiple channels from a single source. Understanding how workspaces, content types, and contributor roles work will save you from a lot of confusion when assets do not appear where you expect them, or when a colleague cannot see content you just created.

This module is the conceptual foundation. The hands-on work (building the LEOptical content library) is in the next subpage.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What Salesforce CMS is and how it relates to the Marketing Cloud Next Content tab.
- Enhanced CMS Workspaces and how they differ from standard workspaces.
- Content types available in a Marketing Cloud Next workspace.
- Content statuses: Draft, Published, and Unpublished.
- Folders and collections as organizational tools, and when each applies.
- Workspace sharing and how it works as a content governance mechanism.
- Contributor roles and how workspace access is controlled.
- How channels connect workspace content to delivery endpoints.
- Brands: what they are, how they enforce visual consistency, and how to set a workspace default.
- Approval workflows and when to disable them.
- How Business Units and CMS workspaces relate (and why they are not the same thing).
- Language support and multilingual content variations.
- Asset import and export for environment migration.
- How CMS content surfaces in the Marketing Cloud Next email builder.

## What Salesforce CMS is

Salesforce CMS is a hybrid content management system built into the Salesforce platform. It lets teams create, organize, publish, and reuse content across multiple delivery channels, including Marketing Cloud Next emails, landing pages, Experience Cloud sites, Commerce stores, and external platforms via API.

The key design principle is separation of authoring from delivery. You create and manage assets in one place. You connect those assets to channels (email, web, etc.) rather than copying them into each channel separately.

In Marketing Cloud Next, the **Content** tab is your entry point into the CMS workspace that was provisioned when the org was set up. Everything you create from the Marketing Cloud Next app (emails, landing pages, forms, content blocks) is stored in that workspace.

## Workspaces

A workspace is the top-level container for all your content. Think of it as a shared drive with its own permission system and channel connections.

When Marketing Cloud Next is provisioned, Salesforce automatically creates a default workspace called **Content Workspace for Marketing Cloud** (API name: `Default_Content_Workspace`). This is what you see in the Content tab unless you have created additional workspaces.

{/* VERIFY: Confirm the exact default workspace API name (Default_Content_Workspace) in a live SDO */}

### Enhanced vs. standard workspaces

As of Winter '25, all new CMS workspaces are Enhanced CMS Workspaces by default. Enhanced workspaces support features that standard (legacy) workspaces do not:

- Translation lifecycle management for multi-language content
- Approval workflows with configurable per-asset-type rules
- Workspace sharing (expose content from one workspace to another)
- Import and export of assets as JSON files for environment migration
- Manual collections for Lightning Web Runtime (LWR) sites

Any workspace you create today will be enhanced. The default Marketing Cloud Next workspace is also enhanced.

One important constraint: when you create an Enhanced CMS Workspace, you must specify an API name during creation. That API name cannot be changed after the workspace is saved. Name it carefully.

:::caution
As of Summer '25, workspaces can be deleted. However, the API name set at creation cannot be changed. Name it carefully before saving. If a workspace is deleted, any assets it contained are gone with it.

{/* VERIFY: Confirm workspace deletion is available in SDO environments and what the exact deletion path is */}
:::

### The default workspace and campaign assets

Assets created through Campaign flows (segment-triggered flows, form-triggered flows) automatically go into the default workspace. There is no option to route them elsewhere. If your org uses multiple workspaces, campaign-generated assets always land in `Default_Content_Workspace`, not in a custom workspace you created. Plan for this when deciding how to structure workspaces for a client.

## Content types

Within a Marketing Cloud Next workspace, content is organized by type. The types fall into two categories: marketing-specific types (created and managed from within the Marketing Cloud Next app) and standard CMS media types.

**Marketing-specific types:**

| Type | Description |
|------|-------------|
| Email | Drag-and-drop or code-mode email content |
| Content Block: Email | Reusable email section (header, footer, product block) |
| Landing Page | Web page with optional form and content |
| Form | Standalone data capture form |
| SMS Message | Short message for SMS channel |
| WhatsApp Message | WhatsApp template and session messages |
| Expression | Saved Handlebars or merge field logic for reuse |
| Brand | Reusable visual identity (colors, fonts, button styles) |
| Email Template | Reusable email structure used as a starting point |
| RCS Message | Rich Communication Services message (text plus media, interactive buttons). Added Summer '26. |

**Standard CMS media types:**

| Type | Description |
|------|-------------|
| Image | Managed images with captions, URL links, and dynamic content options |
| Document | PDF and document files |
| Audio | Audio files |
| Video | Video files |

{/* VERIFY: Confirm the exact list of content types available in the Marketing Cloud Next workspace Add menu in a live SDO. Confirm whether RCS Message appears in all SDO orgs or only in orgs with that channel licensed */}

Marketing Cloud Next also supports **custom content types** through a tool called CMS Content Type Manager (a Salesforce Labs app). Custom types have structured fields: up to 15 fields per type, up to 100 types per org. A "Product Feature" type, for example, could have fields for name, description, image reference, and price. Custom content type items can then be created in the workspace and used across channels.

{/* VERIFY: Confirm whether CMS Content Type Manager is available and functional in SDO environments, and whether custom content type items are accessible from the Marketing Cloud Next email builder component picker */}

:::tip[Coming from MCE?]
- **Content Builder is gone.** In MCE, content lived in Content Builder, a separate app with its own folder structure. In Marketing Cloud Next, everything is in the Salesforce CMS workspace accessible via the Content tab.
- **The asset types are broader.** MCE's Content Builder held emails, images, templates, and HTML blocks. The Marketing Cloud Next workspace holds all of those plus landing pages, forms, SMS, WhatsApp, expressions, brands, and RCS messages in one place.
- **No more email-only focus.** Content Builder was email-centric. The CMS workspace is channel-neutral. The same content infrastructure serves email, web, SMS, and external APIs.
:::

## Folders and collections

Two mechanisms organize content inside a workspace: folders and collections. These are different things and should not be confused.

### Folders

Folders are the day-to-day organizational tool for content creators inside the workspace. They are internal, only visible to workspace contributors, not to end users or channels.

Every workspace has a root folder. You can create subfolders inside it, up to five levels deep. Assets can be moved between folders at any time via **Manage > Move**. See [Organize Content with Folders](https://help.salesforce.com/s/articleView?id=xcloud.cms_folders_overview.htm&language=en_US&type=5) for details.

For Marketing Cloud Next email work, folders are what you actually use to keep the workspace from becoming a flat list of assets.

:::warning
Content in the workspace is not sorted alphabetically. Folders and assets appear in creation order by default. If you create folders after assets already exist, the workspace list can quickly become hard to navigate. Create your folder structure before uploading assets.
:::

### Collections

Collections curate groups of CMS content items for channel display. There are two types:

- **Static collections:** Manually assembled groups of specific content items.
- **Dynamic collections:** Automatically populated based on taxonomy tags and conditions. They update continuously as new content meets the criteria.

Collections are primarily used to feed content displays on Experience Cloud sites and LWR pages. For Marketing Cloud Next email and landing page work, collections are not the primary tool. Folders are. If you are looking at the workspace trying to find a "Collections" menu to organize your email assets, you are in the wrong place. Use folders.

{/* VERIFY: Confirm whether a Collections option is visible in the Marketing Cloud Next content workspace UI in a live SDO, and whether it has any direct role in Marketing Cloud Next email or landing page workflows beyond Experience Cloud channel delivery */}

### Workspace sharing

Enhanced workspaces can share content with other workspaces. When a source workspace enables sharing with a target workspace, all content from the source (including drafts) becomes visible inside the target workspace's **Shared with Workspace** folder.

To enable sharing, go to the source workspace's settings and select **Workspace Sharing**. Move the target workspace from the Unshared column to the Shared column. Salesforce sends an email confirmation when sharing activates.

Permission rules for shared content:
- Source workspace Content Admins and Content Managers control what gets shared.
- Target workspace contributors can view all shared items but cannot modify them or change sharing permissions.
- Modifying or deleting shared content requires a role in the source workspace (Content Author or above). Publishing or unpublishing requires Content Manager or Content Admin in the source workspace.

Workspace sharing is primarily useful when one team manages brand-approved assets (logos, legal copy, standard headers) and wants to expose those assets to multiple other workspaces without giving each workspace's contributors write access to the source. For the LEOptical scenario, this is less relevant. The LEOptical Marketing workspace is the single content home. In larger multi-brand or agency implementations, it becomes a governance mechanism. See [Share Content Between Workspaces](https://help.salesforce.com/s/articleView?id=xcloud.cms_cmsworkspace-edit.htm&language=en_US&type=5) for configuration steps.

## Contributor roles

Workspace access is controlled by contributor roles assigned at the workspace level. Four roles exist:

| Role | What they can do |
|------|-----------------|
| Content Author | View, create, and edit content. Cannot publish independently. |
| Content Manager | Full content access. Can publish. Can assign the default brand. Processes approval workflow submissions. |
| Content Admin | Full content control. Manages contributors, channels, and publishing. Can assign the default brand. |

Users only see workspaces they have been explicitly added to as contributors, including Salesforce org admins. Being a Salesforce admin gives you control over the Digital Experiences app in Setup (who can access what), but it does not automatically grant you contributor access to any individual workspace. An org admin who needs to work inside a workspace must be added as a Content Admin like anyone else. If a colleague says they cannot find the workspace, check whether they have been added.

To add contributors: **App Launcher > Digital Experiences** (or Salesforce CMS) > select the workspace > **Contributors > Add Contributors** > search for the user > assign a role > **Finish**. See [Add Workspace Contributors](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_setup_contributors_workspace.htm&language=en_US&type=5) for the full walkthrough.

## Channels

A channel is the delivery connection between a workspace and a distribution endpoint. Publishing content to a workspace makes it available to channels connected to that workspace.

When Marketing Cloud Next is provisioned, a **Marketing Channel** is connected to the default workspace. This channel is what allows the Marketing Cloud Next email builder, landing page builder, and form builder to access CMS content.

You can add additional channels to connect workspace content to Experience Cloud sites, Commerce stores, or external platforms via headless REST API. For most Marketing Cloud Next implementations, you will not need to configure channels manually. The marketing channel comes pre-connected. See the [CMS Channels overview](https://help.salesforce.com/s/articleView?id=xcloud.cms_channel_overview.htm&language=en_US&type=5) if you need to configure additional channels.

## Brands

A Brand is a CMS asset that defines the visual identity defaults for a workspace: primary color, background color, button style, typography, and spacing. When you set a Brand as the workspace default, every new asset created in that workspace (emails, landing pages, content blocks) starts with those settings applied automatically.

This matters because without a default Brand, every new email starts from a blank visual slate. Contributors have to manually set colors and button styles each time. With a default Brand in place, visual consistency is built into the creation workflow.

For LEOptical, the default Brand in the LEOptical Marketing workspace will carry the brand's color palette and button style so every email and landing page starts on-brand without any manual effort.

To set a workspace's default Brand: open the workspace settings and assign the Brand from the workspace's Brand settings panel. Only a Content Admin or Salesforce Admin can assign the workspace default Brand. See [Brands in Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_brand.htm&language=en_US&type=5) for the full walkthrough.

:::tip[Coming from MCE?]
MCE had no equivalent concept at this level. Visual consistency in MCE came from email template HTML and brand-level CSS, which required a developer to maintain. In MCA, Brand is a first-class CMS asset any Content Admin can configure and update.
:::

## Approval workflows

Enhanced CMS workspaces have approval workflows turned on by default. The workflow is built on Flow Orchestration and has two stages:

1. **Submit for review:** The Content Author submits via a "Submit Content for Review" screen flow. The content can still be edited at this stage, but cannot be published.
2. **Review Content:** A Content Manager reviews. At this stage the content is **locked for editing** and cannot be published until approved. The Content Manager can approve (content moves to ready-for-publication and the author is notified) or request a revision (content unlocks and returns to the author). The author can also withdraw the request at any point.

The workflow provides a full audit trail. Authors can see where their content is in the process on the content detail page.

The real gotcha is not that content disappears. It is that content gets **locked and stalls** if no Content Manager is monitoring the queue. If workflows are enabled but there is no active Content Manager processing submissions, content authors will find their work frozen: not editable, not publishable, waiting indefinitely for a reviewer who may never come.

Disable the approval workflow if the team does not have a formal review process in place: **Workspace > Settings (gear icon) > Workflow > toggle "Workflows and Approvals" to Off**. You can also disable it selectively per asset type. See [CMS Workflows and Approvals](https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows.htm&language=en_US&type=5) for configuration steps.

## Content statuses

Every asset in a CMS workspace has a publication status. Understanding these prevents confusion when an asset is not behaving as expected.

| Status | Meaning |
|--------|---------|
| **Draft** | Created but not yet published. Also the state content returns to after being unpublished. Not visible in channels or the email builder's content block picker. |
| **Published** | Live. Visible in channels and accessible from the email builder. |
| **Revised** | Previously published, then edited. The published version remains live. The edits are staged and not yet visible. |
| **Scheduled** | Queued for publication at a future date and time. |
| **Processing** | Transitional state during publish or unpublish operations. |

Content blocks have a nuance: you can add a Draft content block to an email canvas and it will display in preview. When you publish the email, any Draft content blocks it references are published simultaneously.

For the full status reference, see the [Content Statuses in Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_status_ref.htm&language=en_US&type=5) help article.

## Business units and workspaces

In MCE, content was scoped to a Business Unit. Each BU had its own Content Builder with its own folder hierarchy and assets. Cross-BU content sharing required Shared Data Extensions or explicit publishing from parent to child BU.

MCA does not work this way. CMS workspaces are not Business Unit-scoped. A workspace is an org-level construct that any user with a contributor role can access, regardless of which Business Unit they are associated with. Business Units in MCA control sending domains and governance, not content storage.

The practical consequence: if your MCA org has multiple Business Units, those BUs share the same CMS workspace (or workspaces, if you create more than one). Access is governed by workspace contributor roles, not BU membership.

## Languages and multilingual content

Enhanced CMS Workspaces support multilingual content. A single email, content block, or image can have language variants managed within the same asset. No need to duplicate the asset per language.

The workspace language is set at creation time and becomes the default content language.

### How translation works

Translation in Enhanced CMS workspaces follows a file-based workflow using [XLIFF](https://en.wikipedia.org/wiki/XLIFF) (.xlf files), an XML-based open standard for translation interchange used by most professional localization tools and services.

The full workflow:

1. Add the target languages to the workspace in workspace settings.
2. Select one or more content items in the workspace.
3. Click **Manage > Export** and choose the languages to export.
4. Salesforce generates one `.xlf` file per language and emails you a download link for a `.zip` archive containing them.
5. Send the `.xlf` files to your localization partner or translator.
6. Receive the translated `.xlf` files back. Package them into a `.zip` archive.
7. In the workspace, click **Manage > Import** and upload the `.zip`.
8. The translated variants appear in Draft status and can be reviewed before publishing.
9. Publish the managed content. All language variants publish at the same time.

The `.xlf` files use the XLIFF 2.0 standard, which most professional localization tools and translation management systems support natively. Each translatable string in your email is represented as a `<unit>` with `<source>` (original text) and `<target>` (translated text) elements. Handlebars merge fields and org merge fields are preserved as-is inside the source. The translator should not modify them:

```xml
<unit id="4" name="subjectLine">
  <segment>
    <source>Need to Reschedule Your Appointment?</source>
    <target>ご予約の変更をご希望ですか？</target>
  </segment>
</unit>
<unit id="9" name="text">
  <segment>
    <source>Dear {{$content.firstName}},</source>
    <target>{{$content.firstName}} 様</target>
  </segment>
</unit>
```

You can send the `.xlf` file to a translation company, a localization service, or a generative AI for translation. Once you have the translated file, save it with the same filename and `.xlf` extension, then import it back into the workspace. For a full walkthrough including before/after file examples, see [Marketing Cloud Next: Multilingual Support with Content Variations](https://medium.com/@marketingcloudtips/marketing-cloud-next-multilingual-support-with-content-variations-175963c1fb97).

:::caution
Translations cannot be exported or imported across different orgs. If you need translated content in a production org, the translation work must happen in that org's workspace export/import cycle.
:::

{/* VERIFY: How does MCA select which language variant to send to a recipient at campaign send time? Is there a flow step, a merge field on the contact record, or a manual selection in the email builder? Confirm in a live SDO. */}

For most MCA implementations targeting a single language, the translation workflow is invisible. You create content in your workspace language and the controls are simply not relevant. For global clients, see the [CMS Translation Lifecycle](https://help.salesforce.com/s/articleView?id=xcloud.cms_translation_lifecycle.htm&language=en_US&type=5) help article for the complete workflow.

## Asset import and export

Enhanced workspaces support exporting assets as JSON packages and importing them into another workspace or another org. An export package contains the asset's content properties, metadata, media files, and any translation variant definitions.

This is primarily useful for two scenarios:

1. **Environment migration:** Moving content from a sandbox org to production, or from one client sandbox to another.
2. **Workspace-to-workspace migration:** Moving assets between workspaces within the same org.

For day-to-day LEOptical work, you will not use import/export. For consultants managing multi-environment deployments, this is the mechanism for promoting content without recreating it manually. See the [CMS Import and Export overview](https://help.salesforce.com/s/articleView?id=xcloud.cms_import_export_overview.htm&language=en_US&type=5) for the full process.

A few things the export does not preserve:

- **CMS Collection components** are not included in export packages. If your workspace uses Collections (for Experience Cloud site display), recreate them manually in the destination workspace.
- **Subfolder structure is lost.** Content nested in subfolders is imported to the root folder of the destination workspace. You will need to reorganize manually after import.
- **Cross-references must be imported in order.** If an email references an image stored in the workspace, import the image first. If the referenced asset does not exist in the destination, the import will have broken references.
- **Translations cannot travel across orgs.** Translation exports and imports only work within the same org. Cross-org translation requires running the translation workflow in the destination org separately.

## How CMS content surfaces in the email builder

When you open the Marketing Cloud Next email builder, the Components Panel on the left gives you access to CMS content in two ways:

1. **Content Block component (Layout tab):** Drag a Content Block component onto the canvas. A picker appears showing all content blocks stored in the workspace. Select one to place it in the email.

2. **Image component (Media tab):** The Image component can pull images directly from CMS-managed assets. Images added via the CMS (rather than uploaded inline) retain their CMS properties: captions, URL links, and dynamic content configuration.

<Screenshot src="/img/salesforce-cms/email-builder-components-panel.png" alt="The email builder Components Panel showing the Basics, Layout, and Media tabs" caption="The Components Panel. The Layout tab contains the Content Block component." />

The Components Panel is organized into three tabs:
- **Basics:** Button, Divider, Heading, HTML, List, Paragraph
- **Layout:** Section, Repeater, Content Block
- **Media:** Image

Content blocks appear in the Layout tab after the Winter '26 release. Before Winter '26, content blocks were not surfaced in the Components Panel.

<Screenshot src="/img/salesforce-cms/content-block-picker.png" alt="A Content Block component placed on the email canvas with the Settings panel showing the Select Block button" caption="After dragging a Content Block component onto the canvas, the settings panel prompts you to select a block from the workspace." />

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Unlock your CMS Workspaces in Marketing Cloud Next: 8 features you need to know](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/) - Detailed practitioner guide covering workspace features, asset management, approval workflows, import/export, and workspace sharing. The most thorough hands-on reference available outside of official docs.
- [Enhance Your CMS Skills: Workspaces, Channels, Contributors](https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/learn-about-cms-workspaces-channels-and-contributors) - Official Trailhead module on workspace structure, contributor roles, and channel configuration.
- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) - Covers all five Marketing Cloud Next reusability tools: Expressions, Content Blocks, Personalization Points, Brands, and Email Templates.
