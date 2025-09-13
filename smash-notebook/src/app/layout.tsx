import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Smash Notebook",
	description: "Tactics decks, cards, feed, and quizzes for Super Smash Bros.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
					<nav className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
						<Link href="/" className="font-semibold">Smash Notebook</Link>
						<div className="ml-auto flex items-center gap-3 text-sm">
							<Link href="/" className="hover:underline">Feed</Link>
							<Link href="/deck" className="hover:underline">Decks</Link>
							<Link href="/deck/card/new" className="hover:underline">New Card</Link>
							<Link href="/compose" className="hover:underline">Compose</Link>
						</div>
					</nav>
				</header>
			<main className="mx-auto max-w-5xl px-4 py-6">
				{children}
			</main>
			</body>
		</html>
	);
}
