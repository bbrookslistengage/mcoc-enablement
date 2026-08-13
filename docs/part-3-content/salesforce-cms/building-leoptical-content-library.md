---
sidebar_position: 2
title: "Building the LEOptical Content Library"
description: "Create the LEOptical Marketing workspace folder structure, upload brand assets, and build reusable content blocks for all product families."
---

## Overview

LEOptical is moving from a basic email service provider to MCA. Before they can send a single email, they need a content library: a structured workspace with their brand assets, product imagery, and reusable email components in place. Without it, every email starts from scratch, and updating a footer requires touching every email individually.

This module builds that library. You will organize the LEOptical Marketing CMS workspace that was created in the <ModuleLink slug="business-units" /> module, upload the course-provided brand assets, and create the six content blocks that will be referenced throughout the rest of the course.

The content blocks you create here (especially the footer) will appear in every promotional email LEOptical sends. Build them correctly now and you will not have to touch them again until the client rebrands.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Accessing the LEOptical Marketing workspace from the MCA Content tab.
- Building a folder structure for brand assets, product images, content blocks, and legal copy.
- Uploading images and documents to the workspace.
- Creating reusable content blocks for email headers, footers, and product families.
- Understanding the live-link behavior that makes content blocks valuable.
- Compliance requirements baked into the footer content block.
- Verifying that content blocks appear in the email builder's Components Panel.

## Accessing the workspace

The "LEOptical Marketing" workspace was created in the <ModuleLink slug="business-units" /> module. This module opens that workspace and builds inside it.

Navigate to the workspace two ways:

- **From MCA:** **MCA App > Content** (in the nav bar). You should see a workspace selector or list. Choose **LEOptical Marketing**.
- **From Digital Experiences:** **App Launcher > Digital Experiences > CMS Workspaces > LEOptical Marketing**.

{/* VERIFY: Confirm exactly how the workspace selector appears in the MCA Content tab (dropdown, list view, or tile grid) */}

:::warning
Two workspaces are visible in your org: **Content Workspace for Marketing Cloud** (the default) and **LEOptical Marketing** (the one you created). Any emails or landing pages created through Campaign flows always go into the default workspace automatically. Do not be alarmed when you cannot find campaign assets in the LEOptical Marketing workspace. They go to the other one.
:::

If you do not see the LEOptical Marketing workspace in the Content tab, check whether your user has been added as a contributor. Go to **App Launcher > Digital Experiences > CMS Workspaces > LEOptical Marketing > Contributors** and confirm your user has a role of Content Admin.

## Building the folder structure

Before uploading a single asset, create the folder structure. A flat workspace with 30 assets becomes impossible to navigate within a month.

The LEOptical Marketing workspace should have this structure:

```
LEOptical Marketing (workspace root)
├── Brand Assets
│   ├── Logos
│   └── Brand Guidelines
├── Product Images
│   ├── Visionaire UltraLux
│   ├── Visionaire ChromaShift
│   ├── SeeClear DailyFocus
│   └── SeeClear SunSync
├── Email Content Blocks
│   ├── Headers
│   ├── Footers
│   └── Product Blocks
└── Legal & Compliance
```

{/* VERIFY: Confirm the exact UI action for creating a new folder in an MCA CMS workspace. Is it a New Folder button in the workspace view, or a different path. Document the exact steps */}

To move an existing asset into a folder: select the asset in the workspace list, then choose **Manage > Move** and select the target folder.

:::tip[Coming from MCE?]
- **Folder structure is the same concept, different location.** In MCE, you organized assets in Content Builder folder hierarchies. In MCA, you do the same thing inside the CMS workspace.
- **No shared folder across BUs.** In MCE, content was scoped to a Business Unit's Content Builder. In MCA, the workspace with its contributor roles replaces BU-level content isolation.
- **Collections are not folders.** If you go looking for a "Collections" menu to organize your email assets, you will not find what you expect. Collections in Salesforce CMS are for Experience Cloud site content display. For email asset organization, use folders.
:::

## Uploading brand assets

The course resources include LEOptical's brand assets: a primary logo (PNG with transparent background), a white version for dark backgrounds, and a wordmark (horizontal text-only version).

To upload an image to the workspace:

1. Navigate to the **LEOptical Marketing** workspace.
2. Click **Add > Image**.
3. Upload the file from your computer (drag and drop or browse).
4. Name the image clearly: `leoptical-logo-primary`, `leoptical-logo-white`, `leoptical-wordmark`.
5. After saving, move it to the **Brand Assets > Logos** folder via **Manage > Move**.

