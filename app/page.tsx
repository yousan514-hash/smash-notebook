"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { captureEvent } from '@/lib/analytics';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [body, setBody] = useState('');
  const router = useRouter();
  const extraction = useMemo(() => extractHints(body), [body]);
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Feed</h1>
      <div className="rounded border p-3">
        <textarea className="h-28 w-full rounded border p-2" placeholder="投稿を書く…" value={body} onChange={(e) => setBody(e.target.value)} />
        {extraction && (
          <div className="mt-2 text-xs text-gray-600">
            推定: %帯 {extraction.percentBand ?? '-'} / 技 {extraction.oppMove ?? '-'}
          </div>
        )}
        <div className="mt-2 flex gap-2">
          <button className="rounded bg-gray-900 px-3 py-2 text-white" onClick={() => captureEvent('post_created')}>投稿</button>
          <button
            className="rounded border px-3 py-2"
            onClick={async () => {
              captureEvent('draft_from_post_clicked');
              const deckId = prompt('デッキIDを入力（簡易）');
              if (!deckId) return;
              const res = await fetch('/api/posts/draft-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deckId, body, title: '投稿から作成' }),
              });
              if (res.ok) {
                const data = await res.json();
                router.push(`/deck/${deckId}`);
              }
            }}
          >この投稿からカード草稿を作成</button>
        </div>
      </div>
    </main>
  );
}

function extractHints(text: string): { percentBand?: number; oppMove?: string } | null {
  if (!text) return null;
  const percentMatch = text.match(/\b(0{2}|50|80|Kill)\s*%?/i);
  const percentMap: any = { '00': 0, '50': 50, '80': 80, Kill: 999 };
  const percentBand = percentMatch ? percentMap[percentMatch[1]] : undefined;
  // very naive: 技名はカタカナ連続を拾う
  const moveMatch = text.match(/[ァ-ヴー]{2,}/);
  const oppMove = moveMatch?.[0];
  return { percentBand, oppMove };
}
