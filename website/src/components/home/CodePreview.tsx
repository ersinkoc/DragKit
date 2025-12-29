import { motion } from 'framer-motion'
import { IDEWindow } from '@/components/code/IDEWindow'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const basicExample = `import { DragProvider, useDraggable, useDroppable } from '@oxog/dragkit'

function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </div>
  )
}

function DroppableZone({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ background: isOver ? '#e0f2fe' : 'transparent' }}
    >
      {children}
    </div>
  )
}

export function App() {
  return (
    <DragProvider>
      <DroppableZone id="drop-zone">
        <DraggableItem id="item-1">Drag me!</DraggableItem>
      </DroppableZone>
    </DragProvider>
  )
}`

const sortableExample = `import { DragProvider, useSortable, SortableContext } from '@oxog/dragkit'

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
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  )
}

export function SortableList({ items }) {
  return (
    <DragProvider>
      <SortableContext items={items}>
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            {item.content}
          </SortableItem>
        ))}
      </SortableContext>
    </DragProvider>
  )
}`

const advancedExample = `import {
  DragProvider,
  useDraggable,
  DragOverlay,
  CollisionDetector
} from '@oxog/dragkit'

function App() {
  const [activeId, setActiveId] = useState(null)

  return (
    <DragProvider
      collisionDetection={CollisionDetector.closestCenter}
      onDragStart={(event) => setActiveId(event.active.id)}
      onDragEnd={(event) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
          // Handle drop logic
          handleDrop(active.id, over.id)
        }
        setActiveId(null)
      }}
    >
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <DraggableCard key={item.id} {...item} />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <DragPreview item={items.find(i => i.id === activeId)} />
        ) : null}
      </DragOverlay>
    </DragProvider>
  )
}`

export function CodePreview() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Simple Yet Powerful API
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Get started in minutes with our intuitive hooks and components.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="sortable">Sortable</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <IDEWindow
                filename="App.tsx"
                code={basicExample}
                language="tsx"
              />
            </TabsContent>
            <TabsContent value="sortable">
              <IDEWindow
                filename="SortableList.tsx"
                code={sortableExample}
                language="tsx"
              />
            </TabsContent>
            <TabsContent value="advanced">
              <IDEWindow
                filename="AdvancedExample.tsx"
                code={advancedExample}
                language="tsx"
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
