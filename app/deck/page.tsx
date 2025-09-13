import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { createDeck, deleteDeck } from "./actions";

type DeckRow = {
	id: string;
	title: string;
};

export const dynamic = "force-dynamic";

export default async function DeckListPage() {
	let decks: DeckRow[] | null = null;
	let error: { message: string } | null = null;
	try {
		const supabase = supabaseServer();
		const res = await supabase.from("decks").select("*");
		decks = (res as unknown as { data: DeckRow[] | null }).data;
		error = (res as unknown as { error: { message: string } | null }).error;
	} catch (e) {
		error = { message: "環境変数が未設定です (.env.local)" };
	}

	return (
		<main className="mx-auto max-w-4xl p-6">
			<h1 className="text-2xl font-bold">デッキ一覧</h1>
			<p className="mt-2 text-gray-600">学習用のデッキを管理します。</p>

			<section className="mt-6">
				<h2 className="text-lg font-semibold">新規作成</h2>
				<form action={createDeck} className="mt-2 flex flex-col gap-3 sm:flex-row">
					<input
						name="title"
						type="text"
						placeholder="タイトル"
						required
						className="w-full rounded border px-3 py-2"
					/>
					<button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
						作成
					</button>
				</form>
			</section>

			<section className="mt-6">
				<h2 className="text-lg font-semibold">一覧</h2>
				{error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
				<div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{(decks ?? []).length === 0 && (
						<p className="text-sm text-gray-500">デッキはまだありません。</p>
					)}
					{(decks ?? []).map((deck) => (
						<div key={deck.id} className="rounded border bg-white p-4 shadow-sm">
							<Link href={`/deck/${deck.id}`} className="block">
								<h3 className="text-lg font-semibold">{deck.title}</h3>
							</Link>
							<form action={deleteDeck} className="mt-3">
								<input type="hidden" name="id" value={deck.id} />
								<button
									type="submit"
									className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
								>
									削除
								</button>
							</form>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}