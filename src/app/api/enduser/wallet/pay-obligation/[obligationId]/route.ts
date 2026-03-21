import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie } from '@/lib/auth'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ obligationId: string }> }
) {
  const token = getAuthCookie()
  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  const { obligationId } = await params
  const url = `${API_URL}${API_ENDUSER_PREFIX}/wallet/pay-obligation/${obligationId}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
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
          message: err instanceof Error ? err.message : 'Failed to pay obligation',
        },
      },
      { status: 500 }
    )
  }
}
