'use client'

import { UserCircle } from 'lucide-react'
import ProfileForm from '@/components/dashboard/profile-form'
import { useAuth } from '@/context/auth-context'

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-header flex items-center justify-center shadow-button">
          <UserCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sakura-900">Profile</h1>
          <p className="text-sm text-muted">Manage your account information</p>
        </div>
      </div>

      <ProfileForm user={user} />
    </div>
  )
}

