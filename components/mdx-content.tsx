'use client'

import { Frame } from './frame'

interface MDXContentProps {
  content: string
}

// Simple markdown-like renderer for now - can be enhanced later
export function MDXContent({ content }: MDXContentProps) {
  // Basic markdown parsing - this is simplified for now
  const renderContent = (text: string) => {
    // Handle YouTube embeds
    text = text.replace(/\[YouTube:([^\]]+)\]/g, (_, id) => `
      <div class="aspect-video mb-4">
        <iframe src="https://www.youtube.com/embed/${id}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen 
                class="w-full h-full rounded-lg"></iframe>
      </div>
    `)
    
    // Handle basic markdown
    text = text.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
    text = text.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
    text = text.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-8">$1</h1>')
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
    text = text.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
    text = text.replace(/\n\n/g, '</p><p class="mb-2">')
    
    return text
  }

  return (
    <div className="prose prose-sm max-w-none">
      <p className="mb-2" dangerouslySetInnerHTML={{ __html: renderContent(content) }} />
    </div>
  )
}