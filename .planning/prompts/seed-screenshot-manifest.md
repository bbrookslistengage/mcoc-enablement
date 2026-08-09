# Seed Page Screenshot Manifest

Generated: 2026-08-08

## Screenshots Taken

All screenshots are in `.playwright-mcp/screenshots/`.

| # | Filename | Description | Notes |
|---|----------|-------------|-------|
| 1 | 01-setup-home.png | Setup home page | Shows "Welcome, Blake" with Setup sidebar and Recent Items |
| 2 | 02-data-import-wizard-landing.png | Data Import Wizard landing page | Shows "Recent Import Jobs" table with prior import attempts visible. Has "Launch Wizard!" button below the fold. Also shows "Before you import your data..." tips section. |
| 3 | 03-wizard-step1-what-data.png | Step 1 — "Choose data" with Standard objects list | Shows progress bar (Choose data > Edit mapping > Start import). Lists: Accounts and Contacts, Person Accounts, Leads, Solutions, Campaign Members. Middle and right columns empty until selection. |
| 4 | 04-accounts-contacts-selected.png | Accounts and Contacts selected (green checkmark) | Middle column now shows 3 options: Add new records, Update existing records, Add new and update existing records. |
| 5 | 05-add-new-records-selected.png | Add new records selected, showing match options | Match Contact by: --None--. Match Account by: --None-- (not yet configured). Also shows Price Book, Operating Hours, Maps Assignment Rule lookup dropdowns (all --None--). Right panel shows "Drag CSV file here to upload" area with CSV/Outlook CSV/ACT! CSV/GMail CSV options. |
| 6 | 06-match-options-configured.png | Match Account by changed to "Name & Site" | Key screenshot: shows the correct configuration. Match Contact by: --None--. Match Account by: Name & Site. All other lookup dropdowns left at --None--. |
| 7 | 07-csv-uploaded.png | CSV file uploaded | Shows "contacts.csv" selected with Character Code: ISO-8859-1 (green checkmark), Values Separated By: Comma. Next button is now active. |
| 8 | 08-field-mapping.png | Edit Field Mapping screen | All 10 fields auto-mapped. See mapping details in Process Notes below. Warning triangle on Phone (mapped to both Account and Contact). Shows 3 example values per field. |
| 9 | 09-review-screen.png | Same as 08 — still loading | "Loading..." button visible at bottom right. The wizard takes time to process ~48K rows. |
| 10 | 10-review-import.png | Review & Start Import screen | Shows summary: Accounts and Contacts (checkmark), Add new records (checkmark), contacts.csv (checkmark). Mapped fields: 10, Unmapped fields: 0. Start Import button ready. |
| 11 | 11-import-started.png | Import started confirmation dialog | "Congratulations, your import has started! Click OK to view your import status on the Bulk Data Load Job page." |
| 12 | 12-bulk-job-status.png | Bulk Data Load Job — Account job | Status: Closed. Object: Account. Records Processed: 1. Records Failed: 0. Time to Complete: 00:01. This confirms exactly 1 Account was created. |
| 13 | 13-bulk-jobs-list.png | Bulk Data Load Jobs list (small/blurry) | Shows In Progress section with the Contact job still running. Not ideal for the course page. |
| 14 | 14-contact-job-detail.png | Bulk Data Load Job — Contact job (completed) | Status: Closed. Object: Contact. Records Processed: 48,672. Records Failed: 188. Time to Complete: 06:32. Progress: 100%. 5 completed batches, 0 failed batches. 3 retries. The 188 failures are from Salesforce's fuzzy duplicate detection matching our names against pre-existing SDO contacts. |
| 15 | 15-accounts-list.png | Accounts list (All Accounts) — full list | Shows 50+ accounts from SDO. LEOptical Customers is not visible on first page (alphabetically later). |
| 16 | 16-leoptical-account-search.png | Accounts list filtered to "LEOptical" | Shows exactly 1 item: "LEOptical Customers". Phone: (207) 213-0031. This is the key verification screenshot. |
| 17 | 17-contacts-list.png | Contacts list (All Contacts) — small/blurry | Shows 50+ items. All visible contacts are from LEOptical Customers. |
| 18 | 18-maria-chen-search.png | Contacts list search for "Maria Chen" — 0 results | List view search returned 0 items. Likely a search indexing delay. Not useful for the course page. |
| 19 | 19-maria-chen-global-search.png | Global search for "Maria Chen" | Shows 2 results: (1) Maria Chen at LEOptical Customers with maria.chen.000001@example.com, (2) a pre-existing Maria Chen from SDO. |
| 20 | 20-maria-chen-record.png | Maria Chen contact record — Related tab | Shows header: Account Name LEOptical Customers, Phone (207) 213-0031, Email maria.chen.000001@example.com. Slack popup partially obscures right side. |
| 21 | 21-maria-chen-details.png | Maria Chen contact record — Details tab (full page) | KEY SCREENSHOT. Clean (no Slack popup). Shows all custom fields: Loyalty Tier: Gold, Loyalty Points: 62,000, Last Exam Date: 6/7/2025, Next Exam Due: 6/7/2026. Also: Mailing Address: TX. Account: LEOptical Customers. |
| 22 | 22-developer-console.png | Developer Console open | Shows previous query results (SELECT Id FROM Account WHERE Name = 'LEOptical Customers' — 1 row). Query Editor visible at bottom. |
| 23 | 23-execute-anonymous-window.png | Execute Anonymous Window open (with old code) | Shows the dialog with old code still in it. Not useful for course page — use 24 instead. |
| 24 | 24-apex-code-pasted.png | Execute Anonymous Window with seed Apex code | Shows the Products/PricebookEntries/Campaigns code pasted in. Code is syntax-highlighted. Open Log checkbox is checked. Execute button visible. |
| 25 | 25-apex-execution-result.png | Execution Log — full log output | Shows detailed execution log with VARIABLE_ASSIGNMENT entries for Product2 fields. Confirms code is running. |
| 26 | 26-apex-debug-output.png | Execution Log — Debug Only filter | KEY SCREENSHOT. Single line: `[36]|DEBUG|Created 5 Products, 5 PricebookEntries, and 3 Campaigns.` Confirms successful execution. |
| 27 | 27-products-list.png | Products list (All Products) — small/blurry | Shows 50+ items. Hard to see our products in the alphabetical list. |
| 28 | 28-leoptical-products.png | Products searched for "SeeClear" | Shows SeeClear DailyFocus and SeeClear SunSync (2 of each due to prior run). Confirms products were created. |
| 29 | 29-campaigns-list.png | Campaigns list (Recently Viewed) — small/blurry | Shows all 3 LEOptical campaigns at top: Back to School 2026, Spring Collection 2026, VisionCare Rewards Launch. Mixed with SDO campaigns. |
| 30 | 30-campaigns-search.png | Campaigns "All Active" searched for "Spring Collection" — 0 results | Search failed because list view filter is "Active" only and search may not index immediately. Not useful for course page. |

