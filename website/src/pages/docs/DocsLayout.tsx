import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'

export function DocsLayout() {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
      <Sidebar className="hidden md:block" />
      <main className="relative py-6 lg:gap-10 lg:py-8">
        <ScrollArea className="h-full">
          <div className="mx-auto w-full min-w-0 max-w-3xl">
            <Outlet />
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
