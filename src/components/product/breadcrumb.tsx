import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  items: string[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-dark flex-wrap py-4">
      <Link
        href="/"
        className="hover:text-sakura-600 transition-colors text-sakura-600 underline"
      >
        Home
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          {index < items.length - 1 ? (
            <Link
              href="#"
              className="hover:text-sakura-600 transition-colors text-sakura-600 underline"
            >
              {item}
            </Link>
          ) : (
            <span className="text-sakura-900/70">{item}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

