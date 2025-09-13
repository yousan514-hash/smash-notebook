import { maybeSupabase } from '@/src/lib/supabase';
import { PercentBand, Situation } from '@/src/types/domain';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { createCard } from './actions';

const bands: PercentBand[] = ['0-30', '40-70', '80+', 'Kill%'];
const situations: Situation[] = ['neutral', 'ledgetrap', 'edgeguard', 'recovery', 'combo', 'line'];


async function listDecks() {
  const supabase = maybeSupabase();
  if (!supabase) return [] as any[];
  const { data } = await supabase.from('decks').select('id,title').order('created_at', { ascending: false });
  return data ?? [];
}

export default async function NewCardPage({ searchParams }: { searchParams?: { deckId?: string } }) {
  const decks = await listDecks();
  const initialDeckId = searchParams?.deckId || '';
  return (
    <main className="space-y-4">
      <h2 className="text-lg font-semibold">New Card</h2>
      <form action={createCard} className="space-y-2 rounded-md border p-3 dark:border-gray-800">
        <label className="block text-sm">Deck</label>
        <Select name="deckId" defaultValue={initialDeckId} required>
          <option value="" disabled>Select a deck</option>
          {decks.map((d) => (
            <option key={d.id} value={d.id}>{d.title}</option>
          ))}
        </Select>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-sm">My Character</label>
            <Input name="myChar" required placeholder="e.g. Mario" />
          </div>
          <div>
            <label className="block text-sm">Opponent Character</label>
            <Input name="oppChar" required placeholder="e.g. Fox" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div>
            <label className="block text-sm">Percent Band</label>
            <Select name="percentBand" required defaultValue={bands[0]}>
              {bands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm">Situation</label>
            <Select name="situation" required defaultValue={situations[0]}>
              {situations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm">Opponent Move (optional)</label>
            <Input name="oppMove" placeholder="e.g. Nair on shield" />
          </div>
        </div>

        <label className="block text-sm">Answer (MDX)</label>
        <Textarea name="answerMD" rows={8} placeholder="You can use MDX. Try <Frame>note</Frame> or <YouTube id='...'/>"></Textarea>

        <div className="pt-1">
          <Button type="submit">Save Card</Button>
        </div>
      </form>
    </main>
  );
}

