---
sidebar_position: 2
title: "Building LEOptical Email Templates"
description: "Build three email templates for LEOptical (Monthly Newsletter, Product Spotlight, Loyalty Tier Notification), each with a different locking strategy, using shared content blocks."
---

## Overview

You know how templates work and how locking behaves. Now you build three templates for LEOptical that put each of the three locking strategies into practice.

The templates you build here use the header and footer content blocks from the <ModuleLink slug="building-leoptical-content-blocks" /> module. If you have not completed that module, do it first. These templates depend on those blocks being built and published.

Each template demonstrates a different level of control:

- **Monthly Newsletter**: locked header and footer, fully editable body. Marketers add their own content each send.
- **Product Spotlight**: locked header, footer, and layout. Editable content slots within the fixed structure. Marketers swap content, not layout.
- **Loyalty Tier Notification**: fully locked. No editable regions. Content is driven entirely by personalization logic configured in Part 4.

After building each template, you test the locking behavior by creating a new email from the template and confirming which regions are editable. This confirms the template is configured correctly before you hand it off to the marketing team.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Build a Monthly Newsletter template with a locked header/footer and fully editable body.
- Build a Product Spotlight template with a locked layout but editable content areas.
- Build a Loyalty Tier Notification template that is fully locked (no editable regions).
- Add shared header and footer content blocks (from the <ModuleLink slug="building-leoptical-content-blocks" /> module) to each template.
- Test each locking strategy by creating an email from the template and confirming which regions are editable.
- Verify that a Content Creator role user can edit the Newsletter body but cannot modify locked regions.

## Before you start

Confirm these are in place before building any template:

- The **LEOptical Header** content block (from <ModuleLink slug="building-leoptical-content-blocks" />) is Published.
- The **LEOptical Footer** content block (from <ModuleLink slug="building-leoptical-content-blocks" />) is Published.
- You have Marketing Cloud Admin access to the LEOptical Marketing workspace.

If the content blocks are not published, they will not be selectable when you add them to the template canvas.

## Template 1: Monthly Newsletter

### What you are building

> **The client wants:** A newsletter template the marketing team can use each month. The LEOptical header and footer must stay consistent. Everything between them is fair game for the marketer to add, edit, or rearrange each send.

This template uses Strategy 1 from the concepts page: locked header and footer, fully editable body. The subject line and preheader are also unlocked so marketers can write fresh copy for each newsletter.

### Create the template

1. Navigate to the **MCA App > Content** tab.
2. Select the **LEOptical Marketing** workspace.
3. Open your templates folder, or create a **Templates** folder if you do not have one yet.
4. Click **Add > Content**, select **Email Template** from the content type modal, and click **Create**.
5. In the "Select an email template creation method" dialog, select **Use Components** and click **Select**.

<Screenshot src="/img/building-leoptical-templates/03-creation-method-picker.png" alt="The email creation method dialog showing three options: Select a Template (selected), Use Components, and Create with HTML." size="wide" />

6. Name the template `Monthly Newsletter` using the title field at the top.

<Screenshot src="/img/building-leoptical-templates/04-blank-template-canvas.png" alt="The template editor with a blank canvas and the title field showing 'Monthly Newsletter'. The Property Panel on the right shows the Settings tab." />

### Add the header content block

8. In the **Components Panel**, click the **Layout** tab.
9. Drag the **Content Block** component to the top of the canvas.
10. In the content block selector that appears, find and select **LEOptical Header**.

<Screenshot src="/img/building-leoptical-templates/06-content-block-picker.png" alt="The content block picker dialog showing the LEOptical Header block in the Email Content Blocks folder, ready to be selected." size="wide" />

11. The header block renders on the canvas. It is read-only by default (you cannot edit it inline). This is correct.

### Add a body section

