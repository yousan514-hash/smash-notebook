"use client";
import { useEffect, useMemo, useState } from 'react';
import { captureEvent } from '@/lib/analytics';

type Props = {
  suggestions?: string[];
  value: string[];
  onChange: (tags: string[]) => void;
};

export function TagInput({ suggestions = [], value, onChange }: Props) {
  const [input, setInput] = useState('');
  const [autoSuggest, setAutoSuggest] = useState<string[]>([]);
  const baseSuggestions = suggestions.length ? suggestions : autoSuggest;
  const filtered = useMemo(() => baseSuggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)).slice(0, 8), [input, baseSuggestions, value]);

  useEffect(() => {
    if (suggestions.length) return;
    fetch('/api/tags/suggest').then((r) => r.json()).then((d) => setAutoSuggest(d.names || [])).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = (t: string) => {
    if (!t) return;
    const set = Array.from(new Set([...value, t]));
    onChange(set);
    setInput('');
    captureEvent('tag_added', { name: t });
  };
  const remove = (t: string) => {
    captureEvent('tag_removed', { name: t });
    onChange(value.filter((v) => v !== t));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {value.map((t) => (
          <button key={t} type="button" className="tap-target rounded-full bg-gray-100 px-2 py-1 text-xs" onClick={() => remove(t)}>
            {t} ×
          </button>
        ))}
      </div>
      <input className="mt-2 w-full rounded border px-2 py-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="タグを入力" onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          add(input.trim());
        }
      }} />
      {filtered.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1 text-xs">
          {filtered.map((s) => (
            <button key={s} className="rounded bg-gray-100 px-2 py-1" type="button" onClick={() => add(s)}>{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}
