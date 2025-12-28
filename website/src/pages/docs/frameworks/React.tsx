import { DocsLayout } from '@/components/layout/DocsLayout'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'

export default function ReactIntegration() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">React Integration</h1>
          <p className="text-xl text-muted-foreground">
            Best practices for using DragKit with React applications.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Installation</h2>
          <IDEWindow fileName="terminal">
            <CodeBlock language="bash">{`npm install @oxog/dragkit`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Basic Hook</h2>
          <p className="text-muted-foreground">
            Create a custom hook to manage DragKit lifecycle:
          </p>
          <IDEWindow fileName="useDragKit.ts">
            <CodeBlock language="typescript">{`import { useEffect, useRef } from 'react'
import { createDragKit, DragKit } from '@oxog/dragkit'

export function useDragKit() {
  const kitRef = useRef<DragKit | null>(null)

  useEffect(() => {
    // Initialize DragKit
    kitRef.current = createDragKit()

    // Cleanup on unmount
    return () => {
      kitRef.current?.destroy()
    }
  }, [])

  return kitRef.current
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Draggable Component</h2>
          <IDEWindow fileName="DraggableCard.tsx">
            <CodeBlock language="typescript">{`import { useEffect, useRef } from 'react'
import { useDragKit } from './useDragKit'

interface DraggableCardProps {
  id: string
  children: React.ReactNode
}

export function DraggableCard({ id, children }: DraggableCardProps) {
  const kit = useDragKit()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!kit || !ref.current) return

    const draggable = kit.draggable(ref.current, {
      id,
      onDragStart: () => {
        console.log('Drag started:', id)
      },
      onDragEnd: () => {
        console.log('Drag ended:', id)
      },
    })

    return () => draggable.destroy()
  }, [kit, id])

  return (
    <div ref={ref} className="cursor-move p-4 bg-white border rounded">
      {children}
    </div>
  )
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Sortable List</h2>
          <IDEWindow fileName="SortableList.tsx">
            <CodeBlock language="typescript">{`import { useEffect, useRef, useState } from 'react'
import { createDragKit } from '@oxog/dragkit'

interface Item {
  id: string
  content: string
}

export function SortableList() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
  ])

  const containerRef = useRef<HTMLDivElement>(null)
  const kitRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const kit = createDragKit()
    kitRef.current = kit

    const sortable = kit.sortable(containerRef.current, {
      itemSelector: '.sortable-item',
      onSort: (event) => {
        // Update state with new order
        const newOrder = event.order.map(id =>
          items.find(item => item.id === id)!
        )
        setItems(newOrder)
      },
    })

    return () => {
      sortable.destroy()
      kit.destroy()
    }
  }, [])

  return (
    <div ref={containerRef}>
      {items.map(item => (
        <div
          key={item.id}
          data-id={item.id}
          className="sortable-item p-4 mb-2 bg-white border rounded"
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Context Provider</h2>
          <p className="text-muted-foreground">
            Share a single DragKit instance across components:
          </p>
          <IDEWindow fileName="DragKitProvider.tsx">
            <CodeBlock language="typescript">{`import { createContext, useContext, useEffect, useRef } from 'react'
import { createDragKit, DragKit } from '@oxog/dragkit'

const DragKitContext = createContext<DragKit | null>(null)

export function DragKitProvider({ children }: { children: React.ReactNode }) {
  const kitRef = useRef<DragKit | null>(null)

  useEffect(() => {
    kitRef.current = createDragKit()
    return () => kitRef.current?.destroy()
  }, [])

  return (
    <DragKitContext.Provider value={kitRef.current}>
      {children}
    </DragKitContext.Provider>
  )
}

export function useDragKitContext() {
  const kit = useContext(DragKitContext)
  if (!kit) throw new Error('useDragKitContext must be used within DragKitProvider')
  return kit
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">TypeScript Support</h2>
          <IDEWindow fileName="typed-component.tsx">
            <CodeBlock language="typescript">{`interface TaskData {
  id: number
  title: string
  status: 'todo' | 'done'
}

interface TaskCardProps {
  task: TaskData
}

export function TaskCard({ task }: TaskCardProps) {
  const kit = useDragKitContext()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const draggable = kit.draggable<TaskData>(ref.current, {
      id: task.id.toString(),
      data: task,
      onDragEnd: (event) => {
        // TypeScript knows event.draggable.data is TaskData
        console.log('Task status:', event.draggable.data.status)
      },
    })

    return () => draggable.destroy()
  }, [kit, task])

  return <div ref={ref}>{task.title}</div>
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">1. Always Clean Up</h3>
              <p className="text-sm text-muted-foreground">
                Use useEffect cleanup to destroy draggables when components unmount.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">2. Use Refs for DOM Access</h3>
              <p className="text-sm text-muted-foreground">
                DragKit needs direct DOM access, so always use refs, not state.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">3. Avoid Re-initialization</h3>
              <p className="text-sm text-muted-foreground">
                Create DragKit instance once and reuse it. Don't recreate on every render.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">4. Update State in Event Handlers</h3>
              <p className="text-sm text-muted-foreground">
                Sync React state with drag events to keep UI and data in sync.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
