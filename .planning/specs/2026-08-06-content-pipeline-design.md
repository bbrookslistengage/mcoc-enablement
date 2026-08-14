# Content Pipeline Design Spec

## Overview

Two Claude Code slash commands (`/research-module` and `/write-module`) that together form a pipeline for producing course module content. Research gathers comprehensive MCA platform knowledge. Writing transforms that knowledge into course content following the project's style guide and module template. A fact-checking step prevents hallucination by flagging any claims not supported by the research.

## Pipeline Flow

```
/research-module {slug}
  └─ dispatches: researcher agent
       └─ writes .planning/research/{slug}.md
       └─ prompts user to clear context and run /write-module {slug}

/write-module {slug}
  └─ dispatches: module-writer agent
       └─ writes docs/{part}/{slug}.md
  └─ dispatches: fact-checker agent
       └─ edits docs/{part}/{slug}.md (adds <!-- VERIFY --> flags)
  └─ runs content linter (npm run lint:content)
  └─ updates .planning/PROGRESS.md
  └─ prints summary
```

The two commands run in separate sessions. Research consumes significant context with web searches and doc fetching. The clean break ensures the writer starts with full context available for the writing task.

## File Structure

```
.claude/
  commands/
    research-module.md      # /research-module slash command
    write-module.md         # /write-module slash command
  agents/
    researcher.md           # dispatched by research-module
    module-writer.md        # dispatched by write-module
    fact-checker.md         # dispatched by write-module after writer finishes

.planning/
  research/
    {slug}.md               # research output, one per module
```

Commands and agents live in `.claude/` within the repo so they ship with the project. The `.planning/research/` directory is created on first research run.

## Research File Structure

Each research file follows this format:

```markdown
# Research: {Module Title}

Generated: {date}
Module: {slug}
Sources: {count}

## Module Context
<!-- Pulled from module-assignments.md: the client ask, assignment, success criteria -->

## Platform Concepts
<!-- Core feature explanations gathered from Salesforce Help, organized by subtopic -->

## UI Navigation Paths
<!-- Confirmed navigation paths from official docs, e.g. Setup > Data 360 > Data Streams -->

## Platform Gotchas
<!-- Relevant entries from platform-gotchas.md plus any new ones found during research -->

## MCE Comparison Points
<!-- How this feature differs from the MCE equivalent, for Coming from MCE? callouts -->

## External Resources
<!-- Trailhead modules, Salesforce Help articles, blog posts with URLs and summaries -->

## Data Model Relevance
<!-- Which DMOs, fields, relationships from data-model.md matter for this module -->

## Source Log
<!-- Every URL consulted, with a one-line note on what was found -->
```

## Command: /research-module

**Invocation:** `/research-module {slug}`

**Steps:**

1. **Resolve the module.** Map the slug to the module number, title, and part. Validate the slug exists in `src/components/ProgressOverview.tsx`'s `COURSE_PARTS` array. Fail if the slug is invalid.

2. **Gather internal context.** Read:
   - The module's entry in `.planning/specs/module-assignments.md`
   - `.planning/platform-gotchas.md` (filter to relevant entries)
   - `.planning/specs/2026-08-12-data-360-data-model-design.md` (if module touches data)
   - `.planning/specs/leoptical-client.md` (client profile)

3. **Web research.** Search for current Salesforce documentation on the module's topic. Critical constraint: **MCA / Marketing Cloud Next / Marketing Cloud Advanced only.**
   - Include "Marketing Cloud Advanced" or "Marketing Cloud Next" or "Data 360" in search queries
   - Discard results about Marketing Cloud Engagement, Account Engagement, or Pardot
   - Priority order: Salesforce Help > Trailhead > Salesforce Developer docs > community blogs
   - Fetch and summarize each relevant page
   - Capture exact UI navigation paths from official docs

4. **Compile the research file.** Write to `.planning/research/{slug}.md` using the structure above. Include full source log.

5. **Prompt to continue.** Output summary with source count, gotcha count, and instruction to clear context and run `/write-module {slug}`.

### Researcher Agent Constraints

