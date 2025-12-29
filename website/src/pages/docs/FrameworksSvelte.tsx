import { CodeBlock } from '@/components/code/CodeBlock'
import { Callout } from '@/components/shared/Callout'
import { TerminalWindow } from '@/components/code/TerminalWindow'

const installCode = 'npm install @oxog/dragkit'

const storeSetup = `<script>
  import { createDragKitStore } from '@oxog/dragkit/svelte'

  // Create a store for the drag context
  const dragkit = createDragKitStore()

  // Subscribe to drag events
  $: if ($dragkit.isDragging) {
    console.log('Currently dragging:', $dragkit.activeId)
  }
</script>`

const actionExample = `<script>
  import { draggable, droppable } from '@oxog/dragkit/svelte'

  let isDragging = false
  let isOver = false
</script>

<!-- Make an element draggable -->
<div
  use:draggable={{ id: 'item-1', data: { type: 'card' } }}
  on:dragstart={() => isDragging = true}
  on:dragend={() => isDragging = false}
  class:opacity-50={isDragging}
  class="p-4 bg-blue-500 text-white rounded cursor-grab"
>
  Drag me!
</div>

<!-- Create a drop zone -->
<div
  use:droppable={{ id: 'zone-1', accept: ['card'] }}
  on:dragover={() => isOver = true}
  on:dragleave={() => isOver = false}
  class:bg-green-100={isOver}
  class="w-48 h-48 border-2 border-dashed rounded"
>
  {isOver ? 'Drop here!' : 'Drop zone'}
</div>`

const sortableExample = `<script>
  import { sortable, createSortableStore } from '@oxog/dragkit/svelte'

  let items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

  const sortableStore = createSortableStore({
    items,
    onReorder: (newItems) => {
      items = newItems
    }
  })
</script>

<div class="space-y-2">
  {#each items as item (item)}
    <div
      use:sortable={{ id: item, store: sortableStore }}
      class="p-3 bg-white border rounded shadow-sm"
    >
      {item}
    </div>
  {/each}
</div>`

const typedExample = `<script lang="ts">
  import { draggable, type DraggableActionOptions } from '@oxog/dragkit/svelte'

  interface TaskData {
    type: 'task'
    priority: 'low' | 'medium' | 'high'
  }

  export let task: Task

  const options: DraggableActionOptions<TaskData> = {
    id: task.id,
    data: {
      type: 'task',
      priority: task.priority
    }
  }
</script>

<div use:draggable={options} class="p-4 border rounded">
  {task.title}
</div>`

const svelteKitExample = `<!-- src/routes/+page.svelte -->
<script>
  import { browser } from '$app/environment'
  import { draggable, droppable } from '@oxog/dragkit/svelte'
</script>

{#if browser}
  <div use:draggable={{ id: 'item-1' }}>
    Draggable content
  </div>

  <div use:droppable={{ id: 'zone-1' }}>
    Drop zone
  </div>
{:else}
  <div>Loading...</div>
{/if}`

export function FrameworksSvelte() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Svelte Integration</h1>
      <p className="lead">
        DragKit provides Svelte actions and stores for a native Svelte
        experience with full TypeScript support.
      </p>

      <h2>Installation</h2>
      <TerminalWindow command={installCode} />

      <h2>Store Setup</h2>
      <p>
        Create a DragKit store to manage drag state reactively:
      </p>

      <CodeBlock
        code={storeSetup}
        language="svelte"
        filename="App.svelte"
        showLineNumbers
      />

      <h2>Using Actions</h2>
      <p>
        DragKit provides Svelte actions for declarative drag and drop:
      </p>

      <CodeBlock
        code={actionExample}
        language="svelte"
        filename="DragDemo.svelte"
        showLineNumbers
      />

      <Callout type="info" title="Svelte Actions">
        Actions are the Svelte-native way to add behavior to elements.
        They automatically clean up when the element is removed from the DOM.
      </Callout>

      <h2>Sortable Lists</h2>
      <p>
        Create sortable lists with the <code>sortable</code> action and a
        sortable store:
      </p>

      <CodeBlock
        code={sortableExample}
        language="svelte"
        filename="SortableList.svelte"
        showLineNumbers
      />

      <h2>TypeScript Support</h2>
      <p>
        All actions and stores are fully typed:
      </p>

      <CodeBlock
        code={typedExample}
        language="svelte"
        filename="TaskCard.svelte"
        showLineNumbers
      />

      <h2>SvelteKit Usage</h2>
      <p>
        When using SvelteKit, ensure drag functionality only runs in the browser:
      </p>

      <CodeBlock
        code={svelteKitExample}
        language="svelte"
        filename="+page.svelte"
        showLineNumbers
      />

      <Callout type="tip" title="Svelte 5 Ready">
        DragKit is compatible with Svelte 5 and its new runes system. Actions
        work the same way in both Svelte 4 and 5.
      </Callout>

      <h2>Available Actions</h2>
      <ul>
        <li><code>draggable</code> - Make elements draggable</li>
        <li><code>droppable</code> - Create drop zones</li>
        <li><code>sortable</code> - For sortable list items</li>
      </ul>

      <h2>Available Stores</h2>
      <ul>
        <li><code>createDragKitStore</code> - Global drag context</li>
        <li><code>createSortableStore</code> - Manage sortable list state</li>
      </ul>
    </article>
  )
}
