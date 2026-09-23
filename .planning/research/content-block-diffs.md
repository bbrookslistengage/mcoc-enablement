# Content Block Diffs: Current SDO State vs Reference HTML Mockups

> Reference mockups live in `.planning/email-mockups/block-*.html`
> This document catalogs every difference so another agent can pick up and fix them.

## Guiding Principle: OOTB First, Custom Only When Required

The content block editor inherits styles from the **LEOptical Brand**. The brand defines heading styles (H1-H6), paragraph styles, button types, color schemes, padding presets, and border radius presets. **Always prefer using the OOTB brand presets over Custom overrides.**

Why this matters:
- Brand presets keep blocks consistent across the workspace. If the brand is updated later, preset-based blocks update automatically.
- Custom overrides are brittle. They are per-component and don't inherit brand changes.
- The reference HTML mockups are *design specs*, not pixel-perfect rendering targets. A close match using OOTB presets is better than a pixel-exact match using all Custom overrides.

### Decision framework for each property

1. **Does an OOTB preset match exactly?** Use it. (e.g., Heading Style 3 = Trebuchet MS Bold 18px = use it for 18px bold headings)
2. **Does an OOTB preset match closely (within 1-2px)?** Use the preset. A 16px paragraph is close enough to a 15px spec. Don't override to Custom for 1px.
3. **Is the value far from any preset?** Use Custom. (e.g., 11px eyebrow text, 10px labels, 22px Georgia heading — no presets match these)
4. **Is the font family different from the brand default?** Use Custom for the heading/paragraph style, then set the font family. (e.g., Georgia for a serif heading, Arial for a label — both differ from the brand's Trebuchet MS)

### OOTB Preset Reference (LEOptical Brand)

| Preset | Approx px value | Use for |
|--------|----------------|---------|
| Tiny | ~8px | — |
| Small | ~12px | Footer text (12px spec) |
| Medium | ~16px | Body copy (15-16px spec) |
| Large | ~18px | H3 headings (18px spec) |
| Extra Large | ~24px | — |
| Huge | ~32px | — |

**Heading Style 3** = Trebuchet MS Bold 18px. Matches the product name, feature heading, and loyalty value specs.

**Paragraph 1** = Trebuchet MS Medium (16px). Matches the feature block body copy (16px) and is close enough for 15px specs (Product Card description, CTA supporting copy). Use Paragraph 1 for these unless the 1px difference is visually obvious.

**Primary button** = Navy fill, white text, pill shape. Matches Product Card button spec.

**Secondary button** = Outline (navy border, navy text) on white backgrounds; inverted (white fill, navy text) on dark backgrounds. Matches Feature Block and CTA Banner button specs.

### When Custom IS required

These values have no close OOTB preset and need Custom:
- **Eyebrow labels** (11px, bold, accent blue `#5f8ec7`, uppercase) — appears in Product Card, Feature Block, CTA Banner
- **Status bar labels** (10px, bold, muted `#617084`, uppercase) — appears in Loyalty Status Bar
- **Georgia serif heading** (22px, bold) — appears in CTA Banner only
- **Accent blue text color** (`#5f8ec7`) — not a section-inherited color, must be customized per-component
- **Muted text color** (`#617084`) — for labels and footer text, must be customized per-component
- **Non-standard padding** — 20/24 for header, 16/20 for loyalty bar, 32/24 for CTA banner

---

## Where to Find the Blocks

All 6 content blocks live in: **LEOptical Marketing** workspace > **Email Content Blocks** folder.

Some blocks may also be in subfolders (Headers, Footers, Product Blocks) if they were moved during the previous session. The Loyalty Status Bar, Feature Block, and CTA Banner Block are at the Email Content Blocks folder root.

To edit a block: navigate to the folder, click the block name to open its detail page, then click **Edit** to open the content block editor.

## How to Use This Document

For each block, open it in the content block editor, then apply the changes listed.

**All styling changes should be made via the Property Panel Style tab** (right side panel), not the inline canvas toolbar. The inline toolbar changes can be overridden by the Property Panel's preset.

**Key pattern for Custom overrides:** When the Property Panel shows a preset style (e.g., "Heading Style 3" or "Paragraph 1"), all font controls are locked/disabled. To override:
1. Change the style dropdown to **Custom** (unlocks Font Family, Font Size, Bold, etc.)
2. Change Font Size dropdown to **Custom** (unlocks the px value input)
3. Set the exact px value

Only do this when the OOTB preset doesn't match. Most headings and paragraphs should use presets.

---

## 1. LEOptical Header

**Reference:** `block-header.html`
**SDO block name:** `LEOptical Header`
**Built in previous session — needs visual verification.**

### Reference spec
- Section: bg `#11284f`, padding 20px top/bottom, 24px left/right
- 2-column layout (50/50)
- Left column: White logo image (`leoptical-logo-white.png`), max-height 36px, left-aligned
- Right column: Nav links "Shop   Rewards   Book Exam", Arial 13px, color `#dbe7f4`, right-aligned, no underline

### Checklist (OOTB vs Custom)

| Property | OOTB or Custom? | Action |
|----------|----------------|--------|
| Section bg `#11284f` | Use Accent color scheme if available, else Custom | Verify section color scheme |
| Section padding 20/24 | **Custom** (no preset matches) | Set Custom padding 20/24/20/24 |
| 2-column layout | OOTB "2 Columns" | Verify selected |
| Logo image | OOTB Image component + CMS source | Verify Brand Assets > leoptical-logo-white is selected |
| Nav text "Shop Rewards Book Exam" | Paragraph component | Verify text exists in right column |
| Nav font: Arial 13px | **Custom** (brand default is Trebuchet MS, 13px is between Small and Medium) | Paragraph Style Custom, Font Family Arial, Font Size Custom 13px |
| Nav text color `#dbe7f4` | **Custom** | Customize Text color in Colors section |
| Nav alignment: right | OOTB Format > Align right | Verify |

---

## 2. LEOptical Footer

**Reference:** `block-footer.html`
**SDO block name:** `LEOptical Footer`
**Built in previous session — needs visual verification.**

### Reference spec
- Section: bg `#f7fafc`, padding 24/24/32/24, border-top 1px, center-aligned
- Line 1: "Manage your email preferences | Unsubscribe" — Arial 13px, `#617084`, links underlined
- Line 2: "LEOptical, 100 Vision Way, Suite 400, Austin, TX 78701" — Arial 12px, `#617084`
- Line 3: "© 2026 LEOptical. All rights reserved." — Arial 12px, `#617084`

### Checklist (OOTB vs Custom)

| Property | OOTB or Custom? | Action |
|----------|----------------|--------|
| Section bg `#f7fafc` | OOTB Surface color if available, else Custom | Verify |
| Section padding 24/24/32/24 | **Custom** (bottom is 32, not uniform) | Set Custom padding, uncheck "Make all values equal" |
| Border-top 1px | **Custom** (top-only border) | Check if Border section allows top-only; if not, use Thin all-sides |
| Text alignment: center | OOTB Format > Align center | Verify on all paragraphs |
| Font: Arial 13px (links line) | **Custom** (Arial + 13px = no matching preset) | Paragraph Style Custom, Arial, Custom 13px |
| Font: Arial 12px (address, copyright) | **Custom** (closest OOTB is Small ~12px) | Try Small preset first. If Small = 12px, use it. If not exact, use Custom 12px |
| Text color `#617084` | **Custom** | Customize Text color on each Paragraph |

**Note:** If the current block uses a single Paragraph for all three lines, consider splitting into 2-3 Paragraph components to match the reference (13px for links, 12px for address/copyright). If splitting is too complex, keep as single Paragraph using Small (12px) for everything — the 1px difference on the link line is acceptable.

---

## 3. Product Card

**Reference:** `block-product-card.html`
**SDO block name:** `Product Card`

### Reference spec
- Section: bg `#f7fafc`, border 1px, border-radius 8px, padding 20px
- 2-column layout: image left, text+button right
- Eyebrow: "VISIONAIRE COLLECTION" — Trebuchet MS 11px bold, `#5f8ec7`, uppercase
- Product name: "Visionaire UltraLux" — Trebuchet MS 18px bold, `#1e2a35`
- Description: Trebuchet MS 15px, `#1e2a35`
- Button: "Shop UltraLux" — Primary type

### Checklist (OOTB vs Custom)

| Property | OOTB or Custom? | Action |
|----------|----------------|--------|
| Section bg `#f7fafc` | OOTB if brand has Surface scheme, else Custom | Verify |
| Section border | OOTB "Thin" weight | Verify |
| Section border-radius 8px | OOTB "Rounded" preset (if Rounded = 8px) | Verify; if Rounded != 8px, use Custom 8px |
| Section padding 20px | **Custom** (no exact preset) | Set Custom 20/20/20/20 |
| Eyebrow "VISIONAIRE COLLECTION" | **Custom** (11px, accent blue, bold — no preset matches) | Heading Style Custom, Trebuchet MS, Custom 11px, Bold, text color `#5f8ec7`. Text must be ALL CAPS. |
| Product name "Visionaire UltraLux" | **OOTB Heading Style 3** (Trebuchet MS Bold 18px = exact match) | Use Heading Style 3. Do NOT use Custom. |
| Description text | **OOTB Paragraph 1** (Trebuchet MS 16px — close to 15px spec) | Use Paragraph 1 preset. The 1px difference is acceptable. Only override to Custom 15px if visually too large. |
| Button "Shop UltraLux" | **OOTB Primary** | Verify Primary type and text |
| Product image | OOTB Image + CMS source | Verify Visionaire UltraLux image from CMS |

---

## 4. Loyalty Status Bar

**Reference:** `block-loyalty-status.html`
**SDO block name:** `Loyalty Status Bar`

### Reference spec
- Section: bg `#f7fafc`, border 1px, border-radius 6px, padding 16/20/16/20
- 2-column (50/50), left-aligned left, right-aligned right
- Labels: Arial 10px bold, `#617084`, uppercase
- Values: Trebuchet MS 18px bold, `#11284f`
- Vertical divider between columns (not achievable in editor)

### Checklist (OOTB vs Custom)

| Property | OOTB or Custom? | Action |
|----------|----------------|--------|
| Section bg `#f7fafc` | OOTB Surface if available | Verify |
| Section border | OOTB "Thin" | Verify |
| Section border-radius 6px | **Custom** (6px is between Square=0 and Rounded=8) | Set Custom 6px |
| Section padding 16/20/16/20 | **Custom** | Set Custom, uncheck equal |
| Column distribution 50/50 | OOTB equal columns | Verify (was previously skewed 11:1 — must be reset) |
| Labels "VISIONCARE REWARDS" / "POINT BALANCE" | **Custom** (10px, Arial, bold — no preset matches) | Heading Style Custom, Arial, Custom 10px, Bold, text color `#617084`. Text must be ALL CAPS. |
| Values "Gold Member" / "2,480 pts" | **OOTB Heading Style 3** would give 18px bold Trebuchet MS, BUT these are Paragraph components, not Headings. | Use Paragraph Style Custom, Trebuchet MS, Custom 18px (Large), Bold. If Large preset = 18px, use Large instead of Custom. Text color: customize to `#11284f` |
| Right column alignment | OOTB Format > Align right | Verify on both label and value in right column |
| Vertical divider | **Not possible** in OOTB block editor | Accept this limitation |

---

## 5. Feature Block

**Reference:** `block-feature.html`
**SDO block name:** `Feature Block`

### Reference spec
- Section: bg `#ffffff`, padding 24px
- 2-column layout: image+caption left, text+button right
- Left: SeeClear SunSync image + "SEECLEAR COLLECTION" caption
- Right: "FEATURED" eyebrow + "SeeClear SunSync" heading + body copy + "Learn More" outline button

### Current state (most incomplete block)
- Image in left column (blank placeholder)
- Heading: "Feature Heading" (wrong text)
- Paragraph: generic placeholder (wrong text)
- Button: "Learn More" Secondary (correct)
- Missing: eyebrow heading, image caption

### Checklist (OOTB vs Custom)

| Property | OOTB or Custom? | Action |
|----------|----------------|--------|
| Section bg white | OOTB (white is default) | Verify |
| Section padding 24px | OOTB preset if "Medium" or "Large" = 24px, else **Custom** | Check; Extra Large might be 24px |
| Image | OOTB Image + CMS source | Set to SeeClear SunSync image if available in CMS |
| Image caption "SEECLEAR COLLECTION" | **Custom** (11px, Arial, muted — no preset) | Add Paragraph below image. Paragraph Style Custom, Arial, Custom 11px, text color `#617084`. Type ALL CAPS. |
| Eyebrow "FEATURED" | **Custom** (11px, bold, accent blue — no preset) | Add Heading above existing heading. Heading Style Custom, Trebuchet MS, Custom 11px, Bold, text color `#5f8ec7`. Type ALL CAPS. |
| Heading "SeeClear SunSync" | **OOTB Heading Style 3** (Trebuchet MS Bold 18px = exact match) | Change text. Use Heading Style 3. Customize text color to `#11284f` if not inherited. |
| Body copy | **OOTB Paragraph 1** (Trebuchet MS 16px = exact match to spec) | Change text to reference copy. Use Paragraph 1 preset. |
| Button "Learn More" | **OOTB Secondary** | Already correct. Verify. |

---

## 6. CTA Banner Block

**Reference:** `block-cta-banner.html`
**SDO block name:** `CTA Banner Block`

### Reference spec
- Section: bg `#11284f`, padding 32/24/32/24, center-aligned
- Eyebrow: "ONE MORE THING" — Arial 11px bold, `#5f8ec7`, uppercase, centered
- Headline: "Your next eye exam is on us." — Georgia 22px bold, `#ffffff`, centered
- Copy: Trebuchet MS 15px, 80% white, centered
- Button: "Book Your Exam" — Secondary (inverted), centered

### Current state (partially fixed in this session)
- Navy background, white text color set on section
- "ONE MORE THING" eyebrow exists, centered, accent blue color set
- "Your next eye exam is on us." heading exists, Georgia font set, centered
- Paragraph text exists, centered
- "Book Your Exam" button exists, Secondary type

### Checklist (OOTB vs Custom)

| Property | OOTB or Custom? | Action |
|----------|----------------|--------|
| Section bg `#11284f` | Custom color scheme (navy bg with white text) | Already set. Verify. |
| Section padding 32/24/32/24 | **Custom** | Set Custom, uncheck equal: 32 top, 24 right, 32 bottom, 24 left |
| Eyebrow "ONE MORE THING" | **Custom** (11px, Arial, bold, accent blue — no preset) | Heading Style Custom, Arial, Custom 11px, Bold, text color `#5f8ec7`. **Verify 11px actually took effect** — was stuck at 18px in prior session. |
| Headline | **Custom** (Georgia 22px bold — unique font and size) | Heading Style Custom, Georgia, Custom 22px, Bold. Already partially set — verify all values via Property Panel. |
| Supporting copy | **OOTB Paragraph 1** (16px is close to 15px spec) | Use Paragraph 1 preset. The 1px difference is acceptable. Only use Custom 15px if visually off. |
| Copy text color | Accept `#ffffff` — the reference uses 80% opacity white which is not possible in hex-only editor | No change needed |
| Button | **OOTB Secondary** | Already set. Verify. |
| All text alignment | OOTB Format > Align center | Verify on eyebrow, headline, and paragraph |

---

## Priority Order

Fix blocks in this order (most incomplete first):
1. **Feature Block** — most changes needed (wrong text, missing components)
2. **CTA Banner Block** — verify font sizes from prior session actually persisted
3. **Product Card** — verify eyebrow styling and description font
4. **Loyalty Status Bar** — verify label/value styling and column distribution
5. **LEOptical Header** — verify layout and nav links
6. **LEOptical Footer** — verify font sizes and alignment

## Limitations to Accept

These reference design details cannot be replicated in the OOTB block editor:
- **Vertical divider** in Loyalty Status Bar (no vertical divider component)
- **Letter-spacing** on eyebrow/label text (no letter-spacing control in the editor)
- **Semi-transparent text color** like `rgba(255,255,255,0.8)` (editor uses hex only)
- **Max-width on paragraph** text (no max-width control per component)
- **Image border-radius** may not be controllable per-image in the block editor
