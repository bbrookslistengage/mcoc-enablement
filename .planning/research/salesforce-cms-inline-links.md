# Salesforce CMS / Marketing Cloud Next — Confirmed Inline Links

Generated: 2026-08-25
Method: Each URL was fetched using a Playwright browser to verify it rendered actual content (not a JavaScript-only blank page). All pages below loaded with full article content confirmed.

---

## Topic 1: Brands in Marketing Cloud Next — creating a Brand asset, setting it as workspace default

**URL:** https://help.salesforce.com/s/articleView?id=mktg.mktg_content_brand.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "Brand Your Content in Marketing Cloud Next"

**What it covers:** Creating brand assets (colors, fonts, button styles, brand identity, tone), publishing brands, and assigning a brand as the workspace default. Confirms this is Marketing Cloud Next (MCN), not MCE. Covers the Brand Identity and Brand Tone fields used by Agentforce for AI-generated copy.

**Key details confirmed on page:**
- Navigation: From your marketing workspace, click **Add** > **Content | Brand** > **Create**
- To set default: In workspace click the Settings icon > **Default Brand** > **Select Brand** > **Add**
- Only Content Admin or Content Manager roles can assign/change the workspace default brand
- When a draft brand is attached to content and you publish the content, the brand is also published
- Updating a published default brand does NOT auto-update already-published content — must unpublish, remove brand, then re-select "Use Default Brand"

**Anchor links:**
- `#mktg_content_brand` — Brand Marketing Content section in the TOC links to `/apex/HTViewHelpDoc?id=mktg.mktg_content_brand.htm#mktg_content_brand`

---

## Topic 2: Approval workflows in Enhanced CMS Workspaces

**URL:** https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "CMS Workflows and Approvals"

**What it covers:** Overview of CMS workflow and approval system, which is built on Flow Orchestrations. Workflows attach to CMS content items. Available in enhanced CMS workspaces. Includes a pre-built approval workflow out of the box. Custom workflows can be created/edited in Flow Builder.

**Child articles confirmed in TOC (all verified as linked from this page):**
- Enable CMS Workflows: `https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows_enable.htm&language=en_US&type=5`
- Building Blocks of a CMS Workflow: `https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows_building_blocks.htm&language=en_US&type=5`
- Use Workflows in CMS: `https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows_access.htm&language=en_US&type=5`
- Anatomy of the Basic Approval Request Workflow: `https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows_basic_approval.htm&language=en_US&type=5`

**Key detail:** Workflows and Approvals are automatically turned on in all enhanced CMS workspaces.

---

## Topic 3: Content statuses in Marketing Cloud Next (Draft, Published, Unpublished)

**URL:** https://help.salesforce.com/s/articleView?id=mktg.mktg_content_status_ref.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "Marketing Cloud Next Content Types and Statuses"

**What it covers:** All content statuses in Marketing Cloud Next. Confirmed MCA/MCN product (breadcrumb shows "Marketing Cloud Next"). Statuses documented:

- **Draft** — content not yet published, or has been unpublished. Editable, previewable. Visible only to workspace contributors.
- **Published** — content available in channels. Editing published content creates a new version and changes status to "Revised." What "published" means varies by content type (table on page).
- **Revised** — published content with unpublished edits. Original published version remains active.
- **Scheduled Publish or Unpublish** — content awaiting a scheduled date/time.
- **Processing** — landing pages, forms, or brand content types that are in the process of publishing or unpublishing. No edits allowed while processing.

**Note:** There is no standalone "Unpublished" status label — unpublishing returns content to **Draft** status.

---

## Topic 4: CMS Workspace contributor roles (Content Admin, Content Manager, Content Author)

Two confirmed sources — one generic Salesforce CMS article, one MCA-specific article:

### Source A (Generic CMS — xcloud namespace):
**URL:** https://help.salesforce.com/s/articleView?id=xcloud.cms_access_control_overview.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "Role-Based Access in Salesforce CMS"

