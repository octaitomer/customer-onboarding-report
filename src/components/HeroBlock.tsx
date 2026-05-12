import { useState, useEffect, useRef } from 'react'
import EditableText from './primitives/EditableText'
import DateInput from './primitives/DateInput'

type Props = {
  onboardingPercent: string
  pilotStart: string
  pilotFinish: string
  showFinish: boolean
  onPct: (v: string) => void
  onStart: (v: string) => void
  onFinish: (v: string) => void
  onToggleFinish: () => void
}

export default function HeroBlock({
  onboardingPercent, pilotStart, pilotFinish,
  showFinish, onPct, onStart, onFinish, onToggleFinish,
}: Props) {
  const [showControls, setShowControls] = useState(false)
  const controlsRef = useRef<HTMLDivElement>(null)
  const showControlsRef = useRef(false)
  showControlsRef.current = showControls

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (!showControlsRef.current) return
      if (controlsRef.current && !controlsRef.current.contains(e.target as Node)) {
        setShowControls(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  function step(delta: number) {
    const current = parseInt(onboardingPercent, 10)
    const base = isNaN(current) ? 0 : current
    onPct(String(Math.max(0, Math.min(100, base + delta))))
  }

  return (
    <div
      className="headline-block"
      style={{
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        gap: '24px',
        alignItems: 'center',
        background: '#000',
        color: '#fff',
        padding: '16px 24px',
        marginBottom: '18px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />

      {/* Left: big % */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          ref={controlsRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontFamily: 'inherit',
              fontSize: '56px',
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              cursor: 'pointer',
            }}
            onClick={() => setShowControls((v) => !v)}
            title="Click to adjust"
          >
            <EditableText
              value={onboardingPercent}
              onChange={onPct}
              placeholder="[XX]"
              style={{ color: '#fff', outline: 'none' }}
            />
            <span style={{ fontSize: '28px', color: '#FF7032', fontWeight: 400 }}>%</span>
          </div>

          {/* +/- stepper — visible after clicking the number */}
          {showControls && (
            <div className="no-print" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              {[
                { delta: 5, label: '+' },
                { delta: -5, label: '−' },
              ].map(({ delta, label }) => (
                <button
                  key={delta}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); step(delta) }}
                  style={{
                    width: '28px',
                    height: '28px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '16px',
                    lineHeight: 1,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.12s, border-color 0.12s',
                    fontFamily: '"JetBrains Mono", monospace',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FF5C39'
                    e.currentTarget.style.borderColor = '#FF5C39'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginTop: '8px',
          }}
        >
          Overall Progress
        </div>
      </div>

      {/* Right: dates */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: 'inherit',
          fontSize: '13.5px',
          lineHeight: 1.45,
          borderLeft: '2px solid #FF7032',
          paddingLeft: '16px',
          color: 'rgba(255,255,255,0.92)',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '14px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
              fontSize: '9.5px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '6px',
            }}
          >
            Pilot Start Date
          </div>
          <DateInput
            value={pilotStart}
            onChange={onStart}
            format="DD MM YYYY"
            style={{
              fontFamily: 'inherit',
              fontSize: '18px',
              fontWeight: 500,
              letterSpacing: '-0.015em',
              lineHeight: 1.1,
              color: '#fff',
            }}
          />
        </div>
        <div>
          {showFinish ? (
            <>
              <div
                style={{
                  fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                  fontSize: '9.5px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Pilot Finish Date
                <button
                  type="button"
                  className="no-print"
                  onClick={onToggleFinish}
                  title="Hide finish date"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0 2px',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '12px',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
                >
                  👁
                </button>
              </div>
              <DateInput
                value={pilotFinish}
                onChange={onFinish}
                format="DD MM YYYY"
                style={{
                  fontFamily: 'inherit',
                  fontSize: '18px',
                  fontWeight: 500,
                  letterSpacing: '-0.015em',
                  lineHeight: 1.1,
                  color: '#fff',
                }}
              />
            </>
          ) : (
            <button
              type="button"
              className="no-print"
              onClick={onToggleFinish}
              title="Show finish date"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px dashed rgba(255,255,255,0.18)',
                borderRadius: '4px',
                padding: '6px 10px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.3)',
                fontSize: '10px',
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
            >
              <span>👁</span> Show finish date
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
