---
sidebar_position: 2
title: "Building LEOptical Emails"
description: "Build a promotional email from scratch using every builder component, connect the Data Graph, insert merge fields, and send a test email."
---

## Overview

You know the builder's interface, every component, and how merge fields work. Now you build something real.

This module walks you through creating a promotional email for LEOptical from a blank canvas. You will use every builder component at least once (except Content Block, which is the <ModuleLink slug="content-blocks" /> module), create a multi-column layout, connect the Data Graph, insert merge fields, preview on both viewports, and send a test email.

The email you build here is a seasonal promotion: LEOptical's Summer Lens Event. It promotes ChromaShift adaptive lenses to existing customers, personalized with their first name and loyalty tier. It is not a template and does not use content blocks. Those come in the next two modules. This is a raw, hand-built email that exercises every tool in the builder.

If the Brand configuration from the <ModuleLink slug="building-leoptical-content-library" /> module is set as the workspace default, your email starts with LEOptical's colors, fonts, and button styles pre-applied. If it does not, go back and set it.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Create a new promotional email in the LEOptical Marketing workspace using the component-based creation method.
- Connect the LEOptical Data Graph as a data source and insert a merge field into the subject line.
- Build an email header section with a navy background and white logo from the CMS.
- Build a hero section with an eyebrow heading, headline in Georgia serif, body copy, and an inverted call-to-action button.
- Build a personalized greeting section with merge fields for first name and loyalty tier.
- Build a product section with a two-column layout, a CMS image, captions, and a product heading.
- Build a feature list section using the List component.
- Build a promo banner section with a coupon-style column, rounded border, and styled heading.
- Build a CAN-SPAM footer with organization address, unsubscribe link, and preference manager link using merge fields.
- Preview the email on desktop and mobile.
- Send a test email.

## Creating the email

Start by creating a new email in the LEOptical Marketing workspace.

1. Navigate to the MCA app. Click **Content** in the top navigation bar.
2. Select the **LEOptical Marketing** workspace from the workspace selector.
3. Open the **Year-2026 > September** folder (or create it if it does not exist). This is where the email will live.
4. Click **Add > Content**. The creation method picker appears. Select **Use Components** and click **Select**.

<Screenshot src="/img/building-leoptical-emails/02-use-components-method.png" alt="The email creation method dialog showing three options: Select a Template, Use Components (selected with blue border and checkmark), and Create with HTML." size="wide" />

5. In the content type picker, select **Email** and click **Create**.

<Screenshot src="/img/building-leoptical-emails/01-content-type-picker-email.png" alt="The Create CMS content dialog showing Email selected in the content type list." size="wide" />

6. The email builder opens with a blank canvas. Name the email by clicking the title area and typing `Summer Lens Event`.
7. Confirm these settings in the **Property Panel** on the right:
   - **Message Purpose:** Promotional
   - **Brand:** LEOptical (should be the workspace default)

<Screenshot src="/img/building-leoptical-emails/03-blank-email-named.png" alt="The email builder with a blank canvas. The email is named Summer Lens Event. The Property Panel shows Message Purpose set to Promotional and the LEOptical Brand applied with navy accent colors visible." />

## Connecting the Data Graph and setting the subject line

Connect the Data Graph first so merge fields are available as you build. You will insert one into the subject line right now.

1. Click an empty area of the canvas so no component is selected.
2. In the **Property Panel** on the right, find the **Data Sources** tab and connect the LEOptical Data Graph (rooted on Unified Individual).

<Screenshot src="/img/email-builder/07-data-sources-connected.png" alt="The Property Panel Data Sources tab showing the LEOptical Data Graph connected as the default data source." size="narrow" maxHeight="500px" />

3. Click the **Subject Line** field above the canvas. Type: `Your summer upgrade is here, `
4. Click the **Add Merge Field** button below the subject line field. The merge field picker opens.
5. Select **Data Graph [Marketing_Content_Personalizat...]** from the picker.

<Screenshot src="/img/building-leoptical-emails/04-subject-line-merge-field-picker.png" alt="The Add Merge Field dropdown open from the subject line field, showing categories including Recipient, Sender, Other, Link, and Data Graph highlighted with a red box." />

