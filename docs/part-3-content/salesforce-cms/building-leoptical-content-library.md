---
sidebar_position: 2
title: "Building the LEOptical Content Library"
description: "Create the LEOptical Marketing workspace folder structure, upload brand assets, configure the LEOptical Brand, and build six reusable content blocks."
---

## Overview

LEOptical is moving from a basic email service provider to Marketing Cloud Advanced. Before they can send a single email, they need a content library: a structured workspace with their brand assets, product imagery, and reusable email components in place. Without it, every email starts from scratch, and updating a footer requires touching every email individually.

This module builds that library. You will organize the LEOptical Marketing CMS workspace that was created in the <ModuleLink slug="business-units" /> module, upload the course-provided brand assets, configure the LEOptical Brand object with the actual brand colors and typography, and create the six content blocks that will be referenced throughout the rest of the course.

The content blocks you create here (especially the footer) will appear in every promotional email LEOptical sends. Build them correctly now and you will not have to touch them again until the client rebrands.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Accessing the LEOptical Marketing workspace from the MCA Content tab.
- Building a folder structure for brand assets, product images, content blocks, and legal copy.
- Uploading images and documents to the workspace.
- Creating a LEOptical Brand object with the exact brand colors, typography, and button styles, then setting it as the workspace default.
- Creating reusable content blocks for email headers, footers, and product families.
- Understanding the live-link behavior that makes content blocks valuable.
- Compliance requirements baked into the footer content block.
- Verifying that content blocks appear in the email builder's Components Panel.

## Accessing the workspace

The "LEOptical Marketing" workspace was created in the <ModuleLink slug="business-units" /> module. This module opens that workspace and builds inside it.

Navigate to the workspace from the MCA app: **MCA App > Content** (in the top navigation bar). A workspace selector appears. Choose **LEOptical Marketing**.

<ScreenshotPlaceholder alt="MCA Content tab showing a workspace selector with two workspaces listed: Content Workspace for Marketing Cloud (default) and LEOptical Marketing. The LEOptical Marketing workspace is highlighted." />

If you see only the default workspace and not LEOptical Marketing, you can also navigate via **App Launcher > Digital Experiences > CMS Workspaces** and select LEOptical Marketing from the list.

:::warning
Two workspaces are visible in your org: **Content Workspace for Marketing Cloud** (the default) and **LEOptical Marketing** (the one you created). Any emails or landing pages created through Campaign flows always go into the default workspace automatically. Do not be alarmed when you cannot find campaign assets in the LEOptical Marketing workspace. They go to the other one.
:::

If you do not see the LEOptical Marketing workspace at all, check whether your user has been added as a contributor. Go to **MCA App > Content > LEOptical Marketing > Settings (gear icon) > Contributors** and confirm your user has a role of Content Admin.

<ScreenshotPlaceholder alt="The Contributors settings panel for the LEOptical Marketing workspace, showing a table with Name, Email, and Role columns. One row shows a user with the Content Admin role assigned." />

## Building the folder structure

Before uploading a single asset, create the folder structure. A flat workspace with 30 assets becomes impossible to navigate within a month.

:::warning
Content in the workspace is not sorted alphabetically by default. Assets appear in creation order. Create your folders first, before uploading any assets, so new uploads can be placed immediately into the right folder.
:::

The LEOptical Marketing workspace should have this structure:

```
LEOptical Marketing (workspace root)
├── Brand Assets
│   ├── leoptical-logo-primary  (image)
│   ├── leoptical-logo-white    (image)
│   └── LEOptical               (Brand object)
├── Product Images
│   ├── Visionaire UltraLux
│   ├── Visionaire ChromaShift
│   ├── SeeClear DailyFocus
│   └── SeeClear SunSync
├── Email Content Blocks
│   ├── Headers
│   ├── Footers
│   └── Product Blocks
└── 2026
```

**Brand Assets** holds the logos and the Brand object directly. No subfolders needed at this stage.

**Product Images** uses one subfolder per product family so images stay organized as the library grows.

**Email Content Blocks** holds the six reusable blocks you'll build in this module.

**2026** is empty for now. As you build campaign-specific emails in later modules, those emails go here, one subfolder per campaign. This is how production orgs stay navigable over time: year at the top level, campaigns underneath.

To create a folder:

