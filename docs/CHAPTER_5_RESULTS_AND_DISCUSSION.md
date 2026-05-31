# CHAPTER 5  
# RESULTS AND DISCUSSION  
## Implementation Results and System Evaluation

This chapter presents the outcomes and achievements of the **QR-Code Integrated Inventory Management System** developed for the **College of Criminology** equipment and supplies office. It assesses the system’s effectiveness, accuracy, and efficiency in managing inventory through QR-assisted identification, borrower-linked issuance and return, and role-based access control. Key results obtained during implementation, deployment, and evaluation are discussed below.

> **Note for thesis preparation:** Insert screenshots of each interface in the **Appendices** (e.g., Appendix A: User Interface). Reference them in this chapter as **Figure 1**, **Figure 2**, and so on, matching the captions below.

---

## Implementation Results

This section summarizes what was built and demonstrated in the working system. The application is a web-based solution using **Next.js 16 (App Router)**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, **Auth.js v5 (NextAuth)**, **Tailwind CSS v4**, **shadcn/ui**, **Zod** validation, **React Hook Form**, **qrcode** (generation), and **html5-qrcode** (camera scanning). Inventory is scoped to the **CRIMINOLOGY** equipment program; students are registered as **borrowers** and linked to **OUT** (issuance) and **RETURN** transactions.

Please refer to the **Appendices** for sample inputs/outputs, screenshots of all user interfaces, and demo credentials.

---

## Authentication and Access Control

**Figure 1. System Authentication Interface**

The login page (`/login`) provides secure access control with role-based authentication. Only authorized personnel with valid credentials can enter the dashboard. **Auth.js v5** with a credentials provider and **JWT sessions** prevents unauthorized access and supports consistent session handling across protected routes.

**Key Features:**

- Username and password authentication  
- Input validation via **Zod** (`loginSchema`)  
- Secure session management (JWT strategy)  
- Redirect to `/dashboard` after successful login  
- Middleware protection for all non-public routes  
- Clear error message on invalid credentials  

**Demo Credentials (after `npm run db:seed`):**

| Role      | Username   | Password    |
|-----------|------------|-------------|
| Admin     | admin      | password123 |
| Custodian | custodian  | password123 |
| Auditor   | auditor    | password123 |

**Security Implementation:**

- Passwords hashed with **bcrypt** (12 rounds)  
- Server actions and API routes enforce `requireRole()` where applicable  
- Protected dashboard layout; unauthenticated users redirected to `/login`  

---

## Role-Based Navigation and Dashboard Layout

**Figure 2. Main Application Shell — Sidebar and User Session**

After login, users access a responsive **sidebar navigation** with role-filtered menu items (`Sidebar` component). The shell displays the application title **QR Inventory**, active route highlighting, user avatar/initials, role badge, and sign-out control.

**Navigation Modules (by route):**

| Module        | Route            | Admin | Custodian | Auditor |
|---------------|------------------|:-----:|:---------:|:-------:|
| Dashboard     | `/dashboard`     | ✓     | ✓         | ✓       |
| Inventory     | `/inventory`     | ✓     | ✓         | ✓       |
| Categories    | `/categories`    | ✓     | ✓         | ✓       |
| Borrowers     | `/borrowers`     | ✓     | ✓         | —       |
| QR Scanner    | `/scan`          | ✓     | ✓         | —*      |
| Transactions  | `/transactions`  | ✓     | ✓         | ✓       |
| Reports       | `/reports`       | ✓     | ✓         | ✓       |
| Audit Logs    | `/audit-logs`    | ✓     | —         | ✓       |
| Users         | `/users`         | ✓     | —         | —       |

\*Auditors are redirected away from `/scan` via server layout protection even if the URL is entered manually.

---

## Admin Dashboard Interface

**Figure 3. Admin Dashboard — Overview and Analytics**

The administrator dashboard (`/dashboard`) provides an at-a-glance view of inventory health and recent activity.

**Interface Components:**

- **Summary cards:** Total items, low stock count, total transactions  
- **Recent transactions table:** Item, type (IN/OUT/RETURN), quantity, borrower (when applicable), recorded-by user, date/time  
- **Low stock alert card:** Items at or below reorder level with current stock  

