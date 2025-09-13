"use client";
import { type PercentBand, type Situation, type Card } from "@/types/domain";

type CardFormProps = {
  defaultDeckId?: string;
  defaultValues?: Partial<Card>;
  action: (form: FormData) => void;
};

const percentBands: PercentBand[] = ["0-30", "40-70", "80+", "Kill%"];
const situations: Situation[] = [
  "neutral",
  "ledgetrap",
  "edgeguard",
  "recovery",
  "combo",
  "line",
];

export default function CardForm({ defaultDeckId, defaultValues, action }: CardFormProps) {
  return (
    <form className="space-y-3" action={action}>
      {defaultDeckId ? <input type="hidden" name="deck_id" value={defaultDeckId} /> : null}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">My Character</label>
          <input name="myChar" defaultValue={defaultValues?.myChar} className="mt-1 w-full rounded border p-2 text-sm" required />
        </div>
        <div>
          <label className="text-sm font-medium">Opponent Character</label>
          <input name="oppChar" defaultValue={defaultValues?.oppChar} className="mt-1 w-full rounded border p-2 text-sm" required />
        </div>
        <div>
          <label className="text-sm font-medium">Percent Band</label>
          <select name="percentBand" defaultValue={defaultValues?.percentBand ?? "0-30"} className="mt-1 w-full rounded border p-2 text-sm">
            {percentBands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Situation</label>
          <select name="situation" defaultValue={defaultValues?.situation ?? "neutral"} className="mt-1 w-full rounded border p-2 text-sm">
            {situations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Opponent Move (optional)</label>
        <input name="oppMove" defaultValue={defaultValues?.oppMove ?? undefined} className="mt-1 w-full rounded border p-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium">Answer (MDX)</label>
        <textarea name="answerMD" rows={10} defaultValue={defaultValues?.answerMD} placeholder={"Use MDX. You can embed <YouTube id=\"...\" /> or wrap in <Frame />."} className="mt-1 w-full rounded border p-2 text-sm font-mono" required />
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">Save Card</button>
      </div>
    </form>
  );
}

