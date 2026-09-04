---
sidebar_position: 2
title: "Building LEOptical Emails"
description: "Build a promotional email from scratch using every builder component, upload an image directly, connect the Data Graph, insert merge fields, and send a test email."
---

## Overview

You know the builder's interface, every component, and how merge fields work. Now you build something real.

This module walks you through creating a promotional email for LEOptical from a blank canvas. You will use every builder component at least once (except Content Block, which is the <ModuleLink slug="content-blocks" /> module), create a multi-column layout, connect the Data Graph, insert merge fields, preview on both viewports, and send a test email.

The email you build here is a seasonal promotion: LEOptical's Summer Lens Event. It promotes ChromaShift adaptive lenses to existing customers, personalized with their first name and loyalty tier. It is not a template and does not use content blocks. Those come in the next two modules. This is a raw, hand-built email that exercises every tool in the builder.

If the Brand configuration from the <ModuleLink slug="building-leoptical-content-library" /> module is set as the workspace default, your email starts with LEOptical's colors, fonts, and button styles pre-applied. If it does not, go back and set it.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Create a new promotional email in the LEOptical Marketing workspace.
- Build an email header section with a navy background and white logo.
- Build a hero section with a headline, supporting text, and a call-to-action button.
- Build a body section with a multi-column product layout.
- Use every builder component at least once (Heading, Paragraph, List, Button, Divider, HTML, Section, Image, Repeater).
- Upload an image directly in the builder.
- Connect the LEOptical Data Graph as a data source.
- Insert merge fields for first name and loyalty tier.
- Add the organization address and unsubscribe link for CAN-SPAM compliance.
- Preview the email on desktop and mobile.
- Send a test email.

## Creating the email

Start by creating a new email in the LEOptical Marketing workspace.

1. Navigate to the MCA app. Click **Content** in the top navigation bar.
2. Select the **LEOptical Marketing** workspace from the workspace selector.
3. Click **Add > Content**, then select **Email** from the content type picker.

<Screenshot src="/img/building-leoptical-emails/01-content-type-picker-email.png" alt="The Create CMS content dialog showing Email selected in the content type list." size="wide" />

4. Set the following:
   - **Title:** `Summer Lens Event`
   - **CAN-SPAM Classification:** Promotional
   - Leave the Brand as the workspace default (LEOptical).
5. Click **Create**.

{/* VERIFY: Confirm the exact creation dialog fields. Does the dialog ask for title, API name, CAN-SPAM classification, and Brand selection before entering the builder? Or does it ask for just title and type? Document the exact fields in the SDO. */}

The email builder opens with a blank canvas. If the Brand is configured correctly, the Property Panel on the right shows LEOptical's Brand applied.

<Screenshot src="/img/email-builder/02-full-builder-interface.png" alt="The email builder with a blank canvas for the new Summer Lens Event email. The Property Panel on the right shows the LEOptical Brand applied with navy accent color visible." />

## Configuring email settings

Before building the layout, set the email's metadata.

1. Click the **Subject Line** field above the canvas. Type:

   `Your summer upgrade is here, (firstName)`

   You will add the actual merge field after connecting the Data Graph. For now, type the text as a placeholder. The merge field syntax will replace the parenthetical later.

2. In the **Preheader** field, type:

   `ChromaShift adaptive lenses, 20% off for VisionCare Rewards members.`

<Screenshot src="/img/building-leoptical-emails/03-subject-line-preheader.png" alt="The Subject Line field populated with placeholder text and the Preheader field showing the ChromaShift promotion text." size="wide" />

You will come back and insert actual merge fields into the subject line after the Data Graph is connected.

## Connecting the Data Graph

Connect the Data Graph early so merge fields are available as you build.

1. Click an empty area of the canvas so no component is selected.
2. In the **Property Panel** on the right, find the **Data Sources** section.
3. Select the LEOptical Data Graph (rooted on Unified Individual) as the data source.

