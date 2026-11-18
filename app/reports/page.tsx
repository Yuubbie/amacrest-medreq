'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import {
  mockRequests, volumeData, categorySpendData, slaData, statusDistribution,
  formatCurrency, formatDate
} from '@/lib/mock-data';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  FileText, TrendingUp, CheckCircle, XCircle, Clock, Download,
  Filter, Calendar, ChevronRight, Shield, Activity
} from 'lucide-react';

const auditLog = [
  { time: '2026-11-18 15:28', user: 'Mrs. Grace Obi', action: 'Finance Approved', target: 'REQ-002', ip: '192.168.1.45' },
  { time: '2026-11-18 14:55', user: 'Dr. Emmanuel Okafor', action: 'HOD Approved', target: 'REQ-006', ip: '192.168.1.32' },
  { time: '2026-11-18 14:12', user: 'Nurse Fatima Aliyu', action: 'Request Submitted', target: 'REQ-011', ip: '192.168.1.78' },
  { time: '2026-11-18 13:40', user: 'Mr. Rotimi Ojo', action: 'Items Dispatched', target: 'REQ-005', ip: '192.168.1.19' },
  { time: '2026-11-18 11:00', user: 'Mrs. Grace Obi', action: 'Finance Rejected', target: 'REQ-010', ip: '192.168.1.45' },
  { time: '2026-11-18 09:15', user: 'System', action: 'SLA Breach Alert Sent', target: 'REQ-007', ip: 'System' },
  { time: '2026-11-18 08:23', user: 'Dr. Chinedu Eze', action: 'HOD Approved', target: 'REQ-001', ip: '192.168.1.56' },
  { time: '2026-11-18 07:14', user: 'Pharm. Aisha Bello', action: 'Request Submitted (STAT)', target: 'REQ-001', ip: '192.168.1.90' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [deptFilter, setDeptFilter] = useState('all');

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280'];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="Finance / CA (Reports)" userName="Mrs. Grace Obi" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
            <p className="text-slate-500 mt-1">Chartered Accountant View — Comprehensive spend and audit analysis</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 bg-white"
            >
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="year-to-date">Year to Date</option>
            </select>
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 bg-white"
            >
              <option value="all">All Departments</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="laboratory">Laboratory</option>
              <option value="nursing">Nursing</option>
              <option value="maintenance">Maintenance</option>
              <option value="it">IT Department</option>
            </select>
            <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <Download size={14} /> Export PDF
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <Download size={14} /> Export Excel
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Requests', value: '156', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'Total Value', value: '₦18.4M', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
            { label: 'Approved', value: '134', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
            { label: 'Rejected', value: '12', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
            { label: 'Avg Processing', value: '18.4h', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`bg-white rounded-xl border ${card.border} p-4`}>
                <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-2.5`}>
                  <Icon size={18} className={card.color} />
                </div>
                <div className="text-2xl font-black text-slate-800">{card.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{card.label}</div>
              </div>
            );
          })}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Line chart - Volume */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-1">Requisition Volume — Last 6 Months</h2>
            <p className="text-xs text-slate-400 mb-5">Monthly request count by outcome</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} name="Total Requests" />
                <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} name="Approved" />
                <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} name="Rejected" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie - Status distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-1">Status Distribution</h2>
            <p className="text-xs text-slate-400 mb-4">All-time request outcomes</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [v, 'requests']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {statusDistribution.map((s, idx) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-slate-600">{s.name}</span>
                  </div>
                  <span className="font-bold text-slate-700">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top spending departments */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-1">Top Spending Departments</h2>
            <p className="text-xs text-slate-400 mb-5">Total spend (₦ thousands)</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={[
                  { dept: 'Pharmacy', spent: 1890 },
                  { dept: 'Laboratory', spent: 1420 },
                  { dept: 'IT', spent: 1535 },
                  { dept: 'Maintenance', spent: 1185 },
                  { dept: 'Emergency', spent: 890 },
                  { dept: 'Radiology', spent: 875 },
                ]}
                layout="vertical"
                barSize={16}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v}k`} />
                <YAxis type="category" dataKey="dept" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(v: number) => [`₦${(v * 1000).toLocaleString()}`, 'Spent']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="spent" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* SLA compliance */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-1">SLA Compliance by Department</h2>
            <p className="text-xs text-slate-400 mb-5">% of requests processed within 48-hour SLA</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={slaData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'SLA Compliance']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar
                  dataKey="compliance"
                  radius={[4, 4, 0, 0]}
                  fill="#3b82f6"
                  label={{ position: 'top', fontSize: 10, fill: '#64748b', formatter: (v: number) => `${v}%` }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent activity table */}
        <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Recent Activity</h2>
            <p className="text-sm text-slate-500 mt-0.5">Last 10 requisitions across all departments</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['REQ ID', 'Department', 'Title', 'Status', 'Urgency', 'Value', 'Requested By', 'Date'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockRequests.slice(0, 10).map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3">
                      <Link href={`/request/${req.id}`}>
                        <span className="text-xs font-mono font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded cursor-pointer hover:bg-teal-100">
                          {req.id}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{req.department}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700 max-w-[160px] truncate">{req.title}</td>
                    <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                    <td className="px-4 py-3"><UrgencyBadge urgency={req.urgency} /></td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-700">{formatCurrency(req.totalValue)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{req.requestedBy}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(req.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit trail */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <Shield size={18} className="text-teal-600" />
            <div>
              <h2 className="text-base font-bold text-slate-800">System Audit Trail</h2>
              <p className="text-xs text-slate-400 mt-0.5">Recent system actions — immutable log</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Timestamp', 'User', 'Action', 'Target', 'IP Address'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {auditLog.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-xs font-mono text-slate-500">{log.time}</td>
                    <td className="px-5 py-3 text-xs font-semibold text-slate-700">{log.user}</td>
                    <td className="px-5 py-3 text-xs text-slate-600">{log.action}</td>
                    <td className="px-5 py-3">
                      <Link href={`/request/${log.target}`}>
                        <span className="text-xs font-mono font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded cursor-pointer hover:bg-teal-100">
                          {log.target}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-slate-400">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
