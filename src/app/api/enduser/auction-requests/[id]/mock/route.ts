import { NextRequest } from 'next/server'
import { proxyToBackend } from '@/lib/api-proxy'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  return proxyToBackend(request, `/auction-requests/${params.id}/mock`, {
    method: 'POST',
    body,
    requireAuth: true,
  })
}
