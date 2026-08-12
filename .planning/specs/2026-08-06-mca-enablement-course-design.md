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

> **Updated 2026-08-12:** Course restructured from 6 parts to 9 parts. See `.planning/specs/2026-08-12-course-restructure-design.md` for full rationale.

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

### Part 3: Content & Email Building
**Exam mapping: Section 4 (Campaign Design, Flow Orchestration & Content, 30%)**

| # | Module | Exam Topics |
|---|--------|-------------|
| 11 | Salesforce CMS & Content Management | Content management |
| 12 | The Email Builder | Email creation |
| 13 | Content Blocks | Content blocks, propagation |
| 14 | Email Templates | Templates, locked regions |

### Part 4: Dynamic Content & Personalization
**Exam mapping: Section 4 (Campaign Design, Flow Orchestration & Content, 30%)**

| # | Module | Exam Topics |
|---|--------|-------------|
| 15 | Marketing Objects | Marketing Objects |
| 16 | Merge Fields & Dynamic Content | Merge fields, dynamic content |
| 17 | Handlebars: Foundations | Handlebars syntax, conditionals |
| 18 | Handlebars: Working with Data | Loops, filtering, data graph navigation |
| 19 | Handlebars: Advanced Techniques | Math/date helpers, lookups, debugging |
| 20 | AMPscript in MCA | AMPscript support |
| 21 | Project: Personalized Campaign Email | Integration project |

### Part 5: Flows & Automation
**Exam mapping: Section 4 (Campaign Design, Flow Orchestration & Content, 30%)**

| # | Module | Exam Topics |
|---|--------|-------------|
| 22 | Flow Fundamentals | Flow types, triggers, elements |
| 23 | Activation Templates | Activation templates, contact points |
| 24 | Flows: Orchestration & Logic | Decisions, experiments, waits |
| 25 | Flows: Advanced | Subflows, batching, re-entry |
| 26 | Project: Consent Automation Flow | Consent automation project |

### Part 6: Landing Pages & Web
**Exam mapping: Section 4 (Campaign Design, Flow Orchestration & Content, 30%)**

| # | Module | Exam Topics |
|---|--------|-------------|
| 27 | Landing Pages & Forms | Page builder, forms |
| 28 | Landing Pages: Advanced | Hidden fields, UTM, consent capture |
| 29 | Web Connector (multi-subpage) | Web connector, tracking, events |

### Part 7: Campaigns & Analytics
**Exam mapping: Section 6 (Analytics & Performance Insights, 8%)**

| # | Module | Exam Topics |
|---|--------|-------------|
| 30 | Campaigns in MCA | Campaign workspace, metrics |
| 31 | Reporting & Dashboards | Dashboards, reporting |

### Part 8: AI & Intelligence
**Exam mapping: Section 5 (Agentforce & AI Innovation, 11%)**

| # | Module | Exam Topics |
|---|--------|-------------|
| 32 | Agentforce for Marketing | Agentforce |
| 33 | Conversational Messaging | SMS/WhatsApp |
| 34 | Predictive AI | Einstein features |

### Part 9: Capstone

| # | Module | Exam Topics |
|---|--------|-------------|
| 35 | Capstone Project | All topics |

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

| Exam Section | Weight | Course Parts | Modules |
|---|---|---|---|
| Platform Setup & Governance | 13% | Part 1 | 1-3 |
| Consent | 13% | Part 1 | 4-5 |
| Data Modeling, IDR & Segmentation | 25% | Part 2 | 6-10 |
| Campaign Design, Flow & Content | 30% | Parts 3-6 | 11-29 |
| Analytics & Performance Insights | 8% | Part 7 | 30-31 |
| Agentforce & AI Innovation | 11% | Part 8 | 32-34 |

## Out of Scope (for now)

- User authentication / login
- Server-side progress tracking
- Video content production
- The fake client scenario (separate design session)
- Detailed lesson content (written module by module after scaffold)
- Integration with LMS or external platforms