6. In the Resources panel, click **Primary Objects**.

<Screenshot src="/img/building-leoptical-emails/05-data-graph-resources.png" alt="The Resources panel showing Data Graph Objects with Primary Objects and Related Objects listed." />

7. Select **First Name** from the fields list.

<Screenshot src="/img/building-leoptical-emails/06-first-name-field-select.png" alt="The fields list under Primary Objects showing First Name highlighted, with Last Name, Salutation, Title, and Unified Individual Id below it." />

8. In the **Configure Merge Field Details** dialog:
   - **Merge Field API Name:** `First_Name`
   - **Default Text:** Leave empty (or set to `there` so it renders as "Your summer upgrade is here, there" for recipients without a first name).
   - Click **Done**.

<Screenshot src="/img/building-leoptical-emails/07-configure-merge-field-details.png" alt="The Configure Merge Field Details dialog showing Attribute set to First Name, Merge Field API Name set to First_Name, and an empty Default Text field." size="wide" />

9. The subject line now reads: "Your summer upgrade is here," followed by the `First_Name` merge field token displayed as a blue pill.

<Screenshot src="/img/building-leoptical-emails/08-subject-line-with-merge-field.png" alt="The email builder showing the subject line populated with text and the First_Name merge field token. The canvas body is still empty." />

Leave the **Preheader** empty for now. You can add one later if you want.

## Building the header section

The header is a full-width navy bar with the LEOptical white logo. In later modules, you will build this as a reusable content block. For now, you build it from scratch.

1. Click the **+** button on the canvas to add a component. Search for "Section" and add a **Section**.
2. In the **Property Panel**, configure the section colors:
   - **Color Scheme:** Custom
   - **Accent:** `#11284f`
   - **Accent Contrast:** `#ffffff`
   - **Background:** `#11284f`
   - **Text:** `#1e2a35`
   - **Border:** `#747474`

<Screenshot src="/img/building-leoptical-emails/09-section-navy-background.png" alt="The Section Property Panel Style tab showing Color Scheme set to Custom with Background and Accent both set to #11284f (navy)." />

3. Drag an **Image** component into the section.
4. In the **Property Panel**, confirm **Salesforce CMS** is selected as the image source. Click **Add Image**.
5. In the image picker, navigate to the **Brand Assets** folder in the LEOptical Marketing workspace.

<Screenshot src="/img/building-leoptical-emails/10-brand-assets-folder.png" alt="The Select Image dialog showing the LEOptical Marketing workspace root with Brand Assets folder highlighted." size="wide" />

6. Select **leoptical-logo-white** and click **Add**.

<Screenshot src="/img/building-leoptical-emails/11-select-white-logo.png" alt="The Select Image dialog inside the Brand Assets folder showing leoptical-logo-white selected with its radio button filled." size="wide" />

7. In the Image **Style** tab, configure:
   - **Image Width:** `15` with unit set to `%`
   - **Padding:** None (all 0)
   - **Margin:** None (all 0)
   - **Horizontal Alignment:** Left

<Screenshot src="/img/building-leoptical-emails/12-logo-left-align-15pct.png" alt="The Image style panel showing width set to 15%, padding and margin all 0, and horizontal alignment set to left." />

The header section is done. You should see the white LEOptical logo left-aligned on a navy background.

## Building the hero section

The hero sits directly below the header. It has an eyebrow label, a headline, a short description, and a call-to-action button.

1. With the header section selected, click the **+** icon below it. Search for "Section" and add one.

<Screenshot src="/img/building-leoptical-emails/13-add-section-after-logo.png" alt="The email canvas showing the header section with the white logo. Below it, a search popover is open with sec typed and Section highlighted, ready to add a new section." />

2. Configure the new section with the same navy color scheme as the header:
   - **Color Scheme:** Custom
   - **Background:** `#11284f`

### Eyebrow heading

3. Drag a **Heading** into the section.
4. Type: `SUMMER LENS EVENT`
5. In the **Property Panel** and toolbar, set:
   - **Heading level:** H3
   - **Font:** Trebuchet MS
   - **Size:** 18px
   - **Text color:** `#5f8ec7` (the LEOptical accent blue)
   - **Alignment:** Center
   - **Line Height:** 1.50

