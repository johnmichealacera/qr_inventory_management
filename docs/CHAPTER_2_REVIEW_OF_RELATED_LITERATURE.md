# CHAPTER 2  
# REVIEW OF RELATED LITERATURE

This chapter reviews scholarly and applied literature relevant to the **QR-Code Integrated Inventory Management System** for the **College of Criminology** equipment and supplies office. The review is organized thematically: digital inventory and tracking, web-based systems in organizational and Philippine contexts, QR code technology, security and role-based access control, and audit trails. Literature published from **2021 to 2026** is emphasized so that the theoretical foundation reflects current practice in information systems, inventory automation, and institutional governance.

The present study addresses persistent problems in manual inventory control—delayed recording, stock discrepancies, weak borrower accountability on issuance and return, and limited audit visibility. The reviewed works collectively justify a web-based, QR-enabled, role-secured, and audit-ready solution aligned with the objectives of this capstone project.

---

## Digital Inventory and Tracking Systems

Modern operations increasingly depend on digital inventory and tracking systems to replace paper ledgers, spreadsheets, and ad hoc counting. Compared with manual methods, digital systems reduce transcription errors, shorten the time between physical movement and recorded balance, and improve visibility for administrators and auditors.

**Tian and Wang (2022)** conducted an empirical study on the relationship between information technology (IT) capability and inventory management performance. Using survey data and structural analysis, they reported that IT capability positively influences inventory strategy and operational processes while helping reduce out-of-stock situations. Their findings support the argument that organizations that invest in integrated digital tools—not merely digitized forms—achieve more reliable inventory outcomes. For an academic equipment office, where issuance peaks at the start of terms and returns cluster at semester end, timely digital recording is essential to avoid stale stock figures.

**Destro, Staudt, Somensi, and Taboada (2023)** examined inventory record inaccuracy (IRI) and cycle counting in distribution centers. They showed that inaccuracies in recorded stock propagate into picking errors, lost sales risk, and capacity misallocation, and that structured counting policies can mitigate—but not always eliminate—IRI depending on warehouse type. Although their setting is industrial logistics, the underlying lesson applies to any inventory domain: **recorded quantity must stay aligned with physical movement**. The proposed system addresses this through transaction-level recording (IN, OUT, RETURN) rather than static stock fields edited by hand.

**Malang, Charoenkwan, and Wudhikarn (2023)** synthesized critical success factors for unmanned aerial vehicle (UAV) applications in warehouse management through a systematic literature review. While UAVs are not part of the current capstone scope, the review reinforces a broader trend: organizations pursue **automated identification and synchronization** to cope with growing item volumes and limited staff time. Handheld QR scanning at the equipment desk is a pragmatic, low-cost entry point on the same continuum—accurate identification without airborne infrastructure.

**Lin, Chang, and Huang (2024)** developed a UAV navigation and warehouse inventory system using reinforcement learning, linking automated capture with inventory updates. Again, the technology stack differs from this project, but the principle is consistent: **capture identity digitally, then update the central database immediately**. The QR-Code Integrated Inventory Management System applies that principle using browser-based scanning and server-side stock computation.

**Olanrewaju, Dollah, and Ajayi (2021)** designed a cloud-based inventory approach aimed at reducing under-stock and over-stock hazards. Cloud-hosted, web-accessible inventory aligns with the architectural choice of a **Next.js** application backed by **PostgreSQL**, enabling custodians to record transactions from any authorized workstation without maintaining local files.

Together, these studies establish that digital inventory systems improve accuracy, support operational decisions, and reduce dependence on error-prone manual tallies—core motivations for automating Criminology program equipment tracking.

---

## Web-Based Inventory Management in Organizational and Educational Settings

Web-based inventory systems have become a standard pattern for small and medium enterprises, government units, and academic departments because they require no client installation, support role-based access from the browser, and centralize data for reporting.

