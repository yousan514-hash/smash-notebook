import './globals.css'

export const metadata = { title: "Smash Notebook" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-dvh bg-white text-black">{children}</body>
    </html>
  );
}