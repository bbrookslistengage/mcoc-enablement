# MCA Enablement Course - Project Progress

## Project Phases

### Phase 1: Planning and Infrastructure
- [x] Course design spec finalized
- [x] LEOptical client scenario and assignments spec finalized
- [ ] Writing style guide created
- [ ] Design token system defined
- [ ] Module template created
- [ ] Folder structure finalized
- [ ] Docusaurus initialized and configured
- [ ] Sidebar config matches module order (revised Part 3 order)
- [ ] Progress tracking component built (local storage checkboxes)
- [ ] Homepage designed and built
- [ ] Linting scripts for style enforcement

### Phase 2: Seed Data
- [x] `scripts/generate-seed-data.py` written (single source of truth for all CSVs)
- [x] `contacts.csv` generated (~48,675 Contacts with dirty data per spec)
- [x] `seed-products-campaigns.apex` anonymous Apex snippet written
- [x] `loyalty_members.csv` generated (with dirty data per spec)
- [x] `ecommerce_orders.csv` generated (with dirty data per spec, includes protagonist orders)
- [x] `exam_history.csv` generated (with dirty data per spec)
- [x] `new_signups_july.csv` generated
- [x] `new_orders_july.csv` generated
- [x] `new_contacts_batch1.csv` generated
- [x] All 10 protagonist contacts verified across all data files
- [ ] `SeedScript.tsx` updated to generate UPDATE script (not INSERT) for Module 4
- [ ] Dirty data inventory documented (what problems exist in which files)
- [ ] Seed data tested end-to-end in a clean SDO

### Phase 3: Static Assets
- [ ] LEOptical brand assets (logo, product images) created or sourced
- [ ] Netlify site HTML pages built (index, products, contact/appointment)
- [ ] Beacon/SDK placeholder code embedded in Netlify pages
- [ ] Netlify site packaged as downloadable zip
- [ ] HTML paste email snippet created (Module 13)

### Phase 4: Module Content
Written, reviewed, and verified against a live SDO.

| # | Module | Spec | Skeleton | Content | Screenshots | Verified |
|---|--------|------|----------|---------|-------------|----------|
| I-1 | How This Course Works | Done | - | Draft (0 VERIFY) | N/A | - |
| I-2 | MCA vs. MCE | Done | - | Draft (0 VERIFY) | N/A | - |
| I-3 | Introduction to Data 360 | Done | - | Draft (0 VERIFY) | N/A | - |
| I-4 | Navigating a New Platform | Done | - | Draft (0 VERIFY) | N/A | - |
| 1 | Getting Started | Done | - | Draft (9 VERIFY) | - | - |
| 2 | Domain Setup | Done | - | Draft (7 VERIFY) | - | - |
| 3 | Business Units and Governance | Done | - | Draft (8 VERIFY) | - | - |
| 4 | Consent Fundamentals | Done | - | Draft (3 VERIFY) | - | - |
| 5 | Consent Configuration | Done | - | Draft (4 VERIFY) | - | - |
| 6 | Working with Data 360 (multi-subpage) | Restructured | - | - | - | - |
| 7 | Identity Resolution (multi-subpage) | Restructured | - | Draft (5 VERIFY) | - | - |
| 8 | Data Graphs (multi-subpage) | Restructured | - | Draft (4 VERIFY) | - | - |
| 9 | Segmentation | Done | - | - | - | - |
| 10 | Consumption and Entitlements | Done | - | - | - | - |
| 11 | Salesforce CMS and Content Management | Done | - | - | - | - |
| 12 | Email Builder Deep Dive | Done | - | - | - | - |
| 13 | Personalization: Handlebars and AMPscript | Done | - | - | - | - |
| 14 | Flow Fundamentals | Done | - | - | - | - |
| 15 | Flow Orchestration | Done | - | - | - | - |
| 16 | Landing Pages and Forms | Done | - | - | - | - |
| 17 | Landing Pages: Advanced | Done | - | - | - | - |
| 18 | Activation Templates | Done | - | - | - | - |
| 19 | Messaging Channels | Deferred | - | - | - | - |
| 20 | Agentforce for Marketing | Done | - | - | - | - |
| 21 | Conversational Messaging | Deferred | - | - | - | - |
| 22 | Predictive AI | Done | - | - | - | - |
| 23 | Reporting and Dashboards | Done | - | - | - | - |
| 24 | Capstone Project | Deferred | - | - | - | - |