Repeat for each product image provided in the course resources. Place each image in the matching product subfamily folder under **Product Images**.

{/* VERIFY: Confirm supported image formats (PNG, JPG, GIF, SVG) and any maximum file size limits for CMS images in MCA */}

Image assets stored in the CMS are accessible from the email builder's Image component. Unlike inline image uploads, CMS images retain a public URL, can have captions, and can be configured for dynamic content variations.

## Content blocks: the reusability engine

Content blocks are the most important reusability tool in MCA for email work. Each content block is a named, versioned asset stored in the CMS workspace. When you add a content block to an email, a live link is created, not a copy.

**What live-link means:** When you update a content block and republish it, every email that contains that block reflects the change. Update the footer once and all emails update. Republish the header after a logo change and every email gets the new logo.

This is different from how MCE blocks typically worked, where inserting a block into an email effectively copied the content into that email. In MCA, the connection remains active.

:::warning
If you click **Convert to Section** on a content block inside an email, the live link is broken. The block's components are copied locally into that email and future changes to the original content block no longer affect it. This is sometimes what you want, but do it intentionally, not accidentally.
:::

**What content blocks cannot do:**
- Contain nested content blocks (no blocks inside blocks)
- Contain Sections nested inside the block
- Use A/B content variations

## Building the six content blocks

You need to create six content blocks for LEOptical. Create each one by navigating to **MCA App > Content > LEOptical Marketing workspace > Add > Content Block: Email**, then building with the drag-and-drop editor.

After creating each block, move it to the appropriate folder under **Email Content Blocks**.

### LEO-Header-Standard

This block goes at the top of every promotional email.

Components to include:
- LEOptical primary logo (Image component, pulling from the CMS asset you uploaded)
- Navigation links: Eye Exams, Lenses, Contacts, Frames, VisionCare Rewards

Name the block `LEO-Header-Standard`. Move to **Email Content Blocks > Headers**.

{/* VERIFY: Confirm whether navigation links in a content block are standard text/button components, or whether there is a dedicated navigation component in the email builder */}

### LEO-Footer-Standard

This block goes at the bottom of every promotional email. It has compliance requirements.

Components to include:
- Unsubscribe link (required by CAN-SPAM for all promotional sends)
- Physical address merge field (the `$organization.Address` field syntax used by MCA)
- Privacy policy link
- Copyright notice

:::caution
MCA does not validate whether an unsubscribe link exists in an email before sending. The platform will not throw an error if the unsubscribe link is missing. Because this footer block will be used in every promotional email via templates in a later module, the unsubscribe link must be in the block. If it is missing and an email goes out, that is a legal violation, not a platform error.

The physical address merge field also matters. If the org's mailing address is not configured in Setup, this field will be blank in sends, and in some configurations the send will be blocked entirely. The merge field syntax for this is:

```
{!$organization.Address}
```
:::

Name the block `LEO-Footer-Standard`. Move to **Email Content Blocks > Footers**.

### Four product blocks

Create one content block per product family. Each block has the same structure: product image, product name, a two-line description, and a "Shop Now" CTA button.

| Block name | Product family |
|-----------|---------------|
| `LEO-Product-VisionaireUltraLux` | Visionaire UltraLux (VIS-ULX-001) |
| `LEO-Product-VisionaireChromaShift` | Visionaire ChromaShift (VIS-CHS-001) |
| `LEO-Product-SeeClearDailyFocus` | SeeClear DailyFocus (SEC-DLF-001) |
| `LEO-Product-SeeClearSunSync` | SeeClear SunSync (SEC-SNS-001) |

For each block:
1. Add an Image component. Select the matching product image from the CMS (uploaded to the Product Images folder).
2. Add a Heading component for the product name.
3. Add a Paragraph component for the two-line description.
4. Add a Button component labeled **Shop Now**.

Move each block to **Email Content Blocks > Product Blocks**.

These four blocks will be referenced in the personalization modules later in the course, where Handlebars logic selects which product block to display based on the customer's purchase history.

## Verifying content blocks in the email builder

After creating and publishing the blocks, confirm they are accessible from the email builder:

1. From the LEOptical Marketing workspace, click **Add > Email** to create a test email. (You can delete it afterward. This is just a verification step.)
2. Open the email builder.
3. In the Components Panel on the left, find the **Layout** tab.
4. Drag a **Content Block** component onto the canvas.
5. A picker should appear showing the available content blocks from the workspace. Verify that your six LEOptical blocks appear in the list.

{/* VERIFY: Confirm the exact location and label of the content block picker in the email builder UI. Is it a modal or a side panel. Confirm in a live SDO */}

