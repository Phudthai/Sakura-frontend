'use client'

import { useState, useMemo, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/header'
import FilterSidebar from '@/components/ui/filter-sidebar'
import ProductGrid from '@/components/product/product-grid'
import Pagination from '@/components/ui/pagination'
import SearchLinkTab from '@/components/search-link/search-link-tab'
import { MOCK_PRODUCTS, FILTER_GROUPS } from '@/lib/constants'

const ITEMS_PER_PAGE = 20

const TABS = [
  { id: 'product_list', label: 'สินค้า' },
  { id: 'search_link', label: 'ประมูลด้วยตนเอง' },
] as const

type TabId = (typeof TABS)[number]['id']

function HomeContent() {
  const searchParams = useSearchParams()
  const tab = (searchParams.get('tab') as TabId) ?? 'product_list'

  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Filter products by search keyword
  const filteredProducts = useMemo(() => {
    if (!searchKeyword) return MOCK_PRODUCTS
    const keyword = searchKeyword.toLowerCase()
    return MOCK_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    )
  }, [searchKeyword])

  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  // Handlers
  const handleSearch = useCallback((keyword: string) => {
    setIsLoading(true)
    setSearchKeyword(keyword)
    setCurrentPage(1)
    // Simulate network delay for demo skeleton
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleNext = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [totalPages])

  return (
    <div className="min-h-screen bg-body">
      {/* Header */}
      <Header onSearch={tab === 'product_list' ? handleSearch : undefined} />

      {/* Tab bar */}
      <div className="border-b border-controls-border bg-controls-bg">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/?tab=${t.id}`}
            className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
              ${tab === t.id
                ? 'border-sakura-700 text-sakura-900'
                : 'border-transparent text-muted-dark hover:text-sakura-800 hover:border-sakura-300'
              }`}
          >
            {t.label}
          </Link>
        ))}
        </div>
      </div>

      {/* Tab: product_list */}
      {tab === 'product_list' && (
        <>
          {/* Controls bar */}
          <div
            className="flex items-center gap-3 px-4 md:px-6 py-3
                       bg-controls-bg border-b border-controls-border flex-wrap"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sakura-200/60 text-sakura-800">
                Recommended
              </span>
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {['コスメ', 'ゲーム', 'フィギュア', 'スニーカー', 'バッグ'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full border border-sakura-300
                           text-sakura-800 bg-white hover:bg-sakura-100 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Item count */}
            <span className="ml-auto text-xs text-muted-dark">
              {filteredProducts.length.toLocaleString()} items
            </span>
          </div>

          {/* Main content */}
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
            <div className="flex gap-6">
              <FilterSidebar groups={FILTER_GROUPS} />
              <main className="flex-1 min-w-0">
                {searchKeyword && (
                  <h2 className="text-base font-medium text-sakura-900 mb-4">
                    Search results for &quot;{searchKeyword}&quot;
                  </h2>
                )}
                <ProductGrid products={paginatedProducts} isLoading={isLoading} />
                <Pagination
                  hasPrev={currentPage > 1}
                  hasNext={currentPage < totalPages}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              </main>
            </div>
          </div>
        </>
      )}

      {/* Tab: search_link */}
      {tab === 'search_link' && <SearchLinkTab />}
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}

