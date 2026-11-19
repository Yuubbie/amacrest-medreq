'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import {
  mockRequests, 
  volumeData, 
  categorySpendData, 
  slaData, 
  statusDistribution,
  donorGrantData,
  formatCurrency, 
  formatDate
} from '@/lib/mock-data';
import { getStoredRequests } from '@/lib/storage';
import { Request } from '@/lib/types';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  FileText, TrendingUp, CheckCircle, XCircle, Clock, Download,
  Filter, Calendar, ChevronRight, Shield, Activity, Printer,
  Sparkles, DollarSign, Building2, Heart, Award, ArrowUpRight
} from 'lucide-react';

const forecastData = [
  { period: 'Q1 2026', actual: 8200000, projected: 8000000, variance: '+2.5%' },
  { period: 'Q2 2026', actual: 9400000, projected: 9200000, variance: '+2.1%' },
  { period: 'Q3 2026', actual: 11100000, projected: 10800000, variance: '+2.7%' },
  { period: 'Q4 2026 (Est)', actual: 12400000, projected: 12000000, variance: '+3.3%' },
  { period: 'Q1 2027 (Forecast)', actual: null, projected: 14500000, variance: 'Projected' },
  { period: 'Q2 2027 (Forecast)', actual: null, projected: 15800000, variance: 'Projected' },
];

