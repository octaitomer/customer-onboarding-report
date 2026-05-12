interface Props {
  customerName: string
  site?: string
  onBack: () => void
}

const ACCENT = '#FF5C39'

export default function Toolbar({ customerName, site, onBack }: Props) {
  return (
    <div
      className="no-print"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: '60px',
        background: '#111111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: '0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Left — logo + back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img
          src="/Logo_White.png"
          alt="OctaiPipe"
          style={{ height: '24px', width: 'auto', display: 'block', flexShrink: 0 }}
        />
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '6px 14px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.color = '#fff'
            b.style.borderColor = 'rgba(255,255,255,0.4)'
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.color = 'rgba(255,255,255,0.55)'
            b.style.borderColor = 'rgba(255,255,255,0.15)'
          }}
        >
          <span style={{ fontSize: '14px', lineHeight: 1 }}>←</span>
          All Customers
        </button>
      </div>

      {/* Centre — customer name · site */}
      <span
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.8)',
          letterSpacing: '0.01em',
        }}>
          {customerName}
        </span>
        {site && (
          <>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>·</span>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}>
              {site}
            </span>
          </>
        )}
      </span>

      {/* Right — save as PDF */}
      <button
        type="button"
        onClick={() => window.print()}
        style={{
          background: ACCENT,
          color: '#fff',
          border: 'none',
          padding: '8px 18px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = '#e04d2e'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = ACCENT
        }}
      >
        Save as PDF
      </button>
    </div>
  )
}
