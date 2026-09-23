---
sidebar_position: 1
title: "Content Blocks"
description: "Reusable content blocks, propagation behavior, converting to sections, and deciding what deserves to be a block."
---

## Overview

In the <ModuleLink slug="building-leoptical-content-library" /> module, you built the LEOptical CMS workspace, uploaded brand assets, and configured the Brand object. In the <ModuleLink slug="email-builder" /> module, you learned the email builder's components and built your first email. Now you need a way to reuse pieces of that work across multiple emails without rebuilding them every time.

Content blocks are MCA's answer to that problem. A content block is a section-level component (header, footer, product card, hero layout) that you build once in the CMS workspace and then drop into any email. The defining behavior is propagation: when you edit a content block and republish it, every email that references it updates automatically. Change the footer legal text in one place, and every email picks up the change on its next send.

That propagation behavior is the central concept of this module, and it has real consequences for how you plan your content architecture. A carelessly edited footer block can change 50 emails at once, including ones you forgot about. This module teaches you how to use that power deliberately.

This module covers the concepts. The next subpage, <ModuleLink slug="building-leoptical-content-blocks" />, is where you build the blocks hands-on.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What content blocks are and how they differ from regular email sections.
- Propagation behavior: how edits to a content block update every email that uses it.
- When propagation helps (brand consistency, legal footer updates) and when it creates risk (accidentally changing all emails).
- Converting a content block to a section: what it does to propagation and why you would do it.
- Placement rules in the email builder.
- Content block limitations (no nesting, no repeaters).
- How content blocks relate to templates in the Part 3 propagation arc.
- Strategies for deciding what should be a content block vs. a one-off section.

## What content blocks are

A content block is a reusable component stored in the Salesforce CMS workspace. You combine text, images, links, and buttons into a content block, then save and publish it. From that point, any content author in the workspace can add the block to their emails.

Structurally, a content block is equivalent to a Section. It uses the same drag-and-drop builder components you already know from the <ModuleLink slug="email-builder" /> module: Heading, Paragraph, Image, Button, Section, Divider, HTML, and List. The difference is scope. A regular section lives inside a single email. A content block lives in the CMS workspace and can be referenced by many emails.

There are two content block types, selected at creation time:

- **Content Block: Email** for use in emails
- **Content Block: Landing Page** for use in landing pages

These are separate content types. An email content block cannot be dropped into a landing page, and a landing page content block cannot be dropped into an email. This module focuses on the email type. The builder interface is the same for both.

### Creating a content block

The creation path: **MCA App > Content tab > [select workspace] > Add > Content Block: Email**.

The content block editor opens with the same drag-and-drop canvas as the email builder. You add components, configure them, save, and publish. Use the pencil icon at the top to name the block. The name is how it appears in the content block picker when you add it to an email later, so make it descriptive.

Content blocks follow the same Draft/Published lifecycle as other CMS assets. You can save a content block in Draft and still use it in emails (more on that below).

### Content blocks in the email builder

When you want to add a content block to an email, you find it in the **Layout** tab of the Components Panel, alongside Section and Repeater. Drag the **Content Block** component onto the canvas, then select which block from the workspace to display.

There is a critical placement rule: a content block is structurally a Section, and sections cannot be nested inside other sections. You must drag a content block above, below, or between existing sections on the canvas. You cannot drop it inside an existing section.

<Screenshot src="/img/email-builder/04-components-layout-tab.png" alt="The Components Panel showing the Layout section with Content Block, Repeater, and Section" size="narrow" />

:::warning
If you try to drop a content block inside an existing section, the builder will not accept it. This confuses people who expect content blocks to behave like components (Image, Button, etc.) that go inside sections. Content blocks replace sections. They do not go inside them.
:::

## Propagation behavior

When you edit a content block and republish it, the change propagates to every email that references that block. You update the block in one place, and all linked emails reflect the change. This applies to the email canvas, preview, and at send time.

Think about what this means for LEOptical. You build a header block with the LEOptical logo and navigation links. You drop that header into 15 different emails over the next few months. Then the company updates its logo. You edit the header content block once, republish it, and all 15 emails show the new logo on their next send. One edit, 15 updates.

