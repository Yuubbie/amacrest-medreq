'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { mockRequests, formatCurrency, formatDate } from '@/lib/mock-data';
import { Request, RequestStatus } from '@/lib/types';
import {
  Clock, CheckCircle, AlertTriangle, ChevronRight,
  Check, X, MessageSquare, Filter, Search, TrendingUp
} from 'lucide-react';

type TabFilter = 'all' | 'pending' | 'approved' | 'queried';

const pendingStatuses: RequestStatus[] = ['submitted', 'hod-review'];

export default function HODPage() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [tab, setTab] = useState<TabFilter>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [queryModal, setQueryModal] = useState<{ id: string } | null>(null);
  const [queryText, setQueryText] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r =>
      r.id === id
        ? {
            ...r,
            status: 'finance-review' as RequestStatus,
            timeline: [...r.timeline, {
              id: Date.now().toString(),
              action: 'HOD Approved',
              actor: 'Dr. Emmanuel Okafor',
              role: 'Head of Department',
              timestamp: new Date().toISOString(),
              type: 'approved' as const,
              comment: 'Approved and forwarded to Finance.',
            }]
          }
        : r
    ));
    showToast(`${id} approved and forwarded to Finance ✓`, 'success');
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r =>
      r.id === id
        ? {
            ...r,
            status: 'rejected' as RequestStatus,
            timeline: [...r.timeline, {
              id: Date.now().toString(),
              action: 'HOD Rejected',
              actor: 'Dr. Emmanuel Okafor',
              role: 'Head of Department',
              timestamp: new Date().toISOString(),
              type: 'rejected' as const,
              comment: 'Rejected by HOD.',
            }]
          }
        : r
    ));
    showToast(`${id} has been rejected`, 'error');
  };

  const handleQuery = (id: string) => {
    if (!queryText.trim()) return;
    setRequests(prev => prev.map(r =>
      r.id === id
        ? {
            ...r,
            status: 'hod-review' as RequestStatus,
            timeline: [...r.timeline, {
              id: Date.now().toString(),
              action: 'HOD Queried',
              actor: 'Dr. Emmanuel Okafor',
              role: 'Head of Department',
              timestamp: new Date().toISOString(),
              type: 'queried' as const,
              comment: queryText,
            }]
          }
        : r
    ));
    showToast(`Query sent to requester for ${id}`, 'info');
    setQueryModal(null);
    setQueryText('');
  };

  const pending = requests.filter(r => pendingStatuses.includes(r.status));
  const approvedToday = requests.filter(r => r.status === 'finance-review' &&
    r.timeline.some(t => t.action === 'HOD Approved'));

  const filtered = requests.filter(r => {
    const matchesTab =
      tab === 'all' ? true :
      tab === 'pending' ? pendingStatuses.includes(r.status) :
      tab === 'approved' ? r.timeline.some(t => t.action === 'HOD Approved') :
      tab === 'queried' ? r.timeline.some(t => t.type === 'queried') :
      true;
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getSLARemaining = (createdAt: string) => {
    const diff = new Date('2026-11-18T15:30:00Z').getTime() - new Date(createdAt).getTime();
    const hours = Math.floor(diff / 3600000);
    const remaining = 48 - hours;
    return remaining;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="Head of Department" userName="Dr. Emmanuel Okafor" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-pulse ${
          toast.type === 'success' ? 'bg-green-600' :
          toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Query modal */}
      {queryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-base font-bold text-slate-800 mb-4">Send Query — {queryModal.id}</h3>
            <textarea
              value={queryText}
              onChange={e => setQueryText(e.target.value)}
              placeholder="Describe what clarification is needed..."
              rows={4}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setQueryModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => handleQuery(queryModal.id)} className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors">
                Send Query
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">HOD Dashboard</h1>
          <p className="text-slate-500 mt-1">Dr. Emmanuel Okafor — Head of Department</p>
        </div>

        {/* SLA alert */}
        {pending.filter(r => getSLARemaining(r.createdAt) < 8 && getSLARemaining(r.createdAt) > 0).length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-800">
              ⚠️ {pending.filter(r => getSLARemaining(r.createdAt) < 8).length} requests are approaching SLA breach — immediate action required
            </p>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-amber-200 p-5">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div className="text-3xl font-black text-slate-800">{pending.length}</div>
            <div className="text-sm text-slate-500 mt-0.5">Pending Approval</div>
          </div>
          <div className="bg-white rounded-xl border border-green-200 p-5">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div className="text-3xl font-black text-slate-800">{approvedToday.length}</div>
            <div className="text-sm text-slate-500 mt-0.5">Approved Today</div>
          </div>
          <div className="bg-white rounded-xl border border-blue-200 p-5">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-800">2.4h</div>
            <div className="text-sm text-slate-500 mt-0.5">Avg Processing Time</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          {/* Tabs + search */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1 flex-wrap">
                {(['all', 'pending', 'approved', 'queried'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                      tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t === 'all' ? 'All Requests' : t === 'approved' ? 'Approved Today' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="sm:ml-auto flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 w-44"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['REQ ID', 'Department', 'Item Summary', 'Urgency', 'Value', 'Submitted', 'SLA Remaining', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(req => {
                  const sla = getSLARemaining(req.createdAt);
                  const isPending = pendingStatuses.includes(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3.5">
                        <Link href={`/request/${req.id}`}>
                          <span className="text-xs font-mono font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded hover:bg-teal-100 cursor-pointer transition-colors">
                            {req.id}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">{req.department}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-slate-700 max-w-[200px] block truncate">{req.title}</span>
                        <span className="text-xs text-slate-400">{req.items.length} item{req.items.length > 1 ? 's' : ''}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <UrgencyBadge urgency={req.urgency} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-semibold text-slate-700">{formatCurrency(req.totalValue)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-500">{formatDate(req.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {isPending ? (
                          <span className={`text-xs font-semibold ${
                            sla < 0 ? 'text-red-600' : sla < 8 ? 'text-amber-600' : 'text-slate-600'
                          }`}>
                            {sla < 0 ? '⚠️ Breached' : `${sla}h left`}
                          </span>
                        ) : (
                          <StatusBadge status={req.status} />
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {isPending ? (
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
                              <X size={12} /> Reject
                            </button>
                            <button
                              onClick={() => setQueryModal({ id: req.id })}
                              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <MessageSquare size={12} /> Query
                            </button>
                          </div>
                        ) : (
                          <Link href={`/request/${req.id}`}>
                            <button className="text-xs text-slate-500 hover:text-teal-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                              View <ChevronRight size={12} />
                            </button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="font-medium">No requests found</p>
              <p className="text-sm mt-1">Try a different filter or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