1. Inside the LEOptical Marketing workspace, look for the **New Folder** option (or click the folder icon near the top of the workspace view).
2. Give the folder a name.
3. Save.

{/* VERIFY: Confirm the exact UI action for creating a new folder in an MCA CMS workspace — is it a button labeled New Folder, a dropdown from an Add menu, or a right-click context menu? Document the exact path. */}

Create the four top-level folders first, then create each subfolder inside its parent.

<ScreenshotPlaceholder alt="The LEOptical Marketing workspace showing the four top-level folders: Brand Assets, Product Images, Email Content Blocks, and Legal and Compliance. The Email Content Blocks folder is expanded in the left sidebar showing the Headers, Footers, and Product Blocks subfolders." />

To move an existing asset into a folder: select the asset in the workspace list, then choose **Manage > Move** and select the target folder.

:::tip[Coming from MCE?]
- **Folder structure is the same concept, different location.** In MCE, you organized assets in Content Builder folder hierarchies. In MCA, you do the same thing inside the CMS workspace.
- **No shared folder across BUs.** In MCE, content was scoped to a Business Unit's Content Builder. In MCA, the workspace with its contributor roles replaces BU-level content isolation.
- **Collections are not folders.** If you go looking for a "Collections" menu to organize your email assets, you will not find what you expect. Collections in Salesforce CMS are for Experience Cloud site content display. For email asset organization, use folders.
:::

## Uploading brand assets

The course resources include LEOptical's brand assets. Upload the following files:

| File | Name in workspace | Destination folder |
|------|-------------------|-------------------|
| [leoptical-logo-primary.png](/course-assets/leoptical-logo-primary.png) (PNG, transparent background) | `leoptical-logo-primary` | Brand Assets |
| [leoptical-logo-white.png](/course-assets/leoptical-logo-white.png) (PNG, white on transparent background) | `leoptical-logo-white` | Brand Assets |

To upload an image to the workspace:

1. Navigate to the **LEOptical Marketing** workspace.
2. Click **Add > Image**.
3. Upload the file (drag and drop or browse).
4. Name the image using the names in the table above.
5. Save.
6. After saving, move it to the correct folder via **Manage > Move**.

<ScreenshotPlaceholder alt="The Add Image dialog in the LEOptical Marketing workspace. The file leoptical-logo-primary.png has been selected for upload. The Title field shows leoptical-logo-primary. A Save button appears at the bottom." />

Repeat for each product image provided in the course resources. Place each in the matching product subfamily folder under **Product Images**. The product images are named:

| File | Destination folder |
|------|--------------------|
| [visionaire-ultralux.jpg](/course-assets/visionaire-ultralux.jpg) | Product Images > Visionaire UltraLux |
| [visionaire-chromashift.png](/course-assets/visionaire-chromashift.png) | Product Images > Visionaire ChromaShift |
| [seeclear-dailyfocus.jpg](/course-assets/seeclear-dailyfocus.jpg) | Product Images > SeeClear DailyFocus |
| [seeclear-sunsync.jpg](/course-assets/seeclear-sunsync.jpg) | Product Images > SeeClear SunSync |

{/* VERIFY: Confirm supported image formats (PNG, JPG, GIF, SVG) and maximum file size limits for CMS images in MCA. */}

After uploading, the Brand Assets > Logos folder should look like this:

<ScreenshotPlaceholder alt="The Brand Assets folder in the LEOptical Marketing workspace showing two image assets: leoptical-logo-primary and leoptical-logo-white. Each shows a thumbnail preview and Published status." />

## Creating the LEOptical Brand

A Brand object stores the visual identity defaults for the workspace. When set as the workspace default, every new asset starts with these settings applied. No manual color-picking or button styling needed for each new email or landing page.

To create a Brand: navigate to the **LEOptical Marketing** workspace, click **Add > Brand**, and fill in the fields described below.

<ScreenshotPlaceholder alt="The Add dropdown menu in the LEOptical Marketing workspace with the cursor hovering over Brand. Other options in the menu include Email, Content Block: Email, Landing Page, Form, SMS Message, Image, and Document." />

### LEOptical Brand configuration

Configure the LEOptical Brand with these exact values:

**Brand name:** `LEOptical`

**Colors:**

