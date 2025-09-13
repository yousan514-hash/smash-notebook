"use client";
import Link from 'next/link';

export function ActionBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-3xl items-stretch justify-around p-2">
        <Link href="/?compose=1" className="tap-target flex flex-1 items-center justify-center rounded-md bg-gray-900 text-white">＋投稿</Link>
        <Link href="/deck/new" className="tap-target ml-2 flex flex-1 items-center justify-center rounded-md border">＋新規カード</Link>
      </div>
    </nav>
  );
}
