import { useRef, useEffect, CSSProperties } from 'react'

type Tag = 'span' | 'div' | 'p' | 'h1' | 'h2'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  as?: Tag
  multiline?: boolean
  className?: string
  style?: CSSProperties
}

export default function EditableText({
  value,
  onChange,
  placeholder = '',
  as: Tag = 'span',
  multiline = false,
  className = '',
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const current = multiline ? ref.current.innerText : ref.current.textContent
    if (current !== value) {
      if (multiline) ref.current.innerText = value
      else ref.current.textContent = value
    }
  }, [value, multiline])

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLDivElement>}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={className}
      style={multiline ? { whiteSpace: 'pre-wrap', ...style } : style}
      onBlur={(e) => {
        const v = multiline
          ? (e.currentTarget.innerText ?? '').replace(/\n$/, '')
          : (e.currentTarget.textContent ?? '')
        onChange(v)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !multiline) {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement).blur()
        }
        if (e.key === 'Escape') {
          if (ref.current) {
            if (multiline) ref.current.innerText = value
            else ref.current.textContent = value
          }
          ;(e.currentTarget as HTMLElement).blur()
        }
      }}
      onPaste={(e) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
      }}
    />
  )
}
