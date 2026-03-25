import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie } from '@/lib/auth'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

const BACKEND_BASE = `${API_URL}${API_ENDUSER_PREFIX}/shipping-addresses`

export async function GET() {
  const token = getAuthCookie()
  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  try {
    const res = await fetch(BACKEND_BASE, {
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
          message: err instanceof Error ? err.message : 'Failed to fetch addresses',
        },
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const token = getAuthCookie()
  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(BACKEND_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
          message: err instanceof Error ? err.message : 'Failed to create address',
        },
      },
      { status: 500 }
    )
  }
}
