import React, { useEffect, useRef, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PreviewProps {
  code: string
  className?: string
}

export function Preview({ code, className }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (!iframeRef.current) return

    setError(null)
    setLogs([])

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    // Create HTML content with error handling
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 1rem;
    }
  </style>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    window.addEventListener('error', (e) => {
      window.parent.postMessage({ type: 'error', message: e.message }, '*')
    })

    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn
    }

    console.log = (...args) => {
      originalConsole.log(...args)
      window.parent.postMessage({ type: 'log', message: args.join(' ') }, '*')
    }

    console.error = (...args) => {
      originalConsole.error(...args)
      window.parent.postMessage({ type: 'error', message: args.join(' ') }, '*')
    }

    console.warn = (...args) => {
      originalConsole.warn(...args)
      window.parent.postMessage({ type: 'warn', message: args.join(' ') }, '*')
    }

    try {
      ${code}
    } catch (err) {
      window.parent.postMessage({ type: 'error', message: err.message }, '*')
    }
  </script>
</body>
</html>
    `

    iframeDoc.open()
    iframeDoc.write(html)
    iframeDoc.close()
  }, [code])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'error') {
        setError(event.data.message)
      } else if (event.data.type === 'log') {
        setLogs((prev) => [...prev, event.data.message])
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">{error}</AlertDescription>
        </Alert>
      )}
      <iframe
        ref={iframeRef}
        className="flex-1 w-full border-0 bg-white"
        title="Preview"
        sandbox="allow-scripts"
      />
      {logs.length > 0 && (
        <div className="border-t bg-muted/30 p-4 max-h-32 overflow-y-auto">
          <div className="text-xs font-mono space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="text-muted-foreground">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
