import { maybeSupabase } from '@/src/lib/supabase';
import { Button, Input, Textarea } from '@/components/ui';
import { createDeck, deleteDeck } from './actions';

export const dynamic = 'force-dynamic';

async function listDecks() {
  const supabase = maybeSupabase();
  if (!supabase) return [] as any[];
  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export default async function DeckIndexPage() {
  const decks = await listDecks();
  return (
    <main className="space-y-6">
      <section>
        <h2 className="mb-2 text-lg font-semibold">Create Deck</h2>
        <form action={createDeck} className="space-y-2 rounded-md border p-3 dark:border-gray-800">
          <label className="block text-sm">Title</label>
          <Input name="title" required placeholder="e.g. Fox MU" />
          <label className="block text-sm">Description</label>
          <Textarea name="description" placeholder="Optional" rows={3} />
          <div className="pt-1">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Your Decks</h2>
        <ul className="divide-y rounded-md border dark:divide-gray-900 dark:border-gray-800">
          {decks.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 p-3">
              <div>
                <a className="font-medium underline" href={`/deck/${d.id}`}>{d.title}</a>
                {d.description ? (
                  <p className="text-xs text-gray-600 dark:text-gray-400">{d.description}</p>
                ) : null}
              </div>
              <form action={deleteDeck}>
                <input type="hidden" name="id" value={d.id} />
                <Button type="submit" className="border-red-600 text-red-700 dark:border-red-900 dark:text-red-400">Delete</Button>
              </form>
            </li>
          ))}
          {decks.length === 0 && (
            <li className="p-3 text-sm text-gray-600 dark:text-gray-400">No decks yet.</li>
          )}
        </ul>
      </section>
    </main>
  );
}


