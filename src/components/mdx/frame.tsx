import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const frameVariants = cva(
  'rounded-lg border p-4 my-4',
  {
    variants: {
      variant: {
        default: 'border-border bg-card',
        info: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
        warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
        danger: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
        success: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface FrameProps extends VariantProps<typeof frameVariants> {
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function Frame({ 
  title, 
  description, 
  children, 
  variant, 
  className 
}: FrameProps) {
  return (
    <div className={cn(frameVariants({ variant }), className)}>
      {title && (
        <h4 className="font-semibold text-sm mb-2">{title}</h4>
      )}
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}
      {children}
    </div>
  )
}