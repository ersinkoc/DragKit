import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import '@/styles/prism.css'

interface SyntaxHighlighterProps {
  code: string
  language: string
  highlightLines?: number[]
}

export function SyntaxHighlighter({
  code,
  language,
  highlightLines = []
}: SyntaxHighlighterProps) {
  const preRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (preRef.current) {
      Prism.highlightElement(preRef.current)
    }
  }, [code, language])

  const lines = code.trim().split('\n')

  return (
    <pre ref={preRef} className="!bg-transparent !p-0 !m-0">
      <code className={`language-${language}`}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={highlightLines.includes(i + 1) ? 'line-highlight' : ''}
          >
            {line}
          </div>
        ))}
      </code>
    </pre>
  )
}