| Field | Value | Notes |
|-------|-------|-------|
| Primary color | `#11284f` | LEOptical navy (primary buttons, headings, key UI elements) |
| Secondary color | `#5f8ec7` | Accent blue (links and secondary actions) |
| Background color | `#ffffff` | White (standard email background) |
| Surface color | `#f7fafc` | Cream (card backgrounds and section dividers) |
| Text color | `#1e2a35` | Ink (body copy) |
| Muted text color | `#617084` | Muted (secondary text, captions, footnotes) |

{/* VERIFY: Confirm which color fields are actually present in the MCA Brand editor. The field labels above are inferred from the platform's brand configuration. Confirm the exact field names and whether all six color fields exist, or whether only primary and background colors are configurable. */}

**Typography:**

| Field | Value |
|-------|-------|
| Heading font | Palatino, Georgia, serif (Iowan Old Style is the primary brand font, not a web-safe fallback. Georgia is the web-safe substitute.) |
| Body font | "Segoe UI", "Helvetica Neue", sans-serif |

{/* VERIFY: Confirm whether the MCA Brand editor allows custom font family strings, or whether it is limited to a dropdown of web-safe fonts or Google Fonts. If custom strings are not supported, use Georgia for headings and Helvetica Neue for body. */}

**Button style:**

