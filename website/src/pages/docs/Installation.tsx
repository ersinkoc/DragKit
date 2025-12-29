import { CodeBlock } from '@/components/code/CodeBlock'
import { TerminalWindow } from '@/components/code/TerminalWindow'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const npmInstall = 'npm install @oxog/dragkit'
const yarnInstall = 'yarn add @oxog/dragkit'
const pnpmInstall = 'pnpm add @oxog/dragkit'
const bunInstall = 'bun add @oxog/dragkit'

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}`

export function Installation() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Installation</h1>
      <p className="lead">
        Get started with DragKit in your project. DragKit supports React, Vue, and Svelte.
      </p>

      <h2>Package Installation</h2>
      <p>Install DragKit using your preferred package manager:</p>

      <Tabs defaultValue="npm" className="not-prose">
        <TabsList>
          <TabsTrigger value="npm">npm</TabsTrigger>
          <TabsTrigger value="yarn">yarn</TabsTrigger>
          <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          <TabsTrigger value="bun">bun</TabsTrigger>
        </TabsList>
        <TabsContent value="npm">
          <TerminalWindow command={npmInstall} />
        </TabsContent>
        <TabsContent value="yarn">
          <TerminalWindow command={yarnInstall} />
        </TabsContent>
        <TabsContent value="pnpm">
          <TerminalWindow command={pnpmInstall} />
        </TabsContent>
        <TabsContent value="bun">
          <TerminalWindow command={bunInstall} />
        </TabsContent>
      </Tabs>

      <h2>Requirements</h2>
      <ul>
        <li><strong>React</strong>: 18.0 or higher</li>
        <li><strong>Vue</strong>: 3.3 or higher</li>
        <li><strong>Svelte</strong>: 4.0 or higher</li>
        <li><strong>TypeScript</strong>: 5.0 or higher (optional but recommended)</li>
      </ul>

      <h2>TypeScript Configuration</h2>
      <p>
        DragKit is written in TypeScript and includes full type definitions.
        Here's a recommended tsconfig.json setup:
      </p>

      <CodeBlock
        code={tsconfig}
        language="json"
        filename="tsconfig.json"
        showLineNumbers
      />

      <h2>Bundle Size</h2>
      <p>
        DragKit is designed to be lightweight. Each adapter is tree-shakeable,
        so you only bundle what you use:
      </p>

      <div className="not-prose my-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-2xl font-bold">~5KB</div>
            <div className="text-sm text-muted-foreground">Core (gzipped)</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-2xl font-bold">~8KB</div>
            <div className="text-sm text-muted-foreground">React Adapter</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-2xl font-bold">~6KB</div>
            <div className="text-sm text-muted-foreground">Vue Adapter</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-2xl font-bold">~6KB</div>
            <div className="text-sm text-muted-foreground">Svelte Adapter</div>
          </div>
        </div>
      </div>

      <h2>Next Steps</h2>
      <p>
        Now that you have DragKit installed, check out the Quick Start guide
        to learn how to implement your first drag and drop interface.
      </p>
    </article>
  )
}
