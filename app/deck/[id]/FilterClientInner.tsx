"use client";
import { PropsWithChildren, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { loadRecentDeckFilters, readDeckFilterFromSearchParams, saveRecentDeckFilter, writeDeckFilterToSearchParams } from '@/lib/filters';
import { captureEvent } from '@/lib/analytics';

export default function FilterClientInner({ name, multiple, initialValue, children }: PropsWithChildren<{ name: string; multiple?: boolean; initialValue: string | string[] }>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const el = (children as any).ref?.current || undefined;
    // not relying on ref; attaching event handlers via cloning
  }, [children]);

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (!multiple) {
      if (!value) params.delete(name);
      else params.set(name, value);
    } else {
      params.delete(name);
      value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .forEach((v) => params.append(name, v));
    }
    const filter = readDeckFilterFromSearchParams(params);
    saveRecentDeckFilter(filter);
    captureEvent('filter_changed', { name, value, filter });
    router.replace(`${pathname}?${params.toString()}`);
  };

  const props: any = {};
  if (children.type === 'select') {
    props.onChange = (e: any) => onChange(e.target.value);
  } else if (children.type === 'input') {
    props.onChange = (e: any) => onChange(e.target.value);
  }

  return (
    <div className="relative">
      {cloneElement(children as any, props)}
      {/* recent filters UI (lightweight) */}
      <RecentInline />
    </div>
  );
}

import { cloneElement } from 'react';

function RecentInline() {
  const recents = typeof window !== 'undefined' ? loadRecentDeckFilters() : [];
  if (!recents.length) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-gray-500">
      {recents.map((r, i) => (
        <span key={i} className="rounded bg-gray-100 px-1 py-0.5">
          {r.percentBand ?? '-'} / {r.situation ?? '-'} {r.oppMove ? ` / ${r.oppMove}` : ''}
        </span>
      ))}
    </div>
  );
}
