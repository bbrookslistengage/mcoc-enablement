---
has_assignment: false
sidebar_position: 1
title: "How This Course Works"
description: "Course structure, the LEOptical client scenario, and the learning philosophy behind every module."
---

## Overview

You are about to build a complete MCA implementation from scratch. Over the course of roughly 25 modules, you will configure data ingestion, identity resolution, segmentation, consent, email, flows, landing pages, and more. By the end, you will have hands-on experience with every major area of the platform.

This course is built for experienced Salesforce consultants. You do not need to be an MCA expert. You do not need Data 360 experience. You just need a Salesforce background and the willingness to get hands-on. Your platform knowledge, your understanding of data modeling, your experience working with clients, all of that transfers directly. The specifics of MCA are new. The skills you bring are not.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- How modules are structured and what to expect from each section
- LEOptical, the fictional client you will build for throughout the course
- Why hands-on practice with realistic scenarios is the fastest way to learn a new platform
- How progress tracking works

## Course structure

Every module follows the same format. Knowing the pattern helps you move through the material efficiently.

**Lessons** teach concepts and mechanics. They include explanations, tables, code snippets, and inline walkthroughs where you follow along in your own org. When a lesson references a specific UI path or configuration step, it tells you exactly where to click and what you should see.

**Assignments** ask you to apply what you learned. Most assignments are framed as client requests from LEOptical. They give you enough context to figure things out, but they are not step-by-step answer keys. More on that in a moment.

**Projects** appear in some modules and tie multiple topics together into larger deliverables. These are closer to what you would do on a real engagement.

**Success criteria** at the end of every module give you a checklist of verifiable outcomes. If you can check every box, you completed the module correctly.

**Knowledge check** questions help you reflect on the key concepts. They are not graded. They are there to help you identify gaps before moving on.

Modules build on each other. Work through them in order. If a module references something you configured earlier, it points you to the relevant module by name.

### Progress tracking

Your progress is tracked locally in your browser using checkboxes on each module page. Check off lessons and assignments as you complete them. The [course overview page](/) shows your overall progress across all modules. This data stays in your browser's local storage. It does not sync across devices.

## Meet LEOptical

Every module in this course is grounded in a fictional client: **LEOptical**, a B2C eyecare and eyewear company.

LEOptical sells glasses, contact lenses, and sunglasses through retail stores and an ecommerce site. They run a loyalty program called VisionCare Rewards with four tiers (Bronze, Silver, Gold, Platinum). They send promotional emails, appointment reminders, and order confirmations. They have customer data scattered across multiple systems, no unified view of who their customers are, and no consent management framework in place.

They hired you to build out their MCA implementation end-to-end.

Why a fake client? Because learning sticks when every task connects to a coherent business scenario. You are not configuring features in a vacuum. You are building an implementation for a client with real (simulated) data, real business needs, and real complexity. When you set up a data stream, you are ingesting LEOptical's ecommerce orders. When you build a segment, you are targeting LEOptical's lapsed loyalty members. When you create a flow, you are automating a post-purchase email for LEOptical's customers. The business context ties everything together and gives you practice making the same kinds of decisions you make on real engagements.

The Getting Started module covers LEOptical's data and org setup in detail. You will load seed data that includes contacts, ecommerce orders, loyalty memberships, and eye exam records.

## Learning by building

This course is designed around hands-on practice with realistic scenarios. That approach is a deliberate choice, and it is worth explaining why.

Most training courses hand you a walkthrough, you follow the steps, and you check the box. The problem is that following someone else's steps and figuring something out yourself are two very different experiences. The first gives you familiarity. The second gives you confidence.

The assignments in this course give you enough context to figure things out, but they do not hand you every click. You will need to explore the platform, try things, and work through some friction on your own. That friction is intentional. Struggling with a configuration for 20 minutes and eventually getting it to work teaches you something that reading a walkthrough never will. You build real problem-solving instincts, the kind that matter when a client asks you to do something you have not seen before.

The goal is for you to finish this course with genuine hands-on experience, not just theoretical knowledge. The kind of experience where a client asks you to do something and you think "I have done this before" rather than "I read about this once."

Compare this to training where exercises are isolated and decontextualized. You might learn how a single feature works, but you never see how it fits into a larger implementation. This course ties everything to LEOptical's implementation. Every module connects to the one before it and the one after it. By the end, you have built something real.

## Assignment

This is a lightweight assignment to get you oriented before you start building.

1. Visit the [course overview page](/) and familiarize yourself with the module list and progress tracking. Check off a box to see how it works, then uncheck it.
2. **(Stretch)** Browse the LEOptical seed data files in `static/seed-data/` to get a sense of what data you will be working with. Look at `contacts.csv`, `ecommerce_orders.csv`, `loyalty_members.csv`, and `exam_history.csv`. You do not need to understand every field yet. Just get a feel for the shape of the data.

## Success Criteria

- [ ] You have visited the course overview page and seen the module list
- [ ] You have tested the progress tracking checkbox on at least one module

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What are the main sections you will find in every module?
- Why does this course use a fictional client rather than abstract exercises?
- What should you do when an assignment does not give you step-by-step instructions for every action?
- How does the course track your progress?
