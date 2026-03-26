import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { INSPECTION_POINTS } from '@/lib/mock-data'
import { GradeBadge } from '@/components/trust/GradeBadge'
import { BatteryBar } from '@/components/trust/BatteryBar'
import { ImeiStatusBadge } from '@/components/trust/ImeiStatus'
import { PhoneCard } from '@/components/phones/PhoneCard'
import { ProductGallery } from '@/components/phones/ProductGallery'
import { ArrowLeft, ShieldCheck, CheckCircle2, ArrowRight, Star } from 'lucide-react'
import { PaymentBadges } from '@/components/ui/PaymentBadges'
import { BuyNowButton } from '@/components/phones/BuyNowButton'
import { ProductReviews } from '@/components/phones/ProductReviews'
import { ProductSpecs } from '@/components/phones/ProductSpecs'
import { productTitle, productDescription, productKeywords, productJsonLd, breadcrumbJsonLd, SITE_URL } from '@/lib/seo'
import { getAllDeviceIds, getAvailableDevices, getDeviceById } from '@/lib/devices'

// ── SEO ──────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const device = await getDeviceById(id)
  if (!device) return {}

  const title = productTitle(device)
  const description = productDescription(device)
  const keywords = productKeywords(device)
  const url = `${SITE_URL}/phones/${device.id}`
  const image = device.photos[0] ?? `${SITE_URL}/og-default.jpg`

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Inexa Nepal',
      images: [{ url: image, width: 800, height: 800, alt: `${device.model} ${device.storage}` }],
      type: 'website',
      locale: 'en_NP',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

// Pre-build every product page at deploy time — zero server work per request
export async function generateStaticParams() {
  const ids = await getAllDeviceIds()
  return ids.map((id) => ({ id }))
}

