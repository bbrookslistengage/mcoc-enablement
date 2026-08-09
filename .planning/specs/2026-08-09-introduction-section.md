# Introduction Section — Design Spec

**Date:** 2026-08-09
**Status:** Draft
**Supersedes:** `.planning/specs/2026-08-08-course-intro-page.md`

## Summary

A dedicated "Introduction" category containing 4 lightweight modules that sit above Part 1 in the sidebar. Modeled after The Odin Project's Foundations introduction section. Each page follows the standard module template (overview, lesson overview, lesson body, assignment, knowledge check) and is tracked in `COURSE_PARTS` for progress. Assignments are lightweight (read an article, explore a resource) rather than "build something in your SDO."

The existing `docs/intro.md` will be replaced by this section.

## File Structure

```
docs/
  introduction/
    _category_.json                # label: "Introduction", position: 0
    how-this-course-works.md       # sidebar_position: 1
    mca-vs-mce.md                  # sidebar_position: 2
    intro-to-data-360.md           # sidebar_position: 3
    navigating-a-new-platform.md   # sidebar_position: 4
  part-1-foundations/
    _category_.json                # position: 1 (unchanged)
    ...
```

## Progress Tracking

All 4 pages are full modules. They need entries in `COURSE_PARTS` in `ProgressOverview.tsx` as a new part at the top of the array:

```typescript
{
  label: 'Introduction',
  description: 'Course orientation, platform context, and the mindset you need before diving in.',
  modules: [
    {slug: 'how-this-course-works', title: 'How This Course Works', path: '/introduction/how-this-course-works'},
    {slug: 'mca-vs-mce', title: 'MCA vs. MCE', path: '/introduction/mca-vs-mce'},
    {slug: 'intro-to-data-360', title: 'Introduction to Data 360', path: '/introduction/intro-to-data-360'},
    {slug: 'navigating-a-new-platform', title: 'Navigating a New Platform', path: '/introduction/navigating-a-new-platform'},
  ],
}
```

## Tone

The existing `intro.md` was too cold and clinical. The new tone should be:

- **Encouraging and overwhelmingly positive** toward the reader
- Still direct and honest (no fake enthusiasm, no banned words)
- Respects their experience as Salesforce professionals while acknowledging MCA is new territory
- "You are smart, you have done hard things before, you can do this too"
- When discussing platform clunkiness or difficulty, frame it as normal and temporary, not as a warning

This is a shift from the writing style guide's baseline tone. The introduction section specifically should lean warmer and more encouraging than a typical module. Once the reader hits Part 1, the tone settles into the standard direct/conversational style.

---

## Page 1: How This Course Works

**File:** `docs/introduction/how-this-course-works.md`
**Slug:** `how-this-course-works`

### Purpose

Orient the learner to the course structure, introduce LEOptical, and explain the learning philosophy.

### Overview (~150 words)

Welcome to the course. You are about to build a complete MCA implementation from scratch. Brief, warm welcome. Who this is for: experienced Salesforce consultants learning MCA. You do not need to be an MCA expert. You do not need Data 360 experience. You just need a Salesforce background and willingness to get hands-on.

### Lesson body sections

**Course structure**
- Modules follow a consistent format: lesson, assignment, sometimes a project
- Lessons teach concepts and mechanics with inline walkthroughs
- Assignments make you apply what you learned, often framed as client requests
- Projects tie multiple modules together
- Modules build on each other. Work through them in order.
- Progress tracking is local to your browser via checkboxes

**Meet LEOptical**
- Fictional B2C eyecare and eyewear company
- Why a fake client: learning sticks when every task connects to a coherent business scenario. You are not configuring features in a vacuum. You are building an implementation for a client with real (simulated) data, real business needs, and real complexity.
- Quick description: retail stores, ecommerce, loyalty program, promotional emails, appointment reminders, order confirmations
- The Getting Started module covers LEOptical's data and org setup in detail

