import { DocsLayout } from '@/components/layout/DocsLayout'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'

export default function VueIntegration() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Vue Integration</h1>
          <p className="text-xl text-muted-foreground">
            Use DragKit with Vue 3 Composition API and Options API.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Installation</h2>
          <IDEWindow fileName="terminal">
            <CodeBlock language="bash">{`npm install @oxog/dragkit`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Composition API</h2>
          <p className="text-muted-foreground">
            Use Vue 3's Composition API with ref and onMounted:
          </p>
          <IDEWindow fileName="DraggableCard.vue">
            <CodeBlock language="vue">{`<template>
  <div ref="cardRef" class="card">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { createDragKit } from '@oxog/dragkit'

const props = defineProps({
  id: String,
  data: Object
})

const emit = defineEmits(['dragStart', 'dragEnd'])

const cardRef = ref(null)
let kit = null
let draggable = null

onMounted(() => {
  kit = createDragKit()

  draggable = kit.draggable(cardRef.value, {
    id: props.id,
    data: props.data,

    onDragStart: (event) => {
      emit('dragStart', event)
    },

    onDragEnd: (event) => {
      emit('dragEnd', event)
    },
  })
})

onUnmounted(() => {
  draggable?.destroy()
  kit?.destroy()
})
</script>

<style scoped>
.card {
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: move;
}
</style>`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Sortable List Component</h2>
          <IDEWindow fileName="SortableList.vue">
            <CodeBlock language="vue">{`<template>
  <div ref="listRef" class="sortable-list">
    <div
      v-for="item in items"
      :key="item.id"
      :data-id="item.id"
      class="list-item"
    >
      <span class="handle">⋮⋮</span>
      <span>{{ item.title }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { createDragKit } from '@oxog/dragkit'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:items'])

const listRef = ref(null)
let kit = null
let sortable = null

onMounted(() => {
  kit = createDragKit()

  sortable = kit.sortable(listRef.value, {
    itemSelector: '.list-item',
    handle: '.handle',
    animation: 200,

    onSort: (event) => {
      // Update items in parent component
      const newOrder = event.order.map(id =>
        props.items.find(item => item.id === id)
      )
      emit('update:items', newOrder)
    },
  })
})

onUnmounted(() => {
  sortable?.destroy()
  kit?.destroy()
})
</script>

<style scoped>
.sortable-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.handle {
  cursor: move;
  color: #9ca3af;
  user-select: none;
}
</style>`}</CodeBlock>
          </IDEWindow>

          <p className="text-muted-foreground mt-4">
            Usage in parent component:
          </p>
          <IDEWindow fileName="App.vue">
            <CodeBlock language="vue">{`<template>
  <div>
    <h1>My Tasks</h1>
    <SortableList v-model:items="tasks" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SortableList from './components/SortableList.vue'

const tasks = ref([
  { id: '1', title: 'Review pull requests' },
  { id: '2', title: 'Update documentation' },
  { id: '3', title: 'Fix bug in login' },
])
</script>`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Options API</h2>
          <p className="text-muted-foreground">
            For Vue 2 or Options API users:
          </p>
          <IDEWindow fileName="DraggableCard.vue">
            <CodeBlock language="vue">{`<template>
  <div ref="card" class="card">
    <slot />
  </div>
</template>

<script>
import { createDragKit } from '@oxog/dragkit'

export default {
  props: {
    id: String,
    data: Object
  },

  data() {
    return {
      kit: null,
      draggable: null
    }
  },

  mounted() {
    this.kit = createDragKit()

    this.draggable = this.kit.draggable(this.$refs.card, {
      id: this.id,
      data: this.data,

      onDragStart: (event) => {
        this.$emit('dragStart', event)
      },

      onDragEnd: (event) => {
        this.$emit('dragEnd', event)
      },
    })
  },

  beforeUnmount() {
    this.draggable?.destroy()
    this.kit?.destroy()
  }
}
</script>`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Composable Pattern</h2>
          <p className="text-muted-foreground">
            Create a reusable composable for DragKit:
          </p>
          <IDEWindow fileName="useDragKit.js">
            <CodeBlock language="javascript">{`import { ref, onMounted, onUnmounted } from 'vue'
import { createDragKit } from '@oxog/dragkit'

export function useDragKit() {
  const kit = ref(null)

  onMounted(() => {
    kit.value = createDragKit()
  })

  onUnmounted(() => {
    kit.value?.destroy()
  })

  return { kit }
}

export function useDraggable(elementRef, options) {
  const { kit } = useDragKit()
  const draggable = ref(null)

  onMounted(() => {
    if (kit.value && elementRef.value) {
      draggable.value = kit.value.draggable(
        elementRef.value,
        options
      )
    }
  })

  onUnmounted(() => {
    draggable.value?.destroy()
  })

  return { draggable }
}

export function useSortable(containerRef, options) {
  const { kit } = useDragKit()
  const sortable = ref(null)

  onMounted(() => {
    if (kit.value && containerRef.value) {
      sortable.value = kit.value.sortable(
        containerRef.value,
        options
      )
    }
  })

  onUnmounted(() => {
    sortable.value?.destroy()
  })

  return { sortable }
}`}</CodeBlock>
          </IDEWindow>

          <p className="text-muted-foreground mt-4">
            Usage:
          </p>
          <IDEWindow fileName="Component.vue">
            <CodeBlock language="vue">{`<script setup>
import { ref } from 'vue'
import { useDraggable } from './composables/useDragKit'

const cardRef = ref(null)

const { draggable } = useDraggable(cardRef, {
  id: 'my-card',
  onDragStart: (event) => {
    console.log('Drag started')
  },
})
</script>`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">TypeScript Support</h2>
          <IDEWindow fileName="DraggableCard.vue">
            <CodeBlock language="vue">{`<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { createDragKit, DragKit, Draggable } from '@oxog/dragkit'

interface CardData {
  id: number
  title: string
  status: 'active' | 'done'
}

interface Props {
  id: string
  data: CardData
}

const props = defineProps<Props>()

const cardRef = ref<HTMLDivElement | null>(null)
let kit: DragKit | null = null
let draggable: Draggable<CardData> | null = null

onMounted(() => {
  if (!cardRef.value) return

  kit = createDragKit()

  draggable = kit.draggable<CardData>(cardRef.value, {
    id: props.id,
    data: props.data,

    onDragEnd: (event) => {
      // TypeScript knows event.draggable.data is CardData
      console.log('Status:', event.draggable.data.status)
    },
  })
})

onUnmounted(() => {
  draggable?.destroy()
  kit?.destroy()
})
</script>`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Always Clean Up</h3>
              <p className="text-sm text-muted-foreground">
                Use onUnmounted (Composition API) or beforeUnmount (Options API) to destroy instances.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Use Template Refs</h3>
              <p className="text-sm text-muted-foreground">
                DragKit needs direct DOM access, so always use template refs.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Emit Events for Parent Communication</h3>
              <p className="text-sm text-muted-foreground">
                Use Vue's emit system to communicate drag events to parent components.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Create Composables for Reusability</h3>
              <p className="text-sm text-muted-foreground">
                Extract common DragKit logic into composables for better code organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
