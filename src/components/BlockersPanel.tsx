import type { Blocker } from '../lib/types'
import EditableText from './primitives/EditableText'

const RISK_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: 'High', color: '#FF4D2E', bg: '#FCE0DA' },
  med:  { label: 'Med',  color: '#B36A00', bg: '#FBEBD2' },
  low:  { label: 'Low',  color: '#6D6C6C', bg: '#E8E7E7' },
}

const MONO: React.CSSProperties = {
  fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
}

type Props = {
  blockers: Blocker[]
  onAdd: () => void
  onRemove: (id: string) => void
  onPatch: (id: string, text: string) => void
  onCycleLevel: (id: string) => void
}

function hoverOn(e: React.MouseEvent<HTMLButtonElement>) {
  const el = e.currentTarget
  el.style.borderColor = '#FF7032'
  el.style.color = '#FF7032'
}
function hoverOff(e: React.MouseEvent<HTMLButtonElement>) {
  const el = e.currentTarget
  el.style.borderColor = '#CCCBCA'
  el.style.color = '#6D6C6C'
}

export default function BlockersPanel({ blockers, onAdd, onRemove, onPatch, onCycleLevel }: Props) {
  return (
    <section style={{ marginBottom: '24px' }}>
      <h3 style={{
        fontFamily: 'inherit', fontWeight: 500, fontSize: '15px',
        marginBottom: '12px', paddingBottom: '7px', borderBottom: '1px solid #CCCBCA',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <span style={{ width: '6px', height: '6px', background: '#FF7032', display: 'inline-block' }} />
        Blockers &amp; risks
      </h3>
      <ul style={{ listStyle: 'none', fontSize: '12.5px', lineHeight: 1.5 }}>
        {blockers.map((b) => {
          const risk = RISK_STYLES[b.level] ?? RISK_STYLES.low
          return (
            <li key={b.id} className="group" style={{
              padding: '8px 0', borderBottom: '1px dotted #CCCBCA',
              display: 'flex', gap: '10px', alignItems: 'flex-start',
            }}>
              <span
                onClick={() => onCycleLevel(b.id)}
                className={`risk-${b.level}`}
                style={{
                  ...MONO, fontSize: '9px', padding: '3px 7px',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  marginRight: '8px', lineHeight: 1, flexShrink: 0, marginTop: '2px',
                  border: `1px solid ${risk.color}`, cursor: 'pointer', userSelect: 'none',
                  color: risk.color, background: risk.bg,
                }}
              >
                {risk.label}
              </span>
              <EditableText
                value={b.text}
                onChange={(v) => onPatch(b.id, v)}
                placeholder="Describe blocker or risk…"
                style={{ flex: 1, fontSize: '12.5px', color: '#000' }}
              />
              <button
                type="button"
                onClick={() => onRemove(b.id)}
                title="Remove"
                className="no-print opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'transparent', border: 'none', color: '#6D6C6C',
                  ...MONO, fontSize: '12px', cursor: 'pointer', padding: '0 4px', lineHeight: 1,
                }}
              >
                {'×'}
              </button>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        onClick={onAdd}
        className="no-print"
        style={{
          marginTop: '6px', background: 'transparent', border: '1px dashed #CCCBCA',
          color: '#6D6C6C', ...MONO, fontSize: '9.5px', letterSpacing: '0.14em',
          textTransform: 'uppercase', padding: '5px 10px', cursor: 'pointer',
          width: '100%', textAlign: 'left',
        }}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        + Add blocker / risk
      </button>
    </section>
  )
}
