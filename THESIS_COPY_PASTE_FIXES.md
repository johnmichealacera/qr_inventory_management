# Thesis Copy-Paste Fixes — Word-for-Word Replacements

Open your thesis in Word. For each item below: **select the OLD text**, delete it, **paste the NEW text** exactly.

Items are ordered top-to-bottom as they appear in the document.

---

## CHAPTER 1 — INTRODUCTION (first long paragraph)

### OLD (delete this entire paragraph ending):

```
Efficient inventory management is essential for the smooth operation of institutional units that steward office supplies, borrowable equipment, and consumable materials. The General Supplies Office, like many general supplies and stockroom operations, still relies on manual record-keeping, paper-based tracking, and scattered data in spreadsheets or logbooks. That approach delays visibility of on-hand balances, encourages inconsistent stock counts, makes item lookup slow at busy issuance periods, and weakens accountability when items are issued, returned, or released. This capstone proposes a QR-Code Integrated Inventory Management System—a web-based application that automates item registration with auto-generated QR codes, records movements through receive, issue, and return (and release for consumable supplies), links each outward movement to a registered requester, and provides dashboards, filterable reports, CSV export, and audit logs for administrators, custodians, and auditors. The system is scoped to General Supplies Office inventory as a whole, supports both borrowable items and consumable supplies, and is designed for deployment with modest infrastructure using a modern web stack and a centralized database.
```

### NEW (paste this):

```
Efficient inventory management is essential for the smooth operation of institutional units that steward office supplies, borrowable equipment, and consumable materials. The General Supplies Office, like many general supplies and stockroom operations, still relies on manual record-keeping, paper-based tracking, and scattered data in spreadsheets or logbooks. That approach delays visibility of on-hand balances, encourages inconsistent stock counts, makes item lookup slow at busy issuance periods, and weakens accountability when items are issued, returned, or released. This capstone proposes a QR-Code Integrated Inventory Management System—a web-based application that automates item registration with auto-generated QR codes, records movements through receive, issue, and return (and release for consumable supplies), links each outward movement to a registered requester, and provides dashboards, filterable reports, CSV export, and audit logs for administrators, custodians, GSO officers, faculty and staff requesters, and auditors. The system is scoped to General Supplies Office inventory as a whole, supports both borrowable items and consumable supplies, and is designed for deployment with modest infrastructure using a modern web stack and a centralized database.
```

---

## CHAPTER 1 — GAP PARAGRAPH (second paragraph of Introduction)

### OLD (delete this entire paragraph):

```
Despite this body of work, gaps remain between what the literature describes and what a general supplies office can adopt in practice. Many studies emphasize enterprise logistics, UAV-based scanning, IoT platforms, or cloud architectures that exceed the resources and skills of a small office-level stockroom. Local implementations often lack requester-linked issuance, return, and consumable release tied to identifiable staff and faculty and no self-service purchase request path for requesting departments — addressed through Faculty/Staff login, consumable request queue, and printable purchase request forms; transaction-derived stock instead of manually edited quantity fields; and role separation that matches real duties (administration, custodial operations, and read-only audit). Manual logbooks and generic spreadsheets rarely bind a physical label to a single database record through QR scanning, nor do they consistently enforce who released or received an item and when. The proposed system addresses these gaps by offering a focused, web-accessible, QR-enabled solution with Admin, Custodian, and Auditor roles, requester registry (including department and person type), transaction-based stock computation, consumable release tracking separate from borrowable issue/return, and comprehensive audit logging—without requiring proprietary hardware beyond a browser and camera.
```

### NEW (paste this):

```
Despite this body of work, gaps remain between what the literature describes and what a general supplies office can adopt in practice. Many studies emphasize enterprise logistics, UAV-based scanning, IoT platforms, or cloud architectures that exceed the resources and skills of a small office-level stockroom. Local implementations often lack requester-linked issuance, return, and consumable release tied to identifiable staff and faculty; additionally, they lack a self-service purchase request path for requesting departments—addressed in this system through Faculty and Staff login, a consumable request queue, and printable purchase request forms. Other common gaps include transaction-derived stock instead of manually edited quantity fields, and role separation that does not match real duties across administration, GSO procurement, custodial operations, faculty and staff self-service, and read-only audit. Manual logbooks and generic spreadsheets rarely bind a physical label to a single database record through QR scanning, nor do they consistently enforce who released or received an item and when. The proposed system addresses these gaps by offering a focused, web-accessible, QR-enabled solution with six roles—Administrator, Custodian, Auditor, GSO Officer, Faculty, and Staff—a requester registry limited to staff and faculty (including department and person type), transaction-based stock computation, consumable release tracking separate from borrowable issue and return, a purchase request workflow with canvassing and voucher statuses, and comprehensive audit logging—without requiring proprietary hardware beyond a browser and camera.
```

