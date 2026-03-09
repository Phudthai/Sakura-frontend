import { NextRequest, NextResponse } from 'next/server'

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
}

function extractNextData(html: string): Record<string, unknown> | null {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  )
  if (!match) return null
  try {
    return JSON.parse(match[1])
  } catch {
    return null
  }
}

function extractMetaFallback(html: string) {
  const get = (property: string) => {
    const m = html.match(new RegExp(`<meta[^>]+property="${property}"[^>]+content="([^"]+)"`))
    return m?.[1] ?? null
  }
  return {
    title: get('og:title'),
    imageUrl: get('og:image'),
  }
}

// Extract auction item from Yahoo's __NEXT_DATA__ structure
// Confirmed path: props.pageProps.initialState.item.detail.item
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAuctionFields(data: Record<string, unknown>): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = (data as any)?.props?.pageProps

  if (!props) return null

  // Primary path (confirmed via debug)
  const primary = props.initialState?.item?.detail?.item
  if (primary?.price !== undefined) return primary

  // Legacy / alternate paths
  return (
    props.auction ??
    props.item ??
    props.initialData?.auction ??
    props.initialData?.item ??
    null
  )
}

export async function POST(req: NextRequest) {
  let body: { url?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { url } = body
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  if (!parsed.hostname.includes('auctions.yahoo.co.jp')) {
    return NextResponse.json(
      { error: 'รองรับเฉพาะ Yahoo Auctions Japan (auctions.yahoo.co.jp) เท่านั้น' },
      { status: 400 }
    )
  }

  // Extract item ID from path: /jp/auction/x1222069290 → x1222069290
  const pathParts = parsed.pathname.split('/').filter(Boolean)
  const itemId = pathParts[pathParts.length - 1]

  let html: string
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS })
    if (!res.ok) {
      return NextResponse.json(
        { error: `Yahoo ตอบกลับด้วย status ${res.status} — อาจถูก block หรือสินค้าหมดแล้ว` },
        { status: 422 }
      )
    }
    html = await res.text()
  } catch (err) {
    console.error('[auction/fetch] network error:', err)
    return NextResponse.json({ error: 'ไม่สามารถเชื่อมต่อ Yahoo ได้' }, { status: 500 })
  }

  // --- Parse __NEXT_DATA__ ---
  const nextData = extractNextData(html)
  const auction = nextData ? extractAuctionFields(nextData) : null

  if (auction) {
    // Yahoo stores images in `img` array (confirmed via debug)
    const imgArr: string[] = Array.isArray(auction.img)
      ? auction.img
      : Array.isArray(auction.images)
        ? auction.images
        : Array.isArray(auction.imageUrls)
          ? auction.imageUrls
          : []

    // img entries can be objects { image: url } or plain strings
    const firstImage = imgArr[0]
    const imageUrl: string | null =
      typeof firstImage === 'string'
        ? firstImage
        : typeof firstImage === 'object' && firstImage !== null
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? ((firstImage as any).image ?? (firstImage as any).url ?? null)
          : null

    return NextResponse.json({
      itemId,
      url,
      title: auction.title ?? auction.name ?? 'ไม่ทราบชื่อสินค้า',
      currentPrice: Number(auction.price ?? auction.currentPrice ?? auction.initPrice ?? 0),
      endTime: auction.endTime ?? auction.closeDate ?? null,
      imageUrl,
      bidCount: Number(auction.bids ?? auction.biddersNum ?? auction.bidCount ?? 0),
    })
  }

  // --- Fallback: og: meta tags ---
  const meta = extractMetaFallback(html)
  if (meta.title) {
    return NextResponse.json({
      itemId,
      url,
      title: meta.title,
      currentPrice: 0,
      endTime: null,
      imageUrl: meta.imageUrl,
      bidCount: 0,
      partial: true, // signal that price/time data is missing
    })
  }

  return NextResponse.json(
    { error: 'ไม่พบข้อมูลสินค้าในหน้านี้ — Yahoo อาจเปลี่ยน format หน้าเว็บแล้ว' },
    { status: 422 }
  )
}
