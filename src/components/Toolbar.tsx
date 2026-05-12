export default function Toolbar() {
  return (
    <div
      className="no-print"
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 50,
        display: 'flex',
        gap: '8px',
        background: '#000',
        color: '#fff',
        padding: '8px',
        fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        boxShadow: '0 6px 24px -6px rgba(0,0,0,0.3)',
      }}
    >
      <span style={{ alignSelf: 'center', color: 'rgba(255,255,255,0.55)', padding: '0 8px', fontSize: '10px' }}>
        Click any text to edit · click pills to cycle · drag bars
        <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 8px' }}>·</span>
        PDF: Scale 100%, Margins None, Headers/footers Off
      </span>
      <button
        type="button"
        onClick={() => window.print()}
        style={{
          background: 'transparent',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.25)',
          padding: '7px 12px',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          letterSpacing: 'inherit',
          textTransform: 'inherit',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = '#FF7032'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#FF7032'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)'
        }}
      >
        Save as PDF
      </button>
    </div>
  )
}
