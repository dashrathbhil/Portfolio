# AUC — All Utilities Collection

AUC is a UK utility debt recovery and field-operations platform. As a **Senior Backend Developer**, I owned the database architecture and built backend workflows that connect supplier portfolios, office teams, field agents, recovery payments, and client reporting.

## Business context

Utility debt recovery is a coordinated operation between energy suppliers, agency teams, and field agents. An account is more than a balance: teams need to allocate it to an agent who can cover the location, record the result of a visit, capture meter and site evidence, follow up within service windows, and account for payments and commission later.

Before AUC, much of that coordination happened through spreadsheets, paper route sheets, calls, and email. Office managers manually divided large account lists by postcode, while agents worked without a shared live view for their managers. Visit notes, meter readings, and photos could arrive days later and become separated from the account or the time and place of the visit. Follow-up and payment attribution were difficult to audit when accounts moved between agents.

That gap had operational consequences. Teams needed evidence that could be reviewed with its visit context, visibility into where work stood during the day, and a dependable way to see which accounts required follow-up. AUC was built around that full operating path rather than treating allocation, field visits, payments, and reporting as separate tools.

## The platform workflow

An imported portfolio moves through assignment, field activity, recovery, and reporting in one system. Access to accounts and live activity follows the relevant organization and operational role.

### Allocate work to the right coverage area

The allocation engine matches accounts to field-agent coverage using UK outward postcode areas, configured debt thresholds, and account age. Geographic and distance guardrails flag work outside an agent's operating area, helping managers avoid assignments that are unlikely to be practical.

### Record the visit with its evidence

Agents record when a visit starts and ends, what happened at the site, meter readings, and relevant conditions such as whether a business is trading, a customer may be vulnerable, or a meter may have been tampered with. Notes, photos, and other evidence are attached to the visit and account rather than sent separately for later matching.

Visit records tie the evidence to the account, visit time, and recorded location. Images are validated and processed before they are stored in private AWS S3 storage; time-limited signed links control access for authorized users. This gives office teams a more complete evidence trail for review and warrant preparation.

### Give managers a live operational view

Agents' devices send location and activity updates through Socket.io. Managers can see the relevant field activity in real time, while organization-, debt-head-, and collector-scoped rooms keep updates within the appropriate operational boundary. Active locations support the live view; historical location records are written in batches for later review.

### Follow recovery through payment and reporting

The platform supports settlements, installment schedules, and direct-debit details. Commission is attributed to the agent assigned to the account on the date a payment is made, preserving the correct history if the account is transferred later.

Scheduled jobs handle dormant-account follow-up and alerts. End-of-day and high-debt reporting combines account, visit, and recovery activity into Excel and PDF outputs for storage and client delivery. Daily snapshots retain performance history so teams can review activity consistently over time.

## Engineering decisions

### Keep live tracking responsive and auditable

Persisting every GPS update directly to the database would put unnecessary write pressure on a workflow that needs a responsive live view. Active positions are held for immediate delivery, while history is stored in batches. Room scoping also means each update reaches only the teams authorized to see it.

### Control the workload of large reports

Client reports combine large portfolios with visit and payment details. I bounded report concurrency, controlled agent-level aggregation, and used streamed spreadsheet generation so reporting work could run predictably without overwhelming the application or delaying other organizations.

### Keep evidence connected to the account and visit

For an operational review, a photo alone is not enough; teams need its account, visit, time, and location context. The backend processes images before private storage and keeps them linked to the visit, with access granted through time-limited links instead of public files.

## Results

| Area | Operational change |
| --- | --- |
| Portfolio allocation | Multi-day manual assignment moved to an automated workflow measured in hours. |
| Field visibility | Delayed status calls gave way to live location and visit updates for authorized managers. |
| Visit evidence | Paper and disconnected media moved into account-linked digital records ready for review. |
| Dormant accounts | Spreadsheet follow-up moved to scheduled service-window checks and alerts. |
| Client reporting | Manual report compilation moved to scheduled, repeatable delivery. |

## Technology

Node.js, Express.js, PostgreSQL, Sequelize, Socket.io, AWS S3, Sharp, Node-Cron, P-Queue, ExcelJS, PDF-Lib, and Puppeteer.