12. Click the **+** button below the header block to add a component.
13. Add a **Section** component. Configure it as a single column with white background and comfortable padding (Extra Large on top and bottom).
14. Drag a **Paragraph** into the section.
15. Type a placeholder instruction: `Add your newsletter content here. This section is editable.`

This gives marketers a visual cue when they open the template to create an email. You can add as many placeholder body sections as you want.

<Screenshot src="/img/building-leoptical-templates/09-body-section-with-paragraph.png" alt="The template canvas showing the LEOptical Header content block at the top and a white body section with placeholder paragraph text below it. The footer has not yet been added." />

### Add the footer content block

16. Below the body section, drag another **Content Block** component from the Layout tab.
17. Select **LEOptical Footer** from the picker.

The footer renders below the body. The canvas now has: header block, body section, footer block.

### Configure locking

The header and footer content blocks are already locked by default. All sections are also locked by default. Your only task is to unlock the body sections you want marketers to edit.

18. Select the body **Section** you added in step 13.
19. In the **Property Panel**, click the **Settings** tab.
20. Toggle **"Allow users to modify this section"** ON.

<Screenshot src="/img/building-leoptical-templates/12-section-settings-toggle-on.png" alt="The Property Panel Settings tab showing the 'Allow users to modify this section' toggle switched to ON for the body section." size="narrow" />

If you added multiple body sections, repeat steps 18-20 for each one.

### Unlock the subject line and preheader

21. Click an empty area of the canvas so no component is selected.
22. In the **Property Panel** on the right, scroll down to the **Subject Line and Preheader** section.
23. Below the Subject Line text field, click the button labeled **"Allow users to modify the subject line"**. This unlocks the field. The button label changes to "Prevent users from modifying the subject line" when unlocked.
24. Do the same for the Preheader: click **"Allow users to modify the preheader"** to unlock it.

### Publish the template

25. Click **Save**.
26. Click **Publish**.

The Monthly Newsletter template is now available in the Custom Templates tab when creating a new email.

### Test the locking

27. Navigate back to the workspace content list. Click **Add > Content > Email**.
28. Select **Use Components**, then **Select a Template**.
29. In the **Custom Templates** tab, select **Monthly Newsletter**. Click **Create Email**.

<Screenshot src="/img/building-leoptical-templates/33-t1-custom-templates-picker.png" alt="The Custom Templates tab in the template picker showing the Monthly Newsletter template selected, with a preview visible on the right." size="wide" />

30. In the email created from the template, attempt to click the header content block. It should be unresponsive to editing.
31. Click the body section. It should be fully editable: you should be able to add text, change styles, and modify components within it.
32. Confirm the subject line field is editable.

If the header resists editing and the body accepts it, the locking is configured correctly.

<Screenshot src="/img/building-leoptical-templates/34-t1-test-header-locked-body-editable.png" alt="The Component Tree for an email created from the Monthly Newsletter template. The header Content Block shows a 'Locked' badge. The body Section, Column, and Paragraph show no Locked badge, confirming they are editable. The footer Content Block shows a 'Locked' badge." />

:::warning
The header and footer content blocks are locked at the template level and read-only in the email editor. But they are still live references. If the LEOptical Header content block is edited and republished, this email (and all emails created from this template) will reflect that change. Template non-propagation applies to the template's own components, not to embedded content blocks.
:::

## Template 2: Product Spotlight

### What you are building

> **The client wants:** A structured campaign template for product launches and seasonal promotions. The layout must be consistent across all product emails (hero image, two-column feature section, CTA). Marketers should be able to swap the image, update the copy, and change the button label without touching the layout structure.

This template uses Strategy 2: locked layout with editable content slots. This is the most nuanced template to configure. Read the locking notes carefully before starting.

### A note on nesting and locking for this template

The Product Spotlight template unlocks specific components within locked sections. This is where the nesting inheritance rule from the concepts page matters.

If you unlock a Section, everything inside it becomes editable. That includes the section's layout structure (column count, column widths). If you want to allow a marketer to change an Image but not change the column layout, you cannot just unlock the parent Section.