<Screenshot src="/img/email-builder/07-data-sources-connected.png" alt="The Property Panel Data Sources tab showing the LEOptical Data Graph connected as the default data source." size="narrow" maxHeight="500px" />

After connecting, the Data Graph's object tree appears in the Data Sources tab. You can now access fields from Unified Individual, Contact Point Email, Loyalty Program Member, and other DMOs in the graph.

## Building the header section

The header is a full-width navy bar with the LEOptical white logo. In later modules, you will build this as a reusable content block. For now, you build it from scratch.

1. Drag a **Section** from the **Layout** tab onto the canvas.
2. In the **Property Panel**, configure the section:
   - **Columns:** 1 column
   - **Background color:** `#11284f` (Navy)
   - **Padding:** 20px top/bottom, 24px left/right

<Screenshot src="/img/building-leoptical-emails/05-section-navy-background.png" alt="The Section Property Panel Style tab showing Color Scheme set to Custom, Accent #11284f, and Background #11284f (Navy)." size="narrow" maxHeight="500px" />

3. Drag an **Image** component into the section.
4. In the **Property Panel**, select **Salesforce CMS** as the image source.
5. Browse to the **Brand Assets** folder and select `leoptical-logo-white`.
6. Set the image max height to 36px in the style options.
7. Set alignment to left.

<ScreenshotPlaceholder alt="The email canvas showing the header section with a navy background and the white LEOptical logo left-aligned inside it." />

## Building the hero section

The hero sits directly below the header. It has a headline, a short description, and a call-to-action button.

1. Drag a **Section** below the header section.
2. Configure:
   - **Columns:** 1 column
   - **Background color:** `#11284f` (Navy)
   - **Padding:** 40px top/bottom, 24px left/right

3. Drag a **Heading** into the section.
4. Type: `ChromaShift Lenses. 20% Off This Week.`
5. In the **Property Panel**, set:
   - **Heading level:** H1
   - **Text color:** `#ffffff` (White) (override the Brand default if needed)
   - **Alignment:** Center

<Screenshot src="/img/building-leoptical-emails/07-hero-heading-white.png" alt="The hero section on the canvas showing the H1 heading in white text on a navy background." />

6. Drag a **Paragraph** below the heading.
7. Type: `Adaptive polarized lenses that go from clear to tinted the moment you step outside. No swapping. No squinting.`
8. Set:
   - **Text color:** `#ffffff` (White)
   - **Alignment:** Center

9. Drag a **Button** below the paragraph.
10. Type the button label: `Shop ChromaShift`
11. Set the button URL to `https://leoptical.web.app/` (or a placeholder URL).
12. The Brand should auto-apply the navy button style, but since the section background is already navy, override the button:
    - **Background color:** `#ffffff` (White)
    - **Text color:** `#11284f` (Navy)
    - **Alignment:** Center

<Screenshot src="/img/building-leoptical-emails/08-hero-complete.png" alt="The completed hero section showing the navy background, white H1 heading, white paragraph text, and a button, in the full email builder view." />

:::info
Inverting the button colors (white fill, navy text) against a navy background is a common pattern. The Brand's default primary button is navy fill with white text, which works on white backgrounds. On dark backgrounds, override the colors for contrast.
:::

## Building the personalized greeting

Below the hero, add a greeting that uses the recipient's first name and loyalty tier.

1. Drag a **Section** below the hero.
2. Configure: 1 column, white background, 32px top/bottom padding, 24px left/right padding.

3. Drag a **Heading** into the section.
4. Set the heading level to **H2**.
5. Now insert a merge field for the first name:
   - Place your cursor in the heading text where you want the name.
   - Click the **Merge Fields** icon in the component toolbar.
   - In the picker, navigate to **Data Graph attributes > Primary Objects** and select `firstName`.
   - When prompted, set the default value to `there` (so it renders as "Hi there" if the name is missing).

6. Type around the merge field so the heading reads: "Hi" followed by the firstName merge field token, then "this one's for you."

<ScreenshotPlaceholder alt="The merge field picker dialog showing Data Graph attributes expanded, with Primary Objects selected and the firstName field highlighted." />

