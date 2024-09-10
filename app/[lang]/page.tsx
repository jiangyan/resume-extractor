import { LandingPage } from "@/components/landing-page"

export default function Home({ params: { lang } }: { params: { lang: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <LandingPage lang={lang} />
      </main>
    </div>
  )
}