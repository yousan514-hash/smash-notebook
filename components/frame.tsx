interface FrameProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function Frame({ children, title, className = "" }: FrameProps) {
  return (
    <div className={`border rounded-lg p-4 bg-muted/50 ${className}`}>
      {title && (
        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">
          {title}
        </h4>
      )}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}