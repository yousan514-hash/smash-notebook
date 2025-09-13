import React from 'react';

export const metadata = {
  title: 'smash-notebook',
  description: 'スマブラの戦術ノートアプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

