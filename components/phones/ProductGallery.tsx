'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function ProductGallery({ photos, model }: { photos: string[], model: string }) {
  const validPhotos = photos && photos.length > 0 ? photos.filter(p => p) : []
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev) => (prev + 1) % validPhotos.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + validPhotos.length) % validPhotos.length)

  if (validPhotos.length === 0) {
    return (
      <div className="rounded-[20px] flex items-center justify-center bg-[#f8f8f6] h-[340px] md:h-[400px]">
        <span className="text-[80px]">📱</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Viewport */}
      <div className="relative rounded-[20px] bg-[#f8f8f6] h-[340px] md:h-[400px] flex items-center justify-center overflow-hidden group">
        <Image
          src={validPhotos[currentIndex]}
          alt={`${model} view ${currentIndex + 1}`}
          fill
          priority={currentIndex === 0}
          loading={currentIndex === 0 ? 'eager' : 'lazy'}
          className="object-contain p-8 transition-transform duration-500 hover:scale-105"
        />
        
        {validPhotos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 p-2.5 rounded-full bg-white/90 text-[#060d0a] shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 p-2.5 rounded-full bg-white/90 text-[#060d0a] shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {validPhotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {validPhotos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`relative w-[68px] h-[68px] rounded-[14px] overflow-hidden flex-shrink-0 transition-all duration-200 ${
                i === currentIndex 
                  ? 'border-2 border-[#1D9E75] opacity-100 scale-100 bg-white' 
                  : 'border border-gray-200 opacity-60 hover:opacity-100 scale-95 bg-[#f8f8f6]'
              }`}
            >
              <Image src={photo} alt="" fill loading="lazy" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
