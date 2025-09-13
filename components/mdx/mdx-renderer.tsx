'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from 'react'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { Frame } from './frame'

// 許可するHTMLタグとコンポーネント
const allowedComponents = {
  Frame,
}

// rehype-sanitizeのスキーマをカスタマイズ
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'frame', // Frameコンポーネント用
  ],
  attributes: {
    ...defaultSchema.attributes,
    frame: ['type', 'className'],
  },
}

interface MDXRendererProps {
  content: string
}

export function MDXRenderer({ content }: MDXRendererProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderMDX = async () => {
      try {
        // MDXコンテンツかプレーンテキストかを判定
        const isMDX = content.includes('<Frame') || content.includes('```') || content.includes('#')
        
        if (isMDX) {
          // MDXとしてパース
          const serialized = await serialize(content, {
            mdxOptions: {
              rehypePlugins: [
                [rehypeSanitize, sanitizeSchema]
              ],
            },
          })
          setMdxSource(serialized)
        } else {
          // プレーンテキストの場合は改行をbrタグに変換
          const formatted = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('<br />')
          
          const serialized = await serialize(formatted, {
            mdxOptions: {
              rehypePlugins: [
                [rehypeSanitize, sanitizeSchema]
              ],
            },
          })
          setMdxSource(serialized)
        }
        setError(null)
      } catch (err) {
        console.error('MDX rendering error:', err)
        setError('コンテンツの表示中にエラーが発生しました')
        
        // エラー時はプレーンテキストとして表示
        try {
          const plainText = content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          const serialized = await serialize(plainText, {
            mdxOptions: {
              rehypePlugins: [[rehypeSanitize, defaultSchema]],
            },
          })
          setMdxSource(serialized)
        } catch {
          // それでもダメな場合は何も表示しない
          setMdxSource(null)
        }
      }
    }

    renderMDX()
  }, [content])

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400 text-sm">
        {error}
      </div>
    )
  }

  if (!mdxSource) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="mdx-content">
      <MDXRemote {...mdxSource} components={allowedComponents} />
    </div>
  )
}