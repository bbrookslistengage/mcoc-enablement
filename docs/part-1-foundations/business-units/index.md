---
sidebar_position: 1
title: "Business Units and Governance"
description: "When business units are required, how MCA's permission model works, and how to set up Enhanced CMS Workspaces for content governance."
---

## Overview

Governance is one of the first conversations you have on any marketing platform engagement. Who can do what, how content is organized, and where data lives. For Marketing Cloud Next, those questions map to three things: business units, permission sets, and CMS workspaces. This module covers all three.

Business units in Marketing Cloud Next are a relatively new feature, introduced in Spring '26. They are architecturally different from business units in MCE, and the differences matter for how you advise clients. The key constraint to understand up front: a business unit maps 1:1 to a Data 360 data space. This is a full data partition, not just a content partition. Creating a business unit is also permanent. You cannot delete it after creation. That makes the initial BU design a real governance decision, not a configuration detail you can revisit later.

For LEOptical, the answer is straightforward: one business unit is appropriate. They are a single brand, a single marketing team, and operating in one region. The governance work for this engagement focuses on getting permissions and content organization right within that single BU. You will document the BU decision, configure role-based permission sets, and create the Enhanced CMS Workspace the marketing team will use for all campaign assets.

One honest note about this module: your SDO only has one data space, and business units cannot be enabled in SDOs. The BU section of this module is conceptual. You will follow the logic, understand the architecture, and document a real recommendation, but you cannot click through the BU setup screens yourself. The permission sets and CMS workspace work is hands-on.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What business units are in Marketing Cloud Next and how they differ from MCE business units.
- The 1:1 relationship between business units and Data 360 data spaces.
- When to create multiple business units and when not to.
- How Marketing DLO filters work and why they matter for multi-BU orgs.
- The two standard Marketing Cloud Next permission sets and how to build custom permission sets from five permission categories.
- How CMS workspace contributor roles work and how to create a workspace.
- Why the SDO cannot demonstrate BU setup, and how to work around that limitation.

## What to Do Next

Work through the three pages in order.

1. [Business Units](./bu-architecture): understand the architecture, complete the governance recommendation deliverable.
2. [Permission Sets](./permission-sets): configure the two standard permission sets and create custom sets for the LEOptical team.
3. [CMS Workspaces](./cms-workspaces): create the Enhanced CMS Workspace and assign contributors.
