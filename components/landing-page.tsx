'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, FileText, Zap, Lock } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export function LandingPage() {
  const router = useRouter();

  const handleGoogleAuth = async () => {
    try {
      const result = await signIn("google", { callbackUrl: "/resume-analyzer", redirect: false });
      if (result?.error) {
        console.error("Sign-in error:", result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Extract Key Info from Resumes with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline your hiring process with our AI-powered resume analysis tool. Get key insights in seconds.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="#cta">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    AI-Powered Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Our advanced AI algorithms extract key information from resumes with high accuracy.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Bulk Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Upload multiple resumes at once and get analysis results for all of them quickly.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Secure & Private
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Your data is encrypted and processed securely. We never store sensitive information.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Streamline Your Hiring?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Sign up now and start analyzing resumes with the power of AI.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                    required
                  />
                  <Button type="submit">
                    Sign Up
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Or sign in with:
                </p>
                <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Sign in with Google
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}