---

## CHAPTER 1 — PROJECT CONTEXT (first paragraph)

### OLD:

```
In many general supplies offices, manual tracking of inventory items leads to problems such as delayed stock updates, incomplete transaction records, and limited visibility into current stock levels. The increasing demand for efficient, transparent, and data-driven inventory management has led to the adoption of digital solutions in various organizations. However, many existing systems are either too expensive, lack QR code integration, or do not provide role-based access control tailored for supplies office workflows. The QR-Code Integrated Inventory Management System is designed to fill this gap by providing a customized web-based solution that integrates inventory management, QR code generation and scanning, transaction recording, and role-based dashboards. The system operates on a secure platform where staff create items and categories, scan QR codes to quickly record transactions, and administrators and auditors view reports and audit logs. This reduces the risk of data loss, unauthorized access, and delays in operational visibility.
```

### NEW:

```
In many general supplies offices, manual tracking of inventory items leads to problems such as delayed stock updates, incomplete transaction records, and limited visibility into current stock levels. The increasing demand for efficient, transparent, and data-driven inventory management has led to the adoption of digital solutions in various organizations. However, many existing systems are either too expensive, lack QR code integration, or do not provide role-based access control tailored for supplies office workflows. The QR-Code Integrated Inventory Management System is designed to fill this gap by providing a customized web-based solution that integrates inventory management, QR code generation and scanning, transaction recording, consumable purchase requests, and role-based dashboards. The system operates on a secure platform where custodians and GSO officers manage items and categories, custodians scan QR codes to record transactions, faculty and staff submit and track consumable requests online, and administrators and auditors view reports and audit logs. This reduces the risk of data loss, unauthorized access, and delays in operational visibility.
```

---

## CHAPTER 1 — PROJECT CONTEXT (second paragraph)

### OLD:

```
By replacing manual tracking with automated digital workflows and QR technology, the system enhances the efficiency and professionalism of supplies office operations. Staff can focus on issuing and receiving items, administrators can monitor stock levels and trends, and auditors can trace all actions through a comprehensive audit trail.
```

### NEW:

```
By replacing manual tracking with automated digital workflows and QR technology, the system enhances the efficiency and professionalism of supplies office operations. Custodians can focus on issuing, returning, and releasing items; GSO officers can manage the consumable catalog and purchase request pipeline; faculty and staff can request supplies through the system without visiting the stockroom for every inquiry; administrators can monitor stock levels and trends; and auditors can trace all actions through a comprehensive audit trail.
```

---

## CHAPTER 1 — KEY FEATURES (replace informal bullets)

### OLD bullet:

```
•	QR code system: Unchanged (generation, scan, manual fallback).
```

### NEW bullet:

```
•	QR code system: Automatic QR code generation on item creation, camera-based scanning via html5-qrcode, manual QR value entry as fallback, and scan API lookup for transaction pre-fill.
```

---

### OLD bullet:

```
•	Dashboard, reports, CSV export, audit logs: Unchanged in spirit; note inventory type filter on reports where applicable.
```

### NEW bullet:

```
•	Dashboard, reports, CSV export, and audit logs: Role-appropriate dashboards with summary cards and low-stock alerts; filterable transaction reports by date, item, type, requester, and inventory type (borrowable vs consumable); CSV export for official records; audit logs for administrative mutations (Admin and Auditor).
```

---

## CHAPTER 1 — SCOPE (full Scope paragraph — replace entire paragraph)

### OLD:

```
This study focuses on the design, development, and evaluation of the QR-Code Integrated Inventory Management System for the General Supplies Office. The scope includes digital inventory and category management performed by administrators and custodians; separate handling of borrowable items (issue and return) and consumable supplies (receive and release), including a consumable release log that records who received released stock; and automatic QR code generation for each item upon creation, with camera-based or manual QR lookup for transaction recording. The system implements secure user authentication and role-based access control for Administrator, Custodian, and Auditor roles, with dashboards, filterable reports, CSV export, and audit logs aligned to each role’s duties. A requester registry supports staff, and faculty with required department and person type, and outward movements (issue, return, and consumable release) are linked to registered requesters. Transaction types include IN (receive), OUT (issue or release), and RETURN for borrowable items only; on-hand quantity is computed from transaction history rather than stored as a manually edited stock field. Item deletion is limited to administrators and only when an item has zero stock and no transaction history, preserving data integrity for audit purposes. A REST API layer is also provided to support possible future mobile or external integration.
```

### NEW:

