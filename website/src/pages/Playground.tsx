import { useState } from 'react'
import { RotateCcw, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Editor } from '@/components/playground/Editor'
import { Preview } from '@/components/playground/Preview'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

const defaultCode = `import { DragProvider, useSortable, SortableContext } from '@oxog/dragkit'
import { useState } from 'react'

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: transform
      ? \`translate3d(\${transform.x}px, \${transform.y}px, 0)\`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-4 bg-white rounded-lg border shadow-sm"
    >
      {children}
    </div>
  )
}

export default function App() {
  const [items, setItems] = useState([
    { id: '1', content: 'Learn DragKit' },
    { id: '2', content: 'Build something awesome' },
    { id: '3', content: 'Ship to production' },
  ])

  return (
    <DragProvider
      onDragEnd={(event) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
          // Reorder items
        }
      }}
    >
      <SortableContext items={items.map((i) => i.id)}>
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            {item.content}
          </SortableItem>
        ))}
      </SortableContext>
    </DragProvider>
  )
}`

export function Playground() {
  const [code, setCode] = useState(defaultCode)
  const { copied, copy } = useCopyToClipboard()

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Playground</h1>
          <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCode(defaultCode)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="ghost" size="sm" onClick={() => copy(code)}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Editor Panel */}
        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-border">
          <div className="px-4 py-2 border-b border-border bg-zinc-900">
            <span className="text-sm font-medium text-zinc-400">App.tsx</span>
          </div>
          <div className="flex-1 min-h-[400px]">
            <Editor code={code} onChange={setCode} className="h-full" />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col">
          <div className="px-4 py-2 border-b border-border bg-muted/50">
            <span className="text-sm font-medium">Preview</span>
          </div>
          <div className="flex-1 min-h-[400px] bg-white dark:bg-zinc-900">
            <Preview />
          </div>
        </div>
      </div>
    </div>
  )
}
