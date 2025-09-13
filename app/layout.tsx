import './globals.css';
import type { ReactNode } from 'react';
import { PostHogInit } from '@/components/analytics/PostHogInit';
import { ActionBar } from '@/components/mobile/ActionBar';

export const metadata = {
  title: 'Smash Notes',
  description: 'Decks, cards, posts for learning matchups',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <PostHogInit />
        <div className="pb-20">{children}</div>
        <ActionBar />
      </body>
    </html>
  );
}
