# Writing Style Guide

This guide governs all written content in the course. Every module, every callout, every assignment description. No exceptions.

## Tone Model: The Odin Project

This course is modeled after The Odin Project. Study their tone. Read a few of their lessons before writing any content for this course. Here is what they get right and what we are borrowing:

**Direct and honest.** They tell you when something is hard. They tell you when something is confusing. They do not pretend that a broken workflow is fine. If MCA has a weird gotcha, say "this is weird, here is the workaround." Do not dress it up.

**Conversational but not chatty.** They write like a senior colleague explaining something at a whiteboard. Casual enough that it does not read like a textbook. Structured enough that you can follow it step by step. No jokes that land flat. No forced enthusiasm.

**Respects the learner's time.** They do not pad lessons with filler. Every sentence teaches something or tells you what to do next. If a concept can be explained in two sentences, it gets two sentences.

**Honest about what matters and what does not.** They tell you "you do not need to memorize this" or "this will make more sense after Module 9." They set expectations. They tell you when to skim and when to pay close attention.

**Lets the learner struggle (on purpose).** Assignments give you what you need to figure it out, not a step-by-step answer key. The walkthrough teaches the mechanics. The assignment tests whether you can apply them. The Odin Project calls this "productive struggle." We do too.

### What we do differently from The Odin Project

- Our learners are not beginners. They are experienced Salesforce consultants learning a new product. We do not explain what a database is or what an API does. We explain how MCA's version of a concept differs from what they already know.
- Every assignment is grounded in a client scenario (LEOptical), not abstract exercises.
- We include a "Coming from MCE?" callout in every module that maps MCA concepts to MCE equivalents.

## Voice Rules

- Second person. "You" not "the user" or "one."
- Active voice. "Click Save" not "The Save button should be clicked."
- Present tense. "This creates a record" not "This will create a record."
- Declarative. State what things do. Do not hedge with "should" or "might" when the behavior is deterministic.
- When something is confusing, broken, or counterintuitive, say so plainly. Do not smooth it over.

## Sentence Structure

- Short sentences. One idea per sentence.
- If a sentence has more than one comma, consider splitting it.
- Do not start sentences with "By" constructions. ("By configuring X, you enable Y" becomes "Configure X. This enables Y.")
- Do not start sentences with "This ensures that." Just say what happens.
- Avoid subordinate clauses at the start of sentences. Lead with the action or the fact.

## Banned Words and Patterns

These words and constructions are not allowed anywhere in course content. This list exists because they are overused in AI-generated text, vague, or both. If AI is used to draft content, the output must be scrubbed against this list before it is committed.

### Filler and hedging
- "It's important to note that" / "It's worth mentioning" / "It should be noted"
- "Let's dive in" / "Let's explore" / "Let's take a look"
- "In this module, we will" (just start teaching)
- "As you may know" / "As mentioned earlier"
- "In today's world" / "In the modern landscape"
- "At the end of the day"
- "Moving forward"
- "In order to" (use "to")
- "Make sure to" (use "Verify" or the specific action)
- "Feel free to"

### Corporate and AI slop
- "leverage" (use "use")
- "utilize" (use "use")
- "facilitate"
- "streamline"
- "robust"
- "seamless"
- "comprehensive"
- "cutting-edge" / "state-of-the-art"
- "best-in-class"
- "empower"
- "optimize" (unless discussing actual measured performance)
- "ecosystem" (unless referring to the Salesforce product ecosystem specifically)
- "solution" as a standalone noun
- "journey" (unless referring to Journey Builder in the MCE context)
- "harness"
- "delve"
- "realm"
- "landscape" (as metaphor)
- "paradigm"
- "synergy" / "synergize"
- "holistic"
- "crucially" / "notably" / "importantly"
- "a]testament to"
- "game-changer"

### Overly enthusiastic
- Exclamation marks in instructional content. Never.
- "Congratulations!" at module end
- "Great job!" / "Well done!"
- "You've successfully..."
- "Exciting" / "powerful" / "amazing" / "incredible"

### Typographic
- Em dashes (the long ones). Use commas, periods, or parentheses instead. Hyphens for compound words are fine.
- Semicolons in instructional prose. Use two sentences.
- Ellipsis (...) in prose. Say what you mean or stop.

### Structural slop
- Triple-adjective stacking ("powerful, flexible, and intuitive")
- "Not only X, but also Y" (just list both things)
- "Whether you're a X or a Y" audience hedging
- Starting a section with a question you immediately answer
- "Now that we've covered X, let's move on to Y"
- "Without further ado"
- Rhetorical questions used as transitions

