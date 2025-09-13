export default function Loading() {
	return (
		<div className="space-y-4">
			<div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
			<div className="flex gap-2">
				<div className="h-9 w-full animate-pulse rounded border bg-white" />
				<div className="h-9 w-24 animate-pulse rounded border bg-white" />
			</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<div className="h-20 animate-pulse rounded-md border bg-white" />
				<div className="h-20 animate-pulse rounded-md border bg-white" />
			</div>
		</div>
	);
}

