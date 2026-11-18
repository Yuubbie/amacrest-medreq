'use client';

import Link from 'next/link';
import {
  Cross, Stethoscope, Building2, DollarSign,
  Package, BarChart3, Settings, ArrowRight, Shield
} from 'lucide-react';

const roles = [
  {
    icon: Stethoscope,
    title: 'Staff / Nurse',
    description: 'Submit and track requisition requests for your department. View approval status in real time.',
    href: '/dashboard',
    color: 'teal',
    gradient: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    hover: 'hover:border-teal-400',
    iconColor: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-700',
    badgeText: '12 Active',
  },
  {
    icon: Building2,
    title: 'Head of Department (HOD)',
    description: 'Review and approve departmental requisitions. Manage SLA compliance and query requests.',
    href: '/hod',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    hover: 'hover:border-amber-400',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    badgeText: '5 Pending',
  },
  {
    icon: DollarSign,
    title: 'Finance Officer / CA',
    description: 'Oversee budget utilization, approve payments, and monitor departmental spend across the hospital.',
    href: '/finance',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    hover: 'hover:border-green-400',
    iconColor: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
    badgeText: '8 For Review',
  },
  {
    icon: Package,
    title: 'Stores & Central Inventory',
    description: 'Bulk CSV opening balance import, stock register tracking, par-level alerts & material issuance.',
    href: '/inventory',
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    hover: 'hover:border-teal-400',
    iconColor: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-700',
    badgeText: 'Live Stock & CSV',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    description: 'Access comprehensive dashboards showing spend analysis, SLA metrics, and audit trails.',
    href: '/reports',
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    hover: 'hover:border-purple-400',
    iconColor: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    badgeText: 'Full Access',
  },
  {
    icon: Settings,
    title: 'System Administrator',
    description: 'Configure system settings, manage user accounts, departments, and approval workflows.',
    href: '/dashboard?role=admin',
    color: 'slate',
    gradient: 'from-slate-600 to-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    hover: 'hover:border-slate-400',
    iconColor: 'text-slate-600',
    badge: 'bg-slate-100 text-slate-700',
    badgeText: 'Admin',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      {/* Demo banner */}
      <div className="relative bg-teal-600 text-white text-center py-2 px-4">
        <p className="text-sm">
          🧪 <strong>Demo Mode</strong> — This is an interactive prototype of the Amacrest Amacrest MedReq Hospital Requisition System. All data is simulated. Click any role to explore.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-900/50">
              <Cross size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-white font-black text-5xl tracking-tight">Med</span>
              <span className="text-teal-400 font-black text-5xl tracking-tight">Req</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-teal-900/50 border border-teal-700 rounded-full px-4 py-1.5 mb-6">
            <Shield size={14} className="text-teal-400" />
            <span className="text-teal-300 text-sm font-medium">Hospital Digital Requisition System v2.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Digitize. Track. Approve.
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-4">
            End paper requisitions across your hospital. Amacrest Amacrest MedReq brings transparency, speed, and accountability to every procurement request — from ward to boardroom.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10 mb-4">
            {[
              { value: '156', label: 'Requests Processed' },
              { value: '₦18.4M', label: 'Total Value Managed' },
              { value: '18.4h', label: 'Avg. Processing Time' },
              { value: '8', label: 'Departments Connected' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Role selection */}
        <div className="mb-8">
          <h2 className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">
            Select your role to enter the system
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Link key={role.title} href={role.href}>
                  <div className={`group relative bg-slate-800 border ${role.border} ${role.hover} rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1`}>
                    {/* Icon */}
                    <div className={`w-12 h-12 ${role.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon size={22} className={role.iconColor} />
                    </div>

                    {/* Badge */}
                    <div className={`absolute top-5 right-5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${role.badge}`}>
                      {role.badgeText}
                    </div>

                    <h3 className="text-white font-bold text-base mb-2 leading-snug">{role.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{role.description}</p>

                    <div className="flex items-center gap-1 text-sm font-semibold text-slate-300 group-hover:text-teal-400 transition-colors">
                      <span>Enter as {role.title.split(' ')[0]}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            Amacrest Amacrest MedReq Hospital Requisition System · Demo Prototype · Built for Presentation Purposes
          </p>
          <p className="text-slate-600 text-xs mt-1">
            All data is fictional and for demonstration purposes only
          </p>
        </div>
      </div>
    </div>
  );
}
