import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Frame from "@/components/mdx/Frame";
import YouTube from "@/components/mdx/YouTube";

const components = {
	Frame,
	YouTube,
};

export function RenderMDX({ source }: { source: string }) {
	return (
		<MDXRemote
			source={source}
			components={components}
			options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
		/>
	);
}

