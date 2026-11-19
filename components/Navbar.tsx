'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Heart, Bell, ChevronDown, Menu, X, LogOut, User,
  FilePlus, ShieldCheck, DollarSign, Package, BarChart3, ArrowRight
} from 'lucide-react';

interface NavbarProps {
  role?: string;
  userName?: string;
}

export default function Navbar({ role = 'Staff Nurse', userName = 'Nurse Hauwa Bello' }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/new-request', label: 'New Requisition', icon: FilePlus },
    { href: '/hod', label: 'Supervisor Desk', icon: ShieldCheck },
    { href: '/finance', label: 'Finance & Donor', icon: DollarSign },
    { href: '/inventory', label: 'Stores Register', icon: Package },
    { href: '/reports', label: 'Reports & Forecast', icon: BarChart3 },
  ];

  return (
    <nav className="bg-zinc-950/95 border-b border-zinc-800/80 sticky top-0 z-50 backdrop-blur-md font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-zinc-900 to-teal-950 border-b border-teal-800/30 text-zinc-300 text-center text-xs py-1.5 px-4 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
        <span>
          <strong className="text-teal-300 font-bold">NANI ReqFlow Live Demo</strong> — Noma Aid Nigeria Initiative · Multi-Department Requisition Portal
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black group-hover:bg-teal-500/20 transition-all">
              <Heart size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-teal-400 font-black text-lg tracking-tight">NANI</span>
                <span className="text-white font-black text-lg tracking-tight">ReqFlow</span>
              </div>
              <span className="hidden sm:block text-zinc-500 text-[10px] -mt-1 font-mono">Noma Aid Nigeria Initiative</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-teal-400' : 'text-zinc-500'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User profile & actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Active Role Pill */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-zinc-300 text-xs font-medium">{role}</span>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 bg-teal-500/20 border border-teal-500/40 rounded-xl flex items-center justify-center text-teal-300 text-xs font-bold">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="hidden xl:block">
                <p className="text-white text-xs font-bold leading-tight">{userName}</p>
                <p className="text-zinc-500 text-[10px] font-mono">Authenticated</p>
              </div>
            </div>

            {/* Switch Role / Login */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            >
              <LogOut size={13} />
              <span>Switch User</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-zinc-900 border-t border-zinc-800 px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
            <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-zinc-950 font-black text-sm">
              {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-white text-sm font-bold">{userName}</p>
              <p className="text-teal-400 text-xs">{role}</p>
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
                  className="flex items-center gap-2 text-zinc-300 hover:text-white py-2 px-2 rounded-lg hover:bg-zinc-800 text-sm font-medium"
                >
                  <Icon size={16} className="text-teal-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 py-2 px-2 text-sm font-medium"
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