Propagation helps in predictable ways: brand consistency (shared headers and footers look the same everywhere), legal updates (change the disclaimer once instead of hunting through every email), and address changes (update the physical address in one place).

The risk is just as real. If you edit a content block carelessly, you change every email that uses it, including emails you forgot about. Consider a marketer who edits the footer block to add a holiday promotion message, not realizing the footer is also in transactional order confirmation emails. Now every order confirmation includes a promotional message, which may violate compliance rules.

The fix is planning. Decide up front what belongs in a shared content block and what should be email-specific. If a piece of content might need to vary between emails, it probably should not be a content block.

### Sent emails and Flow caching

Once an email is sent, it is rendered and delivered. Content block updates do not alter already-sent emails. They only affect the next send.

:::warning
If a content block is used in an email that is part of an active Flow, the Flow may cache the email content. Even if you update and republish the content block, the Flow may continue using the cached version until you republish the email itself. Keep this in mind when updating blocks used in active automations.
:::

:::tip[Coming from MCE?]
MCE Content Builder also supported content block propagation. When inserting a block, you could choose "Keep content blocks up-to-date" (live reference) or "Make local copies" (one-time copy). MCA works like the "keep up-to-date" option by default, with no copy-at-insertion mode. If you need a local copy in MCA, you insert the block and then convert it to a section.

Other differences:
- MCE content blocks lived in Content Builder's folder structure. MCA content blocks live in CMS workspaces with contributor role access control.
- MCE allowed "layouts" (groups of content blocks). MCA does not allow nesting content blocks inside other content blocks.
- MCA's "convert to section" is the explicit way to break the propagation link for a single email, which MCE handled at insertion time with the copy/reference choice.
:::

### Draft content blocks in emails

You can add a Draft content block to an email. The draft block displays on the canvas and in preview. When you publish the email, any Draft content blocks it references are published simultaneously.

:::warning
This auto-publish behavior can surprise content admins who expected the block to stay in Draft. If you have a content block that is not ready for production but someone adds it to an email and publishes that email, the block is now Published too. Name draft blocks clearly (e.g., prefix with "DRAFT -") if you want to avoid accidental publication.
:::

## Converting a content block to a section

When you drag a content block into an email, it is not editable on the canvas. You can see it, but you cannot change its text, images, or layout inline. The block is a live reference to the CMS asset. To edit the block itself, you open it from the CMS workspace, and those edits propagate to every email that uses it.

But sometimes you want to use a content block as a starting point and then customize it for a specific email. That is what "convert to section" does. It copies the block's components locally into the email as a regular section (or multiple sections, if the block contained multiple sections). After conversion, the section is fully editable inline on the canvas. The original content block in the workspace is unchanged, but the live link is broken. Future edits to the original content block do not propagate to this email.

This conversion is one-way. You cannot re-link a section back to a content block after converting.

{/* VERIFY: Confirm exact UI action to convert a content block to a section. Is it a right-click menu, a toolbar button, or a Property Panel option? The research sources mention "convert to a section" but do not specify the exact UI control. */}

<ScreenshotPlaceholder size="wide">The convert-to-section button or menu option on a content block in the email builder canvas. Show both states: the content block before conversion (not editable) and the section after conversion (editable).</ScreenshotPlaceholder>

### When to convert

- You need a one-off variation of a standard layout for a specific campaign.
- You want to start from a known design but need full editing control.
- You want to break free from propagation for a particular send.

### When not to convert

- If you find yourself converting the same block in every email, the block itself might need to be redesigned, or it should not have been a content block in the first place.
- If you convert a header or footer block, that email no longer receives future brand updates. Only convert structural blocks that are meant to vary per email.

## Content block limitations

There are several constraints to know before you start building.

1. **No nesting.** You cannot place one content block inside another content block. Each block must be built from basic builder components only.
2. **No repeaters.** Repeaters are not supported inside content blocks. If you need a dynamic repeating layout, build it directly in the email.
3. **Not editable on the email canvas.** When a content block sits in an email, it is read-only. You can see it but you cannot change it. To make global edits, open the block from the CMS workspace and republish. To make local edits for a single email, convert the block to a section first (see above).
4. **Section-level placement only.** Content blocks must be dragged between, above, or below existing sections. They cannot go inside an existing section.