Content blocks can be added to an email canvas before they are published. The draft version of the block displays in the canvas and preview. When the email is published, any draft content blocks are published simultaneously.

## A note on Brands (optional extension)

A Brand in MCA is a reusable visual identity object stored in the workspace. It defines colors, typography, button styles, and spacing defaults. When you set a brand as the workspace default, all new assets created in that workspace start with those visual settings applied.

For LEOptical, creating a Brand object and setting it as the workspace default would mean every new email and landing page starts with the correct color palette and font choices. This is not part of the core assignment below, but it is a natural next step once the content library is in place.

{/* VERIFY: Confirm the navigation path for setting a default brand on a workspace in a live SDO */}

## Assignment

> **The client wants:** A structured content library in the LEOptical Marketing CMS workspace, ready for use in email campaigns: organized assets, reusable content blocks for headers, footers, and all four product families, and a footer block that meets CAN-SPAM requirements.

1. Access the **LEOptical Marketing** workspace from the MCA Content tab. Confirm you are in the correct workspace (not the default one).

2. Create the folder structure described in this module:
   - Brand Assets (with Logos and Brand Guidelines subfolders)
   - Product Images (with one subfolder per product family)
   - Email Content Blocks (with Headers, Footers, and Product Blocks subfolders)
   - Legal & Compliance

3. Upload the course-provided brand assets (logo, wordmark) to **Brand Assets > Logos**. Upload the four product images to their respective subfolders.

4. Create the **LEO-Header-Standard** content block with the LEOptical logo and navigation links. Move it to **Email Content Blocks > Headers**.

5. Create the **LEO-Footer-Standard** content block with the unsubscribe link, the physical address merge field, privacy policy link, and copyright notice. Move it to **Email Content Blocks > Footers**.

6. Create one content block per product family:
   - `LEO-Product-VisionaireUltraLux`
   - `LEO-Product-VisionaireChromaShift`
   - `LEO-Product-SeeClearDailyFocus`
   - `LEO-Product-SeeClearSunSync`

   Each block should include the product image (from CMS), product name, a short description, and a **Shop Now** button. Move all four to **Email Content Blocks > Product Blocks**.

7. Publish all six content blocks.

8. Verify the content blocks appear in the email builder's Layout tab by creating a test email, dragging a Content Block component onto the canvas, and confirming the picker shows your six blocks.

**(Stretch)** Create a LEOptical Brand object with the brand's primary color, background color, and button style. Set it as the default brand for the LEOptical Marketing workspace.

## Success Criteria

- [ ] The LEOptical Marketing workspace has the four top-level folders (Brand Assets, Product Images, Email Content Blocks, Legal & Compliance) with the correct subfolders.
- [ ] The LEOptical primary logo and wordmark are uploaded to Brand Assets > Logos.
- [ ] All four product images are uploaded to the correct Product Images subfolders.
- [ ] `LEO-Header-Standard` exists in Email Content Blocks > Headers and contains the logo and navigation links.
- [ ] `LEO-Footer-Standard` exists in Email Content Blocks > Footers and contains an unsubscribe link and the physical address merge field.
- [ ] Four product content blocks exist in Email Content Blocks > Product Blocks, one per product family, each with an image, name, description, and CTA button.
- [ ] All six content blocks are published (not in draft).
- [ ] All six blocks appear in the email builder's Content Block component picker.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you cannot answer a question, revisit the relevant section.

- What is the difference between a folder and a collection in a Salesforce CMS workspace? When would you use each?
- If you update the `LEO-Footer-Standard` content block and republish it, what happens to emails that already contain that block?
- A colleague clicks "Convert to Section" on the header content block inside an email they are building. What is the consequence?
- Why does the footer content block need an unsubscribe link if MCA does not validate for its presence?
- The client creates a new email using a Campaign flow trigger. The email does not appear in the LEOptical Marketing workspace. Where is it, and why?
- You need to add a new person as a content creator on the LEOptical Marketing workspace. They should be able to create and edit content but not publish it independently. Which contributor role do you assign?
- The four product content blocks created in this module will be used again later in the course. In which context will they appear, and what data will drive which block gets displayed?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) - Full breakdown of all five MCA reusability tools. The content blocks section covers live-link behavior, Convert to Section, and publishing rules in detail.
- [Marketing Cloud Next Content Creation: Complete Guide](https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/) - Step-by-step walkthrough of content creation navigation, builder component types, and the CAN-SPAM compliance gotchas (unsubscribe link, physical address).
- [Unlock your CMS Workspaces in Marketing Cloud Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/) - Covers workspace operations including asset management, approval workflows, and workspace sharing.
