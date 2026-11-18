'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { mockRequests, formatCurrency, formatDate } from '@/lib/mock-data';
import { Request, RequestStatus } from '@/lib/types';
import {
  Check, X, MessageSquare, AlertCircle, Clock, 
  ArrowRight, ShieldCheck, ChevronRight, Layers,
  Building2, DollarSign, Package, UserCheck, Send, Bell
} from 'lucide-react';

interface DepartmentGroup {
  id: string;
  name: string;
  hodName: string;
  hodTitle: string;
  roleIcon: string;
  color: string;
  description: string;
}

const departmentGroups: DepartmentGroup[] = [
  {
    id: 'Pharmacy',
    name: 'Pharmacy Services',
    hodName: 'Dr. Chinedu Eze',
    hodTitle: 'Director of Pharmacy Services',
    roleIcon: '💊',
    color: 'border-teal-500 bg-teal-50/50 text-teal-800',
    description: 'Medications, IV fluids, clinical pharmacy consumables, drug stockouts.',
  },
  {
    id: 'Nursing (Ward 3)',
    name: 'Clinical Nursing & Inpatient Wards',
    hodName: 'Matron Beatrice Alao',
    hodTitle: 'Chief Nursing Officer / Matron',
    roleIcon: '🩺',
    color: 'border-purple-500 bg-purple-50/50 text-purple-800',
    description: 'Surgical gloves, syringes, catheter tubes, emergency floor stock.',
  },
  {
    id: 'Laboratory',
    name: 'Laboratory & Diagnostic Services',
    hodName: 'Dr. Ngozi Okonkwo',
    hodTitle: 'Chief Medical Lab Scientist',
    roleIcon: '🧪',
    color: 'border-blue-500 bg-blue-50/50 text-blue-800',
    description: 'PCR reagents, sample tubes, rapid test kits, slides & calibration chemicals.',
  },
  {
    id: 'Transport & Logistics (Drivers)',
    name: 'Transport, Ambulance & Logistics',
    hodName: 'Malam Ibrahim Musa',
    hodTitle: 'Transport & Fleet Manager',
    roleIcon: '🚐',
    color: 'border-amber-500 bg-amber-50/50 text-amber-800',
    description: 'Ambulance tyres, engine service oils, fuel vouchers, roadside emergency fixes.',
  },
  {
    id: 'Maintenance & Engineering',
    name: 'Works & Biomedical Engineering',
    hodName: 'Engr. Bola Adewale',
    hodTitle: 'Head of Facilities & Engineering',
    roleIcon: '⚡',
    color: 'border-orange-500 bg-orange-50/50 text-orange-800',
    description: 'Industrial generator AGO diesel, theatre AC repairs, plumbing & solar power.',
  },
  {
    id: 'Environmental & Janitorial',
    name: 'Environmental Sanitation & Infection Control',
    hodName: 'Mr. Patrick Nwosu',
    hodTitle: 'Environmental Health Officer',
    roleIcon: '🧹',
    color: 'border-emerald-500 bg-emerald-50/50 text-emerald-800',
    description: 'Clinical waste yellow bags, disinfectant bleach, biohazard suits & mops.',
  },
  {
    id: 'Administration & HR',
    name: 'Hospital Administration & HR',
    hodName: 'Barr. Obinna Kalu',
    hodTitle: 'Director of Administration',
    roleIcon: '📁',
    color: 'border-indigo-500 bg-indigo-50/50 text-indigo-800',
    description: 'A4 reams, patient folder jackets, board meeting stationery & documentation.',
  },
];

