# Research Followup: Salesforce CMS — Fact Verification

Generated: 2026-08-25
Sources consulted: 8 (all fetched via Playwright — pages required JavaScript rendering)

---

## Item 1: Salesforce Admin Workspace Access

**Claim being verified:** "Salesforce Admin — Full access across all workspaces. Manages CMS workflows and approvals at the org level."

**Verdict: WRONG. The reviewer is correct. Remove "Salesforce Admin" as a workspace role.**

### What the docs actually say

**Source 1: "Add Workspace Contributors to Marketing Cloud Next"**
URL: https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_setup_contributors_workspace.htm&type=5

The article is titled "Add Workspace Contributors to Marketing Cloud Next." It lists exactly three contributor roles:

> "These contributor roles are available.
> - Content Admin: Users who have this role can manage users and sharing settings, create and publish all content in a CMS workspace, and assign a default brand to a marketing workspace.
> - Content Manager: Users who have this role can create and publish all content in a CMS workspace and assign a default brand to a marketing workspace.
> - Content Author: Users who have this role can view, edit, and create all content in a CMS workspace."

No "Salesforce Admin" role appears in this list. The article's permissions table says: "To add contributors to a workspace: Content Admin role." A Salesforce Admin is not listed as having automatic access — they must be added as a contributor like any other user.

**Source 2: "Role-Based Access in Salesforce CMS"**
URL: https://help.salesforce.com/s/articleView?id=xcloud.cms_access_control_overview.htm&type=5

The article confirms the same three roles. It adds this important clarification about the Salesforce Admin:

> "Your Salesforce admin can control who has access to what in all of the Digital Experiences app (previously named Salesforce CMS) and your Experience Cloud sites."

And in the example table showing workspace contributor assignments, the "Salesforce admin" appears as an entry in the Contributors column alongside named workspace roles — meaning the Salesforce Admin is listed as a *person* who happens to be present in the workspace as a contributor, not as a fourth role type. The example explicitly shows: "Salesforce admin / Site admin as content admin / Marketing writer as content manager."

This means the Salesforce Admin is a *person*, not a role. They still need to be explicitly added to each workspace. The phrase "Salesforce admin can control who has access" refers to their org-level admin permissions in setup — not automatic access to all CMS workspace content.

**Also found: Workspace deletion is now possible**
The agentic marketer article (fetched for Item 2) contains this line at the end:
> "Workspaces, as of Summer '25, can now be deleted."

This directly contradicts the existing gotcha in salesforce-cms.md which states "Workspaces cannot be deleted." The gotcha was sourced from marcloudconsulting.com and is now outdated. Flag for correction in the main research file.

### Corrected role table for the module

| Role | Capabilities |
|------|-------------|
| Content Admin | Full content control; manages contributors, sharing, channels; can assign default brand; can publish |
| Content Manager | Full content access; can create and publish all content; can assign default brand |
| Content Author | Can view, edit, and create content; cannot publish independently |

The Salesforce org Admin can administer the Digital Experiences app at the setup level (controlling who accesses what across the entire app) but does not automatically have contributor access to individual workspaces. They must be added as a Content Admin to each workspace they need to work in.

**Navigation to add contributors (confirmed from official docs):**
MCA App > Content > [workspace] > Settings (gear icon) > Contributors > Add Contributors > search user > click + > Next > assign role > Finish

---

## Item 2: Approval Workflow Gotcha — Source and Detail

**Claim being verified:** "if you enable the approval workflow on a workspace but do not actively manage it, content authors submit work and it disappears from their view pending review."

**Verdict: The gotcha is directionally correct but the specific phrasing about content "disappearing" is not precisely what the source says. The accurate description is more nuanced — and the official Salesforce docs give much richer detail about what actually happens.**

### What the-agentic-marketer.com actually says

URL: https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/

Section: "5/ Disable Approval Workflows"

Direct quotes from the page:

> "By default, you can trigger a Flow from every Asset, so that your Asset is approved prior to Publishing. Even though Marketing Cloud Growth and Advanced creates a basic Approval Flow during the CMS setup, you still need to setup your own process and you can also create your own Flow (this is a Specific Flow type)."

> "You can disable the Approval Workflow if you don't use it, so it's not confusing for your users."

> "You may also completely disable any Approval Workflow by switching the 'Workflows and Approvals' from 'On' to 'Off'. There you have it, now you don't see the Approval Process from your Assets."

The source does NOT contain the phrase "content disappears from their view." That specific phrasing was an inference made during original research, not a direct quote. The source's actual concern is that the workflow is *confusing for users* if not actively managed.

**Navigation to disable (confirmed from source):** Workspace main page > Settings (Gear) > Workflow > toggle "Workflows and Approvals" from On to Off. You can also selectively disable per asset type by moving assets between the Select and Available columns.

### What Salesforce official docs say about the approval workflow mechanics

