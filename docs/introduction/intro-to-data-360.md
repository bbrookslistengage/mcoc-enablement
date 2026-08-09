---
sidebar_position: 3
title: "Introduction to Data 360"
description: "A high-level primer on Data 360 concepts: data streams, DLOs, DMOs, identity resolution, and segments."
---

## Overview

Data 360 is the data platform underneath MCA. Every feature you will use in this course (segmentation, email personalization, AI scoring, activation) reads from Data 360. Before you start configuring anything, it helps to understand the core concepts at a high level.

This module is intentionally surface-level. There is a lot more depth underneath each topic, and the course covers it thoroughly in later modules. The goal here is to give you a mental model so the setup steps in Getting Started make sense. If something feels incomplete, that is by design. You will get the full picture as you build out LEOptical's implementation.

You do not need to memorize any of this right now. Think of this as a map you glance at before a road trip. You are not memorizing every turn. You are getting a sense of the terrain.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What Data 360 is and why it matters for MCA
- How data streams bring external data into the platform
- The difference between data lake objects (DLOs) and data model objects (DMOs)
- How DMO relationships enable cross-object segmentation
- What identity resolution does and what a Unified Individual is
- How segments turn unified data into actionable audiences

## What Data 360 is

Data 360 is Salesforce's unified data platform. It is where all customer data from all sources lives, gets unified, and becomes available for marketing (and other) use cases.

Everything in MCA reads from Data 360. Segments read from it. Email personalization reads from it. AI scoring reads from it. Activation reads from it. If Data 360 is not set up correctly, the marketing features have nothing to work with. The previous module (MCA vs. MCE) described MCA as "mostly Data 360 with a thin marketing layer on top." This is where that starts to become concrete.

Data flows through Data 360 in three conceptual stages:

1. **Connect** - Ingest data from source systems
2. **Harmonize and Unify** - Map it to a standard data model and resolve identities
3. **Analyze and Act** - Segment, personalize, and activate

The rest of this module walks through each stage at a high level.

## Data streams

A data stream is an ingestion pipeline that brings data from a source system into Data 360. Think of it as an agreement you make with an external system: you point Data 360 at a specific table, file, or object and tell it to ingest that data on a schedule.

The external system could be CRM objects (Contacts, Accounts), CSV files, an ecommerce database, a loyalty platform, or any number of other sources. Data 360 supports CRM objects natively and has connectors for external systems.

For LEOptical, you will set up data streams for CRM contacts, ecommerce orders, loyalty members, and eye exam records. Each data stream brings one source of data into the platform.

When MCA is first set up, a component called the Marketing Data Kit auto-installs CRM data streams for common objects like Contact and Account. You will see these already in place when you open your SDO.

## Data lake objects

When a data stream ingests data, it places it into a data lake object (DLO). A DLO is essentially a raw representation of the source data. The field names, the values, the structure are all mirrored from the source. DLOs are stored in an optimized format, but conceptually they reflect what the source system sent.

Here is the key thing about DLOs: the features that make Data 360 useful (segmentation, identity resolution, AI scoring, activation) do not use DLOs directly. DLOs are the foundation layer. They exist so the platform has the raw data available for the next step: mapping into the data model.

DLOs persist. They are not temporary. They accumulate data over time as data streams refresh. But from your perspective as someone building an implementation, you rarely interact with DLOs directly after the initial mapping is done. They sit underneath the data model, holding the raw data that everything else references.

## Data model objects

Data model objects (DMOs) are where things get interesting. DMOs are the structured data model that the rest of the platform works with. When you build a segment, personalize an email, or run identity resolution, you are working with DMOs.

Here is how DMOs relate to DLOs: you create a DMO by mapping DLO fields to it. When you map a DLO field to a DMO field, the DMO does not store a separate copy of the data. It is a virtual view that references the DLO data and organizes it into a structure that Data 360 needs. When you query a DMO, it pulls the latest data from its related DLO(s) on the fly.

This is worth pausing on because it is different from what you might expect. A DMO is not a table with its own stored records. It is more like a database view: a defined structure that reads from underlying storage (DLOs) whenever it is accessed.

You can map multiple DLOs to one DMO. For example, you might have an "email" field from CRM, another from your ecommerce system, and another from your loyalty platform. All three can map to the same Contact Point Email DMO. This is how Data 360 brings together data from multiple sources into a single, unified structure.

Some DMOs are standard. Data 360 comes with a library of standard DMOs for common entities: Individual (for people), Contact Point Email, Sales Order, Account, and many more. Others are custom. For LEOptical, you will create a custom DMO for Eye Exam records, since that is specific to the eyecare business.

The Data Model Objects module later in the course covers DMOs in detail. For now, the mental model is: DLOs hold the raw data, DMOs give it structure.

:::tip[Coming from MCE?]
- DLOs are loosely analogous to data extensions in MCE. Both hold raw data. But DLOs are a staging layer for DMOs, whereas data extensions ARE the operational data store in MCE.
- There is no MCE equivalent for the virtual, non-materialized nature of DMOs. In MCE, data extensions store their own data. DMOs reference data from DLOs.
- Segments in Data 360 are loosely analogous to filtered data extensions or data filters. Both create subsets of records based on criteria. Data 360 segments are more capable because they can traverse relationships natively and operate on unified identities.
:::

## DMO relationships

