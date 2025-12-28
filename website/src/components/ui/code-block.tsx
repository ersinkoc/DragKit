interface CodeBlockProps {
  language?: string
  children: string
}

export function CodeBlock({ language = 'typescript', children }: CodeBlockProps) {
  const lines = children.trim().split('\n')

  return (
    <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
      <code className={`language-${language}`}>
        {lines.map((line, index) => (
          <div key={index} className="table-row">
            <span className="table-cell text-right pr-4 text-slate-500 select-none">
              {index + 1}
            </span>
            <span className="table-cell">{line}</span>
          </div>
        ))}
      </code>
    </pre>
  )
}
