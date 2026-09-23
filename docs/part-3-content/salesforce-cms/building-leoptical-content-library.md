---
sidebar_position: 2
title: "Building the LEOptical Content Library"
description: "Create the LEOptical Marketing workspace folder structure, upload brand assets, and configure every section of the LEOptical Brand."
---

## Overview

LEOptical is moving from a basic email service provider to Marketing Cloud Advanced. Before anyone can build an email, the content library needs structure: organized folders, uploaded brand assets, and a fully configured Brand object that carries the company's visual identity into every new asset.

This module builds that foundation. You will organize the LEOptical Marketing CMS workspace, upload logos and product images, and configure every section of the LEOptical Brand, from colors and typography to AI-facing fields like Brand Identity and Brand Tone. The Brand you configure here will be set as the workspace default, so every email, landing page, and content block created in this workspace starts on-brand without manual effort.

Content blocks (headers, footers, product blocks) come later. You will build those in the <ModuleLink slug="content-blocks" /> module after you have learned the email builder's components. This module is about the workspace infrastructure those blocks will live in.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Accessing the LEOptical Marketing workspace from the MCA Content tab.
- Building a folder structure for brand assets, product images, content blocks, and campaign content.
- Uploading images to the workspace and organizing them into folders.
- Publishing uploaded images so they are available in the email builder.
- Creating a Brand object and configuring every section: Brand Details, Brand Identity, Brand Tone, Colors, Typography, Buttons, Margin and Padding, and Borders.
- How Brand Identity and Brand Tone feed Agentforce's generative AI features.
- Setting the Brand as the workspace default.
- Disabling approval workflows to prevent content from getting stuck in review.

## Accessing the workspace

The "LEOptical Marketing" workspace was created in the <ModuleLink slug="business-units" /> module. This module opens that workspace and builds inside it.

Navigate to the workspace from the MCA app: **MCA App > Content** (in the top navigation bar). A workspace selector appears. Choose **LEOptical Marketing**.

<Screenshot src="/img/salesforce-cms/workspace-selector.png" alt="The workspace selector dropdown in the Content tab showing LEOptical Marketing and Content Workspace for Marketing Cloud." />

If you see only the default workspace and not LEOptical Marketing, try the alternative path: **App Launcher > Digital Experiences > CMS Workspaces** and select LEOptical Marketing from the list.

:::warning
SDO environments come with several pre-built workspaces. In a client org, you would typically see only the default **Content Workspace for Marketing Cloud** unless someone has created additional workspaces. Either way, any emails or landing pages created through Campaign flows always go into the default workspace automatically. If you cannot find campaign assets in the LEOptical Marketing workspace, check the default one.
:::

If you do not see the LEOptical Marketing workspace at all, check whether your user has been added as a contributor. Navigate via **App Launcher > Digital Experiences > CMS Workspaces > LEOptical Marketing > Contributors** and confirm your user has a role of Content Admin.

<Screenshot src="/img/salesforce-cms/workspace-contributors.png" alt="The Contributors panel for the LEOptical Marketing workspace showing one user with the Content Admin role assigned." />

## Building the folder structure

Before uploading a single asset, create the folder structure. A flat workspace with dozens of assets becomes impossible to navigate within a month.

:::warning
Content in the workspace is not sorted alphabetically by default. Assets appear in creation order. Create your folders first, before uploading any assets, so new uploads can be placed immediately into the right folder.
:::

The LEOptical Marketing workspace should have this structure:

