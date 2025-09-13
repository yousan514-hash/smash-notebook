type YouTubeProps = {
	id: string;
	title?: string;
};

export default function YouTube({ id, title }: YouTubeProps) {
	return (
		<div className="aspect-video w-full overflow-hidden rounded-md border bg-black">
			<iframe
				title={title ?? "YouTube video"}
				className="h-full w-full"
				src={`https://www.youtube-nocookie.com/embed/${id}`}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
			/>
		</div>
	);
}

