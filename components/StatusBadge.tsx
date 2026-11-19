'use client';

import { RequestStatus, Urgency } from '@/lib/types';

const statusConfig: Record<RequestStatus, { label: string; classes: string }> = {
  draft:                        { label: 'Draft',                       classes: 'bg-slate-100 text-slate-700 border-slate-300' },
  submitted:                    { label: 'Submitted (L1)',              classes: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold' },
  'supervisor-review':          { label: 'Supervisor Review (L2)',      classes: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold' },
  'store-review':               { label: 'Central Store Issue',         classes: 'bg-cyan-50 text-cyan-800 border-cyan-300 font-semibold' },
  'finance-review':             { label: 'Finance Review (L3)',         classes: 'bg-orange-50 text-orange-800 border-orange-300 font-semibold' },
  'coordinator-review':         { label: 'Coordinator Review (L4)',     classes: 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold' },
  'national-coordinator-review':{ label: 'National Coordinator (L5)',   classes: 'bg-purple-50 text-purple-800 border-purple-300 font-semibold' },
  'disbursement-ready':         { label: 'Disbursement Ready',          classes: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold' },
  'procurement-queue':          { label: 'Procurement Queue',           classes: 'bg-blue-50 text-blue-800 border-blue-200' },
  approved:                     { label: 'Approved ✓',                   classes: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold' },
  rejected:                     { label: 'Declined ✗',                   classes: 'bg-rose-50 text-rose-800 border-rose-300 font-bold' },
  dispatched:                   { label: 'Funds Disbursed / Dispatched', classes: 'bg-teal-50 text-teal-800 border-teal-300 font-bold' },
  closed:                       { label: '100% Retired & Closed',       classes: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' },
};

const urgencyConfig: Record<Urgency, { label: string; classes: string; dot?: string }> = {
  stat:     { label: 'STAT Emergency', classes: 'bg-rose-50 text-rose-800 border-rose-300 font-bold', dot: 'bg-rose-500' },
  priority: { label: 'Priority',       classes: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',       dot: 'bg-amber-500' },
  routine:  { label: 'Routine',        classes: 'bg-slate-100 text-slate-700 border-slate-300',                 dot: 'bg-slate-400' },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = statusConfig[status] || statusConfig.submitted;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${config.classes}`}>
      {config.label}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const config = urgencyConfig[urgency] || urgencyConfig.routine;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${config.classes}`}>
      <span className="relative flex h-1.5 w-1.5">
        {urgency === 'stat' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`}></span>
      </span>
      {config.label}
    </span>
  );
}