```
This study focuses on the design, development, and evaluation of the QR-Code Integrated Inventory Management System for the General Supplies Office. The scope includes digital inventory and category management performed by administrators, custodians, and GSO officers; separate handling of borrowable items (issue and return) and consumable supplies (receive and release), including a consumable release log that records who received released stock; and automatic QR code generation for each item upon creation, with camera-based or manual QR lookup for transaction recording. The system implements secure user authentication and role-based access control for Administrator, Custodian, Auditor, GSO Officer, Faculty, and Staff roles, with dashboards, filterable reports, CSV export, and audit logs aligned to each role’s duties. A requester registry supports staff and faculty with required department and person type (student requesters are excluded from scope). Faculty and Staff login roles may browse the consumable catalog, submit catalog or off-catalog purchase requests, track request status, and print purchase request forms; each Faculty or Staff user account must be linked to a requester profile by an administrator before requests can be submitted. The GSO Officer role manages the consumable catalog and the purchase request queue, including statuses for canvassing and voucher processing. Outward movements (issue, return, and consumable release) are linked to registered requesters. Each purchase request receives a unique reference number (e.g., PR-2026-0001). Transaction types include IN (receive), OUT (issue or release), and RETURN for borrowable items only; on-hand quantity is computed from transaction history rather than stored as a manually edited stock field. Item deletion is limited to administrators at the server layer and only when an item has zero stock and no transaction history; delete controls in the user interface were disabled per panel recommendation to reduce accidental data loss. Auditors have read-only access to master data and cannot create, edit, or delete categories, inventory items, or consumables through the interface. A REST API layer is also provided to support possible future mobile or external integration.
```

---

## CHAPTER 1 — SIGNIFICANCE OF THE STUDY (replace entire section through Future Researchers)

### OLD (delete from "Administrators:" through "...inventory management in office settings."):

```
Administrators:
This system provides a comprehensive platform for managing inventory, monitoring low stock, viewing transaction reports, and maintaining full audit trails for accountability. User/role management, full oversight.
Custodians:
QR scanning, borrowable issue/return, consumable release, requester registry
GSO Officers:
Consumable catalog, purchase request queue, canvassing/voucher statuses, printable PR forms
Staff:
Staff can efficiently add items, generate and download QR codes, scan items to record transactions, and view inventory status without manual paperwork. Self-service consumable requests without visiting the stockroom for every inquiry
Auditors:
Auditors can access audit logs and transaction history to verify compliance and trace all user actions with timestamps.
Organizations:
Automating inventory tracking and reporting reduces workload, eliminates manual errors, and ensures data-driven decision-making for supplies management.
Future Researchers:
This study serves as a reference for future improvements in inventory management and QR-based tracking systems, offering insights into system design, implementation, and impact.
The QR-Code Integrated Inventory Management System modernizes general supplies operations, ensuring efficiency, transparency, and accountability. With QR-based scanning, role-based access, and comprehensive reporting, it sets a new standard for inventory management in office settings.
```

### NEW (paste this):

```
Administrators:
This system provides a comprehensive platform for managing users and roles, monitoring low stock, viewing transaction reports, and maintaining full audit trails for accountability. Administrators perform full user management, oversee all modules, and retain the highest level of system access.

Custodians:
Custodians handle day-to-day General Supplies Office operations: QR scanning, borrowable issue and return, consumable receive and release, manual transaction recording, requester registry maintenance, and participation in the purchase request review queue alongside administrators and GSO officers. Custodians cannot manage user accounts or access audit logs in the navigation menu.

GSO Officers:
GSO Officers manage the consumable catalog by adding and editing consumable items, process the purchase request queue, advance requests through canvassing and voucher statuses, approve or reject requests, mark fulfilled requests after release or procurement, and generate printable purchase request forms for official GSO records. GSO Officers do not manage borrowable inventory or use the QR scanner in their default navigation.

Faculty and Staff (requester roles):
Faculty and Staff users with system login can browse the consumable catalog, submit requests for items already in the system, submit off-catalog purchase requests for items not yet in the catalog, track request status from pending review through canvassing, voucher, approval, and fulfillment, and print purchase request forms for documentation. This reduces repeated stockroom visits for status inquiries and standardizes how departments request supplies.

Auditors:
Auditors can access the dashboard, borrowable inventory, consumables, categories, transactions, reports, and audit logs in read-only mode. They can apply report filters and export CSV files for compliance review. They cannot create, edit, or delete master data, record transactions, access the requester registry module, or use the QR scanner.

Organizations:
Automating inventory tracking, purchase request processing, and reporting reduces workload, eliminates manual errors, and ensures data-driven decision-making for supplies management across requesting departments and units.

Future Researchers:
This study serves as a reference for future improvements in inventory management, QR-based tracking, and self-service procurement request workflows in institutional settings, offering insights into system design, implementation, and impact.

The QR-Code Integrated Inventory Management System modernizes general supplies operations, ensuring efficiency, transparency, and accountability. With QR-based scanning, six-role access control, consumable purchase requests, and comprehensive reporting, it sets a new standard for inventory management in office settings.
```

