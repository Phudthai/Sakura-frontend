import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const res = await fetch(`${API_URL}${API_ENDUSER_PREFIX}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (data.success && data.data?.token) {
      setAuthCookie(data.data.token)
    }

    // Strip token from response before sending to browser
    if (data.data?.token) {
      const { token: _token, ...rest } = data.data
      return NextResponse.json({ ...data, data: rest }, { status: res.status })
    }

    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('[Register Error]', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' } },
      { status: 500 }
    )
  }
}
