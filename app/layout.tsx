import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/ui/header'
import { Analytics } from '@vercel/analytics/react'
import ClientProviders from './client-providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Resume AI',
  description: 'Extract information from resumes with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <Header />
          {children}
          <Analytics />
        </ClientProviders>
      </body>
    </html>
  )
}
