const COOKIE_NAME = 'sakura_register_user_code'
const MAX_AGE_DAYS = 7

function isClient(): boolean {
  return typeof document !== 'undefined'
}

export function setUserCodeCookie(value: string): void {
  if (!isClient() || !value.trim()) return
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value.trim())}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function getUserCodeCookie(): string | null {
  if (!isClient()) return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  if (!match) return null
  try {
    return decodeURIComponent(match[1]) || null
  } catch {
    return null
  }
}

export function clearUserCodeCookie(): void {
  if (!isClient()) return
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}
