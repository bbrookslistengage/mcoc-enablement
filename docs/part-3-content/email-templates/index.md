---
sidebar_position: 1
title: "Email Templates"
description: "Templates as reusable starting points that do not propagate, locked and editable regions, and locking strategies for different use cases."
---

## Overview

You have built emails from scratch using the drag-and-drop builder, and you have built reusable content blocks that propagate changes to every email that uses them.

A template is a pre-configured starting point for a new email. When a marketer creates an email from a template, the platform copies the template's layout and components into the new email. From that point, the email is independent. If you later edit the template and republish it, none of the emails already created from it are affected. This is the opposite of content blocks.

Templates give you consistency at creation time. Content blocks give you consistency across time.

The second major concept is locking. Templates let you control which regions of the email a marketer can edit. You can lock a header so it cannot be touched, unlock a body section so the marketer can add whatever content they need, or lock the entire email so that content is driven entirely by personalization logic. The locking model is counterintuitive in a specific way that this module calls out directly.

The hands-on work is in the next subpage, <ModuleLink slug="building-leoptical-templates" />, where you build three templates for LEOptical using each of the three locking strategies covered here.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- How templates work as reusable starting points for new emails.
- Why templates do NOT propagate changes to emails created from them (the opposite of content blocks).
- The Part 3 propagation arc: raw emails (<ModuleLink slug="email-builder" />) → content blocks propagate (<ModuleLink slug="content-blocks" />) → templates do not propagate (this module).
- Locked vs. editable regions: how to control what marketers can and cannot change in an email created from a template.
- Three locking strategies: fully editable body, locked layout with editable content slots, and fully locked.
- Planning template architecture for a multi-email program.

## Propagation behavior

The <ModuleLink slug="content-blocks" /> module introduced a propagation arc table. Templates complete it.

| Tool | Propagation behavior |
|------|---------------------|
| Raw email | No reuse mechanism. Each email is standalone. |
| Content blocks | Propagate. Edit the block, all linked emails update automatically. |
| Email templates | Do not propagate. A template is a starting point. The email is a copy. |

