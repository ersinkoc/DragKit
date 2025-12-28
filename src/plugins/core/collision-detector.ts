/**
 * Collision Detector Plugin
 * Hit testing and overlap detection algorithms
 */

import type {
  Plugin,
  Kernel,
  DraggableInstance,
  DroppableInstance,
  CollisionAlgorithm,
  CollisionFn,
  Position
} from '../../types'
import { rectangleIntersection, getCenter, pointInside, getDistance } from '../../utils/geometry'

interface CollisionDetectorAPI {
  detect(draggable: DraggableInstance, droppables: DroppableInstance[]): DroppableInstance | null
  detectAll(draggable: DraggableInstance, droppables: DroppableInstance[]): DroppableInstance[]
  setAlgorithm(algorithm: CollisionAlgorithm | CollisionFn): void
  getAlgorithm(): CollisionAlgorithm | 'custom'
}

class CollisionDetector implements CollisionDetectorAPI {
  private algorithm: CollisionAlgorithm | CollisionFn = 'rectangle'
  private lastPointerPosition: Position = { x: 0, y: 0 }

  constructor(_kernel: Kernel) {}

  setPointerPosition(position: Position): void {
    this.lastPointerPosition = position
  }

  detect(draggable: DraggableInstance, droppables: DroppableInstance[]): DroppableInstance | null {
    if (droppables.length === 0) return null

    if (typeof this.algorithm === 'function') {
      return this.algorithm(draggable, droppables)
    }

    switch (this.algorithm) {
      case 'rectangle':
        return this.rectangleCollision(draggable, droppables)
      case 'center':
        return this.centerCollision(draggable, droppables)
      case 'pointer':
        return this.pointerCollision(draggable, droppables)
      case 'closest':
        return this.closestCollision(draggable, droppables)
      default:
        return null
    }
  }

  detectAll(draggable: DraggableInstance, droppables: DroppableInstance[]): DroppableInstance[] {
    const dragRect = draggable.element.getBoundingClientRect()

    return droppables.filter(droppable => {
      const dropRect = droppable.getRect()
      return rectangleIntersection(dragRect, dropRect)
    })
  }

  setAlgorithm(algorithm: CollisionAlgorithm | CollisionFn): void {
    this.algorithm = algorithm
  }

  getAlgorithm(): CollisionAlgorithm | 'custom' {
    return typeof this.algorithm === 'function' ? 'custom' : this.algorithm
  }

  private rectangleCollision(
    draggable: DraggableInstance,
    droppables: DroppableInstance[]
  ): DroppableInstance | null {
    const dragRect = draggable.element.getBoundingClientRect()

    return (
      droppables.find(droppable => {
        const dropRect = droppable.getRect()
        return rectangleIntersection(dragRect, dropRect)
      }) ?? null
    )
  }

  private centerCollision(
    draggable: DraggableInstance,
    droppables: DroppableInstance[]
  ): DroppableInstance | null {
    const dragRect = draggable.element.getBoundingClientRect()
    const center = getCenter(dragRect)

    return (
      droppables.find(droppable => {
        const dropRect = droppable.getRect()
        return pointInside(center, dropRect)
      }) ?? null
    )
  }

  private pointerCollision(
    _draggable: DraggableInstance,
    droppables: DroppableInstance[]
  ): DroppableInstance | null {
    return (
      droppables.find(droppable => {
        const dropRect = droppable.getRect()
        return pointInside(this.lastPointerPosition, dropRect)
      }) ?? null
    )
  }

  private closestCollision(
    _draggable: DraggableInstance,
    droppables: DroppableInstance[]
  ): DroppableInstance | null {
    if (droppables.length === 0) return null

    let closest: DroppableInstance | null = null
    let minDistance = Infinity

    for (const droppable of droppables) {
      const dropRect = droppable.getRect()
      const center = getCenter(dropRect)
      const distance = getDistance(this.lastPointerPosition, center)

      if (distance < minDistance) {
        minDistance = distance
        closest = droppable
      }
    }

    return closest
  }
}

export const collisionDetectorPlugin: Plugin & { api?: CollisionDetectorAPI } = {
  name: 'collision-detector',
  version: '1.0.0',
  type: 'core',

  install(kernel: Kernel) {
    this.api = new CollisionDetector(kernel) as any
  },

  uninstall() {
    // Cleanup
  }
}
