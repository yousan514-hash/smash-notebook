import CardForm from "@/components/CardForm";
import { getSupabaseServer } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { type Card } from "@/types/domain";

export const dynamic = "force-dynamic";

async function fetchCard(id: string): Promise<Card | null> {
  const supabase = getSupabaseServer();
  const { data } = await supabase.from("cards").select("*").eq("id", id).single();
  return (data as any) ?? null;
}

export default async function EditCardPage({ params }: { params: { id: string } }) {
  const card = await fetchCard(params.id);
  if (!card) return notFound();

  async function updateCard(formData: FormData) {
    "use server";
    const supabase = getSupabaseServer();
    const payload = {
      myChar: String(formData.get("myChar") || ""),
      oppChar: String(formData.get("oppChar") || ""),
      percentBand: String(formData.get("percentBand") || "0-30"),
      situation: String(formData.get("situation") || "neutral"),
      oppMove: String(formData.get("oppMove") || "") || null,
      answerMD: String(formData.get("answerMD") || ""),
    };
    await supabase.from("cards").update(payload).eq("id", params.id);
    revalidatePath(`/deck/card/${params.id}`);
    redirect(`/deck/card/${params.id}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Edit Card</h1>
        <Link href={`/deck/card/${params.id}`} className="ml-auto text-sm underline">Cancel</Link>
      </div>
      <CardForm action={updateCard} defaultValues={card} />
    </div>
  );
}

