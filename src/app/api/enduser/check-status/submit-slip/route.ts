import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie } from '@/lib/auth'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export async function POST(request: NextRequest) {
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

  const { searchParams } = request.nextUrl
  const month = searchParams.get('month')
  const transportType = searchParams.get('transportType')

  if (!month || !transportType) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'month and transportType are required' },
      },
      { status: 400 }
    )
  }

  const formData = await request.formData()
  const slip = formData.get('slip')

  if (!slip || !(slip instanceof Blob) || slip.size === 0) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Slip image is required' },
      },
      { status: 400 }
    )
  }

  const backendFormData = new FormData()
  backendFormData.append('slip', slip)

  const url = `${API_URL}${API_ENDUSER_PREFIX}/check-status/submit-slip?month=${encodeURIComponent(month)}&transportType=${encodeURIComponent(transportType)}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
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
          message: err instanceof Error ? err.message : 'Failed to submit slip',
        },
      },
      { status: 500 }
    )
  }
}
