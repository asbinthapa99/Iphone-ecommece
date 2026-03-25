'use client'

import { useState } from 'react'
import {
  HelpCircle,
  ChevronDown,
  Microscope,
  ShieldCheck,
  RefreshCcw,
  BatteryCharging,
  Truck,
  CreditCard
} from 'lucide-react'

const FAQS = [
  {
    icon: HelpCircle,
    question: "What condition are the iPhones in?",
    answer: "We offer iPhones in Grade A (like new, 90%+ battery), Grade B (good condition, light wear, 80%+ battery), and Grade C (visible wear, fully functional, 70%+ battery). All phones undergo a rigorous 12-point inspection.",
  },
  {
    icon: Microscope,
    question: "How does your 12-point inspection work?",
    answer: "Every device is manually checked by our experts. We verify battery health, test all cameras, ensure the screen is original, check the charging port, confirm IMEI status, and ensure there are no iCloud locks.",
  },
  {
    icon: ShieldCheck,
    question: "Is the 6-month warranty comprehensive?",
    answer: "Yes. Our 6-month warranty covers all functional defects. If the phone develops a hardware issue that wasn't caused by accidental damage or water exposure, we will fix or replace it with no questions asked.",
  },
  {
    icon: RefreshCcw,
    question: "Can I trade in my old phone?",
    answer: "Absolutely! We offer instant quotes for your old devices. You can bring your phone to our store or use the &apos;Sell&apos; feature on our website to offset the cost of your purchase.",
  },
  {
    icon: BatteryCharging,
    question: "Do you provide original accessories?",
    answer: "Each iPhone comes with a high-quality charging cable. Original Apple fast-chargers and premium protective cases are available for purchase separately at a discounted rate with your phone.",
  },
  {
    icon: Truck,
    question: "How fast is delivery?",
    answer: "We offer same-day delivery within the Kathmandu Valley for orders placed before 3 PM. For orders outside the valley, delivery typically takes 2-4 business days via our secure courier partners.",
  },
  {
    icon: CreditCard,
    question: "What payment methods do you accept?",
    answer: "We accept Cash on Delivery (inside KTM), digital wallets like eSewa and Khalti, as well as direct bank transfers via Fonepay. EMI options are also available through partner banks.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section id="faq" className="bg-white py-20 lg:py-32 border-t border-[#ebebeb]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column - Heading */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#060d0a] leading-tight tracking-tight mb-5">
                Frequently Asked<br className="hidden lg:block"/> Questions
              </h2>
              <p className="text-[#666] text-base leading-relaxed">
                Can&apos;t find what you&apos;re looking for?<br />
                Please contact our customer support team.
              </p>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {FAQS.map((faq, i) => {
              const isOpen = openIndex === i
              const Icon = faq.icon
              return (
                <div 
                  key={i} 
                  className={`border rounded-[14px] overflow-hidden transition-all duration-300 ${
                    isOpen ? 'border-[#1D9E75] bg-[#1D9E75]/[0.02]' : 'border-[#ebebeb] bg-white hover:border-[#d4d4d4]'
                  }`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={20} className={isOpen ? 'text-[#1D9E75]' : 'text-[#444]'} strokeWidth={1.5} />
                      <span className={`text-[15px] font-medium transition-colors ${isOpen ? 'text-[#1D9E75]' : 'text-[#060d0a]'}`}>
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown 
                      size={20} 
                      className={`text-[#888] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                      strokeWidth={1.5}
                    />
                  </button>
                  
                  <div 
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ 
                      maxHeight: isOpen ? '500px' : '0px',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div className="p-5 pt-0 pl-[52px] text-sm text-[#555] leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
