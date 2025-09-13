import { maybeSupabase } from '@/src/lib/supabase';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui';
import type { Card, Deck } from '@/src/types/domain';
import { deleteCard } from './actions';

async function getDeck(id: string) {
  const supabase = maybeSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('decks').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Deck;
}

async function getCards(deckId: string) {
  const supabase = maybeSupabase();
  if (!supabase) return [] as Card[];
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('deckId', deckId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Card[];
}

export default async function DeckDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const [deck, cards] = await Promise.all([getDeck(id), getCards(id)]);
    return (
      <main className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{deck.title}</h2>
            {deck.description ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">{deck.description}</p>
            ) : null}
          </div>
          <a className="underline" href={`/deck/card/new?deckId=${deck.id}`}>Add Card</a>
        </div>

        <ul className="divide-y rounded-md border dark:divide-gray-900 dark:border-gray-800">
          {cards.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 p-3">
              <div className="space-y-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-900">{c.percentBand}</span>
                  <span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs capitalize dark:bg-gray-900">{c.situation}</span>
                  <span className="text-xs">{c.myChar} vs {c.oppChar}</span>
                </div>
                {c.oppMove ? (
                  <div className="text-xs">Opp move: {c.oppMove}</div>
                ) : null}
                <p className="line-clamp-2 text-sm opacity-90">{c.answerMD}</p>
              </div>
              <form action={deleteCard}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="deckId" value={deck.id} />
                <Button type="submit" className="border-red-600 text-red-700 dark:border-red-900 dark:text-red-400">Delete</Button>
              </form>
            </li>
          ))}
          {cards.length === 0 && (
            <li className="p-3 text-sm text-gray-600 dark:text-gray-400">No cards yet.</li>
          )}
        </ul>
      </main>
    );
  } catch (e) {
    return notFound();
  }
}

