---
sidebar_position: 6
title: "Project: Consent Automation Flow"
description: "Build the Data 360-Triggered Flow that automatically creates consent records for new individuals in LEOptical's org."
custom_edit_url: null
---

## Overview

LEOptical's consent strategy relies on a flow that creates OPT_IN records automatically when a new individual enters the system. Without it, every new contact starts as blocked from marketing sends. Module 5 covers CSV import as a manual workaround. This project is the permanent implementation.

The consent automation flow is a Data 360-Triggered Flow that fires on the Individual DMO. When a new Individual record is created, the flow writes OPT_IN records for each of LEOptical's three marketing Communication Subscriptions using the Create Consent Request flow element.

This walkthrough is pending a validated proof of concept in a live SDO. The trigger mechanism, entry conditions, and field mapping for the Create Consent Request element must be confirmed against actual platform behavior before this page can be completed. Do not attempt to build this flow from the Create Consent Request element reference table in Module 5 alone. The triggering mechanism has not yet been validated.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- What a Data 360-Triggered Flow is and when it fires relative to record creation.
- How to configure the flow trigger on the Individual DMO.
- How to wire the Create Consent Request element for each of LEOptical's three marketing subscriptions.
- How to test the flow and verify that consent records appear on protagonist contacts.

## Walkthrough

{/* TBD: This walkthrough requires a validated POC before it can be documented. The correct trigger type is a Data 360-Triggered Flow on the Individual DMO. The steps will be written after testing the flow design in a live SDO to confirm trigger behavior, latency, and the correct field mapping for the Create Consent Request element. Do not build this flow until the POC is validated. */}

:::caution
This walkthrough is not yet available. The consent automation flow design requires hands-on validation in a live SDO before it can be documented accurately. For now, use the CSV import method in Module 5 to create consent records for your protagonist contacts so you can continue with later modules.
:::

For background on the bidirectional consent sync pattern (flow changes in MCA writing back to CRM, and vice versa), see the [modrzejewski.it consent sync guide](https://modrzejewski.it/blog/how-to-keep-consent-in-sync-between-salesforce-data-360-and-marketing-cloud-next/).

## Assignment

> **The client wants:** New contacts who enter the system to receive OPT_IN records automatically, without manual CSV import.

This assignment will be written when the walkthrough is complete. You should complete Module 5's CSV import step first so that your protagonist contacts have consent records while this flow is being validated.

## Success Criteria

- [ ] The Data 360-Triggered Flow is active and firing on new Individual records.
- [ ] Three Create Consent Request elements are configured, one per marketing subscription.
- [ ] A test contact created after the flow was activated shows OPT_IN for all three marketing subscriptions in the Privacy Consent Status component.

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What is the difference between a Data 360-Triggered Flow and a record-triggered Flow in Salesforce CRM?
- Why does the Create Consent Request element update the consent cache when a standard Create Records element writing to the same DMO does not?
- If a new Individual is created but the flow fails silently, what is the observable symptom in later modules?
- Why does LEOptical need three separate Create Consent Request elements in this flow rather than one?