<Screenshot src="/img/building-leoptical-emails/14-eyebrow-heading-style.png" alt="The SUMMER LENS EVENT eyebrow heading selected on the canvas with a center alignment dropdown open. The Property Panel shows text color #5f8ec7, line height 1.50, and background color #11284f." />

:::info
The prototype design uses `letter-spacing: 3px` and `text-transform: uppercase` for the eyebrow. The email builder does not expose letter-spacing as a style property. Type the text in all caps manually. The visual result is close enough.
:::

### Hero headline

6. Drag a **Heading** below the eyebrow.
7. Type: `ChromaShift Lenses. 20% Off This Week.`
8. In the **Property Panel** and toolbar, set:
   - **Heading level:** H1
   - **Font:** Georgia
   - **Size:** 32px
   - **Text color:** `#ffffff`
   - **Alignment:** Center
   - **Line Height:** 1.50

<Screenshot src="/img/building-leoptical-emails/15-hero-heading-georgia-32.png" alt="The hero H1 heading in white Georgia 32px on the navy background. The Property Panel Colors section shows text color #ffffff and background color #11284f." />

### Hero body copy

9. Drag a **Paragraph** below the headline.
10. Type: `Adaptive polarized lenses that go from clear to tinted the moment you step outside. No swapping. No squinting.`
11. Set:
    - **Text color:** `#ffffff`
    - **Alignment:** Center

<Screenshot src="/img/building-leoptical-emails/16-hero-paragraph.png" alt="The hero section showing the eyebrow, headline, and paragraph text. A paragraph component toolbar is visible with Trebuchet MS font selected." />

### Hero button

12. Drag a **Button** below the paragraph.
13. Type the button label: `Shop ChromaShift`
14. In the **Style** tab, set **Button Type** to **Secondary**. This gives the button a white background with navy text and border, which is the correct inverted style for a dark background.

<Screenshot src="/img/building-leoptical-emails/17-button-secondary-type.png" alt="The Button Style tab showing Button Type set to Secondary, with colors: Text #11284f, Background #ffffff, Border #11284f." />

15. In the **Layout** section of the Style tab, set:
    - **Button Padding:** Custom: 8px top, 16px right, 8px bottom, 16px left
    - **Button Margin:** Tiny (8px all sides)
    - **Button Width:** Auto

<Screenshot src="/img/building-leoptical-emails/18-button-padding-margin.png" alt="The Button Layout section showing custom padding (8/16/8/16), margin set to Tiny (8px all), and width set to Auto." />

16. In the **Settings** tab, configure the button action:
    - Click **Configure Action** (or the link icon).
    - **Button Action:** Link to URL
    - **Link URL:** `https://leoptical.web.app/`
    - Check **Open in a new tab**.

<Screenshot src="/img/building-leoptical-emails/19-button-action-settings.png" alt="The Button Settings tab showing Button Text set to Shop ChromaShift and a Link to URL action partially configured." />

<Screenshot src="/img/building-leoptical-emails/20-button-url-configured.png" alt="The Button Action dialog showing Link to URL selected, the URL set to https://leoptical.web.app/, and Open in a new tab checked." size="wide" />

The hero section is complete. It should look like this:

<Screenshot src="/img/building-leoptical-emails/21-hero-complete.png" alt="The complete hero section showing the navy background, SUMMER LENS EVENT eyebrow in blue, the white H1 headline, white paragraph text, and a white secondary Shop ChromaShift button." />

:::info
Setting the button to **Secondary** type gives you the inverted color scheme automatically. The Brand's default primary button is navy fill with white text, which works on white backgrounds. Secondary reverses it: white fill, navy text. On a dark background, this is what you want.
:::

## Building the personalized greeting

Below the hero, add a greeting that uses the recipient's first name and loyalty tier.

1. Add a new **Section** below the hero.
2. Configure: 1 column, white background.
3. In the **Layout** section of the Style tab, set **Padding** to **Extra Large** (50px on all sides).

