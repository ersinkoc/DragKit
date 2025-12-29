import { motion } from 'framer-motion'
import {
  Zap,
  Shield,
  Accessibility,
  Layers,
  Smartphone,
  Code2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const features = [
  {
    icon: Zap,
    title: 'Lightweight & Fast',
    description:
      'Zero dependencies and tree-shakeable. Only bundle what you use for optimal performance.',
  },
  {
    icon: Shield,
    title: 'Type-Safe',
    description:
      'Built with TypeScript from the ground up. Full type inference and autocompletion support.',
  },
  {
    icon: Accessibility,
    title: 'Accessible',
    description:
      'WCAG compliant with full keyboard navigation and screen reader support out of the box.',
  },
  {
    icon: Layers,
    title: 'Flexible Architecture',
    description:
      'Modular design with hooks and components. Use what you need, customize the rest.',
  },
  {
    icon: Smartphone,
    title: 'Touch Support',
    description:
      'First-class touch device support with gesture recognition and smooth animations.',
  },
  {
    icon: Code2,
    title: 'Developer Experience',
    description:
      'Intuitive API design with comprehensive documentation and real-world examples.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function Features() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Built for Modern Development
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to build beautiful drag and drop interfaces
            with React.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
