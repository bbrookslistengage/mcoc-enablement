# LEOptical — Module Assignments

## Course Structure (Revised 2026-08-12)

See `.planning/specs/2026-08-12-course-restructure-design.md` for the full restructure design spec.

**Part 3: Content & Email Building**
| # | Module |
|---|--------|
| 11 | Salesforce CMS & Content Management |
| 12 | The Email Builder |
| 13 | Content Blocks |
| 14 | Email Templates |

**Part 4: Dynamic Content & Personalization**
| # | Module |
|---|--------|
| 15 | Marketing Objects |
| 16 | Merge Fields & Dynamic Content |
| 17 | Handlebars: Foundations |
| 18 | Handlebars: Working with Data |
| 19 | Handlebars: Advanced Techniques |
| 20 | AMPscript in MCA |
| 21 | Project: Personalized Campaign Email |

**Part 5: Flows & Automation**
| # | Module |
|---|--------|
| 22 | Flow Fundamentals |
| 23 | Activation Templates |
| 24 | Flows: Orchestration & Logic |
| 25 | Flows: Advanced |
| 26 | Project: Consent Automation Flow |

**Part 6: Landing Pages & Web**
| # | Module |
|---|--------|
| 27 | Landing Pages & Forms |
| 28 | Landing Pages: Advanced |
| 29 | Web Connector (multi-subpage) |

**Part 7: Campaigns & Analytics**
| # | Module |
|---|--------|
| 30 | Campaigns in MCA |
| 31 | Reporting & Dashboards |

**Part 8: AI & Intelligence**
| # | Module |
|---|--------|
| 32 | Agentforce for Marketing |
| 33 | Conversational Messaging |
| 34 | Predictive AI |

**Part 9: Capstone**
| # | Module |
|---|--------|
| 35 | Capstone Project |

---

## Part 1: Setup & Foundations

### Module 1 — Getting Started

> **The client wants:** LEOptical just signed their Salesforce contract. They need their MCA environment provisioned and ready for the team to start configuring.

**Assignment:**
- Provision your SDO and verify Core Org Edition requirements are met
- Provision Data 360 and install the Marketing Data Kit
- Assign the necessary permission sets to your user
- Create 4 custom fields on Contact (Loyalty Tier, Loyalty Points, Last Exam Date, Next Exam Due)
- Import `contacts.csv` (~48,675 Contacts) via the Data Import Wizard
- Run the Products & Campaigns anonymous Apex snippet in Developer Console
- Take a platform tour: navigate to MCA setup, Data 360 setup, and Salesforce CMS
- Note the Campaign IDs for the seeded campaigns — you'll need these in later modules

**Success Criteria:**
- [ ] MCA is accessible from the App Launcher
- [ ] Data 360 is provisioned and accessible
- [ ] Marketing Data Kit is installed
- [ ] Permission sets are assigned
- [ ] Seed data is visible: ~48,675 Contacts, 1 Account ("LEOptical Customers"), 5 Products, 3 Campaigns
- [ ] Campaign IDs are documented for later use

**Stretch Goal:**
- Explore dynamic sending configuration concepts

> **Content note:** The lesson portion will most likely link to a Medium article for detailed setup instructions.

---

### Module 2 — Domain Setup

> **The client wants:** LEOptical's marketing emails should come from a branded domain, not a generic Salesforce address. They also want branded links in emails and a custom domain for landing pages.

**Assignment:**
- Configure email domain authentication using MCA's self-service domain setup
- Set up a landing page domain
- Configure a link branding domain
- Document the DNS records that would need to be created (TXT, CNAME) — capture what you'd hand to the client's IT team

**Success Criteria:**
- [ ] Email sending domain is configured in MCA setup
- [ ] Landing page domain is configured
- [ ] Link branding domain is configured
- [ ] You can articulate which DNS record types are needed and why

> **Domain strategy (resolved):** Learners purchase a cheap domain on Porkbun (~$1-2/year) and configure DNS records (SPF, DKIM, DMARC) for full domain authentication. This gives them the complete hands-on experience. Long-term, if the course gains internal traction, LE IT will set up a process for LE-owned subdomains.

---

### Module 3 — Business Units & Governance

> **The client wants:** LEOptical currently operates as a single brand. They want their content organized so the marketing team can collaborate without stepping on each other's work.

**Assignment:**
- Document when business units are required and the criteria that would trigger BU creation
- Set up roles and permissions for three marketing personas: Marketing Manager (full access), Content Creator (CMS + email templates only), Campaign Specialist (flows + segments only)
- Create an Enhanced CMS Workspace called "LEOptical Marketing" for organizing brand assets

**Success Criteria:**
- [ ] Written justification for why LEOptical doesn't need multiple BUs today
- [ ] Criteria for future BU creation are documented
- [ ] Three roles/permission sets configured with appropriate access levels
- [ ] Enhanced CMS Workspace "LEOptical Marketing" is created

> **Platform note:** SDOs only have one data space and business units cannot be enabled. This module focuses on understanding the concepts and configuring what is available (roles, permissions, CMS workspaces).

---

### Module 4 — Consent Fundamentals

> **The client wants:** LEOptical plans to communicate with customers via email. Before building anything, they need a consent strategy that works with MCA's consent model.

**Assignment:**
- Map LEOptical's email communication needs to a consent purpose
- Diagram the relationships between platform consent objects: Communication Subscription Consent, Contact Point Consent, Consent Purpose, Individual
- Understand the consent gotchas specific to MCA:
  - Consent is NOT implicit in MCA — you need an explicit consent record for every individual before you can send to them
  - MCA updates the Communication Subscription Consent DMO with OPT_IN or OPT_OUT values when someone opts in/out via the preference center
  - Communication Subscription Consent relates to Individual on `Individual ID = Party`, however MCA does not populate the Party field — so the out-of-the-box relationship doesn't work
  - The workaround: relate Communication Subscription Consent to Contact Point Email where `Email Address = Consent Value` (or the equivalent field on the Comm Sub Consent DMO)
