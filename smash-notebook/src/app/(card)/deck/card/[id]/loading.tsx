export default function Loading() {
	return (
		<div className="space-y-4">
			<div className="h-5 w-64 animate-pulse rounded bg-gray-200" />
			<div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
			<div className="h-40 animate-pulse rounded-md border bg-white" />
		</div>
	);
}

