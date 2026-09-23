# Research: Content Blocks

Generated: 2026-09-04
Module: content-blocks
Sources: 18 sources consulted

## Module Context

### Client Ask

> **The client wants:** Reusable brand components (header, footer, product card) that stay consistent across every email, plus structural building blocks the team can use as starting points for common email layouts.

### Full Assignment (Module 13 -- Content Blocks, multi-subpage)

Each subpage below is a separate file. The concept page (`index.md`) teaches content block concepts. The hands-on page (`building-leoptical-content-blocks.md`) has two parts: a guided walkthrough and an independent assignment.

**Subpage 1 -- Content Blocks (concept page, `index.md`):**

- What content blocks are and how they differ from regular email sections.
- **Propagation behavior** -- when you edit a content block, the change propagates to every email that uses it. This is the key concept. Explain it clearly with examples.
- **Converting a content block to a section** -- this breaks propagation. The section retains the layout and content but is now independent. Future edits to the original content block do not affect it.
- When propagation helps (brand consistency, legal footer updates) and when it creates risk (accidentally changing all emails).
- Strategies for deciding what should be a content block vs. a one-off section.
- How content blocks relate to templates and the broader content workflow (content blocks propagate, templates do not -- covered in the next module).

**Subpage 2 -- Building LEOptical Content Blocks (hands-on page, `building-leoptical-content-blocks.md`):**

Two-part hands-on page.

**Part 1 -- Guided walkthrough: Brand component blocks**

Build 3 brand component content blocks step-by-step alongside the lesson, with full instructions and screenshots:

1. **Header block** -- LEOptical logo (from CMS workspace) and navigation links. Uses the LEOptical Brand colors and typography.
2. **Footer block** -- legal disclaimer text, unsubscribe link, company address. Uses muted colors from the Brand.
3. **Product Card block** -- product image, product name, short description, and CTA button. Designed to be reused for any LEOptical product by swapping the content.

Place each completed block in the appropriate subfolder under **Email Content Blocks** in the CMS workspace (Headers, Footers, Product Blocks folders created in the CMS module).

**Part 2 -- Independent assignment: Structural layout blocks**

Build 3 structural content blocks independently. These represent common email design patterns. Guardrails are provided (block type, purpose, layout description, which builder elements to use) but NOT step-by-step instructions. The learner designs the visual details using the LEOptical Brand.

These blocks are the ones the learner will later convert to sections to experience propagation breaking.

1. **Hero block** -- a full-width section with a large image, a headline (Heading Style 1), and a single CTA button. Used at the top of promotional emails to grab attention and communicate the core offer. Builder elements: Image, Heading, Button, Section.
2. **Feature block** -- a side-by-side layout with an image on one side and text (heading + paragraph + optional button) on the other. Used to highlight a product feature, a service benefit, or a content teaser. Builder elements: Section (2-column), Image, Heading, Paragraph, Button.
3. **CTA banner block** -- a full-width section with a colored background, a short line of text, and a prominent button. Used as a repeating call-to-action at the bottom of longer emails. Builder elements: Section (with background color), Paragraph, Button.

After building the 3 structural blocks:
- Edit one of the brand component blocks (e.g., change the footer legal text) and confirm the change appears in any email that uses it.
- Convert one of the structural blocks to a section in an email and verify that future edits to the original block no longer affect that section.

### Success Criteria

- [ ] 3 brand component content blocks exist (header, footer, product card), all Published.
- [ ] Brand component blocks are organized in the correct Email Content Blocks subfolders.
- [ ] 3 structural content blocks exist (hero, feature, CTA banner), all Published.
- [ ] A test email uses at least 2 content blocks.
- [ ] Editing a content block propagates the change to the test email.
- [ ] Converting a block to a section stops propagation -- editing the original block does not affect the converted section.

---

## Platform Concepts

### What Content Blocks Are

Content blocks are reusable email (or landing page) components stored in the Salesforce CMS workspace. Content admins and content managers combine text, images, links, and buttons into a content block, then save and publish it. Content authors can then add the block to any email or landing page.

