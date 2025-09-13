import CardForm from "@/components/CardForm";
import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function createCard(formData: FormData) {
	"use server";
	const supabase = getSupabaseServer();
	const payload = {
		deck_id: formData.get("deck_id") || null,
		myChar: String(formData.get("myChar") || ""),
		oppChar: String(formData.get("oppChar") || ""),
		percentBand: String(formData.get("percentBand") || "0-30"),
		situation: String(formData.get("situation") || "neutral"),
		oppMove: String(formData.get("oppMove") || "") || null,
		answerMD: String(formData.get("answerMD") || ""),
	};
	const { data, error } = await supabase.from("cards").insert(payload).select("id").single();
	if (error) throw error;
	revalidatePath("/deck");
	return data?.id as string | undefined;
}

export default function NewCardPage() {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<h1 className="text-xl font-semibold">New Card</h1>
				<Link href="/deck" className="ml-auto text-sm underline">Back to Decks</Link>
			</div>
			<CardForm action={createCard} />
		</div>
	);
}

