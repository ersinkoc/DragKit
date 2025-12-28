import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/code/CodeBlock'
import { TerminalWindow } from '@/components/code/TerminalWindow'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function Installation() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Installation</h1>
          <p className="text-xl text-muted-foreground">
            Install DragKit using your favorite package manager
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Package Manager</h2>
            <Tabs defaultValue="npm">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                <TabsTrigger value="bun">bun</TabsTrigger>
              </TabsList>
              <TabsContent value="npm">
                <TerminalWindow>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <span>npm install @oxog/dragkit</span>
                  </div>
                </TerminalWindow>
              </TabsContent>
              <TabsContent value="yarn">
                <TerminalWindow>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <span>yarn add @oxog/dragkit</span>
                  </div>
                </TerminalWindow>
              </TabsContent>
              <TabsContent value="pnpm">
                <TerminalWindow>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <span>pnpm add @oxog/dragkit</span>
                  </div>
                </TerminalWindow>
              </TabsContent>
              <TabsContent value="bun">
                <TerminalWindow>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <span>bun add @oxog/dragkit</span>
                  </div>
                </TerminalWindow>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">CDN (Browser)</h2>
            <p className="text-muted-foreground mb-4">
              You can also use DragKit directly in the browser via CDN:
            </p>
            <CodeBlock
              filename="index.html"
              language="html"
              code={`<!-- ESM -->
<script type="module">
  import { createDragKit } from 'https://esm.sh/@oxog/dragkit'

  const kit = await createDragKit()
  // Use DragKit...
</script>

<!-- Or use unpkg -->
<script type="module">
  import { createDragKit } from 'https://unpkg.com/@oxog/dragkit/dist/index.js'
</script>`}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Verify Installation</h2>
            <p className="text-muted-foreground mb-4">
              Create a simple test file to verify the installation:
            </p>
            <CodeBlock
              filename="test.js"
              language="javascript"
              code={`import { createDragKit } from '@oxog/dragkit'

async function test() {
  const kit = await createDragKit()
  console.log('DragKit initialized:', kit)
  console.log('Version:', kit.version)
}

test()`}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">TypeScript Setup</h2>
            <p className="text-muted-foreground mb-4">
              DragKit is built with TypeScript and includes type definitions. No additional @types packages needed!
            </p>
            <CodeBlock
              filename="tsconfig.json"
              language="json"
              code={`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  }
}`}
            />
          </div>

          <div className="p-6 bg-secondary rounded-lg">
            <h3 className="font-semibold mb-2">📝 Note</h3>
            <p className="text-sm text-muted-foreground">
              DragKit requires a modern browser environment with ES2020 support. For older browsers, you may need to include polyfills.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <div>
              <p className="text-sm">Previous</p>
              <p className="font-semibold">Introduction</p>
            </div>
          </Link>
          <Link to="/docs/quick-start" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <div className="text-right">
              <p className="text-sm">Next</p>
              <p className="font-semibold">Quick Start</p>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
