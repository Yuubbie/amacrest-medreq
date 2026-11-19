'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { mockRequests, formatCurrency, formatDate } from '@/lib/mock-data';
import { getStoredRequests, saveStoredRequests, getStoredUser, AuthUser } from '@/lib/storage';
import { Request, RequestStatus } from '@/lib/types';
import {
  Plus, Search, FileText, Clock, CheckCircle, XCircle,
  TrendingUp, AlertTriangle, Bell, ChevronRight, Filter,
  Heart, Bus, Package, ShieldCheck, ArrowRight, Check, DollarSign, Award, Fuel
} from 'lucide-react';

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setRequests(getStoredRequests());
    setCurrentUser(getStoredUser());
    const handleUpdate = () => {
      setRequests(getStoredRequests());
    };
    const handleUserUpdate = () => {
      setCurrentUser(getStoredUser());
    };
    window.addEventListener('nani_requests_updated', handleUpdate);
    window.addEventListener('nani_user_updated', handleUserUpdate);
    return () => {
      window.removeEventListener('nani_requests_updated', handleUpdate);
      window.removeEventListener('nani_user_updated', handleUserUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Requester Acknowledgment Action (Confirms receipt of funds/supplies and retires voucher)
  const handleAcknowledgeReceipt = (e: React.MouseEvent, reqId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const timestamp = new Date().toISOString();
    const updated = requests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'closed' as RequestStatus,
          timeline: [
            ...r.timeline,
            {
              id: Date.now().toString(),
              action: 'Receipt Confirmed & Retired by Requester ✓',
              actor: r.requestedBy,
              role: r.requestedByRole,
              timestamp,
              type: 'approved' as const,
              comment: 'Requester confirmed physical receipt of funds/materials. Requisition retired and closed for audit.',
            }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`✓ Receipt confirmed for ${reqId}. Voucher closed and recorded for all donor reports.`);
  };

  const allRequests = requests.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase())
  );

  const displayRequests = search ? allRequests : requests;

  // Awaiting acknowledgment list
  const awaitingAck = requests.filter(r => r.status === 'disbursement-ready' || r.status === 'dispatched');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950">
      <Navbar />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-teal-950 border border-teal-500 text-teal-300 shadow-2xl flex items-center gap-3 animate-in fade-in text-xs font-bold font-sans">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
          <span>{toast}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Welcome Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>STAFF WORKSTATION & DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {currentUser?.name || 'Frontline Staff'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              <strong className="text-teal-300">{currentUser?.roleTitle || 'Staff Member'}</strong> · {currentUser?.department || 'Clinicals'} Department ({currentUser?.unit || 'General'}) · Track your vouchers, approvals, and physical receipt confirmations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(currentUser?.unit === 'Hostel' || currentUser?.roleTitle?.includes('Hostel')) && (
              <Link
                href="/new-request?dept=Clinicals&unit=Hostel"
                className="px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Bus size={14} className="text-blue-400" />
                <span>+ Patient Transport Voucher</span>
              </Link>
            )}

            {(currentUser?.unit === 'Logistics/Fleet' || currentUser?.roleTitle?.includes('Fleet') || currentUser?.roleTitle?.includes('Driver')) && (
              <Link
                href="/new-request?dept=Facility&unit=Logistics/Fleet"
                className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Fuel size={14} className="text-amber-400" />
                <span>+ Fleet / Fuel Requisition</span>
              </Link>
            )}

            <Link
              href={`/new-request?dept=${encodeURIComponent(currentUser?.department || 'Clinicals')}&unit=${encodeURIComponent(currentUser?.unit || 'Nursing')}`}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-teal-500/20 active:scale-95"
            >
              <Plus size={14} strokeWidth={3} />
              <span>+ Raise New Requisition</span>
            </Link>
          </div>
        </div>

        {/* ── Disbursed Acknowledgment Banner (High Priority) ── */}
        {awaitingAck.length > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-zinc-900 border border-emerald-500/40 mb-8 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <DollarSign size={16} />
              <span>Action Required: Funds Disbursed by Finance ({awaitingAck.length})</span>
            </div>
            <p className="text-xs text-zinc-300 mb-3">
              Finance has issued payments/materials for the vouchers below. Please confirm that you have received the funds/supplies to retire the voucher.
            </p>
            <div className="space-y-2">
              {awaitingAck.map(item => (
                <div key={item.id} className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-teal-400">{item.id}</span>
                    <span className="text-white font-bold ml-2">{item.title}</span>
                    <span className="text-zinc-500 ml-2 font-mono">({formatCurrency(item.totalValue)})</span>
                  </div>
                  <button
                    onClick={(e) => handleAcknowledgeReceipt(e, item.id)}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-lg text-xs flex items-center gap-1 transition-all shadow-md shadow-emerald-500/20"
                  >
                    <Check size={14} strokeWidth={3} />
                    <span>Confirm Receipt & Retire</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requisitions Logged', value: requests.length.toString(), color: 'text-teal-400', sub: 'Across 5 departments' },
            { label: 'Pending Multi-Level Sign-Off', value: requests.filter(r => r.status === 'submitted' || r.status === 'supervisor-review' || r.status === 'finance-review' || r.status === 'coordinator-review').length.toString(), color: 'text-amber-400', sub: 'In Supervisor / Finance' },
            { label: 'Disbursed / Retired', value: requests.filter(r => r.status === 'disbursement-ready' || r.status === 'closed' || r.status === 'approved').length.toString(), color: 'text-emerald-400', sub: 'Cleared by Leadership' },
            { label: 'Total Value Requested', value: formatCurrency(requests.reduce((s, r) => s + r.totalValue, 0)), color: 'text-blue-400', sub: 'Donor Grant Covered' },
          ].map(card => (
            <div key={card.label} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">{card.label}</span>
              <div className={`text-2xl font-black font-mono mt-1 ${card.color}`}>{card.value}</div>
              <p className="text-[10px] text-zinc-500 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Quick Pathway Banners ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          <Link
            href="/new-request"
            className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 to-zinc-900 border border-teal-500/30 hover:border-teal-400/60 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">PATHWAY 1</span>
              <ArrowRight size={14} className="text-teal-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-black text-white mt-2">Clinical & Surgical Consumables</h3>
            <p className="text-xs text-zinc-400 mt-1">Raise PO for surgical wound dressings, drugs, or theatre gear.</p>
          </Link>

          <Link
            href="/new-request?dept=Clinicals&unit=Hostel"
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-zinc-900 border border-blue-500/30 hover:border-blue-400/60 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">PATHWAY 2</span>
              <ArrowRight size={14} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-black text-white mt-2">Patient & Caregiver Transport Fare</h3>
            <p className="text-xs text-zinc-400 mt-1">Fixed state-rated fares for incoming admission & discharge.</p>
          </Link>

          <Link
            href="/inventory"
            className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-zinc-900 border border-cyan-500/30 hover:border-cyan-400/60 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">PATHWAY 3</span>
              <ArrowRight size={14} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-black text-white mt-2">Internal Store Issue Voucher</h3>
            <p className="text-xs text-zinc-400 mt-1">Instant store dispatch for cleaning bleach, gloves, and paper.</p>
          </Link>

        </div>

        {/* ── Requisitions List ── */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-black text-white">Recent Departmental Requisitions</h2>
              <p className="text-xs text-zinc-400">Click any voucher to view full signature trail, passenger list, or acknowledge disbursement.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Filter vouchers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {displayRequests.map((req) => {
              const isTransport = req.requisitionType === 'transport' || req.unit === 'Hostel';
              const isReadyForAck = req.status === 'disbursement-ready' || req.status === 'dispatched';
              return (
                <Link
                  key={req.id}
                  href={`/request/${req.id}`}
                  className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-teal-500/40 hover:bg-zinc-900/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold shrink-0 mt-0.5">
                      {isTransport ? <Bus size={18} /> : <FileText size={18} />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-teal-400">{req.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                          {req.department} · {req.unit}
                        </span>
                        <UrgencyBadge urgency={req.urgency} />
                      </div>
                      <h4 className="text-sm font-bold text-white">{req.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        By {req.requestedBy} · {formatDate(req.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                    <div className="text-left sm:text-right">
                      <span className="text-sm font-black text-teal-400 font-mono block">
                        {formatCurrency(req.totalValue)}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">{req.donorGrantCode || 'HN-2026-SURG-Q4'}</span>
                    </div>

                    <StatusBadge status={req.status} />

                    {/* Quick Acknowledge Button right on row if ready */}
                    {isReadyForAck ? (
                      <button
                        onClick={(e) => handleAcknowledgeReceipt(e, req.id)}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-lg flex items-center gap-1 shadow-md shadow-emerald-500/20"
                      >
                        <Check size={12} strokeWidth={3} />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <ChevronRight size={16} className="text-zinc-600 hidden sm:block" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