export default function HODHubPage() {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('Pharmacy');
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const activeGroup = departmentGroups.find(g => g.id === selectedDeptId) || departmentGroups[0];

  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Filter requests belonging to this HOD's department
  const deptRequests = requests.filter(r => 
    r.department === activeGroup.id || 
    r.department.toLowerCase().includes(activeGroup.id.toLowerCase())
  );

  const pendingRequests = deptRequests.filter(r => ['submitted', 'hod-review'].includes(r.status));
  const clearedRequests = deptRequests.filter(r => !['submitted', 'hod-review', 'rejected'].includes(r.status));

  // The Real World Hospital Approval Rule:
  // Under ₦100,000 Routine Consumable -> HOD sign-off pushes directly to Stores or Cashier
  // Over ₦100,000 or Cash PO -> Escalates to CA / Finance Head
  // Over ₦500,000 -> Escalates to Chief Medical Director (CMD)
  const handleApprove = (req: Request) => {
    const isMaterial = req.requisitionType === 'material';
    const isMinor = req.totalValue <= 100000;
    
    let nextStatus: RequestStatus;
    let nextDestination: string;

    if (isMaterial) {
      nextStatus = 'store-review';
      nextDestination = 'Central Stores Depot (Material Issuance)';
    } else if (isMinor) {
      nextStatus = 'disbursement-ready';
      nextDestination = 'Accounts Petty Cashier (Disbursement Authorized)';
    } else if (req.totalValue > 500000) {
      nextStatus = 'executive-review';
      nextDestination = 'Chief Medical Director (CMD / Board Approval)';
    } else {
      nextStatus = 'finance-review';
      nextDestination = 'Finance Head & CA (Budget Verification)';
    }

    setRequests(prev => prev.map(r => 
      r.id === req.id 
        ? {
            ...r,
            status: nextStatus,
            timeline: [
              ...r.timeline,
              {
                id: Date.now().toString(),
                action: `HOD Approved (${isMaterial ? 'Store Issue' : isMinor ? 'Disbursement Ready' : 'Finance Escalated'})`,
                actor: activeGroup.hodName,
                role: activeGroup.hodTitle,
                timestamp: new Date().toISOString(),
                type: 'approved' as const,
                comment: `Signed off by Line Manager. Automatically forwarded to ${nextDestination}.`,
              }
            ]
          }
        : r
    ));

    showToast(`✅ ${req.id} approved by ${activeGroup.hodName}! Pushed to: ${nextDestination}`, 'success');
  };

  const handleDecline = (id: string) => {
    setRequests(prev => prev.map(r => 
      r.id === id 
        ? {
            ...r,
            status: 'rejected' as RequestStatus,
            timeline: [
              ...r.timeline,
              {
                id: Date.now().toString(),
                action: 'Declined by Line HOD',
                actor: activeGroup.hodName,
                role: activeGroup.hodTitle,
                timestamp: new Date().toISOString(),
                type: 'rejected' as const,
                comment: 'Requisition declined by department line manager.',
              }
            ]
          }
        : r
    ));
    showToast(`❌ ${id} declined by HOD. Returned to requester.`, 'error');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={`HOD: ${activeGroup.name}`} userName={activeGroup.hodName} />

      {/* Interactive Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-white text-xs font-bold transition-all flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
        }`}>
          <Bell size={14} className="animate-bounce" />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Executive Protocol Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 shadow-xl border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-mono font-bold uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>Hospital Administrative Governance & Line Manager Rule</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black mt-1">
                Departmental HOD Authorization Desk
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
                Every request <strong>must start and be approved by the staff's direct Line HOD</strong>. 
                Routine items are cleared immediately to Stores or Cashier; higher-threshold expenditures auto-escalate to Finance and the Chief Medical Director.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-200">7 Active Hospital Department Silos</span>
            </div>
          </div>
        </div>

        {/* 1. The Grouped Department Selector Tabs */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Select Department Silo (Click to switch between HOD Workstations):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {departmentGroups.map(dept => {
              const isSelected = selectedDeptId === dept.id;
              const count = requests.filter(r => (r.department === dept.id || r.department.includes(dept.id)) && ['submitted', 'hod-review'].includes(r.status)).length;

              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-teal-600 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{dept.roleIcon}</span>
                    {count > 0 && (
                      <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full animate-pulse">
                        {count} New
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <h3 className={`text-xs font-black truncate ${isSelected ? 'text-teal-900' : 'text-slate-700'}`}>
                      {dept.name.split('&')[0]}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate">{dept.hodName.split(' ')[1] || dept.hodName}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Active HOD Workstation Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center text-xl font-bold">
              {activeGroup.roleIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-md">
                  Active Department Approver
                </span>
                <span className="text-xs text-slate-400 font-mono">Isolated Queue</span>
              </div>
              <h2 className="text-lg font-black text-slate-800 mt-0.5">
                {activeGroup.hodName} <span className="text-xs font-normal text-slate-500">— {activeGroup.hodTitle}</span>
              </h2>
              <p className="text-xs text-slate-500">{activeGroup.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Awaiting Your Sign-off:</span>
              <span className="text-base font-black text-amber-600">{pendingRequests.length} Pending</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Cleared This Month:</span>
              <span className="text-base font-black text-emerald-600">{clearedRequests.length} Handled</span>
            </div>
          </div>
        </div>

        {/* 3. Requisitions Action List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {activeGroup.name} · Incoming Staff Requisitions ({deptRequests.length})
            </h3>
            <span className="text-xs text-slate-500">
              Only showing requests raised by {activeGroup.name} personnel
            </span>
          </div>

          {deptRequests.map(req => {
            const isPending = ['submitted', 'hod-review'].includes(req.status);
            const isMaterial = req.requisitionType === 'material';
            const isMinor = req.totalValue <= 100000;

            return (
              <div 
                key={req.id} 
                className={`bg-white rounded-2xl border transition-all p-5 shadow-sm ${
                  isPending ? 'border-amber-200 ring-1 ring-amber-100/50' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Requisition Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {req.id}
                      </span>
                      <StatusBadge status={req.status} />
                      <UrgencyBadge urgency={req.urgency} />

                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        isMaterial 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {isMaterial ? '📦 Material Consumable (Stores Issue)' : '💵 Financial Disbursement (Cash PO)'}
                      </span>

                      <span className="text-xs text-slate-400 font-mono ml-auto">
                        Budget Code: {req.budgetCode}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900">{req.title}</h4>
                    
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong>Staff Note:</strong> {req.justification}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span>Submitted by: <strong className="text-slate-800">{req.requestedBy}</strong> ({req.requestedByRole})</span>
                      <span>•</span>
                      <span>Total: <strong className="text-teal-700 font-mono text-sm">{formatCurrency(req.totalValue)}</strong></span>
                    </div>
                  </div>

                  {/* Right: Dynamic Interactive Action Hub */}
                  <div className="lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Automated Escalation Rule:
                      </span>
                      <p className="text-xs font-medium text-slate-700">
                        {isMaterial ? (
                          <span className="text-emerald-700 font-bold">➔ Routes directly to Central Stores for immediate issuance.</span>
                        ) : isMinor ? (
                          <span className="text-teal-700 font-bold">➔ Routine under ₦100k: Authorizes direct cashier disbursement.</span>
                        ) : req.totalValue > 500000 ? (
                          <span className="text-purple-700 font-bold">➔ Above ₦500k: Escalates to Finance Head & Chief Medical Director.</span>
                        ) : (
                          <span className="text-amber-700 font-bold">➔ Pushed to Chartered Accountant for budget allocation.</span>
                        )}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleApprove(req)}
                            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          >
                            <Check size={14} />
                            <span>
                              {isMaterial ? 'Approve & Send to Store' : isMinor ? 'Approve Disbursement' : 'Approve & Escalate'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDecline(req.id)}
                            className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                          <span>Action completed by {activeGroup.hodName.split(' ')[1]}</span>
                          <Link href={`/request/${req.id}`} className="font-bold text-teal-600 hover:underline flex items-center gap-1">
                            <span>Audit Trail</span>
                            <ChevronRight size={12} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

          {deptRequests.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <span className="text-4xl block mb-2">{activeGroup.roleIcon}</span>
              <h4 className="font-bold text-slate-700 text-base">No Requisitions in {activeGroup.name}</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No active requests currently pending for {activeGroup.hodName}. Select another department group above to test approval workflows.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