<ScreenshotPlaceholder alt="The Heading component on the canvas showing the text Hi followed by the firstName merge field token, then this one's for you, with the merge field token visible inline." />

7. Drag a **Paragraph** below the heading.
8. Type the opening body text. Include a merge field for the loyalty tier:
   - Type: `As a valued `
   - Insert a merge field: navigate to **Data Graph attributes > Primary Objects** and select `Loyalty Tier`. This field is available directly on Unified Individual because you mapped it to the Individual DMO in the <ModuleLink slug="ingesting-external-data" /> module.
   - Set the default value to `VisionCare Rewards`
   - Continue typing: ` member, you get early access to our seasonal lens sale.`

<ScreenshotPlaceholder alt="The Paragraph component showing the loyalty tier merge field inserted inline within body text." />

## Building the product section (multi-column)

This section uses a 2-column layout with a product image on the left and product details on the right.

1. Drag a **Section** below the greeting section.
2. Configure:
   - **Columns:** 2-column layout (try a 1/3 + 2/3 split, or equal 50/50)
   - **Background color:** `#f7fafc` (Surface)
   - **Padding:** 20px all around

<Screenshot src="/img/building-leoptical-emails/12-section-2column-config.png" alt="The Section Property Panel showing a 2-column equal layout selected, Number of Columns set to 2, and Column Distribution showing 6 | 6." size="narrow" maxHeight="500px" />

3. In the **left column**, drag an **Image** component.
4. For this image, upload one directly in the builder (rather than using a CMS image) to demonstrate both image workflows:
   - Select the Image component.
   - In the Property Panel, look for an upload option in the image source selection.
   - Upload the ChromaShift product image.

{/* VERIFY: Document the exact steps for uploading an image directly in the builder. Does the CMS image picker have an "Upload" button, or is there a separate upload flow? Does the uploaded image automatically appear in the CMS workspace? If so, which folder? */}

<ScreenshotPlaceholder alt="The Image component source selection showing the upload flow for adding a new image directly in the builder." size="wide" />

5. In the **right column**, stack the following components:
   - Drag a **Heading** (H3): `Visionaire ChromaShift`
   - Drag a **Paragraph**: `Adaptive polarized lenses that go from clear to tinted in seconds. Built for people who spend real time outdoors.`
   - Drag a **Button**: Label = `Shop ChromaShift`, URL = `https://leoptical.web.app/`

<ScreenshotPlaceholder alt="The 2-column product section showing the ChromaShift product image in the left column and the heading, paragraph, and button stacked in the right column, on the Surface (#f7fafc) background." />

## Adding a divider and feature list

Below the product section, add a divider and a list of product features.

1. Drag a **Divider** below the product section. The Brand border color applies automatically.

2. Drag a **Section** (1 column, white background, standard padding) below the divider.

3. Drag a **Heading** (H2) into the section: `Why ChromaShift?`

4. Drag a **List** component below the heading. Enter the following items:
   - Photochromic and polarized in one lens
   - UV400 protection standard
   - Transitions in under 10 seconds
   - Available in all frame styles

<ScreenshotPlaceholder alt="The List component on the canvas showing four bullet points about ChromaShift features." />

## Adding an HTML component

The spec requires using every component at least once. The HTML component is the odd one out because it does not inherit Brand styling. Use it for a small, self-contained element.

1. Drag an **HTML** component below the list section.
2. Paste the following code:

```html
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="padding: 16px; background-color: #f7fafc; border-radius: 8px;">
      <span style="font-family: Georgia, serif; font-size: 18px; color: #11284f;">
        Use code <strong>SUMMER20</strong> at checkout
      </span>
    </td>
  </tr>
</table>
```

This creates a styled promo code banner. It demonstrates the HTML component without breaking the email's visual flow.

<ScreenshotPlaceholder alt="The HTML component rendered on the canvas showing the promo code banner with 'Use code SUMMER20 at checkout' in a styled box." />

