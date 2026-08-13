# Seed Data Instructions

This content is meant to be incorporated into the Getting Started module page at the point where
the learner seeds their org. Copy the sections below into the module markdown.

---

## Seed your org with LEOptical data

Before you can work with real data in MCA, you need records in your CRM. The seed
script creates ~48,672 Contacts, 5 Products, and 3 Campaigns — enough volume to
make segmentation, identity resolution, and consumption exercises feel like a real
engagement.

You do not need to understand Apex to run this. Follow the steps below exactly.

### Step 1: Run the seed script

1. In your SDO, navigate to **Setup > Developer Console** and open it.
2. Go to **Debug > Open Execute Anonymous Window**.
3. Paste the script from the SeedScript component above and click **Execute**.

That's it. The 10 protagonist contacts are now created. Close the Execute Anonymous Window.

### Step 2: Import contacts via Data Import Wizard

1. In Salesforce, navigate to **Setup > Data Import Wizard** and click **Launch Wizard**.
2. Select **Contacts and Accounts**, then choose **Add new records**.
3. Click **CSV**, then upload `contacts.csv` from the seed data package.
4. Map the columns to the matching Contact fields when prompted.
5. Click **Next**, review the import summary, then click **Start Import**.

The import queues a background job. You can monitor progress under **Setup > Bulk Data Load Jobs**.

### Step 3: Monitor progress

Navigate to **Setup** and search for **Bulk Data Load Jobs** in the Quick Find box.

You will see the import job listed. With ~48,672 contacts total, the job may take
several minutes. The **Status** column will update as the job processes.

:::warning
Do not navigate away or close your browser during the first few minutes. The jobs
run on Salesforce's servers, so you can close the window once you see at least a few
rows showing **Completed** — but it is worth watching for a moment to confirm nothing
is failing.
:::

The full run takes roughly 10–20 minutes depending on platform load. When all rows
show **Completed**, your org is seeded.

### Step 4: Verify the data

Run a quick spot-check to confirm the records landed correctly.

1. Navigate to the **Contacts** tab and confirm the total count is around 48,682.
2. Search for `Maria Chen` — she should exist with `Loyalty Tier: Gold`.
3. Search for `Wei Zhang` — he should exist with `Loyalty Tier: Platinum`.
4. Navigate to the **Products** tab and confirm 5 products exist:
   Visionaire UltraLux, Visionaire ChromaShift, SeeClear DailyFocus,
   SeeClear SunSync, and LEOptical Designer Frames.
5. Navigate to the **Campaigns** tab and confirm 3 campaigns exist.

If any of the protagonist contacts are missing, check the Apex Jobs list for rows
with a **Status** of **Failed**. A failed job means a batch chunk rolled back. The
most common cause is a missing custom field.

:::warning
Run the seed script only once. Running it again will create duplicate contacts.
If something went wrong and you need to start over, delete all Contact records
first using `DeleteSeedData.apex`, then re-run the script.
:::

### Update protagonist email addresses

The 10 protagonist contacts are created with placeholder emails
(`maria.chen.000001@example.com`, etc.) so nothing routes to a real inbox.
Before you reach the email-sending modules, you will update these to your own
email address using `+alias` routing.

The appropriate module covers this step in detail. For now, leave the placeholder emails in place.
