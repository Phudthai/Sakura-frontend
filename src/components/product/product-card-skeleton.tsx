export default function ProductCardSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-card-border
                 shadow-none relative"
    >
      {/* Image placeholder */}
      <div className="w-full aspect-square skeleton-shimmer" />

      {/* Body */}
      <div className="px-3 py-2.5 space-y-2">
        <div className="h-2.5 rounded-full skeleton-shimmer" />
        <div className="h-2.5 rounded-full skeleton-shimmer" />
        <div className="h-2.5 rounded-full skeleton-shimmer w-[60%]" />
      </div>

      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(245,240,255,0.9) 40%, rgba(255,255,255,0) 80%)',
          animation: 'cardShimmer 1.4s ease-in-out infinite',
        }}
      />

      <style jsx>{`
        @keyframes cardShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

