// Haptic feedback via Vibration API (Android) + AudioContext click (iOS)
// iOS PWA doesn't support vibration but the audio trick gives a physical feel.

let _ctx: AudioContext | null = null
function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!_ctx) {
    try { _ctx = new (window.AudioContext || (window as any).webkitAudioContext)() } catch { return null }
  }
  return _ctx
}

export function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  // Android vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(style === 'light' ? 4 : style === 'medium' ? 10 : 24)
  }

  // iOS: tiny silent click via AudioContext
  const ctx = getCtx()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(style === 'light' ? 0.04 : style === 'medium' ? 0.07 : 0.12, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)
  osc.frequency.value = style === 'heavy' ? 60 : 120
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.06)
}
