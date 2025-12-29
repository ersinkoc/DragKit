import { CodeBlock } from '@/components/code/CodeBlock'
import { Callout } from '@/components/shared/Callout'

const kernelExample = `import { createKernel } from '@oxog/dragkit'

// Create a kernel instance
const kernel = createKernel({
  // Optional: Customize collision detection
  collisionDetection: 'closest-center',

  // Optional: Enable touch support
  sensors: ['pointer', 'touch', 'keyboard']
})

// Register event handlers
kernel.on('drag:start', (event) => {
  console.log('Drag started:', event.draggable.id)
})

kernel.on('drag:end', (event) => {
  console.log('Drag ended:', event.draggable.id)
})`

const draggableExample = `// Registering a draggable element
const draggable = kernel.registerDraggable({
  id: 'item-1',
  element: document.getElementById('my-draggable'),
  data: {
    type: 'task',
    priority: 'high'
  }
})

// Later, unregister when done
draggable.destroy()`

const droppableExample = `// Registering a droppable zone
const droppable = kernel.registerDroppable({
  id: 'zone-1',
  element: document.getElementById('drop-zone'),
  accept: (draggable) => {
    // Only accept 'task' type draggables
    return draggable.data?.type === 'task'
  },
  data: {
    column: 'done'
  }
})`

const sensorExample = `import { createKernel, PointerSensor, TouchSensor, KeyboardSensor } from '@oxog/dragkit'

const kernel = createKernel({
  sensors: [
    // Mouse/trackpad support
    PointerSensor,

    // Touch device support with delay
    [TouchSensor, { activationDelay: 200 }],

    // Keyboard navigation
    KeyboardSensor
  ]
})`

export function CoreConcepts() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Core Concepts</h1>
      <p className="lead">
        Understanding DragKit's architecture will help you build more
        sophisticated drag and drop interfaces.
      </p>

      <h2>The Kernel</h2>
      <p>
        At the heart of DragKit is the <strong>Kernel</strong>. It manages all
        drag state, coordinates between draggables and droppables, and handles
        event dispatching.
      </p>

      <CodeBlock
        code={kernelExample}
        language="typescript"
        filename="kernel.ts"
        showLineNumbers
      />

      <Callout type="info" title="Framework Adapters">
        When using React, Vue, or Svelte, the framework adapters create and
        manage the kernel for you. You typically don't need to interact with
        it directly.
      </Callout>

      <h2>Draggables</h2>
      <p>
        A <strong>Draggable</strong> is any element that can be picked up and
        moved. Each draggable has a unique ID and can carry custom data.
      </p>

      <CodeBlock
        code={draggableExample}
        language="typescript"
        filename="draggable.ts"
        showLineNumbers
      />

      <h3>Draggable Properties</h3>
      <ul>
        <li><code>id</code> - Unique identifier for the draggable</li>
        <li><code>element</code> - The DOM element to make draggable</li>
        <li><code>data</code> - Custom data attached to the draggable</li>
        <li><code>disabled</code> - Whether dragging is disabled</li>
        <li><code>handle</code> - Optional handle selector</li>
      </ul>

      <h2>Droppables</h2>
      <p>
        A <strong>Droppable</strong> is a zone where draggables can be dropped.
        It can filter which draggables it accepts.
      </p>

      <CodeBlock
        code={droppableExample}
        language="typescript"
        filename="droppable.ts"
        showLineNumbers
      />

      <h3>Droppable Properties</h3>
      <ul>
        <li><code>id</code> - Unique identifier for the droppable</li>
        <li><code>element</code> - The DOM element for the drop zone</li>
        <li><code>accept</code> - Filter function or type names</li>
        <li><code>data</code> - Custom data for the droppable</li>
        <li><code>disabled</code> - Whether dropping is disabled</li>
      </ul>

      <h2>Sensors</h2>
      <p>
        <strong>Sensors</strong> detect user input and trigger drag operations.
        DragKit includes sensors for mouse, touch, and keyboard.
      </p>

      <CodeBlock
        code={sensorExample}
        language="typescript"
        filename="sensors.ts"
        showLineNumbers
      />

      <h3>Available Sensors</h3>
      <ul>
        <li>
          <strong>PointerSensor</strong> - Handles mouse and trackpad input
        </li>
        <li>
          <strong>TouchSensor</strong> - Optimized for touch devices with
          configurable delay to distinguish from scrolling
        </li>
        <li>
          <strong>KeyboardSensor</strong> - Enables keyboard-based dragging
          for accessibility
        </li>
      </ul>

      <Callout type="tip" title="Custom Sensors">
        You can create custom sensors for special input devices or gestures.
        See the Advanced guide for details.
      </Callout>

      <h2>Collision Detection</h2>
      <p>
        Collision detection determines which droppable a draggable is over.
        DragKit provides several algorithms:
      </p>

      <ul>
        <li>
          <strong>closest-center</strong> - Finds the droppable whose center
          is closest to the draggable's center
        </li>
        <li>
          <strong>closest-corner</strong> - Uses corner distance for
          rectangular layouts
        </li>
        <li>
          <strong>rect-intersection</strong> - Based on overlapping area
        </li>
        <li>
          <strong>pointer-within</strong> - Based on pointer position only
        </li>
      </ul>

      <h2>Event System</h2>
      <p>
        DragKit uses a publish-subscribe event system. Events are emitted
        at each stage of a drag operation:
      </p>

      <ul>
        <li><code>drag:start</code> - Drag operation begins</li>
        <li><code>drag:move</code> - Draggable is moving</li>
        <li><code>drag:over</code> - Hovering over a droppable</li>
        <li><code>drag:leave</code> - Left a droppable</li>
        <li><code>drag:end</code> - Drop completed or cancelled</li>
      </ul>
    </article>
  )
}
