# ad-face-tracker

Simple React + Vite demo that shows face images and gaze/face tracking.

Summary:

- Uses a small React component and a hook to swap/track face images (see `hooks/useGazeTracking.js`).
- Faces are stored under `public/faces/` or 'public/video'.

Quick start:

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`

Credits:

Based on and inspired by https://github.com/wesbos/eye-ballz and https://github.com/kylan02/face_looker.

More in this amazing [Youtube video](https://youtu.be/sPdRCYbO6so?si=MFNsdErHpJOcuffC) by [Wes Bos](https://github.com/wesbos)

### Basic Usage FaceTracker component

```jsx
import FaceTracker from './components/FaceTracker';

function App() {
  return (
    <div className="App">
      <h1>My Portfolio</h1>

      {/* Basic usage */}
      <FaceTracker />

      {/* With custom styling */}
      <FaceTracker className="my-custom-class" basePath="/faces/" />
    </div>
  );
}
```

### Advanced Usage

```jsx
import FaceTracker from './components/FaceTracker';

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
        <FaceTracker
          basePath="/faces/"
          showDebug={process.env.NODE_ENV === 'development'}
        />
      </div>
    </header>
  );
}
```

### Using the Hook Directly

For more control, use the `useGazeTracking` hook directly:

```jsx
import { useRef, useEffect } from 'react';
import { useGazeTracking } from './hooks/useGazeTracking';

function CustomFaceComponent() {
  const containerRef = useRef(null);
  const { currentImage, isLoading, error } = useGazeTracking(
    containerRef,
    '/faces/'
  );

  return (
    <div
      ref={containerRef}
      style={{ width: '400px', height: '400px', position: 'relative' }}
    >
      {currentImage && (
        <img
          src={currentImage}
          alt="Following face"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%', // Make it circular!
          }}
        />
      )}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Configuration

If you change the generation parameters, update these constants in `useGazeTracking.js`:

```javascript
// Must match your generation parameters!
const P_MIN = -15; // Same as --min
const P_MAX = 15; // Same as --max
const STEP = 3; // Same as --step
const SIZE = 256; // Same as --size
```

## 🎛️ Customization

### Changing Image Directory

```jsx
<FaceTracker basePath="/assets/my-face/" />
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
