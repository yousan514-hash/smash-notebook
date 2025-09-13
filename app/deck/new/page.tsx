"use client";
import { useEffect, useMemo, useState } from 'react';
import { TagInput } from '@/components/tags/TagInput';
import { MDXSafe } from '@/components/mdx/MDXSafe';
import { captureEvent } from '@/lib/analytics';
import { useRouter, useSearchParams } from 'next/navigation';

type TemplateRow = {
  id: string;
  title: string;
  targetChar: string;
  section: string;
  percent: number;
  oppMove?: string | null;
  answerMD: string;
};

export default function NewDeckItemPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [raw, setRaw] = useState('');
  const [rows, setRows] = useState<TemplateRow[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [deckId, setDeckId] = useState<string>(sp?.get('deckId') || '');

  const parsed = useMemo(() => {
    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
    const res: TemplateRow[] = [];
    for (const [i, line] of lines.entries()) {
      // CSV-like: title | targetChar | section | percent | oppMove | answerMD
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length < 5) continue;
      const [title, targetChar, section, percentStr, oppMove, ...mdRest] = parts;
      const percent = Number(percentStr);
      const answerMD = mdRest.join(' | ');
      res.push({ id: String(i), title, targetChar, section, percent: Number.isFinite(percent) ? percent : 0, oppMove: oppMove || undefined, answerMD });
    }
    return res;
  }, [raw]);

  useEffect(() => {
    setRows(parsed);
    setChecked((prev) => Object.fromEntries(parsed.map((r) => [r.id, prev[r.id] ?? true])));
  }, [parsed]);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">00テンプレを展開</h1>
      <div className="flex gap-2">
        <input className="w-64 rounded border px-2 py-2" placeholder="デッキID" value={deckId} onChange={(e) => setDeckId(e.target.value)} />
      </div>
      <textarea className="h-40 w-full rounded border p-2" placeholder="title | targetChar | section | percent | oppMove | answerMD" value={raw} onChange={(e) => setRaw(e.target.value)} />

      {rows.length > 0 && (
        <div className="overflow-hidden rounded border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">選択</th>
                <th className="p-2 text-left">タイトル</th>
                <th className="p-2 text-left">対象</th>
                <th className="p-2 text-left">セクション</th>
                <th className="p-2 text-left">%帯</th>
                <th className="p-2 text-left">相手技</th>
                <th className="p-2 text-left">回答プレビュー</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2"><input type="checkbox" checked={!!checked[r.id]} onChange={(e) => setChecked({ ...checked, [r.id]: e.target.checked })} /></td>
                  <td className="p-2">{r.title}</td>
                  <td className="p-2">{r.targetChar}</td>
                  <td className="p-2">{r.section}</td>
                  <td className="p-2">{r.percent}</td>
                  <td className="p-2">{r.oppMove}</td>
                  <td className="p-2 max-w-[360px]"><div className="prose prose-sm max-w-none"><MDXSafe source={r.answerMD} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="tap-target rounded bg-gray-900 px-3 py-2 text-white" onClick={async () => {
        const selected = rows.filter((r) => checked[r.id]);
        if (!deckId) {
          alert('デッキIDを入力してください');
          return;
        }
        const res = await fetch(`/api/deck/${deckId}/cards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: selected.map((r) => ({
            title: r.title,
            percent: r.percent,
            section: r.section,
            oppMove: r.oppMove || undefined,
            answerMD: r.answerMD,
            tags: r.section ? [r.section] : [],
          })) }),
        });
        if (res.ok) {
          captureEvent('template_drafts_created', { count: selected.length });
          router.push(`/deck/${deckId}`);
        }
      }}>下書きカードを作成</button>
    </main>
  );
}
