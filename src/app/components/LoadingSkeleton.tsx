export function CardSkeleton() {
  return (
    <div className="bg-white border-2 border-[#E0D8D0] p-6 animate-pulse">
      <div className="h-6 bg-[#E0D8D0] rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-[#E0D8D0] rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-[#E0D8D0] rounded"></div>
        <div className="h-3 bg-[#E0D8D0] rounded w-5/6"></div>
        <div className="h-3 bg-[#E0D8D0] rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-white border border-[#E8E0D8] p-6 animate-pulse">
      <div className="h-4 bg-[#E0D8D0] rounded w-20 mb-2"></div>
      <div className="h-10 bg-[#E0D8D0] rounded w-16"></div>
    </div>
  );
}

export function CommunityCardSkeleton() {
  return (
    <div className="bg-white border border-[#E0D8D0] rounded-lg p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#E0D8D0]"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-[#E0D8D0] rounded w-3/4"></div>
          <div className="h-4 bg-[#E0D8D0] rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-[#E0D8D0] rounded"></div>
            <div className="h-3 bg-[#E0D8D0] rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
