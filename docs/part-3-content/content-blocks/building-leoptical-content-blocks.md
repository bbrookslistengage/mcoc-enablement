---
sidebar_position: 2
title: "Building LEOptical Content Blocks"
description: "Build six reusable email content blocks in the LEOptical Marketing workspace: header, footer, product card, loyalty status bar, feature block, and CTA banner."
---

## Overview

In the <ModuleLink slug="building-leoptical-emails" /> module, you built the Summer Lens Event email from scratch. Every section was hand-built: the header, hero, greeting, product spotlight, feature block, promo banner, and footer. That email works, but none of those sections are reusable. Build a second email tomorrow and you rebuild the header and footer from scratch. The logo changes next month and you update every email individually.

This module walks you through building six content blocks in the LEOptical Marketing CMS workspace. Four are brand component blocks that stay linked and propagate changes. Two are structural layout blocks you use as starting-point templates.

**Brand component blocks** (linked, propagate changes):
- **LEOptical Header** -- the navy logo bar that appears in every LEOptical email
- **LEOptical Footer** -- preference links, unsubscribe, address, and copyright
- **Product Card** -- a 2-column product spotlight with image, description, and CTA
- **Loyalty Status Bar** -- a compact bar showing the member's VisionCare Rewards tier and point balance, populated with live merge fields from the Data Graph

**Structural layout blocks** (drop into an email, convert to a section, then customize):
- **Feature Block** -- a side-by-side image and text layout with a product caption
- **CTA Banner Block** -- a compact navy call-to-action bar above the footer

The greeting section and hero from the Summer Lens Event are not content blocks. The greeting is personalized with merge fields that vary per recipient -- propagation would break it. The hero uses a background image treatment not supported in the content block editor.

The **Email Content Blocks** folder and its subfolders already exist from the <ModuleLink slug="building-leoptical-content-library" /> module. If those folders are missing, go back and create them before continuing.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Build and publish the LEOptical Header content block using a 2-column layout with a white logo and navigation links on a navy background.
- Build and publish the LEOptical Footer content block with centered muted text on a surface background.
- Build and publish the Product Card content block with a 2-column layout, bordered surface card, and generic placeholder content.
- Build and publish the Loyalty Status Bar content block with merge fields that pull the member's loyalty tier and point balance from the Data Graph.
- Build and publish the Feature Block content block with a 2-column layout, product image, and generic placeholder text.
- Build and publish the CTA Banner Block as an independent exercise.
- Organize blocks into the correct Email Content Blocks subfolders.
- Test propagation and conversion behavior.

## Before you start: the content block editor

The content block editor is separate from the email builder. You access it from a CMS workspace by clicking **Add > Content Block: Email**. When the editor opens, you see:

- **Components panel** (left): drag components onto the canvas
- **Canvas** (center): the block you are building
- **Property panel** (right): configure the selected component

<Screenshot src="/img/content-blocks/03-content-block-editor-empty.png" alt="The empty content block editor showing the Components panel on the left, an empty canvas in the center, and the Content Block settings panel on the right" size="wide" />

Click a component on the canvas to select it. Click it again to enter edit mode. Use the floating toolbar for text formatting. Use the Property panel on the right for colors, padding, borders, and layout.

## Part 1: Brand component blocks (guided walkthrough)

### LEOptical Header

The header is a navy section with the LEOptical white logo on the left and navigation links on the right. It appears in every LEOptical email. Build it once and reuse it everywhere.

**Reference specs:**

| Property | Value |
|----------|-------|
| Background | `#11284f` (Navy) |
| Padding | 20px top/bottom, 24px left/right |
| Left column | White LEOptical logo, left-aligned |
| Right column | Arial Regular, 13px, `#dbe7f4`, right-aligned |

1. Navigate to **Marketing > Content > LEOptical Marketing**.
2. Click **Add**, then select **Content Block: Email**.

<Screenshot src="/img/content-blocks/02-content-type-picker.png" alt="The content type picker dialog with Content Block: Email selected" size="narrow" />

