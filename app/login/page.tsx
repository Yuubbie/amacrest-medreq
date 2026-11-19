'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveStoredUser } from '@/lib/storage';
import { 
  Building2, Lock, ArrowRight, ShieldCheck, UserCheck, 
  Heart, Activity, CheckCircle2, ChevronRight,
  Sparkles, KeyRound, Award, Users, FileText, Check, DollarSign, Package
} from 'lucide-react';

interface StaffProfile {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  unit: string;
  roleType: 'staff' | 'supervisor' | 'finance' | 'coordinator' | 'store';
  destination: string;
  avatar: string;
  badge: string;
  badgeColor: string;
}

const requesterProfiles: StaffProfile[] = [
  {
    id: 'staff-nurse',
    name: 'Nurse Hauwa Bello',
    roleTitle: 'Staff Nurse (Post-Op Ward)',
    department: 'Clinicals',
    unit: 'Nursing',
    roleType: 'staff',
    destination: '/new-request',
    avatar: 'HB',
    badge: 'Post-Op Surgical Care',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 'staff-kitchen',
    name: 'Mrs. Maryam Kabir',
    roleTitle: 'Catering & Kitchen Lead',
    department: 'Admin',
    unit: 'Kitchen',
    roleType: 'staff',
    destination: '/new-request',
    avatar: 'MK',
    badge: 'Admin / Patient Kitchen',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'staff-hostel',
    name: 'Mr. Samuel Danladi',
    roleTitle: 'Hostel & Patient Logistics Officer',
    department: 'Clinicals',
    unit: 'Hostel',
    roleType: 'staff',
    destination: '/new-request',
    avatar: 'SD',
    badge: 'Patient Transport Logistics',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'staff-edu',
    name: 'Malam Ibrahim Musa',
    roleTitle: 'Social Assistance & Education Officer',
    department: 'Clinicals',
    unit: 'Education Welfare',
    roleType: 'staff',
    destination: '/new-request',
    avatar: 'IM',
    badge: 'Child Schooling & Welfare',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'staff-fleet',
    name: 'Malam Sule Tanko',
    roleTitle: 'Lead Ambulance & Fleet Driver',
    department: 'Facility',
    unit: 'Logistics/Fleet',
    roleType: 'staff',
    destination: '/new-request',
    avatar: 'ST',
    badge: 'Fleet Fuel & Vehicle Repairs',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
  },
];

const supervisorProfiles: StaffProfile[] = [
  {
    id: 'supv-admin',
    name: 'Mrs. Stella Eze',
    roleTitle: 'Head of Hospital Administration',
    department: 'Admin',
    unit: 'Admin',
    roleType: 'supervisor',
    destination: '/hod?dept=Admin',
    avatar: 'SE',
    badge: 'Admin & Kitchen Supervisor',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    id: 'supv-clinicals',
    name: 'Dr. Grace Mshelia',
    roleTitle: 'Director of Clinical Services',
    department: 'Clinicals',
    unit: 'Clinicals',
    roleType: 'supervisor',
    destination: '/hod?dept=Clinicals',
    avatar: 'GM',
    badge: 'Clinicals & Pharmacy Desk',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
  },
  {
    id: 'supv-facility',
    name: 'Mr. Patrick Adaeze',
    roleTitle: 'Head of Facility & Operations',
    department: 'Facility',
    unit: 'Facility',
    roleType: 'supervisor',
    destination: '/hod?dept=Facility',
    avatar: 'PA',
    badge: 'Facility & Fleet Supervisor',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200',
  },
  {
    id: 'supv-hr',
    name: 'Mrs. Zainab Aliyu',
    roleTitle: 'Head of Human Resources',
    department: 'Human Resources',
    unit: 'Human Resources',
    roleType: 'supervisor',
    destination: '/hod?dept=HR',
    avatar: 'ZA',
    badge: 'HR & Staff Welfare Desk',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
  },
];

