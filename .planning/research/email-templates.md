# Research: Email Templates

Generated: 2026-09-23
Module: email-templates
Sources: 22 sources consulted

---

## Module Context

### Client Ask

> **The client wants:** Three email templates for their marketing team to use as starting points for campaigns. Each template should enforce different levels of control over what marketers can change.

### Full Assignment (Module 14 — Email Templates, multi-subpage)

Each subpage below is a separate file. The concept page (`index.md`) teaches template concepts. The hands-on page (`building-leoptical-templates.md`) builds 3 templates with different locking strategies.

**Subpage 1 — Email Templates (concept page, `index.md`):**

- How templates work as reusable starting points for new emails.
- **Templates do NOT propagate.** When you create an email from a template, the email is a copy. Editing the template later does not update existing emails created from it. This is the opposite of content blocks. The Part 3 narrative arc: raw email (Module 12) → content blocks propagate (Module 13) → templates do NOT propagate (Module 14).
- **Locked vs. editable regions** — how to lock sections so marketers cannot modify headers, footers, or layout structure. Editable regions are the areas marketers can change.
- **Locking strategies:**
  - Fully editable body (locked header/footer only) — for newsletters where the content changes every send
  - Locked layout with editable content slots — for structured campaigns where the layout must stay consistent
  - Fully locked — for automated/transactional emails where content is driven entirely by personalization
- Planning template architecture for a multi-email program.
- **HTML paste emails** — acknowledged conceptually. Brief mention that templates can also be created from pasted HTML. This course focuses on drag-and-drop templates.

**Subpage 2 — Building LEOptical Templates (hands-on page, `building-leoptical-templates.md`):**

Build 3 email templates, each demonstrating a different locking strategy. All 3 use the header and footer content blocks built in the Content Blocks module.

1. **"Monthly Newsletter"** — Locked header (logo + nav via header content block) and footer (legal + unsubscribe via footer content block). The entire body section is an editable region. Marketers can add whatever content they want between the header and footer.
2. **"Product Spotlight"** — Locked header, footer, AND layout structure (hero image slot, two-column feature section, CTA button). Marketers can only swap content within the predefined editable areas — they cannot change the layout itself.
3. **"Loyalty Tier Notification"** — Fully locked template. No editable regions. Content will be driven entirely by personalization (Handlebars merge fields, covered in Part 4).

**Assignment:**
1. Build the Monthly Newsletter template. Lock the header and footer. Leave the body fully editable.
2. Build the Product Spotlight template. Lock the header, footer, and layout structure. Mark specific content areas (image, text, button label) as editable.
3. Build the Loyalty Tier Notification template. Lock everything.
4. Use the header and footer content blocks from the Content Blocks module in all 3 templates.
5. Test each template: create a new email from the template and confirm which regions are editable and which are locked.
6. Verify that a Content Creator role user (configured in the Business Units & Governance module) can edit Template A's body but cannot modify the locked header/footer.

### Success Criteria

- [ ] 3 email templates exist in the LEOptical Marketing workspace.
- [ ] All 3 templates use the shared header and footer content blocks.
- [ ] Monthly Newsletter has a fully editable body with locked header/footer.
- [ ] Product Spotlight has editable content areas within a locked layout.
- [ ] Loyalty Tier Notification is fully locked with no editable regions.
- [ ] Creating an email from each template confirms the correct locking behavior.
- [ ] A Content Creator role user can edit the Newsletter body but cannot modify the header/footer.

---

## Platform Concepts

### What Email Templates Are

Email templates in MCA are pre-configured starting points for creating new emails. A template contains predefined components, layout, and Brand settings already configured. When a marketer creates a new email from a template, the template's content is copied into the new email. The email then becomes independent.

Templates are stored in the Salesforce CMS workspace alongside other content assets (emails, content blocks, landing pages). They live under the **Content tab** in a marketing workspace.

Source: the-agentic-marketer.com reusability article, emailmavlers.com MCE vs MCN comparison, mavlers.com content creation guide