- Write a brief consent strategy document covering: what consent is captured, where, how it's enforced, and the known platform gotchas

**Success Criteria:**
- [ ] Email consent purpose is identified and documented
- [ ] Consent object relationship diagram is complete, including the Party field gotcha
- [ ] Consent strategy document explains the explicit opt-in requirement
- [ ] You can explain how consent is checked before a message is sent
- [ ] You can explain the Comm Sub Consent -> Contact Point Email relationship workaround

> **Important:** For the remainder of the course, understand that every Individual in Data 360 needs an explicit consent record before they can receive marketing emails. This is a foundational concept that affects every subsequent module.

---

### Module 5 — Consent Configuration

> **The client wants:** Build the consent infrastructure. Create consent records, configure a consent banner, and — critically — set up the automation that grants consent to new individuals as they enter the system.

**Assignment:**
- **Update your 10 protagonist contacts with your email address.** The protagonist contacts were imported in Module 1 with `@example.com` placeholder emails. Before you can receive test emails, you need to update them with your own address using `+alias` patterns (e.g., `yourname+mariac@gmail.com`). Run the update script provided on the course page in Developer Console. This creates a second Contact Point Email in Data 360 for each protagonist while preserving the original `@example.com` email (which links to their ecommerce orders and loyalty records).
- Create Communication Subscriptions for email marketing (Promotional Offers, VisionCare Rewards Updates, Eye Health Reminders)
- Add subscriptions to the default preference page
- Add the Privacy Consent Status component to Contact and Lead record pages, activate as org default
- Use CSV import to create OPT_IN records for protagonist contacts (consent banner and web connector configuration deferred to later modules)
- Build a Data 360 Triggered Flow that automatically creates consent records for new individuals:
  - The flow listens for changes on the Individual DMO — specifically when a field like "Email Marketing Opt-In" becomes true
  - When triggered, the flow performs a Contact Point Email lookup for that individual
  - The flow creates a Communication Subscription Consent record with OPT_IN for those email addresses
- Add the Consent Lightning Web Component to the Contact record pages so consent status is visible in the CRM
- **Test the consent flow in phases:**
  1. **Manual validation first:** Manually create 2-3 new Contacts in Salesforce with the opt-in field set to true. Verify the triggered flow fires and creates consent records for each. Check the consent LWC on the record page to confirm. If the flow doesn't work, debug it now — because if it's broken, the next step will create records without consent and you'll have to clean them up manually
  2. **CSV stress test:** Once the flow is validated, download `new_contacts_batch1.csv` (~20 new contacts) and import them via the Data Import Wizard. Verify that consent records are created for all of them. Check for edge cases: did any fail? Why?
  3. **Spot-check the protagonist contacts:** Verify that your 10 protagonist contacts (updated with your email earlier in this module) have consent records. If they don't, you won't receive test emails in later modules

