# Thesis Alignment Guide — `thesis.txt` vs. Current System

Use this document as a **checklist** when revising your final capstone paper. Each section lists what is **outdated**, what the **system actually does now**, and **suggested replacement text** (copy/adapt as needed).

**Legend**

| Tag | Meaning |
|-----|---------|
| 🔴 **MUST** | Factual mismatch — panel/defense will notice if left unchanged |
| 🟡 **SHOULD** | Important for completeness; strengthens alignment with demo |
| 🟢 **OPTIONAL** | Polish, consistency, or minor wording |

---

## Quick reference — what changed in the system

| Area | Old thesis assumption | Current system |
|------|----------------------|----------------|
| **Roles** | 3 roles: Admin, Custodian, Auditor | **6 roles:** Admin, Custodian, Auditor, **GSO Officer**, **Faculty**, **Staff** |
| **Requesters** | Students, staff, and faculty | **Staff and faculty only** (no student requesters) |
| **Consumables** | Mentioned in scope | Full module: catalog, release log, **purchase request workflow** |
| **Faculty/Staff login** | Not described | Can **view consumables**, **submit requests**, **off-catalog requests**, **print PR form** |
| **GSO Officer** | Not described | Adds consumables, manages **request queue**, **canvassing / voucher** statuses |
| **Purchase requests** | Not described | Status pipeline + **PR number** + **printable purchase request form** |
| **Auditor** | Read-oriented | **Strictly read-only** on categories, inventory, consumables (no Add/Edit/Delete in UI) |
| **Item delete** | Admin can delete when stock 0 | **Delete UI commented out** per panel feedback (policy may remain in text as design rule) |
| **ID field** | “Student ID” | **ID number** (`idNumber`); optional **office/unit** (not program/section) |

**Demo accounts (add to Ch. 5 credentials table)**

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | password123 |
| Custodian | custodian | password123 |
| Auditor | auditor | password123 |
| GSO Officer | gso | password123 |
| Faculty | faculty | password123 |
| Staff | staff | password123 |

---

## ABSTRACT (lines 46–50)

### 🔴 MUST — Remove “students” and update role count

**Current (outdated):**
> …linking issued or released items to the **students, staff, or faculty** who received them.

**Replace with:**
> …linking issued or released items to registered **staff and faculty requesters** who received them.

---

### 🔴 MUST — Role-based access paragraph

**Current (outdated):**
> The system implements **three** role-based access levels — Administrator, Custodian, and Auditor…

**Replace with:**
> The system implements **six** role-based access levels — **Administrator, Custodian, Auditor, GSO Officer, Faculty, and Staff** — each restricted to the modules and operations their role permits, enforced at both the interface and API layers. **Custodians** handle day-to-day receive, issue, return, and release; **GSO Officers** manage the consumable catalog and purchase-request pipeline (canvassing and voucher); **Faculty and Staff** submit and track consumable requests online; **Auditors** perform read-only oversight with filtered reports and audit logs.

---

### 🟡 SHOULD — Add consumable request + printable form (1 sentence)

**Add after QR sentence:**
> Faculty and staff may request catalog or off-catalog consumables through a self-service workflow with statuses for **canvassing** and **voucher** processing, and **printable purchase request forms** for GSO records.

---

## CHAPTER 1 — INTRODUCTION

### Project context paragraph (line 111)

| Tag | Change |
|-----|--------|
| 🔴 | Remove any implication that **students** are requesters. |
| 🟡 | Add: **GSO Officer** role for procurement-side consumable management. |
| 🟡 | Add: **Faculty/Staff** self-service consumable requests (not only custodian-recorded releases). |

---

### Gap paragraph (line 113)

**Current (outdated):**
> …borrower-linked issuance and return tied to identifiable **students**, staff, or faculty…

**Replace with:**
> …requester-linked issuance, return, and consumable release tied to identifiable **staff and faculty**…

**Add gap addressed:**
> …and **no self-service purchase request path** for requesting departments — addressed through Faculty/Staff login, consumable request queue, and printable purchase request forms.

