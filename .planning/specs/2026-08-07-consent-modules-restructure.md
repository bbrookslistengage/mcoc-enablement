# Consent Modules Restructure

**Date:** 2026-08-07
**Scope:** Module 4 (Consent Fundamentals), Module 5 (Consent Configuration), and a new course-wide content type (Project pages)
**Status:** Approved — pending implementation

---

## Problem Statement

The two consent modules have structural issues that make them harder to follow for someone who knows Salesforce but has no MCA experience. The problems fall into three categories:

1. **Module 4** presents five unfamiliar objects in prose with no visual scaffold, and buries two foundational sections (global opt-out, Party field gotcha) behind lower-priority content.
2. **Module 5** promises a consent automation flow walkthrough in its frontmatter and overview, then delivers a TBD placeholder mid-module. This erodes trust. The flow also deserves more focused treatment than a section within a configuration walkthrough.
3. **No content type exists** for substantial standalone builds. The consent automation flow is the first case, but others will follow (DOI flow in Module 4, post-purchase flow in Module 16, etc.).

---

## Changes: Module 4 — Consent Fundamentals

### 1. Add external diagram reference at the top of "The Five Consent Components"

Before the five-component prose sections begin, add a short paragraph directing learners to read an external diagram first. Point to the arthurbackouche.com or Agentic Marketer consent diagram — whichever has the clearest relationship visualization at verification time.

The framing: "Before reading the sections below, look at [link]. Their diagram shows how these five objects connect. The prose below explains what each one does and where the gotchas are."

The assignment still asks learners to draw their own diagram. That's different cognitive work (recall, not recognition) and stays as-is.

### 2. Move "Global Opt-Out vs. Subscription-Level Opt-Out" earlier

**Current position:** After "Double Opt-In" (section 7 of 12).
**New position:** Immediately after "The Five Consent Components" section, before "How Consent is Enforced at Send Time."

**Rationale:** Understanding the two unsubscribe levels is foundational to understanding what a Communication Subscription *is* and why preference center configuration in Module 5 matters. It should appear before enforcement, not after double opt-in.

### 3. Move "The Party Field Gotcha" earlier

**Current position:** Section 11 of 12, after Legal Compliance and V1/V2 migration.
**New position:** Immediately after "Valid Methods for Creating Consent Records," before "The Preference Center."

**Rationale:** The Party field is architecturally critical — it directly affects Data Graph configuration in Module 8. It's more important than the legal context and V1/V2 sections that currently precede it. The preference center section naturally leads into it ("here's how subscribers manage consent, and here's why the join path to Individual works the way it does").

### 4. Move "Consent Audit Trail (DLO)" out of the five-component list

**Current position:** Listed as the last item in the five-component sequence, creating the impression it's a sixth component.
**New position:** A brief subsection after "How Consent is Enforced at Send Time," clearly framed as a logging mechanism that is *not* part of enforcement.

**Rationale:** The Consent Audit Trail DLO is explicitly not used at send time. Positioning it inside the five-component section causes readers to include it in their mental model of the enforcement chain. Moving it after enforcement makes the distinction obvious.

### Revised section order for Module 4

1. Overview
2. Lesson overview
3. Explicit Opt-In, Not Opt-Out
4. The Five Consent Components *(with external diagram reference added at top)*
5. **Global Opt-Out vs. Subscription-Level Opt-Out** *(moved up)*
6. How Consent is Enforced at Send Time
7. The Consent Audit Trail *(moved out of component list, into footnote after enforcement)*
8. The 90-Day Consent Cache
9. Valid Methods for Creating Consent Records
10. **The Party Field Gotcha** *(moved up)*
11. The Preference Center
12. Double Opt-In
13. Legal Compliance Context
14. V1/V2 DMO Migration
15. LEOptical's Four Communication Subscriptions
16. Assignment
17. Success Criteria
18. Knowledge check
19. Additional resources

---

## Changes: Module 5 — Consent Configuration

### 1. Extract consent automation flow into a Project page

The "Building the consent automation flow" section is removed from Module 5 and becomes its own Project page: **"Consent Automation Flow"** (working title).

The Create Consent Request element reference table *stays in Module 5* — it provides context for what the flow will do and learners need it to understand the CSV import workaround. The table is lesson content, not part of the project walkthrough.

