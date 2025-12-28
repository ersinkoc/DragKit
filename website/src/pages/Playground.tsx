import React, { useState } from 'react'
import { Play, RotateCcw, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Editor } from '@/components/playground/Editor'
import { Preview } from '@/components/playground/Preview'

const defaultCode = `// DragKit Playground
// Try creating a draggable element!

const { useState } = React
const { createRoot } = ReactDOM

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e) => {
    setIsDragging(true)
  }

  const handleDrag = (e) => {
    if (e.clientX === 0 && e.clientY === 0) return
    setPosition({ x: e.clientX - 50, y: e.clientY - 50 })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">
        DragKit Playground
      </h1>

      <div
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className={\`
          cursor-move rounded-lg p-6 shadow-lg
          transition-opacity bg-blue-500 text-white
          \${isDragging ? 'opacity-50' : 'opacity-100'}
        \`}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: '200px'
        }}
      >
        <h3 className="font-bold text-lg mb-2">
          Drag me!
        </h3>
        <p className="text-sm">
          I'm a draggable card
        </p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`

export function Playground() {
  const [code, setCode] = useState(defaultCode)
  const [runningCode, setRunningCode] = useState(defaultCode)

  const handleRun = () => {
    setRunningCode(code)
  }

  const handleReset = () => {
    setCode(defaultCode)
    setRunningCode(defaultCode)
  }

  const handleShare = async () => {
    try {
      const encoded = btoa(code)
      const url = `${window.location.origin}/playground?code=${encoded}`
      await navigator.clipboard.writeText(url)
      // Could add a toast notification here
      alert('Playground URL copied to clipboard!')
    } catch (error) {
      console.error('Failed to share:', error)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Playground</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              title="Reset to default"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              title="Share playground"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              size="sm"
              onClick={handleRun}
              title="Run code"
            >
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
          </div>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="flex-1 grid lg:grid-cols-2">
        {/* Editor Panel */}
        <div className="flex flex-col border-r">
          <div className="border-b bg-muted/30 px-4 py-2">
            <span className="text-sm font-medium">Editor</span>
          </div>
          <Editor value={code} onChange={setCode} />
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col">
          <div className="border-b bg-muted/30 px-4 py-2">
            <span className="text-sm font-medium">Preview</span>
          </div>
          <Preview code={runningCode} />
        </div>
      </div>
    </div>
  )
}
