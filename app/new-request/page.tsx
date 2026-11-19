'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  naniDepartments, 
  stateTransportRates, 
  transactionCodes, 
  currentUser,
  formatCurrency,
  departmentSupervisors
} from '@/lib/mock-data';
import { addStoredRequest, getStoredUser } from '@/lib/storage';
import { Request, RequestItem, TransportPassenger, EducationStudentRow, RequisitionType } from '@/lib/types';
import { 
  Building2, ShieldCheck, Heart, DollarSign, Users, 
  Check, ChevronRight, ChevronLeft, AlertTriangle, Plus, 
  Trash2, Info, Sparkles, FileText, Bus, Package, Calendar, 
  UserCheck, CheckCircle2, ArrowRight, Printer, GraduationCap,
  Layers, Clock, Send
} from 'lucide-react';

interface LineItem {
  id: string;
  sn: number;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  transactionCode: string;
}

interface TransportPassengerRow {
  id: string;
  sn: number;
  name: string;
  type: 'patient' | 'caregiver';
  stateOfOrigin: string;
  direction: 'incoming' | 'discharge';
  cost: number;
}

interface EducationStudentRowState {
  id: string;
  sn: number;
  patientName: string;
  schoolName: string;
  classLevel: string;
  supportType: 'School Fees / Tuition' | 'Uniform & Footwear' | 'Textbooks & Stationery' | 'Full Schooling Package';
  cost: number;
}

const deptIcons: Record<string, any> = {
  facility: Building2,
  finance: DollarSign,
  clinicals: Heart,
  admin: Building2,
  hr: Users,
};

