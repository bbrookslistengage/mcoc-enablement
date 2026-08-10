---
sidebar_position: 4
title: "The LEOptical Data Model"
description: "Review the target data model, understand DMO relationship design decisions, and verify your org matches the ERD."
---

## Overview

Every MCA engagement starts with a data model conversation. Before you build segments, configure identity resolution, or personalize emails, you need a clear picture of what data exists, where it lives, and how the pieces connect. This is that conversation for LEOptical.

In the previous lessons, you toured the auto-installed CRM data streams, learned the refresh chain, and ingested LEOptical's external CSV data. Now you step back and look at the full picture. You will review the target entity relationship diagram, understand why each DMO was chosen, and verify that your org's data model matches the design.

This is also where you start thinking about downstream use cases. The data model you verify here is what powers segmentation, identity resolution, and email personalization later in the course. If a relationship is missing or misconfigured, those features break in ways that are hard to debug. Getting the data model right is worth the time.

## Lesson overview

This section contains a general overview of topics that you will learn in this lesson.

- The full LEOptical entity relationship diagram
- How each business entity maps to a Data 360 DMO
- Why certain DMOs are standard and one is custom
- How to define and verify DMO relationships
- The difference between standard (auto-activated) and custom (manually defined) relationships
- What segments this data model enables

## The ERD

Here is the full LEOptical data model. Every entity represents a DMO in Data 360, and every line represents a defined relationship between DMOs.

```mermaid
erDiagram
    CUSTOMER ||--o{ EMAIL_ADDRESS : "has"
    CUSTOMER ||--o{ PHONE_NUMBER : "has"
    CUSTOMER }o--|| ACCOUNT : "belongs to"
    CUSTOMER ||--o| LOYALTY_MEMBERSHIP : "may have"
    CUSTOMER ||--o{ ORDER : "places"
    CUSTOMER ||--o{ EYE_EXAM : "attends"
    CUSTOMER ||--o{ COMMUNICATION_CONSENT : "grants"
    ORDER ||--|{ ORDER_LINE_ITEM : "contains"
    ORDER_LINE_ITEM }o--|| PRODUCT : "references"
    COMMUNICATION_CONSENT }o--|| EMAIL_ADDRESS : "applies to"

    CUSTOMER {
        string customer_id PK
        string first_name
        string last_name
        date birth_date
        date last_exam_date
        date next_exam_due
    }

    EMAIL_ADDRESS {
        string email_address PK
        string email_type
        boolean is_primary
    }

    PHONE_NUMBER {
        string phone_number PK
        string phone_type
    }

    ACCOUNT {
        string account_id PK
        string account_name
        string billing_city
        string billing_state
    }

    LOYALTY_MEMBERSHIP {
        string membership_number PK
        string member_name
        string email_address
        string loyalty_tier
        number points_balance
        date enrollment_date
        string status
    }

    ORDER {
        string order_id PK
        string customer_email
        date order_date
        number order_total
        string order_status
        string order_source
    }

    ORDER_LINE_ITEM {
        string line_item_id PK
        string order_id FK
        string product_sku FK
        number quantity
        number unit_price
        number line_total
    }

    PRODUCT {
        string product_sku PK
        string product_name
        string product_family
        number list_price
        string description
    }

    EYE_EXAM {
        string exam_id PK
        string patient_email
        string patient_first_name
        string patient_last_name
        date exam_date
        date next_exam_due
        string exam_type
        string provider
    }

    COMMUNICATION_CONSENT {
        string consent_id PK
        string email_address FK
        string subscription_name
        string consent_status
        date consent_date
    }
```

This is a business-level ERD. It shows entities the way LEOptical thinks about them: customers, orders, exams, loyalty memberships. The next section maps each entity to a specific Data 360 DMO and explains the design decisions behind the mapping.

## DMO mapping

Each business entity maps to a Data 360 DMO. Some map to standard DMOs that ship with the platform. One requires a custom DMO.