**Learning by building**
- This course is designed around hands-on practice with realistic scenarios
- Assignments give you enough context to figure things out, but they are not step-by-step answer keys
- That friction is intentional. Struggling with a configuration for 20 minutes and eventually figuring it out teaches you more than reading a walkthrough where someone hands you every click
- The goal is for you to finish this course with genuine hands-on experience, not just theoretical knowledge. The kind of experience where a client asks you to do something and you think "I have done this before" rather than "I read about this once"
- Compare to Trailhead or other training where exercises are isolated and decontextualized. This course ties everything to an overarching implementation.

### Assignment (lightweight)

- Read the course overview page and familiarize yourself with the module list and progress tracking
- Optionally: browse the LEOptical data files in `static/seed-data/` to get a sense of what data you will be working with

### Knowledge check (3-4 questions)

- What is the structure of each module in this course?
- Why does this course use a fictional client rather than abstract exercises?
- What should you do when an assignment does not give you step-by-step instructions for every action?

---

## Page 2: MCA vs. MCE

**File:** `docs/introduction/mca-vs-mce.md`
**Slug:** `mca-vs-mce`

### Purpose

High-level orientation for consultants coming from MCE. Not a feature-by-feature comparison. A mindset shift. Also welcoming to consultants who have no MCE background at all.

### Overview (~100 words)

Whether you are coming from MCE or encountering marketing automation on the Salesforce platform for the first time, this module gives you the high-level context for what MCA is and how it differs from its predecessor. Throughout the course, "Coming from MCE?" callouts draw specific comparisons where relevant. This module is the big picture.

### Lesson body sections

**What is MCA**
- Marketing Cloud Advanced is Salesforce's current marketing automation product
- It is built natively on the Salesforce platform and on Data 360
- Brief mention that it was also called "Marketing Cloud Growth" at various points. Both names refer to the same product. This course uses "MCA."

**The architectural shift**
- MCA is not MCE with a new UI. Fundamentally different architecture.
- MCE was a standalone platform. It had its own data layer (data extensions, subscriber lists), its own automation engine (Journey Builder, Automation Studio), its own content tools (Content Builder), and its own sending infrastructure.
- MCA is built on top of Data 360 and the core Salesforce platform. It does not have its own data layer. It uses Data 360. It does not have its own automation engine. It uses Salesforce Flow. The marketing features (email builder, landing pages, segments) are a thin layer on top of Data 360.
- Key framing: **MCA is mostly Data 360 with a thin marketing layer on top.** Most of what you will spend your time on is data architecture.

**What this means in practice**
- In MCE, you could build an email, create a data extension, write a query, and send. The data and marketing tools were tightly coupled but self-contained.
- In MCA, before you can send anything, you need: data streams ingesting data, data mapped into DMOs, identity resolution running, segments built from the data model. The marketing tools depend entirely on the data layer being set up correctly.
- If Data 360 is not configured properly, the marketing features have nothing to work with.
- This is not a criticism of MCA. It is the architectural reality. Once the data layer is solid, the marketing features are clean and well-integrated. Getting there takes more upfront configuration than MCE did.

**Coming from MCE? callouts throughout the course**
- Every module that has an MCE equivalent will include a "Coming from MCE?" callout
- These callouts map the MCA concept to its MCE equivalent (or note when there is no equivalent)
- They are placed at the point in the lesson where the comparison is most useful, not lumped at the end
- If you have no MCE background, you can skip these callouts entirely. They are supplementary.

### Assignment (lightweight)

- Read a Salesforce article or resource that describes MCA's architecture at a high level (writer/researcher to find an appropriate link)
- If you have MCE experience: write down 3 things you expect to be different in MCA based on what you learned in this module. You will revisit this list at the end of the course.

### Knowledge check (4-5 questions)

- What is the foundational platform that MCA is built on?
- How does MCA's data layer differ from MCE's data extensions and subscriber lists?
- Why does this course describe MCA as "mostly Data 360 with a thin marketing layer on top"?
- What should you do with the "Coming from MCE?" callouts if you have no MCE background?

