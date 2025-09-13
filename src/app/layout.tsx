import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smash Notebook",
  description: "Tactical notes app for Super Smash Bros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
