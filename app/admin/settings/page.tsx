'use client'

import { useState } from 'react'
import { Save, Globe, Phone, Mail, ShieldCheck } from 'lucide-react'

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('Inexa Nepal')
  const [whatsapp, setWhatsapp] = useState('9779800000000')
  const [email, setEmail] = useState('hello@inexa.com.np')
  const [warrantyMonths, setWarrantyMonths] = useState('3')
  const [extendedWarrantyPrice, setExtendedWarrantyPrice] = useState('1500')
  const [codCities, setCodCities] = useState('Kathmandu, Pokhara')
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production: save to Supabase settings table
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '0.5px solid #e0e0dc', fontSize: 13, color: '#060d0a',
    background: '#fafaf8', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 600, color: '#888',
    marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em',
  }

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>Settings</h1>
        <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>Manage store configuration</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Store info */}
        <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
          <div className="flex items-center gap-2 mb-4">
            <Globe size={14} color="#1D9E75" />
            <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a' }}>Store Info</p>
          </div>
          <div className="space-y-3">
            <div>
              <label style={labelStyle}>Store Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'} />
            </div>
            <div>
              <label style={labelStyle}>Contact Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'} />
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
          <div className="flex items-center gap-2 mb-4">
            <Phone size={14} color="#1D9E75" />
            <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a' }}>WhatsApp</p>
          </div>
          <div>
            <label style={labelStyle}>WhatsApp Number (with country code)</label>
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="9779800000000" style={inputStyle}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'} />
            <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Used for order inquiries and buy buttons</p>
          </div>
        </div>

        {/* Warranty */}
        <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={14} color="#1D9E75" />
            <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a' }}>Warranty</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Standard Warranty (months)</label>
              <input type="number" value={warrantyMonths} onChange={(e) => setWarrantyMonths(e.target.value)} min="1" max="24" style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'} />
            </div>
            <div>
              <label style={labelStyle}>Extended Warranty Price (NPR)</label>
              <input type="number" value={extendedWarrantyPrice} onChange={(e) => setExtendedWarrantyPrice(e.target.value)} style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'} />
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
          <div className="flex items-center gap-2 mb-4">
            <Mail size={14} color="#1D9E75" />
            <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a' }}>Delivery</p>
          </div>
          <div>
            <label style={labelStyle}>COD Available Cities (comma-separated)</label>
            <input type="text" value={codCities} onChange={(e) => setCodCities(e.target.value)}
              placeholder="Kathmandu, Pokhara" style={inputStyle}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'} />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-[10px]"
          style={{
            background: saved ? '#1D9E75' : '#060d0a',
            color: saved ? '#060d0a' : '#fff',
            fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <Save size={14} />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
