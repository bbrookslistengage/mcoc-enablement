# Research: Domain Setup

Generated: 2026-08-06
Module: domain-setup
Sources: 22 sources consulted, 16 included in research

---

## Module Context

Copied verbatim from `.planning/specs/module-assignments.md`, Module 2:

> **The client wants:** LEOptical's marketing emails should come from a branded domain, not a generic Salesforce address. They also want branded links in emails and a custom domain for landing pages.

**Assignment:**
- Configure email domain authentication using MCA's self-service domain setup
- Set up a landing page domain
- Configure a link branding domain
- Document the DNS records that would need to be created (TXT, CNAME) — capture what you'd hand to the client's IT team

**Success Criteria:**
- Email sending domain is configured in MCA setup
- Landing page domain is configured
- Link branding domain is configured
- You can articulate which DNS record types are needed and why

> **Domain strategy (resolved):** Learners purchase a cheap domain on Porkbun (~$1-2/year) and configure DNS records (SPF, DKIM, DMARC) for full domain authentication. This gives them the complete hands-on experience. Long-term, if the course gains internal traction, LE IT will set up a process for LE-owned subdomains.

---

## Platform Concepts

### MCA Domain Architecture: Three Distinct Domain Roles

MCA requires configuring up to three separate domains, each with a different purpose:

1. **Email sending / authenticated domain** — the domain your emails appear to come from (`From:` address). Requires full DNS authentication (DKIM, SPF via CNAME, optionally DMARC). This is the highest-stakes domain for deliverability.
2. **Tracking / link branding domain** — the domain used to wrap links inside emails for click tracking. Default is `xxxxx.tracking.e360.salesforce.com`. Can be replaced with a branded custom domain. Requires a CNAME record and a CA-signed SSL certificate.
3. **Landing page domain** — the domain used for MCA-hosted landing pages. Default is a Salesforce CDN URL. Can be replaced with a custom subdomain. Requires CNAME records pointing to Salesforce's CDN infrastructure; uses the Salesforce CDN (Cloudflare) for free SSL.

These three domains can all live on the same root domain but must be different subdomains from each other (e.g., `email.leoptical.com`, `links.leoptical.com`, `pages.leoptical.com`).

Source: Salesforce Help (Domain Settings in Marketing Cloud Next), SFMC Tips #171, SFMC Tips #172, The Agentic Marketer "First Email"

---

### Email Sending Domain (Authenticated Domain)

**What it is:** A subdomain you own and authenticate so that MCA is authorized to send email on its behalf. MCA does not provide a default sending domain — this must be configured before any email can be sent.

**Terminology note:** In the UI, this is called an "Authenticated Domain" (not a "sending domain"). The navigation path varies by context — see UI Navigation Paths below.

**Subdomain vs. root domain:** Salesforce strongly recommends using a subdomain (e.g., `e.leoptical.com`) rather than the root domain. This isolates email sending reputation from web traffic, preventing negative impacts if website activity affects domain health. Sending from a root domain is technically possible but is discouraged.

**What MCA requires:**
- A subdomain you control (e.g., `e.leoptical.com`)
- You add that subdomain in MCA Setup
- MCA generates a set of DNS records you must add to your domain registrar
- MCA verifies the records and activates the domain (can take up to 72 hours for DNS propagation)
- Once activated, you create a From Address (e.g., `marketing@e.leoptical.com`) using that subdomain

**DNS records required:** Sources confirm approximately 8 CNAME DNS records total are required. The specific breakdown that multiple sources confirm includes:
- 3 outbound CNAME records for DKIM authentication (2048-bit keys by default)
- Additional CNAMEs for infrastructure subdomains: `anonymous.[subdomain]`, `bounce.[subdomain]`, `fbl.[subdomain]`, `reply.[subdomain]`, `leave.[subdomain]`
- SPF is handled automatically by Salesforce via the bounce CNAME — you do NOT add a separate SPF TXT record (it is embedded in the CNAME chain)