Status values: `-` (not started), `In Progress`, `Done`, `Blocked`

### Phase 5: Review and Polish
- [ ] All modules followed end-to-end in a fresh SDO by someone other than the author
- [ ] Cross-module references verified (e.g., "use the Campaign IDs from Module 1")
- [ ] "Coming from MCE?" callouts reviewed by an MCE-experienced consultant
- [ ] Seed data dirty data problems confirmed to surface where expected
- [ ] Dependency chain validated (no module references something not yet built)

## Open Items

Tracked here when they surface. Move to the relevant spec or module when resolved.

| Item | Context | Status |
|------|---------|--------|
| Identity event capture mechanism for web connector | Netlify site needs a way to link anonymous visitors to known Individuals. See spec for approaches. | Unsolved |
| Module 25 capstone requirements | Needs design after all other modules are finalized | Not started |
| Module 20 (Messaging Channels) scope | SMS/WhatsApp deferred. Decide whether to include as conceptual or remove entirely | Not started |
| Module 22 (Conversational Messaging) scope | Depends on Module 20. Same decision needed | Not started |

## Decisions Log

Record significant decisions here so we do not revisit them.

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-06 | No Opportunities in Apex seed | All purchase data comes from ecommerce CSV mapped to Sales Order / Sales Order Product |
| 2026-08-08 | CRM seed data via CSV import, not Apex batch | Single Python script generates all CSVs with consistent emails. Learners import via Data Import Wizard (browser-based). |
| 2026-08-08 | ~48,672 Contacts only, no Leads | B2C pattern. Leads don't make sense for eyecare retail. IDR scenarios come from cross-source email mismatches, not CRM object duplication. |
| 2026-08-08 | Single shared Account "LEOptical Customers" | Avoids 50K individual accounts. Person Accounts vary across SDOs and aren't relevant to MCA. |
| 2026-08-08 | Protagonists in CSV with @example.com emails | Protagonist email update moved to Module 4 via anonymous Apex. Data 360 upsert preserves old Contact Point Email, so ecommerce orders stay linked. |
| 2026-08-06 | Loyalty Program Member uses standard DMO with custom fields | Flat structure, no relational tier/currency DMOs needed |
| 2026-08-06 | Eye Exam is a custom DMO | No standard DMO fits clinic exam data |
| 2026-08-06 | Data Graph rooted on Unified Individual | Required for Handlebars personalization and activation |
| 2026-08-06 | Learners buy cheap domain on Porkbun | SDOs lack a default sending domain. Full DNS auth experience. |
| 2026-08-06 | Einstein scoring is conceptual only | Requires 1,000+ real engagement events in 90 days. Cannot work with seed data. |
| 2026-08-06 | Netlify free tier for web beacon hosting | Drag-and-drop deploy, no git/CLI required |
| 2026-08-06 | Consent workaround: Comm Sub Consent relates to Contact Point Email, not Party | MCA does not populate the Party field on Comm Sub Consent |
| 2026-08-06 | Flows moved before Landing Pages in Part 3 | Learners need Flow Builder comfort before connecting form submissions to flows |
| 2026-08-06 | Module 7 Actionable List is Campaign Member-based, not Opportunity-based | No Opportunities in the data model |
| 2026-08-06 | Module 16 post-purchase is Automation Event Triggered Flow on Sales Order | Transactional send pattern |
| 2026-08-09 | CRM Data Ingestion removed as standalone module | Content absorbed into Working with Data 360 subpages. CRM data stream tour moves to Exploring Your Org. Actionable List moves to Segmentation. |
| 2026-08-09 | Identity Resolution moved before Data Graphs | IDR produces Unified Individuals that Data Graphs depend on. Matches the refresh chain dependency order taught in the course. |
| 2026-08-09 | Module 6 renamed to Working with Data 360 (multi-subpage) | Covers data streams, DLOs, DMOs, refresh chain, CSV ingestion, and the LEOptical data model. Replaces both old Module 6 and Module 7. |