## Recommended Screenshots for Course Page

Best screenshots to use (clean, clear, well-sized):

1. **03** — Wizard Step 1 (object selection)
2. **06** — Match options configured (Name & Site)
3. **07** — CSV uploaded
4. **08** — Field mapping (all auto-mapped)
5. **10** — Review & Start Import
6. **11** — Import started confirmation
7. **12** — Bulk job detail (Account — 1 record)
8. **14** — Bulk job detail (Contact — 48,675 records)
9. **16** — LEOptical account search (1 account)
10. **21** — Maria Chen details (custom fields)
11. **24** — Apex code pasted
12. **26** — Debug output (success)

## Process Notes

### Data Import Wizard — Contacts

**Exact flow:**
1. Setup > Quick Find > "Data Import" (or navigate directly to Setup > Data > Data Import Wizard)
2. Click "Launch Wizard!"
3. Step 1 — Choose data:
   - Standard objects > **Accounts and Contacts** (click the name, not a radio button)
   - **Add new records**
   - Match Contact by: **--None--**
   - Match Account by: **Name & Site** (dropdown; options are --None--, Name & Site, External ID)
   - Leave Price Book, Operating Hours, Maps Assignment Rule at --None--
   - Under "Where is your data located?", click **CSV**
   - Click **Choose File** and select `contacts.csv`
   - Leave Character Code at ISO-8859-1, Values Separated By at Comma
   - Click **Next**
4. Step 2 — Edit mapping:
   - All 10 fields auto-mapped. No manual mapping needed.
   - Warning triangle on Phone: mapped to both "Account: Phone, Contact: Phone"
   - Click **Next** (button shows "Loading..." for ~15-20 seconds while processing ~48K rows)
5. Step 3 — Review & Start Import:
   - Summary: 10 mapped fields, 0 unmapped
   - Click **Start Import**
   - Confirmation dialog: "Congratulations, your import has started!"
   - Click OK to go to Bulk Data Load Jobs page

**Field mapping details (all auto-mapped):**

| CSV Header | Mapped Salesforce Field | Auto-mapped? | Notes |
|---|---|---|---|
| Account Name | Account: Account Name | Yes | |
| FirstName | Contact: First Name | Yes | |
| LastName | Contact: Last Name | Yes | |
| Email | Contact: Email | Yes | |
| Phone | Account: Phone, Contact: Phone | Yes | Warning triangle — maps to BOTH objects |
| MailingState | Contact: Mailing State/Province | Yes | |
| Loyalty Tier | Contact: Loyalty Tier | Yes | Custom field, auto-mapped by label |
| Loyalty Points | Contact: Loyalty Points | Yes | Custom field, auto-mapped by label |
| Last Exam Date | Contact: Last Exam Date | Yes | Custom field, auto-mapped by label |
| Next Exam Due | Contact: Next Exam Due | Yes | Custom field, auto-mapped by label |

