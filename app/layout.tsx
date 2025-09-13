import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Smash Notes',
  description: 'Decks, cards, and posts for matchup notes',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto max-w-3xl px-4 pb-24">
          {children}
        </div>
      </body>
    </html>
  )
}

