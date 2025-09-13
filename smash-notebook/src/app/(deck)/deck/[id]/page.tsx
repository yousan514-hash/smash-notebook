import { getSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { type Card, type Deck } from "@/types/domain";

export const dynamic = "force-dynamic";

async function fetchDeck(id: string): Promise<Deck | null> {
	const supabase = getSupabaseServer();
	const { data } = await supabase.from("decks").select("*").eq("id", id).single();
	return (data as any) ?? null;
}

async function fetchDeckCards(deckId: string): Promise<Card[]> {
	const supabase = getSupabaseServer();
	const { data } = await supabase.from("cards").select("*").eq("deck_id", deckId).order("created_at", { ascending: false });
	return (data as any) ?? [];
}

export default async function DeckDetailPage({ params }: { params: { id: string } }) {
	const deck = await fetchDeck(params.id);
	if (!deck) return notFound();
	const cards = await fetchDeckCards(deck.id);

	async function renameDeck(formData: FormData) {
		"use server";
		const supabase = getSupabaseServer();
		const name = String(formData.get("name") || "").trim();
		if (!name) return;
		await supabase.from("decks").update({ name }).eq("id", params.id);
		revalidatePath(`/deck/${params.id}`);
	}
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<h1 className="text-xl font-semibold">{deck.name}</h1>
				<Link href="/deck" className="ml-auto text-sm underline">Back</Link>
				<Link href="/deck/card/new" className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">New Card</Link>
			</div>
			<form action={renameDeck} className="flex gap-2">
				<input name="name" defaultValue={deck.name} className="w-full rounded border p-2 text-sm" />
				<button className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50" type="submit">Rename</button>
			</form>
			{cards.length === 0 ? (
				<p className="text-sm text-gray-600">No cards yet.</p>
			) : (
				<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{cards.map((c) => (
						<li key={c.id} className="rounded border bg-white p-3 text-sm">
							<Link className="font-medium hover:underline" href={`/deck/card/${c.id}`}>
								{c.myChar} vs {c.oppChar} · {c.percentBand} · {c.situation}
							</Link>
							<div className="text-xs text-gray-600">{c.oppMove ?? "General"}</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

