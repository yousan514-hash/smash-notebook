"use client";
export default function Error({ error }: { error: Error & { digest?: string } }) {
	return (
		<div className="rounded border bg-red-50 p-3 text-sm text-red-700">
			Failed to load feed.
		</div>
	);
}