**Tanaman et al. (2023)** documented a web-based inventory management system for a multi-branch enterprise in Pagadian City, Philippines. The authors reported that manual paper-based recording caused data inaccuracy and inefficient report distribution, and that a web platform for electronic recording and automated reports addressed these gaps. The Philippine context is directly relevant: localized requirements (branch or section structure, straightforward reporting, limited IT staff) mirror constraints faced by a college equipment room.

**Fajar et al. (2025)** implemented a web-based inventory system with **QR code integration** and a sequential search algorithm at a regional revenue office in Indonesia. After simulation and field testing with ten respondents, they reported approximately **95% improvement in data recording accuracy**, **60% reduction in item search time**, and a **77.25** mean score on the System Usability Scale (SUS). Their work is especially pertinent because it combines **government asset stewardship**, **QR-assisted lookup**, and **measurable usability**—outcomes the present capstone can emulate through structured user evaluation.

**Anggara, Anshor, and Hadikristanto (2024)** designed a web-based QR-code information system for warehouse inventory using the **Rapid Application Development (RAD)** method at an industrial site. They emphasized reduced human error in recording and tracking and improved operational efficiency. The parallel to this study is clear: RAD and agile web development both prioritize iterative delivery with user feedback, which matches how the QR inventory system was shaped around custodian and auditor workflows.

**Choiriyati, Alfiah, Setiadi, and Supriadi (2026)** described digital transformation of inventory management through QR integration in web systems built with an **agile software development** model. They framed inventory modernization as an educational and organizational change process—not only a technical upgrade—which supports capstone narratives that stress training, role clarity, and adoption alongside software features.

**Agboola et al. (2022)** and **Johari and Aziz (2023)** reported web and IoT-oriented inventory platforms for small businesses, highlighting automation of stock monitoring and reduced manual entry. These works reinforce that **web dashboards, alerts, and centralized records** are achievable even with modest budgets, a realistic assumption for college-level deployment.

**David et al. (2023)** reviewed local government digital technology adoption strategies using a PRISMA-based synthesis. Although focused on e-governance broadly, their analysis underscores that public and semi-public institutions in the Philippines adopt digital systems when benefits in transparency, service delivery, and data integrity are clear. A Criminology equipment office functions as a steward of program assets; demonstrating traceable issuance and return strengthens institutional accountability in the same spirit as local digital governance reforms. Dashboard summaries, low-stock alerts, and exportable transaction reports provide **decision support through accurate, centralized data** in the same manner as e-governance dashboards described in recent Philippine IS literature.

For higher-education asset contexts, commercial and institutional practice (equipment checkout systems, multi-campus asset registers) consistently stresses **checkout/return workflows, maintenance history, and audit-ready logs**. The proposed system narrows that model to program-scoped inventory (Criminology equipment), **student borrowers**, and **QR identification**, making it a focused academic implementation rather than a generic enterprise suite.

---

## QR Code Technology in Inventory Management

Quick Response (QR) codes encode machine-readable identifiers in a compact graphic. Originally standardized for high-speed decoding in manufacturing and logistics, QR symbols are now common in retail, healthcare asset tagging, and institutional stockrooms because smartphones and inexpensive USB cameras can scan them without proprietary hardware.

**Yang, Jan, Chen, and Wang (2023)** developed a convolutional neural network (CNN) approach for QR code reading on packages in UAV logistics. Their work illustrates that QR remains a dominant carrier for **item identity** in automated supply chains. The capstone system uses QR values in the form `INV-{itemId}` to bind a physical label to a database row, eliminating manual keying during busy issuance periods.

**Pore, Patle, and Thorat (2026)** proposed a UAV-based QR scanning framework with inventory synchronization and safety-aware trajectory planning, reporting high simulated decode accuracy and measurable end-to-end latency. While the capstone does not deploy drones, the paper strengthens the academic claim that **QR-driven synchronization** is an active research area for keeping digital stock aligned with physical reality.

**Fajar et al. (2025)** and **Anggara et al. (2024)** (discussed above) provide direct evidence that **web + QR** combinations improve accuracy and search speed in real organizations. **Choiriyati et al. (2026)** further link QR-enabled web inventory to agile delivery, which matches iterative capstone development.

Operational benefits documented across these sources include:

