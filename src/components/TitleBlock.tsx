import EditableText from './primitives/EditableText'

type Props = {
  eyebrow: string
  main: string
  accent: string
  sub: string
  deck: string
  onEyebrow: (v: string) => void
  onMain: (v: string) => void
  onAccent: (v: string) => void
  onSub: (v: string) => void
  onDeck: (v: string) => void
}

export default function TitleBlock({
  eyebrow, main, accent, sub, deck,
  onEyebrow, onMain, onAccent, onSub, onDeck,
}: Props) {
  return (
    <div style={{ marginBottom: '12px' }}>
      {/* Eyebrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#FF7032',
          marginBottom: '14px',
        }}
      >
        <span
          style={{
            width: '28px',
            height: '1.5px',
            background: '#FF7032',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <EditableText
          value={eyebrow}
          onChange={onEyebrow}
          placeholder="Pilot Progress Report"
          style={{ fontFamily: 'inherit', letterSpacing: 'inherit', fontSize: 'inherit' }}
        />
      </div>

      {/* H1 */}
      <h1
        style={{
          fontFamily: 'inherit',
          fontWeight: 500,
          fontSize: '38px',
          lineHeight: 1.02,
          letterSpacing: '-0.025em',
          marginBottom: '10px',
        }}
      >
        <EditableText
          value={main}
          onChange={onMain}
          placeholder="Customer"
          style={{ color: '#000' }}
        />
        {' '}
        <EditableText
          value={accent}
          onChange={onAccent}
          placeholder="Pilot"
          style={{ color: '#FF7032' }}
        />
        <br />
        <EditableText
          value={sub}
          onChange={onSub}
          placeholder="Onboarding Tracker"
          style={{ color: '#000' }}
        />
      </h1>

      {/* Deck */}
      <EditableText
        value={deck}
        onChange={onDeck}
        placeholder="Report description…"
        as="p"
        multiline
        style={{
          fontSize: '14px',
          color: '#3D3D3D',
          maxWidth: '640px',
          lineHeight: 1.5,
        }}
      />
    </div>
  )
}
