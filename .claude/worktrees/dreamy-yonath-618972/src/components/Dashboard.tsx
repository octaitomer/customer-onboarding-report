import { useState, useRef, useEffect } from 'react'
import { useTrackerStore } from '../store/useTrackerStore'

interface Props {
  onOpen: (id: string) => void
}

interface ModalState {
  mode: 'create' | 'edit'
  id?: string
  name: string
  site: string
}

const ACCENT = '#FF5C39'
const BLACK = '#111111'
const MUTED = '#9CA3AF'

function CustomerModal({
  state,
  onConfirm,
  onDelete,
  onCancel,
}: {
  state: ModalState
  onConfirm: (name: string, site: string) => void
  onDelete?: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState(state.name)
  const [site, setSite] = useState(state.site)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
    nameRef.current?.select()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim()) onConfirm(name.trim(), site.trim())
  }

  const monoSm: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#1A1A1A',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    padding: '10px 12px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    ...monoSm,
    fontSize: '10px',
    color: MUTED,
    display: 'block',
    marginBottom: '6px',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        style={{
          background: BLACK,
          width: '400px',
          padding: '32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}
      >
        {confirmingDelete ? (
          /* ── Delete confirmation ── */
          <>
            <div style={{ ...monoSm, color: '#EF4444', marginBottom: '16px' }}>
              Delete Customer
            </div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              margin: '0 0 24px',
            }}>
              Permanently delete <strong style={{ color: '#fff' }}>{state.name}</strong>?
              This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                style={{
                  flex: 1, ...monoSm,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.5)',
                  padding: '10px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                style={{
                  flex: 2, ...monoSm,
                  background: '#EF4444',
                  border: 'none',
                  color: '#fff',
                  padding: '10px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#DC2626' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#EF4444' }}
              >
                Yes, Delete
              </button>
            </div>
          </>
        ) : (
          /* ── Edit / Create form ── */
          <>
            <div style={{ ...monoSm, color: ACCENT, marginBottom: '20px' }}>
              {state.mode === 'create' ? '+ New Customer' : 'Edit Customer'}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Customer Name</label>
                <input
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Converge"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Site Code</label>
                <input
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  placeholder="e.g. ACX01"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={onCancel}
                  style={{
                    flex: 1, ...monoSm,
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.5)',
                    padding: '10px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  style={{
                    flex: 2, ...monoSm,
                    background: name.trim() ? ACCENT : '#333',
                    border: 'none',
                    color: name.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                    padding: '10px',
                    cursor: name.trim() ? 'pointer' : 'default',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => { if (name.trim()) e.currentTarget.style.background = '#e04d2e' }}
                  onMouseLeave={(e) => { if (name.trim()) e.currentTarget.style.background = ACCENT }}
                >
                  {state.mode === 'create' ? 'Create' : 'Save'}
                </button>
              </div>

              {state.mode === 'edit' && onDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  style={{
                    ...monoSm,
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.25)',
                    padding: '6px 0 0',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)' }}
                >
                  Delete Customer
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function Dashboard({ onOpen }: Props) {
  const store = useTrackerStore()
  const { customers, customerOrder } = store
  const [hovered, setHovered] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState | null>(null)

  function openCreate() {
    setModal({ mode: 'create', name: '', site: '' })
  }

  function openEdit(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    const c = customers[id]
    const latestReport = c.reports[c.reports.length - 1]
    setModal({ mode: 'edit', id, name: c.name, site: latestReport?.meta.site ?? '' })
  }

  function handleConfirm(name: string, site: string) {
    if (!modal) return
    if (modal.mode === 'create') {
      store.addCustomer(name, site)
      setModal(null)
      const newId = useTrackerStore.getState().activeCustomerId
      onOpen(newId)
    } else if (modal.mode === 'edit' && modal.id) {
      store.renameCustomer(modal.id, name)
      // Update site on all reports for this customer
      const c = useTrackerStore.getState().customers[modal.id]
      c?.reports.forEach((r) => store.patchMeta(modal.id!, r.id, { site }))
      setModal(null)
    }
  }

  const ordered = customerOrder.map((id) => customers[id]).filter(Boolean)

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Header */}
      <div
        style={{
          background: BLACK,
          color: '#fff',
          padding: '0 32px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <img
          src="/Logo_White.png"
          alt="OctaiPipe"
          style={{ height: '28px', width: 'auto', flexShrink: 0, display: 'block' }}
        />
        <span style={{ color: 'rgba(255,255,255,0.18)', margin: '0 4px', fontSize: '16px' }}>|</span>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.02em',
          }}
        >
          Customer Onboarding Reports
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '40px 32px', maxWidth: '1280px' }}>
        <p
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: MUTED,
            marginBottom: '24px',
          }}
        >
          {ordered.length} customer{ordered.length !== 1 ? 's' : ''}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 280px))',
            gap: '16px',
          }}
        >
          {ordered.map((c) => {
            const isHov = hovered === c.id
            const latestReport = c.reports[c.reports.length - 1]
            const rawPct = latestReport?.hero.onboardingPercent ?? ''
            const pct = rawPct !== ''
              ? Math.min(100, Math.max(0, parseInt(rawPct) || 0))
              : null

            return (
              <div
                key={c.id}
                style={{ position: 'relative' }}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  type="button"
                  onClick={() => onOpen(c.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: '#fff',
                    border: `1px solid ${isHov ? ACCENT : '#E5E7EB'}`,
                    borderTop: `3px solid ${isHov ? ACCENT : '#E5E7EB'}`,
                    padding: '20px 20px 18px',
                    cursor: 'pointer',
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                    boxShadow: isHov
                      ? '0 6px 20px -4px rgba(0,0,0,0.14)'
                      : '0 1px 4px rgba(0,0,0,0.05)',
                    minHeight: '110px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '17px',
                        fontWeight: 600,
                        color: BLACK,
                        marginBottom: '6px',
                        lineHeight: 1.25,
                        paddingRight: '36px',
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '10px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: MUTED,
                      }}
                    >
                      {latestReport?.meta.site}
                      {latestReport?.meta.date ? ` · ${latestReport.meta.date}` : ''}
                    </div>
                  </div>

                  {pct !== null && (
                    <div style={{ marginTop: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '5px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '9px',
                            color: MUTED,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                          }}
                        >
                          Onboarding Complete
                        </span>
                        <span
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '10px',
                            color: ACCENT,
                            fontWeight: 600,
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div style={{ height: '3px', background: '#E5E7EB', borderRadius: '2px' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: ACCENT,
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {isHov && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '18px',
                        right: '14px',
                        color: ACCENT,
                        fontSize: '16px',
                        lineHeight: 1,
                        pointerEvents: 'none',
                      }}
                    >
                      →
                    </div>
                  )}
                </button>

                {/* Edit button */}
                <button
                  type="button"
                  onClick={(e) => openEdit(e, c.id)}
                  title="Edit name & site"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '10px',
                    background: isHov ? '#F3F4F6' : 'transparent',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '4px 5px',
                    cursor: 'pointer',
                    color: isHov ? '#6B7280' : 'transparent',
                    transition: 'background 0.12s, color 0.12s',
                    lineHeight: 1,
                    fontSize: '12px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = ACCENT
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isHov ? '#F3F4F6' : 'transparent'
                    e.currentTarget.style.color = isHov ? '#6B7280' : 'transparent'
                  }}
                >
                  ✎
                </button>
              </div>
            )
          })}

          {/* Add new customer card */}
          <button
            type="button"
            onClick={openCreate}
            onMouseEnter={() => setHovered('__add__')}
            onMouseLeave={() => setHovered(null)}
            style={{
              textAlign: 'center',
              background: hovered === '__add__' ? BLACK : '#fff',
              border: `1px dashed ${hovered === '__add__' ? 'transparent' : '#D1D5DB'}`,
              borderTop: `3px solid ${hovered === '__add__' ? ACCENT : 'transparent'}`,
              padding: '20px',
              cursor: 'pointer',
              transition: 'background 0.12s, border-color 0.12s',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: `2px solid ${hovered === '__add__' ? ACCENT : '#D1D5DB'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                lineHeight: 1,
                color: hovered === '__add__' ? ACCENT : '#9CA3AF',
                transition: 'border-color 0.12s, color 0.12s',
                paddingBottom: '2px',
              }}
            >
              +
            </div>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: hovered === '__add__' ? 'rgba(255,255,255,0.6)' : MUTED,
                transition: 'color 0.12s',
              }}
            >
              New Customer
            </span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <CustomerModal
          state={modal}
          onConfirm={handleConfirm}
          onDelete={modal.mode === 'edit' && modal.id
            ? () => { store.removeCustomer(modal.id!); setModal(null) }
            : undefined}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}
