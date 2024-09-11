import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/ui/header'
import { Analytics } from '@vercel/analytics/react'
import ClientProviders from '../client-providers'
import { i18n } from '../../i18n-config'
import { Footer } from '@/components/ui/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Resume AI',
  description: 'Extract information from resumes with AI',
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-gray-900 dark:text-gray-100`}>
        <ClientProviders>
          <div className="flex flex-col min-h-screen">
            <Header lang={params.lang} />
            <main className="flex-grow">
              {children}
            </main>
            <Footer lang={params.lang} />
          </div>
          <Analytics />
        </ClientProviders>
      </body>
    </html>
  )
}