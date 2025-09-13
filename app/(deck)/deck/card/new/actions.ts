import { maybeSupabase } from '@/src/lib/supabase';
import { PercentBand, Situation } from '@/src/types/domain';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const schema = z.object({
  deckId: z.string().min(1),
  myChar: z.string().min(1).max(40),
  oppChar: z.string().min(1).max(40),
  percentBand: z.enum(['0-30', '40-70', '80+', 'Kill%']),
  situation: z.enum(['neutral', 'ledgetrap', 'edgeguard', 'recovery', 'combo', 'line']),
  oppMove: z.string().max(60).optional(),
  answerMD: z.string().min(1)
});

export async function createCard(formData: FormData) {
  'use server';
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse({
    deckId: String(raw.deckId || ''),
    myChar: String(raw.myChar || ''),
    oppChar: String(raw.oppChar || ''),
    percentBand: String(raw.percentBand || '') as PercentBand,
    situation: String(raw.situation || '') as Situation,
    oppMove: raw.oppMove ? String(raw.oppMove) : undefined,
    answerMD: String(raw.answerMD || '')
  });
  if (!parsed.success) {
    return;
  }
  const supabase = maybeSupabase();
  if (!supabase) return;
  const { error } = await supabase.from('cards').insert({
    deckId: parsed.data.deckId,
    myChar: parsed.data.myChar,
    oppChar: parsed.data.oppChar,
    percentBand: parsed.data.percentBand,
    situation: parsed.data.situation,
    oppMove: parsed.data.oppMove ?? null,
    answerMD: parsed.data.answerMD
  });
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    return;
  }
  redirect(`/deck/${parsed.data.deckId}`);
}
