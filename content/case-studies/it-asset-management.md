# InfraCore LAPS
A USB-assisted device inventory workflow with QR-based lookup through a web application.

## The business problem
An IT manager needed a consistent way to collect workplace PC details and look up asset records across multiple devices.

## What I built
- **PC inventory automation:** Created a PowerShell script to collect PC names, hardware specifications, and serial numbers, generate administrator password records in a predefined format, and export device and password records to a CSV file on a USB drive.
- **QR-based identification:** Automated HTML and QR code generation for each PC. QR codes contain protected lookup identifiers rather than exposing device details directly.
- **Asset lookup application:** Developed a web application that scans a device QR code with a phone camera and retrieves the corresponding PC record from the database.
- **Backend and database:** Used Node.js, Prisma ORM, and Supabase for backend and database operations.

## How the workflow fits together
A USB-based script collects device information and creates the records used by the inventory. Each PC receives a QR code with a protected lookup identifier. A phone scan opens the web application and retrieves the corresponding asset record.
