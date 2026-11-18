'use client';

import { RequestStatus, Urgency } from '@/lib/types';

const statusConfig: Record<RequestStatus, { label: string; classes: string }> = {
  draft:              { label: 'Draft',              classes: 'bg-slate-100 text-slate-600 border-slate-200' },
  submitted:          { label: 'Submitted',          classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  'hod-review':       { label: 'HOD Review',         classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  'finance-review':   { label: 'Finance Review',     classes: 'bg-orange-50 text-orange-700 border-orange-200' },
  'executive-review': { label: 'Executive Review',   classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  'procurement-queue':{ label: 'Procurement Queue',  classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  approved:           { label: 'Approved',            classes: 'bg-green-50 text-green-700 border-green-200' },
  rejected:           { label: 'Rejected',            classes: 'bg-red-50 text-red-700 border-red-200' },
  dispatched:         { label: 'Dispatched',          classes: 'bg-teal-50 text-teal-700 border-teal-200' },
  closed:             { label: 'Closed',              classes: 'bg-slate-200 text-slate-600 border-slate-300' },
};

const urgencyConfig: Record<Urgency, { label: string; classes: string; dot?: string }> = {
  stat:     { label: 'STAT',     classes: 'bg-red-100 text-red-700 border-red-200',           dot: 'bg-red-500' },
  priority: { label: 'Priority', classes: 'bg-amber-100 text-amber-700 border-amber-200',     dot: 'bg-amber-500' },
  routine:  { label: 'Routine',  classes: 'bg-slate-100 text-slate-600 border-slate-200',     dot: 'bg-slate-400' },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.classes}`}>
      {config.label}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const config = urgencyConfig[urgency];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.classes}`}>
      <span className={`relative flex h-1.5 w-1.5`}>
        {urgency === 'stat' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`}></span>
      </span>
      {config.label}
    </span>
  );
}