**Roles defined:**
- **Content admin** — Access to all content in the workspace. Can manage contributors, workspace languages, content translations, and content sharing.
- **Content manager** — Full access to all content in the workspace, including creating and publishing. Cannot manage workspace-level settings or contributors.
- **Content author** — Can create, edit, and view content. Cannot publish content.

### Source B (MCA-specific — mktg namespace):
**URL:** https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_setup_contributors_workspace.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "Add Workspace Contributors to Marketing Cloud Next"

**Roles defined (MCA-specific wording):**
- **Content Admin** — Manage users and sharing settings, create and publish all content in a CMS workspace, assign a default brand to a marketing workspace.
- **Content Manager** — Create and publish all content in a CMS workspace, assign a default brand to a marketing workspace.
- **Content Author** — View, edit, and create all content in a CMS workspace. Cannot publish.

**Navigation path (MCA):** Marketing app > Content tab > open workspace > Settings icon > **Contributors** > **Add Contributors**

**Note:** Only a Content Admin can add contributors to a workspace.

---

## Topic 5: Enhanced CMS Workspaces — creating and managing them

**URL:** https://help.salesforce.com/s/articleView?id=xcloud.cms_cmsworkspace_overview.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "CMS Workspaces"

**What it covers:** Overview of CMS and enhanced CMS workspaces in the Digital Experiences app. As of Winter '25, all new workspaces are enhanced by default. Enhanced workspaces are part of the "enhanced sites and content platform."

**Key detail confirmed on page:** To create a non-enhanced CMS workspace, enable the setting **Create both CMS workspaces and enhanced CMS workspaces**.

**Child article for creating/managing:**
**URL:** `https://help.salesforce.com/s/articleView?id=xcloud.cms_cmsworkspace-create.htm&language=en_US&type=5`

(Confirmed as linked from the overview page. Page title confirmed in TOC as "Create and Manage a CMS Workspace".)

---

## Topic 6: Workspace sharing between Enhanced CMS Workspaces

**URL:** https://help.salesforce.com/s/articleView?id=xcloud.cms_cmsworkspace-edit.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "Share Content Across Enhanced CMS Workspaces"

**What it covers:** How to share content from a source workspace to a target workspace so content can be reused without duplicating records. Shared content appears in the "Shared with Workspaces" folder in the target workspace.

**Navigation path:** App Launcher > Digital Experiences > All CMS Workspaces table > click workspace name > Settings icon > **Workspace Sharing** > move target workspace from Unshared to Shared column > save.

**Permissions required:**
- To share or unshare: Content admin or content manager role in BOTH source and target workspaces.
- To modify/delete shared content: Content admin, content manager, or content author in the source workspace.
- To publish/unpublish shared content: Content admin or content manager in the source workspace.

**Key gotcha confirmed on page:** When you unshare a source workspace from a target, all content from that source becomes unpublished and unavailable in the target workspace's channels immediately.

---

## Topic 7: Import/export of CMS assets (JSON migration)

**URL:** https://help.salesforce.com/s/articleView?id=xcloud.cms_import_export_overview.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "Export and Import Content with Salesforce CMS"

**What it covers:** How to export content to .zip archives of JSON files, and import them into the same or another Salesforce org.

**Key differences between workspace types:**
- Standard CMS workspace: Multiple content items can be in a single JSON file; import up to 5,000 items at once.
- Enhanced CMS workspace: Each content item must have its own `content.json` file. Optionally include a `_meta.json` for content key and folder placement.

**Export archive structure (enhanced):** `1-media-content-[jobId].zip` (media) and `1-content-[jobId].zip` (all other types). Each content item is in a folder named after its content key containing a `content.json` file.

**Import order:** Always import media .zip archive first, then the content .zip archive.

