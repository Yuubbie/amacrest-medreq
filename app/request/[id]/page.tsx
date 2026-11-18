'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import ApprovalTimeline from '@/components/ApprovalTimeline';
import { mockRequests, formatCurrency, formatDate } from '@/lib/mock-data';
import { Request, RequestStatus, TimelineEvent } from '@/lib/types';
import {
  ArrowLeft, Building2, User, Calendar, Tag, FileText,
  Check, X, MessageSquare, Send, Paperclip, ChevronRight,
  DollarSign, Package, RotateCcw
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
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-slate-700">Request Not Found</h2>
          <p className="text-slate-500 mt-2 mb-6">The request ID "{id}" could not be found.</p>
          <Link href="/dashboard">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const updateStatus = (status: RequestStatus, action: string, comment?: string) => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      action,
      actor: 'Dr. Emmanuel Okafor',
      role: 'Head of Department',
      timestamp: new Date().toISOString(),
      type: status === 'approved' || status === 'finance-review' ? 'approved' :
            status === 'rejected' ? 'rejected' : 'queried',
      comment,
    };
    setRequest(prev => prev ? { ...prev, status, timeline: [...prev.timeline, newEvent] } : prev);
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setRequest(prev => prev ? {
      ...prev,
      comments: [...prev.comments, {
        id: Date.now().toString(),
        author: 'Dr. Emmanuel Okafor',
        role: 'Head of Department',
        text: comment,
        timestamp: new Date().toISOString(),
      }]
    } : prev);
    setComment('');
    showToast('Comment added', 'info');
  };

  const isPending = ['submitted', 'hod-review'].includes(request.status);
  const isFinancePending = ['finance-review', 'executive-review'].includes(request.status);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="Head of Department" userName="Dr. Emmanuel Okafor" />

      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-600' :
          toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard" className="hover:text-teal-600 flex items-center gap-1 transition-colors">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <ChevronRight size={12} />
          <Link href="/hod" className="hover:text-teal-600 transition-colors">HOD Queue</Link>
          <ChevronRight size={12} />
          <span className="text-slate-800 font-medium">{request.id}</span>
        </div>

        {/* Request header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-sm font-mono font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-lg">
                  {request.id}
                </span>
                <StatusBadge status={request.status} />
                <UrgencyBadge urgency={request.urgency} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">{request.title}</h1>
              <p className="text-slate-500 text-sm mt-1">{request.department} · {request.category}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-slate-800">{formatCurrency(request.totalValue)}</div>
              <div className="text-xs text-slate-400 mt-0.5">{request.items.length} line item{request.items.length > 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 space-y-6">

            {/* Request details */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Request Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { icon: Building2, label: 'Department', value: request.department },
                  { icon: User, label: 'Requested By', value: request.requestedBy },
                  { icon: Tag, label: 'Category', value: request.category },
                  { icon: Calendar, label: 'Created', value: formatDate(request.createdAt) },
                  { icon: FileText, label: 'Budget Code', value: request.budgetCode },
                  { icon: Calendar, label: 'Last Updated', value: formatDate(request.updatedAt) },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">{item.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Justification */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Clinical Justification</p>
                <p className="text-sm text-slate-700 leading-relaxed">{request.justification}</p>
              </div>
            </div>

            {/* Items table */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Requested Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide pb-3">Item Description</th>
                      <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide pb-3">Qty</th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide pb-3">Unit Price</th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide pb-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {request.items.map(item => (
                      <tr key={item.id}>
                        <td className="py-3 font-medium text-slate-700">{item.name}</td>
                        <td className="py-3 text-center text-slate-600">{item.quantity} {item.unit}</td>
                        <td className="py-3 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 text-right font-semibold text-slate-700">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-teal-200">
                      <td colSpan={3} className="pt-3 font-bold text-slate-800">Grand Total</td>
                      <td className="pt-3 text-right font-black text-teal-700 text-base">{formatCurrency(request.totalValue)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Attachments placeholder */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-3">Attachments</h2>
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <Paperclip size={16} className="text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Stock_verification_{request.id}.pdf</p>
                  <p className="text-xs text-slate-400">48 KB · Uploaded by {request.requestedBy.split(' ')[0]}</p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Comments ({request.comments.length})</h2>
              <div className="space-y-4 mb-5">
                {request.comments.length === 0 && (
                  <p className="text-sm text-slate-400 italic">No comments yet.</p>
                )}
                {request.comments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-teal-700">
                        {c.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-700">{c.author}</span>
                        <span className="text-xs text-slate-400">· {c.role}</span>
                        <span className="text-xs text-slate-400">· {formatDate(c.timestamp)}</span>
                      </div>
                      <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Comment input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addComment()}
                  placeholder="Add a comment..."
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                />
                <button
                  onClick={addComment}
                  className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-lg transition-colors flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action bar */}
            {(isPending || isFinancePending || request.status === 'rejected') && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-base font-bold text-slate-800 mb-4">Actions</h2>
                {isPending && (
                  <div className="space-y-2">
                    <button
                      onClick={() => { updateStatus('finance-review', 'HOD Approved'); showToast(`${request.id} approved ✓`, 'success'); }}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    >
                      <Check size={16} /> Approve Request
                    </button>
                    <button
                      onClick={() => { updateStatus('rejected', 'HOD Rejected'); showToast(`${request.id} rejected`, 'error'); }}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-xl font-semibold text-sm transition-colors border border-red-200"
                    >
                      <X size={16} /> Reject Request
                    </button>
                    <button
                      onClick={() => { updateStatus('hod-review', 'HOD Queried — Awaiting Clarification'); showToast('Query sent to requester', 'info'); }}
                      className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 py-2.5 rounded-xl font-semibold text-sm transition-colors border border-amber-200"
                    >
                      <MessageSquare size={16} /> Send Query
                    </button>
                  </div>
                )}
                {isFinancePending && (
                  <div className="space-y-2">
                    <button
                      onClick={() => { updateStatus('approved', 'Finance Payment Approved'); showToast('Payment approved ✓', 'success'); }}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    >
                      <DollarSign size={16} /> Approve Payment
                    </button>
                    <button
                      onClick={() => { showToast('Concern raised — Finance team notified', 'info'); }}
                      className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 py-2.5 rounded-xl font-semibold text-sm transition-colors border border-amber-200"
                    >
                      <MessageSquare size={16} /> Raise Concern
                    </button>
                  </div>
                )}
                {request.status === 'rejected' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => { updateStatus('submitted', 'Request Resubmitted'); showToast('Request resubmitted ✓', 'success'); }}
                      className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    >
                      <RotateCcw size={16} /> Resubmit Request
                    </button>
                    <button
                      onClick={() => { updateStatus('draft', 'Request Cancelled by Staff'); showToast('Request cancelled', 'info'); }}
                      className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2.5 rounded-xl font-semibold text-sm transition-colors border border-slate-200"
                    >
                      <X size={16} /> Cancel Request
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Approval Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-base font-bold text-slate-800 mb-5">Approval Trail</h2>
              <ApprovalTimeline events={request.timeline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