3. The editor opens with a blank canvas. Click the pencil icon next to the block title at the top and name it `LEOptical Header`.

<Screenshot src="/img/content-blocks/04-header-block-named.png" alt="The content block editor with the title field showing LEOptical Header" size="wide" />

4. Click the section on the canvas to select it. In the **Style** tab of the Property panel, set:
   - **Background Color**: `#11284f` (Navy)

<Screenshot src="/img/content-blocks/06-header-section-navy-bg.png" alt="The section Style tab with Background Color set to #11284f" size="wide" />

5. Still on the section, switch to the **Layout** tab and set the section to **2 columns**.

<Screenshot src="/img/content-blocks/35-header-2col.png" alt="The section property panel showing 2-column layout selected" size="wide" />

6. Drag an **Image** component from the Components panel into the **left column**.

<Screenshot src="/img/content-blocks/07-header-logo-added.png" alt="The content block canvas with an Image component in the left column of the navy section" size="wide" />

7. With the Image component selected, click **Select** in the Property panel. Navigate to the **Brand Assets** folder and choose `leoptical-logo-white`. Set width to **15%** and alignment to **Left**.

<Screenshot src="/img/content-blocks/08-header-logo-15pct-left.png" alt="The Image property panel showing 15% width and Left alignment with the white LEOptical logo visible on the canvas" size="wide" />

8. Drag a **Paragraph** component into the **right column**. Double-click to enter edit mode and type the navigation links:

<CopyText>Shop   Rewards   Book Exam</CopyText>

9. With the text selected, open the format menu and set:
   - Font: **Arial**
   - Size: **13px**
   - Color: `#dbe7f4`

<Screenshot src="/img/content-blocks/36-header-format-menu.png" alt="The text formatting toolbar showing Arial font and 13px size with the muted blue color applied" size="wide" />

10. Set alignment to **Right**.

<Screenshot src="/img/content-blocks/37-header-align-menu.png" alt="The alignment menu with Right alignment selected" size="narrow" />

11. Click the section to deselect the paragraph. In the **Style** tab for the section, set **Padding**:
    - Uncheck **Make all values equal**
    - Top: **20**, Bottom: **20**, Left: **24**, Right: **24**

<Screenshot src="/img/content-blocks/09-header-section-padding.png" alt="The section Style tab with padding values set: 20 top, 24 right, 20 bottom, 24 left" size="wide" />

12. Click **Save**, then **Publish**.

<Screenshot src="/img/content-blocks/10-header-block-published.png" alt="The content block editor showing the LEOptical Header block published successfully" size="wide" />

13. Close the editor. From the workspace, find the **LEOptical Header** block and use **Show actions > Move** to place it in the **Email Content Blocks > Headers** folder.

The completed header looks like this:

<Screenshot src="/img/content-blocks/38-header-complete.png" alt="The completed LEOptical Header content block: white LEOptical logo on the left and Shop, Rewards, Book Exam links on the right, all on a navy background" size="wide" />

---

### LEOptical Footer

The footer is a surface-colored section with centered muted text: a preference center link, unsubscribe link, mailing address, and copyright line.

**Reference specs:**

| Property | Value |
|----------|-------|
| Background | `#f7fafc` (Surface) |
| Padding | 24px top, 24px right, 32px bottom, 24px left |
| Text color | `#617084` (Muted) |
| Font | Arial Regular, 12-13px |
| Alignment | Center |

1. From **LEOptical Marketing**, click **Add > Content Block: Email**.
2. Name the block `LEOptical Footer`.
3. Select the section. In the **Style** tab, set:
   - **Background Color**: `#f7fafc` (Surface)
   - **Padding** (uncheck equal): Top **24**, Right **24**, Bottom **32**, Left **24**
4. Drag a **Paragraph** component into the section. Enter edit mode and type the footer content. Use the pipe character to separate the two links on the first line:

<CopyText>Manage your email preferences  |  Unsubscribe
LEOptical, 100 Vision Way, Suite 400, Austin, TX 78701
© 2026 LEOptical. All rights reserved.</CopyText>