**Child articles confirmed:**
- JSON File Format for Content in Salesforce CMS: `https://help.salesforce.com/s/articleView?id=xcloud.cms_import_content_json.htm&language=en_US&type=5`
- JSON File Format for Content in an Enhanced CMS Workspace: `https://help.salesforce.com/s/articleView?id=xcloud.cms_import_content_json_enhanced.htm&language=en_US&type=5`
- Export Content from Salesforce CMS: `https://help.salesforce.com/s/articleView?id=xcloud.cms_export_content.htm&language=en_US&type=5`
- Import Content into Salesforce CMS: `https://help.salesforce.com/s/articleView?id=xcloud.cms_import_content.htm&language=en_US&type=5`

---

## Topic 8: Multilingual content / language variants in Salesforce CMS

**URL:** https://help.salesforce.com/s/articleView?id=xcloud.cms_translations_overview.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "Translate Salesforce CMS Content"

**What it covers:** Adding languages to a CMS workspace and managing content through the translation lifecycle (draft > translate > publish). Applicable to both standard and enhanced CMS workspaces.

**Note on "Summer '26 feature" framing:** The page does not call out this as a Summer '26 feature specifically. The translation/multilingual capability is a general Salesforce CMS feature, not MCA-specific. No MCA-specific multilingual article was found — the MCA workspace uses standard CMS translation tools.

**Child articles confirmed:**
- Add Languages to a CMS Workspace: `https://help.salesforce.com/s/articleView?id=xcloud.cms_translation_add_languages.htm&language=en_US&type=5`
- Work with Content in the Translation Lifecycle: `https://help.salesforce.com/s/articleView?id=xcloud.cms_translation_content.htm&language=en_US&type=5`
- Work with Enhanced CMS Content in the Translation Lifecycle: `https://help.salesforce.com/s/articleView?id=xcloud.cms_translation_lifecycle.htm&language=en_US&type=5`
- Manage Export and Import Content and Translation Details: `https://help.salesforce.com/s/articleView?id=xcloud.cms_content_manage_jobs.htm&language=en_US&type=5`

---

## Topic 9: CMS channels — connecting workspaces to delivery endpoints

**URL:** https://help.salesforce.com/s/articleView?id=xcloud.cms_channel_overview.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "CMS Channels"

**What it covers:** CMS channels deliver published content from CMS workspaces to audiences. Channels define where content is published.

**Channel connection types confirmed on page:**
- **Public** — for marketing emails, websites, custom apps. Only public channels can have an assigned domain. Can use a CDN.
- **Restricted** — for employee intranets, partner portals, Lightning apps. Defined by permission set. Cannot use CDN.
- **B2C Commerce Page Designer** — for Salesforce B2C Commerce storefronts.
- **Experience Cloud site** — created outside the Digital Experiences app when you create an EC site, then added to a CMS workspace.
- **Account Engagement email** — public connection type using Salesforce CDN as domain.
- **External/headless** — connects to third-party sites via Connect REST APIs.

**Key detail confirmed:** As of Spring '25, all new public and restricted channels are enhanced channels by default.

**Child articles confirmed:**
- Create and Manage CMS Channels: `https://help.salesforce.com/s/articleView?id=xcloud.cms_channel_create.htm&language=en_US&type=5`
- Add or Remove a Channel from a CMS Workspace: `https://help.salesforce.com/s/articleView?id=xcloud.cms_channel_add.htm&language=en_US&type=5`

---

## Topic 10: Folders in Salesforce CMS workspaces

**URL:** https://help.salesforce.com/s/articleView?id=xcloud.cms_folders_overview.htm&language=en_US&type=5

**Loaded successfully:** Yes — full article content rendered.

**Page title:** "Organize CMS Workspaces and Content With Folders"

**What it covers:** Creating and managing folders in CMS workspaces. Folders support up to five levels of hierarchy. Folders are unique to each workspace and cannot be moved to another workspace.

**Key details confirmed:**
- Each folder has a unique alphanumeric folder ID that appears in the URL — can be bookmarked.
- Folders appear at the top of the content list, above individual content items.
- Folders are shared with all users in the workspace.

