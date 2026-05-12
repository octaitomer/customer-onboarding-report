import { useState } from 'react'
import type { Customer } from '../lib/types'

type Props = {
  customers: Customer[]
  customerOrder: string[]
  activeId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
  onRename: (id: string, name: string) => void
}

export default function TabStrip({
  customers, customerOrder, activeId,
  onSelect, onAdd, onRemove, onDuplicate, onRename,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const ordered = customerOrder
    .map((id) => customers.find((c) => c.id === id))
    .filter(Boolean) as Customer[]

  function startEdit(c: Customer) {
    setEditingId(c.id)
    setEditValue(c.name)
  }
  function commitEdit(id: string) {
    if (editValue.trim()) onRename(id, editValue.trim())
    setEditingId(null)
  }

  return (
    <div
      className="no-print"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        background: '#fff',
        borderBottom: '1px solid #CCCBCA',
        paddingLeft: '24px',
        paddingRight: '24px',
        gap: 0,
      }}
    >
      {ordered.map((c) => {
        const active = c.id === activeId
        return (
          <div
            key={c.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: active ? '2px solid #FF7032' : '2px solid transparent',
              padding: '10px 16px 8px',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => onSelect(c.id)}
            onDoubleClick={() => startEdit(c)}
          >
            {editingId === c.id ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => commitEdit(c.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit(c.id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                style={{
                  fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: '1px solid #FF7032',
                  outline: 'none',
                  padding: '2px 4px',
                  width: `${Math.max(60, editValue.length * 7)}px`,
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                style={{
                  fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: active ? '#000' : '#6D6C6C',
                }}
              >
                {c.name}
              </span>
            )}
            {/* Context menu on hover */}
            <span
              className="no-print"
              style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}
            >
              <button
                type="button"
                title="Duplicate"
                onClick={(e) => { e.stopPropagation(); onDuplicate(c.id) }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#CCCBCA', fontSize: '11px', padding: '0 2px', lineHeight: 1,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#FF7032' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#CCCBCA' }}
              >
                ⊕
              </button>
              {ordered.length > 1 && (
                <button
                  type="button"
                  title="Close"
                  onClick={(e) => { e.stopPropagation(); onRemove(c.id) }}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: '#CCCBCA', fontSize: '13px', padding: '0 2px', lineHeight: 1,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#FF4D2E' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#CCCBCA' }}
                >
                  ×
                </button>
              )}
            </span>
          </div>
        )
      })}
      <button
        type="button"
        onClick={onAdd}
        style={{
          fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '10px 14px 8px',
          borderBottom: '2px solid transparent',
          color: '#6D6C6C',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderBottomStyle: 'solid',
          borderBottomWidth: '2px',
          borderBottomColor: 'transparent',
          marginLeft: '4px',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#FF7032' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#6D6C6C' }}
      >
        + New Customer
      </button>
    </div>
  )
}
