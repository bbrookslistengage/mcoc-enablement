# Seed Data Instructions

This content is meant to be incorporated into the Module 1 page at the point where
the learner seeds their org. Copy the sections below into the module markdown.

---

## Seed your org with LEOptical data

Before you can work with real data in MCA, you need records in your CRM. The seed
script creates ~60,000 Contacts, 5 Products, and 3 Campaigns — enough volume to
make segmentation, identity resolution, and consumption exercises feel like a real
engagement.

You do not need to understand Apex to run this. Follow the steps below exactly.

### Step 1: Create the custom fields on Contact

The seed script sets four custom fields on Contact. Create them now, before
deploying the script.

Navigate to **Setup > Object Manager > Contact > Fields & Relationships > New** and
create each field:

| Field Label | API Name | Type | Additional settings |
|---|---|---|---|
| Loyalty Tier | `Loyalty_Tier__c` | Text | Length: 10 |
| Loyalty Points | `Loyalty_Points__c` | Number | Length: 18, Decimal places: 0 |
| Last Exam Date | `Last_Exam_Date__c` | Date | — |
| Next Exam Due | `Next_Exam_Due__c` | Date | — |

:::warning
The seed script will fail to deploy if these fields do not exist. Create all four
before moving to Step 2.
:::

### Step 2: Deploy the batch class

1. In your SDO, navigate to **Setup > Developer Console** and open it.
2. Go to **File > New > Apex Class**.
3. Name the class `LEOpticalSeedBatch` and click **OK**.
4. Delete all placeholder content in the editor.
5. Copy the entire contents of [`LEOpticalSeedBatch.cls`](pathname:///seed-data/LEOpticalSeedBatch.cls) and paste it in.
6. Click **Save** (or press `Ctrl+S` / `Cmd+S`).

You should see no errors in the **Problems** tab at the bottom. If there are compile
errors, confirm the four custom fields from Step 1 exist and are named exactly as
shown.

### Step 3: Run the seed script

1. In Developer Console, go to **Debug > Open Execute Anonymous Window**.
2. Paste the following and click **Execute**:

```apex
Database.executeBatch(new LEOpticalSeedBatch(), 200);
```

That's it. The batch job is now queued. Close the Execute Anonymous Window.

### Step 4: Monitor progress

Navigate to **Setup** and search for **Apex Jobs** in the Quick Find box.

You will see a list of batch jobs. Each row represents one chunk of ~200 contacts.
With ~60,000 contacts total, expect around 300 rows. The **Status** column will
cycle through **Queued**, **Processing**, and **Completed** for each chunk.

:::warning
Do not navigate away or close your browser during the first few minutes. The jobs
run on Salesforce's servers, so you can close the window once you see at least a few
rows showing **Completed** — but it is worth watching for a moment to confirm nothing
is failing.
:::

The full run takes roughly 10–20 minutes depending on platform load. When all rows
show **Completed**, your org is seeded.

### Step 5: Verify the data

Run a quick spot-check to confirm the records landed correctly.

1. Navigate to the **Contacts** tab and confirm the total count is around 60,010.
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
first using Data Loader, then re-run the script.
:::

### Update protagonist email addresses

The 10 protagonist contacts are created with placeholder emails
(`maria.chen.000001@example.com`, etc.) so nothing routes to a real inbox.
Before you reach the email-sending modules, you will update these to your own
email address using `+alias` routing.

Module 4 covers this step in detail. For now, leave the placeholder emails in place.
