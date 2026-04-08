import { NextRequest } from 'next/server'
import { proxyToBackend } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/purchase-requests', { requireAuth: true })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return proxyToBackend(request, '/purchase-requests', { method: 'POST', body })
}