<Screenshot src="/img/building-leoptical-emails/22-greeting-section-padding.png" alt="The greeting section selected on the canvas showing merge field tokens inline. The Property Panel Layout section shows Padding set to Extra Large with all values at 50px." />

4. Drag a **Heading** into the section.
5. Set the heading level to **H3**.
6. Place your cursor in the heading and type: `Hi `
7. Click the **Merge Fields** icon in the component toolbar. The picker opens with the same categories you saw in the subject line flow.

<Screenshot src="/img/building-leoptical-emails/23-inline-merge-field-picker.png" alt="The Add Merge Field dropdown open from the heading toolbar, showing Data Graph, Recipient, Sender, Other, Link, and Saved Expressions categories." />

8. Navigate to **Data Graph > Primary Objects** and select **First Name**. Configure it the same way as the subject line merge field (API name `First_Name_2` to avoid a duplicate name, or use a different name like `Greeting_First_Name`).
9. Continue typing after the merge field token: `, this one's for you.`

The heading should read: "Hi" followed by the merge field token, then ", this one's for you."

10. Drag a **Paragraph** below the heading.
11. Type: `As a valued `
12. Insert a merge field for loyalty tier: navigate to **Data Graph > Primary Objects** and select the loyalty tier field. Set a default value of `VisionCare Rewards`.
13. Continue typing: ` member, you get early access to our seasonal lens sale.`

## Building the product section

This section uses a two-column layout with a product image on the left and product details on the right.

1. Add a new **Section** below the greeting.
2. In the **Settings** tab, set **Column Layout** to a two-column equal split. **Number of Columns:** 2. **Column Distribution:** 6 | 6.

<Screenshot src="/img/building-leoptical-emails/24-two-column-layout-config.png" alt="The Section Settings tab showing a two-column layout selected in the grid picker, Number of Columns set to 2, and Column Distribution showing 6 and 6." />

3. Set the section background to `#f7fafc` (Surface).

### Left column: product image and caption

4. In the left column, drag an **Image** component.
5. In the Property Panel, confirm **Salesforce CMS** is selected as the source. Click **Add Image**.

<Screenshot src="/img/building-leoptical-emails/25-image-source-cms.png" alt="The Image component settings showing Salesforce CMS selected as the image source with a blue Add Image button." />

6. Browse to the **Product Images** folder in the CMS workspace and select the Visionaire ChromaShift product image.

7. Below the image, drag a **Paragraph** component for the caption.
8. Type: `VISIONAIRE COLLECTION`
9. Style:
   - **Paragraph Style:** Paragraph 2
   - **Font:** Trebuchet MS
   - **Size:** 13px
   - **Text color:** `#617084` (Muted)

<Screenshot src="/img/building-leoptical-emails/27-visionaire-collection-caption.png" alt="The VISIONAIRE COLLECTION caption paragraph selected with Paragraph 2 style, Trebuchet MS 13px, and text color showing a dark value." />

### Right column: featured product details

10. In the right column, drag a **Heading** for the label.
11. Type: `FEATURED`
12. Style:
    - **Heading level:** H4
    - **Font:** Trebuchet MS
    - **Size:** 10px
    - **Text color:** `#617084` (Muted)

<Screenshot src="/img/building-leoptical-emails/28-featured-label-style.png" alt="The FEATURED label heading selected showing Heading Style 4, Trebuchet MS, 10px, with text color #617084." />

13. Below the label, drag a **Heading** for the product name.
14. Type: `Visionaire ChromaShift`
15. Style:
    - **Heading level:** H3
    - **Font:** Trebuchet MS
    - **Size:** 18px
    - **Text color:** `#1c2b55`

<Screenshot src="/img/building-leoptical-emails/29-product-heading-style.png" alt="The Visionaire ChromaShift heading selected showing Heading Style 3, Trebuchet MS, 18px, with text color #1c2b55." />

16. Drag a **Paragraph** below the heading.
17. Type: `Adaptive polarized lenses that go from clear to tinted in seconds. Built for people who spend real time outdoors.`

18. Drag a **Button** below the paragraph.
19. Label: `Shop ChromaShift`. Configure the URL to `https://leoptical.web.app/` with the same settings as the hero button. Use the **Primary** button type here (navy fill, white text) since the section background is light.

