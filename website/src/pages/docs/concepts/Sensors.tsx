import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function Sensors() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Sensors</h1>
          <p className="text-xl text-muted-foreground">
            Sensors detect and handle different input methods for drag and drop interactions.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">What Are Sensors?</h2>
          <p className="text-muted-foreground">
            Sensors are responsible for detecting user input (mouse, touch, keyboard) and translating it into
            drag events. DragKit's sensor system is modular, allowing you to enable only the input methods you need.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Built-in Sensors</h2>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Mouse Sensor</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Handles mouse interactions for desktop devices. Listens to mousedown, mousemove, and mouseup events.
              </p>
              <IDEWindow fileName="mouse-sensor.ts">
                <CodeBlock language="typescript">{`const kit = createDragKit({
  sensors: {
    mouse: true, // Enable mouse sensor
  },
})`}</CodeBlock>
              </IDEWindow>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Touch Sensor</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Handles touch interactions for mobile and tablet devices. Listens to touchstart, touchmove, and touchend events.
              </p>
              <IDEWindow fileName="touch-sensor.ts">
                <CodeBlock language="typescript">{`const kit = createDragKit({
  sensors: {
    touch: true, // Enable touch sensor
  },
})`}</CodeBlock>
              </IDEWindow>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Keyboard Sensor</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Enables keyboard-only dragging for accessibility. Users can select items with Space and move them with arrow keys.
              </p>
              <IDEWindow fileName="keyboard-sensor.ts">
                <CodeBlock language="typescript">{`const kit = createDragKit({
  sensors: {
    keyboard: true, // Enable keyboard sensor
  },
})`}</CodeBlock>
              </IDEWindow>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Sensor Configuration</h2>
          <p className="text-muted-foreground">
            Enable or disable sensors based on your needs:
          </p>
          <IDEWindow fileName="sensor-config.ts">
            <CodeBlock language="typescript">{`// Desktop-only (mouse + keyboard)
const desktopKit = createDragKit({
  sensors: {
    mouse: true,
    touch: false,
    keyboard: true,
  },
})

// Mobile-only (touch)
const mobileKit = createDragKit({
  sensors: {
    mouse: false,
    touch: true,
    keyboard: false,
  },
})

// All inputs (default)
const kit = createDragKit({
  sensors: {
    mouse: true,
    touch: true,
    keyboard: true,
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">How Sensors Work</h2>
          <div className="bg-muted p-6 rounded-lg font-mono text-sm">
            <pre>{`1. User initiates drag (mousedown/touchstart/keypress)
   ↓
2. Sensor detects the interaction
   ↓
3. Sensor identifies the draggable element
   ↓
4. Sensor emits 'sensor:start' event
   ↓
5. Kernel receives event and starts drag
   ↓
6. During drag, sensor emits 'sensor:move'
   ↓
7. Kernel updates drag position
   ↓
8. User releases (mouseup/touchend/keyup)
   ↓
9. Sensor emits 'sensor:end'
   ↓
10. Kernel ends drag or drops element`}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Mouse Sensor Details</h2>
          <p className="text-muted-foreground">
            The mouse sensor handles click-and-drag interactions:
          </p>
          <IDEWindow fileName="mouse-details.ts">
            <CodeBlock language="typescript">{`// Features:
// - Left-click drag (right-click ignored)
// - Activation delay (prevents accidental drags)
// - Distance threshold (must move 5px to start drag)
// - Cancel on ESC key

// Events emitted:
// - sensor:start (mousedown + moved 5px)
// - sensor:move (mousemove while dragging)
// - sensor:end (mouseup)
// - sensor:cancel (ESC key pressed)`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Touch Sensor Details</h2>
          <p className="text-muted-foreground">
            The touch sensor enables mobile drag and drop:
          </p>
          <IDEWindow fileName="touch-details.ts">
            <CodeBlock language="typescript">{`// Features:
// - Single-finger drag (multi-touch ignored)
// - Long-press activation (prevents scroll conflicts)
// - Touch feedback
// - Cancel on second finger

// Events emitted:
// - sensor:start (touchstart + 200ms hold)
// - sensor:move (touchmove)
// - sensor:end (touchend)
// - sensor:cancel (second touch detected)`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Keyboard Sensor Details</h2>
          <p className="text-muted-foreground">
            The keyboard sensor provides accessible drag and drop:
          </p>
          <IDEWindow fileName="keyboard-details.ts">
            <CodeBlock language="typescript">{`// Keyboard shortcuts:
// - Tab: Navigate between draggables
// - Space: Pick up / Drop item
// - Arrow keys: Move dragged item
// - ESC: Cancel drag

// Features:
// - Screen reader announcements
// - Visual focus indicators
// - Drop zone highlighting

// Events emitted:
// - sensor:start (Space key while focused)
// - sensor:move (Arrow keys)
// - sensor:end (Space key to drop)
// - sensor:cancel (ESC key)`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Creating Custom Sensors</h2>
          <p className="text-muted-foreground">
            You can create custom sensors for specialized input methods:
          </p>
          <IDEWindow fileName="custom-sensor.ts">
            <CodeBlock language="typescript">{`import { Sensor, DragKit } from '@oxog/dragkit'

class GamepadSensor implements Sensor {
  name = 'gamepad'
  private kit: DragKit
  private rafId: number = 0

  attach(kit: DragKit) {
    this.kit = kit
    this.startPolling()
  }

  detach() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
  }

  private startPolling() {
    const poll = () => {
      const gamepads = navigator.getGamepads()
      const gamepad = gamepads[0]

      if (gamepad) {
        // Check button press
        if (gamepad.buttons[0].pressed) {
          this.kit.emit('sensor:start', {
            sensorType: 'gamepad',
            position: { x: 0, y: 0 },
          })
        }

        // Check joystick movement
        const x = gamepad.axes[0]
        const y = gamepad.axes[1]

        if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
          this.kit.emit('sensor:move', {
            delta: { x: x * 10, y: y * 10 },
          })
        }
      }

      this.rafId = requestAnimationFrame(poll)
    }

    poll()
  }
}

// Usage
const kit = createDragKit()
kit.use({
  name: 'gamepad-sensor',
  install(kit) {
    const sensor = new GamepadSensor()
    sensor.attach(kit)
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Sensor Events</h2>
          <p className="text-muted-foreground">
            Listen to sensor-level events for debugging or custom behavior:
          </p>
          <IDEWindow fileName="sensor-events.ts">
            <CodeBlock language="typescript">{`kit.on('sensor:start', (event) => {
  console.log('Sensor activated:', event.sensorType)
})

kit.on('sensor:move', (event) => {
  console.log('Sensor movement:', event.position)
})

kit.on('sensor:end', (event) => {
  console.log('Sensor deactivated')
})

kit.on('sensor:cancel', (event) => {
  console.log('Sensor cancelled:', event.reason)
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Enable All Sensors by Default</h3>
              <p className="text-sm text-muted-foreground">
                Unless you have a specific reason, enable mouse, touch, and keyboard sensors for maximum accessibility.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Test on Real Devices</h3>
              <p className="text-sm text-muted-foreground">
                Touch sensors behave differently across devices. Test on actual phones and tablets.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Provide Visual Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Show users when elements are draggable and provide feedback during interactions.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Don't Mix Native and Custom Drag</h3>
              <p className="text-sm text-muted-foreground">
                If using DragKit, disable native HTML5 drag and drop to avoid conflicts.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/concepts/events" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Event System
          </Link>
          <Link to="/docs/concepts/collision" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Collision Detection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