---

### PURPOSE AND DESCRIPTION — Key Features (lines 120–130)

🔴 **Replace entire “Key Features” block** or heavily revise. Current list is outdated (`Admin, Staff, Auditor`; single inventory module).

**Suggested replacement bullets:**

- **Dual inventory types:** Borrowable items (receive · issue · return) and consumables (receive · release), with separate navigation.
- **Requester registry:** Staff and faculty only — ID number, department, person type, optional office/unit.
- **Consumable purchase requests:** Faculty/Staff submit catalog or **off-catalog** requests; GSO Officer/Custodian/Admin process through **Pending → Canvassing → For voucher → Approved → Fulfilled** (or Rejected).
- **Printable purchase request form:** PR number (e.g. `PR-2026-0001`), requester details, item table, signature blocks — browser print.
- **QR code system:** Unchanged (generation, scan, manual fallback).
- **Role-based access:** Six roles with middleware route guards and server-side `requireRole()` / `canManageInventory` checks.
- **Auditor read-only:** View modules without create/edit/delete on master data.
- **Dashboard, reports, CSV export, audit logs:** Unchanged in spirit; note **inventory type** filter on reports where applicable.
- **User management:** Admin-only; roles include GSO Officer, Faculty, Staff.

---

### RESEARCH OBJECTIVES (lines 131–140)

| # | Tag | Suggested addition |
|---|-----|-------------------|
| General | 🟡 | Mention **consumable purchase requests** and **multi-role RBAC** (six roles). |
| 5 | 🔴 | **Current:** “administrators, staff, and auditors” — ambiguous with **Staff** login role. **Replace:** “administrators, custodians, GSO officers, faculty, staff requesters, and auditors” |
| New | 🟡 | **Optional 7th objective:** To enable faculty and staff to request consumables online and to support GSO procurement statuses (canvassing, voucher) with printable purchase request documentation. |

---

### SCOPE (line 143)

🔴 **Replace sentence:**
> A requester registry supports **students**, staff, and faculty…

**With:**
> A requester registry supports **staff and faculty** with required department and person type…

🟡 **Add to scope paragraph:**

- Login roles for **Faculty** and **Staff** with access to consumable catalog, **My requests**, and printable purchase request forms.
- **GSO Officer** role for adding consumable items and managing the **request queue** (canvassing, voucher, approval, fulfillment).
- **Consumable request** entity with unique **purchase request number** (`PR-YYYY-####`).
- **Auditor** read-only enforcement on categories, borrowable inventory, and consumables (UI and API).

🟡 **Deletion policy:** You may keep “item deletion limited to Admin when stock 0…” as a **design rule**, but add a footnote: *“Delete controls were disabled in the deployed UI per panel recommendation; deletion logic remains server-side for future activation.”*

---

### LIMITATIONS (line 145)

🟡 **Add:**
> The purchase request workflow models GSO canvassing and voucher stages but does not integrate with external accounting or voucher printing systems. Faculty and Staff accounts must be linked to a requester profile by an administrator before requests can be submitted.

---

### SIGNIFICANCE OF THE STUDY (lines 147–157)

🔴 **Rename/clarify “Staff” section (lines 149–150)** — today “Staff” means two things (generic office staff vs. **Staff** login role).

**Suggested structure:**

| Stakeholder | Significance |
|-------------|--------------|
| **Administrators** | User/role management, full oversight |
| **Custodians** | QR scanning, borrowable issue/return, consumable release, requester registry |
| **GSO Officers** | Consumable catalog, purchase request queue, canvassing/voucher statuses, printable PR forms |
| **Faculty & Staff (requesters)** | Self-service consumable requests without visiting the stockroom for every inquiry |
| **Auditors** | Read-only compliance review |

---

## CHAPTER 2 — REVIEW OF RELATED LITERATURE

### Throughout chapter

