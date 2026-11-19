'use client';

import { useState } from 'react';
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
import { Request, RequestStatus, ApprovalSignature } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  DollarSign, FileText, Clock, TrendingUp, Check, X, 
  ChevronRight, AlertTriangle, ShieldCheck, Download, 
  FileSpreadsheet, Lock, Sparkles, Building2, Heart, Award
} from 'lucide-react';

const financeReviewStatuses: RequestStatus[] = ['finance-review', 'submitted', 'supervisor-review'];

export default function FinancePage() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedGrant, setSelectedGrant] = useState<string>('all');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Finance Approval advances voucher to Programme Coordinator (Level 4)
  const handleApprove = (id: string) => {
    const timestamp = new Date().toISOString();
    const stampCode = `BU/FIN/${new Date().getFullYear()}`;

    setRequests(prev => prev.map(r => {
      if (r.id === id) {
        const newSig: ApprovalSignature = {
          level: 'finance',
          actor: 'Mrs. Bilkisu Umar',
          role: 'Finance Officer & Grant Controller',
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
              actor: 'Mrs. Bilkisu Umar',
              role: 'Finance Officer & Grant Controller',
              timestamp,
              type: 'finance',
              comment: `Donor grant line ${r.donorGrantCode || 'HN-2026-SURG-Q4'} verified and committed. Forwarded to Programme Coordinator.`,
            }
          ]
        };
      }
      return r;
    }));

    showToast(`✓ Voucher ${id} approved & grant line locked. Forwarded to Programme Coordinator.`, 'success');
  };

  const handleReject = (id: string) => {
    const timestamp = new Date().toISOString();
    setRequests(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'rejected' as RequestStatus,
          timeline: [
            ...r.timeline,
            {
              id: Date.now().toString(),
              action: 'Finance Declined ✗',
              actor: 'Mrs. Bilkisu Umar',
              role: 'Finance Officer & Grant Controller',
              timestamp,
              type: 'rejected',
              comment: 'Declined due to budget allocation limits.',
            }
          ]
        };
      }
      return r;
    }));

    showToast(`Voucher ${id} has been declined. Returned to department.`, 'error');
  };

  const pending = requests.filter(r => financeReviewStatuses.includes(r.status));
  const approvedTotal = requests
    .filter(r => ['approved', 'coordinator-review', 'national-coordinator-review', 'dispatched', 'closed'].includes(r.status))
    .reduce((s, r) => s + r.totalValue, 0);

  const totalAllocated = donorGrantData.reduce((s, g) => s + g.allocated, 0);
  const totalSpent = donorGrantData.reduce((s, g) => s + g.spent, 0);
  const utilization = Math.round((totalSpent / totalAllocated) * 100);

  const COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#6b7280'];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950">
      <Navbar role="Finance Officer & CA" userName="Mrs. Bilkisu Umar" />

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
              <span>FINANCE, GRANTS & AUDIT CONTROL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Finance Control Room & Donor Grant Ledger
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Mrs. Bilkisu Umar · Senior Finance Officer & Grant Controller
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
            { label: 'Pending Finance Sign-Off', value: pending.length.toString(), icon: Clock, color: 'text-amber-400', sub: 'Requires budget verification' },
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

        {/* ── Pending Finance Clearances (Level 3 Gate) ── */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-black text-white">Vouchers Awaiting Finance Sign-Off & Budget Lock</h3>
              <p className="text-xs text-zinc-400">
                Approving applies Mrs. Bilkisu Umar's digital stamp and routes voucher to Programme Coordinator.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">{pending.length} Pending Clearances</span>
          </div>

          <div className="space-y-3">
            {pending.map((req) => {
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
                      Requested by <strong className="text-zinc-200">{req.requestedBy}</strong> · {formatDate(req.createdAt)}
                    </p>

                    <div className="mt-2 text-xs text-zinc-400 font-mono">
                      {isTransport ? (
                        <span>Passengers ({req.transportPassengers?.length || 4}): {req.transportPassengers?.map(p => `${p.name} [${p.stateOfOrigin}]`).join(', ')}</span>
                      ) : (
                        <span>Items: {req.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 lg:w-56 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
                    <div className="text-left lg:text-right">
                      <span className="text-base font-black text-teal-400 font-mono block">
                        {formatCurrency(req.totalValue)}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">Code: {req.transactionCode || 'MED-002'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <X size={13} />
                        <span>Decline</span>
                      </button>

                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1 active:scale-95"
                      >
                        <Check size={14} strokeWidth={3} />
                        <span>Lock & Approve</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
    </div>
  );
}
