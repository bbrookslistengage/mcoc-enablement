---
sidebar_position: 1
title: "Working with Data 360"
description: "Tour your org's data infrastructure, learn the refresh chain, ingest external data, and build the LEOptical data model."
---

## Overview

[Introduction to Data 360](/introduction/intro-to-data-360) gave you the vocabulary and mental model. You learned what data streams, DLOs, DMOs, identity resolution, and segments are at a conceptual level. This module is where you open your SDO and see it all in practice.

You will tour the data streams, DLOs, and DMOs that the Marketing Data Kit set up automatically during <ModuleLink slug="getting-started" />. You will learn the operational mechanics that govern how data moves through the platform, including the refresh dependency chain that will most likely trip you up at some point during this course. You will ingest LEOptical's external data sources (loyalty members, ecommerce orders, and eye exam records) by creating your own data streams. And you will review the target data model you will build throughout the rest of the course.

Throughout this course, you use CSV data streams for simplicity. In production, data streams almost always connect to external systems through connectors (S3 buckets, Azure Blob Storage, Lakehouse, etc.). The principles are the same regardless of connector: you pick a source, create a data lake object, map fields to DMOs, and set a refresh schedule. CSV lets you focus on the concepts without the overhead of configuring external system credentials.

This is the longest module in the course, and the density is intentional. Data 360 is the foundation for everything that comes after. If the data model is wrong, segments break. If the refresh chain is misunderstood, you spend hours wondering why a record you just created is not showing up. The time you invest here pays off in every subsequent module.

This module has four lessons. Work through them in order.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- Touring the CRM data streams, DLOs, and DMOs that the Marketing Data Kit auto-installed in your SDO
- Understanding full refresh vs. incremental refresh and when each applies
- The refresh dependency chain: data streams, identity resolution, and Data Graphs
- Data Transforms and where they fit in the pipeline (light touch)
- Creating CSV data streams for LEOptical's loyalty, ecommerce, and eye exam data
- Standard DMOs vs. custom DMOs and when to use each
- Field mapping mechanics and ingestion troubleshooting
- The full LEOptical data model: every DMO, relationship, and design decision

## How this module is structured

The four lessons follow the same arc you would follow on a real client engagement. First, you understand what is already there. Then you understand how the system keeps data current. Then you bring in new data. Finally, you step back and look at the full data model as a connected whole.

**Exploring Your Org** is the hands-on tour. You open Data 360 Setup and look at the CRM data streams, DLOs, and field mappings that already exist.

**The Refresh Chain** covers the dependency order that governs how data moves through the platform, and why things break when you skip a step.

**Ingesting External Data** is where you create your own data streams for the first time. You upload LEOptical's CSV files, map fields to DMOs, create a custom DMO, and troubleshoot the intentional dirty data in the seed files.

**The LEOptical Data Model** ties it all together. You review the full ERD, understand why each DMO and relationship was chosen, and verify that your org matches the target architecture.

Each lesson has its own assignment and success criteria. There is no assignment on this page.
