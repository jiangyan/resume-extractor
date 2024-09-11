'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, FileText, Zap, Lock } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'

export function LandingPage({ lang }: { lang: string }) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGoogleAuth = async () => {
    try {
      const result = await signIn("google", { callbackUrl: `/${lang}/resume-analyzer`, redirect: false });
      if (result?.error) {
        console.error("Sign-in error:", result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleGetStarted = () => {
    if (session) {
      router.push(`/${lang}/resume-analyzer`);
    }
    // If not logged in, the default link behavior will take effect
  };

  const handleFeatureClick = () => {
    if (session) {
      router.push(`/${lang}/resume-analyzer`);
    }
  };

  const translations = {
    en: {
      title: "Extract Key Info from Resumes with AI",
      description: "Streamline your hiring process with our AI-powered resume analysis tool. Get key insights in seconds.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      keyFeatures: "Key Features",
      aiPoweredAnalysis: "AI-Powered Analysis",
      aiPoweredAnalysisDescription: "Our advanced AI algorithms extract key information from resumes with high accuracy.",
      bulkProcessing: "Bulk Processing",
      bulkProcessingDescription: "Upload multiple resumes at once and get analysis results for all of them quickly.",
      securePrivate: "Secure & Private",
      securePrivateDescription: "Your data is encrypted and processed securely. We never store sensitive information.",
      readyToStreamline: "Ready to Streamline Your Hiring?",
      readyToStreamlineDescription: "Sign up now and start analyzing resumes with the power of AI.",
      signUp: "Sign Up",
      orSignInWith: "Or sign in with:",
      signInWithGoogle: "Sign in with Google"
    },
    zh: {
      title: "使用AI从简历中提取关键信息",
      description: "使用我们的AI驱动的简历分析工具简化您的招聘流程。在几秒钟内获得关键见解。",
      getStarted: "开始使用",
      learnMore: "了解更多",
      keyFeatures: "关键特性",
      aiPoweredAnalysis: "AI驱动分析",
      aiPoweredAnalysisDescription: "我们的高级AI算法以高精度从简历中提取关键信息。",
      bulkProcessing: "批量处理",
      bulkProcessingDescription: "一次上传多份简历并快速获取所有分析结果。",
      securePrivate: "安全和私密",
      securePrivateDescription: "您的数据经过加密并安全处理。我们永远不会存储敏感信息。",
      readyToStreamline: "准备简化您的招聘流程了吗？",
      readyToStreamlineDescription: "立即注册并开始使用AI分析简历。",
      signUp: "注册",
      orSignInWith: "或使用以下方式登录：",
      signInWithGoogle: "使用谷歌登录"
    }
  }

  const t = translations[lang as keyof typeof translations]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none dark:text-white">
                  {t.title}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-300">
                  {t.description}
                </p>
              </div>
              <div className="space-x-4">
                <Button 
                  asChild={!session}
                  onClick={session ? handleGetStarted : undefined}
                >
                  {session ? (
                    <span>{t.getStarted}</span>
                  ) : (
                    <Link href="#cta">{t.getStarted}</Link>
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#features">{t.learnMore}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 dark:text-white">
              {t.keyFeatures}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[ 
                { icon: Zap, title: t.aiPoweredAnalysis, description: t.aiPoweredAnalysisDescription },
                { icon: FileText, title: t.bulkProcessing, description: t.bulkProcessingDescription },
                { icon: Lock, title: t.securePrivate, description: t.securePrivateDescription }
              ].map((feature, index) => (
                <Card 
                  key={index} 
                  className={`${session ? "cursor-pointer transition-shadow hover:shadow-lg" : ""} dark:bg-gray-700 dark:text-gray-100`}
                  onClick={session ? handleFeatureClick : undefined}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center dark:text-white">
                      <feature.icon className="w-5 h-5 mr-2" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:text-white">
                  {t.readyToStreamline}
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300">
                  {t.readyToStreamlineDescription}
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
                    {t.signUp}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.orSignInWith}
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
                  {t.signInWithGoogle}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}