<Screenshot src="/img/content-blocks/11-footer-text-entered.png" alt="The canvas showing the three lines of footer text entered in the paragraph component" size="wide" />

5. Select all the text. In the formatting toolbar, set:
   - Font: **Arial**
   - Size: **13px**
   - Color: `#617084` (Muted)
   - Alignment: **Center**

<Screenshot src="/img/content-blocks/12-footer-text-formatting-menu.png" alt="The text formatting toolbar open with color set to #617084 Muted" size="wide" />

<Screenshot src="/img/content-blocks/13-footer-block-styled.png" alt="The canvas showing the footer text styled: muted gray color, centered, Arial 13px" size="wide" />

6. Now underline the two link texts on the first line. Click the paragraph to select it, then click again to enter edit mode. Click and drag to select **Manage your email preferences**. In the floating toolbar, click **Text formatting** and enable **Underline**. Then select **Unsubscribe** and apply **Underline** again. Leave the pipe character and the address and copyright lines unformatted.

<Screenshot src="/img/content-blocks/13-footer-links-underlined.png" alt="The canvas showing the footer paragraph with Manage your email preferences and Unsubscribe underlined, styled in muted gray centered text" size="wide" />

7. Click **Save**, then **Publish**.

<Screenshot src="/img/content-blocks/14-footer-block-published.png" alt="The content block editor showing the LEOptical Footer block published" size="wide" />

8. Move the block to **Email Content Blocks > Footers**.

<Screenshot src="/img/content-blocks/41-footer-complete.png" alt="The completed LEOptical Footer content block: centered muted text on a light surface background, with Manage your email preferences and Unsubscribe underlined on the first line" size="wide" />

---

### Product Card

The Product Card is a 2-column layout with a product image on the left and the product name, description, and CTA button on the right. It sits inside a bordered, rounded surface card. The block uses generic placeholder content so it is ready to customize when dropped into any email.

**Reference specs:**

| Property | Value |
|----------|-------|
| Section background | White |
| Card background | `#f7fafc` (Surface) |
| Card border | 1px solid, Brand border color |
| Card border radius | 8px (Rounded) |
| Card padding | 20px |
| Collection label | Custom, 11px, `#5f8ec7` (Accent Blue), bold, uppercase |
| Product name | Heading Style 3 (Trebuchet MS Bold, 18px, Navy) |
| Description | Paragraph 1 (Trebuchet MS, 16px) |
| CTA button | Primary (Navy fill, white text, pill) |

1. From **LEOptical Marketing**, click **Add > Content Block: Email**.
2. Name the block `Product Card`.
3. Select the section. In the **Style** tab, configure the section as a container:
   - **Background Color**: White (or no color)
   - **Padding**: 24px all sides
4. The card itself needs a background, border, and radius. Inside the section, add a second container or configure the section with these style properties:
   - **Background Color**: `#f7fafc` (Surface)
   - **Border**: enable, 1px, Brand border color
   - **Border Radius**: Rounded (8px)

<Screenshot src="/img/content-blocks/15-product-card-section-configured.png" alt="The section Style tab showing Surface background, rounded border, and 20px padding applied" size="wide" />

5. Set the section to a **2-column layout** using the Layout tab.

<Screenshot src="/img/content-blocks/17-product-card-2col.png" alt="The canvas showing the Product Card section set to 2 columns with equal widths" size="wide" />

6. If the columns are unequal, click **Reset Column Widths** in the Layout tab to make them equal.

<Screenshot src="/img/content-blocks/18-product-card-equal-cols.png" alt="The Layout tab showing Reset Column Widths button with the columns set to equal distribution" size="wide" />

7. **Left column:** Drag an **Image** component in. In the Property panel, click **Select** and choose a product image from the **Product Images** folder. This is placeholder content -- the image will be swapped when the block is used in a specific email.

<Screenshot src="/img/content-blocks/16-product-card-image-added.png" alt="The canvas showing a product image added to the left column of the Product Card" size="wide" />

