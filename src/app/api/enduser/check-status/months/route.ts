import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie } from '@/lib/auth'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export async function GET(request: NextRequest) {
  const token = getAuthCookie()
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      },
      { status: 401 }
    )
  }

  const purchaseMode = request.nextUrl.searchParams.get('purchase_mode')
  const qs = new URLSearchParams()
  if (purchaseMode != null && purchaseMode !== '') {
    qs.set('purchase_mode', purchaseMode)
  }
  const query = qs.toString()

  const url = `${API_URL}${API_ENDUSER_PREFIX}/check-status/months${query ? `?${query}` : ''}`

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const text = await res.text()
    let data: unknown
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = { message: text || 'Unknown error' }
    }

    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: err instanceof Error ? err.message : 'Failed to fetch months',
        },
      },
      { status: 500 }
    )
  }
}
