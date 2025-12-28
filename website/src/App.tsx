import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Examples from './pages/Examples'
import Playground from './pages/Playground'

// Docs
import DocsHome from './pages/docs/index'
import Installation from './pages/docs/Installation'
import QuickStart from './pages/docs/QuickStart'

// API Reference
import CreateDragKit from './pages/docs/api/CreateDragKit'
import Draggable from './pages/docs/api/Draggable'
import Droppable from './pages/docs/api/Droppable'
import Sortable from './pages/docs/api/Sortable'
import SortableGrid from './pages/docs/api/SortableGrid'
import Events from './pages/docs/api/Events'
import Types from './pages/docs/api/Types'

// Core Concepts
import Architecture from './pages/docs/concepts/Architecture'
import Plugins from './pages/docs/concepts/Plugins'
import EventSystem from './pages/docs/concepts/EventSystem'
import Sensors from './pages/docs/concepts/Sensors'
import Collision from './pages/docs/concepts/Collision'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/examples" element={<Examples />} />
      <Route path="/playground" element={<Playground />} />

      {/* Documentation */}
      <Route path="/docs" element={<DocsHome />} />
      <Route path="/docs/installation" element={<Installation />} />
      <Route path="/docs/quick-start" element={<QuickStart />} />

      {/* API Reference */}
      <Route path="/docs/api" element={<CreateDragKit />} />
      <Route path="/docs/api/create-dragkit" element={<CreateDragKit />} />
      <Route path="/docs/api/draggable" element={<Draggable />} />
      <Route path="/docs/api/droppable" element={<Droppable />} />
      <Route path="/docs/api/sortable" element={<Sortable />} />
      <Route path="/docs/api/sortable-grid" element={<SortableGrid />} />
      <Route path="/docs/api/events" element={<Events />} />
      <Route path="/docs/api/types" element={<Types />} />

      {/* Core Concepts */}
      <Route path="/docs/concepts/architecture" element={<Architecture />} />
      <Route path="/docs/concepts/plugins" element={<Plugins />} />
      <Route path="/docs/concepts/events" element={<EventSystem />} />
      <Route path="/docs/concepts/sensors" element={<Sensors />} />
      <Route path="/docs/concepts/collision" element={<Collision />} />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
