// Delete seeded Contact and Lead records from the org.
// Seed data uses @example.com emails exclusively.
// Run each block in Anonymous Apex. Repeat until debug log shows 0 deletions.

// ── Delete Contacts ─────────────────────────────────────────────────────
// Skips portal-linked contacts, case-linked contacts, and Person Accounts.
List<Contact> contactsToDelete = [
    SELECT Id FROM Contact
    WHERE Email LIKE '%@example.com'
    AND Id NOT IN (SELECT ContactId FROM User WHERE ContactId != null)
    AND Id NOT IN (SELECT ContactId FROM Case WHERE ContactId != null)
    AND IsPersonAccount = false
    LIMIT 10000
];
System.debug('Deleting ' + contactsToDelete.size() + ' contacts');
delete contactsToDelete;

// ── Delete Person Accounts ──────────────────────────────────────────────
// Person Account contacts cannot be deleted directly; delete the Account.
List<Account> personAccountsToDelete = [
    SELECT Id FROM Account
    WHERE PersonEmail LIKE '%@example.com'
    AND IsPersonAccount = true
    LIMIT 10000
];
System.debug('Deleting ' + personAccountsToDelete.size() + ' person accounts');
delete personAccountsToDelete;

// ── Delete Leads ────────────────────────────────────────────────────────
List<Lead> leadsToDelete = [
    SELECT Id FROM Lead
    WHERE Email LIKE '%@example.com'
    LIMIT 10000
];
System.debug('Deleting ' + leadsToDelete.size() + ' leads');
delete leadsToDelete;