A content block is structurally equivalent to a Section. It uses the same drag-and-drop builder components (Heading, Paragraph, Image, Button, Section, Divider, HTML, List) as the email builder. The difference is that a content block is saved as a standalone CMS asset that can be referenced across multiple emails.

**Content block types:**
- **Content Block: Email** -- for use in emails
- **Content Block: Landing Page** -- for use in landing pages

These are separate CMS content types selected at creation time.

Source: help.salesforce.com (mktg_content_reusable_content_blocks), the-agentic-marketer.com reusability article, mavlers.com content creation guide

### Creating a Content Block

**Creation path:** MCA App > Content tab > select workspace > Add > Content Block: Email

The content block editor uses the same drag-and-drop interface as the email builder. You add components to the canvas, configure them, and then save and publish.

**Naming:** Use the pencil icon to name the content block after creation. The name is how it appears in the content block picker when adding blocks to emails.

**Publishing:** Content blocks follow the same Draft/Published lifecycle as other CMS assets. A content block can be saved in Draft and still be usable (see Draft behavior below).

Source: mavlers.com content creation guide, SFMC Tips #180 (medium.com/@marketingcloudtips)

### Propagation Behavior (The Key Concept)

This is the defining feature of content blocks and the central teaching point of this module.

**How it works:** When you edit a content block and save/republish it, the change automatically propagates to every email (and landing page) that references that block. You update the block in one place, and all linked content reflects the change.

**When propagation happens:** Publishing a content block automatically updates all linked emails. The update appears in the email canvas, preview, and at send time.

**Draft behavior nuance:** Regardless of publication status, the saved latest version is reflected across the canvas, preview screen, and CMS details page. This means even unsaved draft changes to a content block may appear in preview before formal publication. <!-- VERIFY: Confirm whether "saved latest version" means the Draft version appears in preview of linked emails, or only after publishing. The SFMC Tips source says "regardless of publication status" which suggests Draft versions show in preview. -->

**Sent emails are not retroactively changed.** Once an email is sent, it is rendered and delivered. Content block updates do not alter already-sent emails. They affect the next send.

**Flow/Journey caching:** If a content block is used in an email that is part of an active Flow, the Flow may cache the email content. To ensure the Flow uses the latest version, you may need to republish the email itself. <!-- VERIFY: Confirm exact caching behavior for emails in active Flows. One source mentions that even if referenced content is updated, emails running within a journey may not reflect changes until the email is republished. -->

Source: SFMC Tips #180 (medium.com/@marketingcloudtips), the-agentic-marketer.com reusability article, web search snippets from help.salesforce.com

### Converting a Content Block to a Section

**What it does:** Converting a content block to a section breaks the live link. The block's components are copied locally into the email as a regular section (or multiple sections, if the block contained multiple sections). The original content block is unchanged.

**After conversion:**
- The section in the email is fully editable locally
- Future edits to the original content block do NOT propagate to this email
- The conversion is one-way -- you cannot "re-link" a section back to a content block

**When to convert:**
- When you want to use a content block as a starting point but need to customize it for a specific email
- When you want to break free from propagation for a particular send

**How to convert:** Select the content block on the canvas, then use the convert/detach option. <!-- VERIFY: Confirm exact UI action. Is it a right-click menu, a toolbar button, or a Property Panel option? The sources mention "convert to a section" but do not specify the exact UI control. -->

**Multi-section blocks:** If the content block contains multiple sections, the block is converted to multiple sections in the email or landing page.

Source: help.salesforce.com (mktg_content_reusable_content_blocks), the-agentic-marketer.com reusability article, SFMC Tips #95

### Placement Rules in the Email Builder

**Content blocks live in the Layout tab** of the Components Panel, alongside Section and Repeater.

**Drag-and-drop rule:** A content block is structurally a Section. You cannot drop a content block inside an existing section (because sections cannot be nested inside sections in MCA). You must drag it above, below, or between existing sections.

**After dragging:** The Property Panel shows a "Select Block" button (or similar picker) to choose which content block from the workspace to display.

Source: SFMC Tips #95, the-agentic-marketer.com reusability article, email-builder module (already written)