- This is research for **Marketing Cloud Advanced (MCA)**, also called **Marketing Cloud Next (MCN)**. NOT Marketing Cloud Engagement (MCE). NOT Account Engagement (Pardot). Discard any source about MCE or Pardot.
- Gather facts, not opinions. Capture what the platform does, how to navigate to it, what fields are called, what the constraints are.
- When docs are ambiguous or contradictory, note both versions and flag the conflict.
- Do not invent UI paths or field names. If something cannot be confirmed from a source, say so explicitly.
- Use "Data 360" not "Data Cloud". Use "MCA" not "Marketing Cloud Growth".

## Command: /write-module

**Invocation:** `/write-module {slug}`

**Steps:**

1. **Validate prerequisites.** Check that `.planning/research/{slug}.md` exists. Fail with message to run `/research-module {slug}` first if missing.

2. **Dispatch writer agent.** The agent reads:
   - `.planning/research/{slug}.md` (primary factual source)
   - `.planning/MODULE-TEMPLATE.md` (section order and rules)
   - `.planning/WRITING-STYLE-GUIDE.md` (tone, banned words, voice)
   - `.planning/platform-gotchas.md` (for `:::warning` callouts)
   - `.planning/specs/leoptical-client.md` (client scenario)
   - The module's existing file in `docs/` (to preserve frontmatter/sidebar_position)

   Produces the full module in a single pass:
   - **Frontmatter** — preserve `sidebar_position`, set `title` and `description`
   - **Overview** — LEOptical grounding, difficulty expectations
   - **Lesson overview** — bullet list with standard intro sentence
   - **Lesson body** — freeform H2 subsections, inline walkthroughs, `:::warning` for gotchas, `:::tip Coming from MCE?` callouts at relevant points
   - **Assignment** — from module-assignments spec, client framing where appropriate
   - **Success Criteria** — from module-assignments spec, verifiable items only
   - **Knowledge check** — 4-8 reflection questions
   - **Additional resources** — links from research file with descriptions

   Writes output to `docs/{part}/{slug}.md`.

3. **Dispatch fact-checker agent.** Reads:
   - The draft just written
   - The research file

   Cross-references every factual claim (UI paths, field names, feature behaviors, navigation steps, platform limitations). Anything not supported by the research file gets `<!-- VERIFY: {specific concern} -->` added inline. The agent edits the file in place. It does not rewrite content or change tone.

4. **Run content linter.** Execute `npm run lint:content docs/{part}/{slug}.md`. Report errors and warnings.

5. **Update progress.** Edit `.planning/PROGRESS.md`:
   - If VERIFY flags exist: mark Content column as `Draft (n VERIFY)`
   - If clean: mark Content column as `Draft`
   - Screenshots and Verified columns remain `-`

6. **Report results.** Output:
   > Module `{title}` drafted at `docs/{part}/{slug}.md`.
   > - {verify_count} VERIFY flags added (requires human review in SDO)
   > - {lint_errors} lint errors, {lint_warnings} lint warnings
   > - Progress updated in `.planning/PROGRESS.md`

### Writer Agent Constraints

- You are writing course content for experienced Salesforce consultants learning MCA. Not beginners.
- Follow the writing style guide exactly. No em dashes, no exclamation marks, no banned words. No semicolons, no ellipses.
- Follow the module template section order exactly. Do not rename or reorder sections.
- Your factual source is the research file. Do not invent UI paths, field names, or behaviors. If the research does not cover something you need to explain, insert `<!-- VERIFY: {what needs checking} -->`.
- Tone: The Odin Project. Direct, honest, conversational. Respect the learner's time.
- Ground assignments in the LEOptical scenario where the spec calls for it.
- Use "Data 360" not "Data Cloud". Use "MCA" not "Marketing Cloud Growth".

### Fact-Checker Agent Constraints

- You are a fact-checker. Compare the draft against the research file only.
- For every factual claim (UI navigation path, field name, feature behavior, platform limitation), confirm it appears in the research file.
- If a claim is not supported by the research file, add `<!-- VERIFY: {specific concern} -->` immediately before the claim in the markdown.
- Do not rewrite content. Do not change tone. Do not fix style issues. Only add VERIFY flags.
- Pay special attention to: navigation paths (`Setup > X > Y`), field names, DMO names, and behavioral claims about what the platform does or does not do.
