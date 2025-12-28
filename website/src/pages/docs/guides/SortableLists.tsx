import { DocsLayout } from '@/components/layout/DocsLayout'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function SortableListsGuide() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Sortable Lists</h1>
          <p className="text-xl text-muted-foreground">
            Create reorderable lists with smooth animations and persistence.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Basic Sortable List</h2>
          <IDEWindow fileName="sortable-list.html">
            <CodeBlock language="html">{`<div id="task-list">
  <div class="task" data-id="1">
    <span class="handle">⋮⋮</span>
    <span class="title">Review pull requests</span>
  </div>
  <div class="task" data-id="2">
    <span class="handle">⋮⋮</span>
    <span class="title">Update documentation</span>
  </div>
  <div class="task" data-id="3">
    <span class="handle">⋮⋮</span>
    <span class="title">Fix bug in login form</span>
  </div>
</div>`}</CodeBlock>
          </IDEWindow>

          <IDEWindow fileName="sortable.js">
            <CodeBlock language="javascript">{`import { createDragKit } from '@oxog/dragkit'

const kit = createDragKit()
const list = document.getElementById('task-list')

const sortable = kit.sortable(list, {
  itemSelector: '.task',
  handle: '.handle',
  animation: 200,

  onSort: (event) => {
    console.log('New order:', event.order)
    console.log('Moved from index', event.oldIndex, 'to', event.newIndex)

    // Save to backend
    saveOrder(event.order)
  },
})

async function saveOrder(order) {
  await fetch('/api/tasks/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order }),
  })
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Styling</h2>
          <IDEWindow fileName="styles.css">
            <CodeBlock language="css">{`#task-list {
  max-width: 600px;
  margin: 2rem auto;
}

.task {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.task:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.handle {
  cursor: move;
  color: #9ca3af;
  user-select: none;
}

.handle:hover {
  color: #4b5563;
}

.title {
  flex: 1;
}

/* Dragging state */
.task.is-dragging {
  opacity: 0.5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Animation */
.task {
  transition: transform 0.2s ease;
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">React Example</h2>
          <IDEWindow fileName="TaskList.tsx">
            <CodeBlock language="typescript">{`import { useEffect, useRef, useState } from 'react'
import { createDragKit } from '@oxog/dragkit'

interface Task {
  id: string
  title: string
  completed: boolean
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review pull requests', completed: false },
    { id: '2', title: 'Update documentation', completed: false },
    { id: '3', title: 'Fix bug in login', completed: true },
  ])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const kit = createDragKit()
    const sortable = kit.sortable(containerRef.current, {
      itemSelector: '.task-item',
      handle: '.handle',
      animation: 200,

      onSort: (event) => {
        // Reorder React state
        const newOrder = event.order.map(id =>
          tasks.find(task => task.id === id)!
        )
        setTasks(newOrder)

        // Save to backend
        saveTaskOrder(event.order)
      },
    })

    return () => {
      sortable.destroy()
      kit.destroy()
    }
  }, [])

  return (
    <div ref={containerRef} className="task-list">
      {tasks.map(task => (
        <div
          key={task.id}
          data-id={task.id}
          className="task-item"
        >
          <span className="handle">⋮⋮</span>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => toggleTask(task.id, e.target.checked)}
          />
          <span className={task.completed ? 'completed' : ''}>
            {task.title}
          </span>
        </div>
      ))}
    </div>
  )
}

async function saveTaskOrder(order: string[]) {
  await fetch('/api/tasks/reorder', {
    method: 'POST',
    body: JSON.stringify({ order }),
  })
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Multiple Lists</h2>
          <p className="text-muted-foreground">
            Allow dragging items between multiple lists using the group option:
          </p>
          <IDEWindow fileName="multi-list.js">
            <CodeBlock language="javascript">{`const kit = createDragKit()

// Create sortables with the same group
const todoList = kit.sortable(document.getElementById('todo'), {
  itemSelector: '.task',
  group: 'tasks',
  onSort: (event) => {
    console.log('TODO list updated')
  },
})

const inProgressList = kit.sortable(document.getElementById('in-progress'), {
  itemSelector: '.task',
  group: 'tasks',
  onSort: (event) => {
    console.log('In Progress list updated')
  },
})

const doneList = kit.sortable(document.getElementById('done'), {
  itemSelector: '.task',
  group: 'tasks',
  onSort: (event) => {
    console.log('Done list updated')

    // Mark task as complete when moved to done
    if (event.to.id === 'done' && event.from.id !== 'done') {
      const taskId = event.item.dataset.id
      markTaskComplete(taskId)
    }
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Use Drag Handles</h3>
              <p className="text-sm text-muted-foreground">
                Add explicit drag handles so users can click other elements (checkboxes, buttons) without triggering drag.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Debounce Save Operations</h3>
              <p className="text-sm text-muted-foreground">
                Don't save to backend on every sort event. Debounce the save or save only on drag end.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Show Visual Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Add CSS classes during drag to show users which item is being moved.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Handle Errors Gracefully</h3>
              <p className="text-sm text-muted-foreground">
                If backend save fails, revert the UI to the previous order and show an error message.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/guides/drag-and-drop" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Drag & Drop
          </Link>
          <Link to="/docs/guides/accessibility" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Accessibility
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
