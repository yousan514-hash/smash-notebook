import { getSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { type Card } from "@/types/domain";

async function createPost(formData: FormData) {
	"use server";
	const supabase = getSupabaseServer();
	const content = String(formData.get("content") || "").trim();
	const cardIds = String(formData.get("cardIds") || "").split(",").map((s) => s.trim()).filter(Boolean);
	if (!content && cardIds.length === 0) return;
	const { data: post, error } = await supabase
		.from("posts")
		.insert({ content })
		.select("id")
		.single();
	if (error) throw error;
	if (cardIds.length > 0) {
		await supabase.from("post_cards").insert(cardIds.map((id) => ({ post_id: post.id, card_id: id })));
	}
	revalidatePath("/");
}

async function fetchRecentCards(): Promise<Card[]> {
	const supabase = getSupabaseServer();
	const { data, error } = await supabase
		.from("cards")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(20);
	if (error) throw error;
	return (data as any) ?? [];
}

export default async function ComposePage() {
	let cards: Card[] = [];
	try {
		cards = await fetchRecentCards();
	} catch (e) {}
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<h1 className="text-xl font-semibold">Compose</h1>
				<Link href="/" className="ml-auto text-sm underline">Back to Feed</Link>
			</div>
			<form action={createPost} className="space-y-3">
				<textarea name="content" rows={6} placeholder="Write in MDX..." className="w-full rounded border p-2 text-sm" />
				<div>
					<label className="text-sm font-medium">Attach card IDs (comma separated)</label>
					<input name="cardIds" className="mt-1 w-full rounded border p-2 text-sm" placeholder="e.g. 123, 456" />
				</div>
				<button type="submit" className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">Post</button>
			</form>
			{cards.length > 0 ? (
				<div>
					<div className="mb-2 text-sm font-medium">Recent cards</div>
					<ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
						{cards.map((c) => (
							<li key={c.id} className="rounded border p-2 text-xs">
								{c.myChar} vs {c.oppChar} · {c.percentBand} · {c.situation}
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}

