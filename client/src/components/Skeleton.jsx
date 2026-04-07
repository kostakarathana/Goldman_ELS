export function ResultsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Hero card skeleton */}
      <div className="skeleton h-48 rounded-2xl" />
      {/* Chart skeleton */}
      <div className="skeleton h-56 rounded-2xl" />
      {/* What-if skeleton */}
      <div className="skeleton h-56 rounded-2xl" />
      {/* Details skeleton */}
      <div className="skeleton h-40 rounded-2xl" />
    </div>
  );
}

export function FundListSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton h-10 rounded-lg" />
      ))}
    </div>
  );
}

export function CompareSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-48 mx-auto rounded-lg" />
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton h-36 rounded-xl" />
      ))}
    </div>
  );
}