---

## CHAPTER 2 — Wang paragraph (Security section)

### OLD sentence:

```
The capstone applies RBAC through Admin, Custodian, and Auditor roles with server-side requireRole() checks and navigation filtered by role.
```

### NEW sentence:

```
The capstone applies RBAC through six roles—Administrator, Custodian, Auditor, GSO Officer, Faculty, and Staff—with server-side requireRole() checks, middleware route guards, and navigation filtered by role.
```

---

## CHAPTER 2 — Farhadighalati paragraph

### OLD sentence:

```
For this project, three well-separated roles match organizational reality: administrators configure users and structure; custodians run day-to-day issuance; auditors review reports and audit logs without mutating stock.
```

### NEW sentence:

```
For this project, six role-separated accounts match organizational reality: administrators configure users and structure; custodians run day-to-day issuance and release; GSO officers manage the consumable catalog and purchase request pipeline; faculty and staff submit and track consumable requests; and auditors review reports and audit logs without mutating stock or master data.
```

---

## CHAPTER 2 — Fajar paragraph (Audit Trails section)

### OLD sentence:

```
Linking transactions to registered requesters (employee/faculty ID, department, office/unit) extends accountability from “stock decreased by five” to “five units issued to a identifiable student,” which manual logbooks often fail to capture consistently.
```

### NEW sentence:

```
Linking transactions to registered requesters (employee or faculty ID number, department, office or unit) extends accountability from “stock decreased by five” to “five units issued to an identifiable staff or faculty requester,” which manual logbooks often fail to capture consistently.
```

---

## CHAPTER 2 — David paragraph

### OLD sentence:

```
Equipment offices that serve students and faculty benefit similarly when issuance and return are queryable, exportable (CSV reports), and visible on dashboards (recent transactions with borrower column).
```

### NEW sentence:

```
General supplies offices that serve staff and faculty across departments benefit similarly when issuance, release, and purchase requests are queryable, exportable (CSV reports), and visible on dashboards (recent transactions with requester information).
```

---

## CHAPTER 2 — Design implications bullet

### OLD:

```
•	Reports filterable by item, type, borrower, and date range
```

### NEW:

```
•	Reports filterable by item, type, requester, inventory type, and date range
```

---

## CHAPTER 2 — Section title (optional but recommended)

### OLD heading:

```
Transaction-Based Stock Logic and Borrower-Linked Movements
```

### NEW heading:

```
Transaction-Based Stock Logic and Requester-Linked Movements
```

---

## CHAPTER 2 — Synthesis closing paragraph (last paragraph before "Accordingly")

### OLD:

```
The capstone system synthesizes these elements into a single deployment tailored to the General Supplies Office: QR-labeled items, web dashboards for Admin/Custodian/Auditor, requester-linked OUT/RETURN and consumable release, transaction-based stock, CSV reporting, and comprehensive audit logging. Gaps in the literature—such as UAV-centric or blockchain-heavy architectures—are intentionally not adopted where simpler web QR and RBAC better fit the supplies office’s resources and skills.
```

### NEW:

```
The capstone system synthesizes these elements into a single deployment tailored to the General Supplies Office: QR-labeled items; web dashboards for Admin, Custodian, Auditor, GSO Officer, Faculty, and Staff; a requester registry limited to staff and faculty; requester-linked OUT, RETURN, and consumable release; a self-service consumable purchase request workflow with canvassing and voucher statuses; printable purchase request forms; transaction-based stock; CSV reporting; and comprehensive audit logging. Gaps in the literature—such as UAV-centric or blockchain-heavy architectures—are intentionally not adopted where simpler web QR and role-based access control better fit the supplies office’s resources and skills.
```

---

## CHAPTER 2 — Security opening sentence

### OLD:

```
Inventory data—quantities, borrower identities, movement history—must be protected from unauthorized viewing or alteration.
```

### NEW:

```
Inventory data—quantities, requester identities, movement history, and purchase request records—must be protected from unauthorized viewing or alteration.
```

---

## CHAPTER 2 — Audit Trails Patzelt sentence

### OLD:

```
The capstone audit module is simpler in deployment but aligned in purpose: each create/update/delete on items, categories, borrowers, transactions, and users can generate an audit entry.
```

### NEW:

```
The capstone audit module is simpler in deployment but aligned in purpose: each create, update, or delete on items, categories, requesters, transactions, consumable purchase requests, and users can generate an audit entry.
```

---

## CHAPTER 5 — Implementation Results opening paragraph

### OLD:

```
This section summarizes what was built and demonstrated in the working system. The application is a web-based solution using Next.js 16 (App Router), TypeScript, PostgreSQL, Prisma ORM, Auth.js v5 (NextAuth), Tailwind CSS v4, shadcn/ui, Zod validation, React Hook Form, qrcode (generation), and html5-qrcode (camera scanning). Inventory is managed for the General Supplies Office as a whole; requesters (students, staff, and faculty) are registered and linked to OUT (issuance), RETURN, and consumable release transactions.
```

### NEW:

```
This section summarizes what was built and demonstrated in the working system. The application is a web-based solution using Next.js 16 (App Router), TypeScript, PostgreSQL, Prisma ORM, Auth.js v5 (NextAuth), Tailwind CSS v4, shadcn/ui, Zod validation, React Hook Form, qrcode (generation), and html5-qrcode (camera scanning). Inventory is managed for the General Supplies Office as a whole; requesters (staff and faculty only) are registered and linked to OUT (issuance), RETURN, and consumable release transactions. Faculty and Staff users with login accounts may submit consumable purchase requests online, including off-catalog items not yet in the system, and print purchase request forms bearing a unique PR reference number (e.g., PR-2026-0001).
```

---

## CHAPTER 5 — Navigation table (replace incomplete table + add missing rows)

### DELETE your current table from "Module" through the line about Auditors and /scan.

### PASTE this complete table:

```
Module	Route	Admin	Custodian	GSO Officer	Auditor	Faculty	Staff
Dashboard	/dashboard	✓	✓	✓	✓	✓	✓
Borrowable inventory	/inventory	✓	✓	—	✓ read	—	—
Consumables	/consumables	✓	✓	✓	✓ read	✓	✓
My requests	/my-requests	—	—	—	—	✓	✓
Request queue	/consumable-requests	✓	✓	✓	—	—	—
Categories	/categories	✓	✓	—	✓ read	—	—
Requesters	/borrowers	✓	✓	—	—	—	—
QR Scanner	/scan	✓	✓	—	—	—	—
Transactions	/transactions	✓	✓	—	✓ read	—	—
Reports	/reports	✓	✓	—	✓	—	—
Audit Logs	/audit-logs	✓	—	—	✓	—	—
Users	/users	✓	—	—	—	—	—
Purchase request print	/purchase-request/[id]	✓	✓	✓	—	✓ own	✓ own
```

### PASTE this note after the table:

```
Auditors are redirected away from /scan via server layout protection even if the URL is entered manually. Faculty and Staff may print only their own purchase requests; Admin, Custodian, and GSO Officer may print any request in the queue.
```

---

## CHAPTER 5 — Admin-Exclusive Capabilities (replace bullet list)

### OLD:

```
Admin-Exclusive Capabilities:
•	Full user management (/users) 
•	Delete inventory items (Custodian cannot delete items) 
•	Delete requesters (when no linked transactions) 
•	Access to audit logs alongside Auditors
```

### NEW:

```
Admin-Exclusive Capabilities:
•	Full user management (/users), including assignment of GSO Officer, Faculty, and Staff roles and linking Faculty/Staff accounts to requester profiles
•	Access to audit logs alongside Auditors
•	Highest-level access to all operational modules including request queue and purchase request print

Note: Server-side rules allow item and requester deletion only when stock is zero and no transactions exist; delete buttons in the user interface were disabled per panel recommendation to prevent accidental data loss. Custodians cannot delete items or access user management.
```

---

## CHAPTER 5 — Custodian Can (replace bullet list)

### OLD:

```
Custodian Can:
•	View dashboard statistics and alerts 
•	Manage inventory (create/edit items; cannot delete) 
•	Manage categories 
•	Register and update requesters (students, staff, faculty) 
•	Use QR Scanner for fast issuance/return/receiving 
•	Record transactions manually 
•	View reports and export CSV
```

### NEW:

```
Custodian Can:
•	View dashboard statistics, alerts, and pending purchase request counts
•	Manage borrowable inventory (create/edit items; cannot delete via UI)
•	Manage categories
•	Register and update requesters (staff and faculty only)
•	Use QR Scanner for fast issuance, return, receiving, and consumable release
•	Record transactions manually
•	Process the consumable request queue (canvassing, voucher, approve, reject, fulfill) with Admin and GSO Officer
•	View reports and export CSV
```

---

## CHAPTER 5 — Custodian Security Features (replace)

### OLD:

```
Security Features:
•	Cannot access /users 
•	Cannot delete items or requesters (requester delete: Admin only) 
•	Session required for all server actions
```

### NEW:

```
Security Features:
•	Cannot access /users
•	Cannot delete items or requesters through the user interface (delete controls disabled per panel feedback)
•	Cannot access audit logs in navigation
•	Session required for all server actions
```