## Adding the CAN-SPAM footer

Promotional emails require an organization address and unsubscribe link. Build a footer section for these.

1. Drag a **Section** below the HTML component.
2. Configure:
   - **Columns:** 1 column
   - **Background color:** `#f7fafc` (Surface)
   - **Padding:** 24px all around

3. Drag a **Paragraph** into the section.
4. Insert the following content using merge fields:
   - Type: `Manage your email preferences | `
   - Click **Merge Fields** and navigate to the **Links** category. Select the preference center link.
   - On a new line, insert the unsubscribe link from the **Links** category.
   - On a new line, insert `{!$organization.Address}` from the **Organization** category.
   - Add a copyright line: `© 2026 LEOptical. All rights reserved.`

5. Style the paragraph:
   - **Font size:** 12px
   - **Text color:** `#617084` (Muted)
   - **Alignment:** Center

<ScreenshotPlaceholder alt="The footer section showing muted text with the preference center link, unsubscribe link, organization address merge field, and copyright line, all centered on a Surface background." />

:::warning
The platform does not validate that your promotional email includes an unsubscribe link. Forgetting it is a CAN-SPAM violation. Always check the footer before publishing.
:::

## Updating the subject line with merge fields

Earlier you typed placeholder text in the subject line. Now that the Data Graph is connected, update it with a real merge field.

1. Click the **Subject Line** field above the canvas.
2. Clear the placeholder text.
3. Type: `Your summer upgrade is here, `
4. Click the **Merge Fields** icon and select `firstName` from **Primary Objects**.
5. The subject line now reads: "Your summer upgrade is here," followed by the firstName merge field token.

<ScreenshotPlaceholder alt="The Subject Line field showing the text with the firstName merge field token inserted." size="wide" />

## Reviewing the complete email

Before previewing, scroll through the entire email and check each section. Your email should have, from top to bottom:

1. **Header:** Navy background, white LEOptical logo
2. **Hero:** Navy background, white H1 headline, white paragraph, inverted button
3. **Greeting:** White background, H2 with firstName merge field, paragraph with loyalty tier merge field
4. **Product section:** Surface background, 2-column layout with image left and text/button right
5. **Divider**
6. **Feature list:** White background, H2 heading, bullet list
7. **HTML promo banner:** Styled promo code
8. **Footer:** Surface background, muted text with compliance links

Every builder component has been used at least once:

| Component | Where it appears |
|-----------|-----------------|
| Heading | Hero (H1), Greeting (H2), Product section (H3), Feature section (H2) |
| Paragraph | Hero, Greeting, Product section, Footer |
| List | Feature section |
| Button | Hero, Product section |
| Divider | Between product and feature sections |
| HTML | Promo code banner |
| Section | Every row of the email |
| Image | Header (logo), Product section (product image) |

<ScreenshotPlaceholder alt="The complete email scrolled from top to bottom in the builder, showing all eight sections: header, hero, greeting, product, divider, feature list, HTML banner, and footer." />

## Desktop and mobile preview

1. Click the **Preview** button in the top-right corner.
2. Select a published segment that contains at least one test contact.
3. Choose a **Unified Individual** from the list. The email renders with that person's data.
4. Confirm merge fields are populated (first name in the subject line and greeting, loyalty tier in the body).

<Screenshot src="/img/building-leoptical-emails/20-desktop-preview.png" alt="The desktop preview dialog showing the VIP Customers segment selected, Corey Spears as the sample recipient, and the email rendered on the right with the subject line and hero section visible." />

5. Switch to **Mobile** view.
6. Confirm the 2-column product section stacks to a single column (image on top, text below).
7. Confirm the overall layout reads well at the narrower viewport.

<Screenshot src="/img/building-leoptical-emails/21-mobile-preview.png" alt="The mobile preview showing the email adapted to a narrow viewport, with the Mobile option selected in the device dropdown." />

If merge fields show blank values or the default fallback, check that the selected individual has data for those fields in the Data Graph. If the preview fails entirely, confirm your segment is published and has at least one member.