| Line area | Tag | Action |
|-----------|-----|--------|
| 161, 212 | 🔴 | Change “borrower accountability” → **requester accountability** where referring to *your* system |
| 178 | 🔴 | Remove “students, staff, and faculty” → **staff and faculty** |
| 205–206 | 🔴 | Remove “student ID, name, program section” / “identifiable student” → **employee/faculty ID, department, office/unit** |
| 196–201 | 🔴 | **Expand role table** to six roles (see table below) |

**Replacement role table (Ch. 2):**

| Role | Intended use |
|------|----------------|
| **Admin** | User management, full inventory/category control, audit visibility |
| **Custodian** | QR scanning, transactions, requester registry, borrowable + consumable release (no user admin) |
| **GSO Officer** | Consumable catalog (add/edit), purchase request queue, canvassing/voucher statuses, printable PR forms |
| **Faculty / Staff** | View consumables, submit and track purchase requests, print PR form (linked to requester profile) |
| **Auditor** | Read-only: dashboard, inventory, consumables, categories, transactions, reports, CSV, audit logs — **no mutations** |

🟡 **Synthesis (line 224):** Add consumable purchase requests and six-role RBAC to the numbered synthesis list.

---

## CHAPTER 4 — METHODOLOGY

### Phase 1 — Requirements (lines 287–294)

🔴 **Replace:**
> User roles: Admin, Staff, Auditor

**With:**
> User roles: Admin, Custodian, Auditor, GSO Officer, Faculty, Staff

🟡 **Add requirements:**
- Consumable purchase requests (catalog + off-catalog)
- Request status workflow: Pending, Canvassing, For voucher, Approved, Rejected, Fulfilled
- Printable purchase request form
- Faculty/Staff self-service portal (limited routes)

---

### Construction iterations (lines 303–309)

🟡 **Add iterations (defense narrative):**

| Iteration | Focus |
|-----------|--------|
| **7** | Split borrowable vs. consumable inventory; release log; requester person types (staff/faculty only) |
| **8** | Faculty/Staff login, My requests, consumable request API, middleware route guards |
| **9** | GSO Officer role, request queue, canvassing/voucher statuses, PR numbering, printable purchase request page |
| **10** | Auditor read-only UI hardening; panel-driven removal of delete buttons from UI |

---

## CHAPTER 5 — RESULTS AND DISCUSSION

This chapter needs the **most** revision.

### Implementation summary (line 326)

🔴 Remove “students, staff, and faculty” → **staff and faculty**.

---

### Demo credentials table (lines 337–341)

🔴 **Add rows:** GSO Officer (`gso`), Faculty (`faculty`), Staff (`staff`).

---

### Navigation / module matrix (lines 350–361)

🔴 **Replace table** with current modules:

| Module | Route | Admin | Custodian | GSO Officer | Auditor | Faculty | Staff |
|--------|-------|:-----:|:---------:|:-----------:|:-------:|:-------:|:-----:|
| Dashboard | /dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Borrowable inventory | /inventory | ✓ | ✓ | — | ✓ read | — | — |
| Consumables | /consumables | ✓ | ✓ | ✓ | ✓ read | ✓ | ✓ |
| My requests | /my-requests | — | — | — | — | ✓ | ✓ |
| Request queue | /consumable-requests | ✓ | ✓ | ✓ | — | — | — |
| Categories | /categories | ✓ | ✓ | — | ✓ read | — | — |
| Requesters | /borrowers | ✓ | ✓ | — | — | — | — |
| QR Scanner | /scan | ✓ | ✓ | — | — | — | — |
| Transactions | /transactions | ✓ | ✓ | — | ✓ read | — | — |
| Reports | /reports | ✓ | ✓ | — | ✓ | — | — |
| Audit logs | /audit-logs | ✓ | — | — | ✓ | — | — |
| Users | /users | ✓ | — | — | — | — | — |
| **Purchase request print** | /purchase-request/[id] | ✓* | ✓* | ✓* | — | ✓ own | ✓ own |

\*Reviewers; requesters can print **own** requests only.

---

