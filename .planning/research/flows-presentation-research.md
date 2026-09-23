# Research: MCA Flows — Presentation Supplement for Marketing Strategists

Generated: 2026-08-31
Purpose: Comprehensive research for a marketing strategist presentation ("art of the possible")
Sources: 28 sources consulted

---

## 1. Flow Types Available in MCA

MCA uses Salesforce Flow Builder (not Journey Builder) as its automation engine. There are **8 distinct flow types**, differentiated primarily by what triggers them.

### Marketing-Specific Flow Types

#### Segment-Triggered Flow
- **Trigger:** Records qualify for a Data 360 segment
- **Use cases:** Lifecycle campaigns, onboarding series, win-back, cross-sell, renewal reminders, birthday campaigns
- **How it works:** When the flow runs, it refreshes the segment (or uses the last published version) and injects qualifying records into the flow. Supports recurring schedules (hourly, daily, weekly, monthly, quarterly, yearly).
- **Re-entry options:** Always (re-enter anytime, even if currently in flow), After Completion (only after exiting previous run), Never (once only, permanently excluded)
- **Key gotcha:** Leaving a segment does NOT remove records from an active flow execution. Segment exit and flow exit are independent.
- **Recently renamed:** Also called "Audience Flow" as of Summer '26, now supports both Data 360 audiences and CRM-based audiences.
- Source: [The Agentic Marketer — 8 Flow Types](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/), [Martech Notes — 8 Flow Types](https://www.martechnotes.com/the-8-flow-types-in-marketing-cloud-next-explained-for-beginners/)

#### Automation Event-Triggered Flow
- **Trigger:** Marketing engagement events — email clicks, email opens, form submissions, SMS keyword responses, custom engagement signals
- **Use cases:** Behavior-based follow-ups, form auto-responders, click-triggered nurtures, completion actions
- **How it works:** Fires immediately when the defined event occurs. No manual scheduling or batch processing. Includes the "Form Triggered Flow" subtype (every form MUST have a flow — you cannot publish a form without one).
- **Standard events:** Email click, email open, form submission, SMS opt-in
- **Custom events:** Created via Engagement Signals on Engagement or Profile DMOs — website visits, app interactions, product browsing, etc.
- Source: [Trailhead — Event-Triggered Flows](https://trailhead.salesforce.com/content/learn/modules/automation-events-in-marketing-cloud-next/explore-event-triggered-flows-in-marketing-cloud-next), [CGC Agency — Summer '26 Guide](https://www.cgc-agency.com/en/blog/event-triggered-flows-marketing-cloud-next-summer-26-sfmc-guide)

#### Data Cloud-Triggered Flow (Data 360-Triggered)
- **Trigger:** DMO record creation or update in Data 360
- **Use cases:** LTV threshold triggers, consent record creation, engagement score changes, calculated insight updates
- **How it works:** Responds to Data 360 record changes. Can trigger on any DMO or Calculated Insight. Supports the "Create Consent" activity natively.
- Source: [The Agentic Marketer — 8 Flow Types](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/)

#### Activation-Triggered Flow
- **Trigger:** Data 360 activation publish (segment activation to a target)
- **Use cases:** Message sends triggered by segment publish, personalization without Data Graph reliance
- **How it works:** Background automation that runs when a segment is published (manually or on schedule: 12h/24h). Requires creating a Data Cloud Activation Target first. Attributes available via `$ActivationData` variable in decision splits.
- Source: [The Agentic Marketer — 8 Flow Types](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/)

#### On-Demand Flow
- **Trigger:** REST API call from external systems, Apex, or other flows
- **Use cases:** SMS after membership signup, real-time transactional messages, third-party system integrations
- **How it works:** Executes near real-time via HTTP POST to `/services/data/v65.0/actions/custom/flow/FLOW_API_NAME`. Required parameters: EmailAddress, IndividualId. Optional: TelephoneNumber, ProcessingPriority.
- **Gotcha:** Email sent to EmailAddress parameter even if it is not a registered Contact Point.
- Source: [The Agentic Marketer — 8 Flow Types](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/)

#### Broadcast Flow
- **Trigger:** REST API call targeting Dynamic Segments with parameterized criteria
- **Use cases:** Emergency notifications to specific regions, outage alerts, time-sensitive announcements
- **How it works:** Every individual in the Dynamic Segment is injected. Values determined at execution time via JSON payload. Requires Contact Point Email DMO definition.
- **Gotcha:** Dynamic Segments used by Broadcast Flows cannot be refreshed normally; they are parameterized at runtime.
- Source: [The Agentic Marketer — 8 Flow Types](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/)

### Platform-Standard Flow Types (Non-Marketing-Specific)

#### Salesforce Record-Triggered Flow
- **Trigger:** CRM record creation or update (Contact, Lead, Account, any standard/custom object)
- **Use cases:** Notify teams of new leads, declare consent on record creation, sync marketing data
- **Not exclusive to marketing** — standard Salesforce flow type that marketing teams can use.
- Source: [The Agentic Marketer — 8 Flow Types](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/)

#### Autolaunched Flow (Subflow)
- **Trigger:** Called by another flow (as a subflow)
- **Use cases:** Reusable logic libraries — consent checks, suppression checks, customer status validation, campaign membership rules
- **How it works:** Does nothing unless invoked by a parent flow. Input/output parameters passed between flows. Perfect for DRY (Don't Repeat Yourself) automation patterns.
- Source: [The Agentic Marketer — 8 Flow Types](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/)

### Additional Flow Types Mentioned

- **Screen Flow** — user-launched interactive interface. Not marketing-specific but can be used for guided internal workflows.
- **Schedule-Triggered Flow** — runs on a defined schedule. Good for batch checks and recurring processes.
- **Platform Event-Triggered Flow** — fires when an external system publishes a platform event.
- Source: [Martech Notes — 8 Flow Types](https://www.martechnotes.com/the-8-flow-types-in-marketing-cloud-next-explained-for-beginners/)

---

## 2. Flow Builder Elements (Complete Inventory)

### Send / Action Elements

| Element | API Type | Description | MCE Equivalent |
|---------|----------|-------------|----------------|
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

Source: Module assignments spec (internal), confirmed by multiple external sources

### Logic / Control Elements

| Element | API Type | Description | MCE Equivalent |
|---------|----------|-------------|----------------|
| Decision | Decision | Create conditional paths (branching logic) | Decision Split |
| Path Experiment | Experiment | Random path assignment for A/B testing (**Advanced only**) | Random Split |
| Einstein Decision | ActionCall | Path based on engagement metrics (**Advanced only**) | Einstein STO |
| Determine CRM Record | ActionCall | Check if individual has Contact/Lead/Prospect | N/A |
| Wait for Amount of Time | Wait | Pause for set duration (supports minutes) | Wait Activity |
| Wait Until Date | Wait | Pause until specific date (up to Dec 31, 2125) | Wait Until Date |
| Wait Until Event | Wait | Pause until event occurs (e.g., email click) or timeout | Wait Until Event |
| Assignment | Assignment | Set variable values | Update Contact |
| Loop | Loop | Iterate over a collection | N/A |
| Transform | Transform | Transform source data to new format | N/A |
| Collection Sort | CollectionProcessor | Reorder/limit items in collection | N/A |
| Collection Filter | CollectionProcessor | Subset a collection by conditions | N/A |

Source: Module assignments spec (internal), confirmed by multiple external sources

### Data Elements

| Element | API Type | Description |
|---------|----------|-------------|
| Create Records | RecordCreate | Create Salesforce records |
| Get Records | RecordQuery | Query Salesforce records |
| Update Records | RecordUpdate | Update Salesforce records |
| Delete Records | RecordDelete | Delete Salesforce records |

Source: Module assignments spec (internal)

### Flow Resources

- **Variables** — text, number, record, collection types
- **Formulas** — calculated values within the flow
- **Constants** — fixed values
- **Collections** — lists of records for iteration
- **Content Variables** — pass personalization data from flow to email content (Summer '26 feature)

---

## 3. Personalization in Flows (Content Variables)

### What Content Variables Are
Content Variables are a Summer '26 feature that lets marketers inject CRM/Data 360 data into email messages without writing Apex code. They bridge the gap between flow data and email personalization.

### How They Work
1. Declare a Content Variable in the email builder (or flow configuration)
2. Bind the variable to a Data Graph field or flow variable
3. Reference it in the email body using `$content.variableName` syntax
4. When the flow executes, the variable resolves to the individual's data at send time

### Integration with Flows
- Content Variables configured in an email automatically appear as dynamic input fields within the flow's Send Email Message action
- Marketers can map flow variables, record fields, or Data Graph fields to content variables
- Works without Apex for standard use cases

### Before Content Variables (Legacy Approach)
- Required Apex classes to pass data from flows to emails
- A Variable Resource Type was created in the flow with Apex-defined Data Type
- Still supported but no longer the recommended approach for most use cases

### Merge Fields (Standard Personalization)
- Standard merge fields pull from the Data Graph (configured in Data 360)
- Accessible via the merge field picker in the email builder
- Use Handlebars syntax: `{{FirstName}}`, `{{#if LoyaltyTier}}...{{/if}}`
- Data Graph must be configured and include the relevant DMOs/fields

### Gotcha
- Empty content variables can break email layouts. Always set fallback defaults.
- Content variables can also be referenced manually by writing `$content.` prefix.

Source: [SFMC Tips #290 — Content Variables](https://medium.com/@marketingcloudtips/marketing-cloud-next-personalization-with-content-variables-18ebb6764911), [CGC Agency — Summer '26 Guide](https://www.cgc-agency.com/en/blog/event-triggered-flows-marketing-cloud-next-summer-26-sfmc-guide), [Salesforce Help — Set Up Personalization Features](https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_data_graph_setup.htm&type=5)

---

## 4. Triggers and Entry Criteria

### Summary of All Trigger Types
| Trigger | When It Fires | Real-Time? | Typical Marketing Use |
|---------|---------------|------------|----------------------|
| Segment membership | Record qualifies for segment | Near real-time (on schedule) | Nurture series, lifecycle campaigns |
| Engagement event (standard) | Email open/click, form submit | Immediate | Follow-up, auto-responder |
| Engagement event (custom) | Website visit, product browse, app action | Immediate | Behavior-triggered campaigns |
| Data 360 DMO change | DMO record created/updated | Immediate | Consent creation, LTV triggers |
| CRM record change | Contact/Lead/Account created/updated | Immediate | Welcome emails, notification |
| Activation publish | Segment publishes to target | On schedule (12h/24h) | Campaign sends |
| REST API call | External system invokes | Near real-time | Transactional, third-party triggers |
| Schedule | Time-based recurrence | Scheduled | Batch campaigns, birthday sends |

### Entry Criteria Configuration (Summer '26)
- In the Start element, use "Add Condition" in the "Additional Criteria" section
- Can filter on fields from the Primary DMO
- For Segment Triggered flows, can use any segment membership type (not just Unified Individual)

### Re-entry Configuration (Summer '26)
- Configurable re-entry windows and entry caps through the UI
- Eliminates need for suppression tables or code workarounds
- Three modes: Always, After Completion, Never

Source: Multiple sources, including [CGC Agency — Summer '26 Guide](https://www.cgc-agency.com/en/blog/event-triggered-flows-marketing-cloud-next-summer-26-sfmc-guide), [The Agentic Marketer — Recurring Flows](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/recurring-segment-triggered-flows-start-options/)

---

## 5. Analytics and Optimization

### Path Experiment (A/B Testing) — Advanced Edition Only
- Test up to **10 different paths** within a single flow
- Customize distribution percentage across paths
- Random assignment for unbiased results
- **Winner selection:** Manual review OR automatic (system selects winning path at 95% confidence threshold)
- Can use custom metrics via Engagement Signals
- After test period, "Select the Best Performer" routes remaining recipients to winning path
- No limit on number of Path Experiments per flow
- **Spring '26 enhancement:** In-app notifications when experiment completes; History tab for audit trail
- Source: [SFMC Tips #188 — Path Experiment](https://medium.com/@marketingcloudtips/marketing-cloud-next-a-b-testing-with-the-path-experiment-element-5e39af4e0210), [SFMC Tips #252 — Path Experiment Enhancements](https://medium.com/@marketingcloudtips/marketing-cloud-next-path-experiment-enhancements-spring-26-424bc50ec961)

### Einstein Decision — Advanced Edition Only
Uses two AI models to create intelligent branching:

**Einstein Engagement Frequency** — Analyzes email saturation. Creates 5 automatic paths:
- Saturated (too many messages)
- AlmostSaturated (nearing limit)
- OnTarget (appropriate volume)
- Undersaturated (not enough messages)
- Default (insufficient data)

**Einstein Engagement Scoring** — Predicts engagement likelihood. Two approaches:
- **Persona-based:** Loyalists, Window Shoppers/Selective Subscribers, Winback/Dormant
- **Metric-based:** Opens, Clicks, Subscription Retention — each with Most Likely / Least Likely paths

**Requirements:**
- Advanced Edition only (not Growth)
- Enable via Setup > Einstein > Einstein for Marketing
- Add Email Engagement Frequency and Email Engagement Score DMOs to Data Graph
- Minimum: 10 subscribers, each receiving 5+ emails within 28 days
- Initial insights require approximately 90 days to generate
- Works exclusively within Segment Triggered Flows
- The Default path is mandatory and cannot be removed

Source: [The Agentic Marketer — Einstein Decision](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-einstein-decision-engagement-frequency-scoring/)

### Flow Performance Analytics
- Released Spring '26 for both Growth and Advanced editions
- Built on Tableau Next technology
- Available on individual flow elements within Flow Builder (element-level metrics)
- Campaign-level dashboards: email click-through rate, sends, open rate, delivery rate, bounce/opt-out metrics
- Filterable by date range, Campaign Flow, Segment
- Source: [SFMC Tips #262 — Flow Performance](https://medium.com/@marketingcloudtips/marketing-cloud-next-flow-performance-analytics-feature-8301c6431cb3)

### Insights Dashboard
- Email click-through rate, sends, open rate, delivery rate, bounce/opt-out metrics
- Filterable by date range, Campaign Flow, Segment
- Campaign-specific dashboards show performance by channel (Email, SMS, WhatsApp), flow, and segment
- Source: Internal module assignments spec

---

## 6. Limitations and Gotchas

### Known Limitations vs. Journey Builder

| Area | MCA Flow | MCE Journey Builder |
|------|----------|---------------------|
| **A/B Testing** | Path Experiment (Advanced only) | Path Optimizer (all editions) |
| **Re-entry** | Always/After Completion/Never (added Summer '25) | No Re-entry was always available |
| **Wait granularity** | Minutes (shorter than JB) | Hours minimum |
| **Channels** | Email, SMS, WhatsApp natively | Email, SMS, Push, In-App, Ads, Custom |
| **Push notifications** | Not natively available yet <!-- VERIFY --> | Native Mobile Push |
| **Segment exit** | Does NOT remove from active flow | Exit criteria can remove from journey |
| **Einstein** | Einstein Decision (Advanced only) | Einstein STO (all editions with AI) |
| **Data source** | Real-time unified profiles (Data 360) | Data Extensions (batch synced) |
| **Multi-channel orchestration** | Native (email + SMS + WhatsApp in one flow) | Native but separate activities |

### Specific Gotchas

1. **Segment exit does NOT equal flow exit.** Removing someone from a segment does not pull them out of an active flow. You must use the "Exit from a Flow" element or build logic to handle this.

2. **Without an Activation Template, all email addresses on a unified individual get sent to.** A customer with 3 email addresses gets 3 emails. This is a critical gotcha for segment-based sends.

3. **Path Experiment is Advanced Edition only.** Growth Edition does not have A/B testing in flows.

4. **Einstein Decision requires real engagement data.** At least 10 subscribers with 5+ emails each in 28 days. Initial insights take ~90 days. Will not produce useful results with seed data or in new orgs.

5. **The last-published segment version is used.** Even if you edit and refine a segment right before delivery, the flow uses the segment that was last published.

6. **Re-entry "Always" creates parallel instances.** A person can be in multiple instances of the same flow simultaneously, leading to duplicate communications if not carefully managed.

7. **Data Graph refresh timing matters.** If your Data Graph refresh doesn't align with segment/flow timing, personalization data may be stale.

8. **Content Variables with empty values can break email layouts.** Always configure fallback/default values.

9. **On-Demand Flow sends to the provided EmailAddress parameter** even if it is not a registered Contact Point Email in the system.

10. **Every form MUST have a flow.** You cannot publish an MCA form without an associated flow.

11. **Real-time Data Graph in event-triggered flows requires Sub-Second Real-Time Profiles add-on license.** Without this, there may be data lag.

12. **Consent is required for marketing sends.** MCA does not auto-create consent records. You must build automation (typically a Data 360-Triggered Flow) to create consent records for new individuals.

13. **Transactional emails bypass consent.** Emails classified as "Transactional" (e.g., order confirmations) do not require a communication subscription consent record. You do not need to choose a communication subscription for transactional emails in flows.

Source: Multiple sources, plus internal platform-gotchas.md

---

## 7. MCE Journey Builder vs. MCA Flow Comparison

### Architectural Shift
Flow is now the **orchestrator** — Journey Builder becomes a specialized sending engine when MCE is involved. The article from The Agentic Marketer describes this as: "The journey canvas has now become a target of orchestration, not the orchestrator itself."

| Aspect | Journey Builder (MCE) | Flow (MCA) |
|--------|----------------------|------------|
| **Entry logic** | Resolves at send time | Resolved upstream before entry |
| **Data assembly** | Lookups happen inside journey | Completed before flow receives payload |
| **Decision making** | Journey responsible for branching | Flow handles deterministic decisions |
| **Cross-cloud actions** | Limited integration | Agentforce, Slack, Apex as sibling actions |
| **Audit trail** | Single-system logging | Unified transaction across systems |
| **Infrastructure** | ExactTarget (separate from CRM) | Native Salesforce Core |
| **Data model** | Data Extensions, batch sync | Real-time unified profiles (Data 360) |
| **Automation engine** | Journey Builder | Flow Builder |

### What MCE Marketers Will Miss / Find Different
- No native push notification channel in MCA flows (yet) <!-- VERIFY -->
- Different UI paradigm (Flow Builder vs. Journey Builder canvas)
- Segment exit behavior is different (does not auto-remove from flow)
- Wait steps now support minute-level granularity (improvement)
- Record-level CRM operations are native (Create Records, Update Records, Get Records) — no need for separate automations
- Subflow pattern replaces many use cases that required custom activities in MCE

### Integration Between MCE and MCN
- MCN Flows can invoke existing Journey Builder journeys via the "Send-to-Journey" element
- This allows organizations to keep MCE as the sending engine while using MCN Flow as the intelligence/orchestration layer
- Enables gradual migration rather than hard cutover

Source: [The Agentic Marketer — Flow as Orchestration Layer](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/mc-engagement-flow-journey-builder/)

---

## 8. Integration Points

### Segments
- Segment-Triggered Flows use Data 360 segments as entry criteria
- Segments can be refreshed immediately before flow run or on their own schedule
- Supports both Data 360 audiences and CRM-based audiences (Summer '26)

### Activation Templates
- Required for segment-based email sends to control which contact point (email address) receives the message
- Without one, all email addresses on a unified individual get sent to
- Configure contact point selection and required fields

### Data 360
- Data 360-Triggered Flows fire on DMO record changes
- Data Graph provides personalization data to emails via merge fields and content variables
- Calculated Insights can trigger flows when thresholds are met

### CRM Records
- Native Create/Read/Update/Delete operations on any Salesforce object
- Record-Triggered Flows fire on CRM record changes
- Determine CRM Record element checks if individual has Contact/Lead/Prospect

### Landing Pages & Forms
- Every MCA form requires an associated flow
- Form-Triggered Flows handle post-submission logic (Lead creation, consent capture, auto-responder emails)
- Hidden form fields can pass UTM parameters and Campaign IDs

### Campaigns
- When you create a Campaign in MCA, a flow is automatically created and associated
- Create Campaign Member element adds records to Campaigns from within flows
- Campaign-specific dashboards show flow performance

### External Systems
- On-Demand Flows accept REST API calls from any external system
- Platform Event-Triggered Flows respond to events published by external systems
- Broadcast Flows accept parameterized API calls for dynamic segment targeting

---

## 9. Real-World Use Cases for LEOptical (B2C Eyecare/Eyewear)

### Welcome Series / Onboarding
- **Type:** Segment-Triggered or Record-Triggered Flow
- **Trigger:** New loyalty member signup (Lead created with Source = "VisionCare Rewards Signup")
- **Flow:** Welcome email (immediate) > Wait 3 days > Product education email ("Meet Our Lens Families") > Wait 5 days > Decision: engaged with email? > Yes: personalized recommendation / No: social proof email
- **Content Variables:** First name, loyalty tier, nearest store location

### Post-Purchase Review Request
- **Type:** Automation Event-Triggered Flow (or Data 360-Triggered on Sales Order)
- **Trigger:** New Sales Order with Status = "Completed" appears in Data 360
- **Flow:** Wait 14 days > Send transactional email: "How are you loving your {Product Name}?" > Decision: review submitted? > Yes: thank you email / No: gentle reminder after 7 more days
- **Key detail:** Transactional email — sends even without marketing consent

### Abandoned Cart Recovery
- **Type:** Automation Event-Triggered (custom engagement signal on cart DMO)
- **Trigger:** Cart created but no order within X hours
- **Flow:** Wait 2 hours > Send email with cart contents > Wait 24 hours > Decision: purchased? > Yes: exit / No: Send reminder with incentive

### Prescription Renewal Reminders
- **Type:** Segment-Triggered (recurring) or Data 360-Triggered
- **Trigger:** Eye exam date approaching 12-month anniversary (calculated from exam_history data)
- **Flow:** Send reminder email 30 days before > Wait 14 days > Decision: booked appointment? > Yes: confirmation / No: second reminder > Wait 7 days > Final reminder with incentive

### Loyalty Tier Change Notifications
- **Type:** Data 360-Triggered Flow
- **Trigger:** Loyalty Program Member DMO field update (tier changes from Silver to Gold, etc.)
- **Flow:** Decision on new tier > Appropriate congratulations email with tier benefits > Create Task for account manager (VIP tiers)

### Birthday / Anniversary Campaigns
- **Type:** Segment-Triggered (recurring daily/weekly)
- **Trigger:** Segment of contacts with birthday in next 7 days
- **Flow:** Send birthday email with special offer (e.g., 20% off frames) > Wait 7 days > Decision: redeemed? > Yes: thank you / No: reminder before expiry

### Eye Health Reminders
- **Type:** Segment-Triggered (recurring monthly)
- **Trigger:** Segment of contacts who haven't had an eye exam in 12+ months
- **Flow:** Send eye health reminder email > Wait 14 days > Decision: booked? > Yes: appointment confirmation / No: educational content about eye health

### Win-Back / Re-Engagement
- **Type:** Segment-Triggered Flow
- **Trigger:** Segment of contacts with no purchase in 180+ days AND no email engagement in 90+ days
- **Flow:** Email 1: "We miss you" with exclusive offer > Wait 7 days > Decision: engaged? > Yes: back-in-stock recommendations / No: Wait 14 days > Last chance email > If still no engagement: reduce email frequency (Einstein Engagement Frequency path)

### Seasonal Campaigns (e.g., Back-to-School, Summer Sun Protection)
- **Type:** Segment-Triggered (one-time)
- **Trigger:** Manual segment of relevant demographics (parents with children, outdoor enthusiasts)
- **Flow:** Campaign email > Path Experiment (A/B test subject lines or offers) > Auto-select winner > Wait 3 days > Follow-up based on engagement

### Consent Automation
- **Type:** Data 360-Triggered Flow
- **Trigger:** Individual DMO created/updated with email marketing opt-in
- **Flow:** Look up Contact Point Email > Create Communication Subscription Consent records (OPT_IN) for each subscription type
- **Critical infrastructure flow** — required before any marketing sends work

### Form Auto-Responder (VisionCare Rewards Signup)
- **Type:** Automation Event-Triggered (Form Triggered)
- **Trigger:** Landing page form submission
- **Flow:** Create Lead > Create Campaign Member > Send welcome email > (Optional: trigger welcome nurture series via subflow)

---

## 10. Growth vs. Advanced Edition Feature Matrix (Flows)

| Feature | Growth | Advanced |
|---------|--------|----------|
| Segment-Triggered Flow | Yes | Yes |
| Automation Event-Triggered Flow | Yes | Yes |
| Data Cloud-Triggered Flow | Yes | Yes |
| Record-Triggered Flow | Yes | Yes |
| Send Email Message | Yes | Yes |
| Send SMS Message | Yes | Yes |
| Send WhatsApp Message | Yes | Yes |
| Wait elements (time, date, event) | Yes | Yes |
| Decision branches | Yes | Yes |
| Create/Update/Delete Records | Yes | Yes |
| Subflows | Yes | Yes |
| Content Variables | Yes | Yes |
| Einstein Send Time Optimization | Yes | Yes |
| **Path Experiment (A/B testing)** | **No** | **Yes** |
| **Einstein Decision element** | **No** | **Yes** |
| **Einstein Engagement Scoring** | **No** | **Yes** |
| **Einstein Engagement Frequency** | **No** | **Yes** |
| **Unified Conversations for SMS** | **No** | **Yes** (requires Digital Engagement license) |

Source: [Salesforce Ben — Growth vs Advanced](https://www.salesforceben.com/marketing-cloud-growth-vs-advanced-editions-comparing-key-features/), [Salesforce Blog — Advanced Edition](https://www.salesforce.com/blog/marketing-cloud-advanced-edition/)

---

## 11. Platform Gotchas (from Internal Spec)

These are confirmed gotchas from `.planning/platform-gotchas.md` that are relevant to flows:

1. **MCA does not auto-create consent records** (Confirmed 2026-08-06, Summer '26) — You must build a Data 360-Triggered Flow to handle consent record creation for new individuals.

2. **Party field on Comm Sub Consent is not populated by MCA** (Confirmed 2026-08-06, Summer '26) — Workaround: relate Comm Sub Consent to Contact Point Email using Email Address = Consent Value instead of the Party relationship.

3. **Without activation template, all emails on a unified profile get sent to** (Confirmed 2026-08-06, Summer '26) — Critical for any segment-based send.

4. **Einstein Engagement Scoring requires real engagement history** (Confirmed 2026-08-06, Summer '26) — 1,000+ engagement events across BU in prior 90 days. Each contact needs at least 1 email send.

5. **Einstein Engagement Frequency requires sustained sending** (Confirmed 2026-08-06, Summer '26) — 5+ promotional emails to 10+ subscribers across 5 different send intervals in past 28 days.

6. **Data Graph missing fields are absent, not null** (Confirmed 2026-08-06, Summer '26) — Handlebars expressions referencing missing fields silently render as empty. Use `{{#if}}` checks.

---

## 12. External Resources

- [The Agentic Marketer — 8 Flow Types](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/) — Most comprehensive breakdown of all 8 flow types with gotchas, API details, and use cases.
- [Martech Notes — 8 Flow Types for Beginners](https://www.martechnotes.com/the-8-flow-types-in-marketing-cloud-next-explained-for-beginners/) — Beginner-friendly explanation of each flow type.
- [Trailhead — Event-Triggered Flows](https://trailhead.salesforce.com/content/learn/modules/automation-events-in-marketing-cloud-next/explore-event-triggered-flows-in-marketing-cloud-next) — Official Trailhead module on event-triggered flows.
- [Trailhead — Email Personalization Strategies](https://trailhead.salesforce.com/content/learn/modules/email-personalization-in-marketing-cloud-next/get-to-know-email-personalization-features) — Official Trailhead on personalization features including merge fields and dynamic content.
- [Salesforce Help — Set Up Personalization Features](https://help.salesforce.com/s/articleView?language=en_US&id=mktg.mktg_data_graph_setup.htm&type=5) — Official doc on Data Graph setup for personalization.
- [Salesforce Help — Flow Builder Elements for Marketing Flows](https://help.salesforce.com/s/articleView?id=platform.flow_ref_elements_mktg.htm&language=en_US&type=5) — Official reference for all marketing flow elements (page did not render fully during fetch).
- [The Agentic Marketer — Einstein Decision](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-einstein-decision-engagement-frequency-scoring/) — Detailed guide on Einstein Engagement Frequency and Scoring in flows.
- [The Agentic Marketer — Recurring Flow Start Options](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/recurring-segment-triggered-flows-start-options/) — Deep dive on segment refresh timing, re-entry modes, and operational best practices.
- [The Agentic Marketer — Flow as Orchestration Layer](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/mc-engagement-flow-journey-builder/) — How Flow operates above Journey Builder and what this means for MCE-to-MCN transitions.
- [CGC Agency — Event-Triggered Flows Summer '26 Guide](https://www.cgc-agency.com/en/blog/event-triggered-flows-marketing-cloud-next-summer-26-sfmc-guide) — Summer '26 features including re-entry conditions, content variables, exit element, and aggregation functions.
- [Salesforce Ben — Growth vs Advanced](https://www.salesforceben.com/marketing-cloud-growth-vs-advanced-editions-comparing-key-features/) — Feature comparison table between editions.
- [Salesforce Blog — Advanced Edition](https://www.salesforce.com/blog/marketing-cloud-advanced-edition/) — Official Salesforce overview of Advanced Edition capabilities.
- [SFMC Tips #290 — Content Variables](https://medium.com/@marketingcloudtips/marketing-cloud-next-personalization-with-content-variables-18ebb6764911) — How content variables work in Summer '26.
- [SFMC Tips #188 — Path Experiment](https://medium.com/@marketingcloudtips/marketing-cloud-next-a-b-testing-with-the-path-experiment-element-5e39af4e0210) — A/B testing configuration and winner selection.
- [SFMC Tips #252 — Path Experiment Enhancements Spring '26](https://medium.com/@marketingcloudtips/marketing-cloud-next-path-experiment-enhancements-spring-26-424bc50ec961) — Notifications and History tab additions.
- [SFMC Tips #262 — Flow Performance Analytics](https://medium.com/@marketingcloudtips/marketing-cloud-next-flow-performance-analytics-feature-8301c6431cb3) — Tableau Next-based flow analytics.
- [SFMC Tips #308 — Send to a Flow for Cross-Flow Orchestration](https://medium.com/@marketingcloudtips/marketing-cloud-next-send-to-a-flow-for-cross-flow-orchestration-859b7fcf84cc) — Cross-flow patterns and subflow orchestration.
- [SFMC Tips #139 — Never Option for Recurring Flows](https://medium.com/@marketingcloudtips/marketing-cloud-next-addition-of-never-option-for-recurring-flows-54a38c91c733) — Re-entry "Never" option (Summer '25).
- [Salesforce Ben — Marketing Cloud Growth Campaign Flows vs Salesforce Flows](https://www.salesforceben.com/marketing-cloud-growth-campaign-flows-vs-salesforce-flows/) — Differences between marketing campaign flows and standard Salesforce flows.

---

## Source Log

- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/marketing-cloud-next-8-flow-types/ — Comprehensive 8 flow types with API details and gotchas. Included.
- https://www.martechnotes.com/the-8-flow-types-in-marketing-cloud-next-explained-for-beginners/ — Beginner overview of 8 flow types. Included.
- https://trailhead.salesforce.com/content/learn/modules/automation-events-in-marketing-cloud-next/explore-event-triggered-flows-in-marketing-cloud-next — Trailhead on event-triggered flows. Fetched, included.
- https://medium.com/@alimirroshan09/article-5-flows-in-mcn-and-feature-comparison-mce-journey-vs-moc-flows-mcn-advanced-growth-a3ce07b38087 — MCE vs MCN flow comparison. Fetch failed (403). Search summary used.
- https://help.salesforce.com/s/articleView?id=platform.flow_ref_elements_mktg.htm&language=en_US&type=5 — Flow builder elements reference. Fetched but rendered as JS/CSS only. Referenced from search summary.
- https://medium.com/@marketingcloudtips/marketing-cloud-on-core-understanding-the-basic-elements-of-flow-builder-1a749ecf92fa — Basic flow elements overview. Referenced from search.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-a-b-testing-with-the-path-experiment-element-5e39af4e0210 — Path Experiment details. Fetch failed (403). Used search summary.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-path-experiment-enhancements-spring-26-424bc50ec961 — Path Experiment Spring '26 enhancements. Referenced from search.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-flow-performance-analytics-feature-8301c6431cb3 — Flow performance analytics. Fetch failed (403). Used search summary.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-personalization-with-content-variables-18ebb6764911 — Content Variables. Fetch failed (403). Used search summary.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-einstein-decision-engagement-frequency-scoring/ — Einstein Decision deep dive. Fetched, included.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/mc-engagement-flow-journey-builder/ — Flow as orchestration layer above Journey Builder. Fetched, included.
- https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/recurring-segment-triggered-flows-start-options/ — Recurring flow start options. Fetched, included.
- https://www.cgc-agency.com/en/blog/event-triggered-flows-marketing-cloud-next-summer-26-sfmc-guide — Summer '26 event-triggered flows. Fetched, included.
- https://www.salesforceben.com/marketing-cloud-growth-vs-advanced-editions-comparing-key-features/ — Growth vs Advanced comparison. Fetched, included.
- https://www.salesforce.com/blog/marketing-cloud-advanced-edition/ — Official Advanced Edition overview. Fetched, included.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_campaigns_flows_concepts.htm&language=en_US&type=5 — Campaigns and flows. Fetched but rendered as JS only.
- https://developer.salesforce.com/docs/marketing/marketing-cloud-growth/guide/mc-manage-flows.html — Developer docs on flows. Fetched, minimal content extracted.
- https://thespotforpardot.com/2026/07/13/your-guide-to-agentforce-marketing-flow-fundamentals/ — Flow fundamentals guide. Fetched but content did not render.
- https://medium.com/@marketingcloudtips/marketing-cloud-on-core-introduction-to-flow-builder-features-fd65d9ea0b97 — Flow builder features. Referenced from search.
- https://medium.com/@marketingcloudtips/marketing-cloud-on-core-how-to-use-event-trigger-flows-803e1b41f007 — Standard event-triggered flows. Referenced from search.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-custom-event-triggered-flow-7ae54b7798b5 — Custom event-triggered flows. Referenced from search.
- https://thespotforpardot.com/2024/09/03/building-a-message-series-flow-in-marketing-cloud-growth-edition/ — Message series flow guide. Referenced from search.
- https://www.salesforceben.com/marketing-cloud-growth-campaign-flows-vs-salesforce-flows/ — Campaign flows vs Salesforce flows. Referenced from search.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-send-to-a-flow-for-cross-flow-orchestration-859b7fcf84cc — Cross-flow orchestration. Referenced from search.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/agentforce-marketing-mastering-reusability-in-mc-next-to-build-once-and-deploy-everywhere/ — Reusability patterns. Referenced from search.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-segment-triggered-flow-39957ec68f06 — Segment-triggered flow details. Referenced from search.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-addition-of-never-option-for-recurring-flows-54a38c91c733 — Never re-entry option. Referenced from search.
