import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amacrest Amacrest MedReq — Hospital Digital Requisition System',
  description: 'Digitize. Track. Approve. End paper requisitions across your hospital.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