---

## CHAPTER 5 — Auditor Can / Cannot (replace both lists)

### OLD Auditor Can:

```
Auditor Can:
•	View dashboard, inventory, categories, transactions, and reports 
•	Apply report filters and export CSV 
•	View audit logs
```

### NEW Auditor Can:

```
Auditor Can:
•	View dashboard, borrowable inventory, consumables, categories, transactions, and reports in read-only mode
•	Apply report filters (including inventory type: borrowable vs consumable) and export CSV
•	View audit logs
```

### OLD Auditor Cannot:

```
Auditor Cannot:
•	Access Requesters or QR Scanner in navigation 
•	Record new transactions (“New Transaction” hidden) 
•	Manage users, categories, or items (no create/edit/delete actions where restricted by UI and server)
```

### NEW Auditor Cannot:

```
Auditor Cannot:
•	Access Requesters or QR Scanner in navigation
•	Record new transactions (“New Transaction” hidden)
•	Create, edit, or delete categories, borrowable inventory items, or consumables (no Add, Edit, or Delete buttons in the interface; enforced in UI and on the server)
•	Manage users or process the purchase request queue
```

---

## CHAPTER 5 — Inventory table Actions column note

### OLD:

```
•	Actions: view detail, show QR, delete (Admin only)
```

### NEW:

```
•	Actions: view detail, show QR (delete control disabled in UI per panel recommendation)
```

---

## CHAPTER 5 — Requester Registry (replace entire subsection from title through Business Rules)

### PASTE this whole block:

```
Requester Registry Interface
 Figure 12. Requester Management Interface
The requesters module (/borrowers) supports registration of staff and faculty required for issuance, return, consumable release, and online purchase request linking.

Register Requester Form:
•	Full name (required)
•	Person type: Staff or Faculty (required)
•	ID number (required, unique)
•	Department (required)
•	Office / unit (optional)
•	Contact phone (optional)

List View Columns:
•	Name
•	ID number
•	Person type
•	Department
•	Office / unit
•	Contact
•	Actions: edit (Admin and Custodian only; delete disabled in UI per panel feedback)

Business Rules:
•	Duplicate ID numbers rejected
•	Student requesters are not supported; only staff and faculty may be registered
•	Requester required on OUT, RETURN, and consumable release transactions (Zod refine on transactionSchema)
•	IN (receiving stock) does not require a requester
•	Faculty and Staff user accounts must be linked to a requester profile (borrowerId) before they can submit consumable purchase requests online
```

---

## CHAPTER 5 — NEW SUBSECTION: Faculty and Staff Requester Portal

### PASTE after Requester Registry section:

```
Faculty and Staff Requester Portal
 Figure 12a. Faculty/Staff — Consumables Catalog and My Requests
Faculty and Staff users log in with credentials assigned by the administrator and linked to a requester profile in the registry.

Consumables catalog (/consumables):
•	Read-only view of available consumable items with current stock and category
•	Request button on each item opens a dialog to submit quantity, notes, and justification
•	Link to My requests for off-catalog and status tracking

My requests (/my-requests):
•	List of all purchase requests submitted by the logged-in user with PR number, item description, quantity, status, and date
•	New custom request for items not in the catalog (off-catalog purchase request)
•	Print button opens the printable purchase request form in a new browser tab

Dashboard (/dashboard):
•	Summary counts: pending, approved, fulfilled, and total requests for the logged-in requester
•	Quick links to consumables catalog and custom request submission

Middleware restricts Faculty and Staff to /dashboard, /consumables, /my-requests, and /purchase-request/[id] only.
```

---

## CHAPTER 5 — NEW SUBSECTION: GSO Officer Interface

### PASTE after Faculty/Staff section:

```
GSO Officer Interface
 Figure 12b. GSO Officer — Consumables and Request Queue
The GSO Officer role supports procurement-side consumable management without full custodian transaction duties.

Dashboard (/dashboard):
•	Alert card showing count of purchase requests awaiting review (pending, canvassing, or for voucher)
•	Link to Request queue

Consumables (/consumables):
•	View consumable catalog
•	Add consumable button and edit item metadata (GSO Officers may only add and edit consumable items, not borrowable inventory)
•	No access to release log tab (custodian-only)

Request queue (/consumable-requests):
•	Summary cards: Pending, Canvassing, For voucher, Approved, Closed
•	Active requests table with PR number, requester, item, quantity, status, and date
•	Action buttons based on current status (see Purchase Request Workflow below)
•	Print form button for each request
•	GSO remarks textarea optional on each status change

Middleware restricts GSO Officers to /dashboard, /consumables, /consumable-requests, and /purchase-request/[id].
```

---

## CHAPTER 5 — NEW SUBSECTION: Purchase Request Workflow