---

## Page 3: Introduction to Data 360

**File:** `docs/introduction/intro-to-data-360.md`
**Slug:** `intro-to-data-360`

### Purpose

ELI5 primer on Data 360 for someone who has never used it. Assumes no prior knowledge. Explains the core concepts at a high level with clear analogies so the rest of the course has context. This is NOT a setup guide (that is Getting Started). This is "understand what these things are before you start clicking buttons."

### Overview (~100 words)

Data 360 is the data platform underneath MCA. Every feature you will use in this course, from segmentation to email sends to AI scoring, reads from Data 360. Before you start configuring anything, it helps to understand the core concepts at a high level. This module is intentionally surface-level. There is a lot more depth underneath each topic, and the course covers it thoroughly in later modules. The goal here is to give you a mental model so the setup steps in Getting Started make sense.

### Lesson body sections

**IMPORTANT: The analogies and explanations in this section need heavy research and verification against current Salesforce documentation. The writer should verify every claim against official docs and flag anything uncertain with `<!-- VERIFY -->` comments.**

**What Data 360 is**
- The unified data platform underneath MCA
- Where all customer data from all sources lives, gets unified, and becomes available for marketing (and other) use cases
- Everything in MCA reads from Data 360. Segments, email personalization, AI scoring, activation. All of it.

**Data streams**
- A data stream is basically an agreement you are making with an external system
- You set up a connection to that system and tell Data 360 to look at a specific table, file, or object in that system and ingest it
- The external system could be CRM objects (Contacts, Accounts), CSV files, an ecommerce database, a loyalty platform, etc.
- For LEOptical, you will set up data streams for CRM contacts, ecommerce orders, loyalty members, and eye exam records

**Data lake objects (DLOs)**
- When a data stream ingests data, it places it into a data lake object (DLO)
- A DLO is essentially a raw copy of the source data. The field names, the values, the structure, all mirrored from the source.
- None of the features that make Data 360 powerful actually use DLOs directly. DLOs are staging. They exist so the platform has the raw data available for the next step.

**Data model objects (DMOs)**
- DMOs are the structured data model that the rest of the platform works with
- DMOs reference the data that was ingested via data streams through field mappings
- When you map a DLO field to a DMO field, you are creating a row in that DMO. The DMO does not store a separate copy of the data. It references the DLO data but organizes it into a structure that Data 360 needs for segmentation, personalization, activation, and everything else.
- You can map multiple DLO fields to one DMO. For example, you might have "email" fields from three different source systems all mapping to the same Contact Point Email DMO.
- Some DMOs are standard (Unified Individual, Contact Point Email, Sales Order). Others are custom (Eye Exam, for LEOptical).
- The Data 360 and Data Model Objects module covers DMOs in detail.

**DMO relationships**
- DMOs do not exist in isolation. You set up relationships between them.
- A Unified Individual has Contact Point Emails, has Sales Orders, has Loyalty Program Memberships. These are defined relationships.
- These relationships are what allow you to build segments based on data points that are not just fields directly on the individual. In MCE, when you create filters on a data extension, you can only filter on attributes that exist on that data extension (unless you set up relationships in Contact Builder). DMO relationships serve the same purpose: they let you traverse the data model when building segments.
- Example: "Find all Unified Individuals who have a Sales Order with a total over $200 in the last 90 days." The segment starts at Unified Individual, traverses the relationship to Sales Order, and filters on fields there.
- The Data Graphs module covers how to define and work with these relationship paths.

**Identity resolution**
- Your data comes from multiple sources. The same person might exist as "Maria Chen" in the CRM, "m.chen@email.com" in the ecommerce system, and "Maria C." in the loyalty database.
- Identity resolution is the process that figures out these records belong to the same person
- The output is a **Unified Individual**, a single resolved identity that ties together everything the platform knows about one person
- When you build a segment or send an email, you are working with Unified Individuals, not raw source records
- The Identity Resolution module covers the matching rules and configuration

