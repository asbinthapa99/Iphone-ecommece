import { ShieldCheck, Star, Truck, Clock, Users, MapPin, Phone, Mail } from 'lucide-react'

const STATS = [
  { num: '247+', label: 'Phones Sold' },
  { num: '100%', label: 'IMEI Verified' },
  { num: '3 mo', label: 'Warranty' },
  { num: '12pt', label: 'Inspection' },
]

const VALUES = [
  { icon: ShieldCheck, title: 'Verified Every Time', desc: 'Every device is IMEI-checked against NTA Nepal database before it ever reaches your hands.' },
  { icon: Star, title: 'Graded Honestly', desc: 'Our A/B/C grading system reflects real condition — no surprises when the box opens.' },
  { icon: Truck, title: '24h KTM Delivery', desc: 'Same-day delivery in Kathmandu. Pokhara and major cities within 48 hours.' },
  { icon: Clock, title: '6-Month Warranty', desc: 'All phones come with a 6-month Inexa warranty. Extended coverage available at checkout.' },
]

const TEAM = [
  { name: 'Aarav Sharma', role: 'Founder & CEO', initials: 'AS' },
  { name: 'Priya Thapa', role: 'Head of Quality', initials: 'PT' },
  { name: 'Rohan KC', role: 'Tech Lead', initials: 'RK' },
]

export default function AboutPage() {
  return (
    <main style={{ background: '#fff' }}>
      {/* Hero */}
      <section style={{ background: '#060d0a', color: '#fff' }}>
        <div className="max-w-3xl mx-auto px-5 py-16 sm:py-24 text-center">
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
            Our Story
          </p>
          <h1 style={{ fontSize: 'clamp(28px,6vw,48px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
            Nepal&apos;s most trusted<br />
            <span style={{ color: '#1D9E75' }}>iPhone marketplace</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>
            We started Inexa because buying second-hand phones in Nepal was a gamble.
            Fake IMEIs, hidden damage, no accountability. We fixed that.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-4xl mx-auto px-5 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(({ num, label }) => (
            <div key={label} className="text-center">
              <p style={{ fontSize: 'clamp(26px,5vw,36px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-1px', lineHeight: 1 }}>{num}</p>
              <p style={{ fontSize: 12, color: '#999', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-5 py-14 sm:py-20">
        <p style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Mission</p>
        <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-0.8px', lineHeight: 1.2, marginBottom: 16, maxWidth: 560 }}>
          Every phone should come with proof, not promises.
        </h2>
        <p style={{ fontSize: 15, color: '#666', lineHeight: 1.75, maxWidth: 560 }}>
          Inexa Nepal was founded in 2023 in Kathmandu with one goal: make the used iPhone
          market transparent. We inspect every device through a 12-point checklist, verify
          IMEI against the NTA database, and grade honestly — A for excellent, B for good,
          C for budget. No upselling, no hidden fees.
        </p>
      </section>

      {/* Values */}
      <section style={{ background: '#fafaf8', borderTop: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-4xl mx-auto px-5 py-14">
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 32, textAlign: 'center' }}>Why Inexa</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-[16px]" style={{ background: '#fff', border: '1px solid #ebebeb' }}>
                <div className="flex items-center justify-center rounded-[10px] shrink-0" style={{ width: 40, height: 40, background: '#E1F5EE' }}>
                  <Icon size={18} color="#0F6E56" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a', marginBottom: 4 }}>{title}</p>
                  <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-3xl mx-auto px-5 py-14">
        <p style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>The Team</p>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#060d0a', textAlign: 'center', marginBottom: 32, letterSpacing: '-0.5px' }}>People behind every inspection</h2>
        <div className="grid grid-cols-3 gap-4">
          {TEAM.map(({ name, role, initials }) => (
            <div key={name} className="text-center p-5 rounded-[16px]" style={{ border: '1px solid #ebebeb' }}>
              <div className="mx-auto mb-3 flex items-center justify-center rounded-full" style={{ width: 52, height: 52, background: '#060d0a', fontSize: 16, fontWeight: 700, color: '#1D9E75' }}>
                {initials}
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a' }}>{name}</p>
              <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section style={{ background: '#060d0a', color: '#fff' }}>
        <div className="max-w-3xl mx-auto px-5 py-14 text-center">
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Visit Us</p>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 20 }}>Find us in Kathmandu</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {[
              { icon: MapPin, text: 'New Baneshwor, Kathmandu' },
              { icon: Phone, text: '+977 980-000-0000' },
              { icon: Mail, text: 'hello@inexanepal.com' },
              { icon: Users, text: 'Mon–Sat 10am–7pm' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={14} color="#1D9E75" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
