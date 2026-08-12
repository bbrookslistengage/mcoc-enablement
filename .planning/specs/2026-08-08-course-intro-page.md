# Course Introduction Page — Design Spec

**Date:** 2026-08-08
**Status:** Draft

## Summary

A single welcome/orientation page that sits above Part 1 in the sidebar. Not a module — no assignment, success criteria, knowledge check, or progress tracking. Its job is to orient the learner, set expectations, and provide a Data 360 primer so that the rest of the course has context.

## File Location

`docs/intro.md` with `sidebar_position: 0`. Appears at the top of the sidebar, above all Part folders.

## What This Page Is Not

- Not a module. Does not follow MODULE-TEMPLATE.md structure.
- Not tracked in progress (no ProgressCheckbox, no entry in COURSE_PARTS).
- Not tracked in PROGRESS.md module table (it is not a module).
- Does not duplicate Getting Started's content about SDO provisioning, Data 360 setup steps, or seed data.

## Page Structure

### 1. Overview (~150 words)

Welcome. Who this course is for: experienced Salesforce consultants learning MCA. Not beginners. You will build a real MCA implementation from scratch across ~35 modules. By the end you will have configured data ingestion, identity resolution, segmentation, email, flows, landing pages, and more — all for a fictional client.

Set the tone immediately: direct, honest, no filler.

### 2. How This Course Works (~200 words)

- **Lessons** teach concepts and mechanics with inline walkthroughs.
- **Assignments** make you apply what you learned. They give you enough to figure it out, not step-by-step answer keys. Productive struggle is intentional.
- **Projects** tie multiple modules together into larger deliverables.
- You work through modules in order. Each builds on the previous.
- Progress tracking is local to your browser via checkboxes. Your progress is yours.
- Reference modules by name throughout (e.g., "the Data Graphs module"), never by number.

Framing: people learn by doing. This course is modeled on that principle. We set up scenarios where you have to explore the platform, try things, and figure it out in the context of a cohesive client implementation — not isolated exercises.

### 3. Meet LEOptical (~100 words)

Quick intro to the fictional client: LEOptical is a B2C eyecare and eyewear company. They are the thread that ties every module together.

Why a fake client: realistic context makes the learning stick. Every assignment connects to something LEOptical needs. You are not configuring things in a vacuum — you are building an implementation. This gives you hands-on experience with a scenario that mirrors real engagement work.

Brief mention only. The Getting Started module goes deeper on LEOptical's data and org setup.

### 4. MCA vs. MCE: A Different Mental Model (~200 words)

High-level orientation for consultants coming from Marketing Cloud Engagement. Not a feature comparison — a mindset shift.

Key points:
- MCA is not MCE with a new UI. It is a fundamentally different product built on a different foundation.
- MCA is built on Data 360. Most of what you spend time on in MCA is data architecture: streams, models, identity resolution, segments.
- The marketing features (email builder, flows, landing pages) are a thin layer on top of that data foundation. They depend on it entirely.
- If Data 360 is not set up correctly, nothing else works. This is the single biggest difference from MCE, where data lived in its own silo (data extensions, lists, etc.) and the marketing tools operated somewhat independently.
- Throughout the course, "Coming from MCE?" callouts will draw specific comparisons where relevant. This section is just the high-level framing.

Tone: honest and direct. Do not oversell MCA or trash MCE. Just state the architectural reality.

### 5. Data 360: A Primer (~500-600 words)

Framed as prerequisite knowledge. These concepts sit underneath everything in MCA. We are being high-level on purpose — there is a lot more depth in the modules that cover each topic. But understanding these basics now means the rest of the course makes more sense from the start.

Each concept gets 1-2 paragraphs. No walkthroughs, no screenshots. Mental model only. Each concept should link to official Salesforce docs or Trailhead for learners who want to read ahead.

**Concepts to cover:**

1. **What Data 360 is** — The data platform underneath MCA. Where all customer data lives, gets unified, and becomes actionable. Everything in MCA reads from Data 360.

2. **Data streams** — How data gets into Data 360. You connect an external source (CRM objects, CSVs, external systems) and the platform ingests the data. Think of it as the intake pipe.

3. **Data lake objects (DLOs)** — Where ingested data lands. Raw, unstructured staging area. The data is in the platform but not yet organized into the canonical model.

4. **Data model objects (DMOs)** — The structured, canonical data model. Data from DLOs gets mapped into DMOs. These are the objects the rest of the platform works with: Unified Individual, Contact Point Email, Sales Order, etc.

5. **DMO relationships** — DMOs do not exist in isolation. They are connected through defined relationships (e.g., a Unified Individual has Contact Point Emails, has Sales Orders). These relationships are what make the data model queryable and useful for segmentation, personalization, and activation.

6. **Identity resolution** — How Data 360 takes records from different sources (CRM contacts, ecommerce orders, loyalty signups) and figures out which ones belong to the same person. The output is a Unified Individual — a single resolved identity that ties together all the data the platform knows about one person.

7. **Segments** — How you build audiences from the unified data. Segments query the data model (DMOs and their relationships) to find groups of people who match certain criteria. These segments are what you activate through marketing channels.

Each concept paragraph should end with a forward reference like "The [Module Name] module covers this in depth" where applicable. Use module names, not numbers.

## Content Boundaries

To avoid overlap with other pages:

| Topic | Intro page | Getting Started |
|-------|-----------|-----------------|
| What Data 360 is | Conceptual primer (what, why) | Setup steps (how to provision) |
| SDO provisioning | Not mentioned | Full walkthrough |
| LEOptical details | Brief intro (who, why fake client) | Data model, seed data, org setup |
| MCE comparison | High-level mindset shift | Not covered (module-level callouts handle specifics) |
| Course structure | How lessons/assignments/projects work | Not covered |
| Data streams, DLOs, DMOs | Mental model only | Provisioning context only |

## Writing Constraints

- Follow WRITING-STYLE-GUIDE.md (banned words, tone, formatting)
- No em dashes, exclamation marks, semicolons, or ellipses
- No module numbers — reference modules by name only
- Must pass content linter
- Use `:::tip[Coming from MCE?]` if placing any MCE-specific callout (but the MCE section here is part of the main content, not a callout — it is a full section)

## Open Questions

None. Scope is defined.