### 🔴 NEW SECTIONS to add in Chapter 5

Copy these as new subsections (with screenshots when you defend):

#### A. Faculty and Staff Requester Portal
- Login → dashboard (request stats)
- Consumables catalog (read-only, **Request** button)
- **My requests** — catalog + off-catalog custom requests
- **Print** → `/purchase-request/[id]`

#### B. GSO Officer Interface
- Dashboard pending-request alert
- **Add consumable** (cannot manage borrowable inventory)
- **Request queue** — transition buttons: For canvassing, For voucher, Approve, Reject, Mark fulfilled
- **Print form** on each request

#### C. Consumable Purchase Request Workflow

| Status | Label | Typical next steps |
|--------|-------|---------------------|
| PENDING | Pending review | → Canvassing, For voucher, Approve, or Reject |
| CANVASSING | For canvassing | → For voucher or Reject |
| FOR_VOUCHER | For voucher | → Approve or Reject |
| APPROVED | Approved | → Fulfilled (after release/procurement) |
| REJECTED | Rejected | Closed |
| FULFILLED | Fulfilled | Closed |

#### D. Printable Purchase Request Form
- PR number, date, requester block, item/qty table, GSO remarks, signature lines
- Access: **Print purchase request** button (browser print)

---

### Requester registry (lines 451–472)

| Tag | Change |
|-----|--------|
| 🔴 | Title/body: remove **Student** person type |
| 🔴 | Person type: **Staff or Faculty only** |
| 🔴 | Rename **Program / section** → **Office / unit (optional)** |
| 🔴 | Field name: **ID number** (not student ID) |
| 🟡 | Note: Faculty/Staff **users** must be linked to a requester profile (`borrowerId`) to submit requests |
| 🟡 | Delete requester UI: **commented out** per panel — mention if asked |

---

### Admin / Custodian / Auditor sections (lines 363–402)

| Tag | Update |
|-----|--------|
| 🔴 | **Auditor:** explicitly state **no Add/Edit/Delete** on Categories, Inventory, Consumables |
| 🟡 | **Custodian:** add **Request queue** shared with Admin and GSO Officer |
| 🟡 | **Admin:** add **GSO Officer, Faculty, Staff** in user management roles list |
| 🟡 | Remove or footnote claims that Admin can **delete items/requesters via UI** if you keep UI disabled |

---

### 🔴 NEW: GSO Officer Dashboard subsection
Mirror Custodian subsection but emphasize: consumables + request queue only; no QR scanner in nav.

---

### API table (lines 613–625)

🟡 Add note: **POST consumable items** also allowed for **GSO Officer** (consumables only). Document consumable request server actions (no REST yet — server actions).

---

### Evaluation — Efficiency justification (line 644)

🔴 **Replace:** `studentId` → **idNumber** in indexed fields list.

---

### Key achievements (lines 685–709)

🟡 Add bullets:
- **Self-service consumable purchase requests** for faculty and staff
- **Procurement statuses** (canvassing, voucher)
- **Printable purchase request forms**
- **GSO Officer** role for consumable catalog management

---

### Limitations and future enhancements (lines 736–745)

| Tag | Change |
|-----|--------|
| 🟡 | **Item 6 “PDF reports”** — partially addressed: **printable HTML purchase request form** exists; PDF auto-generation remains future work |
| 🟢 | Item 7 (due dates for borrowable returns) — still valid future work |

---

### Conclusion within Ch. 5 (lines 746–753)

🔴 **Fix numeric inconsistency:**
- Table **Grand Mean: 4.79** (line 684) vs text **4.89 / 97.8%** (lines 749–750) — **pick one** and make consistent throughout Ch. 5 and Ch. 6.

🔴 Remove “students, staff, and faculty” in key strengths (line 752).

---

## CHAPTER 6 — CONCLUSION AND RECOMMENDATIONS

