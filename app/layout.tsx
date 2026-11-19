import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NANI ReqFlow — Noma Aid Nigeria Initiative | Multi-Level Requisition System',
  description: 'Digital Requisition, Procurement & Donor Grant Accountability System for Noma Aid Nigeria Initiative (NANI).',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen selection:bg-teal-600 selection:text-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