// Re-generate pages in the background every 5 minutes (ISR)
export const revalidate = 300

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const device = await getDeviceById(id)
  if (!device) notFound()

  const savings = device.originalPrice ? device.originalPrice - device.price : null
  const isAvailable = device.status === 'available'

  // Related phones: same series, different variants, exclude current
  const seriesBase = device.model.replace(/ (Pro Max|Pro|Plus|mini)$/, '')
  const availableDevices = await getAvailableDevices()
  const related = availableDevices.filter(
    (d) =>
      d.id !== device.id &&
      d.status === 'available' &&
      d.category === device.category &&
      (d.model.startsWith(seriesBase) || d.grade === device.grade)
  ).slice(0, 4)
  const ratingValue = typeof device.rating === 'number' ? device.rating : 4.8
  const reviewCount = typeof device.reviewCount === 'number' ? device.reviewCount : 120

  const productLd = productJsonLd(device)
  const breadcrumbLd = breadcrumbJsonLd(device)

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="flex items-center gap-2 text-[12px]" style={{ color: '#888' }}>
          <li><Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link></li>
          <li>/</li>
          <li><Link href="/phones" style={{ textDecoration: 'none', color: 'inherit' }}>Phones</Link></li>
          <li>/</li>
          <li style={{ color: '#444', fontWeight: 600 }}>{device.model}</li>
        </ol>
      </nav>

      {/* Back */}
      <Link
        href="/phones"
        className="inline-flex items-center gap-1.5 text-[12px] font-medium mb-6"
        style={{ color: '#888' }}
      >
        <ArrowLeft size={12} />
        Back to phones
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Image Gallery */}
        <div>
          <ProductGallery photos={device.photos} model={device.model} />

          {/* IMEI info card */}
          <div
            className="mt-4 rounded-[14px] p-4 flex items-center gap-3"
            style={{ background: '#f4faf7', border: '0.5px solid #c8ead9' }}
          >
            <ShieldCheck size={18} color="#0F6E56" />
            <div>
              <p className="text-[12px] font-medium" style={{ color: '#0F6E56' }}>
                IMEI Verified Clean
              </p>
              <p className="text-[10px]" style={{ color: '#888' }}>
                IMEI: {device.imei} · NTA Nepal database
              </p>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div>
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <GradeBadge grade={device.grade} />
            <ImeiStatusBadge status={device.imeiStatus} />
            {!isAvailable && (
              <span
                className="text-[10px] font-semibold px-2 py-1 rounded-full"
                style={{ background: '#fee2e2', color: '#dc2626' }}
              >
                Sold out
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-1">
            <h1
              className="font-medium tracking-tight"
              style={{ fontSize: 28, color: '#060d0a' }}
            >
              {device.model}
            </h1>
            <div className="flex items-center gap-1 text-[#f59e0b] bg-[#fefce8] px-2.5 py-1 rounded-full">
              <Star size={14} fill="currentColor" />
              <span className="text-[13px] font-bold text-gray-800 ml-1">{ratingValue.toFixed(1)}</span>
              <span className="text-[12px] text-gray-500">({reviewCount})</span>
            </div>
          </div>
          <p className="text-[13px] mb-4" style={{ color: '#888' }}>
            {device.storage} · {device.color}
          </p>

          {/* Battery */}
          <div className="mb-4 max-w-[200px]">
            <p className="text-[10px] font-medium uppercase tracking-wide mb-1.5" style={{ color: '#888' }}>
              Battery Health
            </p>
            <BatteryBar health={device.batteryHealth} />
          </div>

          {/* Price */}
          <div className="mb-1">
            <span className="font-medium tracking-tight" style={{ fontSize: 32, color: '#060d0a' }}>
              NPR {device.price.toLocaleString()}
            </span>
            {device.originalPrice && (
              <span className="text-[14px] line-through ml-2" style={{ color: '#ccc' }}>
                NPR {device.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {savings && (
            <p className="text-[12px] font-medium mb-1" style={{ color: '#1D9E75' }}>
              Save NPR {savings.toLocaleString()} vs new
            </p>
          )}

          <p className="text-[11px] mb-5 flex items-center gap-1" style={{ color: '#1D9E75' }}>
            <ShieldCheck size={11} />
            Includes 6-month Inexa warranty
          </p>

          {/* CTA buttons */}
          <div className="space-y-2 mb-6">
            {isAvailable ? (
              <>
                <BuyNowButton deviceId={device.id} price={device.price} />
                <div className="pt-1">
                  <PaymentBadges />
                </div>
              </>
            ) : (
              <>
                <div
                  className="flex items-center justify-center w-full py-3 rounded-[12px]"
                  style={{ background: '#f0f0ee', color: '#aaa', fontSize: 14, fontWeight: 600 }}
                >
                  Sold Out
                </div>
                <Link
                  href="/phones"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-[12px]"
                  style={{ background: '#f4f4f0', color: '#444', fontSize: 13, textDecoration: 'none' }}
                >
                  Browse similar phones <ArrowRight size={13} />
                </Link>
              </>
            )}
          </div>

          {/* Description */}
          {device.description && (
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#666' }}>
              {device.description}
            </p>
          )}

          {/* Highlights */}
          <div className="space-y-2">
            {[
              '12-point physical inspection passed',
              'IMEI verified with NTA Nepal',
              'Factory reset confirmed',
              '6-month Inexa warranty included',
              'COD available in KTM & Pokhara',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 size={12} color="#1D9E75" />
                <span className="text-[12px]" style={{ color: '#555' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inspection checklist */}
      <div className="mt-8 rounded-[16px] p-6" style={{ border: '0.5px solid #f0f0ee' }}>
        <h2 className="text-[15px] font-medium tracking-tight mb-4" style={{ color: '#060d0a' }}>
          12-Point Inspection — All passed
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {INSPECTION_POINTS.map((point) => (
            <div key={point.key} className="flex items-center gap-2">
              <CheckCircle2 size={13} color="#1D9E75" />
              <span className="text-[12px]" style={{ color: '#444' }}>{point.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Specs */}
      <ProductSpecs device={device} />

      {/* Reviews */}
      <ProductReviews deviceId={device.id} />

      {/* Related phones */}
      {related.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-bold" style={{ color: '#060d0a', letterSpacing: '-0.3px' }}>You might also like</h2>
            <Link href="/phones" className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: '#1D9E75', textDecoration: 'none' }}>
              See all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((d) => <PhoneCard key={d.id} device={d} />)}
          </div>
        </div>
      )}
    </main>
  )
}
