'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { mockRequests, formatCurrency, formatDate } from '@/lib/mock-data';
import { Request, RequestStatus } from '@/lib/types';
import {
  Clock, CheckCircle, AlertTriangle, ChevronRight,
  Check, X, MessageSquare, Filter, Search, TrendingUp,
  Package, DollarSign, Building2, UserCheck, ShieldAlert
} from 'lucide-react';

type TabFilter = 'all' | 'pending' | 'approved' | 'queried';

// Preset of clinical & non-clinical HOD profiles for presentation
const hodProfiles: Record<string, { name: string; title: string; dept: string }> = {
  'Pharmacy': { name: 'Dr. Chinedu Eze', title: 'Director of Pharmacy Services', dept: 'Pharmacy' },
  'Nursing (Ward 3)': { name: 'Matron Beatrice Alao', title: 'Head of Clinical Nursing Services', dept: 'Nursing (Ward 3)' },
  'Laboratory': { name: 'Dr. Ngozi Okonkwo', title: 'Chief Medical Lab Scientist', dept: 'Laboratory' },
  'Transport & Logistics (Drivers)': { name: 'Malam Ibrahim Musa', title: 'Transport & Fleet Manager', dept: 'Transport & Logistics (Drivers)' },
  'Maintenance & Engineering': { name: 'Engr. Bola Adewale', title: 'Head of Facilities & Engineering', dept: 'Maintenance & Engineering' },
  'Environmental & Janitorial': { name: 'Mr. Patrick Nwosu', title: 'Environmental Health Officer', dept: 'Environmental & Janitorial' },
  'Administration & HR': { name: 'Barr. Obinna Kalu', title: 'Director of Administration', dept: 'Administration & HR' },
  'All': { name: 'Dr. Emmanuel Okafor', title: 'Chief Medical Director (All Departments View)', dept: 'All' },
};

const pendingStatuses: RequestStatus[] = ['submitted', 'hod-review'];

