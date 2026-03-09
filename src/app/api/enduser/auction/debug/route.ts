import { NextRequest, NextResponse } from 'next/server'

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
}

/** Recursively collect all leaf key paths from an object (max depth 6) */
function collectPaths(obj: unknown, prefix = '', depth = 0): string[] {
  if (depth > 6 || obj === null || obj === undefined) return []
  if (typeof obj !== 'object') return [`${prefix} = ${JSON.stringify(obj)}`.slice(0, 120)]
  const paths: string[] = []
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = `${prefix}.${k}`
    if (Array.isArray(v)) {
      paths.push(`${key}[] (length=${v.length})`)
      if (v[0]) paths.push(...collectPaths(v[0], `${key}[0]`, depth + 1))
    } else if (typeof v === 'object' && v !== null) {
      paths.push(...collectPaths(v, key, depth + 1))
    } else {
      paths.push(`${key} = ${JSON.stringify(v)}`.slice(0, 120))
    }
  }
  return paths
}

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  const res = await fetch(url, { headers: BROWSER_HEADERS })
  const html = await res.text()

  // Extract __NEXT_DATA__
  const ndMatch = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  )
  const nextData = ndMatch ? JSON.parse(ndMatch[1]) : null

  // Extract all JSON-LD blocks
  const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  const jsonLd = ldMatches.map((m) => { try { return JSON.parse(m[1]) } catch { return null } }).filter(Boolean)

  // Extract all <time datetime="...">
  const timeMatches = [...html.matchAll(/<time[^>]+datetime="([^"]+)"/g)].map((m) => m[1])

  // Extract all price-looking strings
  const priceMatches = [...html.matchAll(/([¥￥][\d,]+|[\d,]+\s*円)/g)].map((m) => m[0]).slice(0, 20)

  return NextResponse.json({
    status: res.status,
    nextDataKeys: nextData ? collectPaths(nextData, 'root', 0).slice(0, 200) : null,
    jsonLd,
    timeDatetimes: timeMatches.slice(0, 10),
    priceStrings: priceMatches,
  })
}
