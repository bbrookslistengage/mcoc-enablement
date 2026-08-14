# LEOptical Client Spec — Index

This spec was split from the original `2026-08-06-leoptical-client-assignments.md` into focused reference files. Pull in only what you need for the task at hand.

| File | What's In It | When To Use |
|------|-------------|-------------|
| [leoptical-client.md](leoptical-client.md) | Company profile, product families, previous state, engagement scope, key terminology | Always — quick context for any module |
| [seed-data.md](seed-data.md) | **DEPRECATED** — old 3-CSV structure. See `2026-08-12-data-360-data-model-design.md` and `.planning/DATA-MODEL.md` for current data model. | Legacy reference only |
| [2026-08-12-data-360-data-model-design.md](2026-08-12-data-360-data-model-design.md) | Full data model design: CSV schemas, DMO mappings, field-level mappings, Data Graph structure, dirty data strategy, refresh dependency chain | Writing any module that touches data |
| [web-connector.md](web-connector.md) | Interactions SDK approach, Netlify site, identity events, anonymous-to-known flow | Writing the web connector module |
| [module-assignments.md](module-assignments.md) | All 25 module assignments (client ask, assignment, success criteria), module order, dependency chain | Planning, sequencing, writing any module |

## Resolved Decisions

All open questions from the original spec have been resolved:

1. **Email sending domain** — Learners purchase a cheap domain on Porkbun (~$1-2/year) and configure DNS (SPF, DKIM, DMARC). Long-term: LE IT may set up LE-owned subdomains.
2. **Data model mapping** — Full target data model designed. See [2026-08-12-data-360-data-model-design.md](2026-08-12-data-360-data-model-design.md).
3. **Einstein Engagement Scoring** — Will NOT work with seed data (requires 1,000+ real engagement events in prior 90 days). Module 23 is conceptual + configuration-only.
4. **Reporting & Dashboards** — Marketing Performance was NOT sunset — renamed to "Marketing Performance Intelligence" (Tableau Next-powered) in Summer 2026. Module 24 updated accordingly.
5. **Web connector / beacon hosting** — Netlify free tier with drag-and-drop deploy. See [web-connector.md](web-connector.md).
6. **Domain authentication / DNS** — Same as #1.