The completed product section should look like this:

<Screenshot src="/img/building-leoptical-emails/26-product-section-complete.png" alt="The two-column product section showing the ChromaShift product image with VISIONAIRE COLLECTION caption on the left, and FEATURED label, Visionaire ChromaShift heading, paragraph, and Shop ChromaShift button on the right." />

## Adding the feature list

Below the product section, add a "Why ChromaShift?" section with bullet points.

1. Add a new **Section** (1 column, white background).
2. Set **Padding** to 32px on all sides.

<Screenshot src="/img/building-leoptical-emails/30-why-chromashift-section.png" alt="An empty section selected below the product block. The Property Panel Layout section shows padding set to 32px on all sides." />

3. Drag a **Heading** (H2) into the section: `Why ChromaShift?`

4. Drag a **List** component below the heading.
5. Enter the following items:
   - Photochromatic and polarized in one lens
   - UV400 protection standard
   - Transitions in under 10 seconds
   - Available in all frames

6. Style the list:
   - **Font:** Trebuchet MS
   - **Size:** 18px
   - **Line Height:** 1.50

<Screenshot src="/img/building-leoptical-emails/31-bullet-list-component.png" alt="The List component on the canvas showing four bullet points about ChromaShift features. The toolbar shows Trebuchet MS at 18px with line height 1.5." />

## Adding the promo banner

Below the feature list, add a promotional coupon section. The prototype calls for a dashed-border coupon box. The email builder does not support dashed borders, but you can approximate the look with a styled column.

1. Add a new **Section** below the feature list (1 column, white background).
2. Select the **Column** inside the section (click the column area, not the section).
3. In the Column Property Panel, set the **Color Scheme** to Custom:
   - **Background:** `#f7f4fc` (a light off-white)

<Screenshot src="/img/building-leoptical-emails/32-coupon-column-colors.png" alt="The Column Property Panel showing Color Scheme set to Custom with Background set to #f7f4fc." />

4. Expand the **Border** section and set:
   - **Border Radius:** Rounded (4px)
   - **Border Weight:** Thin (1px)

<Screenshot src="/img/building-leoptical-emails/33-coupon-border-settings.png" alt="The Column Border section showing Border Radius set to Rounded (4px) and Border Weight set to Thin (1px)." />

5. Drag a **Heading** (H4 or small text) into the column. Type: `LIMITED TIME OFFER`. Style it as a small, muted label.

6. Drag a **Heading** (H2) below the label. Type: `Use code SUMMER20 at checkout`.
7. Style:
   - **Font:** Georgia
   - **Size:** 24px
   - Change the text color of `SUMMER20` to `#5f8ec7` (the accent blue). Select just the word "SUMMER20", open the text formatting dropdown, and choose **Text Color** to apply it inline.

<Screenshot src="/img/building-leoptical-emails/34-promo-heading-text-color.png" alt="The heading Use code SUMMER20 at checkout with the text formatting dropdown open showing Text Color, Background Color, and other options." />

8. Drag a **Paragraph** below the heading.
9. Type: `20% off all ChromaShift lenses. This week only.`
10. Set **Alignment** to Center.

<Screenshot src="/img/building-leoptical-emails/35-promo-subtext-center.png" alt="The promo section showing the LIMITED TIME OFFER label, the SUMMER20 heading, and the subtext paragraph with center alignment selected in the toolbar." />

## Adding the CAN-SPAM footer

Promotional emails require an organization address and unsubscribe link. Build a footer section for these.

1. Add a new **Section** below the promo banner.
2. Configure:
   - **Background color:** `#f7fafc` (Surface)

3. Drag a **Paragraph** into the section.
4. Style the paragraph first:
   - **Font:** Trebuchet MS
   - **Size:** 13px
   - **Text color:** `#617084` (Muted)
   - **Inline Link color:** `#617084`
   - **Background color:** `#f7fafc`

<Screenshot src="/img/building-leoptical-emails/36-footer-paragraph-style.png" alt="The footer Paragraph style panel showing text color #617084, inline link color #617084, and background color #f7fafc." />