{/* VERIFY: Confirm whether variation rules (personalization) work inside content blocks. One source says "you can't use dynamic content when creating or editing a reusable content block" while another says variation rules are supported. This may differ between MCE and MCA. Test in SDO before making a definitive claim. */}

## The Part 3 propagation arc

Content blocks are the middle piece of a three-part story about content reuse in MCA. Understanding where content blocks fit in this arc will help you make better architecture decisions.

| Concept | Module | Propagation Behavior |
|---------|--------|---------------------|
| Raw email | <ModuleLink slug="email-builder" /> | No reuse mechanism. Each email is standalone. |
| Content blocks | This module | **Propagate.** Edit the block, all linked emails update. |
| Templates | <ModuleLink slug="email-templates" /> | **Do not propagate.** A template is a starting point. Creating an email from a template makes a copy. Editing the template later does not update emails already created from it. |

This distinction matters. Content blocks give you live consistency. Templates give you a repeatable starting point. They solve different problems.

If you are building a header that should look identical across every email and update globally when the brand changes, that is a content block. If you are building a newsletter layout that marketers should use as a starting point but customize per send, that is a template. The <ModuleLink slug="email-templates" /> module covers templates in detail.

## Deciding what should be a content block

Not everything deserves to be a content block. Here is a practical framework.

**Good candidates for content blocks:**

- **Headers and footers.** These should be identical across all emails of a given type. Global updates (logo change, address change, legal text update) should propagate everywhere.
- **Legal disclaimers.** Compliance text that must be consistent and up-to-date across every send.
- **Product cards.** If you feature the same product in multiple campaigns, a reusable product card block saves time and keeps the presentation consistent.

**Poor candidates for content blocks:**

- **Hero sections with campaign-specific copy.** If the headline and image change every campaign, propagation is a liability, not a benefit. Build these as sections directly in the email.
- **Content that varies by email type.** A promotional footer with an unsubscribe link is different from a transactional footer with a legal note. These might be two separate content blocks, not one block you convert every time.
- **One-off layouts.** If you will only use a layout once, there is no reuse benefit. Build it directly.

### Content blocks vs. Expressions

MCA has another reusability tool called Expressions. These are text-level reusable content: a phrase, a sentence, a paragraph that can be inserted into any text component. Content blocks are section-level: structural layouts with multiple components.

Think of Expressions as reusable copy and content blocks as reusable design. They serve different purposes and can be used together. You might have a content block for your product card layout that includes an Expression for a standard legal disclaimer line within its paragraph text.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What happens to emails that reference a content block when you edit and republish that block?
- What is the difference between a content block and a regular section in the email builder?
- You convert a content block to a section in one email. What happens when you later edit the original content block?
- Why can you not drop a content block inside an existing section in the email builder?
- A colleague adds a Draft content block to an email and publishes the email. What happens to the content block's status?
- What is the difference between how content blocks and templates handle propagation? When would you use each?
- LEOptical's legal team changes the footer disclaimer text. How many places do you need to update if the footer is a content block used in 20 emails?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Create and Manage a Reusable Content Block](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_reusable_content_blocks.htm&language=en_US&type=5) - Official Salesforce Help article on content block creation, conversion to sections, and management.
- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) - Covers all five MCA reusability tools: Expressions, Content Blocks, Personalization Points, Brands, and Email Templates. Good overview of when to use each.
- [SFMC Tips #180: Introduction of Reusable Content Blocks](https://medium.com/@marketingcloudtips/marketing-cloud-next-introduction-of-reusable-content-blocks-2b50a771fd8c) - Detailed walkthrough of content block creation and propagation behavior, including draft behavior nuances.
- [SFMC Tips #95: Email Contents and Components](https://medium.com/@marketingcloudtips/marketing-cloud-on-core-content-creation-and-components-bf9046db9978) - Covers the Content Block component in the Layout tab and its placement rules.
