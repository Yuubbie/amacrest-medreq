'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { mockRequests, budgetData, monthlySpendData, categorySpendData, formatCurrency, formatDate } from '@/lib/mock-data';
import { Request, RequestStatus } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, FileText, Clock, TrendingUp, Check, X, ChevronRight, AlertTriangle } from 'lucide-react';

const financeReviewStatuses: RequestStatus[] = ['finance-review', 'submitted', 'executive-review'];

export default function FinancePage() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'approved' as RequestStatus } : r
    ));
    showToast(`${id} payment approved ✓`, 'success');
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'rejected' as RequestStatus } : r
    ));
    showToast(`${id} has been declined`, 'error');
  };

  const pending = requests.filter(r => financeReviewStatuses.includes(r.status));
  const totalValue = requests.filter(r => ['approved', 'dispatched', 'closed'].includes(r.status)).reduce((s, r) => s + r.totalValue, 0);

  const totalAllocated = budgetData.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0);
  const utilization = Math.round((totalSpent / totalAllocated) * 100);

  // Format month spend for chart
  const chartData = monthlySpendData.map(m => ({
    month: m.month,
    Pharmacy: m.Pharmacy / 1000,
    Laboratory: m.Laboratory / 1000,
    Nursing: m.Nursing / 1000,
    Maintenance: m.Maintenance / 1000,
    IT: m.IT / 1000,
    Emergency: m.Emergency / 1000,
  }));

  const COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#6b7280'];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="Finance Officer / CA" userName="Mrs. Grace Obi" />

      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast}
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Finance & CA Dashboard</h1>
          <p className="text-slate-500 mt-1">Mrs. Grace Obi — Finance Officer</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requisitions (Month)', value: '47', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'Total Value Approved', value: '₦4.24M', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
            { label: 'Pending Finance Approval', value: pending.length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'Budget Utilization', value: `${utilization}%`, icon: TrendingUp, color: utilization > 90 ? 'text-red-600' : utilization > 70 ? 'text-amber-600' : 'text-teal-600', bg: utilization > 90 ? 'bg-red-50' : utilization > 70 ? 'bg-amber-50' : 'bg-teal-50', border: utilization > 90 ? 'border-red-100' : 'border-teal-100' },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`bg-white rounded-xl border ${card.border} p-5`}>
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon size={20} className={card.color} />
                </div>
                <div className="text-2xl font-black text-slate-800 mb-1">{card.value}</div>
                <div className="text-sm text-slate-500">{card.label}</div>
              </div>
            );
          })}
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-bold text-slate-800 mb-5">Budget Overview by Department</h2>
          <div className="space-y-4">
            {budgetData.map(dept => {
              const spentPct = Math.round((dept.spent / dept.allocated) * 100);
              const committedPct = Math.round((dept.committed / dept.allocated) * 100);
              const isOver = spentPct > 90;
              const isWarning = spentPct > 70 && !isOver;
              return (
                <div key={dept.department}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700 w-28">{dept.department}</span>
                      {isOver && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">CRITICAL</span>}
                      {isWarning && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">WARNING</span>}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Spent: <strong className="text-slate-700">{formatCurrency(dept.spent)}</strong></span>
                      <span>Committed: <strong className="text-amber-700">{formatCurrency(dept.committed)}</strong></span>
                      <span>Available: <strong className="text-green-700">{formatCurrency(Math.max(0, dept.allocated - dept.spent - dept.committed))}</strong></span>
                      <span className="font-bold text-slate-600">{spentPct}%</span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                    {/* Spent bar */}
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all ${isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-teal-500'}`}
                      style={{ width: `${Math.min(100, spentPct)}%` }}
                    />
                    {/* Committed overlay */}
                    <div
                      className="absolute top-0 h-full bg-amber-300 opacity-70"
                      style={{ left: `${Math.min(100, spentPct)}%`, width: `${Math.min(100 - spentPct, committedPct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>₦0</span>
                    <span>Allocated: {formatCurrency(dept.allocated)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-slate-100">
            {[
              { color: 'bg-teal-500', label: 'Spent' },
              { color: 'bg-amber-300', label: 'Committed' },
              { color: 'bg-slate-100', label: 'Available' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className={`w-3 h-3 rounded-sm ${l.color}`}></div>
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Bar chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-1">Monthly Spend by Department</h2>
            <p className="text-xs text-slate-400 mb-5">Last 6 months (₦ thousands)</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v}k`} />
                <Tooltip formatter={(v: number) => [`₦${(v * 1000).toLocaleString()}`, '']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {['Pharmacy','Laboratory','Nursing','Maintenance','IT','Emergency'].map((k, i) => (
                  <Bar key={k} dataKey={k} fill={COLORS[i]} radius={[2,2,0,0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-1">Spend by Category</h2>
            <p className="text-xs text-slate-400 mb-4">Total allocation split</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categorySpendData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categorySpendData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [formatCurrency(v), '']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {categorySpendData.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-slate-600">{cat.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Finance Approvals */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Pending Finance Approvals</h2>
              <p className="text-sm text-slate-500 mt-0.5">{pending.length} requests awaiting sign-off</p>
            </div>
            {pending.length > 0 && (
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['REQ ID', 'Department', 'Item', 'Urgency', 'Value', 'Submitted', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pending.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <Link href={`/request/${req.id}`}>
                        <span className="text-xs font-mono font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded cursor-pointer hover:bg-teal-100 transition-colors">{req.id}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{req.department}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-slate-700 max-w-[180px] truncate">{req.title}</td>
                    <td className="px-4 py-3.5"><UrgencyBadge urgency={req.urgency} /></td>
                    <td className="px-4 py-3.5 text-sm font-bold text-slate-700">{formatCurrency(req.totalValue)}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(req.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Check size={12} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <X size={12} /> Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pending.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                      ✓ All requests processed — no pending approvals
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