### Preference center link

5. Type: `Manage your email preferences`
6. Select the text you just typed. Click the **Link** icon in the toolbar.
7. In the link dialog, the **Link Text** field shows "Manage your email preferences". Click **Add Merge Field** below the URL field.
8. From the **Link** category, select **Preference Manager**.

<Screenshot src="/img/building-leoptical-emails/40-preference-link-dialog.png" alt="The link editing dialog with Link Text showing Manage your email preferences and the URL field empty, ready for a merge field." />

<Screenshot src="/img/building-leoptical-emails/41-preference-manager-select.png" alt="The Link merge field picker showing three options: Unsubscribe, Preference Manager (highlighted), and Email Preference Page." />

9. The URL field populates with `{!$link.PreferenceCenterUrl}`. Check **Open in a new tab** and click **Done**.

<Screenshot src="/img/building-leoptical-emails/42-preference-url-resolved.png" alt="The link dialog showing the URL field populated with the PreferenceCenterUrl merge field syntax and Open in a new tab checked." />

### Unsubscribe link

10. Type ` | ` after the preference link, then type: `Unsubscribe`
11. Select "Unsubscribe" and click the **Link** icon.
12. Click **Add Merge Field** below the URL field. From the **Link** category, select **Unsubscribe**.

<Screenshot src="/img/building-leoptical-emails/38-unsubscribe-link-picker.png" alt="The link dialog for Unsubscribe showing the Link merge field category with Unsubscribe, Preference Manager, and Email Preference Page options." />

13. Check **Open in a new tab** and click **Done**.

<Screenshot src="/img/building-leoptical-emails/39-unsubscribe-link-configured.png" alt="The Unsubscribe link configured with the merge field URL and Open in a new tab checked." />

### Organization address and copyright

14. On a new line, insert the organization address: click **Merge Fields** in the paragraph toolbar, navigate to the **Organization** category, and select **Physical Address**.

<Screenshot src="/img/building-leoptical-emails/37-organization-physical-address.png" alt="The Organization merge field category showing Physical Address highlighted with a red box, along with City, Country, Division, and Fax fields." />

15. On a new line, type: `© 2026 LEOptical. All rights reserved.`
16. Set the paragraph **Alignment** to Center.

:::warning
The platform does not validate that your promotional email includes an unsubscribe link or physical address. Forgetting either is a CAN-SPAM violation. Always check the footer before publishing.
:::

## Reviewing the complete email

Before previewing, scroll through the entire email and check each section. Your email should have, from top to bottom:

1. **Header:** Navy background, white LEOptical logo (15% width, left-aligned)
2. **Hero:** Navy background, "SUMMER LENS EVENT" eyebrow in accent blue, white H1 headline in Georgia 32px, white paragraph, secondary (inverted) button
3. **Greeting:** White background, 50px padding, H3 with firstName merge field, paragraph with loyalty tier merge field
4. **Product section:** Surface background, two-column 6/6 layout. Left: CMS product image with "VISIONAIRE COLLECTION" caption. Right: "FEATURED" label, "Visionaire ChromaShift" H3, paragraph, primary button
5. **Feature list:** White background, 32px padding, "Why ChromaShift?" H2, four bullet items in a List component
6. **Promo banner:** Column with `#f7f4fc` background, rounded 4px border, "LIMITED TIME OFFER" label, "Use code SUMMER20 at checkout" in Georgia 24px (SUMMER20 in accent blue), centered subtext
7. **Footer:** Surface background, muted 13px text with preference center link, unsubscribe link, organization address merge field, and copyright line, all centered

Every builder component has been used at least once:

| Component | Where it appears |
|-----------|-----------------|
| Heading | Eyebrow (H3), Hero headline (H1), Greeting (H3), Featured label (H4), Product heading (H3), Feature section (H2), Promo headings (H4, H2) |
| Paragraph | Hero, Greeting, Product section, Visionaire Collection caption, Promo subtext, Footer |
| List | Feature section |
| Button | Hero (secondary), Product section (primary) |
| Section | Every row of the email |
| Image | Header (logo), Product section (product image) |

