'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/layout/header'
import Breadcrumb from '@/components/product/breadcrumb'
import ImageGallery from '@/components/product/image-gallery'
import ProductInfo from '@/components/product/product-info'
import { MOCK_PRODUCT_DETAILS } from '@/lib/constants'

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const product = MOCK_PRODUCT_DETAILS[params.id]

  const handleSearch = (keyword: string) => {
    // Navigate back to listing with search
    window.location.href = `/?q=${encodeURIComponent(keyword)}`
  }

  // Not found
  if (!product) {
    return (
      <div className="min-h-screen bg-body">
        <Header onSearch={handleSearch} />
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-16 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-xl font-semibold text-sakura-900 mb-2">
            Product not found
          </h2>
          <p className="text-muted mb-6">
            The item you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 btn-gradient"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listing
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body">
      <Header onSearch={handleSearch} />

      <div className="max-w-[1100px] mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <Breadcrumb items={product.categories} />

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 pb-12">
          {/* Left: Image gallery */}
          <div className="lg:w-[55%] shrink-0">
            <div className="sticky top-[72px]">
              <ImageGallery images={product.images} alt={product.name} />
            </div>
          </div>

          {/* Right: Product info */}
          <div className="flex-1 min-w-0">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}