**Admin-Exclusive Capabilities:**

- Full **user management** (`/users`)  
- **Delete inventory items** (Custodian cannot delete items)  
- **Delete borrowers** (when no linked transactions)  
- Access to **audit logs** alongside Auditors  

---

## Custodian Dashboard Interface

**Figure 4. Custodian Dashboard — Operational Workflow**

The custodian role represents day-to-day equipment room operations (formerly “Staff” in early designs). Custodians share most operational modules with Admin except user management, audit log restriction (Custodian does not see Audit Logs in navigation), and item deletion.

**Custodian Can:**

- View dashboard statistics and alerts  
- Manage **inventory** (create/edit items; cannot delete)  
- Manage **categories**  
- Register and update **borrowers** (students)  
- Use **QR Scanner** for fast issuance/return/receiving  
- Record **transactions** manually  
- View **reports** and export CSV  

**Security Features:**

- Cannot access `/users`  
- Cannot delete items or borrowers (borrower delete: Admin only)  
- Session required for all server actions  

---

## Auditor Dashboard Interface

**Figure 5. Auditor Interface — Read-Oriented Oversight**

The auditor role supports compliance review and reporting without mutating inventory.

**Auditor Can:**

- View dashboard, inventory, categories, transactions, and reports  
- Apply **report filters** and **export CSV**  
- View **audit logs**  

**Auditor Cannot:**

- Access **Borrowers** or **QR Scanner** in navigation  
- Record new transactions (“New Transaction” hidden)  
- Manage users, categories, or items (no create/edit/delete actions where restricted by UI and server)  

This separation demonstrates **separation of duties** between operations (Custodian) and oversight (Auditor).

---

## Inventory Management Interface

**Figure 6. Inventory List Interface**

The inventory page (`/inventory`) lists all items under the **College of Criminology** equipment program (`equipmentProgram = "CRIMINOLOGY"`).

**Table Columns:**

- Item name (link to detail)  
- Category  
- Current stock (computed)  
- Reorder level  
- QR code quick view  
- Actions: view detail, show QR, delete (Admin only)  

**Visual Indicators:**

- Stock badges (normal vs. **low stock** / destructive styling when `currentStock ≤ reorderLevel`)  

**Figure 7. Add / Edit Item Form**

Routes: `/inventory/new` and edit via item detail actions.

**Form Fields:**

- Name (required)  
- Description (optional)  
- Category (required, select)  
- Reorder level (numeric, default 10)  

**On Create:**

- Item saved with `equipmentProgram: CRIMINOLOGY`  
- Unique QR value auto-generated: `INV-{itemId}`  
- Audit log entry: `CREATE_ITEM`  

**Figure 8. Item Detail Page**

Route: `/inventory/[id]`

**Sections:**

1. **Item information** — category, current stock, reorder level, status badge (In Stock / Low Stock)  
2. **Recent transactions** — type, quantity, borrower, user, date  
3. **QR code panel** — rendered PNG, download button, encoded value display  

**Item Detail Actions (Admin & Custodian):**

- Edit item metadata  
- Navigate to related workflows  

---

## Category Management Interface

**Figure 9. Category Management Interface**

The categories page (`/categories`) allows Admin and Custodian to organize inventory.

**Features:**

- List all categories  
- Create category (name validation via Zod)  
- Delete category (with server-side checks for items in use)  
- Audit logging on mutations  

**Sample Seed Categories (Criminology-themed):**

- Criminology — Uniforms & Gear  
- Criminology — Training Equipment  
- Criminology — Forensic Supplies  
- Criminology — Documentation  

---

## Borrower (Student) Registry Interface

**Figure 10. Borrower Management Interface**

The borrowers module (`/borrowers`) supports student/borrower registration required for issuance and return tracking.

**Register Borrower Form:**

- Full name (required)  
- Student ID (required, unique)  
- Program / section (optional)  
- Contact phone (optional)  

**List View Columns:**

- Name  
- Student ID  
- Program / section  
- Contact  
- Actions: edit (Admin & Custodian), delete (Admin only, blocked if transactions exist)  

**Business Rules:**