export default function NewRequestPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [createdReqId, setCreatedReqId] = useState('NANI-REQ-088');

  // ── Active Department & Unit State (Defaults automatically to logged-in user) ──
  const [selectedDeptId, setSelectedDeptId] = useState('clinicals');
  const [selectedUnit, setSelectedUnit] = useState('Hostel');
  const [requisitionType, setRequisitionType] = useState<RequisitionType>('transport');
  const [urgency, setUrgency] = useState<'routine' | 'priority' | 'stat'>('routine');

  // ── Requisition Header Metadata ──
  const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const [reqDate, setReqDate] = useState(todayFormatted);
  const [requesterName, setRequesterName] = useState('Mr. Samuel Danladi');
  const [requesterRole, setRequesterRole] = useState('Hostel & Patient Logistics Officer');
  const [defaultTransCode, setDefaultTransCode] = useState('TRN-001');
  const [donorGrantCode, setDonorGrantCode] = useState('HN-2026-HOSP-Q4');
  const [justification, setJustification] = useState('');

  // ── Standard Line Items ──
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', sn: 1, name: 'Sterile Wound Dressing Packs (10x10cm)', quantity: 50, unit: 'Packs', unitPrice: 1200, transactionCode: 'MED-002' },
    { id: '2', sn: 2, name: 'Povidone-Iodine Antiseptic (500ml)', quantity: 20, unit: 'Bottles', unitPrice: 1500, transactionCode: 'MED-001' },
  ]);

  // ── Special Hostel Transport Rows ──
  const [transportRows, setTransportRows] = useState<TransportPassengerRow[]>([
    { id: '1', sn: 1, name: 'Musa Abubakar', type: 'patient', stateOfOrigin: 'Borno', direction: 'incoming', cost: 22000 },
    { id: '2', sn: 2, name: 'Aisha Musa', type: 'caregiver', stateOfOrigin: 'Borno', direction: 'incoming', cost: 22000 },
    { id: '3', sn: 3, name: 'Ibrahim Hassan', type: 'patient', stateOfOrigin: 'Adamawa', direction: 'incoming', cost: 25000 },
  ]);

  // ── Special Education Welfare Rows ──
  const [educationRows, setEducationRows] = useState<EducationStudentRowState[]>([
    { id: '1', sn: 1, patientName: 'Maryam Sani (Noma survivor)', schoolName: 'NOMA Model Primary School, Sokoto', classLevel: 'Primary 3', supportType: 'School Fees / Tuition', cost: 45000 },
    { id: '2', sn: 2, patientName: 'Aliyu Garba (Post-reconstruction)', schoolName: 'Community Islamic Academy', classLevel: 'Primary 1', supportType: 'Uniform & Footwear', cost: 18000 },
    { id: '3', sn: 3, patientName: 'Bilkisu Danjuma', schoolName: 'NOMA Model Primary School, Sokoto', classLevel: 'Primary 2', supportType: 'Textbooks & Stationery', cost: 22000 },
  ]);

  // Auto-detect logged-in user and configure form directly
  useEffect(() => {
    const user = getStoredUser();
    if (user && user.name) {
      setRequesterName(user.name);
      if (user.roleTitle) setRequesterRole(user.roleTitle);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const deptParam = params.get('dept');
      const unitParam = params.get('unit');

      if (deptParam) {
        const found = naniDepartments.find(d => d.id.toLowerCase() === deptParam.toLowerCase() || d.name.toLowerCase() === deptParam.toLowerCase());
        if (found) {
          setSelectedDeptId(found.id);
          if (unitParam) {
            applyUnitSelection(found.id, unitParam);
            return;
          }
        }
      }

      if (user && user.department) {
        const found = naniDepartments.find(d => d.name.toLowerCase() === user.department.toLowerCase());
        if (found) {
          setSelectedDeptId(found.id);
          if (user.unit) {
            applyUnitSelection(found.id, user.unit);
            return;
          }
        }
      }
    }
  }, []);

  const applyUnitSelection = (deptId: string, unitName: string) => {
    setSelectedUnit(unitName);
    if (unitName === 'Hostel') {
      setRequisitionType('transport');
      setDefaultTransCode('TRN-001');
      setDonorGrantCode('HN-2026-HOSP-Q4');
    } else if (unitName === 'Education Welfare') {
      setRequisitionType('education');
      setDefaultTransCode('ADM-003');
      setDonorGrantCode('HN-2026-CAP-Q4');
    } else if (unitName === 'Logistics/Fleet') {
      setRequisitionType('cash');
      setDefaultTransCode('FAC-004');
      setDonorGrantCode('HN-2026-OPS-Q4');
    } else if (unitName === 'Kitchen') {
      setRequisitionType('cash');
      setDefaultTransCode('ADM-002');
      setDonorGrantCode('HN-2026-OPS-Q4');
    } else if (deptId === 'clinicals') {
      setRequisitionType('cash');
      setDefaultTransCode('MED-002');
      setDonorGrantCode('HN-2026-SURG-Q4');
    }
  };

  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const dept = naniDepartments.find(d => d.id === deptId);
    if (dept && dept.units.length > 0) {
      applyUnitSelection(deptId, dept.units[0]);
    }
  };

  const handleUnitChange = (unitName: string) => {
    applyUnitSelection(selectedDeptId, unitName);
  };

  const isTransportMode = requisitionType === 'transport' || selectedUnit === 'Hostel';
  const isEducationMode = requisitionType === 'education' || selectedUnit === 'Education Welfare';
  const currentSupervisor = departmentSupervisors[selectedDeptId] || departmentSupervisors.clinicals;

  const currentDept = useMemo(() => {
    return naniDepartments.find(d => d.id === selectedDeptId) || naniDepartments[2];
  }, [selectedDeptId]);

  // Totals
  const standardTotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const transportTotal = transportRows.reduce((acc, row) => acc + row.cost, 0);
  const educationTotal = educationRows.reduce((acc, row) => acc + row.cost, 0);
  const grandTotal = isTransportMode ? transportTotal : isEducationMode ? educationTotal : standardTotal;

  // Transport Fare Calculations
  const getRateForState = (stateName: string, direction: 'incoming' | 'discharge') => {
    const rateObj = stateTransportRates.find(r => r.state.toLowerCase() === stateName.toLowerCase());
    if (!rateObj) return 15000;
    return direction === 'incoming' ? rateObj.rateIncoming : rateObj.rateDischarge;
  };

  const addTransportRow = () => {
    const nextSn = transportRows.length + 1;
    const defaultState = 'Borno';
    const defaultCost = getRateForState(defaultState, 'incoming');
    setTransportRows(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sn: nextSn,
        name: '',
        type: 'patient',
        stateOfOrigin: defaultState,
        direction: 'incoming',
        cost: defaultCost,
      }
    ]);
  };

  const updateTransportRow = (id: string, field: keyof TransportPassengerRow, value: any) => {
    setTransportRows(prev => prev.map(row => {
      if (row.id === id) {
        const updated = { ...row, [field]: value };
        if (field === 'stateOfOrigin' || field === 'direction') {
          updated.cost = getRateForState(
            field === 'stateOfOrigin' ? value : row.stateOfOrigin,
            field === 'direction' ? value : row.direction
          );
        }
        return updated;
      }
      return row;
    }));
  };

  const removeTransportRow = (id: string) => {
    if (transportRows.length <= 1) return;
    setTransportRows(prev => {
      const filtered = prev.filter(r => r.id !== id);
      return filtered.map((row, idx) => ({ ...row, sn: idx + 1 }));
    });
  };

  // Education Rows
  const addEducationRow = () => {
    setEducationRows(prev => [
      ...prev,
      {
        id: `edu-${Date.now()}`,
        sn: prev.length + 1,
        patientName: '',
        schoolName: 'NOMA Model Primary School, Sokoto',
        classLevel: 'Primary 1',
        supportType: 'School Fees / Tuition',
        cost: 35000,
      }
    ]);
  };

  const updateEducationRow = (id: string, field: keyof EducationStudentRowState, value: any) => {
    setEducationRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const removeEducationRow = (id: string) => {
    if (educationRows.length <= 1) return;
    setEducationRows(prev => prev.filter(r => r.id !== id).map((r, idx) => ({ ...r, sn: idx + 1 })));
  };

  // Standard line items
  const addStandardRow = () => {
    const nextSn = items.length + 1;
    setItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sn: nextSn,
        name: '',
        quantity: 1,
        unit: 'Units',
        unitPrice: 0,
        transactionCode: defaultTransCode,
      }
    ]);
  };

  const updateStandardRow = (id: string, field: keyof LineItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const removeStandardRow = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => {
      const filtered = prev.filter(i => i.id !== id);
      return filtered.map((item, idx) => ({ ...item, sn: idx + 1 }));
    });
  };

  // Submit Requisition
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nextNum = Math.floor(100 + Math.random() * 900);
    const newId = `NANI-REQ-${nextNum}`;
    setCreatedReqId(newId);

    const title = isTransportMode
      ? `Patient Transport — ${transportRows.map(r => r.stateOfOrigin).filter((v,i,a) => a.indexOf(v) === i).join(', ')} States (${transportRows.length} Passengers)`
      : isEducationMode
      ? `Patient Education & Schooling Welfare — ${educationRows.length} Students Sponsored`
      : items[0]?.name ? `${items[0].name}${items.length > 1 ? ` (+ ${items.length - 1} more items)` : ''}` : `${selectedUnit} Consumables Requisition`;

    const newReq: Request = {
      id: newId,
      title,
      requisitionType,
      department: currentDept.name,
      unit: selectedUnit,
      category: isTransportMode ? 'Patient Transport' : isEducationMode ? 'Patient Education & Schooling Welfare' : `${selectedUnit} Supplies`,
      transactionCode: defaultTransCode,
      donorGrantCode: donorGrantCode,
      urgency,
      status: 'supervisor-review',
      currentApprovalLevel: 'supervisor',
      requestedBy: requesterName,
      requestedByRole: requesterRole || `${selectedUnit} Staff`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalValue: grandTotal,
      justification: justification || `Requisition raised for ${currentDept.name} Department (${selectedUnit} Unit).`,
      budgetCode: `${currentDept.id.toUpperCase()}-${selectedUnit.slice(0,3).toUpperCase()}-2026-VCH`,
      items: (isTransportMode || isEducationMode) ? [] : items.map((i, idx) => ({ ...i, sn: idx + 1, totalPrice: i.quantity * i.unitPrice })),
      transportPassengers: isTransportMode ? transportRows.map((r, idx) => ({
        id: `tp-${Date.now()}-${idx}`,
        sn: idx + 1,
        name: r.name || `Passenger ${idx + 1}`,
        type: r.type,
        stateOfOrigin: r.stateOfOrigin,
        transportCost: r.cost,
        direction: r.direction
      })) : [],
      educationStudents: isEducationMode ? educationRows.map((r, idx) => ({
        id: `edu-${Date.now()}-${idx}`,
        sn: idx + 1,
        patientName: r.patientName || `Patient ${idx + 1}`,
        schoolName: r.schoolName || 'NOMA Primary School',
        classLevel: r.classLevel || 'Primary 1',
        supportType: r.supportType,
        cost: r.cost,
      })) : [],
      signatures: [
        {
          level: 'requester',
          actor: requesterName,
          role: requesterRole || `${selectedUnit} Staff`,
          timestamp: new Date().toISOString(),
          signatureStamp: `${requesterName.replace(/\s+/g,'').toUpperCase()}/VOUCH/2026`
        }
      ],
      timeline: [
        {
          id: `t-${Date.now()}`,
          action: `Requisition Submitted & Routed to ${currentSupervisor.name} (${currentSupervisor.title}) for Level 2 Review ✓`,
          actor: requesterName,
          role: requesterRole || `${selectedUnit} Staff`,
          timestamp: new Date().toISOString(),
          type: 'submitted' as const,
          comment: justification || `Initial voucher submission for ${currentDept.name} Department (${selectedUnit} Unit).`
        }
      ],
      comments: []
    };

    addStoredRequest(newReq);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-600 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-700 mb-1 font-bold">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>ELECTRONIC REQUISITION VOUCHER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Raise Departmental Requisition
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Structured voucher directly routed to your unit supervisor, finance head, and programme coordinator.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>My Requisitions Ledger</span>
            </Link>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            SUCCESS SUBMISSION MODAL / CARD
           ───────────────────────────────────────────────────────────────── */}
        {submitted ? (
          <div className="p-10 rounded-3xl bg-white border border-teal-300 text-center max-w-2xl mx-auto shadow-xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 border border-teal-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Check size={32} strokeWidth={3} />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal-800 font-bold bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              VOUCHER TRANSMITTED TO SUPERVISOR DESK
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">
              Requisition {createdReqId} Created
            </h2>
            <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Your requisition has been digitally signed and routed to <strong className="text-slate-900 font-bold">{currentSupervisor.name}</strong> ({currentSupervisor.title}) for Level 2 line verification. You will receive an alert once Finance clears the grant allocation.
            </p>

            <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left text-xs font-mono">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Voucher No:</span>
                <strong className="text-teal-700">{createdReqId}</strong>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Department:</span>
                <strong className="text-slate-900">{currentDept.name} ({selectedUnit})</strong>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Assigned Supervisor:</span>
                <strong className="text-teal-800 font-bold">{currentSupervisor.name}</strong>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Total Value:</span>
                <strong className="text-teal-700 font-black">{formatCurrency(grandTotal)}</strong>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Grant Code:</span>
                <strong className="text-emerald-800 font-bold">{donorGrantCode}</strong>
              </div>
              <div className="flex justify-between py-1 text-slate-600 border-t border-slate-200 mt-1 pt-1">
                <span>Current Stage:</span>
                <strong className="text-amber-800 font-bold">Level 2: {currentSupervisor.name} Review</strong>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/request/${createdReqId}`}
                className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Printer size={14} className="text-teal-700" />
                <span>View Printable Voucher</span>
              </Link>

              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-700/20 flex items-center gap-1.5 transition-all"
              >
                <span>Go to My Dashboard</span>
                <ArrowRight size={14} />
              </Link>

              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                + Raise Another Voucher
              </button>
            </div>
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────────
              THE ACTUAL REQUISITION VOUCHER FORM (IMMEDIATE & DIRECT)
             ───────────────────────────────────────────────────────────────── */
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
            
            {/* ── 1. Originating Department & Supervisor Routing Bar ── */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-bold">
                    Requisition Context & Routing Authority
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {currentDept.name} Department · {selectedUnit} Unit
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-2 text-xs">
                    <ShieldCheck size={16} className="text-teal-700" />
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">LINE SUPERVISOR (LEVEL 2):</span>
                      <strong className="text-teal-900 font-bold">{currentSupervisor.name} ({currentSupervisor.title})</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department & Unit Selectors right here on the form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                
                {/* Department Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Building2 size={12} className="text-teal-700" />
                    <span>Originating Department</span>
                  </label>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => handleDeptChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    {naniDepartments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} Department</option>
                    ))}
                  </select>
                </div>

                {/* Unit Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Layers size={12} className="text-teal-700" />
                    <span>Operating Unit</span>
                  </label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => handleUnitChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-teal-800 font-bold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    {currentDept.units.map(u => (
                      <option key={u} value={u}>{u} Unit</option>
                    ))}
                  </select>
                </div>

                {/* Requisition Pathway */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Package size={12} className="text-teal-700" />
                    <span>Requisition Pathway</span>
                  </label>
                  <select
                    value={requisitionType}
                    onChange={(e: any) => setRequisitionType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="cash">💵 Cash Disbursement / Purchase Requisition</option>
                    <option value="transport">🚌 Hostel Patient / Caregiver Transport (State-Rated)</option>
                    <option value="education">🎓 Patient Educational Welfare & Schooling</option>
                    <option value="store-issue">📦 Internal Store Issue (Central Medical Store)</option>
                  </select>
                </div>

                {/* Priority / Urgency */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Clock size={12} className="text-teal-700" />
                    <span>Priority Level</span>
                  </label>
                  <select
                    value={urgency}
                    onChange={(e: any) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="routine">Routine (48 Hours SLA)</option>
                    <option value="priority">Priority (24 Hours SLA)</option>
                    <option value="stat">STAT / Emergency (Immediate)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* ── 2. Requisition Voucher Metadata ── */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar size={12} className="text-teal-700" />
                    <span>Requisition Date</span>
                  </label>
                  <input
                    type="text"
                    value={reqDate}
                    onChange={(e) => setReqDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                {/* Name of requester */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <UserCheck size={12} className="text-teal-700" />
                    <span>Requester Name</span>
                  </label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                {/* Transaction Code */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FileText size={12} className="text-teal-700" />
                    <span>Item Transaction Code</span>
                  </label>
                  <select
                    value={defaultTransCode}
                    onChange={(e) => setDefaultTransCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-teal-800 font-mono font-bold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    {transactionCodes.map(tc => (
                      <option key={tc.code} value={tc.code}>
                        {tc.code} — {tc.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Donor Grant Code */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <DollarSign size={12} className="text-emerald-700" />
                    <span>Donor Grant Code</span>
                  </label>
                  <select
                    value={donorGrantCode}
                    onChange={(e) => setDonorGrantCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-emerald-800 font-mono font-bold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="HN-2026-SURG-Q4">HN-2026-SURG-Q4 (Surgical & Clinical)</option>
                    <option value="HN-2026-HOSP-Q4">HN-2026-HOSP-Q4 (Hostel & Patient Transport)</option>
                    <option value="HN-2026-OPS-Q4">HN-2026-OPS-Q4 (Facility Operations & Fleet)</option>
                    <option value="HN-2026-PSY-Q4">HN-2026-PSY-Q4 (Art & Psychosocial Rehab)</option>
                    <option value="HN-2026-CAP-Q4">HN-2026-CAP-Q4 (Staff Capacity Building)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* ── 3. Table: Transport / Education / General Supplies (IMMEDIATE) ── */}
            {isTransportMode ? (
              /* CASE A: HOSTEL PATIENT & CAREGIVER TRANSPORT REQUISITION */
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono">
                      Hostel Unit Logistics System
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-0.5">
                      Patient & Caregiver Transport Fare Schedule
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select incoming or discharge, pick patient/caregiver, and choose state. Cost is auto-calculated per official state rate.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addTransportRow}
                    className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm"
                  >
                    <Plus size={14} />
                    <span>+ Add Passenger</span>
                  </button>
                </div>

                {/* Transport Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider font-mono border-b border-slate-200">
                        <th className="py-2.5 px-2 w-12 text-center">S/N</th>
                        <th className="py-2.5 px-3 min-w-[180px]">Passenger Full Name</th>
                        <th className="py-2.5 px-3 w-40">Role / Category</th>
                        <th className="py-2.5 px-3 w-44">State of Origin</th>
                        <th className="py-2.5 px-3 w-36">Movement</th>
                        <th className="py-2.5 px-3 w-32 text-right">Fixed Rate</th>
                        <th className="py-2.5 px-2 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans bg-white">
                      {transportRows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-2 text-center font-mono text-slate-500">{row.sn}</td>
                          
                          {/* Name */}
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={row.name}
                              placeholder="e.g. Fatima Abubakar"
                              onChange={(e) => updateTransportRow(row.id, 'name', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            />
                          </td>

                          {/* Patient / Caregiver Dropdown */}
                          <td className="py-3 px-3">
                            <select
                              value={row.type}
                              onChange={(e) => updateTransportRow(row.id, 'type', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            >
                              <option value="patient">🏥 Patient</option>
                              <option value="caregiver">🤝 Caregiver / Escort</option>
                            </select>
                          </td>

                          {/* State Dropdown */}
                          <td className="py-3 px-3">
                            <select
                              value={row.stateOfOrigin}
                              onChange={(e) => updateTransportRow(row.id, 'stateOfOrigin', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-teal-800 font-mono font-bold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            >
                              {stateTransportRates.map(s => (
                                <option key={s.state} value={s.state}>
                                  {s.state} ({formatCurrency(row.direction === 'incoming' ? s.rateIncoming : s.rateDischarge)})
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Direction */}
                          <td className="py-3 px-3">
                            <select
                              value={row.direction}
                              onChange={(e) => updateTransportRow(row.id, 'direction', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            >
                              <option value="incoming">Incoming (Arrival)</option>
                              <option value="discharge">Discharge (Return)</option>
                            </select>
                          </td>

                          {/* Rate (Auto-Calculated) */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-teal-700">
                            {formatCurrency(row.cost)}
                          </td>

                          {/* Delete */}
                          <td className="py-3 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeTransportRow(row.id)}
                              disabled={transportRows.length <= 1}
                              className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Transport Grand Total Bar */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-600">
                    Total Passengers: <strong className="text-slate-900 font-mono">{transportRows.length}</strong> (
                    {transportRows.filter(r => r.type === 'patient').length} Patients, {transportRows.filter(r => r.type === 'caregiver').length} Caregivers)
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 uppercase">Auto-Calculated Total:</span>
                    <span className="text-xl font-black text-teal-700 font-mono">
                      {formatCurrency(transportTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ) : isEducationMode ? (
              /* CASE B: PATIENT EDUCATIONAL WELFARE & SCHOOLING SCHEDULE */
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <GraduationCap size={15} />
                      <span>Patient Educational Rehabilitation System</span>
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-0.5">
                      Noma Survivors Schooling Sponsorship Schedule
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter patient names, schooling institutions, class level, and support package. Auto-sums for Finance & Donor verification.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addEducationRow}
                    className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm"
                  >
                    <Plus size={14} />
                    <span>+ Add Student</span>
                  </button>
                </div>

                {/* Education Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider font-mono border-b border-slate-200">
                        <th className="py-2.5 px-2 w-12 text-center">S/N</th>
                        <th className="py-2.5 px-3 min-w-[180px]">Patient Full Name</th>
                        <th className="py-2.5 px-3 min-w-[200px]">School / Institution</th>
                        <th className="py-2.5 px-3 w-32">Class Level</th>
                        <th className="py-2.5 px-3 w-48">Support Category</th>
                        <th className="py-2.5 px-3 w-32 text-right">Tuition / Package Cost</th>
                        <th className="py-2.5 px-2 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans bg-white">
                      {educationRows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-2 text-center font-mono text-slate-500">{row.sn}</td>
                          
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={row.patientName}
                              placeholder="e.g. Maryam Sani"
                              onChange={(e) => updateEducationRow(row.id, 'patientName', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            />
                          </td>

                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={row.schoolName}
                              placeholder="e.g. NOMA Model Primary School"
                              onChange={(e) => updateEducationRow(row.id, 'schoolName', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            />
                          </td>

                          <td className="py-3 px-3">
                            <select
                              value={row.classLevel}
                              onChange={(e) => updateEducationRow(row.id, 'classLevel', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            >
                              <option value="Primary 1">Primary 1</option>
                              <option value="Primary 2">Primary 2</option>
                              <option value="Primary 3">Primary 3</option>
                              <option value="Primary 4">Primary 4</option>
                              <option value="Primary 5">Primary 5</option>
                              <option value="Primary 6">Primary 6</option>
                              <option value="JSS 1">JSS 1</option>
                              <option value="JSS 2">JSS 2</option>
                              <option value="JSS 3">JSS 3</option>
                              <option value="Vocational Apprenticeship">Vocational Apprenticeship</option>
                            </select>
                          </td>

                          <td className="py-3 px-3">
                            <select
                              value={row.supportType}
                              onChange={(e: any) => updateEducationRow(row.id, 'supportType', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-teal-800 font-bold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            >
                              <option value="School Fees / Tuition">School Fees / Tuition</option>
                              <option value="Uniform & Footwear">Uniform & Footwear</option>
                              <option value="Textbooks & Stationery">Textbooks & Stationery</option>
                              <option value="Full Schooling Package">Full Schooling Package</option>
                            </select>
                          </td>

                          <td className="py-3 px-3">
                            <input
                              type="number"
                              min={0}
                              value={row.cost}
                              onChange={(e) => updateEducationRow(row.id, 'cost', parseInt(e.target.value) || 0)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-mono text-right focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            />
                          </td>

                          <td className="py-3 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeEducationRow(row.id)}
                              disabled={educationRows.length <= 1}
                              className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-600">
                    Total Students Sponsored: <strong className="text-slate-900 font-mono">{educationRows.length}</strong>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 uppercase">Auto-Calculated Total:</span>
                    <span className="text-xl font-black text-teal-700 font-mono">
                      {formatCurrency(educationTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* CASE C: GENERAL ITEMS & CONSUMABLES (MEDICAL, FACILITY, KITCHEN, PO) */
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono">
                      Schedule of Supplies & Consumables
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-0.5">
                      Itemized Description & Financial Schedule
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Specify items, quantity, packaging unit, and estimated unit rate in Naira.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addStandardRow}
                    className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm"
                  >
                    <Plus size={14} />
                    <span>+ Add Line Item</span>
                  </button>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider font-mono border-b border-slate-200">
                        <th className="py-2.5 px-2 w-12 text-center">S/N</th>
                        <th className="py-2.5 px-3 min-w-[220px]">Item Description</th>
                        <th className="py-2.5 px-3 w-44">Transaction Code</th>
                        <th className="py-2.5 px-3 w-28 text-center">Quantity</th>
                        <th className="py-2.5 px-3 w-32">Unit Type</th>
                        <th className="py-2.5 px-3 w-36 text-right">Unit Price (₦)</th>
                        <th className="py-2.5 px-3 w-36 text-right">Total Price</th>
                        <th className="py-2.5 px-2 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans bg-white">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-2 text-center font-mono text-slate-500">{item.sn}</td>

                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={item.name}
                              placeholder="e.g. Parboiled Rice (50kg Bag) or Surgical Gloves"
                              onChange={(e) => updateStandardRow(item.id, 'name', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            />
                          </td>

                          <td className="py-3 px-3">
                            <select
                              value={item.transactionCode}
                              onChange={(e) => updateStandardRow(item.id, 'transactionCode', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-teal-800 font-mono font-bold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            >
                              {transactionCodes.map(tc => (
                                <option key={tc.code} value={tc.code}>{tc.code}</option>
                              ))}
                            </select>
                          </td>

                          <td className="py-3 px-3">
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => updateStandardRow(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-mono text-center focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            />
                          </td>

                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => updateStandardRow(item.id, 'unit', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            />
                          </td>

                          <td className="py-3 px-3">
                            <input
                              type="number"
                              min={0}
                              value={item.unitPrice}
                              onChange={(e) => updateStandardRow(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-mono text-right focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            />
                          </td>

                          <td className="py-3 px-3 text-right font-mono font-bold text-teal-700">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </td>

                          <td className="py-3 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeStandardRow(item.id)}
                              disabled={items.length <= 1}
                              className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-600">
                    Total Line Items: <strong className="text-slate-900 font-mono">{items.length}</strong>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 uppercase">Auto-Calculated Total:</span>
                    <span className="text-xl font-black text-teal-700 font-mono">
                      {formatCurrency(standardTotal)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. Operational Justification Memo ── */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Operational Justification / Clinical Case Memo
              </label>
              <textarea
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="State clearly why these items or transport fares are required, patient volume affected, or operational urgency..."
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            {/* ── 5. 4-Level Approval Chain Stamp Preview ── */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-bold block mb-1">
                4-LEVEL DIGITAL APPROVAL ROUTING CHAIN
              </span>
              <h3 className="text-base font-black text-slate-900 mb-4">
                Automatic Workflow Stamps Applied on Submission
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                
                {/* Level 1: Requester */}
                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-teal-800 font-bold uppercase">LEVEL 1 · REQUESTER</span>
                    <span className="text-[9px] text-teal-700 font-bold">DIGITAL SIGN</span>
                  </div>
                  <div className="font-bold text-slate-900">{requesterName}</div>
                  <div className="text-[11px] text-slate-600">{requesterRole || `${selectedUnit} Staff`}</div>
                  <div className="mt-2 text-[9px] font-mono text-teal-800">STAMP: READY TO APPLY</div>
                </div>

                {/* Level 2: Supervisor */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">LEVEL 2 · SUPERVISOR</span>
                    <span className="text-[9px] text-amber-700 font-bold">NEXT REVIEW</span>
                  </div>
                  <div className="font-bold text-slate-900">{currentSupervisor.name}</div>
                  <div className="text-[11px] text-slate-600">{currentSupervisor.title}</div>
                  <div className="mt-2 text-[9px] font-mono text-slate-500">STAMP: {currentSupervisor.stamp}</div>
                </div>

                {/* Level 3: Finance */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">LEVEL 3 · FINANCE HEAD</span>
                    <span className="text-[9px] text-slate-400 font-bold">BUDGET LOCK</span>
                  </div>
                  <div className="font-bold text-slate-900">Mr. AY, FCA</div>
                  <div className="text-[11px] text-slate-600">Head of Finance & Grants</div>
                  <div className="mt-2 text-[9px] font-mono text-slate-500">STAMP: AY/FIN/2026</div>
                </div>

                {/* Level 4: Coordinator */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">LEVEL 4 · COORDINATOR</span>
                    <span className="text-[9px] text-slate-400 font-bold">FINAL AUTH</span>
                  </div>
                  <div className="font-bold text-slate-900">Dr. Emmanuel Bawa</div>
                  <div className="text-[11px] text-slate-600">Programme Coordinator</div>
                  <div className="mt-2 text-[9px] font-mono text-slate-500">STAMP: EB/CORD/2026</div>
                </div>

              </div>
            </div>

            {/* ── 6. Bottom Submission Bar ── */}
            <div className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono block">Grand Total Requisition Value:</span>
                <span className="text-2xl font-black text-teal-700 font-mono">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-teal-700/20 flex items-center gap-2 active:scale-95"
                >
                  <Send size={15} />
                  <span>Submit Requisition to {currentSupervisor.name}</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </main>
    </div>
  );
}