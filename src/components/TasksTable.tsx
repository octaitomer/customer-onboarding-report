import type { Task } from '../lib/types'
import EditableText from './primitives/EditableText'
import DateInput from './primitives/DateInput'

type Props = {
  tasks: Task[]
  sectionIndex: number
  sectionTotal: number
  onAdd: () => void
  onRemove: (id: string) => void
  onPatch: (id: string, field: keyof Omit<Task, 'id'>, value: string) => void
}

export default function TasksTable({
  tasks, sectionIndex, sectionTotal,
  onAdd, onRemove, onPatch,
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
          Current Status And Open Tasks
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

      {/* Table */}
      <div style={{ borderTop: '1px solid #CCCBCA' }}>
        {/* Head */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '32px 1fr 180px 68px 24px',
            gap: '12px',
            alignItems: 'stretch',
            borderBottom: '1px solid #CCCBCA',
            fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
            fontSize: '9.5px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#6D6C6C',
            padding: '8px 4px',
            background: '#F3F1F1',
          }}
        >
          <div>№</div>
          <div>Task</div>
          <div>Owner</div>
          <div>Due</div>
          <div />
        </div>

        {/* Rows */}
        {tasks.map((task, i) => (
          <div
            key={task.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '32px 1fr 180px 68px 24px',
              gap: '12px',
              alignItems: 'stretch',
              borderBottom: '1px solid #CCCBCA',
              minHeight: '36px',
            }}
            className="group"
          >
            <div
              style={{
                fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: '#6D6C6C',
                alignSelf: 'center',
                padding: '0 2px',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <EditableText
              value={task.task}
              onChange={(v) => onPatch(task.id, 'task', v)}
              placeholder="Describe the task…"
              style={{ padding: '9px 6px', fontSize: '12.5px', lineHeight: 1.35, color: '#000' }}
            />
            <EditableText
              value={task.owner}
              onChange={(v) => onPatch(task.id, 'owner', v)}
              placeholder="—"
              style={{
                padding: '9px 6px',
                fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                fontSize: '10.5px',
                letterSpacing: '0.04em',
                color: '#3D3D3D',
                borderLeft: '1px solid #CCCBCA',
              }}
            />
            <DateInput
              value={task.due}
              onChange={(v) => onPatch(task.id, 'due', v)}
              format="DD MM"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '9px 6px',
                fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                fontSize: '10.5px',
                letterSpacing: '0.04em',
                color: '#3D3D3D',
                borderLeft: '1px solid #CCCBCA',
              }}
            />
            <button
              type="button"
              onClick={() => onRemove(task.id)}
              title="Remove"
              className="no-print opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6D6C6C',
                fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
                fontSize: '14px',
                cursor: 'pointer',
                padding: 0,
                alignSelf: 'center',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="no-print"
        style={{
          marginTop: '8px',
          background: 'transparent',
          border: '1px dashed #CCCBCA',
          color: '#6D6C6C',
          fontFamily: '"ABC Favorit Mono", "JetBrains Mono", monospace',
          fontSize: '9.5px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '6px 10px',
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
        + Add task
      </button>
    </section>
  )
}
