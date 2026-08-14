---
sidebar_position: 1
title: "Getting Started"
description: "Provision your SDO, configure Marketing Cloud Next, and seed the org with LEOptical's course data."
---

## Overview

LEOptical just signed their Salesforce contract. Day one of the engagement. Your job is to get the Marketing Cloud Next environment provisioned and ready for configuration. This module gets you there.

The environment you will work in throughout this course is an SDO (Simple Demo Org), Salesforce's partner demo environment. Think of it as LEOptical's org for the duration of the course. It is not a sandbox. It is not a Developer Edition. It has specific characteristics, specific limitations, and a 30-day expiry you need to address immediately. Every configuration decision you make here maps to what a real Marketing Cloud Next implementation would require.

This module is split into two phases. The first is environment setup: SDO provisioning, Data 360, Marketing Cloud, Identity Resolution, Data Graphs, and a handful of AI features. Several of these steps kick off automated processes that take hours or even days to complete. The second phase is loading course data: running a seed script that populates your org with approximately 60,000 fictional LEOptical contacts, products, and campaigns. That data is what you will work with for the rest of the course.

You are not expected to finish this in a single sitting. Plan for 1-3 days.

Some concepts introduced here (Identity Resolution, Data Graphs, Unified Individuals) will not make full sense yet. That is intentional. <ModuleLink slug="data-graphs" /> and <ModuleLink slug="identity-resolution" /> cover those in depth. For now, you are configuring the infrastructure. You will understand why each piece matters once you start using it.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What an SDO is and how it differs from other Salesforce environments.
- How to provision an SDO from Partner Learning Camp and extend its expiry.
- How to run Data 360 setup and confirm it is complete.
- How to install the Marketing Performance App.
- How to configure Identity Resolution rulesets.
- How to create a Data Graph for personalization.
- How to enable advanced segmentation features, Einstein Engagement Scoring, Agentforce, and Send Time Optimization.
- How to seed the org with LEOptical's CRM data and prepare the 10 test contacts you will use throughout the course.
