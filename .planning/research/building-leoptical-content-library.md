# Research: Building the LEOptical Content Library

Generated: 2026-08-12
Module: building-leoptical-content-library
Sources: 22 sources consulted (shared with salesforce-cms.md research), 15 included

## Module Context

### Stub Lesson Overview (from existing file)
- Create the LEOptical Marketing CMS workspace
- Build collections for Brand Assets, Product Images, Email Content Blocks, and Legal/Compliance
- Upload brand assets including logos and product photography
- Create reusable CMS content items for email headers, footers, and product descriptions
- Organize content by product family and marketing purpose
- Verify that content items are accessible from the email builder

### Full Assignment (Module 11 — Salesforce CMS & Content Management, from module-assignments.md)
- In the "LEOptical Marketing" CMS Workspace (created in the Business Units & Governance module), create a content organization structure with collections for: Brand Assets, Product Images, Email Content Blocks, Legal/Compliance
- Upload LEOptical brand assets (logo, product images — provided in course resources)
- Create reusable CMS content items: standard email header, standard footer with legal disclaimer, and product description blocks for each of the 4 lens families
- Understand content types and how to create structured content (e.g., a "Product Feature" type with fields for name, description, image, price)

### Success Criteria
- [ ] CMS Workspace has organized collections
- [ ] Brand assets are uploaded and accessible
- [ ] Reusable content blocks exist for header, footer, and all 4 products
- [ ] Content is organized so another marketer could navigate it

### Important: Workspace Already Exists
The "LEOptical Marketing" workspace is created in **Module 3 (Business Units & Governance)**, not in this module. This module opens that workspace and builds the content structure inside it. The lesson overview bullet "Create the LEOptical Marketing CMS workspace" is misleading — should be understood as "access/confirm the LEOptical Marketing CMS workspace created in Module 3."

<!-- VERIFY: Confirm that Module 3 creates the workspace and Module 11 uses it. If the stub lesson overview says "Create the LEOptical Marketing CMS workspace," this may need to be updated to "Open the LEOptical Marketing CMS workspace." -->

### LEOptical Client Context
- **Four lens product families:** Visionaire UltraLux (VIS-ULX-001), Visionaire ChromaShift (VIS-CHS-001), SeeClear DailyFocus (SEC-DLF-001), SeeClear SunSync (SEC-SNS-001), plus LEOptical Designer Frames (LEO-FRM-001)
- **Loyalty program:** VisionCare Rewards (Bronze, Silver, Gold, Platinum tiers)
- **Communication subscriptions:** Promotional Offers, VisionCare Rewards Updates, Eye Health Reminders, Order Updates (transactional)
- **Website:** https://leoptical.web.app/ (demonstration site for brand reference)
- **Previous state:** Basic ESP, no structured content library, no reusable assets

## Platform Concepts

### Workspace Access for Module 11

The "LEOptical Marketing" workspace created in Module 3 is an Enhanced CMS Workspace within the Digital Experiences app. To access it for building the content library:

**From MCA app:** The Content tab in MCA shows workspaces the user has been added to as a contributor. If the user configured "LEOptical Marketing" in Module 3 and added themselves as Content Admin, the workspace should be visible in the Content tab dropdown or workspace list.

**From Digital Experiences app:** App Launcher > Digital Experiences > CMS Workspaces > select "LEOptical Marketing"

**Note:** The default workspace "Content Workspace for Marketing Cloud" also appears in the Content tab. Learners must select the correct workspace ("LEOptical Marketing") when building the LEOptical content library. Assets created from Campaign flows will go to the default workspace, not the LEOptical Marketing workspace.

Source: the-agentic-marketer.com CMS Workspaces, search results

---

### Building the Folder Structure

Before uploading assets or creating content blocks, the workspace needs a folder structure for organization. Folders in MCA CMS workspaces are the primary organizational tool for content creators.

