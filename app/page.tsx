'use client';

import Link from 'next/link';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, Clock, 
  FileText, TrendingDown, Stethoscope, Building2, 
  Layers, Lock, Sparkles, Activity, FileSpreadsheet,
  AlertTriangle, DollarSign, Package, Check, Smartphone
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950 relative overflow-hidden font-sans">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-[600px] h-[400px] bg-teal-600/10 blur-[140px] rounded-full pointer-events-none"></div>
      
      {/* Subtle Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      ></div>

      {/* 1. Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black shadow-lg shadow-teal-500/10">
              <Activity size={20} className="animate-pulse" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white">Amacrest</span>
              <span className="font-black text-xl tracking-tight text-teal-400 ml-1">MedReq</span>
              <span className="text-[10px] text-zinc-400 ml-2 font-mono hidden sm:inline-block border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded-full">Hospital OS</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
            <a href="#problem" className="hover:text-zinc-200 transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-zinc-200 transition-colors">How It Works</a>
            <a href="#flow" className="hover:text-zinc-200 transition-colors">Approval Chain</a>
            <Link href="/inventory" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
              <span>Stores & CSV</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login"
              className="text-xs font-bold text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 text-xs font-black rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1.5 active:scale-95"
            >
              <span>Launch Workstation</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: The Bold Value Proposition */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-20 text-center">
        
        {/* Release badge */}
        <div className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900/80 rounded-full px-4 py-1.5 mb-8 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping"></span>
          <span className="text-xs font-semibold text-zinc-300">
            AMACREST Hospital & Maternity · Digital Requisition & Approval System
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
          Zero Paper Requisitions. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
            100% Financial & Clinical Control.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-normal">
          End the operational chaos of paper requisition forms, unverified cash requests, lost purchase memos, and delayed patient treatments across wards, pharmacy, laboratories, and transport.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-sm rounded-2xl transition-all shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Enter Staff Portal & Raise Requisition</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/hod"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Stethoscope size={16} className="text-teal-400" />
            <span>HOD Approval Desk</span>
          </Link>

          <Link
            href="/finance"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <DollarSign size={16} className="text-emerald-400" />
            <span>CA & Finance Control</span>
          </Link>
        </div>

        {/* Live Hero Mockup / Command Center Preview */}
        <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 sm:p-4 backdrop-blur-xl shadow-2xl relative text-left">
          
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 px-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="text-xs font-mono text-zinc-400 ml-2">AMACREST Hospital Enterprise Gateway · Live Requisition Pipeline</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              <span>12 Hospital Units Active</span>
            </div>
          </div>

          {/* Interactive Simulation Strip inside the mockup */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">
            
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">1. Instant Staff Request</span>
                <p className="font-bold text-sm text-zinc-200 mt-1">Ambulance Tyres & Oil</p>
                <p className="text-xs text-zinc-500">Malam Ibrahim (Driver)</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-900 pt-2 text-xs">
                <span className="font-mono text-zinc-400">₦246,000</span>
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-bold">Priority STAT</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">2. HOD Verification</span>
                <p className="font-bold text-sm text-zinc-200 mt-1">Dr. Eze (Pharmacy HOD)</p>
                <p className="text-xs text-zinc-500">Paracetamol Infusion 1000mg</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-900 pt-2 text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={12}/> HOD Approved</span>
                <span className="text-zinc-500 text-[11px]">08:22 AM</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">3. Finance Budget Lock</span>
                <p className="font-bold text-sm text-zinc-200 mt-1">Mrs. Grace Obi (CA)</p>
                <p className="text-xs text-zinc-500">Transport Budget Code #012</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-900 pt-2 text-xs">
                <span className="text-teal-300 font-mono">₦590,000 Left</span>
                <span className="text-[10px] text-zinc-500">Within Cap</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">4. Final Disbursement</span>
                <p className="font-bold text-sm text-zinc-200 mt-1">Dispatched / Issued</p>
                <p className="text-xs text-zinc-500">Receipt Auto-Retired</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-900 pt-2 text-xs">
                <span className="text-zinc-400 text-[10px] font-mono">AUDIT-HASH #994</span>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold">Closed</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The Pain Point Matrix (Why the Chartered Accountant Demanded This) */}
      <section id="problem" className="py-20 border-t border-zinc-850 bg-zinc-950/90 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
              The Reality of Paper in Hospitals
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              Why Manual Requisitions Cripple Hospital Operations
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-3">
              When doctors, nurses, and staff use paper memos, the hospital bleeds money, loses time, and risks patient lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pain Point 1 */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold mb-4">
                <Clock size={20} />
              </div>
              <h3 className="font-bold text-base text-white">The "Desk Bottleneck" Delay</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                A surgical nurse or driver writes a paper requisition. If the HOD or Director is in theatre or on ward rounds, the paper sits on their desk for 48 hours. Surgeries are delayed, ambulances grounded.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-teal-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>MedReq Solution: Instant 1-click approvals from phone</span>
              </div>
            </div>

            {/* Pain Point 2 */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-4">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-bold text-base text-white">Blind Spending & Budget Leaks</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Management approves cash requests without knowing how much budget remains for that department this month. By month-end, the CA discovers ₦4M in unbudgeted expenditures.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-teal-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>MedReq Solution: Real-time budget lock before submission</span>
              </div>
            </div>

            {/* Pain Point 3 */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-4">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="font-bold text-base text-white">Lost Forms & Audit Nightmares</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Paper slips get lost or damaged by hospital spills. When external auditors or NHIA arrive, files are missing and proof of purchase is incomplete.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-teal-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>MedReq Solution: Permanent timestamped digital audit log</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Bento Box Architecture: How MedReq Solves It End-to-End */}
      <section id="solution" className="py-20 border-t border-zinc-800 bg-zinc-950 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
              World-Class Hospital Operating System
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              One Unified System Across All Departments
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-3">
              From clinical wards and pharmacy to drivers, security, janitorial, and executive accounting.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Box 1 (Span 2) */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-teal-400 tracking-wider">Dual Pathway Engine</span>
                <h3 className="text-xl font-black text-white mt-1">Split Routing: Material Consumables vs. Financial Outflow</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                  The system automatically knows whether an item exists in the central hospital warehouse (Materials) or requires cash out of the hospital bank account (External PO / Cash Disbursement).
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-bold text-emerald-400">📦 Store Materials:</span>
                  <p className="text-zinc-500 mt-0.5">Direct issue from warehouse. No cash disbursed.</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-bold text-amber-400">💵 Cash PO:</span>
                  <p className="text-zinc-500 mt-0.5">Budget code check ➔ Accounts Payable sign-off.</p>
                </div>
              </div>
            </div>

            {/* Box 2 */}
            <div className="p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-purple-400 tracking-wider">Bulk Data Onboarding</span>
                <h3 className="text-xl font-black text-white mt-1">CSV Batch Upload for Stores</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Storekeepers upload their opening inventory in Excel CSV format with zero manual retyping.
                </p>
              </div>
              <Link href="/inventory" className="mt-6 text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
                <span>Explore Store Register</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Box 3 */}
            <div className="p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">Mobile-First</span>
                <h3 className="text-xl font-black text-white mt-1">Smartphones & Ward Tablets</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Nurses in scrubs and drivers in fleet vehicles raise requests in 45 seconds right from their smartphones.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-zinc-400">
                <Smartphone size={16} className="text-teal-400" />
                <span>Responsive & PWA Ready</span>
              </div>
            </div>

            {/* Box 4 (Span 2) */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Chartered Accountant Suite</span>
                <h3 className="text-xl font-black text-white mt-1">Departmental Budgets & 100% Audit Traceability</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                  Every requisition is stamped with the user, time, HOD approval note, and financial ledger code. Instant one-click Excel and PDF board reports.
                </p>
              </div>
              <Link href="/finance" className="mt-6 text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                <span>View Finance Control Center</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Direct Launch Call-to-Action */}
      <section className="py-20 bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-zinc-800 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to present to the Hospital Board?
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Log in as any hospital role to test the complete automated requisition cycle from start to finish.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-sm rounded-2xl transition-all shadow-xl shadow-teal-500/25 flex items-center gap-2"
            >
              <span>Go to Staff & HOD Login Terminal</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-6 text-center text-xs text-zinc-500 relative z-10">
        AMACREST HOSPITAL & MATERNITY · MedReq Enterprise Requisition Platform · Built for Executive Board Approval
      </footer>

    </div>
  );
}