8. **Right column:** Add components in this order:

   **a.** Drag a **Heading** component in. Type `COLLECTION NAME`. Switch the heading style from **Heading 3** to **Custom** in the toolbar to unlock individual controls. Set:
   - Size: **11px**
   - Color: `#5f8ec7` (Accent Blue)
   - Bold: on
   - Transform: uppercase (use the formatting options)

   **b.** Drag a second **Heading** below it. Leave the style as **Heading Style 3** (Trebuchet MS Bold, 18px). Type `Product Name`.

   **c.** Drag a **Paragraph** below the heading. Use **Paragraph 1** style. Type a generic description:

<CopyText>Add a short product description here. Highlight key features and benefits in two or three sentences.</CopyText>

   **d.** Drag a **Button** component below the paragraph. In the Property panel, set **Button Text** to `Shop Now`. The Brand settings apply the primary pill style automatically.

<Screenshot src="/img/content-blocks/56-product-card-components-added.png" alt="The canvas showing all four components in the right column: COLLECTION NAME label, Product Name heading, description paragraph, and Shop Now button" size="wide" />

9. Click **Save**, then **Publish**.

<Screenshot src="/img/content-blocks/20-product-card-published.png" alt="The content block editor showing the Product Card block published" size="wide" />

10. Move the block to **Email Content Blocks > Product Blocks**.

<Screenshot src="/img/content-blocks/55-product-card-complete.png" alt="The completed Product Card content block: product image on the left, COLLECTION NAME label, Product Name heading, description, and Shop Now button on the right, inside a rounded bordered card" size="wide" />

:::warning
Content blocks propagate. If you edit this Product Card block later, that change appears in every email using the block. To feature a specific product in an email, add the block to the email and convert it to a section before customizing the image, heading, and button text.
:::

---

### Loyalty Status Bar

The Loyalty Status Bar is a compact 2-column block: the member's VisionCare Rewards tier on the left, their point balance on the right. Unlike the other blocks, this one uses **live merge fields** from the Data Graph. The merge fields pull the recipient's actual tier and point balance at send time, so every recipient sees their own data.

**Reference specs:**

| Property | Value |
|----------|-------|
| Background | `#f7fafc` (Surface) |
| Border | 1px solid `rgba(17, 40, 79, 0.12)` |
| Border radius | 6px |
| Padding | 16px top/bottom, 20px left/right |
| Label text | Arial Bold, 10px, `#617084` (Muted), uppercase |
| Value text | Trebuchet MS Bold, 18px, `#11284f` (Navy) |

1. From **LEOptical Marketing**, click **Add > Content Block: Email**.
2. Name the block `Loyalty Status Bar`.
3. Select the section. In the **Style** tab, set:
   - **Background Color**: `#f7fafc` (Surface)
   - **Border**: enable, 1px, Brand border color
   - **Border Radius**: 6px (use Custom if no preset matches exactly)
   - **Padding** (uncheck equal): Top **16**, Right **20**, Bottom **16**, Left **20**
4. Set the section to **2 columns**. If the columns are unequal, click **Reset Column Widths** to make them 50/50.

5. **Left column (tier info):**

   Drag a **Heading** component in. Set the style to **Custom** and configure:
   - Size: **10px**
   - Font: **Arial**
   - Bold: on
   - Color: `#617084` (Muted)
   - Uppercase: on

   Type `VISIONCARE REWARDS`.

   Below the label heading, drag a **Paragraph** component. Set style to **Custom**:
   - Font: **Trebuchet MS**
   - Size: **18px**
   - Bold: on
   - Color: `#11284f` (Navy)

   Type `Gold Member` as a placeholder. You will replace this with a merge field in the next step.

<Screenshot src="/img/content-blocks/21-loyalty-left-col-done.png" alt="The canvas showing the left column of the Loyalty Status Bar with VISIONCARE REWARDS label and Gold Member paragraph styled correctly" size="wide" />

6. **Right column (point balance):**

   Repeat the same pattern: add a label heading with `POINT BALANCE` (same style as the left label), then a value paragraph with `2,480 pts` as placeholder (same style as the left value). Set the paragraph alignment to **Right**.

