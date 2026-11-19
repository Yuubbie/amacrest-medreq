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
              action: 'Finance Budget Lock & Verification Approved ✓',
              actor: 'Mr. AY, FCA',
              role: 'Head of Finance & Chartered Accountant',
              timestamp,
              type: 'finance' as const,
              comment: `Donor grant line ${r.donorGrantCode || 'HN-2026-SURG-Q4'} verified and committed. Forwarded to Programme Coordinator.`,
            }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`✓ Voucher ${id} approved & grant line locked by Mr. AY (Finance Head). Forwarded to Coordinator.`, 'success');
  };

  // Disburse Funds Action (Finance Head releases funds to requester)
  const handleDisburse = (id: string) => {
    const timestamp = new Date().toISOString();
    const updated = requests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'disbursement-ready' as RequestStatus,
          timeline: [
            ...r.timeline,
            {
              id: Date.now().toString(),
              action: 'Funds Disbursed by Finance (Bank Remittance / Cash Issued) 💵',
              actor: 'Mr. AY, FCA',
              role: 'Head of Finance & Chartered Accountant',
              timestamp,
              type: 'finance' as const,
              comment: 'Payment authorized and released by Mr. AY (Finance Head). Requester acknowledgment required for retirement.',
            }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`✓ Payment disbursed for ${id} by Mr. AY. Requester has been notified to acknowledge receipt.`, 'success');
  };

  const handleReject = (id: string) => {
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
              action: 'Finance Declined ✗',
              actor: 'Mr. AY, FCA',
              role: 'Head of Finance & Chartered Accountant',
              timestamp,
              type: 'rejected' as const,
              comment: 'Declined due to budget allocation limits.',
            }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`Voucher ${id} has been declined by Mr. AY (Finance Head). Returned to department.`, 'error');
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950">
      <Navbar role="Head of Finance & CA" userName="Mr. AY, FCA" />

      {/* Floating Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans text-xs font-bold ${
          toast.type === 'success' 
            ? 'bg-teal-950 border-teal-500 text-teal-300' 
            : 'bg-rose-950 border-rose-500 text-rose-300'
        }`}>
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
          <span>{toast.message}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>HEAD OF FINANCE & GRANTS CONTROL ROOM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Finance & Grant Accountability Control Room
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Mr. AY, FCA · Head of Finance & Senior Grant Controller (Chartered Accountant)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Exporting Q4 donor expenditure reconciliation report (Excel / CSV)...', 'success')}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <FileSpreadsheet size={14} className="text-emerald-400" />
              <span>Export Donor Ledger (CSV)</span>
            </button>

            <Link
              href="/reports"
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
            >
              <span>Donor Forecasting & PDF</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── KPI Strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Requisitions in Pipe', value: requests.length.toString(), icon: FileText, color: 'text-teal-400', sub: 'Across 5 departments' },
            { label: 'Total Value Committed / Cleared', value: formatCurrency(approvedTotal), icon: DollarSign, color: 'text-emerald-400', sub: 'Q4 2026 expenditure' },
            { label: 'Pending Finance Sign-Off', value: pendingClearance.length.toString(), icon: Clock, color: 'text-amber-400', sub: 'Requires detailed item audit' },
            { label: 'Grant Pool Utilization', value: `${utilization}%`, icon: TrendingUp, color: 'text-blue-400', sub: `${formatCurrency(totalSpent)} of ${formatCurrency(totalAllocated)}` },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-3">
                  <Icon size={18} className={card.color} />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">{card.value}</div>
                <div className="text-xs font-bold text-zinc-300 mt-1">{card.label}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{card.sub}</div>
              </div>
            );
          })}
        </div>

        {/* ── Donor Grant Code Tracking Breakdown ── */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider">
                INTERNATIONAL DONOR AUDIT COMPLIANCE
              </span>
              <h3 className="text-base font-black text-white mt-0.5">
                Grant Budget Allocation vs. Actual Expenditure
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">5 Active Grant Lines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donorGrantData.map((g) => {
              const pct = Math.round((g.spent / g.allocated) * 100);
              const remaining = g.allocated - g.spent;
              return (
                <div key={g.grant} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-teal-400">{g.grant}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pct > 90 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {pct}% Spent
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-bold mt-1">{g.description}</p>
                  </div>

                  <div className="mt-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full ${pct > 90 ? 'bg-rose-500' : 'bg-teal-500'}`} 
                        style={{ width: `${Math.min(100, pct)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                      <span>Spent: <strong className="text-zinc-200">{formatCurrency(g.spent)}</strong></span>
                      <span>Cap: <strong className="text-zinc-200">{formatCurrency(g.allocated)}</strong></span>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-1 text-right">
                      Remaining: <strong className="text-teal-400">{formatCurrency(remaining)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Finance Head Management Queues ── */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl mb-8">
          
          {/* Queue Tab Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-black text-white">Financial Authority Clearance & Disbursement</h3>
              <p className="text-xs text-zinc-400">
                Inspect items in full detail before locking donor grant lines or authorizing payment release.
              </p>
            </div>

            <div className="flex p-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'pending' ? 'bg-teal-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                1. Awaiting Finance Sign-Off ({pendingClearance.length})
              </button>
              <button
                onClick={() => setActiveTab('disburse')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'disburse' ? 'bg-teal-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                2. Ready to Disburse ({readyToDisburse.length})
              </button>
              <button
                onClick={() => setActiveTab('closed')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'closed' ? 'bg-teal-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
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
                <div className="py-12 text-center text-zinc-500">
                  <Check size={32} className="mx-auto text-teal-500/40 mb-2" />
                  <p className="text-xs font-bold text-zinc-400">All pending requisitions cleared by Finance Head.</p>
                </div>
              ) : (
                pendingClearance.map((req) => {
                  const isTransport = req.requisitionType === 'transport' || req.unit === 'Hostel';
                  return (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold text-teal-400">{req.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                            {req.department} · {req.unit}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                            Grant: {req.donorGrantCode || 'HN-2026-SURG-Q4'}
                          </span>
                          {isTransport && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                              🚌 Patient Transport
                            </span>
                          )}
                          <UrgencyBadge urgency={req.urgency} />
                        </div>

                        <h4 className="text-sm font-black text-white">{req.title}</h4>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Requested by <strong className="text-zinc-200">{req.requestedBy}</strong> ({req.requestedByRole}) · {formatDate(req.createdAt)}
                        </p>

                        <div className="mt-2 text-xs text-zinc-400 font-mono">
                          {isTransport ? (
                            <span>Passengers ({req.transportPassengers?.length || 3}): {req.transportPassengers?.map(p => `${p.name} [${p.stateOfOrigin}]`).join(', ')}</span>
                          ) : (
                            <span>Items ({req.items.length}): {req.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 lg:w-64 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
                        <div className="text-left lg:text-right">
                          <span className="text-base font-black text-teal-400 font-mono block">
                            {formatCurrency(req.totalValue)}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">Code: {req.transactionCode || 'MED-002'}</span>
                        </div>

                        {/* Actions for Finance Head */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedInspectReq(req)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-200 flex items-center gap-1 transition-all"
                            title="Inspect Item Lines & Signatures"
                          >
                            <Eye size={13} className="text-teal-400" />
                            <span>Inspect Details</span>
                          </button>

                          <button
                            onClick={() => handleReject(req.id)}
                            className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all"
                            title="Decline"
                          >
                            <X size={13} />
                          </button>

                          <button
                            onClick={() => handleApprove(req.id)}
                            className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1 active:scale-95"
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
                <div className="py-12 text-center text-zinc-500">
                  <p className="text-xs font-bold text-zinc-400">No vouchers currently waiting for payment disbursement.</p>
                </div>
              ) : (
                readyToDisburse.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-teal-400">{req.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                          {req.department} · {req.unit}
                        </span>
                        <StatusBadge status={req.status} />
                      </div>
                      <h4 className="text-sm font-black text-white">{req.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Approved by Leadership · Ready for Bank Remittance / Cash Disbursement
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-teal-400 font-mono">
                        {formatCurrency(req.totalValue)}
                      </span>
                      <button
                        onClick={() => handleDisburse(req.id)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
                      >
                        <DollarSign size={14} />
                        <span>Disburse Payment (Issue Funds)</span>
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

            {activeTab === 'closed' && (
              disbursedOrClosed.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">
                  <p className="text-xs font-bold text-zinc-400">No vouchers in disbursed or retired state.</p>
                </div>
              ) : (
                disbursedOrClosed.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/80 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-teal-400">{req.id}</span>
                        <span className="text-[10px] text-zinc-500">{req.department} ({req.unit})</span>
                        <StatusBadge status={req.status} />
                      </div>
                      <h4 className="text-xs font-bold text-white">{req.title}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Requester: {req.requestedBy}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-teal-400">{formatCurrency(req.totalValue)}</span>
                      <div className="text-[10px] text-zinc-500 font-mono">{req.donorGrantCode || 'HN-2026-SURG-Q4'}</div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* ── Monthly Expenditure Breakdown Chart ── */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider">MONTHLY FINANCIAL RUN-RATE</span>
              <h3 className="text-base font-black text-white mt-0.5">Disbursement Velocity by Department</h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">Jun — Nov 2026</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `₦${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px' }} 
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-teal-400 uppercase">
                    HEAD OF FINANCE & GRANTS AUDIT INSPECTION
                  </span>
                  <h3 className="text-lg font-black text-white">{selectedInspectReq.title}</h3>
                  <p className="text-xs text-zinc-400 font-mono">{selectedInspectReq.id} · {selectedInspectReq.department} ({selectedInspectReq.unit})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInspectReq(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Grant & Financial Verification Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block">TOTAL VOUCHER VALUE</span>
                <strong className="text-teal-400 text-sm">{formatCurrency(selectedInspectReq.totalValue)}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">DONOR GRANT LINE</span>
                <strong className="text-emerald-400 text-sm">{selectedInspectReq.donorGrantCode || 'HN-2026-SURG-Q4'}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">TRANSACTION CODE</span>
                <strong className="text-zinc-200 text-sm">{selectedInspectReq.transactionCode || 'MED-002'}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">CURRENT STATUS</span>
                <StatusBadge status={selectedInspectReq.status} />
              </div>
            </div>

            {/* Justification Memo */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs my-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Requester Justification / Case Memo:</span>
              <p className="text-zinc-300 italic">"{selectedInspectReq.justification}"</p>
            </div>

            {/* Comprehensive Line Items / Passenger Roster */}
            <div className="my-4">
              <h4 className="text-xs font-mono uppercase text-teal-400 mb-2">
                {selectedInspectReq.requisitionType === 'transport' || selectedInspectReq.unit === 'Hostel' 
                  ? 'Detailed Passenger Transport Roster' 
                  : 'Itemized Schedule Breakdown'}
              </h4>

              {selectedInspectReq.transportPassengers && selectedInspectReq.transportPassengers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 uppercase">
                        <th className="py-2 px-2 text-center w-12">S/N</th>
                        <th className="py-2 px-3">Passenger Name</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">State of Origin</th>
                        <th className="py-2 px-3">Movement</th>
                        <th className="py-2 px-3 text-right">Fixed Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {selectedInspectReq.transportPassengers.map(p => (
                        <tr key={p.id}>
                          <td className="py-2.5 px-2 text-center text-zinc-500">{p.sn}</td>
                          <td className="py-2.5 px-3 font-sans font-bold text-white">{p.name}</td>
                          <td className="py-2.5 px-3 uppercase text-zinc-400">{p.type}</td>
                          <td className="py-2.5 px-3 text-teal-400">{p.stateOfOrigin}</td>
                          <td className="py-2.5 px-3 text-zinc-300">{p.direction}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-teal-400">{formatCurrency(p.transportCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 uppercase">
                        <th className="py-2 px-2 text-center w-12">S/N</th>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3">Code</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3">Unit</th>
                        <th className="py-2 px-3 text-right">Unit Price</th>
                        <th className="py-2 px-3 text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {selectedInspectReq.items.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="py-2.5 px-2 text-center text-zinc-500">{item.sn || idx + 1}</td>
                          <td className="py-2.5 px-3 font-sans font-bold text-white">{item.name}</td>
                          <td className="py-2.5 px-3 text-teal-400">{item.transactionCode || 'MED-002'}</td>
                          <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-zinc-400">{item.unit}</td>
                          <td className="py-2.5 px-3 text-right text-zinc-300">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-teal-400">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Signatures from Requester and Supervisor */}
            <div className="my-4 pt-4 border-t border-zinc-800">
              <h4 className="text-xs font-mono uppercase text-teal-400 mb-2">Digital Signatures Attached</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedInspectReq.signatures && selectedInspectReq.signatures.length > 0 ? (
                  selectedInspectReq.signatures.map(s => (
                    <div key={s.level} className="p-3 rounded-xl bg-teal-950/20 border border-teal-500/30 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-[10px] text-teal-400 uppercase font-bold">{s.level} SIGNATURE</span>
                        <span className="text-[9px] text-zinc-500 font-mono">{formatDate(s.timestamp)}</span>
                      </div>
                      <div className="font-bold text-white">{s.actor}</div>
                      <div className="text-[11px] text-zinc-400">{s.role}</div>
                      <div className="mt-2 text-[9px] font-mono text-teal-300">STAMP: {s.signatureStamp}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic">No supervisor signature applied yet.</p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <Link
                href={`/request/${selectedInspectReq.id}`}
                target="_blank"
                className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>Open Full Printable Voucher View</span>
                <ArrowRight size={13} />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedInspectReq(null)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedInspectReq.id);
                    setSelectedInspectReq(null);
                  }}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedInspectReq.id);
                    setSelectedInspectReq(null);
                  }}
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded-xl text-xs shadow-lg shadow-teal-500/20"
                >
                  Lock Grant & Approve
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
