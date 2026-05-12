import type { OutlookWeek } from '../lib/types'
import EditableText from './primitives/EditableText'
import DateInput from './primitives/DateInput'

type Props = {
  previous: OutlookWeek
  next: OutlookWeek
  sectionIndex: number
  sectionTotal: number
  onDates: (week: 'previous' | 'next', patch: { startDate?: string; endDate?: string }) => void
  onAddItem: (week: 'previous' | 'next') => void
  onRemoveItem: (week: 'previous' | 'next', idx: number) => void
  onPatchItem: (week: 'previous' | 'next', idx: number, text: string) => void
}

const MONO: React.CSSProperties = {
  fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
}

function WeekCol({
  week,
  label,
  isThis,
  onDates,
  onAddItem,
  onRemoveItem,
  onPatchItem,
}: {
  week: OutlookWeek
  label: string
  isThis: boolean
  onDates: (patch: { startDate?: string; endDate?: string }) => void
  onAddItem: () => void
  onRemoveItem: (idx: number) => void
  onPatchItem: (idx: number, text: string) => void
}) {
  return (
    <div
      style={{
        background: '#fff',
        padding: '14px 16px',
        position: 'relative',
      }}
    >
      {isThis && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '2px',
            background: '#FF7032',
          }}
        />
      )}
      <div
        style={{
          ...MONO,
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: isThis ? '#FF7032' : '#6D6C6C',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      {/* Date range */}
      <div
        style={{
          ...MONO,
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '10px',
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <DateInput
          value={week.startDate}
          onChange={(v) => onDates({ startDate: v })}
          format="DD MM"
          style={{ ...MONO, fontSize: '14px', fontWeight: 500 }}
        />
        <span style={{ color: '#6D6C6C', margin: '0 4px' }}>→</span>
        <DateInput
          value={week.endDate}
          onChange={(v) => onDates({ endDate: v })}
          format="DD MM"
          style={{ ...MONO, fontSize: '14px', fontWeight: 500 }}
        />
      </div>

      {/* Events */}
      <ul style={{ listStyle: 'none', fontSize: '11.5px', lineHeight: 1.5 }}>
        {week.items.map((item, i) => (
          <li
            key={i}
            style={{
              padding: '3px 0',
              color: '#3D3D3D',
              display: 'flex',
              gap: '8px',
            }}
            className="group"
          >
            <span style={{ color: '#FF7032', fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace', flexShrink: 0 }}>
              →
            </span>
            <EditableText
              value={item}
              onChange={(v) => onPatchItem(i, v)}
              placeholder="Add event…"
              style={{ flex: 1, color: '#3D3D3D', fontSize: '11.5px' }}
            />
            <button
              type="button"
              onClick={() => onRemoveItem(i)}
              title="Remove"
              className="no-print opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6D6C6C',
                cursor: 'pointer',
                fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                fontSize: '12px',
                padding: '0 4px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onAddItem}
        className="no-print"
        style={{
          marginTop: '6px',
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
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#FF7032'
          ;(e.currentTarget as HTMLButtonElement).style.color = '#FF7032'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#CCCBCA'
          ;(e.currentTarget as HTMLButtonElement).style.color = '#6D6C6C'
        }}
      >
        + Add event
      </button>
    </div>
  )
}

export default function OutlookGrid({
  previous, next, sectionIndex, sectionTotal,
  onDates, onAddItem, onRemoveItem, onPatchItem,
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
          Four-week outlook
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
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          background: '#CCCBCA',
          border: '1px solid #CCCBCA',
        }}
      >
        <WeekCol
          week={previous}
          label="PREVIOUS WEEK"
          isThis
          onDates={(p) => onDates('previous', p)}
          onAddItem={() => onAddItem('previous')}
          onRemoveItem={(i) => onRemoveItem('previous', i)}
          onPatchItem={(i, t) => onPatchItem('previous', i, t)}
        />
        <WeekCol
          week={next}
          label="NEXT WEEK"
          isThis={false}
          onDates={(p) => onDates('next', p)}
          onAddItem={() => onAddItem('next')}
          onRemoveItem={(i) => onRemoveItem('next', i)}
          onPatchItem={(i, t) => onPatchItem('next', i, t)}
        />
      </div>
    </section>
  )
}
