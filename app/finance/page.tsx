'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { 
  mockRequests, 
  budgetData, 
  donorGrantData, 
  monthlySpendData, 
  categorySpendData, 
  formatCurrency, 
  formatDate 
} from '@/lib/mock-data';
import { getStoredRequests, saveStoredRequests } from '@/lib/storage';
import { Request, RequestStatus, ApprovalSignature } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  DollarSign, FileText, Clock, TrendingUp, Check, X, 
  ChevronRight, AlertTriangle, ShieldCheck, Download, 
  FileSpreadsheet, Lock, Sparkles, Building2, Heart, Award, Eye, Send, ArrowRight
} from 'lucide-react';

const financeReviewStatuses: RequestStatus[] = ['finance-review', 'submitted', 'supervisor-review'];

export default function FinancePage() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [activeTab, setActiveTab] = useState<'pending' | 'disburse' | 'closed'>('pending');
  const [selectedInspectReq, setSelectedInspectReq] = useState<Request | null>(null);
  const [disburseModalReq, setDisburseModalReq] = useState<Request | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Direct Bank Remittance (CBN/Commercial)' | 'Hospital Petty Cash' | 'Corporate Bank Cheque'>('Direct Bank Remittance (CBN/Commercial)');
  const [pvNumber, setPvNumber] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setRequests(getStoredRequests());
    const handleUpdate = () => {
      setRequests(getStoredRequests());
    };
    window.addEventListener('nani_requests_updated', handleUpdate);
    return () => window.removeEventListener('nani_requests_updated', handleUpdate);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Open Disbursement Modal with Auto-Generated PV Number
  const openDisburseModal = (req: Request) => {
    setDisburseModalReq(req);
    const pv = `PV/NANI/2026/${req.id.replace('NANI-REQ-', '')}`;
    setPvNumber(pv);
    setPaymentRef(`CBN-EFT-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  // Confirm Disbursement Action (Finance Head releases funds & generates official Payment Voucher)
  const handleConfirmDisbursement = () => {
    if (!disburseModalReq) return;
    const timestamp = new Date().toISOString();
    const updated = requests.map(r => {
      if (r.id === disburseModalReq.id) {
        return {
          ...r,
          status: 'dispatched' as RequestStatus,
          disbursementDetails: {
            pvNumber,
            paymentMethod: `${paymentMethod} [Ref: ${paymentRef}]`,
            disbursedAt: timestamp,
            disbursedBy: 'Mr. AY, FCA · Head of Finance',
            amount: r.totalValue,
          },
          timeline: [
            ...r.timeline,
            {
              id: Date.now().toString(),
              action: `Funds Disbursed & Payment Voucher Issued (${pvNumber}) 💵`,
              actor: 'Mr. AY, FCA',
              role: 'Head of Finance & Chartered Accountant',
              timestamp,
              type: 'finance' as const,
              comment: `Payment of ${formatCurrency(r.totalValue)} authorized via ${paymentMethod} (${paymentRef}). PV Ref: ${pvNumber}. Sent to ${r.requestedBy} for physical receipt confirmation & retirement.`,
            }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`✓ Payment disbursed & ${pvNumber} issued by Mr. AY. Sent to ${disburseModalReq.requestedBy} for receipt confirmation!`, 'success');
    setDisburseModalReq(null);
  };

  // Finance Approval advances voucher to Programme Coordinator (Level 4)
  const handleApprove = (id: string) => {
    const timestamp = new Date().toISOString();
    const stampCode = `AY/FIN/${new Date().getFullYear()}`;

    const updated = requests.map(r => {
      if (r.id === id) {
        const newSig: ApprovalSignature = {
          level: 'finance',
          actor: 'Mr. AY, FCA',
          role: 'Head of Finance & Chartered Accountant',
          timestamp,
          signatureStamp: stampCode,
        };

        return {
          ...r,
          status: 'coordinator-review' as RequestStatus,
          signatures: [...(r.signatures || []), newSig],
          timeline: [
            ...r.timeline,
            {
              id: Date.now().toString(),
              action: 'Finance Cleared & Committed against Donor Grant Code',
              actor: 'Mr. AY, FCA',
              role: 'Head of Finance & Chartered Accountant',
              timestamp,
              type: 'finance' as const,
              comment: `Budget verified against grant allocation (${r.donorGrantCode || 'HN-2026-SURG-Q4'}). Requisition approved and routed to Programme Coordinator (Level 4 Authorization). Stamp: ${stampCode}.`,
            }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`✓ Requisition ${id} audited & approved by Mr. AY (Finance Head). Routed to Coordinator.`, 'success');
  };

  const handleReject = (id: string) => {
    const reason = prompt('Specify financial audit query / rejection reason:');
    if (!reason) return;

    const timestamp = new Date().toISOString();
    const updated = requests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'rejected' as RequestStatus,
          timeline: [
            ...r.timeline,
            {
              id: Date.now().toString(),
              action: 'Declined by Finance Authority',
              actor: 'Mr. AY, FCA',
              role: 'Head of Finance & Chartered Accountant',
              timestamp,
              type: 'finance' as const,
              comment: `Finance audit query: ${reason}`,
            }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`Requisition ${id} declined by Finance Head.`, 'error');
  };

  // Filter queues
  const pendingClearance = requests.filter(r => financeReviewStatuses.includes(r.status));
  const readyToDisburse = requests.filter(r => r.status === 'approved' || r.status === 'coordinator-review' || r.status === 'national-coordinator-review');
  const disbursedOrClosed = requests.filter(r => r.status === 'disbursement-ready' || r.status === 'dispatched' || r.status === 'closed');

  const approvedTotal = requests
    .filter(r => ['approved', 'coordinator-review', 'national-coordinator-review', 'disbursement-ready', 'dispatched', 'closed'].includes(r.status))
    .reduce((s, r) => s + r.totalValue, 0);

  const totalAllocated = donorGrantData.reduce((s, g) => s + g.allocated, 0);
  const totalSpent = donorGrantData.reduce((s, g) => s + g.spent, 0);
  const utilization = Math.round((totalSpent / totalAllocated) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      <Navbar role="Head of Finance & CA" userName="Mr. AY, FCA" />

      {/* Floating Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans text-xs font-bold ${
          toast.type === 'success' 
            ? 'bg-teal-50 border-teal-300 text-teal-800' 
            : 'bg-rose-50 border-rose-300 text-rose-800'
        }`}>
          <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></div>
          <span>{toast.message}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-700 font-semibold mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>HEAD OF FINANCE & GRANTS CONTROL ROOM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Finance & Grant Accountability Control Room
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Mr. AY, FCA · Head of Finance & Senior Grant Controller (Chartered Accountant)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Exporting Q4 donor expenditure reconciliation report (Excel / CSV)...', 'success')}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>Export Donor Ledger (CSV)</span>
            </button>

            <Link
              href="/reports"
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-600/10 flex items-center gap-1.5"
            >
              <span>Donor Forecasting & PDF</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── KPI Strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Requisitions in Pipe', value: requests.length.toString(), icon: FileText, color: 'text-teal-600', sub: 'Across 5 departments' },
            { label: 'Total Value Committed / Cleared', value: formatCurrency(approvedTotal), icon: DollarSign, color: 'text-emerald-600', sub: 'Q4 2026 expenditure' },
            { label: 'Pending Finance Sign-Off', value: pendingClearance.length.toString(), icon: Clock, color: 'text-amber-600', sub: 'Requires detailed item audit' },
            { label: 'Grant Pool Utilization', value: `${utilization}%`, icon: TrendingUp, color: 'text-blue-600', sub: `${formatCurrency(totalSpent)} of ${formatCurrency(totalAllocated)}` },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-3">
                  <Icon size={18} className={card.color} />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">{card.value}</div>
                <div className="text-xs font-bold text-slate-800 mt-1">{card.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{card.sub}</div>
              </div>
            );
          })}
        </div>

        {/* ── Donor Grant Code Tracking Breakdown ── */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono text-teal-700 font-bold uppercase tracking-wider">
                INTERNATIONAL DONOR AUDIT COMPLIANCE
              </span>
              <h3 className="text-base font-black text-slate-900 mt-0.5">
                Grant Budget Allocation vs. Actual Expenditure
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">5 Active Grant Lines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donorGrantData.map((g) => {
              const pct = Math.round((g.spent / g.allocated) * 100);
              const remaining = g.allocated - g.spent;
              return (
                <div key={g.grant} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-teal-700">{g.grant}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pct > 90 ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {pct}% Spent
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-bold mt-1">{g.description}</p>
                  </div>

                  <div className="mt-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full ${pct > 90 ? 'bg-rose-500' : 'bg-teal-600'}`} 
                        style={{ width: `${Math.min(100, pct)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>Spent: <strong className="text-slate-800">{formatCurrency(g.spent)}</strong></span>
                      <span>Cap: <strong className="text-slate-800">{formatCurrency(g.allocated)}</strong></span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 text-right">
                      Remaining: <strong className="text-teal-700">{formatCurrency(remaining)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Finance Head Management Queues ── */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm mb-8">
          
          {/* Queue Tab Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Financial Authority Clearance & Disbursement</h3>
              <p className="text-xs text-slate-500">
                Inspect items in full detail before locking donor grant lines or authorizing payment release.
              </p>
            </div>

            <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'pending' ? 'bg-teal-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Awaiting Finance Sign-Off ({pendingClearance.length})
              </button>
              <button
                onClick={() => setActiveTab('disburse')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'disburse' ? 'bg-teal-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Ready to Disburse ({readyToDisburse.length})
              </button>
              <button
                onClick={() => setActiveTab('closed')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'closed' ? 'bg-teal-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Disbursed / Retired ({disbursedOrClosed.length})
              </button>
            </div>
          </div>

          {/* Vouchers Table */}
          <div className="mt-4 space-y-3">
            {activeTab === 'pending' && (
              pendingClearance.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Check size={32} className="mx-auto text-teal-500 mb-2" />
                  <p className="text-xs font-bold text-slate-600">All pending requisitions cleared by Finance Head.</p>
                </div>
              ) : (
                pendingClearance.map((req) => {
                  const isTransport = req.requisitionType === 'transport' || req.unit === 'Hostel';
                  return (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold text-teal-700">{req.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-mono">
                            {req.department} · {req.unit}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                            Grant: {req.donorGrantCode || 'HN-2026-SURG-Q4'}
                          </span>
                          {isTransport && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                              🚌 Patient Transport
                            </span>
                          )}
                          <UrgencyBadge urgency={req.urgency} />
                        </div>

                        <h4 className="text-sm font-black text-slate-900">{req.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Requested by <strong className="text-slate-800">{req.requestedBy}</strong> ({req.requestedByRole}) · {formatDate(req.createdAt)}
                        </p>

                        <div className="mt-2 text-xs text-slate-600 font-mono">
                          {isTransport ? (
                            <span>Passengers ({req.transportPassengers?.length || 3}): {req.transportPassengers?.map(p => `${p.name} [${p.stateOfOrigin}]`).join(', ')}</span>
                          ) : (
                            <span>Items ({req.items.length}): {req.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 lg:w-64 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                        <div className="text-left lg:text-right">
                          <span className="text-base font-black text-teal-700 font-mono block">
                            {formatCurrency(req.totalValue)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Code: {req.transactionCode || 'MED-002'}</span>
                        </div>

                        {/* Actions for Finance Head */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedInspectReq(req)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 transition-all shadow-sm"
                            title="Inspect Item Lines & Signatures"
                          >
                            <Eye size={13} className="text-teal-700" />
                            <span>Inspect Details</span>
                          </button>

                          <button
                            onClick={() => handleReject(req.id)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all"
                            title="Decline"
                          >
                            <X size={13} />
                          </button>

                          <button
                            onClick={() => handleApprove(req.id)}
                            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1 active:scale-95"
                          >
                            <Check size={13} strokeWidth={3} />
                            <span>Lock & Approve</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            )}

            {activeTab === 'disburse' && (
              readyToDisburse.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-xs font-bold text-slate-600">No vouchers currently waiting for payment disbursement.</p>
                </div>
              ) : (
                readyToDisburse.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-teal-700">{req.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-mono">
                          {req.department} · {req.unit}
                        </span>
                        <StatusBadge status={req.status} />
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{req.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Approved by Leadership · Ready for Bank Remittance / Cash Disbursement
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-teal-700 font-mono">
                        {formatCurrency(req.totalValue)}
                      </span>
                      <button
                        onClick={() => openDisburseModal(req)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                      >
                        <DollarSign size={14} />
                        <span>Issue PV & Disburse Payment</span>
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

            {activeTab === 'closed' && (
              disbursedOrClosed.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-xs font-bold text-slate-600">No vouchers currently in disbursed or retired state.</p>
                </div>
              ) : (
                disbursedOrClosed.map((req) => {
                  const isRetired = req.status === 'closed';
                  return (
                    <div
                      key={req.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                        isRetired
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-amber-50/50 border-amber-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold text-teal-700">{req.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-mono">
                            {req.department} · {req.unit}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                            Grant: {req.donorGrantCode || 'HN-2026-SURG-Q4'}
                          </span>
                          {isRetired ? (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1 font-mono">
                              <Check size={11} strokeWidth={3} /> 100% RETIRED & CLOSED (AUDIT-READY)
                            </span>
                          ) : (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold flex items-center gap-1 font-mono">
                              <Clock size={11} /> FUNDS DISBURSED · AWAITING REQUESTER RETIREMENT
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-black text-slate-900">{req.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Requested by <strong className="text-slate-800">{req.requestedBy}</strong> ({req.requestedByRole})
                        </p>

                        {/* Audit Details */}
                        <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-slate-700">
                            <span>PV REFERENCE: <strong className="text-teal-700">{req.disbursementDetails?.pvNumber || `PV/NANI/2026/${req.id.replace('NANI-REQ-','')}`}</strong></span>
                            <span>METHOD: <strong className="text-slate-800">{req.disbursementDetails?.paymentMethod || 'Bank Remittance'}</strong></span>
                            <span>DISBURSED BY: <strong className="text-slate-800">{req.disbursementDetails?.disbursedBy || 'Mr. AY, FCA'}</strong></span>
                          </div>

                          {isRetired && req.retirementDetails && (
                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-emerald-800">
                              <span>RETIRED BY: <strong className="text-slate-900">{req.retirementDetails.retiredBy}</strong> [Stamp: {req.retirementDetails.signatureStamp}]</span>
                              <span>CONFIRMED: {formatDate(req.retirementDetails.retiredAt)}</span>
                            </div>
                          )}

                          {isRetired && req.retirementDetails?.receiptNotes && (
                            <p className="text-[11px] text-slate-600 italic pt-1">
                              "{req.retirementDetails.receiptNotes}"
                            </p>
                          )}

                          {!isRetired && (
                            <div className="pt-1 text-[11px] text-amber-700 flex items-center gap-1.5 font-sans">
                              <AlertTriangle size={12} />
                              <span>Requester has been notified on their dashboard to certify physical receipt and lodge invoice slips.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0 lg:w-44">
                        <span className="font-mono text-lg font-black text-teal-700 block">
                          {formatCurrency(req.totalValue)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">
                          {isRetired ? 'Fully Reconciled' : 'Disbursed Balance'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* ── Monthly Expenditure Breakdown Chart ── */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono text-teal-700 font-bold uppercase tracking-wider">MONTHLY FINANCIAL RUN-RATE</span>
              <h3 className="text-base font-black text-slate-900 mt-0.5">Disbursement Velocity by Department</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Jun — Nov 2026</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₦${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '11px', color: '#0f172a' }} 
                  formatter={(val: any) => formatCurrency(Number(val))}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Pharmacy" fill="#0d9488" name="Pharmacy" />
                <Bar dataKey="Transport" fill="#3b82f6" name="Hostel Transport" />
                <Bar dataKey="Admin" fill="#f59e0b" name="Kitchen & Admin" />
                <Bar dataKey="Facility" fill="#10b981" name="Facility Fleet" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>

      {/* ── INSPECT VOUCHER IN FULL DETAIL MODAL (FINANCE HEAD EXCLUSIVE) ── */}
      {selectedInspectReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-teal-700 font-bold uppercase">
                    HEAD OF FINANCE & GRANTS AUDIT INSPECTION
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{selectedInspectReq.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedInspectReq.id} · {selectedInspectReq.department} ({selectedInspectReq.unit})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInspectReq(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Grant & Financial Verification Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">TOTAL VOUCHER VALUE</span>
                <strong className="text-teal-700 text-sm">{formatCurrency(selectedInspectReq.totalValue)}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">DONOR GRANT LINE</span>
                <strong className="text-emerald-700 text-sm">{selectedInspectReq.donorGrantCode || 'HN-2026-SURG-Q4'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">TRANSACTION CODE</span>
                <strong className="text-slate-800 text-sm">{selectedInspectReq.transactionCode || 'MED-002'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">CURRENT STATUS</span>
                <StatusBadge status={selectedInspectReq.status} />
              </div>
            </div>

            {/* Justification Memo */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs my-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Requester Justification / Case Memo:</span>
              <p className="text-slate-700 italic">"{selectedInspectReq.justification}"</p>
            </div>

            {/* Comprehensive Line Items / Passenger Roster */}
            <div className="my-4">
              <h4 className="text-xs font-mono uppercase text-teal-700 font-bold mb-2">
                {selectedInspectReq.requisitionType === 'transport' || selectedInspectReq.unit === 'Hostel' 
                  ? 'Detailed Passenger Transport Roster' 
                  : 'Itemized Schedule Breakdown'}
              </h4>

              {selectedInspectReq.transportPassengers && selectedInspectReq.transportPassengers.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100">
                      <tr className="border-b border-slate-200 text-slate-600 uppercase">
                        <th className="py-2 px-2 text-center w-12">S/N</th>
                        <th className="py-2 px-3">Passenger Name</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">State of Origin</th>
                        <th className="py-2 px-3">Movement</th>
                        <th className="py-2 px-3 text-right">Fixed Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono bg-white">
                      {selectedInspectReq.transportPassengers.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-2 text-center text-slate-400">{p.sn}</td>
                          <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{p.name}</td>
                          <td className="py-2.5 px-3 uppercase text-slate-600">{p.type}</td>
                          <td className="py-2.5 px-3 text-teal-700">{p.stateOfOrigin}</td>
                          <td className="py-2.5 px-3 text-slate-700">{p.direction}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-teal-700">{formatCurrency(p.transportCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100">
                      <tr className="border-b border-slate-200 text-slate-600 uppercase">
                        <th className="py-2 px-2 text-center w-12">S/N</th>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3">Code</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3">Unit</th>
                        <th className="py-2 px-3 text-right">Unit Price</th>
                        <th className="py-2 px-3 text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono bg-white">
                      {selectedInspectReq.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-2 text-center text-slate-400">{item.sn || idx + 1}</td>
                          <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{item.name}</td>
                          <td className="py-2.5 px-3 text-teal-700">{item.transactionCode || 'MED-002'}</td>
                          <td className="py-2.5 px-3 text-center text-slate-700">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-slate-600">{item.unit}</td>
                          <td className="py-2.5 px-3 text-right text-slate-700">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-teal-700">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Signatures from Requester and Supervisor */}
            <div className="my-4 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-mono uppercase text-teal-700 font-bold mb-2">Digital Signatures Attached</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedInspectReq.signatures && selectedInspectReq.signatures.length > 0 ? (
                  selectedInspectReq.signatures.map(s => (
                    <div key={s.level} className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-[10px] text-teal-800 uppercase font-bold">{s.level} SIGNATURE</span>
                        <span className="text-[9px] text-slate-500 font-mono">{formatDate(s.timestamp)}</span>
                      </div>
                      <div className="font-bold text-slate-900">{s.actor}</div>
                      <div className="text-[11px] text-slate-600">{s.role}</div>
                      <div className="mt-2 text-[9px] font-mono text-teal-800">STAMP: {s.signatureStamp}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No supervisor signature applied yet.</p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <Link
                href={`/request/${selectedInspectReq.id}`}
                target="_blank"
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>Open Full Printable Voucher View</span>
                <ArrowRight size={13} />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedInspectReq(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedInspectReq.id);
                    setSelectedInspectReq(null);
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedInspectReq.id);
                    setSelectedInspectReq(null);
                  }}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Lock Grant & Approve
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Official Payment Voucher (PV) & Disbursement Modal ── */}
      {disburseModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <DollarSign size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">FINANCE DISBURSEMENT STATION</span>
                  <h3 className="text-base font-black text-slate-900">Issue Official Payment Voucher (PV)</h3>
                </div>
              </div>
              <button
                onClick={() => setDisburseModalReq(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Voucher Brief */}
            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">REQUISITION:</span>
                <span className="font-bold text-slate-900">{disburseModalReq.id} · {disburseModalReq.title}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">REQUESTER / BENEFICIARY:</span>
                <span className="text-teal-700 font-bold">{disburseModalReq.requestedBy} ({disburseModalReq.department} / {disburseModalReq.unit})</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">DONOR GRANT LINE:</span>
                <span className="text-emerald-700 font-bold">{disburseModalReq.donorGrantCode || 'HN-2026-SURG-Q4'}</span>
              </div>
              <div className="flex justify-between items-center pt-1 text-sm">
                <span className="text-slate-600 font-bold">TOTAL DISBURSEMENT:</span>
                <strong className="text-teal-700 font-black text-base">{formatCurrency(disburseModalReq.totalValue)}</strong>
              </div>
            </div>

            {/* Payment Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-mono uppercase text-slate-600 block mb-1">
                  Payment Voucher (PV) Number
                </label>
                <input
                  type="text"
                  value={pvNumber}
                  onChange={(e) => setPvNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-slate-600 block mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-teal-500 outline-none"
                  >
                    <option value="Direct Bank Remittance (CBN/Commercial)">Direct Bank Remittance (EFT)</option>
                    <option value="Hospital Petty Cash">Hospital Petty Cash Voucher</option>
                    <option value="Corporate Bank Cheque">Corporate Bank Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-slate-600 block mb-1">
                    Bank Reference / Remittance Code
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-teal-700" />
                  <span>Authorizing Officer: Mr. AY, FCA · Head of Finance</span>
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Releasing these funds will update the voucher to Disbursed and notify {disburseModalReq.requestedBy} to certify physical receipt and retire the voucher.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setDisburseModalReq(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDisbursement}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <DollarSign size={14} />
                <span>Confirm & Release Funds Now</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}