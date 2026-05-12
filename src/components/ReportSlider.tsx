import { useState } from 'react'
import type { Customer } from '../lib/types'

interface Props {
  customer: Customer
  onSelect: (reportId: string) => void
  onAdd: () => void
  onDelete: (reportId: string) => void
}

const ACCENT = '#FF5C39'
const BG = '#1A1A1A'

export default function ReportSlider({ customer, onSelect, onAdd, onDelete }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const sorted = [...customer.reports].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const activeIdx = sorted.findIndex((r) => r.id === customer.activeReportId)
  const canDelete = sorted.length > 1


  return (
    <div
      className="no-print"
      style={{
        position: 'fixed',
        top: '60px',
        left: 0,
        right: 0,
        zIndex: 40,
        height: '80px',
        background: BG,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '0 8px',
        overflowX: 'auto',
      }}
    >
      {/* Report cards */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
        {sorted.map((report, idx) => {
          const isActive = report.id === customer.activeReportId
          const dist = Math.abs(idx - activeIdx)
          const isHov = hoveredId === report.id
          const isConfirming = confirmDeleteId === report.id

          if (isConfirming) {
            return (
              <div
                key={report.id}
                style={{
                  flexShrink: 0,
                  width: '148px',
                  height: '52px',
                  background: '#1f0a08',
                  border: '1px solid #EF4444',
                  borderTop: '3px solid #EF4444',
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '9px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#EF4444',
                }}>
                  Delete report?
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(report.id); setConfirmDeleteId(null) }}
                    style={{
                      flex: 1,
                      background: '#EF4444',
                      border: 'none',
                      color: '#fff',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '9px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: '3px 0',
                    }}
                  >Yes</button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null) }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'rgba(255,255,255,0.55)',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '9px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: '3px 0',
                    }}
                  >No</button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={report.id}
              style={{ position: 'relative', flexShrink: 0 }}
              onMouseEnter={() => setHoveredId(report.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                type="button"
                onClick={() => !isActive && onSelect(report.id)}
                style={{
                  width: isActive ? '160px' : '148px',
                  height: isActive ? '64px' : '52px',
                  background: isActive ? '#fff' : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${isActive ? ACCENT : 'rgba(255,255,255,0.1)'}`,
                  borderTop: `3px solid ${isActive ? ACCENT : 'transparent'}`,
                  padding: '8px 12px',
                  paddingRight: canDelete ? '24px' : '12px',
                  cursor: isActive ? 'default' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                  filter: isActive
                    ? 'none'
                    : isHov
                      ? 'grayscale(0.3) brightness(0.85)'
                      : `grayscale(0.7) brightness(${Math.max(0.55, 0.7 - dist * 0.05)})`,
                  opacity: isActive ? 1 : Math.max(0.55, 1 - dist * 0.12),
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '3px',
                }}
              >
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? ACCENT : 'rgba(255,255,255,0.45)',
                  lineHeight: 1,
                }}>
                  Week Report {idx + 1}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                }}>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: isActive ? '#111' : 'rgba(255,255,255,0.7)',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {report.meta.date || report.createdAt}
                  </span>
                  {report.hero.onboardingPercent !== '' && (
                    <span style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: isActive ? ACCENT : 'rgba(255,165,100,0.75)',
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      {report.hero.onboardingPercent}%
                    </span>
                  )}
                </div>
              </button>

              {/* Delete button — only when >1 report and card is hovered */}
              {canDelete && isHov && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(report.id) }}
                  title="Delete this report"
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'transparent',
                    border: 'none',
                    color: isActive ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)',
                    fontSize: '12px',
                    lineHeight: 1,
                    cursor: 'pointer',
                    padding: '2px 3px',
                    borderRadius: '2px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#EF4444'
                    e.currentTarget.style.background = isActive ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isActive ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          )
        })}

        {/* Add report button */}
        <button
          type="button"
          onClick={onAdd}
          onMouseEnter={() => setHoveredId('__add__')}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            flexShrink: 0,
            width: hoveredId === '__add__' ? '148px' : '44px',
            height: '52px',
            background: hoveredId === '__add__' ? ACCENT : 'transparent',
            border: `1px dashed ${hoveredId === '__add__' ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: '2px',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'width 0.18s ease, background 0.12s',
            overflow: 'hidden',
            padding: '0 10px',
          }}
          aria-label="Add report"
        >
          <span style={{ fontSize: '18px', lineHeight: 1, color: hoveredId === '__add__' ? '#fff' : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>+</span>
          {hoveredId === '__add__' && (
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '9px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              color: 'rgba(255,255,255,0.85)',
            }}>
              Duplicate latest
            </span>
          )}
        </button>
      </div>

    </div>
  )
}
