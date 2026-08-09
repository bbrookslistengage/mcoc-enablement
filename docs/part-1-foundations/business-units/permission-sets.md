---
sidebar_position: 3
title: "Permission Sets"
description: "Configure MCA's standard and custom permission sets for the LEOptical marketing team."
---

## Overview

MCA governance is built on Salesforce permission sets. There is no proprietary MCE-style role system. Two standard permission sets ship with MCA.

**Marketing Cloud Admin**
- Access to Salesforce Setup
- Access to Agentforce Admin and Prompt Template Manager
- Full control of campaigns, segments, and flows, including admin-level flows that can touch CRM objects
- Required for data space selection during MCA Basic Settings

**Marketing Cloud Manager**
- Full control of campaigns, segments, and campaign flows (non-admin flows only)
- Access to Agentforce and Prompt Templates
- No access to Salesforce Setup

The practical distinction: Marketing Cloud Manager cannot access Salesforce Setup and cannot run admin-level flows.

:::tip[Coming from MCE?]
The permission model in MCA is simpler in one way and more Salesforce-native in another.

- **MCE uses proprietary role names** (Administrator, Content Creator, Analyst, Channel Manager, Security Administrator, Viewer). These do not exist in MCA.
- **MCA uses Salesforce permission sets**, assigned in Salesforce Setup, not in a Marketing Cloud-specific interface.
- **MCE role conflicts** follow a "Deny overrides Allow" model. MCA follows standard Salesforce permission set stacking rules.
- **BU member roles in MCA** only matter when multiple BUs exist. In MCE, BU-level role assignment is always relevant because the BU hierarchy is always present.
:::

## Assigning a standard permission set

1. Navigate to **Setup > Permission Sets**.
2. Select **Marketing Cloud Admin** or **Marketing Cloud Manager**.
3. Click **Manage Assignments**.
4. {/* VERIFY: Research file navigation path says "Add Assignment" (singular), not "Add Assignments" (plural). Confirm the exact button label in the live Setup UI. */} Click **Add Assignments**.
5. Select the user or users to assign.
6. Set an expiration date or choose **No expiration date**.
7. Click **Assign**.

<Screenshot src="/img/business-units/01-permission-set-assignment.png" alt="Manage Assignment Expiration screen showing a user assigned to a permission set with No expiration date selected" />

The user now has the permission set applied to their account.

## Custom permission sets

When the two standard sets do not match what a team needs, you can build a custom permission set using five permission categories:

1. CMS Content Roles
2. General Marketing Permissions
3. Consent Permissions in Marketing Cloud Next
4. Content and Publishing Permissions
5. Flow Permissions in Marketing Cloud Next

{/* VERIFY: Confirm these are the exact five category names as they appear in the Salesforce Setup UI for MCA permission sets. The names are sourced from arthurbackouche.com (March 2026) but should be checked against the live Setup interface. */}

For the two LEOptical custom personas:

| Persona | Starting Point | Relevant Categories |
|---------|---------------|---------------------|
| Content Creator (CMS + email templates only) | New custom set | CMS Content Roles, Content and Publishing Permissions |
| Campaign Specialist (flows + segments only) | New custom set | General Marketing Permissions, Flow Permissions in Marketing Cloud Next |

The Marketing Manager gets the standard Marketing Cloud Admin set. The Content Creator and Campaign Specialist each need a custom set scoped to their role.

The Salesforce Help article [User Permissions in Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_permissions_ref.htm&type=5) lists every individual permission across all five categories with a description of what each one does. Read it before building custom sets. It is the reference you need to know which checkboxes to enable for each persona.

## Business unit member roles

When multiple business units exist, there is a second layer of access control: business unit member roles. These control which BUs a user can operate in. Only users who already have the Marketing Cloud Admin or Marketing Cloud Manager permission set can be assigned to BU member roles.

For a single-BU org like LEOptical, business unit member roles do not apply. The permission set is the only access control mechanism you need. BU member roles become relevant if LEOptical acquires a second brand and a second BU is created.

## Assignment

> **The client wants:** LEOptical's marketing team has two distinct roles. Content creators should only be able to manage CMS assets and email templates. Campaign specialists should only be able to build flows and manage segments. Neither group should have access to Setup or CRM configuration.

1. In your SDO, assign the **Marketing Cloud Admin** permission set to your user (if not already assigned from the Getting Started module).

2. **(Stretch)** In your SDO, create two custom permission sets for the LEOptical marketing team:
   - A **Content Creator** permission set with access to CMS Content Roles and Content and Publishing Permissions only.
   - A **Campaign Specialist** permission set with access to General Marketing Permissions and Flow Permissions only.

   Read the [User Permissions in Marketing Cloud Next](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_permissions_ref.htm&type=5) reference first. It lists every permission in each category with a description of what it does. Creating these sets without understanding what each checkbox does risks over-permissioning or locking users out of things they need.

## Success Criteria

- [ ] The **Marketing Cloud Admin** permission set is assigned to your user in the SDO.
- [ ] **(Stretch)** A **Content Creator** custom permission set exists in the SDO with CMS and publishing permissions only.
- [ ] **(Stretch)** A **Campaign Specialist** custom permission set exists in the SDO with marketing and flow permissions only.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between the Marketing Cloud Admin and Marketing Cloud Manager permission sets? When would you assign each to a client team member?
- A client's marketing team keeps accidentally editing Salesforce flows that touch CRM objects. Which permission set change would prevent this?
- MCA has five custom permission categories. Which two would you combine for a user whose only job is building email templates in CMS?