### Content Block Limitations

1. **Content blocks cannot be nested.** You cannot place one content block inside another content block.
2. **Repeaters are not supported inside content blocks.** If you need a dynamic repeating layout, it must be built directly in the email, not inside a content block.
3. **Content blocks cannot be dropped inside existing sections.** They must be placed at the section level (between, above, or below other sections).
4. **Dynamic content (variation rules) are supported.** Content blocks support personalization variation rules, allowing different content to be delivered to different audiences. Each component can have up to 15 variations. <!-- VERIFY: Confirm that variation rules work inside content blocks. One source says "you can't use dynamic content when creating or editing a reusable content block" but another says variation rules are supported. This may be a distinction between MCE and MCA behavior. Flag for the writer. -->
5. **No versioning/history.** There is no mention in any source of content block version history or rollback capability. <!-- VERIFY: Check if there is any version history for content blocks in the CMS workspace. -->

Source: the-agentic-marketer.com reusability article, SFMC Tips #180, email-builder module (Repeater section confirms this)

### Draft Content Blocks in Emails

A content author can add a content block to an email even if the content block is still in Draft status. The draft block displays on the canvas and in preview.

When the email is published, any Draft content blocks it references are published simultaneously. This auto-publish behavior is confirmed in the existing CMS module content (salesforce-cms/index.md line 215).

Source: help.salesforce.com search snippet (mktg_content_reusable_content_blocks), existing course content (salesforce-cms/index.md)

### Content Blocks vs. Templates (Propagation Arc)

This is the Part 3 narrative arc as defined in module-assignments.md:

| Concept | Propagation Behavior |
|---------|---------------------|
| Raw email (Module 12) | No reuse mechanism. Each email is standalone. |
| Content blocks (Module 13) | **Propagate.** Edit the block, all linked emails update. |
| Templates (Module 14) | **Do NOT propagate.** A template is a starting point. Creating an email from a template makes a copy. Editing the template later does not update emails already created from it. |

This distinction is the central teaching point of Part 3. The writer must reinforce it clearly.

Source: module-assignments.md (Module 14 section explicitly states this arc)

### Content Blocks vs. Expressions

MCA has another reusability tool called "Expressions" (reusable text/content snippets). Expressions are different from content blocks:
- **Expressions** are text-level reusable content (a phrase, a sentence, a paragraph) that can be inserted into any text component
- **Content blocks** are section-level reusable components (structural layouts with multiple components)

This module focuses on content blocks. Expressions are mentioned in passing in the CMS module but are not the focus here.

Source: the-agentic-marketer.com reusability article

### Editing a Content Block After Placement

When a content block is placed in an email, you cannot edit it inline on the email canvas. To edit the block, you must open it from the CMS workspace, make changes there, and save/republish. The changes then propagate to all emails that use it.

This is an intentional design choice: it prevents accidental local edits from breaking the reusable block. If you want to make a one-off change, convert the block to a section first.

Source: mavlers.com content creation guide ("you need to do so by opening it from the CMS and making changes there"), web search results

---

## UI Navigation Paths

