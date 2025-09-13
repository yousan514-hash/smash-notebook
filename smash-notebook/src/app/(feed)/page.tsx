import { getSupabaseServer } from "@/lib/supabase/server";
import { RenderMDX } from "@/lib/mdx/render";
import Link from "next/link";
import { type Card, type Post } from "@/types/domain";

export const dynamic = "force-dynamic";

async function fetchFeed(): Promise<Post[]> {
	const supabase = getSupabaseServer();
	const { data, error } = await supabase
		.from("posts")
		.select("id, content, created_at, cards:post_cards(cards:cards(*))")
		.order("created_at", { ascending: false });
	if (error) throw error;
	return (
		data?.map((row: any) => ({
			id: row.id,
			content: row.content,
			created_at: row.created_at,
			cards: (row.cards?.map((pc: any) => pc.cards) ?? []) as Card[],
		})) ?? []
	);
}

export default async function FeedPage() {
	let posts: Post[] = [];
	try {
		posts = await fetchFeed();
	} catch (e) {
		return (
			<div className="space-y-4">
				<h1 className="text-xl font-semibold">Feed</h1>
				<p className="text-sm text-red-600">Failed to load feed.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				<h1 className="text-xl font-semibold">Feed</h1>
				<Link href="/compose" className="ml-auto rounded border px-3 py-1.5 text-sm hover:bg-gray-50">
					Compose
				</Link>
			</div>
			<ul className="space-y-6">
				{posts.map((post) => (
					<li key={post.id} className="rounded-md border bg-white p-4">
						<div className="prose prose-sm max-w-none">
							<RenderMDX source={post.content} />
						</div>
						{post.cards && post.cards.length > 0 ? (
							<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
								{post.cards.map((card) => (
									<Link key={card.id} href={`/deck/card/${card.id}`} className="rounded border p-3 hover:bg-gray-50">
										<div className="text-sm font-medium">
											{card.myChar} vs {card.oppChar} · {card.percentBand} · {card.situation}
										</div>
										<div className="line-clamp-2 text-xs text-gray-600">{card.oppMove ?? "General"}</div>
									</Link>
								))}
							</div>
						) : null}
					</li>
				))}
			</ul>
		</div>
	);
}

