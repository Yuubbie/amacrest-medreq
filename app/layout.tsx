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
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen selection:bg-teal-500 selection:text-zinc-950 font-sans">
        {children}
      </body>
    </html>
  )
}