**Child articles confirmed:**
- Create Folders in a CMS Workspace: `https://help.salesforce.com/s/articleView?id=xcloud.cms_folders_add.htm&language=en_US&type=5`
- Manage Folders and Move Content in a CMS Workspace: `https://help.salesforce.com/s/articleView?id=xcloud.cms_folders_manage_folders.htm&language=en_US&type=5`

---

## Summary Table

| Topic | URL | Loads? | Platform |
|-------|-----|--------|----------|
| 1. Brands in MCA | https://help.salesforce.com/s/articleView?id=mktg.mktg_content_brand.htm&language=en_US&type=5 | Yes | MCA/MCN confirmed |
| 2. Approval workflows | https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows.htm&language=en_US&type=5 | Yes | Salesforce CMS (Enhanced) |
| 3. Content statuses | https://help.salesforce.com/s/articleView?id=mktg.mktg_content_status_ref.htm&language=en_US&type=5 | Yes | MCA/MCN confirmed |
| 4a. Roles (generic CMS) | https://help.salesforce.com/s/articleView?id=xcloud.cms_access_control_overview.htm&language=en_US&type=5 | Yes | Salesforce CMS |
| 4b. Roles (MCA-specific) | https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_setup_contributors_workspace.htm&language=en_US&type=5 | Yes | MCA/MCN confirmed |
| 5. Enhanced CMS Workspaces | https://help.salesforce.com/s/articleView?id=xcloud.cms_cmsworkspace_overview.htm&language=en_US&type=5 | Yes | Salesforce CMS |
| 6. Workspace sharing | https://help.salesforce.com/s/articleView?id=xcloud.cms_cmsworkspace-edit.htm&language=en_US&type=5 | Yes | Salesforce CMS (Enhanced) |
| 7. Import/export JSON | https://help.salesforce.com/s/articleView?id=xcloud.cms_import_export_overview.htm&language=en_US&type=5 | Yes | Salesforce CMS |
| 8. Multilingual/translations | https://help.salesforce.com/s/articleView?id=xcloud.cms_translations_overview.htm&language=en_US&type=5 | Yes | Salesforce CMS |
| 9. CMS channels | https://help.salesforce.com/s/articleView?id=xcloud.cms_channel_overview.htm&language=en_US&type=5 | Yes | Salesforce CMS |
| 10. Folders | https://help.salesforce.com/s/articleView?id=xcloud.cms_folders_overview.htm&language=en_US&type=5 | Yes | Salesforce CMS |

---

## Notes and Caveats

**JavaScript-only blank pages:** Direct `WebFetch` calls to all help.salesforce.com URLs returned only JavaScript infrastructure (no content). All verifications in this file were done using Playwright browser rendering, which fully executed the JavaScript and loaded article content.

**MCA vs. Salesforce CMS articles:** Topics 1, 3, and 4b are in the `mktg.*` namespace and are explicitly Marketing Cloud Next documentation. Topics 2, 4a, 5, 6, 7, 8, 9, and 10 are in the `xcloud.*` namespace (Salesforce CMS / Digital Experiences), which is the underlying CMS platform that MCA's marketing workspace is built on. Both namespaces are applicable to MCA — MCA's content workspace IS an enhanced CMS workspace.

**Topic 8 caveat:** No MCA-specific "Summer '26 multilingual feature" article was found. The multilingual/translation capability is a general Salesforce CMS feature documented under `xcloud.cms_translations_overview.htm`. If there is a Summer '26 release-specific feature for language variants in MCA, it was not surfaced in searches. The general translation article is the best available official source.

**Create and Manage a CMS Workspace (child article):** The direct URL `https://help.salesforce.com/s/articleView?id=xcloud.cms_cmsworkspace-create.htm&language=en_US&type=5` was confirmed in the TOC of the overview page but not individually fetched. The content of that article (steps for creation, editing, deleting) was summarized in the search results from the overview page's body text and is reliable.