| Business Entity | Data 360 DMO | DMO Type | Source | Ingestion Method |
|----------------|-------------|----------|--------|-----------------|
| Customer | **Individual** | Standard | CRM Contact | Auto (Marketing Data Kit) |
| Email Address | **Contact Point Email** | Standard | CRM Contact + CSV email fields via IDR | Auto + IDR |
| Phone Number | **Contact Point Phone** | Standard | CRM Contact | Auto (CRM) |
| Account | **Account** | Standard | CRM Account | Auto (CRM) |
| Loyalty Membership | **Loyalty Program Member** | Standard + custom fields | `loyalty_members.csv` | CSV data stream |
| Order | **Sales Order** | Standard (manually enabled) | `ecommerce_orders.csv` | CSV data stream |
| Order Line Item | **Sales Order Product** | Standard (manually enabled) | `ecommerce_orders.csv` | CSV data stream |
| Product | **Product** | Standard | CRM Product (anonymous Apex) | Auto (CRM) |
| Eye Exam | **Eye Exam** | **Custom** | `exam_history.csv` | CSV data stream |
| Communication Consent | **Comm Subscription Consent** | Standard | Consent automation flow + landing page forms | Flow/form-created |
| (resolved identity) | **Unified Individual** | Standard | System-generated post-IDR | Automatic |

A few things to notice:

- **Most entities use standard DMOs.** Data 360 ships with 89+ standard DMOs across subject areas like Party, Commerce, Loyalty, Privacy, and Sales Order. The official recommendation is to use standard DMOs before creating custom ones.
- **Loyalty Program Member is standard but has custom fields.** The standard DMO covers membership number, name, enrollment date, and status. LEOptical's tier and points data required custom fields added to the standard DMO.
- **Eye Exam is the only custom DMO.** No standard DMO exists for clinical exam records. This is a common pattern: most B2C concepts fit the standard model, but industry-specific entities (eye exams, insurance policies, patient records) need custom DMOs.
- **Unified Individual is not something you create.** It is generated automatically after identity resolution runs. You will configure that in the <ModuleLink slug="identity-resolution" /> module.

## Relationship design decisions

The relationships between DMOs are not arbitrary. Each one exists to support a specific downstream use case, usually segmentation or personalization.

### Why standard DMOs matter here

Standard DMOs come with built-in relationships that activate automatically once there is at least one field mapping between the related DMOs. You do not need to manually wire up the relationship between Individual and Contact Point Email, for example. It exists out of the box.

Custom DMOs do not get this benefit. You must explicitly define every relationship. This is one of the key tradeoffs: standard DMOs reduce configuration work and integrate with platform features (segmentation, IDR) automatically. Custom DMOs give you control over the schema but require more manual setup.

### Key relationship decisions

**Individual to Contact Point Email (1:many).** A customer can have multiple email addresses across systems. CRM has one, the loyalty platform might have another, the ecommerce system might have a third. Each becomes a separate Contact Point Email record. This is critical for identity resolution, which matches Unified Individuals across sources using email addresses.

**Individual to Sales Order (1:many).** A customer places many orders over time. This relationship enables the "Lapsed Buyers" segment: find Unified Individuals whose most recent Sales Order is older than 180 days.

**Sales Order to Sales Order Product (1:many).** Each order contains line items. Each line item references a Product. This two-hop relationship (Sales Order to Sales Order Product to Product) is what powers the "SeeClear Enthusiasts" segment: find customers who bought products in the SeeClear family.

**Individual to Loyalty Program Member (1:1).** Each customer has at most one loyalty membership. This enables segments based on tier (`Loyalty Tier` = Gold or Platinum) and points balance.

**Individual to Eye Exam (1:many).** A customer can have multiple eye exams over time. This is the relationship that powers the "Exam Overdue" segment: find customers whose last exam was more than 12 months ago.

**Comm Subscription Consent to Contact Point Email.** Consent records relate to an email address, not directly to an Individual. This is a platform-specific design choice covered in <ModuleLink slug="consent-configuration" />.

### What this enables

Here is a preview of what segments this data model supports. You will build these in the <ModuleLink slug="segmentation" /> module.

