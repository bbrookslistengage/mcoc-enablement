# Research: MCA vs. MCE

Generated: 2026-08-09
Module: mca-vs-mce
Sources: 18 sources consulted

## Module Context

**From `.planning/specs/2026-08-09-introduction-section.md` (Page 2):**

**Purpose:** High-level orientation for consultants coming from MCE. Not a feature-by-feature comparison. A mindset shift. Also welcoming to consultants who have no MCE background at all.

**Overview (~100 words):**
Whether you are coming from MCE or encountering marketing automation on the Salesforce platform for the first time, this module gives you the high-level context for what MCA is and how it differs from its predecessor. Throughout the course, "Coming from MCE?" callouts draw specific comparisons where relevant. This module is the big picture.

**Lesson body sections:**

1. **What is MCA** — Marketing Cloud Advanced is Salesforce's current marketing automation product. Built natively on the Salesforce platform and on Data 360. Brief mention of "Marketing Cloud Growth" naming. This course uses "MCA."

2. **The architectural shift** — MCA is not MCE with a new UI. Fundamentally different architecture. MCE was standalone (data extensions, Journey Builder, Automation Studio, Content Builder, own sending infrastructure). MCA is built on Data 360 and core Salesforce platform. Uses Salesforce Flow for automation. Marketing features are a thin layer on top of Data 360. Key framing: "MCA is mostly Data 360 with a thin marketing layer on top."

3. **What this means in practice** — In MCE, data and marketing tools were self-contained. In MCA, before you can send anything, you need data streams, DMO mappings, identity resolution, segments. Marketing tools depend entirely on data layer. Not a criticism, architectural reality.

4. **Coming from MCE? callouts throughout the course** — Every module with an MCE equivalent will include a callout. Placed at point of relevance, not lumped at end. Skippable for those without MCE background.

**Assignment (lightweight):**
- Read a Salesforce article or resource that describes MCA's architecture at a high level (writer/researcher to find appropriate link)
- If MCE experience: write down 3 things you expect to be different in MCA

**Knowledge check (4-5 questions):**
- What is the foundational platform that MCA is built on?
- How does MCA's data layer differ from MCE's data extensions and subscriber lists?
- Why does this course describe MCA as "mostly Data 360 with a thin marketing layer on top"?
- What should you do with the "Coming from MCE?" callouts if you have no MCE background?

**Tone exception:** Warmer and more encouraging than standard module tone. Still direct and honest. "Supportive senior colleague who genuinely believes in you."

---

## Platform Concepts

### What MCA Is

MCA (Marketing Cloud Advanced) is Salesforce's current-generation marketing automation platform. It is built natively on the core Salesforce platform (Lightning Platform) and on Data 360 (formerly Data Cloud). It is NOT a rebranding or UI refresh of Marketing Cloud Engagement. It is architecturally distinct.

**Key fact (Trailhead, Salesforce Help):** "Marketing Cloud Next is natively built on the core Salesforce Platform." It connects Data 360 for data unification/segmentation, Salesforce Flow for automation, and Agentforce for AI.

**Key fact (concret.io):** "Marketing Cloud Next is Salesforce's next-generation Marketing solution built natively on the Salesforce Platform (Einstein One Platform)."

**Key fact (Salesforce Ben):** "Marketing Cloud Growth Edition is the first marketing application built on the Einstein 1 (core) platform." It utilizes "the same objects as the core Salesforce platform, such as leads, contacts, campaigns, and more."

### Product Naming History

The naming history is complex and somewhat messy. Based on multiple sources:

