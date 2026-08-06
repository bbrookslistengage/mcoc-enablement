# MCA Enablement Course - Design Spec

## Overview

A self-paced, internal enablement course for consultants learning Marketing Cloud Advanced (MCA / Marketing Cloud Growth). Modeled after The Odin Project: lesson-driven, hands-on, project-focused, built around a fictional client with real-world marketing use cases.

The course prepares consultants to confidently lead MCA implementations end-to-end and pass the Salesforce Certified Marketing Cloud Next Consultant exam.

## Target Audience

- Primarily: Marketing Cloud Engagement (MCE) consultants transitioning to MCA
- Secondary: Salesforce-savvy consultants new to MCA; consultants with Data 360 experience
- Baseline assumption: learners understand marketing automation concepts and the Salesforce ecosystem — no need to teach fundamentals

## Delivery & Technical Stack

### Platform
- **Docusaurus** (free, open source, MIT license) — static site built from markdown
- **GitHub repo** — version controlled, team contributes via PRs
- **Hosting** — GitHub Pages, Netlify, or Vercel (all free for static sites); access gating handled at network/hosting level if needed

### Progress Tracking
- Local storage checkboxes on each module page (lesson complete, assignment complete)
- Progress overview on course homepage showing overall completion
- Manual override — learner can mark anything complete if they already know it
- No backend, no auth, no database

### Content Authoring
- Each module is a single markdown page with sections (Overview, Lesson, Walkthrough, Assignment, Success Criteria) — keeps the sidebar clean (25 items, not 100+) and the reading experience linear
- Modules are organized into part folders (e.g., `docs/part-1-foundations/`, `docs/part-2-data/`)
- Docusaurus auto-generates sidebar from folder structure
- Images/screenshots live alongside the markdown in each part folder
- "Coming from MCE?" callouts use Docusaurus admonitions (collapsible)
- Each section within a module uses heading anchors for direct linking

## Course Structure

Three-layer structure: **Foundations → Skill Building → Capstone**

Each module follows a consistent format:

| Section | Purpose |
|---|---|
| **Overview** | What are we learning and why does the client need it? |
| **Lesson** | Concept explanation — what it is, when to use it, how it fits |
| **Coming from MCE?** | Collapsible callout mapping concept to MCE equivalent |
| **Walkthrough** | Step-by-step guided example (separate from the assignment) |
| **Assignment** | "The client wants..." — learner builds it themselves |
| **Success Criteria** | "You know you're done when..." self-check checklist |
| **Bonus (optional)** | Stretch goals for learners who want to go deeper |

### Hands-On Environment
- Each learner provisions their own SDO MCA org (following existing Quip setup guide)
- All assignments are hands-on — learners build in their own org
- No shared state, no conflicts between learners

## Module Outline

Modules are ordered so each assignment builds on prior work. The outline is mapped to the Salesforce Certified Marketing Cloud Next Consultant exam sections and weights.

### Part 1: Setup & Foundations
**Exam mapping: Section 1 (Platform Setup & Governance, 13%) + Section 2 (Consent, 13%)**

| # | Module | Key Topics |
|---|--------|------------|
| 1 | Getting Started | SDO provisioning, Core Org Edition requirements, Data 360 provisioning, Marketing Data Kit installation, permission sets, platform tour |
| 2 | Domain Setup | Email domain authentication (self-service), landing page domains, link branding domains, DNS configuration |
| 3 | Business Units & Governance | When BUs are required, roles and permissions, Enhanced CMS Workspaces, content governance model |
| 4 | Consent Fundamentals | Consent management concepts, role of consent in engagement and compliance, platform consent objects and their relationships |
| 5 | Consent Configuration | Creating/managing/updating consent records, consent banners on marketing landing pages and external pages |

### Part 2: Data & Audiences
**Exam mapping: Section 3 (Data Modeling, Identity Resolution & Segmentation, 25%)**

| # | Module | Key Topics |
|---|--------|------------|
| 6 | Data 360 & Data Model Objects | DMO concepts, connecting/harmonizing/unifying customer data, how DMOs relate to each other |
| 7 | CRM Data Ingestion | CRM objects, records, Actionable Lists — how CRM data feeds into segmentation, activation, and personalization |
| 8 | Data Graphs | Building data graphs, structuring relationships between DMOs, creating views of unified data |
| 9 | Identity Resolution | Configuring IDR rulesets, linking multiple data sources into unified profiles |
| 10 | Segmentation | Building Data Cloud segments, filtering Data 360 data, using unified data for audience targeting |
| 11 | Consumption & Entitlements | Data 360 consumption-based entitlements, how marketing automation design decisions impact platform consumption and usage |

### Part 3: Building for the Client
**Exam mapping: Section 4 (Campaign Design, Flow Orchestration & Content, 30%)**

