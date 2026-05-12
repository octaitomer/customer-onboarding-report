type Props = {
  page: number
  totalPages: number
  partnerName: string
}

export default function Footer({ page, totalPages, partnerName }: Props) {
  return (
    <footer className="page-footer" style={{
      marginTop: 'auto',
      flexShrink: 0,
      borderTop: '1.5px solid #000',
      paddingTop: '10px',
      display: 'flex',
      alignItems: 'baseline',
      fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
      fontSize: '10px',
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#6D6C6C',
    }}>
      <div style={{ flex: 1, textAlign: 'left' }}>
        OCTAIPIPE &nbsp;&mdash;&nbsp; {partnerName.toUpperCase()}
      </div>
      <div style={{ flex: 1, textAlign: 'center', color: '#000' }}>Confidential</div>
      <div style={{ flex: 1, textAlign: 'right', color: '#FF7032' }}>
        Page {String(page).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
      </div>
    </footer>
  )
}
