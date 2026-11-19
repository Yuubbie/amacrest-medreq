'use client';

import Link from 'next/link';
import { 
  ArrowRight, CheckCircle2, Clock, 
  FileText, Heart, Building2, 
  Layers, ShieldCheck, Activity, FileSpreadsheet,
  AlertTriangle, DollarSign, Package, Check, Smartphone,
  Users, Globe, TrendingUp, Zap
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950 relative overflow-hidden font-sans">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-teal-500/8 blur-[180px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-emerald-500/5 blur-[180px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-teal-600/8 blur-[160px] rounded-full pointer-events-none"></div>
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '52px 52px'
        }}
      ></div>

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/30 flex items-center justify-center shadow-lg shadow-teal-500/10">
              <Heart size={18} className="text-teal-400" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-teal-400">NANI</span>
              <span className="font-black text-sm tracking-tight text-white ml-1">ReqFlow</span>
              <div className="text-[9px] text-zinc-500 font-mono leading-none mt-0.5">Noma Aid Nigeria Initiative · Procurement OS</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
            <a href="#problem" className="hover:text-zinc-200 transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-zinc-200 transition-colors">How It Works</a>
            <a href="#flow" className="hover:text-zinc-200 transition-colors">Approval Chain</a>
            <Link href="/reports" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
              <TrendingUp size={13} />
              <span>Donor Reports</span>
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
              <span>Launch Portal</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
        
        {/* NGO Badge */}
        <div className="inline-flex items-center gap-2.5 border border-teal-500/20 bg-teal-500/5 rounded-full px-5 py-2 mb-10 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping"></span>
          <span className="text-xs font-semibold text-zinc-300">
            NOMA AID NIGERIA INITIATIVE (NANI) · Digital Requisition & Procurement System
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.07]">
          One System. Every Request.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
            Zero Paper. Full Accountability.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
          Built exclusively for NANI's noma treatment operations — from clinical pharmacy and patient transport to facility management and donor grant reporting. 
          Every requisition, every approval, every naira — tracked.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-sm rounded-2xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Enter Staff Portal</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/hod"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} className="text-teal-400" />
            <span>Supervisor Approval Desk</span>
          </Link>

          <Link
            href="/finance"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <DollarSign size={16} className="text-emerald-400" />
            <span>Finance & Donor Suite</span>
          </Link>
        </div>

        {/* Live Command Strip */}
        <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 sm:p-3 backdrop-blur-xl shadow-2xl relative text-left">
          
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 px-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/70"></div>
              <span className="text-xs font-mono text-zinc-400 ml-2">NANI ReqFlow · Live Requisition Pipeline · 5 Departments Active</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              <span>12 Requests In Pipeline</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3">
            
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-teal-400">1 · Requester</span>
                <p className="font-bold text-xs text-zinc-200 mt-1">Surgical Dressings</p>
                <p className="text-[10px] text-zinc-500">Nurse Hauwa · Nursing Unit</p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px]">
                <span className="font-mono text-zinc-400">₦270,000</span>
                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-bold">Priority</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">2 · Supervisor</span>
                <p className="font-bold text-xs text-zinc-200 mt-1">Sr. Blessing Dogo</p>
                <p className="text-[10px] text-zinc-500">Head of Nursing · Clinicals</p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-900 text-[10px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={10}/> Approved 09:30</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-teal-500/20 flex flex-col justify-between ring-1 ring-teal-500/10">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">3 · Finance</span>
                <p className="font-bold text-xs text-zinc-200 mt-1">Mrs. Bilkisu Umar</p>
                <p className="text-[10px] text-zinc-500">HN-2026-SURG-Q4</p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px]">
                <span className="text-teal-300 font-mono">₦2.1M Left</span>
                <span className="text-[9px] text-amber-400 font-bold">Reviewing</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between opacity-60">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-orange-400">4 · Coordinator</span>
                <p className="font-bold text-xs text-zinc-200 mt-1">Dr. Emmanuel Bawa</p>
                <p className="text-[10px] text-zinc-500">Programme Coordinator</p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-900 text-[10px]">
                <span className="text-zinc-500 font-bold">Awaiting Finance</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between opacity-40">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400">5 · Nat. Coordinator</span>
                <p className="font-bold text-xs text-zinc-200 mt-1">National Office</p>
                <p className="text-[10px] text-zinc-500">High-value only</p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-900 text-[10px]">
                <span className="text-zinc-600 font-bold">Standby</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="border-y border-zinc-800/80 bg-zinc-900/30 py-10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Departments Covered', value: '5', sub: 'Facility, Finance, Clinicals, Admin, HR' },
            { label: 'Approval Levels', value: '5', sub: 'From Requester to National Coordinator' },
            { label: 'Donor Grant Codes', value: '5', sub: 'ECHO, MSF & bilateral grants tracked' },
            { label: 'Processing Time', value: '<2h', sub: 'vs. 48h+ on paper' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-teal-400">{s.value}</div>
              <div className="text-xs font-bold text-white mt-1">{s.label}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pain Point Section ── */}
      <section id="problem" className="py-24 bg-zinc-950/90 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
              The Reality of Paper in a Donor-Funded NGO
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-5 tracking-tight">
              Why Manual Requisitions Cripple NANI's Operations
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-3">
              When clinical staff, drivers, and administrators use paper memos, donor funds are mismanaged, audits fail, and patients suffer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock size={20} />,
                color: 'rose',
                title: 'The "Desk Bottleneck" Delay',
                body: 'A nurse writes a request for surgical dressings. If the supervisor is in theatre, the paper sits for 48+ hours. Post-surgical noma patients go without proper wound care.',
                fix: 'ReqFlow: One-click approval from any device, any time',
              },
              {
                icon: <AlertTriangle size={20} />,
                color: 'amber',
                title: 'Donor Grant Leakage',
                body: 'Finance approves spending without knowing the grant code or remaining balance. By month end, ECHO audit finds ₦4M in untracked expenditure across grant lines.',
                fix: 'ReqFlow: Every request tagged to donor grant code in real-time',
              },
              {
                icon: <FileSpreadsheet size={20} />,
                color: 'blue',
                title: 'Transport Records Are a Disaster',
                body: 'Patient transport from states like Borno and Adamawa is tracked on paper. Names, state rates, and totals are manually calculated — errors cause under/over payment.',
                fix: 'ReqFlow: State-based auto-rating with auto-totalling per passenger',
              },
            ].map((p) => (
              <div key={p.title} className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all">
                <div className={`w-10 h-10 rounded-xl bg-${p.color}-500/10 text-${p.color}-400 flex items-center justify-center mb-4`}>
                  {p.icon}
                </div>
                <h3 className="font-bold text-base text-white">{p.title}</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{p.body}</p>
                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-teal-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={12} />
                  <span>{p.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution Bento ── */}
      <section id="solution" className="py-24 border-t border-zinc-800 bg-zinc-950 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
              Purpose-Built for NANI's NGO Operations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-5 tracking-tight">
              One Unified Platform Across All 5 Departments
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-3">
              From clinical pharmacy and hostel transport to facility janitorial, kitchen, and HR reimbursements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all">
              <span className="text-xs font-bold uppercase text-teal-400 tracking-wider">Special: Hostel Transport Engine</span>
              <h3 className="text-xl font-black text-white mt-1">Patient & Caregiver Transport — State-Rated & Auto-Totalled</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Every state has a fixed transport rate. Hostel staff select incoming or discharge, choose patient or caregiver, pick the state — the system auto-calculates per person and grand total. 20+ names on one requisition with zero manual arithmetic.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-bold text-teal-400">🚌 Incoming Transport:</span>
                  <p className="text-zinc-500 mt-0.5">Patient pickup from state → NANI Centre. Per-state rate auto-applied.</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-bold text-amber-400">🏠 Discharge Transport:</span>
                  <p className="text-zinc-500 mt-0.5">Post-treatment return home. Different rate per state. Auto-summed.</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all">
              <span className="text-xs font-bold uppercase text-purple-400 tracking-wider">5-Level Approval Chain</span>
              <h3 className="text-xl font-black text-white mt-1">Digital Signatures at Every Level</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Requester → Supervisor → Finance → Coordinator → National Coordinator. Each approval stamps a digital signature with name, role, and timestamp.
              </p>
              <Link href="/hod" className="mt-6 text-xs font-bold text-purple-400 hover:underline flex items-center gap-1">
                <span>View Approval Desk</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all">
              <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">Internal Store Issue</span>
              <h3 className="text-xl font-black text-white mt-1">Separate Store Pathway</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Store issues are tracked independently from cash requisitions. The storekeeper issues items, GRN is recorded, stock is decremented automatically.
              </p>
              <Link href="/inventory" className="mt-6 text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                <span>Explore Store Register</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all">
              <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Donor Grant Accountability Suite</span>
              <h3 className="text-xl font-black text-white mt-1">Monthly, Quarterly & Annual Reports with Projections</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Every requisition is mapped to a donor grant code (e.g. HN-2026-SURG-Q4). Finance can generate ECHO/MSF-ready expenditure reports in one click. Budget forecasting and variance analysis built in.
              </p>
              <Link href="/reports" className="mt-6 text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                <span>View Donor Reporting Suite</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5-Level Flow Visual ── */}
      <section id="flow" className="py-24 border-t border-zinc-800 bg-zinc-950/80 relative z-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
            5-Level Approval Chain
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-5 mb-12 tracking-tight">
            From Requester to National Coordinator
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {[
              { n: '1', label: 'Requester', sub: 'Submits request', color: 'teal' },
              { n: '2', label: 'Supervisor', sub: 'Unit / Dept. Head', color: 'purple' },
              { n: '3', label: 'Finance', sub: 'Budget verification', color: 'blue' },
              { n: '4', label: 'Coordinator', sub: 'Programme approval', color: 'orange' },
              { n: '5', label: 'Nat. Coordinator', sub: 'High-value only', color: 'rose' },
            ].map((step, i) => (
              <div key={step.n} className="flex flex-col md:flex-row items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full border-2 border-${step.color}-500/40 bg-${step.color}-500/10 flex items-center justify-center`}>
                    <span className={`text-lg font-black text-${step.color}-400`}>{step.n}</span>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-black text-white">{step.label}</div>
                    <div className="text-[10px] text-zinc-500">{step.sub}</div>
                  </div>
                </div>
                {i < 4 && (
                  <ArrowRight size={20} className="text-zinc-700 mx-4 mt-0 md:-mt-6 rotate-90 md:rotate-0" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-10 text-xs text-zinc-500 max-w-2xl mx-auto">
            Each level issues a digital signature stamp (Name · Role · Timestamp). High-value requests automatically escalate to the National Coordinator. Every step is permanently recorded in the audit trail.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-zinc-800 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 border border-teal-500/20 bg-teal-500/5 rounded-full px-4 py-1.5 mb-6">
            <Heart size={12} className="text-teal-400" />
            <span className="text-xs text-zinc-300 font-semibold">Healing Noma. One Transparent Requisition at a Time.</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to present to the<br />NANI Leadership & Donors?
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Log in as any NANI role to walk through the full automated requisition cycle — from staff request to national coordinator approval.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-sm rounded-2xl transition-all shadow-xl shadow-teal-500/25 flex items-center gap-2 active:scale-95"
            >
              <span>Enter NANI Staff Portal</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/reports"
              className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm rounded-2xl transition-all flex items-center gap-2"
            >
              <TrendingUp size={16} className="text-emerald-400" />
              <span>Donor Reports & Forecasting</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-6 text-center text-xs text-zinc-500 relative z-10">
        <div className="font-bold text-zinc-400">NOMA AID NIGERIA INITIATIVE (NANI)</div>
        <div className="mt-1">NANI ReqFlow · Digital Procurement & Requisition System · Built for Operational Excellence & Donor Accountability</div>
      </footer>

    </div>
  );
}