**Timeline:**
- **February 2024:** Marketing Cloud Growth Edition launched. First marketing product built natively on core Salesforce platform. Targeted at B2B/SMB. $1,500/month.
- **September 2024 (Dreamforce 2024):** Marketing Cloud Advanced Edition announced. Next tier above Growth. $3,250/month. Available November 2024.
- **2025:** "Marketing Cloud Next" (MCN) became a common umbrella term for the new platform (Growth + Advanced editions). Plus editions introduced for MCE/Account Engagement customers.
- **March 2026 (Spring '26):** Marketing Cloud rebranded to "Agentforce Marketing" as part of broader Salesforce Agentforce rebrand. The transition has been "messy" per CRMxAI: "you've probably seen references to both 'Agentforce Marketing' and plain 'Marketing Cloud' in official Salesforce materials."

**Key clarification (Salesforce.com blog):** Growth and Advanced "are the same product but with different tiers of functionality." Advanced includes everything in Growth plus Einstein Engagement Frequency, Einstein Engagement Scoring, Path Experiments, and SMS.

**Key clarification (Mateusz Dabrowski):** The naming evolution: "Marketing Cloud Growth (MCG) > Marketing Cloud Advanced (MCA) > Marketing Cloud [on Core] (MCoC) > Marketing Cloud Next (MCN) > Marketing Cloud (MC)." This is the evolution of names used informally/officially for the same platform family, not separate products.

**For this course:** We use "MCA" (Marketing Cloud Advanced) as the name. This is the tier that includes the features covered in the course (engagement scoring, engagement frequency, path experiments, SMS).

### MCA Architecture: Data 360 as Foundation

**Confirmed from multiple sources:**

MCA does NOT have its own data layer. It uses Data 360 as its data foundation. Data 360 is described as "a cloud-native, metadata-driven data platform that unifies siloed data across the enterprise" (architect.salesforce.com).

**Data 360 architecture (architect.salesforce.com):**
- Data progresses through three stages: Raw Ingested Data > Data Lake Objects (DLOs) > Data Model Objects (DMOs)
- DLOs are raw staging; DMOs are the harmonized source of truth aligned with the Customer 360 model
- Identity resolution matches records across sources using blocking keys and fuzzy matching, producing Unified Individuals
- 270+ native connectors plus MuleSoft for ingestion
- Supports batch, streaming, and real-time ingestion

**Key fact (Trailhead - Marketing Cloud Next Setup Quick Look):** The key components table shows:
| Function | Technology |
|----------|-----------|
| Data unification & segmentation | Data 360 |
| Automation & workflows | Flow Builder, Campaign object |
| Content creation/management | Digital Experiences app |
| Consent/privacy | Privacy Center |
| AI optimization | Einstein + Agentforce |
| Reporting | Data 360 + Tableau Next |

This confirms the "thin marketing layer" framing: marketing features like email builder, landing pages, and segments are built on top of Data 360, Flow, CMS, and other core platform services rather than being a self-contained marketing suite.

### Flow as the Automation Engine

**Confirmed (multiple sources):**

MCA uses Salesforce Flow for all automation. This replaces Journey Builder and Automation Studio from MCE.

**Key fact (Salesforce Ben):** Flow powers all automation in MCN, marking "the first appearance of what have been termed 'non-admin flows' -- a condensed interface allowing marketers to configure automation without managing complex node structures."

**8 Marketing Flow Types (The Agentic Marketer):**
1. Segment Triggered Flow (most common campaign flow type)
2. Automation Event-Triggered Flow (email clicks, form submissions)
3. Salesforce Record Triggered Flow
4. Data Cloud Record Triggered Flow
5. On-Demand Flow (via REST API)
6. Broadcast Flow (related to Dynamic Segments)
7. Activation-Triggered Flow
8. Autolaunched Flow (reusable sub-flows)

### MCE Architecture (for comparison)

**Confirmed from multiple sources:**

MCE (Marketing Cloud Engagement) was originally ExactTarget, acquired by Salesforce. It operates as a standalone platform outside the core Salesforce platform.

**Key fact (Mateusz Dabrowski):** MCE naming lineage: "ExactTarget (ET) > Marketing Cloud (SFMC) > Marketing Cloud Engagement (MCE)." It is the "only one of the three [marketing products] that can work as a standalone Marketing Automation platform." It is a "25-year-old platform."

**Key fact (Noltic):** MCE "runs outside the Salesforce core platform" and "requires integrations to sync with Sales Cloud and Service Cloud."

**MCE's self-contained components:**
- **Data layer:** Data extensions, subscriber lists, SQL queries (self-contained, no dependency on external data platform)
- **Automation engine:** Journey Builder (visual journey orchestration), Automation Studio (scheduled batch operations)
- **Content tools:** Content Builder (email, SMS, push content creation)
- **Sending infrastructure:** Own email/SMS sending infrastructure
- **Scripting:** AMPscript, SSJS, SQL

### Nuances the Spec Should Be Aware Of

**Does MCA have ANY of its own data storage?**
No. All customer data lives in Data 360. MCA does use standard Salesforce objects (Campaign, CampaignMember) which live in the core CRM, but the marketing data model (individuals, contact points, segments, consent) is entirely in Data 360. The content assets (emails, landing pages) live in Salesforce CMS.

**Are there automation capabilities beyond Flow?**
Not really. All automation in MCA runs through Salesforce Flow. Agentforce provides AI-driven automation assistance (campaign creation, optimization) but this operates through Flow as the execution engine. There is no separate automation engine like Journey Builder or Automation Studio.

**Is the "thin marketing layer" framing accurate?**
Yes, this is well-supported. The Trailhead module explicitly shows that each major function (data, automation, content, consent, reporting) is handled by a different core platform service. The marketing-specific additions are: email builder (on CMS), segments (on Data 360), marketing flow elements (on Flow), and landing pages (on Digital Experiences). These are marketing-specific features layered onto existing platform services.

**Important nuance for MCE users:** Salesforce positions MCN as complementary to MCE, not as a replacement. The Trailhead module "Marketing Cloud Next for Marketing Cloud Engagement Foundations" frames it as "keep what works and add what's next." MCE customers can run both systems in parallel. For this course, we are teaching MCA as the primary platform, not as an add-on to MCE.

---

## UI Navigation Paths

This module is conceptual and does not involve UI navigation. No navigation paths to document.

---

## Platform Gotchas

No gotchas from `platform-gotchas.md` directly apply to this introductory/conceptual module. However, the following gotchas are relevant context for the "what this means in practice" section:

- **SDOs have one data space** (confirmed 2026-08-06, Summer '26): SDO orgs only have a single data space. Business units cannot be enabled. This is a practical difference from MCE where business units were standard.

- **IDR auto-creates a default ruleset during MCA setup** (confirmed 2026-08-06, Summer '26): MCA setup can auto-create a default IDR ruleset. This illustrates how data architecture setup is required before marketing can begin.

---

## MCE Comparison Points

### 1. Data Layer
| Aspect | MCE | MCA |
|--------|-----|-----|
| Data storage | Data extensions, subscriber lists (self-contained) | Data 360 DMOs (shared platform) |
| Data model | Flat tables (data extensions) with optional relational links | Canonical data model with standard/custom DMOs and relationships |
| Data ingestion | Import wizards, API, FTP, SQL queries | Data streams (270+ connectors, CSV, CRM auto-sync) |
| Data staging | No staging layer; data goes directly into data extensions | DLOs (raw staging) > DMOs (harmonized model) |
| Identity | Subscriber key (single identifier) | Identity resolution with fuzzy matching, producing Unified Individuals |

### 2. Automation Engine
| Aspect | MCE | MCA |
|--------|-----|-----|
| Visual journey automation | Journey Builder | Salesforce Flow (marketing flow types) |
| Batch/scheduled automation | Automation Studio | Salesforce Flow (scheduled flows) |
| Trigger-based automation | Triggered sends, Journey Builder API events | Flow triggers (segment, event, record, Data Cloud, API) |
| Scripting | AMPscript, SSJS, SQL | Handlebars (primary), AMPscript (partial support), Flow formulas |

### 3. Content Tools
| Aspect | MCE | MCA |
|--------|-----|-----|
| Email builder | Content Builder | Email Builder (built on Salesforce CMS) |
| Landing pages | CloudPages | Landing Pages (built on Digital Experiences) |
| Forms | CloudPages with AMPscript | Form Builder (drag-and-drop, CMS-based) |
| Asset management | Content Builder folders | Salesforce CMS workspaces |

### 4. Platform Independence
| Aspect | MCE | MCA |
|--------|-----|-----|
| Can run standalone? | Yes (no CRM required) | No (requires Enterprise+ CRM license) |
| CRM integration | Connector-based (Marketing Cloud Connect) | Native (built on same platform) |
| Cross-cloud data access | Requires sync/integration | Native (shared Data 360 layer) |

### 5. Key Conceptual Shift
MCE was a **self-contained marketing platform** with its own data, automation, content, and sending infrastructure. You could build an email, create a data extension, write a query, and send, all within one system.

MCA is a **marketing layer on top of platform services**. Before you can send anything, you need: data streams configured, data mapped to DMOs, identity resolution running, and segments built. The marketing features have nothing to work with until the data layer is operational.

---

## External Resources

### Assignment Resources (recommended for the module assignment)

- [Marketing Cloud Next Basics (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-basics) -- Foundational Trailhead module (~20 min). Covers what MCN is, core features, and agentic marketing concepts. Good high-level orientation. **Recommended as the primary assignment reading.**

- [Get to Know Marketing Cloud Next (Trailhead unit)](https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-basics/get-to-know-marketing-cloud-next) -- First unit of the above module. Covers MCN as "natively built on the core Salesforce Platform," Data 360 integration, and Agentforce. Concise and official.

- [Marketing Cloud Next for Marketing Cloud Engagement Foundations (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-for-marketing-cloud-engagement-foundations) -- For learners with MCE background. Covers the four-layer architecture, how MCN works alongside MCE, and practical transition guidance. Good supplementary reading for MCE consultants.

### Additional Resources

- [Introduction to Marketing Cloud Next Features and Benefits (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-setup-quick-look/know-marketing-cloud) -- Setup quick-look module. Includes the components table (Data 360 for data, Flow Builder for automation, Digital Experiences for content, etc.). Confirms the "thin marketing layer" architecture.

- [What is Marketing Cloud Advanced Edition? (Salesforce Blog)](https://www.salesforce.com/blog/marketing-cloud-advanced-edition/) -- Official Salesforce blog post from Dreamforce 2024. Describes Advanced as the next tier above Growth, both built on Data Cloud. Covers Einstein features unique to Advanced.

- [Data 360 Architecture (Salesforce Architects)](https://architect.salesforce.com/docs/architect/fundamentals/guide/data-360-architecture.html) -- Deep technical architecture of Data 360. Covers the three-stage data progression (raw > DLO > DMO), identity resolution, real-time capabilities, and activation pipeline. Too detailed for the intro module but excellent reference.

- [What is the difference between SF Marketing Clouds? (Mateusz Dabrowski)](https://mateuszdabrowski.pl/sites/faq/salesforce/what-is-the-difference-between-sf-marketing-clouds/) -- Community resource with the clearest naming history timeline. Covers MCE lineage (ExactTarget > SFMC > MCE), MCN lineage (MCG > MCA > MCN), and key architectural differences.

- [Marketing Cloud Next Explained: Growth, Advanced & Plus (concret.io)](https://www.concret.io/blog/marketing-cloud-next-growth-and-advanced-editions) -- Good overview of edition tiers, pricing, and the distinction between Growth, Advanced, and Plus editions.

- [Salesforce Marketing Cloud 2026 editions explained (Noltic)](https://noltic.com/stories/salesforce-marketing-cloud-editions-explained) -- Covers all five marketing products (MCE, MCAE, Growth, Advanced, MCN) and their positioning. Confirms MCE runs "outside the Salesforce core platform."

- [The 8 Main Marketing Flow Types (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/) -- Detailed breakdown of all 8 flow types available in MCN. Useful reference for "Flow replaces Journey Builder" claims.

- [Expanded Marketing Cloud Growth and Advanced Editions (Salesforce Blog)](https://www.salesforce.com/blog/expanded-marketing-cloud-growth-advanced/) -- Official blog on expanded availability and features.

---

## Data Model Relevance

This module does not directly involve data model configuration. It is a conceptual orientation module. The data model becomes relevant starting in the Getting Started and Data 360/DMO modules.

The module does reference the data dependency chain at a high level:
- Data streams > DMO mappings > Identity resolution > Segments > Marketing features
- This chain is documented in detail in `.planning/specs/data-model.md` under "Data Refresh Dependency Chain"

---

## Source Log

- https://www.salesforce.com/blog/marketing-cloud-advanced-edition/ -- Official Salesforce blog. Confirmed Advanced launched Dreamforce 2024, available Nov 2024. Growth and Advanced are same product, different tiers.
- https://mateuszdabrowski.pl/sites/faq/salesforce/what-is-the-difference-between-sf-marketing-clouds/ -- Community FAQ. Best naming history found. Confirmed MCE is ExactTarget lineage, MCN is new platform lineage. MCE is standalone, MCN requires CRM.
- https://www.digitalaquila.com/2025/03/31/marketing-cloud-advanced-vs-salesforce-marketing-cloud-engage/ -- Discarded: surface-level marketing content with no technical architecture details.
- https://www.concret.io/blog/marketing-cloud-next-growth-and-advanced-editions -- Good overview. Confirmed MCN built natively on Salesforce Platform. Edition tiers and pricing.
- https://forcery.com/new-marketing-cloud-on-core-growth-advanced/ -- Discarded: page did not load article body, only metadata/CSS.
- https://www.salesforceben.com/salesforce-announce-marketing-cloud-built-on-the-core-platform/ -- Good. Confirmed Growth is first marketing app on core platform. Data Cloud does heavy lifting. Flow powers automation. Builders on Salesforce CMS.
- https://georgelahoud.com/salesforce-marketing-cloud-growth-vs-advanced-vs-engagement-explained/ -- Limited. Confirmed Growth/Advanced on core platform, MCE is legacy with separate infrastructure.
- https://crmxai.com/blog/salesforce-agentforce-rebrand-product-names -- Confirmed Marketing Cloud renamed to Agentforce Marketing in Spring '26. Transition described as "messy."
- https://noltic.com/stories/salesforce-marketing-cloud-editions-explained -- Good overview. Confirmed Growth/Advanced built on core platform with native CRM access. MCE runs outside core platform.
- https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-setup-quick-look/know-marketing-cloud -- Trailhead. Key components table: Data 360 for data, Flow Builder for automation, Digital Experiences for content. Confirmed architecture.
- https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-basics/get-to-know-marketing-cloud-next -- Trailhead. Confirmed MCN "natively built on the core Salesforce Platform." Three components: Salesforce Platform, Data 360, Agentforce.
- https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-basics -- Trailhead module overview. ~20 min, foundational. Good assignment resource.
- https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-for-marketing-cloud-engagement-foundations/get-to-know-marketing-cloud-next-with-marketing-cloud-engagement -- Trailhead for MCE users. Four-layer architecture. "Keep what works and add what's next." MCE as foundational layer, MCN as enhancement.
- https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-basics/explore-marketing-cloud-next-use-cases -- Trailhead. Use cases and capabilities. Zero-copy data access. AI-powered segmentation.
- https://architect.salesforce.com/docs/architect/fundamentals/guide/data-360-architecture.html -- Salesforce Architects. Deep technical architecture. Three-stage data model (raw > DLO > DMO). Identity resolution. 270+ connectors. Activation pipeline.
- https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_main.htm&type=5 -- Discarded: page loaded only portal infrastructure/scripts, no documentation content.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/ -- 8 marketing flow types in MCN. Detailed breakdown. Confirms Flow replaces Journey Builder.
- https://www.salesforce.com/blog/next-gen-marketing-cloud-details/ -- Official Salesforce blog. Next-gen MC product details. Plus editions for existing MCE/MCAE customers. Pricing. Generally available Oct 2025.