**Proposed folder structure for LEOptical Marketing workspace:**
```
LEOptical Marketing (workspace root)
├── Brand Assets
│   ├── Logos
│   └── Brand Guidelines
├── Product Images
│   ├── Visionaire UltraLux
│   ├── Visionaire ChromaShift
│   ├── SeeClear DailyFocus
│   └── SeeClear SunSync
├── Email Content Blocks
│   ├── Headers
│   ├── Footers
│   └── Product Blocks
└── Legal & Compliance
```

**Creating folders:**
- Navigate to the workspace in the Content tab
- Create new folders from the workspace interface
- Subfolders can be created inside existing folders

**Moving content to folders:**
- Select asset > Manage > Move > select target folder

Source: the-agentic-marketer.com CMS Workspaces (Move capability confirmed)

<!-- VERIFY: Confirm the exact UI action for creating a new folder in an MCA CMS workspace. Is it a "New Folder" button in the workspace view? Or a different path? -->

---

### Collections vs. Folders (for this module)

The lesson overview mentions "building collections." Research clarifies that in MCA:
- **Folders** are the primary way to organize content for content creators inside the workspace
- **Collections** in Salesforce CMS are primarily for displaying content on Experience Cloud sites and LWR pages

For the purposes of this module (organizing assets in an MCA marketing workspace), the practical tool is **folders**, not collections in the technical CMS sense.

**The lesson overview's "collections" language** likely refers to the folder-based organizational groupings (Brand Assets, Product Images, Email Content Blocks, Legal/Compliance), not to Salesforce CMS collections (which are a different feature for Experience Cloud channel delivery).

**Recommendation for the writer:** Use "folders" in the written module content. If you use "collections" in the lesson overview, clarify that you mean organizational groupings within the workspace, not the Salesforce CMS "Collections" feature. This distinction will confuse MCE practitioners who may look for a Collections menu item.

Source: salesforcetutorial.com (Collections explained), search results (folders vs. collections distinction)

<!-- VERIFY: Confirm whether MCA presents a "Collections" feature in the content workspace that is distinct from folders. Some documentation suggests collections appear in the CMS workspace for Experience Cloud sites. Confirm in SDO whether this Collections option is visible in the MCA content workspace UI. -->

---

### Uploading Brand Assets (Images/Documents)

**Uploading images to the workspace:**
- Navigate to the workspace
- Click Add > select Image (or the equivalent media type)
- Upload from local computer (drag and drop or browse)
- Assign to the appropriate folder (Brand Assets > Logos, etc.)

**Image properties:**
- Images in CMS have public URLs using org domain, channel ID, org ID, and content key
- Images can have captions and URL links
- Images can be configured for dynamic content display

**Supported media types:** Images, Documents (PDF), Audio, Video

**Best practices for LEOptical:**
- Upload the LEOptical logo to Brand Assets > Logos
- Upload product photography to Product Images folders organized by product family
- Name files consistently (e.g., `leoptical-logo-primary.png`, `visionaire-ultralux-hero.jpg`)

Source: the-agentic-marketer.com CMS Workspaces, mavlers.com content creation guide

<!-- VERIFY: Confirm exact supported image formats (PNG, JPG, GIF, SVG?) and maximum file size limits for CMS images in MCA. -->

---

### Creating Content Blocks for Reusable Email Components

**What to create for LEOptical:**
1. **Standard Email Header** — Logo + navigation bar (locked in email templates; reusable via content block)
2. **Standard Footer with Legal Disclaimer** — Unsubscribe link + physical address + legal copy (required for CAN-SPAM compliance)
3. **Product Block: Visionaire UltraLux** — Product name, description, image, CTA button
4. **Product Block: Visionaire ChromaShift** — Product name, description, image, CTA button
5. **Product Block: SeeClear DailyFocus** — Product name, description, image, CTA button
6. **Product Block: SeeClear SunSync** — Product name, description, image, CTA button