| Segment | DMO Traversal |
|---------|---------------|
| VIP Customers | Unified Individual > Loyalty Program Member > `Loyalty Tier` = Gold or Platinum |
| Lapsed Buyers | Unified Individual > Sales Order > `Order Date` (most recent) > 180 days ago |
| SeeClear Enthusiasts | Unified Individual > Sales Order > Sales Order Product > Product > `Product Family` = "SeeClear" |
| Exam Overdue | Unified Individual > Eye Exam > `Exam Date` > 12 months ago |

A simpler data model with only Individual and Contact Point Email could not support any of these segments. Every additional DMO and relationship you define expands what you can do with segmentation and personalization.

## DMO relationships in practice

If you completed the previous lesson, your DMOs already exist. Standard DMO relationships (like Individual to Contact Point Email) activate automatically when field mappings are in place. But the custom Eye Exam DMO needs its relationships defined manually, and you should verify that all other relationships are correctly configured.

Navigate to **Data Model** and browse the list of mapped DMOs.

<Screenshot src="/img/the-leoptical-data-model/04-data-model-canvas.png" alt="Data Model list view showing 93 mapped DMOs with columns for Object Label, Object API Name, Category, Data Streams, Data Lake Objects, Data Space, Type, and Status - all showing Ready status" caption="The Data Model view is a list, not a visual canvas. Use the search bar to find specific DMOs." />

Click into the **Individual** DMO and open the **Relationships** tab to see the built-in relationships that come with this standard DMO.

<Screenshot src="/img/the-leoptical-data-model/04-individual-dmo-relationships.png" alt="Individual DMO Relationships tab showing a table with columns for Object, Field, Key Qualifier, Cardinality, Related Object, Related Field, and Key Qualifier. Rows include Account Contact, Campaign Member, Communication Subscription, Contact Point Address, Contact Point Email, Contact Point Phone, and others - all ManyToOne cardinality pointing to Individual" caption="These relationships activate automatically once DLOs are mapped to the related DMOs. You did not create them." />

### How to define a relationship

For the custom Eye Exam DMO, you must create the relationship manually.

1. Navigate to **Data Model** and click into the **Eye Exam** DMO.
2. Open the **Relationships** tab and click **Edit**.
3. Click **+ New Relationship** (a new row appears at the bottom of the relationship list).
4. Set the **cardinality** (N:1 or 1:1). For Eye Exam to Individual, this is N:1 (many exams belong to one individual).
5. Select the **related object** (Individual).
6. Select the **related field** that links the two objects.
7. Click **Save & Close**.

<Screenshot src="/img/the-leoptical-data-model/04-new-relationship-form.png" alt="Edit Relationships modal showing existing relationships as read-only rows and a new empty row at the bottom with Select an Option dropdowns for Field, Cardinality (N:1/1:1), Related Object, and Related Field" caption="The new empty row at the bottom is where you define the relationship. Existing relationships above it are read-only." />

:::warning
Cardinality cannot be changed after a relationship is created. If you set it wrong, you must delete the relationship and recreate it. Think carefully before saving. Cardinality affects how segmentation and activation treat the related records.
:::

### Standard vs custom relationships

The Data 360 relationship UI offers two cardinality options:

- **Many-to-one (N:1)**: Many records in the current DMO relate to one record in the target DMO. Example: many Eye Exams belong to one Individual.
- **One-to-one (1:1)**: One record in the current DMO relates to one record in the target DMO. Example: one Individual has one Loyalty Program Member record.

There is no "one-to-many" option in the UI. To express "one Individual has many Eye Exams," you create an N:1 relationship from the Eye Exam DMO (the "many" side) pointing to Individual. The DMO you are editing is always the left side of the relationship. It is auto-filled and cannot be changed.

This means: to set up all of LEOptical's relationships correctly, you need to think about which DMO is the "many" side and create the relationship from that DMO's page. You cannot navigate to Individual and say "Individual has many Eye Exams." You must navigate to Eye Exam and say "many Eye Exams belong to one Individual."

