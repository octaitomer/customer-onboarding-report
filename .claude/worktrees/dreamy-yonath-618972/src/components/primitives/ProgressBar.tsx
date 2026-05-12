import { useRef } from 'react'

type Props = {
  percent: number
  onChange: (v: number) => void
  active?: boolean
  completed?: boolean
  height?: number
}

export default function ProgressBar({ percent, onChange, active, completed, height = 3 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  function setFromPointer(clientX: number) {
    const track = trackRef.current
    if (!track) return
    const r = track.getBoundingClientRect()
    let pct = ((clientX - r.left) / r.width) * 100
    pct = Math.round(pct / 5) * 5
    pct = Math.max(0, Math.min(100, pct))
    onChange(pct)
  }

  const fillBg = completed ? '#2ea063' : active ? '#FF7032' : '#000000'

  return (
    <div
      ref={trackRef}
      className="bar-fill"
      style={{
        height: `${height}px`,
        background: '#CCCBCA',
        cursor: 'ew-resize',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
      }}
      onPointerDown={(e) => {
        dragging.current = true
        ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
        setFromPointer(e.clientX)
        e.preventDefault()
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return
        setFromPointer(e.clientX)
      }}
      onPointerUp={(e) => {
        if (!dragging.current) return
        dragging.current = false
        try { (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId) } catch (_) {}
      }}
      onPointerCancel={(e) => {
        dragging.current = false
        try { (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId) } catch (_) {}
      }}
    >
      <div
        style={{
          height: '100%',
          background: fillBg,
          width: `${Math.max(0, Math.min(100, percent))}%`,
          transition: 'none',
        }}
      />
    </div>
  )
}
