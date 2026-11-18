'use client';

import { TimelineEvent } from '@/lib/types';
import { formatDate } from '@/lib/mock-data';
import {
  CheckCircle2, XCircle, MessageSquare, Send, Package,
  DollarSign, ShoppingCart, Eye, Circle
} from 'lucide-react';

const eventConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  submitted:   { icon: Send,          color: 'text-blue-600',   bg: 'bg-blue-100' },
  approved:    { icon: CheckCircle2,  color: 'text-green-600',  bg: 'bg-green-100' },
  rejected:    { icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-100' },
  queried:     { icon: MessageSquare, color: 'text-amber-600',  bg: 'bg-amber-100' },
  dispatched:  { icon: Package,       color: 'text-teal-600',   bg: 'bg-teal-100' },
  finance:     { icon: DollarSign,    color: 'text-orange-600', bg: 'bg-orange-100' },
  procurement: { icon: ShoppingCart,  color: 'text-indigo-600', bg: 'bg-indigo-100' },
  reviewed:    { icon: Eye,           color: 'text-purple-600', bg: 'bg-purple-100' },
};

interface ApprovalTimelineProps {
  events: TimelineEvent[];
}

export default function ApprovalTimeline({ events }: ApprovalTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, idx) => {
        const cfg = eventConfig[event.type] || { icon: Circle, color: 'text-slate-500', bg: 'bg-slate-100' };
        const Icon = cfg.icon;
        const isLast = idx === events.length - 1;

        return (
          <div key={event.id} className="flex gap-3">
            {/* Timeline line + icon */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 z-10`}>
                <Icon size={15} className={cfg.color} />
              </div>
              {!isLast && (
                <div className="w-0.5 bg-slate-200 flex-1 my-1"></div>
              )}
            </div>

            {/* Content */}
            <div className={`pb-4 flex-1 min-w-0 ${isLast ? '' : ''}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{event.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-600">{event.actor}</span>
                    <span className="mx-1">·</span>
                    <span>{event.role}</span>
                  </p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                  {formatDate(event.timestamp)}
                </span>
              </div>
              {event.comment && (
                <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-600 italic">"{event.comment}"</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
