"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<main className="mx-auto max-w-4xl p-6">
			<h2 className="text-lg font-semibold text-red-600">エラーが発生しました</h2>
			<p className="mt-2 text-gray-600">{error.message}</p>
			<button
				className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				onClick={() => reset()}
			>
				再試行
			</button>
		</main>
	);
}