| # | Module | Key Topics |
|---|--------|------------|
| 12 | Salesforce CMS & Content Management | CMS setup, Enhanced CMS Workspaces, asset organization, content types |
| 13 | Email Templates: Structure | Template architecture, locked vs editable regions, consistent headers/footers/legal disclosures |
| 14 | Personalization: Handlebars & AMPscript | Handlebars syntax, AMPscript basics, merge fields, repeaters, content variations, choosing the right data source for personalized content |
| 15 | Landing Pages & Forms | Page builder, form creation, components, configuration, consent banner integration |
| 16 | Landing Pages: Advanced | Hidden fields, UTM parameters, lead creation, consent capture, campaign assignment via hidden campaign IDs |
| 17 | Flow Fundamentals | Flow types (marketing flows vs standard), trigger conditions, configuration settings, marketing flow elements |
| 18 | Flow Orchestration | Branching, logic, wait steps, automating business processes and messaging activities |
| 19 | Activation Templates | Configuring activation templates, selecting appropriate contact point values |
| 20 | Messaging Channels | SMS, WhatsApp configuration, data sources for personalized channel content |

### Part 4: AI & Intelligence
**Exam mapping: Section 5 (Agentforce & AI Innovation, 11%)**

| # | Module | Key Topics |
|---|--------|------------|
| 21 | Agentforce for Marketing | Automating campaign creation, audience segmentation, content generation using marketing agents |
| 22 | Conversational Messaging | Configuring two-way conversational messaging, response handling, ongoing customer interactions across channels |
| 23 | Predictive AI | Einstein Engagement Scoring, Einstein Engagement Frequency, determining which predictive AI feature to use |

### Part 5: Analytics
**Exam mapping: Section 6 (Analytics & Performance Insights, 8%)**

| # | Module | Key Topics |
|---|--------|------------|
| 24 | Reporting & Dashboards | Pre-built dashboards, addressing reporting/analytics requirements, surfacing marketing data and insights across the Salesforce platform |

### Part 6: Capstone

| # | Module | Description |
|---|--------|-------------|
| 25 | Capstone Project | A new multi-channel client requirement that combines data modeling, segmentation, content creation, flow orchestration, and analytics. Learner plans and builds with minimal guidance. Includes self-assessment rubric. |

## Assignment Philosophy

- Assignments are framed as client requests: "The client wants..."
- Each assignment only requires knowledge taught up to that point
- Assignments build on each other — by course end, the learner has built out a realistic MCA implementation
- Success criteria are clear, self-checkable checklists — no grading, no peer review
- The fake client/business scenario threads through the entire course (client details TBD in a separate design session)

### Example Assignment Ideas (from brainstorming)

**Landing Pages & Forms (Modules 15-16):**
"The client wants a landing page with a form. Form submissions should create leads, capture consent if provided, and automatically add leads to a campaign. The form should use hidden fields that pull UTM values from the URL — specifically, a utm_campaign value containing a Salesforce Campaign ID that determines which campaign the lead is added to."

**Email Templates (Modules 13-14):**
"The client wants 3 email templates with a consistent header, footer, and legal disclosure. These sections should be locked down. Template A allows full editing of the body section. Template B restricts editing to swapping copy in predefined sections only. Template C uses Handlebars to dynamically populate content based on customer data."

## "Coming from MCE?" Reference Map

Each module includes a collapsible callout mapping MCA concepts to their MCE equivalents:

| MCA Concept | MCE Equivalent |
|---|---|
| Salesforce Flow | Journey Builder |
| Data Model Objects (DMOs) | Data Extensions |
| Data Graphs | Manual joins / Data Views |
| Unified Profiles (IDR) | Contact Model |
| Salesforce CMS | Content Builder |
| Data Cloud Segments | Filters / SQL Queries |
| Data Cloud Consent | Subscription Center / Profile Center |
| Handlebars | AMPscript (both available in MCA) |
| Enhanced CMS Workspaces | Shared Content Folders |
| Activation Templates | Triggered Sends |
| Marketing Data Kit | Marketing Cloud Connect |

## Exam Alignment Summary

| Exam Section | Weight | Course Part | Modules |
|---|---|---|---|
| Platform Setup & Governance | 13% | Part 1 | 1-3 |
| Consent | 13% | Part 1 | 4-5 |
| Data Modeling, IDR & Segmentation | 25% | Part 2 | 6-11 |
| Campaign Design, Flow & Content | 30% | Part 3 | 12-20 |
| Agentforce & AI Innovation | 11% | Part 4 | 21-23 |
| Analytics & Performance Insights | 8% | Part 5 | 24 |

## Out of Scope (for now)

- User authentication / login
- Server-side progress tracking
- Video content production
- The fake client scenario (separate design session)
- Detailed lesson content (written module by module after scaffold)
- Integration with LMS or external platforms