| Tag | Section | Action |
|-----|---------|--------|
| 🔴 | Key achievements | Mention **six roles**, **purchase request workflow**, **GSO Officer** |
| 🔴 | Enhanced UX paragraph | Replace generic “staff” with **Custodian, GSO Officer, Faculty, Staff requesters, Auditor** |
| 🟡 | Recommendations — Mobile app | Still valid |
| 🟡 | Recommendations — PDF reports | Narrow to “full PDF batch export / accounting integration” since PR print exists |
| 🟡 | System validation | Keep Grand Mean **4.79** if that matches your survey table |

---

## ITEMS TO SEARCH-AND-REPLACE IN `thesis.txt`

Run these find/replace passes (review each hit manually):

| Find | Replace with | Tag |
|------|--------------|-----|
| `students, staff, and faculty` | `staff and faculty` | 🔴 |
| `students, staff, or faculty` | `staff or faculty` | 🔴 |
| `Student, Staff, or Faculty` | `Staff or Faculty` | 🔴 |
| `student ID` | `ID number` | 🔴 |
| `Program / section` | `Office / unit` | 🔴 |
| `three role-based` | `six role-based` | 🔴 |
| `Admin, Staff, Auditor` (auth features) | `Admin, Custodian, Auditor, GSO Officer, Faculty, and Staff` | 🔴 |
| `borrower` (when meaning your registry) | `requester` | 🟡 |
| `Borrower` | `Requester` | 🟡 |
| `studentId` | `idNumber` | 🟡 (technical sections only) |

**Do not replace** “Faculty of College of Information Technology” — that refers to your college, not system roles.

---

## Suggested new figure list (for defense)

| Figure | Suggested screenshot |
|--------|---------------------|
| New | Faculty/Staff — Consumables catalog with **Request** button |
| New | My requests — off-catalog form + status badges |
| New | GSO Officer — Request queue with **For canvassing** / **For voucher** |
| New | Printable purchase request form (`/purchase-request/[id]`) |
| Update | Module matrix / sidebar showing 6 roles |
| Update | Requester form — Staff/Faculty only, office/unit field |

---

## Alignment with panel feedback (map to thesis)

| Panel feedback | Where to document in thesis |
|----------------|----------------------------|
| Faculty & Staff login + consumable requests | Ch.1 scope, Ch.5 new sections, Ch.6 |
| Off-catalog requests | Ch.1 purpose, Ch.5 consumable workflow |
| GSO Officer adds consumables | Ch.1, Ch.2 role table, Ch.5 |
| Canvassing & voucher statuses | Ch.1 scope, Ch.5 workflow table |
| Printable purchase request | Ch.5 new section; Ch.6 (reduce “future PDF” scope) |
| No student requesters | Abstract, Ch.1, Ch.2, Ch.5 requester section |
| Remove delete buttons | Ch.5 footnote on deletion policy; optional limitation |
| Auditor read-only | Ch.2 role table, Ch.5 Auditor section |

---

## Priority order for your revision session

1. 🔴 **Abstract** — students, three roles → six roles  
2. 🔴 **Ch.1 Scope + Purpose features** — requesters, roles, purchase workflow  
3. 🔴 **Ch.5** — credentials, module table, new subsections, requester form fields  
4. 🔴 **Ch.2 role table + student/borrower wording**  
5. 🟡 **Ch.4 iterations** — post-defense features  
6. 🟡 **Ch.5/Ch.6 Grand Mean consistency** (4.79 vs 4.89)  
7. 🟢 **Figures and screenshots** for new flows  

---

## Files in repo that match the live system

| File | Use when writing |
|------|------------------|
| `public/demo-flow.html` | Defense demo narrative (12 scenes, GSO, staff/faculty requesters) |
| `src/lib/constants.ts` | Role names, request status labels |
| `src/lib/roles.ts` | Permission helpers |
| `prisma/schema.prisma` | `ConsumableRequest`, `PersonType`, `requestNumber` |
| `prisma/seed.ts` | Demo accounts |

---

*Generated to align `thesis.txt` with the implemented system as of the post-defense enhancement cycle. Update this guide if you add more features.*
