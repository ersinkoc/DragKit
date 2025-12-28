export interface NavItem {
  title: string
  href?: string
  description?: string
  items?: NavItem[]
  external?: boolean
}

export interface DocsConfig {
  mainNav: NavItem[]
  sidebarNav: NavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: 'Documentation',
      href: '/docs',
    },
    {
      title: 'API Reference',
      href: '/docs/api',
    },
    {
      title: 'Examples',
      href: '/examples',
    },
    {
      title: 'Playground',
      href: '/playground',
    },
    {
      title: 'GitHub',
      href: 'https://github.com/ersinkoc/dragkit',
      external: true,
    },
  ],
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
          description: 'What is DragKit and why use it',
        },
        {
          title: 'Installation',
          href: '/docs/installation',
          description: 'How to install DragKit',
        },
        {
          title: 'Quick Start',
          href: '/docs/quick-start',
          description: 'Get started in 5 minutes',
        },
      ],
    },
    {
      title: 'Core Concepts',
      items: [
        {
          title: 'Architecture',
          href: '/docs/concepts/architecture',
          description: 'Micro-kernel architecture explained',
        },
        {
          title: 'Plugins',
          href: '/docs/concepts/plugins',
          description: 'Plugin system overview',
        },
        {
          title: 'Event System',
          href: '/docs/concepts/events',
          description: 'Event bus and pub/sub',
        },
        {
          title: 'Sensors',
          href: '/docs/concepts/sensors',
          description: 'Input handling with sensors',
        },
        {
          title: 'Collision Detection',
          href: '/docs/concepts/collision',
          description: 'Collision algorithms',
        },
      ],
    },
    {
      title: 'API Reference',
      items: [
        {
          title: 'createDragKit',
          href: '/docs/api/create-dragkit',
          description: 'Initialize DragKit',
        },
        {
          title: 'Draggable',
          href: '/docs/api/draggable',
          description: 'Make elements draggable',
        },
        {
          title: 'Droppable',
          href: '/docs/api/droppable',
          description: 'Create drop zones',
        },
        {
          title: 'Sortable',
          href: '/docs/api/sortable',
          description: 'Sortable lists',
        },
        {
          title: 'Sortable Grid',
          href: '/docs/api/sortable-grid',
          description: 'Sortable grids',
        },
        {
          title: 'Events',
          href: '/docs/api/events',
          description: 'Event types and handlers',
        },
        {
          title: 'Types',
          href: '/docs/api/types',
          description: 'TypeScript definitions',
        },
      ],
    },
    {
      title: 'Plugins',
      items: [
        {
          title: 'Core Plugins',
          href: '/docs/plugins/core',
          description: 'Built-in plugins',
        },
        {
          title: 'Optional Plugins',
          href: '/docs/plugins/optional',
          description: 'Additional features',
        },
        {
          title: 'Creating Plugins',
          href: '/docs/plugins/creating',
          description: 'Build your own plugins',
        },
      ],
    },
    {
      title: 'Guides',
      items: [
        {
          title: 'Drag & Drop',
          href: '/docs/guides/drag-and-drop',
          description: 'Basic drag and drop',
        },
        {
          title: 'Sortable Lists',
          href: '/docs/guides/sortable-lists',
          description: 'Reorderable lists',
        },
        {
          title: 'Grid Layouts',
          href: '/docs/guides/grid-layouts',
          description: 'Sortable grids',
        },
        {
          title: 'Custom Animations',
          href: '/docs/guides/animations',
          description: 'Add smooth animations',
        },
        {
          title: 'Accessibility',
          href: '/docs/guides/accessibility',
          description: 'Keyboard and screen readers',
        },
        {
          title: 'Touch Devices',
          href: '/docs/guides/touch',
          description: 'Mobile and tablet support',
        },
      ],
    },
    {
      title: 'Framework Integration',
      items: [
        {
          title: 'React',
          href: '/docs/frameworks/react',
          description: 'Use with React',
        },
        {
          title: 'Vue',
          href: '/docs/frameworks/vue',
          description: 'Use with Vue',
        },
        {
          title: 'Svelte',
          href: '/docs/frameworks/svelte',
          description: 'Use with Svelte',
        },
      ],
    },
  ],
}

export const examplesNav: NavItem[] = [
  {
    title: 'Basic',
    items: [
      {
        title: 'Simple Drag & Drop',
        href: '/examples/simple-drag-drop',
        description: 'Basic draggable and droppable',
      },
      {
        title: 'Sortable List',
        href: '/examples/sortable-list',
        description: 'Vertical sortable list',
      },
      {
        title: 'Horizontal List',
        href: '/examples/horizontal-list',
        description: 'Horizontal sortable list',
      },
    ],
  },
  {
    title: 'Advanced',
    items: [
      {
        title: 'Multiple Lists',
        href: '/examples/multiple-lists',
        description: 'Drag between lists',
      },
      {
        title: 'Grid Layout',
        href: '/examples/grid-layout',
        description: 'Sortable grid',
      },
      {
        title: 'Nested Lists',
        href: '/examples/nested-lists',
        description: 'Tree structure',
      },
      {
        title: 'Kanban Board',
        href: '/examples/kanban',
        description: 'Project management board',
      },
    ],
  },
  {
    title: 'Customization',
    items: [
      {
        title: 'Custom Animations',
        href: '/examples/animations',
        description: 'Smooth transitions',
      },
      {
        title: 'Custom Preview',
        href: '/examples/custom-preview',
        description: 'Drag preview styling',
      },
      {
        title: 'Constraints',
        href: '/examples/constraints',
        description: 'Axis lock and bounds',
      },
    ],
  },
]
