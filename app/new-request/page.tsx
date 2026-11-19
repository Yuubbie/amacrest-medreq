'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  naniDepartments, 
  stateTransportRates, 
  transactionCodes, 
  currentUser,
  formatCurrency 
} from '@/lib/mock-data';
import { addStoredRequest, getStoredUser } from '@/lib/storage';
import { Request, RequestItem, TransportPassenger } from '@/lib/types';
import { 
  Building2, ShieldCheck, Heart, DollarSign, Users, 
  Check, ChevronRight, ChevronLeft, AlertTriangle, Plus, 
  Trash2, Info, Sparkles, FileText, Bus, Package, Calendar, 
  UserCheck, CheckCircle2, ArrowRight, Printer
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

const deptIcons: Record<string, any> = {
  facility: Building2,
  finance: DollarSign,
  clinicals: Heart,
  admin: Building2,
  hr: Users,
};

export default function NewRequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [createdReqId, setCreatedReqId] = useState('NANI-REQ-088');

  // ── Step 1 State: Department, Unit, Pathway ──────────────────────────────
  const [selectedDeptId, setSelectedDeptId] = useState('clinicals');
  const [selectedUnit, setSelectedUnit] = useState('Nursing');
  const [requisitionType, setRequisitionType] = useState<'material' | 'cash' | 'store-issue' | 'transport'>('cash');
  const [urgency, setUrgency] = useState<'routine' | 'priority' | 'stat'>('routine');

  // ── Step 2 State: Requisition Header & Items ─────────────────────────────
  const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const [reqDate, setReqDate] = useState(todayFormatted);
  const [requesterName, setRequesterName] = useState('Nurse Hauwa Bello');
  const [defaultTransCode, setDefaultTransCode] = useState('MED-002');
  const [donorGrantCode, setDonorGrantCode] = useState('HN-2026-SURG-Q4');
  const [justification, setJustification] = useState('');

  // Standard line items
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', sn: 1, name: 'Sterile Wound Dressing Packs (10x10cm)', quantity: 50, unit: 'Packs', unitPrice: 1200, transactionCode: 'MED-002' },
    { id: '2', sn: 2, name: 'Povidone-Iodine Antiseptic (500ml)', quantity: 20, unit: 'Bottles', unitPrice: 1500, transactionCode: 'MED-001' },
  ]);

  // Special Hostel Transport Rows
  const [transportRows, setTransportRows] = useState<TransportPassengerRow[]>([
    { id: '1', sn: 1, name: 'Musa Abubakar', type: 'patient', stateOfOrigin: 'Borno', direction: 'incoming', cost: 22000 },
    { id: '2', sn: 2, name: 'Aisha Musa', type: 'caregiver', stateOfOrigin: 'Borno', direction: 'incoming', cost: 22000 },
    { id: '3', sn: 3, name: 'Ibrahim Hassan', type: 'patient', stateOfOrigin: 'Adamawa', direction: 'incoming', cost: 25000 },
  ]);

  useEffect(() => {
    const user = getStoredUser();
    if (user && user.name) {
      setRequesterName(user.name);
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
            setSelectedUnit(unitParam);
            if (unitParam === 'Hostel') {
              setRequisitionType('transport');
              setDefaultTransCode('TRN-001');
            } else if (unitParam === 'Logistics/Fleet') {
              setRequisitionType('cash');
              setDefaultTransCode('FAC-004');
            }
          }
        }
      } else if (user && user.department) {
        const found = naniDepartments.find(d => d.name.toLowerCase() === user.department.toLowerCase());
        if (found) {
          setSelectedDeptId(found.id);
          if (user.unit) {
            setSelectedUnit(user.unit);
            if (user.unit === 'Hostel') {
              setRequisitionType('transport');
              setDefaultTransCode('TRN-001');
            } else if (user.unit === 'Logistics/Fleet') {
              setRequisitionType('cash');
              setDefaultTransCode('FAC-004');
            }
          }
        }
      }
    }
  }, []);

  const isTransportMode = requisitionType === 'transport' || selectedUnit === 'Hostel';

  // Selected department details
  const currentDept = useMemo(() => {
    return naniDepartments.find(d => d.id === selectedDeptId) || naniDepartments[2];
  }, [selectedDeptId]);

  // Calculations
  const standardTotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const transportTotal = transportRows.reduce((acc, row) => acc + row.cost, 0);
  const grandTotal = isTransportMode ? transportTotal : standardTotal;

  // Handle department change
  const handleSelectDept = (deptId: string) => {
    setSelectedDeptId(deptId);
    const dept = naniDepartments.find(d => d.id === deptId);
    if (dept && dept.units.length > 0) {
      setSelectedUnit(dept.units[0]);
      if (dept.units[0] === 'Hostel') {
        setRequisitionType('transport');
        setDefaultTransCode('TRN-001');
      } else if (requisitionType === 'transport') {
        setRequisitionType('cash');
      }
    }
  };

  // Handle unit change
  const handleSelectUnit = (unit: string) => {
    setSelectedUnit(unit);
    if (unit === 'Hostel') {
      setRequisitionType('transport');
      setDefaultTransCode('TRN-001');
    } else if (requisitionType === 'transport') {
      setRequisitionType('cash');
      setDefaultTransCode('MED-001');
    }
  };

  // Standard line items management
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

  // Transport rows management
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

  const handleSubmit = () => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    const newId = `NANI-REQ-${nextNum}`;
    setCreatedReqId(newId);

    const title = isTransportMode
      ? `Patient Transport — ${transportRows.map(r => r.stateOfOrigin).filter((v,i,a) => a.indexOf(v) === i).join(', ')} States (${transportRows.length} Passengers)`
      : items[0]?.name ? `${items[0].name}${items.length > 1 ? ` (+ ${items.length - 1} more items)` : ''}` : `${selectedUnit} Consumables Requisition`;

    const newReq: Request = {
      id: newId,
      title,
      requisitionType,
      department: currentDept.name,
      unit: selectedUnit,
      category: isTransportMode ? 'Patient Transport' : 'Clinical Consumables',
      transactionCode: defaultTransCode,
      donorGrantCode: donorGrantCode,
      urgency,
      status: 'supervisor-review',
      currentApprovalLevel: 'supervisor',
      requestedBy: requesterName,
      requestedByRole: `${selectedUnit} Staff`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalValue: grandTotal,
      justification: justification || 'Voucher raised via Staff Portal.',
      budgetCode: `${currentDept.id.toUpperCase()}-${selectedUnit.slice(0,3).toUpperCase()}-2026-VCH`,
      items: isTransportMode ? [] : items.map((i, idx) => ({ ...i, sn: idx + 1, totalPrice: i.quantity * i.unitPrice })),
      transportPassengers: isTransportMode ? transportRows.map((r, idx) => ({
        id: `tp-${Date.now()}-${idx}`,
        sn: idx + 1,
        name: r.name || `Passenger ${idx + 1}`,
        type: r.type,
        stateOfOrigin: r.stateOfOrigin,
        transportCost: r.cost,
        direction: r.direction
      })) : [],
      signatures: [
        {
          level: 'requester',
          actor: requesterName,
          role: `${selectedUnit} Staff`,
          timestamp: new Date().toISOString(),
          signatureStamp: `${requesterName.replace(/\s+/g,'').toUpperCase()}/VOUCH/2026`
        }
      ],
      timeline: [
        {
          id: `t-${Date.now()}`,
          action: 'Requisition Submitted & Digitally Signed ✓',
          actor: requesterName,
          role: `${selectedUnit} Staff`,
          timestamp: new Date().toISOString(),
          type: 'submitted' as const,
          comment: justification || 'Initial voucher submission'
        }
      ],
      comments: []
    };

    addStoredRequest(newReq);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>ELECTRONIC REQUISITION VOUCHER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Raise Departmental Requisition
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Complete the structured voucher. Auto-coded, auto-totalled, and routed through the 4-level approval chain.
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2">
            {[
              { n: 1, label: 'Department & Pathway' },
              { n: 2, label: 'Voucher Items' },
              { n: 3, label: 'Approval Preview' },
            ].map((s) => (
              <div 
                key={s.n}
                onClick={() => setStep(s.n)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  step === s.n
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : step > s.n
                    ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                    : 'bg-zinc-950 text-zinc-600 border border-zinc-900'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  step === s.n ? 'bg-teal-500 text-zinc-950' : step > s.n ? 'bg-zinc-800 text-teal-400' : 'bg-zinc-900 text-zinc-600'
                }`}>
                  {step > s.n ? <Check size={12} strokeWidth={3} /> : s.n}
                </div>
                <span className="hidden md:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            STEP 1: ICON-BASED DEPARTMENT & UNIT SELECTOR
           ───────────────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* 1.1 Department Selector: Icon Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Step 1.1</span>
                  <h2 className="text-lg font-black text-white mt-0.5">Select Originating Department</h2>
                </div>
                <span className="text-xs text-zinc-500 font-mono">5 NANI Departments</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {naniDepartments.map((dept) => {
                  const isSelected = selectedDeptId === dept.id;
                  const Icon = deptIcons[dept.id] || Building2;
                  return (
                    <div
                      key={dept.id}
                      onClick={() => handleSelectDept(dept.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-zinc-900 border-teal-500 shadow-xl shadow-teal-500/10 ring-1 ring-teal-500/30'
                          : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
                      )}
                      <div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 ${
                          isSelected ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {dept.icon}
                        </div>
                        <h3 className="font-black text-base text-white">{dept.name}</h3>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                          {dept.units.join(', ')}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500 font-mono">{dept.units.length} Units</span>
                        {isSelected ? (
                          <span className="text-teal-400 font-bold flex items-center gap-1">
                            Selected <Check size={12} />
                          </span>
                        ) : (
                          <span className="text-zinc-600">Click to choose</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 1.2 Unit Selector */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Step 1.2</span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    Select Unit under {currentDept.name}
                  </h3>
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                  {currentDept.name} Department
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentDept.units.map((unit) => {
                  const isSelected = selectedUnit === unit;
                  const isHostel = unit === 'Hostel';
                  return (
                    <button
                      key={unit}
                      onClick={() => handleSelectUnit(unit)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-teal-500 text-zinc-950 shadow-lg shadow-teal-500/20 ring-2 ring-teal-400'
                          : 'bg-zinc-950 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {isHostel && <span>🚌</span>}
                      <span>{unit}</span>
                      {isHostel && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-zinc-950 text-teal-300' : 'bg-teal-500/10 text-teal-400'}`}>
                          Patient Transport
                        </span>
                      )}
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1.3 Pathway & Urgency Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pathway */}
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Step 1.3</span>
                <h3 className="text-base font-black text-white mt-0.5 mb-3">Requisition Pathway</h3>
                
                <div className="space-y-2">
                  {[
                    {
                      id: 'cash',
                      title: '💵 Cash Disbursement / Purchase Requisition',
                      desc: 'Cash outflow from NANI bank account. Requires Finance budget verification.',
                    },
                    {
                      id: 'store-issue',
                      title: '📦 Internal Store Issue (Separate Store Pathway)',
                      desc: 'Direct issue from central medical/sanitation store. No bank cash disbursed.',
                    },
                    {
                      id: 'transport',
                      title: '🚌 Hostel Patient / Caregiver Transport',
                      desc: 'State-rated transport fare for patient admission and discharge returns.',
                    },
                    {
                      id: 'material',
                      title: '🛒 Medical & Surgical Consumables PO',
                      desc: 'External procurement from pre-approved pharmaceutical vendors.',
                    },
                  ].map((p) => {
                    const isSelected = requisitionType === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setRequisitionType(p.id as any)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-teal-500/10 border-teal-500/60 text-white'
                            : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-zinc-200">{p.title}</span>
                          {isSelected && <CheckCircle2 size={16} className="text-teal-400" />}
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">{p.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Urgency & Priority */}
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Step 1.4</span>
                  <h3 className="text-base font-black text-white mt-0.5 mb-3">Priority Level</h3>

                  <div className="space-y-2.5">
                    {[
                      { id: 'routine', label: 'Routine (48 Hours)', desc: 'Standard monthly or bi-weekly replenishment.', color: 'zinc' },
                      { id: 'priority', label: 'Priority (24 Hours)', desc: 'Low stock threat. Fast-track supervisor notification.', color: 'amber' },
                      { id: 'stat', label: 'STAT / Emergency (Immediate)', desc: 'Life-critical clinical supply or acute patient emergency.', color: 'rose' },
                    ].map((u) => {
                      const isSelected = urgency === u.id;
                      return (
                        <div
                          key={u.id}
                          onClick={() => setUrgency(u.id as any)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-zinc-900 border-teal-500 text-white ring-1 ring-teal-500/40'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-zinc-200">{u.label}</span>
                            {isSelected && <CheckCircle2 size={16} className="text-teal-400" />}
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{u.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 active:scale-95"
                  >
                    <span>Proceed to Line Items</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            STEP 2: REQUISITION VOUCHER FORM (EXACT FIELDS FROM CLIENT)
           ───────────────────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Voucher Header Info Card */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400">
                    Official Voucher Header
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {currentDept.name} Requisition — {selectedUnit} Unit
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    {requisitionType === 'transport' ? '🚌 Transport Requisition' : requisitionType === 'store-issue' ? '📦 Store Issue' : '💵 Cash Requisition'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
                    {urgency}
                  </span>
                </div>
              </div>

              {/* Form Metadata Fields per AY: Date, Requester, Code, Donor Grant */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                
                {/* Date */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Calendar size={12} className="text-teal-400" />
                    <span>Requisition Date</span>
                  </label>
                  <input
                    type="text"
                    value={reqDate}
                    onChange={(e) => setReqDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Name of requester */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                    <UserCheck size={12} className="text-teal-400" />
                    <span>Name of Requester</span>
                  </label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Transaction Code */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                    <FileText size={12} className="text-teal-400" />
                    <span>Item Transaction Code</span>
                  </label>
                  <select
                    value={defaultTransCode}
                    onChange={(e) => setDefaultTransCode(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-teal-300 font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
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
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                    <DollarSign size={12} className="text-emerald-400" />
                    <span>Donor Grant Code</span>
                  </label>
                  <select
                    value={donorGrantCode}
                    onChange={(e) => setDonorGrantCode(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-emerald-300 font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
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

            {/* ─────────────────────────────────────────────────────────────
                CASE A: HOSTEL PATIENT & CAREGIVER TRANSPORT REQUISITION
               ───────────────────────────────────────────────────────────── */}
            {isTransportMode ? (
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
                  <div>
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      Hostel Unit Logistics System
                    </span>
                    <h3 className="text-base font-black text-white mt-0.5">
                      Patient & Caregiver Transport Fare Schedule
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Select incoming or discharge, pick patient/caregiver, and choose state. Cost is auto-calculated per official state rate.
                    </p>
                  </div>
                  <button
                    onClick={addTransportRow}
                    className="px-3.5 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto"
                  >
                    <Plus size={14} />
                    <span>+ Add Passenger</span>
                  </button>
                </div>

                {/* Transport Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono">
                        <th className="py-2.5 px-2 w-12 text-center">S/N</th>
                        <th className="py-2.5 px-3 min-w-[180px]">Passenger Full Name</th>
                        <th className="py-2.5 px-3 w-40">Role / Category</th>
                        <th className="py-2.5 px-3 w-44">State of Origin</th>
                        <th className="py-2.5 px-3 w-36">Movement</th>
                        <th className="py-2.5 px-3 w-32 text-right">Fixed Rate</th>
                        <th className="py-2.5 px-2 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-sans">
                      {transportRows.map((row) => (
                        <tr key={row.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-2 text-center font-mono text-zinc-500">{row.sn}</td>
                          
                          {/* Name */}
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={row.name}
                              placeholder="e.g. Fatima Abubakar"
                              onChange={(e) => updateTransportRow(row.id, 'name', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            />
                          </td>

                          {/* Patient / Caregiver Dropdown */}
                          <td className="py-3 px-3">
                            <select
                              value={row.type}
                              onChange={(e) => updateTransportRow(row.id, 'type', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 focus:ring-1 focus:ring-teal-500 focus:outline-none"
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
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-teal-300 font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
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
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            >
                              <option value="incoming">Incoming (Arrival)</option>
                              <option value="discharge">Discharge (Return)</option>
                            </select>
                          </td>

                          {/* Rate (Auto-Calculated) */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-teal-400">
                            {formatCurrency(row.cost)}
                          </td>

                          {/* Delete */}
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => removeTransportRow(row.id)}
                              disabled={transportRows.length <= 1}
                              className="p-1 text-zinc-500 hover:text-rose-400 disabled:opacity-30 transition-colors"
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
                <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/60 p-4 rounded-xl">
                  <div className="text-xs text-zinc-400">
                    Total Passengers: <strong className="text-white font-mono">{transportRows.length}</strong> (
                    {transportRows.filter(r => r.type === 'patient').length} Patients, {transportRows.filter(r => r.type === 'caregiver').length} Caregivers)
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-400 uppercase">Auto-Calculated Total:</span>
                    <span className="text-xl font-black text-teal-400 font-mono">
                      {formatCurrency(transportTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* ─────────────────────────────────────────────────────────────
                  CASE B: STANDARD VOUCHER ITEMS TABLE (PER AY SPECIFICATIONS)
                 ───────────────────────────────────────────────────────────── */
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
                  <div>
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      Requisition Line Items Schedule
                    </span>
                    <h3 className="text-base font-black text-white mt-0.5">
                      Itemized Description, Quantity, Unit Price & Code
                    </h3>
                  </div>
                  <button
                    onClick={addStandardRow}
                    className="px-3.5 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto"
                  >
                    <Plus size={14} />
                    <span>+ Add Line Item</span>
                  </button>
                </div>

                {/* Line Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono">
                        <th className="py-2.5 px-2 w-12 text-center">S/N</th>
                        <th className="py-2.5 px-3 min-w-[240px]">Description</th>
                        <th className="py-2.5 px-3 w-36">Code</th>
                        <th className="py-2.5 px-3 w-24">Qty</th>
                        <th className="py-2.5 px-3 w-28">Unit</th>
                        <th className="py-2.5 px-3 w-32 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 w-32 text-right">Total</th>
                        <th className="py-2.5 px-2 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-sans">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-2 text-center font-mono text-zinc-500">{item.sn}</td>
                          
                          {/* Description */}
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={item.name}
                              placeholder="e.g. Paracetamol Infusion 1000mg"
                              onChange={(e) => updateStandardRow(item.id, 'name', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            />
                          </td>

                          {/* Code */}
                          <td className="py-3 px-3">
                            <select
                              value={item.transactionCode}
                              onChange={(e) => updateStandardRow(item.id, 'transactionCode', e.target.value)}
                              className="w-full px-2 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-teal-300 font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            >
                              {transactionCodes.map(tc => (
                                <option key={tc.code} value={tc.code}>{tc.code}</option>
                              ))}
                            </select>
                          </td>

                          {/* Qty */}
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => updateStandardRow(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono text-center focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            />
                          </td>

                          {/* Unit */}
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => updateStandardRow(item.id, 'unit', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            />
                          </td>

                          {/* Unit Price */}
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              min={0}
                              value={item.unitPrice}
                              onChange={(e) => updateStandardRow(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono text-right focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            />
                          </td>

                          {/* Total Row */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-teal-400">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </td>

                          {/* Delete */}
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => removeStandardRow(item.id)}
                              disabled={items.length <= 1}
                              className="p-1 text-zinc-500 hover:text-rose-400 disabled:opacity-30 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Grand Total Bar */}
                <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/60 p-4 rounded-xl">
                  <div className="text-xs text-zinc-400">
                    Total Line Items: <strong className="text-white font-mono">{items.length}</strong>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-400 uppercase">Auto-Calculated Total:</span>
                    <span className="text-xl font-black text-teal-400 font-mono">
                      {formatCurrency(standardTotal)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Justification & Clinical Note */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <label className="block text-xs font-bold text-white mb-2">
                Operational Justification / Clinical Case Memo
              </label>
              <textarea
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="State clearly why these items are required, patient volume affected, or urgency justification..."
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft size={14} />
                <span>Back to Department</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 active:scale-95"
              >
                <span>Preview Official Voucher & Signatures</span>
                <ChevronRight size={14} />
              </button>
            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            STEP 3: VERIFICATION, SIGNATURE STAMPS & APPROVAL CHAIN PREVIEW
           ───────────────────────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {submitted ? (
              /* Success Screen */
              <div className="p-10 rounded-3xl bg-zinc-900 border border-teal-500/40 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center mx-auto mb-4">
                  <Check size={32} strokeWidth={3} />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-teal-400">
                  VOUCHER TRANSMITTED TO SUPERVISOR DESK
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Requisition {createdReqId} Created
                </h2>
                <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Your requisition has been digitally signed and routed to your Unit Supervisor for Level 2 verification. You will receive an alert once Finance clears the grant allocation.
                </p>

                <div className="mt-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 max-w-sm mx-auto text-left text-xs font-mono">
                  <div className="flex justify-between py-1 text-zinc-400">
                    <span>Voucher No:</span>
                    <strong className="text-teal-400">{createdReqId}</strong>
                  </div>
                  <div className="flex justify-between py-1 text-zinc-400">
                    <span>Department:</span>
                    <strong className="text-white">{currentDept.name} ({selectedUnit})</strong>
                  </div>
                  <div className="flex justify-between py-1 text-zinc-400">
                    <span>Total Value:</span>
                    <strong className="text-teal-400">{formatCurrency(grandTotal)}</strong>
                  </div>
                  <div className="flex justify-between py-1 text-zinc-400">
                    <span>Grant Code:</span>
                    <strong className="text-emerald-400">{donorGrantCode}</strong>
                  </div>
                  <div className="flex justify-between py-1 text-zinc-400 border-t border-zinc-900 mt-1 pt-1">
                    <span>Current Stage:</span>
                    <strong className="text-amber-400">Level 2: Supervisor Review</strong>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => router.push(`/hod?dept=${selectedDeptId}`)}
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
                  >
                    <span>View in Supervisor Approval Desk</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => router.push(`/request/${createdReqId}`)}
                    className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
                  >
                    <FileText size={14} className="text-teal-400" />
                    <span>View Printable Voucher</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Voucher Verification Preview */
              <>
                <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative">
                  
                  {/* Top Seal */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                        <Heart size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white tracking-tight">NOMA AID NIGERIA INITIATIVE (NANI)</h2>
                        <p className="text-xs text-teal-400 font-mono">OFFICIAL REQUISITION VOUCHER · AUDIT PRE-FLIGHT</p>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs text-zinc-400">
                      <div>Date: <strong className="text-white">{reqDate}</strong></div>
                      <div>Voucher ID: <strong className="text-teal-400">NANI-REQ-PENDING</strong></div>
                    </div>
                  </div>

                  {/* Voucher Summary Strip */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-zinc-800 text-xs">
                    <div>
                      <span className="text-zinc-500 font-mono block">DEPARTMENT</span>
                      <strong className="text-white text-sm">{currentDept.name}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-mono block">UNIT</span>
                      <strong className="text-white text-sm">{selectedUnit}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-mono block">DONOR GRANT LINE</span>
                      <strong className="text-emerald-400 text-sm font-mono">{donorGrantCode}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-mono block">TOTAL ESTIMATED DISBURSEMENT</span>
                      <strong className="text-teal-400 text-lg font-black font-mono">{formatCurrency(grandTotal)}</strong>
                    </div>
                  </div>

                  {/* Items Preview Table */}
                  <div className="py-6 border-b border-zinc-800">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                      {isTransportMode ? 'PASSENGER TRANSPORT SCHEDULE' : 'SCHEDULE OF LINE ITEMS'}
                    </h4>

                    {isTransportMode ? (
                      <div className="space-y-1 text-xs">
                        {transportRows.map(r => (
                          <div key={r.id} className="flex justify-between py-1.5 px-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono">
                            <span>#{r.sn} {r.name} ({r.type.toUpperCase()}) — {r.stateOfOrigin} [{r.direction}]</span>
                            <span className="font-bold text-teal-400">{formatCurrency(r.cost)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1 text-xs">
                        {items.map(i => (
                          <div key={i.id} className="flex justify-between py-1.5 px-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono">
                            <span>#{i.sn} {i.name} ({i.quantity} {i.unit} @ {formatCurrency(i.unitPrice)}) [Code: {i.transactionCode}]</span>
                            <span className="font-bold text-teal-400">{formatCurrency(i.quantity * i.unitPrice)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── 4-Level Approval Chain & Digital Signature Preview ── */}
                  <div className="pt-6">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-4">
                      4-LEVEL APPROVAL CHAIN & DIGITAL SIGNATURE WATERMARKS
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      {/* Level 1: Requester (Active / Auto-Signed) */}
                      <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/40 relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-teal-400 font-bold">LEVEL 1 · REQUESTER</span>
                          <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                            SIGNED ✓
                          </span>
                        </div>
                        <p className="font-bold text-xs text-white">{requesterName}</p>
                        <p className="text-[10px] text-zinc-400">{selectedUnit} Unit Staff</p>
                        <div className="mt-3 pt-2 border-t border-teal-500/20 text-[9px] font-mono text-teal-400/80">
                          DIGITAL SIGNATURE STAMP:<br />
                          {requesterName.replace(/\s+/g, '').toUpperCase()}/VOUCH/{new Date().getFullYear()}
                        </div>
                      </div>

                      {/* Level 2: Supervisor (Pending) */}
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-zinc-400 font-bold">LEVEL 2 · SUPERVISOR</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold">
                            NEXT IN QUEUE
                          </span>
                        </div>
                        <p className="font-bold text-xs text-zinc-200">Unit / Dept Head</p>
                        <p className="text-[10px] text-zinc-500">{currentDept.name} Desk</p>
                        <div className="mt-3 pt-2 border-t border-zinc-900 text-[9px] font-mono text-zinc-600">
                          Auto-signs upon 1-click approval
                        </div>
                      </div>

                      {/* Level 3: Finance (Pending) */}
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-zinc-400 font-bold">LEVEL 3 · FINANCE</span>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                            AWAITING L2
                          </span>
                        </div>
                        <p className="font-bold text-xs text-zinc-200">Mr. AY, FCA</p>
                        <p className="text-[10px] text-zinc-500">Head of Finance & CA</p>
                        <div className="mt-3 pt-2 border-t border-zinc-900 text-[9px] font-mono text-zinc-600">
                          Locks {donorGrantCode}
                        </div>
                      </div>

                      {/* Level 4: Coordinator (Pending) */}
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-zinc-400 font-bold">LEVEL 4 · COORDINATOR</span>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                            AWAITING L3
                          </span>
                        </div>
                        <p className="font-bold text-xs text-zinc-200">Dr. Emmanuel Bawa</p>
                        <p className="text-[10px] text-zinc-500">Programme Coordinator</p>
                        <div className="mt-3 pt-2 border-t border-zinc-900 text-[9px] font-mono text-zinc-600">
                          Executive authorization
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Submit Action Bar */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <ChevronLeft size={14} />
                    <span>Edit Line Items</span>
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-sm rounded-xl transition-all shadow-xl shadow-teal-500/25 flex items-center gap-2 active:scale-95"
                  >
                    <span>Apply Signature & Submit to Supervisor</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
