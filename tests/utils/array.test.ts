/**
 * Array Utilities Tests
 */
import { describe, it, expect } from 'vitest'
import { arrayMove, arrayInsert, arrayRemove, arraySwap, arrayFindIndex } from '../../src/utils/array'

describe('Array Utilities', () => {
  describe('arrayMove', () => {
    it('should move item from one index to another', () => {
      const arr = ['a', 'b', 'c', 'd']
      const result = arrayMove(arr, 0, 2)
      expect(result).toEqual(['b', 'c', 'a', 'd'])
    })

    it('should move item to beginning', () => {
      const arr = ['a', 'b', 'c', 'd']
      const result = arrayMove(arr, 3, 0)
      expect(result).toEqual(['d', 'a', 'b', 'c'])
    })

    it('should move item to end', () => {
      const arr = ['a', 'b', 'c', 'd']
      const result = arrayMove(arr, 0, 3)
      expect(result).toEqual(['b', 'c', 'd', 'a'])
    })

    it('should not modify original array', () => {
      const arr = ['a', 'b', 'c']
      arrayMove(arr, 0, 2)
      expect(arr).toEqual(['a', 'b', 'c'])
    })

    it('should handle same index', () => {
      const arr = ['a', 'b', 'c']
      const result = arrayMove(arr, 1, 1)
      expect(result).toEqual(['a', 'b', 'c'])
    })

    it('should handle invalid fromIndex', () => {
      const arr = ['a', 'b', 'c']
      const result = arrayMove(arr, 10, 0)
      expect(result).toEqual(['a', 'b', 'c'])
    })

    it('should work with numbers', () => {
      const arr = [1, 2, 3, 4]
      const result = arrayMove(arr, 1, 3)
      expect(result).toEqual([1, 3, 4, 2])
    })

    it('should work with objects', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const result = arrayMove(arr, 0, 2)
      expect(result).toEqual([{ id: 2 }, { id: 3 }, { id: 1 }])
    })
  })

  describe('arrayInsert', () => {
    it('should insert item at index', () => {
      const arr = ['a', 'b', 'c']
      const result = arrayInsert(arr, 1, 'x')
      expect(result).toEqual(['a', 'x', 'b', 'c'])
    })

    it('should insert at beginning', () => {
      const arr = ['a', 'b', 'c']
      const result = arrayInsert(arr, 0, 'x')
      expect(result).toEqual(['x', 'a', 'b', 'c'])
    })

    it('should insert at end', () => {
      const arr = ['a', 'b', 'c']
      const result = arrayInsert(arr, 3, 'x')
      expect(result).toEqual(['a', 'b', 'c', 'x'])
    })

    it('should not modify original array', () => {
      const arr = ['a', 'b', 'c']
      arrayInsert(arr, 1, 'x')
      expect(arr).toEqual(['a', 'b', 'c'])
    })

    it('should work with empty array', () => {
      const arr: string[] = []
      const result = arrayInsert(arr, 0, 'x')
      expect(result).toEqual(['x'])
    })
  })

  describe('arrayRemove', () => {
    it('should remove item at index', () => {
      const arr = ['a', 'b', 'c', 'd']
      const result = arrayRemove(arr, 1)
      expect(result).toEqual(['a', 'c', 'd'])
    })

    it('should remove first item', () => {
      const arr = ['a', 'b', 'c']
      const result = arrayRemove(arr, 0)
      expect(result).toEqual(['b', 'c'])
    })

    it('should remove last item', () => {
      const arr = ['a', 'b', 'c']
      const result = arrayRemove(arr, 2)
      expect(result).toEqual(['a', 'b'])
    })

    it('should not modify original array', () => {
      const arr = ['a', 'b', 'c']
      arrayRemove(arr, 1)
      expect(arr).toEqual(['a', 'b', 'c'])
    })

    it('should handle single item array', () => {
      const arr = ['a']
      const result = arrayRemove(arr, 0)
      expect(result).toEqual([])
    })
  })

  describe('arraySwap', () => {
    it('should swap two items', () => {
      const arr = ['a', 'b', 'c', 'd']
      const result = arraySwap(arr, 0, 3)
      expect(result).toEqual(['d', 'b', 'c', 'a'])
    })

    it('should swap adjacent items', () => {
      const arr = ['a', 'b', 'c']
      const result = arraySwap(arr, 0, 1)
      expect(result).toEqual(['b', 'a', 'c'])
    })

    it('should not modify original array', () => {
      const arr = ['a', 'b', 'c']
      arraySwap(arr, 0, 2)
      expect(arr).toEqual(['a', 'b', 'c'])
    })

    it('should handle same index', () => {
      const arr = ['a', 'b', 'c']
      const result = arraySwap(arr, 1, 1)
      expect(result).toEqual(['a', 'b', 'c'])
    })

    it('should work with numbers', () => {
      const arr = [1, 2, 3]
      const result = arraySwap(arr, 0, 2)
      expect(result).toEqual([3, 2, 1])
    })
  })

  describe('arrayFindIndex', () => {
    it('should find index of matching item', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const result = arrayFindIndex(arr, item => item.id === 2)
      expect(result).toBe(1)
    })

    it('should return -1 if not found', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const result = arrayFindIndex(arr, item => item.id === 99)
      expect(result).toBe(-1)
    })

    it('should find first matching item', () => {
      const arr = [1, 2, 2, 3]
      const result = arrayFindIndex(arr, item => item === 2)
      expect(result).toBe(1)
    })

    it('should work with empty array', () => {
      const arr: number[] = []
      const result = arrayFindIndex(arr, item => item === 1)
      expect(result).toBe(-1)
    })

    it('should work with strings', () => {
      const arr = ['apple', 'banana', 'cherry']
      const result = arrayFindIndex(arr, item => item.startsWith('b'))
      expect(result).toBe(1)
    })
  })
})
