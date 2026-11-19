'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { mockRequests, formatCurrency, formatDate, naniDepartments } from '@/lib/mock-data';
import { getStoredRequests, saveStoredRequests } from '@/lib/storage';
import { Request, RequestStatus, ApprovalSignature, ApprovalLevel } from '@/lib/types';
import {
  Check, X, MessageSquare, AlertCircle, Clock, 
  ArrowRight, ShieldCheck, ChevronRight, Layers,
  Building2, DollarSign, Package, UserCheck, Send, Bell,
  Award, Heart, Users, FileText, CheckCircle2, AlertTriangle, Eye
} from 'lucide-react';

interface SupervisorProfile {
  id: string;
  departmentId: string;
  departmentName: string;
  supervisorName: string;
  supervisorTitle: string;
  level: string;
  icon: string;
  description: string;
}

const supervisorProfiles: SupervisorProfile[] = [
  {
    id: 'clinicals',
    departmentId: 'clinicals',
    departmentName: 'Clinicals Department',
    supervisorName: 'Dr. Grace Mshelia',
    supervisorTitle: 'Director of Clinical Services',
    level: 'Level 2: Department Head',
    icon: '🏥',
    description: 'Pharmacy, Nursing, Hostel Transport, Dental Clinic, Physiotherapy, Social Assistance.',
  },
  {
    id: 'facility',
    departmentId: 'facility',
    departmentName: 'Facility Department',
    supervisorName: 'Mr. Patrick Adaeze',
    supervisorTitle: 'Head of Facility & Fleet Operations',
    level: 'Level 2: Department Head',
    icon: '🏗️',
    description: 'Logistics/Fleet fuel, Janitorial supplies, Laundry chemicals, Gardening, Repairs.',
  },
  {
    id: 'admin',
    departmentId: 'admin',
    departmentName: 'Admin Department',
    supervisorName: 'Mrs. Stella Eze',
    supervisorTitle: 'Head of Hospital Administration',
    level: 'Level 2: Department Head',
    icon: '🏢',
    description: 'Kitchen food provisions, Office administrative supplies, Operations.',
  },
  {
    id: 'hr',
    departmentId: 'hr',
    departmentName: 'Human Resources',
    supervisorName: 'Mrs. Zainab Aliyu',
    supervisorTitle: 'Human Resources Manager',
    level: 'Level 2: Department Head',
    icon: '👥',
    description: 'Staff training workshops, Reimbursements, Staff welfare loans.',
  },
  {
    id: 'coordinator',
    departmentId: 'coordinator',
    departmentName: 'Programme Coordinator Office',
    supervisorName: 'Dr. Emmanuel Bawa',
    supervisorTitle: 'NANI Programme Coordinator',
    level: 'Level 4: Programme Executive',
    icon: '⚡',
    description: 'Cross-departmental executive authorization following Finance grant lock.',
  },
  {
    id: 'national',
    departmentId: 'national',
    departmentName: 'National Coordinator Office',
    supervisorName: 'Dr. Usman Sani, FWACS',
    supervisorTitle: 'National Coordinator (NANI Leadership)',
    level: 'Level 5: National Directorate',
    icon: '🏛️',
    description: 'High-value capital expenditures (>₦500,000) & donor compliance ratification.',
  },
];

