import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-6 border-t mt-auto">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl flex flex-col sm:flex-row justify-between items-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 ResumeAI. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  )
}