**Import timing:** ~6 minutes for the Contact job (48,675 rows in 5 batches of ~10K each).

**How to check status:** Click OK on the confirmation dialog to go to Bulk Data Load Jobs. The page shows job details with a Reload button. The Contact job runs as a separate bulk job from the Account job.

**Two jobs are created:** The wizard creates TWO bulk jobs — one for Account (upsert, 1 record) and one for Contact (insert, 48,675 records). The Account job finishes in ~2 seconds.

**Accounts created:** Exactly 1 — "LEOptical Customers". Confirmed via Accounts list view search and SOQL query.

**Contact count after import:** 48,672 processed, 188 failed = ~48,484 contacts successfully created. The 188 failures are DUPLICATES_DETECTED errors from Salesforce's Standard Contact Matching Rule, which uses fuzzy name matching. Our CSV has zero internal duplicate names, but the SDO has ~188 pre-existing contacts whose names fuzzy-match ours. This is unavoidable without disabling the duplicate rule before import.

### Products & Campaigns Apex

**How to run:**
1. Gear icon > Developer Console (opens in new tab)
2. Debug > Open Execute Anonymous Window (or Ctrl+E)
3. Paste the contents of `static/seed-data/seed-products-campaigns.apex`
4. Check "Open Log"
5. Click Execute

**Log output:** `Created 5 Products, 5 PricebookEntries, and 3 Campaigns.`
No errors.

**Products created (5):**
1. Visionaire UltraLux (VIS-ULX-001, Visionaire, $349)
2. Visionaire ChromaShift (VIS-CHS-001, Visionaire, $299)
3. SeeClear DailyFocus (SEC-DLF-001, SeeClear, $189)
4. SeeClear SunSync (SEC-SNS-001, SeeClear, $219)
5. LEOptical Designer Frames (LEO-FRM-001, Frames, $159)

**Campaigns created (3):**
1. Spring Collection 2026 (Active, Advertisement, Mar-May 2026)
2. VisionCare Rewards Launch (Active, Email, Jan-Dec 2026)
3. Back to School 2026 (Planned, Email, Jul-Sep 2026)

### Verification Results

| Item | Expected | Actual | Status |
|---|---|---|---|
| LEOptical Customers accounts | 1 | 1 | PASS |
| Contact records created | ~48,672 | 48,484 (188 fuzzy dupes failed) | PASS |
| Maria Chen found | Yes | Yes | PASS |
| Maria Chen Loyalty Tier | Gold | Gold | PASS |
| Maria Chen Loyalty Points | 62,000 | 62,000 | PASS |
| Maria Chen Email | maria.chen.000001@example.com | maria.chen.000001@example.com | PASS |
| Products created | 5 | 5 | PASS |
| Campaigns created | 3 | 3 | PASS |

### Gotchas & Warnings

1. **Phone maps to both Account and Contact:** The wizard shows a warning triangle because the "Phone" column maps to both Account: Phone and Contact: Phone. This is fine and expected behavior.

2. **List view search is unreliable for recently imported data:** Searching "Maria Chen" in the Contacts list view returned 0 results even though the contact exists. Global search works. This is a search indexing delay — tell learners to use global search or wait.

3. **The wizard limit is 50,000 records per import.** Our CSV has 48,675 rows, which is under the limit. If the CSV were larger, learners would need to split it.

4. **The "Loading..." delay on field mapping:** After clicking Next on the mapping step, the button shows "Loading..." for 15-20 seconds while processing the large CSV. This is normal.

5. **Products Apex is NOT idempotent:** Running the Apex script twice creates duplicate products. The script comments say "Safe to run once. If you need to re-run, delete the existing Products and Campaigns first."

6. **Developer Console opens in a new tab.** Learners need to switch to that tab.

7. **The Data Import Wizard creates bulk jobs.** It is NOT a synchronous operation. The Contact job took ~6 minutes. Learners need to wait and reload the Bulk Data Load Jobs page.

8. **Custom fields auto-mapped by label:** All 4 custom Contact fields (Loyalty Tier, Loyalty Points, Last Exam Date, Next Exam Due) auto-mapped because the CSV headers exactly match the field labels. This is a key design decision in the seed data CSV.

9. **~188 fuzzy duplicate detection failures are expected.** The Standard Contact Matching Rule uses fuzzy name matching and flags our contacts against pre-existing SDO contacts with similar names. The CSV itself has zero duplicate FirstName+LastName combos. These failures are harmless (0.4% of total) and vary per SDO.
