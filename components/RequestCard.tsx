'use client';

import Link from 'next/link';
import { Request } from '@/lib/types';
import { StatusBadge, UrgencyBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '@/lib/mock-data';
import { Clock, Building2, User, ArrowRight } from 'lucide-react';

interface RequestCardProps {
  request: Request;
}

function getSLAHours(createdAt: string, status: string): string {
  const created = new Date(createdAt);
  const now = new Date('2026-11-18T15:30:00Z');
  const diffHours = Math.floor((now.getTime() - created.getTime()) / 3600000);

  if (['approved', 'rejected', 'dispatched', 'closed'].includes(status)) return 'Completed';
  const slaHours = 48;
  const remaining = slaHours - diffHours;
  if (remaining < 0) return 'SLA Breached';
  if (remaining < 4) return `${remaining}h remaining ⚠️`;
  return `${remaining}h remaining`;
}

function getSLAColor(createdAt: string, status: string): string {
  if (['approved', 'rejected', 'dispatched', 'closed'].includes(status)) return 'text-slate-400';
  const created = new Date(createdAt);
  const now = new Date('2026-11-18T15:30:00Z');
  const diffHours = Math.floor((now.getTime() - created.getTime()) / 3600000);
  const remaining = 48 - diffHours;
  if (remaining < 0) return 'text-red-600 font-semibold';
  if (remaining < 8) return 'text-amber-600 font-semibold';
  return 'text-slate-500';
}

export default function RequestCard({ request }: RequestCardProps) {
  return (
    <Link href={`/request/${request.id}`}>
      <div className="bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 p-4 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                {request.id}
              </span>
              <UrgencyBadge urgency={request.urgency} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 group-hover:text-teal-700 truncate transition-colors">
              {request.title}
            </h3>
          </div>
          <StatusBadge status={request.status} />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 size={12} />
            <span className="truncate">{request.department}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <User size={12} />
            <span className="truncate">{request.requestedBy}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock size={12} />
            <span className={getSLAColor(request.createdAt, request.status)}>
              {getSLAHours(request.createdAt, request.status)}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            {formatDate(request.createdAt)}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-lg font-bold text-slate-800">
              {formatCurrency(request.totalValue)}
            </span>
            <span className="text-xs text-slate-400 ml-1">
              {request.items.length} item{request.items.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1 text-teal-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>View details</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  );
}
