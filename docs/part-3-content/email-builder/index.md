---
sidebar_position: 1
title: "The Email Builder"
description: "The drag-and-drop editor, every builder component, sections and columns, images, data sources, merge fields, and preview and test."
---

## Overview

The email builder is the tool LEOptical's marketing team will use every day. It is where brand guidelines become real emails, where Data Graph fields become personalized greetings, and where layout decisions happen visually rather than in code.

In the <ModuleLink slug="salesforce-cms" /> module, you set up the LEOptical Marketing workspace, uploaded brand assets, and configured the Brand object. In the <ModuleLink slug="building-leoptical-content-library" /> module, you wired up colors, typography, and button styles so every new asset starts on-brand. This module teaches the editor those assets feed into. You will learn every panel, every component, and every workflow the builder offers before building an actual email in the next subpage.

This is a reference-quality lesson. It is long on purpose. The goal is for you to know the builder cold: what each component does, how sections and columns work, where merge fields come from, and what breaks if you make the wrong choice. Some topics (like dynamic content and Handlebars) are introduced briefly here but covered in depth in later modules. When that is the case, the text says so.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- The email editor interface: canvas, Components Panel, Property Panel, and settings area.
- Every component in the Components Panel across all three tabs (Basics, Layout, Media).
- Sections and columns: creating custom column layouts, nesting sections, and the drag-and-drop mechanics of building email structure.
- Mobile responsiveness: how the builder handles column stacking, mobile preview, and mobile-specific options.
- Images from two sources: CMS workspace images and merge field (dynamic) images.
- The style system: per-element styling, how Brand defaults apply, and how to override them.
- The Data Sources tab: connecting the Data Graph to an email and what fields become available.
- Merge fields: how to insert them, what each category in the picker represents, and which fields to avoid (Account Engagement artifacts).
- Preview and test: responsive preview, test sends, and previewing as a specific contact.
- Email settings: subject line, preheader, and sender info.
- The Repeater component: dynamic lists driven by related data.
- HTML paste emails: when they are the right choice and why this course focuses on drag-and-drop.

## The editor interface

When you open an email in the builder, you see four main areas.

**The canvas** occupies the center of the screen. This is the live editing surface where you drag components, edit text inline, and arrange your email layout. The canvas shows a WYSIWYG representation of how the email will render.

**The Components Panel** sits on the left side. It contains three tabs (Basics, Layout, Media) with every draggable component. You drag components from this panel onto the canvas.

**The Property Panel** sits on the right side. It is context-sensitive. When no component is selected, it shows email-level settings: Brand selection, Data Sources, and email settings. When you select a component on the canvas, the Property Panel shows that component's style and configuration options.

**The settings area** runs along the top of the canvas. Here you find the subject line and preheader fields, the desktop/mobile view toggle, the HTML toggle, and the **Preview** button.

<Screenshot src="/img/email-builder/02-full-builder-interface.png" alt="The full email builder interface showing the Components Panel on the left with Basics/Layout/Media tabs, the canvas in the center with a blank email, the Property Panel on the right showing Brand and Data Sources, and the top bar with subject line, view toggle, and Preview button." />

When no component is selected, clicking anywhere on the Property Panel gives you access to the email's Brand and Data Sources. This is where you connect a Data Graph or switch the associated Brand. Keep this in mind: if you click a component and want to get back to email-level settings, click an empty area of the canvas.

## Components Panel: Basics tab

The Basics tab contains the six text and structural components you will use most often.

Before covering each one, here is what they all share. Every text-editable component (Heading, Paragraph, List, Button) has a toolbar that appears when you select it. From left to right, the toolbar includes:

- **Container Component toggle** to switch between editing the component itself and editing its containing wrapper (background, spacing)
- **Component type indicator** showing which component is selected
- **Draft with Agentforce** button (the sparkle icon) for AI-generated content. If a Brand is associated, Agentforce reads the Brand Identity and Brand Tone fields you configured in the <ModuleLink slug="building-leoptical-content-library" /> module.
- **Formatting tools** for bold, italic, underline, strikethrough, link, and indent
- **Merge Fields** button to insert personalization tokens
- **Actions** for drag, duplicate, and delete

