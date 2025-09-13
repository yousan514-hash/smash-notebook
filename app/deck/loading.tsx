export default function Loading() {
	return (
		<main className="mx-auto max-w-4xl p-6 animate-pulse">
			<div className="h-6 w-40 rounded bg-gray-200" />
			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="rounded border bg-white p-4 shadow-sm">
						<div className="h-5 w-2/3 rounded bg-gray-200" />
						<div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
					</div>
				))}
			</div>
		</main>
	);
}