**Source: "Anatomy of the Basic Approval Request Workflow"**
URL: https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows_basic_approval.htm&type=5

**Source: "CMS Workflows and Approvals" overview**
URL: https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows.htm&type=5

Key confirmed facts:

1. **Workflows and Approvals are automatically turned on in all enhanced CMS workspaces.** Direct quote: "Workflows and Approvals are automatically turned on in all CMS enhanced workspaces."

2. **The workflow is built on Flow Orchestration.** It is not a simple checkbox — it is a multi-stage orchestrated process.

3. **What actually happens when a content author submits for review:**
   - Stage 1 "Initiate Content Review Request": The author submits via the "Submit Content for Review" screen flow. A background step called "Prevent Content Publication" runs — the content **cannot be published** for the duration of the workflow. Another step "Allow Content Edits" permits editing during this stage.
   - Stage 2 "Review Content": A step called "Prevent Content Modifications" runs — **the content is locked for editing**. The "Approve or Request Revision" step directs the request to the Content Manager role. The Content Manager can approve or request revision.
   - If approved: moves to "Ready Content for Publication" — the Content Author is notified. Content is then unlocked for publication.
   - If revision requested: moves back to "Revise Content" — content edits are re-allowed, and the author can revise and resubmit.
   - Authors can also "Withdraw Review Request" at any point to pull content back.

4. **What the author can see:** The workflow provides "a full audit trail of each assigned or completed step." Authors can see workflow status on the content detail page. Authors are explicitly notified when their content is approved (via the "CMS: Notify Content Author" screen flow). The content does not silently disappear — the author can see where it is in the process and withdraw it.

5. **The real gotcha:** If workflows are on but nobody has been assigned as a Content Manager to act as reviewer, submitted content will be stuck in the "Review Content" stage indefinitely. Content authors will see content locked in a pending state. This is the actual problem. It is not that the content disappears — it is that the workflow stalls with no reviewer.

**Corrected gotcha wording for the module:**

"Enhanced CMS workspaces have approval workflows turned on by default. If your team is not using an approval process, disable it: Workspace > Settings (Gear) > Workflow > toggle 'Workflows and Approvals' to Off. If the workflow is left on but no Content Manager is actively monitoring it, submitted content becomes locked for editing and cannot be published — it stalls in the Review Content stage with no one to approve it."

---

## Item 3: Multilingual — Export Format

**Claim being verified:** "translation exports produce an XML file"

**Verdict: WRONG. The format is XLF (XLIFF), not XML. The export is a .zip archive of .xlf files.**

### What the docs say

**Source: "Work with Enhanced CMS Content in the Translation Lifecycle"**
URL: https://help.salesforce.com/s/articleView?id=xcloud.cms_translation_lifecycle.htm&type=5

Direct quotes:

> "The selected content is exported to a separate .xlf file for each enhanced CMS workspace language. Depending on the amount of content that you export, the process can take time to finish. You receive a notification email with a link to download a .zip archive of the .xlf files."

> "Take the .xlf file from your localization service and create a .zip archive. Keep the .zip archive locally available."

**Source: "Translate Salesforce CMS Content" overview**
URL: https://help.salesforce.com/s/articleView?id=xcloud.cms_translations_overview.htm&type=5

This confirms the workflow summary: "Identify content to be translated, export it for your localization partner, import the translated content, and publish it to CMS channels."

### Full translation workflow (confirmed from official docs)

1. Add languages to the workspace (prerequisite — done in workspace settings)
2. Select one or more content items in the enhanced CMS workspace
3. Click Manage | Export — select languages from Available Languages, add to Languages to Export, click Export
4. Receive email with link to download a .zip archive of .xlf files (one .xlf per language)
5. Send .xlf files to localization partner
6. Receive translated .xlf files back; create a .zip archive of them
7. In enhanced CMS workspace, click Manage | Import — upload the .zip archive
8. Translated variants appear in Draft status in the workspace
9. Review the translated variants by clicking the content title > Content Variant Details > select language from dropdown
10. Publish the managed content — all variants publish at the same time

**Permission required:** Content Admin or Content Manager role in the workspace (Content Authors cannot export/import translations)

**Cross-org limitation:** Direct quote: "You can't export and import translations across different orgs." The workaround is to export from the target org, translate, and reimport — or to translate in the source org and export content with translations included.

**XLIFF vs XML:** XLF files are technically a subset of XML (XLIFF is an XML-based standard for translation interchange). However, the format is not generic XML — it is specifically XLIFF (.xlf). The module should say "XLIFF file (.xlf)" not "XML file."

**How translated content is selected in an email/flow:** The docs do not explicitly describe how language variants are selected during campaign sends. The research file notes this as unconfirmed. The translation lifecycle article says variants "publish to CMS channels" — the mechanism for language selection at send time (e.g., recipient language field, flow step, or manual selection) is not described in the docs reviewed here. Flag for further research or SDO testing.
<!-- VERIFY: How does MCA select which language variant to send to a recipient? Is there a merge field, flow step, or explicit selection in the email builder? -->