7. **Insert merge fields for tier and point balance:**

   The Data Graph is the source for loyalty data. Before inserting merge fields, verify the Data Graph is connected.

   Click the **Data Sources** tab in the Property panel. You should see the Marketing Content Personalization data provider connected as Default.

<Screenshot src="/img/content-blocks/43-loyalty-data-sources.png" alt="The Data Sources tab showing the Marketing Content Personalization data provider connected" size="wide" />

   Now replace the "Gold Member" placeholder with the loyalty tier merge field:

   a. Click the value paragraph in the left column to select the component, then click again to enter edit mode.
   b. Triple-click to select all the placeholder text.
   c. Click the `{}` **merge field** button in the floating toolbar.

<Screenshot src="/img/content-blocks/44-loyalty-merge-field-picker.png" alt="The merge field picker dialog open, showing the Data Graph navigation tree" size="wide" />

   d. The picker shows a tree. Navigate to **Related Objects**.

<Screenshot src="/img/content-blocks/49-loyalty-related-objects.png" alt="The merge field picker with Related Objects expanded in the navigation tree" size="wide" />

   e. Expand **Unified Link Individual**.

<Screenshot src="/img/content-blocks/50-loyalty-uli-fields.png" alt="The merge field picker with Unified Link Individual expanded under Related Objects" size="wide" />

   f. Expand **Individual**.

<Screenshot src="/img/content-blocks/51-loyalty-individual-objects.png" alt="The merge field picker with Individual expanded under Unified Link Individual" size="wide" />

   g. Expand **Loyalty Program Member**. Select **Loyalty Tier**.

<Screenshot src="/img/content-blocks/52-loyalty-individual-drilldown.png" alt="The merge field picker showing Loyalty Program Member expanded with Loyalty Tier visible" size="wide" />

   The placeholder text is replaced with the merge field. Repeat for the right column: replace "2,480 pts" with the **Points Balance** field from the same path (Related Objects > Unified Link Individual > Individual > Loyalty Program Member > Points Balance).

8. Click **Save**, then **Publish**.

The completed block shows the merge field tokens where the tier and point balance values will render at send time.

<Screenshot src="/img/content-blocks/53-loyalty-merge-fields-complete.png" alt="The completed Loyalty Status Bar content block: VISIONCARE REWARDS label and Loyalty_Tier merge field token on the left, POINT BALANCE label and Points_Balance merge field token on the right, inside a rounded bordered surface card" size="wide" />

---

## Part 2: Structural layout blocks

Structural blocks are content blocks that serve as starting-point layouts. You drop them into an email and convert them to a section before customizing the content for that campaign. The block handles the structure and styling. The email handles the content.

### Feature Block

The Feature Block is a 2-column layout: a product image with a collection caption on the left, and a "FEATURED" eyebrow, product heading, description, and button on the right. It uses generic placeholder content.

**Reference specs:**

| Property | Value |
|----------|-------|
| Section background | White |
| Section padding | 24px |
| Left column | Product image (placeholder) + caption label below |
| Caption label | Arial Bold, 11px, `#617084` (Muted), uppercase |
| Eyebrow | Custom, 11px, `#5f8ec7` (Accent Blue), bold, uppercase |
| Heading | Heading Style 3 (Trebuchet MS Bold, 18px) |
| Description | Paragraph 1 |
| Button | Secondary (outline style) |

1. From **LEOptical Marketing**, click **Add > Content Block: Email**.
2. Name the block `Feature Block`.
3. Select the section and set:
   - **Background Color**: White
   - **Padding**: 24px all sides
4. Set the section to a **2-column layout**.

5. **Left column:**

   Drag an **Image** component in and select a product image from the **Product Images** folder. This is placeholder content.

<Screenshot src="/img/content-blocks/22-feature-image-added.png" alt="The canvas showing the Feature Block with a product image added to the left column" size="wide" />

   Below the image, drag a **Heading** component and set the style to **Custom**:
   - Size: **11px**
   - Font: **Arial**
   - Bold: on
   - Color: `#617084` (Muted)
   - Uppercase: on

   Type `COLLECTION NAME`.

