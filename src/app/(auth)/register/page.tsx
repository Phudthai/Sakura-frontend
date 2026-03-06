'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** Client-side validation before sending to API */
  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
    if (!email.includes('@')) errors.email = 'Invalid email'
    if (password.length < 8) errors.password = 'Password must be at least 8 characters'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      errors.password = 'Must include uppercase, lowercase, number, and special character'
    }
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (phone && !/^0[0-9]{1}-[0-9]{4}-[0-9]{4}$/.test(phone)) {
      errors.phone = 'Format: 0X-XXXX-XXXX'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setIsSubmitting(true)
    const result = await register({
      name: name.trim(),
      email,
      password,
      phone: phone || undefined,
    })
    setIsSubmitting(false)

    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  /** Input wrapper with label and optional error */
  const Field = ({
    id,
    label,
    icon: Icon,
    children,
  }: {
    id: string
    label: string
    icon: React.ElementType
    children: React.ReactNode
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-sakura-900 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted" />
        {children}
      </div>
      {fieldErrors[id] && (
        <p className="text-xs text-red-500 mt-1">{fieldErrors[id]}</p>
      )}
    </div>
  )

  const inputBase =
    'w-full pl-10 pr-4 py-3 rounded-xl border border-card-border bg-sakura-50/50 text-sakura-900 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sakura-400 focus:border-transparent transition-all'

  return (
    <div className="w-full max-w-md animate-fade-slide-in">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-card p-8 border border-card-border">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-header rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-button">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-sakura-900">Create account</h1>
          <p className="text-muted-dark text-sm mt-1">Join Sakura to start ordering from Japan</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <Field id="name" label="Full name" icon={User}>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={inputBase}
            />
          </Field>

          {/* Email */}
          <Field id="email" label="Email" icon={Mail}>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputBase}
            />
          </Field>

          {/* Password */}
          <Field id="password" label="Password" icon={Lock}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className={`${inputBase} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-sakura-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </Field>

          {/* Confirm password */}
          <Field id="confirmPassword" label="Confirm password" icon={Lock}>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={inputBase}
            />
          </Field>

          {/* Phone (optional) */}
          <Field id="phone" label="Phone (optional)" icon={Phone}>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0X-XXXX-XXXX"
              className={inputBase}
            />
          </Field>

          {/* Password requirements hint */}
          <div className="text-xs text-muted space-y-0.5 bg-sakura-50/60 rounded-lg p-3">
            <p className="font-medium text-sakura-800 mb-1">Password requirements:</p>
            <p className={password.length >= 8 ? 'text-green-600' : ''}>• At least 8 characters</p>
            <p className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>• One uppercase letter</p>
            <p className={/[a-z]/.test(password) ? 'text-green-600' : ''}>• One lowercase letter</p>
            <p className={/\d/.test(password) ? 'text-green-600' : ''}>• One number</p>
            <p className={/[@$!%*?&]/.test(password) ? 'text-green-600' : ''}>• One special character (@$!%*?&amp;)</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-base mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create account
              </>
            )}
          </button>
        </form>
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-muted-dark mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-sakura-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

