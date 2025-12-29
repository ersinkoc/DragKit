import { CodeBlock } from '@/components/code/CodeBlock'
import { Callout } from '@/components/shared/Callout'
import { TerminalWindow } from '@/components/code/TerminalWindow'

const installCode = 'npm install @oxog/dragkit'

const pluginSetup = `// main.ts
import { createApp } from 'vue'
import { DragKitPlugin } from '@oxog/dragkit/vue'
import App from './App.vue'

const app = createApp(App)
app.use(DragKitPlugin)
app.mount('#app')`

const composableExample = `<script setup lang="ts">
import { useDraggable, useDroppable } from '@oxog/dragkit/vue'

// Make an element draggable
const { setNodeRef: setDraggableRef, isDragging } = useDraggable({
  id: 'item-1',
  data: { type: 'card' }
})

// Create a drop zone
const { setNodeRef: setDroppableRef, isOver } = useDroppable({
  id: 'zone-1',
  accept: ['card']
})
</script>

<template>
  <div>
    <div
      :ref="setDraggableRef"
      :class="{ 'opacity-50': isDragging }"
      class="p-4 bg-blue-500 text-white rounded cursor-grab"
    >
      Drag me!
    </div>

    <div
      :ref="setDroppableRef"
      :class="{ 'bg-green-100': isOver }"
      class="w-48 h-48 border-2 border-dashed rounded"
    >
      {{ isOver ? 'Drop here!' : 'Drop zone' }}
    </div>
  </div>
</template>`

const eventsExample = `<script setup lang="ts">
import { useDragContext } from '@oxog/dragkit/vue'

const { kernel, isDragging, activeDraggable } = useDragContext()

// Listen for events
kernel.value?.on('drag:end', (event) => {
  const { active, over } = event
  if (over) {
    console.log(\`Dropped \${active.id} onto \${over.id}\`)
  }
})
</script>

<template>
  <div v-if="isDragging" class="fixed top-4 right-4 p-2 bg-yellow-100 rounded">
    Dragging: {{ activeDraggable?.id }}
  </div>
</template>`

const sortableExample = `<script setup lang="ts">
import { ref } from 'vue'
import { useSortable, SortableContext } from '@oxog/dragkit/vue'

const items = ref(['Item 1', 'Item 2', 'Item 3', 'Item 4'])

function handleDragEnd(event) {
  const { active, over } = event
  if (active.id !== over?.id) {
    const oldIndex = items.value.indexOf(active.id)
    const newIndex = items.value.indexOf(over.id)
    // Reorder items
    const [removed] = items.value.splice(oldIndex, 1)
    items.value.splice(newIndex, 0, removed)
  }
}
</script>

<template>
  <SortableContext :items="items" @drag-end="handleDragEnd">
    <SortableItem
      v-for="item in items"
      :key="item"
      :id="item"
    />
  </SortableContext>
</template>`

const typedExample = `<script setup lang="ts">
import { useDraggable, DragData } from '@oxog/dragkit/vue'

interface TaskData extends DragData {
  type: 'task'
  priority: 'low' | 'medium' | 'high'
}

const { setNodeRef, isDragging } = useDraggable<TaskData>({
  id: props.task.id,
  data: {
    type: 'task',
    priority: props.task.priority
  }
})
</script>`

export function FrameworksVue() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Vue Integration</h1>
      <p className="lead">
        DragKit provides Vue 3 Composition API support with fully typed
        composables and reactive state.
      </p>

      <h2>Installation</h2>
      <TerminalWindow command={installCode} />

      <h2>Plugin Setup</h2>
      <p>
        Register the DragKit plugin in your Vue app:
      </p>

      <CodeBlock
        code={pluginSetup}
        language="typescript"
        filename="main.ts"
        showLineNumbers
      />

      <h2>Using Composables</h2>
      <p>
        DragKit provides Vue composables that mirror the React hooks API:
      </p>

      <CodeBlock
        code={composableExample}
        language="vue"
        filename="DragDemo.vue"
        showLineNumbers
      />

      <Callout type="info" title="Reactivity">
        All return values from DragKit composables are reactive refs. They
        automatically update when drag state changes.
      </Callout>

      <h2>Handling Events</h2>
      <p>
        Access the kernel through <code>useDragContext</code> to listen for events:
      </p>

      <CodeBlock
        code={eventsExample}
        language="vue"
        filename="DragStatus.vue"
        showLineNumbers
      />

      <h2>Sortable Lists</h2>
      <p>
        Create sortable lists with the <code>SortableContext</code> component
        and <code>useSortable</code> composable:
      </p>

      <CodeBlock
        code={sortableExample}
        language="vue"
        filename="SortableList.vue"
        showLineNumbers
      />

      <h2>TypeScript Support</h2>
      <p>
        All composables are fully typed. Specify your data types for complete
        type inference:
      </p>

      <CodeBlock
        code={typedExample}
        language="vue"
        filename="TaskCard.vue"
        showLineNumbers
      />

      <h2>Available Composables</h2>
      <ul>
        <li><code>useDraggable</code> - Make elements draggable</li>
        <li><code>useDroppable</code> - Create drop zones</li>
        <li><code>useSortable</code> - For sortable list items</li>
        <li><code>useDragContext</code> - Access global drag state</li>
      </ul>

      <Callout type="tip" title="Nuxt Compatibility">
        DragKit is compatible with Nuxt 3. Use it within client-only components
        or with the <code>&lt;ClientOnly&gt;</code> wrapper.
      </Callout>
    </article>
  )
}
