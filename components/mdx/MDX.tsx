import { MDXRemote } from 'next-mdx-remote/rsc';
import { Frame } from '@/components/Frame';
import React from 'react';

function YouTube({ id }: { id: string }) {
  const src = `https://www.youtube.com/embed/${id}`;
  return (
    <div className="my-3 aspect-video w-full overflow-hidden rounded-md">
      <iframe
        className="h-full w-full"
        src={src}
        title="YouTube video player"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

const components = {
  Frame,
  YouTube
};

export function MDX({ source }: { source: string }) {
  return <MDXRemote source={source} components={components as any} />;
}
