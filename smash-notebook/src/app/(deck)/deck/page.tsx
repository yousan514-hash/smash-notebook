import { getSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { type Deck } from "@/types/domain";

async function createDeck(formData: FormData) {
	"use server";
	const supabase = getSupabaseServer();
	const name = String(formData.get("name") || "").trim();
	if (!name) return;
	await supabase.from("decks").insert({ name });
	revalidatePath("/deck");
}

async function deleteDeck(id: string) {
	"use server";
	const supabase = getSupabaseServer();
	await supabase.from("decks").delete().eq("id", id);
	revalidatePath("/deck");
}

async function fetchDecks(): Promise<Deck[]> {
	const supabase = getSupabaseServer();
	const { data, error } = await supabase.from("decks").select("*").order("created_at", { ascending: false });
	if (error) throw error;
	return (data as any) ?? [];
}

export default async function DeckListPage() {
	let decks: Deck[] = [];
	try {
		decks = await fetchDecks();
	} catch (e) {}
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				<h1 className="text-xl font-semibold">Decks</h1>
				<Link className="ml-auto rounded border px-3 py-1.5 text-sm hover:bg-gray-50" href="/deck/card/new">New Card</Link>
			</div>
			<form action={createDeck} className="flex gap-2">
				<input name="name" placeholder="New deck name" className="flex-1 rounded border p-2 text-sm" />
				<button type="submit" className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">Create</button>
			</form>
			<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{decks.map((d) => (
					<li key={d.id} className="rounded-md border bg-white p-3 text-sm">
						<div className="flex items-center gap-2">
							<Link href={`/deck/${d.id}`} className="font-medium hover:underline">{d.name}</Link>
							<form action={deleteDeck.bind(null, d.id)} className="ml-auto">
								<button className="rounded border px-2 py-1 text-xs hover:bg-gray-50" type="submit">Delete</button>
							</form>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

