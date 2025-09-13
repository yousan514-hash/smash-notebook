import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PostHogProvider } from '../components/providers/posthog-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smash Notebook - スマブラ戦術ノート',
  description: 'スマブラの戦術を記録・共有するアプリ',
  keywords: ['スマブラ', '戦術', 'ノート', 'ゲーム', '攻略'],
  authors: [{ name: 'Smash Notebook Team' }],
  openGraph: {
    title: 'Smash Notebook - スマブラ戦術ノート',
    description: 'スマブラの戦術を記録・共有するアプリ',
    type: 'website',
  },
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
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}