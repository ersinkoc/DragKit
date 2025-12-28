import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TerminalWindow } from '@/components/code/TerminalWindow'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { Check, Copy } from 'lucide-react'
import { NPM_PACKAGE } from '@/lib/constants'

const installCommands = [
  { name: 'npm', command: `npm install ${NPM_PACKAGE}` },
  { name: 'yarn', command: `yarn add ${NPM_PACKAGE}` },
  { name: 'pnpm', command: `pnpm add ${NPM_PACKAGE}` },
  { name: 'bun', command: `bun add ${NPM_PACKAGE}` },
]

export function InstallCommand() {
  const { copied, copy } = useCopyToClipboard()

  return (
    <section className="py-24 px-4 bg-secondary/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started in Seconds
          </h2>
          <p className="text-lg text-muted-foreground">
            Install with your favorite package manager
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="npm" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              {installCommands.map((cmd) => (
                <TabsTrigger key={cmd.name} value={cmd.name}>
                  {cmd.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {installCommands.map((cmd) => (
              <TabsContent key={cmd.name} value={cmd.name}>
                <TerminalWindow>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">$</span>
                      <span>{cmd.command}</span>
                    </div>
                    <button
                      onClick={() => copy(cmd.command)}
                      className="flex items-center gap-1.5 px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200 rounded transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </TerminalWindow>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
