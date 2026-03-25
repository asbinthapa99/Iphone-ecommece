'use client'

import { useEffect, useRef, useState } from 'react'
import { ShoppingBag, Microscope, Award, ShieldCheck } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    icon: ShoppingBag,
    title: 'We source',
    desc: 'We buy directly from individual sellers at Tamrakar Complex, New Road, and online. Cash deals. No middlemen.',
    detail: 'Every iPhone comes with proof of purchase and seller ID verification.',
    color: '#1D9E75',
  },
  {
    num: '02',
    icon: Microscope,
    title: 'We inspect',
    desc: '12-point physical inspection — battery health, screen, all cameras, charging port, IMEI check, iCloud status.',
    detail: 'Takes 45–60 minutes per device. No shortcuts. Ever.',
    color: '#0ea5e9',
  },
  {
    num: '03',
    icon: Award,
    title: 'We grade',
    desc: 'Grade A (like new, 90%+ battery), B (good condition, 80%+), or C (visible wear, 70%+). Honest. Always.',
    detail: 'Photos of every scratch uploaded. What you see is what you get.',
    color: '#f59e0b',
  },
  {
    num: '04',
    icon: ShieldCheck,
    title: 'You buy safely',
    desc: 'Pay via eSewa or Khalti. 3-month Inexa warranty on every device. KTM same-day delivery.',
    detail: 'Something wrong? We fix or replace it. No questions asked.',
    color: '#8b5cf6',
  },
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = stepRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(i)
          }
        },
        { rootMargin: '-30% 0px -30% 0px' }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  return (
    <section className="bg-[#fafaf9] border-y border-[#ebebeb] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 relative">
          
          {/* Sticky Left Sidebar */}
          <div className="lg:w-2/5 relative">
            <div className="lg:sticky lg:top-24">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold text-[#1D9E75] bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-full px-2.5 py-1 tracking-wider uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
                The process
              </span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#060d0a] tracking-tight leading-[1.05] mb-5">
                How every Inexa phone <br className="hidden lg:block"/>
                <span className="bg-gradient-to-br from-[#1D9E75] to-[#0F6E56] bg-clip-text text-transparent block mt-2">
                  earns your trust.
                </span>
              </h2>
              
              <p className="text-[#666] text-base leading-relaxed max-w-sm mb-10">
                A rigorous 4-step process before any device reaches you. No exceptions.
              </p>

              {/* Step indicator (desktop only feature) */}
              <div className="hidden lg:flex flex-col gap-4">
                {STEPS.map((step, i) => {
                  const isActive = activeStep === i
                  const isPast = activeStep > i
                  return (
                    <div 
                      key={i} 
                      className="flex items-center gap-4 transition-all duration-300 cursor-pointer" 
                      style={{ opacity: isActive ? 1 : isPast ? 0.6 : 0.3 }}
                      onClick={() => {
                        stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300" 
                           style={{
                             backgroundColor: isActive ? step.color : isPast ? step.color + '20' : '#e5e5e5',
                             color: isActive ? '#fff' : isPast ? step.color : '#888',
                             transform: isActive ? 'scale(1.1)' : 'scale(1)'
                           }}>
                        {i + 1}
                      </div>
                      <span className="font-semibold text-sm transition-all duration-300" 
                            style={{ 
                              color: isActive ? '#000' : isPast ? '#444' : '#888',
                              transform: isActive ? 'translateX(4px)' : 'translateX(0)'
                            }}>
                        {step.title}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right side - Scrolling Cards */}
          <div className="lg:w-3/5 flex flex-col gap-6 md:gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = activeStep === i
              return (
                <div 
                  key={step.num}
                  ref={el => { stepRefs.current[i] = el }}
                  className="relative bg-white rounded-3xl p-6 md:p-8 transition-all duration-700 ease-out border origin-center group"
                  style={{
                    borderColor: isActive ? step.color + '40' : '#f0f0f0',
                    boxShadow: isActive ? `0 24px 48px -12px ${step.color}25` : '0 4px 24px -12px rgba(0,0,0,0.06)',
                    transform: isActive ? 'scale(1)' : 'scale(0.98)',
                  }}
                >
                  {/* Colored top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to right, ${step.color}, ${step.color}aa)`,
                      opacity: isActive ? 1 : 0,
                    }}
                  />

                  {/* Decorative faint number */}
                  <span className="absolute top-6 right-8 text-[100px] font-black leading-none pointer-events-none transition-all duration-700 select-none" 
                        style={{ 
                          color: step.color, 
                          opacity: isActive ? 0.03 : 0.01, 
                          transform: isActive ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.9)' 
                        }}>
                    {step.num}
                  </span>

                  <div className="relative z-10 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500" 
                         style={{ 
                           backgroundColor: isActive ? step.color + '15' : '#f5f5f5', 
                           color: isActive ? step.color : '#888' 
                         }}>
                      <Icon size={24} strokeWidth={isActive ? 2 : 1.5} />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-[#060d0a] mb-2 tracking-tight transition-colors duration-300"
                          style={{ color: isActive ? '#000' : '#444' }}>
                        {step.title}
                      </h3>
                      <p className="text-[#555] text-sm leading-relaxed mb-4">
                        {step.desc}
                      </p>
                      <div className="inline-flex items-start gap-2.5 bg-[#f8f8f8] p-3 rounded-xl border border-[#eeeeee] transition-all duration-500"
                           style={{
                             backgroundColor: isActive ? step.color + '05' : '#f8f8f8',
                             borderColor: isActive ? step.color + '20' : '#eeeeee'
                           }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-colors duration-300" 
                             style={{ backgroundColor: isActive ? step.color : '#ccc' }} />
                        <p className="text-xs text-[#777] leading-relaxed italic">
                          {step.detail}
                        </p>
                      </div>
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
