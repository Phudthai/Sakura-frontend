import { redirect } from 'next/navigation'

/** Default dashboard route redirects to bids */
export default function DashboardPage() {
  redirect('/dashboard/bids')
}

