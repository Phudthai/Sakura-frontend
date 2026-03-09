import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export async function proxyToBackend(
  request: NextRequest,
  path: string,
  options: { method?: string; body?: unknown; requireAuth?: boolean } = {}
) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (options.requireAuth && !token) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const fullPath = path.startsWith('/api') ? path : `${API_ENDUSER_PREFIX}${path}`
  const search = request.nextUrl.searchParams.toString()
  const url = `${API_URL}${fullPath}${search ? `?${search}` : ''}`

  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
