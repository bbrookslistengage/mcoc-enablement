# Identity Resolution Module — Research Brief

## Key Requirements from Course Author

### Credit Cost
- IDR is the most expensive credit operation in MCA: **100,000 credits per 1 million rows processed**
- Must communicate this clearly so learners understand the cost implications of IDR configuration choices

### When Records Are Processed by IDR (must be comprehensive and accurate — research all triggers)
- New profiles ingested
- Updates to existing profiles
- Updates/changes to matching rules (full reprocessing?)
- Any other triggers — research all of them

### Conceptual Foundation
- Assume the learner knows **nothing** about IDR
- Explain the difference between an **Individual** (source record DMO) and a **Unified Individual** (IDR output DMO)
- Emphasize why the Unified Individual is critical for MCA: data graphs, segmentation, everything downstream depends on it

### Reconciliation Rules
- Cover reconciliation rules thoroughly — what they are, how they work, priority, field-level resolution

### Match Rules
- Cover match rules (exact, fuzzy, normalization, rule priority)
- Include the **custom IDR rules we'll need for LEOptical's data model**
  - Contacts with multiple email addresses
  - Loyalty data
  - Eye exam records
  - (Research what rules make sense given the data model)

### Course Arc
- We start with base IDR rules in this module
- Later in the course (web connector module), we add additional rules
- The module should acknowledge this: "we'll revisit IDR when we add web tracking data"

### Multiple IDR Rulesets
- You *can* create multiple IDR rulesets, but it is **not recommended**
- Each ruleset produces its own separate Unified Individual DMO — two rulesets = two separate unified identity spaces, which creates confusion and downstream complexity
- Mention this briefly so learners understand the option exists, but steer them toward a single ruleset

### Advanced IDR Patterns (mention but do not teach)
- Data 360 supports **household IDR** — resolving individuals into household groups
- Data 360 also supports **account IDR** — resolving business accounts
- These are valid use cases but out of scope for this course (B2C / individual person focus)
- Briefly acknowledge they exist with links to further reading; do not go deeper

### Style
- Link sources inline for further reading (not just at the bottom)
- Direct, no filler — but thorough on the fundamentals since this is a zero-to-one topic