### The Non-Propagation Behavior (The Critical Concept)

**Templates do NOT propagate changes to emails already created from them.**

This is explicitly confirmed: "The Email Template is a starting point, which means that if we change and publish it after it was used in an Email, the content changes won't be reflected in the new Email." (Source: emailmavlers.com MCN vs MCE article, confirmed by web search snippets from the-agentic-marketer.com reusability article)

This is the opposite of content blocks. The Part 3 arc:

| Tool | Propagation behavior |
|------|---------------------|
| Raw email | No reuse mechanism — each email is standalone |
| Content blocks | Propagate — edit the block, all linked emails update |
| Email templates | Do NOT propagate — template is a starting point, the email is a copy |

**What this means in practice:** If you build a "Monthly Newsletter" template and use it for 12 sends over the year, then update the template layout, those 12 previously-created emails are unchanged. You must update each email individually, or create new emails from the updated template. This is intentional — templates enable reuse at creation time without enforcing ongoing consistency (that is content blocks' job).

Source: emailmavlers.com MCN vs MCE article, the-agentic-marketer.com reusability article, web search snippet quoting help.salesforce.com

### How Template Creation Works

**Creation paths (two options):**

**Option 1 — From scratch using the Add menu:**
- MCA App > Content tab > [select workspace] > Add > Content > Email Template > Create
- Choose between "Use Components" (drag-and-drop builder) or "Select a Template" (pick from the gallery)

**Option 2 — "Save as Template" from an existing email:**
- Open an existing email in the builder
- Use the Save dropdown in the top right corner > "Save as Template"
- Give it a name, choose a folder location, save

**Template gallery (from Spring '26):**
When creating a template, if you choose "Select a Template," you can select from:
- **Standard Templates tab** — Salesforce-provided pre-built layouts. As of Spring '26, 17 pre-built templates are available covering a range of email types and industries.
- **Custom Templates tab** — templates you or your team have created and published.

Source: help.salesforce.com search snippet (create email template), web search snippets, mavlers.com content creation guide, emailmavlers.com article

**Important limitation on HTML templates:** Unlike regular emails, templates cannot be created by pasting HTML from an external platform. The "Save as Template" path from an HTML-mode email is unclear. <!-- VERIFY: Confirm whether HTML/code-mode emails can be saved as templates and whether the resulting template is editable in drag-and-drop mode or code-mode only. The Agentic Marketer reusability article notes "Unlike regular emails, templates cannot be created from imported HTML code from external platforms" but this is paraphrased. -->

### The Template Editor

The template editor uses the same drag-and-drop interface as the email builder. All the same components are available: Basics tab (Heading, Paragraph, List, Button, Divider, HTML), Layout tab (Section, Repeater, Content Block), and Media tab (Image).

**Key difference from the email editor:** The template editor has a **Settings tab** in the Property Panel that controls locking behavior. This tab is the core template-specific UI.

Source: mavlers.com content creation guide, web search snippets

### Locking Behavior — How It Works

**Default state:** By default, ALL components in a new template are locked. Users cannot edit any component in an email created from the template until it is explicitly unlocked.

There are two levels of control, both accessed from the **Settings tab** in the Property Panel:

**Level 1 — Template-wide toggle (global unlock):**
The Settings tab has a toggle labeled something like "Allow users to modify settings, styles, data sources, and layouts in emails that use this template."
- **Toggle OFF** (default): All components are locked. Users can only edit components individually unlocked (see Level 2).
- **Toggle ON**: All components are unlocked. Users can change styles, layouts, settings, and any component in the email.

**Level 2 — Component-level unlock:**
Select an individual component, column, or section on the canvas. In the Settings tab, toggle "Allow users to modify this component." Users can then edit that component and all nested components within it.

**Nested component inheritance:** The lock state of a parent component cascades to all nested children. Locking or unlocking a parent automatically locks or unlocks all components nested within it.

**Subject line and preheader locks:** On the Email Settings panel, there are lock icons next to Subject Line and Preheader. Clicking these controls whether users can edit the subject line and preheader in emails created from the template. These are independent from the component-level locking.

Source: help.salesforce.com (create email template) — search snippet from multiple queries, web search result summaries, the-agentic-marketer.com reusability article

### The Practical Locking Workflow

**Counterintuitive but important:** The workflow to create a template with selectively editable regions is:
1. Start with ALL components locked (the default).
2. Keep the "Allow users to modify..." toggle OFF.
3. Select the individual components you want to be editable.
4. For each one, turn on "Allow users to modify this component."

This means you don't "lock the header" — you unlock the body. The header is already locked by default. You unlock what you want editable, not lock what you want protected. This trips up practitioners who expect an "add lock" workflow.

Source: Web search result summarizing The Spot article (thespotforpardot.com) on template workflow: "everything must be locked first, then sections are individually unlocked"

### Content Blocks Inside Templates

**Content blocks CAN be used in templates.** The template editor includes the Content Block component in the Layout tab, same as the regular email editor. This means you can embed the LEOptical header content block and footer content block directly into a template.

**Behavior interaction between content block propagation and template non-propagation:**

This is a nuanced but important point with an (UNVERIFIED) element:

- The template itself does not propagate to emails created from it.
- Content blocks inside a template behave according to their own propagation rules.
- If a template contains a content block, and you create an email from that template, the email now has a live reference to that content block (not to the template). If the content block is later edited and republished, the change propagates to the email.
- The template's non-propagation applies to the template's own components (sections, layout, text, images added directly to the template). The content block inside the template retains its own propagation behavior.

<!-- VERIFY: Confirm this interpretation in the SDO. Specifically: when an email is created from a template that contains a content block, does the email contain a live reference to the content block, or a copy of the block's content? The Agentic Marketer article and module-assignments.md both indicate templates do not propagate, but neither explicitly addresses this content-block-inside-template edge case. This is the most important thing to verify before writing the module. -->

Source: mavlers.com content creation guide (confirms Content Block is a component in the Layout tab of the template editor), content-blocks.md research (content block propagation behavior), the-agentic-marketer.com reusability article

### Template Organization and Folders

Templates live in the CMS workspace alongside emails, content blocks, landing pages, and other assets. They can be organized into folders within the workspace.

Templates can be exported from the workspace as JSON files containing content properties, metadata, and media files. These exports can be reimported into other workspaces — useful for migrations or sharing templates across orgs.

An approval workflow can be configured for templates before they are published, managed through workspace settings.

Source: the-agentic-marketer.com CMS workspaces article

### Permissions

**Two standard permission sets in MCA:**
- **Marketing Cloud Admin** — full access including Setup, content creation, template management
- **Marketing Cloud Manager** — campaign, segment, and flow management; can access and use templates

**Who can create templates:**
Template creation requires the ability to create content in the CMS workspace. The "Content Creator" persona (from the Business Units & Governance module) needs CMS workspace permissions to build templates. Marketing Cloud Admin has this by default.

<!-- VERIFY: Confirm the exact permission names for template creation vs. template use in the SDO. The official permissions reference at help.salesforce.com/s/articleView?id=mktg.mktg_admin_permissions_ref.htm is JavaScript-rendered and could not be fetched. The course modules assign "Content Creator" as a role with "CMS + email templates only" access — verify this maps to a specific permission set or custom permission in the platform. -->

Source: arthurbackouche.com MCA permissions guide, web search snippets, module-assignments.md (Module 3 defines Content Creator role)

### Template Publishing Lifecycle

Templates follow the same Draft/Published lifecycle as other CMS assets. A template must be Published before it can be selected when creating a new email.

Unlike content blocks, a Draft template does not auto-publish when an email is created from it. You must explicitly publish the template first.

<!-- VERIFY: Confirm whether a Draft template appears in the template selection picker when creating a new email. If Draft templates appear in the picker, clarify whether the email creation copies the Draft version or only published versions. -->

---

## UI Navigation Paths

- **Create a template (from scratch):** MCA App > Content tab > [select workspace] > Add > Content > Email Template > Create (Source: help.salesforce.com search snippets, mavlers.com content creation guide)
- **Create a template from an existing email:** Email builder > Save dropdown > Save as Template > name + folder > Save (Source: web search snippets)
- **Select a standard/pre-built template:** When creating a new template > Select a Template > Standard Templates tab (Source: web search snippets)
- **Use a custom template to create an email:** Create Email > Select a Template > Custom Templates tab (Source: web search snippets from the-agentic-marketer.com reusability article)
- **Lock/unlock template-wide:** Template editor > click empty canvas > Property Panel > Settings tab > "Allow users to modify..." toggle (Source: help.salesforce.com search snippets)
- **Lock/unlock individual component:** Template editor > select component > Property Panel > Settings tab > "Allow users to modify this component" (Source: help.salesforce.com search snippets)
- **Lock/unlock subject line or preheader:** Template editor > Email Settings panel > lock icon next to Subject Line / Preheader (Source: help.salesforce.com search snippets)
- **Access template settings when no component is selected:** Click empty canvas area > Property Panel shows email-level settings including Brand, Data Sources, and Settings tab for template-wide controls (Source: inferred from email builder behavior, documented in email-builder module)

---

## Platform Gotchas / Limitations

### Everything is locked by default — the workflow is counterintuitive

When creating a new template, all components are locked by default. To create a template where the body is editable but the header and footer are locked, you must:
1. Ensure the template-wide "Allow users to modify..." toggle is OFF.
2. Select the body section(s) and toggle "Allow users to modify this component" ON for each one.

Practitioners coming from MCE expect to "add locks" to specific regions. MCA flips this — you unlock specific regions rather than lock them. This catches people off guard.

Source: Web search snippet summarizing The Spot article (Spring '26 context)

### Template edits do not update emails already created from them

Editing a published template and republishing it does not change any email that was previously created from that template. If LEOptical's content team updates the "Monthly Newsletter" template layout, all previously created newsletters are unaffected. New newsletters created from the template after the update will use the new layout.

This means templates are not a mechanism for global consistency — that is what content blocks are for. Templates provide consistency only at creation time.

Source: emailmavlers.com MCN vs MCE article, the-agentic-marketer.com reusability article, web search snippet quoting Salesforce documentation

### Cannot create templates by pasting external HTML

Unlike regular emails, email templates cannot be created by importing or pasting HTML code from an external platform. If you have an HTML template from another ESP, you cannot paste it directly into the template editor to create a reusable template.

<!-- VERIFY: Confirm this limitation in the SDO. The source is from the-agentic-marketer.com reusability article (paraphrased). Also confirm whether you can: (a) create a blank email in code mode, convert it to a template via "Save as Template," or (b) use an HTML email as a starting point for a drag-and-drop template. -->

Source: the-agentic-marketer.com reusability article (paraphrased in emailmavlers.com MCN vs MCE summary)

### Template gallery: Standard Templates are Salesforce-provided, not customizable

The Standard Templates tab in the template selection picker contains Salesforce-provided layouts. These are starting points, not agency-created templates. As of Spring '26, there are 17 standard templates. LEOptical's team should use these only as inspiration — custom templates should be built in the Custom Templates tab.

Source: web search snippet

### Content blocks inside templates retain their propagation behavior

A content block embedded in a template will continue to propagate changes to emails created from that template. This is powerful (update the header block once, all emails from all templates get the new header) but means the two behaviors interact. See the "Content Blocks Inside Templates" section above.

<!-- VERIFY: This interpretation is logically consistent but not directly confirmed by a single authoritative source. Verify in SDO by: (1) creating a template with a content block, (2) creating an email from that template, (3) editing the content block, (4) confirming whether the email reflects the change. -->

### Locking nested parent locks all children

When you lock or unlock a parent component (e.g., a Section), all components nested within it inherit the same lock state. If you unlock a section to make it editable, all nested components (headings, paragraphs, buttons, images within that section) also become editable. There is no way to lock individual children within an unlocked parent section without additional per-component settings.

Source: help.salesforce.com search snippet — "the state of nested components mirrors that of the parent component"

---

## Differences from MCE Templates

MCE (Marketing Cloud Engagement, the legacy ExactTarget-based platform) had a different template system built around Content Builder.

| Feature | MCE (Marketing Cloud Engagement) | MCA (Marketing Cloud Advanced) |
|---------|----------------------------------|-------------------------------|
| Where templates live | Content Builder | Salesforce CMS workspace |
| Template editor | Content Builder email editor (HTML or drag-and-drop) | MCA drag-and-drop builder (same canvas as emails) |
| Template creation | New > Template in Content Builder | Content tab > Add > Email Template, OR Save as Template from email |
| Locking regions | Content Builder had "locked" and "editable" region attributes via HTML; in the drag-and-drop builder, locking was more limited | Locking is a first-class feature in the Settings tab — lock/unlock per component or globally |
| Default lock state | Regions were unlocked by default; admins locked specific regions | All components locked by default; admins unlock specific regions |
| Pre-built gallery | Content Builder had layout templates, but no curated industry-specific gallery | Standard Templates tab with 17+ Salesforce-provided pre-built layouts (added Spring '26) |
| Non-propagation | Same — MCE templates were also starting points, not live references | Same — templates do not propagate to emails created from them |
| HTML templates | Full HTML paste supported; HTML templates common | HTML template creation from external paste is not supported in the template editor (UNVERIFIED) |
| AMPscript in templates | Supported | Not applicable (AMPscript support added to MCA in Summer '26, but Handlebars is the primary language) |
| Template governance | Basic folder/sharing permissions in Content Builder | CMS workspace roles (Content Admin, Content Manager, Content Author) control who can create, edit, and publish templates |
| Migration from MCE | N/A | No automated migration tooling as of early 2026 — every MCE template must be manually rebuilt in MCA |

**Key shift for MCE practitioners:** The most significant operational change is the default-locked model. In MCE, you selected regions to lock. In MCA, everything is locked and you select what to unlock. The locking granularity is similar (component-level), but the mental model is inverted.

**No MCE equivalent for the Standard Templates gallery.** MCE had layout templates but not a curated library of industry-ready email designs. The Standard Templates tab in MCA is a new capability.

**Template migration is manual.** As of the research date (September 2026), Salesforce has not released automated tooling to migrate MCE Content Builder templates to MCA. Every template must be rebuilt by hand.

Source: emailmavlers.com MCN vs MCE article, mavlers.com salesforce-marketing-cloud-next-migration article, web search snippets

---

## LEOptical Assignment Ideas

The three templates in the assignment are well-scoped for demonstrating the three core locking strategies. Some additional notes for the writer:

### Template 1: Monthly Newsletter

**Locking strategy:** Locked header + footer, fully editable body.

**Practical notes:**
- The header and footer should be added as the LEOptical header content block and footer content block (built in the Content Blocks module). This is the key connection between modules.
- With everything locked by default, the workflow is: unlock each body section one by one. The header and footer content blocks remain locked (default state).
- The subject line and preheader should likely be unlocked for this template — newsletter subject lines change every send.
- LEOptical use case: the marketing team creates a new newsletter each month, adding their own content sections between the locked header and footer.

### Template 2: Product Spotlight

**Locking strategy:** Locked header, footer, and layout structure. Editable content within fixed layout slots.

**Practical notes:**
- The hero image, text content areas, and CTA button label should be unlocked (editable), but the layout structure (number of columns, section arrangement) should remain locked.
- This is the trickiest template to configure because it requires unlocking specific components within locked sections. The nesting rule means unlocking the hero section unlocks everything inside it — including the layout. The writer may need to think carefully about how to present "editable content within a fixed layout" given the nesting inheritance rule.
- <!-- VERIFY: Confirm whether you can unlock a specific component (e.g., an Image component) within a locked parent Section, or whether unlocking the Section is required first. The nesting inheritance rule suggests unlocking the parent unlocks all children, but the reverse (locking a parent while selectively unlocking children) may be possible. -->
- LEOptical use case: product launch campaigns, seasonal promotions.

### Template 3: Loyalty Tier Notification

**Locking strategy:** Fully locked. No editable regions.

**Practical notes:**
- Leave the template-wide toggle OFF and do not unlock any components.
- The subject line and preheader should also be locked.
- The template will contain merge fields (first name, loyalty tier, loyalty points) that resolve at send time — but the template itself is not editable.
- LEOptical use case: automated VisionCare Rewards tier upgrade/downgrade notifications, sent via Flow.
- This template creates a logical bridge to the Handlebars modules in Part 4, where learners will learn to write the personalization expressions that give this template its dynamic content.

### Additional Template Ideas (Not in the Assignment, but Useful for Instructor Context)

- **"Eye Exam Reminder"** template — transactional, fully locked, personalized with last exam date and next recommended exam date. Similar to the Loyalty Tier Notification.
- **"Promotional Offer"** template — moderately locked. Hero image and headline unlocked for the campaign, footer locked.
- **"Welcome Email"** template — fully locked, triggered at signup. Standard onboarding content with no editable regions.

---

## External Resources

- [Create an Email Template in Marketing Cloud Next](https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_content_create_email_template.htm&type=5) — Official Salesforce Help. JavaScript-rendered and could not be fully extracted, but is the authoritative reference. Search snippets confirm: default locked, Settings tab, "Allow users to modify" controls.
- [Learn About Email Templates](https://help.salesforce.com/s/articleView?id=sfdo.mcngo_learn_about_email_templates.htm&language=en_US&type=5) — Salesforce Help overview of email templates in MCA. JavaScript-rendered, content not extractable.
- [What's New with Agentforce Marketing Email Templates](https://thespotforpardot.com/2026/04/13/whats-new-with-agentforce-marketing-email-templates/) — The Spot (Sercante). April 2026 article on template updates including the counterintuitive lock workflow. JavaScript-rendered, content not directly extractable, but search snippets provided the "unlock sections one at a time" workflow detail.
- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) — The Agentic Marketer. Covers all five MCA reusability tools including email templates. The most comprehensive single source on the topic. Content extracted successfully via fetch.
- [Marketing Cloud Next vs Marketing Cloud Engagement for Email Templates](https://emailmavlers.com/blog/marketing-cloud-next-vs-marketing-cloud-engagement-email-templates/) — Email Mavlers. MCE vs MCN template comparison. Content extracted.
- [Marketing Cloud Next Content Creation: Complete Guide](https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/) — Mavlers. Creation paths, component breakdown, content block/template creation. Content extracted.
- [Trailhead: Create a Reusable Email Template in Marketing Cloud](https://trailhead.salesforce.com/content/learn/modules/quick-start-create-and-send-an-email-with-marketing-cloud/build-a-reusable-email-template) — Discarded: MCE-based Trailhead module, not MCA.
- [Unlock your CMS Workspaces in Marketing Cloud Next: 8 features you need to know](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/) — The Agentic Marketer. CMS workspace features including template storage and export. Content extracted.
- [Top 10 Spring '26 Updates for Salesforce Marketers](https://www.salesforceben.com/top-10-spring-26-updates-for-salesforce-marketers/) — Salesforce Ben. Confirms template locking and governance in Spring '26 updates. Content extracted.

---

## Data Model Relevance

This module does not directly involve data model configuration. However, template design connects to the data model in these ways:

- **The Loyalty Tier Notification template** will use merge fields from the Data Graph (Unified Individual's loyalty tier, point balance, tier change date). These fields come from the Loyalty Program Member DMO in the Data Graph. When the writer describes this template, they should note that merge fields are configured in Part 4 (Handlebars modules) — this template establishes the structure that personalization will fill.
- **The Product Spotlight template** could optionally reference product data via merge fields or repeaters, but the assignment does not require this. The writer should keep product content as static placeholder text in this module.
- **The consent/unsubscribe link in the footer content block** inside each template connects to the Communication Subscription Consent infrastructure. The link uses the `{!Links.UnsubscribeLink}` merge field. This is already established in earlier modules — the writer just needs to confirm the footer block (from the Content Blocks module) already includes this link.

---

## Source Log

- https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_content_create_email_template.htm — JavaScript-rendered, content not extractable. Key facts confirmed via search snippets: default locked, Settings tab, "Allow users to modify" toggle, subject line lock icons.
- https://help.salesforce.com/s/articleView?id=sfdo.mcngo_learn_about_email_templates.htm — JavaScript-rendered, content not extractable.
- https://thespotforpardot.com/2026/04/13/whats-new-with-agentforce-marketing-email-templates/ — JavaScript-rendered, content not extractable. Key workflow detail ("unlock sections one at a time") confirmed via web search snippet.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/ — Fetched and extracted. Primary source for template overview, non-propagation behavior, locked vs editable regions, and templates vs content blocks comparison table.
- https://emailmavlers.com/blog/marketing-cloud-next-vs-marketing-cloud-engagement-email-templates/ — Fetched and extracted. Primary source for MCE vs MCN template comparison.
- https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/ — Fetched and extracted. Confirmed Content Block in Layout tab of template editor, creation path, template reuse concept.
- https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/winter26-release-notes/ — Fetched. Minimal template content. Confirmed standardized templates available for branding.
- https://www.salesforceben.com/top-10-spring-26-updates-for-salesforce-marketers/ — Fetched and extracted. Confirmed template locking/governance in Spring '26.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/ — Fetched and extracted. CMS workspace context: templates stored in workspace, exportable as JSON.
- https://www.salesforceben.com/salesforce-marketing-cloud-next-vs-mce-mcae-mcg-mca/ — Fetched. No specific template content. General MCA vs MCE overview.
- https://arthurbackouche.com/docs/marketing-cloud-next/user-access-management/how-to-configure-the-permission-sets-in-marketing-cloud-next/ — Fetched. High-level permission sets only, no template-specific permissions.
- https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_admin_permissions_ref.htm — JavaScript-rendered, content not extractable.
- https://trailhead.salesforce.com/content/learn/modules/quick-start-create-and-send-an-email-with-marketing-cloud/build-a-reusable-email-template — Fetched. Discarded: MCE-based Trailhead module. Not MCA content.
- https://developer.salesforce.com/docs/marketing/marketing-cloud-growth/references/mc-next-email-template — JavaScript-rendered, content not extractable. Confirmed to exist as MCA developer reference.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-winter-26-release-highlights-81240775f843 — 403 error, content not accessible.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-spring-26-release-highlights-24c0c804b0cb — 403 error, content not accessible.
- https://thespotforpardot.com/2025/09/09/exciting-updates-for-marketing-cloud-next-for-winter-26/ — JavaScript-rendered, content not extractable.
- https://blog.intelogik.com/winter-26-deep-dive-whats-new-in-marketing-cloud-next/ — Fetched. No specific template detail.
- https://www.salesforceben.com/12-winter-26-updates-salesforce-marketers-need-to-know/ — Fetched. Confirmed reusable content blocks and templates as Winter '26 feature, admin governance.
- https://gettectonic.com/marketing-cloud-template-editing/ — JavaScript-rendered, content not extractable. Snippet confirmed limitation about locked templates and CSS.
- https://gettectonic.com/email-templates-in-marketing-cloud/ — JavaScript-rendered, content not extractable.
- https://handsonsfmc.com/2025/03/30/how-to-build-an-email-from-a-template-in-marketing-cloud-growth/ — JavaScript-rendered, content not extractable.
