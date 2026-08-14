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
- Folders and collections as organizational tools, and when each applies.
- Workspace sharing and how it works as a content governance mechanism.
- Contributor roles and how workspace access is controlled.
- How channels connect workspace content to delivery endpoints.
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
Workspaces cannot be deleted after creation. The name and description can be edited, but the workspace itself is permanent. If someone creates a workspace by accident, the org is stuck with it (though they can rename it to something harmless).
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

Every workspace has a root folder. You can create subfolders inside it. Assets can be moved between folders at any time via **Manage > Move**.

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

Workspace sharing is primarily useful when one team manages brand-approved assets (logos, legal copy, standard headers) and wants to expose those assets to multiple other workspaces without giving each workspace's contributors write access to the source. For the LEOptical scenario, this is less relevant. The LEOptical Marketing workspace is the single content home. In larger multi-brand or agency implementations, it becomes a governance mechanism.

## Contributor roles

Workspace access is controlled by contributor roles assigned at the workspace level. Four roles exist:

| Role | What they can do |
|------|-----------------|
| Content Author | View, create, and edit content. Cannot publish independently. |
| Content Manager | Full content access. Can publish. Processes approval workflow submissions. |
| Content Admin | Full content control. Manages contributors, channels, and publishing. Can assign the default brand. |
| Salesforce Admin | Full access across all workspaces. Manages CMS workflows and approvals at the org level. |

Users only see workspaces they have been explicitly added to as contributors. If a colleague says they cannot find the workspace, check whether they have been added.

To add contributors: **App Launcher > Digital Experiences** (or Salesforce CMS) > select the workspace > **Contributors > Add Contributors** > search for the user > assign a role > **Finish**.

## Channels

A channel is the delivery connection between a workspace and a distribution endpoint. Publishing content to a workspace makes it available to channels connected to that workspace.

When Marketing Cloud Next is provisioned, a **Marketing Channel** is connected to the default workspace. This channel is what allows the Marketing Cloud Next email builder, landing page builder, and form builder to access CMS content.

You can add additional channels to connect workspace content to Experience Cloud sites, Commerce stores, or external platforms via headless REST API. For most Marketing Cloud Next implementations, you will not need to configure channels manually. The marketing channel comes pre-connected.

## How CMS content surfaces in the email builder

When you open the Marketing Cloud Next email builder, the Components Panel on the left gives you access to CMS content in two ways:

1. **Content Block component (Layout tab):** Drag a Content Block component onto the canvas. A picker appears showing all content blocks stored in the workspace. Select one to place it in the email.

2. **Image component (Media tab):** The Image component can pull images directly from CMS-managed assets. Images added via the CMS (rather than uploaded inline) retain their CMS properties: captions, URL links, and dynamic content configuration.

The Components Panel is organized into three tabs:
- **Basics:** Button, Divider, Heading, HTML, List, Paragraph
- **Layout:** Section, Repeater, Content Block
- **Media:** Image

Content blocks appear in the Layout tab after the Winter '26 release. Before Winter '26, content blocks were not surfaced in the Components Panel.

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Unlock your CMS Workspaces in Marketing Cloud Next: 8 features you need to know](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/) - Detailed practitioner guide covering workspace features, asset management, approval workflows, import/export, and workspace sharing. The most thorough hands-on reference available outside of official docs.
- [Enhance Your CMS Skills: Workspaces, Channels, Contributors](https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/learn-about-cms-workspaces-channels-and-contributors) - Official Trailhead module on workspace structure, contributor roles, and channel configuration.
- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) - Covers all five Marketing Cloud Next reusability tools: Expressions, Content Blocks, Personalization Points, Brands, and Email Templates.