### PASTE after GSO Officer section:

```
Consumable Purchase Request Workflow
 Figure 12c. Purchase Request Status Flow
Each purchase request receives a unique PR number upon creation (format PR-YYYY-####, e.g., PR-2026-0001).

Status definitions:
•	Pending review — newly submitted by Faculty or Staff; awaiting GSO action
•	For canvassing — GSO is sourcing suppliers or comparing prices (typical for off-catalog items)
•	For voucher — request approved for voucher processing; awaiting procurement completion
•	Approved — cleared for release from stock or procurement fulfillment
•	Rejected — request denied with optional GSO remarks
•	Fulfilled — stock released or procurement completed; request closed

Allowed transitions (enforced server-side):
•	Pending review → For canvassing, For voucher, Approved, or Rejected
•	For canvassing → For voucher or Rejected
•	For voucher → Approved or Rejected
•	Approved → Fulfilled

Catalog requests (existing consumable item) may move directly from Pending review to Approved when stock is available. Off-catalog requests typically progress through For canvassing and For voucher before Approved.
```

---

## CHAPTER 5 — NEW SUBSECTION: Printable Purchase Request Form

### PASTE after workflow section:

```
Printable Purchase Request Form
 Figure 12d. Printable Purchase Request Form
Route: /purchase-request/[id]

The printable purchase request form provides an official GSO document suitable for browser printing (Print to PDF or physical printer).

Form contents:
•	Header: General Supplies Office — Purchase Request Form
•	PR number and date requested
•	Current status (Pending review, For canvassing, For voucher, Approved, etc.)
•	Requester block: full name, ID number, person type (Staff/Faculty), department, office/unit, contact phone
•	Item table: description (catalog item name or off-catalog custom name and description), quantity, remarks
•	Off-catalog badge when item is not in the system catalog
•	GSO remarks section when reviewer has added notes
•	Signature blocks: Requested by, Processed by (GSO Officer), Approved by

Access control:
•	Faculty and Staff may print only their own requests
•	Admin, Custodian, and GSO Officer may print any request
•	Auditors do not have navigation access to this route

A Print purchase request button on the form page invokes the browser print dialog.
```

---

## CHAPTER 5 — Reports filter list

### OLD:

```
•	Transaction type (IN / OUT / RETURN) 
•	Requester (dropdown, includes “All requesters”)
```

### NEW:

```
•	Transaction type (IN / OUT / RETURN)
•	Inventory type (Borrowable / Consumable)
•	Requester (dropdown, includes “All requesters”)
```

---

## CHAPTER 5 — User Management roles line

### OLD:

```
•	Roles loaded from database: Admin, Custodian, Auditor 
•	Legacy “Staff” role label displayed as Custodian if present in old data
```

### NEW:

```
•	Roles loaded from database: Admin, Custodian, Auditor, GSO Officer, Faculty, Staff
•	When creating Faculty or Staff users, administrator may link account to existing requester profile for purchase request submission
```

---

## CHAPTER 5 — User Management delete bullet

### OLD:

```
•	Delete user with confirmation
```

### NEW:

```
•	Delete user with confirmation (Admin only; separate from disabled inventory/requester delete controls)
```

---

## CHAPTER 5 — Category Management delete bullet

### OLD:

```
•	Delete category (with server-side checks for items in use)
```

### NEW:

```
•	Delete category (server-side checks for items in use; delete button disabled in UI per panel feedback)
```

---

## CHAPTER 5 — Key Achievements section 4 Security

### OLD:

```
•	Role-based access control (Admin, Custodian, Auditor)
```

### NEW:

```
•	Role-based access control across six roles (Admin, Custodian, Auditor, GSO Officer, Faculty, Staff) with middleware route guards and server-side authorization
```

---

## CHAPTER 5 — Comparison table (replace second row block)

### OLD:

```
No role separation	Admin / Custodian / Auditor RBAC	Security and oversight
```

### NEW:

```
No role separation	Six-role RBAC (Admin, Custodian, Auditor, GSO Officer, Faculty, Staff)	Security, procurement oversight, and self-service requests
```

### DELETE duplicate empty row:

If you see two consecutive lines that both say only "Traditional Method | QR Inventory Management System | Improvement" with nothing between them, delete the duplicate.

---

## CHAPTER 5 — Limitations item 6 (Future enhancements)

### OLD:

```
6.	PDF reports — Printable official forms alongside CSV
```

### NEW:

```
6.	Extended PDF batch export and accounting system integration — HTML printable purchase request forms are implemented; full PDF report batches and voucher system integration remain future work
```

---

## CHAPTER 5 — Conclusion paragraph (replace)

### OLD:

```
The evaluation and implementation demonstrate that the QR-Code Integrated Inventory Management System meets the needs of the General Supplies Office: accurate stock tracking, requester-linked issuance, return, and consumable release, QR-assisted operations, and role-based security. The system transforms manual inventory practices into a structured, auditable, web-based process suitable for institutional supplies management.
```

### NEW:

```
The evaluation and implementation demonstrate that the QR-Code Integrated Inventory Management System meets the needs of the General Supplies Office: accurate stock tracking; requester-linked issuance, return, and consumable release; self-service consumable purchase requests with canvassing and voucher statuses; printable purchase request forms; QR-assisted operations; and six-role security. The system transforms manual inventory practices into a structured, auditable, web-based process suitable for institutional supplies management.
```

---

## CHAPTER 5 — Overall Assessment (replace entire block)

### OLD:

```
Overall Assessment:
•	Grand Mean: 4.89 out of 5.00 (97.8% satisfaction)
•	Verbal Description: Strongly Agree
•	System Status: Functional, deployment-ready for pilot use in the General Supplies Office
Key strengths include QR identification, transaction-based stock computation, requester registry integration (students, staff, faculty with department), borrowable and consumable inventory types, comprehensive reporting with CSV export, audit trails, and clear separation between operational (Custodian) and oversight (Auditor) roles.
```

### NEW:

```
Overall Assessment:
•	Grand Mean: 4.79 out of 5.00 (95.8% satisfaction)
•	Verbal Description: Strongly Agree
•	System Status: Functional, deployment-ready for pilot use in the General Supplies Office
Key strengths include QR identification; transaction-based stock computation; requester registry integration (staff and faculty with department and ID number); borrowable and consumable inventory types; self-service consumable purchase requests; GSO Officer–managed procurement statuses (canvassing and voucher); printable purchase request forms; comprehensive reporting with CSV export; audit trails; and clear separation between operational roles (Custodian, GSO Officer), self-service requesters (Faculty, Staff), and read-only oversight (Auditor).
```

---

## CHAPTER 6 — Enhanced User Experience paragraph

### OLD:

```
Enhanced User Experience: The modern, responsive interface serves all user roles effectively. Administrators benefit from dashboards and audit logs; staff enjoy inventory management and QR scanning; auditors have full access to audit trails. The role-based design ensures each user type has appropriate tools.
```

### NEW:

```
Enhanced User Experience: The modern, responsive interface serves all six user roles effectively. Administrators benefit from dashboards, user management, and audit logs. Custodians perform QR scanning and day-to-day transactions. GSO Officers manage the consumable catalog and purchase request queue. Faculty and Staff submit and track consumable requests and print purchase request forms without visiting the stockroom for every inquiry. Auditors review reports and audit trails in read-only mode. The role-based design ensures each user type has appropriate tools and cannot access functions outside their duties.
```

---

## CHAPTER 6 — System Validation paragraph

### OLD:

```
The ISO 9126 framework evaluation confirmed the system’s quality across all characteristics. The Grand Mean of 4.89 out of 5.00 (97.8% satisfaction rating) validates that the system successfully meets all stated objectives and exceeds user expectations across quality dimensions.
```

### NEW:

```
The ISO 9126 framework evaluation confirmed the system’s quality across all characteristics. The Grand Mean of 4.79 out of 5.00 (95.8% satisfaction rating) validates that the system successfully meets all stated objectives and exceeds user expectations across quality dimensions.
```

---

## CHAPTER 6 — Recommendations first bullet (Mobile Application)

### OLD:

```
Mobile Application: Develop a dedicated mobile app for staff to perform QR scanning and transactions on-the-go, including offline-capable transaction queuing.
```

### NEW:

```
Mobile Application: Develop a dedicated mobile app for custodians to perform QR scanning and transactions on-the-go, including offline-capable transaction queuing. Faculty and Staff mobile views could focus on purchase request submission and status notifications.
```

---

## CHAPTER 6 — Recommendations PDF/Export bullet

### OLD:

```
Export and Backup: CSV/Excel export of reports and scheduled database backups.
```

### NEW:

```
Export and Backup: Extended CSV/Excel export of reports, batch PDF generation for purchase requests, and scheduled database backups. Printable HTML purchase request forms are already available at /purchase-request/[id].
```

---

## TITLE PAGE TYPO

### OLD:

```
BACHELOR OF SCIECNE INFORMATION TECHNOLOGY
```

### NEW:

```
BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
```

---

## APPROVAL SHEET (optional consistency)

### OLD:

```
Dean, College of information Technology
```

### NEW:

```
Dean, College of Information Technology
```

---

*After pasting all blocks, run Find for: `student`, `Student`, `4.89`, `Program / section`, `borrower` (when meaning your registry), and `three role` — fix any remaining hits.*