As the [Email Mavlers MCN vs. MCE comparison](https://emailmavlers.com/blog/marketing-cloud-next-vs-marketing-cloud-engagement-email-templates/) confirms: "The Email Template is a starting point, which means that if we change and publish it after it was used in an Email, the content changes won't be reflected in the new Email."

## How template creation works

Templates live in the Salesforce CMS workspace alongside other content assets. You create them using the **Email Template** content type.

:::warning
Email templates and emails are separate content types. You cannot save an email as an email template, or a template as an email. Select the correct content type before you start building.
:::

1. Navigate to the **LEOptical Marketing** workspace in the CMS.
2. Click **Add > Content**, select **Email Template** from the "Create CMS content" modal, and click **Create**.
3. In the "Select an email template creation method" picker, choose either **Use Components** (drag-and-drop builder) or **Select a Template** (start from the gallery), then click **Select**.

<ScreenshotPlaceholder alt="The creation method picker for a new Email Template, showing Use Components and Select a Template options. The Use Components option should be highlighted." size="wide" />

### The template gallery

When you choose **Select a Template** during template creation, you see two tabs:

- **Standard Templates**: Salesforce-provided pre-built layouts. As of Spring '26, there are 17 standard templates covering a range of email types. These are starting points, not final designs. LEOptical should use them as layout inspiration, not as the actual templates your team deploys.
- **Custom Templates**: templates you or your team have created and published. LEOptical's three templates will appear here once you build and publish them.

The **Custom Templates** tab shows the workspace folder structure as a folder browser. You navigate folders to find templates. There is no automatic folder restriction based on where the email being created lives.

{/* Confirmed (2026-09-29, Summer '26 SDO): No folder restriction on Custom Templates visibility. The full workspace folder tree is visible regardless of where the email is being created. */}

### Publishing requirement

A template must be **Published** before it appears in the template picker when creating a new email. Draft templates are completely hidden from the picker. They do not appear grayed out or in any other form. You must explicitly publish a template before marketers can select it.

### A note on HTML templates

The drag-and-drop builder is the primary template creation method this course covers. Unlike regular emails, templates cannot be created from custom HTML. The email creation method picker includes a **Create with HTML** option. The template creation method picker does not. If LEOptical has legacy HTML email designs from another ESP, those cannot be used as templates. They would need to be rebuilt using the drag-and-drop builder.

## The template editor

The template editor uses the same drag-and-drop interface as the email builder. All the components you know from the <ModuleLink slug="email-builder" /> module are available: Basics tab (Heading, Paragraph, List, Button, Divider, HTML), Layout tab (Section, Repeater, Content Block), and Media tab (Image).

One panel is different. The template editor adds a **Settings tab** in the Property Panel that controls locking behavior. This is the template-specific UI that does not exist in the regular email editor. You access it by selecting a component or clicking an empty area of the canvas.

<ScreenshotPlaceholder alt="The template editor showing the Property Panel with the Settings tab visible. The canvas should show an empty template layout. Highlight the Settings tab to show it is distinct from what appears in the regular email editor." />

## Locking behavior

### Everything starts locked

When you create a new template, **all components are locked by default**. A user creating an email from the template cannot edit any component until you explicitly unlock it. You start locked and unlock the things you want to be editable.

The practical locking workflow is:
1. Build the template with all components in place (header, body sections, footer, etc.).
2. Leave the template-wide **"Allow users to modify settings, styles, data sources, and layouts..."** toggle in the Settings tab **OFF** (the default).
3. Select each section or component you want to be editable.
4. For each one, toggle the **"Allow users to modify this [section/column/component]"** control ON.

You are not locking the header. The header is already locked by default. You are unlocking the body.

:::warning
If you start a template and wonder why marketers cannot edit anything in emails created from it, check whether you ever unlocked any components. The default state is fully locked. Forgetting to unlock the editable regions is the single most common template configuration mistake.
:::

### Two levels of locking control

**Level 1 — Template-wide toggle**

Select an empty area of the canvas (no component selected). In the **Settings tab** of the Property Panel, you will find a toggle labeled **"Allow users to modify settings, styles, data sources, and layouts in emails that use this template."**

- **Toggle OFF** (the default): All components are locked. Only components you individually unlock (Level 2) can be edited by users.
- **Toggle ON**: All components are unlocked. Users can change any setting, style, or layout in emails created from the template.

The toggle-ON state is the "fully editable" template. This makes sense for templates that are purely starting points and where you want marketers to have complete freedom.

<ScreenshotPlaceholder alt="The Settings tab in the Property Panel with no component selected, showing the template-wide 'Allow users to modify' toggle in the OFF position." size="wide" />

**Level 2 — Per-component unlock**

With the template-wide toggle OFF, select an individual component, column, or section on the canvas. In the **Settings tab**, a toggle appears for that specific element. The toggle label reflects what you selected:

- **Section selected:** "Allow users to modify this section."
- **Column selected:** "Allow users to modify this column."
- **Content component selected (Heading, Paragraph, Image, etc.):** "Allow users to modify this heading." / "Allow users to modify this paragraph." / etc. The label follows the pattern "Allow users to modify this [component type]." for every component type.

Toggle the control ON to unlock that element.

{/* Confirmed (2026-09-29, Summer '26 SDO): Unlocking a Section does NOT cascade to child components. Each component must be unlocked individually. The section's unlock toggle controls the section's structural layout (column count, spacing), not its children. Child components (Image, Heading, Paragraph, Button) can be unlocked independently without unlocking their parent Section. This is the mechanism that makes Strategy 2 (locked layout with editable content slots) work. */}

<ScreenshotPlaceholder alt="A Section component selected in the template editor, with the Settings tab in the Property Panel showing the 'Allow users to modify this component' toggle in the ON position." size="narrow" />

### Nested component inheritance

The lock state of a Section is independent from the lock state of the components inside it. Unlocking a Section does not cascade to its child components. Each component must be unlocked individually.

The Section's unlock toggle controls whether the section's structural layout (column count, column widths, spacing) can be modified in an email created from the template. The individual component toggles (Image, Heading, Paragraph, Button) control whether those specific components can be edited. These are separate controls.

This means you can lock a Section's structure (preventing marketers from changing the column layout) while unlocking specific child components (allowing marketers to swap the hero image or update the heading copy). This is the mechanism behind Strategy 2.

:::warning
Do not unlock a Section if you only want to allow edits to components inside it. Unlock the Section only if you want marketers to change the layout structure itself (column count, spacing, arrangement). To allow content edits within a locked layout, unlock the individual child components instead.
:::

### Locking the subject line and preheader

Locking is not limited to body components. When no body component is selected, the right panel displays a **Subject Line and Preheader** section. Each field has a padlock icon at the right end of its text input. Click the icon to toggle the lock state for that field.

- Lock the subject line if the template is fully automated and the subject is set by personalization logic.
- Unlock the subject line if the marketer needs to enter a subject when creating each email.
- The same control applies to the preheader.

For a Monthly Newsletter template, you want the subject line unlocked (every send has a different subject). For a Loyalty Tier Notification template that is fully controlled by automation, you want the subject line locked.

## The three locking strategies

These three strategies cover the range of what you can do with template locking.

### Strategy 1: Fully editable body (locked header/footer)

**What it is:** The header and footer are locked. The body is unlocked. Marketers can add whatever content they want between the header and footer.

**How to configure it:**
- Keep the template-wide toggle OFF.
- Leave the header and footer content blocks in their default locked state (they are already locked by default, so no action needed).
- Select each body section and toggle "Allow users to modify this section." ON.
- Unlock the subject line and preheader.

**When to use it:** Newsletters, event announcements, or any email where the content changes substantially every send but the brand frame (header and footer) must stay consistent.

**LEOptical use case:** The Monthly Newsletter template. The marketing team creates a new newsletter email each month and fills in their own content sections between the locked LEOptical header and footer.

### Strategy 2: Locked layout with editable content slots

**What it is:** The header, footer, and layout structure are locked. Specific content within the layout (a hero image, a heading, a CTA button label) is unlocked. Marketers can swap the content within the defined structure but cannot change the structure itself.

**How to configure it:**
- Keep the template-wide toggle OFF.
- Leave the layout structure (sections, column configuration) locked (default).
- Select the specific components you want to be editable (Image, Heading, Paragraph, Button) and toggle each one's **"Allow users to modify this..."** control ON individually.

**When to use it:** Campaign types where the layout must stay consistent for brand reasons, but the content varies per campaign. Product launches, seasonal promotions, announcement emails.

**LEOptical use case:** The Product Spotlight template. The layout (hero slot, two-column feature section, CTA) is fixed. Marketers can swap the hero image, update the product heading, change the paragraph copy, and update the button label, but they cannot add sections, change column structure, or modify the header or footer.

### Strategy 3: Fully locked

**What it is:** No editable regions. The template-wide toggle stays OFF and no individual components are unlocked. Content in emails created from this template is driven entirely by personalization logic (Handlebars merge fields and dynamic content).

**How to configure it:**
- Keep the template-wide toggle OFF.
- Do not unlock any components.
- Lock the subject line and preheader.

**When to use it:** Automated triggered emails where the content is entirely data-driven. No human edits the email before it sends.

One clarification about how this works in practice: flows reference **emails**, not templates. You build a fully locked template, create an email from it, then add that email to a Flow. The template's value is governance at creation time. When someone creates the email from the template, the locked state prevents any manual edits before it enters the flow. The email that enters the flow is exactly the approved layout, with Handlebars merge fields populated per recipient at send time.

**LEOptical use case:** The Loyalty Tier Notification. This email goes out via Flow when a customer's VisionCare Rewards tier changes. All content (subject line, body copy, tier name, point balance) is populated by Handlebars merge fields from the Data Graph. No marketer edits this email before it sends. You will add those merge fields in Part 4. For now, the template establishes the layout that personalization will fill.

## Content blocks inside templates

You can embed content blocks inside templates using the **Content Block** component in the Layout tab. This is how you add the LEOptical header and footer blocks to all three templates.

Here is where the two behaviors interact in an important way. The template itself does not propagate to emails created from it. But content blocks inside a template retain their own propagation behavior.

When an email is created from a template that contains a content block, the email holds a live reference to that content block, not to the template. If the content block is later edited and republished, the change propagates to the email just as it would for any other email that references the block.

{/* Confirmed (2026-09-29, Summer '26 SDO): When an email is created from a template containing a content block, the email holds a live reference to the content block. The Content Block component in the email editor displays the block's current rendered output and is marked as a live reference, not a copy. The template's non-propagation applies only to the template's own components (sections, layout, text, images added directly to the template canvas). */}

The practical result: LEOptical's header and footer content blocks, embedded in each template, will continue to propagate updates to all emails created from those templates. If the brand logo changes, updating the header content block propagates to every email from every template that includes it, even though the templates themselves do not propagate.

:::warning
Content blocks inside a template retain their propagation behavior. The template's non-propagation applies only to the template's own components (sections, layout, text, images added directly to the template). Embedded content blocks still propagate changes to all emails that reference them.
:::

## Planning template architecture

Before building templates for a client, answer these questions.

**What locking strategy does each email type need?**

Map each email type the client sends to one of the three strategies. A newsletter needs an editable body. A product campaign needs a locked layout with editable slots. A triggered notification needs full locking. LEOptical has four communication subscriptions (Promotional Offers, VisionCare Rewards Updates, Eye Health Reminders, Order Updates) and each likely needs a different template.

**What goes in a content block vs. directly in the template?**

Elements that must stay globally consistent (the header, the footer, legal text) belong in content blocks embedded in the template. Elements that are specific to the template's layout (a hero slot, a two-column product layout) belong directly in the template.

**What do marketers need to be able to change?**

Talk to the people who will use the templates. A template that locks too much frustrates marketers and causes them to ignore the template system entirely. A template that locks too little provides no structural consistency. The right balance depends on the client's team and workflow.

**How many templates do you need?**

Start with the fewest templates that cover the required email types. You can always create more. Proliferating templates that are slightly different from each other creates maintenance burden. If two email types use the same layout with different content, they may share a template. If the layouts differ substantially, they need separate templates.

## Template organization and governance

Templates live in the CMS workspace and can be organized into folders. They can be exported from the workspace as JSON files containing content properties, metadata, and media files, which is useful for migrating templates between orgs.

An approval workflow can be configured for templates before they are published, managed through workspace settings. For LEOptical, this means a Marketing Cloud Admin reviews and approves new templates before they become available to the marketing team.

Two separate controls decide who can work with templates. The first is the user's permission set. The second is their CMS workspace contributor role. A user needs both.

| Task | Permission set | CMS workspace role |
|------|----------------|--------------------|
| Create or edit a template | Marketing Cloud Manager | Any contributor role (Content Author or higher) |
| Publish or unpublish a template | Marketing Cloud Manager | Content Manager or Content Admin |

Creating an email from a template is also a content creation task, so it has the same requirements as creating the template. Salesforce does not document a separate permission for using a template versus building one. The difference is the contributor role. A Content Author can build and edit templates but cannot publish them, which matters because draft templates are hidden from the picker. For the permission set and role setup, see <ModuleLink slug="permission-sets" /> and <ModuleLink slug="cms-workspaces" />.

{/* VERIFY: Requirements sourced from Salesforce Help search summaries (User Permissions in Marketing Cloud Next, Organize and Share Content in a Marketing Workspace). The Help pages did not load in full. Confirm the Manager plus contributor role pairing, and that no separate template-use permission exists, in a live SDO with a restricted test user. */}

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What happens when you edit and republish a template after emails have already been created from it?
- What is the default lock state of all components in a new template, and why does this trip up practitioners coming from MCE?
- LEOptical's marketing team creates 10 newsletter emails from the Monthly Newsletter template. Then you update the template's hero layout. Which of those 10 emails reflects the change?
- A content block is embedded in a template. An email is created from that template. You later edit the content block. What happens to the email?
- What is the difference between the template-wide "Allow users to modify" toggle and the per-component unlock? When would you use each?
- You need to build a fully locked template for an automated loyalty notification. What two additional settings (beyond body components) should you also lock, and where do you find them?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Create an Email Template in Marketing Cloud](https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_content_create_email_template.htm&type=5) - Official Salesforce Help. The authoritative reference for template creation, the Settings tab, and locking controls.
- [What's New with Agentforce Marketing Email Templates](https://thespotforpardot.com/2026/04/13/whats-new-with-agentforce-marketing-email-templates/) - The Spot (Sercante). April 2026 article on template updates including the counterintuitive lock workflow and the "unlock sections one at a time" model.
- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) - The Agentic Marketer. Covers all five MCA reusability tools including email templates, non-propagation behavior, and content blocks vs. templates.
- [Marketing Cloud Next vs Marketing Cloud Engagement for Email Templates](https://emailmavlers.com/blog/marketing-cloud-next-vs-marketing-cloud-engagement-email-templates/) - Email Mavlers. Side-by-side comparison of template behavior in MCE and MCA, including the non-propagation confirmation and migration implications.
