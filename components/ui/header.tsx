'use client'

import { FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { i18n } from '../../i18n-config'
import { ThemeToggle } from './theme-toggle'

export function Header({ lang }: { lang: string }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLang: string) => {
    if (pathname) {
      const currentPathname = pathname.replace(`/${lang}`, '')
      router.push(`/${newLang}${currentPathname}`)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center hover:opacity-80 transition-opacity">
          <FileText className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Resume AI</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <select
            value={lang}
            onChange={(e) => switchLanguage(e.target.value)}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm"
          >
            {i18n.locales.map((locale) => (
              <option key={locale} value={locale}>
                {locale === 'en' ? 'English' : '中文'}
              </option>
            ))}
          </select>
          <ThemeToggle />
          {status === "authenticated" ? (
            <Button onClick={() => signOut({ callbackUrl: `/${lang}` })} variant="outline" className="text-sm">
              {lang === 'en' ? 'Logout' : '登出'}
            </Button>
          ) : status === "unauthenticated" ? (
            <Button onClick={() => signIn("google")} variant="outline" className="text-sm">
              {lang === 'en' ? 'Sign in with Google' : '使用谷歌登录'}
            </Button>
          ) : (
            <Button variant="outline" className="text-sm" disabled>
              {lang === 'en' ? 'Loading...' : '加载中...'}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}