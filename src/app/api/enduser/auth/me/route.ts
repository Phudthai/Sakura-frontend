import { NextResponse } from 'next/server'
import { getAuthCookie, verifyToken } from '@/lib/auth'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export async function GET() {
  const token = getAuthCookie()
  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHENTICATED', message: 'Not authenticated' } },
      { status: 401 }
    )
  }

  // Try backend first — has full user profile (name, phone, etc.)
  try {
    const res = await fetch(`${API_URL}${API_ENDUSER_PREFIX}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const text = await res.text()
    const data = JSON.parse(text) // throws if HTML error page
    if (res.ok) return NextResponse.json(data, { status: 200 })
  } catch {
    // Backend unavailable or returned non-JSON — fall through to local verify
  }

  // Fallback: verify JWT locally (returns partial payload without name/phone)
  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHENTICATED', message: 'Invalid or expired token' } },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.email.split('@')[0], // best-effort name from email
        phone: null,
        role: payload.role,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      },
    },
  })
}
