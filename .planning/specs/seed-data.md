# LEOptical — Seed Data Strategy

Seed data is hosted in the course repo under `static/seed-data/` and introduced in layers matching module progression.

## Volume & Email Strategy

**60,000 CRM Contacts** for realistic volume. These are split into two tiers:

1. **~59,990 contacts with fake `@example.com` emails.** The `example.com` domain is IETF-reserved (RFC 2606) — nothing sent there ever delivers anywhere. These contacts exist for volume, segmentation, IDR, and consumption exercises. Emails "sent" to them will honor consent and show as sent in reporting, but won't deliver to a real inbox. Email pattern: `firstname.lastname.{random4}@example.com`

2. **10 "protagonist" contacts with placeholder emails the learner replaces with their own.** These are pre-configured across loyalty tiers and purchase histories so the learner can test personalization for different scenarios and actually receive the emails. The seed script creates them with `YOURNAME+maria@example.com` style placeholders, and Module 1 instructs the learner to update all 10 with their own email address (using `+alias` patterns like `learner+maria@gmail.com` so each arrives in the same inbox but is distinguishable).

**The 10 protagonist contacts:**

| Name | Loyalty Tier | Purchase History | Exam Status | Test Scenario |
|------|-------------|-----------------|-------------|---------------|
| Maria Chen | Gold | SeeClear DailyFocus, SeeClear SunSync | Overdue (14 months ago) | VIP + exam overdue + multi-product |
| James Okafor | Platinum | Visionaire UltraLux | Current (2 months ago) | Top tier + recent exam |
| Sofia Reyes | Bronze | None | Never | New signup, no engagement |
| David Kim | Silver | Visionaire ChromaShift | Overdue (18 months ago) | Lapsed buyer (last purchase 200 days ago) |
| Aisha Patel | Gold | SeeClear DailyFocus | Current (4 months ago) | VIP + single product family |
| Carlos Mendez | Bronze | Visionaire UltraLux | Never | Low tier + one purchase |
| Wei Zhang | Platinum | All 4 products | Current (1 month ago) | Power buyer, all products |
| Fatima Al-Hassan | Silver | SeeClear SunSync | Overdue (13 months ago) | Tier boundary (exactly 25,000 points) |
| Ryan O'Brien | Bronze | None | Current (6 months ago) | Exam patient, no purchases |
| Priya Sharma | Gold | Visionaire ChromaShift, Visionaire UltraLux | Current (3 months ago) | Multi-product Visionaire buyer |

## Module 1 — `seed_crm_data.apex`
- ~60,000 Contacts with diverse, multicultural names
- Distribution: ~40% Bronze, ~30% Silver, ~20% Gold, ~10% Platinum
- Products: the 4 lens families + frames (5 Product records)
- Campaigns: pre-created with IDs learners will reference later (e.g., "Spring Collection 2026", "VisionCare Rewards Launch", "Back to School")
- Loyalty Tier definitions: Bronze (0-24,999 pts), Silver (25,000-49,999), Gold (50,000-74,999), Platinum (75,000+)
- Exam history fields on Contact records (Last_Exam_Date__c, Next_Exam_Due__c)
- Some contacts with multiple email addresses (for IDR testing)
- 10 protagonist contacts with known, documented data (see table above)
- **No Opportunities** — all purchase history comes from the ecommerce CSV (mapped to Sales Order / Sales Order Product in Module 6)

> The Apex script is self-contained — all data is hardcoded/generated in the script. No CSV dependency.

## Modules 6-8 — CSV Data Streams
- `loyalty_members.csv` — ~40,000 VisionCare Rewards members (not everyone is in the loyalty program). Uses loyalty IDs and sometimes different email addresses than CRM — sets up the IDR exercise in Module 9
- `ecommerce_orders.csv` — ~100,000 online orders (some customers have multiple purchases). Uses order emails that may differ from CRM emails
- `exam_history.csv` — eye exam records (patient email, exam date, next exam due)

## Later Modules — Simulation CSVs
- `new_signups_july.csv` — ~50 new loyalty members to test welcome flows and consent automation
- `new_orders_july.csv` — ~100 recent purchases to trigger post-purchase flows
- `new_contacts_batch1.csv` — ~20 new Contacts/Leads for consent flow stress testing

---

## Dirty Data Strategy

The seed data intentionally includes realistic data quality problems. These are NOT called out to the learner upfront — they discover them as they work through modules, just like on a real engagement.

