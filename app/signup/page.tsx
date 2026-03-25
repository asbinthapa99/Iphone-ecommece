'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signIn('google', { callbackUrl: '/account' })
    } catch {
      setError('Failed to sign in with Google.')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/login'), 3000)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#fff' }}>
        <div className="text-center max-w-[360px]">
          <div
            className="mx-auto mb-5 flex items-center justify-center rounded-full"
            style={{ width: 60, height: 60, background: '#E1F5EE' }}
          >
            <CheckCircle2 size={28} color="#1D9E75" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.5px' }}>
            Account created!
          </h2>
          <p style={{ fontSize: 13, color: '#888', marginTop: 8, lineHeight: 1.6 }}>
            Check your email to confirm your account. Redirecting to login…
          </p>
        </div>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-12"
      style={{ background: '#ffffff' }}
    >
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 40, height: 40, background: '#060d0a' }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1D9E75' }}>Ix</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>
              Inexa Nepal
            </span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.5px' }}>
            Create account
          </h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
            Track orders, get warranty updates
          </p>
        </div>

        <div
          className="rounded-[20px] p-6"
          style={{ border: '0.5px solid #e8e8e4', background: '#fff' }}
        >
          {error && (
            <div
              className="flex items-center gap-2 rounded-[10px] p-3 mb-4"
              style={{ background: '#fff5f5', border: '0.5px solid #fca5a5' }}
            >
              <AlertCircle size={14} color="#dc2626" />
              <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'name', label: 'Full Name', value: name, set: setName, type: 'text', placeholder: 'Ram Sharma' },
              { id: 'email', label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'you@email.com' },
              { id: 'phone', label: 'Phone (optional)', value: phone, set: setPhone, type: 'tel', placeholder: '98XXXXXXXX' },
            ].map(({ id, label, value, set, type, placeholder }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#444', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                >
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  required={id !== 'phone'}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '0.5px solid #e0e0dc',
                    fontSize: 14,
                    color: '#060d0a',
                    background: '#fafaf8',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#1D9E75'; e.currentTarget.style.background = '#fff' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e0e0dc'; e.currentTarget.style.background = '#fafaf8' }}
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#444', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: 10,
                    border: '0.5px solid #e0e0dc',
                    fontSize: 14,
                    color: '#060d0a',
                    background: '#fafaf8',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#1D9E75'; e.currentTarget.style.background = '#fff' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e0e0dc'; e.currentTarget.style.background = '#fafaf8' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {showPw ? <EyeOff size={15} color="#aaa" /> : <Eye size={15} color="#aaa" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
              style={{
                padding: '12px',
                borderRadius: 10,
                background: loading ? '#ccc' : '#060d0a',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Creating account…</> : <><span>Create account</span> <ArrowRight size={14} /></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-[#e0e0dc] flex-1"></div>
            <span className="text-[11px] text-[#888] font-semibold uppercase tracking-wider">Or</span>
            <div className="h-px bg-[#e0e0dc] flex-1"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 hover:bg-gray-50"
            style={{
              padding: '11px',
              borderRadius: 10,
              background: '#fff',
              color: '#333',
              fontSize: 14,
              fontWeight: 600,
              border: '1px solid #e0e0dc',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#888', margin: '24px 0 0' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