:::info
The Repeater and Divider components are not used in this email. You will see the Repeater in the <ModuleLink slug="content-blocks" /> module. The Divider was omitted because section borders and spacing accomplish the same visual separation here. You are welcome to add a Divider between sections as practice.
:::

## Desktop and mobile preview

1. Click the **Preview** button in the top-right corner.
2. Select a published segment that contains at least one test contact.
3. Choose a **Unified Individual** from the list. The email renders with that person's data.
4. Confirm merge fields are populated (first name in the subject line and greeting, loyalty tier in the body).

5. Switch to **Mobile** view.
6. Confirm the two-column product section stacks to a single column (image on top, text below).
7. Confirm the overall layout reads well at the narrower viewport.

If merge fields show blank values or the default fallback, check that the selected individual has data for those fields in the Data Graph. If the preview fails entirely, confirm your segment is published and has at least one member.

## Sending a test email

1. In the preview, navigate to the **Test** tab.
2. Enter your email address in the test recipient field.
3. Set the **From Name** to `LEOptical`.
4. Set the **From Address** to an address on your authenticated domain (configured in the <ModuleLink slug="domain-setup" /> module).
5. Click **Send Test**.
6. Check your inbox. The test email should arrive within a few minutes. Verify:
   - Merge fields populated correctly
   - Images rendered
   - Button links work
   - The footer has the organization address and unsubscribe link
   - The layout looks correct in your email client

:::warning
Test sends are recorded as engagement data in the EmailEngagement DLO and Email Engagement DMO. Keep this in mind when reviewing analytics later. Your test sends show up alongside real sends.
:::

## Saving and publishing

After confirming the test email looks correct:

1. Close the preview.
2. Click **Save** in the builder.
3. Click **Publish** to make the email available for use in flows.

The email is now published and available for use in a Segment-Triggered Flow or other flow types. Flow configuration is covered in Part 5 of this course.

## Assignment

> **The client wants:** A promotional email for LEOptical's upcoming campaign. The marketing team will use this as their first hands-on experience with the email builder.

If you followed the walkthrough above, most of the assignment is already done. The tasks below confirm you hit every requirement and add one independent task.

1. Confirm your **Summer Lens Event** email exists in the LEOptical Marketing workspace and is Published.

2. Verify that every builder component listed in the component table has been used at least once: Heading, Paragraph, List, Button, Section, Image.

3. Confirm the email has at least one multi-column section (the product section with 6/6 column distribution).

4. Confirm the LEOptical Data Graph is connected as a data source.

5. Confirm merge fields are inserted and resolve correctly in preview (first name in the subject line and greeting, loyalty tier in the body).

6. Confirm the email previews correctly on both desktop and mobile.

7. Confirm a test email was sent and received successfully.

8. **(Stretch)** Build a second email for a different LEOptical campaign (loyalty tier upgrade notification, eye exam reminder, or order confirmation). Use a different layout and at least one component you want more practice with. This email does not need to be as polished as the first. The goal is repetition.

## Success Criteria

- [ ] A promotional email named "Summer Lens Event" exists in the LEOptical Marketing workspace with Published status.
- [ ] The email uses Heading, Paragraph, List, Button, Section, and Image components.
- [ ] The email has at least one multi-column section.
- [ ] The LEOptical Data Graph is connected as a data source.
- [ ] Merge fields for first name and loyalty tier are inserted and resolve correctly in preview.
- [ ] The email previews correctly on both desktop and mobile (columns stack on mobile).
- [ ] A test email was sent and received at your email address.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- Why did you connect the Data Graph before building the email body instead of after?
- What happens when a merge field's value is missing for a specific recipient? How did you handle this in the email?
- Why did you use the Secondary button type in the hero section? What would the Primary button type look like on a navy background?
- What is the difference between setting a section's Color Scheme to Custom versus using the Brand defaults? When would you override?
- Why is the organization address merge field required in the footer of a promotional email?
- You built this email from scratch without content blocks or templates. What parts of this email would you want to turn into reusable content blocks, and why?
- The feature list uses a native List component with standard bullets. The original design called for arrow characters with row separators. What are the tradeoffs between using native components versus an HTML component for custom formatting?
