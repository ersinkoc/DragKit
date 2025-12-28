/**
 * Array Utilities
 * Zero-dependency array manipulation functions
 */

/**
 * Move an item from one index to another
 */
export function arrayMove<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array]
  const [item] = result.splice(fromIndex, 1)
  if (item !== undefined) {
    result.splice(toIndex, 0, item)
  }
  return result
}

/**
 * Insert an item at a specific index
 */
export function arrayInsert<T>(array: T[], index: number, item: T): T[] {
  const result = [...array]
  result.splice(index, 0, item)
  return result
}

/**
 * Remove an item at a specific index
 */
export function arrayRemove<T>(array: T[], index: number): T[] {
  const result = [...array]
  result.splice(index, 1)
  return result
}

/**
 * Swap two items in an array
 */
export function arraySwap<T>(array: T[], indexA: number, indexB: number): T[] {
  const result = [...array]
  const temp = result[indexA]
  result[indexA] = result[indexB] as T
  result[indexB] = temp as T
  return result
}

/**
 * Find the index of an item
 */
export function arrayFindIndex<T>(array: T[], predicate: (item: T) => boolean): number {
  return array.findIndex(predicate)
}
