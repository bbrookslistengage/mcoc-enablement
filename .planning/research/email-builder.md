# Research: The Email Builder

Generated: 2026-08-28
Module: email-builder
Sources: 24 sources consulted

## Module Context

### Client Ask

> **The client wants:** The marketing team needs to understand exactly how the email builder works. This is the tool they'll live in every day.

### Full Assignment

**Module 12 — The Email Builder (multi-subpage)**

Each subpage below is a separate file. The concept page (`index.md`) teaches the builder thoroughly. The hands-on page (`building-leoptical-emails.md`) has the learner build a complete email.

**Subpage 1 — The Email Builder (concept page, `index.md`):**

A thorough, reference-quality walkthrough of every aspect of the email builder. The learner should come out of this knowing the builder cold. Cover:

- **Editor interface layout** — canvas, components panel, style panel, settings panel. What each area does.
- **Every component in the Components Panel:**
  - Basics tab: Heading, Paragraph, List, Button, Divider, HTML
  - Layout tab: Section, Repeater (NOT Content Block — that is covered in the Content Blocks module)
  - Media tab: Image
  - For each element: what it does, configuration options, when to use it.
- **Sections and columns** — creating columns, custom column layouts (1-col, 2-col, 3-col, custom splits), nesting sections. Cover the drag-and-drop mechanics of adding and rearranging components.
- **Mobile responsiveness** — how the builder handles responsive behavior, column stacking on mobile, mobile preview mode, any mobile-specific options (hide on mobile, reordering).
- **Images — two sources:**
  - CMS workspace images (uploaded in the CMS module)
  - Direct upload in the builder (research needed: confirm whether direct uploads get added to the CMS workspace automatically)
- **Style panel** — how per-element styling works, how Brand defaults from the LEOptical Brand apply and can be overridden per-element.
- **Data sources** — connecting the data graph to an email, what appears in the Data Sources tab, how org merge fields show up alongside data graph fields.
- **Merge fields** — how to insert a merge field, the picker UI, what each category/group of fields represents. CRITICAL: explicitly identify which fields in the merge field picker are Account Engagement (Pardot) artifacts that will break the email. These fields appear as valid options but cause a generic error at preview and block publishing. The module must name the specific fields, not just warn vaguely.
- **Preview and test** — responsive preview (desktop/mobile toggle), sending test emails, previewing as a specific contact.
- **Email settings** — subject line, preheader, sender info configuration.
- **HTML paste emails** — acknowledged as an option. Brief explanation of when HTML paste is the right choice (migrating from another ESP, developer-built templates). This course focuses on drag-and-drop components.

**Subpage 2 — Building LEOptical Emails (hands-on page, `building-leoptical-emails.md`):**

Build a single promotional email from scratch. Assignment:
1. Create a new email in the LEOptical Marketing workspace.
2. Use every builder element at least once (except Content Block).
3. Upload an image directly in the builder.
4. Create a multi-column layout.
5. Connect the LEOptical Data Graph as a data source.
6. Insert 2-3 simple merge fields.
7. Preview on desktop and mobile.
8. Send a test email.

### Success Criteria

- [ ] A promotional email exists in the LEOptical Marketing workspace.
- [ ] Every builder element (except Content Block) has been used at least once.
- [ ] The email includes at least one image uploaded directly in the builder (not from CMS).
- [ ] The email has at least one multi-column section.
- [ ] The LEOptical Data Graph is connected as a data source.
- [ ] Merge fields are inserted and resolve correctly in preview.
- [ ] The email previews correctly on both desktop and mobile.
- [ ] A test email was sent and received successfully.

---

## Platform Concepts

### Editor Interface Layout

The email builder has five main areas (Source: The Spot for Pardot, Erin Duncan article):

1. **View Mode** (top bar) — Switch between Desktop and Mobile view. Also provides access to show/hide the HTML code.
2. **Components Panel** (left side) — Displays available components organized into three tabs: Basics, Layout, Media. After Winter '26, also includes reusable Content Blocks.
3. **Row** — All components are placed in rows. These are the editable sections of the email.
4. **Canvas** (center) — The email preview area. Add components by dragging and dropping them onto the canvas.
5. **Property Panel** (right side) — Displays what can be changed and customized for the currently selected row/component. When no component is selected, this panel shows brand selection, email details (subject line, preheader), and data source configuration. Also called the "Style Panel" for component-level styling.

**How to access the email builder:** Navigate to the **Content** tab in Marketing Cloud Next. From the workspace, click **Add > Content > Email** (or Email Template). After setting the email name, API reference name, and CAN-SPAM classification (Promotional or Transactional), select a Brand. Click **Edit in Builder** to enter the editor. (Source: Mavlers Content Creation Guide, Salesforce Ben)

### Components Panel — Basics Tab

All components share common editing controls. From the component toolbar (left to right):
- **Container Component toggle** — Switch between editing the component and editing its container (changes background, spacing, etc.)
- **Component Type indicator** — Shows which component type is selected
- **Draft with Agentforce** — Use AI to write or revise content. If a Brand is associated, Agentforce uses the Brand Identity and Tone. Options include: revise by key message, change tone, increase/decrease length.
- **Formatting tools** — Indent, Bold, Italic, Underline, Strikethrough, Link
- **Merge Fields** — Insert org merge fields or Data Graph attribute merge fields
- **Actions** — Drag, Duplicate, Delete

