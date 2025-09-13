import { MDXProvider } from '@mdx-js/react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { createElement } from 'react'

// Custom components that are allowed in MDX
const Frame = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50" {...props}>
    {children}
  </div>
)

const components = {
  Frame,
  // Allow standard HTML elements
  h1: (props: any) => <h1 className="text-2xl font-bold mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-xl font-semibold mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-lg font-medium mb-2" {...props} />,
  p: (props: any) => <p className="mb-2" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-2" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  strong: (props: any) => <strong className="font-semibold" {...props} />,
  em: (props: any) => <em className="italic" {...props} />,
  code: (props: any) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />,
  pre: (props: any) => <pre className="bg-gray-100 p-4 rounded overflow-x-auto" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-gray-300 pl-4 italic" {...props} />,
}

// Processor for safe MDX rendering
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(rehypeSanitize, {
    tagNames: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre', 'blockquote', 'Frame'],
    attributes: {
      '*': ['className', 'id'],
      'Frame': ['className', 'id', 'style'],
    }
  })

interface SafeMDXProps {
  content: string
  className?: string
}

export function SafeMDX({ content, className }: SafeMDXProps) {
  try {
    // Process the MDX content safely
    const processed = processor.processSync(content)
    
    return (
      <MDXProvider components={components}>
        <div className={className}>
          {createElement('div', { dangerouslySetInnerHTML: { __html: processed.toString() } })}
        </div>
      </MDXProvider>
    )
  } catch (error) {
    console.error('MDX processing error:', error)
    // Fallback to plain text with line breaks
    return (
      <div className={className}>
        {content.split('\n').map((line, index) => (
          <p key={index} className="mb-2">
            {line || '\u00A0'} {/* Non-breaking space for empty lines */}
          </p>
        ))}
      </div>
    )
  }
}

// Component for rendering card answers with backward compatibility
interface CardAnswerProps {
  answerMD: string
  className?: string
}

export function CardAnswer({ answerMD, className }: CardAnswerProps) {
  // Check if content contains MDX syntax
  const hasMDXSyntax = /<[A-Z]|```|#{1,6}\s|^\*\s|^\d+\.\s/m.test(answerMD)
  
  if (hasMDXSyntax) {
    return <SafeMDX content={answerMD} className={className} />
  }
  
  // Fallback to plain text with line breaks for backward compatibility
  return (
    <div className={className}>
      {answerMD.split('\n').map((line, index) => (
        <p key={index} className="mb-2">
          {line || '\u00A0'}
        </p>
      ))}
    </div>
  )
}