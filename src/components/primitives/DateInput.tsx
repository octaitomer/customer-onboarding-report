import { useRef } from 'react'

type Format = 'DD MM' | 'DD MM YYYY'

type Props = {
  value: string                    // ISO "YYYY-MM-DD" or ""
  onChange: (v: string) => void    // emits ISO "YYYY-MM-DD"
  format: Format
  style?: React.CSSProperties
}

function formatIso(iso: string, fmt: Format): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [y, m, d] = iso.split('-')
  return fmt === 'DD MM' ? `${d} / ${m}` : `${d} / ${m} / ${y}`
}

export default function DateInput({ value, onChange, format, style }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const display = formatIso(value, format)
  const placeholder = format === 'DD MM' ? 'DD MM' : 'DD MM YYYY'

  function openPicker() {
    const el = inputRef.current
    if (!el) return
    try { el.showPicker() } catch { el.focus() }
  }

  return (
    <span
      role="button"
      tabIndex={0}
      className="date-chip"
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker() }
      }}
      style={{ position: 'relative', cursor: 'pointer', ...style }}
    >
      {display || <span style={{ color: '#CCCBCA', pointerEvents: 'none' }}>{placeholder}</span>}
      <input
        ref={inputRef}
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1px',
          height: '1px',
          opacity: 0,
          border: 'none',
          padding: 0,
          pointerEvents: 'none',
        }}
      />
    </span>
  )
}
