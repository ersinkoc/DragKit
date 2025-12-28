import { useState, useEffect, useRef } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Play, RotateCcw, Download, ChevronRight, ChevronDown } from 'lucide-react'

const defaultCode = `import { createDragKit } from '@oxog/dragkit'

// Initialize DragKit
const kit = createDragKit()

// Create draggable items
const items = document.querySelectorAll('.draggable-item')
items.forEach((item, index) => {
  kit.draggable(item, {
    id: \`item-\${index + 1}\`,
    onDragStart: (event) => {
      console.log('Started dragging:', event.draggable.id)
    },
    onDragEnd: (event) => {
      console.log('Finished dragging:', event.draggable.id)
    }
  })
})

// Create drop zones
const zones = document.querySelectorAll('.drop-zone')
zones.forEach((zone, index) => {
  kit.droppable(zone, {
    id: \`zone-\${index + 1}\`,
    onDrop: (event) => {
      console.log('Dropped', event.draggable.id, 'into', event.droppable.id)
      event.droppable.element.appendChild(event.draggable.element)
    }
  })
})

console.log('DragKit initialized! Try dragging the colored boxes.')
`

const defaultHTML = `<div id="preview">
  <style>
    #preview {
      padding: 2rem;
      font-family: system-ui, sans-serif;
    }
    .drop-zone {
      min-height: 120px;
      padding: 1rem;
      margin: 1rem 0;
      border: 2px dashed #cbd5e0;
      border-radius: 0.5rem;
      background: #f7fafc;
    }
    .draggable-item {
      display: inline-block;
      padding: 1rem 1.5rem;
      margin: 0.5rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: 600;
      cursor: move;
      user-select: none;
    }
    .draggable-item:nth-child(1) { background: #3b82f6; }
    .draggable-item:nth-child(2) { background: #8b5cf6; }
    .draggable-item:nth-child(3) { background: #ec4899; }
  </style>

  <h2 style="margin-bottom: 1rem; color: #1f2937;">Drag & Drop Playground</h2>

  <div class="drop-zone">
    <div class="draggable-item">Item 1</div>
    <div class="draggable-item">Item 2</div>
    <div class="draggable-item">Item 3</div>
  </div>

  <div class="drop-zone">
    <p style="color: #6b7280; text-align: center;">Drop items here</p>
  </div>
</div>`

export default function Playground() {
  const [code, setCode] = useState(defaultCode)
  const [html, setHTML] = useState(defaultHTML)
  const [output, setOutput] = useState<string[]>([])
  const [consoleOpen, setConsoleOpen] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const runCode = () => {
    setOutput([])

    // Create iframe document
    const iframe = iframeRef.current
    if (!iframe || !iframe.contentWindow) return

    const iframeDoc = iframe.contentWindow.document

    // Clear and rebuild iframe content safely
    iframeDoc.open()
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body></body>
      </html>
    `)
    iframeDoc.close()

    // Add HTML content
    const container = iframeDoc.createElement('div')
    container.innerHTML = html
    iframeDoc.body.appendChild(container)

    // Capture console.log
    const logs: string[] = []
    const win = iframe.contentWindow as any
    const originalLog = win.console.log
    win.console.log = (...args: any[]) => {
      const message = args.map((arg: any) =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')
      logs.push(message)
      setOutput(prev => [...prev, message])
      originalLog.apply(win.console, args)
    }

    // Load DragKit from CDN and execute user code
    const script = iframeDoc.createElement('script')
    script.type = 'module'
    script.textContent = `
      import { createDragKit } from 'https://cdn.jsdelivr.net/npm/@oxog/dragkit@latest/dist/index.js'

      try {
        ${code}
      } catch (error) {
        console.log('Error:', error.message)
      }
    `
    iframeDoc.body.appendChild(script)
  }

  const resetCode = () => {
    setCode(defaultCode)
    setHTML(defaultHTML)
    setOutput([])
  }

  const downloadCode = () => {
    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DragKit Example</title>
</head>
<body>
  ${html}

  <script type="module">
    import { createDragKit } from 'https://cdn.jsdelivr.net/npm/@oxog/dragkit@latest/dist/index.js'

    ${code}
  </script>
</body>
</html>`

    const blob = new Blob([fullCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dragkit-example.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    runCode()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b bg-background px-4 py-3 flex items-center gap-4">
          <h1 className="text-xl font-bold">Interactive Playground</h1>
          <div className="flex-1" />
          <Button onClick={runCode} size="sm">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button onClick={resetCode} size="sm" variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={downloadCode} size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Editor and Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className="w-1/2 border-r flex flex-col">
            <div className="border-b px-4 py-2 bg-muted/50">
              <h2 className="font-semibold">JavaScript</h2>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm bg-background resize-none focus:outline-none"
              spellCheck={false}
            />

            <div className="border-t px-4 py-2 bg-muted/50">
              <h2 className="font-semibold">HTML</h2>
            </div>
            <textarea
              value={html}
              onChange={(e) => setHTML(e.target.value)}
              className="h-48 p-4 font-mono text-sm bg-background resize-none focus:outline-none border-t"
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div className="w-1/2 flex flex-col">
            <div className="border-b px-4 py-2 bg-muted/50">
              <h2 className="font-semibold">Preview</h2>
            </div>
            <div className="flex-1 overflow-auto bg-white">
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
                title="Preview"
              />
            </div>

            {/* Console */}
            <div className="border-t flex flex-col" style={{ height: consoleOpen ? '200px' : 'auto' }}>
              <button
                onClick={() => setConsoleOpen(!consoleOpen)}
                className="px-4 py-2 bg-muted/50 flex items-center gap-2 hover:bg-muted transition-colors"
              >
                {consoleOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <h2 className="font-semibold">Console</h2>
                {output.length > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {output.length}
                  </span>
                )}
              </button>

              {consoleOpen && (
                <div className="flex-1 overflow-auto bg-slate-950 text-slate-50 p-4 font-mono text-sm">
                  {output.length === 0 ? (
                    <div className="text-slate-500">Console output will appear here...</div>
                  ) : (
                    output.map((line, index) => (
                      <div key={index} className="py-0.5">
                        <span className="text-slate-500 mr-2">&gt;</span>
                        {line}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
