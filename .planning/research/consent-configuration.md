# Research: Consent Configuration

Generated: 2026-08-07
Module: consent-configuration
Sources: 18 sources consulted, 12 included in research

---

## Module Context

### From module-assignments.md (Module 5)

**Client ask:**
> Build the consent infrastructure. Create consent records, configure a consent banner, and — critically — set up the automation that grants consent to new individuals as they enter the system.

**Assignment:**
- Create Consent Purpose records for email marketing
- Create associated Consent Templates
- Configure a consent banner for use on marketing landing pages (you'll use this in Modules 17-18)
- Build a Data 360 Triggered Flow that automatically creates consent records for new individuals:
  - The flow listens for changes on the Individual DMO — specifically when a field like "Email Marketing Opt-In" becomes true
  - When triggered, the flow performs a Contact Point Email lookup for that individual
  - The flow creates a Communication Subscription Consent record with OPT_IN for those email addresses
- Add the Consent Lightning Web Component to the Lead and Contact record pages so consent status is visible in the CRM
- Test the consent flow in phases:
  1. Manual validation first: Manually create 2-3 new Leads/Contacts with the opt-in field set to true. Verify the triggered flow fires and creates consent records for each. Check the consent LWC on the record page to confirm.
  2. CSV stress test: Once the flow is validated, download `new_contacts_batch1.csv` (~20 new contacts) and import them via Data Loader or Data Import Wizard. Verify that consent records are created for all of them.
  3. Spot-check the protagonist contacts: Verify that your 10 protagonist contacts have consent records. If they don't, you won't receive test emails in later modules.

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

---

## CRITICAL NOTE FOR WRITER: Assignment Text Terminology Mismatch

The module assignment text references "Consent Purpose records" and "Consent Templates" — these are **Salesforce Privacy Preference Manager** objects, not MCA-native consent objects. In MCA/MCN, the primary consent configuration objects are:

- **Communication Subscriptions** (not "Consent Purposes")
- **Preference Pages** (not "Consent Templates")

The Salesforce Privacy Preference Manager product does have Consent Templates and Data Use Purpose objects, and its "Subscription" template type does write to the Communication Subscription Consent DMO. However, MCA consultants work with Communication Subscriptions directly through the MCA Consent tab — they do not typically navigate through the Privacy Preference Manager product to configure MCA consent.

**The module assignment appears to conflate two systems.** The writer should:
1. Flag this discrepancy in the research file (done here)
2. Focus the lesson on Communication Subscriptions (the MCA-native concept)
3. Treat "Consent Purpose records" and "Consent Templates" as either: (a) assignment language that needs clarification/correction, or (b) context for orgs that also use Privacy Center alongside MCA

UNVERIFIED: Whether MCA-specific Salesforce documentation explicitly mentions "Consent Purpose" or "Consent Template" objects as part of the MCA consent configuration workflow. Based on all sources reviewed, MCA consent is configured via Communication Subscriptions and the Consent tab in the MCA app — not via Privacy Preference Manager objects.

The "consent banner" in the assignment likely refers to the **web tracking consent banner** (for cookie/tracking consent on landing pages), not an email communication consent banner. These are distinct features. See "Consent Banner vs. Preference Center" section below.

---

## Platform Concepts

### Creating Communication Subscriptions

Communication Subscriptions are the primary MCA consent configuration object. Each subscription represents a category of marketing content a customer can opt into (e.g., "Promotional Offers," "VisionCare Rewards Updates").

**Navigation path:** Marketing Cloud App > Consent tab > Preference Pages and Subscriptions > New Subscription

**Steps to create a Communication Subscription:**
1. Navigate to the Consent tab in the Marketing Cloud app
2. Select "Preference Pages and Subscriptions"
3. Click "New Subscription"
4. Enter a subscription name (e.g., "Promotional Offers")
5. Select associated communication channels (Email, SMS, WhatsApp) — Email is included by default
6. Save

**What happens on save:** MCA automatically creates a Communication Subscription Channel Type record for each channel associated with the subscription. This junction record has an ID starting with `0eB`. This ID is required as an input to the Create Consent flow action.

**Default subscription:** MCA auto-creates a default "Marketing" Communication Subscription. Organizations typically add custom subscriptions on top of this.

**Channel dependency:** Email is available by default. SMS and WhatsApp require paid add-ons and additional configuration (short/long codes for SMS, authentication for WhatsApp).

Source: Mavlers (https://www.mavlers.com/blog/marketing-cloud-next-consent-management/), The Agentic Marketer (https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/consent-management/)

---

### Preference Center Configuration (Default)

The default preference center is a built-in hosted page where subscribers can manage their subscriptions.

**Navigation path:** Marketing Cloud App > Consent tab > Preference Pages and Subscriptions

**Adding subscriptions to the default preference page:**
1. Navigate to the preference page settings
2. Click "Edit Form"
3. Drag and drop the subscription component onto the form
4. Save changes
5. Click "View Page" to verify display

**Adding the preference center link in emails:**
1. In the email builder, insert a text component (paragraph or heading)
2. Enter the link text (e.g., "Manage Preferences")
3. Click the Merge Field option > Link > Preference Center
4. Save the email

**What subscriptions appear:** Only subscriptions explicitly added to the preference page are visible to subscribers. Subscriptions not added to the page cannot be opted into or out of from the preference center.

**What happens when a subscriber makes a change:** MCA writes OPT_IN or OPT_OUT to the Communication Subscription Consent DMO and refreshes the consent cache. There is typically a 5-10 minute delay before the DMO reflects the update.

Source: Mavlers (https://www.mavlers.com/blog/marketing-cloud-next-consent-management/)

---

### Custom Preference Center (Spring '26 New Feature)

As of Spring '26, MCA supports custom preference pages that allow branding customization.

**To enable:** Setup > Quick Find > "Marketing Features" > Preference Page Customization > Turn on "Custom Preference Pages"

**To create a custom preference page:**
1. From the Content tab, open the preferred marketing workspace
2. Select Add > Content > Preference Page > Create
3. In the editor, under Settings, enter a title for the preference page
4. Select the Subscription List component and configure the settings
5. Save, then Publish to make the page available

**Important limitation:** The Preference Manager merge field (the one used to insert preference center links in standard emails) does NOT work with custom preference pages. Custom preference pages require a different link mechanism.

UNVERIFIED: What the exact link mechanism is for custom preference pages when the standard merge field does not work.

**Transactional email limitation:** Custom preference pages are not supported for transactional emails. A `cstoken` (used to identify the individual recipient) is not generated for transactional messages. Do not add a custom preference center link to transactional email content.

Source: SFMC Tips #277 (medium.com/@marketingcloudtips/marketing-cloud-next-custom-preference-page-setup-311bc587f406 — 403 blocked, but search result summaries confirmed key details)

---

### Privacy Consent Status Component (the "Consent LWC")

The Privacy Consent Status component is a Lightning Web Component that surfaces consent status for all Communication Subscriptions on Lead and Contact record pages. It allows admins to view and manually update consent status per subscription and per email address.

**To add to a record page:**
1. Open the Lead or Contact record page in Lightning App Builder (Setup > Object Manager > Contact/Lead > Lightning Record Pages, or navigate to a record and click Setup gear > Edit Page)
2. Create a custom tab on the page layout (recommended name: "Consent")
3. In the component list on the left, find "Privacy Consent Status"
4. Drag and drop it onto the canvas
5. Save and activate the page

**What it displays:** Shows all Communication Subscriptions and their current consent status for the contact's email address(es). For each subscription, the status is OPT_IN or OPT_OUT.

**How to manually update consent:** Click the dropdown menu on the far right of the subscription row. Select OPT_IN or OPT_OUT. Save. This updates the consent cache immediately — the 2-3 minute delay before the Communication Subscription Consent DMO reflects the change is expected.

**Timing note:** Changes appear immediately on the CRM record page. The Communication Subscription Consent DMO update takes approximately 2-3 minutes. The Data 360 DMO is the source of truth for enforcement, so the cache (which is what drives send-time decisions) is updated by the component interaction.

**Supported objects:** Contact, Lead, Prospect. As of Spring '26, also supported on Person Accounts.

**This updates the consent cache** — manual updates via this component are one of the five valid methods for creating/updating consent records.

Source: SFMC Tips #110 (Nobuyuki Watanabe on Medium — 403 blocked, but Trailblazer community and search results confirmed details), The Agentic Marketer

---

### The Create Consent Request Flow Element

This is the platform-native flow element for creating or updating consent records from a flow. It is the recommended method for automated consent creation. It is the ONLY flow action that updates the consent cache.

**Flow element name (in the Flow Builder UI):** "Create Consent Request"

**Internal API / action name:** `MessagingConsent.MessagingConsent` (used in documentation and Apex references — not what you search for in the flow canvas)

**Required input fields:**

| Field | Description | Example Value |
|-------|-------------|---------------|
| `CommunicationSubscriptionChannelType` | The ID of the Communication Subscription Channel Type record (subscription + channel combination). Starts with `0eB`. | `0eBHs00000111n0MAA` |
| `ConsentCapturedDateTime` | Timestamp when consent was captured | `{!$Flow.CurrentDateTime}` |
| `ConsentId` | Composite key: email address + `#` + CommunicationSubscriptionChannelTypeId | `user@example.com#0eBHs00000111n0MAA` |
| `ConsentStatus` | OPT_IN or OPT_OUT | `OPT_IN` |
| `ContactPointValue` | The email address this consent applies to | `{!$Record.Email}` |
| `Name` | The Communication Subscription ID (channel-agnostic). Starts with `0Xl`. | `0XlHs00000111ZZKAY` |

**Important:** One "Create Consent Request" element must be added per subscription-channel combination. For LEOptical's three marketing subscriptions (each email-only), that is three elements in the flow.

**Where to find the CommunicationSubscriptionChannelType ID:** Navigate to the Communication Subscription Channel Type record in Data 360, or query via SOQL/API. The ID format starts with `0eB`. This ID is hardcoded in the flow formula resources because it is static per org.

**ConsentId formula:** Must be constructed as a formula resource in the flow. The formula is:
```
{!contactPointEmail} & "#" & "0eBHs00000111n0MAA"
```
Where `contactPointEmail` is a variable holding the email address and the hardcoded portion is the Communication Subscription Channel Type ID.

Source: arthurbackouche.com (https://arthurbackouche.com/docs/marketing-cloud-next/consent-management/how-to-manage-consent-in-marketing-cloud-next/), modrzejewski.it (https://modrzejewski.it/blog/how-to-keep-consent-in-sync-between-salesforce-data-360-and-marketing-cloud-next/)

---

### Building the Data 360 Triggered Flow for Consent Automation

This is the core hands-on deliverable for this module. The flow listens for new records in the Individual DMO and creates consent records when someone opts in.

**Flow type:** Data Cloud-Triggered Flow (also called Data 360-Triggered Flow)
**Trigger object:** `ssot_Individual__dlm` (the Individual DMO)
**Trigger condition:** Record is created (or updated with opt-in status change)

**General flow architecture (modrzejewski.it three-flow approach):**

There are three flows needed for full bidirectional consent sync. For this module, Flow 1 (baseline consent at registration) is the primary deliverable.

**Flow 1 — New individual consent (Data Cloud-Triggered):**
1. Start element: Data Cloud-Triggered Flow on `ssot_Individual__dlm`, triggered when record is created
2. Query: Get related Contact Point Email records for this Individual
3. Decision: Check if an opt-in condition is met (e.g., a field on the Individual like "Email Marketing Opt-In" = true)
4. For each matching email address: Execute the "Create Consent Request" flow element with appropriate field values
5. One "Create Consent Request" element per subscription-channel combination (three for LEOptical's marketing subscriptions)

**Flow 2 — MCA to CRM sync (Data Cloud-Triggered):**
Triggered when the Communication Subscription Consent DMO is updated (e.g., after a preference center opt-out). Writes the consent change back to the CRM `CommSubscriptionConsent` object. This keeps the CRM in sync with what the customer did in MCA.

**Flow 3 — CRM to MCA sync (Automation Event-Triggered):**
Triggered when the CRM `CommSubscriptionConsent` object is updated (e.g., when a CSR manually changes consent in the CRM). Uses the "Create Consent Request" flow element to push the change into MCA's consent cache.

**For this module:** Flow 1 is required. Flows 2 and 3 are context/stretch. The assignment says to listen for an "Email Marketing Opt-In" field on the Individual DMO — this maps to the `email_optin` field from the Loyalty CSV that was added as a custom field on the Loyalty Program Member DMO.

UNVERIFIED: Whether the trigger is better placed on the Individual DMO directly, or on a CRM Record-Triggered Flow on the Contact object. The modrzejewski.it architecture uses the Data Cloud-Triggered Flow on the Individual DMO. The arthurbackouche.com guide uses a Record-Triggered Flow on the Lead/Contact CRM object. Both approaches use the same `MessagingConsent.MessagingConsent` action. The practical difference:
- Data Cloud-Triggered on Individual: fires after data reaches Data 360 (latency due to data stream refresh)
- CRM Record-Triggered on Contact: fires immediately when the Contact is created/updated in the CRM

For LEOptical's use case (new CRM contacts needing consent), a CRM Record-Triggered Flow on Contact is likely more responsive. Confirm which approach the module intends.

**Summer '26 update:** More detailed trigger conditions can now be configured using fields from the primary DMO in Data Cloud-Triggered Flows.

Source: modrzejewski.it (https://modrzejewski.it/blog/how-to-keep-consent-in-sync-between-salesforce-data-360-and-marketing-cloud-next/), arthurbackouche.com (https://arthurbackouche.com/docs/marketing-cloud-next/consent-management/how-to-manage-consent-in-marketing-cloud-next/)

---

### CSV Consent Import

For bulk consent creation when an existing list needs to be opted in without building a flow.

**Navigation:** Marketing Cloud App > Consent tab > Consent Imports > Import

**Pre-requisite:** Contact points (email addresses) must already exist in the system. The import does not create new Leads or Contacts.

**Import steps:**
1. Select the communication channel (Email, SMS, WhatsApp)
2. Select the communication subscription
3. (SMS only) Enter Sender Code
4. Select the consent status to apply to all records in the file (OPT_IN or OPT_OUT — one status per import file)
5. Click Next
6. Upload the CSV file
7. Review the preview
8. Click Import

**CSV format:** Each row is one email address. One status applies to all rows in the file. You cannot mix OPT_IN and OPT_OUT in a single import file.

**Post-import behavior:** Updates sync to Data 360. There may be a delay before prospect/lead/contact records reflect the update. The consent cache IS updated by CSV imports (this is one of the five valid methods).

**Limitation:** One channel and one subscription per import file. If you need to import consent for three subscriptions, you run three separate imports.

Source: Mavlers (https://www.mavlers.com/blog/marketing-cloud-next-consent-management/)

---

### Consent Banner vs. Preference Center (Critical Distinction)

The module assignment mentions "configure a consent banner for use on marketing landing pages." This likely refers to the web tracking consent banner — NOT a communication preference center. These are two completely separate features.

**Web Tracking Consent Banner:**
- Purpose: Obtains permission from website visitors to track their behavioral data (cookies, web analytics) before tracking occurs
- Appears on: MCA landing pages and external websites with MCA tracking embed codes
- Navigation to configure: Setup > Quick Find > "Web Tracking" > Consent Banner > Turn on "Require Consent Banner"
- Customizable: Position (top, bottom, center as of Summer '26), font, colors, button text (button text customization added in Summer '26)
- If you change consent banner settings, you must republish the Marketing Landing Page site
- This is a SEPARATE system from email communication consent

**Email Preference Center:**
- Purpose: Lets email subscribers manage which Communication Subscriptions they are opted into
- Accessed via: A link in an email (the Preference Center merge field)
- Navigation to configure: Marketing Cloud App > Consent tab > Preference Pages and Subscriptions
- This manages OPT_IN / OPT_OUT for email communication subscriptions

**For this module:** The "consent banner" task is about web tracking consent for landing pages, configured in Setup. The preference center is about email subscription management, configured in the Consent tab. Both should be covered but they are distinct tasks with different navigation paths.

Source: SFMC Tips search result summaries (Medium — 403 blocked but search results confirmed the distinction)

---

### Org-Wide Consent Settings

MCA has org-wide settings that control which types of messages require consent checks.

**Default configuration:**
- Promotional emails: Consent checks ENABLED (required by default)
- Transactional emails: Consent checks DISABLED (consent not checked by default)
- SMS messages: Consent checks ENABLED
- WhatsApp messages: Consent checks ENABLED

**To change org-wide consent settings:**
1. Navigate to Salesforce Setup
2. Find consent management settings
3. Toggle the consent confirmation on or off per message type

**Important caveat:** Even if consent management is globally disabled, if a Communication Subscription is specified when sending an email, consent IS still checked for that subscription. Disabling consent globally does not completely bypass subscription-level checks when a subscription is explicitly assigned.

UNVERIFIED: Exact navigation path for org-wide consent settings in Setup. Mavlers describes navigating to "Salesforce Setup" and toggling "consent confirmation to Disabled." The SFMC Tips #168 article (about disabling consent management) is blocked. Confirm the exact Setup path in a live SDO.

Source: Mavlers (https://www.mavlers.com/blog/marketing-cloud-next-consent-management/), search result summaries from SFMC Tips #168

---

### Testing Consent Configuration

**Test the flow manually first (before CSV import):**
1. Create 2-3 new Leads or Contacts manually in Salesforce with the opt-in condition met (e.g., Email Marketing Opt-In = true)
2. Wait for the flow to fire (Data Cloud-Triggered flows have latency — the data must stream from CRM to Data 360 first; CRM Record-Triggered flows fire immediately)
3. Check the Privacy Consent Status component on the record page — it should show OPT_IN for the relevant subscriptions
4. Alternatively, check the Communication Subscription Consent DMO in Data 360 directly

**Verify an opt-out is respected:**
1. Set a test contact to OPT_OUT via the Privacy Consent Status component
2. Attempt a test send to that contact
3. Confirm the contact does not receive the email (no error, no bounce — silent suppression)

**Test send unsubscribe behavior:**
When you click an unsubscribe link in a test email (sent via the "Preview and Test Send" feature), MCA writes a dummy entry "dummyCsctToken" to the Communication Subscription Consent DMO — it does NOT actually opt out any real email address. This is safe for testing.

EXCEPTION: If you click the unsubscribe link from a test email via the **Preference Center**, the first email address in the test recipients list WILL actually be opted out. Confirm which email address will be affected before testing this path.

**Flow debugging limitation:** During flow debug execution, `$Record__Prior` is always NULL. Decision logic that checks for field changes (e.g., "did opt-in status change from false to true?") cannot be validated in the debug screen. Test by actually updating a record, not via the debug interface.

Source: SFMC Tips #107 and #157 search result summaries (Medium — 403 blocked but search results confirmed key details)

---

## UI Navigation Paths

- **Create Communication Subscription**: Marketing Cloud App > Consent tab > Preference Pages and Subscriptions > New Subscription (Source: Mavlers, The Agentic Marketer)
- **Edit Default Preference Page**: Marketing Cloud App > Consent tab > Preference Pages and Subscriptions > [Select page] > Edit Form (Source: Mavlers)
- **CSV Consent Import**: Marketing Cloud App > Consent tab > Consent Imports > Import (Source: Mavlers)
- **Enable Custom Preference Pages**: Setup > Quick Find: "Marketing Features" > Preference Page Customization > Turn on Custom Preference Pages (Source: Salesforce Help search result)
- **Create Custom Preference Page**: Content tab > Marketing workspace > Add > Content > Preference Page > Create (Source: Salesforce Help search result — https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_create_customizable_preference_page.htm)
- **Add Preference Center link in email**: Email builder > Text component > Merge Field > Link > Preference Center (Source: Mavlers)
- **Privacy Consent Status Component**: Lightning App Builder > Component search: "Privacy Consent Status" > drag to page layout (Source: Trailblazer community search result, The Agentic Marketer)
- **Web Tracking Consent Banner**: Setup > Quick Find: "Web Tracking" > Consent Banner > "Require Consent Banner" toggle (Source: search result summaries from SFMC Tips #128, #295)
- **Org-wide consent settings**: Salesforce Setup > [exact path UNVERIFIED] (Source: Mavlers description — confirm in SDO)
- **Review Consent Data in Data 360**: Data 360 > [Communication Subscription Consent DMO] (Source: general knowledge from consent-fundamentals module)
- **Edit preference center link in email**: Marketing Cloud App > Email content > text component > Merge Field > Link > Preference Center (Source: Mavlers)

---

## Platform Gotchas

### From platform-gotchas.md (pre-existing, confirmed Summer '26)

1. **MCA does not auto-create consent records** — Every Individual in Data 360 needs an explicit consent record before marketing emails can go out. MCA does not create these when a Contact or Lead is created. The Triggered Flow is required.

2. **Party field on Comm Sub Consent is not populated by MCA** — The `Party` field on Communication Subscription Consent should link to Individual via Individual ID but MCA does not populate it. Workaround: join Communication Subscription Consent to Contact Point Email via `Email Address = Consent Value` (or `Contact Point Value`).

3. **Preference center updates Comm Sub Consent DMO directly** — When someone opts in/out via the preference center, MCA writes OPT_IN or OPT_OUT to the Communication Subscription Consent DMO. This is the source of truth for consent status at send time.

### New gotchas discovered during research

4. **Deleting a Communication Subscription permanently deletes all related consent records** — There is no soft-delete or archive state. Before removing a subscription, remove it from all Preference Pages first. Consider retiring (disabling) rather than deleting if consent history needs to be preserved.
   - Confirmed by: Mavlers, The Agentic Marketer
   - Release: Unknown — treat as confirmed behavior

5. **Custom preference pages do not support the standard Preference Center merge field** — The merge field that inserts the preference center link in emails does not work with custom preference pages. A different link mechanism is required.
   - Source: Mavlers
   - UNVERIFIED: What the correct link mechanism is for custom preference pages

6. **Custom preference pages cannot be used with transactional emails** — The cstoken used to identify a recipient is not generated for transactional messages. Adding a custom preference center link to a transactional email will not work correctly.
   - Source: SFMC Tips #277 search result summaries

7. **Test email unsubscribe writes "dummyCsctToken" — safe for flow testing** — Clicking unsubscribe in a flow test email does not opt out real addresses. However, clicking unsubscribe via the Preference Center from a test email WILL opt out the first recipient address. Distinguish these two test paths.
   - Source: SFMC Tips #107 search result summary

8. **Privacy Consent Status component update takes 2-3 minutes to appear in Data 360** — The component updates the consent cache immediately, but the Communication Subscription Consent DMO update takes 2-3 minutes. On the CRM record page, the status appears to change right away.
   - Source: SFMC Tips #110 search result summary

9. **Data Cloud-Triggered flows have latency** — A flow triggered by changes to the Individual DMO will only fire after the CRM data has streamed into Data 360. This means there is a delay between creating a Contact in the CRM and the flow firing. For immediate consent creation, a CRM Record-Triggered Flow on the Contact object may be preferable.
   - Source: modrzejewski.it architecture, general platform knowledge
   - UNVERIFIED: Confirm which flow type the module intends to use

10. **CommunicationSubscriptionChannelType IDs must be hardcoded in flow formulas** — The `0eB` ID for each subscription-channel combination is org-specific and static. It must be looked up after creating the Communication Subscription and hardcoded into the formula resource in the flow. If the subscription is deleted and recreated, this ID changes and the flow must be updated.
    - Source: arthurbackouche.com, modrzejewski.it

11. **One "Create Consent Request" element per subscription-channel combination** — The flow must have one "Create Consent Request" element for each unique subscription + channel pair. For three marketing subscriptions each on email, that is three elements. In the flow canvas, search for "Create Consent Request" (not "MessagingConsent") to find the element.
    - Source: arthurbackouche.com

---

## MCE Comparison Points

**MCE Publication Lists vs. MCA Communication Subscriptions:**
- MCE used Publication Lists to categorize subscribers. A subscriber could be on multiple lists. Consent was implicit unless explicitly suppressed.
- MCA uses Communication Subscriptions. Each subscription requires an explicit OPT_IN record. No opt-in = blocked from sends.
- MCE Publication Lists were configured in the Email Studio > Admin > Send Management area. MCA Communication Subscriptions are configured in the Marketing Cloud App > Consent tab.

**MCE Preference Center vs. MCA Preference Page:**
- MCE had a native hosted preference center tied to Publication Lists. It was configured in Email Studio. Subscribers could select which lists they wanted to receive.
- MCA has a native Preference Page tied to Communication Subscriptions. It is configured in the Consent tab. Spring '26 added a custom branded preference page option.
- MCE's preference center worked with all email types including transactional. MCA's custom preference pages explicitly do not support transactional emails.

**MCE All Subscribers list vs. MCA default state:**
- MCE: New subscribers were contactable by default unless suppressed.
- MCA: New individuals default to OPT_OUT state. No explicit consent = blocked.

**MCE unsubscribe management vs. MCA unsubscribe:**
- MCE maintained a global unsubscribe list. An unsubscribe removed the subscriber from all sends.
- MCA supports both subscription-level and global unsubscribe ("Unsubscribe from all"). Global unsubscribe in MCA opts out all existing subscriptions but does not permanently block future subscriptions.

**MCE List-Unsubscribe header:**
- MCE's List-Unsubscribe header behavior was consistent.
- MCA's transactional emails also display the List-Unsubscribe header (rendered by email clients like Gmail/Apple Mail as a one-click unsubscribe button). A customer who clicks that button on an Order Updates transactional email may generate a consent change depending on preference center configuration. Test this before go-live.

**MCE consent for transactional emails:**
- MCE had no consent check for transactional emails.
- MCA by default does not check consent for transactional emails (the `Order Updates` subscription type), but this is a configurable org-wide setting that can be changed.

**No direct MCE equivalent for:**
- The "Create Consent Request" flow element (internal API name: `MessagingConsent.MessagingConsent`) (MCA-specific)
- The Privacy Consent Status LWC on record pages (MCA-specific)
- The Communication Subscription Consent DMO (MCA-specific)
- Web tracking consent banner (MCA-specific feature, not present in MCE)

---

## External Resources

- [Understanding Consent Management in Marketing Cloud Next (Mavlers)](https://www.mavlers.com/blog/marketing-cloud-next-consent-management/) — Practical walkthrough covering Communication Subscription creation, Preference Center setup, CSV import process, Privacy Consent Status component, org-wide consent settings. Best single source for UI navigation paths.

- [Consent Management in Marketing Cloud Next explained (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/consent-management/) — Deep dive covering the DMO structure, consent cache behavior, valid consent creation methods, and the Communication Subscription Channel Type concept. Already referenced in consent-fundamentals.md.

- [How to Keep Consent in Sync between Salesforce, Data 360, and Marketing Cloud Next (modrzejewski.it)](https://modrzejewski.it/blog/how-to-keep-consent-in-sync-between-salesforce-data-360-and-marketing-cloud-next/) — The three-flow bidirectional consent sync architecture. Most detailed source on the Data Cloud-Triggered Flow design for consent automation. Covers flow type selection, trigger objects, and field mappings.

- [How to Manage Consent in Marketing Cloud Next (arthurbackouche.com)](https://arthurbackouche.com/docs/marketing-cloud-next/consent-management/how-to-manage-consent-in-marketing-cloud-next/) — Field-level reference for the `MessagingConsent.MessagingConsent` flow action. Includes the ConsentId formula construction and the six required input fields. Best source for the flow action configuration details.

- [Create a Communication Subscription in Marketing Cloud Next (Salesforce Help)](https://help.salesforce.com/s/articleView?id=mktg.mktg_consent_comm_sub_create.htm&language=en_US&type=5) — Official docs. Page renders as JS shell in WebFetch — must be accessed in a browser. Navigation path confirmed from search results.

- [Edit a Default Preference Page (Salesforce Help)](https://help.salesforce.com/s/articleView?id=mktg.mktg_consent_pref_page_create.htm&language=en_US&type=5) — Official docs for editing the default preference page. Renders as JS shell — access in browser.

- [Create a Custom Preference Page For Marketing Channels (Salesforce Help)](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_create_customizable_preference_page.htm&language=en_US&type=5) — Official docs for the Spring '26 custom preference page feature. Renders as JS shell — access in browser.

- [Import Consent Data to Marketing Cloud Next (Salesforce Help)](https://help.salesforce.com/s/articleView?id=mktg.mktg_consent_import_create.htm&language=en_US&type=5) — Official docs for CSV consent import. Renders as JS shell — access in browser.

- [Create Consent Request Flow Element (Salesforce Help)](https://help.salesforce.com/s/articleView?id=platform.flow_ref_elements_mktg_consent_request.htm&language=en_US&type=5) — Official field reference for the "Create Consent Request" flow element. Internal API name is `MessagingConsent.MessagingConsent`. Renders as JS shell — access in browser.

- [Understanding Consent Concepts in Marketing Cloud Next (Salesforce Help)](https://help.salesforce.com/s/articleView?id=mktg.mktg_consent_tools_ref.htm&language=en_US&type=5) — Official concepts reference. Renders as JS shell — access in browser.

- [Surfacing Subscription Consents on Person Accounts (The Agentic Marketer)](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/subscription-consents-person-accounts/) — Covers the Party field workaround in detail and the MessagingConsentV2 DSO (updated as of September 2025). Also documents the Spring '26 Privacy Content Status component addition for Person Accounts.

- [Marketing Cloud Next Supported Consent Actions (Salesforce Help)](https://help.salesforce.com/s/articleView?id=005316463&language=en_US&type=1) — Official list of supported consent actions. Renders as JS shell — access in browser.

---

## Data Model Relevance

### Communication Subscription Consent DMO

This module creates records in the Communication Subscription Consent DMO. The field-level mapping from data-model.md:

| DMO Field | Source | Type | Notes |
|-----------|--------|------|-------|
| Consent Status | Flow logic | Text | OPT_IN or OPT_OUT |
| Consent Date | Flow logic | DateTime | When consent was captured |
| Communication Subscription | Flow logic | Text | Which subscription (0Xl ID) |
| Email Address (Contact Point Value) | Contact Point Email lookup | Email | Relates to CPE via email match — the Party field workaround |

The composite key format: `{email_address}#{CommunicationSubscriptionChannelTypeId}` (e.g., `maria@leoptical.com#0eBHs0000010zyOMAQ`)

### LEOptical's Four Communication Subscriptions (from data-model.md)

| Subscription | Type | Preference Center | Consent Required |
|-------------|------|-------------------|------------------|
| Promotional Offers | Marketing | Yes — opt-in/out toggle | Yes |
| VisionCare Rewards Updates | Marketing | Yes — opt-in/out toggle | Yes |
| Eye Health Reminders | Marketing | Yes — opt-in/out toggle | Yes |
| Order Updates | Transactional | No — not shown | No (by default) |

The flow built in this module creates consent records for the three marketing subscriptions only. Order Updates is transactional and handled differently (no consent required under default configuration).

### Data Graph relationship (from data-model.md)

The Communication Subscription Consent DMO relates to Contact Point Email via email match, not via the Party field:

```
Unified Individual → Contact Point Email → Communication Subscription Consent
                                          (via Email Address = Contact Point Value)
```

This relationship is built in Module 8 (Data Graphs). This module creates the records. Module 8 builds the graph traversal that makes consent queryable from segments.

### Protagonist contacts

The 10 protagonist contacts (set up in Module 1 with `yourname+alias@gmail.com` email patterns) must have consent records created by the end of this module. Without consent records, no test emails will be received in subsequent modules. The spot-check step in the assignment is critical.

### MessagingConsentV2 DSO

As of Summer '25, MCA writes all new consent records to `MessagingConsentV2-MessagingConsent` DSO (not the older `MessagingConsent-MessagingConsent`). Both may exist in older orgs, causing duplicate records in some configurations. LEOptical's SDO is fresh, so this is informational only — but worth knowing when debugging in client orgs.

---

## Source Log

- https://www.mavlers.com/blog/marketing-cloud-next-consent-management/ — Included. Best source for UI navigation paths, Communication Subscription creation, Preference Center configuration, CSV import, Privacy Consent Status component, org-wide consent settings. Confirmed MCA/MCN content.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/consent-management/ — Included. Core MCA consent architecture. Already referenced in consent-fundamentals module.
- https://modrzejewski.it/blog/how-to-keep-consent-in-sync-between-salesforce-data-360-and-marketing-cloud-next/ — Included. Three-flow bidirectional consent architecture. Best source for Data Cloud-Triggered Flow design.
- https://arthurbackouche.com/docs/marketing-cloud-next/consent-management/how-to-manage-consent-in-marketing-cloud-next/ — Included. Field-level reference for the MessagingConsent flow action and ConsentId formula.
- https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/subscription-consents-person-accounts/ — Included. Party field workaround details, MessagingConsentV2 DSO, Spring '26 Privacy Consent Status component support for Person Accounts.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_consent_comm_sub_create.htm — Included (navigation path only). Page renders as JS shell in WebFetch. Access in browser.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_consent_tools_ref.htm — Included (search result summaries only). Page renders as JS shell.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_consent_pref_page_create.htm — Included (URL only). Page renders as JS shell.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_create_customizable_preference_page.htm — Included (steps extracted from search result snippet). Page renders as JS shell.
- https://help.salesforce.com/s/articleView?id=mktg.mktg_consent_import_create.htm — Included (URL only). Page renders as JS shell.
- https://help.salesforce.com/s/articleView?id=platform.flow_ref_elements_mktg_consent_request.htm — Included (URL only). Page renders as JS shell.
- https://help.salesforce.com/s/articleView?id=005316463 — Included (URL only, "Marketing Cloud Next Supported Consent Actions"). Page renders as JS shell.
- https://trailhead.salesforce.com/content/learn/modules/consent-management-fundamentals-for-marketing-cloud-next/get-started-with-consent-management — Included (conceptual only). Confirmed MCA content. No UI navigation steps in this unit — conceptual module only.
- https://trailhead.salesforce.com/content/learn/projects/create-a-no-code-preference-form/create-a-consent-template — Discarded. This is about Salesforce Privacy Preference Manager (not MCA-native consent). Confirms "Consent Templates" are a Privacy Preference Manager product concept, not MCA Communication Subscription configuration.
- https://www.axelerant.com/blog/how-to-implement-consent-management-for-salesforce-marketing-cloud — Discarded. MCE content. Uses Marketing Cloud Connect, Automation Studio, Synchronized Data Extensions — all MCE architecture.
- https://greenkeydigital.com/wp-content/uploads/2025/08/mktg_implementation_guide.pdf — Discarded. PDF rendered as binary — could not extract content.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-leveraging-custom-unsubscribe-links-78649b12da0e — Blocked (403). Key information extracted from search result summaries.
- https://medium.com/@marketingcloudtips/marketing-cloud-next-custom-preference-page-setup-311bc587f406 — Blocked (403). Key information extracted from search result summaries.
- https://medium.com/@marketingcloudtips/marketing-cloud-on-core-a-guide-to-consent-management-5ca95a1602a0 — Blocked (403). Key information extracted from search result summaries.
- https://medium.com/@b2.shashi/privacy-consent-design-in-marketing-cloud-next-fbdb4a20f647 — Blocked (403).
- https://medium.com/@marketingcloudtips/marketing-cloud-next-setting-up-consent-synchronization-with-mc-engagement-33b4cba94f47 — Not fetched. Relevant to MCE/MCA parallel running during migration — out of scope for this module.
