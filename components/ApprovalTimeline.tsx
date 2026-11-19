'use client';

import { TimelineEvent } from '@/lib/types';
import { formatDate } from '@/lib/mock-data';
import {
  CheckCircle2, XCircle, MessageSquare, Send, Package,
  DollarSign, ShoppingCart, Eye, Circle, Award, ShieldCheck
} from 'lucide-react';

const eventConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  submitted:   { icon: Send,          color: 'text-teal-400',   bg: 'bg-teal-500/10 border border-teal-500/20' },
  approved:    { icon: CheckCircle2,  color: 'text-emerald-400',bg: 'bg-emerald-500/10 border border-emerald-500/20' },
  rejected:    { icon: XCircle,       color: 'text-rose-400',   bg: 'bg-rose-500/10 border border-rose-500/20' },
  queried:     { icon: MessageSquare, color: 'text-amber-400',  bg: 'bg-amber-500/10 border border-amber-500/20' },
  dispatched:  { icon: Package,       color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border border-cyan-500/20' },
  finance:     { icon: DollarSign,    color: 'text-emerald-400',bg: 'bg-emerald-500/10 border border-emerald-500/20' },
  procurement: { icon: ShoppingCart,  color: 'text-purple-400', bg: 'bg-purple-500/10 border border-purple-500/20' },
  reviewed:    { icon: Eye,           color: 'text-blue-400',   bg: 'bg-blue-500/10 border border-blue-500/20' },
  coordinator: { icon: ShieldCheck,   color: 'text-indigo-400', bg: 'bg-indigo-500/10 border border-indigo-500/20' },
  national:    { icon: Award,         color: 'text-rose-400',   bg: 'bg-rose-500/10 border border-rose-500/20' },
};

interface ApprovalTimelineProps {
  events: TimelineEvent[];
}

export default function ApprovalTimeline({ events }: ApprovalTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, idx) => {
        const cfg = eventConfig[event.type] || { icon: Circle, color: 'text-zinc-500', bg: 'bg-zinc-800' };
        const Icon = cfg.icon;
        const isLast = idx === events.length - 1;

        return (
          <div key={event.id} className="flex gap-3">
            {/* Timeline line + icon */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 z-10 shadow-sm`}>
                <Icon size={14} className={cfg.color} />
              </div>
              {!isLast && (
                <div className="w-0.5 bg-zinc-800 flex-1 my-1"></div>
              )}
            </div>

            {/* Content */}
            <div className={`pb-4 flex-1 min-w-0 ${isLast ? '' : ''}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-xs font-bold text-white">{event.action}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    <span className="font-semibold text-zinc-300">{event.actor}</span>
                    <span className="mx-1">·</span>
                    <span className="font-mono text-zinc-500">{event.role}</span>
                  </p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap flex-shrink-0">
                  {formatDate(event.timestamp)}
                </span>
              </div>
              {event.comment && (
                <div className="mt-2 bg-zinc-950 border border-zinc-800/80 rounded-xl px-3 py-2 text-xs">
                  <p className="text-zinc-400 italic">"{event.comment}"</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
