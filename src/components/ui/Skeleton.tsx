import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-shimmer rounded-lg bg-gradient-to-r from-ink-800/50 via-ink-700/30 to-ink-800/50 bg-[length:1000px_100%]', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-xl p-5 space-y-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

export function GraphSkeleton() {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="flex items-center justify-between gap-4 pt-4">
        <Skeleton className="h-24 w-32 rounded-lg" />
        <Skeleton className="h-24 w-32 rounded-lg" />
        <Skeleton className="h-24 w-32 rounded-lg" />
        <Skeleton className="h-24 w-32 rounded-lg" />
      </div>
    </div>
  );
}
