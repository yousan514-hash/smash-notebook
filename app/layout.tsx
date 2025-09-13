import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Smash Notebook",
	description: "スマブラの戦術ノート",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className="min-h-dvh bg-gray-50 text-gray-900">{children}</body>
		</html>
	);
}