**Segments**
- Segments are how you build audiences from the unified data
- A segment queries the data model (DMOs and their relationships) to find groups of Unified Individuals who match criteria you define
- "Loyalty members who have not made a purchase in 90 days" is a segment. "Customers due for an eye exam" is a segment.
- Segments are the bridge between data and marketing. You build them from the data, and you activate them through marketing channels.
- The Segmentation module covers this in depth.

**Closing summary**
- Tie it all together: data streams bring data in, DLOs stage it, DMOs structure it, identity resolution unifies it, relationships connect it, and segments make it actionable.
- You do not need to memorize any of this now. These concepts will come up repeatedly throughout the course, and each one gets its own dedicated module.

### Assignment (lightweight)

- Read an official Salesforce resource on Data 360 / data model concepts (writer/researcher to find appropriate link)
- Optionally: explore a Trailhead module on Data 360 basics if one exists

### Knowledge check (5-6 questions)

- What is the difference between a data lake object and a data model object?
- When you map a DLO field to a DMO field, what happens?
- Why do DMO relationships matter for segmentation?
- What is a Unified Individual?
- What is the high-level data flow from an external source system to an actionable segment?

---

## Page 4: Navigating a New Platform

**File:** `docs/introduction/navigating-a-new-platform.md`
**Slug:** `navigating-a-new-platform`

### Purpose

Encouragement and practical advice for learning MCA. Manages expectations about the experience (it will feel clunky at times), explains the learning-by-building philosophy, and gives specific guidance on using AI tools effectively. Overwhelmingly positive tone.

### Overview (~100 words)

You are an experienced Salesforce professional picking up a new product. You have done this before, whether it was learning a new cloud, a new tool, or an entirely new platform. MCA is another one of those. It will feel unfamiliar at first. Some parts will feel clunky or counterintuitive. That is completely normal, and it fades with hands-on time. This module covers how to approach the learning process, how to use the tools at your disposal, and why you are more than capable of mastering this material.

### Lesson body sections

**You already know how to learn hard things**
- You are a Salesforce consultant. You have picked up new products, learned new tools, navigated unfamiliar UIs.
- MCA is another new thing. It is a big new thing, because the underlying architecture is different. But the process of learning it is the same process you have used before: get your hands on it, build things, make mistakes, figure it out.
- You are not starting from zero. Your Salesforce platform knowledge, your understanding of data modeling, your experience with client implementations, all of that transfers. The specifics are different. The skills are the same.

**Why it feels different (and why that is okay)**
- MCA is newer than MCE. The UI has rough edges in places. Some workflows require more steps than you might expect. Some things that were simple in MCE are more involved in MCA.
- The data architecture (Data 360) adds a layer of complexity upfront that MCE did not have. Getting data streams, DMOs, and identity resolution set up before you can do anything marketing-related can feel like a lot of overhead at first.
- This is all normal. Every new platform feels this way until you have enough hands-on time for it to click. The early modules are the steepest part of the learning curve. Once the data layer is configured and you start building segments, emails, and flows, things start to move faster and feel more intuitive.

**Learning by building**
- This course is designed around hands-on practice with realistic scenarios
- Every assignment connects to LEOptical's business. You are not configuring features in isolation. You are building an implementation.
- The assignments intentionally do not hand you every step. They give you enough context and then ask you to figure it out. That friction is the point.
- Struggling with a configuration for 20 minutes and eventually getting it to work teaches you something that reading a walkthrough never will. You build real problem-solving instincts, the kind that matter when a client asks you to do something you have not seen before.
- When you finish this course, the goal is for you to have genuine experience, not just theoretical knowledge.