(Source: The Spot for Pardot article)

Individual components:

**Heading** — Adds a heading element. Automatically applies Brand heading styles (font, size, color). Supports merge fields and dynamic content. Heading levels are configured in the style panel (H1, H2, H3, H4). (Source: Mavlers, confirmed by CMS module)

**Paragraph** — Standard body text component. Direct inline editing on canvas. Full formatting toolbar (bold, italic, underline, strikethrough, link, indent). Supports merge fields and dynamic content. Brand body copy styles apply automatically. (Source: The Spot for Pardot article, Mavlers)

**List** — Bullet-point or numbered list formats. (Source: Mavlers Content Creation Guide)

**Button** — Creates call-to-action buttons with redirection links. Can link to a Salesforce CMS content item, any URL, or a dynamic URL using merge fields. Brand button styles (fill color, text color, border radius, font) apply automatically. (Source: Mavlers, The Agentic Marketer)

**Divider** — Visual section separator line. (Source: Mavlers)

**HTML** — Paste raw HTML source code directly into the email. Useful for custom layouts, dynamic image constructions, or elements not supported by the standard components. Does not inherit Brand styling. (Source: Mavlers, The Agentic Marketer)

### Components Panel — Layout Tab

**Section** — Controls column structure within the email. Key features:
- Configure number of columns and column width ratios (e.g., 1-col, 2-col equal, 2-col 1/3+2/3, 3-col, etc.)
- Up to 6 columns supported horizontally
- **"Stack columns on mobile"** checkbox controls whether columns collapse to a single column on mobile devices
- Section size and spacing adjustable in the Property Panel
- Sections can be nested (a section inside another section's column)
- Background color, padding, and border configurable per section
(Source: Salesforce Ben, Mavlers, The Spot for Pardot)

**Repeater** — A dynamic container that repeats content based on a data source. See dedicated Repeater section below. Located in the Layout section of the Components Panel. (Source: The Spot for Pardot Repeaters article, Mavlers Repeaters guide)

**Content Block** — NOT covered in this module. Covered in Module 13 (Content Blocks). Allows embedding reusable sections from the CMS workspace. (Source: module-assignments.md)

### Components Panel — Media Tab

**Image** — Insert images into the email. Two source options in the "Select Image Source" section:
1. **Salesforce CMS** — Select a published image from the CMS workspace. Retains CMS properties (captions, URL links, dynamic content configuration).
2. **Merge Field** — Use a Data Graph text field containing an image URL for per-recipient dynamic images. The URL field must be stored as text type (not URL type) in the DMO. (Source: The Agentic Marketer dynamic images article, Mavlers)

<!-- VERIFY: Confirm whether a third "Upload" option exists in the Image component's source selection UI, or whether direct upload is done through the CMS image source picker. The distinction matters for documenting the two image workflows. -->

### Sections and Columns

- Drag a **Section** component from the Layout tab onto the canvas
- In the Property Panel, configure the column layout (number of columns and width distribution)
- Up to 6 columns per section
- Components are placed inside column slots by dragging them into position
- Sections can be nested inside other sections' columns for more complex layouts
- Column widths can be customized with fractional splits
- Each column has independent padding and alignment settings
(Source: Salesforce Ben, Mavlers, The Spot for Pardot)

### Mobile Responsiveness

- **View Mode toggle** — Switch between Desktop and Mobile preview in the top bar to see how the email renders on different screen sizes
- **Stack columns on mobile** — Per-section checkbox. When enabled, multi-column layouts stack vertically on mobile devices. When disabled, columns maintain their layout on mobile.
- **Hide on desktop / Hide on mobile** — Sections can be hidden for specific device types, allowing different content for desktop vs mobile views. <!-- VERIFY: Confirm the exact toggle names and whether this is per-section or per-component in a live SDO. Some sources mention this feature but exact UI details vary. -->
- Column stacking is the default responsive behavior for multi-column sections
- The mobile preview in View Mode simulates a narrower viewport to show stacking behavior

(Source: Salesforce Ben, Mavlers, web search results)

### Images — Two Sources

**Source 1: CMS Workspace Images**
Images uploaded and published in the CMS workspace (done in the CMS module) are available through the Image component's Salesforce CMS source option. These images retain their CMS metadata (captions, links).

**Source 2: Direct Upload in the Builder**
<!-- VERIFY: CRITICAL RESEARCH QUESTION — The exact behavior of direct image upload in the email builder is not well documented in external sources. Multiple sources confirm two image sources (CMS and merge field/dynamic), but the direct upload workflow is unclear. Possibilities:
1. The Image component only offers CMS and Merge Field sources, and "direct upload" means uploading a new image to the CMS from within the builder's image picker.
2. There is a separate upload button in the Image component that uploads to the CMS workspace automatically.
3. Direct upload is done through an Upload option that stores the image outside the CMS.

The Repeaters article mentions: "If the image is in Salesforce CMS, it can be added using the Image component and selecting the Salesforce CMS image source option." This implies the CMS source is one of potentially multiple options.

This must be verified in a live SDO before writing. The module spec requires the learner to "upload an image directly in the builder (not from CMS)" which presupposes a distinction exists. -->

### Style Panel (Property Panel — Style Tab)

**Brand defaults:**
- If a default Brand is set for the CMS workspace, the email is "autobranded" before you start building — all components inherit Brand typography, colors, and button styles automatically.
- You can apply or switch brands at any time from the Property Panel (when no component is selected).
- Brand styles are visible in the component's Style section of the Property Panel, showing what is auto-styled from the Brand vs. what can be edited.

**Overriding Brand defaults:**
- Change the style options to **"custom"** to override Brand styling on a specific component.
- Once overridden, if the Brand itself later changes, those changes will NOT automatically update components where styling has been overridden.
- Per-component styling includes: font, font size, color, background color, padding, margin, alignment, border.

**Brand propagation limitation:**
- Once content has been published, updating the associated brand settings will NOT automatically update the published content. You must unpublish and republish.
- Components with "custom" (overridden) styles are never affected by Brand updates, even on republish.

(Source: The Spot for Pardot article, Mavlers Brand Guidelines article, The Agentic Marketer Reusability article)

### Data Sources

**Connecting a Data Graph:**
- In the Property Panel (when no component is selected), navigate to the **Data Sources** section.
- Select the Data Graph (such as the LEOptical Data Graph rooted on Unified Individual) as the primary data source.
- If a default Data Graph has been set in Marketing Cloud Setup, it automatically loads when you open the email editor, eliminating manual selection for each email.
(Source: Mavlers Data Graph guide, The Spot for Pardot)

**What appears in the Data Sources tab:**
- The connected Data Graph with its hierarchical object tree (Unified Individual at root, with related objects like Contact Point Email, Loyalty Program Member, Sales Order, etc.)
- Org merge fields (Organization address, preference center links, etc.)
- As of Summer '26, additional data sources can include Salesforce objects, content variables, and offers (Source: SFMC Tips Summer '26 release highlights)

