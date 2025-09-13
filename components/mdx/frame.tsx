import { cn } from '@/lib/utils'

interface FrameProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'success' | 'error'
  className?: string
}

export function Frame({ children, type = 'info', className }: FrameProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 my-4',
        type === 'info' && 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700',
        type === 'warning' && 'bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700',
        type === 'success' && 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700',
        type === 'error' && 'bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700',
        className
      )}
    >
      {children}
    </div>
  )
}