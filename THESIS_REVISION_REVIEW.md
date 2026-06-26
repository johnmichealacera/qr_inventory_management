# Thesis Revision Review — What You Got Right vs. What Still Needs Fixing

You applied many of the updates from `THESIS_ALIGNMENT_CHANGES.md` correctly — especially **Abstract**, **Purpose & Description (Key Features)**, **Objectives 5–7**, **Methodology iterations**, **Ch.2 role table**, and **partial Ch.5** (credentials + module matrix start).  

**Verdict:** Front matter (Abstract through Ch.4) is **mostly aligned**. **Chapter 5 and Chapter 6 still have significant outdated blocks** — do not submit until those are fixed.

---

## ✅ Done well (keep these)

| Section | What you fixed correctly |
|---------|--------------------------|
| **Abstract** | Staff/faculty requesters only; six roles; GSO Officer; canvassing/voucher; printable PR forms |
| **Ch.1 — Gap paragraph (partial)** | Self-service purchase path; staff/faculty (no students) in one clause |
| **Ch.1 — Key Features** | Dual inventory, purchase workflow, six roles, auditor read-only |
| **Ch.1 — Objectives** | Objective 5 roles list; new objective 7 for purchase requests |
| **Ch.1 — Limitations** | Canvassing/voucher scope; Faculty/Staff must link to requester profile |
| **Ch.1 — Significance (partial)** | Separate bullets for Admin, Custodian, GSO Officers |
| **Ch.2 — Role table** | All six roles with correct intended use |
| **Ch.4 — Requirements & iterations** | Six roles, purchase workflow, iterations 7–10 |

---

## 🔴 Must fix before proceeding

### Chapter 1

| Location | Problem | Fix |
|----------|---------|-----|
| **Introduction para 1** (line ~111) | Still ends with “administrators, custodians, **and auditors**” only | Add GSO Officer, Faculty, Staff requesters |
| **Gap paragraph** | Awkward run-on: “…staff and faculty **and no self-service**…” | Rewrite: “…staff and faculty; **additionally**, local systems often lack a self-service purchase request path…” |
| **Gap paragraph — closing sentence** | Still says only “**Admin, Custodian, and Auditor** roles” | Change to all **six** roles |
| **Project Context** | “where **staff** create items and categories” | Clarify: **custodians/GSO officers** manage items; **Staff** (login role) requests consumables |
| **Scope paragraph** | “role-based access control for **Administrator, Custodian, and Auditor** roles” only | Add **GSO Officer, Faculty, and Staff**; mention purchase request workflow and PR numbering |
| **Scope** | “staff**, and faculty” (comma) | “**staff and faculty**” |
| **Significance — Staff** | **Wrong content:** still says Staff “add items, generate QR codes, scan…” (that is **Custodian**) | **Rename to “Faculty & Staff (requesters)”** and describe: view consumables, submit requests, print PR form. **Do not** use “Staff” alone for custodian work |

### Chapter 2

| Location | Problem | Fix |
|----------|---------|-----|
| **Security — Wang paragraph** | “RBAC through **Admin, Custodian, and Auditor**” | “…through **six roles** including GSO Officer, Faculty, and Staff” |
| **Security — Farhadighalati paragraph** | “**three** well-separated roles” | “**Six** role-separated permissions” (table already has six) |
| **Audit — Fajar paragraph** | Still says “identifiable **student**” | “identifiable **staff or faculty requester**” |
| **Audit — David paragraph** | “serve **students** and faculty” | “serve **staff and faculty**” |
| **Synthesis — closing paragraph** | “dashboards for **Admin/Custodian/Auditor**” only | Include GSO Officer, Faculty/Staff requesters, purchase request workflow |
| **Throughout Ch.2** | Still uses “**borrower**” in places | Prefer “**requester**” when describing your system |

### Chapter 5 (largest gap — most of this chapter is still old)