```
LEOptical Marketing (workspace root)
├── Brand Assets
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

**Brand Assets** holds the logos and the Brand object. No subfolders needed at this stage.

**Product Images** uses one subfolder per product family so images stay organized as the library grows.

**Email Content Blocks** is empty for now. You will build the header, footer, and product content blocks in the <ModuleLink slug="content-blocks" /> module and place them here.

**2026** is also empty for now. As you build campaign-specific emails in later modules, those emails go here, one subfolder per campaign. This is how production orgs stay navigable over time: year at the top level, campaigns underneath.

To create a folder:

1. Inside the LEOptical Marketing workspace, click the **Add** button and select **Folder** from the dropdown menu.
2. Give the folder a name.
3. Save.

Create the four top-level folders first, then create each subfolder inside its parent.

<Screenshot src="/img/salesforce-cms/workspace-folder-structure.png" alt="The LEOptical Marketing workspace root showing the four top-level folders: Brand Assets, Product Images, Email Content Blocks, and Year-2026." />

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
2. Click **Add > Content**, then select **Image** from the content type picker.
3. Upload the file (drag and drop or use the Upload button).
4. Name the image using the names in the table above.
5. Save.
6. After saving, move it to the correct folder via **Manage > Move**.

<Screenshot src="/img/salesforce-cms/add-content-type-picker.png" alt="The Create CMS content dialog showing all available content types including Audio, Brand, Content Block: Email, Document, Email, Form, Image, Landing Page, SMS and MMS, and more." />

Repeat for each product image provided in the course resources. Place each in the matching product family subfolder under **Product Images**.

| File | Destination folder |
|------|--------------------|
| [visionaire-ultralux.jpg](/course-assets/visionaire-ultralux.jpg) | Product Images > Visionaire UltraLux |
| [visionaire-chromashift.png](/course-assets/visionaire-chromashift.png) | Product Images > Visionaire ChromaShift |
| [seeclear-dailyfocus.jpg](/course-assets/seeclear-dailyfocus.jpg) | Product Images > SeeClear DailyFocus |
| [seeclear-sunsync.jpg](/course-assets/seeclear-sunsync.jpg) | Product Images > SeeClear SunSync |

After uploading, the Brand Assets folder should look like this:

<Screenshot src="/img/building-leoptical-content-library/01-brand-assets-logos.png" alt="The Brand Assets folder in the LEOptical Marketing workspace showing leoptical-logo-primary and leoptical-logo-white image assets." />

### Publishing uploaded images

Images in Draft status are not available in the email builder. Publish each image after uploading:

1. Open the image from the workspace.
2. Click **Publish**.
3. Confirm the publish action.

Publish both logo images and all four product images. You will need them when building content blocks and emails in later modules.

{/* VERIFY: Confirm whether Draft images are accessible from the email builder's Image component picker, or whether they must be Published first. */}

## Creating the LEOptical Brand

A Brand object stores the visual identity defaults for the workspace. It has eight configurable sections. When set as the workspace default, every new asset starts with these settings applied.

To create a Brand: navigate to the **LEOptical Marketing** workspace, click **Add > Content**, select **Brand** from the content type picker, and click **Create**.

<Screenshot src="/img/salesforce-cms/add-brand-menu.png" alt="The Create CMS content dialog with Brand selected as the content type." />

The Brand editor opens with the live preview panel on the right. As you configure each section, the preview updates to show how your settings will look in emails and landing pages.

### Brand Details

The first section at the top of the Brand editor contains the title, API name, and description. The description is internal, visible only to workspace contributors. It does not appear in any customer-facing content.

Set **Title** to `LEOptical`. The API Name auto-generates and cannot be edited.

For the **Description** field, paste the following:

<CopyText>Visual identity for LEOptical email campaigns, landing pages, and content blocks. Covers all four communication types: Promotional Offers, VisionCare Rewards, Eye Health Reminders, and Order Updates.</CopyText>

<Screenshot src="/img/salesforce-cms/brand-description.png" alt="The Brand Details section of the Brand editor showing the Title field set to LEOptical, the auto-generated API Name, and the Description field filled in." size="wide" />

### Brand Identity

Brand Identity is a free-text field that describes your company or brand. This field feeds Agentforce's generative AI features. When a marketer uses AI to generate email subject lines, preheaders, or body copy, the AI reads this field to understand what the company does and how it should frame messaging.

If this field is empty, the AI generates generic copy. If it is filled in with specifics about the business, the AI produces copy that aligns with the company's positioning.

Paste the following into the Brand Identity field:

<CopyText>LEOptical is a direct-to-consumer eyecare and eyewear company. We sell prescription lenses, contact lenses, and frames online and in-clinic. We run in-person eye exams and a four-tier loyalty program called VisionCare Rewards. Our customers are not impulse buyers. Vision care is considered, recurring, and personal. Our brand position is clear communication from a company that actually knows you. We focus on relevance over volume: emails that reflect what the customer has actually done, health reminders that feel like a service, and loyalty updates that treat the customer's history as worth something.</CopyText>

<Screenshot src="/img/salesforce-cms/brand-identity.png" alt="The Brand Identity section showing the descriptive text and a plain-text field filled with the LEOptical brand description, with a 607/1000 character count." size="wide" />

### Brand Tone

Brand Tone controls the voice the AI uses when generating content. The editor displays five preset tone cards. Each card has a name and a description that the AI reads when generating copy. The default tone is marked "Default" and is used automatically for new content. Content authors can select a different tone when they refine generated text.

<Screenshot src="/img/salesforce-cms/brand-tone.png" alt="The Brand Tone section showing five preset tone cards: Professional (marked Default), Casual, Urgent, Inquisitive, and Plain, each with a description of the style." />

The five preset tones are:

| Tone | When to use |
|------|-------------|
| Professional | Default for most business communications. Clean and direct. |
| Casual | Warmer, more conversational. Appropriate for loyalty program updates. |
| Urgent | Time-sensitive messaging. Use sparingly and only when genuinely time-bound. |
| Inquisitive | Question-led copy. Useful for re-engagement or survey-related emails. |
| Plain | Minimal styling. Appropriate for transactional notifications. |

Professional is already the default, which is correct for LEOptical. To customize what "Professional" means for this brand, click the edit (pencil) icon on the Professional card. This opens the **Edit brand tone** modal with two fields: **Name** and **Description**. The Description is the text the AI reads when generating content in this tone.

Replace the default Professional description with the following:

<CopyText>Direct and warm, not effusive. Confident about our products without being pushy. Precise with facts like dates, point balances, and order numbers. Avoid hype and superlatives. No manufactured urgency. Short sentences. Lead with the value, not the brand.</CopyText>

<Screenshot src="/img/salesforce-cms/edit-brand-tone.png" alt="The Edit brand tone modal showing the Name field set to Professional and the Description field where you customize the tone's AI instructions." size="wide" />

### Colors

The Colors section defines the default color palette applied to text, backgrounds, and accents across all content created in this workspace.

| Field | Value | Role |
|-------|-------|------|
| Accent | `#11284f` | LEOptical navy. Primary buttons, headings, key UI elements. |
| Accent Contrast | `#ffffff` | White. Text on accent-colored elements. |
| Background | `#ffffff` | White. Standard email background. |
| Text | `#1e2a35` | Ink. All body copy. |
| Border | `#E2E5EA` | Subtle navy-tinted border for dividers and card edges. |

