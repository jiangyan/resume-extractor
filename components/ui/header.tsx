'use client'

import { FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from 'next/link'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <FileText className="mr-2 h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">Resume AI</h1>
        </Link>
        <div>
          {status === "authenticated" ? (
            <Button onClick={() => signOut({ callbackUrl: '/' })} variant="outline" className="text-sm">
              Logout
            </Button>
          ) : status === "unauthenticated" ? (
            <Button onClick={() => signIn("google")} variant="outline" className="text-sm">
              Sign in with Google
            </Button>
          ) : (
            <Button variant="outline" className="text-sm" disabled>
              Loading...
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}