Standard DMO relationships are built-in and activate automatically once at least one field mapping exists between the related DMOs. You do not create these manually. Custom relationships must be explicitly defined from the Relationships tab on the relevant DMO.

For more details, see [Data Model Object Relationships (Salesforce Help)](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_model_object_relationships.htm&type=5).

:::tip[Coming from MCE?]
- In MCE, all data extensions are custom-created. There is no concept of "standard" data extensions with built-in relationships. In Data 360, standard DMOs with automatic relationships are the default, and custom DMOs are the exception.
- Contact Builder in MCE links data extensions to the contact record so they appear as attributes in decision splits and Audience Builder filters. It is not a query layer - SQL queries in Automation Studio work against data extensions regardless of Contact Builder. DMO relationships serve a similar purpose to Contact Builder attribute groups (making related data available for segmentation and personalization), but they are mandatory rather than optional and apply platform-wide.
- The biggest practical difference: in MCE, you build the entire data model from scratch every time. In Data 360, the standard DMOs give you a head start, and you only build custom DMOs for entities the platform does not already know about.
:::

## Assignment

> **The client wants:** A verified, documented data model that matches the target architecture. Before LEOptical's data can power segments and personalization, every DMO and relationship must be in place.

1. Review the LEOptical ERD above and compare it to the DMOs in your SDO. Navigate to **Data Model** and confirm that every DMO from the mapping table exists.
2. For each DMO, open the **Relationships** tab and verify that the expected relationships are defined. Standard DMO relationships should already be active. If any custom relationships are missing (especially for Eye Exam), create them using the steps above.
3. Verify your relationships are correctly defined by navigating the data model list in **Data Model**. Trace a path from Individual through Sales Order to Sales Order Product to Product. Trace another path from Individual to Eye Exam.
4. Write a brief data model summary document. For each of the 11 DMOs (including Unified Individual), write one paragraph explaining what it holds, where its data comes from, and how it connects to the rest of the model. This is the kind of deliverable you would present to a client during a data model review.

## Success criteria

- [ ] All DMOs from the target data model exist in your org (Individual, Contact Point Email, Contact Point Phone, Account, Loyalty Program Member, Sales Order, Sales Order Product, Product, Eye Exam, Comm Subscription Consent, Unified Individual)
- [ ] All relationships between DMOs are defined (verify via the Relationships tab on each DMO)
- [ ] You can navigate the data model in **Data Model** and trace relationships between entities
- [ ] Data model summary document is written (one paragraph per DMO)
- [ ] You can explain why Eye Exam is a custom DMO while Sales Order is standard

## Knowledge check

The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, revisit the relevant section, but keep in mind you are not expected to memorize or master this knowledge.

- What happens if you set the wrong cardinality on a DMO relationship?
- Why does LEOptical use a custom DMO for eye exams but a standard one for sales orders?
- How do standard DMO relationships differ from manually created ones?
- What segments could this data model support that a simpler model (just Individual and Contact Point Email) could not?
- How does the two-hop relationship from Sales Order through Sales Order Product to Product enable product-family-based segmentation?

## Additional resources

These resources are not required. They are here if you want to go deeper on a specific topic.

- [Standard DMOs (Salesforce Developers)](https://developer.salesforce.com/docs/data/data-cloud-dmo-mapping/guide/c360dm-si-entity-interface-dmos-introduction.html) - Official reference for all standard DMOs, including API names and field definitions.
- [Data 360 Connectors and Integrations: Connect and Map Data (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/data-cloud-connectors-and-integrations/connect-and-map-data) - Covers DMO relationships, cardinality, and category inheritance in detail.
- [How to: Data Model Object (Salesforce Dictionary)](https://salesforcedictionary.com/how-to/data-model-object) - Step-by-step guide for creating custom DMOs and defining relationships.
- [Salesforce Data 360 Data Modelling (David Palencia)](https://davidpalencia.com/salesforce-data-cloud-data-modelling/) - Data modeling phases and relationship configuration best practices.
