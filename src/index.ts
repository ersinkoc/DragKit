/**
 * DragKit - Main Entry Point
 * Zero-dependency drag & drop toolkit
 */

// Factory function
export { createDragKit, DragKitKernel } from './kernel'

// Core types
export type * from './types'

// Utilities (exported for advanced use cases)
export { arrayMove, arrayInsert, arrayRemove, arraySwap } from './utils/array'
export { rectangleIntersection, getCenter, pointInside, getDistance, clamp } from './utils/geometry'

// Version
export const version = '1.0.0'
