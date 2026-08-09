---
sidebar_position: 2
title: "Seeding Your Org"
description: "Load LEOptical's course data into your SDO: custom fields, ~49,000 contacts, products, and campaigns."
---

## Overview

Before you can do anything meaningful in MCA, you need data. This page walks you through loading LEOptical's fictional customer data into your SDO. By the end, your org will have:

- 4 custom fields on the Contact object that the course uses throughout
- ~48,672 contacts with realistic names, loyalty tiers, and exam history
- 5 Products and 3 Campaigns

The contacts include 10 "protagonist" contacts that you will use to receive test emails later in the course. For now, all contacts (including protagonists) use `@example.com` placeholder emails. You will update the protagonist emails with your own address in <ModuleLink slug="consent-configuration" /> when you set up consent.

The import uses the browser-based Data Import Wizard, which handles up to 50,000 records per import. No external tools are required. The total active work is about 15 minutes, plus a 5-10 minute wait while the contacts import processes in the background.

**Do each step in order.** The custom fields must exist before you import contacts, because the CSV references those fields.

:::info
All contact emails use the `@example.com` domain, which is IETF-reserved (RFC 2606). Nothing sent to these addresses ever delivers to a real inbox. Emails "sent" to them will honor consent and appear in reporting, but will not reach anyone.
:::

---

## Step 1: Create the custom fields on Contact

The seed data includes four custom fields on the Contact object. The Data Import Wizard cannot map to fields that do not exist, so you need to create them first.

You will create each field through the Object Manager in Setup. This takes about 5 minutes.

1. Click the **gear icon** in the top-right corner of your org and select **Setup**.

2. In the Quick Find box at the top of the left sidebar, type `Object Manager` and click it when it appears.

3. In the Object Manager list, find and click **Contact**.

4. In the left sidebar of the Contact object page, click **Fields & Relationships**.

5. Click **New** in the top-right corner.

Now create each of the four fields below. For each one, you will go through the same wizard: choose the field type, fill in the details, and save. After saving each field, click **New** again to start the next one.

---

### Field 1: Loyalty Tier

6. On the "Choose a field type" screen, select **Text** and click **Next**.
7. Fill in the details:
   - **Field Label:** `Loyalty Tier`
   - **Length:** `10`
   - Leave everything else at the default.
8. Click **Next**, then **Next** again, then **Save & New** to save and immediately start the next field.

---

### Field 2: Loyalty Points

9. On the "Choose a field type" screen, select **Number** and click **Next**.
10. Fill in the details:
    - **Field Label:** `Loyalty Points`
    - **Length:** `18`
    - **Decimal Places:** `0`
    - Leave everything else at the default.
11. Click **Next**, then **Next** again, then **Save & New**.

---

### Field 3: Last Exam Date

12. On the "Choose a field type" screen, select **Date** and click **Next**.
13. Fill in the details:
    - **Field Label:** `Last Exam Date`
    - Leave everything else at the default.
14. Click **Next**, then **Next** again, then **Save & New**.

---

### Field 4: Next Exam Due

15. On the "Choose a field type" screen, select **Date** and click **Next**.
16. Fill in the details:
    - **Field Label:** `Next Exam Due`
    - Leave everything else at the default.
17. Click **Next**, then **Next** again, then **Save** (not Save & New, this is the last field).

:::warning
The field API names are auto-generated from the labels. Confirm they match exactly before moving on:
- `Loyalty_Tier__c`
- `Loyalty_Points__c`
- `Last_Exam_Date__c`
- `Next_Exam_Due__c`

You can see the API name in the field list next to the label. If there is a mismatch, the Data Import Wizard will not map the CSV columns to the correct fields.
:::

---

## Step 2: Import contacts

Now you will import ~48,672 contacts using the Data Import Wizard. This is a browser-based tool built into Salesforce Setup. No external software is needed.

### Download the CSV

