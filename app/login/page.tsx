'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

const inputBase = {
  width: '100%', borderRadius: 10, border: '0.5px solid #e0e0dc',
  fontSize: 14, color: '#060d0a', background: '#fafaf8', outline: 'none',
}
const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = '#1D9E75'
  e.currentTarget.style.background = '#fff'
}
const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = '#e0e0dc'
  e.currentTarget.style.background = '#fafaf8'
}
const labelSt = { display: 'block', fontSize: 11, fontWeight: 600, color: '#444', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: 'This email is linked to a different sign-in method.',
  OAuthSignin: 'Could not connect to Google. Please try again.',
  OAuthCallback: 'Google sign-in failed. Please try again.',
  CredentialsSignin: 'Invalid email or password.',
  Default: 'Something went wrong. Please try again.',
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const raw = searchParams.get('callbackUrl') ?? ''
  // Only allow same-origin relative paths. Reject absolute URLs (https://evil.com)
  // and protocol-relative URLs (//evil.com).
  const callbackUrl = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/account'
  const urlError = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(
    urlError ? (ERROR_MESSAGES[urlError] ?? ERROR_MESSAGES.Default) : ''
  )

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true)
      setError('')
      await signIn('google', { callbackUrl })
    } catch {
      setError('Failed to sign in with Google. Please try again.')
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        // NextAuth wraps our thrown message in result.error
        const msg = result.error
        setError(
          msg === 'CredentialsSignin'
            ? 'Invalid email or password.'
            : (msg ?? 'Invalid email or password.')
        )
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
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
            <div>
              <label htmlFor="email" style={labelSt}>Email</label>
              <input
                id="email" type="email" value={email} placeholder="you@email.com" required
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...inputBase, padding: '10px 14px' }}
                onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            <div>
              <label htmlFor="password" style={labelSt}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password" type={showPw ? 'text' : 'password'} value={password} placeholder="••••••••" required
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputBase, padding: '10px 40px 10px 14px' }}
                  onFocus={onFocus} onBlur={onBlur}
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
                transition: 'background 0.15s',
              }}
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in…</> : <><span>Sign in</span> <ArrowRight size={14} /></>}
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
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-3 hover:bg-gray-50"
            style={{
              padding: '11px',
              borderRadius: 10,
              background: '#fff',
              color: '#333',
              fontSize: 14,
              fontWeight: 600,
              border: '1px solid #e0e0dc',
              cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin text-gray-400" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href="/forgot-password" style={{ fontSize: 12, color: '#888', textDecoration: 'none', display: 'block', marginBottom: 10 }}>
              Forgot your password?
            </Link>
            <p style={{ fontSize: 12, color: '#888' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
