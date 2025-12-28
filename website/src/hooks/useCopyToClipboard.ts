import { useState, useCallback } from 'react'

interface CopyToClipboardResult {
  copied: boolean
  copy: (text: string) => Promise<void>
  reset: () => void
}

export function useCopyToClipboard(timeout = 2000): CopyToClipboardResult {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), timeout)
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        setCopied(false)
      }
    },
    [timeout]
  )

  const reset = useCallback(() => {
    setCopied(false)
  }, [])

  return { copied, copy, reset }
}
