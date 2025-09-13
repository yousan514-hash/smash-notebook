import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { createCard } from "../actions";

type DeckRow = { id: string; title: string };
type CardRow = {
	id: string;
	deck_id: string;
	myChar: string;
	oppChar: string;
	percentBand: string;
	situation: string;
	oppMove: string | null;
	answerMD: string;
};

export const dynamic = "force-dynamic";

export default async function DeckDetailPage({ params }: { params: { id: string } }) {
	let deck: DeckRow | null = null;
	let cards: CardRow[] | null = null;
	let deckError: { message?: string } | null = null;
	let cardsError: { message?: string } | null = null;
	try {
		const supabase = supabaseServer();
		const [deckRes, cardsRes] = await Promise.all([
			supabase.from("decks").select("*").eq("id", params.id).single(),
			supabase.from("cards").select("*").eq("deck_id", params.id).order("id", { ascending: true }),
		]);

		deck = (deckRes as unknown as { data: DeckRow | null; error: { message?: string } | null }).data;
		deckError = (deckRes as unknown as { data: DeckRow | null; error: { message?: string } | null }).error;
		cards = (cardsRes as unknown as { data: CardRow[] | null; error: { message?: string } | null }).data;
		cardsError = (cardsRes as unknown as { data: CardRow[] | null; error: { message?: string } | null }).error;
	} catch (e) {
		deckError = { message: "環境変数が未設定です (.env.local)" };
	}

	if (deckError?.message?.includes("No rows")) {
		notFound();
	}

	if (!deck) {
		notFound();
	}

	return (
		<main className="mx-auto max-w-3xl p-6">
			<Link href="/deck" className="text-blue-600 underline">← デッキ一覧へ</Link>
			<h1 className="mt-2 text-2xl font-bold">{deck.title}</h1>
			{(deckError || cardsError) && (
				<p className="mt-2 text-sm text-red-600">{deckError?.message || cardsError?.message}</p>
			)}

			<section className="mt-6">
				<h2 className="text-lg font-semibold">カード新規作成</h2>
				<form action={createCard} className="mt-3 grid grid-cols-1 gap-3">
					<input type="hidden" name="deck_id" value={deck.id} />
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						<input name="myChar" placeholder="自キャラ" required className="rounded border px-3 py-2" />
						<input name="oppChar" placeholder="相手キャラ" required className="rounded border px-3 py-2" />
						<input name="percentBand" placeholder="%帯 (例: 0-40%)" required className="rounded border px-3 py-2" />
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<input name="situation" placeholder="状況" required className="rounded border px-3 py-2" />
						<input name="oppMove" placeholder="相手行動 (任意)" className="rounded border px-3 py-2" />
					</div>
					<textarea name="answerMD" placeholder="解答 (Markdown可)" required className="min-h-28 rounded border px-3 py-2" />
					<div>
						<button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">追加</button>
					</div>
				</form>
			</section>

			<section className="mt-8">
				<h2 className="text-lg font-semibold">カード一覧</h2>
				<div className="mt-3 space-y-3">
					{(cards ?? []).length === 0 && (
						<p className="text-sm text-gray-500">カードはまだありません。</p>
					)}
					{(cards ?? []).map((card) => (
						<article key={card.id} className="rounded border bg-white p-4 shadow-sm">
							<div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
								<span className="rounded bg-gray-100 px-2 py-0.5">My: {card.myChar}</span>
								<span className="rounded bg-gray-100 px-2 py-0.5">Opp: {card.oppChar}</span>
								<span className="rounded bg-gray-100 px-2 py-0.5">{card.percentBand}</span>
								<span className="rounded bg-gray-100 px-2 py-0.5">{card.situation}</span>
								{card.oppMove && (
									<span className="rounded bg-gray-100 px-2 py-0.5">相手行動: {card.oppMove}</span>
								)}
							</div>
							<div className="prose prose-sm mt-3 max-w-none">
								<p>{card.answerMD}</p>
							</div>
						</article>
					))}
				</div>
			</section>
		</main>
	);
}