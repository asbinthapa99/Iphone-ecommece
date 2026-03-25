import { DeviceGrade } from '@/types'

const GRADE_STYLES: Record<DeviceGrade, { bg: string; color: string; label: string }> = {
  A: { bg: '#060d0a', color: '#1D9E75', label: 'Grade A' },
  B: { bg: '#FAEEDA', color: '#633806', label: 'Grade B' },
  C: { bg: '#FAECE7', color: '#993C1D', label: 'Grade C' },
  X: { bg: '#FCEBEB', color: '#791F1F', label: 'Grade X' },
}

export function GradeBadge({ grade }: { grade: DeviceGrade }) {
  const s = GRADE_STYLES[grade]
  return (
    <span
      className="text-[9px] font-medium uppercase tracking-wide"
      style={{
        background: s.bg,
        color: s.color,
        padding: '2px 7px',
        borderRadius: 20,
      }}
    >
      {s.label}
    </span>
  )
}
