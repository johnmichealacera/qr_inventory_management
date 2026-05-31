# ABSTRACT

The College of Criminology's equipment office relied on paper ledgers and verbal reporting to track program equipment — a practice prone to stock discrepancies, untracked issuances, and weak borrower accountability. This study presents the design, development, and evaluation of a **QR-Code Integrated Inventory Management System** built to replace that manual workflow.

The system is a web-based application developed using the **Rapid Application Development (RAD)** methodology, implementing three role-based access levels — **Administrator**, **Custodian**, and **Auditor** — enforced at both the interface and API layers. Each inventory item is automatically assigned a unique **QR code** upon creation, enabling custodians to scan and identify items instantly during issuance or return. Stock levels are derived in real time from a transaction ledger of **IN**, **OUT**, and **RETURN** movements, with every OUT requiring a linked student **borrower** to establish chain of custody. An audit log records all system activity with the responsible user and timestamp. Administrators and Auditors may filter and export transaction history as **CSV** for official reporting.

Evaluation using the **ISO 9126** software quality model yielded strong acceptance ratings across functionality, usability, reliability, and maintainability among College of Criminology faculty and staff respondents, affirming the system as a viable and accountable replacement for manual equipment tracking.

**Keywords:** inventory management system, QR code, role-based access control, borrower tracking, web-based system, College of Criminology, Rapid Application Development
