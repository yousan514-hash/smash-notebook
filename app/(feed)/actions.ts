"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function createPost(formData: FormData) {
	const content = String(formData.get("content") || "").trim();
	const linked_card = String(formData.get("linked_card") || "").trim();
	if (!content) {
		throw new Error("本文は必須です");
	}
	const supabase = supabaseServer();
	const { error } = await supabase.from("posts").insert([
		{
			content,
			linked_card: linked_card || null,
		},
	]);
	if (error) throw new Error(error.message);
	revalidatePath("/");
}