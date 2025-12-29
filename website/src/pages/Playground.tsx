import { useState } from 'react'
import { RotateCcw, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react'

const defaultCode = `import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    padding: '16px',
    margin: '8px 0',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export default function App() {
  const [items, setItems] = useState([
    { id: '1', content: '📚 Learn DragKit' },
    { id: '2', content: '🚀 Build something awesome' },
    { id: '3', content: '✨ Ship to production' },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: '16px', color: '#1f2937' }}>
        Sortable List Demo
      </h2>
      <p style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
        Drag items to reorder them!
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {item.content}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}`

export function Playground() {
  const [code, setCode] = useState(defaultCode)
  const { copied, copy } = useCopyToClipboard()

  const files = {
    '/App.js': code,
  }

  const customSetup = {
    dependencies: {
      '@dnd-kit/core': '^6.1.0',
      '@dnd-kit/sortable': '^8.0.0',
      '@dnd-kit/utilities': '^3.2.2',
    },
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Playground</h1>
          <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
            Interactive
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

      {/* Sandpack Editor */}
      <div className="flex-1 min-h-[600px]">
        <SandpackProvider
          template="react"
          files={files}
          customSetup={customSetup}
          theme="dark"
        >
          <SandpackLayout style={{ height: '100%', minHeight: '600px' }}>
            <SandpackCodeEditor
              style={{ flex: 1, minHeight: '600px' }}
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
            />
            <SandpackPreview
              style={{ flex: 1, minHeight: '600px' }}
              showOpenInCodeSandbox={false}
              showRefreshButton
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  )
}