- Duplicate student IDs rejected  
- Borrower required on **OUT** and **RETURN** transactions (Zod `refine` on `transactionSchema`)  
- **IN** (receiving stock) does not require a borrower  

---

## QR Code Generation and Display

**Figure 11. QR Code Display on Item Detail**

Each inventory item receives a persistent QR record in the `qr_codes` table.

**Features:**

- Client-side PNG generation via `qrcode` library (300×300, margin 2)  
- Download as `qr-{item-name}.png` for printing labels  
- Unique value format: `INV-{cuid}`  
- Lookup API: `GET /api/scan?value=...`  

**Benefits:**

- Eliminates manual item ID entry errors  
- Supports physical labeling of equipment and supplies  
- Enables mobile camera scanning at the equipment room  

---

## QR Scanner Interface

**Figure 12. QR Scanner Page**

Route: `/scan` (Admin & Custodian only)

**Components:**

1. **Camera scanner** — `html5-qrcode` live viewfinder  
2. **Manual entry fallback** — paste or type QR value when camera unavailable  
3. **Scan result card** — item name, category, current stock, reorder context  

**Post-Scan Transaction Panel:**

- Action buttons: **Receive (IN)**, **Issue (OUT)**, **Return (RETURN)**  
- Quantity input  
- Notes (optional)  
- Borrower select (required for OUT and RETURN)  
- Submit with loading state and toast notifications  

**Validation at Scan Time:**

- Unknown QR → error toast  
- Insufficient stock on OUT → server error with current vs. requested quantity  
- Missing borrower on OUT/RETURN → client and server validation  

---

## Transaction Management Interface

**Figure 13. Transactions List and Recording**

Route: `/transactions`

**List Table Columns:**

- Item  
- Type (badge: Received / Issued / Returned)  
- Quantity  
- Borrower (name and student ID, or — for IN)  
- Notes  
- Recorded by  
- Date/time  
- Pagination (20 per page)  

**New Transaction Dialog (Admin & Custodian):**

- Item select  
- Type: IN, OUT, RETURN  
- Quantity  
- Borrower select (shown for OUT/RETURN)  
- Notes  

**Figure 14. Transaction Form Validation**

- Zod schema enforces minimum quantity of 1  
- Borrower required when type is OUT or RETURN  
- Server re-validates borrower existence and stock on OUT  

---

## Automated Stock Computation

**Figure 15. Stock Calculation Logic**

> Interactive diagram: [`docs/diagrams/figure-15-stock-calculation.html`](diagrams/figure-15-stock-calculation.html) — open in a browser for thesis screenshots.

Stock is **not stored as a static field**; it is derived from transaction history to ensure a single source of truth.

**Algorithm (`getItemStock`):**

```
stock = 0
For each transaction group by type for itemId:
  If type is IN or RETURN:
    stock += sum(quantity)
  If type is OUT:
    stock -= sum(quantity)
Return max(0, stock)
```

**Low Stock Detection:**

```
isLowStock = (currentStock <= reorderLevel)
```

**Dashboard Integration:**

- Summary **low stock count**  
- **Low stock alert** list with item names and quantities  

**Advantages:**

- Complete audit trail of how stock changed  
- Issuance and return automatically reflected  
- Prevents negative stock display (floored at zero)  

---

## Reports and Analytics Interface

**Figure 16. Reports — Filterable Transaction View**

Route: `/reports`

**Filter Controls:**

- Start date  
- End date  
- Item (dropdown)  
- Transaction type (IN / OUT / RETURN)  
- Borrower (dropdown, includes “All borrowers”)  
- Apply filters / Clear filters  

**Results Table:**

- Item, type, quantity, borrower, notes, recorded by, date  
- Result count summary  
- Pagination  

**Figure 17. CSV Export**

**Export CSV** link builds query string from active filters and downloads via:

`GET /api/reports/export?startDate=&endDate=&itemId=&type=&borrowerId=`

**CSV Columns:**

- Date (ISO)  
- Item  
- Type  
- Quantity  
- Borrower name  
- Student ID  
- Recorded by  
- Notes  

**Access:** Admin, Custodian, and Auditor (authenticated).

---

## Audit Logs Interface

**Figure 18. Audit Trail Interface**

Route: `/audit-logs` (Admin & Auditor)