const leadershipProfiles: StaffProfile[] = [
  {
    id: 'finance-head',
    name: 'Mr. AY, FCA',
    roleTitle: 'Head of Finance & Chartered Accountant',
    department: 'Finance',
    unit: 'Finance',
    roleType: 'finance',
    destination: '/finance',
    avatar: 'AY',
    badge: 'Level 3: Head of Finance & CA',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  },
  {
    id: 'coordinator-prog',
    name: 'Dr. Emmanuel Bawa',
    roleTitle: 'Programme Coordinator',
    department: 'Executive',
    unit: 'Operations',
    roleType: 'coordinator',
    destination: '/hod?role=coordinator',
    avatar: 'EB',
    badge: 'Level 4: Programme Coordinator',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  {
    id: 'coordinator-national',
    name: 'Dr. Usman Sani, FWACS',
    roleTitle: 'National Coordinator (NANI Leadership)',
    department: 'Executive',
    unit: 'National Office',
    roleType: 'coordinator',
    destination: '/hod?role=national',
    avatar: 'US',
    badge: 'Level 5: National Directorate',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
  },
  {
    id: 'store-officer',
    name: 'Mr. Babatunde Lawal',
    roleTitle: 'Storekeeper & Inventory Officer',
    department: 'Facility',
    unit: 'Stores',
    roleType: 'store',
    destination: '/inventory',
    avatar: 'BL',
    badge: 'Internal Store Issues',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'requester' | 'supervisor' | 'finance' | 'coordinator'>('requester');
  const [selectedRequester, setSelectedRequester] = useState<StaffProfile>(requesterProfiles[0]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<StaffProfile>(supervisorProfiles[0]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (userToLogin: StaffProfile) => {
    setIsLoggingIn(true);
    saveStoredUser({
      id: userToLogin.id,
      name: userToLogin.name,
      roleTitle: userToLogin.roleTitle,
      department: userToLogin.department,
      unit: userToLogin.unit,
      roleType: userToLogin.roleType,
      avatar: userToLogin.avatar,
      badge: userToLogin.badge,
    });
    setTimeout(() => {
      router.push(userToLogin.destination);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-teal-600 selection:text-white">
      
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-black shadow-sm">
              <Heart size={20} strokeWidth={2.5} className="text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-teal-700">NANI</span>
                <span className="font-black text-xl tracking-tight text-slate-900">ReqFlow</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium block">Noma Aid Nigeria Initiative</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm">
            <ShieldCheck size={15} className="text-teal-700" />
            <span>Dedicated Role-Based Portals</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-4xl mx-auto px-4 py-12 w-full">
        
        {/* Banner Title */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold font-mono tracking-widest uppercase text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            SECURE REQUISITION & AUDIT ACCESS
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
            Sign In to Your Operational Station
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Select your functional role below. Each portal takes you directly to your assigned workspace.
          </p>
        </div>

        {/* Portal Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/80">
          {[
            { id: 'requester', label: '1. Staff Requester', icon: FileText, desc: 'Raise vouchers' },
            { id: 'supervisor', label: '2. Line Supervisor', icon: ShieldCheck, desc: 'L2 Approval' },
            { id: 'finance', label: '3. Finance Head', icon: DollarSign, desc: 'Mr. AY, FCA' },
            { id: 'coordinator', label: '4. Leadership', icon: Award, desc: 'Coordinator' },
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3 px-3 rounded-xl text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md border border-slate-200 ring-2 ring-teal-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon size={14} className={isActive ? 'text-teal-700' : 'text-slate-500'} />
                  <span className="font-bold text-xs">{t.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">{t.desc}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: STAFF REQUESTER PORTAL ── */}
        {activeTab === 'requester' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-mono">
                  Level 1 · Originating Personnel
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  Staff Requester Portal
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Signing in as a requester opens the <strong>Electronic Requisition Engine (`/new-request`)</strong> directly.
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Your Department Unit / Staff Identity:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {requesterProfiles.map(staff => {
                  const isSelected = selectedRequester.id === staff.id;
                  return (
                    <div
                      key={staff.id}
                      onClick={() => setSelectedRequester(staff)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-teal-50/70 border-teal-500 shadow-sm ring-1 ring-teal-500'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono ${
                          isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {staff.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">{staff.name}</p>
                          <p className="text-[11px] text-slate-500">{staff.roleTitle}</p>
                          <span className="text-[10px] font-mono text-teal-700 font-bold block mt-0.5">
                            {staff.department} · {staff.unit}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => handleLogin(selectedRequester)}
              disabled={isLoggingIn}
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Sign In as {selectedRequester.name} & Go Straight to Requisition Form</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── TAB 2: LINE SUPERVISORS PORTAL ── */}
        {activeTab === 'supervisor' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-mono">
                  Level 2 · Departmental Line Authority
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  Line Supervisor Approval Desk
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Signing in takes you straight to your dedicated departmental review queue.
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Department Supervisor:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {supervisorProfiles.map(supv => {
                  const isSelected = selectedSupervisor.id === supv.id;
                  return (
                    <div
                      key={supv.id}
                      onClick={() => setSelectedSupervisor(supv)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-teal-50/70 border-teal-500 shadow-sm ring-1 ring-teal-500'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono ${
                          isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {supv.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">{supv.name}</p>
                          <p className="text-[11px] text-slate-500">{supv.roleTitle}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border mt-1 inline-block ${supv.badgeColor}`}>
                            {supv.badge}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => handleLogin(selectedSupervisor)}
              disabled={isLoggingIn}
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Sign In as {selectedSupervisor.name} & Open Supervisor Desk</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── TAB 3: FINANCE & GRANTS HEAD (MR. AY, FCA) ── */}
        {activeTab === 'finance' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                  Level 3 · Financial Governance & Grants
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  Finance Directorate Desk
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifies budget line availability, locks donor grants, issues Payment Vouchers (PV), and releases funds.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-lg font-black font-mono shadow-md">
                  AY
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">Mr. AY, FCA</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      CHARTERED ACCOUNTANT
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Head of Finance & Grants Manager</p>
                  <p className="text-[11px] font-mono text-emerald-800 mt-1">Official Digital Stamp: AY/FIN/2026</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleLogin(leadershipProfiles[0])}
              disabled={isLoggingIn}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-800/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Sign In as Mr. AY, FCA & Open Finance Desk</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── TAB 4: EXECUTIVE & COORDINATOR DESK ── */}
        {activeTab === 'coordinator' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 font-mono">
                  Level 4 & 5 · Executive Leadership
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  Executive Authorization Desk
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Programme and National authorization for expenditures, capital projects, and board compliance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Dr. Emmanuel Bawa */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white font-bold text-xs flex items-center justify-center font-mono">
                      EB
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Dr. Emmanuel Bawa</h4>
                      <p className="text-[11px] text-slate-500">Programme Coordinator</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Level 4 executive sign-off for operational & surgical disbursements.
                  </p>
                </div>
                <button
                  onClick={() => handleLogin(leadershipProfiles[1])}
                  className="mt-4 w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Sign In as Programme Coordinator</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Dr. Usman Sani */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-700 text-white font-bold text-xs flex items-center justify-center font-mono">
                      US
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Dr. Usman Sani, FWACS</h4>
                      <p className="text-[11px] text-slate-500">National Coordinator (Directorate)</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Level 5 board-level ratification for high-value items (&gt;₦500,000).
                  </p>
                </div>
                <button
                  onClick={() => handleLogin(leadershipProfiles[2])}
                  className="mt-4 w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Sign In as National Coordinator</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>NOMA AID NIGERIA INITIATIVE (NANI) · Procurement & Accountability Gateway · 2026</p>
      </footer>

    </div>
  );
}
