import EditableText from './primitives/EditableText'
import DateInput from './primitives/DateInput'

type Props = {
  partnerName: string
  site: string
  date: string
  onPartnerName: (v: string) => void
  onSite: (v: string) => void
  onDate: (v: string) => void
}

export default function Header({ partnerName, site, date, onPartnerName, onSite, onDate }: Props) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1.5px solid #000',
        paddingBottom: '12px',
        marginBottom: '20px',
        gap: '32px',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', lineHeight: 1 }}>
        <img
          src="/assets/logo/Logo_Black.svg"
          alt="OctaiPipe"
          style={{ height: '26px', width: 'auto', display: 'block' }}
        />
        <span
          style={{
            fontFamily: 'inherit',
            fontSize: '26px',
            fontWeight: 400,
            color: '#6D6C6C',
            lineHeight: 1,
          }}
        >
          ×
        </span>
        <EditableText
          value={partnerName}
          onChange={onPartnerName}
          placeholder="Partner"
          style={{
            fontFamily: 'inherit',
            fontSize: '26px',
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: '-0.015em',
            color: '#000',
          }}
        />
      </div>

      {/* Meta */}
      <div
        style={{
          textAlign: 'right',
          fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
          fontSize: '10.5px',
          color: '#000',
          lineHeight: 1.8,
          letterSpacing: '0.04em',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <span style={{ color: '#6D6C6C', textTransform: 'uppercase', letterSpacing: '0.12em', minWidth: '70px', textAlign: 'right' }}>
            SITE
          </span>
          <EditableText
            value={site}
            onChange={onSite}
            placeholder="SITE"
            style={{ fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <span style={{ color: '#6D6C6C', textTransform: 'uppercase', letterSpacing: '0.12em', minWidth: '70px', textAlign: 'right' }}>
            DATE
          </span>
          <DateInput
            value={date}
            onChange={onDate}
            format="DD MM YYYY"
            style={{ fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit' }}
          />
        </div>
      </div>
    </header>
  )
}