**Logged Actions Include:**

- Item create / update / delete  
- Category mutations  
- Borrower create / update / delete  
- Transaction IN / OUT / RETURN  
- User create / update / delete  

**Table Columns:**

- Timestamp  
- User name  
- Action (color-coded badge by action type)  
- Entity and entity ID  
- Details (human-readable description)  
- Pagination  

**Purpose:**

- Accountability for equipment room staff  
- Support for internal audit and capstone defense demonstrations  

---

## User Management Interface

**Figure 19. User Management (Admin Only)**

Route: `/users`

**Features:**

- List users with name, username, role badge  
- Create user dialog: name, username, password, role assignment  
- Delete user with confirmation  
- Roles loaded from database: Admin, Custodian, Auditor  
- Legacy “Staff” role label displayed as Custodian if present in old data  

**Security:**

- `requireRole(["Admin"])` on all user mutations  
- Password minimum length validation (6+ characters)  

---

## REST API Layer

**Figure 20. API Architecture (for Mobile / Integration)**

> Interactive diagrams: [`docs/diagrams/system-architecture-visual.html`](diagrams/system-architecture-visual.html) (full system architecture with actors & hardware) · [`docs/diagrams/figure-20-api-architecture.html`](diagrams/figure-20-api-architecture.html) (API layers) — open in a browser for thesis screenshots.

The system exposes REST endpoints alongside server actions for future mobile clients.

| Method | Endpoint                 | Description              | Roles Allowed        |
|--------|--------------------------|--------------------------|----------------------|
| GET    | `/api/items`             | List items               | Authenticated        |
| POST   | `/api/items`             | Create item              | Admin, Custodian     |
| GET    | `/api/items/:id`         | Item details             | Authenticated        |
| PATCH  | `/api/items/:id`         | Update item              | Admin, Custodian     |
| DELETE | `/api/items/:id`         | Delete item              | Admin                |
| GET    | `/api/categories`        | List categories          | Authenticated        |
| POST   | `/api/categories`        | Create category          | Admin, Custodian     |
| GET    | `/api/transactions`      | List transactions        | Authenticated        |
| POST   | `/api/transactions`      | Create transaction       | Admin, Custodian     |
| GET    | `/api/reports/export`    | CSV export               | Admin, Custodian, Auditor |
| GET    | `/api/scan?value=...`    | QR lookup                | Authenticated        |
| *      | `/api/auth/[...nextauth]`| Auth.js handlers         | Public (auth routes) |

---

## Evaluation of the System

The system was evaluated using the **ISO/IEC 9126** software quality model, measuring: **functionality**, **efficiency**, **usability**, **reliability**, **maintainability**, and **portability**.

> **Important:** Replace the **Mean** values in the tables below with your actual survey results from evaluators (e.g., equipment custodians, faculty auditors, administrators). Use a 5-point Likert scale: 5 = Strongly Agree, 4 = Agree, 3 = Neutral, 2 = Disagree, 1 = Strongly Disagree.

### A. FUNCTIONALITY

| Criteria | Mean | Verbal Description |
|----------|------|--------------------|
| The system accurately tracks inventory stock from transactions | ___ | __________ |
| The system correctly links issuance and return to student borrowers | ___ | __________ |
| The system prevents unauthorized access to restricted functions | ___ | __________ |
| The system meets College of Criminology inventory tracking needs | ___ | __________ |
| QR scanning and lookup correctly identify inventory items | ___ | __________ |
| **Average Mean** | **___** | **__________** |

**Justification:** Transaction-based stock computation, borrower validation on OUT/RETURN, QR uniqueness, and role-based server enforcement ensure functional correctness aligned with the capstone requirements.

### B. EFFICIENCY

| Criteria | Mean | Verbal Description |
|----------|------|--------------------|
| The system processes transactions quickly | ___ | __________ |
| QR scan-to-record workflow reduces data entry time | ___ | __________ |
| Report filtering and export complete in acceptable time | ___ | __________ |
| Dashboard statistics load without noticeable delay | ___ | __________ |
| **Average Mean** | **___** | **__________** |

**Justification:** PostgreSQL with Prisma ORM, indexed unique fields (username, studentId, QR value), and server-side pagination support responsive operations during peak issuance periods.

