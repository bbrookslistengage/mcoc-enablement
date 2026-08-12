# VERIFY Comment Inventory

Tracks all `<!-- VERIFY -->` / `{/* VERIFY */}` comments across the course docs. Updated as items are resolved.

Legend: ✅ Confirmed | ❌ Removed (claim dropped) | ⏭ Skipped (needs SDO access) | 🔲 Unresolved

---

## `part-1-foundations/consent-fundamentals.md`

| # | Item | Status |
|---|------|--------|
| 1 | `ConsentAuditTrailV2` DLO exists and is unmapped in a live SDO | ✅ Confirmed 2026-08-12 |
| 2 | Nav path for Consent Imports: Marketing Cloud App > Consent > Consent Imports > Import | ✅ Confirmed 2026-08-12 |
| 3 | Deleting a Comm Sub deletes (not orphans) all related Comm Sub Consent records | ✅ Confirmed 2026-08-12 |

---

## `part-1-foundations/consent-configuration.md`

| # | Item | Status |
|---|------|--------|
| 1 | Nav path to org-wide consent settings: Setup > Marketing Cloud > Assisted Setup > Channels > Email > Manage Consent Validation | ✅ Confirmed 2026-08-12. Screenshot added (02-consent-toggles.png). |

---

## `part-2-data/segmentation/index.md`

| # | Item | Status |
|---|------|--------|
| A | Segment type count, cadence, data window, activation targets | ✅ Confirmed 2026-08-12. Fixed: 4 types (not 5), "Nested" is not a type. |
| B | 1:1 related DMOs surface as Direct Attributes in the sidebar | ✅ Confirmed 2026-08-12 |
| C | Loyalty Program Member DMO appears under Direct vs Related Attributes | ⏭ Skipped — needs SDO check |
| D | "Is In" operator for text and "Last Number Of Days" for date exist in Summer '26 UI | ✅ Confirmed 2026-08-12 |
| E | Lookback window location: segment level, container level, or both | ✅ Confirmed 2026-08-12. Set once in segment creation wizard, segment-level only. |
| F | Max filters per container (was cited as 20) | ❌ Removed — claim dropped from content |
| G | Max nesting depth for segments (conflicting: 5 vs 10) | 🔲 Unresolved |
| H | Traversal path prompt UI: inline on canvas or modal dialog | 🔲 Unresolved |
| I | Exact UI labels: "Copy criteria" and "Use last published" | 🔲 Unresolved |
| J | Rank and limit: available in builder, segment vs container level, options | 🔲 Unresolved |
| K | Nested segments: max depth, can Dynamic or Error/Inactive segments be nested | 🔲 Unresolved |
| L | Segment statuses: Recounting, Deferred, Skipped as distinct statuses | ✅ Confirmed 2026-08-12. Fixed: split into Segment Status and Publish Status tables per official docs. |
| M | Technical description of first publish process accuracy | 🔲 Unresolved |
| N | First publish timing in SDO with LEOptical seed data (~48k contacts) | 🔲 Unresolved |
| pre-publish status | What status a never-published segment shows in UI (was "Draft", not in official list) | 🔲 Unresolved — new VERIFY added |

---

## `part-2-data/segmentation/building-leoptical-segments.md`

| # | Item | Status |
|---|------|--------|
| — | 13 unresolved items | 🔲 Not yet reviewed |

---

## `part-1-foundations/domain-setup/link-branding.md`

| # | Item | Status |
|---|------|--------|
| — | 1 unresolved item | 🔲 Not yet reviewed |

---

## `part-2-data/working-with-data-360/ingesting-external-data.md`

| # | Item | Status |
|---|------|--------|
| — | 2 unresolved items | 🔲 Not yet reviewed |

---

## `part-2-data/data-graphs/index.md`

| # | Item | Status |
|---|------|--------|
| — | 1 unresolved item | 🔲 Not yet reviewed |

---

## `part-1-foundations/domain-setup/authenticated-domain.md`

| # | Item | Status |
|---|------|--------|
| — | 5 unresolved items | 🔲 Not yet reviewed |

---

## `part-1-foundations/domain-setup/landing-page-domain.md`

| # | Item | Status |
|---|------|--------|
| — | 1 unresolved item | 🔲 Not yet reviewed |

---

## `part-2-data/data-graphs/configuring-leoptical-data-graph.md`

| # | Item | Status |
|---|------|--------|
| — | 3 unresolved items | 🔲 Not yet reviewed |

---

## `part-1-foundations/business-units/cms-workspaces.md`

| # | Item | Status |
|---|------|--------|
| — | 2 unresolved items | 🔲 Not yet reviewed |

---

## `part-1-foundations/business-units/permission-sets.md`

| # | Item | Status |
|---|------|--------|
| — | 2 unresolved items | 🔲 Not yet reviewed |

---

## `part-2-data/identity-resolution/index.md`

| # | Item | Status |
|---|------|--------|
| — | 2 unresolved items | 🔲 Not yet reviewed |

---

## `part-2-data/identity-resolution/configuring-idr.md`

| # | Item | Status |
|---|------|--------|
| — | 3 unresolved items | 🔲 Not yet reviewed |

---

## `part-1-foundations/business-units/bu-architecture.md`

| # | Item | Status |
|---|------|--------|
| — | 3 unresolved items | 🔲 Not yet reviewed |
