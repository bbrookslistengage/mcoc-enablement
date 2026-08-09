---
sidebar_position: 0
title: "Course Introduction"
description: "What this course covers, how it works, and the Data 360 concepts you need before getting started."
---

## Welcome

This course teaches you to build a complete Marketing Cloud Advanced (MCA) implementation from scratch. You will configure data ingestion, identity resolution, segmentation, consent, email, flows, landing pages, and more across roughly 25 modules. By the end, you will have hands-on experience with every major area of the platform.

This is not a beginner course. You are an experienced Salesforce consultant. You know the platform. You may have spent years in Marketing Cloud Engagement (MCE), or you may be coming from the core Salesforce platform. Either way, you know how to configure things, read documentation, and troubleshoot when something breaks. This course meets you there and focuses on what is new: MCA and the data architecture underneath it.

## How this course works

Every module follows the same structure. A lesson teaches the concepts and mechanics, with inline walkthroughs where you follow along in your own org. An assignment asks you to apply what you learned, often in the context of a client request. Some modules include projects that tie multiple topics together into larger deliverables.

The assignments are intentionally not step-by-step answer keys. They give you what you need to figure it out, but you will have to explore the platform, try things, and work through some friction on your own. This is by design. People learn by doing, and the doing has to involve some genuine problem-solving. If every task were a paint-by-numbers walkthrough, you would finish the course and still feel lost the first time a real client asked you to configure something.

Each module builds on the previous ones. Work through them in order. If a module references something you configured earlier, it will point you to the relevant module by name.

Your progress is tracked locally in your browser. Check off lessons and assignments as you complete them. The course overview page shows your overall progress.

## Meet LEOptical

Every module in this course is grounded in a fictional client: **LEOptical**, a B2C eyecare and eyewear company. They sell glasses, contact lenses, and sunglasses through retail stores and an ecommerce site. They run a loyalty program. They send promotional emails, appointment reminders, and order confirmations.

Why a fake client? Because configuring features in a vacuum does not stick. When you set up a data stream, you are ingesting LEOptical's ecommerce orders. When you build a segment, you are targeting LEOptical's lapsed loyalty members. When you create a flow, you are automating a post-purchase email for LEOptical's customers. The business context ties everything together and gives you practice making the same kinds of decisions you make on real engagements.

The Getting Started module covers LEOptical's data, org setup, and the seed data you will load into your environment.

## MCA vs. MCE: a different mental model

If you are coming from MCE, the most important thing to understand about MCA is that it is not MCE with a new interface. It is a fundamentally different product built on a fundamentally different foundation.

MCA is built on Data 360, Salesforce's unified data platform. Most of what you will spend your time on in MCA is data architecture: setting up data streams, mapping data into the canonical model, configuring identity resolution, and building segments. The marketing features you are used to thinking of as the core of the product, things like the email builder, automation flows, and landing pages, are a relatively thin layer that sits on top of that data foundation.

This is the single biggest shift from MCE. In MCE, your data lived in its own silo. Data extensions, subscriber lists, and SQL queries were the backbone. The marketing tools operated somewhat independently from the data layer. In MCA, the marketing tools are completely dependent on Data 360. If your data model is wrong, your segments will not work. If identity resolution is not configured, your emails will not reach the right people. Everything flows from the data.

Throughout the course, you will see "Coming from MCE?" callouts that draw specific comparisons between the two platforms at the point where those comparisons are most useful. This section is just the high-level framing. Keep this mental model in mind as you work through the modules: **data first, marketing second**.

## Data 360: a primer

Since MCA depends so heavily on Data 360, it helps to understand a few core concepts before you start configuring anything. This is a high-level primer. There is a lot more depth underneath each of these topics, and the course covers them thoroughly in later modules. But having this mental model now means the early setup steps will make more sense.

### Data streams

Data streams are how data gets into Data 360. You connect an external source (CRM objects, CSV files, external databases, APIs) and the platform ingests the data on a schedule you define. Think of a data stream as a pipeline: you point it at a source, tell it what to pull, and it brings that data into the platform.

For LEOptical, you will set up data streams for CRM contacts, ecommerce orders, loyalty program members, and eye exam records. The Data 360 and Data Model Objects module covers data streams in detail.

### Data lake objects

When a data stream ingests data, it lands in a data lake object (DLO). This is the raw staging area. The data is in the platform, but it has not been organized or mapped into any standard structure yet. A DLO is essentially a mirror of the source data, field names and all.

You rarely work with DLOs directly after the initial setup. They exist as an intermediate step between your source systems and the structured data model.

### Data model objects

Data model objects (DMOs) are the structured, canonical data model. Data from DLOs gets mapped into DMOs through field mappings that you configure. DMOs are the objects the rest of the platform works with: Unified Individual, Contact Point Email, Contact Point Phone, Sales Order, and many others.

Some DMOs are standard (shipped by Salesforce with predefined fields). Others are custom (you create them for data that does not fit a standard object). For LEOptical, you will use standard DMOs for contacts and orders, and create a custom DMO for eye exam history. The Data 360 and Data Model Objects module walks through all of this.

### DMO relationships

DMOs do not exist in isolation. They are connected through defined relationships. A Unified Individual has Contact Point Emails, has Sales Orders, has Loyalty Program Memberships. These relationships are what make the data model queryable and what allow the rest of the platform (segmentation, personalization, activation) to traverse the data.

Getting the relationships right matters. If a relationship is missing or misconfigured, downstream features cannot access the data they need. The Data Graphs module covers how to define and use these relationship paths.

### Identity resolution

Your data comes from multiple sources: CRM, ecommerce, loyalty, exam history. The same person might appear as "Maria Chen" in the CRM, "m.chen@email.com" in the ecommerce system, and "Maria C." in the loyalty database. Identity resolution is the process that figures out these records belong to the same person and merges them into a single **Unified Individual**.

The Unified Individual is the resolved identity at the center of the data model. Every other piece of data (email addresses, orders, loyalty status, exam records) connects back to it. When you build a segment or send an email, you are working with Unified Individuals, not raw source records. The Identity Resolution module covers the matching rules and configuration in depth.

### Segments

Segments are how you build audiences. A segment queries the data model (DMOs and their relationships) to find groups of Unified Individuals who match criteria you define. "Loyalty members who have not made a purchase in 90 days" is a segment. "Customers due for an eye exam" is a segment.

Segments are the bridge between data and marketing. You build them from the unified data, and you activate them through marketing channels (email sends, flow entry, ad platforms). The Segmentation module covers how to create, test, and activate segments.

---

These concepts will come up constantly throughout the course. You do not need to memorize the details now. Just keep the flow in mind: **data streams bring data in, DLOs stage it, DMOs structure it, identity resolution unifies it, and segments make it actionable**. Everything else in MCA builds on top of that chain.

When you are ready, head to Getting Started to provision your environment and load LEOptical's data.