**Creation path:**
- MCA App > Content tab > select "LEOptical Marketing" workspace > Add > Content Block: Email
- Build the block using the drag-and-drop builder (same components as the email builder)
- Components available: Button, Divider, Heading, HTML, List, Paragraph (Basics); Section, Repeater, Content Block (Layout); Image (Media)
- Save and publish the block

**Critical: Footer content block must include the unsubscribe link**
MCA does not validate whether an unsubscribe link exists in an email. If the footer content block is used in all promotional emails (via email templates in Module 14), the unsubscribe link and physical address MUST be in that footer block. The platform will not catch it if they are missing.

Physical address placeholder: `{!$organization.Address}`

**Content block naming convention (suggested):**
- `LEO-Header-Standard` — main email header with logo
- `LEO-Footer-Standard` — footer with legal, unsubscribe, address
- `LEO-Product-VisionaireUltraLux` — product block
- `LEO-Product-VisionaireChromaShift`
- `LEO-Product-SeeClearDailyFocus`
- `LEO-Product-SeeClearSunSync`

Source: mavlers.com content creation guide, the-agentic-marketer.com reusability article

---

### Understanding the Live-Link Behavior of Content Blocks

This is a key teaching concept. When a content block is updated and republished:
- **Every email using that content block is automatically updated**
- This is why using content blocks for headers and footers is valuable — update the footer copy once, every email reflects the change

Contrast this with Email Templates:
- Email templates are starting points only
- When a template is updated, emails already created from it are NOT updated
- The template-to-email relationship breaks at creation

And with "Convert to Section":
- If a content block is converted to a Section within an email, the live link is broken
- The block's components are copied locally into the email
- Future updates to the original content block do not affect that email

Source: the-agentic-marketer.com reusability article

---

### Verifying Content Block Accessibility in the Email Builder

To confirm a content block is accessible in the email builder:

1. Create a new email (MCA App > Content > Add > Email)
2. Open the email builder
3. In the Components Panel, look for the Layout tab
4. The "Content Block" component should be available; dragging it onto the canvas should display a picker showing available content blocks from the workspace
5. Verify the newly created LEOptical content blocks appear in the picker

**Winter '26 behavior:** After the Winter '26 release, content blocks created in the org appear in the Components Panel automatically. Content blocks can be added to an email even before they are published — the saved draft version displays in the canvas and preview.