:::info
The color system has more values than the Brand editor supports. LEOptical also uses Accent Blue (`#5f8ec7`) for links, Surface (`#f7fafc`) for card backgrounds, Muted (`#617084`) for footer text, and Nav link (`#dbe7f4`) for header navigation. Those colors are applied manually when building specific components. The Brand editor handles the baseline defaults.
:::

<Screenshot src="/img/salesforce-cms/colors.png" alt="The Colors section of the Brand editor showing the color preview swatch and a popover with five fields: Accent, Accent Contrast, Background, Text, and Border, all configured with LEOptical values." size="wide" />

### Typography

Typography has two layers: the base font family and font sizes (applied globally), and per-style text style overrides for specific elements.

**Base Font Family and Font Sizes:**

| Field | Value |
|-------|-------|
| Base Font Family | Trebuchet MS |
| Base Font Size (px) | 16 |

The Base Font Family dropdown is limited to web-safe fonts: Arial, Georgia, Trebuchet MS, Verdana, and others. Custom font family strings are not supported.

Below the base font, the editor exposes six named font sizes. These are not direct font sizes you assign to elements. Instead, they define a scale of named sizes (Tiny through Huge) that the text style overrides reference. When you configure a text style, you pick one of these named sizes rather than typing a pixel value directly.

| Specified Font Size | Pixel Value | Rem Value |
|---------------------|-------------|-----------|
| Tiny | 10 | 0.625 |
| Small | 13 | 0.8125 |
| Medium | 16 | 1 |
| Large | 18 | 1.125 |
| Extra Large | 24 | 1.5 |
| Huge | 32 | 2 |

The defaults work for LEOptical. Leave these as-is.

<Screenshot src="/img/salesforce-cms/typography.png" alt="The Typography section showing the Base Font Family dropdown set to Trebuchet MS, Base Font Size of 16, and the six named font sizes (Tiny through Huge) with pixel and rem values." size="wide" />

**Text Styles:**

Below the font sizes, the editor lists every text style as a card. Click the edit (pencil) icon on each card to configure the font family and which named size it uses.