### C. USABILITY

| Criteria | Mean | Verbal Description |
|----------|------|--------------------|
| The system is easy to learn for equipment room staff | ___ | __________ |
| Navigation and labels are clear | ___ | __________ |
| Forms provide helpful validation messages | ___ | __________ |
| The interface works well on desktop and mobile browsers | ___ | __________ |
| Role-specific menus reduce confusion | ___ | __________ |
| **Average Mean** | **___** | **__________** |

**Justification:** shadcn/ui components, Tailwind layout, toast feedback (Sonner), and role-filtered sidebar simplify training for custodians and auditors.

### D. RELIABILITY

| Criteria | Mean | Verbal Description |
|----------|------|--------------------|
| The system behaves consistently during repeated use | ___ | __________ |
| Data remains accurate after multiple IN/OUT/RETURN operations | ___ | __________ |
| Error messages clearly explain what went wrong | ___ | __________ |
| Audit logs provide trustworthy activity records | ___ | __________ |
| **Average Mean** | **___** | **__________** |

**Justification:** TypeScript type safety, Zod runtime validation, foreign keys in Prisma schema, and audit logging on mutations improve reliability and traceability.

### E. MAINTAINABILITY

| Criteria | Mean | Verbal Description |
|----------|------|--------------------|
| Code structure is organized and understandable | ___ | __________ |
| Database schema changes can be applied via migrations | ___ | __________ |
| New features can be added without major rework | ___ | __________ |
| **Average Mean** | **___** | **__________** |

**Justification:** Modular App Router structure (`app/`, `components/`, `server/`, `lib/`), Prisma migrations, and shared validation schemas support ongoing maintenance.

### F. PORTABILITY

| Criteria | Mean | Verbal Description |
|----------|------|--------------------|
| The system runs in standard web browsers | ___ | __________ |
| Installation steps are documented and reproducible | ___ | __________ |
| The system can be deployed to cloud or on-premise servers | ___ | __________ |
| **Average Mean** | **___** | **__________** |

**Justification:** Web-based deployment (Node.js + PostgreSQL), environment variables for configuration, and responsive CSS support multiple deployment targets (local lab, VPS, Vercel, etc.).

---

## System Evaluation Summary

| System Evaluation Criteria | Mean | Verbal Description |
|----------------------------|------|--------------------|
| Functionality | ___ | __________ |
| Efficiency | ___ | __________ |
| Usability | ___ | __________ |
| Reliability | ___ | __________ |
| Maintainability | ___ | __________ |
| Portability | ___ | __________ |
| **Grand Mean** | **___** | **__________** |

---

## Key Achievements

The QR-Code Integrated Inventory Management System addresses limitations of manual logbooks and spreadsheet tracking:

### 1. Accuracy and Accountability

- Transaction-derived stock eliminates duplicate stock fields  
- Borrower (student) linked to every issuance and return  
- Audit logs record who performed each action  
- QR codes reduce item misidentification  

### 2. Efficiency and Speed

- Scan-to-transaction workflow at the equipment room  
- Paginated lists for large transaction histories  
- One-click CSV export for reports  

### 3. Transparency and Oversight

- Auditor role for read-only review and export  
- Filterable reports by item, type, borrower, and date range  
- Item detail shows recent movement history  

### 4. Security and Reliability

- Role-based access control (Admin, Custodian, Auditor)  
- bcrypt password hashing and JWT sessions  
- Server-side authorization on mutations  
- Zod validation on all critical inputs  

### 5. User Experience

- Modern, responsive UI (Tailwind CSS v4 + shadcn/ui)  
- Low stock visual alerts on dashboard and inventory  
- Toast notifications for success and error feedback  
- Manual QR entry fallback when camera is unavailable  

---

## System Advantages

### Modern Technology Stack

- **Next.js 16** — App Router, server actions, API routes  
- **TypeScript** — Type-safe application code  
- **PostgreSQL + Prisma** — Reliable relational data and migrations  
- **Auth.js v5** — Industry-standard authentication patterns  
- **QR libraries** — `qrcode` + `html5-qrcode` for end-to-end QR workflow  

### Scalability

