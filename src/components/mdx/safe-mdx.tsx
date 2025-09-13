'use client'

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from 'react'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { Frame } from './frame'
import { cn } from '@/lib/utils'

interface SafeMDXProps {
  content: string
  className?: string
}

const components = {
  Frame,
  // 他の許可されたコンポーネントもここに追加
}

export function SafeMDX({ content, className }: SafeMDXProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function compileMDX() {
      try {
        // 空の場合は何もしない
        if (!content.trim()) {
          setMdxSource(null)
          return
        }

        const serialized = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [
                rehypeSanitize,
                {
                  // 安全なタグのみ許可
                  tagNames: [
                    'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'ul', 'ol', 'li',
                    'blockquote',
                    'a',
                    'img',
                    'table', 'thead', 'tbody', 'tr', 'th', 'td',
                    'div', 'span',
                    // カスタムコンポーネント用
                    'Frame'
                  ],
                  attributes: {
                    '*': ['className', 'style'],
                    'a': ['href', 'title', 'target', 'rel'],
                    'img': ['src', 'alt', 'width', 'height', 'title'],
                    'Frame': ['title', 'description', 'variant']
                  },
                  // プロトコル制限
                  protocols: {
                    href: ['http', 'https', 'mailto'],
                    src: ['http', 'https']
                  }
                }
              ]
            ],
            development: process.env.NODE_ENV === 'development'
          }
        })

        setMdxSource(serialized)
        setError(null)
      } catch (err) {
        console.error('MDX compilation error:', err)
        setError('コンテンツの表示でエラーが発生しました')
        setMdxSource(null)
      }
    }

    compileMDX()
  }, [content])

  // エラーまたはコンテンツがない場合は通常のテキスト表示にフォールバック
  if (error || !mdxSource) {
    return (
      <div className={cn('mdx-content', className)}>
        {error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : (
          // 後方互換性：改行をbrタグに変換してテキスト表示
          <div className="whitespace-pre-wrap">
            {content.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < content.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('mdx-content', className)}>
      <MDXRemote {...mdxSource} components={components} />
    </div>
  )
}