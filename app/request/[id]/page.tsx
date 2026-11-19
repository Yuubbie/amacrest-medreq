'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import ApprovalTimeline from '@/components/ApprovalTimeline';
import { mockRequests, formatCurrency, formatDate } from '@/lib/mock-data';
import { getStoredRequests, saveStoredRequests } from '@/lib/storage';
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

  const [request, setRequest] = useState<Request | null>(null);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const list = getStoredRequests();
    const found = list.find(r => r.id === id);
    if (found) setRequest(found);
    else setRequest(mockRequests.find(r => r.id === id) || null);
  }, [id]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-slate-900">Requisition Voucher Not Found</h2>
          <p className="text-slate-500 mt-2 mb-6">The voucher identifier "{id}" could not be retrieved from the ledger.</p>
          <Link href="/dashboard">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm">
              Return to Portal Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const addComment = () => {
    if (!comment.trim()) return;
    const updatedComments = [
      ...request.comments,
      {
        id: Date.now().toString(),
        author: 'Dr. Grace Mshelia',
        role: 'Director of Clinical Services',
        text: comment,
        timestamp: new Date().toISOString(),
      }
    ];
    const updatedReq = { ...request, comments: updatedComments };
    setRequest(updatedReq);

    // Save to storage
    const all = getStoredRequests();
    saveStoredRequests(all.map(r => r.id === request.id ? updatedReq : r));

    setComment('');
    showToast('Comment appended to audit trail', 'info');
  };

  const handleAcknowledgeReceipt = () => {
    const timestamp = new Date().toISOString();
    const stamp = `${request.requestedBy.split(' ').map(n=>n[0]).join('')}/RETIRE/${new Date().getFullYear()}`;
    const updatedReq: Request = {
      ...request,
      status: 'closed' as RequestStatus,
      retirementDetails: {
        retiredAt: timestamp,
        retiredBy: request.requestedBy,
        receiptNotes: 'Requester verified physical receipt of funds / materials. Requisition permanently retired and closed for audit.',
        signatureStamp: stamp,
        amountRetired: request.totalValue,
        variance: 0,
      },
      timeline: [
        ...request.timeline,
        {
          id: Date.now().toString(),
          action: 'Physical Receipt Confirmed & Voucher Retired by Requester ✓',
          actor: request.requestedBy,
          role: request.requestedByRole,
          timestamp,
          type: 'approved' as const,
          comment: `Requester physically verified receipt of ${formatCurrency(request.totalValue)}. Requisition permanently retired and closed for international donor audit. [Stamp: ${stamp}]`,
        }
      ]
    };

    setRequest(updatedReq);
    const all = getStoredRequests();
    saveStoredRequests(all.map(r => r.id === request.id ? updatedReq : r));
    showToast('✓ Receipt confirmed! Voucher has been permanently retired and logged for all reporting.', 'success');
  };

  const isTransport = request.requisitionType === 'transport' || request.unit === 'Hostel';
  const isEducation = request.requisitionType === 'education' || request.unit === 'Education Welfare';
  const isDisbursed = request.status === 'disbursement-ready' || request.status === 'dispatched';
  const isRetired = request.status === 'closed';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in fade-in text-xs font-bold font-sans ${
          toast.type === 'success' ? 'bg-teal-50 border-teal-300 text-teal-900' :
          toast.type === 'error' ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-white border-slate-300 text-slate-800'
        }`}>
          <span>{toast.msg}</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Link href="/dashboard" className="hover:text-teal-700 flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <span>/</span>
            <span className="text-teal-700 font-bold">{request.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer size={14} className="text-teal-700" />
              <span>Print Official Voucher</span>
            </button>
            <Link
              href="/hod"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
            >
              Supervisor Desk
            </Link>
          </div>
        </div>

        {/* ── Requester Acknowledgment Banner (When Disbursed) ── */}
        {isDisbursed && (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm print:hidden">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                <CheckCircle2 size={16} />
                <span>Payment Disbursed by Finance Head (Mr. AY, FCA)</span>
              </div>
              <h3 className="text-base font-black text-slate-900">Requester Physical Receipt Confirmation Required</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Funds of <strong className="text-teal-800 font-mono">{formatCurrency(request.totalValue)}</strong> have been released by Finance. Confirm receipt below to close and retire this voucher for donor audits.
              </p>
            </div>
            <button
              onClick={handleAcknowledgeReceipt}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <Check size={16} strokeWidth={3} />
              <span>Confirm Receipt & Retire Voucher</span>
            </button>
          </div>
        )}

        {/* ── Official Donor Audit Retirement Certificate Banner ── */}
        {isRetired && (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                    INTERNATIONAL DONOR AUDIT-READY
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                    100% RETIRED & CLOSED
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Physical Receipt & Voucher Retirement Cleared</h3>
                <p className="text-xs text-slate-600 font-mono mt-1">
                  PV Reference: <strong className="text-teal-800">{request.disbursementDetails?.pvNumber || `PV/NANI/2026/${request.id.replace('NANI-REQ-','')}`}</strong> · Retired by <strong className="text-slate-900">{request.retirementDetails?.retiredBy || request.requestedBy}</strong> [Stamp: {request.retirementDetails?.signatureStamp || 'CONF/2026'}]
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 font-mono text-xs">
              <span className="text-emerald-700 font-black text-lg block">{formatCurrency(request.totalValue)}</span>
              <span className="text-slate-500 text-[10px]">Grant: {request.donorGrantCode || 'HN-2026-SURG-Q4'}</span>
            </div>
          </div>
        )}

        {/* ── Official Printable Voucher Document ── */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm mb-8 print:border-slate-300 print:shadow-none">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Heart size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  NOMA AID NIGERIA INITIATIVE (NANI)
                </h1>
                <p className="text-xs text-teal-700 font-mono font-bold">
                  OFFICIAL ELECTRONIC REQUISITION VOUCHER
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-500">
              <div>Voucher Ref: <strong className="text-teal-700">{request.id}</strong></div>
              <div>Date Raised: <strong className="text-slate-900">{formatDate(request.createdAt)}</strong></div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-mono block">DEPARTMENT / UNIT</span>
              <strong className="text-slate-900 text-sm">{request.department} ({request.unit})</strong>
            </div>
            <div>
              <span className="text-slate-500 font-mono block">REQUESTER</span>
              <strong className="text-slate-900 text-sm">{request.requestedBy}</strong>
              <div className="text-[10px] text-slate-500">{request.requestedByRole}</div>
            </div>
            <div>
              <span className="text-slate-500 font-mono block">DONOR GRANT LINE</span>
              <strong className="text-emerald-700 text-sm font-mono">{request.donorGrantCode || 'HN-2026-SURG-Q4'}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-mono block">TOTAL REQUISITION VALUE</span>
              <strong className="text-teal-700 text-lg font-black font-mono">{formatCurrency(request.totalValue)}</strong>
            </div>
          </div>

          {/* Operational Case Memo */}
          <div className="py-4 border-b border-slate-200 text-xs">
            <span className="text-slate-500 font-mono block mb-1">OPERATIONAL JUSTIFICATION / CLINICAL CASE MEMO</span>
            <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 italic">
              "{request.justification}"
            </p>
          </div>

          {/* Schedule of Items / Transport Passengers / Education Students */}
          <div className="py-6 border-b border-slate-200">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold mb-3">
              {isTransport 
                ? 'PASSENGER TRANSPORT SCHEDULE (STATE-RATED)' 
                : isEducation 
                ? 'PATIENT EDUCATION WELFARE & SCHOOLING SPONSORSHIP ROSTER' 
                : 'SCHEDULE OF LINE ITEMS & TRANSACTION CODES'}
            </h3>

            {isTransport && request.transportPassengers && request.transportPassengers.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr className="border-b border-slate-200 uppercase">
                      <th className="py-2 px-2 text-center w-12">S/N</th>
                      <th className="py-2 px-3">Passenger Full Name</th>
                      <th className="py-2 px-3">Role / Status</th>
                      <th className="py-2 px-3">State of Origin</th>
                      <th className="py-2 px-3">Direction</th>
                      <th className="py-2 px-3 text-right">Fixed State Fare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {request.transportPassengers.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2 text-center text-slate-400">{p.sn}</td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{p.name}</td>
                        <td className="py-2.5 px-3 uppercase text-slate-600">{p.type}</td>
                        <td className="py-2.5 px-3 text-teal-700">{p.stateOfOrigin}</td>
                        <td className="py-2.5 px-3 text-slate-700">{p.direction}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-teal-700">{formatCurrency(p.transportCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : isEducation && request.educationStudents && request.educationStudents.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr className="border-b border-slate-200 uppercase">
                      <th className="py-2 px-2 text-center w-12">S/N</th>
                      <th className="py-2 px-3">Patient Full Name</th>
                      <th className="py-2 px-3">School / Institution</th>
                      <th className="py-2 px-3">Class Level</th>
                      <th className="py-2 px-3">Support Category</th>
                      <th className="py-2 px-3 text-right">Sponsorship Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {request.educationStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2 text-center text-slate-400">{s.sn}</td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{s.patientName}</td>
                        <td className="py-2.5 px-3 text-slate-800">{s.schoolName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{s.classLevel}</td>
                        <td className="py-2.5 px-3 text-teal-700">{s.supportType}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-teal-700">{formatCurrency(s.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr className="border-b border-slate-200 uppercase">
                      <th className="py-2 px-2 text-center w-12">S/N</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Code</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3">Unit</th>
                      <th className="py-2 px-3 text-right">Unit Price</th>
                      <th className="py-2 px-3 text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {request.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2 text-center text-slate-400">{item.sn || idx + 1}</td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-3 text-teal-700">{item.transactionCode || 'MED-002'}</td>
                        <td className="py-2.5 px-3 text-center text-slate-700">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-slate-600">{item.unit}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-teal-700">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Digital Signature Trail & Watermark Stamps ── */}
          <div className="pt-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-teal-700 font-bold mb-4">
              4-LEVEL APPROVAL CHAIN & DIGITAL SIGNATURE WATERMARKS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Level 1: Requester */}
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-teal-800 font-bold">LEVEL 1 · REQUESTER</span>
                  <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[9px] font-bold">SIGNED ✓</span>
                </div>
                <p className="font-bold text-xs text-slate-900">{request.requestedBy}</p>
                <p className="text-[10px] text-slate-500">{request.requestedByRole}</p>
                <div className="mt-3 pt-2 border-t border-teal-200 text-[9px] font-mono text-teal-800">
                  STAMP: {request.requestedBy.split(' ').map(n=>n[0]).join('')}/VOUCH/2026
                </div>
              </div>

              {/* Level 2: Supervisor */}
              {request.signatures?.find(s => s.level === 'supervisor') ? (
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-teal-800 font-bold">LEVEL 2 · SUPERVISOR</span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[9px] font-bold">SIGNED ✓</span>
                  </div>
                  <p className="font-bold text-xs text-slate-900">
                    {request.signatures.find(s => s.level === 'supervisor')?.actor}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {request.signatures.find(s => s.level === 'supervisor')?.role}
                  </p>
                  <div className="mt-3 pt-2 border-t border-teal-200 text-[9px] font-mono text-teal-800">
                    STAMP: {request.signatures.find(s => s.level === 'supervisor')?.signatureStamp}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 opacity-60">
                  <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">LEVEL 2 · SUPERVISOR</span>
                  <p className="font-bold text-xs text-slate-700">Unit / Dept Head</p>
                  <p className="text-[10px] text-slate-500">Pending Review</p>
                </div>
              )}

              {/* Level 3: Finance */}
              {request.signatures?.find(s => s.level === 'finance') ? (
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-teal-800 font-bold">LEVEL 3 · FINANCE</span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[9px] font-bold">LOCKED ✓</span>
                  </div>
                  <p className="font-bold text-xs text-slate-900">
                    {request.signatures.find(s => s.level === 'finance')?.actor}
                  </p>
                  <p className="text-[10px] text-slate-500">Finance & Grant Controller</p>
                  <div className="mt-3 pt-2 border-t border-teal-200 text-[9px] font-mono text-teal-800">
                    STAMP: {request.signatures.find(s => s.level === 'finance')?.signatureStamp}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 opacity-60">
                  <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">LEVEL 3 · FINANCE</span>
                  <p className="font-bold text-xs text-slate-700">Mr. AY, FCA</p>
                  <p className="text-[10px] text-slate-500">Pending Level 2</p>
                </div>
              )}

              {/* Level 4: Coordinator */}
              {request.signatures?.find(s => s.level === 'coordinator') ? (
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-teal-800 font-bold">LEVEL 4 · COORDINATOR</span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[9px] font-bold">RATIFIED ✓</span>
                  </div>
                  <p className="font-bold text-xs text-slate-900">
                    {request.signatures.find(s => s.level === 'coordinator')?.actor}
                  </p>
                  <p className="text-[10px] text-slate-500">Programme Coordinator</p>
                  <div className="mt-3 pt-2 border-t border-teal-200 text-[9px] font-mono text-teal-800">
                    STAMP: {request.signatures.find(s => s.level === 'coordinator')?.signatureStamp}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 opacity-60">
                  <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">LEVEL 4 · COORDINATOR</span>
                  <p className="font-bold text-xs text-slate-700">Programme Coordinator</p>
                  <p className="text-[10px] text-slate-500">Pending Level 3</p>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ── Timeline & Discussion Box ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
          
          {/* Audit Timeline */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">Permanent Audit Log Trail</h3>
            <ApprovalTimeline events={request.timeline} />
          </div>

          {/* Internal Memo Notes */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-3">Internal Voucher Notes & Queries</h3>
              
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {request.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4">No internal audit notes attached to this voucher.</p>
                ) : (
                  request.comments.map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <strong className="text-slate-800">{c.author}</strong>
                        <span className="text-[10px] font-mono">{formatDate(c.timestamp)}</span>
                      </div>
                      <p className="text-slate-700">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Append audit query or note..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  onClick={addComment}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all shadow-sm"
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