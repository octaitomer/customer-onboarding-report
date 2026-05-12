import type { WorkStream } from '../lib/types'
import EditableText from './primitives/EditableText'
import ProgressBar from './primitives/ProgressBar'

const STREAM_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  ahead:      { label: '▲ Ahead',    color: '#1F7A3A', bg: '#E1F0E5' },
  'on-track': { label: '● On track', color: '#B36A00', bg: '#FBEBD2' },
  behind:     { label: '▼ Behind',   color: '#FF4D2E', bg: '#FCE0DA' },
  pending:    { label: '○ Pending',  color: '#6D6C6C', bg: '#E8E7E7' },
}

const MONO: React.CSSProperties = {
  fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
}

type Props = {
  workStreams: WorkStream[]
  sectionIndex: number
  sectionTotal: number
  onCycleStatus: (streamId: string) => void
  onPatchStream: (streamId: string, patch: { name?: string; percent?: number }) => void
  onAddMilestone: (streamId: string) => void
  onRemoveMilestone: (streamId: string, msId: string) => void
  onPatchMilestone: (streamId: string, msId: string, text: string) => void
  onCycleMilestone: (streamId: string, msId: string) => void
}

function CheckBox({ state, onClick }: { state: string; onClick: () => void }) {
  const isDone = state === 'done'
  const isProgress = state === 'in-progress'
  return (
    <div
      onClick={onClick}
      className="check-box"
      style={{
        width: '12px',
        height: '12px',
        border: `1.5px solid ${isProgress ? '#FF7032' : '#000'}`,
        flexShrink: 0,
        marginTop: '4px',
        position: 'relative',
        background: isDone ? '#000' : isProgress ? '#FF7032' : '#fff',
        cursor: 'pointer',
      }}
    >
      {isDone && (
        <div style={{
          position: 'absolute', left: '2px', top: '-1px',
          width: '4px', height: '7px',
          border: 'solid #fff', borderWidth: '0 1.5px 1.5px 0',
          transform: 'rotate(45deg)',
        }} />
      )}
      {isProgress && (
        <div style={{
          position: 'absolute', left: '2.5px', top: '2.5px',
          width: '5px', height: '5px', background: '#fff',
        }} />
      )}
    </div>
  )
}

const addBtnStyle: React.CSSProperties = {
  marginTop: '4px',
  background: 'transparent',
  border: '1px dashed #CCCBCA',
  color: '#6D6C6C',
  fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
  fontSize: '9.5px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  padding: '4px 8px',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left' as const,
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

export default function WorkStreams({
  workStreams, sectionIndex, sectionTotal,
  onCycleStatus, onPatchStream,
  onAddMilestone, onRemoveMilestone, onPatchMilestone, onCycleMilestone,
}: Props) {
  return (
    <section style={{ marginBottom: '8px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #CCCBCA',
      }}>
        <h2 style={{ fontFamily: 'inherit', fontWeight: 500, fontSize: '19px', letterSpacing: '-0.01em' }}>
          Work streams
        </h2>
        <span style={{ ...MONO, fontSize: '10.5px', color: '#6D6C6C', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {String(sectionIndex).padStart(2, '0')} / {String(sectionTotal).padStart(2, '0')}
        </span>
      </div>

      <div style={{ borderTop: '1px solid #CCCBCA' }}>
        {workStreams.map((ws) => {
          const pill = STREAM_LABELS[ws.status] ?? STREAM_LABELS.pending
          return (
            <div key={ws.id} style={{
              borderBottom: '1px solid #CCCBCA', padding: '12px 0',
              display: 'grid', gridTemplateColumns: '190px 1fr 150px',
              gap: '22px', alignItems: 'start',
            }}>
              {/* Stream label + name */}
              <div>
                <div style={{ ...MONO, fontSize: '10px', letterSpacing: '0.16em', color: '#6D6C6C', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {ws.streamLabel}
                </div>
                <EditableText
                  value={ws.name}
                  onChange={(v) => onPatchStream(ws.id, { name: v })}
                  placeholder="Stream name"
                  as="div"
                  style={{ fontFamily: 'inherit', fontSize: '19px', fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1 }}
                />
              </div>

              {/* Milestones */}
              <div>
                <ul style={{ listStyle: 'none', fontSize: '11.5px', lineHeight: 1.45 }}>
                  {ws.milestones.map((ms) => (
                    <li key={ms.id} className="group" style={{
                      display: 'flex', gap: '10px', padding: '2px 0',
                      alignItems: 'flex-start', position: 'relative',
                    }}>
                      <CheckBox state={ms.state} onClick={() => onCycleMilestone(ws.id, ms.id)} />
                      <EditableText
                        value={ms.text}
                        onChange={(v) => onPatchMilestone(ws.id, ms.id, v)}
                        placeholder="Milestone…"
                        style={{
                          flex: 1, fontSize: '11.5px',
                          color: ms.state === 'done' ? '#6D6C6C' : '#000',
                          textDecoration: ms.state === 'done' ? 'line-through' : 'none',
                          textDecorationThickness: '1px',
                        }}
                      />
                      <button type="button" onClick={() => onRemoveMilestone(ws.id, ms.id)}
                        title="Remove"
                        className="no-print opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'transparent', border: 'none', color: '#6D6C6C', ...MONO, fontSize: '12px', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>
                        {'×'}
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => onAddMilestone(ws.id)}
                  className="no-print" style={addBtnStyle}
                  onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                  + Add milestone
                </button>
              </div>

              {/* Stats */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'inherit', fontSize: '32px', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end' }}>
                  <EditableText
                    value={String(ws.percent)}
                    onChange={(v) => {
                      const n = parseInt(v.replace(/\D/g, ''), 10)
                      onPatchStream(ws.id, { percent: isNaN(n) ? 0 : Math.max(0, Math.min(100, n)) })
                    }}
                    placeholder="0"
                    style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                  />
                  <span style={{ fontSize: '16px', color: '#FF7032', fontWeight: 400 }}>%</span>
                </div>
                <div style={{ marginTop: '10px', marginBottom: '12px' }}>
                  <ProgressBar percent={ws.percent} onChange={(v) => onPatchStream(ws.id, { percent: v })} />
                </div>
                <span onClick={() => onCycleStatus(ws.id)} className="pill-ahead" style={{
                  display: 'inline-block', ...MONO, fontSize: '9.5px', letterSpacing: '0.14em',
                  textTransform: 'uppercase', padding: '5px 9px', border: `1px solid ${pill.color}`,
                  lineHeight: 1, cursor: 'pointer', userSelect: 'none',
                  color: pill.color, background: pill.bg,
                }}>
                  {pill.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
