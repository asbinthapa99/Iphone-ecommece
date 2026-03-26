'use client'

import { useEffect, useRef, useState } from 'react'
import { Star, ThumbsUp, CheckCircle2, ChevronDown, ChevronUp, Camera, X, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'
import type { Review } from '@/types'

interface ReviewSummary {
  reviews: Review[]
  avgRating: number
  total: number
  breakdown: { star: number; count: number }[]
}

const STARS = [1, 2, 3, 4, 5]

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {STARS.map((s) => (
        <Star
          key={s}
          size={size}
          strokeWidth={0}
          fill={s <= Math.round(rating) ? '#f5a623' : '#e0e0e0'}
        />
      ))}
    </div>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {STARS.map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="focus:outline-none"
        >
          <Star
            size={28}
            strokeWidth={0}
            fill={(hovered || value) >= s ? '#f5a623' : '#e0e0e0'}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString('en-NP', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="py-5 border-b border-[#f4f4f0] last:border-0">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full shrink-0 text-[11px] font-bold text-white"
          style={{ width: 36, height: 36, background: '#1D9E75' }}
        >
          {review.userInitials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[13px] font-semibold text-[#111]">{review.userName}</span>
            {review.verifiedPurchase && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#1D9E75] bg-[#f0faf6] px-2 py-0.5 rounded-full">
                <CheckCircle2 size={9} />
                Verified Purchase
              </span>
            )}
            <span className="text-[11px] text-[#aaa] ml-auto">{date}</span>
          </div>

          <StarRow rating={review.rating} size={12} />

          <p className="text-[14px] font-semibold text-[#111] mt-1.5 mb-1">{review.title}</p>
          <p className="text-[13px] text-[#555] leading-relaxed">{review.body}</p>

          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {review.photos.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i} src={url} alt=""
                  className="w-20 h-20 rounded-[8px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ border: '0.5px solid #f0f0ee' }}
                  onClick={() => window.open(url, '_blank')}
                />
              ))}
            </div>
          )}

          {review.helpful > 0 && (
            <button className="flex items-center gap-1.5 mt-3 text-[11px] text-[#888] hover:text-[#444] transition-colors">
              <ThumbsUp size={11} />
              {review.helpful} found this helpful
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function WriteReviewForm({ deviceId, onSubmitted }: { deviceId: string; onSubmitted: (r: Review) => void }) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (photos.length + files.length > 3) { setError('Maximum 3 photos per review.'); return }
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      files.forEach((f) => fd.append('files', f))
      const res = await fetch('/api/upload?type=reviews', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Photo upload failed.') }
      else {
        if (data.errors?.length) setError(data.errors.map((e: { reason: string }) => e.reason).join('; '))
        setPhotos((p) => [...p, ...data.urls])
      }
    } catch {
      setError('Network error during photo upload.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) { setError('Please select a star rating.'); return }
    if (!title.trim()) { setError('Please add a review title.'); return }
    if (body.trim().length < 20) { setError('Review must be at least 20 characters.'); return }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/reviews/${deviceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, title, body, photos }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
      onSubmitted(data.review)
      setRating(0); setTitle(''); setBody(''); setPhotos([])
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[16px] p-5" style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}>
      <h3 className="text-[14px] font-bold text-[#111] mb-4">Write a Review</h3>

      <div className="mb-4">
        <p className="text-[12px] font-medium text-[#888] mb-2">Your rating *</p>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="mb-3">
        <p className="text-[12px] font-medium text-[#888] mb-1.5">Review title *</p>
        <input
          type="text"
          placeholder="Summarise your experience…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e0e0dc',
            fontSize: 14, color: '#111', background: '#fff', outline: 'none',
          }}
        />
      </div>

      <div className="mb-4">
        <p className="text-[12px] font-medium text-[#888] mb-1.5">Your review *</p>
        <textarea
          placeholder="What did you like or dislike? How was the condition? Would you recommend it?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={1200}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e0e0dc',
            fontSize: 14, color: '#111', background: '#fff', outline: 'none', resize: 'vertical',
          }}
        />
        <p className="text-[11px] text-[#bbb] mt-1 text-right">{body.length}/1200</p>
      </div>

      {/* Optional photos */}
      <div className="mb-4">
        <p className="text-[12px] font-medium text-[#888] mb-2">Photos (optional, max 3)</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handlePhotoSelect}
        />
        <div className="flex flex-wrap gap-2">
          {photos.map((url, i) => (
            <div key={i} className="relative group w-16 h-16 rounded-[8px] overflow-hidden" style={{ border: '0.5px solid #e0e0dc' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                className="absolute top-0.5 right-0.5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ width: 16, height: 16, background: 'rgba(0,0,0,0.65)' }}
              >
                <X size={9} color="#fff" />
              </button>
            </div>
          ))}
          {photos.length < 3 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-col items-center justify-center w-16 h-16 rounded-[8px] transition-colors hover:bg-[#f4f4f0]"
              style={{ border: '1px dashed #e0e0dc', color: '#bbb' }}
            >
              {uploading ? <Loader2 size={14} className="animate-spin" color="#1D9E75" /> : <Camera size={14} />}
              {!uploading && <span className="text-[9px] mt-0.5">Add</span>}
            </button>
          )}
        </div>
        <p className="text-[10px] text-[#bbb] mt-1">JPG, PNG, WebP · max 3 MB each</p>
      </div>

      {error && (
        <p className="text-[12px] font-medium text-red-600 mb-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          background: submitting ? '#aaa' : '#060d0a',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          padding: '11px 24px',
          borderRadius: 10,
          border: 'none',
          cursor: submitting ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {submitting ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}

export function ProductReviews({ deviceId }: { deviceId: string }) {
  const { user } = useAuth()
  const [data, setData] = useState<ReviewSummary | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/api/reviews/${deviceId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [deviceId])

  const handleNewReview = (review: Review) => {
    setData((prev) => prev ? {
      ...prev,
      reviews: [review, ...prev.reviews],
      total: prev.total + 1,
      avgRating: (prev.avgRating * prev.total + review.rating) / (prev.total + 1),
    } : null)
    setSubmitted(true)
    setShowForm(false)
  }

  if (!data) return null

  const displayed = showAll ? data.reviews : data.reviews.slice(0, 3)
  const avgRating = data.avgRating || 0

  return (
    <div className="mt-10">
      <h2 className="text-[18px] font-bold text-[#060d0a] mb-5" style={{ letterSpacing: '-0.3px' }}>
        Customer Reviews
      </h2>

      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row gap-6 mb-7 rounded-[16px] p-5" style={{ border: '0.5px solid #ebebeb', background: '#fff' }}>
        {/* Big number */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <span className="text-[52px] font-black text-[#111] leading-none">{avgRating.toFixed(1)}</span>
          <StarRow rating={avgRating} size={16} />
          <span className="text-[12px] text-[#888] mt-1">{data.total} review{data.total !== 1 ? 's' : ''}</span>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          {data.breakdown.map(({ star, count }) => {
            const pct = data.total > 0 ? (count / data.total) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-[#666] w-4 shrink-0">{star}</span>
                <Star size={10} strokeWidth={0} fill="#f5a623" className="shrink-0" />
                <div className="flex-1 h-2 bg-[#f0f0ee] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: '#f5a623' }}
                  />
                </div>
                <span className="text-[11px] text-[#aaa] w-4 shrink-0 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review list */}
      <div className="rounded-[16px] overflow-hidden" style={{ border: '0.5px solid #ebebeb', background: '#fff' }}>
        <div className="px-5">
          {displayed.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>

        {data.reviews.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-semibold text-[#1D9E75] hover:bg-[#f0faf6] transition-colors"
            style={{ borderTop: '0.5px solid #f4f4f0' }}
          >
            {showAll ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show all {data.total} reviews</>}
          </button>
        )}
      </div>

      {/* Write a review */}
      <div className="mt-5">
        {submitted ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-[12px] bg-[#f0faf6]">
            <CheckCircle2 size={16} color="#1D9E75" />
            <span className="text-[13px] font-semibold text-[#1D9E75]">Thank you! Your review has been submitted.</span>
          </div>
        ) : user ? (
          showForm ? (
            <WriteReviewForm deviceId={deviceId} onSubmitted={handleNewReview} />
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-[12px] transition-colors hover:bg-[#f4f4f0]"
              style={{ border: '1px solid #e0e0dc', fontSize: 14, fontWeight: 600, color: '#333', background: '#fff', cursor: 'pointer' }}
            >
              <Star size={14} strokeWidth={1.5} />
              Write a Review
            </button>
          )
        ) : (
          <div className="flex items-center justify-between px-5 py-4 rounded-[12px]" style={{ border: '1px solid #e0e0dc', background: '#fafaf8' }}>
            <p className="text-[13px] text-[#666]">
              Have you purchased this phone? Share your experience.
            </p>
            <Link
              href={`/login?callbackUrl=/phones/${deviceId}`}
              className="shrink-0 ml-4 px-4 py-2 rounded-[10px] text-[13px] font-bold text-white transition-opacity hover:opacity-80"
              style={{ background: '#060d0a', textDecoration: 'none' }}
            >
              Log in to review
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
