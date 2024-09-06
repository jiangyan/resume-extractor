import { SessionProvider } from 'next-auth/react'

function ResumeExtractorApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default ResumeExtractorApp