**Using AI as a learning tool**
- AI tools (ChatGPT, Claude, Gemini, etc.) are excellent companions for learning MCA. But they need guidance to be useful.
- **First: make sure the AI knows the difference between MCA and MCE.** Before you ask it to research anything, confirm that it understands you are working in Marketing Cloud Advanced (built on Data 360), not Marketing Cloud Engagement (the legacy platform). Ask it to confirm its understanding. Many AI models conflate the two or default to MCE documentation. Have it explicitly exclude MCE results from its research.
- **Use AI to walk you through things step by step.** If you are stuck on a configuration or a concept is not clicking, ask the AI to walk you through it step by step. Explain what you are trying to do, what you have tried, and where you are stuck. AI is a great teaching tool when guided well.
- **Use AI to synthesize documentation.** Salesforce documentation can be dense and scattered across Help articles, Trailhead, and release notes. Ask AI to pull together the relevant pieces and summarize them for your specific question.
- **Use AI to explain concepts in different ways.** If a module's explanation of identity resolution does not click, ask AI to explain it differently. Ask for analogies. Ask for examples. Different explanations work for different people.

**You can do this**
- You have the skills. You have the experience. You have the tools.
- The course is structured to build your knowledge progressively. No module assumes you know something you have not been taught yet.
- The "Coming from MCE?" callouts orient you at every step if you have MCE background. If you do not, the course works just as well without them.
- Every consultant who has gone through this material started in the same place: staring at an unfamiliar platform and wondering where to begin. The answer is the same for everyone: start with Getting Started, follow the modules, build things, and trust the process.

### Assignment (lightweight)

- If you plan to use AI tools during the course: open your preferred AI tool and confirm that it understands the difference between MCA and MCE. Ask it to explain the distinction. Verify its response against what you learned in the MCA vs. MCE module.
- Read through the "Coming from MCE?" callouts in one of the early modules (Consent Fundamentals is a good one) to see how they work.

### Knowledge check (3-4 questions)

- Why does MCA feel more complex upfront than MCE?
- What is the first thing you should do before using an AI tool to research MCA topics?
- Why does this course use assignments that do not give you every step?

---

## Content Boundaries

To avoid overlap with other pages:

| Topic | How This Course Works | MCA vs. MCE | Intro to Data 360 | Navigating a New Platform | Getting Started |
|-------|----------------------|-------------|-------------------|--------------------------|-----------------|
| Course structure | Full coverage | - | - | Brief (learning by building) | - |
| LEOptical | Intro + why fake client | - | Examples only | - | Full data/org setup |
| MCE comparison | - | Full coverage (high-level) | MCE analogy for relationships | Brief (feels different) | - |
| Data 360 concepts | - | Mentions dependency | Full ELI5 primer | - | Provisioning steps only |
| Learning philosophy | Learning by building | - | - | Full coverage | - |
| AI tools | - | - | - | Full coverage | - |
| SDO provisioning | - | - | - | - | Full walkthrough |
| Encouragement/mindset | - | - | - | Full coverage | - |

## Writing Constraints

- Follow WRITING-STYLE-GUIDE.md (banned words, formatting, terminology)
- No em dashes, semicolons, exclamation marks, or ellipses
- No module numbers. Reference modules by name only.
- Must pass content linter
- **Tone exception for this section:** warmer and more encouraging than the standard module tone. Still direct and honest. Not saccharine or patronizing. Think "supportive senior colleague who genuinely believes in you" not "corporate training video."
- The Data 360 primer (page 3) needs heavy research verification. Every analogy and technical claim must be checked against current Salesforce documentation. Flag uncertainties with `<!-- VERIFY -->`.

## Infrastructure Changes

1. **Delete** `docs/intro.md` (replaced by the introduction section)
2. **Create** `docs/introduction/_category_.json` with `position: 0`
3. **Create** 4 module files in `docs/introduction/`
4. **Update** `COURSE_PARTS` in `ProgressOverview.tsx` to add Introduction as the first part
5. **Update** `.planning/PROGRESS.md` to add 4 new rows to the Phase 4 module table

## Open Questions

None. Scope is defined.