export default function ReportsPage() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [reportCycle, setReportCycle] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [deptFilter, setDeptFilter] = useState('all');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setRequests(getStoredRequests());
    const handleUpdate = () => {
      setRequests(getStoredRequests());
    };
    window.addEventListener('nani_requests_updated', handleUpdate);
    return () => window.removeEventListener('nani_requests_updated', handleUpdate);
  }, []);

  const closedVouchers = requests.filter(r => r.status === 'closed');
  const disbursedVouchers = requests.filter(r => r.status === 'dispatched' || r.status === 'disbursement-ready');
  const inPipelineVouchers = requests.filter(r => r.status !== 'closed' && r.status !== 'dispatched' && r.status !== 'disbursement-ready' && r.status !== 'rejected');
  
  const totalRetiredAmount = closedVouchers.reduce((s, r) => s + r.totalValue, 0);
  const totalDisbursedAmount = disbursedVouchers.reduce((s, r) => s + r.totalValue, 0);
  const totalInPipelineAmount = inPipelineVouchers.reduce((s, r) => s + r.totalValue, 0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    showToast('Generating high-resolution Executive PDF Report...');
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 800);
  };

  const handleExportExcel = () => {
    showToast('✓ Donor Expenditure Ledger downloaded (.XLSX)');
  };

  const COLORS = ['#0d9488', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#6b7280'];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950 print:bg-white print:text-zinc-950">
      <div className="print:hidden">
        <Navbar role="National Directorate / CA View" userName="Dr. Usman Sani" />
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-teal-950 border border-teal-500 text-teal-300 shadow-2xl flex items-center gap-3 animate-in fade-in text-xs font-bold font-sans">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
          <span>{toast}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>EXECUTIVE & DONOR REPORTING SUITE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Executive Financial Reports & Budget Forecasting
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Monthly, Quarterly & Annual expenditure tracking with donor grant line compliance and 2027 forecast models.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            
            {/* Cycle Selector */}
            <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold">
              {[
                { id: 'monthly', label: 'Monthly' },
                { id: 'quarterly', label: 'Quarterly' },
                { id: 'annual', label: 'Annual' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setReportCycle(c.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    reportCycle === c.id ? 'bg-teal-500 text-zinc-950 shadow-md font-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 flex items-center gap-1.5 transition-all"
            >
              <Printer size={14} className="text-teal-400" />
              <span>Print</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-teal-500/20"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <FileText size={14} />
              <span>Excel (XLSX)</span>
            </button>
          </div>
        </div>

        {/* ── Executive KPI Summary Strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Vouchers Logged', value: requests.length.toString(), sub: 'Across 5 departments', color: 'text-teal-400' },
            { label: '100% Retired & Audited', value: formatCurrency(totalRetiredAmount), sub: `${closedVouchers.length} Vouchers Cleared`, color: 'text-emerald-400' },
            { label: 'Disbursed (In Field)', value: formatCurrency(totalDisbursedAmount), sub: `${disbursedVouchers.length} Awaiting Receipts`, color: 'text-blue-400' },
            { label: 'In Approval Pipeline', value: formatCurrency(totalInPipelineAmount), sub: `${inPipelineVouchers.length} Under Review`, color: 'text-amber-400' },
            { label: '2027 Q1 Projected Scale', value: '₦14.50M', sub: '+17% Capacity Scale', color: 'text-purple-400' },
          ].map((card) => (
            <div key={card.label} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">{card.label}</span>
              <div className={`text-xl font-black font-mono mt-1 ${card.color}`}>{card.value}</div>
              <p className="text-[10px] text-zinc-500 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Section 1: Financial Forecasting & Projections ── */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-teal-400" />
                <h3 className="text-base font-black text-white">Donor Budget Projections & Run-Rate Forecasting</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Predictive burn model based on historical patient intake from northern states and surgical schedules.
              </p>
            </div>
            <span className="text-xs font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
              Linear Projection · Q1-Q2 2027
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="period" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `₦${v / 1000000}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val: any) => val ? formatCurrency(Number(val)) : 'N/A (Future)'}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="actual" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#actualGrad)" name="Actual Spend" />
                <Area type="monotone" dataKey="projected" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#projectedGrad)" name="Projected Budget" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast Metric Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase">
                  <th className="py-2 px-3">Period</th>
                  <th className="py-2 px-3 text-right">Actual Outflow</th>
                  <th className="py-2 px-3 text-right">Projected Budget</th>
                  <th className="py-2 px-3 text-right">Variance / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {forecastData.map((f) => (
                  <tr key={f.period} className="hover:bg-zinc-800/30">
                    <td className="py-2.5 px-3 font-bold text-white">{f.period}</td>
                    <td className="py-2.5 px-3 text-right text-teal-400 font-bold">
                      {f.actual ? formatCurrency(f.actual) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-300">
                      {formatCurrency(f.projected)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.actual ? 'bg-teal-500/10 text-teal-300' : 'bg-amber-500/10 text-amber-300'
                      }`}>
                        {f.variance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section 2: Donor Grant Ledger Reconciliation ── */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                AUDIT COMPLIANCE MATRIX
              </span>
              <h3 className="text-base font-black text-white mt-0.5">
                Donor Grant Line Allocation & Burn Analysis
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">ECHO / MSF Reporting Standard</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono uppercase">
                  <th className="py-2.5 px-3">Grant Code</th>
                  <th className="py-2.5 px-3">Grant Programme Description</th>
                  <th className="py-2.5 px-3 text-right">Total Grant Allocation</th>
                  <th className="py-2.5 px-3 text-right">Disbursed YTD</th>
                  <th className="py-2.5 px-3 text-right">Remaining Balance</th>
                  <th className="py-2.5 px-3 text-center">Burn %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {donorGrantData.map((grant) => {
                  const pct = Math.round((grant.spent / grant.allocated) * 100);
                  const rem = grant.allocated - grant.spent;
                  return (
                    <tr key={grant.grant} className="hover:bg-zinc-800/30">
                      <td className="py-3 px-3 font-bold text-teal-400">{grant.grant}</td>
                      <td className="py-3 px-3 font-sans text-zinc-300">{grant.description}</td>
                      <td className="py-3 px-3 text-right text-zinc-300">{formatCurrency(grant.allocated)}</td>
                      <td className="py-3 px-3 text-right font-bold text-white">{formatCurrency(grant.spent)}</td>
                      <td className="py-3 px-3 text-right text-emerald-400">{formatCurrency(rem)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pct > 85 ? 'bg-amber-500/10 text-amber-300' : 'bg-teal-500/10 text-teal-300'
                        }`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Official Donor Audit & Requisition Retirement Ledger ── */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="text-teal-400" size={18} />
                <h3 className="text-base font-black text-white">
                  Official Donor Audit & Requisition Retirement Ledger
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Full end-to-end provenance: Supervisor Sign-Off → Mr. AY Finance Budget Lock → Coordinator Ratification → PV Disbursement → Requester Physical Confirmation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">
                Audit Clearance: <strong className="text-emerald-400">{closedVouchers.length} Retired</strong> / {requests.length} Total
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] font-mono uppercase text-zinc-400 bg-zinc-950/60">
                  <th className="py-3 px-3">Voucher & Department</th>
                  <th className="py-3 px-3">Donor Grant Line</th>
                  <th className="py-3 px-3 text-right">Value (₦)</th>
                  <th className="py-3 px-3">Finance Lock (Mr. AY)</th>
                  <th className="py-3 px-3">Executive Auth</th>
                  <th className="py-3 px-3">Disbursement PV</th>
                  <th className="py-3 px-3">Requester Physical Receipt</th>
                  <th className="py-3 px-3 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {requests.map((r) => {
                  const isClosed = r.status === 'closed';
                  const isDisbursed = r.status === 'dispatched' || r.status === 'disbursement-ready';
                  const finSig = r.signatures?.find(s => s.level === 'finance');
                  const coordSig = r.signatures?.find(s => s.level === 'coordinator' || s.level === 'national-coordinator');

                  return (
                    <tr key={r.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-3">
                        <Link href={`/request/${r.id}`} className="font-bold text-teal-400 hover:underline block">
                          {r.id}
                        </Link>
                        <span className="text-[10px] text-zinc-400 font-sans">{r.department} · {r.unit}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-emerald-400 font-bold block">{r.donorGrantCode || 'HN-2026-SURG-Q4'}</span>
                        <span className="text-[10px] text-zinc-500 font-sans truncate block max-w-[150px]">{r.title}</span>
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-white text-xs">
                        {formatCurrency(r.totalValue)}
                      </td>

                      <td className="py-3 px-3 text-[11px]">
                        {finSig ? (
                          <div>
                            <span className="text-teal-300 font-bold block">✓ LOCKED</span>
                            <span className="text-[9px] text-zinc-500">{finSig.signatureStamp || 'AY/FIN/2026'}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-600 text-[10px]">Pending Lock</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[11px]">
                        {coordSig ? (
                          <div>
                            <span className="text-indigo-300 font-bold block">✓ AUTHORIZED</span>
                            <span className="text-[9px] text-zinc-500">{coordSig.signatureStamp || 'EB/CORD/2026'}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-600 text-[10px]">Awaiting Auth</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[11px]">
                        {r.disbursementDetails ? (
                          <div>
                            <span className="text-emerald-300 font-bold block">{r.disbursementDetails.pvNumber}</span>
                            <span className="text-[9px] text-zinc-500">{formatDate(r.disbursementDetails.disbursedAt)}</span>
                          </div>
                        ) : isClosed ? (
                          <div>
                            <span className="text-emerald-300 font-bold block">PV/NANI/2026/{r.id.replace('NANI-REQ-','')}</span>
                            <span className="text-[9px] text-zinc-500">Paid & Released</span>
                          </div>
                        ) : (
                          <span className="text-zinc-600 text-[10px]">Unreleased</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[11px]">
                        {isClosed ? (
                          <div>
                            <span className="text-emerald-400 font-bold block">✓ CONFIRMED</span>
                            <span className="text-[9px] text-zinc-500">{r.retirementDetails?.signatureStamp || 'RETIRED/2026'}</span>
                          </div>
                        ) : isDisbursed ? (
                          <span className="text-amber-400 font-bold text-[10px]">⏳ Pending Confirmation</span>
                        ) : (
                          <span className="text-zinc-600 text-[10px]">Not yet reached</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {isClosed ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                            100% RETIRED ✓
                          </span>
                        ) : isDisbursed ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                            DISBURSED · AWAIT RETIRE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-zinc-800 text-zinc-400 whitespace-nowrap">
                            IN APPROVAL
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section 3: Spend by Category & SLA Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Category Spend */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
            <h3 className="text-base font-black text-white mb-1">Expenditure by Operational Category</h3>
            <p className="text-xs text-zinc-400 mb-4">Patient transport vs medical surgical consumables vs facility fleet.</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpendData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categorySpendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val: any) => formatCurrency(Number(val))}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department SLA */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
            <h3 className="text-base font-black text-white mb-1">Approval Velocity & SLA Compliance</h3>
            <p className="text-xs text-zinc-400 mb-4">% of requisitions approved within the 24h/48h operational benchmark.</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slaData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis type="number" domain={[0, 100]} stroke="#71717a" fontSize={11} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="department" type="category" width={140} stroke="#71717a" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val: any) => `${val}% SLA`}
                  />
                  <Bar dataKey="compliance" fill="#0d9488" radius={[0, 4, 4, 0]} name="SLA Compliance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
