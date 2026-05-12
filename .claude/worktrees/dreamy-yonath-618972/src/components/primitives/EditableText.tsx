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
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value
    }
  }, [value])

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLDivElement>}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={className}
      style={style}
      onBlur={(e) => onChange(e.currentTarget.textContent ?? '')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !multiline) {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement).blur()
        }
        if (e.key === 'Escape') {
          if (ref.current) ref.current.textContent = value
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
