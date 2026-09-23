# Email Builder Screenshots — Progress Tracker

## Captured Screenshots (27 files)

### `static/img/email-builder/` (15 files — for The Email Builder reference module)

| # | Filename | What it shows | Used at |
|---|----------|---------------|---------|
| 1 | `01-email-creation-method.png` | Email creation method dialog (Template / Components / HTML) | Not mapped to a placeholder (bonus discovery) |
| 2 | `02-full-builder-interface.png` | Full builder: Components Panel, canvas, Property Panel, top bar | index.md line 44 ✅ |
| 3 | `03-components-basics-tab.png` | Basics tab with all 6 components | index.md line 102 ✅ |
| 4 | `04-components-layout-tab.png` | All 3 sections expanded (Basics, Layout, Media) | index.md line 131 ✅ |
| 5 | `05-property-panel-settings.png` | Settings tab: Message Purpose, Brand, Subject Line | index.md line 469 ✅ |
| 6 | `06-data-sources-empty.png` | Data Sources tab before connecting | Not mapped (bonus) |
| 7 | `07-data-sources-connected.png` | Data Sources with Data Graph auto-connected | index.md line 274 ✅, building.md line 81 ✅ |
| 8 | `08-component-toolbar.png` | Component toolbar: heading level, font, merge fields, etc. | index.md line 61 ✅ |
| 9 | `09-section-property-panel.png` | Section Settings: Column Layout presets, Number of Columns | index.md line 123 ✅ |
| 10 | `10-heading-style-panel.png` | Heading Style tab: font, size, formatting, colors | index.md line 256 ✅ |
| 11 | `11-merge-field-picker.png` | Merge field picker categories | index.md line 299 ✅ |
| 12 | `12-preview-dialog.png` | Preview dialog (segment, recipient, Generate Preview) | index.md line 419 (used 13 instead) |
| 13 | `13-preview-recipients.png` | Preview with recipient dropdown open | index.md line 419 ✅ |
| 14 | `14-test-send-dialog.png` | Test Send tab | index.md line 436 ✅ |
| 15 | `15-preview-mobile.png` | Mobile preview | index.md line 421 ✅ |

### `static/img/building-leoptical-emails/` (12 files — for Building LEOptical Emails walkthrough)

| # | Filename | What it shows | Used at |
|---|----------|---------------|---------|
| 1 | `01-content-type-picker-email.png` | CMS content type picker with Email selected | building.md line 41 ✅ |
| 2 | `03-subject-line-preheader.png` | Subject line + preheader populated in canvas | building.md line 69 ✅ |
| 3 | `05-section-navy-background.png` | Section Style: Custom colors, navy background | building.md line 95 ✅ |
| 4 | `07-hero-heading-white.png` | Hero H1 white text on navy (canvas crop) | building.md line 122 ✅ |
| 5 | `08-hero-complete.png` | Full builder with completed hero section | building.md line 138 ✅ |
| 6 | `12-section-2column-config.png` | Section Property Panel: 2-column equal, 6|6 distribution | building.md line 186 ✅ |
| 7 | `14-product-section-2col.png` | Full builder showing 2-column section in canvas | building.md line 203 (partial) |
| 8 | `19-email-full-view.png` | Full builder with hero + 2-column sections | building.md line 313 (partial) |
| 9 | `20-desktop-preview.png` | Desktop preview dialog with recipient selected | building.md line 322 ✅ |
| 10 | `21-mobile-preview.png` | Mobile preview | building.md line 328 ✅ |
| 11 | `22-test-send-dialog.png` | Test Send tab | building.md line 340 ✅ |
| 12 | `24-save-publish-buttons.png` | Top bar: Save, Publish, Preview buttons | building.md line 363 ✅ |

## Remaining Placeholders

### `index.md` — 5 remaining

1. **Line 149** — Image component source panel (CMS vs Merge Field options)
2. **Line 193** — 2-column section with Image left, Heading+Paragraph+Button right
3. **Line 203** — Builder canvas in Mobile view mode (not preview — the builder itself)
4. **Line 217** — Section property panel: Stack columns on mobile checkbox, device visibility
5. **Line 380** — Repeater component configured on canvas with Property Panel

### `building-leoptical-emails.md` — 12 remaining

1. **Line 103** — Header section: navy bg, white LEOptical logo
2. **Line 161** — Merge field picker: Data Graph > firstName highlighted
3. **Line 163** — Heading with firstName merge field token inline
4. **Line 172** — Paragraph with loyalty tier merge field token inline
5. **Line 196** — Image component upload flow
6. **Line 203** — 2-column product section fully populated
7. **Line 221** — List component with 4 bullet points
8. **Line 244** — HTML component rendered (promo code banner)
9. **Line 269** — Footer section (compliance links, org address)
10. **Line 285** — Subject line with firstName merge field token
11. **Line 313** — Complete email scrolled top to bottom (all 8 sections)
12. **Line 349** — Test email received in inbox (external screenshot needed)

## Observations / Content Corrections Needed

1. **Merge field categories** — The module text describes categories as "Data Graph attributes (Primary Objects / Related Objects), Organization, Links, Other, Saved Expressions". The actual picker shows: **Organization, Recipient, Sender, Other, Link, Data Graph**. "Recipient" and "Sender" are categories not mentioned.

2. **Test Send fields** — The module text describes separate "From Name" and "From Address" fields. The actual UI has a combined **"From Name and Address"** search field.

3. **Email creation flow** — There's an intermediate "Select an email creation method" dialog (Template / Use Components / Create with HTML) that isn't mentioned in the walkthrough. Screenshot captured as `email-builder/01-email-creation-method.png`.

4. **Data Graph auto-connection** — The Data Graph loads automatically as "Default" when opening the email editor. The module text mentions this as a possibility; it's confirmed.

5. **Color overrides** — Overriding Brand colors requires two steps: (a) changing Color Scheme from "Inherited" to "Custom" for sections, or (b) clicking a "Customize color" chain-link icon for individual components. The module text could be more specific about this.
