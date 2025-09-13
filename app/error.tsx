"use client";
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">エラーが発生しました</h2>
      <p className="text-sm text-gray-600">{error.message}</p>
      <button className="mt-4 rounded bg-gray-900 px-3 py-2 text-white" onClick={() => reset()}>再試行</button>
    </div>
  );
}
