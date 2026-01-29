# ad-face-tracker

Simple React + Vite demo that shows face images and gaze/face tracking.

Summary:

- Uses a small React component to swap/track face images (see `hooks/GazeTracker`).
- Faces are stored under `public/faces/` or `public/video`.

Quick start:

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`

Credits:

Based on and inspired by https://github.com/wesbos/eye-ballz and https://github.com/kylan02/face_looker.

More in this amazing [Youtube video](https://youtu.be/sPdRCYbO6so?si=MFNsdErHpJOcuffC) by [Wes Bos](https://github.com/wesbos)

### Basic Usage (GazeTracker component)

```jsx
import GazeTracker from './hooks/GazeTracker';

function App() {
  return (
    <div className="App">
      <h1>My Portfolio</h1>

      {/* Basic usage */}
      <GazeTracker />

      {/* With custom styling */}
      <GazeTracker className="my-custom-class" basePath="/faces/" />
    </div>
  );
}
```

### Advanced Usage

```jsx
import GazeTracker from './hooks/GazeTracker';

function Header() {
  return (
    <header
      style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '300px', height: '300px' }}>
        <GazeTracker
          basePath="/faces/"
          showDebug={process.env.NODE_ENV === 'development'}
        />
      </div>
    </header>
  );
}
```

### Configuration

If you change generation/gaze parameters, update the corresponding constants in `hooks/GazeTracker.js` (if present) so paths and generation params remain in sync.

## 🎛️ Customization

### Changing Image Directory

```jsx
<GazeTracker basePath="/assets/my-face/" />
```

### Adding Custom Styling

```css
/* FaceTracker.css */
.face-tracker {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 50%; /* Circular face */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.face-image {
  user-select: none;
  pointer-events: none;
}

.face-debug {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
}
```
