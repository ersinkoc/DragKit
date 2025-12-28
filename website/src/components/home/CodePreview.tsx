import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { IDEWindow } from '@/components/code/IDEWindow'
import { BrowserWindow } from '@/components/code/BrowserWindow'

const reactExample = `import { useDraggable } from 'dragkit/react'

function DraggableCard() {
  const { ref, isDragging } = useDraggable({
    id: 'card-1',
    data: { title: 'Hello DragKit' }
  })

  return (
    <div
      ref={ref}
      className={isDragging ? 'opacity-50' : ''}
    >
      <h3>Drag me!</h3>
      <p>I'm a draggable card</p>
    </div>
  )
}`

const vueExample = `<script setup>
import { useDraggable } from 'dragkit/vue'

const { ref, isDragging } = useDraggable({
  id: 'card-1',
  data: { title: 'Hello DragKit' }
})
</script>

<template>
  <div
    :ref="ref"
    :class="{ 'opacity-50': isDragging }"
  >
    <h3>Drag me!</h3>
    <p>I'm a draggable card</p>
  </div>
</template>`

const vanillaExample = `import { DragKit } from 'dragkit'

const dragkit = new DragKit()

const element = document.getElementById('card')

dragkit.draggable(element, {
  id: 'card-1',
  data: { title: 'Hello DragKit' },
  onDragStart: () => {
    element.classList.add('opacity-50')
  },
  onDragEnd: () => {
    element.classList.remove('opacity-50')
  }
})`

export function CodePreview() {
  const [framework, setFramework] = useState('react')

  return (
    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, intuitive API
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with just a few lines of code. Works with React, Vue, or vanilla JavaScript.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Tabs value={framework} onValueChange={setFramework}>
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="vue">Vue</TabsTrigger>
                <TabsTrigger value="vanilla">Vanilla JS</TabsTrigger>
              </TabsList>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <TabsContent value="react" className="mt-0">
                  <IDEWindow
                    code={reactExample}
                    language="tsx"
                    filename="DraggableCard.tsx"
                  />
                </TabsContent>
                <TabsContent value="vue" className="mt-0">
                  <IDEWindow
                    code={vueExample}
                    language="typescript"
                    filename="DraggableCard.vue"
                  />
                </TabsContent>
                <TabsContent value="vanilla" className="mt-0">
                  <IDEWindow
                    code={vanillaExample}
                    language="javascript"
                    filename="main.js"
                  />
                </TabsContent>
              </div>

              <div>
                <BrowserWindow>
                  <div className="p-12 min-h-[400px] flex items-center justify-center">
                    <motion.div
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      whileDrag={{ scale: 1.05, opacity: 0.8 }}
                      className="cursor-move rounded-lg border bg-card p-8 shadow-lg max-w-xs"
                    >
                      <h3 className="text-xl font-semibold mb-2">Drag me!</h3>
                      <p className="text-muted-foreground">
                        I'm a draggable card
                      </p>
                    </motion.div>
                  </div>
                </BrowserWindow>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
