type FrameProps = {
	children: React.ReactNode;
	title?: string;
};

export default function Frame({ children, title }: FrameProps) {
	return (
		<section className="rounded-md border bg-white">
			{title ? (
				<header className="border-b px-3 py-2 text-sm font-medium text-gray-700">
					{title}
				</header>
			) : null}
			<div className="p-3 prose prose-sm max-w-none">{children}</div>
		</section>
	);
}