6. **Right column:**

   Add components in this order:

   **a.** Drag a **Heading** component in. Set to **Custom** and configure:
   - Size: **11px**
   - Font: **Arial** (or Trebuchet MS)
   - Bold: on
   - Color: `#5f8ec7` (Accent Blue)
   - Uppercase: on

   Type `FEATURED`.

<Screenshot src="/img/content-blocks/14-feature-eyebrow-style.png" alt="The heading Style tab with Custom selected and size, color, and formatting being configured" size="wide" />

<Screenshot src="/img/content-blocks/15-feature-eyebrow-custom-style.png" alt="The heading style dropdown showing Custom option selected to unlock individual style controls" size="narrow" />

<Screenshot src="/img/content-blocks/16-feature-eyebrow-styled.png" alt="The canvas showing the FEATURED eyebrow styled in small uppercase blue text" size="wide" />

   **b.** Drag a second **Heading** below the eyebrow. Set to **Heading Style 3**. Type `Featured Product`.

<Screenshot src="/img/content-blocks/57-feature-text-updated.png" alt="The canvas showing the right column with FEATURED eyebrow and Featured Product heading" size="wide" />

   **c.** Drag a **Paragraph** below the heading. Use **Paragraph 1** style. Type:

<CopyText>Add a short product description here. Highlight key features and benefits in two or three sentences.</CopyText>

   **d.** Drag a **Button** below the paragraph. Set **Button Text** to `Learn More`. In the Style tab, set the button to **Secondary** (outline style).

7. Click **Save**, then **Publish**.

<Screenshot src="/img/content-blocks/54-feature-block-complete.png" alt="The completed Feature Block: product image and COLLECTION NAME caption on the left, FEATURED eyebrow, Featured Product heading, description paragraph, and Learn More button on the right" size="wide" />

---

### CTA Banner Block (independent)

Build this block on your own using the specs below. The CTA Banner Block is a navy section with a compact call-to-action layout: an eyebrow label, a short headline, one line of supporting copy, and an inverted button. It sits above the footer in most LEOptical emails.

**Reference specs:**

| Property | Value |
|----------|-------|
| Section background | `#11284f` (Navy) |
| Section padding | 32px top/bottom, 24px left/right |
| Alignment | Center |
| Eyebrow | Arial Bold, 11px, `#5f8ec7` (Accent Blue), uppercase |
| Headline | Heading Style 2 (Georgia Bold), 22px, white |
| Body copy | Paragraph 1, 15px, white (or `rgba(255,255,255,0.8)`) |
| Button | Secondary/inverted (white fill, navy text, pill shape) |

**Placeholder content to use:**

- Eyebrow: `ONE MORE THING`
- Headline: `Your next eye exam is on us.`
- Body: `Gold and Platinum members get a complimentary annual exam. Check your eligibility below.`
- Button text: `Book Your Exam`

Name this block `CTA Banner Block`. Save and publish.

<Screenshot src="/img/content-blocks/27-cta-banner-complete.png" alt="The completed CTA Banner Block: ONE MORE THING eyebrow, headline, supporting copy, and Book Your Exam button, all on a navy background with centered alignment" size="wide" />

---

## Organizing the blocks

Before testing, move the blocks to the correct subfolders inside **Email Content Blocks**:

| Block | Folder |
|-------|--------|
| LEOptical Header | Email Content Blocks > Headers |
| LEOptical Footer | Email Content Blocks > Footers |
| Product Card | Email Content Blocks > Product Blocks |
| Loyalty Status Bar | Email Content Blocks (root) |
| Feature Block | Email Content Blocks (root) |
| CTA Banner Block | Email Content Blocks (root) |

Use **Show actions > Move** on each block from the workspace view.

<Screenshot src="/img/content-blocks/01-email-content-blocks-folder.png" alt="The Email Content Blocks folder in the LEOptical Marketing workspace showing the organized folder structure with Headers, Footers, and Product Blocks subfolders" size="wide" />

## Testing propagation

With the blocks built, test the two core behaviors.

