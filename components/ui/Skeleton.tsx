export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

export function Empty({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-gray-600">
      <div className="h-10 w-10 rounded-full bg-gray-100" />
      <div className="text-sm font-medium">{title}</div>
      {description ? <div className="text-xs">{description}</div> : null}
    </div>
  );
}
