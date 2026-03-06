import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { ProductDetail } from '@/types/product'

interface ProductMetaProps {
  product: ProductDetail
}

function MetaRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-6 py-3 border-b border-card-border last:border-b-0">
      <dt className="w-[140px] shrink-0 font-semibold text-sm text-sakura-900">
        {label}
      </dt>
      <dd className="text-sm text-sakura-900/80">{children}</dd>
    </div>
  )
}

export default function ProductMeta({ product }: ProductMetaProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-muted-dark mb-3">
        Product information
      </h2>
      <dl>
        {/* Categories */}
        <MetaRow label="Categories">
          <div className="flex items-center gap-1 flex-wrap">
            {product.categories.map((cat, i) => (
              <span key={i} className="flex items-center gap-1">
                <Link
                  href="#"
                  className="text-sakura-600 underline hover:text-sakura-700 transition-colors"
                >
                  {cat}
                </Link>
                {i < product.categories.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-muted" />
                )}
              </span>
            ))}
          </div>
        </MetaRow>

        {/* Product condition */}
        <MetaRow label="Product condition">
          <div>
            <p className="font-semibold">{product.condition}</p>
            <p className="text-xs text-muted-dark mt-0.5">
              {product.conditionDescription}
            </p>
          </div>
        </MetaRow>

        {/* Shipping cost */}
        <MetaRow label="Shipping costs">
          <span>{product.shippingCost}</span>
        </MetaRow>

        {/* Shipping method */}
        <MetaRow label="Shipping Method">
          <div>
            <p>{product.shippingMethod}</p>
            <span className="inline-block mt-1 text-[11px] border border-sakura-400
                             text-sakura-800 px-2 py-0.5 rounded">
              anonymous delivery
            </span>
          </div>
        </MetaRow>

        {/* Shipping region */}
        <MetaRow label="Shipping region">
          <span>{product.shippingRegion}</span>
        </MetaRow>

        {/* Shipping days */}
        <MetaRow label="Shipping days">
          <span>{product.shippingDays}</span>
        </MetaRow>
      </dl>
    </section>
  )
}

