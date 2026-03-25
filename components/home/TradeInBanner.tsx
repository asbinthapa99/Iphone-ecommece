import Link from 'next/link'
import { Award, Banknote, Truck } from 'lucide-react'

export function TradeInBanner() {
  return (
    <div className="rounded-[24px] overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-14 gap-8" style={{ backgroundColor: '#d1bdf0' }}>
      
      {/* Left side text and CTA */}
      <div className="flex-1 max-w-lg">
        <h2 
          className="text-[36px] md:text-[46px] font-bold text-[#111] leading-[1.05] tracking-tight mb-4" 
          style={{ fontFamily: 'Georgia, serif' }} // Using serif to recreate the exact vibe in the picture
        >
          Get up to 1 Lakh<br />for your trade-in.
        </h2>
        <p className="text-[15px] md:text-[16px] text-[#333] mb-8 font-medium">
          Upgrade today with our &quot;Fair-Trade&quot; value promise. We offer the best trade-in prices in Nepal to help you jump to your next iPhone.
        </p>
        <Link
          href="/sell"
          className="inline-block bg-[#111] text-white text-[14px] font-bold px-8 py-3.5 rounded-[12px] hover:bg-black transition-colors"
        >
          Learn more about Trade-in
        </Link>
      </div>

      {/* Right side feature list card */}
      <div className="bg-white rounded-[20px] p-6 md:p-8 w-full md:w-[400px] shadow-sm">
        <div className="space-y-5">
          
          <div className="flex items-center gap-4">
            <div className="bg-[#dcd0f0] w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0">
              <Award size={22} className="text-[#3a206b]" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold text-[#111]">
              High offer value in refurbishment
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#dcd0f0] w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0">
              <Banknote size={22} className="text-[#3a206b]" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold text-[#111]">
              Fast cash payment directly deposited
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#dcd0f0] w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0">
              <Truck size={22} className="text-[#3a206b]" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold text-[#111]">
              Free & insured shipping
            </span>
          </div>

        </div>
      </div>

    </div>
  )
}
