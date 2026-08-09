# Seed Page Screenshot Session

## Your Mission

Walk through the LEOptical seed data import in a real Salesforce SDO using Playwright. Take screenshots at every significant UI step. Document exactly what happened. You are NOT writing the course page. You are capturing screenshots and process notes so a separate session can write the page.

Your deliverables:
1. Screenshots saved to `.playwright-mcp/screenshots/`
2. A process manifest written to `.planning/prompts/seed-screenshot-manifest.md`

## Important Rules

- Save ALL screenshots to `.playwright-mcp/screenshots/` with the naming pattern `{NN}-{description}.png`.
- Use the Playwright `browser_take_screenshot` tool for each screenshot. Save to the absolute path `/Users/blakebrooks/Documents/repos/MCA/enablement-course/.playwright-mcp/screenshots/{filename}`.
- After each screenshot, log what you captured in your running notes.
- At the END of the session, write the manifest file (format described at the bottom).
- If something doesn't work as expected, document that too.

## Pre-Session Setup

1. Read `static/seed-data/seed-products-campaigns.apex` so you know the Apex code to paste later.
2. Run `head -2 static/seed-data/contacts.csv` to see the column headers.
3. Open the Playwright browser to `https://login.salesforce.com`.
4. Tell the user: "Browser is open at the Salesforce login page. Please log in and let me know when you're ready."
5. Wait for the user to confirm they are logged in.
6. Resize the browser to 1400x900 for consistent screenshots.
7. Create the screenshot output directory: `mkdir -p .playwright-mcp/screenshots`

## Context

We are importing one CSV file: `contacts.csv` (~48,675 Contacts).
- Every row has `Account Name = "LEOptical Customers"` — the wizard should create ONE Account and link all contacts to it.
- CSV headers use field labels so they auto-map: `Account Name`, `FirstName`, `LastName`, `Email`, `Phone`, `MailingState`, `Loyalty Tier`, `Loyalty Points`, `Last Exam Date`, `Next Exam Due`.
- After importing contacts, we run anonymous Apex for Products and Campaigns.
- That is all. No leads. No batch classes. No protagonist scripts.

## Screenshot Flow

### Part A: Data Import Wizard — Contacts

1. Navigate to Setup (gear icon > Setup).
   - **Screenshot:** Setup home page.

2. In Quick Find, type "Data Import" and click **Data Import Wizard**.
   - **Screenshot:** The Data Import Wizard landing page.

3. Click the launch button (likely **Launch Wizard!**).
   - **Screenshot:** First step ("What kind of data are you importing?").

4. Under Standard Objects, select **Accounts and Contacts**.
   - Select **Add new records**.
   - For **Match Account by**, select **Account Name & Site**.
   - For **Match Contact by**, leave as **--None--**.
   - **Screenshot:** The full configuration with these options selected.
   - **Note:** Document all visible options and exactly what was selected.

5. Scroll down to the **Record type** dropdown. Leave at default.
   - **Screenshot:** The record type area.

6. Upload the CSV. Use the Playwright `browser_file_upload` tool to upload `/Users/blakebrooks/Documents/repos/MCA/enablement-course/static/seed-data/contacts.csv`.
   - **Screenshot:** After upload, showing file name and any preview.
   - **Note:** What did the wizard show after upload?

7. Proceed to the field mapping step.
   - **Screenshot:** The field mapping screen.
   - **Note:** List EVERY column and whether it auto-mapped:
     - `Account Name` — ?
     - `FirstName` — ?
     - `LastName` — ?
     - `Email` — ?
     - `Phone` — ?
     - `MailingState` — ?
     - `Loyalty Tier` — ?
     - `Loyalty Points` — ?
     - `Last Exam Date` — ?
     - `Next Exam Due` — ?

8. If any fields did NOT auto-map, manually map them and screenshot the corrections.

9. Click **Next** / **Start Import**.
   - **Screenshot:** Any review screen.
   - **Screenshot:** The import started/status page.
   - **Note:** How does the user know when the import is done?

### Part B: Verify the Contact Import

10. Wait a few minutes, then check results.
    - **Screenshot:** Import results if the wizard shows them.

11. CRITICAL: Navigate to **Accounts** (App Launcher > Accounts).
    - **Screenshot:** Accounts list.
    - **Note:** How many Account records named "LEOptical Customers" exist? MUST be exactly 1.

12. Navigate to **Contacts** (App Launcher > Contacts). Switch to **All Contacts**.
    - **Screenshot:** Contacts list with total count.
    - **Note:** What count is shown?

### Part C: Products & Campaigns (Anonymous Apex)

13. Open Developer Console: gear icon > **Developer Console**.
    - **Screenshot:** Developer Console open.

14. Go to **Debug > Open Execute Anonymous Window**.
    - **Screenshot:** Execute Anonymous window open.

15. Read `static/seed-data/seed-products-campaigns.apex` and paste its contents into the text area.
    - **Screenshot:** Code pasted in.

16. Check **Open Log**, click **Execute**.
    - **Screenshot:** Log output.
    - **Note:** Success or error?

### Part D: Final Verification

17. Search for a contact to verify custom fields. Try searching "Garcia" or "Smith" in Contacts.
    - **Screenshot:** A contact record showing Loyalty Tier, Loyalty Points, etc.

18. Search for "Maria Chen" specifically.
    - **Screenshot:** Maria Chen's record showing Loyalty Tier = Gold and @example.com email.

19. Navigate to Products (App Launcher > Products).
    - **Screenshot:** Products list showing 5 products.

20. Navigate to Campaigns (App Launcher > Campaigns).
    - **Screenshot:** Campaigns list showing 3 campaigns.

## After All Screenshots: Write the Manifest

Write to `.planning/prompts/seed-screenshot-manifest.md`:

```markdown
# Seed Page Screenshot Manifest

Generated: {date}

## Screenshots Taken

| # | Filename | Description | Notes |
|---|----------|-------------|-------|
| 1 | 01-desc.png | What it shows | Observations |
| ... | ... | ... | ... |

## Process Notes

### Data Import Wizard — Contacts
- Exact flow: screens, options, clicks
- Which fields auto-mapped and which needed manual mapping
- How long the import took (roughly)
- Status/completion screen behavior
- How many Accounts were created (must be exactly 1)
- Total contact count after import

### Products & Campaigns Apex
- Log output
- Any errors

### Verification
- Contact count
- Account count and name
- Custom fields populated on sample contact?
- Maria Chen found with Gold tier?
- 5 Products visible?
- 3 Campaigns visible?

### Gotchas & Warnings
- Anything unexpected
- Fields that did not auto-map
- Warnings for the page writer
```

## Final Step

After writing the manifest, tell the user:

> Screenshots and manifest are done. Go back to your previous Claude Code session and say:
> "Screenshots are done. Read `.planning/prompts/seed-screenshot-manifest.md` and the screenshots in `.playwright-mcp/screenshots/`, then write the updated seeding-your-org.mdx page."
