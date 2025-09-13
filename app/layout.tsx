import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Smash Notebook',
  description: 'Tactics notebook for Super Smash Bros.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <div className="mx-auto max-w-3xl p-4">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold"><a href="/">Smash Notebook</a></h1>
            <nav className="flex gap-3 text-sm">
              <a href="/deck" className="opacity-90 hover:opacity-100">Decks</a>
              <a href="/compose" className="opacity-90 hover:opacity-100">Compose</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
