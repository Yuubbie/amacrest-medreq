'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveStoredUser } from '@/lib/storage';
import { 
  Building2, Lock, ArrowRight, ShieldCheck, UserCheck, 
  Heart, Activity, CheckCircle2, ChevronRight,
  Sparkles, KeyRound, Award, Users, FileText
} from 'lucide-react';

interface PresetUser {
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

const presetUsers: PresetUser[] = [
  // 1. Staff Requesters (Level 1)
  {
    id: 'staff-nurse',
    name: 'Nurse Hauwa Bello',
    roleTitle: 'Staff Nurse (Post-Op Ward)',
    department: 'Clinicals',
    unit: 'Nursing',
    roleType: 'staff',
    destination: '/dashboard',
    avatar: 'HB',
    badge: 'Frontline Clinical Staff',
    badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  },
  {
    id: 'staff-hostel',
    name: 'Mr. Samuel Danladi',
    roleTitle: 'Hostel & Patient Logistics Officer',
    department: 'Clinicals',
    unit: 'Hostel',
    roleType: 'staff',
    destination: '/dashboard',
    avatar: 'SD',
    badge: 'Patient Transport Logistics',
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  },
  {
    id: 'staff-edu',
    name: 'Malam Ibrahim Musa',
    roleTitle: 'Social Assistance & Education Officer',
    department: 'Clinicals',
    unit: 'Education Welfare',
    roleType: 'staff',
    destination: '/dashboard',
    avatar: 'IM',
    badge: 'Patient Schooling & Welfare',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  {
    id: 'staff-kitchen',
    name: 'Mrs. Maryam Kabir',
    roleTitle: 'Catering & Kitchen Lead',
    department: 'Admin',
    unit: 'Kitchen',
    roleType: 'staff',
    destination: '/dashboard',
    avatar: 'MK',
    badge: 'Admin / Kitchen Staff',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  {
    id: 'staff-fleet',
    name: 'Malam Sule Tanko',
    roleTitle: 'Lead Ambulance & Fleet Driver',
    department: 'Facility',
    unit: 'Logistics/Fleet',
    roleType: 'staff',
    destination: '/dashboard',
    avatar: 'ST',
    badge: 'Facility & Fleet Staff',
    badgeColor: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20',
  },

  // 2. Supervisors / Unit Heads (Level 2)
  {
    id: 'supv-clinicals',
    name: 'Dr. Grace Mshelia',
    roleTitle: 'Director of Clinical Services',
    department: 'Clinicals',
    unit: 'Clinicals',
    roleType: 'supervisor',
    destination: '/hod?dept=Clinicals',
    avatar: 'GM',
    badge: 'Level 2: Clinicals Supervisor',
    badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  },
  {
    id: 'supv-admin',
    name: 'Mrs. Stella Eze',
    roleTitle: 'Head of Hospital Administration',
    department: 'Admin',
    unit: 'Admin',
    roleType: 'supervisor',
    destination: '/hod?dept=Admin',
    avatar: 'SE',
    badge: 'Level 2: Admin & Kitchen Supervisor',
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
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
    badge: 'Level 2: Facility Supervisor',
    badgeColor: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
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
    badge: 'Level 2: HR Supervisor',
    badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  },

  // 3. Finance & Grants (Level 3)
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
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },

  // 4. Programme & National Coordinators (Level 4 & 5)
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
    badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
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
    badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  },

  // 5. Stores Officer
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
    badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<PresetUser>(presetUsers[0]);
  const [password, setPassword] = useState('••••••••••••');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'staff' | 'supervisor' | 'finance' | 'coordinator'>('all');

  const handleLogin = (userToLogin: PresetUser) => {
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
    }, 350);
  };

  const filteredUsers = activeFilter === 'all' 
    ? presetUsers 
    : presetUsers.filter(u => u.roleType === activeFilter);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-teal-500 selection:text-zinc-950 relative overflow-hidden font-sans">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-teal-500/10 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black">
              <Heart size={18} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-teal-400">NANI</span>
              <span className="font-black text-lg tracking-tight text-white ml-1">ReqFlow</span>
              <span className="text-[10px] text-zinc-500 block">Noma Aid Nigeria Initiative</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
            <ShieldCheck size={14} className="text-teal-400" />
            <span>NANI Multi-Level Approval Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Login */}
      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex flex-col lg:flex-row gap-6 items-stretch relative z-10">
        
        {/* Left Column: Role Selector */}
        <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">Step 1: Role Authentication</span>
                <h1 className="text-xl font-black text-white mt-0.5">Select NANI Staff Profile</h1>
              </div>
              <span className="text-xs text-zinc-500 font-mono">1-Click Fast Auth</span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Experience the 4-level approval chain: Requester → Supervisor → Finance → Coordinator → National Coordinator.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1 mb-4 p-1 bg-zinc-950 border border-zinc-800/80 rounded-xl">
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'staff', label: '1. Requesters' },
                { id: 'supervisor', label: '2. Supervisors' },
                { id: 'finance', label: '3. Finance' },
                { id: 'coordinator', label: '4/5. Coordinators' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`flex-1 min-w-[90px] py-1.5 text-[11px] font-bold rounded-lg transition-all ${
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
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredUsers.map(user => {
                const isSelected = selectedUser.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
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
                        <p className="text-xs text-zinc-400 mt-0.5">{user.roleTitle} · {user.department} ({user.unit})</p>
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
            <p className="text-xs text-zinc-400 mt-1 mb-5">
              Authenticate as <strong className="text-zinc-200">{selectedUser.name}</strong>
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
                  <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">{selectedUser.department} · {selectedUser.unit}</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Official NANI Email / ID</label>
                <input 
                  type="text" 
                  disabled 
                  value={`${selectedUser.id}@nomaaidnigeria.org`}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-400 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">PIN / Access Key</label>
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

          <div className="mt-8 pt-5 border-t border-zinc-800">
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
            <p className="text-center text-[11px] text-zinc-500 mt-2 font-mono">
              Role: {selectedUser.badge}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950/80 px-6 py-4 text-center text-xs text-zinc-500">
        NOMA AID NIGERIA INITIATIVE (NANI) · ReqFlow Requisition System v3.0 · Powered by Antigravity
      </footer>
    </div>
  );
}