<Screenshot src="/img/email-builder/08-component-toolbar.png" alt="The component toolbar showing the Container toggle, component type indicator, Draft with Agentforce sparkle icon, formatting tools, Merge Fields icon, and action buttons." size="wide" />

### Heading

Adds a heading element to the email. The Brand heading styles (font, size, color) apply automatically based on the heading level. You select the heading level (H1, H2, H3, H4) in the Property Panel's style settings.

Use H1 for the email title (one per email, in the hero section). Use H2 for section headings. Use H3 for product names or card titles. H4 is for labels and table headers.

Headings support merge fields and dynamic content.

### Paragraph

Standard body text. You edit it directly on the canvas with full formatting support (bold, italic, underline, strikethrough, link, indent). The Brand body copy styles apply automatically.

Paragraphs support merge fields and dynamic content. This is the component you will use most.

### List

Creates bullet or numbered lists. Use it for product features, steps, or any enumerated content in the email body.

### Button

Creates a call-to-action button with a redirect link. The Brand button styles (fill color, text color, border radius, font) from the <ModuleLink slug="building-leoptical-content-library" /> module apply automatically.

Buttons can link to:
- Any URL (typed directly)
- A Salesforce CMS content item
- A dynamic URL using merge fields

For LEOptical, primary buttons use navy fill with white text and a 30px pill shape. That is already configured in the Brand, so new buttons inherit it.

### Divider

A visual separator line. Use it between content zones in the email body. The divider inherits the Brand border color.

### HTML

Pastes raw HTML source code directly into the email. Useful for custom layouts, dynamic image constructions, or elements the standard components do not support.

HTML components do not inherit Brand styling. Whatever you put in the HTML block renders exactly as written. Use this sparingly and only when the other components cannot achieve what you need.

<Screenshot src="/img/email-builder/03-components-basics-tab.png" alt="The Components Panel with the Basics tab selected, showing the six components: Button, Divider, Heading, HTML, List, and Paragraph." size="narrow" maxHeight="400px" />

## Components Panel: Layout tab

The Layout tab contains the structural components that control email architecture.

### Section

Sections are the building blocks of email layout. Every row in an email is a section. A section controls how many columns that row has and how wide each column is.

When you drag a Section from the Layout tab onto the canvas, the Property Panel lets you configure:

- **Number of columns** and width distribution (1-column, 2-column equal, 2-column 1/3 + 2/3, 3-column, and other splits)
- Up to **6 columns** per section
- **Background color**, **padding**, and **border** per section
- **Mobile Layout** setting to stack or retain columns on mobile (more on this in the mobile responsiveness section below)

After configuring the columns, you drag other components (Heading, Paragraph, Image, Button, etc.) into each column slot. Each column has independent padding and alignment settings.

Sections can be **nested**. You can drag a Section component inside another section's column to create more complex layouts. This is how you build layouts like a 2-column section where one column itself has a 2-column sub-layout.

<Screenshot src="/img/email-builder/09-section-property-panel.png" alt="The Property Panel showing a Section component selected, with column layout presets, number of columns slider, and column distribution controls." size="narrow" maxHeight="500px" />

### Repeater

The Repeater is a dynamic container that repeats a layout for each record in a data source. Think of it as a visual `for` loop. If a recipient has three recent orders, the Repeater renders three cards, one per order, each populated with that order's data.

The Repeater is covered in detail in its own section below. It lives in the Layout tab because it is fundamentally a structural component that generates repeated sections.

<Screenshot src="/img/email-builder/04-components-layout-tab.png" alt="The Components Panel with all three sections expanded: Basics (6), Layout (3) showing Content Block, Repeater, and Section, and Media (1) showing Image." size="narrow" maxHeight="500px" />

