/**
 * Drag Manager Plugin Tests
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { createDragKit } from '../../src/kernel/kernel'
import type { DragKitKernel, DraggableInstance } from '../../src/types'

describe('Drag Manager Plugin', () => {
  let kernel: DragKitKernel

  beforeEach(async () => {
    kernel = await createDragKit() as DragKitKernel
  })

  describe('draggable registration', () => {
    it('should register a draggable with minimal options', () => {
      const element = document.createElement('div')

      const instance = kernel.draggable(element, { id: 'basic-drag' })

      expect(instance).toBeDefined()
      expect(instance.id).toBe('basic-drag')
      expect(instance.element).toBe(element)
    })

    it('should register a draggable with custom data', () => {
      const element = document.createElement('div')

      const instance = kernel.draggable(element, {
        id: 'data-drag',
        data: { type: 'card', index: 0 }
      })

      expect(instance.data.type).toBe('card')
      expect(instance.data.index).toBe(0)
    })

    it('should set data-draggable-id attribute', () => {
      const element = document.createElement('div')

      kernel.draggable(element, { id: 'attr-drag' })

      expect(element.getAttribute('data-draggable-id')).toBe('attr-drag')
    })

    it('should prevent native drag', () => {
      const element = document.createElement('div')

      kernel.draggable(element, { id: 'no-native' })

      expect(element.getAttribute('draggable')).toBe('false')
    })

    it('should throw on duplicate id', () => {
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')

      kernel.draggable(el1, { id: 'duplicate' })

      expect(() => {
        kernel.draggable(el2, { id: 'duplicate' })
      }).toThrow()
    })
  })

  describe('draggable instance methods', () => {
    let element: HTMLElement
    let instance: DraggableInstance

    beforeEach(() => {
      element = document.createElement('div')
      document.body.appendChild(element)
      instance = kernel.draggable(element, { id: 'instance-test' })
    })

    it('should check if dragging', () => {
      expect(instance.isDragging()).toBe(false)
    })

    it('should check if disabled', () => {
      expect(instance.isDisabled()).toBe(false)

      instance.disable()
      expect(instance.isDisabled()).toBe(true)

      instance.enable()
      expect(instance.isDisabled()).toBe(false)
    })

    it('should get position', () => {
      const position = instance.getPosition()

      expect(position).toHaveProperty('x')
      expect(position).toHaveProperty('y')
    })

    it('should get transform', () => {
      const transform = instance.getTransform()

      // Initially null
      expect(transform).toBeNull()
    })

    it('should clean up on destroy', () => {
      instance.destroy()

      expect(element.getAttribute('data-draggable-id')).toBeNull()
      expect(kernel.getDraggable('instance-test')).toBeUndefined()
    })
  })

  describe('draggable options', () => {
    it('should respect disabled option', () => {
      const element = document.createElement('div')

      const instance = kernel.draggable(element, {
        id: 'disabled-drag',
        disabled: true
      })

      expect(instance.isDisabled()).toBe(true)
    })

    it('should add drag class if specified', () => {
      const element = document.createElement('div')

      kernel.draggable(element, {
        id: 'class-drag',
        dragClass: 'custom-drag-class'
      })

      expect(element.classList.contains('custom-drag-class')).toBe(true)
    })
  })

  describe('transform management', () => {
    let element: HTMLElement
    let instance: DraggableInstance

    beforeEach(() => {
      element = document.createElement('div')
      document.body.appendChild(element)
      instance = kernel.draggable(element, { id: 'transform-test' })
    })

    it('should set transform', () => {
      instance.setTransform({ x: 100, y: 200 })

      expect(instance.getTransform()).toEqual({ x: 100, y: 200 })
      expect(element.style.transform).toBe('translate3d(100px, 200px, 0)')
    })

    it('should reset transform', () => {
      instance.setTransform({ x: 50, y: 75 })
      instance.resetTransform()

      expect(instance.getTransform()).toBeNull()
      expect(element.style.transform).toBe('')
    })
  })

  describe('manager methods', () => {
    it('should get draggable by element', () => {
      const element = document.createElement('div')
      const instance = kernel.draggable(element, { id: 'by-element' })

      const found = kernel.getDraggables().get('by-element')
      expect(found).toBe(instance)
    })

    it('should get draggable by element using getByElement-like method', () => {
      const element = document.createElement('div')
      const instance = kernel.draggable(element, { id: 'by-element-direct' })

      // Get by element attribute
      const id = element.getAttribute('data-draggable-id')
      expect(id).toBe('by-element-direct')
      expect(kernel.getDraggable(id!)).toBe(instance)
    })

    it('should return undefined for element without draggable id', () => {
      const element = document.createElement('div')
      const id = element.getAttribute('data-draggable-id')
      expect(id).toBeNull()
    })

    it('should unregister via destroy', () => {
      const element = document.createElement('div')
      const instance = kernel.draggable(element, { id: 'to-destroy' })

      instance.destroy()

      expect(kernel.getDraggable('to-destroy')).toBeUndefined()
    })

    it('should handle unregister of non-existent draggable gracefully', () => {
      // This should not throw
      expect(kernel.getDraggable('non-existent')).toBeUndefined()
    })

    it('should remove drag class on destroy', () => {
      const element = document.createElement('div')

      const instance = kernel.draggable(element, {
        id: 'class-destroy',
        dragClass: 'my-drag-class'
      })

      expect(element.classList.contains('my-drag-class')).toBe(true)

      instance.destroy()

      expect(element.classList.contains('my-drag-class')).toBe(false)
    })

    it('should clear active when destroying active draggable', () => {
      const element = document.createElement('div')
      const instance = kernel.draggable(element, { id: 'active-destroy' })

      // Simulate drag start
      kernel.emit({
        type: 'drag:start',
        timestamp: Date.now(),
        originalEvent: null,
        draggable: instance,
        position: { x: 0, y: 0 }
      })

      expect(kernel.getActiveDraggable()).toBe(instance)

      instance.destroy()

      expect(kernel.getActiveDraggable()).toBeNull()
    })
  })

  describe('drag events', () => {
    it('should set active on drag:start', () => {
      const element = document.createElement('div')
      const instance = kernel.draggable(element, { id: 'start-event' })

      kernel.emit({
        type: 'drag:start',
        timestamp: Date.now(),
        originalEvent: null,
        draggable: instance,
        position: { x: 0, y: 0 }
      })

      expect(kernel.getActiveDraggable()).toBe(instance)
      expect(kernel.isDragging()).toBe(true)
    })

    it('should clear active on drag:end', () => {
      const element = document.createElement('div')
      const instance = kernel.draggable(element, { id: 'end-event' })

      kernel.emit({
        type: 'drag:start',
        timestamp: Date.now(),
        originalEvent: null,
        draggable: instance,
        position: { x: 0, y: 0 }
      })

      kernel.emit({
        type: 'drag:end',
        timestamp: Date.now(),
        originalEvent: null,
        draggable: instance,
        droppable: null,
        position: { x: 100, y: 100 },
        dropped: false
      })

      expect(kernel.getActiveDraggable()).toBeNull()
      expect(kernel.isDragging()).toBe(false)
    })

    it('should clear active on drag:cancel', () => {
      const element = document.createElement('div')
      const instance = kernel.draggable(element, { id: 'cancel-event' })

      kernel.emit({
        type: 'drag:start',
        timestamp: Date.now(),
        originalEvent: null,
        draggable: instance,
        position: { x: 0, y: 0 }
      })

      kernel.emit({
        type: 'drag:cancel',
        timestamp: Date.now(),
        originalEvent: null,
        draggable: instance,
        position: { x: 50, y: 50 }
      })

      expect(kernel.getActiveDraggable()).toBeNull()
    })
  })

  describe('draggable getAll', () => {
    it('should return all registered draggables', () => {
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')
      const el3 = document.createElement('div')

      kernel.draggable(el1, { id: 'drag-1' })
      kernel.draggable(el2, { id: 'drag-2' })
      kernel.draggable(el3, { id: 'drag-3' })

      const all = kernel.getDraggables()

      expect(all.size).toBe(3)
      expect(all.has('drag-1')).toBe(true)
      expect(all.has('drag-2')).toBe(true)
      expect(all.has('drag-3')).toBe(true)
    })

    it('should return a copy of draggables map', () => {
      const el = document.createElement('div')
      kernel.draggable(el, { id: 'original' })

      const all1 = kernel.getDraggables()
      const all2 = kernel.getDraggables()

      // Should be different map instances
      expect(all1).not.toBe(all2)
      // But contain the same data
      expect(all1.size).toBe(all2.size)
    })
  })

  describe('draggable instance getId and getElement', () => {
    it('should return id via getId()', () => {
      const element = document.createElement('div')
      const instance = kernel.draggable(element, { id: 'get-id-test' })

      expect(instance.getId()).toBe('get-id-test')
    })

    it('should return element via getElement()', () => {
      const element = document.createElement('div')
      const instance = kernel.draggable(element, { id: 'get-element-test' })

      expect(instance.getElement()).toBe(element)
    })
  })

  describe('dragging state with no active', () => {
    it('should return false for isDragging when no active draggable', () => {
      expect(kernel.isDragging()).toBe(false)
      expect(kernel.getActiveDraggable()).toBeNull()
    })
  })
})
