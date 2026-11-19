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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950">
      <Navbar role={activeProfile.supervisorTitle} userName={activeProfile.supervisorName} />

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans text-xs font-bold ${
          toast.type === 'success' 
            ? 'bg-teal-950 border-teal-500 text-teal-300' 
            : toast.type === 'error'
            ? 'bg-rose-950 border-rose-500 text-rose-300'
            : 'bg-zinc-900 border-zinc-700 text-zinc-200'
        }`}>
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
          <span>{toast.message}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Hub Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>LEVEL 2 - 5 APPROVAL WORKSTATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Supervisor & Coordinator Verification Desk
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Review departmental requisitions, verify justification and donor grant alignment, and issue 1-click digital signature approvals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/finance"
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 transition-all flex items-center gap-1.5"
            >
              <DollarSign size={14} className="text-emerald-400" />
              <span>Go to Finance & Grants</span>
            </Link>
            <Link
              href="/new-request"
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
            >
              <span>+ Raise New Requisition</span>
            </Link>
          </div>
        </div>

        {/* ── Supervisor Desk Switcher Strip ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Select Active Approver Station
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              Simulating: <strong className="text-white">{activeProfile.supervisorName}</strong>
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
                      ? 'bg-zinc-900 border-teal-500 shadow-xl shadow-teal-500/10 ring-1 ring-teal-500/30'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-800/50'
                  }`}
                >
                  <div>
                    <div className="text-2xl mb-2">{p.icon}</div>
                    <h4 className="font-bold text-xs text-white leading-tight">{p.departmentName}</h4>
                    <p className="text-[10px] text-zinc-400 mt-1">{p.supervisorName}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[9px] font-mono text-teal-400 font-bold">
                    {p.level}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Active Approver Card & Overview ── */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-3xl">
              {activeProfile.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{activeProfile.supervisorName}</h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono">
                  {activeProfile.level}
                </span>
              </div>
              <p className="text-xs text-teal-400 font-medium">{activeProfile.supervisorTitle}</p>
              <p className="text-xs text-zinc-400 mt-1">{activeProfile.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-950 p-3 rounded-xl border border-zinc-800 shrink-0">
            <div className="text-center px-3 border-r border-zinc-800">
              <span className="text-xl font-black text-amber-400 font-mono">{pendingCount}</span>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Pending Review</p>
            </div>
            <div className="text-center px-3">
              <span className="text-xl font-black text-white font-mono">{filteredRequests.length}</span>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Total In Desk</p>
            </div>
          </div>
        </div>

        {/* ── Requisitions Queue Table ── */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-black text-white">
                {activeProfile.id === 'coordinator' 
                  ? 'Programme Coordinator Executive Authorization Queue'
                  : activeProfile.id === 'national'
                  ? 'National Directorate Ratification Queue'
                  : 'Departmental Requisitions Pending Verification'}
              </h3>
              <p className="text-xs text-zinc-400">
                {activeProfile.id === 'coordinator'
                  ? 'Final executive approval following Finance Head (Mr. AY, FCA) budget and grant lock.'
                  : activeProfile.id === 'national'
                  ? 'Ratification for high-value capital expenditure (>₦500,000) and board-level compliance.'
                  : '1-click approval immediately applies your encrypted digital signature stamp and routes to Mr. AY (Finance Head).'}
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">{filteredRequests.length} Vouchers Listed</span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <CheckCircle2 size={36} className="mx-auto text-teal-500/40 mb-3" />
              <p className="text-sm font-bold text-zinc-300">Desk Cleared</p>
              <p className="text-xs text-zinc-500 mt-1">No requisitions currently awaiting approval in this workstation.</p>
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
                    className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-teal-400">{req.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                          {req.department} · {req.unit}
                        </span>
                        {isTransport && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                            🚌 Transport Schedule
                          </span>
                        )}
                        {isEducation && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                            🎓 Education Welfare
                          </span>
                        )}
                        {isStoreIssue && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                            📦 Internal Store Issue
                          </span>
                        )}
                        {isHighValue && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold flex items-center gap-1">
                            <Award size={10} /> Nat. Coordinator Escalation
                          </span>
                        )}
                        <UrgencyBadge urgency={req.urgency} />
                      </div>

                      {/* Title & Requester */}
                      <h4 className="text-sm font-black text-white">{req.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Requested by <strong className="text-zinc-200">{req.requestedBy}</strong> ({req.requestedByRole}) · {formatDate(req.createdAt)}
                      </p>

                      {/* Items / Passengers / Education mini-preview */}
                      <div className="mt-2 text-xs text-zinc-400 line-clamp-1 font-mono">
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
                      <p className="text-[11px] text-zinc-500 italic mt-1 bg-zinc-900/60 p-2 rounded-lg border border-zinc-900">
                        "{req.justification}"
                      </p>
                    </div>

                    {/* Right: Value, Grant Code & Decision Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 lg:w-56 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
                      
                      <div className="text-left lg:text-right">
                        <span className="text-base font-black text-teal-400 font-mono block">
                          {formatCurrency(req.totalValue)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
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
                          className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition-all text-xs flex items-center gap-1"
                          title="View Full Voucher"
                        >
                          <Eye size={14} />
                          <span className="hidden sm:inline">Details</span>
                        </button>

                        {isActionable ? (
                          <>
                            <button
                              onClick={() => handleDecline(req.id)}
                              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                            >
                              <X size={14} />
                              <span>Decline</span>
                            </button>

                            <button
                              onClick={() => handleApprove(req.id)}
                              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1.5 active:scale-95"
                            >
                              <Check size={14} strokeWidth={3} />
                              <span>Sign & Authorize</span>
                            </button>
                          </>
                        ) : hasAlreadySigned ? (
                          <span className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-mono font-bold flex items-center gap-1">
                            <Check size={12} strokeWidth={3} /> Signed & Stamped
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 text-[10px] font-mono">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase">OFFICIAL VOUCHER INSPECTION</span>
                <h3 className="text-lg font-black text-white">{activeReqModal.title}</h3>
                <p className="text-xs text-zinc-400 font-mono">{activeReqModal.id} · {activeReqModal.department} ({activeReqModal.unit})</p>
              </div>
              <button
                onClick={() => setActiveReqModal(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Justification & Financial details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block">TOTAL VALUE</span>
                <strong className="text-teal-400 text-sm">{formatCurrency(activeReqModal.totalValue)}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">GRANT CODE</span>
                <strong className="text-emerald-400 text-sm">{activeReqModal.donorGrantCode || 'HN-2026-SURG-Q4'}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">BUDGET CODE</span>
                <strong className="text-zinc-300 text-sm">{activeReqModal.budgetCode}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">CURRENT STATUS</span>
                <StatusBadge status={activeReqModal.status} />
              </div>
            </div>

            {/* Line items, Transport Passengers, or Education Students */}
            <div className="my-4">
              <h4 className="text-xs font-mono uppercase text-zinc-400 mb-2">Voucher Schedule Breakdown</h4>
              {activeReqModal.transportPassengers && activeReqModal.transportPassengers.length > 0 ? (
                <div className="space-y-1.5 text-xs">
                  {activeReqModal.transportPassengers.map(p => (
                    <div key={p.id} className="flex justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800 font-mono">
                      <span>#{p.sn} {p.name} ({p.type}) — {p.stateOfOrigin} [{p.direction}]</span>
                      <strong className="text-teal-400">{formatCurrency(p.transportCost)}</strong>
                    </div>
                  ))}
                </div>
              ) : activeReqModal.educationStudents && activeReqModal.educationStudents.length > 0 ? (
                <div className="space-y-1.5 text-xs">
                  {activeReqModal.educationStudents.map(s => (
                    <div key={s.id} className="flex justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800 font-mono">
                      <span>#{s.sn} {s.patientName} — {s.schoolName} ({s.classLevel}) [{s.supportType}]</span>
                      <strong className="text-teal-400">{formatCurrency(s.cost)}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {activeReqModal.items?.map(i => (
                    <div key={i.id} className="flex justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800 font-mono">
                      <span>#{i.sn || 1} {i.name} ({i.quantity} {i.unit} @ {formatCurrency(i.unitPrice)})</span>
                      <strong className="text-teal-400">{formatCurrency(i.totalPrice)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Signatures Applied */}
            <div className="my-4 pt-4 border-t border-zinc-800">
              <h4 className="text-xs font-mono uppercase text-teal-400 mb-2">Digital Signature Trail</h4>
              <div className="space-y-2">
                {activeReqModal.signatures && activeReqModal.signatures.length > 0 ? (
                  activeReqModal.signatures.map(s => (
                    <div key={s.level} className="p-3 rounded-xl bg-teal-950/20 border border-teal-500/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-teal-300">{s.actor}</span>
                        <span className="text-zinc-400 text-[10px] ml-2 font-mono">({s.role})</span>
                      </div>
                      <div className="text-right font-mono text-[10px] text-teal-400">
                        <div>STAMP: {s.signatureStamp}</div>
                        <div className="text-zinc-500">{formatDate(s.timestamp)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic">No supervisor signature applied yet.</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => setActiveReqModal(null)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApprove(activeReqModal.id);
                  setActiveReqModal(null);
                }}
                className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded-xl text-xs"
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
