'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ShieldCheck, Clock, Truck, Star, BadgeCheck, Smartphone, CalendarDays, SearchCheck } from 'lucide-react'
import { PhoneCard } from '@/components/phones/PhoneCard'
import { FilterChips } from '@/components/phones/FilterChips'
import { ImeiChecker } from '@/components/imei/ImeiChecker'
import { TradeInBanner } from '@/components/home/TradeInBanner'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FaqSection } from '@/components/home/FaqSection'
import { AvailableBrands } from '@/components/home/AvailableBrands'
import { NewsletterBanner } from '@/components/home/NewsletterBanner'
import { FadeIn, FadeInStagger, FadeInChild } from '@/components/ui/FadeIn'
import { InstallAppButton } from '@/components/ui/InstallAppButton'
import type { Device } from '@/types'

const TRUST = [
  { icon: ShieldCheck, label: '100% IMEI Verified' },
  { icon: Star, label: '6-Month Warranty' },
  { icon: Truck, label: '24h KTM Delivery' },
  { icon: Clock, label: '247+ Sold' },
]

const STATS = [
  { num: '12', label: 'Inspection Points', icon: SearchCheck },
  { num: '247+', label: 'Phones Sold', icon: Smartphone },
  { num: '6mo', label: 'Warranty Period', icon: CalendarDays },
  { num: '100%', label: 'IMEI Verified', icon: BadgeCheck },
]

