'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { setUserCodeCookie, getUserCodeCookie, clearUserCodeCookie } from '@/lib/user-code-cookie'

/** Input wrapper with label, optional error, and optional helper text - ต้องอยู่นอก component หลักเพื่อไม่ให้ re-create ทุกครั้งที่พิมพ์ */
function Field({
  id,
  label,
  fieldError,
  helperText,
  children,
}: {
  id: string
  label: string
  fieldError?: string
  helperText?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5">
        <label htmlFor={id} className="text-sm font-medium text-sakura-900">
          {label}
        </label>
        {helperText && !fieldError && (
          <span className="text-xs text-red-500 ml-1.5">{helperText}</span>
        )}
      </div>
      <div className="relative">{children}</div>
      {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError}</p>}
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** Persist user_code from query to cookie when coming from staff link */
  useEffect(() => {
    const userCodeFromQuery = searchParams.get('user_code')
    if (userCodeFromQuery?.trim()) {
      setUserCodeCookie(userCodeFromQuery)
    }
  }, [searchParams])

  /** Client-side validation before sending to API */
  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
    if (!username.trim()) errors.username = 'Username is required'
    if (!email.includes('@')) errors.email = 'Invalid email'
    if (!password.trim()) errors.password = 'Password is required'
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    const userCode = searchParams.get('user_code')?.trim() || getUserCodeCookie() || undefined

    setIsSubmitting(true)
    const result = await register({
      name: name.trim(),
      username: username.trim(),
      userId: userId.trim() || undefined,
      email,
      password,
      phone: phone || undefined,
      user_code: userCode,
    })
    setIsSubmitting(false)

    if (result.success) {
      clearUserCodeCookie()
      router.push('/')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  const inputBase =
    'w-full px-4 py-3 rounded-xl border border-card-border bg-sakura-50/50 text-sakura-900 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sakura-400 focus:border-transparent transition-all'

  return (
    <div className="w-full max-w-2xl animate-fade-slide-in">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 border border-card-border">
        {/* Heading - compact */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-header rounded-xl flex items-center justify-center mx-auto mb-3 shadow-button">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-sakura-900">Create account</h1>
          <p className="text-muted-dark text-sm mt-0.5">Join Sakura to start ordering from Japan</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form - 2 columns on desktop */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Row 1 */}
          <Field id="name" label="Full name" fieldError={fieldErrors.name}>
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
          <Field
            id="username"
            label="Username"
            fieldError={fieldErrors.username}
            helperText="ลูกค้าเก่าใส่ชื่อบัญชี ที่ทางร้านกำหนดให้"
          >
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className={inputBase}
            />
          </Field>

          {/* Row 2 */}
          <Field
            id="userId"
            label="User Id (optional)"
            helperText="ลูกค้าเก่าใส่ id ที่ทางร้านกำหนดให้"
          >
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Your user ID"
              className={inputBase}
            />
          </Field>
          <Field id="email" label="Email" fieldError={fieldErrors.email}>
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

          {/* Row 3 - Password fields */}
          <Field id="password" label="Password" fieldError={fieldErrors.password}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
          <Field id="confirmPassword" label="Confirm password" fieldError={fieldErrors.confirmPassword}>
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

          {/* Row 4 - Phone full width */}
          <div className="md:col-span-2">
            <Field id="phone" label="Phone (optional)" fieldError={fieldErrors.phone}>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0X-XXXX-XXXX"
                className={inputBase}
              />
            </Field>
          </div>

          {/* Submit - full width */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-base mt-1"
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
          </div>

          {/* Sign in link */}
          <p className="text-center pt-2 text-sm text-muted-dark md:col-span-2">
            Already have an account?{' '}
            <Link href="/login" className="text-sakura-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

