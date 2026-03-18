'use client'

import { useState } from 'react'
import { Eye, EyeOff, CheckCircle, Save, Shield, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AuthUser } from '@/context/auth-context'

interface ProfileFormProps {
  user: AuthUser
}

export default function ProfileForm({ user }: ProfileFormProps) {
  // Profile fields
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword
  const canSavePassword = currentPassword.length > 0 && newPassword.length >= 8 && passwordsMatch

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    // Mock save — in production, call PUT /api/enduser/auth/me
    await new Promise((r) => setTimeout(r, 800))
    setProfileSaving(false)
    setProfileSuccess(true)
    setTimeout(() => setProfileSuccess(false), 3000)
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSaving(true)
    // Mock save
    await new Promise((r) => setTimeout(r, 800))
    setPasswordSaving(false)
    setPasswordSuccess(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* ---- User info card ---- */}
      <div className="bg-white rounded-2xl border border-card-border shadow-card p-5 space-y-4">
        <h2 className="text-lg font-bold text-sakura-900">Account Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <span className="text-muted">Email</span>
            <p className="font-medium text-sakura-900">{user.email}</p>
          </div>
          <div>
            <span className="text-muted">Role</span>
            <p className="font-medium text-sakura-900 capitalize">{user.role.toLowerCase()}</p>
          </div>
          <div>
            <span className="text-muted">Email Verified</span>
            <p className={cn('font-medium', user.isEmailVerified ? 'text-green-600' : 'text-orange-600')}>
              {user.isEmailVerified ? 'Verified' : 'Not verified'}
            </p>
          </div>
          <div>
            <span className="text-muted">Member Since</span>
            <p className="font-medium text-sakura-900">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'Asia/Bangkok',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ---- Edit profile ---- */}
      <form
        onSubmit={handleProfileSave}
        className="bg-white rounded-2xl border border-card-border shadow-card p-5 space-y-4"
      >
        <h2 className="text-lg font-bold text-sakura-900">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-sakura-300 rounded-lg focus:ring-2 focus:ring-sakura-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08-XXXX-XXXX"
              className="w-full px-4 py-2 border border-sakura-300 rounded-lg focus:ring-2 focus:ring-sakura-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={profileSaving}
            className="btn-gradient flex items-center gap-2"
          >
            {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {profileSaving ? 'Saving...' : 'Save Changes'}
          </button>
          {profileSuccess && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Saved!
            </span>
          )}
        </div>
      </form>

      {/* ---- Change password ---- */}
      <form
        onSubmit={handlePasswordSave}
        className="bg-white rounded-2xl border border-card-border shadow-card p-5 space-y-4"
      >
        <h2 className="text-lg font-bold text-sakura-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-sakura-500" />
          Change Password
        </h2>

        <div className="space-y-4 max-w-md">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-sakura-300 rounded-lg focus:ring-2 focus:ring-sakura-500 focus:border-transparent outline-none pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sakura-600 hover:text-sakura-800"
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="new-password"
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-sakura-300 rounded-lg focus:ring-2 focus:ring-sakura-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={cn(
                'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sakura-500 focus:border-transparent outline-none transition-all',
                confirmPassword.length > 0
                  ? passwordsMatch
                    ? 'border-green-400'
                    : 'border-red-400'
                  : 'border-sakura-300'
              )}
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>
        </div>

        {passwordError && (
          <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
            {passwordError}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSavePassword || passwordSaving}
            className={cn(
              'btn-gradient flex items-center gap-2',
              (!canSavePassword || passwordSaving) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {passwordSaving ? 'Updating...' : 'Update Password'}
          </button>
          {passwordSuccess && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Password updated!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}

