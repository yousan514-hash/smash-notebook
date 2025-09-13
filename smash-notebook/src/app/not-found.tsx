import Link from "next/link";

export default function NotFound() {
	return (
		<div className="space-y-3">
			<h1 className="text-xl font-semibold">Not found</h1>
			<p className="text-sm text-gray-600">The requested resource could not be found.</p>
			<Link href="/" className="text-sm underline">Go home</Link>
		</div>
	);
}

