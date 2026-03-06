interface ProductDescriptionProps {
  description: string
  postedAt: string
}

export default function ProductDescription({
  description,
  postedAt,
}: ProductDescriptionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-muted-dark mb-3">
        Product description
      </h2>
      <div className="text-sm text-sakura-900 leading-relaxed whitespace-pre-line">
        {description}
      </div>
      <p className="text-xs text-muted mt-4">{postedAt}</p>
    </section>
  )
}

