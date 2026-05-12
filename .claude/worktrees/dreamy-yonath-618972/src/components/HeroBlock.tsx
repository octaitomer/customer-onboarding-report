import EditableText from './primitives/EditableText'
import DateInput from './primitives/DateInput'

type Props = {
  onboardingPercent: string
  pilotStart: string
  pilotFinish: string
  onPct: (v: string) => void
  onStart: (v: string) => void
  onFinish: (v: string) => void
}

export default function HeroBlock({
  onboardingPercent, pilotStart, pilotFinish,
  onPct, onStart, onFinish,
}: Props) {
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
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: 'inherit',
            fontSize: '56px',
            fontWeight: 500,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
          }}
        >
          <EditableText
            value={onboardingPercent}
            onChange={onPct}
            placeholder="[XX]"
            style={{ color: '#fff', outline: 'none' }}
          />
          <span style={{ fontSize: '28px', color: '#FF7032', fontWeight: 400 }}>%</span>
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
          Onboarding Complete
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
            Pilot Finish Date
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
        </div>
      </div>
    </div>
  )
}
