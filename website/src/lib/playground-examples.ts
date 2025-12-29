export const playgroundExamples: Record<string, { title: string; code: string }> = {
  'basic-sortable': {
    title: 'Basic Sortable List',
    code: `import { useState } from 'react'
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
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
    { id: '4', content: '🎉 Celebrate success' },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
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
      <h2 style={{ marginBottom: '8px', color: '#1f2937' }}>Sortable List</h2>
      <p style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
        Drag items to reorder them
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>{item.content}</SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}`,
  },
  'kanban-board': {
    title: 'Kanban Board',
    code: `import { useState } from 'react'
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Task({ id, content }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    padding: '12px',
    marginBottom: '8px',
    background: 'white',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    cursor: 'grab',
    fontSize: '14px',
  }
  return <div ref={setNodeRef} style={style} {...attributes} {...listeners}>{content}</div>
}

function Column({ title, items, color }) {
  return (
    <div style={{ flex: 1, minWidth: '180px', background: '#f9fafb', borderRadius: '8px', padding: '12px' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color }}>{title} ({items.length})</h3>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => <Task key={item.id} id={item.id} content={item.content} />)}
      </SortableContext>
    </div>
  )
}

export default function App() {
  const [columns] = useState({
    todo: [{ id: '1', content: 'Research competitors' }, { id: '2', content: 'Design wireframes' }],
    inProgress: [{ id: '3', content: 'Build prototype' }],
    done: [{ id: '4', content: 'Setup project' }, { id: '5', content: 'Create repo' }],
  })
  const sensors = useSensors(useSensor(PointerSensor))

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: '16px', color: '#1f2937' }}>Kanban Board</h2>
      <DndContext sensors={sensors} collisionDetection={closestCorners}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Column title="To Do" items={columns.todo} color="#ef4444" />
          <Column title="In Progress" items={columns.inProgress} color="#f59e0b" />
          <Column title="Done" items={columns.done} color="#22c55e" />
        </div>
      </DndContext>
    </div>
  )
}`,
  },
  'grid-layout': {
    title: 'Grid Layout',
    code: `import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

function GridItem({ id, color }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: color,
    borderRadius: '12px',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '24px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  }
  return <div ref={setNodeRef} style={style} {...attributes} {...listeners}>{id}</div>
}

export default function App() {
  const [items, setItems] = useState(colors.map((color, i) => ({ id: String(i + 1), color })))
  const sensors = useSensors(useSensor(PointerSensor))

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
      <h2 style={{ marginBottom: '8px', color: '#1f2937' }}>Grid Layout</h2>
      <p style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>Drag tiles to rearrange</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '300px' }}>
            {items.map((item) => <GridItem key={item.id} id={item.id} color={item.color} />)}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}`,
  },
  'nested-containers': {
    title: 'Nested Containers',
    code: `import { useState } from 'react'
import { DndContext, PointerSensor, useSensor, useSensors, useDroppable, useDraggable } from '@dnd-kit/core'

function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const style = {
    transform: transform ? \`translate(\${transform.x}px, \${transform.y}px)\` : undefined,
    opacity: isDragging ? 0.5 : 1,
    padding: '8px 12px',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '6px',
    cursor: 'grab',
    display: 'inline-block',
    margin: '4px',
    fontSize: '14px',
  }
  return <div ref={setNodeRef} style={style} {...listeners} {...attributes}>{children}</div>
}

function Droppable({ id, children, label }) {
  const { isOver, setNodeRef } = useDroppable({ id })
  const style = {
    padding: '16px',
    minHeight: '100px',
    background: isOver ? '#dbeafe' : '#f3f4f6',
    border: \`2px dashed \${isOver ? '#3b82f6' : '#d1d5db'}\`,
    borderRadius: '8px',
    transition: 'all 0.2s',
  }
  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{label}</div>
      {children}
    </div>
  )
}

export default function App() {
  const [parent, setParent] = useState(null)
  const sensors = useSensors(useSensor(PointerSensor))
  const items = ['Item A', 'Item B', 'Item C']

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: '8px', color: '#1f2937' }}>Nested Containers</h2>
      <p style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>Drag items between containers</p>
      <DndContext sensors={sensors} onDragEnd={(e) => setParent(e.over?.id || null)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <Droppable id="container-1" label="Container 1">
            {parent === 'container-1' && items.map((item, i) => <Draggable key={i} id={\`item-\${i}\`}>{item}</Draggable>)}
          </Droppable>
          <Droppable id="container-2" label="Container 2">
            {parent === 'container-2' && items.map((item, i) => <Draggable key={i} id={\`item-\${i}\`}>{item}</Draggable>)}
          </Droppable>
        </div>
        {!parent && <div>{items.map((item, i) => <Draggable key={i} id={\`item-\${i}\`}>{item}</Draggable>)}</div>}
      </DndContext>
    </div>
  )
}`,
  },
}