Module 5's overview is updated to reference the Project page explicitly: something like "The consent automation flow is a separate project. That page covers the full trigger mechanism and flow architecture. This module covers everything else: subscriptions, preference page, web tracking banner, Privacy Consent Status component, and CSV import."

### 2. Update the frontmatter description

**Current:** "Configure Communication Subscriptions, build a triggered flow to auto-create consent records, and add the Privacy Consent Status component to CRM record pages."
**New:** Remove the reference to building the triggered flow. Something like: "Configure Communication Subscriptions, set up the preference page and web tracking consent banner, and add the Privacy Consent Status component to CRM record pages."

### 3. Reorder the lesson body sections

The web tracking consent banner section currently sits between the preference page and the Create Consent Request element reference, with no transition. Reorder so conceptually related sections are adjacent:

**Proposed order:**
1. Communication Subscriptions *(creation walkthrough)*
2. The default preference page *(preference page config + link insertion)*
3. Privacy Consent Status component *(CRM-side consent visibility)*
4. CSV consent import *(bulk OPT_IN for protagonist contacts)*
5. The Create Consent Request flow element *(reference table — context for the Project page)*
6. Web tracking consent banner *(separate system, clearly framed as such, moved to end)*
7. Org-wide consent settings

This groups the email consent workflow together (subscriptions → preference page → CRM component → bulk import), then the flow element reference as a bridge to the Project page, then the web tracking system as a distinct topic.

### 4. Add a transition sentence bridging Module 4 concepts to Module 5 UI

The current Communication Subscriptions section opens with "defined in the Consent Fundamentals module" and immediately jumps to the walkthrough. Add a single sentence showing where these objects live in the MCA UI before the numbered steps begin — e.g., "Communication Subscriptions are created and managed in the MCA Consent tab, separate from Salesforce Setup."

---

## New Content Type: Project Pages

### What a project page is

A project page is a standalone build — a Flow, a Data Graph configuration, a complex segment, or similar — that is substantial enough to deserve its own page rather than being embedded as an assignment in a lesson module. The build *is* the content. There is no lecture portion before it.

Project pages use the same markdown format as lesson modules (overview, lesson body, assignment, success criteria, knowledge check). The distinction is signaled in the sidebar only.

### Sidebar treatment

Project pages get a visual prefix in the sidebar label to distinguish them from lesson modules. The exact icon is a design decision (see the Docusaurus sidebar customization docs for label prefix options). A small icon — something like a wrench, a hammer, or a project symbol — placed before the page title.

This is implemented via the `customProps` field on the sidebar item or via `_category_.json` if the project lives in its own directory. Implementation details are TBD pending a spike on Docusaurus sidebar label customization.

### Known future project pages

These are candidates based on course content — not committed, decided as content is written:

| Tentative title | Feeds from | Referenced by |
|---|---|---|
| Consent Automation Flow | Module 5 | Module 14+ (sends) |
| Double Opt-In Flow | Module 4 (DOI section) | Module 15-16 (flow patterns) |
| Post-Purchase Flow | Module 16 | Capstone |

### What project pages are not

- A project page is not a capstone. The capstone (Module 25) is a different thing.
- A project page is not a longer assignment. If the build fits naturally as an assignment item within a module, it stays there.
- Format details (does a project page have a knowledge check? does it have a "coming from MCE?" callout?) are decided per page as the pattern develops.

---

## What This Does Not Change

- The consent automation flow content itself is TBD and will be written before go-live. This spec only concerns where it lives and how it is framed.
- Module 4's lesson body prose is not being rewritten — only reordered and supplemented with the external diagram reference.
- The assignment, success criteria, and knowledge check sections in both modules are not changing.
- No other modules are affected by this restructure.

---

## Implementation Order

1. Restructure Module 4 section order (reorder existing content, add diagram reference)
2. Update Module 5 frontmatter description
3. Restructure Module 5 lesson body section order
4. Add transition sentence in Module 5 Communication Subscriptions section
5. Create the Project page stub for Consent Automation Flow (TBD content, correct frontmatter and sidebar position)
6. Spike Docusaurus sidebar icon/prefix implementation for Project pages
7. Apply sidebar treatment to the Consent Automation Flow project page
