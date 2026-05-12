import type { Phase } from '../lib/types'
import EditableText from './primitives/EditableText'
import ProgressBar from './primitives/ProgressBar'
import DateInput from './primitives/DateInput'

const PHASE_STATES = {
  pending:   { dot: '○', label: '○ Pending',   bgClass: '' },
  active:    { dot: '●', label: '● Active',     bgClass: 'active' },
  completed: { dot: '✓', label: '✓ Completed',  bgClass: 'completed' },
} as const

type Props = {
  phases: Phase[]
  sectionIndex: number
  sectionTotal: number
  onCycleStatus: (id: string) => void
  onTitle: (id: string, v: string) => void
  onPercent: (id: string, v: number) => void
  onStartDate: (id: string, v: string) => void
  onEndDate: (id: string, v: string) => void
  hideEndDate: (id: string) => boolean
}

export default function PhaseGrid({
  phases, sectionIndex, sectionTotal,
  onCycleStatus, onTitle, onPercent, onStartDate, onEndDate, hideEndDate,
}: Props) {
  return (
    <section style={{ marginBottom: '8px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '14px',
          paddingBottom: '8px',
          borderBottom: '1px solid #CCCBCA',
        }}
      >
        <h2 style={{ fontFamily: 'inherit', fontWeight: 500, fontSize: '19px', letterSpacing: '-0.01em' }}>
          Programme phase
        </h2>
        <span
          style={{
            fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
            fontSize: '10.5px',
            color: '#6D6C6C',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          {String(sectionIndex).padStart(2, '0')} / {String(sectionTotal).padStart(2, '0')}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${phases.length}, 1fr)`,
          border: '1px solid #CCCBCA',
        }}
      >
        {phases.map((phase, i) => {
          const cfg = PHASE_STATES[phase.status]
          const isActive = phase.status === 'active'
          const isCompleted = phase.status === 'completed'
          const bg = isActive ? '#FFE9DD' : isCompleted ? 'rgba(46,160,99,0.08)' : '#fff'
          const stateColor = isActive ? '#FF7032' : isCompleted ? '#2ea063' : '#6D6C6C'
          return (
            <div
              key={phase.id}
              style={{
                padding: '12px 16px',
                background: bg,
                borderLeft: i > 0 ? '1px solid #CCCBCA' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                  fontSize: '10.5px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: isActive ? '#000' : '#3D3D3D',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <EditableText
                  value={phase.title}
                  onChange={(v) => onTitle(phase.id, v)}
                  placeholder="Phase name"
                  style={{ fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit' }}
                />
                <span
                  style={{ color: stateColor, cursor: 'pointer', userSelect: 'none', flexShrink: 0, marginLeft: '8px' }}
                  title="Click to change"
                  onClick={() => onCycleStatus(phase.id)}
                >
                  {cfg.label}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'inherit',
                  fontSize: '26px',
                  fontWeight: 500,
                  letterSpacing: '-0.025em',
                  lineHeight: 1,
                }}
              >
                <EditableText
                  value={String(phase.percent)}
                  onChange={(v) => {
                    const n = parseInt(v.replace(/\D/g, ''), 10)
                    onPercent(phase.id, isNaN(n) ? 0 : Math.max(0, Math.min(100, n)))
                  }}
                  placeholder="0"
                  style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                />
                %
              </div>
              <div style={{ marginTop: '10px' }}>
                <ProgressBar
                  percent={phase.percent}
                  onChange={(v) => onPercent(phase.id, v)}
                  active={isActive}
                  completed={isCompleted}
                  height={4}
                />
              </div>
              <div style={{
                marginTop: '10px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                    fontSize: '8px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#9CA3AF',
                    marginBottom: '3px',
                  }}>
                    Start
                  </div>
                  <DateInput
                    value={phase.startDate ?? ''}
                    onChange={(v) => onStartDate(phase.id, v)}
                    format="DD MM YYYY"
                    style={{
                      fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                      fontSize: '10px',
                      letterSpacing: '0.06em',
                      color: isActive ? '#FF7032' : '#6D6C6C',
                    }}
                  />
                </div>
                {!hideEndDate(phase.id) && (
                  <>
                    <div style={{
                      width: '1px',
                      height: '24px',
                      background: '#CCCBCA',
                      flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, marginLeft: '12px' }}>
                      <div style={{
                        fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                        fontSize: '8px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#9CA3AF',
                        marginBottom: '3px',
                      }}>
                        End
                      </div>
                      <DateInput
                        value={phase.endDate ?? ''}
                        onChange={(v) => onEndDate(phase.id, v)}
                        format="DD MM YYYY"
                        style={{
                          fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                          fontSize: '10px',
                          letterSpacing: '0.06em',
                          color: isCompleted ? '#2ea063' : '#6D6C6C',
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
