"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ja">
      <body>
        <div className="p-6">
          <h2 className="text-xl font-semibold">重大なエラー</h2>
          <p className="text-sm text-gray-600">{error.message}</p>
          <button className="mt-4 rounded bg-gray-900 px-3 py-2 text-white" onClick={() => reset()}>再試行</button>
        </div>
      </body>
    </html>
  );
}