| Field | Value |
|-------|-------|
| Button background | `#11284f` (navy) |
| Button text color | `#ffffff` (white) |
| Button border radius | 30px (fully rounded, pill shape matching LEOptical's web presence) |
| Button style | Filled |

<ScreenshotPlaceholder alt="The Brand editor for a new Brand asset named LEOptical. The Colors section shows Primary Color set to #11284f and Background Color set to #ffffff. The Button section shows a filled pill-style button with navy background and white text. A preview of the button appears on the right." />

After filling in all fields, click **Save**. The Brand appears in the workspace root. Move it to **Brand Assets** via **Manage > Move** so it sits alongside the logo images.

### Setting the LEOptical Brand as the workspace default

After saving the Brand, set it as the workspace default so all new assets inherit these settings automatically:

1. Open the **LEOptical Marketing** workspace settings: click the gear icon on the workspace page.
2. Find the **Default Brand** or **Brand** section in settings.
3. Select the LEOptical Brand you just created.
4. Save.

{/* VERIFY: Confirm the exact navigation path for setting a Brand as the workspace default. Is it under Settings > Brand, or is there a "Set as Default" button on the Brand asset detail page itself? Confirm in a live SDO. */}

<ScreenshotPlaceholder alt="The LEOptical Marketing workspace settings panel showing a Brand section. The LEOptical brand is selected as the Default Brand for this workspace. A Save button appears at the bottom of the settings panel." />

After setting the default Brand, all new emails and landing pages you create in this workspace will inherit these settings automatically. Existing assets are not retroactively updated.

## Content blocks: the reusability engine

Content blocks are the most important reusability tool in MCA for email work. Each content block is a named, versioned asset stored in the CMS workspace. When you add a content block to an email, a live link is created, not a copy.

**What live-link means:** When you update a content block and republish it, every email that contains that block reflects the change. Update the footer once and all emails update. Republish the header after a logo change and every email gets the new logo automatically.

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

<ScreenshotPlaceholder alt="A new Content Block: Email canvas open in the MCA email builder. The canvas is empty with a placeholder prompting you to drag components. The left panel shows the Components Panel with Basics, Layout, and Media tabs. A Title field at the top shows the block name being edited." />

### LEO-Header-Standard

This block goes at the top of every promotional email.

**Components to build:**

1. Add a **Section** as the outer container. Set its background color to `#11284f` (LEOptical navy).
2. Inside the section, add an **Image** component. Select `leoptical-logo-white` from the CMS (the white logo variant renders correctly against the dark header background).
   - Set image width to 160px.
   - Set alt text to: `LEOptical`
3. Below the logo, add a **Paragraph** component for navigation links. Type the following as plain text (the email builder does not have a dedicated nav component):
   `Eye Exams  |  Lenses  |  Contacts  |  Frames  |  VisionCare Rewards`
   Set font color to `#dbe7f4` (accent soft, readable against navy without being pure white).

{/* VERIFY: Confirm whether navigation links in a content block are standard text/paragraph components, or whether there is a dedicated navigation component in the email builder. Also confirm whether inline-linked text in a content block retains link styling when the block is placed into an email. */}

Name the block `LEO-Header-Standard`. After saving, move it to **Email Content Blocks > Headers**.

<ScreenshotPlaceholder alt="The LEO-Header-Standard content block on the email canvas. A dark navy section fills the full width. The white LEOptical logo appears on the left. Below it, navigation link text reads Eye Exams, Lenses, Contacts, Frames, VisionCare Rewards in a light blue-grey color." />

### LEO-Footer-Standard

This block goes at the bottom of every promotional email. It has compliance requirements.

**Components to build:**

1. Add a **Section** as the outer container. Set background color to `#f7fafc` (LEOptical cream).
2. Add a **Divider** component at the top of the section. Set divider color to `rgba(17, 40, 79, 0.12)` (LEOptical's border color).
3. Add a **Paragraph** component for the unsubscribe link. The text should read:

   ```
   You are receiving this email because you opted in to LEOptical marketing communications.
   Unsubscribe
   ```

   Link the word "Unsubscribe" using the platform's unsubscribe link option. This is not a regular hyperlink. You must use the platform's built-in unsubscribe action so it processes correctly at send time.

   {/* VERIFY: Confirm the exact mechanism for inserting a functional unsubscribe link in the MCA email builder. Is it a special merge field, a Link Type option in the URL field, or a dedicated Unsubscribe component? */}

4. Add a **Paragraph** component for the physical address. Use the org address merge field:

```
{!$organization.Address}
{!$organization.City}, {!$organization.State} {!$organization.Zip}
```

   {/* VERIFY: Confirm the exact merge field syntax for the org's physical mailing address in MCA. The syntax above uses the classic Salesforce merge field format. Confirm whether MCA uses Handlebars notation ({{$organization.Address}}) or the classic bang-notation ({!$organization.Address}) in content block text components. */}

5. Add a **Paragraph** component for the privacy policy link and copyright notice:

   ```
   Privacy Policy
   © 2025 LEOptical. All rights reserved.
   ```

   Link "Privacy Policy" to LEOptical's privacy policy page.

Set all paragraph font sizes to 12px, font color to `#617084` (LEOptical muted).


Name the block `LEO-Footer-Standard`. After saving, move it to **Email Content Blocks > Footers**.

<ScreenshotPlaceholder alt="The LEO-Footer-Standard content block on the email canvas. A light cream section with a subtle top divider line. Small grey text reads that the recipient opted in to LEOptical marketing communications, followed by an Unsubscribe link. Below that is the org address merge field. A bottom line shows the Privacy Policy link and copyright notice." />

### Four product blocks

Create one content block per product family. Each block has the same structure.

**Components to build (same for all four):**

1. Add a **Section** as the outer container. Set background color to `#ffffff` (white).
2. Add an **Image** component. Select the matching product image from the CMS.
   - Set image width to 100% of the section.
   - Add descriptive alt text for the product.
3. Add a **Heading** component (H3 level) for the product name. Set font color to `#11284f` (navy). Set font family to Georgia, serif.
4. Add a **Paragraph** component for the two-line description. Set font color to `#1e2a35` (ink). Keep it to two sentences maximum.
5. Add a **Button** component labeled **Shop Now**.
   - Button background: `#11284f` (navy)
   - Button text: `#ffffff` (white)
   - Border radius: 30px (pill shape)
   - Link: placeholder URL for now (you will configure product page URLs in a later module)

| Block name | Product name (for heading) | Product SKU | Description (two lines) |
|-----------|---------------------------|-------------|------------------------|
| `LEO-Product-VisionaireUltraLux` | Visionaire UltraLux | VIS-ULX-001 | Precision-engineered lenses for everyday clarity. Lightweight frames with UV400 protection built in. |
| `LEO-Product-VisionaireChromaShift` | Visionaire ChromaShift | VIS-CHS-001 | Adaptive outdoor lenses that respond to changing light. Photochromic technology with polarized clarity. |
| `LEO-Product-SeeClearDailyFocus` | SeeClear DailyFocus | SEC-DLF-001 | Smart everyday lenses optimized for screen use. Anti-fatigue coating with blue light filtering. |
| `LEO-Product-SeeClearSunSync` | SeeClear SunSync | SEC-SNS-001 | Outdoor transition lenses that shift with the sun. Full UV blocking with fast dark-to-clear recovery. |

Move all four blocks to **Email Content Blocks > Product Blocks** after saving.

<ScreenshotPlaceholder alt="The LEO-Product-VisionaireUltraLux content block on the email canvas. A white section contains a product image at the top, followed by the heading Visionaire UltraLux in dark navy text, a two-line product description in dark ink, and a pill-shaped navy Shop Now button." />

After creating all four, the Product Blocks folder should look like this:

<ScreenshotPlaceholder alt="The Email Content Blocks > Product Blocks folder in the LEOptical Marketing workspace showing four content block assets: LEO-Product-VisionaireUltraLux, LEO-Product-VisionaireChromaShift, LEO-Product-SeeClearDailyFocus, and LEO-Product-SeeClearSunSync. All four show Published status." />

## Publishing the content blocks

A content block in Draft status is visible on the email canvas and in preview, but it does not make the block available to be selected in the email builder's content block picker.

To publish a content block:

1. Open the block from the workspace.
2. Click **Publish**.
3. Confirm the publish action.
4. The block status changes from **Draft** to **Published**.

Publish all six blocks:
- `LEO-Header-Standard`
- `LEO-Footer-Standard`
- `LEO-Product-VisionaireUltraLux`
- `LEO-Product-VisionaireChromaShift`
- `LEO-Product-SeeClearDailyFocus`
- `LEO-Product-SeeClearSunSync`

<ScreenshotPlaceholder alt="The LEO-Header-Standard content block detail view. The Publish button is highlighted in the top-right action bar. The current status shows Draft. A dropdown next to Publish shows Publish and Schedule options." />

## Verifying content blocks in the email builder

After publishing the blocks, confirm they are accessible from the email builder:

1. From the LEOptical Marketing workspace, click **Add > Email** to create a test email. (You can delete it after this step. This is only a verification.)
2. Open the email builder.
3. In the Components Panel on the left, click the **Layout** tab.
4. Drag a **Content Block** component onto the canvas.
5. A picker appears. Verify that your six LEOptical blocks appear in the list.

{/* VERIFY: Confirm the exact location and label of the content block picker in the email builder UI. Is it a modal dialog, a side panel, or an inline dropdown? Confirm in a live SDO. */}

<ScreenshotPlaceholder alt="The Content Block picker modal showing a list of available content blocks from the LEOptical Marketing workspace. The six LEOptical blocks are listed: LEO-Header-Standard, LEO-Footer-Standard, LEO-Product-VisionaireUltraLux, LEO-Product-VisionaireChromaShift, LEO-Product-SeeClearDailyFocus, and LEO-Product-SeeClearSunSync." />

If your blocks do not appear, the most common cause is that they were not published. Return to the workspace, confirm each block shows **Published** status, and try again.

## Assignment

> **The client wants:** A structured content library in the LEOptical Marketing CMS workspace, ready for use in email campaigns: organized assets, the brand configured with LEOptical's exact colors and typography, reusable content blocks for headers, footers, and all four product families, and a footer block that meets CAN-SPAM requirements.

1. Access the **LEOptical Marketing** workspace from the MCA Content tab. Confirm you are in the correct workspace (not the default one).

2. Create the folder structure:
   - Brand Assets (no subfolders)
   - Product Images (with one subfolder per product family: Visionaire UltraLux, Visionaire ChromaShift, SeeClear DailyFocus, SeeClear SunSync)
   - Email Content Blocks (with Headers, Footers, and Product Blocks subfolders)
   - 2026 (leave empty for now. You will add campaign subfolders here in later modules.)

3. Upload the course-provided brand assets to **Brand Assets**:
   - `leoptical-logo-primary` (PNG, transparent background)
   - `leoptical-logo-white` (PNG, white on transparent background)

4. Upload the four product images to their respective subfolders under **Product Images**.

5. Create the **LEOptical Brand** object with:
   - Primary color: `#11284f`
   - Accent/secondary color: `#5f8ec7`
   - Background: `#ffffff`
   - Button style: filled, pill shape (`30px` border radius), navy background, white text
   - Typography: Georgia, serif for headings. Segoe UI / Helvetica Neue, sans-serif for body.

   Set it as the default Brand for the LEOptical Marketing workspace.

6. Create the **LEO-Header-Standard** content block:
   - Navy (`#11284f`) background section
   - White LEOptical logo (`leoptical-logo-white`) from CMS, 160px wide
   - Navigation text in `#dbe7f4`: `Eye Exams  |  Lenses  |  Contacts  |  Frames  |  VisionCare Rewards`

   Move to **Email Content Blocks > Headers**.

7. Create the **LEO-Footer-Standard** content block:
   - Cream (`#f7fafc`) background section
   - Unsubscribe link (using the platform's unsubscribe action, not a plain hyperlink)
   - Physical address merge field (see the merge field syntax in the footer block section above)
   - Privacy policy link and copyright notice
   - All text at 12px in `#617084` (muted)

   Move to **Email Content Blocks > Footers**.

8. Create one content block per product family:

   | Block name | Image | Heading color | Button |
   |-----------|-------|---------------|--------|
   | `LEO-Product-VisionaireUltraLux` | `visionaire-ultralux.jpg` from CMS | `#11284f` | Navy pill, Shop Now |
   | `LEO-Product-VisionaireChromaShift` | `visionaire-chromashift.png` from CMS | `#11284f` | Navy pill, Shop Now |
   | `LEO-Product-SeeClearDailyFocus` | `seeclear-dailyfocus.jpg` from CMS | `#11284f` | Navy pill, Shop Now |
   | `LEO-Product-SeeClearSunSync` | `seeclear-sunsync.jpg` from CMS | `#11284f` | Navy pill, Shop Now |

   Move all four to **Email Content Blocks > Product Blocks**.

9. Publish all six content blocks.

10. Verify the content blocks appear in the email builder by creating a test email, dragging a Content Block component onto the canvas, and confirming the picker shows all six blocks.

## Success Criteria

- [ ] The LEOptical Marketing workspace has four top-level folders: Brand Assets, Product Images, Email Content Blocks, and 2026.
- [ ] Both logo assets are uploaded to Brand Assets and show Published status.
- [ ] All four product images are uploaded to the correct Product Images subfolders.
- [ ] A LEOptical Brand object exists in Brand Assets with primary color `#11284f`, background `#ffffff`, and a pill-style (`30px` border radius) navy button.
- [ ] The LEOptical Brand is set as the workspace default Brand.
- [ ] `LEO-Header-Standard` exists in Email Content Blocks > Headers. It contains the white LEOptical logo on a navy background, and navigation link text.
- [ ] `LEO-Footer-Standard` exists in Email Content Blocks > Footers. It contains a functional unsubscribe link, the org address merge field, privacy policy link, and copyright notice.
- [ ] Four product content blocks exist in Email Content Blocks > Product Blocks. Each has the CMS product image, a navy heading, a two-line description, and a pill-style navy Shop Now button.
- [ ] All six content blocks are Published (not Draft).
- [ ] All six blocks appear in the email builder's Content Block component picker.
- [ ] You can explain why `leoptical-logo-white` is used in the header block instead of `leoptical-logo-primary`.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you cannot answer a question, revisit the relevant section.

- What does setting a Brand as the workspace default actually do? What does it not do to assets that already exist?
- What is the difference between a folder and a collection in a Salesforce CMS workspace? When would you use each?
- If you update the `LEO-Footer-Standard` content block and republish it, what happens to emails that already contain that block?
- A colleague clicks "Convert to Section" on the header content block inside an email they are building. What is the consequence? When might that be the correct choice?
- Why does the footer content block need an unsubscribe link if MCA does not validate for its presence before sending?
- The client creates a new email using a Campaign flow trigger. The email does not appear in the LEOptical Marketing workspace. Where is it, and why?
- You need to add a new person as a content creator on the LEOptical Marketing workspace. They should be able to create and edit content but not publish it independently. Which contributor role do you assign?
- The four product content blocks created in this module will be used again later in the course. In which context will they appear, and what data will drive which block gets displayed?
- Why did you upload `leoptical-logo-white` as a separate asset rather than just using CSS to change the logo color in the header block?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) - Full breakdown of all five MCA reusability tools. The content blocks section covers live-link behavior, Convert to Section, and publishing rules in detail.
- [Marketing Cloud Next Content Creation: Complete Guide](https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/) - Step-by-step walkthrough of content creation navigation, builder component types, and the CAN-SPAM compliance gotchas (unsubscribe link, physical address).
- [Unlock your CMS Workspaces in Marketing Cloud Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/) - Covers workspace operations including asset management, approval workflows, and workspace sharing.
- [Brands in Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_brand.htm&language=en_US&type=5) - Official documentation for Brand asset configuration and workspace default assignment.