**DMARC:** MCA does not auto-configure DMARC for you. You add your own DMARC TXT record to the root domain's DNS. DMARC requires alignment — the domain in your `From:` address and the domain in the bounce/return-path must share the same parent domain. Recommended rollout: start at `p=none` (monitor), move to `p=quarantine`, then `p=reject`.

**Activation flow:**
1. Navigate to Authenticated Domains in Setup, click `+ Add Domain`
4. Enter subdomain, click Submit
5. Create a From Address email for the domain (e.g., `marketing@e.leoptical.com`)
6. Click "Manual DNS Record Information" to see the required CNAME records
7. Add all DNS records at your domain registrar
8. Check the box confirming DNS changes are complete, enable "Activate my Domain"
9. Optionally enter an email address to receive an activation notification
10. Domain status changes to "Pending" during Salesforce validation (up to 72 hours)

Source: arthurbackouche.com domain auth guide, The Agentic Marketer "First Email" and "Authenticated Domains Not Enabled", SFMC Tips #140

---

### Migration Step: Troubleshooting Only

If the Authenticated Domains option does not appear in Setup at all, a one-time org migration may be required. This is a troubleshooting step, not a standard part of the setup flow.

**Navigation:** Setup > Quick Find > "Migration" > Unified Messaging Email > Transfer

**What it does:** Migrates the org from the legacy Organization-Wide Email Address infrastructure to the new Unified Messaging email sending architecture. Only needed if the Authenticated Domains page is missing from Setup.

**How long it takes:** Up to 24 hours after clicking Transfer before the Authenticated Domains page becomes available.

**Prerequisite:** Any running campaigns must be paused or completed before the migration can proceed.

Source: The Agentic Marketer "Authenticated Domains Not Enabled"

---

### From Address Setup

After an authenticated domain is active, you create one or more From Addresses using that domain.

**Navigation:** Setup > Unified Messaging > Authorized Email Domains (for domain-level setup) > From Addresses tab > + Add From Addresses

**Requirement:** You cannot use a From Address until the domain is fully activated. Salesforce sends a confirmation email when activation completes.

**DKIM requirement enforced:** In MCA Growth and Advanced Editions, it is mandatory to use email addresses from DKIM-authenticated domains as the sender address. You cannot use an unverified domain.

