import { maybeSupabase } from '@/src/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function deleteCard(formData: FormData) {
  'use server';
  const id = String(formData.get('id') || '');
  const deckId = String(formData.get('deckId') || '');
  if (!id) return;
  const supabase = maybeSupabase();
  if (!supabase) return;
  const { error } = await supabase.from('cards').delete().eq('id', id);
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
  revalidatePath(`/deck/${deckId}`);
}
