import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { examplesNav } from '@/lib/docs-config'
import { ArrowRight } from 'lucide-react'

export default function Examples() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Examples
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore live examples and learn how to build common drag & drop patterns
            </p>
          </div>

          {examplesNav.map((section) => (
            <div key={section.title} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.items?.filter(ex => ex.href).map((example) => (
                  <Card
                    key={example.href}
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => example.href && (window.location.href = example.href)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {example.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {example.description}
                          </CardDescription>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-16 p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border">
            <h3 className="text-2xl font-bold mb-4">Try it yourself</h3>
            <p className="text-muted-foreground mb-6">
              Want to experiment with DragKit? Head to the playground to try it live in your browser with a full code editor.
            </p>
            <Link
              to="/playground"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Open Playground
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
