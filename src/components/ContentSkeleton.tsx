export const ContentSkeleton = () => {
  return (
    <div className="card-dashboard p-6 space-y-4">
      <div className="shimmer h-48 rounded-lg" />
      <div className="space-y-2">
        <div className="shimmer h-4 rounded w-3/4" />
        <div className="shimmer h-4 rounded w-1/2" />
      </div>
      <div className="space-y-2">
        <div className="shimmer h-3 rounded w-full" />
        <div className="shimmer h-3 rounded w-4/5" />
        <div className="shimmer h-3 rounded w-2/3" />
      </div>
      <div className="flex justify-between items-center">
        <div className="shimmer h-6 rounded w-16" />
        <div className="shimmer h-8 rounded w-20" />
      </div>
    </div>
  );
};