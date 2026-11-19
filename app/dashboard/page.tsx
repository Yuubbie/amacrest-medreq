'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { mockRequests, formatCurrency, formatDate } from '@/lib/mock-data';
import {
  Plus, Search, FileText, Clock, CheckCircle, XCircle,
  TrendingUp, AlertTriangle, Bell, ChevronRight, Filter,
  Heart, Bus, Package, ShieldCheck, ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const [search, setSearch] = useState('');

  const myRequests = mockRequests.filter(r =>
    r.requestedBy.includes('Hauwa') ||
    r.department === 'Clinicals'
  );

  const allRequests = mockRequests.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase())
  );

  const displayRequests = search ? allRequests : mockRequests;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950">
      <Navbar role="Staff Nurse" userName="Nurse Hauwa Bello" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Welcome Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>STAFF REQUISITION PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, Nurse Hauwa 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Clinical Post-Op Ward · Track your pending vouchers, patient transport reimbursements, and store issues.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/new-request?dept=Clinicals&unit=Hostel"
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 flex items-center gap-1.5 transition-all"
            >
              <Bus size={14} className="text-teal-400" />
              <span>Hostel Transport</span>
            </Link>

            <Link
              href="/new-request"
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-teal-500/20 active:scale-95"
            >
              <Plus size={14} strokeWidth={3} />
              <span>+ Raise Requisition</span>
            </Link>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requisitions Logged', value: '12', color: 'text-teal-400', sub: 'Across Clinicals' },
            { label: 'Pending Multi-Level Sign-Off', value: '4', color: 'text-amber-400', sub: 'In Supervisor / Finance' },
            { label: 'Fully Approved & Disbursed', value: '6', color: 'text-emerald-400', sub: 'Cleared by Coordinator' },
            { label: 'Total Value Requested', value: '₦3.24M', color: 'text-blue-400', sub: 'Donor Grant Covered' },
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
              <p className="text-xs text-zinc-400">Click any voucher to view full signature trail, passenger list, or audit history.</p>
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

                    <ChevronRight size={16} className="text-zinc-600 hidden sm:block" />
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
