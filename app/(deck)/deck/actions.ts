import { maybeSupabase } from '@/src/lib/supabase';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createDeckSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional()
});

export async function createDeck(formData: FormData) {
  'use server';
  const raw = {
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || '')
  };
  const parsed = createDeckSchema.safeParse({
    title: raw.title,
    description: raw.description || undefined
  });
  if (!parsed.success) {
    return;
  }
  const supabase = maybeSupabase();
  if (!supabase) return;
  const { error } = await supabase.from('decks').insert({
    title: parsed.data.title,
    description: parsed.data.description ?? null
  });
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
  revalidatePath('/deck');
}

export async function deleteDeck(formData: FormData) {
  'use server';
  const id = String(formData.get('id') || '');
  if (!id) return;
  const supabase = maybeSupabase();
  if (!supabase) return;
  const { error } = await supabase.from('decks').delete().eq('id', id);
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
  revalidatePath('/deck');
}