- **Create a content block:** MCA App > Content tab > [select workspace] > Add > Content Block: Email (Source: mavlers.com, the-agentic-marketer.com)
- **Add a content block to an email:** Email Builder > Components Panel > Layout tab > drag Content Block onto canvas > select block from picker (Source: SFMC Tips #95, email-builder module)
- **Edit an existing content block:** MCA App > Content tab > [select workspace] > find the content block > open it > edit > save/publish (Source: mavlers.com)
- **Convert a content block to a section:** Select the content block on the email canvas > use convert/detach option <!-- VERIFY: exact UI control not confirmed in sources -->
- **Move a content block to a folder:** Content tab > select asset > Manage > Move > select target folder (Source: building-leoptical-content-library research)

---

## Platform Gotchas

### Content blocks update all emails that use them
**Confirmed:** 2026-08-12 (from building-leoptical-content-library research)
**Source:** the-agentic-marketer.com reusability article

This is a feature, not a bug, but it surprises practitioners coming from MCE. If the LEOptical header block is updated (e.g., logo changes), every email containing that content block will reflect the update after republishing. Learners must understand this before using content blocks in production.

### Content blocks cannot contain nested content blocks
**Confirmed:** 2026-08-12 (from building-leoptical-content-library research)
**Source:** the-agentic-marketer.com reusability article

When building the product content blocks for LEOptical, you cannot nest one content block inside another. Each block must be built from basic components only.

### Repeaters are not supported inside content blocks
**Confirmed:** 2026-08-28 (from email-builder research, confirmed in written email-builder module)
**Source:** email-builder module (docs/part-3-content/email-builder/index.md line 388), web search results

If you need a repeatable layout in a content block, it is not possible. Repeaters can only be used directly in emails.

### Content blocks cannot be placed inside existing sections
**Confirmed by:** SFMC Tips #95, the-agentic-marketer.com
**Reasoning:** A content block is structurally a Section, and sections cannot be nested. You must drag content blocks between, above, or below existing sections.

### Draft content blocks auto-publish when the parent email is published
**Confirmed:** From existing course content (salesforce-cms/index.md)
**Source:** help.salesforce.com search snippet

A content author can add a Draft content block to an email. When the email is published, the Draft content block is published simultaneously. This could surprise content admins who expected the block to remain in Draft.

### Content block edits cannot be made inline in the email canvas
**Source:** mavlers.com content creation guide
To edit a content block, you must open it from the CMS workspace. You cannot edit it directly on the email canvas. This prevents accidental local edits but can frustrate users who expect inline editing.

### Dynamic content support is uncertain
**Conflict detected:** One source (help.salesforce.com search snippet) says "You can't use dynamic content when creating or editing a reusable content block." Another source (SFMC Tips #180) says "Content Blocks support variation rules." This may reflect a distinction between MCE and MCA, or between different types of dynamic content (component-level variations vs. content block-level variations). **Flag for the writer: do not make a definitive claim about dynamic content in content blocks without SDO verification.**

### Flow caching may delay content block propagation
**Source:** SFMC Tips #74, web search results
If a content block is used in an email that is part of an active Flow, the Flow may cache the email. Even if the content block is updated, the Flow may continue using the cached version until the email itself is republished.

---

## MCE Comparison Points

| Feature | MCE (Marketing Cloud Engagement) | MCA (Marketing Cloud Advanced) |
|---------|----------------------------------|-------------------------------|
| Where content blocks live | Content Builder folder structure | Salesforce CMS workspace |
| Creation | Content Builder > create Content Block | Content tab > Add > Content Block: Email |
| Propagation | MCE offered a choice at insertion: "Keep content blocks up-to-date" (live reference, propagates) or "Make local copies" (one-time copy, does not propagate). | Content blocks always propagate (live reference). To get a local copy, insert the block then convert to section. |
| Convert to section | MCE handled this at insertion time (copy vs reference choice). No explicit "convert to section" action after placement. | Convert to section explicitly breaks the live link after placement. |
| Nesting | MCE allowed layouts (groups of content blocks) | MCA does not allow nesting content blocks inside other content blocks |
| Dynamic content in blocks | MCE supported dynamic content blocks and AMPscript in content blocks | MCA support for dynamic content/variation rules in content blocks is uncertain (see gotcha above) |
| Content governance | Content Builder had no workspace-level access control | CMS workspaces have contributor roles (Content Admin, Content Manager, Content Author) that control who can create, edit, and publish blocks |
| Template relationship | Content Builder blocks and templates were separate; blocks were copied into emails | Content blocks propagate; templates do not. This is a clear, intentional distinction in MCA. |
| Builder access | Content Builder was a standalone app | Content blocks are a component type in the Layout tab of the email builder |

**Key shift for MCE practitioners:** MCE gave you a choice at insertion time: reference (propagating) or copy (non-propagating). MCA always creates a live reference. To get a non-propagating copy, you insert the block then convert it to a section. The other major differences are where blocks live (CMS workspaces with role-based access vs Content Builder folders) and that MCA does not support nesting/layouts.

---

## External Resources

- [Create and Manage a Reusable Content Block](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_reusable_content_blocks.htm&language=en_US&type=5) -- Official Salesforce Help article on content block creation and management. JavaScript-rendered page, content not extractable via fetch, but confirmed to exist and is the authoritative reference.
- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) -- Covers all five MCA reusability tools: Expressions, Content Blocks, Personalization Points, Brands, and Email Templates. Includes "Convert to Section" behavior and nesting limitations.
- [SFMC Tips #180: Introduction of Reusable Content Blocks](https://medium.com/@marketingcloudtips/marketing-cloud-next-introduction-of-reusable-content-blocks-2b50a771fd8c) -- Detailed walkthrough of content block creation, propagation, and variation rules. Covers Winter '26 release context.
- [SFMC Tips #95: Email Contents and Components](https://medium.com/@marketingcloudtips/marketing-cloud-on-core-content-creation-and-components-bf9046db9978) -- Covers all email builder components including the Content Block component in the Layout tab. Discusses placement rules (cannot drop inside a section).
- [Marketing Cloud Next Content Creation: Complete Guide](https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/) -- Navigation paths, component breakdown, content block creation from the workspace Add menu.
- [Marketing Cloud Next Winter '26 Release Notes Highlights](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/winter26-release-notes/) -- Winter '26 introduced content blocks in the Components Panel.
- [Marketing Cloud Next vs Engagement: Key Differences](https://www.mavlers.com/blog/marketing-cloud-next-vs-marketing-cloud-engagement/) -- Comparison of content management approaches between MCE and MCA.
- [Marketing Cloud Next vs MCE for Email Templates](https://emailmavlers.com/blog/marketing-cloud-next-vs-marketing-cloud-engagement-email-templates/) -- Template and content governance comparison. Mentions up to 30 approved phrases and 30 approved images per content region block in MCA.
- [Trailhead: Email Personalization in Marketing Cloud Next](https://trailhead.salesforce.com/content/learn/modules/email-personalization-in-marketing-cloud-next) -- MCA-specific Trailhead module covering personalization features.

---

## Data Model Relevance

This module does not directly involve data model configuration. However, the content blocks built in this module connect to the broader data model in these ways:

- **Product content blocks** correspond to the 4 LEOptical product families: Visionaire UltraLux (VIS-ULX-001), Visionaire ChromaShift (VIS-CHS-001), SeeClear DailyFocus (SEC-DLF-001), SeeClear SunSync (SEC-SNS-001). Product names and descriptions in the blocks should match the Product DMO records.
- **Footer content block** must include the unsubscribe link (preference center URL), which connects to the Communication Subscription Consent infrastructure configured in earlier modules. The physical address placeholder `{!$organization.Address}` must be configured in org settings.
- **Header content block** includes navigation links to the LEOptical website. No DMO connection.
- **Product blocks built here** will be used in personalized email campaigns (Part 4 modules) where Handlebars logic selects which product block to display based on the customer's purchase history.

---

## LEOptical Brand Specifications for Content Blocks

From `.planning/leoptical-brand-guidelines.md`:

### Header Block Specs
| Property | Value |
|----------|-------|
| Background | Navy `#11284f` |
| Logo | White LEOptical logo, left-aligned |
| Height | ~60-80px |
| Nav links (if present) | Right-aligned, `#dbe7f4`, Arial Regular, 13px |

The header does not include a tagline or promotional copy. It is a structural element.

### Footer Block Specs
| Property | Value |
|----------|-------|
| Background | White `#ffffff` or light gray |
| Text color | Muted `#617084` |
| Font | Arial Regular, 14px (caption/secondary size) |
| Content order | (1) Manage email preferences link, (2) Unsubscribe link, (3) Company address, (4) Copyright |

### Product Card Block
No explicit spec in brand guidelines, but should use:
- Product image from CMS workspace
- Product name in H3 (Trebuchet MS Bold, 18px)
- Description in body copy (Trebuchet MS Regular, 16px)
- Primary CTA button (Navy fill, white text, 30px pill border radius)

### Color Palette Reference
| Token | Hex | Use in content blocks |
|-------|-----|----------------------|
| Navy | `#11284f` | Header background, primary buttons |
| Accent Blue | `#5f8ec7` | Links, secondary accents |
| White | `#ffffff` | Email/block background, button text |
| Ink | `#1e2a35` | Body text |
| Muted | `#617084` | Footer text, disclaimers |
| Border | `rgba(17, 40, 79, 0.12)` | Dividers, card borders |
| Nav link | `#dbe7f4` | Header nav link text |

---

## Cross-References to Other Modules

- **Email Builder module (Module 12):** Already written. References content blocks in the Layout tab section (line 134) with a note to skip it for now. The Repeater section (line 388) confirms repeaters cannot be inside content blocks. The hands-on subpage asks "What parts of this email would you want to turn into reusable content blocks?" as a knowledge check question.
- **CMS module (Module 11):** Already written. Created the Email Content Blocks folder structure (Headers, Footers, Product Blocks subfolders). Explains content block creation path and the Draft auto-publish behavior.
- **Email Templates module (Module 14):** Stub only. Will use the header and footer content blocks built in this module. The concept page will teach that templates do NOT propagate (opposite of content blocks).

---

## Source Log

- https://help.salesforce.com/s/articleView?id=mktg.mktg_content_reusable_content_blocks.htm -- JavaScript-rendered, content not extractable. Confirmed to exist as authoritative reference. Search snippet provided key facts about creation, converting to sections, and variation rules.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/ -- Unable to fetch (domain verification issue). Key facts from web search snippets: content block propagation, convert to section, nesting limitations, expressions vs content blocks.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-introduction-of-reusable-content-blocks-2b50a771fd8c -- Unable to fetch (domain verification issue). Key facts from search snippets: Winter '26 release, auto-update on publish, variation rules support, draft behavior.
- https://medium.com/@marketingcloudtips/marketing-cloud-on-core-content-creation-and-components-bf9046db9978-- Unable to fetch. Key facts from search snippets: content block is essentially a Section, cannot drop inside existing section, drag above/below/between sections.
- https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/winter26-release-notes/ -- Fetched successfully. Confirmed Winter '26 introduced content blocks in the Components Panel.
- https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/ -- Fetched successfully. Content workspace navigation, Add menu, content block as Layout component.
- https://thespotforpardot.com/2025/09/19/everything-to-know-about-the-marketing-cloud-next-email-builder/ -- Fetched, but content not extractable from page.
- https://www.mavlers.com/blog/marketing-cloud-next-vs-marketing-cloud-engagement/ -- Key facts from search snippets: MCE vs MCA content management comparison, governance differences.
- https://emailmavlers.com/blog/marketing-cloud-next-vs-marketing-cloud-engagement-email-templates/ -- Key facts from search snippets: 30 approved phrases/images per content region, stricter governance in MCA.
- https://trailhead.salesforce.com/content/learn/modules/quick-start-create-and-send-an-email-with-marketing-cloud/build-a-reusable-email-template -- Discarded: MCE content (Content Builder, not MCA).
- https://trailhead.salesforce.com/content/learn/modules/content-builder-features/explore-content-types -- Discarded: MCE Content Builder content.
- https://trailhead.salesforce.com/content/learn/modules/content-builder-features/implement-and-reuse-your-content -- Discarded: MCE Content Builder content.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_content_status_ref.htm -- JavaScript-rendered, content not extractable.
- https://help.salesforce.com/s/articleView?id=sf.mc_ceb_create_content_blocks.htm -- Discarded: MCE Content Builder content (sf. prefix, not mktg.).
- https://help.nosto.com/en/articles/5793499-salesforce-marketing-cloud-how-to-create-a-re-usable-content-block -- Discarded: third-party integration guide, not MCA-specific.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-summer-26-release-highlights-04f6c5abdee6 -- Not fetched. Summer '26 release highlights; no specific content block details in search snippet.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-spring-26-release-highlights-24c0c804b0cb -- Not fetched. Spring '26 release; no content block details in snippet.
- https://www.mavlers.com/blog/salesforce-marketing-cloud-next-repeaters/ -- Not fetched. Confirms repeaters cannot be added to content blocks.
