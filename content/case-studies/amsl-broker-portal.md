# AMSL Broker Portal

AMSL is a multi-tenant platform for UK commercial energy brokerages working across electricity, gas, and water. As a **Senior Backend Developer and the sole backend engineer on the portal**, I designed and implemented the backend architecture and data model that carry a deal from supplier pricing through a signed contract and commission reconciliation.

## Business context

In commercial energy, a broker has to compare offers from many licensed suppliers, but there is no single shape to the data. Suppliers send large Excel and CSV price books with their own columns, product names, and tariff rules. Before a broker can quote, they need to understand the customer's meter and consumption, identify the relevant network region, check which products are eligible, and calculate the full cost with the correct commission uplift.

Those details matter. Electricity eligibility can depend on the MPAN's profile and meter configuration, loss-factor class, and distribution network region; gas pricing is tied to the MPRN and local distribution zone. The quote also needs to account for charges beyond the unit rate: TCR bands, DUoS network charges, capacity or reactive costs, and applicable taxes such as CCL. A mistake in eligibility or in the difference between a gross and net rate can make an offer invalid or unprofitable.

The work did not end when a customer accepted. Brokers still had to prepare supplier-specific contracts and letters of authority, collect signatures, manage agency commission splits, and reconcile supplier remittances against expected payments. Each handoff across spreadsheets, PDFs, and email made the deal harder to track from beginning to end.

## The platform workflow

I built AMSL to connect those steps in one operational system. Supplier data enters the portal once, then flows through validation and tariff comparison into contract execution and later commission checks.

### Bring different supplier data into one pricing workflow

The price-book ingestion engine accepts varied Excel and CSV formats through configurable field mappings, so a new supplier layout does not require a code change for every column variation. Shared fields such as supplier, product, contract dates, term, and network region are stored in indexed relational columns. Supplier-specific fields remain in PostgreSQL JSONB, preserving their detail while allowing the common quote workflow to work across suppliers.

### Turn customer details into an eligible quote

The pricing engine evaluates a customer's MPAN or MPRN, meter information, location, and consumption against the supplier products that fit. It applies gross or net commission uplift rules consistently, adds the relevant network charges and taxes, and stores the pricing inputs with the quote. The broker can compare offers with the key assumptions attached instead of repeating the calculation across separate files.

Market validation is part of that journey. Elexon Market Domain Data supports checks on electricity meter configuration and network details, while postcode and gas-zone information helps validate the regional fit. Incompatible configurations can be caught before submission to a supplier.

### Carry an accepted quote through to signature

When a customer chooses an offer, the portal compiles the customer, meter, payment, and quote details into the supplier's contract and the required letter of authority. Zoho Sign then reports document events such as sent, viewed, signed, or declined, allowing lead and customer records to follow the signature process without staff manually updating each step.

The same workflow supports multiple brokerages and agencies. Role-based access, tenant settings, white-label configuration, and commission splits let the platform reflect how brokers, agencies, agents, and introducers work together.

### Reconcile what suppliers pay

Supplier remittance statements arrive as spreadsheets, CSVs, or PDFs and may need OCR before their contents can be matched. The portal extracts payment and meter details, then compares them with contract uplift records so operations teams can identify discrepancies without rebuilding the trail by hand.

## Engineering decisions

### Keep supplier flexibility and quote consistency together

Supplier price books change independently, while quote searches rely on a stable set of fields. Keeping shared dimensions relational and supplier-specific details in JSONB gave the ingestion model room to evolve without making common pricing operations opaque.

### Process large files away from live requests

Price books containing lakhs of tariff rows, document generation, and OCR can take longer than an API request should. Redis and BullMQ move this work to background workers, where the portal can report progress and retry failures without blocking normal broker activity.

### Protect pagination and document state

CRM searches can span customers with several meters or utility sites. Joining every child record directly into a paginated parent search caused duplicate customers and unreliable page counts, so I separated parent filtering from batched child-record loading. Zoho Sign can also deliver repeated or out-of-order notifications; database-backed idempotency and state checks keep those events from applying the same transition twice or moving a document backward.

## Results

| Area | Operational change |
| --- | --- |
| Quote preparation | Spreadsheet comparison that took hours moved to a workflow completed in minutes. |
| Supplier onboarding | Manual file restructuring moved to configurable price-book ingestion. |
| Quote quality | Meter and market checks happen before supplier submission, reducing avoidable eligibility errors. |
| Contract execution | A signature process that could take days moved to digital completion within hours. |
| Commission checking | Manual remittance cross-checking moved into a repeatable reconciliation workflow. |

## Technology

Node.js, Express.js, PostgreSQL, Sequelize, Redis, BullMQ, AWS S3, Zoho Sign, PDFKit, and Tesseract OCR.
