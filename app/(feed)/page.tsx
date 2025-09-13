import { supabaseServer } from "@/lib/supabase/server";
import { createPost } from "./actions";

export const dynamic = "force-dynamic";

type PostRow = {
	id: string;
	content: string;
	linked_card: string | null;
	created_at: string;
};

type CardRow = {
	id: string;
	myChar: string;
	oppChar: string;
	percentBand: string;
	situation: string;
};

export default async function FeedPage() {
	let posts: PostRow[] | null = null;
	let error: { message: string } | null = null;
	let cardMap: Record<string, CardRow> = {};
	try {
		const supabase = supabaseServer();
		const postsRes = await supabase
			.from("posts")
			.select("id, content, linked_card, created_at")
			.order("created_at", { ascending: false });
		posts = (postsRes as unknown as { data: PostRow[] | null }).data;
		error = (postsRes as unknown as { error: { message: string } | null }).error;

		if (posts && posts.length > 0) {
			const linkedIds = posts
				.map((p) => p.linked_card)
				.filter((v): v is string => Boolean(v));
			if (linkedIds.length > 0) {
				const cardsRes = await supabase
					.from("cards")
					.select("id, myChar, oppChar, percentBand, situation")
					.in("id", linkedIds);
				const cards = (cardsRes as unknown as { data: CardRow[] | null }).data;
				if (cards) {
					cardMap = Object.fromEntries(cards.map((c) => [c.id, c]));
				}
			}
		}
	} catch (e) {
		error = { message: "環境変数が未設定です (.env.local)" };
	}

	return (
		<main className="mx-auto max-w-3xl p-6">
			<h1 className="text-2xl font-bold">フィード</h1>
			{error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}

			<section className="mt-6">
				<h2 className="text-lg font-semibold">投稿する</h2>
				<form action={createPost} className="mt-3 space-y-3">
					<textarea name="content" placeholder="いま考えていること…" required className="min-h-28 w-full rounded border px-3 py-2" />
					<input name="linked_card" placeholder="リンクするカードID (任意)" className="w-full rounded border px-3 py-2" />
					<button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">投稿</button>
				</form>
			</section>

			<section className="mt-8 space-y-4">
				{(posts ?? []).length === 0 && (
					<p className="text-sm text-gray-500">投稿はまだありません。</p>
				)}
				{(posts ?? []).map((post) => {
					const card = post.linked_card ? cardMap[post.linked_card] : undefined;
					return (
						<article key={post.id} className="rounded border bg-white p-4 shadow-sm">
							<p className="whitespace-pre-wrap text-gray-800">{post.content}</p>
							{card && (
								<div className="mt-3 rounded border bg-gray-50 p-3 text-sm text-gray-700">
									<span className="rounded bg-gray-100 px-2 py-0.5">My: {card.myChar}</span>{" "}
									<span className="rounded bg-gray-100 px-2 py-0.5">Opp: {card.oppChar}</span>{" "}
									<span className="rounded bg-gray-100 px-2 py-0.5">{card.percentBand}</span>{" "}
									<span className="rounded bg-gray-100 px-2 py-0.5">{card.situation}</span>
								</div>
							)}
							<p className="mt-2 text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
						</article>
					);
				})}
			</section>
		</main>
	);
}