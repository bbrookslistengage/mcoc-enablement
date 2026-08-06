# Module Template

This is the reference template for every module's markdown file. The section order is fixed. Section names are fixed. Do not rename them or reorder them.

Sections marked as conditional can be omitted when they do not apply. All other sections are required.

---

## The Template

```markdown
---
sidebar_position: {n}
title: "Module {n}: {Title}"
description: "{One sentence summary for SEO and sidebar hover}"
---

## Overview

Short context-setting introduction. What the learner is about to learn and why
it matters for the LEOptical engagement (or for their career as an MCA consultant).

Ground it in the client scenario where relevant. Do not say "In this module,
you will learn..." Just set the scene and move on.

Two to four paragraphs at most. Be honest about difficulty. If this module
is dense, say so. If it builds on something from a previous module, say so.
If something will not make full sense until a later module, say that too.

## Lesson overview

This section contains a general overview of topics that you will learn in
this lesson.

- Topic one.
- Topic two.
- Topic three.

Keep this as a bullet list. No prose. Each bullet is a short phrase or
single sentence. This gives the learner a scannable preview of what is
ahead.

## {Lesson content - freeform subsections}

This is the bulk of the module. It is NOT a single section called "Lesson."
It is multiple H2 sections with topic-driven headings that teach the
concepts and mechanics the learner needs.

Structure these sections around the material, not around a rigid template.
One module might have 3 subsections, another might have 7. Use whatever
the content requires.

### What goes in the lesson body

- **Concept explanations.** What the thing is, when you use it, how it
  connects to what the learner has already built.
- **Inline walkthroughs.** Step-by-step instructions woven into the lesson
  where the learner needs to follow along in their SDO. These are part of
  the lesson flow, not a separate section.
- **Links to external resources.** "Read this article," "follow along with
  this Trailhead," "watch this walkthrough." These can be mid-lesson or
  collected at logical pauses.
- **Platform gotchas.** Called out inline with `:::warning` admonitions
  wherever they are relevant. Do not save gotchas for later.
- **Tables, diagrams, code snippets.** Use whatever format best explains
  the concept. Reference tables (like flow element lists) live in the
  lesson body where the learner needs them.

### Walkthrough formatting rules

When a lesson section includes step-by-step instructions:

- Number every step.
- Bold all UI element names: **Save**, **New Data Stream**, **Activate**.
- Use navigation paths: **Setup > Data 360 > Data Streams**.
- Put a screenshot after any step where the UI is not obvious.
- State what the learner should see after each significant action:
  "You should see a field mapping screen with columns from the CSV
  on the left."
- If the walkthrough follows an external article or resource, say so
  up front: "Follow along with [Article Title](url). The steps below
  supplement that article with LEOptical-specific context."

### Coming from MCE? callout

Place a `:::tip Coming from MCE?` admonition within the lesson body at
the point where it is most relevant. This is not a fixed position. Put it
where the MCE comparison actually helps.

:::tip Coming from MCE?
Map this concept to the MCE equivalent. Be specific:
- What is the direct equivalent (if one exists)?
- What changed between MCE and MCA?
- What has no equivalent in MCE?

Keep it to 3-5 bullet points. This is a quick reference, not a lesson.
:::

If a module covers multiple concepts that each have MCE equivalents,
use multiple callouts placed at the relevant points rather than one
giant callout at the end.

## Assignment

> **The client wants:** {Business request from LEOptical.}

The client framing sentence is used when the assignment is driven by a
client scenario. If the module is administrative or foundational (e.g.,
SDO setup, consumption review), omit the client framing and just describe
what the learner needs to do.

The assignment is a mix of tasks. It can include:

- **Reading.** "Read [this article](url) for background on X."
- **Following an external walkthrough.** "Follow the Trailhead module on
  X, then come back and apply it to LEOptical."
- **Building in the SDO.** "Create a Data Stream for the loyalty CSV."
- **Writing.** "Write a one-page recommendation memo for the client."
- **Stretch goals (optional).** Mark these clearly as optional within the
  assignment list. Do not create a separate section.

Reference prior modules when the assignment depends on previous work:
"Using the Data Graph you built in Module 8..."

Be specific about what to build. Do not leave room for interpretation on
required deliverables. If there are choices, say so explicitly.

### Example assignment format

1. Read [this Agentic Marketer article on activation templates](url).
   Pay attention to the section on contact point selection.
2. In your SDO, create an Activation Template for email sends. Select
   the appropriate contact point (email address) and configure the
   required fields.
3. Activate the "VIP Customers" segment using the activation template.
4. Activate the "Lapsed Buyers" segment using the activation template.
5. Verify that activated segment members appear in the target audience.
6. Test: send to a protagonist contact with multiple email addresses
   and confirm only the intended address receives the email.
7. **(Stretch)** Configure a second activation template for SMS and
   compare the contact point selection experience.

## Success Criteria

Self-check list. Every item is a verifiable outcome the learner can
confirm in their org right now.

- [ ] {Specific, observable outcome}
- [ ] {Another specific outcome}
- [ ] {Something the learner can check in their org}

Rules for success criteria:
- Every item must be verifiable. The learner can look at their org and
  see whether it is true or not.
- No vague understanding statements.
  Bad: "You understand how data streams work"
  Good: "Two Data Streams are configured and showing a status of Active"
- Include verification of key gotchas when relevant.
  "Your protagonist contacts have consent records (check the Consent
  LWC on their Contact page)"

## Knowledge check

The following questions are an opportunity to reflect on key topics in
this lesson. If you can't answer a question, revisit the relevant
section, but keep in mind you are not expected to memorize or master
this knowledge.

- {Direct question about a key concept}
- {Another question}
- {Question that connects this module to broader implementation}

Rules for knowledge check questions:
- 4-8 questions per module.
- Questions are direct. "What is X?" "How does Y work?" "What is the
  difference between X and Y?" "Why does Z matter for the client?"
- Questions should cover the most important concepts, not trivia.
- At least one question should connect this module's topic to the
  bigger LEOptical implementation or to real engagement work.
- Do not ask questions about stretch goal content.

## Additional resources (conditional)

This section contains helpful additional links to related content. It is
not required, so do not add it if there are no useful links.

- [Resource title](url) - One sentence on what it covers and why it
  is worth reading.

These are optional. State that clearly:
"These resources are not required. They are here if you want to go
deeper on a specific topic."
```

