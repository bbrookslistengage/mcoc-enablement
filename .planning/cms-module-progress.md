# CMS Module Progress: Building the LEOptical Content Library

Last updated: 2026-08-28

## What we're building

Module: `docs/part-3-content/salesforce-cms/building-leoptical-content-library.md`

This module walks learners through setting up the LEOptical Marketing CMS workspace:
folder structure, brand assets upload, Brand object creation, and six reusable content blocks.

We are populating the SDO live via Playwright and capturing screenshots to replace all
`<ScreenshotPlaceholder />` components in the module.

---

## Org details

- Org URL: `https://li1786119238808.lightning.force.com`
- Workspace: **LEOptical Marketing** (`mcsId=0Zufj000005mjBFCAY`)

### Known folder IDs

| Folder | ID |
|--------|----|
| Brand Assets | `9Pufj000006nCfhCAE` |
| Product Images | `9Pufj000006n2fdCAA` |
| Product Images > Visionaire UltraLux | `9Pufj000006nCkXCAU` |
| Product Images > Visionaire ChromaShift | `9Pufj000006nCm9CAE` |
| Product Images > SeeClear DailyFocus | `9Pufj000006n0ltCAA` |
| Product Images > SeeClear SunSync | `9Pufj000006nCnlCAE` |
| Email Content Blocks | `9Pufj000006nChJCAU` |
| Email Content Blocks > Headers | `9Pufj000006nCz3CAE` |
| Email Content Blocks > Footers | `9Pufj000006nD0fCAE` |
| Email Content Blocks > Product Blocks | `9Pufj000006nD2HCAU` |
| Year-2026 | (unknown) |

### Direct URL pattern for creating image assets

```
https://li1786119238808.lightning.force.com/cmsAuthor/contentEditor.app
  ?wsOrFolderId={FOLDER_ID}
  &contentTypeFQN=sfdc_cms__image
  &mode=create
  &retUrl=...
```

For Brand: use `contentTypeFQN=sfdc_cms__brand`
For Content Block: Email: use `contentTypeFQN=sfdc_cms__contentBlock`

---

## Progress checklist

### Folder structure
- [x] Brand Assets folder created
- [x] Product Images folder created
- [x] Product Images > Visionaire UltraLux subfolder created
- [x] Product Images > Visionaire ChromaShift subfolder created
- [x] Product Images > SeeClear DailyFocus subfolder created
- [x] Product Images > SeeClear SunSync subfolder created
- [x] Email Content Blocks folder created
- [x] Email Content Blocks > Headers subfolder created
- [x] Email Content Blocks > Footers subfolder created
- [x] Email Content Blocks > Product Blocks subfolder created
- [x] Year-2026 folder created

### Brand assets uploaded
- [x] `leoptical-logo-primary` uploaded to Brand Assets (Draft)
- [x] `leoptical-logo-white` uploaded to Brand Assets (Draft)
- [x] `visionaire-ultralux` uploaded to Product Images > Visionaire UltraLux (Draft)
- [x] `visionaire-chromashift` uploaded to Product Images > Visionaire ChromaShift (Draft)
- [x] `seeclear-dailyfocus` uploaded to Product Images > SeeClear DailyFocus (Draft)
- [x] `seeclear-sunsync` uploaded to Product Images > SeeClear SunSync (Draft)

### LEOptical Brand object
- [x] Brand created with name "LEOptical"
- [x] Accent color set: `#11284f`
- [x] Text color set: `#1e2a35`
- [x] Typography: Base = Trebuchet MS, H1/H2 = Georgia
- [x] Button style configured (Primary: 30px custom radius, navy `#11284f`, white text)
- [x] Brand saved and published
- [x] Brand set as workspace default

### Content blocks
- [x] LEO-Header-Standard created and published
- [x] LEO-Footer-Standard created and published
- [x] LEO-Product-VisionaireUltraLux created and published
- [x] LEO-Product-VisionaireChromaShift created and published
- [x] LEO-Product-SeeClearDailyFocus created and published
- [x] LEO-Product-SeeClearSunSync created and published

---

## Screenshots captured

