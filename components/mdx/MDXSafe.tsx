"use client";
import { useMemo } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Frame } from './Frame';
import { compileSync } from '@mdx-js/mdx';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import * as runtime from 'react/jsx-runtime';

type Props = { source?: string };

export function MDXSafe({ source }: Props) {
  const Content = useMemo(() => {
    if (!source) return null;
    // Allow only <Frame>
    const schema = {
      ...defaultSchema,
      tagNames: ['p', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre', 'blockquote', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr', 'Frame'],
      attributes: {
        ...defaultSchema.attributes,
        a: ['href', 'title', 'rel', 'target'],
      },
      clobberPrefix: '',
    } as Parameters<typeof rehypeSanitize>[0];

    const compiled = compileSafe(source, {
      rehypePlugins: [[rehypeSanitize, schema]],
      remarkPlugins: [remarkGfm, remarkBreaks],
      outputFormat: 'function-body',
      development: process.env.NODE_ENV !== 'production',
    });
    if (!compiled) return null;
    const { default: MDXContent } = getMdxComponent(compiled);
    return MDXContent;
  }, [source]);

  if (!source) {
    return null;
  }
  if (!Content) {
    // fallback: plain text with line breaks
    return (
      <pre className="whitespace-pre-wrap text-sm leading-6">
        {source}
      </pre>
    );
  }
  return (
    <MDXProvider components={{ Frame }}>
      <Content />
    </MDXProvider>
  );
}

function compileSafe(value: string, options: any) {
  let res: any = null;
  try {
    res = compileSync(value, options);
  } catch {
    res = null;
  }
  return res;
}

function getMdxComponent(code: any) {
  const fn = new Function(String(code));
  const mdxModule = { exports: {} } as any;
  fn.call(mdxModule.exports);
  const Content = (mdxModule as any).exports.default;
  return { default: (props: any) => Content({ ...props, ...runtime }) };
}
