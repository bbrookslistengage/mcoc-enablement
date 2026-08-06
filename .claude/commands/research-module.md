---
name: research-module
description: "Research an MCA platform feature for a course module. Gathers Salesforce docs, Trailhead modules, and internal specs into a structured research file."
---

Research the MCA platform feature for module: **$ARGUMENTS**

## Instructions

1. Read `src/components/ProgressOverview.tsx` and find the module with slug `$ARGUMENTS` in the `COURSE_PARTS` array. Extract:
   - The module's `title`
   - The module's `path` (this tells you the part folder, e.g., `/part-1-foundations/getting-started` means the part folder is `part-1-foundations`)

   If the slug `$ARGUMENTS` does not exist in `COURSE_PARTS`, stop and tell the user:
   > Invalid module slug: `$ARGUMENTS`. Run `/research-module {valid-slug}` with one of the slugs from the course.
   Then list all valid slugs.

2. Create the research output directory if it does not exist:
   ```bash
   mkdir -p .planning/research
   ```

3. Dispatch the **researcher** agent with this description:
   > Research the MCA platform feature for module "{title}" (slug: {slug}, part folder: {part-folder}). Write the research file to `.planning/research/{slug}.md`.

4. After the agent completes, verify the research file was created:
   ```bash
   test -f .planning/research/$ARGUMENTS.md && echo "Research file created" || echo "ERROR: Research file not created"
   ```

5. Output this message:
   > Research for **{title}** saved to `.planning/research/{slug}.md`.
   >
   > Clear your context and run `/write-module {slug}` to draft the module content.