**Summer '26 enhancement:** Instead of relying solely on the Data Graph for personalization, you can now change the data source within the Data Source panel to select different sources. Once selected, its fields and attributes become available in merge fields, expressions, repeater components, and dynamic content. (Source: SFMC Tips Summer '26 article)

### Merge Fields

**How to insert a merge field:**
1. Click on a text-editable component (Heading, Paragraph, Button, etc.)
2. Click the **Merge Field icon** in the component toolbar
3. A picker appears with categories of available fields

**Merge field picker categories:**
The picker provides access to:
- **Data Graph attributes** — Fields from the connected Data Graph. Navigate through "Primary Objects" (direct attributes on Unified Individual like firstName, lastName) and "Related Objects" (fields on related DMOs in the graph, like Loyalty Program Member tier, Contact Point Email address).
- **Organization merge fields** — Compliance fields like `{!$organization.Address}` for the physical mailing address. Required for CAN-SPAM compliance in promotional emails.
- **Link merge fields** — System-generated links for unsubscribe and preference center.
- **Saved Expressions** — Reusable merge field configurations created in the CMS workspace. If your team has merge fields they want to use again and again, create and save a Reusable Expression for quick access.
(Source: The Spot for Pardot article, Mavlers Data Graph guide, Mavlers Content Creation guide)

**Default values:**
When inserting a Data Graph merge field, the system allows you to define a default text value. If the attribute value is missing for a recipient, the fallback text displays instead (e.g., "Customer" as fallback for firstName). (Source: Mavlers Data Graph guide)

**Merge fields in Subject Line and Preheader:**
Merge fields and Dynamic Content can be inserted into both the Subject Line and Preheader fields, not just the email body. (Source: The Spot for Pardot article)