The approach for this template: build the layout structure first, then unlock individual components (Image, Heading, Paragraph, Button) within locked sections. Do not unlock the parent Sections themselves.

Individual components (Image, Heading, Paragraph, Button) can be unlocked independently without unlocking their parent Section. The Section's lock state (which controls the column layout) is separate from the lock state of the components inside it. This is what makes Strategy 2 possible.

### Create the template

1. Navigate to **MCA App > Content tab > LEOptical Marketing workspace > Templates folder**.
2. Click **Add > Content**, select **Email Template**, click **Create**, then select **Use Components** and click **Select**.
3. Name the template `Product Spotlight`.

### Build the layout

4. Add the **LEOptical Header** content block at the top.

5. Add a **Section** below the header. This is the hero section.
   - 1 column, white or light background
   - Drag an **Image** component into the section (placeholder: leave image unselected or use a placeholder product image)
   - Drag a **Heading** below the image: `[Product Name]`
   - Drag a **Paragraph** below the heading: `[Product description]`

6. Add a second **Section** below the hero for the CTA.
   - 1 column, white background
   - Drag a **Button** component: label `Shop Now`, link to `https://leoptical.web.app/`

7. Add the **LEOptical Footer** content block at the bottom.

<Screenshot src="/img/building-leoptical-templates/24-t2-canvas-complete-layout.png" alt="The Product Spotlight template canvas showing, from top to bottom: the LEOptical Header content block, a hero section with an Image, Heading, and Paragraph, a CTA section with a button, and the LEOptical Footer content block." />

### Configure locking for editable content slots

The header and footer blocks are already locked. All sections are locked by default. Now unlock only the specific components you want marketers to change.

8. Select the **Image** component in the hero section.
9. In the **Settings tab**, toggle **"Allow users to modify this image"** ON.

10. Select the **Heading** component (`[Product Name]`).
11. In the **Settings tab**, toggle ON.

12. Select the **Paragraph** component.
13. In the **Settings tab**, toggle ON.

14. Select the **Button** component.
15. In the **Settings tab**, toggle ON.

Do not unlock the Sections themselves. This keeps the layout structure (column count, section arrangement, padding) locked while making the content within the structure editable.

### Unlock the subject line

For this template, leave the subject line unlocked so marketers can write a fresh subject for each product campaign.

With no component selected, scroll to the **Subject Line and Preheader** section in the **Property Panel**. Click **"Allow users to modify the subject line"** to unlock it. Do the same for the preheader. You can type a placeholder value in the subject line field as a starting point for marketers: `[Product Name] at LEOptical`.

### Publish the template

16. Click **Save**.
17. Click **Publish**.

### Test the locking

18. Create a new email from the **Product Spotlight** template.
19. Attempt to change the hero section's column layout. The column structure should be unresponsive.
20. Click the **Image** component. It should be editable: you should be able to swap the image.
21. Click the **Heading**. It should be editable.
22. Click the **Button**. It should be editable.
23. Attempt to click the header content block. It should be read-only.

If the layout structure resists changes but the image, heading, paragraph, and button accept edits, the template is configured correctly.

<Screenshot src="/img/building-leoptical-templates/28-t2-test-image-editable-layout-locked.png" alt="The Component Tree for an email created from the Product Spotlight template. The Image component shows no Locked badge (editable). The Section and Column rows show Locked badges, confirming the layout structure is locked." />

## Template 3: Loyalty Tier Notification

### What you are building

> **The client wants:** A fully controlled email for automated loyalty tier notifications. When a customer's VisionCare Rewards tier changes, an email goes out via Flow. The content is driven entirely by the customer's data. No marketer should be able to edit this email.

This template uses Strategy 3: fully locked. No editable regions anywhere in the email.

It also uses real merge fields from the LEOptical Data Graph for the customer's first name, loyalty tier, and points balance. Part 4 covers merge fields in depth.

