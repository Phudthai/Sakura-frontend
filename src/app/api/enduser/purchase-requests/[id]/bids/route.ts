import { NextRequest } from 'next/server'
import { proxyToBackend } from '@/lib/api-proxy'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  return proxyToBackend(request, `/purchase-requests/${params.id}/bids`, {
    method: 'POST',
    body,
    requireAuth: true,
  })
}