| Style | Font | Named Size | Effective px | Notes |
|-------|------|------------|-------------|-------|
| Heading Style 1 | Georgia | Huge | 32px | Email title, hero section heading |
| Heading Style 2 | Georgia | Extra Large | 24px | Section headings |
| Heading Style 3 | Trebuchet MS | Large | 18px | Product names, card headings |
| Heading Style 4 | Trebuchet MS | Medium | 16px | Field labels, table headers |
| Heading Style 5 | Trebuchet MS | Small | 13px | Leave at default if no H5 use case |
| Heading Style 6 | Trebuchet MS | Tiny | 10px | Leave at default if no H6 use case |
| Paragraph 1 | Trebuchet MS | Medium | 16px | Body copy |
| Paragraph 2 | Trebuchet MS | Small | 13px | Secondary body text |
| Button | Trebuchet MS | Medium | 16px | Button label text |
| Input | Trebuchet MS | Medium | 16px | Form input fields |
| Label | Trebuchet MS | Small | 13px | Form field labels |

The key changes from the defaults: set Heading Style 1 and Heading Style 2 to **Georgia** for a serif/sans-serif contrast against Trebuchet MS body copy.

<Screenshot src="/img/salesforce-cms/text-styles-1.png" alt="The Text Styles list showing Heading Style 1 through Heading Style 6 and Paragraph 1, each displaying the font family, named size, and pixel/rem values." size="wide" />

<Screenshot src="/img/salesforce-cms/text-styles-2.png" alt="The Text Styles list continued, showing Heading Style 4 through Label, including Paragraph 1, Paragraph 2, Button, Input, and Label styles." size="wide" />

### Buttons

The Brand editor has three button style cards that form a visual hierarchy: Primary (filled), Secondary (outline), and Tertiary (text only). Click the edit (pencil) icon on each card to configure it. Each button editor has expandable sections for Border, Text, and Layout. Font settings for buttons are inherited from the Button text style in the Typography section above.

**Primary (Filled):**

The main call to action. One per email. The Primary button inherits the Brand's Accent color for its background and Accent Contrast for its text, so if you set the Colors section correctly, the Primary button is already navy with white text. Set the border radius to 30px for the pill shape.

| Section | Field | Value |
|---------|-------|-------|
| Border | Border Radius | Custom, 30px |

**Secondary (Outline):**

Used when a primary button exists and a second action is needed at a lower visual weight. Same shape as primary, but with a navy border instead of a navy fill.

| Section | Field | Value |
|---------|-------|-------|
| Border | Border Radius | Custom, 30px |
| Border | Border Weight | Custom, 0.15 rem |

<Screenshot src="/img/salesforce-cms/secondary-button-outline.png" alt="The Secondary button editor showing the Border section with Border Radius set to Custom 30px and Border Weight set to Custom 0.15 rem." size="wide" />

**Tertiary (Text only):**

For low-emphasis actions like "Manage your preferences" or "View order details." Renders as a styled text link, not a button shape. Set the text color to Accent Blue so it reads as a link rather than body copy.

| Section | Field | Value |
|---------|-------|-------|
| Colors | Text | `#5f8ec7` (Accent Blue) |

<Screenshot src="/img/salesforce-cms/tertiary-button-color.png" alt="The Tertiary button editor showing the Colors section with the Text color set to Accent Blue (#5f8ec7)." size="wide" />

### Margin and Padding

These values define the spacing presets available throughout the email builder. When you configure a component's spacing, a dropdown appears with the named sizes you define here (None, Tiny, Small, Medium, Large, Extra Large) plus a Custom option for arbitrary values. The same presets apply to both margin (space outside a component) and padding (space inside it).

<Screenshot src="/img/salesforce-cms/padding-dropdown-showing-spacing.png" alt="A Padding dropdown in the button editor's Layout section showing the named size options (None, Tiny, Small, Medium, Large, Extra Large, Custom) that map to the Brand's spacing presets." size="narrow" />

The Brand editor provides six named sizes, each with a single pixel value. Editing the pixel value auto-updates the rem value and vice versa.

Configure the presets with the following values:

| Specified Size | Pixel Value | Rem Value |
|---------------|-------------|-----------|
| None | 0 | 0 |
| Tiny | 8 | 0.5 |
| Small | 16 | 1 |
| Medium | 24 | 1.5 |
| Large | 40 | 2.5 |
| Extra Large | 56 | 3.5 |

The defaults (8, 12, 16, 24, 32) are fine for most brands. The LEOptical values above widen the scale at the top end. Small at 16px matches body copy padding inside product blocks. Medium at 24px is the standard section padding. Large at 40px matches hero section vertical padding. Extra Large at 56px gives room for major section breaks in longer emails.

