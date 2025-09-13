"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function createDeck(formData: FormData) {
	const title = String(formData.get("title") || "").trim();
	if (!title) {
		throw new Error("タイトルは必須です");
	}
	const supabase = supabaseServer();
	const { error } = await supabase.from("decks").insert([{ title }]);
	if (error) {
		throw new Error(error.message);
	}
	revalidatePath("/deck");
}

export async function deleteDeck(formData: FormData) {
	const id = String(formData.get("id") || "").trim();
	if (!id) {
		throw new Error("IDが不正です");
	}
	const supabase = supabaseServer();
	const { error } = await supabase.from("decks").delete().eq("id", id);
	if (error) {
		throw new Error(error.message);
	}
	revalidatePath("/deck");
}

export async function createCard(formData: FormData) {
	const deckId = String(formData.get("deck_id") || "").trim();
	const myChar = String(formData.get("myChar") || "").trim();
	const oppChar = String(formData.get("oppChar") || "").trim();
	const percentBand = String(formData.get("percentBand") || "").trim();
	const situation = String(formData.get("situation") || "").trim();
	const oppMove = String(formData.get("oppMove") || "").trim();
	const answerMD = String(formData.get("answerMD") || "").trim();

	if (!deckId || !myChar || !oppChar || !percentBand || !situation || !answerMD) {
		throw new Error("必須項目が未入力です");
	}

	const supabase = supabaseServer();
	const { error } = await supabase.from("cards").insert([
		{ deck_id: deckId, myChar, oppChar, percentBand, situation, oppMove: oppMove || null, answerMD },
	]);
	if (error) {
		throw new Error(error.message);
	}
	revalidatePath(`/deck/${deckId}`);
}