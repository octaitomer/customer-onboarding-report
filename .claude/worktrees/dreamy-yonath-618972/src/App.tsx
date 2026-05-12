import { useState, useRef, useEffect } from 'react'
import Toolbar from './components/Toolbar'
import Document from './components/Document'
import Dashboard from './components/Dashboard'
import ReportSlider from './components/ReportSlider'
import { useTrackerStore } from './store/useTrackerStore'

const ACCENT = '#FF5C39'

export default function App() {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard')
  const store = useTrackerStore()
  const customer = store.customers[store.activeCustomerId]

  function openCustomer(id: string) {
    store.setActive(id)
    setView('editor')
  }

  if (view === 'dashboard') return <Dashboard onOpen={openCustomer} />
  if (!customer) { setView('dashboard'); return null }

  const sorted = [...customer.reports].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const activeReport =
    customer.reports.find((r) => r.id === customer.activeReportId) ??
    sorted[sorted.length - 1]

  if (!activeReport) { setView('dashboard'); return null }

  return (
    <div style={{ minHeight: '100vh', background: '#F3F1F1' }}>
      {/* Fixed header + slider */}
      <Toolbar customerName={customer.name} onBack={() => setView('dashboard')} />
      <ReportSlider
        customer={customer}
        onSelect={(rid) => store.setActiveReport(customer.id, rid)}
        onAdd={() => store.addReport(customer.id)}
        onDelete={(rid) => store.removeReport(customer.id, rid)}
      />

      {/* Scrollable content */}
      <main style={{ paddingTop: '156px', paddingBottom: '40px' }}>
        {/* Editable report header */}
        <ReportHeader
          customerName={customer.name}
          date={activeReport.meta.date}
          onNameChange={(v) => store.renameCustomer(customer.id, v)}
          onDateChange={(v) => store.patchReportDate(customer.id, activeReport.id, v)}
        />
        <Document
          customerId={customer.id}
          customerName={customer.name}
          report={activeReport}
        />
      </main>
    </div>
  )
}

// ── Inline report header ──────────────────────────────────────────
function ReportHeader({
  customerName,
  date,
  onNameChange,
  onDateChange,
}: {
  customerName: string
  date: string
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
      <EditableField
        value={date}
        onChange={onDateChange}
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#9CA3AF',
          whiteSpace: 'nowrap',
        }}
      />
    </div>
  )
}

function EditableField({
  value,
  onChange,
  style,
}: {
  value: string
  onChange: (v: string) => void
  style: React.CSSProperties
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
      onFocus={(e) => { e.currentTarget.style.borderBottomColor = ACCENT }}
    />
  )
}