## Sending a test email

1. In the preview, navigate to the **Test** tab.
2. Enter your email address in the test recipient field.
3. Set the **From Name** to `LEOptical`.
4. Set the **From Address** to an address on your authenticated domain (configured in the <ModuleLink slug="domain-setup" /> module).
5. Click **Send Test**.

<Screenshot src="/img/building-leoptical-emails/22-test-send-dialog.png" alt="The Test Send tab showing fields for test send email address and From Name and Address, with a Send Test button." size="wide" />

6. Check your inbox. The test email should arrive within a few minutes. Verify:
   - Merge fields populated correctly
   - Images rendered
   - Button links work
   - The footer has the organization address and unsubscribe link
   - The layout looks correct in your email client

<ScreenshotPlaceholder alt="The test email received in an email client inbox, showing the rendered email with all sections, populated merge fields, and working images." />

:::warning
Test sends are recorded as engagement data in the EmailEngagement DLO and Email Engagement DMO. Keep this in mind when reviewing analytics later. Your test sends will show up alongside real sends.
:::

## Saving and publishing

After confirming the test email looks correct:

1. Close the preview.
2. Click **Save** in the builder.
3. Click **Publish** to make the email available for use in flows.

<Screenshot src="/img/building-leoptical-emails/24-save-publish-buttons.png" alt="The email builder top bar showing the Save, Publish, and Preview buttons with the Last Saved timestamp." size="wide" />

4. Return to the **LEOptical Marketing** workspace. Move the email to the **2026** folder.

The email is now published and available for use in a Segment-Triggered Flow or other flow types. Flow configuration is covered in Part 5 of this course.

## Assignment

> **The client wants:** A promotional email for LEOptical's upcoming campaign. The marketing team will use this as their first hands-on experience with the email builder.

If you followed the walkthrough above, most of the assignment is already done. The tasks below confirm you hit every requirement and add one independent task.

1. Confirm your **Summer Lens Event** email exists in the LEOptical Marketing workspace and is Published.

2. Verify that every builder component (except Content Block) has been used at least once: Heading, Paragraph, List, Button, Divider, HTML, Section, Image. Refer to the component table in the "Reviewing the complete email" section.

3. Confirm the email includes at least one image uploaded directly in the builder (not selected from existing CMS images).

4. Confirm the email has at least one multi-column section (the product section).

5. Confirm the LEOptical Data Graph is connected as a data source.

6. Confirm merge fields are inserted and resolve correctly in preview (first name in the greeting, loyalty tier in the body).

7. Confirm the email previews correctly on both desktop and mobile.

8. Confirm a test email was sent and received successfully.

9. **(Stretch)** Build a second email for a different LEOptical campaign (loyalty tier upgrade notification, eye exam reminder, or order confirmation). Use a different layout and at least one component you want more practice with. This email does not need to be as polished as the first. The goal is repetition.

## Success Criteria

- [ ] A promotional email named "Summer Lens Event" exists in the LEOptical Marketing workspace with Published status.
- [ ] Every builder component (except Content Block) has been used at least once in the email.
- [ ] The email includes at least one image uploaded directly in the builder.
- [ ] The email has at least one multi-column section.
- [ ] The LEOptical Data Graph is connected as a data source.
- [ ] Merge fields for first name and loyalty tier are inserted and resolve correctly in preview.
- [ ] The email previews correctly on both desktop and mobile (columns stack on mobile).
- [ ] A test email was sent and received at your email address.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- Why did you connect the Data Graph before building the email body instead of after?
- What happens when a merge field's value is missing for a specific recipient? How did you handle this in the email?
- Why did you override the button colors in the hero section? What Brand default was applied, and why did it not work on a navy background?
- What is the difference between using a CMS image and uploading an image directly in the builder? When would you choose each approach?
- Why is the organization address merge field required in the footer of a promotional email?
- You built this email from scratch without content blocks or templates. What parts of this email would you want to turn into reusable content blocks, and why?