**Dynamic From Address (Summer '26 feature):** As of Summer '26, MCA supports dynamically setting the From Address and Reply-To Address using data stored on Contacts and Leads. The domain used for dynamic addresses must still be an authenticated domain — personal email accounts (Gmail, Outlook) cannot be used as From addresses.

Source: cgc-agency.com dynamic from address post, SFMC Tips #304, multiple search result summaries

---

### Reply Mail Management (RMM)

RMM is an optional feature in Unified Messaging that automatically processes inbound replies to your marketing emails.

**What it does:**
- Automatically discards out-of-office and auto-responder noise
- Routes genuine replies to a designated forwarding address
- Automatically unsubscribes contacts who reply with keywords like "unsubscribe," "opt-out," "remove," or "stop"
- Creates a `reply.[subdomain]` address that handles inbound traffic

**Setup requirement:** RMM requires an authenticated domain. The `reply.[subdomain]` CNAME record is one of the 8 DNS records generated during authenticated domain setup.

**Limitation:** No dynamic sender support — you select one sender per flow. Forwarded replies may land in spam folders depending on receiving server configuration.

Source: The Agentic Marketer "Replay Mail Management in Marketing Cloud Next"

---

### Tracking / Link Branding Domain

**What it is:** The domain used to rewrite all click-tracking links in emails. Default is `xxxxx.tracking.e360.salesforce.com`. Replacing this with your own subdomain means click URLs look branded (e.g., `links.leoptical.com/click/...`) rather than pointing to a Salesforce domain.

**Why it matters:** Branded tracking domains improve deliverability (some spam filters penalize messages with third-party tracking domains), improve customer trust, and enable DMARC alignment when the tracking domain matches your sending domain's parent.

**Setup requirements:**
- A subdomain you own (must be different from the sending domain and landing page domain)
- A CNAME record pointing the subdomain to Salesforce infrastructure
- A CA-signed SSL certificate (HTTPS required for tracking links) — you create this inside Salesforce Setup using Certificate and Key Management

**Certificate process:**
1. Setup > Certificate and Key Management > Create CA-Signed Certificate
2. Download the CSR file
3. Submit CSR to a Certificate Authority (free options available, valid for ~90 days)
4. Upload the signed certificate back to Salesforce
5. Certificate renewal required every 90 days (Salesforce sends reminder emails 10 days and 1 day before expiration)

**Limitation:** Only one tracking domain can be configured per org. It cannot be the same subdomain as the landing page domain.

**Marketing team cannot complete this alone** — the certificate creation and DNS work requires IT/admin coordination.

Source: SFMC Tips #172, search result summaries for link branding domain, cgc-agency.com

---

### Landing Page Domain

**What it is:** A custom domain for MCA-hosted landing pages. Default is a Salesforce CDN URL. Replacing this allows pages to load from your own branded subdomain.

**Recommended hosting:** Select "Serve the domain with the Salesforce Content Delivery Network (CDN)" in the setup UI. This uses Cloudflare as the CDN partner and provides a shared SSL certificate for free, so you get HTTPS without managing certificates separately.

**DNS records required:**
- Two CNAME records using an API identifier provided in the setup UI (format: your org's 15-digit org ID)
  - `[subdomain].example.com` → `[subdomain].example.com.[orgId].live.siteforce.com`
  - `_acme-challenge.[subdomain].example.com` (for certificate validation)

**Prerequisites:** Your DNS provider must support ANAME, ALIAS records, or CNAME flattening. If not supported, you cannot proceed with the CDN option.

**Limitation:** Must be a different subdomain from the tracking domain.

Source: SFMC Tips #171, search result summaries for landing page domain

---

### SAP (Sender Authentication Package) — MCA vs MCE Context

SAP is a concept from **classic Marketing Cloud Engagement (MCE)**, not a feature in MCA. Understanding the distinction is important for consultants coming from MCE.

**What SAP is in MCE:**
- A bundle available for MCE accounts that includes: Private Domain (DKIM/SPF authentication), Dedicated IP Address, Reply Mail Management, and Account Branding (link and image wrapping)
- Account branding (link wrapping with your domain) is only available through SAP in MCE — it cannot be purchased separately
- MCE Corporate and Pro licenses each include 1 SAP license; Enterprise includes 5
- Only one SAP per MID; additional private domains can be purchased separately

**What SAP means in MCA:**
- The SAP construct as a bundle does not exist in MCA in the same way
- Domain authentication in MCA is self-service — you configure it through the Unified Messaging setup UI without purchasing a separate add-on
- The "private domain" concept (DKIM/SPF auth for your sending domain) is built into MCA's authenticated domain setup
- Dedicated IPs became available in MCA starting Spring '26, with automatic IP warming (0–35 day process)
- Subdomain delegation (handing DNS control to Salesforce nameservers) is NOT available in MCA Growth and Advanced editions — only self-hosted DNS configuration is supported

**Key difference for the module:** Learners coming from MCE may expect to reference "SAP" or "private domain" as MCE-specific features. MCA replaces this with a self-service authenticated domain flow in Setup. There is no procurement step for domain authentication in MCA — you simply configure it yourself.

Source: Salesforceben.com SAP article, twistellar.com SAP guide, digitalmarketingoncloud.com private domain guide, multiple search result summaries

---

### Shared vs. Dedicated IPs in MCA

**Before Spring '26:** MCA only offered shared IPs. All sending went through Salesforce shared infrastructure.

**Spring '26 and later:** Dedicated IPs became available in MCA Growth and Advanced. Key details:
- Automatic IP warming runs for 0–35 days after migration to dedicated IPs
- Any sends exceeding warming limits route through shared IPs during warm-up
- Once warming is complete, capacity is approximately 2–2.5 million emails per day
- Maximum 32 dedicated IPs per account
- If average monthly volume falls below 5 million emails/month for 90 days, IPs are gradually reclaimed and reverted to shared

**For most MCA implementations:** Shared IPs are the starting point. The domain warm-up (not just IP warm-up) remains important regardless.

Source: SFMC Tips #291 (Shared IP vs Dedicated IP), Spring '26 release highlights summary

---

## UI Navigation Paths

- **One-time migration prerequisite:** Setup > Quick Find "Migration" > Unified Messaging > Email > Migration > Transfer (Source: The Agentic Marketer "Authenticated Domains Not Enabled")
- **Authenticated Domain setup:** Setup > Quick Find "Authenticated" > Authenticated Domains > + Add Domain (Source: The Agentic Marketer "First Email")
- **Alternative path cited by multiple sources:** Setup > Unified Messaging > Email > Authenticated Domains (Source: arthurbackouche.com, multiple search summaries)
- **DNS record download:** From the Authenticated Domain record, click "Manual DNS Record Information" (Source: arthurbackouche.com)
- **From Address setup:** Setup > Unified Messaging > From Addresses > + Add From Addresses (Source: multiple sources)
- **Authorized Email Domains (for dynamic from addresses):** Setup > Unified Messaging > Authorized Email Domains > Add Email Domain (Source: cgc-agency.com, search result summaries)
- **Tracking/link branding domain:** Setup > Domain Settings (exact path <!-- VERIFY --> — Salesforce Help article `mktg.mktg_admin_domains_ref.htm` covers this but content was not fetchable)
- **Landing page domain:** Setup > Domain Settings > Add a Domain > select subdomain and CDN option (Source: SFMC Tips #171 summary)
- **Certificate and Key Management:** Setup > Certificate and Key Management > Create CA-Signed Certificate (Source: link branding search summaries)
- **MCA Basic Settings (for initial enablement):** Setup > Quick Find "Marketing Cloud" > Basic Settings > Enable (Source: Trailhead prepare-your-org unit)

**Note on UI paths:** The Salesforce Help pages for Domain Settings (`mktg.mktg_admin_domains_ref.htm`) and the authenticated domain article (`id=004576430`) are JavaScript-rendered and could not be fetched to confirm exact navigation paths. The paths above come from third-party sources and the arthurbackouche.com documentation site. Flag for verification in a live SDO.

---

## Platform Gotchas

### Existing gotcha from platform-gotchas.md

**SDOs do not have a default sending domain** (Confirmed: 2026-08-06, Summer '26)
SDO orgs do not come with a pre-configured email sending domain. Learners must configure domain authentication (SPF, DKIM, DMARC) with their own domain before they can send emails.

---

### New gotchas discovered during research

**1. The migration step is a troubleshooting fallback, not a required prerequisite**
If the Authenticated Domains setup page does not appear in Setup, run the one-time migration at Setup > Unified Messaging > Email > Migration > Transfer. This is only needed when the page is missing — it is not a standard step in the normal setup flow. After clicking Transfer, wait up to 24 hours before the page appears.
- Source: The Agentic Marketer "Authenticated Domains Not Enabled"

**2. Subdomain delegation is not available in MCA**
Classic MCE supports subdomain delegation — handing DNS nameserver control to Salesforce so they manage all DNS records. MCA Growth and Advanced do not support this. Only self-hosted DNS configuration is available. This means IT must manually create each of the ~8 CNAME records at the registrar.
- Source: SFMC Tips #28 summary, confirmed in search result summaries
- <!-- VERIFY --> Flag for verification in live SDO or official docs

**3. Link branding domain requires a CA-signed certificate managed by IT**
Unlike the landing page domain (which uses Salesforce's free CDN/Cloudflare SSL), the link branding/tracking domain requires you to create and maintain a CA-signed SSL certificate. Free certificates from CAs expire every ~90 days. Salesforce sends expiry reminders 10 and 1 days before expiry but does not auto-renew. This is an ongoing IT coordination burden.
- Source: SFMC Tips #172 summary, link branding search results

**4. SPF is handled via CNAME, not a separate TXT record**
Unlike classic MCE where you add an SPF TXT record, in MCA the SPF record is embedded in the CNAME chain for the bounce subdomain. You do NOT add a separate SPF TXT record to your DNS. Consultants who add both may create SPF conflicts.
- Source: Multiple search result summaries citing Salesforce Help article `id=004576430`
- <!-- VERIFY --> Flag — confirm this is the current MCA behavior and not MCE behavior being described

**5. DNS propagation can take up to 72 hours**
Domain activation is asynchronous. After adding DNS records and checking the activation box in MCA, domain status goes to "Pending." Propagation can take up to 72 hours depending on TTL settings and DNS provider. Learners should plan for this window and not expect immediate activation.
- Source: arthurbackouche.com, The Agentic Marketer "First Email"

**6. Only one tracking/link branding domain per org**
You can only configure one tracking domain. If you want multiple brands tracked separately, you need separate orgs (or business units, which is not available in SDO).
- Source: SFMC Tips #172 summary

**7. DMARC is your responsibility — MCA does not configure it for you**
MCA does not create or manage a DMARC record. You must add a DMARC TXT record to your root domain's DNS separately. Without DMARC, your emails may still send but you lose inbox placement protection and cannot enforce `p=reject`. The recommended approach is `p=none` to start monitoring, then escalate to `p=quarantine` and `p=reject`.
- Source: cgc-agency.com dynamic from address post, DMARC best practices sources

---

## MCE Comparison Points

| Feature | MCE (Classic) | MCA (Growth/Advanced) |
|---|---|---|
| Sending domain setup | Requires SAP or Private Domain purchase + Salesforce support ticket | Self-service in Setup UI, no purchase required |
| SAP bundle | Available (Private Domain + Dedicated IP + RMM + Account Branding) | Not applicable as a bundle — features are configured individually |
| Link wrapping/branding | Only with full SAP | Available via tracking domain setup (requires CA-signed cert) |
| Subdomain delegation | Supported — can hand DNS nameservers to Salesforce | NOT supported — self-hosted DNS only |
| SPF record | Separate TXT record added to DNS | Handled via CNAME chain on bounce subdomain (no separate TXT record) |
| DKIM key size | 1024-bit (default); 2048-bit optional | 2048-bit by default |
| Dedicated IP | Available via SAP | Available as of Spring '26; automatic IP warming |
| Landing page domain | CloudPages with custom domain option | Same concept; CDN hosting via Cloudflare (free SSL available) |
| RMM | Part of SAP bundle | Available in Unified Messaging, configurable via From Address and reply CNAME |
| Migration step | Not required | One-time migration required before Authenticated Domains appear in Setup |

**No direct MCE equivalent:** The one-time org migration step (Setup > Unified Messaging > Email > Migration > Transfer) is unique to MCA and has no MCE equivalent. It exists because MCA uses a different email sending architecture than the ExactTarget-based MCE.

**Caution on SAP framing:** Consultants with MCE experience will ask "do we need SAP?" The answer in MCA is: the concept doesn't directly apply. What SAP provided in MCE (authenticated sending domain, RMM, link branding) is available in MCA through self-service setup — but some parts (link branding cert, DMARC) require IT coordination just as they did in MCE.

---

## External Resources

- [Marketing Cloud Next - Authenticating Marketing Cloud Next Emails | Salesforce Help](https://help.salesforce.com/s/articleView?id=004576430&language=en_US&type=1) — The primary official reference for email domain authentication in MCN. Content is JavaScript-rendered and was not directly fetchable, but is confirmed as the canonical source. Learners should read this directly.

- [Domain Settings in Marketing Cloud Next | Salesforce Help](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_domains_ref.htm&language=en_US) — Reference article covering all domain types (sending, tracking, landing page) in MCN. Also JavaScript-rendered; confirm content in a live SDO.

- [Configure a Sender Authentication Package or Private Domain | Salesforce Help](https://help.salesforce.com/s/articleView?id=mktg.configure_sap_and_private_domain.htm&language=en_US&type=5) — Covers SAP and private domain configuration. Likely covers both MCE and MCN contexts. Use carefully — confirm which platform each section applies to.

- [Marketing Cloud Next Email Sending Essentials | Trailhead](https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-email-sending-essentials) — Trailhead module specifically covering authenticated email configuration in MCN. Part of the MCA Consultant certification trail. Includes a unit on domain setup and verification.

- [Prepare for Your Marketing Cloud Next Consultant Certification | Trailhead](https://trailhead.salesforce.com/content/learn/trails/prepare-for-your-marketing-cloud-next-consultant-certification) — Full certification trail. The Email Sending Essentials module within it covers domain authentication.

- [Fix "Authenticated Domains" Setup Not Enabled in Marketing Cloud Next | The Agentic Marketer](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/authenticated-domains-not-enabled/) — Clear explanation of the migration prerequisite step and how to fix the "Authenticated Domains not visible" issue.

- [Marketing Cloud Next: from Zero to First Email | The Agentic Marketer](https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/first-email/) — End-to-end walkthrough of domain authentication, From Address setup, and sending a first email in MCN.

- [How to Setup the Domain Authentication in Marketing Cloud Next | arthurbackouche.com](https://arthurbackouche.com/docs/marketing-cloud-next/email-channel-configuration/how-to-setup-the-domain-authentication-in-marketing-cloud-next/) — Step-by-step domain auth walkthrough for MCN including the UI flow and DNS record instructions.

- [SFMC Tips #140: Marketing Cloud Next - Steps for Email Domain Authentication | Medium](https://medium.com/@marketingcloudtips/marketing-cloud-next-email-authentication-steps-424e9cbbf76d) — Detailed walkthrough with screenshots (blocked via WebFetch but confirmed as a high-quality reference).

- [SFMC Tips #171: Marketing Cloud Next - Setting Domains for Landing Pages | Medium](https://medium.com/@marketingcloudtips/marketing-cloud-next-landing-page-domain-settings-6367a4c1e663) — Covers landing page custom domain configuration in MCN including CDN/Cloudflare option.

- [SFMC Tips #172: Marketing Cloud Next - Setting Domains for Email Tracking Links | Medium](https://medium.com/@marketingcloudtips/marketing-cloud-next-setting-domains-for-email-tracking-links-1195027cb56d) — Covers link branding/tracking domain configuration including the CA-signed certificate requirement.

- [SFMC Tips #163: Marketing Cloud Next - Adding From Addresses & Reply Mail Management | Medium](https://medium.com/@marketingcloudtips/marketing-cloud-next-adding-from-addresses-reply-mail-management-8cc7bd2ce258) — Covers From Address setup and RMM in MCN (blocked via WebFetch but confirmed as reference).

- [Dynamic From and Reply-To Addresses in Salesforce Marketing Cloud | cgc-agency.com](https://www.cgc-agency.com/en/blog/dynamic-from-reply-address-marketing-cloud-next-summer-26-sfmc) — Covers the Summer '26 dynamic From Address feature, DMARC prerequisites, and RMM routing options.

- [Mastering Reply Mail Management in Marketing Cloud Next | The Agentic Marketer](https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/replay-mail-management-rmm/) — Detailed RMM guide for MCN, including DNS record requirement (reply CNAME) and automation options.

- [Sender Authentication Package - Do You Need It? | Salesforce Ben](https://www.salesforceben.com/sender-authentication-package-sap-for-marketing-cloud-do-you-need-it/) — MCE-focused SAP article useful for MCE comparison points.

- [Private Domains in Marketing Cloud | Digital Marketing on Cloud](https://digitalmarketingoncloud.com/deliverability/private-domain-in-salesforce-marketing-cloud/) — Private domain vs SAP comparison (MCE-focused but useful for teaching the concepts).

---

## Data Model Relevance

This module does not directly involve data model configuration. Domain setup operates at the org/infrastructure level and does not interact with DMOs, data streams, identity resolution, or segmentation.

The only indirect connection: the From Address domain must be active before any email can be sent in a Flow or Campaign — which affects all later modules that involve email sending. Domain setup is a prerequisite for the entire email sending capability of the platform.

---

## Source Log

- `https://help.salesforce.com/s/articleView?id=004576430&language=en_US&type=1` — Primary Salesforce Help article for MCN email domain authentication. JavaScript-rendered, content not directly fetchable. Confirmed as canonical reference.
- `https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_domains_ref.htm&language=en_US` — Domain Settings reference article. JavaScript-rendered, content not fetchable.
- `https://help.salesforce.com/s/articleView?id=mktg.configure_sap_and_private_domain.htm&language=en_US&type=5` — SAP/Private Domain config. JavaScript-rendered, content not fetchable.
- `https://help.salesforce.com/s/articleView?id=mc_es_sender_authentication_package.htm&language=en_US&type=5` — SAP article for MCE. JavaScript-rendered, content not fetchable.
- `https://arthurbackouche.com/docs/marketing-cloud-next/email-channel-configuration/how-to-setup-the-domain-authentication-in-marketing-cloud-next/` — Step-by-step MCN domain auth guide. Fetched successfully. Confirmed MCA/MCN content. Used.
- `https://arthurbackouche.com/docs/marketing-cloud-next/foundation-setup/how-to-set-up-marketing-cloud-next/` — MCN setup overview. Fetched. Useful for context but no DNS specifics. Used partially.
- `https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/first-email/` — MCN first email walkthrough. Fetched successfully. Confirmed MCA content. Used.
- `https://the-agentic-marketer.com/marketing-cloud-next-tips-from-the-trenches/authenticated-domains-not-enabled/` — Migration prerequisite fix. Fetched successfully. Confirmed MCA content. Used.
- `https://the-agentic-marketer.com/marketing-cloud-next-deep-dives/replay-mail-management-rmm/` — MCN RMM deep dive. Fetched successfully. Confirmed MCA content. Used.
- `https://www.cgc-agency.com/en/blog/dynamic-from-reply-address-marketing-cloud-next-summer-26-sfmc` — Dynamic From Address (Summer '26). Fetched successfully. Confirmed MCA content. Used.
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-email-authentication-steps-424e9cbbf76d` — SFMC Tips #140 (MCN domain auth). 403 Forbidden. Not fetchable. Confirmed as relevant via search summaries.
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-setting-domains-for-email-tracking-links-1195027cb56d` — SFMC Tips #172 (tracking domain). 403 Forbidden. Not fetchable.
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-landing-page-domain-settings-6367a4c1e663` — SFMC Tips #171 (landing page domain). 403 Forbidden. Not fetchable.
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-adding-from-addresses-reply-mail-management-8cc7bd2ce258` — SFMC Tips #163 (from addresses + RMM). 403 Forbidden. Not fetchable.
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-basic-setup-procedure-for-the-demo-environment-be441f7c37d8` — SFMC Tips #151 (SDO setup). 403 Forbidden. Not fetchable.
- `https://medium.com/@marketingcloudtips/marketing-cloud-next-shared-ip-addresses-and-dedicated-ip-addresses-5237675268e2` — SFMC Tips #291 (shared vs dedicated IP). 403 Forbidden. Content confirmed via search summaries.
- `https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-next-email-sending-essentials/prepare-your-org-for-email-sending` — Trailhead unit on org prep for email. Fetched but content did not include DNS specifics. Used partially.
- `https://trailhead.salesforce.com/content/learn/trails/prepare-for-your-marketing-cloud-next-consultant-certification` — MCN consultant cert trail. Fetched. Module list confirmed. Used.
- `https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-setup-quick-look/know-marketing-cloud` — Setup quick look. Fetched. Minimal domain content. Used partially.
- `https://www.salesforceben.com/sender-authentication-package-sap-for-marketing-cloud-do-you-need-it/` — SAP overview for MCE. Fetched. Used for MCE comparison. MCE content only.
- `https://twistellar.com/blog/sender-authentication-package-marketing-cloud` — SAP guide (MCE-focused). Fetched. Used for MCE comparison.
- `https://digitalmarketingoncloud.com/deliverability/private-domain-in-salesforce-marketing-cloud/` — Private domain guide (MCE-focused). Fetched. Used for MCE comparison.
- `https://digitalmarketingoncloud.com/deliverability/marketing-cloud-dkim-faq/` — DKIM FAQ (MCE-focused). Fetched. Used for DNS record format details (2048-bit key, multi-string TXT).
- `https://www.mavlers.com/blog/sfmc-to-marketing-cloud-next-migration-guide/` — MCE to MCN migration guide. Fetched. Limited domain detail. Used for dedicated IP note.
- `https://thespotforpardot.com/2024/03/18/all-the-faqs-on-marketing-cloud-growth-edition/` — MCG FAQs. JavaScript-rendered, content not fetchable. Confirmed subdomain delegation limitation via search summaries.

---

## Draft Outline Suggestions

Suggested H2 sections for the module markdown file:

1. **Why Domain Setup Comes Before Everything Else** — Domain authentication is a hard prerequisite for email sending in MCA. No authenticated domain = no email. Frame the stakes early.

2. **The Three Domains You Need to Think About** — Overview of the three domain roles: sending/authenticated domain, tracking/link branding domain, landing page domain. Make clear these are different subdomains with different purposes.

3. **If Authenticated Domains Doesn't Appear in Setup** — Troubleshooting callout: if the Authenticated Domains page is missing, run the Unified Messaging migration (Setup > Unified Messaging > Email > Migration > Transfer) and wait up to 24 hours. This is a fallback step, not standard procedure.

4. **Configuring Your Email Sending Domain** — Main walkthrough: adding the subdomain, getting the DNS records, adding them at the registrar, activating. DNS record types explained. Include what each CNAME does (bounce, reply, DKIM, etc.) at a conceptual level.

5. **DNS Records: What to Hand to IT** — Section that frames the DNS records deliverable. What record types, what they do, and what the IT team needs to do. This maps directly to the assignment deliverable (document DNS records for the client's IT team).

6. **DMARC: The Part MCA Doesn't Configure for You** — Brief but important. MCA handles SPF (via CNAME) and DKIM. DMARC is yours to configure. Explain alignment, recommend `p=none` to start.

7. **Adding a From Address** — After domain activation, how to create a From Address. Short section. Include the prerequisite: domain must be fully activated first.

8. **Landing Page Domain** — Walkthrough of the CDN-hosted landing page domain setup. CNAME records, org ID identifier, Cloudflare SSL. Shorter than the sending domain section.

9. **Link Branding Domain** — Walkthrough of tracking domain setup. Highlight the certificate requirement and the IT coordination needed. Flag the 90-day renewal cycle.

10. **Coming from MCE? Here's What Changed** — Callout section placing SAP in context. MCE consultants expect SAP; MCA replaces it with self-service setup. What SAP provided, what MCA provides, what's different.