### Test 1: Propagation works

1. Create a new test email: from the **LEOptical Marketing** workspace, click **Add > Email** and choose **Build with Components**.
2. Name it `Content Block Test Email`.
3. In the email builder, drag a **Content Block** component from the **Layout** tab onto the canvas. Select the **LEOptical Header** block.
4. Below the header, add another **Content Block** and select the **LEOptical Footer** block.
5. Save the email.
6. Open the **LEOptical Footer** content block from the workspace (not from inside the email). Edit the copyright line, for example change `2026` to `2026-2027`. Save and republish.
7. Return to the test email. The footer should now show `2026-2027` without any manual change to the email.

<Screenshot src="/img/content-blocks/58-propagation-test-result.png" alt="The LEOptical Footer block editor after republishing, showing the updated copyright line: © 2026-2027 LEOptical. All rights reserved. This is the version that propagates to every email referencing the block." size="wide" />

Revert the footer block to the original copyright text and republish.

### Test 2: Converting to a section stops propagation

1. Open the test email. Drag the **Feature Block** content block onto the canvas. Notice the block is read-only -- you cannot edit its content directly in the email builder.
2. Select the Feature Block and use **Convert to Section** (available in the block toolbar or right-click menu).
3. The block becomes a regular editable section. Click into the heading text to confirm you can edit it.
4. Change the heading text to something distinctive, such as `This is local only`. Save the email.
5. Open the original **Feature Block** content block from the workspace. Change the heading to `Updated global heading`. Republish.
6. Return to the test email. The section should still show `This is local only`. The link is broken -- the section no longer receives updates from the content block.

## Assignment

> **The client wants:** Reusable brand components (header, footer, product card, loyalty bar) that stay consistent across every email, plus structural blocks the team uses as starting points for common layouts.

1. Complete the guided walkthroughs above. Build and publish all four brand component blocks:
   - **LEOptical Header**
   - **LEOptical Footer**
   - **Product Card**
   - **Loyalty Status Bar**

2. Move the header, footer, and product card to their correct subfolders under **Email Content Blocks**.

3. Build and publish the **Feature Block** (guided) and **CTA Banner Block** (independent).

4. Create a test email that uses at least two content blocks. Save it.

5. Test propagation: edit one brand component block, republish it, and confirm the change appears in the test email.

6. Test conversion: add the Feature Block to the test email, convert it to a section, then verify that editing the original block does not affect the converted section.

7. **(Stretch)** Build a second Product Card block for a specific product. Copy the structure, swap in a real product image from the Product Images folder, and add specific product copy. Place it in the **Product Blocks** subfolder.

## Success Criteria

- [ ] 4 brand component content blocks exist (LEOptical Header, LEOptical Footer, Product Card, Loyalty Status Bar), all Published.
- [ ] The Loyalty Status Bar uses merge fields for loyalty tier and points balance, not static placeholder text.
- [ ] Header, Footer, and Product Card blocks are in the correct Email Content Blocks subfolders.
- [ ] 2 structural content blocks exist (Feature Block, CTA Banner Block), all Published.
- [ ] A test email uses at least 2 content blocks.
- [ ] Editing a content block and republishing it propagates the change to the test email.
- [ ] Converting a block to a section stops propagation. Editing the original block does not affect the converted section.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- Why did you build the header and footer as content blocks instead of rebuilding them in each email the way you did in the Summer Lens Event?
- The greeting section from the Summer Lens Event is not a content block. Why not?
- The Loyalty Status Bar uses merge fields directly inside the content block. What does this mean for how the block behaves in different emails compared to a block that uses static placeholder text?
- You need to feature three different products in one email. Would you use three instances of the same Product Card content block, or convert each to a section? Why?
- What would happen if you edited the LEOptical Header to change the logo and republished, but one of the emails using that header was part of an active Flow?
- Why can you not edit a content block directly on the email canvas? What is the design reasoning behind that restriction?
- The Feature Block and CTA Banner Block are structural blocks you almost always convert before using. Why build them as content blocks at all instead of starting fresh in each email?
