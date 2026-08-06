---
name: write-module
description: "Write a complete MCA course module from research. Drafts the content, fact-checks it, runs the linter, and updates progress tracking."
---

Write the course module for: **$ARGUMENTS**

## Instructions

1. Read `src/components/ProgressOverview.tsx` and find the module with slug `$ARGUMENTS` in the `COURSE_PARTS` array. Extract:
   - The module's `title`
   - The module's `path` (extract the part folder, e.g., `/part-2-data/segmentation` means part folder is `part-2-data`)

   If the slug `$ARGUMENTS` does not exist in `COURSE_PARTS`, stop and tell the user:
   > Invalid module slug: `$ARGUMENTS`. Run `/write-module {valid-slug}` with one of the slugs from the course.
   Then list all valid slugs.

2. Check that the research file exists:
   ```bash
   test -f .planning/research/$ARGUMENTS.md && echo "Research file found" || echo "NOT FOUND"
   ```
   If the research file does not exist, stop and tell the user:
   > No research file found for `$ARGUMENTS`. Run `/research-module $ARGUMENTS` first.

3. Dispatch the **module-writer** agent with this description:
   > Write the complete module draft for "{title}" (slug: {slug}, part folder: {part-folder}). Read the research file at `.planning/research/{slug}.md` and all style/template guides. Write the output to `docs/{part-folder}/{slug}.md`.

4. After the writer agent completes, dispatch the **fact-checker** agent with this description:
   > Fact-check the module draft for "{title}". Read the draft at `docs/{part-folder}/{slug}.md` and cross-reference against the research file at `.planning/research/{slug}.md`. Add VERIFY flags for any unsupported factual claims.

5. After the fact-checker completes, run the content linter:
   ```bash
   npm run lint:content docs/{part-folder}/{slug}.md
   ```
   Capture the output (error count and warning count).

6. Count the VERIFY flags in the final file:
   ```bash
   grep -c '{/\* VERIFY' docs/{part-folder}/{slug}.md || echo "0"
   ```

7. Update `.planning/PROGRESS.md`. Find the row for this module in the Phase 4 table and update the **Content** column:
   - If VERIFY flags exist: set to `Draft ({n} VERIFY)`
   - If no VERIFY flags: set to `Draft`
   - Leave Skeleton, Screenshots, and Verified columns unchanged.

8. Output this summary:
   > Module **{title}** drafted at `docs/{part-folder}/{slug}.md`.
   > - {verify_count} VERIFY flags added (requires human review in SDO)
   > - {lint_errors} lint errors, {lint_warnings} lint warnings
   > - Progress updated in `.planning/PROGRESS.md`