1. Download the contacts file: [contacts.csv](pathname:///seed-data/contacts.csv)

   This file contains ~48,672 rows. Every contact has a first name, last name, email, phone, mailing state, loyalty tier, loyalty points, and exam dates. All contacts are associated with a single shared Account called "LEOptical Customers".

:::info
In a production B2C engagement, you would likely use Person Accounts rather than a shared Business Account. This course uses a shared Account because Person Account configuration varies across SDOs and the Account model is not relevant to MCA. The Marketing Data Kit ingests Contacts into Individual DMOs regardless of Account structure.
:::

### Open the Data Import Wizard

2. In Setup, type `Data Import` in the Quick Find box and click **Data Import Wizard**.

3. On the Data Import Wizard landing page, click **Launch Wizard**.

<Screenshot src="/img/getting-started/seed-01-wizard-object-selection.png" alt="Data Import Wizard Step 1 showing Standard objects list with Accounts and Contacts, Person Accounts, Leads, Solutions, and Campaign Members" />

### Configure the import

4. Under **Standard objects**, click **Accounts and Contacts**.

5. Select **Add new records**.

6. Set **Match Account by** to **Name & Site**. This tells the wizard to check for an existing Account with the same name before creating a new one. Since every row in the CSV has the same Account Name ("LEOptical Customers"), the wizard creates one Account and links all contacts to it.

7. Leave **Match Contact by** at **--None--**.

8. Leave all other dropdown fields (Price Book, Operating Hours, etc.) at **--None--**.

<Screenshot src="/img/getting-started/seed-02-match-options.png" alt="Data Import Wizard configuration showing Add new records selected, Match Account by set to Name and Site" />

### Upload the CSV

9. Under **Where is your data located?**, click **CSV**.

10. Click **Choose File** (or drag the file) and select the `contacts.csv` file you downloaded.

11. Leave **Character Code** at `ISO-8859-1` and **Values Separated By** at `Comma`.

<Screenshot src="/img/getting-started/seed-03-csv-uploaded.png" alt="CSV file uploaded showing contacts.csv selected with ISO-8859-1 encoding" />

12. Click **Next**.

### Verify field mapping

The wizard auto-maps CSV columns to Salesforce fields based on the column headers. All 10 fields should map automatically, including the four custom fields you just created.

<Screenshot src="/img/getting-started/seed-04-field-mapping.png" alt="Edit Field Mapping screen showing all 10 fields auto-mapped with sample values" />

You will see a warning triangle on the **Phone** field. This is normal. The wizard maps Phone to both the Account and the Contact, which is fine.

If any field shows as unmapped, click on it and search for the matching field label. The custom fields will appear as "Contact: Loyalty Tier", "Contact: Loyalty Points", etc.

13. Click **Next**. The button may show **Loading...** for 15-20 seconds while the wizard processes ~49,000 rows. This is normal.

### Start the import

<Screenshot src="/img/getting-started/seed-05-review-import.png" alt="Review and Start Import screen showing 10 mapped fields, 0 unmapped fields" />

14. Review the summary: 10 mapped fields, 0 unmapped fields. Click **Start Import**.

15. A confirmation dialog appears. Click **OK** to go to the Bulk Data Load Jobs page.

<Screenshot src="/img/getting-started/seed-06-import-started.png" alt="Import started confirmation dialog" />

### Monitor the import

The wizard creates two bulk jobs: one for the Account (finishes in seconds) and one for the Contacts (takes 5-10 minutes).

<Screenshot src="/img/getting-started/seed-07-account-job.png" alt="Bulk Data Load Job detail for Account showing 1 record processed, 0 failed" />

The Account job shows **Records Processed: 1, Records Failed: 0**. One Account called "LEOptical Customers" was created.

Click **Back to List: Bulk Data Load Jobs** and then click the Contact job to see its progress. Click **Reload** to refresh the status. Wait until it shows **Status: Closed** and **Progress: 100%**.

<Screenshot src="/img/getting-started/seed-08-contact-job.png" alt="Bulk Data Load Job detail for Contact showing records processed and progress at 100 percent" />

:::warning
You may see a small number of failed records (typically under 200). This is caused by Salesforce's built-in duplicate detection rules, which use fuzzy name matching. If any of your imported contact names are similar to pre-existing demo contacts in your SDO, the duplicate rule flags them. This is expected and does not affect the course. The vast majority of records will import successfully.
:::

---

## Step 3: Create products and campaigns

The five LEOptical products and three campaigns are created via a short anonymous Apex script. This runs instantly.

1. Download the Apex script: [seed-products-campaigns.apex](pathname:///seed-data/seed-products-campaigns.apex)

2. Open the downloaded file in any text editor and copy all of its contents.

3. In your org, click the **gear icon** and select **Developer Console**. It opens in a new browser tab.

4. In the Developer Console menu bar, go to **Debug > Open Execute Anonymous Window** (or press **Ctrl+E** / **Cmd+E**).

5. Delete any existing code in the text area, then paste the script you copied.

<Screenshot src="/img/getting-started/seed-11-apex-code.png" alt="Execute Anonymous Window with the products and campaigns Apex code pasted in" />

6. Check the **Open Log** checkbox, then click **Execute**.

7. A log window opens. Click the **Debug Only** checkbox at the bottom to filter the log. You should see a single line confirming the script ran:

<Screenshot src="/img/getting-started/seed-12-apex-result.png" alt="Execution log showing Debug Only filter with confirmation that 5 Products, 5 PricebookEntries, and 3 Campaigns were created" />

:::warning
Run this script only once. Running it again will create duplicate Products and Campaigns. If you need to re-run it, delete the existing Products and Campaigns first.
:::

---

## Step 4: Verify the data

Once the contact import has finished and the Apex script has run, do a quick check to confirm everything landed correctly.

### Check the Account

1. In the App Launcher (the grid of dots in the top-left), search for **Accounts** and open it.
2. In the list view search box, type `LEOptical`. You should see exactly one Account: **LEOptical Customers**.

<Screenshot src="/img/getting-started/seed-09-leoptical-account.png" alt="Accounts list filtered to LEOptical showing exactly one result" />

### Check a protagonist contact

3. Use the global search bar at the top of the page (not the list view search) and search for `Maria Chen`.
4. Open her Contact record and click the **Details** tab. Confirm:
   - **Account Name** is LEOptical Customers
   - **Email** is `maria.chen.000001@example.com`
   - **Loyalty Tier** is `Gold`
   - **Loyalty Points** is `62,000`
   - **Last Exam Date** and **Next Exam Due** are populated

<Screenshot src="/img/getting-started/seed-10-maria-chen.png" alt="Maria Chen contact record Details tab showing Loyalty Tier Gold, Loyalty Points 62000, and exam dates populated" />

:::tip
List view search may not find recently imported contacts due to search indexing delays. Use the global search bar at the top of the page instead.
:::

### Check products and campaigns

5. In the App Launcher, search for **Products** and open it. Confirm 5 products are present:
   - Visionaire UltraLux
   - Visionaire ChromaShift
   - SeeClear DailyFocus
   - SeeClear SunSync
   - LEOptical Designer Frames

6. In the App Launcher, search for **Campaigns** and open it. Confirm 3 campaigns are present:
   - Spring Collection 2026
   - VisionCare Rewards Launch
   - Back to School 2026

---

## What about the 10 test contacts?

The 10 protagonist contacts (Maria Chen, James Okafor, Sofia Reyes, and 7 others) are already in your org from the CSV import. Right now they have `@example.com` placeholder emails, just like the other ~48,000 contacts.

In <ModuleLink slug="consent-configuration" />, you will update these 10 contacts with your own email address using `+alias` patterns (e.g., `yourname+mariac@gmail.com`). This is when you start receiving test emails. The update adds a second Contact Point Email in Data 360 while preserving the original `@example.com` email, which keeps their ecommerce orders and loyalty records linked through identity resolution.

There is nothing to do with the protagonist contacts right now. You will come back to them in <ModuleLink slug="consent-configuration" />.

---

## Assignment

1. Create all four custom fields on the Contact object exactly as described in Step 1.
2. Download `contacts.csv` and import it via the Data Import Wizard.
3. Run the Products and Campaigns anonymous Apex script in Developer Console.
4. Verify: ~48,672 contacts, 1 "LEOptical Customers" Account, 5 Products, 3 Campaigns.

## Success Criteria

- [ ] All four custom fields exist on the Contact object with the correct API names (`Loyalty_Tier__c`, `Loyalty_Points__c`, `Last_Exam_Date__c`, `Next_Exam_Due__c`).
- [ ] ~48,672 Contacts are visible in the org (the exact count depends on duplicate rule behavior in your SDO).
- [ ] Exactly 1 Account named "LEOptical Customers" exists.
- [ ] Maria Chen exists as a Contact with Loyalty Tier = Gold and Loyalty Points = 62,000.
- [ ] 5 Products and 3 Campaigns are present in the org.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you cannot answer a question, revisit the relevant section.

- The ~48,000 contacts use `@example.com` email addresses. Why is that domain safe to use for email sends throughout the course?
- Why does the Data Import Wizard create two separate bulk jobs (one for Account, one for Contact) from a single CSV?
- What does "Match Account by: Name & Site" do, and why did we set it?
- The CSV includes custom field columns like "Loyalty Tier" instead of the API name "Loyalty_Tier__c". Why does the Data Import Wizard still map them correctly?
- If you accidentally ran the Products and Campaigns Apex script twice, what would happen, and how would you fix it?