- Component-based React architecture  
- Normalized schema (users, roles, items, categories, borrowers, transactions, audit logs)  
- REST API ready for mobile scanner apps  
- Pagination on large datasets  

### Developer Experience

- Single repository with clear separation: `server/` business logic, `lib/` utilities, `components/` UI  
- Seed script for demo and defense (`npm run db:seed`)  
- Documented setup in README  

---

## Comparison with Traditional Methods

| Traditional Method | QR Inventory Management System | Improvement |
|--------------------|--------------------------------|-------------|
| Paper logbook for issuance | Digital transactions with borrower ID | Searchable, tamper-evident records |
| Manual stock counts | Automatic stock from IN/OUT/RETURN | Reduced counting errors |
| Typed item codes | QR scan or `INV-` value | Faster, fewer typos |
| Spreadsheet shared via USB | Central PostgreSQL database | Single source of truth |
| No role separation | Admin / Custodian / Auditor RBAC | Security and oversight |
| Handwritten reports | Filtered views + CSV export | Instant documentation |

---

## Limitations and Future Enhancements

While the system meets capstone objectives, possible extensions include:

1. **Mobile native app** — Dedicated Android/iOS scanner using existing REST API  
2. **Email/SMS notifications** — Low stock alerts to custodians and faculty  
3. **Barcode support** — Additional symbologies beyond QR  
4. **Multi-program inventory** — Extend beyond Criminology with program filter UI  
5. **Advanced analytics** — Charts for issuance trends, borrower history, seasonal demand  
6. **PDF reports** — Printable official forms alongside CSV  
7. **Due dates and overdue returns** — Automatic reminders for unreturned equipment  
8. **Bulk QR label printing** — PDF sheet generation for entire categories  

---

## Conclusion

The evaluation and implementation demonstrate that the **QR-Code Integrated Inventory Management System** meets the needs of the College of Criminology equipment office: accurate stock tracking, borrower-linked issuance and return, QR-assisted operations, and role-based security. The system transforms manual inventory practices into a structured, auditable, web-based process suitable for academic and administrative use.

**Overall Assessment (complete after survey):**

- **Grand Mean:** ___ out of 5.00  
- **Verbal Description:** __________  
- **System Status:** Functional, deployment-ready for pilot use in the equipment room  

**Key strengths** include QR identification, transaction-based stock computation, borrower registry integration, comprehensive reporting with CSV export, audit trails, and clear separation between operational (Custodian) and oversight (Auditor) roles.

The project demonstrates successful application of modern web development practices—**Next.js**, **TypeScript**, **Prisma**, and **user-centered design**—to solve a real institutional inventory problem within the capstone scope.

---

## Appendix Reference Checklist (Screenshots to Capture)

Use this checklist when preparing thesis appendices. Each item corresponds to a **Figure** caption in this chapter.

| Figure | Screenshot Description |
|--------|------------------------|
| Figure 1 | Login page |
| Figure 2 | Sidebar navigation (show role badge) — Admin view |
| Figure 3 | Dashboard — Admin (summary cards + recent transactions + low stock) |
| Figure 4 | Dashboard — Custodian (same modules, note missing Audit Logs/Users) |
| Figure 5 | Dashboard / Reports — Auditor (no New Transaction button) |
| Figure 6 | Inventory list with stock badges |
| Figure 7 | Add item form |
| Figure 8 | Item detail (info + recent transactions + QR panel) |
| Figure 9 | Categories management |
| Figure 10 | Borrowers list and register dialog |
| Figure 11 | QR code display with download |
| Figure 12 | QR Scanner (camera + manual entry + scan result) |
| Figure 13 | Transactions list with borrower column |
| Figure 14 | New transaction dialog (OUT with borrower required) |
| Figure 15 | Low stock alert / stock badge example |
| Figure 16 | Reports with filters applied |
| Figure 17 | CSV file opened in Excel/LibreOffice |
| Figure 18 | Audit logs table |
| Figure 19 | User management (Admin) |
| Figure 20 | Optional: API test in Postman or browser network tab |

---

*Document generated for thesis Chapter 5 — QR-Code Integrated Inventory Management System. Align figure numbers with your institution’s formatting guidelines before final submission.*