- **Faster item lookup** at the point of issue or return  
- **Lower transcription error** compared with typing item names or serial numbers  
- **Consistent binding** between physical tag and digital record  
- **Support for printable labels** on uniforms, training gear, forensic kits, and documentation supplies relevant to Criminology programs  

The QR-Code Integrated Inventory Management System implements generation (PNG download on item detail), camera scanning (`html5-qrcode`), manual value entry as fallback, and API lookup (`GET /api/scan?value=...`), covering field conditions where lighting or device quality varies.

---

## Security, Authentication, and Role-Based Access Control

Inventory data—quantities, borrower identities, movement history—must be protected from unauthorized viewing or alteration. Security literature treats **authentication** (proving user identity) and **authorization** (granting appropriate permissions) as foundational.

**Wang (2026)** presented a formalized zoned role-based framework for integrated enterprise systems, covering analysis, design, implementation, maintenance, and access control. The framework argues that RBAC must be embedded across the system lifecycle, not added as an afterthought. The capstone applies RBAC through **Admin**, **Custodian**, and **Auditor** roles with server-side `requireRole()` checks and navigation filtered by role.

**Farhadighalati, Estrada-Jimenez, Nikghadam-Hojjati, and Barata (2025)** systematically reviewed access control models, describing RBAC, attribute-based models, and hybrid approaches used in modern applications. They note ongoing research into finer-grained, context-aware permissions. For this project, three well-separated roles match organizational reality: administrators configure users and structure; custodians run day-to-day issuance; auditors review reports and audit logs without mutating stock.

**Kalaria, Kayes, Rahayu, Pardede, and Shahraki (2024)** studied adaptive context-aware access control in IoT environments. Their results on reducing unauthorized access attempts support implementing **session-based login**, **password hashing (bcrypt)**, and **middleware route protection**—all present in the Auth.js v5 implementation.

**Patzelt et al. (2024)** designed an end-to-end audit trail framework for interconnected enterprise architectures, including pseudonymization considerations. Their work situates audit trails within **security architecture**, not optional logging. The capstone’s `AuditLog` model records user, action, entity, and details for mutations, accessible to Admin and Auditor roles.

Role mapping for this study:

| Role | Intended use |
|------|----------------|
| **Admin** | User management, full inventory and category control, item deletion, audit visibility |
| **Custodian** | Borrower registry, QR scanning, transaction recording, inventory maintenance (no user admin) |
| **Auditor** | Read-oriented oversight, filtered reports, CSV export, audit logs; no scanner or borrower admin |

This separation aligns with **Farhadighalati et al. (2025)** and **Wang (2026)** on least-privilege access and supports panel questions on how the system prevents custodians from altering user accounts or auditors from issuing equipment without trace.

---

## Audit Trails, Accountability, and Transparency

Accountability requires knowing **who** performed **what action**, **when**, and on **which record**. Audit trails support internal control, dispute resolution, accreditation documentation, and post-incident review.

**Patzelt et al. (2024)** emphasized comprehensive auditing across interconnected services, implementing frameworks that preserve traceability even when systems span multiple hosts. The capstone audit module is simpler in deployment but aligned in purpose: each create/update/delete on items, categories, borrowers, transactions, and users can generate an audit entry.

**Fajar et al. (2025)** noted that government inventory errors affect public trust and financial reporting; digital recording with QR lookup reduces ambiguity about which asset moved. Linking transactions to **registered borrowers** (student ID, name, program section) extends accountability from “stock decreased by five” to “five units issued to a identifiable student,” which manual logbooks often fail to capture consistently.

**David et al. (2023)** associated digital adoption in Philippine local government with improved transparency and service outcomes. Equipment offices that serve students and faculty benefit similarly when issuance and return are queryable, exportable (CSV reports), and visible on dashboards (recent transactions with borrower column).

Design implications drawn from the literature and implemented in this system:

- Immutable-style **transaction history** as the source of stock truth  
- **Audit logs** for administrative mutations  
- **Reports** filterable by item, type, borrower, and date range  
- **Export** for external review without granting edit rights  