:::info
The Layout tab also contains a **Content Block** component. Content blocks are reusable email sections stored in the CMS workspace. They are covered in the <ModuleLink slug="content-blocks" /> module, not here. You will see it in the panel but should skip it for now.
:::

## Components Panel: Media tab

### Image

The Image component inserts images into the email. When you drag an Image component onto the canvas, the Property Panel shows a **Select Image Source** section with two options:

1. **Salesforce CMS** selects a published image from the CMS workspace. Images you uploaded in the <ModuleLink slug="building-leoptical-content-library" /> module (logos, product images) appear here. CMS images retain their metadata: captions, URL links, and dynamic content configuration.

2. **Merge Field** uses a Data Graph text field that contains an image URL. This lets you show a different image per recipient. The URL field must be stored as a **text type** (not URL type) in the DMO for this to work.

<Screenshot src="/img/email-builder/16-image-source-selection.png" alt="The Image component's Property Panel showing the Select Image Source section with Salesforce CMS and Merge field radio options, with the leoptical-logo-white CMS image selected." />

:::tip[Coming from MCE?]
- **Content Builder is gone.** MCE stored images in Content Builder's folder structure. MCA stores images in the Salesforce CMS workspace.
- **The editor is new.** MCE's drag-and-drop editor was Content Builder's email editor. MCA uses a different editor with a component model (Basics/Layout/Media tabs), native Brand integration, and built-in Agentforce AI drafting.
- **Responsive design is native.** MCE had limited built-in responsive support. Responsive behavior often required custom HTML and CSS. MCA has native controls: stack-on-mobile per section, desktop/mobile toggle, and device-specific visibility.
- **Repeaters replace AMPscript loops.** MCE had no native Repeater component. Displaying dynamic lists (order history, product recommendations) required AMPscript `LookupRows()` and manual HTML table construction. MCA's Repeater is a visual, no-code component.
- **AMPscript is replaced by Handlebars.** MCE used AMPscript for personalization. MCA uses Handlebars as its merge field language (though AMPscript support was added in Summer '26). The merge field picker is visual, not code-based.
:::

## Sections and columns

Sections are the horizontal containers that give your email its layout. Understanding them is essential because every email is just a vertical stack of sections, and each section controls how its content is arranged horizontally.

### Creating a column layout

1. Drag a **Section** component from the **Layout** tab onto the canvas.
2. In the **Property Panel**, choose a column configuration: 1-column, 2-column (equal or split), 3-column, or custom.
3. Drag content components into each column slot.

You can have up to 6 columns in a single section. Common patterns:

| Layout | Use case |
|--------|----------|
| 1-column | Hero sections, body text, full-width banners |
| 2-column equal | Product image + description side by side |
| 2-column 1/3 + 2/3 | Thumbnail + text block |
| 3-column equal | Product grid, feature comparison |

Column widths can be customized with fractional splits. Each column has independent padding and alignment settings in the Property Panel.

### Nesting sections

You can drag a Section inside another section's column. This creates nested layouts for more complex designs. For example, a 2-column section where the right column itself contains a 2-column sub-section.

Use nesting sparingly. Deep nesting makes emails harder to maintain and can cause rendering issues in older email clients.

### Drag-and-drop mechanics

- Drag a component from the Components Panel and drop it into a column slot on the canvas. A blue highlight shows where the component will land.
- To rearrange components within a section, use the drag handle in the component toolbar.
- To move a component between sections, drag it to the target location.
- Use **Duplicate** in the component toolbar to copy a component and its settings.

<Screenshot src="/img/email-builder/17-2col-section-example.png" alt="A 2-column section on the canvas with a product image in the left column and a Featured heading, paragraph, and Shop ChromaShift button in the right column. The Property Panel shows the Section settings with a 2-column equal layout selected." />

## Mobile responsiveness

The builder has two mobile-related features.

### Desktop/Mobile preview toggle

The top bar of the editor has a **View Mode** toggle that switches between Desktop and Mobile views. Mobile view narrows the canvas to simulate a phone viewport, showing how column stacking and component sizing behave.

<Screenshot src="/img/email-builder/18-mobile-view-toggle.png" alt="The email builder with Mobile selected in the View Mode dropdown, showing the canvas narrowed to simulate a phone viewport." />

### Mobile Layout

Each section has a **Mobile Layout** setting in the Property Panel with two radio options:

- **Stack columns** (default) collapses multi-column layouts to a single column on mobile devices. Columns stack top-to-bottom in left-to-right order.
- **Retain column layout** keeps columns side-by-side on mobile. This is rarely what you want for a 600px email viewed on a 320px screen, but it exists for cases like a short icon + label layout.

<Screenshot src="/img/email-builder/19-section-mobile-layout.png" alt="The Section Property Panel showing Column Layout presets, Number of Columns, Column Distribution, and the Mobile Layout radio options with Stack columns selected." />

## Images

Images in the email builder come from two sources. You set up the first source in the <ModuleLink slug="building-leoptical-content-library" /> module when you uploaded logos and product images to the CMS workspace.

### CMS workspace images

When you drag an **Image** component onto the canvas and select **Salesforce CMS** as the source, a picker shows all published images in the workspace. Select the image you want and it drops into place.

CMS images are the preferred approach. They stay organized in the workspace folder structure, retain metadata (captions, URL links), and can be reused across multiple emails.

### Dynamic images via merge fields

The second image source is **Merge Field**. Instead of selecting a static image, you point the Image component at a Data Graph field that contains an image URL. Each recipient sees a different image based on their data.

The URL field must be stored as a **text type** in the DMO, not as a URL type. If the field is typed as URL, the Image component cannot read it.

According to the Agentic Marketer article on dynamic images, there is a second method for dynamic images: use the **HTML component** and construct an `<img>` tag with a merge field as the `src` attribute. This approach gives you more control over image sizing and fallbacks but requires writing HTML.

## The style system

Every component you place on the canvas inherits style defaults from the Brand you configured in the <ModuleLink slug="building-leoptical-content-library" /> module. The Property Panel's style tab shows these defaults and lets you override them.

### How Brand defaults apply

When you set a Brand as the workspace default, every new email is "autobranded." All components inherit the Brand's typography, colors, and button styles before you touch anything. The LEOptical Brand gives you navy headings in Georgia, Trebuchet MS body copy, and pill-shaped navy buttons out of the box.

You can also apply or switch brands at any time. When no component is selected, the Property Panel shows a **Brand** section where you can change which Brand is associated with the email.

### Overriding Brand defaults

To override a Brand default on a specific component, change its style options to **custom** in the Property Panel. This disconnects that component's style from the Brand.

There are two consequences of overriding:

1. If the Brand itself later changes (say, you update the navy color to a different shade), components with custom overrides are **not updated**. Only components still using Brand defaults pick up the change.
2. You need to remember which components have overrides when troubleshooting style inconsistencies.

<Screenshot src="/img/email-builder/10-heading-style-panel.png" alt="The Property Panel Style tab for a Heading component showing Brand-inherited font and color settings with Heading Style, Font Family, Font Size, Text Formatting, and Colors sections." size="narrow" maxHeight="500px" />

:::warning
Updating a Brand does not automatically update published emails. You must unpublish and republish the email for Brand changes to take effect. And even then, components with custom (overridden) styles remain unchanged.
:::

## Data sources

The Data Sources tab is how the email builder connects to your data for personalization. Without a data source, merge fields have nothing to pull from.

### Connecting the Data Graph

1. Click an empty area of the canvas so no component is selected.
2. In the **Property Panel**, find the **Data Sources** section.
3. Select the Data Graph you built for LEOptical (rooted on Unified Individual) as the primary data source.

If a default Data Graph has been configured in Marketing Cloud Setup, it loads automatically when you open the email editor. This eliminates the manual selection step for every email.

<Screenshot src="/img/email-builder/07-data-sources-connected.png" alt="The Property Panel Data Sources tab showing the LEOptical Data Graph connected as the default data source, with the Marketing_Content_Personalizat Data Graph Data Provider card visible." size="narrow" maxHeight="500px" />

### What appears in the Data Sources tab

Once connected, the Data Sources tab shows:

- **The Data Graph object tree.** Unified Individual is at the root, with related objects (Contact Point Email, Loyalty Program Member, Sales Order, etc.) nested underneath. You can navigate this tree to find any field in the graph.
- **Organization merge fields.** Compliance fields like `{!$organization.Address}` for the physical mailing address. These are required for CAN-SPAM compliance in promotional emails.
- **Link merge fields.** System-generated links for unsubscribe and preference center.
- **Saved Expressions.** Reusable merge field configurations created in the CMS workspace. If your team has common personalization patterns, Expressions let you save and reuse them.

{/* VERIFY: As of Summer '26, additional data sources beyond the Data Graph may be available (Salesforce objects, content variables, offers). Confirm what the Data Source panel shows in the SDO and whether these extra sources are present. */}

## Merge fields

Merge fields are how you pull recipient-specific data into the email. A first name greeting, a loyalty tier badge, a point balance, an order number: these are all merge fields.

### Inserting a merge field

1. Select a text-editable component (Heading, Paragraph, Button, etc.).
2. Click the **Merge Fields** icon in the component toolbar.
3. A picker appears with categories of available fields.
4. Navigate to the field you want and select it.
5. The merge field token appears in the component text.

<Screenshot src="/img/email-builder/11-merge-field-picker.png" alt="The merge field picker dialog showing the category list: Organization, Recipient, Sender, Other, Link, and Data Graph." />

### Merge field categories

The picker organizes fields into categories:

| Category | What it contains |
|----------|-----------------|
| Data Graph attributes | Fields from the connected Data Graph. **Primary Objects** are direct attributes on Unified Individual (like `firstName`, `lastName`, `loyaltyTier`). **Related Objects** are fields on related DMOs (like Sales Order total amount, Contact Point Email address). |
| Organization | Compliance fields like `{!$organization.Address}` for the physical mailing address. Required for CAN-SPAM in promotional emails. |
| Links | System-generated links for unsubscribe and preference center. **Use these.** |
| Other | Account Engagement (Pardot) leftovers. Contains fields that look valid but error at preview time. **Do not use these.** See the "Links vs Other" section below. |
| Saved Expressions | Reusable merge field configurations you or your team saved in the workspace. Uses `{!$Expression.ExpressionAPIName}` syntax. |

### Default values

When you insert a Data Graph merge field, the builder lets you define a default text value. If the attribute value is missing for a recipient, the fallback text displays instead. For example, set the default for `firstName` to "there" so `Hi {{firstName}}` renders as "Hi there" when the first name is missing.

:::warning
When a Data Graph field does not exist for an individual, the JSON simply omits that field entirely. It is not null or empty. It is absent. The merge field silently renders as blank. Always set default values for any merge field in customer-facing text.
:::

### Merge fields in subject line and preheader

Merge fields are not limited to the email body. You can insert them into the **Subject Line** and **Preheader** fields as well. A personalized subject line (`{{firstName}}, your eye exam is due`) consistently outperforms a generic one.

### Merge field syntax

Different field types use different syntax:

- **Data Graph fields** use Handlebars syntax (e.g., `{{firstName}}`)
- **Organization fields** use `{!$organization.FieldName}` syntax (e.g., `{!$organization.Address}`)
- **Saved Expressions** use `{!$Expression.ExpressionAPIName}` syntax

You cannot type merge fields manually. When you select a field from the picker, the platform generates an expression on the backend that pulls the data in at render time. Typing `{!$Expression.firstName}` into a text component does nothing. The picker is the only way to insert a working merge field.

Recognizing the syntax is still useful when you read an email's source or debug why a field renders blank. But creating them is always done through the picker.

### The "Links" vs "Other" gotcha

The merge field picker has two categories that both contain unsubscribe-related options: **Links** and **Other**. Only one of these works.

The **Links** category contains the MCA unsubscribe and preference center merge fields. These are the ones that work. Use them.

The **Other** category contains leftover Account Engagement (Pardot) fields, including an unsubscribe option. These do not work in MCA emails. Inserting one from **Other** causes an error when you attempt to preview or send a test.

:::warning
The merge field picker has an unsubscribe option in both **Links** and **Other**. Only the **Links** version works. The **Other** version is an Account Engagement artifact. It will error during preview and test. Always use **Links** for unsubscribe and preference center merge fields.
:::

## The Repeater component

The Repeater is one of the most interesting components in the builder. It takes a collection of related records from the Data Graph and renders each one using a layout you define once.

### What it does

A Repeater connects to a data source that contains multiple records per individual. It then renders those records using a single layout template that repeats for each item.

Use cases for LEOptical:
- Recent purchases (from Sales Order)
- Products in an order (from Sales Order Product)
- Loyalty reward options
- Upcoming appointments

### How to configure it

1. Drag the **Repeater** from the **Layout** tab onto the canvas.
2. In the **Property Panel**, select the **Repeater Source** from the Data Graph. This determines which related records repeat for each recipient.
3. Configure how many items to show and how many items per row.
4. Design the first item's layout by dragging components (Image, Heading, Paragraph, Button) into the repeater. Additional items inherit this layout.

Configuration options in the Property Panel:

| Option | What it controls |
|--------|-----------------|
| Repeater Source | The data source from the Data Graph. Determines which related records appear. |
| Items to show | Total number of items to display (e.g., 2, 3, 5). |
| Items per row | Number of items displayed horizontally per row (up to 6). |
| Sorting | Use **Edit Expression** to sort by a field (e.g., order date) and control display order. |
| Filtering | Apply **Where** filters to narrow which records appear. |

<Screenshot src="/img/email-builder/20-repeater-configured.png" alt="A Repeater component on the canvas showing a 2-column card layout with placeholder heading, text, and button components. The Property Panel shows Repeater Data Source connected to Sales Order, Filter and Sort Data with an Edit Expression option, Data Layout set to Card, and Number of Items to Show set to 2." />

### Critical merge field rule

When adding merge fields inside a Repeater, the fields **must** come from the repeater data source, not from the general Data Graph. If you are repeating Sales Order records, the merge fields inside the repeater should reference Sales Order fields, not Unified Individual fields.

If you switch the repeater source after merge fields are already configured, those fields break. You have to delete them and recreate them from the new source.

:::warning
Merge fields inside a Repeater must come from the Repeater's assigned data source. Do not pick fields from the general Data Graph. Switching the repeater source after configuration breaks all existing merge fields in that repeater.
:::

### Limitations

- **No fallback for empty data.** If a recipient has no records in the repeater source, the repeater renders empty. There is no built-in mechanism for fallback content.
- **Cannot be inside Content Blocks.** Repeaters are not supported inside Content Blocks. If you need a repeatable layout in a content block, it is not possible.
- **Dynamic Content (Personalization Points) not supported.** You cannot apply conditional variations to repeater components.
- **Outlook rendering quirks.** In a 2-column repeater layout, set image width to 284px. In a 3-column layout, use 186px. These are Outlook-specific fixes documented by the Mavlers repeater guide.
- **Email size.** Each additional item increases the email size. Keep item counts practical (a few items, not dozens).

### Repeaters in the LEOptical context

For the LEOptical implementation, the most likely repeater use case is showing a customer's recent orders or products purchased. The Data Graph includes Sales Order and Sales Order Product DMOs. A Repeater connected to Sales Order Product could show product names, images, and prices for items in a recent order.

You will not build a repeater in the hands-on walkthrough (it requires specific data relationships to be meaningful). But you need to understand the concept because client implementations almost always need them for order summaries, product recommendations, or appointment lists.

## Preview and test

Before sending an email through a flow, you preview it with real data and send test copies.

### Preview workflow

1. Click the **Preview** button in the top-right corner of the editor.
2. Select a **published segment** with at least one recipient. You cannot preview without a segment.
3. From the segment, choose a **Unified Individual** (up to 10 contacts are shown) to preview the email with that person's data.
4. Merge fields render with the selected individual's actual data.

Toggle between **Desktop** and **Mobile** views in the preview to check responsive layout.

<Screenshot src="/img/email-builder/13-preview-recipients.png" alt="The preview dialog showing the VIP Customers segment selected, with a dropdown list of sample recipients to choose from, and the email rendered on the right." />

<Screenshot src="/img/email-builder/15-preview-mobile.png" alt="The preview showing the email in Mobile view, with the layout adapted to a narrow viewport and the Mobile option selected in the device dropdown." />

:::warning
Preview requires a **published segment** with at least one recipient. If you have not built and published a segment yet, you cannot preview merge fields with real data. You may need to create a small test segment for preview purposes.
:::

### Test send

1. After selecting a Unified Individual for preview, navigate to the **Test** tab.
2. Enter the test recipient email address.
3. Set the **From Name** and **From Address**. The From Address must match your authenticated DKIM domain.
4. Send the email. You can send to up to **5 email addresses**.

Group email addresses count toward the 5-address limit. If a group address has multiple recipients, the email goes to all members.

<Screenshot src="/img/email-builder/14-test-send-dialog.png" alt="The Test Send tab showing fields for test send email address and From Name and Address, with a Send Test button." size="wide" />

:::warning
Test sends are recorded in the EmailEngagement DLO and Email Engagement DMO. This means test sends can show up in analytics and reporting. Keep this in mind when reviewing engagement data: not every send is a real customer send.
:::

## Email settings

Three settings live above the canvas and in the Property Panel: subject line, preheader, and sender info.

### Subject line

The subject line is editable both above the canvas and in the Property Panel. It supports merge fields for personalization and dynamic content for conditional variations. Einstein AI can generate subject line suggestions if Einstein is configured in your org.

### Preheader

The preheader is the preview text that appears in inbox listings after the subject line. It supports merge fields and dynamic content, just like the subject line.

### Sender info (From Name / From Address)

The From Name and From Address are configured in the email settings. The From Address must match your authenticated DKIM domain (configured in the <ModuleLink slug="domain-setup" /> module). Merge fields can be used for sender personalization if needed.

### CAN-SPAM classification

When you first create an email (before entering the builder), you choose between **Promotional** and **Transactional**. This classification matters:

- **Promotional emails** require an organization address (`{!$organization.Address}`) and an unsubscribe link for CAN-SPAM compliance.
- **Transactional emails** do not require an unsubscribe link.

:::warning
The platform does not throw a validation error if an unsubscribe link is missing from a promotional email. You are fully responsible for CAN-SPAM compliance. Always include the organization address and unsubscribe link in promotional sends.
:::

<Screenshot src="/img/email-builder/05-property-panel-settings.png" alt="The Property Panel Settings tab showing the Message Purpose dropdown (Promotional selected), the LEOptical Brand card, and the Subject Line and Preheader section." size="narrow" maxHeight="500px" />

## HTML paste emails

The email builder has two editing modes:

1. **Drag-and-drop** (default) is the visual builder covered in this module.
2. **HTML / Code mode** is a full HTML editor accessible via a toggle in the top bar.

You can convert a drag-and-drop email to HTML mode by clicking **Convert to HTML**.

:::caution
Converting to HTML is **irreversible**. You cannot return to drag-and-drop mode. The conversion removes dynamic content (repeaters, conditional logic, content variants). Only merge fields are preserved.
:::

When would you use HTML mode?

- Migrating emails from another ESP and pasting existing HTML
- Developer-built templates with custom layouts
- Custom fonts (not available in drag-and-drop mode)
- Customizations that standard components cannot achieve

{/* VERIFY: Summer '26 reportedly adds custom font support. Confirm whether this is in drag-and-drop mode or only in HTML mode. */}

For importing external HTML: create a blank email, convert to HTML mode, and paste your code. You must manually add the organization address and unsubscribe link using merge fields for promotional sends.

This course focuses on drag-and-drop because it is how most MCA emails are built. HTML mode is an escape hatch, not the primary workflow.

## Publishing and sending

After building an email, click **Save**, then **Publish** to make it available for campaigns and flows. Emails must be published before they can be used in a flow.

The builder supports scheduled publishing and unpublishing. This is useful for preventing accidental sends after a campaign ends.

Sending is done through **Flow** (Segment-Triggered Flow or other flow types), not from the email builder itself. The builder is for creation and testing. Flow is for delivery. Flows are covered in Part 5 of this course.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What are the four main areas of the email builder interface, and what does each one do?
- How does the Brand you configured in the CMS module affect a new email? What happens to a component when you override its Brand default with a custom style?
- What are the two image sources available in the Image component? When would you use each one?
- Why must you always set a default value on merge fields, and what happens if you do not?
- What is a Repeater component, and why must merge fields inside a Repeater come from the repeater's data source rather than the general Data Graph?
- What is the difference between the Organization merge field category and the Data Graph attributes category in the merge field picker?
- The LEOptical marketing team creates a promotional email but forgets to include an unsubscribe link. What happens when they try to send it?
- Why does this course focus on drag-and-drop mode rather than HTML mode? When would HTML mode be the right choice for a real client engagement?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Everything to Know About the Marketing Cloud Next Email Builder](https://thespotforpardot.com/2025/09/19/everything-to-know-about-the-marketing-cloud-next-email-builder/) - The most thorough single article on the email builder. Covers interface layout, all components, styling, personalization, testing, and an FAQ section. By Erin Duncan at Sercante.
- [MCA Email Builder: A Starter Guide for Account Engagement Users](https://www.salesforceben.com/marketing-cloud-growth-email-builder-a-starter-guide-for-account-engagement-users/) - Overview of the builder for users coming from Pardot/Account Engagement. Good for additional MCE comparison context.
- [Marketing Cloud Next Content Creation: Complete Guide](https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/) - Covers all three component tabs, subject line personalization, CAN-SPAM compliance details, and the preview/test send flow.
- [Getting Hands-On with Repeaters](https://thespotforpardot.com/2025/12/19/getting-hand-on-with-repeaters/) - Real-world Repeater implementation for Fellowes Brands. Shows data structure, Data Graph setup, repeater configuration, and image handling inside repeaters.
- [Master SFMC Next Repeaters: No-Code Dynamic Emails](https://www.mavlers.com/blog/salesforce-marketing-cloud-next-repeaters/) - Detailed Repeater configuration guide with layout options, merge field rules, limitations, and Outlook rendering fixes.
- [HTML Emails: Drag and Drop vs Code Mode in Marketing Cloud Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/html-emails-vs-code-mode/) - Covers the two editing modes, conversion process, what is lost when converting, and when each approach is appropriate.
- [Marketing Cloud Next: Dynamic Images in Email, 2 Ways That Work](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/email-dynamic-images/) - Two methods for dynamic per-recipient images using the Image component merge field and the HTML component. Includes the important note about text-type URL fields.
- [Keyboard Shortcuts Reference](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_keyboard_shortcuts.htm&type=5) - Official Salesforce reference for email builder keyboard shortcuts.
