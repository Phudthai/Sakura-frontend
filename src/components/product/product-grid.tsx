import type { Product } from '@/types/product'
import ProductCard from './product-card'
import ProductCardSkeleton from './product-card-skeleton'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  skeletonCount?: number
}

export default function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 24,
}: ProductGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-muted text-base">
        <p className="text-4xl mb-3">🔍</p>
        <p>No items found</p>
        <p className="text-sm mt-1">Try a different search term</p>
      </div>
    )
  }

  // Product grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}

