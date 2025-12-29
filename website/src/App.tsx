import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { Home } from '@/pages/Home'
import { Examples } from '@/pages/Examples'
import { Playground } from '@/pages/Playground'
import { DocsLayout } from '@/pages/docs/DocsLayout'
import { GettingStarted } from '@/pages/docs/GettingStarted'

function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setMobileNavOpen(true)} />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      {children}
      <Footer />
    </div>
  )
}

function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setMobileNavOpen(true)} />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      {children}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />

          {/* Examples */}
          <Route
            path="/examples"
            element={
              <AppLayout>
                <Examples />
              </AppLayout>
            }
          />
          <Route
            path="/examples/:id"
            element={
              <AppLayout>
                <Examples />
              </AppLayout>
            }
          />

          {/* Playground - no footer */}
          <Route
            path="/playground"
            element={
              <PlaygroundLayout>
                <Playground />
              </PlaygroundLayout>
            }
          />

          {/* Docs */}
          <Route
            path="/docs"
            element={
              <AppLayout>
                <DocsLayout />
              </AppLayout>
            }
          >
            <Route index element={<GettingStarted />} />
            <Route path="*" element={<GettingStarted />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
