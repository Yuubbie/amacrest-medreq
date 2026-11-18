'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, Lock, ArrowRight, ShieldCheck, UserCheck, 
  Stethoscope, Cross, Activity, CheckCircle2, ChevronRight,
  Sparkles, KeyRound
} from 'lucide-react';

interface PresetUser {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  roleType: 'staff' | 'hod' | 'finance' | 'store' | 'admin';
  destination: string;
  avatar: string;
  badge: string;
  badgeColor: string;
}

const presetUsers: PresetUser[] = [
  // 1. Staff Requesters
  {
    id: 'staff-nurse',
    name: 'Nurse Fatima Aliyu',
    roleTitle: 'Senior Ward Staff Nurse',
    department: 'Nursing (Ward 3)',
    roleType: 'staff',
    destination: '/new-request',
    avatar: 'FA',
    badge: 'Frontline Clinical Staff',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'staff-driver',
    name: 'Malam Ibrahim Musa',
    roleTitle: 'Ambulance Lead Driver',
    department: 'Transport & Logistics (Drivers)',
    roleType: 'staff',
    destination: '/new-request',
    avatar: 'IM',
    badge: 'Fleet & Logistics Staff',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    id: 'staff-pharm',
    name: 'Pharm. Aisha Bello',
    roleTitle: 'Clinical Dispensary Pharmacist',
    department: 'Pharmacy Services',
    roleType: 'staff',
    destination: '/new-request',
    avatar: 'AB',
    badge: 'Dispensary Pharmacist',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  },

  // 2. Departmental Approvers (HODs)
  {
    id: 'hod-pharm',
    name: 'Dr. Chinedu Eze',
    roleTitle: 'Director of Pharmacy Services (HOD)',
    department: 'Pharmacy',
    roleType: 'hod',
    destination: '/hod?dept=Pharmacy',
    avatar: 'CE',
    badge: 'HOD Pharmacy Sign-off',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    id: 'hod-nursing',
    name: 'Matron Beatrice Alao',
    roleTitle: 'Head of Clinical Nursing Services (Matron)',
    department: 'Nursing (Ward 3)',
    roleType: 'hod',
    destination: '/hod?dept=Nursing (Ward 3)',
    avatar: 'BA',
    badge: 'HOD Nursing Sign-off',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    id: 'hod-transport',
    name: 'Malam Ibrahim Musa',
    roleTitle: 'Transport & Fleet Manager (HOD)',
    department: 'Transport & Logistics (Drivers)',
    roleType: 'hod',
    destination: '/hod?dept=Transport & Logistics (Drivers)',
    avatar: 'IM',
    badge: 'HOD Transport Sign-off',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },

  // 3. Central Finance & Board Approvers
  {
    id: 'finance-head',
    name: 'Mrs. Grace Obi, FCA',
    roleTitle: 'Chief Financial Officer & CA',
    department: 'Finance & Accounts',
    roleType: 'finance',
    destination: '/finance',
    avatar: 'GO',
    badge: 'Budget & Disbursement Control',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  {
    id: 'store-keeper',
    name: 'Mr. Babatunde Lawal',
    roleTitle: 'Head of Central Stores & Materials Depot',
    department: 'Stores & Inventory',
    roleType: 'store',
    destination: '/inventory',
    avatar: 'BL',
    badge: 'Stores Issuance & CSV Upload',
    badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  },
  {
    id: 'board-cmd',
    name: 'Dr. Emmanuel Okafor, FWACS',
    roleTitle: 'Chief Medical Director (CMD / Board)',
    department: 'Executive Boardroom',
    roleType: 'admin',
    destination: '/reports',
    avatar: 'EO',
    badge: 'Hospital Board & Audit Suite',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<PresetUser>(presetUsers[0]);
  const [password, setPassword] = useState('••••••••••••');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'staff' | 'hod' | 'finance'>('all');

  const handleLogin = (userToLogin: PresetUser) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      router.push(userToLogin.destination);
    }, 600);
  };

  const filteredUsers = activeFilter === 'all' 
    ? presetUsers 
    : presetUsers.filter(u => u.roleType === activeFilter || (activeFilter === 'finance' && (u.roleType === 'store' || u.roleType === 'admin')));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-teal-500 selection:text-zinc-950 relative overflow-hidden">
      
      {/* Ambient background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Top minimal header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black">
              <Cross size={18} strokeWidth={3} />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white">Amacrest</span>
              <span className="font-black text-lg tracking-tight text-teal-400 ml-1">MedReq</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
            <ShieldCheck size={14} className="text-teal-400" />
            <span>Secure 256-Bit Hospital Enterprise Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Login Interface */}
      <main className="max-w-5xl mx-auto px-4 py-10 w-full flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
        
        {/* Left Column: Hospital Role Switcher */}
        <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Step 1: Role Authentication</span>
                <h1 className="text-xl font-black text-white mt-0.5">Select Hospital Staff Profile</h1>
              </div>
              <span className="text-xs text-zinc-500 font-mono">1-Click Fast Auth</span>
            </div>

            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Demonstrate the live chain of command by stepping into the shoes of frontline staff, departmental HODs, or executive finance controllers.
            </p>

            {/* Filter Pills */}
            <div className="flex gap-1.5 mb-4 p-1 bg-zinc-950 border border-zinc-800/80 rounded-xl">
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'staff', label: '1. Requesters (Staff)' },
                { id: 'hod', label: '2. Department HODs' },
                { id: 'finance', label: '3. Finance / CA / Stores' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    activeFilter === f.id 
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* User Selection List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredUsers.map(user => {
                const isSelected = selectedUser.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-zinc-800 border-teal-500/50 shadow-lg shadow-teal-950/40'
                        : 'bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-800/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-teal-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-100">{user.name}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${user.badgeColor}`}>
                            {user.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{user.roleTitle} · {user.department}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-400">
                          <CheckCircle2 size={12} />
                        </div>
                      ) : (
                        <ChevronRight size={16} className="text-zinc-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Terminal Card */}
        <div className="w-full lg:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
              <KeyRound size={14} />
              <span>Step 2: Sign-in Terminal</span>
            </div>

            <h2 className="text-xl font-black text-white">Enter Workstation</h2>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              Authenticate into the hospital intranet as <strong className="text-zinc-200">{selectedUser.name}</strong>.
            </p>

            {/* Profile preview */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500 text-zinc-950 font-black flex items-center justify-center text-base">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">{selectedUser.name}</h4>
                  <p className="text-xs text-teal-400 font-medium">{selectedUser.roleTitle}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">{selectedUser.department}</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Staff Email / Employee ID</label>
                <input 
                  type="text" 
                  disabled 
                  value={`${selectedUser.id}@amacresthospital.org`}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-400 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Enterprise Token / Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono tracking-widest focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                  <Lock size={14} className="absolute right-3.5 top-3 text-zinc-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <button
              onClick={() => handleLogin(selectedUser)}
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating Station...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedUser.name.split(' ')[0]}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-zinc-500 mt-3 font-mono">
              Redirects to: {selectedUser.destination}
            </p>
          </div>
        </div>
      </main>

      {/* Footer Compliance Strip */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950/80 px-6 py-4 text-center text-xs text-zinc-500">
        AMACREST HOSPITAL & MATERNITY · Digital Procurement & Requisition System v2.4 · Powered by MedReq
      </footer>
    </div>
  );
}
