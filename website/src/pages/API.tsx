export default function API() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">API Reference</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Core</h2>

        <div className="space-y-8">
          <ApiItem
            name="createDragKit(options?)"
            description="Creates a new DragKit kernel instance."
            params={[
              { name: 'options.sensors', type: "SensorType[]", desc: "Sensors to enable (default: ['pointer', 'touch'])" },
              { name: 'options.collision', type: 'CollisionAlgorithm', desc: "Collision detection algorithm (default: 'rectangle')" },
              { name: 'options.plugins', type: 'Plugin[]', desc: 'Additional plugins to load' }
            ]}
            returns="Promise<Kernel>"
          />

          <ApiItem
            name="kernel.draggable(element, options)"
            description="Register an element as draggable."
            params={[
              { name: 'element', type: 'HTMLElement', desc: 'The element to make draggable' },
              { name: 'options.id', type: 'string', desc: 'Unique identifier' },
              { name: 'options.data', type: 'DragData', desc: 'Data attached to the draggable' },
              { name: 'options.disabled', type: 'boolean', desc: 'Whether dragging is disabled' }
            ]}
            returns="DraggableInstance"
          />

          <ApiItem
            name="kernel.droppable(element, options)"
            description="Register an element as a drop zone."
            params={[
              { name: 'element', type: 'HTMLElement', desc: 'The element to make droppable' },
              { name: 'options.id', type: 'string', desc: 'Unique identifier' },
              { name: 'options.accept', type: 'string | string[] | Function', desc: 'Types to accept' }
            ]}
            returns="DroppableInstance"
          />

          <ApiItem
            name="kernel.sortable(container, options)"
            description="Create a sortable list."
            params={[
              { name: 'container', type: 'HTMLElement', desc: 'The container element' },
              { name: 'options.id', type: 'string', desc: 'Unique identifier' },
              { name: 'options.items', type: 'string[]', desc: 'Initial item order' },
              { name: 'options.direction', type: "'vertical' | 'horizontal'", desc: 'Sort direction' }
            ]}
            returns="SortableInstance"
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">React Hooks</h2>

        <div className="space-y-8">
          <ApiItem
            name="useDraggable(options)"
            description="Hook for creating draggable elements."
            params={[
              { name: 'options.id', type: 'string', desc: 'Unique identifier' },
              { name: 'options.data', type: 'DragData', desc: 'Data attached to the draggable' }
            ]}
            returns="{ setNodeRef, attributes, listeners, isDragging, transform }"
          />

          <ApiItem
            name="useDroppable(options)"
            description="Hook for creating droppable zones."
            params={[
              { name: 'options.id', type: 'string', desc: 'Unique identifier' },
              { name: 'options.accept', type: 'AcceptOption', desc: 'Types to accept' }
            ]}
            returns="{ setNodeRef, isOver, canDrop, active }"
          />

          <ApiItem
            name="useSortable(options)"
            description="Hook for sortable items."
            params={[
              { name: 'options.id', type: 'string', desc: 'Unique identifier' }
            ]}
            returns="{ setNodeRef, attributes, listeners, isDragging, transform, index }"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Plugins</h2>

        <div className="space-y-8">
          <ApiItem
            name="keyboardSensor(options?)"
            description="Enable keyboard navigation for accessibility."
            params={[
              { name: 'options.moveDistance', type: 'number', desc: 'Pixels to move per key press' }
            ]}
            returns="Plugin"
          />

          <ApiItem
            name="autoScroll(options?)"
            description="Auto-scroll when dragging near edges."
            params={[
              { name: 'options.speed', type: 'number', desc: 'Scroll speed' },
              { name: 'options.threshold', type: 'number', desc: 'Distance from edge to trigger' }
            ]}
            returns="Plugin"
          />

          <ApiItem
            name="snapGrid(options?)"
            description="Snap to grid during drag."
            params={[
              { name: 'options.size', type: 'number', desc: 'Grid size in pixels' },
              { name: 'options.showGrid', type: 'boolean', desc: 'Show grid overlay' }
            ]}
            returns="Plugin"
          />
        </div>
      </section>
    </div>
  )
}

interface ParamInfo {
  name: string
  type: string
  desc: string
}

function ApiItem({
  name,
  description,
  params,
  returns
}: {
  name: string
  description: string
  params: ParamInfo[]
  returns: string
}) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-mono font-semibold text-primary-600 mb-2">{name}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4">{description}</p>

      <h4 className="font-semibold mb-2">Parameters</h4>
      <ul className="space-y-1 mb-4">
        {params.map((p) => (
          <li key={p.name} className="text-sm">
            <code className="text-primary-600">{p.name}</code>
            <span className="text-zinc-500">: {p.type}</span>
            <span className="text-zinc-600 dark:text-zinc-400"> - {p.desc}</span>
          </li>
        ))}
      </ul>

      <h4 className="font-semibold mb-1">Returns</h4>
      <code className="text-sm">{returns}</code>
    </div>
  )
}
