import { LandingPage } from "@/components/landing-page"

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <LandingPage lang={lang} />
      </main>
    </div>
  )
}