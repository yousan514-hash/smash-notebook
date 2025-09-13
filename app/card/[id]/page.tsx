"use client";
import { useEffect, useState } from 'react';
import { TagInput } from '@/components/tags/TagInput';
import { useRouter } from 'next/navigation';

export default function CardEditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [percentBand, setPercentBand] = useState<number>(0);
  const [situation, setSituation] = useState('NEUTRAL');
  const [oppMove, setOppMove] = useState<string>('');
  const [answerMD, setAnswerMD] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch(`/api/card/${id}/get`);
      if (res.ok) {
        const d = await res.json();
        if (!mounted) return;
        setTitle(d.title);
        setPercentBand(d.percentBand);
        setSituation(d.situation);
        setOppMove(d.oppMove || '');
        setAnswerMD(d.answerMD || '');
        setTags(d.tags || []);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <main className="p-4">読み込み中…</main>;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">カード編集</h1>
      <input className="w-full rounded border px-2 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <input className="rounded border px-2 py-2" value={percentBand} onChange={(e) => setPercentBand(Number(e.target.value))} placeholder="%帯" />
        <input className="rounded border px-2 py-2" value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="状況" />
        <input className="rounded border px-2 py-2" value={oppMove} onChange={(e) => setOppMove(e.target.value)} placeholder="相手技" />
      </div>
      <textarea className="h-40 w-full rounded border p-2" value={answerMD} onChange={(e) => setAnswerMD(e.target.value)} />
      <TagInput value={tags} onChange={setTags} />
      <div className="flex gap-2">
        <button className="rounded bg-gray-900 px-3 py-2 text-white" onClick={async () => {
          const res = await fetch(`/api/card/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, percentBand, situation, oppMove, answerMD, tags }) });
          if (res.ok) router.back();
        }}>保存</button>
      </div>
    </main>
  );
}
