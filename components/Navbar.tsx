'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Heart, Bell, ChevronDown, Menu, X, LogOut, User,
  FilePlus, ShieldCheck, DollarSign, Package, BarChart3, ArrowRight, RotateCcw
} from 'lucide-react';
import { resetStoredRequests, getStoredUser, AuthUser } from '@/lib/storage';

interface NavbarProps {
  role?: string;
  userName?: string;
}

export default function Navbar({ role, userName }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
    const handleUserUpdate = () => {
      setCurrentUser(getStoredUser());
    };
    window.addEventListener('nani_user_updated', handleUserUpdate);
    return () => window.removeEventListener('nani_user_updated', handleUserUpdate);
  }, []);

  const activeRole = role || currentUser?.roleTitle || 'Staff Member';
  const activeName = userName || currentUser?.name || 'Frontline Staff';
  const activeAvatar = currentUser?.avatar || activeName.split(' ').map(n => n[0]).join('').slice(0, 2);
  const roleType = currentUser?.roleType || 'staff';

  // Role-targeted navigation links
  let navLinks: { href: string; label: string; icon: any }[] = [];

  if (roleType === 'staff') {
    navLinks = [
      { href: '/new-request', label: 'Raise Requisition', icon: FilePlus },
      { href: '/dashboard', label: 'My Vouchers & Receipt Confirmations', icon: BarChart3 },
    ];
  } else if (roleType === 'supervisor') {
    const deptQuery = currentUser?.department ? `?dept=${currentUser.department}` : '';
    navLinks = [
      { href: `/hod${deptQuery}`, label: 'Supervisor Approval Desk', icon: ShieldCheck },
      { href: '/new-request', label: 'New Requisition', icon: FilePlus },
      { href: '/dashboard', label: 'Department Ledger', icon: BarChart3 },
    ];
  } else if (roleType === 'finance') {
    navLinks = [
      { href: '/finance', label: 'Finance & Grants Desk', icon: DollarSign },
      { href: '/reports', label: 'Donor Audit & Retirement Ledger', icon: BarChart3 },
      { href: '/new-request', label: 'New Requisition', icon: FilePlus },
    ];
  } else if (roleType === 'coordinator') {
    const coordQuery = currentUser?.id === 'coordinator-national' ? '?role=national' : '?role=coordinator';
    navLinks = [
      { href: `/hod${coordQuery}`, label: 'Executive Authorization Desk', icon: ShieldCheck },
      { href: '/finance', label: 'Finance & Disbursements', icon: DollarSign },
      { href: '/reports', label: 'Donor Audit Ledger', icon: BarChart3 },
    ];
  } else if (roleType === 'store') {
    navLinks = [
      { href: '/inventory', label: 'Stores Register', icon: Package },
      { href: '/new-request', label: 'New Requisition', icon: FilePlus },
    ];
  } else {
    navLinks = [
      { href: '/new-request', label: 'New Requisition', icon: FilePlus },
      { href: '/hod', label: 'Supervisor Desk', icon: ShieldCheck },
      { href: '/finance', label: 'Finance & Donor', icon: DollarSign },
      { href: '/reports', label: 'Reports & Forecast', icon: BarChart3 },
    ];
  }

  const handleResetData = () => {
    if (confirm('Reset prototype demo data to pristine initial state?')) {
      resetStoredRequests();
      window.location.reload();
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white text-xs py-1.5 px-4 flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          <span className="font-medium tracking-wide">
            <strong>NOMA AID NIGERIA INITIATIVE (NANI)</strong> · Electronic Procurement & Audit System
          </span>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleResetData}
            title="Reset to fresh mock dataset anytime before a presentation"
            className="text-[11px] font-mono text-teal-100 hover:text-white flex items-center gap-1 bg-teal-900/40 hover:bg-teal-900/70 px-2.5 py-0.5 rounded border border-teal-500/40 transition-colors"
          >
            <RotateCcw size={11} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-black shadow-sm group-hover:bg-teal-100 transition-all">
              <Heart size={20} strokeWidth={2.5} className="text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-teal-700 font-black text-xl tracking-tight">NANI</span>
                <span className="text-slate-900 font-black text-xl tracking-tight">ReqFlow</span>
              </div>
              <span className="hidden sm:block text-slate-500 text-[11px] -mt-1 font-medium">Noma Aid Nigeria Initiative</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href.split('?')[0];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-teal-700' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User profile & actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Active Role Pill */}
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-slate-800 text-xs font-semibold">{activeRole}</span>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 bg-teal-100 border border-teal-300 rounded-xl flex items-center justify-center text-teal-800 text-xs font-bold font-mono">
                {activeAvatar}
              </div>
              <div className="hidden xl:block">
                <p className="text-slate-900 text-xs font-bold leading-tight">{activeName}</p>
                <p className="text-slate-500 text-[10px] font-mono">Authorized Session</p>
              </div>
            </div>

            {/* Switch Role / Login */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <LogOut size={13} />
              <span>Switch User</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-50 border-t border-slate-200 px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
              {activeAvatar}
            </div>
            <div>
              <p className="text-slate-900 text-sm font-bold">{activeName}</p>
              <p className="text-teal-700 text-xs font-medium">{activeRole}</p>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900 py-2 px-2 rounded-lg hover:bg-slate-200 text-sm font-medium"
                >
                  <Icon size={16} className="text-teal-600" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 py-2 px-2 text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Switch Active Role</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
