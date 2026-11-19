'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import ApprovalTimeline from '@/components/ApprovalTimeline';
import { mockRequests, formatCurrency, formatDate } from '@/lib/mock-data';
import { Request, RequestStatus, TimelineEvent, ApprovalSignature } from '@/lib/types';
import {
  ArrowLeft, Building2, User, Calendar, Tag, FileText,
  Check, X, MessageSquare, Send, Paperclip, ChevronRight,
  DollarSign, Package, RotateCcw, Heart, Printer, ShieldCheck,
  CheckCircle2, AlertTriangle, Users
} from 'lucide-react';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const original = mockRequests.find(r => r.id === id);
  const [request, setRequest] = useState<Request | null>(original || null);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!request) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white">Requisition Voucher Not Found</h2>
          <p className="text-zinc-500 mt-2 mb-6">The voucher identifier "{id}" could not be retrieved from the ledger.</p>
          <Link href="/dashboard">
            <button className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-6 py-2.5 rounded-xl font-bold text-xs transition-colors">
              Return to Portal Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const addComment = () => {
    if (!comment.trim()) return;
    setRequest(prev => prev ? {
      ...prev,
      comments: [...prev.comments, {
        id: Date.now().toString(),
        author: 'Dr. Grace Mshelia',
        role: 'Director of Clinical Services',
        text: comment,
        timestamp: new Date().toISOString(),
      }]
    } : prev);
    setComment('');
    showToast('Comment appended to audit trail', 'info');
  };

  const isTransport = request.requisitionType === 'transport' || request.unit === 'Hostel';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950">
      <div className="print:hidden">
        <Navbar role="Staff Reviewer" userName="Nurse Hauwa Bello" />
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in fade-in text-xs font-bold font-sans ${
          toast.type === 'success' ? 'bg-teal-950 border-teal-500 text-teal-300' :
          toast.type === 'error' ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-zinc-900 border-zinc-700 text-zinc-300'
        }`}>
          <span>{toast.msg}</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Link href="/dashboard" className="hover:text-teal-400 flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <span>/</span>
            <span className="text-teal-400">{request.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 flex items-center gap-1.5 transition-all"
            >
              <Printer size={14} className="text-teal-400" />
              <span>Print Official Voucher</span>
            </button>
            <Link
              href="/hod"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-teal-500/20"
            >
              Supervisor Desk
            </Link>
          </div>
        </div>

        {/* ── Official Printable Voucher Document ── */}
        <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl mb-8 print:bg-white print:text-zinc-950 print:border-zinc-300 print:shadow-none">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 print:border-zinc-300 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 print:bg-teal-50">
                <Heart size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white print:text-zinc-900 tracking-tight">
                  NOMA AID NIGERIA INITIATIVE (NANI)
                </h1>
                <p className="text-xs text-teal-400 print:text-teal-700 font-mono">
                  OFFICIAL ELECTRONIC REQUISITION VOUCHER
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-zinc-400 print:text-zinc-600">
              <div>Voucher Ref: <strong className="text-teal-400 print:text-zinc-900">{request.id}</strong></div>
              <div>Date Raised: <strong className="text-white print:text-zinc-900">{formatDate(request.createdAt)}</strong></div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-zinc-800 print:border-zinc-300 text-xs">
            <div>
              <span className="text-zinc-500 font-mono block">DEPARTMENT / UNIT</span>
              <strong className="text-white print:text-zinc-900 text-sm">{request.department} ({request.unit})</strong>
            </div>
            <div>
              <span className="text-zinc-500 font-mono block">REQUESTER</span>
              <strong className="text-white print:text-zinc-900 text-sm">{request.requestedBy}</strong>
              <div className="text-[10px] text-zinc-500">{request.requestedByRole}</div>
            </div>
            <div>
              <span className="text-zinc-500 font-mono block">DONOR GRANT LINE</span>
              <strong className="text-emerald-400 print:text-emerald-700 text-sm font-mono">{request.donorGrantCode || 'HN-2026-SURG-Q4'}</strong>
            </div>
            <div>
              <span className="text-zinc-500 font-mono block">TOTAL REQUISITION VALUE</span>
              <strong className="text-teal-400 print:text-teal-700 text-lg font-black font-mono">{formatCurrency(request.totalValue)}</strong>
            </div>
          </div>

          {/* Operational Case Memo */}
          <div className="py-4 border-b border-zinc-800 print:border-zinc-300 text-xs">
            <span className="text-zinc-500 font-mono block mb-1">OPERATIONAL JUSTIFICATION / CLINICAL CASE MEMO</span>
            <p className="text-zinc-300 print:text-zinc-800 bg-zinc-950 print:bg-zinc-100 p-3 rounded-xl border border-zinc-800 print:border-zinc-200 italic">
              "{request.justification}"
            </p>
          </div>

          {/* Schedule of Items / Transport Passengers */}
          <div className="py-6 border-b border-zinc-800 print:border-zinc-300">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 print:text-zinc-600 mb-3">
              {isTransport ? 'PASSENGER TRANSPORT SCHEDULE (STATE-RATED)' : 'SCHEDULE OF LINE ITEMS & TRANSACTION CODES'}
            </h3>

            {isTransport && request.transportPassengers && request.transportPassengers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-zinc-800 print:border-zinc-300 text-zinc-400 uppercase">
                      <th className="py-2 px-2 text-center w-12">S/N</th>
                      <th className="py-2 px-3">Passenger Full Name</th>
                      <th className="py-2 px-3">Role / Status</th>
                      <th className="py-2 px-3">State of Origin</th>
                      <th className="py-2 px-3">Direction</th>
                      <th className="py-2 px-3 text-right">Fixed State Fare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 print:divide-zinc-200">
                    {request.transportPassengers.map(p => (
                      <tr key={p.id}>
                        <td className="py-2.5 px-2 text-center text-zinc-500">{p.sn}</td>
                        <td className="py-2.5 px-3 font-sans font-bold text-white print:text-zinc-900">{p.name}</td>
                        <td className="py-2.5 px-3 uppercase text-zinc-400">{p.type}</td>
                        <td className="py-2.5 px-3 text-teal-400 print:text-teal-700">{p.stateOfOrigin}</td>
                        <td className="py-2.5 px-3 text-zinc-300">{p.direction}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-teal-400 print:text-zinc-900">{formatCurrency(p.transportCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-zinc-800 print:border-zinc-300 text-zinc-400 uppercase">
                      <th className="py-2 px-2 text-center w-12">S/N</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Code</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3">Unit</th>
                      <th className="py-2 px-3 text-right">Unit Price</th>
                      <th className="py-2 px-3 text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 print:divide-zinc-200">
                    {request.items.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-2 text-center text-zinc-500">{item.sn || idx + 1}</td>
                        <td className="py-2.5 px-3 font-sans font-bold text-white print:text-zinc-900">{item.name}</td>
                        <td className="py-2.5 px-3 text-teal-400 print:text-teal-700">{item.transactionCode || 'MED-002'}</td>
                        <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-zinc-400">{item.unit}</td>
                        <td className="py-2.5 px-3 text-right text-zinc-300">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-teal-400 print:text-zinc-900">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Digital Signature Trail & Watermark Stamps ── */}
          <div className="pt-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-teal-400 print:text-teal-700 mb-4">
              4-LEVEL APPROVAL CHAIN & DIGITAL SIGNATURE WATERMARKS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Level 1: Requester */}
              <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/40 print:border-zinc-300 print:bg-zinc-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-teal-400 font-bold">LEVEL 1 · REQUESTER</span>
                  <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[9px] font-bold">SIGNED ✓</span>
                </div>
                <p className="font-bold text-xs text-white print:text-zinc-900">{request.requestedBy}</p>
                <p className="text-[10px] text-zinc-500">{request.requestedByRole}</p>
                <div className="mt-3 pt-2 border-t border-teal-500/20 text-[9px] font-mono text-teal-400/80">
                  STAMP: {request.requestedBy.split(' ').map(n=>n[0]).join('')}/VOUCH/2026
                </div>
              </div>

              {/* Level 2: Supervisor */}
              {request.signatures?.find(s => s.level === 'supervisor') ? (
                <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/40 print:border-zinc-300 print:bg-zinc-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-teal-400 font-bold">LEVEL 2 · SUPERVISOR</span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[9px] font-bold">SIGNED ✓</span>
                  </div>
                  <p className="font-bold text-xs text-white print:text-zinc-900">
                    {request.signatures.find(s => s.level === 'supervisor')?.actor}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {request.signatures.find(s => s.level === 'supervisor')?.role}
                  </p>
                  <div className="mt-3 pt-2 border-t border-teal-500/20 text-[9px] font-mono text-teal-400/80">
                    STAMP: {request.signatures.find(s => s.level === 'supervisor')?.signatureStamp}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 opacity-60">
                  <span className="text-[10px] font-mono text-zinc-500 font-bold block mb-1">LEVEL 2 · SUPERVISOR</span>
                  <p className="font-bold text-xs text-zinc-400">Unit / Dept Head</p>
                  <p className="text-[10px] text-zinc-600">Pending Review</p>
                </div>
              )}

              {/* Level 3: Finance */}
              {request.signatures?.find(s => s.level === 'finance') ? (
                <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/40 print:border-zinc-300 print:bg-zinc-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-teal-400 font-bold">LEVEL 3 · FINANCE</span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[9px] font-bold">LOCKED ✓</span>
                  </div>
                  <p className="font-bold text-xs text-white print:text-zinc-900">
                    {request.signatures.find(s => s.level === 'finance')?.actor}
                  </p>
                  <p className="text-[10px] text-zinc-500">Finance & Grant Controller</p>
                  <div className="mt-3 pt-2 border-t border-teal-500/20 text-[9px] font-mono text-teal-400/80">
                    STAMP: {request.signatures.find(s => s.level === 'finance')?.signatureStamp}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 opacity-60">
                  <span className="text-[10px] font-mono text-zinc-500 font-bold block mb-1">LEVEL 3 · FINANCE</span>
                  <p className="font-bold text-xs text-zinc-400">Grant Controller</p>
                  <p className="text-[10px] text-zinc-600">Pending Level 2</p>
                </div>
              )}

              {/* Level 4: Coordinator */}
              {request.signatures?.find(s => s.level === 'coordinator') ? (
                <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/40 print:border-zinc-300 print:bg-zinc-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-teal-400 font-bold">LEVEL 4 · COORDINATOR</span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[9px] font-bold">RATIFIED ✓</span>
                  </div>
                  <p className="font-bold text-xs text-white print:text-zinc-900">
                    {request.signatures.find(s => s.level === 'coordinator')?.actor}
                  </p>
                  <p className="text-[10px] text-zinc-500">Programme Coordinator</p>
                  <div className="mt-3 pt-2 border-t border-teal-500/20 text-[9px] font-mono text-teal-400/80">
                    STAMP: {request.signatures.find(s => s.level === 'coordinator')?.signatureStamp}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 opacity-60">
                  <span className="text-[10px] font-mono text-zinc-500 font-bold block mb-1">LEVEL 4 · COORDINATOR</span>
                  <p className="font-bold text-xs text-zinc-400">Programme Coordinator</p>
                  <p className="text-[10px] text-zinc-600">Pending Level 3</p>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ── Timeline & Discussion Box ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
          
          {/* Audit Timeline */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
            <h3 className="text-sm font-black text-white mb-4">Permanent Audit Log Trail</h3>
            <ApprovalTimeline events={request.timeline} />
          </div>

          {/* Internal Memo Notes */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-white mb-3">Internal Voucher Notes & Queries</h3>
              
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {request.comments.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic py-4">No internal audit notes attached to this voucher.</p>
                ) : (
                  request.comments.map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                      <div className="flex items-center justify-between text-zinc-400 mb-1">
                        <strong className="text-zinc-200">{c.author}</strong>
                        <span className="text-[10px] font-mono">{formatDate(c.timestamp)}</span>
                      </div>
                      <p className="text-zinc-300">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Append audit query or note..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  onClick={addComment}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                >
                  <Send size={13} />
                  <span>Send</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
