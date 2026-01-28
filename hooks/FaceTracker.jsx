import React, { useRef, useState, useEffect, useCallback } from 'react';
import useGazeTracking from './useGazeTracking';
import './FaceTracker.css'; // Optional styling

/**
 * FaceTracker Component
 * Prefers using a video at `/video/face.mp4`, falls back to images in `basePath`.
 * Maps mouse position to 2D grid of video frames.
 */
export default function FaceTracker({
  className = '',
  basePath = '/faces/',
  showDebug = true,
  X_STEPS = 11,
  Y_STEPS = 11,
  FPS = 60,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const { currentImage, isLoading, error } = useGazeTracking(
    containerRef,
    basePath,
  );

  const [mode, setMode] = useState('unknown'); // 'video' | 'images' | 'unknown'
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [frameIndex, setFrameIndex] = useState(0);

  // Try to detect video availability on mount
  useEffect(() => {
    let cancelled = false;
    const test = document.createElement('video');
    test.preload = 'metadata';
    test.src = '/video/face.mp4';

    const onLoaded = () => {
      if (cancelled) return;
      setMode('video');
    };
    const onError = () => {
      if (cancelled) return;
      setMode('images');
    };

    test.addEventListener('loadedmetadata', onLoaded);
    test.addEventListener('error', onError);

    // Start load
    test.load();

    return () => {
      cancelled = true;
      test.removeEventListener('loadedmetadata', onLoaded);
      test.removeEventListener('error', onError);
    };
  }, []);

  // Pointer move handler: update state and drive video time when using video
  const handlePointerMove = useCallback(
    (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      if (
        mode === 'video' &&
        videoRef.current &&
        videoRef.current.readyState >= 2
      ) {
        // Calculate center and normalize to [-1, 1]
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const nx = (e.clientX - centerX) / (rect.width / 2);
        const ny = (e.clientY - centerY) / (rect.height / 2);

        // Clamp to [-1, 1]
        const clampedX = Math.max(-1, Math.min(1, nx));
        const clampedY = Math.max(-1, Math.min(1, -ny)); // Flip Y for natural feel

        // Map to grid indices (negate to match video frame order)
        const xIndex = Math.round(((-clampedX + 1) / 2) * (X_STEPS - 1));
        const yIndex = Math.round(((-clampedY + 1) / 2) * (Y_STEPS - 1));

        // Calculate frame index (row-major: y * width + x)
        const fIdx = yIndex * X_STEPS + xIndex;
        setFrameIndex(fIdx);

        // Convert to time
        const frameTime = fIdx / FPS;
        const dur = videoRef.current.duration || 0;

        // console.log('Setting video time to frame:', fIdx, 'time:', frameTime);
        if (!Number.isNaN(frameTime) && frameTime <= dur) {
          videoRef.current.currentTime = frameTime.toFixed(3);
        }
      }
    },
    [mode, X_STEPS, Y_STEPS, FPS],
  );

  useEffect(() => {
    // Attach pointermove globally so movement outside the element still updates
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [handlePointerMove]);

  if (error) {
    return (
      <div className="face-tracker-error">
        Error loading face images: {error.message}
      </div>
    );
  }

  return (
    <div className={`face-tracker ${className}`}>
      <div
        ref={containerRef}
        className="face-tracker-container"
        style={{ width: '100%', height: '100%' }}
      >
        {mode === 'video' && (
          <video
            ref={videoRef}
            src="/video/face.mp4"
            className="face-video"
            muted
            playsInline
            preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}

        {(mode === 'images' || mode === 'unknown') && currentImage && (
          <img
            src={currentImage}
            alt="Face following gaze"
            className="face-image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'opacity 0.1s ease-out',
            }}
          />
        )}

        {isLoading && <div className="face-loading">Loading face...</div>}
      </div>

      <div className="face-source" aria-live="polite" style={{ marginTop: 8 }}>
        Using:{' '}
        {mode === 'video'
          ? 'Video'
          : mode === 'images'
            ? 'Images'
            : 'Detecting...'}
      </div>

      {showDebug && (
        <div className="face-debug">
          <div>
            Mouse: ({Math.round(mousePos.x)}, {Math.round(mousePos.y)})
          </div>
          <div>Mode: {mode}</div>
          <div>
            Grid: {X_STEPS}×{Y_STEPS} | Frame: {frameIndex} | FPS: {FPS}
          </div>
          <div>
            Time: {videoRef.current?.currentTime.toFixed(3)}
          </div>
          {mode === 'images' && (
            <div>Image: {currentImage?.split('/').pop()}</div>
          )}
        </div>
      )}
    </div>
  );
}