| File | Status | Replaces placeholder |
|------|--------|---------------------|
| `static/img/building-leoptical-content-library/01-brand-assets-logos.png` | Captured | Brand Assets folder showing both logos |
| `static/img/building-leoptical-content-library/02-brand-editor-buttons.png` | Captured | Brand editor Buttons section |
| `static/img/building-leoptical-content-library/03-brand-saved.png` | Captured | Brand editor after save |
| `static/img/building-leoptical-content-library/04-brand-published.png` | Captured | Brand editor after publish |
| `static/img/building-leoptical-content-library/05-brand-default-setting.png` | Captured | Default Brand dialog with LEOptical selected |
| `static/img/building-leoptical-content-library/06-brand-workspace-default-saved.png` | Captured | Success toast: default brand saved |
| `static/img/building-leoptical-content-library/07-content-block-editor-empty.png` | Captured | Empty Content Block: Email editor |
| `static/img/building-leoptical-content-library/08-header-block-published.png` | Captured | LEO-Header-Standard after publish |
| `static/img/building-leoptical-content-library/09-footer-block-saved.png` | Captured | LEO-Footer-Standard saved |
| `static/img/building-leoptical-content-library/10-product-block-ultralux.png` | Captured | LEO-Product-VisionaireUltraLux canvas (representative) |
| `static/img/building-leoptical-content-library/11-product-blocks-folder.png` | Captured | Product Blocks folder with 4 published blocks |
| `static/img/building-leoptical-content-library/12-content-block-picker.png` | Captured | Content block picker dialog (Email Content Blocks level) |
| `static/img/building-leoptical-content-library/13-product-blocks-picker.png` | Captured | Content block picker showing 4 product blocks |
| `static/img/building-leoptical-content-library/14-cms-workspaces.png` | Captured | CMS Workspaces page with LEOptical Marketing listed |
| `static/img/building-leoptical-content-library/15-workspace-folders.png` | Captured | Workspace root with 4 top-level folders |
| `static/img/building-leoptical-content-library/16-contributors-panel.png` | Captured | Contributors panel showing Content Admin role |
| `static/img/building-leoptical-content-library/17-add-menu.png` | Captured | Add dropdown menu showing Content and Folder options |
| `static/img/building-leoptical-content-library/18-add-content-type-picker.png` | Captured | Create CMS content dialog with all content types |
| `static/img/building-leoptical-content-library/19-add-image-dialog.png` | Captured | Add Image form with Title, Alt Text, and upload area |
| `static/img/building-leoptical-content-library/20-block-detail-published.png` | Captured | LEO-Header-Standard detail page showing Published status |

### All screenshots captured

No remaining screenshots needed. All 16 `<ScreenshotPlaceholder />` components have been replaced with real `<Screenshot />` components.

---

## What's left to do (in order)

All major tasks are complete:

- [x] Brand configuration (colors, typography, buttons)
- [x] Brand published and set as workspace default
- [x] All 6 content blocks created and published
- [x] Content blocks verified in email builder picker
- [x] All 16 ScreenshotPlaceholder components replaced with real Screenshots (20 screenshots captured total)
- [x] VERIFY comments resolved where confirmed (Brand editor fields, typography, default Brand path, content block picker, folder creation UI)
- [x] UI instructions updated to match actual Add > Content flow
- [x] Content linter run (0 errors, 4 VERIFY warnings remaining — image formats, link styling, unsubscribe mechanism, merge field syntax)

### Remaining

1. **Commit changes**

---

## Open questions / things to verify in SDO

- **Unsubscribe link mechanism**: Is it a merge field, a Link Type option, or a dedicated component in the email builder? Module currently says "use the platform's unsubscribe action" with a VERIFY flag.
- **Org address merge field syntax**: Is it `{!$organization.Address}` (classic) or `{{organization.Address}}` (Handlebars) in MCA content blocks?

### Resolved

- ~~**Brand as workspace default**~~: Confirmed. Setting is accessed from the workspace Content page via a gear/settings area. A "Default Brand" dialog allows selecting the Brand.
- ~~**Typography**~~: Confirmed. The Brand editor uses a Base Font Family dropdown (web-safe fonts only: Arial, Georgia, Trebuchet MS, Verdana, etc.). No custom font strings. Per-style overrides available for H1-H6, paragraph, button, input, label. LEOptical uses Trebuchet MS base, Georgia for H1/H2.
- ~~**Content block picker location**~~: Confirmed. It is a **modal dialog** titled "Select content block". Appears after dragging a Content Block component onto the email canvas and clicking "Select Block" in the property panel. Shows a table with folder navigation, content title, status, last modified date, and last modified by columns.

---

## Notes on Brand editor behavior

- The `Add > Content` menu shows a full content type picker dialog.
- In the dialog, clicking the row header (not the radio button) selects the type.
- However, the picker was buggy — the radio remained on Audio regardless of row selection. Workaround: navigate directly to the create URL with `contentTypeFQN=sfdc_cms__image` (or `sfdc_cms__brand`).
- The Brand editor uses collapsible accordion sections: Brand Details, Colors, Typography, Buttons, Margin and Padding, Borders.
- Colors opens a flyout dialog with 5 fields: Accent, Accent Contrast, Background, Text, Border.
- Typography uses a single Base Font Family dropdown (web-safe fonts only, no custom strings) plus per-style overrides for H1-H6, paragraph, button, input, label.
- The live preview panel on the right updates in real time as colors change.