## Formatting Standards

### Headings
- Module title is H1 (handled by Docusaurus frontmatter)
- Top-level sections (Overview, Lesson, Assignment, etc.) are H2
- Subsections within those are H3
- Do not skip heading levels
- Do not use H4 or deeper unless absolutely necessary

### Code and UI References
- UI element names in **bold**: **Save**, **Data Streams**, **Setup**
- Navigation paths with `>`: **Setup > Data 360 > Data Streams**
- Field names in backticks: `Last_Exam_Date__c`, `FirstName`
- Code snippets in fenced code blocks with language specified
- File names in backticks: `loyalty_members.csv`

### Admonitions
Use Docusaurus admonitions for specific purposes only:

```markdown
:::tip Coming from MCE?
MCE equivalent mapping goes here.
:::

:::warning
Platform gotcha or common mistake.
:::

:::info
Supplementary context that is not critical to the task.
:::

:::caution
Something that can cause data loss, broken state, or hours of debugging.
:::
```

Do not use `:::note` (too generic). Do not use `:::danger` (too dramatic).

### Lists
- Use numbered lists for sequential steps (do this, then this, then this)
- Use bullet lists for unordered items (features, options, examples)
- Do not nest lists more than two levels deep
- Each list item is a complete thought. No sentence fragments.

### Screenshots
- Every screenshot has alt text that describes what the learner should see
- Screenshots go directly below the step they illustrate
- File naming: `{module-number}-{description}.png` (e.g., `06-data-stream-config.png`)
- Annotate screenshots with red boxes or arrows when the relevant UI element is not obvious
- Do not use screenshots as a substitute for written instructions. The text must stand alone.

## Terminology

Use these terms consistently. Do not alternate.

| Use | Do not use |
|-----|------------|
| Data 360 | Data Cloud |
| MCA | Marketing Cloud Growth (except when explaining that both names exist) |
| Unified Individual | Unified Profile (unless in casual context) |
| Communication Subscription Consent | "consent record" (too vague) |
| DMO / Data Model Object | "data object" or "model" |
| SDO | "sandbox" or "dev org" (SDOs are specific) |

## Anti-Hallucination Protocol

These rules exist to prevent writing about features, UI paths, or behaviors that do not actually exist in the current platform.

1. **Never describe a UI path from memory.** Every "Navigate to X > Y > Z" instruction must be verified against a live SDO before the content is marked as verified.
2. **Never assume default behavior.** If a module says "this is enabled by default," verify it. Defaults change between releases.
3. **Flag uncertainty.** If you are not sure how something works, add a verification comment:
   ```html
   <!-- VERIFY: Does the Data Graph auto-refresh after IDR, or does it need manual trigger? -->
   ```
   These comments must be resolved before the module is marked verified.
4. **Screenshots are evidence.** A screenshot proves the UI exists and looks the way you describe it. If you cannot screenshot it, you cannot teach it.
5. **Test every walkthrough.** The walkthrough steps must be followed in a live SDO. If a step fails, the content is wrong.
6. **Cross-reference the platform gotchas file.** Before writing about consent, IDR, Data Graphs, or activation templates, check `.planning/platform-gotchas.md` for known quirks.
7. **Date your verification.** When a module is verified, note the Salesforce release version (e.g., "Verified on Summer '26"). Platform behavior changes every release.

## Using AI to Draft Content

AI can help draft content. It cannot be the final voice. Every AI-drafted section must be:

1. Scrubbed against the banned words list (run the lint script)
2. Rewritten to match the tone described in this guide
3. Verified against a live SDO for accuracy
4. Read out loud. If it sounds like a corporate blog post, rewrite it.

The goal: a reader should not be able to tell whether a human or AI wrote it. If you can tell, it is not done yet.

## Review Checklist

Before marking a module as "Done" in PROGRESS.md, confirm:

- [ ] No banned words or patterns (run the lint script)
- [ ] All UI paths verified against live SDO
- [ ] All screenshots present with alt text
- [ ] Module follows the exact section structure (see MODULE-TEMPLATE.md)
- [ ] Terminology is consistent (Data 360, MCA, etc.)
- [ ] No em dashes anywhere
- [ ] No exclamation marks in instructional text
- [ ] Coming from MCE callout is present and specific
- [ ] Success criteria are checkboxes, not prose
- [ ] Every `<!-- VERIFY -->` comment is resolved
- [ ] Assignment references only concepts taught in this or prior modules
- [ ] Read out loud and it sounds like a person talking, not a press release
