import { motion } from 'framer-motion'
import { IDEWindow } from '@/components/code/IDEWindow'

const exampleCode = `import { createDragKit } from '@oxog/dragkit'

// Initialize DragKit
const kit = await createDragKit()

// Make an element draggable
const draggable = kit.draggable(element, {
  onDragStart: (event) => {
    console.log('Drag started', event)
  },
  onDragMove: (event) => {
    console.log('Dragging...', event)
  },
  onDragEnd: (event) => {
    console.log('Drag ended', event)
  }
})

// Create a sortable list
const sortable = kit.sortable(container, {
  animation: 150,
  onSort: (event) => {
    console.log('Items reordered', event)
  }
})`

export function CodePreview() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Intuitive API
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started with just a few lines of code
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <IDEWindow
            filename="app.ts"
            code={exampleCode}
            language="typescript"
          />
        </motion.div>
      </div>
    </section>
  )
}
