import { ImeiStatus } from '@/types'
import { ShieldCheck } from 'lucide-react'

export function ImeiStatusBadge({ status }: { status: ImeiStatus }) {
  if (status !== 'clean') return null
  return (
    <span
      className="flex items-center gap-1 text-[9px] font-medium"
      style={{
        background: '#f4faf7',
        color: '#0F6E56',
        border: '0.5px solid #c8ead9',
        padding: '2px 7px',
        borderRadius: 20,
      }}
    >
      <ShieldCheck size={9} />
      IMEI Clean
    </span>
  )
}