| Location | Problem | Fix |
|----------|---------|-----|
| **Implementation summary** | “requesters (**students**, staff, and faculty)” | **Remove students** — staff and faculty only |
| **Navigation table** | **Incomplete** — cuts off after Transactions; missing Reports, Audit Logs, Users, Purchase request print | Complete the table from `THESIS_ALIGNMENT_CHANGES.md` |
| **Requester Registry (Fig. 12)** | Still **Student** person type; **Program/section** | **Staff or Faculty only**; **Office/unit (optional)** |
| **Custodian section** | “requesters (**students**, staff, faculty)” | Staff and faculty only |
| **Admin section** | Claims delete items/requesters in UI | Add note: delete controls **disabled in UI per panel feedback** (or remove delete claims) |
| **User Management** | Roles: “Admin, Custodian, Auditor” only | Add **GSO Officer, Faculty, Staff** |
| **Key Achievements §4 Security** | “(Admin, Custodian, Auditor)” only | Six roles |
| **Ch.5 Conclusion** | Grand Mean **4.89** (97.8%) | Must match evaluation table: **4.79** (95.8%) |
| **Ch.5 Key strengths** | “(**students**, staff, faculty…” | Staff and faculty only |
| **Missing sections entirely** | No dedicated write-up for new features | **Add** subsections: Faculty/Staff portal, GSO Officer interface, Purchase request workflow (status table), Printable purchase request form |

### Chapter 6

| Location | Problem | Fix |
|----------|---------|-----|
| **Enhanced UX** | “administrators; **staff** enjoy inventory management and QR scanning” | Distinguish **Custodian** (operations) vs **Faculty/Staff** (requests) vs **GSO Officer** (catalog + queue) |
| **System Validation** | Grand Mean **4.89** | Use **4.79** to match Ch.5 table |
| **Recommendations — PDF reports** | Listed as future only | Note: **HTML purchase request print** is implemented; full PDF batch export remains future work |

---

## 🟡 Should fix (quality & consistency)

| Item | Suggestion |
|------|------------|
| **Key Features bullet** | Remove informal “Unchanged (generation…)” — write full sentences for thesis tone |
| **Key Features** | `requireRole() / canManageInventory` — optionally add `canManageConsumables` for GSO Officer |
| **Scope — item deletion** | Add footnote: deletion logic exists server-side; **UI delete buttons disabled per panel** |
| **Ch.5 — Future enhancements item 6** | Change to: “Extended PDF export and accounting system integration” (since PR print exists) |
| **Comparison table** | “No role separation → Admin/Custodian/Auditor RBAC” | “→ Six-role RBAC” |
| **Reports filter list (Ch.5)** | Add **inventory type** filter (borrowable vs consumable) if you show it in demo |

---

## 🟢 Optional polish

- Typo: **BACHELOR OF SCIECNE** → SCIENCE (title page)
- Add **screenshots** for: My requests, Request queue, Printable PR form, GSO Officer consumables
- Add **Faculty** under Significance (you have GSO Officers and a confused Staff block)

---

## Section-by-section completion score

| Chapter / section | Status |
|-------------------|--------|
| Abstract | ✅ ~95% |
| Ch.1 Introduction (opening paras) | 🟡 ~70% |
| Ch.1 Purpose, Objectives, Scope, Limitations | ✅ ~85% |
| Ch.1 Significance | 🔴 ~50% (Staff block wrong; Faculty missing) |
| Ch.2 (role table) | ✅ Good |
| Ch.2 (prose around table) | 🔴 Still contradicts six roles |
| Ch.3 Technical Background | ✅ OK (no changes required) |
| Ch.4 Methodology | ✅ ~90% |
| Ch.5 Results | 🔴 ~40% (credentials/matrix partial; body largely old) |
| Ch.6 Conclusion | 🔴 ~50% |

---

## Recommended order before you proceed

1. Fix **Ch.5 implementation summary** + **Requester Registry** + **Custodian** (remove all “student” references)
2. **Complete navigation table** + add **4 new subsections** (Faculty/Staff, GSO Officer, workflow table, print form)
3. Fix **Grand Mean 4.79 vs 4.89** everywhere (Ch.5 + Ch.6)
4. Fix **Ch.2** leftover “student”, “three roles”, “borrower”
5. Fix **Ch.1 Significance** Staff vs Faculty & Staff requesters
6. Polish **Ch.1** opening paragraphs for six roles

---

## Quick search checklist (run in Word)

Search for these — **each hit should be reviewed**:

- [ ] `student` / `Student`
- [ ] `three role`
- [ ] `Admin, Custodian, and Auditor` (without GSO/Faculty/Staff)
- [ ] `Program / section`
- [ ] `borrower` (when you mean your registry)
- [ ] `4.89`
- [ ] `delete` (inventory/requester UI claims)

---

*Compared against implemented system and `THESIS_ALIGNMENT_CHANGES.md`. Update this file as you complete each fix.*
