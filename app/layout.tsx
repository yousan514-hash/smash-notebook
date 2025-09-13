import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PostHogProvider } from '@/components/providers/posthog-provider'
import { MobileActionBar } from '@/components/ui/mobile-action-bar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smash Notebook',
  description: 'スマブラの戦術ノートアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <PostHogProvider>
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          <MobileActionBar />
        </PostHogProvider>
      </body>
    </html>
  )
}