### Category 1: Identity & Matching Problems (surfaces in Module 9 — IDR)

| Problem | How It Appears | Real-World Parallel |
|---------|---------------|---------------------|
| Different emails, same person | CRM has `maria.chen@work.example.com`, loyalty CSV has `m.chen@personal.example.com`, ecommerce has `maria.chen@other.example.com` | Every multi-source client (Agios, Cepheid, Avnet) |
| Same email, different people | Two different loyalty members share a family email (`thekims@example.com`) | Shared household emails — common in B2C |
| Name variations | "James Okafor" in CRM, "Jim Okafor" in loyalty, "J. Okafor" in ecommerce | Nickname/abbreviation mismatches |
| Typos in email | `sofia.reyez@example.com` vs `sofia.reyes@example.com` — one character off | Data entry errors |
| Duplicate CRM records | 2-3 Contacts that are clearly the same person created twice (same name, slightly different data) | CRM hygiene issues every client has |
| Case inconsistency | `John.Smith@Example.com` vs `john.smith@example.com` | Systems that don't normalize case |

### Category 2: Data Quality Problems (surfaces in Modules 6-8 — Data Model & Graphs)

| Problem | How It Appears | Real-World Parallel |
|---------|---------------|---------------------|
| Missing required fields | ~5% of loyalty CSV records have no email address. Some CRM contacts have no last name | Incomplete data from legacy systems |
| Inconsistent date formats | CRM dates are `YYYY-MM-DD`, ecommerce CSV has `MM/DD/YYYY`, loyalty CSV has `DD-Mon-YYYY` | Every CSV import ever |
| Stale data | ~500 loyalty members with tier "Gold" in CSV but their points are below the Gold threshold (downgraded but CSV wasn't updated) | Snapshot vs. real-time data lag |
| Orphaned records | Ecommerce orders referencing product SKUs that don't exist in the Product table | System migrations, retired products |
| Phone number formats | Mix of `(555) 123-4567`, `555-123-4567`, `5551234567`, `+15551234567` | No standardization across sources |
| Null vs. empty vs. "N/A" | Some fields have null, some have empty string, some have literal "N/A" or "none" or "n/a" | Every legacy data migration |

### Category 3: Consent & Compliance Problems (surfaces in Modules 4-5)

| Problem | How It Appears | Real-World Parallel |
|---------|---------------|---------------------|
| No consent records | 60K contacts, zero consent records — learner must build the automation to create them | MCA's explicit consent requirement |
| Contradictory consent signals | A few loyalty CSV records have `email_optin=true` but also `unsubscribed_date` populated | Conflicting source-of-truth |
| Consent without contact point | Some Individuals get consent records but their Contact Point Email hasn't been created yet (timing issue) | Data stream refresh ordering |

### Category 4: Segmentation Edge Cases (surfaces in Module 10)

| Problem | How It Appears | Real-World Parallel |
|---------|---------------|---------------------|
| Tier boundary cases | Members with exactly 25,000, 50,000, or 75,000 points — are they in the old tier or new tier? | Off-by-one in segment filters |
| "Lapsed" ambiguity | Customer's last purchase was exactly 180 days ago — does "no purchase in 180 days" include or exclude today? | Inclusive vs. exclusive date logic |
| Multi-product purchasers | Customers who bought both SeeClear AND Visionaire — they appear in both product segments | Segment overlap awareness |

### How Dirty Data Surfaces

The dirt is NOT called out upfront. Learners discover it naturally:

- **Module 6 (Data Ingestion):** CSVs just have the problems in them. When learners ingest and check record counts, numbers won't match expectations. The lesson includes: *"If your record counts don't match what you expected, welcome to real consulting. Investigate why."*
- **Module 8 (Data Graphs):** Orphaned orders with missing product references cause relationship gaps. Assignment asks: *"Are there any records that don't connect to the graph? Why might that happen?"*
- **Module 9 (IDR):** Identity problems hit hardest here. False positives (shared email merged two different people) and false negatives (typo email prevented a match). Lesson asks: *"How many unified profiles do you have? Is that number higher or lower than you expected?"*
- **Module 10 (Segmentation):** Boundary cases and overlap surface during spot-checks. *"Check the members at tier boundaries. Are they in the segment you expected?"*
- **Module 11 (Consumption):** Dirty data inflates consumption — duplicates, unresolved identities, orphaned data all consume credits. Assignment asks learners to estimate consumption savings from cleanup