export default function HODPage() {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [tab, setTab] = useState<TabFilter>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [queryModal, setQueryModal] = useState<{ id: string } | null>(null);
  const [queryText, setQueryText] = useState('');

  const activeProfile = hodProfiles[selectedDept] || hodProfiles['All'];

  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (req: Request) => {
    // ROUTING LOGIC:
    // If Material -> Escalate directly to Central Stores for issuance
    // If Cash -> Escalate to Head of Finance for voucher authorization
    const isMaterial = req.requisitionType === 'material';
    const nextStatus: RequestStatus = isMaterial ? 'store-review' : 'finance-review';
    const destination = isMaterial ? 'Central Stores for Material Issuance' : 'Finance Head for Payment Approval';

    setRequests(prev => prev.map(r =>
      r.id === req.id
        ? {
            ...r,
            status: nextStatus,
            timeline: [...r.timeline, {
              id: Date.now().toString(),
              action: `HOD Approved (${isMaterial ? 'Material Issuance' : 'Cash/PO Authorization'})`,
              actor: activeProfile.name,
              role: activeProfile.title,
              timestamp: new Date().toISOString(),
              type: 'approved' as const,
              comment: `Approved by HOD. Routed to ${destination}.`,
            }]
          }
        : r
    ));
    showToast(`${req.id} approved! Forwarded to ${destination} ✓`, 'success');
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
              actor: activeProfile.name,
              role: activeProfile.title,
              timestamp: new Date().toISOString(),
              type: 'rejected' as const,
              comment: 'Declined by departmental HOD.',
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
              actor: activeProfile.name,
              role: activeProfile.title,
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

  // Filter requests strictly by the logged-in HOD's department (unless CMD "All" is active)
  const deptRequests = selectedDept === 'All' 
    ? requests 
    : requests.filter(r => r.department === selectedDept || r.department.includes(selectedDept));

  const pending = deptRequests.filter(r => pendingStatuses.includes(r.status));
  const approved = deptRequests.filter(r => ['store-review', 'finance-review', 'approved', 'dispatched'].includes(r.status));
  const queried = deptRequests.filter(r => r.status === 'hod-review' && r.timeline.some(t => t.type === 'queried'));

  const filtered = deptRequests.filter(r => {
    if (tab === 'pending') return pendingStatuses.includes(r.status);
    if (tab === 'approved') return ['store-review', 'finance-review', 'approved', 'dispatched'].includes(r.status);
    if (tab === 'queried') return r.status === 'hod-review' && r.timeline.some(t => t.type === 'queried');
    return true;
  }).filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.requestedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={`HOD: ${activeProfile.dept}`} userName={activeProfile.name} />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hospital Administrator Department Switcher Bar */}
        <div className="bg-white border border-teal-200 rounded-2xl p-4 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded">
                  Departmental Access Control
                </span>
                <span className="text-xs text-slate-400">Isolated HOD Inboxes</span>
              </div>
              <h2 className="text-base font-black text-slate-800 mt-0.5">
                Viewing as: <span className="text-teal-700">{activeProfile.name}</span> ({activeProfile.title})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-600 whitespace-nowrap">Switch Department HOD View:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="All">🏥 Chief Medical Director (All Hospital Departments)</option>
              <option value="Pharmacy">💊 Pharmacy HOD (Dr. Chinedu Eze)</option>
              <option value="Nursing (Ward 3)">🩺 Nursing Matron (Matron Beatrice Alao)</option>
              <option value="Laboratory">🧪 Laboratory HOD (Dr. Ngozi Okonkwo)</option>
              <option value="Transport & Logistics (Drivers)">🚐 Fleet Manager (Malam Ibrahim Musa)</option>
              <option value="Maintenance & Engineering">⚡ Engineering HOD (Engr. Bola Adewale)</option>
              <option value="Environmental & Janitorial">🧹 Sanitation HOD (Mr. Patrick Nwosu)</option>
              <option value="Administration & HR">📁 Admin Director (Barr. Obinna Kalu)</option>
            </select>
          </div>
        </div>

        {/* Process Flow Pill Indicator */}
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 mb-8 shadow-md">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">Hospital Governance & Splitting Engine</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="font-bold text-emerald-400">📦 Material Consumable Pathway:</span>
              <p className="text-slate-300 mt-1">
                Ward/Dept Staff ➔ <strong>HOD Sign-off</strong> ➔ <strong>Central Stores & Pharmacy Depot</strong> ➔ Goods Issued to Ward. (No bank disbursement; internal stock transfer).
              </p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="font-bold text-amber-400">💵 Cash & External Purchase Pathway:</span>
              <p className="text-slate-300 mt-1">
                Staff ➔ <strong>HOD Sign-off</strong> ➔ <strong>Head of Finance (Budget Check)</strong> ➔ <strong>Accounts Payable & Disbursement</strong> ➔ Cash/EFT released.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending HOD Approval', value: pending.length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'Approved & Forwarded', value: approved.length.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
            { label: 'Under Clarification / Query', value: queried.length.toString(), icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'Avg Turnaround (SLA)', value: '2.4 hrs', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`bg-white rounded-xl border ${stat.border} p-5`}>
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <div className="text-2xl font-black text-slate-800 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Filter tabs + search */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
            {[
              { id: 'all', label: `All In-Dept (${deptRequests.length})` },
              { id: 'pending', label: `Pending Action (${pending.length})` },
              { id: 'approved', label: `Cleared (${approved.length})` },
              { id: 'queried', label: `Queried (${queried.length})` },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as TabFilter)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  tab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, item or staff..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        {/* Requisitions Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">REQ ID</th>
                  <th className="py-3.5 px-4">Pathway / Type</th>
                  <th className="py-3.5 px-4">Item & Department</th>
                  <th className="py-3.5 px-4">Urgency</th>
                  <th className="py-3.5 px-4">Value</th>
                  <th className="py-3.5 px-4">Requester</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">HOD Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(req => {
                  const isPending = pendingStatuses.includes(req.status);
                  const isMaterial = req.requisitionType === 'material';

                  return (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-700 text-xs">
                        <Link href={`/request/${req.id}`} className="hover:text-teal-600">
                          {req.id}
                        </Link>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                          isMaterial 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {isMaterial ? <Package size={12} /> : <DollarSign size={12} />}
                          <span>{isMaterial ? 'Store Material' : 'Cash / Purchase'}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-800 text-sm">{req.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{req.department} · {req.category}</p>
                      </td>

                      <td className="py-4 px-4">
                        <UrgencyBadge urgency={req.urgency} />
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800 font-mono text-sm">
                        {formatCurrency(req.totalValue)}
                      </td>

                      <td className="py-4 px-4">
                        <p className="text-xs font-semibold text-slate-700">{req.requestedBy}</p>
                        <p className="text-[11px] text-slate-400">{req.requestedByRole}</p>
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={req.status} />
                      </td>

                      <td className="py-4 px-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(req)}
                              title={isMaterial ? 'Approve & Dispatch to Central Stores' : 'Approve & Escalate to Finance Head'}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                            >
                              <Check size={14} />
                              <span>{isMaterial ? 'To Store' : 'To Finance'}</span>
                            </button>

                            <button
                              onClick={() => setQueryModal({ id: req.id })}
                              title="Query Request"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                            >
                              <MessageSquare size={14} />
                            </button>

                            <button
                              onClick={() => handleReject(req.id)}
                              title="Decline Request"
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <Link href={`/request/${req.id}`} className="text-xs font-semibold text-teal-600 hover:underline">
                            View Audit Log →
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                      No requisitions found matching current department or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Query Modal */}
      {queryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-1">Issue HOD Query / Clarification</h3>
            <p className="text-xs text-slate-500 mb-4">Request more details from the submitting staff member before sign-off.</p>

            <textarea
              rows={3}
              placeholder="State what needs clarification (e.g. why 4 tyres are required instead of 2)..."
              value={queryText}
              onChange={e => setQueryText(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setQueryModal(null); setQueryText(''); }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleQuery(queryModal.id)}
                disabled={!queryText.trim()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg"
              >
                Send Query to Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