Source: search results (Winter '26 release highlights), the-agentic-marketer.com CMS Workspaces

---

### Custom Content Types (Structured Content)

The lesson overview mentions "understanding content types and how to create structured content (e.g., a 'Product Feature' type with fields for name, description, image, price)."

**What custom content types are:**
- Salesforce CMS supports creating custom content types with structured fields
- Custom types work similarly to Salesforce records with typed fields ("nodes")
- A "Product Feature" type could have fields: Name (text), Description (rich text), Product Image (image reference), Price (number)
- The CMS Content Type Manager (a Salesforce Labs tool) is used to create custom content types
- Up to 100 content types per org, up to 15 nodes (fields) per type

**How custom content types surface in MCA:**
- Once created, custom content type items can be created in the CMS workspace
- They can be used in emails via the Content Block mechanism or accessed via merge fields
- Primarily useful for structured content that needs to be reused across multiple channels (email AND landing pages AND Experience Cloud sites)

**For LEOptical's context:**
- The 4 product blocks could be built as custom "Product Feature" content type items instead of manually built content blocks
- However, for a standard MCA email use case, building content blocks directly using the drag-and-drop builder is simpler and more common
- Custom content types add power when the same content needs to feed multiple channels simultaneously

**Practical note for the module:** The assignment says to "understand content types and how to create structured content." This is a conceptual understanding task, not necessarily a full hands-on build of a custom content type schema. The learner should know what custom content types are, how they differ from content blocks, and when to use each.

Source: search results (CMS Content Type Manager mentioned), salesforcetutorial.com CMS guide

<!-- VERIFY: Confirm whether the CMS Content Type Manager (Salesforce Labs) is available and functional in SDO environments. Also confirm whether custom content types created via this tool are accessible from within the MCA email builder component picker. -->

---

### Brands in MCA (Related Feature)

A **Brand** is a reusable visual identity stored in the CMS workspace. It defines:
- Colors (primary, secondary, accent)
- Typography (font families, sizes)
- Button styles
- Spacing and border defaults

When a brand is set as the workspace default, all new assets created in the workspace automatically inherit brand settings. Individual properties remain editable, but the brand establishes the baseline.

**For LEOptical's workspace:**
- A brand could be created to define LEOptical's color palette and typography
- Setting it as the workspace default ensures new content blocks and emails start with LEOptical's visual identity
- This is a natural extension task for the module — not in the core assignment but relevant

Source: the-agentic-marketer.com reusability article

---

### Approval Workflows in the Workspace

If the "LEOptical Marketing" workspace was created with approval workflows enabled, Content Authors cannot publish their own work — they must submit for review. For a training environment where learners are working as Content Admin:

**Recommendation:** Disable the approval workflow in the LEOptical Marketing workspace to avoid friction during the training exercise. The approval workflow concept is taught in the module, but it should not block hands-on work.

**How to disable:** In the workspace settings, toggle off the approval workflow (can be done per asset type or globally).

Source: the-agentic-marketer.com CMS Workspaces

---

### Workspace Contributor Setup for This Module

For the module to work as designed:
- The learner's user must be a **Content Admin** on the "LEOptical Marketing" workspace
- If the workspace was set up in Module 3 with appropriate roles, this should already be configured

If learners are testing the Content Creator persona (from Module 3's role setup task), they may encounter publishing restrictions. The Content Author role can create but not publish. The module should clarify which user role to use for this exercise.

Source: trailhead.salesforce.com CMS Basics, search results on contributor roles

---

## UI Navigation Paths

<!-- VERIFY: All paths below should be verified in a live SDO. Paths assembled from multiple sources; mark uncertain ones. -->

- **Access the LEOptical Marketing workspace:** MCA App > Content (nav) > select "LEOptical Marketing" workspace from workspace list
- **Alternative path:** App Launcher > Digital Experiences > CMS Workspaces > "LEOptical Marketing"
- **Create a folder in the workspace:** MCA App > Content > [workspace] > New Folder (button location to be confirmed in SDO) <!-- VERIFY -->
- **Upload an image:** MCA App > Content > [workspace] > Add > Image > upload from computer or drag and drop
- **Create a content block:** MCA App > Content > [workspace] > Add > Content Block: Email > build using drag-and-drop > publish
- **Move content to a folder:** Select asset > Manage > Move > select target folder
- **Clone an asset:** Select asset in workspace list > Clone (no need to open the asset first)
- **Set workspace default brand:** Workspace settings > Branding > select default brand <!-- VERIFY navigation -->
- **Disable approval workflow:** Workspace settings > Approval Workflow > disable <!-- VERIFY navigation -->
- **Add contributors to workspace:** App Launcher > Digital Experiences (or Salesforce CMS) > select workspace > Contributors > Add Contributors > assign role > Finish
- **Verify content block in email builder:** MCA App > Content > Add > Email (new) > open builder > Layout tab in Components Panel > Content Block component > drag onto canvas > verify LEOptical blocks appear in picker

## Platform Gotchas Relevant to This Module

### Workspace cannot be deleted
Once created, a workspace is permanent. Name it carefully (already handled in Module 3). If a learner accidentally creates a duplicate workspace, they cannot delete the extra one — only rename it.

**Confirmed by:** marcloudconsulting.com

---

### API name cannot be changed after workspace creation
The API name set during workspace creation in Module 3 is permanent. This is flagged in Module 3 content but bears repeating — do not get confused if the display name and API name appear to differ.

**Confirmed by:** help.salesforce.com workspace creation article (via search results)

---

### Campaign-generated assets go to the default workspace, not LEOptical Marketing
Any emails or landing pages created through Campaign flows (segment-triggered or form-triggered) automatically populate into "Content Workspace for Marketing Cloud" (the default workspace), not "LEOptical Marketing." This is expected — learners should not be alarmed when they don't see campaign assets in their custom workspace.

**Confirmed by:** the-agentic-marketer.com CMS Workspaces

---

### Unsubscribe link is not validated by the platform
The footer content block must contain a working unsubscribe link. MCA will not flag a missing unsubscribe link during email creation or review. If the footer block is missing it, the error will only manifest as a CAN-SPAM compliance violation on actual sends.

**Physical address placeholder:** `{!$organization.Address}` — if not configured in org settings, sending will be blocked.

**Confirmed by:** mavlers.com content creation guide

---

### Content blocks update all emails that use them
This is a feature, not a bug — but it surprises practitioners coming from MCE. If the LEOptical header block is updated (e.g., logo changes), every email containing that content block will reflect the update after republishing. Learners must understand this before using content blocks in production.

**Confirmed by:** the-agentic-marketer.com reusability article

---

### Content blocks cannot contain nested content blocks
When building the product content blocks for LEOptical, you cannot nest one content block inside another. Each block must be built from basic components (text, image, button, etc.) only.

**Confirmed by:** the-agentic-marketer.com reusability article

---

### Approval workflow may block content authors from publishing
If the workspace was created with approval workflows enabled and the learner is testing the Content Author role, they will not be able to publish content directly. They must submit for review. Disable the approval workflow for training environments or ensure the learner operates as Content Admin.

**Confirmed by:** the-agentic-marketer.com CMS Workspaces

---

### "Collections" in the lesson overview refers to folders, not CMS Collections
The assignment uses "collections" to mean organizational groupings (Brand Assets, Product Images, etc.). In Salesforce CMS, "Collections" is a specific technical feature for Experience Cloud channel delivery. Learners who go looking for a "Collections" menu item in the MCA content workspace may not find what they expect.

**New gotcha — not yet in platform-gotchas.md**

---

## MCE Comparison Points

For MCE-experienced learners, the hands-on experience of building the LEOptical content library maps as follows:

| Task | MCE (Marketing Cloud Engagement) | MCA (Marketing Cloud Advanced) |
|------|----------------------------------|-------------------------------|
| Organizing assets | Content Builder > create folders in All Content | CMS workspace > create folders |
| Uploading images | Content Builder > drag image to folder | CMS workspace > Add > Image > upload |
| Creating reusable email sections | Content Builder > create Content Block asset | CMS workspace > Add > Content Block: Email |
| Accessing content blocks in email | Email builder > drag block from Content tab | Email builder > Layout > Content Block component > pick from workspace |
| When a content block updates | Behavior varied by implementation; generally not auto-updating across emails | Live link — all emails update when block is republished |
| Template vs. content block distinction | Content Builder blocks vs. email templates (separate concepts) | Same distinction in MCA; templates are starting points; blocks are live links |
| Finding images for email | Content Builder > browse All Content | Image component in builder > pulls from CMS images |
| Organizing by campaign/brand | Folder structure in Content Builder | Folder structure in CMS workspace |

**Key MCE-to-MCA shift:**
- The "Content Builder" app no longer exists as a standalone tool
- Everything lives in the Salesforce CMS workspace accessible via the Content tab in MCA
- The organizational philosophy is workspace-based (with contributor controls) rather than folder-only (Content Builder had no workspace access control)
- Content blocks in MCA have live-link behavior that is more explicit than MCE's block behavior

---

## LEOptical-Specific Content to Create

### Brand Assets Folder
- **LEOptical Primary Logo** — PNG with transparent background (white version for dark backgrounds, color version for light)
- **LEOptical Wordmark** — horizontal text-only version

### Product Images Folder (organized by family)
- **Visionaire UltraLux** — hero product shot, lifestyle shot
- **Visionaire ChromaShift** — hero product shot, adaptive lens demo shot
- **SeeClear DailyFocus** — hero product shot, lifestyle/screen usage shot
- **SeeClear SunSync** — hero product shot, outdoor lifestyle shot

### Email Content Blocks Folder

**Headers:**
- `LEO-Header-Standard`: Logo (from CMS image) + navigation links (Eye Exams, Lenses, Contacts, Frames) + VisionCare Rewards account link

**Footers:**
- `LEO-Footer-Standard`: LEOptical address (`{!$organization.Address}`), unsubscribe link, privacy policy link, copyright notice, VisionCare Rewards tier notice (optional)

**Product Blocks (one per product family):**
- `LEO-Product-VisionaireUltraLux`: Product image + name + 2-line description + "Shop Now" CTA button
- `LEO-Product-VisionaireChromaShift`: Same structure
- `LEO-Product-SeeClearDailyFocus`: Same structure
- `LEO-Product-SeeClearSunSync`: Same structure

### Legal & Compliance Folder
- Standard legal disclaimer text (plain text document or HTML content block)
- Privacy policy summary text

---

## Data Model Relevance

This module does not directly configure Data 360 DMOs or Data Graphs. However:

- **Product content blocks** correspond to the 4 LEOptical products in the Product DMO (VIS-ULX-001, VIS-CHS-001, SEC-DLF-001, SEC-SNS-001). The product names, descriptions, and imagery should match what is in the CRM Product catalog.
- **Footer content block** contains the unsubscribe link, which connects to the Communication Subscription consent infrastructure (Modules 4-5). The unsubscribe link must be the MCA preference center URL configured in Module 4.
- **Product blocks created here** will be used in personalized email campaigns (Modules 15-19) where Handlebars logic selects which product block to display based on the customer's purchase history (Sales Order -> Sales Order Product -> Product -> Family).

## External Resources

- [Unlock your CMS Workspaces in Marketing Cloud Next: 8 features you need to know](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/) — Primary reference for hands-on workspace operations (folders, asset management, approval workflows, sharing).
- [Agentforce Marketing: Mastering Reusability in MC Next](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/) — Definitive source on content blocks, expressions, brands, and templates. Includes "Convert to Section" behavior.
- [Marketing Cloud Next Content Creation: Complete Guide](https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/) — Navigation paths, component breakdown, compliance gotchas (unsubscribe link, physical address).
- [Enhance Your CMS Skills: Workspaces, Channels, Contributors](https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/learn-about-cms-workspaces-channels-and-contributors) — Trailhead module on workspace roles and contributor setup.
- [Create and Manage a Reusable Content Block](https://help.salesforce.com/s/articleView?id=mktg.mktg_content_reusable_content_blocks.htm&language=en_US&type=5) — Official Salesforce Help on content block creation (page did not render but exists as authoritative reference).
- [Marketing Cloud Next - Winter '26 Release Notes Highlights](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/winter26-release-notes/) — Winter '26 content block launch in Components Panel.

## Source Log

(Shared with salesforce-cms.md — same research session. See that file's Source Log for full list.)

Key sources most relevant to this hands-on module:
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/ — Workspace navigation, asset management, folder operations. Fetched successfully.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/ — Content block creation and live-link behavior. Fetched successfully.
- https://www.mavlers.com/blog/marketing-cloud-next-content-creation-guide/ — Add menu navigation, builder components. Fetched successfully.
- https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/winter26-release-notes/ — Winter '26 content block Components Panel behavior. Fetched successfully.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_content_reusable_content_blocks.htm — 403/JavaScript-only; confirmed to exist, not readable.
- All other help.salesforce.com pages — JavaScript-only rendering, no content extractable.
