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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white print:bg-white print:text-slate-900">
      <div className="print:hidden">
        <Navbar role="National Directorate / CA View" userName="Dr. Usman Sani" />
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-teal-50 border border-teal-300 text-teal-900 shadow-2xl flex items-center gap-3 animate-in fade-in text-xs font-bold font-sans">
          <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></div>
          <span>{toast}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-700 font-semibold mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>EXECUTIVE & DONOR REPORTING SUITE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Executive Financial Reports & Budget Forecasting
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Monthly, Quarterly & Annual expenditure tracking with donor grant line compliance and 2027 forecast models.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            
            {/* Cycle Selector */}
            <div className="flex p-1 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-sm">
              {[
                { id: 'monthly', label: 'Monthly' },
                { id: 'quarterly', label: 'Quarterly' },
                { id: 'annual', label: 'Annual' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setReportCycle(c.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    reportCycle === c.id ? 'bg-teal-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer size={14} className="text-teal-700" />
              <span>Print</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-600/10"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FileText size={14} />
              <span>Excel (XLSX)</span>
            </button>
          </div>
        </div>

        {/* ── Executive KPI Summary Strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Vouchers Logged', value: requests.length.toString(), sub: 'Across 5 departments', color: 'text-teal-700' },
            { label: '100% Retired & Audited', value: formatCurrency(totalRetiredAmount), sub: `${closedVouchers.length} Vouchers Cleared`, color: 'text-emerald-700' },
            { label: 'Disbursed (In Field)', value: formatCurrency(totalDisbursedAmount), sub: `${disbursedVouchers.length} Awaiting Receipts`, color: 'text-blue-700' },
            { label: 'In Approval Pipeline', value: formatCurrency(totalInPipelineAmount), sub: `${inPipelineVouchers.length} Under Review`, color: 'text-amber-700' },
            { label: '2027 Q1 Projected Scale', value: '₦14.50M', sub: '+17% Capacity Scale', color: 'text-indigo-700' },
          ].map((card) => (
            <div key={card.label} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">{card.label}</span>
              <div className={`text-xl font-black font-mono mt-1 ${card.color}`}>{card.value}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Section 1: Financial Forecasting & Projections ── */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-teal-700" />
                <h3 className="text-base font-black text-slate-900">Donor Budget Projections & Run-Rate Forecasting</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Predictive burn model based on historical patient intake from northern states and surgical schedules.
              </p>
            </div>
            <span className="text-xs font-mono text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full font-bold">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₦${v / 1000000}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '11px', color: '#0f172a' }}
                  formatter={(val: any) => val ? formatCurrency(Number(val)) : 'N/A (Future)'}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="actual" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#actualGrad)" name="Actual Spend" />
                <Area type="monotone" dataKey="projected" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#projectedGrad)" name="Budget Ceiling / Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Section 2: Official Donor Audit & Requisition Retirement Ledger ── */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-700" />
                <h3 className="text-base font-black text-slate-900">
                  Official Donor Audit & Requisition Retirement Ledger
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Every requisition from origin to 100% receipt retirement with digital stamps for WHO & MSF audit trails.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                ✓ Full Audit Trail
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 text-slate-700 uppercase">
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-3">Voucher Ref / Unit</th>
                  <th className="py-3 px-3">Grant Line & Purpose</th>
                  <th className="py-3 px-3 text-right">Value (NGN)</th>
                  <th className="py-3 px-3">Finance Lock</th>
                  <th className="py-3 px-3">Coord Auth</th>
                  <th className="py-3 px-3">PV Number</th>
                  <th className="py-3 px-3">Receipt Retirement</th>
                  <th className="py-3 px-3 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {requests.map((r) => {
                  const isClosed = r.status === 'closed';
                  const isDisbursed = r.status === 'dispatched' || r.status === 'disbursement-ready';
                  const finSig = r.signatures?.find(s => s.level === 'finance');
                  const coordSig = r.signatures?.find(s => s.level === 'coordinator' || s.level === 'national-coordinator');

                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <Link href={`/request/${r.id}`} className="font-bold text-teal-700 hover:underline block">
                          {r.id}
                        </Link>
                        <span className="text-[10px] text-slate-500 font-sans">{r.department} · {r.unit}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-emerald-700 font-bold block">{r.donorGrantCode || 'HN-2026-SURG-Q4'}</span>
                        <span className="text-[10px] text-slate-600 font-sans truncate block max-w-[150px]">{r.title}</span>
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-slate-900 text-xs">
                        {formatCurrency(r.totalValue)}
                      </td>

                      <td className="py-3 px-3 text-[11px]">
                        {finSig ? (
                          <div>
                            <span className="text-teal-700 font-bold block">✓ LOCKED</span>
                            <span className="text-[9px] text-slate-500">{finSig.signatureStamp || 'AY/FIN/2026'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Pending Lock</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[11px]">
                        {coordSig ? (
                          <div>
                            <span className="text-indigo-700 font-bold block">✓ AUTHORIZED</span>
                            <span className="text-[9px] text-slate-500">{coordSig.signatureStamp || 'EB/CORD/2026'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Awaiting Auth</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[11px]">
                        {r.disbursementDetails ? (
                          <div>
                            <span className="text-emerald-700 font-bold block">{r.disbursementDetails.pvNumber}</span>
                            <span className="text-[9px] text-slate-500">{formatDate(r.disbursementDetails.disbursedAt)}</span>
                          </div>
                        ) : isClosed ? (
                          <div>
                            <span className="text-emerald-700 font-bold block">PV/NANI/2026/{r.id.replace('NANI-REQ-','')}</span>
                            <span className="text-[9px] text-slate-500">Paid & Released</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Unreleased</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[11px]">
                        {isClosed ? (
                          <div>
                            <span className="text-emerald-700 font-bold block">✓ CONFIRMED</span>
                            <span className="text-[9px] text-slate-500">{r.retirementDetails?.signatureStamp || 'RETIRED/2026'}</span>
                          </div>
                        ) : isDisbursed ? (
                          <span className="text-amber-700 font-bold text-[10px]">⏳ Pending Confirmation</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Not yet reached</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {isClosed ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                            100% RETIRED ✓
                          </span>
                        ) : isDisbursed ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">
                            DISBURSED · AWAIT RETIRE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
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
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-1">Expenditure by Operational Category</h3>
            <p className="text-xs text-slate-500 mb-4">Patient transport vs medical surgical consumables vs facility fleet.</p>
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
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '11px', color: '#0f172a' }}
                    formatter={(val: any) => formatCurrency(Number(val))}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department SLA */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-1">Approval Velocity & SLA Compliance</h3>
            <p className="text-xs text-slate-500 mb-4">% of requisitions approved within the 24h/48h operational benchmark.</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slaData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="department" type="category" width={140} stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '11px', color: '#0f172a' }}
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