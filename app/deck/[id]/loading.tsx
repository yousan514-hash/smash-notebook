export default function Loading() {
	return (
		<main className="mx-auto max-w-3xl p-6 animate-pulse">
			<div className="h-6 w-48 rounded bg-gray-200" />
			<div className="mt-4 h-4 w-80 rounded bg-gray-100" />
			<div className="mt-6 space-y-3">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="rounded border bg-white p-4">
						<div className="h-4 w-1/2 rounded bg-gray-200" />
						<div className="mt-2 h-3 w-2/3 rounded bg-gray-100" />
					</div>
				))}
			</div>
		</main>
	);
}