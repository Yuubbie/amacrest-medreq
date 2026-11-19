# NOMA AID NIGERIA INITIATIVE (NANI)
## ReqFlow — Digital Requisition, Multi-Level Approvals & Donor Grant Management System
### Executive Stakeholder Review & Demonstration Guide

---

## 1. Executive Summary & Purpose

This prototype demonstrates **NANI ReqFlow**, the purpose-built electronic procurement and requisition operating system engineered specifically for the operations of the **Noma Aid Nigeria Initiative (NANI)**.

Unlike generic commercial hospital systems, **NANI ReqFlow** solves the operational, clinical, logistics, and donor accounting realities unique to NANI:
1. **Donor Grant Code Traceability:** Every line item and voucher is mapped directly to international grant lines (e.g. `HN-2026-SURG-Q4`, `HN-2026-HOSP-Q4`, `HN-2026-OPS-Q4`) for zero-friction audit reporting (ECHO, MSF, WHO, bilateral donors).
2. **Specialized Hostel Patient Transport Requisition:** Fixed state-rated transport fares across northern and nationwide states for both **incoming (admission)** and **discharge (return)** movements. Supports multiple patients and caregivers in a single voucher with auto-calculated totals.
3. **5-Level Chain of Command with Digital Signature Watermarks:**
   - **Level 1:** Frontline Staff Requester (Auto-signed)
   - **Level 2:** Unit / Department Supervisor (1-click digital signature stamp)
   - **Level 3:** Finance & Grant Controller (Budget lock & grant ledger verification)
   - **Level 4:** Programme Coordinator (Executive cross-departmental clearance)
   - **Level 5:** National Coordinator (Escalated for capital/high-value expenditure > ₦500,000)
4. **Separate Internal Store Issue Pathway:** Direct store dispatches for cleaning chemicals, stationery, and gloves without creating cash bank disbursement records.
5. **Executive Forecasting & Projections:** Monthly, quarterly, and annual reporting with predictive burn rate analytics for donor budget renewal.

---

## 2. NANI Departmental & Unit Architecture

The system is configured to mirror NANI's official organizational structure:

| Department | Units Configured | Primary Operational Scope |
|---|---|---|
| **Facility** | Janitorial, Laundry, Gardening, Logistics/Fleet, Others | Ambulance fuel, fleet service, laundry hygiene, hospital sanitation |
| **Finance** | Finance | Grant ledger reconciliation, disbursement authorizations, budget locks |
| **Clinicals** | Pharmacy, Hostel, Social Assistance, Art & Craft, Dental Clinic, Physiotherapy, Nursing, Others | Surgical reconstruction supplies, patient transport fares, therapy kits |
| **Admin** | Kitchen, Admin, Others | Patient & staff meal provisions, office stationery, registry archiving |
| **Human Resources** | Reimbursement, Training, Loan, Others | Donor reporting workshops, staff welfare loans, travel expense claims |

---

## 3. Interactive Walkthrough Guide

To evaluate the prototype, follow these 5 demonstration pathways:

### Pathway 1: Raise a Patient Transport Requisition (Hostel Unit)
1. Navigate to **[Raise Requisition](https://amacrest-medreq.vercel.app/new-request)** (or from the Staff Portal).
2. Under **Clinicals**, select the **Hostel** unit. Notice the system automatically sets the pathway to **🚌 Hostel Patient Transport**.
3. In Step 2, observe the **Passenger Schedule**:
   - Add passengers with the **+ Add Passenger** button.
   - Toggle between **🏥 Patient** and **🤝 Caregiver**.
   - Select their **State of Origin** (e.g. Borno, Adamawa, Yobe, Sokoto).
   - Switch direction between **Incoming** and **Discharge**.
   - Observe the **Fixed Rate** and **Grand Total** update automatically based on official state distance rates.
4. Advance to Step 3 to review the digital signature stamp preview and submit.

### Pathway 2: Supervisor 1-Click Approval & Digital Signature Stamping
1. Open the **[Supervisor Desk](https://amacrest-medreq.vercel.app/hod)**.
2. Select any supervisor station across Clinicals, Facility, Admin, HR, or the Programme Coordinator.
3. Select any voucher in the queue and click **Sign & Approve**.
4. Observe the immediate digital signature watermark created: `[INITIALS]/APPR/[YEAR]` with timestamp, automatically advancing the voucher to Finance.

### Pathway 3: Finance Budget Lock & Donor Grant Allocation
1. Open the **[Finance Control Room](https://amacrest-medreq.vercel.app/finance)**.
2. Review the **Donor Grant Line Tracking Cards** (`HN-2026-SURG-Q4`, `HN-2026-HOSP-Q4`, `HN-2026-OPS-Q4`, etc.).
3. Inspect pending vouchers and click **Lock & Approve** to lock the grant code and route to the Coordinator.
4. Click **Export Donor Ledger (CSV)** to simulate generating audit spreadsheets for donor partners.

### Pathway 4: Internal Store Issue Workflow
1. Navigate to the **[Central Store Register](https://amacrest-medreq.vercel.app/inventory)**.
2. Search for any clinical consumable (e.g. Surgical Dressings, Bleach, Amoxicillin).
3. Click **Issue Store Requisition**, select the destination ward, choose quantity, and confirm.
4. Notice that available store stock is instantly decremented with zero bank cash outflow.

### Pathway 5: Executive Projections & Board PDF Reports
1. Go to **[Reports & Forecasting](https://amacrest-medreq.vercel.app/reports)**.
2. Toggle between **Monthly**, **Quarterly**, and **Annual** views.
3. Review the **Interactive Predictive Run-Rate Chart** showing actuals vs 2027 projected donor budget requirements.
4. Click **Download PDF** or **Print** to produce an executive-ready paper report for national officers and donor board reviews.

---

## 4. Key Questions & Feedback for AY and NANI Leadership

During your review of this prototype, we would appreciate confirmation on:
1. **Transaction Code Master List:** Does the dropdown in the requisition form cover all categories needed, or do you have a specific numerical/alpha code chart (e.g. MSF/UN standard)?
2. **State Transport Cost Table:** Are the sample rates for Borno, Yobe, Adamawa, Kano, Sokoto, etc., accurate to NANI's current transport subsidy policy?
3. **Approval Threshold Limits:** Is the ₦500,000 threshold for National Coordinator escalation appropriate, or should it be adjusted?
4. **Donor Report Formats:** Would your Chartered Accountant like specific column headers matching particular grant templates (e.g. ECHO Annex e3h2)?

---
*Noma Aid Nigeria Initiative (NANI) · ReqFlow System · Confidential Demo Document*
