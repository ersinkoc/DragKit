import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'

export function DocsLayout() {
  return (
    <div className="container flex-1">
      <div className="flex gap-12">
        <Sidebar className="hidden md:block" />
        <main className="flex-1 py-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
