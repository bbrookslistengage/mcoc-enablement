---
sidebar_position: 4
title: "CMS Workspaces"
description: "Create an Enhanced CMS Workspace for LEOptical and configure contributor roles for the marketing team."
---

## Overview

MCA uses Enhanced CMS Workspaces as the content library for marketing assets: email templates, images, content blocks, and other reusable brand materials. These workspaces are native Salesforce objects built on Salesforce CMS, not a Marketing Cloud-specific content repository.

A CMS workspace:
- Serves as the content library for campaign assets
- Can be designated as the default workspace for a business unit
- Has its own contributor role system, separate from MCA permission sets
- Can share content with other business units via a shared assets folder (Summer '26)

## CMS workspace contributor roles

The workspace-level roles are distinct from the org-level permission sets. A user's MCA permission set controls what they can do in campaigns and flows. Their CMS contributor role controls what they can do inside a specific workspace.

| Role | What they can do |
|------|-----------------|
| **Content Admin** | Manage users and sharing settings, create and publish all content, assign a default brand to the workspace |
| **Content Manager** | Create and publish all content, assign a default brand to the workspace |
| **Content Author** | View, edit, and create content. Cannot publish. |

A Salesforce org admin has full access across all workspaces through the Setup interface, regardless of workspace-level role assignment.

## Creating a CMS workspace

These steps use the Marketing > Content path, which is how you'll typically navigate to CMS in practice.

Before creating a workspace, verify that Enhanced CMS is enabled in your org.

1. Navigate to **Setup**, then search for **Digital Experiences** in Quick Find.
2. Click **Salesforce CMS**.
3. Verify that **Create both CMS workspaces and enhanced CMS workspaces** is enabled. If not, enable it.

{/* VERIFY: Confirm this exact toggle label and path in a live SDO. The path is sourced from search result summaries, not a directly verified Salesforce Help page. */}

To create the workspace:

1. Open the **App Launcher** and search for **Marketing**.
2. Select **Marketing**.
3. Navigate to **Content** in the top navigation.
4. Click **Create a CMS Workspace** (or **Add Workspace** if workspaces already exist).
5. Enter a name for the workspace. For LEOptical, use `LEOptical Marketing`.
6. Follow the prompts to configure the workspace settings.
7. Click **Save**.

{/* VERIFY: Confirm the exact path and button label for workspace creation via Marketing > Content in a live SDO. The App Launcher path through Digital Experiences is an alternative confirmed by Trailhead, but the Marketing > Content path should be verified. */}

<Screenshot src="/img/business-units/02-cms-workspace.png" alt="Marketing Content tab showing the LEOptical Marketing Enhanced CMS workspace" />

You should see the new workspace appear in the Content page.

## Adding contributors to a workspace

1. Open **Marketing** from the App Launcher.
2. Navigate to **Content**.
3. Select the workspace you created.
4. Click the **gear icon** (settings) next to the Manage button, then select **Contributors** from the dropdown.

<Screenshot src="/img/business-units/03-add-contributors.png" alt="LEOptical Marketing workspace with the gear dropdown open and Contributors highlighted" />

5. Click **Add Contributors**.
6. Search for the user you want to add.
7. Select a role: **Content Admin**, **Content Manager**, or **Content Author**.
8. Click **Save**.

The user can now access the workspace with the permissions defined by their assigned role.

## Assignment

> **The client wants:** LEOptical's marketing team needs a shared content workspace where they can collaborate on email templates and campaign assets. Content authors should be able to create and edit but not publish. Only the marketing manager should be able to publish.

1. In your SDO, create an Enhanced CMS Workspace named `LEOptical Marketing`. Follow the walkthrough above.
2. Assign yourself as **Content Admin**.
3. **(Stretch)** Review the [Enhance Your CMS Skills: Workspaces, Channels, and Contributors](https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/learn-about-cms-workspaces-channels-and-contributors) Trailhead module. Document how you would configure contributor roles for the three LEOptical personas (Marketing Manager, Content Creator, Campaign Specialist) across the workspace.

## Success Criteria

- [ ] The Enhanced CMS Workspace `LEOptical Marketing` exists in the SDO.
- [ ] Your user is assigned as **Content Admin** in the `LEOptical Marketing` workspace.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What are the three CMS workspace contributor roles, and what does each role allow?
- A Content Author submits an email template for review. They expect it to go live immediately. Why won't it?
- How does a user's CMS contributor role relate to their MCA permission set? Do they control the same things?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [How to Set Up Marketing Cloud Next (arthurbackouche.com)](https://arthurbackouche.com/docs/marketing-cloud-next/foundation-setup/how-to-set-up-marketing-cloud-next/). Detailed setup guide for MCA including data space selection, permission set assignment, and Basic Settings navigation. Updated March 2026.

- [User Permissions in Marketing Cloud Next (Salesforce Help)](https://help.salesforce.com/s/articleView?id=mktg.mktg_admin_permissions_ref.htm&type=5). The complete permissions reference: every individual permission across all five categories with descriptions. Read this before building custom permission sets.

- [Enhance Your CMS Skills: Workspaces, Channels, and Contributors (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/salesforce-cms-basics/learn-about-cms-workspaces-channels-and-contributors). Official Trailhead on CMS workspace structure, contributor roles, and channel configuration.

- [Top 10 Spring '26 Updates for Salesforce Marketers (Salesforce Ben)](https://www.salesforceben.com/top-10-spring-26-updates-for-salesforce-marketers/). Covers BUs in Spring '26 including data isolation, channel scoping, and Einstein BU awareness.

- [5 New Marketing Cloud Next Features (Nebula Consulting)](https://nebulaconsulting.co.uk/insights/5-new-marketing-cloud-next-features-were-excited-to-try/). BU arrival in Spring '26, 50 BU limit, use cases for brands and regions.

- [What Is the Difference Between SF Marketing Clouds? (Mateusz Dabrowski)](https://mateuszdabrowski.pl/sites/faq/salesforce/what-is-the-difference-between-sf-marketing-clouds/). Architectural comparison between MCA and MCE. Written before Spring '26 BU GA but still useful for understanding the platform divergence.
