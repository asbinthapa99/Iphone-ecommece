'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const inp: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  border: '1px solid #e8e8e4', fontSize: 14, color: '#060d0a',
  background: '#fafaf8', outline: 'none',
}

type Step = 'email' | 'otp' | 'password' | 'done'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const focus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#1D9E75'
    e.currentTarget.style.background = '#fff'
  }
  const blur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#e8e8e4'
    e.currentTarget.style.background = '#fafaf8'
  }

  // Step 1: send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Failed to send code.')
        return
      }
      setStep('otp')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // OTP input handling
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < otp.length - 1) otpRefs.current[i + 1]?.focus()
  }

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, otp.length).split('')
    if (digits.length === otp.length) {
      setOtp(digits)
      otpRefs.current[otp.length - 1]?.focus()
    }
  }

  // Step 2: verify OTP → go to password step
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < otp.length) { setError(`Enter the full ${otp.length}-digit code.`); return }
    setError('')
    // Just move forward — actual verify happens with password reset
    setStep('password')
  }

  // Step 3: reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join(''), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to reset password.')
        if (data.error?.includes('code') || data.error?.includes('expired')) setStep('otp')
        return
      }
      setStep('done')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#fff' }}>
      <div className="w-full max-w-[380px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6" style={{ textDecoration: 'none' }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, background: '#060d0a' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1D9E75' }}>Ix</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>Inexa Nepal</span>
          </Link>

          {step !== 'done' && (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.5px' }}>
                {step === 'email' ? 'Forgot password?' : step === 'otp' ? 'Enter your code' : 'Set new password'}
              </h1>
              <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                {step === 'email' && "We'll email you a 4-digit code"}
                {step === 'otp' && `We sent a code to ${email}`}
                {step === 'password' && 'Choose a strong new password'}
              </p>
            </>
          )}
        </div>

        {/* Step indicator */}
        {step !== 'done' && (
          <div className="flex items-center gap-2 mb-6">
            {(['email', 'otp', 'password'] as Step[]).map((s, i) => {
              const steps: Step[] = ['email', 'otp', 'password']
              const current = steps.indexOf(step)
              const done = i < current
              const active = s === step
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{
                      width: 24, height: 24, fontSize: 11, fontWeight: 700,
                      background: done ? '#1D9E75' : active ? '#060d0a' : '#f0f0ee',
                      color: done || active ? '#fff' : '#aaa',
                    }}
                  >
                    {done ? '✓' : i + 1}
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, background: done ? '#1D9E75' : '#f0f0ee', borderRadius: 2 }} />}
                </div>
              )
            })}
          </div>
        )}

        <div className="rounded-[20px] p-6" style={{ border: '1px solid #e8e8e4' }}>

          {error && (
            <div className="flex items-center gap-2 rounded-[10px] p-3 mb-4" style={{ background: '#fff5f5', border: '1px solid #fca5a5' }}>
              <AlertCircle size={14} color="#dc2626" />
              <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#999', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} color="#bbb" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    style={{ ...inp, paddingLeft: 38 }}
                    onFocus={focus} onBlur={blur}
                  />
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2"
                style={{ padding: '12px', borderRadius: 10, background: loading ? '#ccc' : '#060d0a', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : 'Send Code'}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <p style={{ fontSize: 12, color: '#888', marginBottom: 16, textAlign: 'center' }}>
                  Enter the 4-digit code from your email
                </p>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el }}
                      type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      style={{
                        width: 46, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 800,
                        fontFamily: 'monospace', borderRadius: 12, border: `2px solid ${digit ? '#1D9E75' : '#e8e8e4'}`,
                        background: digit ? '#f0faf6' : '#fafaf8', color: '#060d0a', outline: 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#060d0a', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                Verify Code
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setOtp(['','','','']); setError('') }}
                style={{ width: '100%', padding: '8px', background: 'none', border: 'none', fontSize: 12, color: '#888', cursor: 'pointer' }}
              >
                Resend code
              </button>
            </form>
          )}

          {/* Step 3: New password */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#999', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    style={{ ...inp, paddingRight: 40 }}
                    onFocus={focus} onBlur={blur}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {showPw ? <EyeOff size={15} color="#aaa" /> : <Eye size={15} color="#aaa" />}
                  </button>
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2"
                style={{ padding: '12px', borderRadius: 10, background: loading ? '#ccc' : '#060d0a', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Resetting…</> : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="text-center py-4 space-y-4">
              <div className="flex items-center justify-center mx-auto rounded-full" style={{ width: 60, height: 60, background: '#E1F5EE' }}>
                <CheckCircle2 size={28} color="#1D9E75" />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#060d0a', marginBottom: 6 }}>Password updated!</p>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>Your password has been reset. You can now sign in with your new password.</p>
              </div>
              <button
                onClick={() => router.push('/login')}
                style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#060d0a', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                Sign in
              </button>
            </div>
          )}

          {step !== 'done' && (
            <Link href="/login" className="flex items-center justify-center gap-1.5 mt-4" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>
              <ArrowLeft size={12} /> Back to sign in
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
