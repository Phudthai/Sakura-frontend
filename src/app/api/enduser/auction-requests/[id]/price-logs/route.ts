import { NextRequest } from 'next/server'
import { proxyToBackend } from '@/lib/api-proxy'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return proxyToBackend(request, `/auction-requests/${params.id}/price-logs`, {
    requireAuth: true,
  })
}
