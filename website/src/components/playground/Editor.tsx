import { cn } from '@/lib/utils'

interface EditorProps {
  code: string
  onChange: (code: string) => void
  className?: string
}

export function Editor({ code, onChange, className }: EditorProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd
      const newValue = code.substring(0, start) + '  ' + code.substring(end)
      onChange(newValue)
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2
      })
    }
  }

  return (
    <textarea
      value={code}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        'w-full h-full resize-none bg-zinc-950 text-zinc-100 font-mono text-sm p-4 leading-relaxed outline-none border-0',
        className
      )}
      spellCheck={false}
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
    />
  )
}
