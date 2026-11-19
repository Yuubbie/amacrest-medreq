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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white relative overflow-hidden font-sans">
      
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shadow-sm">
              <Heart size={18} className="text-teal-700" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-teal-700">NANI</span>
              <span className="font-black text-sm tracking-tight text-slate-900 ml-1">ReqFlow</span>
              <div className="text-[9px] text-slate-500 font-mono leading-none mt-0.5">Noma Aid Nigeria Initiative · Procurement OS</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#problem" className="hover:text-teal-700 transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-teal-700 transition-colors">How It Works</a>
            <a href="#flow" className="hover:text-teal-700 transition-colors">Approval Chain</a>
            <Link href="/reports" className="hover:text-teal-700 transition-colors flex items-center gap-1.5">
              <TrendingUp size={13} />
              <span>Donor Reports</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <span>Launch Portal</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-16 sm:pt-24 sm:pb-20 text-center">
        
        {/* NGO Badge */}
        <div className="inline-flex items-center gap-2.5 border border-teal-200 bg-teal-50 rounded-full px-5 py-2 mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-teal-600 animate-ping"></span>
          <span className="text-xs font-semibold text-teal-900">
            NOMA AID NIGERIA INITIATIVE (NANI) · Digital Requisition & Procurement System
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.07]">
          One System. Every Request.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800">
            Zero Paper. Full Accountability.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Built exclusively for NANI's noma treatment operations — from clinical pharmacy and patient transport to facility management and donor grant reporting. 
          Every requisition, every approval, every naira — tracked.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-2xl transition-all shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Enter Staff Portal</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/hod"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <ShieldCheck size={16} className="text-teal-700" />
            <span>Supervisor Approval Desk</span>
          </Link>

          <Link
            href="/finance"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <DollarSign size={16} className="text-emerald-700" />
            <span>Finance & Donor Suite</span>
          </Link>
        </div>

        {/* Live Command Strip */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-2 sm:p-3 shadow-md relative text-left">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-mono text-slate-500 ml-2">NANI ReqFlow · Live Requisition Pipeline · 5 Departments Active</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
              <span>12 Requests In Pipeline</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3">
            
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-teal-700">1 · Requester</span>
                <p className="font-bold text-xs text-slate-900 mt-1">Surgical Dressings</p>
                <p className="text-[10px] text-slate-500">Nurse Hauwa · Nursing Unit</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                <span className="font-mono text-slate-700 font-bold">₦270,000</span>
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded font-bold">Priority</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-700">2 · Supervisor</span>
                <p className="font-bold text-xs text-slate-900 mt-1">Sr. Blessing Dogo</p>
                <p className="text-[10px] text-slate-500">Head of Nursing · Clinicals</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[10px]">
                <span className="text-emerald-700 font-bold flex items-center gap-1"><Check size={10}/> Approved 09:30</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-teal-200 flex flex-col justify-between ring-1 ring-teal-200">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700">3 · Finance</span>
                <p className="font-bold text-xs text-slate-900 mt-1">Mr. AY, FCA</p>
                <p className="text-[10px] text-slate-500">Head of Finance · CA</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                <span className="text-teal-700 font-mono font-bold">₦2.1M Left</span>
                <span className="text-[9px] text-amber-700 font-bold">Reviewing</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between opacity-75">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-orange-700">4 · Coordinator</span>
                <p className="font-bold text-xs text-slate-900 mt-1">Dr. Emmanuel Bawa</p>
                <p className="text-[10px] text-slate-500">Programme Coordinator</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[10px]">
                <span className="text-slate-500 font-bold">Awaiting Finance</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between opacity-50">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700">5 · Nat. Coordinator</span>
                <p className="font-bold text-xs text-slate-900 mt-1">National Office</p>
                <p className="text-[10px] text-slate-500">High-value only</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[10px]">
                <span className="text-slate-500 font-bold">Standby</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="border-y border-slate-200 bg-white py-10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Departments Covered', value: '5', sub: 'Facility, Finance, Clinicals, Admin, HR' },
            { label: 'Approval Levels', value: '5', sub: 'From Requester to National Coordinator' },
            { label: 'Donor Grant Codes', value: '5', sub: 'ECHO, MSF & bilateral grants tracked' },
            { label: 'Processing Time', value: '<2h', sub: 'vs. 48h+ on paper' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-teal-700">{s.value}</div>
              <div className="text-xs font-bold text-slate-900 mt-1">{s.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pain Point Section ── */}
      <section id="problem" className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
              The Reality of Paper in a Donor-Funded NGO
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-5 tracking-tight">
              Why Manual Requisitions Cripple NANI's Operations
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              When clinical staff, drivers, and administrators use paper memos, donor funds are mismanaged, audits fail, and patients suffer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock size={20} />,
                color: 'text-rose-600 bg-rose-50 border-rose-200',
                title: 'The "Desk Bottleneck" Delay',
                body: 'A nurse writes a request for surgical dressings. If the supervisor is in theatre, the paper sits for 48+ hours. Post-surgical noma patients go without proper wound care.',
                fix: 'ReqFlow: One-click approval from any device, any time',
              },
              {
                icon: <AlertTriangle size={20} />,
                color: 'text-amber-600 bg-amber-50 border-amber-200',
                title: 'Donor Grant Leakage',
                body: 'Finance approves spending without knowing the grant code or remaining balance. By month end, ECHO audit finds ₦4M in untracked expenditure across grant lines.',
                fix: 'ReqFlow: Every request tagged to donor grant code in real-time',
              },
              {
                icon: <FileSpreadsheet size={20} />,
                color: 'text-blue-600 bg-blue-50 border-blue-200',
                title: 'Transport Records Are a Disaster',
                body: 'Patient transport from states like Borno and Adamawa is tracked on paper. Names, state rates, and totals are manually calculated — errors cause under/over payment.',
                fix: 'ReqFlow: State-based auto-rating with auto-totalling per passenger',
              },
            ].map((p) => (
              <div key={p.title} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${p.color}`}>
                  {p.icon}
                </div>
                <h3 className="font-bold text-base text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.body}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-teal-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={12} />
                  <span>{p.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution Bento ── */}
      <section id="solution" className="py-24 border-t border-slate-200 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Purpose-Built for NANI's NGO Operations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-5 tracking-tight">
              One Unified Platform Across All 5 Departments
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              From clinical pharmacy and hostel transport to facility janitorial, kitchen, and HR reimbursements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="md:col-span-2 p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
              <span className="text-xs font-bold uppercase text-teal-700 tracking-wider">Special: Hostel Transport Engine</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Patient & Caregiver Transport — State-Rated & Auto-Totalled</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Every state has a fixed transport rate. Hostel staff select incoming or discharge, choose patient or caregiver, pick the state — the system auto-calculates per person and grand total. 20+ names on one requisition with zero manual arithmetic.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold text-teal-700">🚌 Incoming Transport:</span>
                  <p className="text-slate-500 mt-0.5">Patient pickup from state → NANI Centre. Per-state rate auto-applied.</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold text-amber-700">🏠 Discharge Transport:</span>
                  <p className="text-slate-500 mt-0.5">Post-treatment return home. Different rate per state. Auto-summed.</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
              <span className="text-xs font-bold uppercase text-purple-700 tracking-wider">5-Level Approval Chain</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Digital Signatures at Every Level</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Requester → Supervisor → Finance → Coordinator → National Coordinator. Each approval stamps a digital signature with name, role, and timestamp.
              </p>
              <Link href="/hod" className="mt-6 text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
                <span>View Approval Desk</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
              <span className="text-xs font-bold uppercase text-amber-700 tracking-wider">Internal Store Issue</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Separate Store Pathway</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Store issues are tracked independently from cash requisitions. The storekeeper issues items, GRN is recorded, stock is decremented automatically.
              </p>
              <Link href="/inventory" className="mt-6 text-xs font-bold text-amber-700 hover:underline flex items-center gap-1">
                <span>Explore Store Register</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="md:col-span-2 p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
              <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Donor Grant Accountability Suite</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Monthly, Quarterly & Annual Reports with Projections</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Every requisition is mapped to a donor grant code (e.g. HN-2026-SURG-Q4). Finance can generate ECHO/MSF-ready expenditure reports in one click. Budget forecasting and variance analysis built in.
              </p>
              <Link href="/reports" className="mt-6 text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                <span>View Donor Reporting Suite</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5-Level Flow Visual ── */}
      <section id="flow" className="py-24 border-t border-slate-200 bg-slate-50 relative z-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            5-Level Approval Chain
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-5 mb-12 tracking-tight">
            From Requester to National Coordinator
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {[
              { n: '1', label: 'Requester', sub: 'Submits request', color: 'border-teal-300 bg-teal-50 text-teal-800' },
              { n: '2', label: 'Supervisor', sub: 'Unit / Dept. Head', color: 'border-purple-300 bg-purple-50 text-purple-800' },
              { n: '3', label: 'Finance', sub: 'Mr. AY (Grant Check)', color: 'border-blue-300 bg-blue-50 text-blue-800' },
              { n: '4', label: 'Coordinator', sub: 'Dr. Bawa (Approval)', color: 'border-orange-300 bg-orange-50 text-orange-800' },
              { n: '5', label: 'Nat. Coordinator', sub: 'Dr. Usman (Final Sign)', color: 'border-rose-300 bg-rose-50 text-rose-800' },
            ].map((step, i) => (
              <div key={step.n} className="flex flex-col md:flex-row items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-sm ${step.color}`}>
                    <span className="text-lg font-black">{step.n}</span>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-black text-slate-900">{step.label}</div>
                    <div className="text-[10px] text-slate-500">{step.sub}</div>
                  </div>
                </div>
                {i < 4 && (
                  <ArrowRight size={20} className="text-slate-300 mx-4 mt-0 md:-mt-6 rotate-90 md:rotate-0" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-10 text-xs text-slate-500 max-w-2xl mx-auto">
            Each level issues a digital signature stamp (Name · Role · Timestamp). High-value requests automatically escalate to the National Coordinator. Every step is permanently recorded in the audit trail.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-white border-t border-slate-200 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 border border-teal-200 bg-teal-50 rounded-full px-4 py-1.5 mb-6">
            <Heart size={12} className="text-teal-700" />
            <span className="text-xs text-teal-900 font-semibold">Healing Noma. One Transparent Requisition at a Time.</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Ready to present to the<br />NANI Leadership & Donors?
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Log in as any NANI role to walk through the full automated requisition cycle — from staff request to national coordinator approval.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <span>Enter NANI Staff Portal</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/reports"
              className="px-8 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all flex items-center gap-2"
            >
              <TrendingUp size={16} className="text-emerald-700" />
              <span>Donor Reports & Forecasting</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-6 text-center text-xs text-slate-500 relative z-10">
        <div className="font-bold text-slate-700">NOMA AID NIGERIA INITIATIVE (NANI)</div>
        <div className="mt-1">NANI ReqFlow · Digital Procurement & Requisition System · Built for Operational Excellence & Donor Accountability</div>
      </footer>

    </div>
  );
}