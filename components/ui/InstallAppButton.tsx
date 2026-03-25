'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Share, Plus } from 'lucide-react'

type Platform = 'android' | 'ios' | 'desktop' | 'installed'

export function InstallAppButton() {
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const deferredPrompt = useRef<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null)

  useEffect(() => {
    const ua = navigator.userAgent
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as { standalone?: boolean }).standalone === true

    if (isStandalone) { setPlatform('installed'); return }

    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as { MSStream?: unknown }).MSStream
    const isAndroid = /Android/.test(ua)

    if (isIOS) { setPlatform('ios'); return }

    // Android / Chrome: capture beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as typeof deferredPrompt.current
      setPlatform('android')
    }
    window.addEventListener('beforeinstallprompt', handler)

    if (isAndroid) setPlatform('android')
    else setPlatform('desktop')

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (platform === 'ios') {
      setShowIOSGuide(true)
      return
    }
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt()
      const { outcome } = await deferredPrompt.current.userChoice
      if (outcome === 'accepted') setPlatform('installed')
      deferredPrompt.current = null
    }
  }

  // Already installed or not yet determined
  if (!platform || platform === 'installed') return null

  return (
    <>
      <button
        onClick={handleInstall}
        className="inline-flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 14,
          padding: '10px 20px',
          cursor: 'pointer',
        }}
      >
        <div
          className="flex items-center justify-center rounded-[10px]"
          style={{ width: 36, height: 36, background: 'rgba(29,158,117,0.25)', flexShrink: 0 }}
        >
          <Download size={18} color="#1D9E75" />
        </div>
        <div className="flex flex-col items-start text-left">
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1, marginBottom: 3 }}>
            {platform === 'ios' ? 'Add to' : 'Install'}
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            {platform === 'ios' ? 'Home Screen' : 'Install App'}
          </p>
        </div>
      </button>

      {/* iOS "Add to Home Screen" guide modal */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm animate-fadeUp"
            style={{ background: '#1a1a1a', borderRadius: '20px 20px 0 0', padding: 28, paddingBottom: 'calc(28px + env(safe-area-inset-bottom))' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 20px' }} />

            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#060d0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#1D9E75' }}>Ix</span>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Install Inexa Nepal</p>
                <p style={{ fontSize: 13, color: '#888' }}>Add to your Home Screen</p>
              </div>
            </div>

            {[
              { icon: <Share size={18} color="#1D9E75" />, text: 'Tap the Share button at the bottom of Safari' },
              { icon: <Plus size={18} color="#1D9E75" />, text: 'Scroll down and tap "Add to Home Screen"' },
              { icon: <span style={{ fontSize: 18 }}>✓</span>, text: 'Tap "Add" — the app icon appears on your home screen' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 mb-4">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(29,158,117,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {step.icon}
                </div>
                <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5, paddingTop: 8 }}>{step.text}</p>
              </div>
            ))}

            <button
              onClick={() => setShowIOSGuide(false)}
              style={{ width: '100%', padding: '14px', background: '#fff', borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 700, color: '#060d0a', cursor: 'pointer', marginTop: 8 }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
