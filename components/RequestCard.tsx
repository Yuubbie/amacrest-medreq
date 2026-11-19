'use client';

import Link from 'next/link';
import { Request } from '@/lib/types';
import { StatusBadge, UrgencyBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '@/lib/mock-data';
import { Clock, Building2, User, ArrowRight, Bus, Package } from 'lucide-react';

interface RequestCardProps {
  request: Request;
}

export default function RequestCard({ request }: RequestCardProps) {
  const isTransport = request.requisitionType === 'transport' || request.unit === 'Hostel';

  return (
    <Link href={`/request/${request.id}`}>
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-teal-500/50 hover:shadow-xl transition-all p-4 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                {request.id}
              </span>
              <UrgencyBadge urgency={request.urgency} />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-teal-300 truncate transition-colors">
              {request.title}
            </h3>
          </div>
          <StatusBadge status={request.status} />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            {isTransport ? <Bus size={12} className="text-teal-400" /> : <Building2 size={12} className="text-zinc-500" />}
            <span className="truncate">{request.department} ({request.unit})</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <User size={12} className="text-zinc-500" />
            <span className="truncate">{request.requestedBy}</span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {formatDate(request.createdAt)}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono text-right">
            {request.donorGrantCode || 'HN-2026-SURG-Q4'}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <div>
            <span className="text-base font-black text-teal-400 font-mono">
              {formatCurrency(request.totalValue)}
            </span>
            <span className="text-[10px] text-zinc-500 ml-1.5">
              {isTransport ? `${request.transportPassengers?.length || 3} passengers` : `${request.items.length} item${request.items.length > 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-teal-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            <span>View Voucher</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  );
}
