# DragKit

<div align="center">

**Zero-dependency drag & drop toolkit with micro-kernel plugin architecture**

[![npm version](https://img.shields.io/npm/v/@oxog/dragkit.svg?style=flat-square)](https://www.npmjs.com/package/@oxog/dragkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@oxog/dragkit?style=flat-square)](https://bundlephobia.com/package/@oxog/dragkit)
[![license](https://img.shields.io/npm/l/@oxog/dragkit.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org/)

[Documentation](https://dragkit.oxog.dev) • [Getting Started](https://dragkit.oxog.dev/docs/getting-started) • [Examples](https://dragkit.oxog.dev/examples) • [Playground](https://dragkit.oxog.dev/playground)

</div>

---

## Features

- 🎯 **Drag & Drop** - Draggable elements and drop zones
- 📋 **Sortable** - Vertical and horizontal lists
- 🔲 **Grid** - Sortable grids with columns
- 🌳 **Nested** - Tree and nested lists (plugin)
- 👆 **Touch** - Full touch device support
- ⌨️ **Keyboard** - Accessible keyboard navigation (plugin)
- 🎨 **Customizable** - Animations, constraints, collision detection
- 🔌 **Zero Dependencies** - No runtime dependencies
- ⚡ **Tiny** - Under 5KB minified + gzipped
- 🏗️ **Micro-Kernel** - Plugin-based architecture
- 🔒 **Type-Safe** - Full TypeScript support
- ⚛️ **Framework Adapters** - React, Vue, Svelte 

## Installation

```bash
npm install @oxog/dragkit
```

```bash
yarn add @oxog/dragkit
```

```bash
pnpm add @oxog/dragkit
```

```bash
bun add @oxog/dragkit
```

## Quick Start

### Vanilla JavaScript

```javascript
import { createDragKit } from '@oxog/dragkit'

// Create DragKit instance
const dnd = await createDragKit()

// Make an element draggable
const draggable = dnd.draggable(document.querySelector('.card'), {
  id: 'card-1',
  data: { type: 'card' }
})

// Create a drop zone
const droppable = dnd.droppable(document.querySelector('.zone'), {
  id: 'zone-1',
  accept: ['card'],
  onDrop: (event) => {
    console.log('Dropped:', event.draggable.id)
  }
})
```

### Sortable List

```javascript
const sortable = dnd.sortable(document.querySelector('.list'), {
  id: 'todo-list',
  items: ['task-1', 'task-2', 'task-3'],
  direction: 'vertical',
  animation: { duration: 200, easing: 'ease-out' },
  onSortEnd: (event) => {
    console.log('New order:', event.items)
  }
})
```

### Sortable Grid

```javascript
const grid = dnd.sortableGrid(document.querySelector('.grid'), {
  id: 'image-grid',
  items: ['img-1', 'img-2', 'img-3', 'img-4'],
  columns: 3,
  gap: 16,
  onSortEnd: (event) => {
    console.log('Grid reordered:', event.items)
  }
})
```

## React

```tsx
import { DragProvider, useDraggable, useDroppable } from '@oxog/dragkit/react'

function DraggableCard({ id }: { id: string }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({ id })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      Drag me!
    </div>
  )
}

function DroppableZone({ id }: { id: string }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ background: isOver ? '#e0f2fe' : 'transparent' }}
    >
      Drop here
    </div>
  )
}

function App() {
  return (
    <DragProvider>
      <DraggableCard id="card-1" />
      <DroppableZone id="zone-1" />
    </DragProvider>
  )
}
```

## Vue

```vue
<script setup>
import { useDraggable, useDroppable } from '@oxog/dragkit/vue'

const { setNodeRef: dragRef, isDragging } = useDraggable({ id: 'item-1' })
const { setNodeRef: dropRef, isOver } = useDroppable({ id: 'zone-1' })
</script>

<template>
  <div :ref="dragRef" :style="{ opacity: isDragging ? 0.5 : 1 }">
    Drag me!
  </div>
  <div :ref="dropRef" :style="{ background: isOver ? '#e0f2fe' : 'transparent' }">
    Drop here
  </div>
</template>
```

## Svelte

```svelte
<script>
  import { draggable, droppable } from '@oxog/dragkit/svelte'
</script>

<div use:draggable={{ id: 'item-1' }}>
  Drag me!
</div>

<div use:droppable={{ id: 'zone-1' }}>
  Drop here
</div>
```

## Core Plugins

DragKit includes 6 core plugins that are always loaded:

1. **drag-manager** - Draggable element lifecycle and state
2. **drop-manager** - Droppable zone management
3. **sortable-engine** - List and grid sorting logic
4. **pointer-sensor** - Mouse and pointer events
5. **touch-sensor** - Touch device support
6. **collision-detector** - Hit testing algorithms

## Optional Plugins

Additional plugins can be imported separately:

- **keyboard-sensor** - Keyboard navigation for accessibility
- **auto-scroll** - Auto-scroll when dragging near edges
- **multi-drag** - Multiple item selection and dragging
- **nested-sortable** - Tree and nested list support
- **snap-grid** - Snap to grid during drag
- **constraints** - Axis locking and bounds
- **drag-devtools** - Visual debugging panel

## API Reference

### createDragKit(options?)

Creates a new DragKit instance.

**Options:**
- `sensors` - Array of sensors to use (default: `['pointer', 'touch']`)
- `collision` - Collision algorithm (default: `'rectangle'`)
- `autoScroll` - Enable auto-scroll (default: `false`)
- `accessibility` - Enable accessibility features (default: `true`)
- `animation` - Animation options (default: `{ duration: 200, easing: 'ease-out' }`)
- `plugins` - Array of additional plugins

**Returns:** `Promise<DragKitKernel>`

### kernel.draggable(element, options)

Make an element draggable.

**Options:**
- `id` (required) - Unique identifier
- `data` - Custom data to attach
- `handle` - Drag handle selector or element
- `disabled` - Disable dragging
- `axis` - Lock to axis ('x' | 'y' | 'both')
- `bounds` - Constrain movement
- `preview` - Preview element type
- `onDragStart`, `onDragMove`, `onDragEnd`, `onDragCancel` - Event callbacks

### kernel.droppable(element, options)

Create a drop zone.

**Options:**
- `id` (required) - Unique identifier
- `accept` - Accepted draggable types
- `disabled` - Disable drop zone
- `data` - Custom data
- `activeClass` - CSS class when dragging compatible item
- `overClass` - CSS class when item is over
- `onDragEnter`, `onDragOver`, `onDragLeave`, `onDrop` - Event callbacks

### kernel.sortable(container, options)

Create a sortable list.

**Options:**
- `id` (required) - Unique identifier
- `items` (required) - Array of item IDs
- `direction` - Sort direction ('vertical' | 'horizontal')
- `handle` - Handle selector
- `animation` - Animation options
- `group` - Group name for cross-list sorting
- `onSortStart`, `onSortMove`, `onSortEnd` - Event callbacks

## Collision Algorithms

DragKit supports multiple collision detection algorithms:

- **rectangle** - Any overlap between bounding boxes (default)
- **center** - Draggable center must be inside droppable
- **pointer** - Pointer position must be inside droppable
- **closest** - Closest droppable to pointer
- **custom** - Provide your own function

```javascript
const dnd = await createDragKit({
  collision: 'pointer' // or custom function
})
```

## Browser Support

- Chrome 55+
- Firefox 52+
- Safari 13+
- Edge 79+
- Mobile Safari 13+
- Chrome Android 55+

## Comparison

| Feature | DragKit | dnd-kit | react-beautiful-dnd |
|---------|---------|---------|---------------------|
| Bundle Size | **< 5KB** | ~30KB | ~40KB |
| Dependencies | **0** | 2+ | 10+ |
| Framework | **Agnostic** | React only | React only |
| Touch Support | ✅ | ✅ | ✅ |
| Keyboard | ✅ (plugin) | ✅ | ✅ |
| Grid Sorting | ✅ | Plugin | ❌ |
| Nested Lists | ✅ (plugin) | Plugin | ❌ |
| Maintained | ✅ | ✅ | ❌ (archived) |

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)

## Links

- [Documentation](https://dragkit.oxog.dev)
- [GitHub Repository](https://github.com/ersinkoc/dragkit)
- [NPM Package](https://www.npmjs.com/package/@oxog/dragkit)
- [Issue Tracker](https://github.com/ersinkoc/dragkit/issues)

---

**Built with ❤️ by [Ersin KOÇ](https://github.com/ersinkoc)**