export default function HomePage() {
  const [filter, setFilter] = useState('all')
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    async function loadDevices() {
      try {
        setIsLoading(true)
        setLoadError(null)
        const res = await fetch('/api/devices?category=iphone', { signal: controller.signal })
        if (!res.ok) {
          throw new Error(`Failed to load phones (${res.status})`)
        }
        const data = await res.json() as { devices?: Device[] }
        setDevices(Array.isArray(data.devices) ? data.devices : [])
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setLoadError('Unable to load phones right now.')
      } finally {
        setIsLoading(false)
        clearTimeout(timeout)
      }
    }

    void loadDevices()
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      if (filter === 'all') return true
      if (filter === 'grade-a') return d.grade === 'A'
      if (filter === 'under-50k') return d.price < 50000
      return d.model.startsWith(filter)
    })
  }, [devices, filter])

  return (
    <main>

      {/* ── Hero — full-bleed background image ── */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-bg.jpg"
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        {/* Dark overlay — pointer-events:none so taps reach content below */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(6,13,10,0.82) 0%, rgba(6,13,10,0.65) 50%, rgba(6,13,10,0.35) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <FadeInStagger
          className="relative max-w-6xl mx-auto px-5 sm:px-8 w-full"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          {/* Tag pill */}
          <FadeInChild className="mb-5 sm:mb-7">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 600,
                color: '#1D9E75',
                background: 'rgba(29,158,117,0.15)',
                border: '1px solid rgba(29,158,117,0.3)',
                borderRadius: 100,
                padding: '5px 12px 5px 8px',
                letterSpacing: '0.03em',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', display: 'inline-block', boxShadow: '0 0 0 3px rgba(29,158,117,0.2)' }} />
              Nepal&apos;s #1 Verified iPhone Marketplace
            </span>
          </FadeInChild>

          {/* Headline */}
          <FadeInChild>
            <h1
              style={{
                fontSize: 'clamp(34px, 7vw, 68px)',
                fontWeight: 800,
                letterSpacing: '-2px',
                lineHeight: 1.05,
                color: '#ffffff',
                marginBottom: 16,
                maxWidth: 640,
              }}
            >
              Buy iPhones.
              <br />
              <span className="gradient-text">Zero compromise.</span>
            </h1>
          </FadeInChild>

          <FadeInChild>
            <p
              style={{
                fontSize: 'clamp(14px, 2.5vw, 17px)',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.7,
                marginBottom: 32,
                maxWidth: 420,
              }}
            >
              Every phone inspected across 12 checkpoints, IMEI verified,
              graded A/B/C — backed by a 6-month Inexa warranty.
            </p>
          </FadeInChild>

          {/* CTAs */}
          <FadeInChild className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              href="/phones"
              className="inline-flex items-center gap-2 transition-transform hover:scale-105"
              style={{
                background: '#fff',
                color: '#060d0a',
                fontSize: 15,
                fontWeight: 700,
                padding: '14px 28px',
                borderRadius: 14,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}
            >
              Browse Phones <ArrowRight size={16} />
            </Link>

            {/* Install App — works on iOS (Add to Home Screen guide) and Android (native PWA install) */}
            <InstallAppButton />

            {/* App Store — coming soon */}
            <div
              className="inline-flex items-center gap-3"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '10px 20px',
                position: 'relative',
              }}
            >
              <svg width="20" height="24" viewBox="0 0 814 1000" fill="rgba(255,255,255,0.25)">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-109.8C82.5 730.2 41.2 602.1 41.2 480.4c0-170.8 111.4-261.1 221-261.1 58.4 0 107.2 38.2 143.6 38.2 34.6 0 89.5-40.8 153.8-40.8 24.6 0 108.2 2.6 168.6 81.2zm-199.8-123c30.3-35.9 52-85.6 52-135.2 0-6.8-.4-13.6-1.9-19.2-49.1 1.9-108.2 33.5-143.6 74.9-27.7 31.6-54.2 81.3-54.2 131.5 0 7.1 1.3 14.3 1.9 16.6 3.2.6 8.4 1.3 13.6 1.3 44.5 0 100.5-30.3 132.2-69.9z"/>
              </svg>
              <div className="flex flex-col items-start justify-center text-left">
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1, marginBottom: 2 }}>Coming to</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.3)', lineHeight: 1 }}>App Store</p>
              </div>
              <span style={{ position: 'absolute', top: -8, right: -8, background: '#1D9E75', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 100, letterSpacing: '0.05em' }}>SOON</span>
            </div>

            {/* Google Play — coming soon */}
            <div
              className="inline-flex items-center gap-2.5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '10px 20px',
                position: 'relative',
              }}
            >
              <svg width="20" height="22" viewBox="0 0 512 512" fill="none" opacity={0.3}>
                <path d="M48 432L264 216 48 0v432z" fill="#32BBFF"/>
                <path d="M336 144L48 0l168 168 120-24z" fill="#32BBFF"/>
                <path d="M48 432l288-144-120-24L48 432z" fill="#00F076"/>
                <path d="M384 256l-48-112-120 24 120 24 48 64z" fill="#FFD900"/>
                <path d="M48 0l288 144 48-112L48 0z" fill="#FF3333"/>
                <path d="M336 368l-168 64 216-176-48 112z" fill="#FF3333"/>
                <path d="M48 432l216-64-168-104L48 432z" fill="#00F076"/>
                <path d="M384 256l-48 112-120-24 168-88z" fill="#FFD900"/>
              </svg>
              <div className="flex flex-col items-start justify-center text-left">
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1, marginBottom: 2 }}>Coming to</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.3)', lineHeight: 1 }}>Google Play</p>
              </div>
              <span style={{ position: 'absolute', top: -8, right: -8, background: '#1D9E75', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 100, letterSpacing: '0.05em' }}>SOON</span>
            </div>
          </FadeInChild>
        </FadeInStagger>
      </section>

      {/* ── Phone grid ── */}
      <section style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, color: '#060d0a', letterSpacing: '-0.5px' }}>
                Available now
              </h2>
              <p style={{ fontSize: 12, color: '#999', marginTop: 3 }}>
                {isLoading ? 'Loading phones...' : `${filtered.length} phones · All inspected & verified`}
              </p>
            </div>
            <Link href="/phones" className="flex items-center gap-1" style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75', textDecoration: 'none' }}>
              See all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="mb-5">
            <FilterChips onFilterChange={setFilter} />
          </div>
        </div>

        {isLoading ? (
          <div className="max-w-6xl mx-auto px-5 pb-10">
            <div className="text-center py-14 rounded-[14px]" style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}>
              <p style={{ fontSize: 14, color: '#999' }}>Loading phones...</p>
            </div>
          </div>
        ) : loadError ? (
          <div className="max-w-6xl mx-auto px-5 pb-10">
            <div className="text-center py-14 rounded-[14px]" style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}>
              <p style={{ fontSize: 14, color: '#999' }}>{loadError}</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="max-w-6xl mx-auto px-5 pb-10">
            <div className="text-center py-14 rounded-[14px]" style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}>
              <p style={{ fontSize: 14, color: '#999' }}>No phones match this filter.</p>
            </div>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb' }}>
            <FadeInStagger className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ borderLeft: '1px solid #ebebeb' }}>
              {filtered.slice(0, 8).map((device) => (
                <FadeInChild key={device.id} className="h-full">
                  <PhoneCard device={device} />
                </FadeInChild>
              ))}
            </FadeInStagger>
          </div>
        )}
      </section>

      {/* ── IMEI Checker ── */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <FadeIn
          className="rounded-[20px] p-6 sm:p-12"
          style={{ background: 'linear-gradient(135deg,#e8f7f0 0%,#f0faf6 60%,#eef4ff 100%)' }}
        >
          <div className="max-w-lg mx-auto">
            <ImeiChecker />
          </div>
        </FadeIn>
      </section>

      {/* ── Trade-in Banner ── */}
      <section className="max-w-6xl mx-auto px-5 pb-12">
        <TradeInBanner />
      </section>

      {/* ── How it works ── */}
      <HowItWorks />

      {/* ── Redesigned UI/UX Stats Pill ── */}
      <section className="bg-white w-full py-4 md:py-8">
        <FadeIn className="relative max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8">
          <div 
            className="rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
            style={{
              background: 'linear-gradient(135deg, rgba(14,15,16,0.95) 0%, rgba(6,7,8,0.85) 100%)',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            }}
          >
            <div className="grid grid-cols-2 gap-y-8 gap-x-4 md:flex md:flex-row items-center justify-between md:divide-x divide-white/10">
              {STATS.map(({ num, label, icon: Icon }) => (
                <div key={label} className="flex-1 flex flex-col items-center justify-center w-full">
                  <p 
                    className="text-[36px] md:text-[42px] font-black tracking-tighter leading-none mb-2 text-white"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {num}
                  </p>
                  <p className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-[#888] font-bold tracking-[0.1em] md:tracking-[0.15em] uppercase text-center">
                    <Icon size={12} className="text-[#1D9E75]" strokeWidth={2.5} />
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Sell CTA ── */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <FadeIn
          className="rounded-[24px] p-8 md:p-10 lg:px-12 lg:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ background: '#090a0a', border: '1px solid #1a1a1a' }}
        >
          <FadeInStagger>
            <FadeInChild>
              <p className="text-[#10b981] text-[10px] md:text-[11px] font-bold tracking-wider uppercase mb-2">
                Sell to Inexa
              </p>
            </FadeInChild>
            <FadeInChild>
              <p className="text-white text-[24px] md:text-[32px] font-bold leading-[1.2] tracking-tight">
                Get an instant quote<br />for your iPhone.
              </p>
            </FadeInChild>
          </FadeInStagger>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 shrink-0 bg-[#10b981] text-[#000] text-[14px] font-bold px-6 py-3.5 rounded-[12px] hover:bg-[#0ea569] transition-colors"
          >
            Get My Quote <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </FadeIn>
      </section>

      {/* ── FAQ Section ── */}
      <FaqSection />

      {/* ── Available Brands ── */}
      <AvailableBrands />

      {/* ── Newsletter ── */}
      <NewsletterBanner />

    </main>
  )
}
