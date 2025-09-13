import { getSupabaseServer } from "@/lib/supabase/server";
import { RenderMDX } from "@/lib/mdx/render";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Card } from "@/types/domain";

export const dynamic = "force-dynamic";

async function fetchCard(id: string): Promise<Card | null> {
	const supabase = getSupabaseServer();
	const { data } = await supabase.from("cards").select("*").eq("id", id).single();
	return (data as any) ?? null;
}

export default async function CardPage({ params }: { params: { id: string } }) {
	const card = await fetchCard(params.id);
	if (!card) return notFound();

	async function deleteCard() {
		"use server";
		const supabase = getSupabaseServer();
		await supabase.from("cards").delete().eq("id", params.id);
	}
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<h1 className="text-xl font-semibold">
					{card.myChar} vs {card.oppChar} · {card.percentBand} · {card.situation}
				</h1>
				<Link href="/deck" className="ml-auto text-sm underline">Back to Decks</Link>
				<Link href={`/deck/card/${params.id}/edit`} className="text-sm underline">Edit</Link>
				<form action={deleteCard}>
					<button className="rounded border px-2 py-1 text-xs hover:bg-gray-50" type="submit">Delete</button>
				</form>
			</div>
			{card.oppMove ? <div className="text-sm text-gray-600">Opponent move: {card.oppMove}</div> : null}
			<div className="prose max-w-none">
				<RenderMDX source={card.answerMD} />
			</div>
		</div>
	);
}

