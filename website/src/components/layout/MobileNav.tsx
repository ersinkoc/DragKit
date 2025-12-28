import React from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Examples', href: '/examples' },
    { name: 'Playground', href: '/playground' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/80 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 w-[80%] max-w-sm border-l bg-background transition-transform md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-5rem)]">
          <nav className="flex flex-col gap-2 p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className="block py-3 px-4 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}