<Screenshot src="/img/salesforce-cms/margin-and-padding.png" alt="The Margin and Padding section of the Brand editor showing six specified sizes (None through Extra Large) with pixel and rem value fields and blue square visual examples showing relative scale." />

### Borders

The Borders section has two subsections: Border Weight (thickness of lines around components) and Border Radius (corner rounding). Like Margin and Padding, these define named presets that appear as dropdown options when you configure a component's borders in the email builder.

**Border Weight:**

| Specified Weight | Pixel Value | Rem Value |
|-----------------|-------------|-----------|
| None | 0 | 0 |
| Thin | 1 | 0.0625 |
| Medium | 2 | 0.125 |
| Thick | 3 | 0.1875 |

The defaults work for LEOptical. Thin (1px) is the standard border for dividers and card edges. The border color defined in the Colors section (`#E2E5EA`) applies when you add a border to a component.

**Border Radius:**

| Specified Shape | Pixel Value | Rem Value |
|----------------|-------------|-----------|
| Square | 0 | 0 |
| Rounded | 8 | 0.5 |

Change **Rounded** to **8px** (0.5 rem). This gives content containers and cards a subtle rounded corner. The 30px pill shape on buttons is configured separately in the Buttons section and is not affected by this value.

<Screenshot src="/img/salesforce-cms/borders.png" alt="The Borders section of the Brand editor showing Border Weight presets (None, Thin, Medium, Thick) and Border Radius presets (Square at 0px and Rounded at 8px) with pixel, rem, and visual examples." />

### Saving and publishing the Brand

After configuring all eight sections:

1. Click **Save** in the top-right corner.
2. Click **Publish** to make the Brand available for use.

<Screenshot src="/img/building-leoptical-content-library/03-brand-saved.png" alt="The Brand editor after saving, showing the Save, Publish, and Workflows buttons in the top-right corner." />

After publishing, move the Brand to the **Brand Assets** folder via **Manage > Move** so it sits alongside the logo images.

### Setting the LEOptical Brand as the workspace default

After publishing the Brand, set it as the workspace default so all new assets inherit these settings automatically:

1. Return to the **LEOptical Marketing** workspace root.
2. Click the gear icon (workspace settings).
3. Select **Default Brand** (or **Manage default workspace brand**).
4. Choose the **LEOptical** Brand from the picker.
5. Click **Save**.

<Screenshot src="/img/building-leoptical-content-library/05-brand-default-setting.png" alt="The Manage default workspace brand dialog with LEOptical selected as the workspace default Brand." />

After setting the default Brand, every new email, landing page, and content block created in this workspace inherits the LEOptical color palette, typography, and button styles. Existing assets are not retroactively updated.

:::tip[Coming from MCE?]
MCE had no equivalent concept at this level. Visual consistency in MCE came from email template HTML and brand-level CSS, which required a developer to maintain. In MCA, Brand is a first-class CMS asset any Content Admin can configure and update. The AI integration (Brand Identity and Brand Tone) is entirely new.
:::

## Disabling approval workflows

Enhanced CMS workspaces have approval workflows turned on by default. If left enabled, content you create gets stuck in a review queue with no one monitoring it.

For a training environment, disable the workflow:

1. Open the **LEOptical Marketing** workspace settings (gear icon).
2. Find the **Workflows and Approvals** section.
3. Toggle it to **Off**.
4. Save.

You can re-enable it later or disable it selectively per asset type. For now, turning it off prevents content from getting locked in a pending state while you are learning.

{/* VERIFY: Confirm the exact navigation to disable approval workflows. Is it under the gear icon > Workflow, or is it a separate settings panel? Screenshot the Workflows and Approvals toggle in the SDO. */}

## Assignment

> **The client wants:** A structured content library in the LEOptical Marketing CMS workspace with organized assets and the brand fully configured so every new email and landing page starts on-brand without manual effort.

1. Access the **LEOptical Marketing** workspace from the MCA Content tab. Confirm you are in the correct workspace (not the default one).

2. Create the folder structure:
   - Brand Assets (no subfolders)
   - Product Images (with one subfolder per product family: Visionaire UltraLux, Visionaire ChromaShift, SeeClear DailyFocus, SeeClear SunSync)
   - Email Content Blocks (with Headers, Footers, and Product Blocks subfolders)
   - 2026 (leave empty for now)