---

## Content Workflow

When writing a new module, follow this order. The order matters because each step informs the next.

### Step 1: Create the skeleton
Copy the template. Fill in frontmatter, overview, lesson overview bullets, assignment items, and success criteria. Pull assignment and success criteria from the spec. Leave the lesson body blank.

### Step 2: Research and follow along in a live SDO
Open your SDO. Do the thing the module teaches. Take notes on every click, every screen, every unexpected behavior. Screenshot each significant screen. This is where you discover what the UI actually looks like, where the spec might be wrong, and where the platform gotchas live.

If the module references external resources (articles, Trailheads), read them now and note what is accurate vs. outdated.

### Step 3: Write the lesson body
Turn your SDO notes into lesson content. Organize by topic, not by the order you happened to click things. Weave walkthroughs inline where they belong. Add screenshots. Add gotcha callouts.

Write the lesson AFTER doing the work. This prevents describing features that do not work the way you assumed.

### Step 4: Write the Coming from MCE callout(s)
Map concepts to MCE equivalents. Place callouts at the relevant points in the lesson body. If you are not confident in the MCE mapping, flag it for review with a `<!-- VERIFY-MCE: ... -->` comment.

### Step 5: Write knowledge check questions
Write 4-8 questions that cover the most important concepts. Read back through the lesson and ask: "If the learner retained nothing else, what should they remember?"

### Step 6: Lint and self-review
Run the style lint script. Read the module out loud. If it sounds like a corporate blog post, rewrite it. Check the review checklist in WRITING-STYLE-GUIDE.md.

### Step 7: Peer verification
Someone else follows the module in their own SDO. If they get stuck, the content is wrong. Not unclear. Wrong.
