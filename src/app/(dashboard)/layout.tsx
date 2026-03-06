'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import DashboardSidebar from '@/components/dashboard/sidebar'
import { useAuth } from '@/context/auth-context'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user, router])

  // Show a loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-body flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sakura-500" />
      </div>
    )
  }

  // Still redirecting
  if (!user) return null

  return (
    <div className="min-h-screen bg-body">
      <Header />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-6">
          <DashboardSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}