**Success Criteria:**
- [ ] Consent Purpose records exist for email marketing
- [ ] Consent Templates are created and linked to purposes
- [ ] Consent banner is configured and ready for landing page deployment
- [ ] Data 360 Triggered Flow is built and activated for new individual consent
- [ ] Consent LWC is added to Lead and Contact record page layouts
- [ ] Manual test: 2-3 manually created Leads/Contacts have consent records created by the flow
- [ ] CSV stress test: batch-imported contacts have consent records created by the flow
- [ ] Protagonist contacts have consent records and are ready for email testing
- [ ] You can explain why this automation is necessary (MCA doesn't auto-create consent)

> **Why test manually first?** If the consent flow has a bug, every record imported via CSV will be created without consent. You'd then need to either fix the flow and re-trigger it for all those records, or manually create consent records. Testing with 2-3 manual records first catches flow issues before they become an 80,000-record cleanup problem. This is the same approach you'd use on a real engagement — validate with a small batch before running at scale.

---

## Part 2: Data & Audiences

### Module 6 — Data 360 & Data Model Objects

> **The client wants:** LEOptical has customer data in three places: Salesforce CRM (from the seed data), their VisionCare Rewards loyalty platform (CSV), and their ecommerce store (CSV). They need all of this in Data 360 so they can build a unified view of their customers.

**Assignment:**
- Review the Data Model Object (DMO) schema in Data 360 — understand Individual, Contact Point Email, Sales Order, and other standard DMOs
- Review the target data model for LEOptical (provided in the lesson) and understand why each DMO and relationship was chosen
- Download `loyalty_members.csv` and `ecommerce_orders.csv` from the course resources
- Create Data Streams for each CSV source and ingest them into Data 360
- Map the incoming fields to appropriate DMOs (standard or custom as specified in the target data model)
- Verify data is flowing: check record counts in each DMO after ingestion

**Success Criteria:**
- [ ] You understand the target LEOptical data model and can explain the DMO relationships
- [ ] Two Data Streams are configured (loyalty, ecommerce)
- [ ] CSV data is ingested and visible in Data 360
- [ ] Fields are mapped to the correct DMOs per the target data model
- [ ] You've investigated any record count discrepancies between source files and ingested DMOs
- [ ] You can explain why some records may fail to ingest (missing required fields, format mismatches)

> **A note on record counts:** Your ingested record counts may not exactly match the row counts in your CSV files. If they don't match, investigate why. This is normal — welcome to real consulting. Common causes include missing required fields, date format mismatches, and values the platform doesn't recognize. Document what you find.

> **Data model (resolved):** See [data-model.md](data-model.md) for the complete target data model, ERD, DMO mappings, and Data Graph structure.

---

### Module 7 — CRM Data Ingestion

> **The client wants:** Their Salesforce CRM is the system of record for Contacts, Accounts, and product catalog. They need this CRM data flowing into Data 360.

**Assignment:**
- Understand that MCA setup auto-installs the CRM data streams and data kits — review what was automatically configured
- Verify CRM objects are mapped to DMOs (Contact -> Individual, Account -> Account, etc.)
- Review the auto-configured mappings and adjust if needed to match the LEOptical target data model
- Create an Actionable List from CRM data — specifically, a list of Contacts who are Campaign Members in the "VisionCare Rewards Launch" Campaign
- Verify CRM data is visible in Data 360 and matches your seed data

**Success Criteria:**
- [ ] CRM data streams (auto-installed) are reviewed and understood
- [ ] CRM-to-DMO mappings are correct per the target data model
- [ ] Actionable List "VisionCare Rewards Members" is created and populated from Campaign membership
- [ ] Record counts in Data 360 match expected CRM record counts
- [ ] You understand the difference between manually created data streams and auto-installed ones

---

### Module 8 — Data Graphs

> **The client wants:** LEOptical needs to answer questions like "Show me Gold loyalty members who purchased SeeClear lenses online in the last 90 days." Build the data graph that makes this possible.

**Assignment:**
- Build a Data Graph connecting: Individual -> Contact Point Email -> Sales Orders -> Products, and Individual -> Loyalty Program Member (custom DMO)
- Define the relationships between DMOs in the graph
- Set the default Data Graph for MCA in Setup
- Test the graph by exploring unified profiles that span multiple data sources
- Understand that this Data Graph is what powers dynamic content in emails — without it, Handlebars personalization won't resolve
- Understand a critical Data Graph gotcha: **if an Individual doesn't have data populated for a field, the Data Graph won't include that field in the JSON at all — it won't be null, it simply won't exist.** This matters for Handlebars: there's nothing for the expression to "hook onto." You'll deal with this directly in the Handlebars modules when writing personalization logic

**Success Criteria:**
- [ ] Data Graph is created with all relevant DMO relationships
- [ ] Graph connects CRM, loyalty, and ecommerce data through the Individual
- [ ] Default Data Graph is set in MCA Setup
- [ ] You can navigate unified profiles and see data from multiple sources
- [ ] You understand the dependency: Data Stream refresh -> IDR run -> Data Graph refresh -> dynamic email content resolves
- [ ] You understand the null field gotcha: missing data means the field is absent from the graph JSON, not null

**Introduce:** Activation Templates concept — explain what they are and the required fields. Learners will configure them in the Flows part, but they need to know the concept now as they're building the data model.

---

### Module 9 — Identity Resolution

> **The client wants:** The same customer might be `maria.chen@example.com` in Salesforce, `m.chen@gmail.com` in the loyalty program, and `maria.c@work.com` in ecommerce orders. They need these resolved into unified profiles.

**Assignment:**
- Review the auto-generated IDR ruleset created during MCA setup (explain that setup can auto-create a default ruleset, but it's not required — you can also configure IDR directly in Data 360)
- Evaluate the default ruleset: does it work for LEOptical's data? What matching rules does it use?
- Customize the ruleset: add or adjust matching rules using email match, fuzzy name + email domain, and loyalty ID cross-reference
- Run identity resolution and review the results — how many profiles were unified?
- Investigate match quality: find cases where rules matched incorrectly or missed valid matches, and adjust
- Document your final ruleset configuration and matching strategy
- Discuss: which fields should you discuss with a client for IDR? Why does this conversation matter?

**Success Criteria:**
- [ ] Auto-generated IDR ruleset is reviewed and understood
- [ ] Custom matching rules are configured (at least 3 rules)
- [ ] Identity resolution has run and unified profiles are visible
- [ ] Match results are reviewed and at least one rule is adjusted
- [ ] Unified profile count is documented and reasonable
- [ ] Written explanation of matching strategy, trade-offs, and fields discussed with client

**Stretch Goal:**
- Create a scheduled flow that runs IDR on a recurring basis

---

### Module 10 — Segmentation

> **The client wants:** With unified data in place, LEOptical needs audience segments for their marketing campaigns.

**Assignment:**
Build four segments using Data 360 segmentation:

1. **"VIP Customers"** — Gold or Platinum loyalty tier members
2. **"Lapsed Buyers"** — Customers with no purchase in the last 180 days
3. **"SeeClear Enthusiasts"** — Customers who've purchased any SeeClear product family lens
4. **"Exam Overdue"** — Customers whose last eye exam was more than 12 months ago

For each segment, verify the member count and spot-check profiles to confirm accuracy.

Additionally, learn how to query segment members directly via the **Unified Individual - Latest** DMO.

**Success Criteria:**
- [ ] Four segments are created and populated
- [ ] Each segment's membership count is reasonable given your seed data
- [ ] You've spot-checked at least 2 profiles per segment
- [ ] You can explain the filter logic for each segment
- [ ] You've queried the Unified Individual - Latest DMO to view segment membership

---

### Module 10 — Consumption & Entitlements

> **The client wants:** Before LEOptical goes live, they need to understand how their Data 360 usage impacts their entitlements.

**Assignment:**
- Review Data 360 consumption metrics in your org
- Use the [credit consumption calculator](https://calculate.endpoint.marketing/) to estimate LEOptical's consumption footprint
- Calculate the impact of current design decisions: data streams, unified profiles, segment refresh frequency, data retention
- Identify which design decisions have the biggest consumption impact
- Assess the consumption impact of dirty data: how many credits are consumed by duplicate records, unresolved identities, and orphaned data? What would cleanup save?
- Write a recommendation memo: what should LEOptical monitor as they scale from 80,000 to 600,000 customers?

**Success Criteria:**
- [ ] Consumption metrics are reviewed and documented
- [ ] Credit consumption calculator has been used to model LEOptical's usage
- [ ] Impact of design decisions on consumption is assessed
- [ ] Dirty data consumption impact is assessed (duplicates, orphans, unresolved identities)
- [ ] Scaling recommendation memo is written (1 page)
- [ ] You can advise a client on consumption optimization without sacrificing functionality

> **Terminology note:** The product is called **Data 360**, not "Data Cloud." We use "Data 360" consistently throughout this course.

---

## Part 3: Content & Email Building

### Module 11 — Salesforce CMS & Content Management

> **The client wants:** A central place for marketing assets — logos, product images, legal copy, reusable content blocks.

**Assignment:**
- In the "LEOptical Marketing" CMS Workspace (created in the Business Units & Governance module), create a content organization structure with collections for: Brand Assets, Product Images, Email Content Blocks, Legal/Compliance
- Upload LEOptical brand assets (logo, product images — provided in course resources)
- Create reusable CMS content items: standard email header, standard footer with legal disclaimer, and product description blocks for each of the 4 lens families
- Understand content types and how to create structured content (e.g., a "Product Feature" type with fields for name, description, image, price)

**Success Criteria:**
- [ ] CMS Workspace has organized collections
- [ ] Brand assets are uploaded and accessible
- [ ] Reusable content blocks exist for header, footer, and all 4 products
- [ ] Content is organized so another marketer could navigate it

---

### Module 12 — The Email Builder

> **The client wants:** The marketing team needs to understand exactly how the email builder works. This is the tool they'll live in every day.

**Lesson Focus — Email Builder Mastery:**

This module goes deep on the email builder. Learners should feel very confident using it by the end. Cover:

- **All builder elements** — text, image, button, divider, HTML, dynamic content, etc.
- **Data Sources tab** — how to connect data to an email, what data is available, how data sources relate to the Data Graph
- **Content Variables** — what they are, how to create them, how to use them in email content and within flows
- **HTML paste email** — how to create an email from pasted HTML code
- **Locked vs. editable regions** — how to lock sections so marketers can't modify headers/footers/legal content

**Assignment:**
- Build a scratch email using each major builder element type (text, image, button, divider, HTML block)
- Explore the Data Sources tab: connect your Data Graph and review what data fields are available
- Create at least 2 Content Variables in an email and understand how these get populated when the email is sent from a flow
- Create an HTML paste email using a provided HTML snippet
- Test the locked vs. editable region feature: lock a header section and verify a Content Creator role user cannot modify it

**Success Criteria:**
- [ ] You've used every major builder element at least once
- [ ] You've connected the Data Graph via the Data Sources tab and can navigate available fields
- [ ] Content Variables are created and you understand how they connect to flows
- [ ] HTML paste email is created from provided snippet
- [ ] Locked region behavior is tested and understood

---

### Module 13 — Content Blocks

> **The client wants:** (assignment not yet designed — pending research)

**Assignment:** TBD

---

### Module 14 — Email Templates

> **The client wants:** Three email templates for their marketing team to use as starting points for campaigns.

> **Note:** Template-related assignment content from the old Module 13 (Email Builder Deep Dive) should be moved here. The three templates (Monthly Newsletter, Product Spotlight, Loyalty Tier Notification) and the HTML paste email belong in this module.

**Lesson Focus:**

- **Content Blocks vs. Sections:**
  - A Content Block is a reusable component. When you update a Content Block, the change propagates to ALL emails and templates that use it
  - You can convert a Content Block to a Section to keep its structure but make the content independently editable. Once converted, updates to the original Content Block no longer affect that section
- **Template behavior:** Template updates do NOT propagate to emails that already use the template. The template is a starting point, not a live link
- **Locked vs. editable regions** — how to design templates for different marketer skill levels

**Assignment:**
Build three email templates:

1. **"Monthly Newsletter"** — Locked header (logo + nav) and footer (legal + unsubscribe). The entire body section is an editable region — marketers can add whatever content they want.
2. **"Product Spotlight"** — Locked header, footer, AND layout structure (hero image slot, two-column feature grid, CTA button). Marketers can only swap content within predefined blocks — they can't change the layout.
3. **"Loyalty Tier Notification"** — Fully locked template. No editable regions. Content will be driven entirely by personalization (covered in Part 4).

Additionally:
- Create a Content Block for the LEOptical header and use it across all three templates
- Create a Content Block for the LEOptical footer (legal + unsubscribe) and use it across all three templates
- Explore: convert the header Content Block to a Section in one template and observe that future header block updates no longer affect that template

**Success Criteria:**
- [ ] Three templates created with consistent header/footer via Content Blocks
- [ ] Header and footer are locked in all three templates
- [ ] Template A (Newsletter) has a fully editable body region
- [ ] Template B (Product Spotlight) has editable content within a locked layout
- [ ] Template C (Loyalty Tier Notification) has no editable regions
- [ ] You understand the difference between Content Blocks and Sections
- [ ] You can explain that Content Block updates propagate but template updates do not
- [ ] A Content Creator role user (from the Business Units & Governance module) can edit Template A's body but cannot modify the header/footer

---

## Part 4: Dynamic Content & Personalization

### Module 15 — Marketing Objects

> **The client wants:** (assignment not yet designed — pending research into Marketing Objects feature)

**Assignment:** TBD

---

### Module 16 — Merge Fields & Dynamic Content

> **The client wants:** (assignment not yet designed)

**Assignment:** TBD

> **Note:** The no-code personalization content from the old Module 14 (data sources tab, content variables, dynamic variations) belongs here.

---

### Module 17 — Handlebars: Foundations

> **The client wants:** (assignment not yet designed)

**Assignment:** TBD

---

### Module 18 — Handlebars: Working with Data

> **The client wants:** (assignment not yet designed)

**Assignment:** TBD

---

### Module 19 — Handlebars: Advanced Techniques

> **The client wants:** (assignment not yet designed)

**Assignment:** TBD

---

### Module 20 — AMPscript in MCA

> **The client wants:** (assignment not yet designed — pending research into supported AMPscript functions)

**Assignment:** TBD

---

### Module 21 — Project: Personalized Campaign Email

> **The client wants:** LEOptical needs a complete personalized email for their upcoming VisionCare Rewards campaign, pulling data from the data graph and marketing objects, using templates and content blocks, with Handlebars personalization throughout.

**Assignment:** TBD — ties together everything from Parts 3-4.

---

## Part 5: Flows & Automation

### Module 22 — Flow Fundamentals

> **The client wants:** LEOptical needs automated marketing workflows. Before building complex orchestrations, get comfortable with the flow builder and understand all available elements.

**Lesson Focus — Flow Builder Orientation:**

Cover all base flow elements and liken them to Journey Builder where applicable:

**Send / Action Elements:**
| Element | Type | Description | MCE Equivalent |
|---------|------|-------------|----------------|
| Send Email Message | ActionCall | Select email content, preview/test, honor consent | Email Activity |
| Send SMS Message | ActionCall | Select SMS content, preview/test, honor consent | SMS Activity |
| Send WhatsApp Message | ActionCall | Select WhatsApp content, honor consent | N/A |
| Send to Data 360 Activation | ActionCall | Send records to an activation target | N/A |
| Create Campaign Member | ActionCall | Create Campaign Member record | N/A (manual in JB) |
| Create Task | ActionCall | Create a Task in Salesforce | N/A |
| Forward to Bot or Agent | ActionCall | Route incoming conversation message | N/A |
| Exit from a Flow | REMOVE_FROM_FLOW | Remove a record from another flow | Exit criteria |
| Action | ActionCall | Perform any action outside the flow | Custom Activity |
| Subflow | Subflow | Launch another active flow | N/A |
| Send to a Flow | Subflow | Send a record to an on-demand flow | N/A |

**Logic / Control Elements:**
| Element | Type | Description | MCE Equivalent |
|---------|------|-------------|----------------|
| Decision | Decision | Create conditional paths | Decision Split |
| Path Experiment | Experiment | Random path assignment for testing | Random Split |
| Einstein Decision | ActionCall | Path based on engagement metrics | Einstein STO |
| Determine CRM Record | ActionCall | Check if individual has Contact/Lead/Prospect | N/A |
| Wait for Amount of Time | Wait | Pause for set duration | Wait Activity |
| Wait Until Date | Wait | Pause until specific date | Wait Until Date |
| Wait Until Event | Wait | Pause until event occurs | Wait Until Event |
| Assignment | Assignment | Set variable values | Update Contact |
| Loop | Loop | Iterate over a collection | N/A |
| Transform | Transform | Transform source data to new format | N/A |
| Collection Sort | CollectionProcessor | Reorder/limit items in collection | N/A |
| Collection Filter | CollectionProcessor | Subset a collection by conditions | N/A |

**Data Elements:**
| Element | Type | Description |
|---------|------|-------------|
| Create Records | RecordCreate | Create Salesforce records |
| Get Records | RecordQuery | Query Salesforce records |
| Update Records | RecordUpdate | Update Salesforce records |
| Delete Records | RecordDelete | Delete Salesforce records |

**Flow Resources:**
- Variables (text, number, record, collection)
- Formulas
- Constants
- Collections — what they are and when to use them

**Assignment:**
- Create a simple Marketing Flow triggered when a new Lead is created with Source = "VisionCare Rewards Signup"
- Add a Send Email action using the Monthly Newsletter template (Template A) with a welcome message
- Configure entry criteria so only loyalty signups trigger the flow
- Add a Create Campaign Member element to add the Lead to the appropriate Campaign
- Add Content Variables to the flow that feed personalization values into the email
- Test the flow: manually create a Lead matching the criteria and verify the email sends and Campaign Member is created

**Success Criteria:**
- [ ] You can identify and describe every flow element type
- [ ] Marketing Flow is created with correct trigger
- [ ] Entry criteria correctly filters to loyalty signups only
- [ ] Welcome email sends using Template A
- [ ] Content Variables are passed from flow to email
- [ ] Campaign Member is created
- [ ] End-to-end test works: Lead created -> flow triggers -> email sent -> Campaign Member created

> **Consent reminder:** For emails to actually send, the recipient must have an explicit consent record (from the Consent Configuration module). Make sure your test Lead has consent, and that you're using your own email address so you can verify receipt.

---

### Module 23 — Activation Templates

> **The client wants:** LEOptical wants to send targeted campaigns to their Data 360 segments. Configure activation templates so segments can be activated for marketing sends.

**Lesson Focus — Activation Template Gotchas:**

- In Data 360 to MCE: you pick the fields to send, including the specific email address. You have control over which email goes
- **In MCA: currently all email addresses associated with the unified individual get sent to at send time UNLESS you configure an Activation Template.** This is a critical gotcha — without an activation template, a customer with 3 email addresses gets 3 emails
- Activation Templates let you specify which contact point (email address) to use
- Required fields for activation templates
- How activations connect segments to marketing sends

**Assignment:**
- Create an Activation Template for email sends — select the appropriate contact point (email address) and configure required fields
- Activate the "VIP Customers" segment (Gold + Platinum) using the activation template
- Activate the "Lapsed Buyers" segment using the activation template
- Verify activated segment members appear in the target audience
- Test: confirm that only the intended email address receives the send (not all email addresses on the unified profile)

**Success Criteria:**
- [ ] Email activation template is configured with correct contact point and required fields
- [ ] "VIP Customers" segment is activated
- [ ] "Lapsed Buyers" segment is activated
- [ ] You can explain the gotcha: without an activation template, all email addresses on a unified individual get sent to
- [ ] You can explain when to use activation-based sends vs. flow-based sends

---

### Module 24 — Flows: Orchestration and Logic

> **The client wants:** Expand the welcome flow into a proper nurture series AND build a post-purchase review request flow.

**Assignment:**
Build two flows:

1. **Welcome Nurture Series** (expand the Flow Fundamentals flow):
   - Email 1: Welcome (immediate — already built)
   - Wait 3 days
   - Email 2: "Meet Our Lens Families" — product education (use Template B)
   - Wait 5 days
   - Decision branch: Did the Lead engage with Email 2?
     - **Yes** -> Email 3: Personalized recommendation (Template B variant with dynamic content)
     - **No** -> Email 3: "Still Exploring? Here's What Others Love" (different content)

2. **Post-Purchase Review Request** (Automation Event Triggered Flow):
   - Trigger: New Sales Order record appears in Data 360 with Status = "Completed"
   - Wait 14 days
   - Send a **transactional** email: "How are you loving your {Product Name}? Leave a review" (uses the "Order Updates" communication subscription)
   - This email sends even if the customer has NOT opted into marketing — verify this by testing with a contact who lacks marketing consent

**Success Criteria:**
- [ ] Welcome nurture has 3 emails with wait steps and a decision branch
- [ ] Post-purchase flow is an Automation Event Triggered Flow on Sales Order
- [ ] Post-purchase email is transactional and sends without marketing consent
- [ ] Content Variables are used to pass personalization data in both flows
- [ ] Both flows are activated and tested
- [ ] You understand how wait steps and decision branches affect flow timing
- [ ] You can explain the difference between marketing and transactional sends

---

### Module 25 — Flows: Advanced

> **The client wants:** (assignment not yet designed — pending research into batching, interviews, re-entry, Unified Individual ID mutability)

**Assignment:** TBD

---

### Module 26 — Project: Consent Automation Flow

> **The client wants:** Build the permanent consent automation infrastructure. The consent flow is a Data 360-Triggered Flow that fires on the Individual DMO and creates OPT_IN records for new individuals.

**Assignment:** Content exists in `docs/part-5-flows/consent-flow-project.md` — expand into a full project assignment with testing phases.

---

## Part 6: Landing Pages & Web

### Module 27 — Landing Pages & Forms

> **The client wants:** A landing page for VisionCare Rewards signup. Visitors should be able to join the loyalty program by filling out a form. The page should include the consent banner from the Consent Configuration module.

**Lesson Focus:**
- Landing page builder orientation
- Form components and configuration
- Connecting landing pages to Data 360 (the Experience Cloud Marketing Landing Pages / All Sites screen)
- Configuring tracking and security elements
- Required fields: call out that required fields must be provided and mapped in the flow, otherwise the Lead will not be created

**Assignment:**
- Build a marketing landing page using the page builder with LEOptical branding
- Create a form with fields: First Name, Last Name, Email, Phone, "How did you hear about us?" (picklist)
- Add the consent banner from the Consent Configuration module — visitors must consent to email communications
- Configure the form to create a Lead on submission — ensure all required fields are mapped
- Review the Experience Cloud Marketing Landing Pages screen to understand Data 360 connection and tracking configuration
- Test the page: submit the form and verify a Lead is created with consent captured

**Success Criteria:**
- [ ] Landing page is published and accessible via URL
- [ ] Form captures all required fields
- [ ] Consent banner is visible and functional
- [ ] Form submission creates a Lead (all required fields are mapped correctly)
- [ ] Consent record is created and linked to the new Lead
- [ ] You've reviewed the All Sites configuration screen and understand tracking options

> **Stretch goal:** Configure security elements that allow hosting forms on external sites.

---

### Module 28 — Landing Pages: Advanced

> **The client wants:** LEOptical is running a product launch campaign for the Visionaire UltraLux lens via paid ads and email. They want to track which campaign drove each signup, with form submissions automatically added to the correct Salesforce Campaign.

**Pre-work:** Ensure you have your seeded Campaign IDs documented from the Getting Started module.

**Assignment:**
- Build a product launch landing page for Visionaire UltraLux
- Add hidden form fields for: `utm_source`, `utm_medium`, `utm_campaign`, and a hidden `CampaignId` field
- Configure the hidden fields to auto-populate from URL parameters
- Configure form submission to: create a Lead AND add the Lead as a Campaign Member to the Campaign specified by the hidden `CampaignId`
- Test with multiple URLs using your documented Campaign IDs:
  - `?utm_source=google&utm_medium=cpc&utm_campaign=ultralux_launch&CampaignId={your_campaign_id}`
  - `?utm_source=email&utm_medium=newsletter&utm_campaign=ultralux_launch&CampaignId={your_campaign_id}`
- Verify both submissions create Leads with correct UTM values and correct Campaign membership

**Success Criteria:**
- [ ] Landing page is published with hidden fields
- [ ] Hidden fields populate from URL parameters
- [ ] Lead is created with UTM values stored on the record
- [ ] Lead is added as Campaign Member to the correct Campaign
- [ ] Two test submissions from different UTM sources show different field values but same Campaign

---

### Module 29 — Web Connector

> **The client wants:** LEOptical's external website (hosted on Netlify) needs to send visitor behavior data back to Data 360 so the marketing team can use website activity in segments and flows.

**Assignment:** TBD — multi-subpage module covering setup, consent banner, Data 360 integration, custom events, identity capture, and Interactions SDK.

---

## Part 7: Campaigns & Analytics

### Module 30 — Campaigns in MCA

> **The client wants:** (assignment not yet designed — pending research into MCA campaigns feature)

**Assignment:** TBD

---

### Module 31 — Reporting & Dashboards

> **The client wants:** LEOptical's VP of Marketing wants a dashboard to understand campaign performance, channel engagement, and loyalty program growth. The marketing team also wants engagement data visible on individual customer records.

**Lesson Focus — MCA Reporting Landscape:**

MCA has two distinct reporting layers. Learners need to understand both:

**1. Marketing Performance Intelligence (Tableau Next-powered)**
- Accessed via the **"Marketing Performance" tab** in the Marketing App navigation bar
- Also accessible via **"Insights"** on individual Campaign pages
- Requires installation of the Marketing Performance analytics package (Tableau Next)
- **Must be uninstalled and reinstalled once per Salesforce release** (3x/year) — it does not auto-update
- Provides two main dashboard views:
  - **Insights Dashboard:** Email click-through rate, sends, open rate, delivery rate, bounce/opt-out metrics. Filterable by date range, Campaign Flow, Segment
  - **Deliverability Dashboard:** Email delivery rate, sends, bounce rate, deliveries, failed sends
- Campaign-specific dashboards show performance by channel (Email, SMS, WhatsApp), flow, and segment
- **Conversion Analytics** (from Spring 2026): deeper campaign conversion performance, accessed from Performance > "Conversions"
- **Limitation:** These dashboards cannot be customized in content or layout
- **Consumption note:** Uses Data 360 credits

**2. Analytics Tab (Standard Reports & Dashboards)**
- Built on Data 360, accessible from the Analytics tab
- Pre-built dashboards and reports:
  - Email Engagement Dashboard & Reports
  - SMS Engagement Dashboard & Reports
  - Forms Engagement Dashboard & Reports
  - Landing Page Engagement
- These CAN be customized (rearranged widgets, changed labels, filtered data)

**3. Flow-Level Analytics**
- Available on individual flow elements within Flow Builder
- Shows execution counts, status breakdowns (Completed, Error, Waiting, Retrying), and average duration

**Assignment:**
- Install the Marketing Performance Intelligence analytics package
- Explore the Marketing Performance tab — review the Insights and Deliverability dashboards
- Navigate to a Campaign and explore the campaign-specific performance view via the Insights menu
- Review the Analytics tab — explore the pre-built Email Engagement and Forms Engagement dashboards
- Customize an Analytics tab dashboard: rearrange widgets and apply filters relevant to LEOptical (e.g., filter by campaign, date range)
- Review flow-level analytics on one of the flows built in the Flows: Orchestration and Logic module
- Surface marketing data on a Salesforce record page — add a marketing engagement component to the Contact layout
- Write a reporting brief for LEOptical's VP of Marketing:
  - What dashboards are available out of the box?
  - What can be customized vs. what is fixed?
  - What gaps exist (e.g., loyalty enrollment trends would need a custom report/dashboard)?
  - What is the reinstall requirement for Marketing Performance Intelligence and how should the team plan for it?

**Success Criteria:**
- [ ] Marketing Performance Intelligence package is installed
- [ ] Marketing Performance dashboards (Insights + Deliverability) are reviewed
- [ ] Campaign-specific performance view is explored
- [ ] Analytics tab dashboards are reviewed and at least one is customized
- [ ] Flow-level analytics are reviewed on an existing flow
- [ ] Marketing engagement component is added to Contact record page
- [ ] Reporting brief is written for LEOptical VP of Marketing
- [ ] You can explain the difference between Marketing Performance Intelligence (Tableau Next, non-customizable) and Analytics tab dashboards (Data 360, customizable)
- [ ] You understand the reinstall-per-release requirement for Marketing Performance Intelligence

---

## Part 8: AI & Intelligence

### Module 32 — Agentforce for Marketing

> **The client wants:** LEOptical's marketing team is small. They want to use AI to speed up campaign creation for their upcoming Back-to-School promotion.

**Assignment:**
- Use Agentforce to generate a campaign brief for LEOptical's "Back to School" promotion
- Use Agentforce to recommend audience segments from existing Data 360 data
- Use Agentforce to generate email subject lines and body copy
- Review and refine the AI-generated outputs — document what you'd change and why

**Success Criteria:**
- [ ] Campaign brief is generated via Agentforce
- [ ] Audience segment recommendations are produced
- [ ] Email content is AI-generated and reviewed
- [ ] Written assessment: what did Agentforce get right? What needed human editing?

---

### Module 33 — Conversational Messaging

> **Deferred.** Requires SMS/WhatsApp channel configuration. Reserved for future expansion.

---

### Module 34 — Predictive AI

> **The client wants:** LEOptical wants to identify which loyalty members are at risk of churning and optimize email send frequency. Before building these capabilities, they need to understand what Einstein's predictive features require and how to plan for them.

**Important: This module is conceptual + configuration-only.** Einstein Engagement Scoring and Engagement Frequency require real email engagement history to generate predictions. In a training environment with seed data and no actual send history, the models will not produce scores. This module teaches learners how to configure, interpret, and plan for these features — skills they'll apply on production implementations where the data exists.

**Reference:** [Agentforce Marketing: Einstein Decision (Engagement Frequency and Scoring)](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-einstein-decision-engagement-frequency-scoring/)

**Lesson Focus — Einstein Predictive AI in MCA:**

- **Einstein Engagement Scoring** — predicts likelihood of opens, clicks, and unsubscribes
  - Classifies contacts into personas: Loyalists, Window Shoppers, Selective Subscribers, Winback/Dormant
  - **Prerequisites:** 1,000+ engagement events (sends, opens, clicks, bounces, unsubscribes) across the business unit in the prior 90 days; at least 1 email send per contact to receive a score
  - Scores refresh continuously; persona trends visible after 14 days of evaluation
  - Uses the Einstein Decision element in flows for path splitting based on engagement score
- **Einstein Engagement Frequency** — recommends optimal send frequency per contact
  - Classifies contacts as: Saturated, Almost Saturated, On Target, Undersaturated, Default (insufficient data)
  - **Prerequisites:** 5+ promotional emails sent in the past 28 days to 10+ subscribers across 5 different send intervals
  - Contacts without enough history fall into the "Default" bucket
- **Both features require:**
  - MCA Advanced Edition (not Growth)
  - Data Graph configured with Unified Individual as Primary DMO
  - Unified Link Individual bridging to Individual
  - Contact Point Email linked to enable engagement metrics
  - Email Engagement Score DMO and Email Engagement Frequency DMO added to the Data Graph
- **Key consulting insight:** These features cannot be demonstrated during implementation until the client has been sending for at least 90 days. Plan for a "Phase 2" enablement milestone where scoring is activated post-launch.

**Assignment:**
- Configure the prerequisites for Einstein Engagement Scoring:
  - Verify Data Graph has Unified Individual as Primary DMO
  - Add the Email Engagement Score DMO to the Data Graph
  - Enable Einstein Engagement Scoring in setup
- Configure the prerequisites for Einstein Engagement Frequency:
  - Add the Email Engagement Frequency DMO to the Data Graph
  - Enable Einstein Engagement Frequency in setup
- Review the Einstein Decision flow element — understand how it creates conditional paths based on engagement score and frequency classification
- Design a "Churn Risk" strategy document for LEOptical:
  - Define what "churn risk" means for LEOptical (combine engagement score personas with purchase recency and loyalty tier)
  - Describe how you would build a "Churn Risk" segment once scoring data is available
  - Propose a flow that uses the Einstein Decision element to route high-risk contacts to a re-engagement campaign
  - Recommend a send frequency strategy by loyalty tier
- Document which predictive AI feature addresses which business problem and what data each requires

**Success Criteria:**
- [ ] Einstein Engagement Scoring prerequisites are configured (Data Graph, DMO, enabled in setup)
- [ ] Einstein Engagement Frequency prerequisites are configured
- [ ] You can explain why scores are not yet available (no engagement history) and when they would activate
- [ ] Einstein Decision flow element is reviewed and understood
- [ ] Churn Risk strategy document is complete with segment definition, flow design, and frequency recommendations
- [ ] You can advise a client on implementation timeline: when to enable scoring (post-launch, after 90 days of sends)
- [ ] You can explain the difference between Engagement Scoring (who to target) and Engagement Frequency (how often to send)

---

## Part 9: Capstone

### Module 35 — Capstone Project

> **Deferred.** Capstone requirements will be designed after all other modules are finalized. The capstone should combine data modeling, segmentation, content creation, flow orchestration, and analytics into a new LEOptical business requirement (e.g., launching a kids' eyewear line, expanding to a new market, or adding a B2B wholesale channel).

---

## Module Dependency Chain

```
Module 1 (Setup + Seed Data)
  |-> Module 2 (Domain)
  |-> Module 3 (Governance + CMS Workspace)
  |     |-> Module 11 (CMS Content)
  |           |-> Module 12 (Email Builder)
  |                 |-> Module 13 (Content Blocks)
  |                       |-> Module 14 (Email Templates)
  |                             |-> Module 16 (Merge Fields & Dynamic Content)
  |                                   |-> Module 17-19 (Handlebars)
  |                                         |-> Module 20 (AMPscript)
  |                                               |-> Module 21 (Project: Personalized Email)
  |-> Module 4 (Consent Concepts)
  |     |-> Module 5 (Consent Config + Triggered Flow)
  |           |-> Module 27 (Landing Pages - uses consent banner)
  |-> Module 6 (DMOs + CSV Data Streams)
  |     |-> Module 7 (CRM Ingestion)
  |           |-> Module 8 (Data Graphs)
  |                 |-> Module 9 (IDR)
  |                       |-> Module 10 (Segmentation)
  |                             |-> Module 23 (Activation Templates)
  |-> Module 10 (Consumption - can be done after Module 9)
  |
  Module 15 (Marketing Objects) -- after Module 8 (Data Graphs)
  Module 22 (Flow Fundamentals) -- after Module 14 + Module 8
  |-> Module 24 (Flows: Orchestration and Logic)
  |-> Module 25 (Flows: Advanced)
  |-> Module 26 (Project: Consent Automation Flow)
  |
  Module 27 (Landing Pages)
  |-> Module 28 (Landing Pages: Advanced)
  |-> Module 29 (Web Connector)
  |
  Module 30 (Campaigns in MCA)
  Module 31 (Reporting - after Module 24)
  Module 32 (Agentforce - after Module 10 + Module 14)
  Module 33 (Conversational Messaging)
  Module 34 (Predictive AI - after Module 10)
  Module 35 (Capstone - after everything)
```