3. Upload the course-provided brand assets to **Brand Assets**:
   - `leoptical-logo-primary` (PNG, transparent background)
   - `leoptical-logo-white` (PNG, white on transparent background)

4. Upload the four product images to their respective subfolders under **Product Images**.

5. Publish all six uploaded images (two logos, four product images).

6. Create the **LEOptical Brand** object. Configure every section:

   - **Brand Details:** Title = `LEOptical`, description as specified above.
   - **Brand Identity:** The LEOptical company description provided in the lesson.
   - **Brand Tone:** Edit the Professional tone's Description with the custom text provided in the lesson.
   - **Colors:** Accent = `#11284f`, Accent Contrast = `#ffffff`, Background = `#ffffff`, Text = `#1e2a35`, Border = `#E2E5EA`.
   - **Typography:** Base Font Family = Trebuchet MS. Heading Style 1/2 = Georgia. All other styles = Trebuchet MS. See the full per-style table in the lesson.
   - **Buttons:** Primary = filled navy pill. Secondary = outline navy pill. Tertiary = Accent Blue text link with underline.
   - **Margin and Padding:** Tiny = 8px, Small = 16px, Medium = 24px, Large = 40px, Extra Large = 56px.
   - **Borders:** Border Weight defaults are fine. Border Radius Rounded = 8px.

7. Publish the LEOptical Brand.

8. Set the LEOptical Brand as the workspace default.

9. Disable approval workflows on the LEOptical Marketing workspace.

10. Verify the Brand is working: click **Add > Content > Email** (you do not need to save it). Confirm the email builder opens with LEOptical's navy accent color, Trebuchet MS body font, and pill-style primary button pre-applied. Close the email without saving.

## Success Criteria

- [ ] The LEOptical Marketing workspace has four top-level folders: Brand Assets, Product Images, Email Content Blocks, and 2026.
- [ ] Product Images has four subfolders, one per product family.
- [ ] Email Content Blocks has three subfolders: Headers, Footers, and Product Blocks.
- [ ] Both logo assets are uploaded to Brand Assets and show Published status.
- [ ] All four product images are uploaded to the correct Product Images subfolders and show Published status.
- [ ] A LEOptical Brand object exists with all eight sections configured (Brand Details, Brand Identity, Brand Tone, Colors, Typography, Buttons, Margin and Padding, Borders).
- [ ] The Brand Identity field contains the LEOptical company description.
- [ ] The Brand Tone is set to Professional with the custom instructions.
- [ ] The LEOptical Brand is set as the workspace default Brand.
- [ ] Approval workflows are disabled on the LEOptical Marketing workspace.
- [ ] Creating a test email confirms that LEOptical's brand settings are pre-applied (navy accent, Trebuchet MS body font, pill-style button).

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you cannot answer a question, revisit the relevant section.

- What does setting a Brand as the workspace default actually do? What does it not do to assets that already exist?
- What is the difference between a folder and a collection in a Salesforce CMS workspace? When would you use each?
- The Brand editor has a Brand Identity field and a Brand Tone field. What consumes these fields, and why does it matter whether they are filled in?
- A colleague creates a new email using a Campaign flow trigger. The email does not appear in the LEOptical Marketing workspace. Where is it, and why?
- You need to add a new person as a content creator on the LEOptical Marketing workspace. They should be able to create and edit content but not publish it independently. Which contributor role do you assign?
- Why did you disable the approval workflow for this training workspace? In what situation would you leave it enabled?
- Why did you upload `leoptical-logo-white` as a separate asset rather than just using CSS to change the logo color in the header block?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [SFMC Tips: Brand Settings for Content](https://medium.com/@marketingcloudtips/sfmc-tips-94-marketing-cloud-next-brand-settings-for-content-a1b2c3d4e5f6) - Walkthrough of every Brand editor section including Brand Identity, Brand Tone, Colors, Typography, Buttons, Margin and Padding, and Borders. The most detailed Brand-specific reference available.
- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) - Covers all five Marketing Cloud Next reusability tools: Expressions, Content Blocks, Personalization Points, Brands, and Email Templates.
- [Unlock your CMS Workspaces in Marketing Cloud Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/) - Covers workspace operations including asset management, approval workflows, and workspace sharing.
- [Brands in Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_brand.htm&language=en_US&type=5) - Official documentation for Brand asset configuration and workspace default assignment.
