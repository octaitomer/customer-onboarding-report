import { useState, useRef, useEffect } from 'react'
import Toolbar from './components/Toolbar'
import Document from './components/Document'
import Dashboard from './components/Dashboard'
import ReportSlider from './components/ReportSlider'
import { useTrackerStore } from './store/useTrackerStore'
import { TEMPLATE_CUSTOMER_ID } from './lib/defaults'

const ACCENT = '#FF5C39'

export default function App() {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard')
  const store = useTrackerStore()
  const customer = store.customers[store.activeCustomerId]

  function openCustomer(id: string) {
    store.setActive(id)
    setView('editor')
  }

  function openTemplate() {
    store.setActive(TEMPLATE_CUSTOMER_ID)
    setView('editor')
  }

  if (view === 'dashboard') {
    return <Dashboard onOpen={openCustomer} onOpenTemplate={openTemplate} />
  }
  if (!customer) { setView('dashboard'); return null }

  const isTemplate = customer.id === TEMPLATE_CUSTOMER_ID
  const sorted = [...customer.reports].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const activeReport =
    customer.reports.find((r) => r.id === customer.activeReportId) ??
    sorted[sorted.length - 1]

  if (!activeReport) { setView('dashboard'); return null }

  return (
    <div style={{ minHeight: '100vh', background: '#F3F1F1' }}>
      {/* Fixed header + slider */}
      <Toolbar
        customerName={isTemplate ? 'Default Template' : customer.name}
        site={isTemplate ? undefined : activeReport.meta.site}
        onBack={() => setView('dashboard')}
      />
      {!isTemplate && (
        <ReportSlider
          customer={customer}
          onSelect={(rid) => store.setActiveReport(customer.id, rid)}
          onAdd={() => store.addReport(customer.id)}
          onDelete={(rid) => store.removeReport(customer.id, rid)}
        />
      )}

      {/* Scrollable content */}
      <main style={{ paddingTop: isTemplate ? '68px' : '156px', paddingBottom: '40px' }}>
        {/* Template notice banner */}
        {isTemplate && (
          <div
            className="no-print"
            style={{
              maxWidth: '794px',
              margin: '0 auto 12px',
              padding: '10px 20px',
              background: '#111',
              borderLeft: `4px solid ${ACCENT}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ color: ACCENT, fontSize: '14px' }}>⬡</span>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
            }}>
              Default Template — changes apply to new customers only. Existing customers are not affected.
            </span>
          </div>
        )}

        {/* Report header (not shown for template) */}
        {!isTemplate && (
          <ReportHeader
            customerName={customer.name}
            site={activeReport.meta.site}
            date={activeReport.meta.date}
            reportIndex={sorted.findIndex(r => r.id === activeReport.id) + 1}
            onNameChange={(v) => store.renameCustomer(customer.id, v)}
            onDateChange={(v) => store.patchReportDate(customer.id, activeReport.id, v)}
          />
        )}

        <Document
          customerId={customer.id}
          customerName={isTemplate ? 'New Customer' : customer.name}
          report={activeReport}
        />
      </main>
    </div>
  )
}

// ── Inline report header ──────────────────────────────────────────
function ReportHeader({
  customerName,
  site,
  date,
  reportIndex,
  onNameChange,
  onDateChange,
}: {
  customerName: string
  site: string
  date: string
  reportIndex: number
  onNameChange: (v: string) => void
  onDateChange: (v: string) => void
}) {
  return (
    <div
      className="no-print"
      style={{
        maxWidth: '794px',
        margin: '0 auto 12px',
        padding: '14px 20px',
        background: '#fff',
        borderLeft: `4px solid ${ACCENT}`,
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Left: customer name (editable) */}
      <EditableField
        value={customerName}
        onChange={onNameChange}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '20px',
          fontWeight: 600,
          color: '#111',
          letterSpacing: '-0.01em',
        }}
      />

      {/* Centre: site · Week Report N */}
      <span style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#9CA3AF',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        {site && <>{site} · </>}Week Report {reportIndex}
      </span>

      {/* Right: date picker */}
      <DateField value={date} onChange={onDateChange} />
    </div>
  )
}

// Converts "DD MM YYYY" → "YYYY-MM-DD" for <input type="date">
function toInputDate(display: string): string {
  const parts = display.trim().split(/\s+/)
  if (parts.length === 3 && parts[0].length <= 2 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
  }
  return ''
}

// Converts "YYYY-MM-DD" → "DD MM YYYY"
function fromInputDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (y && m && d) return `${d} ${m} ${y}`
  return iso
}

function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const inputVal = toInputDate(value)

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {/* Visible label — hidden while the native input is focused */}
      {!focused && (
        <span
          onClick={() => { inputRef.current?.showPicker?.(); inputRef.current?.focus() }}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#9CA3AF',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            borderBottom: '1px dashed transparent',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = '#E5E7EB' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = 'transparent' }}
        >
          {value}
        </span>
      )}
      <input
        ref={inputRef}
        type="date"
        value={inputVal}
        onChange={(e) => { if (e.target.value) onChange(fromInputDate(e.target.value)) }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: focused ? 'relative' : 'absolute',
          opacity: focused ? 1 : 0,
          width: focused ? 'auto' : 0,
          height: focused ? 'auto' : 0,
          border: focused ? `1px solid ${ACCENT}` : 'none',
          borderRadius: '2px',
          padding: focused ? '2px 6px' : '0',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          color: '#111',
          background: '#fff',
          cursor: 'pointer',
          outline: 'none',
          pointerEvents: focused ? 'auto' : 'none',
        }}
      />
    </div>
  )
}

function EditableField({
  value,
  onChange,
  style,
  selectAll = false,
}: {
  value: string
  onChange: (v: string) => void
  style: React.CSSProperties
  selectAll?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value
    }
  }, [value])

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={() => {
        const v = ref.current?.textContent?.trim() ?? ''
        if (v && v !== value) onChange(v)
        else if (ref.current) ref.current.textContent = value
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.preventDefault(); ref.current?.blur() }
      }}
      style={{
        ...style,
        outline: 'none',
        cursor: 'text',
        borderBottom: '1px dashed transparent',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = '#E5E7EB' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = 'transparent' }}
      onFocus={(e) => {
        e.currentTarget.style.borderBottomColor = ACCENT
        if (selectAll) {
          const el = e.currentTarget
          requestAnimationFrame(() => {
            const range = document.createRange()
            range.selectNodeContents(el)
            const sel = window.getSelection()
            sel?.removeAllRanges()
            sel?.addRange(range)
          })
        }
      }}
    />
  )
}