---

## Transaction-Based Stock Logic and Borrower-Linked Movements

A distinctive design choice in this capstone—supported by inventory research—is **deriving on-hand quantity from movement transactions** rather than editing a static “quantity on hand” field.

**Destro et al. (2023)** showed that record inaccuracy undermines warehouse performance; continuous alignment between events and records is the remedy. The function `getItemStock(itemId)` aggregates IN and RETURN as additions and OUT as subtractions, then applies `max(0, stock)` to avoid displaying negative balances when data is incomplete.

**Fajar et al. (2025)** required accurate digital recording at a government office; borrower-linked issuance is the Criminology extension of that idea—**OUT** and **RETURN** require a registered borrower, while **IN** (receiving new stock) does not. Validation via **Zod** schemas and server rules prevents incomplete issuance records from entering the database.

Low-stock alerting (`currentStock <= reorderLevel`) connects operational literature on **reorder policies** with dashboard usability, giving custodians proactive notice before training or laboratory activities are disrupted.

---

## SYNTHESIS

The reviewed literature from **2021 through 2026** converges on several propositions that directly support the QR-Code Integrated Inventory Management System:

1. **Digital and web-based inventory** improves accuracy, speed, and reporting compared with manual methods (**Tian & Wang, 2022**; **Tanaman et al., 2023**; **Anggara et al., 2024**; **Fajar et al., 2025**).

2. **QR code integration** reduces search time and data-entry error in organizational settings (**Fajar et al., 2025**; **Anggara et al., 2024**; **Choiriyati et al., 2026**; **Yang et al., 2023**).

3. **Role-based access control and secure authentication** are necessary when inventory and borrower data must be protected (**Wang, 2026**; **Farhadighalati et al., 2025**; **Kalaria et al., 2024**).

4. **Audit trails and transaction histories** underpin accountability and transparency (**Patzelt et al., 2024**; **Destro et al., 2023**).

5. **Philippine institutional contexts** benefit from centralized, web-accessible systems that replace paper workflows and support governance goals (**Tanaman et al., 2023**; **David et al., 2023**).

The capstone system synthesizes these elements into a single deployment tailored to the **College of Criminology**: QR-labeled equipment, web dashboards for Admin/Custodian/Auditor, borrower-linked OUT/RETURN, transaction-based stock, CSV reporting, and comprehensive audit logging. Gaps in the literature—such as UAV-centric or blockchain-heavy architectures—are intentionally not adopted where simpler web QR and RBAC better fit the equipment room’s resources and skills.

Accordingly, the related literature provides a credible, current foundation for the problem statement, objectives, methodology, and expected contributions of this study. The panel can view the project not as an isolated programming exercise but as an applied information-systems response to documented challenges in inventory accuracy, identification technology, security, and accountability.

---

## REFERENCES

Anggara, B., Anshor, A. H., & Hadikristanto, W. (2024). Implementation web-based QR-code information system design in warehouse inventory management system using rapid application development (RAD) method at PT Dharma Precision Parts. *Formosa Journal of Computer and Information Science*, *3*(2). Source: https://doi.org/10.55927/fjcis.v3i2.10117

Agboola, F. F., Malgwi, Y. M., Mahmud, M. A., & Oguntoye, J. P. (2022). Development of a web-based platform for automating an inventory management of a small and medium enterprise. *International Journal of Research and Scientific Innovation*. Source: https://tinyurl.com/ybf5hh9u

Choiriyati, N., Alfiah, F., Setiadi, A., & Supriadi, A. (2026). Digital transformation of inventory management: QR code integration into web-based systems using agile software development model. *Journal Sensi: Strategic of Education in Information System*, *12*(1). Source: https://ejournal.raharja.ac.id/sensi/article/view/4360

David, A., Yigitcanlar, T., Li, R. Y. M., Corchado, J. M., Cheong, P. H., Mossberger, K., & Mehmood, R. (2023). Understanding local government digital technology adoption strategies: A PRISMA review. *Sustainability*, *15*(12), 9645. Source: https://www.mdpi.com/2071-1050/15/12/9645

