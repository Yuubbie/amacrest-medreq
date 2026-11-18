'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import RequestCard from '@/components/RequestCard';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { mockRequests, formatCurrency, formatDate } from '@/lib/mock-data';
import {
  Plus, Search, FileText, Clock, CheckCircle, XCircle,
  TrendingUp, AlertTriangle, Bell, ChevronRight, Filter
} from 'lucide-react';

const statCards = [
  { label: 'Total Requests', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { label: 'Pending Approval', value: '4', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', alert: true },
  { label: 'Approved This Month', value: '6', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  { label: 'Rejected', value: '2', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
];

const getHour = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

export default function DashboardPage() {
  const [search, setSearch] = useState('');

  const myRequests = mockRequests.filter(r =>
    r.requestedBy.includes('Fatima') ||
    r.department === 'Nursing (Ward 3)'
  );

  const allRequests = mockRequests.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase())
  );

  const displayRequests = search ? allRequests : mockRequests.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="Staff Nurse" userName="Nurse Fatima Aliyu" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Good {getHour()}, Nurse Fatima 👋
            </h1>
            <p className="text-slate-500 mt-1">
              Here's an overview of your requisitions — Nursing (Ward 3)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/new-request">
              <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-teal-200">
                <Plus size={18} />
                New Requisition
              </button>
            </Link>
            <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
              <Search size={16} />
              Track Request
            </button>
          </div>
        </div>

        {/* SLA alert */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">SLA Alert: 2 requests approaching deadline</p>
            <p className="text-xs text-amber-600 mt-0.5">REQ-011 (IV Drip Sets) and REQ-007 (X-Ray Film) are nearing their 48-hour SLA window.</p>
          </div>
          <button className="text-amber-700 text-xs font-medium hover:text-amber-900 flex items-center gap-1">
            View <ChevronRight size={12} />
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`bg-white rounded-xl border ${card.border} p-5 relative overflow-hidden`}>
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon size={20} className={card.color} />
                </div>
                <div className="text-3xl font-black text-slate-800 mb-1">{card.value}</div>
                <div className="text-sm text-slate-500">{card.label}</div>
                {card.alert && (
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/new-request" className="group">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-5 text-white hover:from-teal-500 hover:to-teal-600 transition-all shadow-sm shadow-teal-200 cursor-pointer">
              <Plus size={24} className="mb-3" />
              <h3 className="font-bold text-base">New Requisition</h3>
              <p className="text-teal-100 text-sm mt-1">Create a new supply request</p>
            </div>
          </Link>
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-200 transition-colors cursor-pointer">
            <TrendingUp size={24} className="text-blue-500 mb-3" />
            <h3 className="font-bold text-base text-slate-800">Track Request</h3>
            <p className="text-slate-500 text-sm mt-1">View approval progress</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-purple-200 transition-colors cursor-pointer">
            <Bell size={24} className="text-purple-500 mb-3" />
            <h3 className="font-bold text-base text-slate-800">Notifications</h3>
            <p className="text-slate-500 text-sm mt-1">3 unread updates</p>
          </div>
        </div>

        {/* Recent requests */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">Recent Requisitions</h2>
              <p className="text-sm text-slate-500 mt-0.5">All hospital-wide requests</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 w-48"
                />
              </div>
              <button className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          {/* Table (desktop) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">REQ ID</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Item</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Department</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Value</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded">
                        {req.id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <UrgencyBadge urgency={req.urgency} />
                        <span className="text-sm font-medium text-slate-700 max-w-[180px] truncate">{req.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-600">{req.department}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-slate-700">{formatCurrency(req.totalValue)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-500">{formatDate(req.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/request/${req.id}`}>
                        <button className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View <ChevronRight size={12} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card list (mobile) */}
          <div className="lg:hidden p-4 grid gap-3">
            {displayRequests.map(req => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 text-center">
            <Link href="/dashboard">
              <button className="text-sm text-teal-600 hover:text-teal-800 font-medium">
                View all {mockRequests.length} requests →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