### Create the template

1. Navigate to the templates folder and create a new Email Template.
2. Name it `Loyalty Tier Notification`.

### Build the layout

3. Add the **LEOptical Header** content block.

4. Add a **Section** below the header (1 column, white background, Extra Large padding).
5. Add these components in order:
   - **Heading** (H2): `Your VisionCare Rewards tier has changed`
   - **Paragraph**: `Hi ` followed by the First Name merge field, then a comma.
   - **Paragraph**: `Your tier is now `, the Loyalty Tier merge field, `. You have `, the Points Balance merge field, then ` points.`
   - **Paragraph**: `As a `, the Loyalty Tier merge field, then ` member, you unlock exclusive VisionCare Rewards benefits.`

   To insert each merge field, type the text before it, then click the **Add a merge field** button in the text toolbar. Select **Data Graph**, click the **Search Resources** box to load the graph, and open **Primary Objects**. Click the field you need (First Name, Loyalty Tier, or Points Balance), then click **Done** in the Configure Merge Field Details modal. The field appears in the paragraph as a pill labeled with its API name.

   <Screenshot src="/img/building-leoptical-templates/35-t3-add-merge-field-menu.png" alt="The Add Merge Field menu open beneath the text toolbar of a selected Paragraph, listing Link, Organization, Recipient, Sender, Other, and Data Graph." size="wide" />

   <Screenshot src="/img/building-leoptical-templates/36-t3-primary-objects-fields.png" alt="The Select Data Graph Attribute panel with the breadcrumb Resources > Primary Objects, listing the fields First Name, Last Name, Loyalty Tier, and Points Balance." size="wide" />

   <Screenshot src="/img/building-leoptical-templates/37-t3-configure-merge-field.png" alt="The Configure Merge Field Details modal for the Points Balance attribute, showing the Merge Field API Name, an empty Default Text field, and Cancel and Done buttons." size="wide" caption="The API name reads Points_Balance_1 here because Points Balance was already used in this template. Your first use of a field keeps the plain name." />

   :::info
   The picker de-duplicates API names within a template. When you use Loyalty Tier a second time, the pill reads `Loyalty_Tier_1`. Both pills resolve to the same value at send time.
   :::

6. Add a second **Section** (CTA row).
7. Add a **Button**: label `View My Rewards`, link to `https://leoptical.web.app/`.

8. Add the **LEOptical Footer** content block.

<Screenshot src="/img/building-leoptical-templates/29-t3-canvas-complete-layout.png" alt="The Loyalty Tier Notification template canvas showing the LEOptical Header block, a content section with a heading and three paragraphs containing First Name, Loyalty Tier, and Points Balance merge field pills, a CTA section with the View My Rewards button, and the LEOptical Footer block." />

### Configure locking (no action needed)

For a fully locked template, the default state is already correct. All components are locked by default. The template-wide toggle is OFF by default.

Do not unlock any components. Do not unlock the subject line.

9. Click an empty area of the canvas. In the **Settings tab**, confirm the template-wide toggle is OFF.
10. Click each section. Confirm the toggle labeled "Allow users to modify this section" is OFF for each one.

### Set the subject line and preheader

11. With no component selected, scroll to the **Subject Line and Preheader** section in the **Property Panel**.
12. Both fields are locked by default. The button below each field reads "Allow users to modify the subject line". Do not click it. Leave both locked.
13. Enter the subject line: `Your VisionCare Rewards tier has been updated`

:::warning
The platform will not save a template if the subject line is locked but empty. You must enter a value before saving, even if the final subject content will be set by personalization logic in Part 4.
:::

14. Enter the preheader: `See your new tier and updated rewards balance inside`

### Publish the template

15. Click **Save**.
16. Click **Publish**.

### Test the locking

