import Link from "next/link"
import { FileText } from "lucide-react"

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between max-w-7xl mx-auto w-full">
      <Link className="flex items-center justify-center" href="/">
        <FileText className="h-6 w-6 mr-2" />
        <span className="font-bold">ResumeAI</span>
      </Link>
      <nav className="flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/#features">
          Features
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/#cta">
          Get Started
        </Link>
      </nav>
    </header>
  )
}