DMOs do not exist in isolation. You define relationships between them.

A Unified Individual has Contact Point Emails. A Unified Individual has Sales Orders. A Unified Individual has Loyalty Program Memberships. These are all defined relationships in the data model. They are what allow you to build segments that reference data across multiple DMOs.

Without relationships, you could only filter on fields that exist directly on the Unified Individual DMO. With relationships, you can write a segment like: "Find all Unified Individuals who have a Sales Order with a total over $200 in the last 90 days." The segment starts at Unified Individual, traverses the relationship to Sales Order, and filters on fields there.

For LEOptical, the relationships you define will let you build segments like "loyalty members who have not had an eye exam in over a year" or "customers who bought ChromaShift lenses and are due for a follow-up." Each of those segments crosses multiple DMOs through defined relationships.

:::tip[Coming from MCE?]
- In MCE, Contact Builder lets you define relationships between data extensions so you can reference related data in filters and automation. DMO relationships serve a similar purpose: they let you traverse the data model when building segments.
- The implementation is quite different (DMO relationships are virtual views across a data lakehouse, Contact Builder relationships are SQL joins across relational tables), but the concept is the same: connecting separate data entities so you can query across them.
:::

## Identity resolution

Your data comes from multiple sources. The same person might exist as "Maria Chen" in the CRM, "m.chen@email.com" in the ecommerce system, and "Maria C." in the loyalty database. These are three separate records in three separate DLOs, all representing the same human.

Identity resolution is the process that figures out these records belong to the same person. It runs matching rules (exact matches, normalized matches, and fuzzy matches) across the data to identify records that should be linked together.

The output is a **Unified Individual**: a single resolved identity that ties together everything the platform knows about one person. Maria Chen's CRM record, her ecommerce orders, her loyalty membership, and her eye exam history all connect to one Unified Individual.

When you build a segment or send an email, you are working with Unified Individuals, not raw source records. This is what prevents Maria from getting the same promotional email three times (once for each source system that has her data).

The Identity Resolution module covers the matching rules, configuration, and edge cases in detail. For now, the key idea is: identity resolution takes fragmented data from multiple sources and produces a single Unified Individual per real person.

## Segments

Segments are how you build audiences from the unified data. A segment queries the data model (DMOs and their relationships) to find groups of Unified Individuals who match criteria you define.

"Loyalty members who have not made a purchase in 90 days" is a segment. "Customers due for an eye exam" is a segment. "Gold-tier members who bought SeeClear DailyFocus lenses" is a segment. Each of these queries the Unified Individual DMO and traverses relationships to other DMOs to evaluate the criteria.

Segments are the bridge between data and marketing. You build them from the data model, and you activate them through marketing channels (email, SMS, ads). The Segmentation module covers this in depth.

## Putting it all together

Here is the full data flow, end to end:

1. **Data streams** bring data in from source systems (CRM, CSV files, external databases)
2. **DLOs** store the raw ingested data
3. **DMOs** give that data structure through field mappings (as virtual views, not copies)
4. **Identity resolution** matches records across sources and produces Unified Individuals
5. **Relationships** connect DMOs so you can query across them
6. **Segments** query the unified data model to build audiences for marketing

Every module in this course touches at least one of these layers. You do not need to have this memorized. These concepts come up repeatedly, and each one gets its own dedicated module where you will configure it hands-on. The goal right now is just to have the vocabulary and the mental model so the next steps make sense.

## Assignment

1. Complete the [Explore Data 360](https://trailhead.salesforce.com/content/learn/trails/explore-customer-360-audiences) Trailhead trail. It covers the core stages of Data 360 (Connect, Harmonize and Unify, Analyze and Act) from a Salesforce perspective. Trailhead may still use an older product name in places. It refers to the same platform.
2. **(Stretch)** Read through the <a href="https://trailhead.salesforce.com/content/learn/modules/data-and-identity-in-salesforce-cdp/get-to-know-unified-profiles">Data and Identity in Salesforce CDP: Unified Profiles</a> Trailhead module for a deeper look at how identity resolution produces Unified Individuals.

## Success criteria

- [ ] You completed the "Explore Data 360" Trailhead trail (or read through it thoroughly)
- [ ] You can describe the difference between a DLO and a DMO without re-reading this page
- [ ] You can sketch the high-level data flow from source system to segment on paper or a whiteboard

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between a data lake object and a data model object?
- When you map a DLO field to a DMO field, what happens to the data? Does the DMO store its own copy?
- Why do DMO relationships matter for segmentation?
- What is a Unified Individual, and what process creates it?
- What is the high-level data flow from an external source system to an actionable segment?
- For the LEOptical implementation, why would you need a custom DMO for eye exam records?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Data Model Concepts (Salesforce Help)](https://help.salesforce.com/s/articleView?id=sf.c360_a_understanding_and_using_the_data_model.htm&language=en_US&type=5) - Official reference for data model concepts including DLOs, DMOs, and relationships.
- [Data Objects in Data 360 (Salesforce Help)](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_lake_objects.htm&language=en_US&type=5) - Official help article covering DLO and DMO details.
- [Explore Data 360 (Trailhead Trail)](https://trailhead.salesforce.com/content/learn/trails/explore-customer-360-audiences) - A full trail covering Data 360 implementation and features. More than you need right now, but useful if you want to go deeper.