17. Create a new email from the **Loyalty Tier Notification** template.
18. Attempt to click any component in the body. Nothing should be editable.
19. Attempt to edit the subject line field. It should be read-only.
20. Confirm the header and footer content blocks are read-only.

The email should behave as entirely static. All content is predetermined by the template.

<Screenshot src="/img/building-leoptical-templates/32-t3-test-all-locked.png" alt="The Component Tree for an email created from the Loyalty Tier Notification template. Every component (Content Block, Section, Column, Heading, all three Paragraphs, Button, and the footer Content Block) shows a Locked badge. The subject line field is disabled." />

21. In the email editor, click **Preview**. On the **Segment** tab, keep the segment, pick a sample recipient, and click **Generate Preview**. The merge fields resolve to that recipient's first name, loyalty tier, and points balance.

<Screenshot src="/img/building-leoptical-templates/38-t3-preview-resolved-fields.png" alt="The Preview dialog for the Loyalty Tier Notification email with the VIP Customers segment and Corey Spears as the sample recipient. The rendered email reads: Hi Corey, Your tier is now Gold. You have 67767.0 points. As a Gold member, you unlock exclusive VisionCare Rewards benefits." size="wide" />

## Assignment

> **The client wants:** Three email templates for their marketing team to use as starting points for campaigns. Each template should enforce different levels of control over what marketers can change.

The walkthroughs above guide you through each template. If you followed them, the templates are built. Use this assignment list to confirm completeness and verify correct behavior.

1. Confirm the **Monthly Newsletter** template exists in the LEOptical Marketing workspace with **Published** status.

2. Confirm the **Product Spotlight** template exists in the LEOptical Marketing workspace with **Published** status.

3. Confirm the **Loyalty Tier Notification** template exists in the LEOptical Marketing workspace with **Published** status.

4. Confirm all three templates include the **LEOptical Header** and **LEOptical Footer** content blocks from the <ModuleLink slug="building-leoptical-content-blocks" /> module.

5. Test the Monthly Newsletter template: create a new email from it and verify that the body section is editable but the header and footer blocks are not. Verify the subject line field is editable.

6. Test the Product Spotlight template: create a new email from it and verify that the image, heading, paragraph, and button are editable, but the section layout structure (column arrangement) is not.

7. Test the Loyalty Tier Notification template: create a new email from it and verify that no components are editable. Verify the subject line is read-only.

8. **(Stretch)** Test the Monthly Newsletter template using a user logged in with the Content Creator role (configured in the Business Units and Governance module). Confirm that user can edit the newsletter body but cannot modify the locked header or footer.

## Success Criteria

- [ ] Three email templates (Monthly Newsletter, Product Spotlight, Loyalty Tier Notification) exist in the LEOptical Marketing workspace with Published status.
- [ ] All three templates include the LEOptical Header content block.
- [ ] All three templates include the LEOptical Footer content block.
- [ ] Creating an email from the Monthly Newsletter template produces an email with a locked header/footer and a fully editable body section.
- [ ] The Monthly Newsletter template has an unlocked subject line and preheader.
- [ ] Creating an email from the Product Spotlight template produces an email where the Image, Heading, Paragraph, and Button components are editable but the layout structure is not.
- [ ] Creating an email from the Loyalty Tier Notification template produces an email where no components are editable.
- [ ] The Loyalty Tier Notification template has a locked subject line and preheader.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- You built all three templates but forgot to unlock any body components in the Monthly Newsletter template. A marketer creates an email from it and cannot edit anything. What do you do to fix this, and does fixing the template change the email the marketer already created?
- What is the difference between locking a section and locking the components inside it? Why does this matter for the Product Spotlight template?
- The Loyalty Tier Notification template contains placeholder text where merge fields will eventually go. When Part 4 adds Handlebars merge fields to this template, will emails already created from the template automatically use the new merge fields?
- LEOptical's legal team adds a new disclaimer line to the LEOptical Footer content block and republishes it. Which of the three templates is affected, and how does the change propagate?
