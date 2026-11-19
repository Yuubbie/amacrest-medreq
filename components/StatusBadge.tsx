'use client';

import { RequestStatus, Urgency } from '@/lib/types';

const statusConfig: Record<RequestStatus, { label: string; classes: string }> = {
  draft:                        { label: 'Draft',                       classes: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  submitted:                    { label: 'Submitted',                   classes: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
  'supervisor-review':          { label: 'Supervisor Review (L2)',      classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  'store-review':               { label: 'Central Store Issue',         classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
  'finance-review':             { label: 'Finance Review (L3)',         classes: 'bg-orange-500/10 text-orange-300 border-orange-500/30' },
  'coordinator-review':         { label: 'Coordinator Review (L4)',     classes: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
  'national-coordinator-review':{ label: 'National Coordinator (L5)',   classes: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
  'disbursement-ready':         { label: 'Disbursement Ready',          classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  'procurement-queue':          { label: 'Procurement Queue',           classes: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
  approved:                     { label: 'Approved ✓',                   classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold' },
  rejected:                     { label: 'Declined ✗',                   classes: 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-bold' },
  dispatched:                   { label: 'Dispatched / Collected',      classes: 'bg-teal-500/15 text-teal-300 border-teal-500/40' },
  closed:                       { label: 'Closed & Audited',            classes: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
};

const urgencyConfig: Record<Urgency, { label: string; classes: string; dot?: string }> = {
  stat:     { label: 'STAT Emergency', classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30 font-bold', dot: 'bg-rose-400' },
  priority: { label: 'Priority',       classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30',       dot: 'bg-amber-400' },
  routine:  { label: 'Routine',        classes: 'bg-zinc-800 text-zinc-300 border-zinc-700',                 dot: 'bg-zinc-400' },
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