**Merge field syntax:**
- Data Graph fields use Handlebars-style syntax
- Org merge fields use the `{!$organization.FieldName}` syntax (e.g., `{!$organization.Address}`)
- Saved expressions use `{!$Expression.ExpressionAPIName}` syntax
(Source: SFMC Tips #212, Mavlers Content Creation guide)

### Account Engagement Merge Field Artifacts

**CRITICAL WARNING — Incomplete research. Must verify in SDO.**

The module spec explicitly requires naming every AE/Pardot merge field that appears in the picker but breaks the email. Here is what research found:

**What is known:**
- Account Engagement (Pardot) merge fields use the `{{Recipient.FirstName}}`, `{{Recipient.LastName}}`, `{{Recipient.Email}}` syntax format.
- When AE assets are accessed from Marketing Cloud Next, "those Merge Fields are not compatible." (Source: The Agentic Marketer, Copy AE Assets article)
- The recommended replacement: use the **Data Graph** for recipient-level personalization instead of Recipient merge fields, and use the **Link** category for unsubscribe and preference center links.
- Merge Fields, Dynamic Content, and HML from Account Engagement "are not supported" when copying AE assets to Marketing Cloud Next. (Source: The Agentic Marketer)
- An error message has been documented: "Your message contains Handlebars merge fields ({{Recipient.FirstName}},{{Recipient.LastName}}, {{Recipient.Email}}). Replace them with variable tags." This error appears in the AE email builder when Handlebars format is used instead of variable tags. (Source: Survicate help, web search results)

**What is NOT conclusively confirmed from external sources:**
- The exact list of AE/Pardot fields that appear in the MC Next merge field picker in SDO environments
- The exact error message that appears at preview/publish time when these fields are used in MC Next emails
- Whether these fields appear as a separate category in the picker or are mixed in with other categories
- Whether this is specific to SDO environments that have Account Engagement provisioned alongside MC Next

<!-- VERIFY: This is the single most important SDO verification for this module. Open the email builder in the SDO, click the merge field picker, and document:
1. Every category/group visible in the picker
2. Any fields or categories that appear to be from Account Engagement/Pardot
3. What happens when you insert one of these fields and try to preview or publish
4. The exact error message text
Without this verification, the module cannot fulfil its spec requirement to "name the specific fields, not just warn vaguely." -->

### Preview and Test

**Preview workflow** (Source: The Spot for Pardot article, Mavlers Content Creation guide):
1. Toggle between Desktop and Mobile views in the View Mode to check responsive layout.
2. Customize Subject Line and Preheader text (editable both above the canvas and in the Property Panel on the right).
3. Click **Preview** from the top right corner.
4. Select a **published Segment** with at least one recipient. You cannot preview without a segment.
5. From the segment, choose one **Unified Individual** from up to 10 contacts to preview the email with that person's data.
6. Merge fields render with the selected individual's data in the preview.

**Test Send workflow** (Source: The Spot for Pardot article, SFMC Tips #107):
1. After completing the preview step (selecting a Unified Individual), navigate to the **Test** tab.
2. Enter the test email recipient address and the From Name and From Address.
3. The **From Address must match the authenticated DKIM domain** in Marketing Cloud.
4. Send the email to up to **5 email addresses** using the selected sample recipient's data.
5. Group email addresses can be included among the 5 addresses. If a group address has multiple recipients, the email is delivered to all members.

**Important note on test sends:** Test sends are recorded in both the "MessagingEventsEmail — EmailEngagement" DLO and the "Email Engagement" DMO data objects. (Source: Mavlers Content Creation guide)

### Email Settings

**Subject Line:**
- Editable both above the canvas and in the Property Panel on the right
- Supports merge fields for personalization (e.g., first name in subject)
- Supports Dynamic Content variations (conditional subject lines based on targeting rules)
- Einstein AI can generate subject line suggestions (if Einstein is configured)
(Source: The Spot for Pardot article, Mavlers)

**Preheader:**
- Editable in the same locations as the subject line
- Supports merge fields and Dynamic Content
- The preheader text appears as preview text in inbox listings
(Source: The Spot for Pardot article)

**Sender Info (From Name / From Address):**
- From Name and From Address are configured in the email settings
- From Address must match the authenticated DKIM domain
- Merge fields can be used for sender personalization
(Source: The Spot for Pardot article)

**CAN-SPAM Classification:**
- Set during email creation (before entering the builder): **Promotional** or **Transactional**
- Promotional emails require organization address and unsubscribe link for CAN-SPAM compliance
- The platform will NOT throw a validation error if an unsubscribe link is missing. Users bear full responsibility.
- The `{!$organization.Address}` merge field is required for the physical address. Sending is blocked if the organization address is not configured.
(Source: Mavlers Content Creation guide)

### HTML Paste Emails (Code Mode)

**Two editing modes:**
1. **Drag-and-drop** (default) — Visual builder with components
2. **HTML / Code mode** — Full HTML editor, accessible via a toggle at the top of the email editor

**Converting Drag-and-Drop to HTML:**
- Click "Convert to HTML" button
- **IRREVERSIBLE** — Cannot return to drag-and-drop components or Style tab formatting
- Removes dynamic content, including repeaters, conditional logic, and content variants
- Merge fields are preserved
(Source: The Agentic Marketer HTML vs Code Mode article, The Spot for Pardot FAQ)

**Importing External HTML:**
- Create a blank email in Marketing Cloud Next
- Convert to HTML mode
- Paste code from external builders
- Must manually add organization address and unsubscribe link using merge fields for promotional sends
(Source: The Agentic Marketer)

**When to use HTML paste:**
- Migrating emails from another ESP
- Developer-built templates with custom layouts
- Need for custom fonts (not available in drag-and-drop)
- Customizations not possible through standard components
(Source: The Agentic Marketer, The Spot for Pardot FAQ)

**Custom fonts:**
- Not available in drag-and-drop mode
- Available only in HTML/code mode
- Summer '26 release reportedly adds custom font support <!-- VERIFY: Confirm whether Summer '26 actually delivered custom fonts in drag-and-drop mode or only in HTML mode -->
(Source: The Spot for Pardot FAQ, SFMC Tips Summer '26)

### Repeater Component

**What it does:** Displays a series of items customized to each recipient. The component connects to a data source containing multiple records per individual, then renders those records using a single structured layout that repeats for each item. Use cases: recent purchases, upcoming events, product recommendations, loyalty rewards. (Source: The Spot for Pardot Repeaters article, Mavlers Repeaters guide)

**How it works:**
1. Drag the Repeater from the Layout section of the Components Panel onto the canvas
2. Configure the first item only. Additional items inherit the configuration but display data for each record.

**Configuration options:**
- **Repeater Source** — Select a data source from the Data Graph. The source determines which related records repeat for each recipient.
- **Layout** — Card layout option available
- **Items to show** — Total number of items to display (e.g., 2, 3, 5)
- **Items per row** — Number of items displayed horizontally per row (up to 6 columns)
- **Sorting** — Use the "Edit Expression" feature to sort by fields (e.g., engagement date) and control display order
- **Filtering** — Apply "Where" filters to narrow which records appear

**Supported elements inside a repeater:**
- Images (with dynamic merge fields from repeater source)
- Headings
- Paragraphs/descriptions
- Buttons (with dynamic URLs)
- HTML components (for custom constructs like dynamic image URLs)

**Critical merge field rule:** When adding merge fields inside a Repeater component, fields MUST be selected from the repeater data source, NOT from the general Data Graph. All merge fields within the repeater should come from the repeater's assigned source object. (Source: The Spot for Pardot Repeaters article, Mavlers Repeaters guide)

**Key limitations:**
- **Empty state:** If a recipient has no records in the repeater data source, the repeater appears empty. No built-in fallback content mechanism.
- **Data source changes:** Switching the repeater source after merge fields are configured breaks those fields. You must delete and recreate them.
- **Cannot be added to Content Blocks.** Repeater components are not supported inside Content Blocks. (Source: Mavlers Repeaters guide)
- **Email size:** Excessive items increase email size and load time. Keep practical count to a few dozen max.
- **Data Graph limits:** The Data Graph stores a bounded number of records per individual, typically recent ones only.
- **Dynamic Content not supported in Repeaters** — Personalization Points/dynamic variations cannot be applied to Repeater components. (Source: The Agentic Marketer Reusability article)

**Rendering fixes:**
- Outlook image sizing: 2-column layout needs image width of 284px, 3-column needs 186px
- Button alignment: Text length variations cause vertical button shifts between cards. Limit text length or place CTAs outside the repeater.
(Source: Mavlers Repeaters guide)

### Agentforce in the Email Builder

The "Draft with Agentforce" sparkle icon appears on text components. When a Brand is associated, Agentforce uses the Brand Identity and Tone specified in the Brand when generating content. Options include:
- Revise content by key message or target audience (from Campaign Brief)
- Change tone
- Increase/decrease content length
(Source: The Spot for Pardot article)

### Publishing and Sending

- After building, click **Save** then **Publish** to make the email available for campaigns/flows
- Emails require publishing before they can be used in flows
- Scheduling publish/unpublish is supported (useful for preventing accidental sends after campaigns end)
- Sending is done through **Flow** (Segment-Triggered Flow or other flow types), not from the email builder itself
(Source: The Spot for Pardot article, Mavlers)

### Dynamic Content (Personalization Points)

While not the primary focus of Module 12 (owned by Module 16), the builder supports:
- Up to 25 Personalization Points per email
- Up to 15 variations per component
- Supports Subject Line, Preheader, and most standard components (excluding Repeaters)
- When a component is selected, the Dynamic Content option appears in the Property Panel
- Variations are triggered by targeting rules based on recipient data attributes
(Source: The Agentic Marketer Reusability article, The Spot for Pardot)

### Keyboard Shortcuts

The email builder supports keyboard shortcuts. Official reference: https://help.salesforce.com/s/articleView?id=mktg.mktg_content_keyboard_shortcuts.htm&type=5
(Source: The Spot for Pardot FAQ)

---

## UI Navigation Paths

- **Access email builder**: MCA App > Content (top nav) > [Workspace] > Add > Content > Email > [Configure name, API name, CAN-SPAM, brand] > Edit in Builder (Source: Mavlers, Salesforce Ben)
- **Components Panel**: Left side panel in editor, three tabs: Basics, Layout, Media (Source: The Spot for Pardot)
- **Property Panel / Style Panel**: Right side panel, context-sensitive (Source: The Spot for Pardot)
- **View Mode toggle (Desktop/Mobile)**: Top bar of editor (Source: The Spot for Pardot)
- **HTML toggle**: View Mode section, top bar (Source: The Spot for Pardot)
- **Preview**: Top right corner > Preview button (Source: The Spot for Pardot)
- **Test Send**: Preview > Test tab (Source: The Spot for Pardot)
- **Subject Line / Preheader**: Above the canvas area OR in the Property Panel on the right (Source: The Spot for Pardot)
- **Brand selection**: Property Panel (when no component selected) > Brand section (Source: The Spot for Pardot)
- **Data Source**: Property Panel (when no component selected) > Data Sources section (Source: Mavlers, The Spot for Pardot)
- **Default Data Graph setup**: Marketing Cloud Setup > [Data Graph configuration] (Source: Mavlers Data Graph guide)
- **Merge Field insertion**: Select text component > Merge Field icon in toolbar (Source: The Spot for Pardot)
- **Repeater Source**: Select Repeater component > Property Panel > Repeater Source (Source: The Spot for Pardot Repeaters)
- **Convert to HTML**: View Mode area > Convert to HTML button (Source: The Agentic Marketer, The Spot for Pardot)

---

## Platform Gotchas

### From platform-gotchas.md

**SDOs do not have a default sending domain**
Confirmed: 2026-08-06, Release: Summer '26. Learners must configure domain authentication before they can send test emails. This affects the test send step in the hands-on assignment.

**Missing fields in Data Graph JSON are absent, not null**
Confirmed: 2026-08-06, Release: Summer '26. When a merge field references a Data Graph field that does not exist for an individual, it silently renders as empty. This is why default values on merge fields are important.

### From research

**CAN-SPAM: No validation error for missing unsubscribe link**
The platform will NOT throw a validation error if an unsubscribe link is missing from a promotional email. Users bear full responsibility. (Source: Mavlers Content Creation guide)

**Test sends are recorded as engagement data**
Test sends record in both the EmailEngagement DLO and Email Engagement DMO. This can pollute analytics if not accounted for. (Source: Mavlers Content Creation guide)

**Convert to HTML is irreversible**
Once an email is converted to HTML mode, it cannot be converted back to drag-and-drop. Dynamic content (repeaters, conditional logic, content variants) is removed. Only merge fields are preserved. (Source: The Agentic Marketer, The Spot for Pardot)

**Brand updates do not propagate to published content**
Updating the brand does not automatically update published emails. They must be unpublished and republished. Components with "custom" (overridden) styles are never affected by brand updates. (Source: Mavlers Brand article)

**Repeater merge fields must come from repeater source**
Fields inside a repeater must be selected from the repeater data source, not from the general Data Graph. Switching the repeater source after merge fields are configured breaks those fields. (Source: The Spot for Pardot Repeaters, Mavlers)

**Repeaters cannot be inside Content Blocks**
Repeater components are not supported inside Content Blocks. (Source: Mavlers Repeaters guide)

**Preview requires a published Segment**
You cannot preview an email without selecting a published segment with at least one recipient. If you need to preview as a specific individual, you may need to create a dedicated segment for that person. (Source: The Spot for Pardot, SFMC Tips #107)

**Organization address is required for sending**
The `{!$organization.Address}` merge field must be configured. Sending will be blocked if the organization address is not set up. (Source: Mavlers Content Creation guide)

### Account Engagement merge field artifacts (UNCONFIRMED — needs SDO verification)

AE/Pardot merge fields that use `{{Recipient.FirstName}}`, `{{Recipient.LastName}}`, `{{Recipient.Email}}` syntax are reportedly present in the merge field picker in some orgs but are incompatible with Marketing Cloud Next. They cause a generic error at preview and block publishing. The exact fields and error message must be verified in the SDO.

<!-- VERIFY: Open the email builder in the SDO. Document every category in the merge field picker. Identify any AE/Pardot fields. Test what happens when they are inserted and previewed. Record the exact error message. This is blocking for the module spec. -->

---

## MCE Comparison Points

### Content Builder vs. CMS Workspace
MCE used **Content Builder**, a separate app with its own folder structure for email creation. Marketing Cloud Next uses the **Salesforce CMS workspace** accessed via the Content tab. Content Builder is gone. (Source: CMS module already written)

### Email Editor
MCE's email editor was Content Builder's drag-and-drop editor or the HTML paste editor. Marketing Cloud Next's email builder is a new editor with a different component model (Components Panel with Basics/Layout/Media tabs), native Brand integration, and built-in Agentforce AI drafting. The builder is the same UI as the Lightning Email Builder used by Account Engagement, but with additional capabilities when used with Marketing Cloud Next (Dynamic Content, Repeaters, Cross-Object Personalization are not available in the AE-only version). (Source: The Agentic Marketer, Salesforce Ben)

### Personalization
MCE used **AMPscript** for email personalization. Marketing Cloud Next uses **Handlebars** as its native language, though AMPscript support was added in Summer '26. MCE used Data Extensions as data sources. Marketing Cloud Next uses the **Data Graph** (rooted on Unified Individual) and related DMOs. The merge field picker structure is different: MCE had personalization strings and AMPscript functions; Marketing Cloud Next has a visual picker with Data Graph navigation, Organization fields, Links, and Saved Expressions. (Source: multiple)

### Responsive Design
MCE's Content Builder had limited native responsive support. Responsive behavior often required custom HTML/CSS. Marketing Cloud Next's builder has native responsive controls: stack-on-mobile checkbox per section, desktop/mobile preview toggle, and device-specific visibility options. (Source: Salesforce Ben)

### Repeaters
MCE had no native equivalent to Repeaters. To display dynamic lists of items (e.g., order history, product recommendations), MCE required AMPscript `LookupRows()` functions and manual HTML table construction. Marketing Cloud Next's Repeater component is a no-code, visual solution for the same use case. (Source: Mavlers Repeaters guide)

### Dynamic Content
MCE had Dynamic Content blocks that could show/hide based on subscriber attributes. Marketing Cloud Next has **Personalization Points** with targeting rules and variations, up to 25 per email with 15 variations each. The concept is similar but the configuration UI is different.

### Test Sends
MCE test sends used Email Studio's preview and test functionality with subscriber keys. Marketing Cloud Next requires selecting a published Segment and Unified Individual for preview, then allows sending to up to 5 addresses. The workflow is different but the outcome is the same.

---

## External Resources

- [Everything to Know About the Marketing Cloud Next Email Builder](https://thespotforpardot.com/2025/09/19/everything-to-know-about-the-marketing-cloud-next-email-builder/) — The most comprehensive single article on the email builder. Covers interface layout, components, styling, personalization, testing, and FAQ. By Erin Duncan at Sercante/The Spot for Pardot.

- [Marketing Cloud Growth Email Builder: A Starter Guide for Account Engagement Users](https://www.salesforceben.com/marketing-cloud-growth-email-builder-a-starter-guide-for-account-engagement-users/) — Overview of the builder for users coming from Pardot/Account Engagement. Good MCE comparison context. Covers column stacking toggle and preview features.

- [Marketing Cloud Next Content Creation: Complete Guide](https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/) — Thorough walkthrough of creating email content. Covers all three component tabs, subject line personalization with Einstein and Dynamic Content variations, CAN-SPAM compliance details, and the preview/test send flow.

- [Getting Hands-On with Repeaters | Marketing Cloud Next](https://thespotforpardot.com/2025/12/19/getting-hand-on-with-repeaters/) — Real-world Repeater implementation for Fellowes Brands. Shows data structure, Data Graph setup, repeater configuration, merge field insertion, and image handling inside repeaters.

- [Master SFMC Next Repeaters: No-Code Dynamic Emails](https://www.mavlers.com/blog/salesforce-marketing-cloud-next-repeaters/) — Detailed Repeater configuration guide with layout options, merge field rules, limitations, and Outlook rendering fixes.

- [HTML Emails: Drag & Drop vs Code Mode in Marketing Cloud Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/html-emails-vs-code-mode/) — Explains the two editing modes, conversion process, what is lost when converting to HTML, and when each approach is appropriate.

- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) — Covers all five reusability tools (Expressions, Content Blocks, Dynamic Content/Personalization Points, Brands, Email Templates). Good context for how the builder's features interconnect.

- [Marketing Cloud Next: Dynamic Images in Email, 2 Ways That Work](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/email-dynamic-images/) — Two methods for dynamic per-recipient images: Image component with merge field and HTML component. Important requirement that URL fields must be text type.

- [Data Graph in Marketing Cloud Next: Setup & Personalization Guide](https://www.mavlers.com/blog/data-graph-in-salesforce-marketing-cloud-next/) — How the Data Graph feeds the email builder. Covers connecting the graph, navigating the merge field object tree, and setting a default Data Graph.

- [Copy Account Engagement Assets to Marketing Cloud Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/copy-pardot-assets-agentforce-marketing/) — Documents the incompatibility of AE merge fields in MC Next. Key source for the AE merge field artifact warning.

- [Cross-Object Merge Fields in Marketing Cloud: Top Use Cases](https://www.salesforceben.com/achieve-enhanced-personalization-in-marketing-cloud-growth-and-advanced-editions/) — Explains cross-object merge fields and the recommended Data Graph structure (Unified Individual > Unified Link Individual > Individual > Contact Point Email).

- [Email Personalization Strategies in Marketing Cloud (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/email-personalization-in-marketing-cloud-next/get-to-know-email-personalization-features) — Official Trailhead module covering merge fields, dynamic content variations, and repeaters as personalization features.

- [Brand Guidelines in Marketing Cloud Next: Step-by-Step Setup](https://www.mavlers.com/blog/brand-guidelines-marketing-cloud-next/) — Brand creation and administration. Confirms that brand updates do not propagate to published content.

- [Add a Repeater to a Marketing Email (Salesforce Help)](https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_content_personalization_repeater.htm&type=5) — Official Salesforce documentation for the Repeater component. (Page did not render content when fetched; link confirmed valid.)

- [Create an Email in Marketing Cloud Next (Salesforce Help)](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_email_create.htm&language=en_US&type=5) — Official Salesforce documentation for email creation. (Page did not render content when fetched; link confirmed valid.)

- [Manage Data Sources for Personalizing Content (Salesforce Help)](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_personalization_data_sources.htm&language=en_US&type=5) — Official documentation for data sources in the email builder. (Page did not render content when fetched; link confirmed valid.)

- [Set Up Personalization Features in Marketing Cloud Next (Salesforce Help)](https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_data_graph_setup.htm&type=5) — Official documentation for Data Graph setup for email personalization.

---

## Data Model Relevance

The email builder's Data Sources tab connects to the LEOptical Data Graph, which is rooted on the Unified Individual DMO. The following DMOs and fields are relevant for merge fields and repeater configuration in Module 12:

**Unified Individual (root):**
- firstName, lastName — used for basic greeting merge fields

**Contact Point Email (related):**
- Email Address — available in the merge field picker

**Loyalty Program Member (related, custom fields):**
- Loyalty Tier (custom) — Bronze / Silver / Gold / Platinum
- Points Balance (custom)
- Enrollment Date (standard)
- Membership Number (standard)

**Sales Order (related):**
- Order Date, Order Total, Order Status
- Used in Repeater configurations for order history

**Sales Order Product (related via Sales Order):**
- SKU, Quantity, Unit Price, Line Total
- Links to Product for product name/family

**Product:**
- Product Name, Product Family
- SKUs: VIS-ULX-001, VIS-CHS-001, SEC-DLF-001, SEC-SNS-001

For Module 12's hands-on assignment, learners will insert 2-3 simple merge fields. The spec suggests first name and loyalty tier. These come from:
- `firstName` on the Unified Individual (or Individual) primary object
- `Loyalty Tier` on the Loyalty Program Member related object

The Data Graph must include the Loyalty Program Member DMO with its custom fields for these merge fields to be available in the picker.

---

## Source Log

- https://thespotforpardot.com/2025/09/19/everything-to-know-about-the-marketing-cloud-next-email-builder/ — Primary source. Full article extracted via Playwright. Covers editor interface, components, styling, personalization, testing, and FAQ.
- https://www.salesforceben.com/marketing-cloud-growth-email-builder-a-starter-guide-for-account-engagement-users/ — Extracted via WebFetch. Covers editor overview, column stacking, merge fields, preview, and MCE comparison.
- https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/ — Extracted via WebFetch. Thorough guide to email content creation. All three component tabs, subject line personalization, CAN-SPAM compliance, preview/test.
- https://www.mavlers.com/blog/salesforce-marketing-cloud-next-repeaters/ — Extracted via WebFetch. Detailed Repeater guide with configuration steps, limitations, and rendering fixes.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/html-emails-vs-code-mode/ — Extracted via WebFetch. Drag-and-drop vs code mode, conversion process, limitations.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/ — Extracted via WebFetch. Expressions, Content Blocks, Dynamic Content, Brands, Templates.
- https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/email-dynamic-images/ — Extracted via WebFetch. Dynamic images via Image component merge field and HTML component methods.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/copy-pardot-assets-agentforce-marketing/ — Extracted via WebFetch. AE merge field incompatibility documented. Key source for AE artifact warning.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/translating-pardot-concepts/ — Extracted via WebFetch. Limited merge field detail. Confirms builder is same UI but with limitations in AE-only mode.
- https://www.mavlers.com/blog/data-graph-in-salesforce-marketing-cloud-next/ — Extracted via WebFetch. Data Graph connection to email builder, merge field object tree navigation, default graph setup.
- https://www.mavlers.com/blog/brand-guidelines-marketing-cloud-next/ — Extracted via WebFetch. Brand creation, default brand setup, propagation limitation.
- https://www.salesforceben.com/achieve-enhanced-personalization-in-marketing-cloud-growth-and-advanced-editions/ — Extracted via WebFetch. Cross-object merge fields, Data Graph structure recommendation.
- https://trailhead.salesforce.com/content/learn/modules/email-personalization-in-marketing-cloud-next/get-to-know-email-personalization-features — Extracted via WebFetch. Official Trailhead on merge fields, dynamic content, repeaters.
- https://thespotforpardot.com/2025/12/19/getting-hand-on-with-repeaters/ — Extracted via Playwright. Real-world Repeater case study with Fellowes Brands. Data structure, Data Graph, repeater config, image handling.
- https://medium.com/@marketingcloudtips/marketing-cloud-on-core-content-creation-and-components-bf9046db9978 — Fetch failed (403). SFMC Tips #95 on email contents and components. Referenced in multiple search results.
- https://medium.com/@marketingcloudtips/marketing-cloud-on-core-introducing-the-repeater-component-cc8017b01dc4 — Fetch failed (403). SFMC Tips #134 on Repeater component.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-summer-26-release-highlights-04f6c5abdee6 — Fetch failed (403). SFMC Tips #285 on Summer '26 release. Search snippets used for data source enhancements.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-merge-fields-expression-4056d537af72 — Not fetched. SFMC Tips #212 on merge field expressions. Confirms `{!$Expression.xxx}` syntax.
- https://medium.com/@marketingcloudtips/marketing-cloud-on-core-understanding-the-preview-and-test-send-feature-a91b0f6a1ecf — Not fetched. SFMC Tips #107 on preview and test send.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_content_email_create.htm&language=en_US&type=5 — Fetch failed (Salesforce Help JS rendering). Official email creation docs.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_quick_start_parent_email.htm&language=en_US&type=5 — Fetch failed (Salesforce Help JS rendering). Quick start guide.
- https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_content_personalization_repeater.htm&type=5 — Fetch failed (Salesforce Help JS rendering). Official Repeater docs.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_content_personalization_data_sources.htm&language=en_US&type=5 — Fetch failed (Salesforce Help JS rendering). Data sources for content personalization.
- https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_data_graph_setup.htm&type=5 — Fetch failed (Salesforce Help JS rendering). Personalization setup.
- https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/first-email/ — Extracted via WebFetch. Covers setup steps (data cloud activation, domain, data graph, segments) but NOT the email editor itself. Discarded for email builder content.