---

## Item 4: Import/Export — Data Graph Association

**Claim being verified:** "imported content will be associated to the default data graph that was used in the workspace/org where the content was exported from."

**Verdict: CANNOT CONFIRM. No mention of data graphs in any CMS import/export documentation. The claim appears to be invented — remove it.**

### What the docs say

**Source: "Export and Import Content with Salesforce CMS"**
URL: https://help.salesforce.com/s/articleView?id=xcloud.cms_import_export_overview.htm&type=5

This is the official CMS import/export overview. It covers:
- Export format: JSON files in .zip archives (content.json per item in enhanced workspaces)
- What exports: content properties, metadata, media files, translation variant definitions
- Cross-org transfer: supported by exporting .zip archives and importing to target org
- CMS Collection components are NOT included in export/import — must be recreated manually

There is **no mention of data graphs anywhere** in this article. The article does not reference Data 360, data graph associations, Unified Individual, or any personalization infrastructure being baked into exported assets.

**Source: agentic-marketer.com (Item 2 research)**
Direct quote: "The full definition of the exported assets is stored in JSON files, which include content properties, metadata, media files, and translation variant definitions."

Again, no mention of data graphs.

**Assessment:** CMS assets (emails, content blocks, images, landing pages) are content objects stored in CMS workspaces. Data graphs are a Data 360 construct used for personalization at send time — they are not baked into the asset definition itself. An exported email's JSON file describes the email structure and content, not the data graph it was configured to use. The draft warning about data graph associations has no documentary basis. **Remove it.**

**What actually is worth warning about for import/export:**
- CMS Collection components are not included in exports and must be recreated in the target workspace (confirmed from official docs, direct quote: "CMS Collection components aren't included when you import or export in Salesforce CMS. Recreate your CMS Collection in the CMS destination org.")
- Content that references other content (e.g., an email referencing an image) requires the referenced content to be imported first, or already exist in the target workspace
- Translations cannot be exported/imported across different orgs directly
- Subfolder structure is lost on import — content from subfolders lands at the root level in the destination (direct quote: "When you export content that's nested in subfolders from a CMS workspace, all of the content is imported at the root folder in the main workspace view.")

---

## Additional Corrections Found

### Workspace deletion (existing gotcha is outdated)
The existing salesforce-cms.md file states: "Once a workspace is created, it cannot be deleted."
**This is now incorrect.** The agentic-marketer.com article (fetched 2026-08-25) states: "Workspaces, as of Summer '25, can now be deleted."
Update the gotcha to reflect this change. The source is a practitioner blog (not an official Salesforce Help article), so flag for SDO verification.
<!-- VERIFY: Confirm in a live SDO that workspace deletion is now possible. The agentic-marketer source says Summer '25. -->

### Navigation update for adding contributors
The original research file listed the navigation path as: "App Launcher > Digital Experiences (or Salesforce CMS) > select workspace > Contributors > Add Contributors"
The official MCN help article (fetched 2026-08-25) gives the correct path as:
**MCA App > Content > [workspace] > Settings icon > Contributors > Add Contributors**
This path starts from within the MCA app itself, not the App Launcher. Both paths likely work, but the MCA-native path is what the MCN docs describe.

---

## Source Log

- https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_setup_contributors_workspace.htm&type=5 — Fetched successfully via Playwright. Official MCN doc. Confirmed three roles only; no "Salesforce Admin" role listed.
- https://help.salesforce.com/s/articleView?id=xcloud.cms_access_control_overview.htm&type=5 — Fetched successfully via Playwright. xcloud CMS role-based access overview. Confirmed Salesforce Admin is a person who administers the app, not a workspace role.
- https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows.htm&type=5 — Fetched successfully via Playwright. Confirmed workflows auto-enabled in all enhanced workspaces.
- https://help.salesforce.com/s/articleView?id=xcloud.cms_workflows_basic_approval.htm&type=5 — Fetched successfully via Playwright. Full anatomy of the approval workflow with stage-by-stage detail.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/unlock-cms-workspaces/ — Fetched successfully. Found the source passage on approval workflow disable. Also found workspace deletion update (Summer '25).
- https://help.salesforce.com/s/articleView?id=xcloud.cms_translations_overview.htm&type=5 — Fetched successfully via Playwright. High-level index; no format detail.
- https://help.salesforce.com/s/articleView?id=xcloud.cms_translation_lifecycle.htm&type=5 — Fetched successfully via Playwright. Confirmed .xlf (XLIFF) format. Full translation workflow documented.
- https://help.salesforce.com/s/articleView?id=xcloud.cms_import_export_overview.htm&type=5 — Fetched successfully via Playwright. No mention of data graphs. JSON + .zip format confirmed. CMS Collections not exported.
