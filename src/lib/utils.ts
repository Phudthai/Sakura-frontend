/**
 * Format price in Japanese Yen
 * @example formatPrice(5000) => "5,000"
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('ja-JP')
}

/** Format price as ¥12,345 or — if zero */
export function formatJPY(price: number): string {
  return price > 0 ? `¥${price.toLocaleString('ja-JP')}` : '—'
}

/** Format a Date to HH:MM in Thai locale */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

/** Extract bare hostname from a URL, e.g. "auctions.yahoo.co.jp" */
export function getHostname(url: string): string {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

/**
 * Merge class names, filtering out falsy values
 * Simple utility — no external dependency needed
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