export default function HODHubPage() {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('clinicals');
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [activeReqModal, setActiveReqModal] = useState<Request | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    // Load from localStorage
    setRequests(getStoredRequests());

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const deptParam = urlParams.get('dept');
      const roleParam = urlParams.get('role');
      if (roleParam === 'coordinator') {
        setSelectedProfileId('coordinator');
      } else if (roleParam === 'national') {
        setSelectedProfileId('national');
      } else if (deptParam) {
        const match = supervisorProfiles.find(p => p.id.toLowerCase() === deptParam.toLowerCase() || p.departmentName.toLowerCase().includes(deptParam.toLowerCase()));
        if (match) setSelectedProfileId(match.id);
      }
    }

    const handleUpdate = () => {
      setRequests(getStoredRequests());
    };
    window.addEventListener('nani_requests_updated', handleUpdate);
    return () => window.removeEventListener('nani_requests_updated', handleUpdate);
  }, []);

  const activeProfile = supervisorProfiles.find(p => p.id === selectedProfileId) || supervisorProfiles[0];

  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Filter requests based on selected supervisor desk
  const filteredRequests = requests.filter(r => {
    if (activeProfile.id === 'coordinator') {
      return r.status === 'coordinator-review' || r.status === 'finance-review' || r.status === 'approved' || r.status === 'disbursement-ready' || r.status === 'closed';
    }
    if (activeProfile.id === 'national') {
      return r.status === 'national-coordinator-review' || r.totalValue >= 500000;
    }
    const rDept = (r.department || '').toLowerCase();
    const pDept = activeProfile.id.toLowerCase();
    if (pDept === 'hr') return rDept.includes('hr') || rDept.includes('human');
    if (pDept === 'facility') return rDept.includes('facil');
    if (pDept === 'admin') return rDept.includes('admin') || rDept.includes('kitchen');
    if (pDept === 'clinicals') return rDept.includes('clinic') || rDept.includes('pharm') || rDept.includes('hostel');
    return rDept === activeProfile.departmentName.toLowerCase().replace(' department', '');
  });

  const pendingCount = filteredRequests.filter(r => {
    if (activeProfile.id === 'coordinator') return r.status === 'coordinator-review';
    if (activeProfile.id === 'national') return r.status === 'national-coordinator-review' || (r.totalValue >= 500000 && r.status === 'coordinator-review');
    return r.status === 'submitted' || r.status === 'supervisor-review';
  }).length;

  // Approve with Automatic Digital Signature Watermark
  const handleApprove = (reqId: string) => {
    const timestamp = new Date().toISOString();
    const stampCode = `${activeProfile.supervisorName.split(' ').map(n => n[0]).join('')}/APPR/${new Date().getFullYear()}`;

    const updated = requests.map(r => {
      if (r.id === reqId) {
        const nextStatus: RequestStatus = 
          activeProfile.id === 'coordinator' 
            ? (r.totalValue >= 500000 ? 'national-coordinator-review' : 'approved')
            : activeProfile.id === 'national'
            ? 'approved'
            : 'finance-review';

        const sigLevel: ApprovalLevel = 
          activeProfile.id === 'national' 
            ? 'national-coordinator' 
            : activeProfile.id === 'coordinator' 
            ? 'coordinator' 
            : 'supervisor';

        const newSignature: ApprovalSignature = {
          level: sigLevel,
          actor: activeProfile.supervisorName,
          role: activeProfile.supervisorTitle,
          timestamp,
          signatureStamp: stampCode,
        };

        const targetStage = 
          nextStatus === 'finance-review' 
            ? 'Mr. AY, FCA (Finance Head)' 
            : nextStatus === 'national-coordinator-review' 
            ? 'National Coordinator Directorate' 
            : 'Finance (Ready for Disbursement)';

        return {
          ...r,
          status: nextStatus,
          signatures: [...(r.signatures || []), newSignature],
          timeline: [
            ...r.timeline,
            {
              id: Date.now().toString(),
              action: `${activeProfile.supervisorTitle} Approved ✓`,
              actor: activeProfile.supervisorName,
              role: activeProfile.supervisorTitle,
              timestamp,
              type: 'approved' as const,
              comment: `Digitally signed [Stamp: ${stampCode}]. Forwarded to ${targetStage}.`,
            }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`✓ Digitally Signed & Approved by ${activeProfile.supervisorName}. Forwarded to next stage.`, 'success');
  };

  const handleDecline = (reqId: string) => {
    const timestamp = new Date().toISOString();
    const updated = requests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'rejected' as RequestStatus,
          timeline: [
            ...r.timeline,
            {
              id: Date.now().toString(),
              action: `${activeProfile.supervisorTitle} Declined ✗`,
              actor: activeProfile.supervisorName,
              role: activeProfile.supervisorTitle,
              timestamp,
              type: 'rejected' as const,
              comment: 'Declined by supervisor. Resubmission required.',
            }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`Requisition ${reqId} rejected. Returned to requester.`, 'error');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-600 selection:text-white font-sans">
      <Navbar role={activeProfile.supervisorTitle} userName={activeProfile.supervisorName} />

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans text-xs font-bold ${
          toast.type === 'success' 
            ? 'bg-teal-900 text-white border-teal-700' 
            : toast.type === 'error'
            ? 'bg-rose-900 text-white border-rose-700'
            : 'bg-slate-900 text-white border-slate-700'
        }`}>
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
          <span>{toast.message}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Hub Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-700 font-bold mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>LEVEL 2 - 5 APPROVAL WORKSTATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Supervisor & Coordinator Verification Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review departmental requisitions, verify justification and donor grant alignment, and issue 1-click digital signature approvals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/finance"
              className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <DollarSign size={14} className="text-emerald-700" />
              <span>Go to Finance & Grants</span>
            </Link>
            <Link
              href="/new-request"
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-teal-700/20 flex items-center gap-1.5"
            >
              <span>+ Raise New Requisition</span>
            </Link>
          </div>
        </div>

        {/* ── Supervisor Desk Switcher Strip ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-mono">
              Select Active Approver Station
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Viewing as: <strong className="text-slate-900 font-bold">{activeProfile.supervisorName}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {supervisorProfiles.map((p) => {
              const isSelected = selectedProfileId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProfileId(p.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="text-2xl mb-2">{p.icon}</div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">{p.departmentName}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">{p.supervisorName}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[9px] font-mono text-teal-700 font-bold">
                    {p.level}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Active Approver Card & Overview ── */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-3xl shadow-sm">
              {activeProfile.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">{activeProfile.supervisorName}</h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-mono">
                  {activeProfile.level}
                </span>
              </div>
              <p className="text-xs text-teal-700 font-bold">{activeProfile.supervisorTitle}</p>
              <p className="text-xs text-slate-500 mt-1">{activeProfile.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
            <div className="text-center px-3 border-r border-slate-200">
              <span className="text-xl font-black text-amber-700 font-mono">{pendingCount}</span>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Pending Review</p>
            </div>
            <div className="text-center px-3">
              <span className="text-xl font-black text-slate-900 font-mono">{filteredRequests.length}</span>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Total In Desk</p>
            </div>
          </div>
        </div>

        {/* ── Requisitions Queue Table ── */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {activeProfile.id === 'coordinator' 
                  ? 'Programme Coordinator Executive Authorization Queue'
                  : activeProfile.id === 'national'
                  ? 'National Directorate Ratification Queue'
                  : 'Departmental Requisitions Pending Verification'}
              </h3>
              <p className="text-xs text-slate-500">
                {activeProfile.id === 'coordinator'
                  ? 'Final executive approval following Finance Head (Mr. AY, FCA) budget and grant lock.'
                  : activeProfile.id === 'national'
                  ? 'Ratification for high-value capital expenditure (>₦500,000) and board-level compliance.'
                  : '1-click approval immediately applies your encrypted digital signature stamp and routes to Mr. AY (Finance Head).'}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">{filteredRequests.length} Vouchers Listed</span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <CheckCircle2 size={36} className="mx-auto text-teal-600 mb-3" />
              <p className="text-sm font-bold text-slate-800">Desk Cleared</p>
              <p className="text-xs text-slate-500 mt-1">No requisitions currently awaiting approval in this workstation.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => {
                const isTransport = req.requisitionType === 'transport' || req.unit === 'Hostel';
                const isEducation = req.requisitionType === 'education' || req.unit === 'Education Welfare';
                const isStoreIssue = req.requisitionType === 'store-issue';
                const isHighValue = req.totalValue >= 500000;
                
                const isActionable = 
                  activeProfile.id === 'coordinator'
                    ? req.status === 'coordinator-review'
                    : activeProfile.id === 'national'
                    ? (req.status === 'national-coordinator-review' || (req.totalValue >= 500000 && req.status === 'coordinator-review'))
                    : (req.status === 'submitted' || req.status === 'supervisor-review');

                const hasAlreadySigned = req.signatures?.some(s => s.actor === activeProfile.supervisorName);

                return (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:bg-slate-50/60 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex-1">
                      
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-teal-700">{req.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                          {req.department} · {req.unit}
                        </span>
                        {isTransport && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                            🚌 Transport Schedule
                          </span>
                        )}
                        {isEducation && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                            🎓 Education Welfare
                          </span>
                        )}
                        {isStoreIssue && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                            📦 Internal Store Issue
                          </span>
                        )}
                        {isHighValue && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-bold flex items-center gap-1">
                            <Award size={10} /> Nat. Coordinator Escalation
                          </span>
                        )}
                        <UrgencyBadge urgency={req.urgency} />
                      </div>

                      {/* Title & Requester */}
                      <h4 className="text-sm font-black text-slate-900">{req.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Requested by <strong className="text-slate-800">{req.requestedBy}</strong> ({req.requestedByRole}) · {formatDate(req.createdAt)}
                      </p>

                      {/* Items / Passengers / Education mini-preview */}
                      <div className="mt-2 text-xs text-slate-600 line-clamp-1 font-mono">
                        {isTransport ? (
                          <span>
                            Passengers: {req.transportPassengers?.map(p => `${p.name} (${p.stateOfOrigin})`).join(', ') || 'Passengers Roster'}
                          </span>
                        ) : isEducation ? (
                          <span>
                            Students: {req.educationStudents?.map(s => `${s.patientName} (${s.schoolName})`).join(', ') || 'Patient Students Sponsored'}
                          </span>
                        ) : (
                          <span>
                            Items: {req.items?.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}
                          </span>
                        )}
                      </div>

                      {/* Justification quote */}
                      <p className="text-[11px] text-slate-600 italic mt-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        "{req.justification}"
                      </p>
                    </div>

                    {/* Right: Value, Grant Code & Decision Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 lg:w-56 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                      
                      <div className="text-left lg:text-right">
                        <span className="text-base font-black text-teal-700 font-mono block">
                          {formatCurrency(req.totalValue)}
                        </span>
                        <span className="text-[10px] text-emerald-800 font-mono font-bold">
                          Grant: {req.donorGrantCode || 'HN-2026-SURG-Q4'}
                        </span>
                        <div className="mt-1">
                          <StatusBadge status={req.status} />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setActiveReqModal(req)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 transition-all text-xs flex items-center gap-1 shadow-sm"
                          title="View Full Voucher"
                        >
                          <Eye size={14} />
                          <span className="hidden sm:inline">Details</span>
                        </button>

                        {isActionable ? (
                          <>
                            <button
                              onClick={() => handleDecline(req.id)}
                              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                            >
                              <X size={14} />
                              <span>Decline</span>
                            </button>

                            <button
                              onClick={() => handleApprove(req.id)}
                              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-700/20 flex items-center gap-1.5 active:scale-95"
                            >
                              <Check size={14} strokeWidth={3} />
                              <span>Sign & Authorize</span>
                            </button>
                          </>
                        ) : hasAlreadySigned ? (
                          <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-300 text-[10px] font-mono font-bold flex items-center gap-1">
                            <Check size={12} strokeWidth={3} /> Signed & Stamped
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200">
                            {req.status === 'finance-review' ? 'At Finance (Mr. AY)' : req.status === 'disbursement-ready' ? 'Ready to Disburse' : req.status.replace('-', ' ')}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* ── Full Voucher Modal ── */}
      {activeReqModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-teal-700 uppercase font-bold">OFFICIAL VOUCHER INSPECTION</span>
                <h3 className="text-lg font-black text-slate-900">{activeReqModal.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{activeReqModal.id} · {activeReqModal.department} ({activeReqModal.unit})</p>
              </div>
              <button
                onClick={() => setActiveReqModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Justification & Financial details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
              <div>
                <span className="text-slate-500 block font-bold">TOTAL VALUE</span>
                <strong className="text-teal-700 text-sm font-black">{formatCurrency(activeReqModal.totalValue)}</strong>
              </div>
              <div>
                <span className="text-slate-500 block font-bold">GRANT CODE</span>
                <strong className="text-emerald-800 text-sm font-bold">{activeReqModal.donorGrantCode || 'HN-2026-SURG-Q4'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block font-bold">BUDGET CODE</span>
                <strong className="text-slate-700 text-sm">{activeReqModal.budgetCode}</strong>
              </div>
              <div>
                <span className="text-slate-500 block font-bold">CURRENT STATUS</span>
                <StatusBadge status={activeReqModal.status} />
              </div>
            </div>

            {/* Line items, Transport Passengers, or Education Students */}
            <div className="my-4">
              <h4 className="text-xs font-mono uppercase text-slate-600 font-bold mb-2">Voucher Schedule Breakdown</h4>
              {activeReqModal.transportPassengers && activeReqModal.transportPassengers.length > 0 ? (
                <div className="space-y-1.5 text-xs">
                  {activeReqModal.transportPassengers.map(p => (
                    <div key={p.id} className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-slate-800">
                      <span>#{p.sn} {p.name} ({p.type}) — {p.stateOfOrigin} [{p.direction}]</span>
                      <strong className="text-teal-700">{formatCurrency(p.transportCost)}</strong>
                    </div>
                  ))}
                </div>
              ) : activeReqModal.educationStudents && activeReqModal.educationStudents.length > 0 ? (
                <div className="space-y-1.5 text-xs">
                  {activeReqModal.educationStudents.map(s => (
                    <div key={s.id} className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-slate-800">
                      <span>#{s.sn} {s.patientName} — {s.schoolName} ({s.classLevel}) [{s.supportType}]</span>
                      <strong className="text-teal-700">{formatCurrency(s.cost)}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {activeReqModal.items?.map(i => (
                    <div key={i.id} className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-slate-800">
                      <span>#{i.sn || 1} {i.name} ({i.quantity} {i.unit} @ {formatCurrency(i.unitPrice)})</span>
                      <strong className="text-teal-700">{formatCurrency(i.totalPrice)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Signatures Applied */}
            <div className="my-4 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-mono uppercase text-teal-700 font-bold mb-2">Digital Signature Trail</h4>
              <div className="space-y-2">
                {activeReqModal.signatures && activeReqModal.signatures.length > 0 ? (
                  activeReqModal.signatures.map(s => (
                    <div key={s.level} className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-teal-800">{s.actor}</span>
                        <span className="text-slate-500 text-[10px] ml-2 font-mono">({s.role})</span>
                      </div>
                      <div className="text-right font-mono text-[10px] text-teal-800">
                        <div>STAMP: {s.signatureStamp}</div>
                        <div className="text-slate-500">{formatDate(s.timestamp)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No supervisor signature applied yet.</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setActiveReqModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApprove(activeReqModal.id);
                  setActiveReqModal(null);
                }}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-700/20"
              >
                Sign & Approve Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
