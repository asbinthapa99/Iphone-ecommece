// Inline SVG payment method logos for eSewa, Khalti & PhonePay

function ESewaLogo() {
  return (
    <svg width="60" height="26" viewBox="0 0 60 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="eSewa">
      <rect width="60" height="26" rx="5" fill="#60BB46" />
      {/* Stylised "e" circle */}
      <circle cx="14" cy="13" r="6" fill="none" stroke="white" strokeWidth="1.8" />
      <line x1="8" y1="13" x2="20" y2="13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      {/* "Sewa" text */}
      <text x="24" y="17.5" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9.5" fill="white" letterSpacing="0.2">Sewa</text>
    </svg>
  )
}

function KhaltiLogo() {
  return (
    <svg width="60" height="26" viewBox="0 0 60 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Khalti">
      <rect width="60" height="26" rx="5" fill="#5C2D91" />
      {/* Simple wallet icon */}
      <rect x="7" y="9" width="12" height="8" rx="1.5" fill="none" stroke="white" strokeWidth="1.6" />
      <circle cx="16.5" cy="13" r="1.5" fill="white" />
      <line x1="7" y1="12" x2="19" y2="12" stroke="white" strokeWidth="1.4" />
      {/* "khalti" text */}
      <text x="23" y="17.5" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9.5" fill="white" letterSpacing="0.2">khalti</text>
    </svg>
  )
}

function PhonePayLogo() {
  return (
    <svg width="72" height="26" viewBox="0 0 72 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PhonePay">
      <rect width="72" height="26" rx="5" fill="#6739B7" />
      {/* Phone icon */}
      <rect x="7" y="6" width="8" height="14" rx="1.5" fill="none" stroke="white" strokeWidth="1.6" />
      <line x1="9" y1="17" x2="13" y2="17" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      {/* "PhonePay" text */}
      <text x="19" y="17.5" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="white" letterSpacing="0.2">PhonePay</text>
    </svg>
  )
}

function CodBadge() {
  return (
    <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cash on Delivery">
      <rect width="40" height="26" rx="5" fill="#f0f0ee" />
      <text x="20" y="17.5" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8.5" fill="#555" textAnchor="middle" letterSpacing="0.1">COD</text>
    </svg>
  )
}

interface PaymentBadgesProps {
  /** Show "Pay with" label */
  label?: boolean
  /** Show COD badge */
  showCod?: boolean
  /** compact = smaller with less spacing */
  compact?: boolean
}

export function PaymentBadges({ label = true, showCod = true, compact = false }: PaymentBadgesProps) {
  return (
    <div className={`flex items-center flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {label && (
        <span style={{ fontSize: compact ? 10 : 11, color: '#999', fontWeight: 500, marginRight: 2 }}>
          Pay with
        </span>
      )}
      <ESewaLogo />
      <KhaltiLogo />
      <PhonePayLogo />
      {showCod && <CodBadge />}
    </div>
  )
}
