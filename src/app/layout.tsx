import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MobileActionBar, MobileActionBarSpacer } from '@/components/layout/mobile-action-bar'
import { AnalyticsProvider } from '@/components/providers/analytics-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'スマブラ戦術ノート',
  description: 'スマッシュブラザーズの戦術を記録・共有するアプリ',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AnalyticsProvider>
          <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
            <MobileActionBarSpacer />
            <MobileActionBar />
          </div>
        </AnalyticsProvider>
      </body>
    </html>
  )
}