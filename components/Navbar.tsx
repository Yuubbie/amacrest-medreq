'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Cross, Bell, ChevronDown, Menu, X, LogOut, User
} from 'lucide-react';

interface NavbarProps {
  role?: string;
  userName?: string;
}

export default function Navbar({ role = 'Staff Nurse', userName = 'Nurse Fatima Aliyu' }: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      {/* Demo banner */}
      <div className="bg-teal-600 text-white text-center text-xs py-1 px-4">
        🧪 <strong>Demo Prototype</strong> — This is an interactive demo of Amacrest Amacrest MedReq. All data is simulated.
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center group-hover:bg-teal-500 transition-colors">
              <Cross size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">Med</span>
              <span className="text-teal-400 font-bold text-lg tracking-tight">Req</span>
            </div>
            <span className="hidden sm:block text-slate-500 text-xs ml-1 mt-1 font-medium">Hospital Requisition System</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            {/* Role badge */}
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm">{role}</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">3</span>
            </button>

            {/* User info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="hidden lg:block">
                <p className="text-white text-sm font-medium leading-tight">{userName}</p>
                <p className="text-slate-400 text-xs">{role}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

            {/* Switch role */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <LogOut size={14} />
              <span>Switch Role</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">{userName}</p>
              <p className="text-teal-400 text-xs">{role}</p>
            </div>
          </div>
          <button className="relative flex items-center gap-2 text-slate-300 hover:text-white w-full py-2">
            <Bell size={18} />
            <span className="text-sm">Notifications</span>
            <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">3</span>
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-300 hover:text-white w-full py-2"
          >
            <LogOut size={18} />
            <span className="text-sm">Switch Role</span>
          </button>
        </div>
      )}
    </nav>
  );
}