Destro, I. R., Staudt, F. H., Somensi, K., & Taboada, C. (2023). The impacts of inventory record inaccuracy and cycle counting on distribution center performance. *Production*, *33*, e20220077. Source: https://www.redalyc.org/journal/3967/396773998017/html/

Fajar, M., Azhar, R., Anshori, Y., Laila, R., & Rinianty. (2025). Optimization of inventory management with QR code integration and sequential search algorithm: A case study in a regional revenue office. *Journal of Applied Informatics and Computing*, *9*(2), 412–420. Source: http://jurnal.polibatam.ac.id/index.php/JAIC/article/view/8919

Farhadighalati, N., Estrada-Jimenez, L. A., Nikghadam-Hojjati, S., & Barata, J. (2025). A systematic review of access control models: Background, existing research, and challenges. *IEEE Access*, *13*, 17777–17806. Source: https://doi.org/10.1109/ACCESS.2025.3533145

Johari, S., & Aziz, W. A. (2023). Design and development of IoT based inventory management system for small business. *International Journal of Research in Engineering and Science*. Source: https://tinyurl.com/4yvrjkpw

Kalaria, R., Kayes, A. S. M., Rahayu, W., Pardede, E., & Shahraki, A. S. (2024). Adaptive context-aware access control for IoT environments leveraging fog computing. *International Journal of Information Security*, *23*, 3089–3107. Source: https://doi.org/10.1007/s10207-024-00866-4

Lin, H. Y., Chang, K. L., & Huang, H. Y. (2024). Development of unmanned aerial vehicle navigation and warehouse inventory system based on reinforcement learning. *Drones*, *8*(6), 220. Source: https://doi.org/10.3390/drones8060220

Malang, C., Charoenkwan, P., & Wudhikarn, R. (2023). Implementation and critical factors of unmanned aerial vehicle (UAV) in warehouse management: A systematic literature review. *Drones*, *7*(2), 80. Source: https://doi.org/10.3390/drones7020080

Olanrewaju, R. F., Dollah, A. I., & Ajayi, B. A. (2021). Cloud-based inventory system for effective management of under and over-stock hazards. *International Journal of Scientific Research in Engineering and Management*. Source: https://tinyurl.com/yc7b4n5w

Patzelt, L., Neugebauer, G., Döll, M., Hack, S., Höner, T., & Schuba, M. (2024). A framework for E2E audit trails in system architectures of different enterprise classes. In *Proceedings of the 10th International Conference on Information Systems Security and Privacy (ICISSP 2024)* (pp. 750–757). SCITEPRESS. Source: https://www.scitepress.org/publishedPapers/2024/123670/

Pore, E., Patle, B. K., & Thorat, S. (2026). UAV-based QR code scanning and inventory synchronization system with safe trajectory planning. *Symmetry*, *18*(4), 548. Source: https://doi.org/10.3390/sym18040548

Tanaman, M. T., et al. (2023). Web-based inventory management system for a small business enterprise in Pagadian City, Philippines. *International Journal of Science and Advanced Information Technology*, *12*(5), 44–48. Source: https://www.warse.org/IJSAIT/static/pdf/file/ijsait021252023.pdf

Tian, X., & Wang, H. (2022). Impact of IT capability on inventory management: An empirical study. *Procedia Computer Science*, *199*, 142–148. Source: https://doi.org/10.1016/j.procs.2022.01.026

Wang, H. (2026). A formalized zoned role-based framework for the analysis, design, implementation, maintenance and access control of integrated enterprise systems. *Computers*, *15*(3), 187. Source: https://doi.org/10.3390/computers15030187

Yang, S. Y., Jan, H. C., Chen, C. Y., & Wang, M. S. (2023). CNN-based QR code reading of package for unmanned aerial vehicle. *Sensors*, *23*(10), 4707. Source: https://doi.org/10.3390/s23104707

---

*Note to the researcher: Verify each URL before final printing. Replace shortened URLs (tinyurl.com) with permanent DOI or institutional repository links where your college requires them.*
