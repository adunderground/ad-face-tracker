import React, { useRef, useState, useEffect, useCallback } from 'react';
import useGazeTracking from './useGazeTracking';
import './FaceTracker.css'; // Optional styling

/**
 * FaceTracker Component
 * Prefers using a video at `/video/face.mp4`, falls back to images in `basePath`.
 * Maps mouse position to 2D grid of video frames.
 */

const VIDEO_PATH = '/video/output1.mp4'; 

export default function FaceTracker({
  FPS = 60,
  className = '',
  basePath = '/faces/',
  showDebug = true,
  X_STEPS = 11,
  Y_STEPS = 11,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const { currentImage, isLoading, error } = useGazeTracking(
    containerRef,
    basePath,
  );

  const [mode, setMode] = useState('video'); 
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Initial state: start centered-ish at (4,4)
  const INITIAL_INDEX = { x: 4, y: 4 };
  const [frameIndex, setFrameIndex] = useState(
    INITIAL_INDEX.y * X_STEPS + INITIAL_INDEX.x,
  );
  const [gridIndex, setGridIndex] = useState(INITIAL_INDEX);

  const seekToFrame = useCallback(
    (requestedFrameIdx) => {
      const videoEl = videoRef.current;
      if (!videoEl) return;

      const dur = videoEl.duration || 0;
      const maxFrameIdx =
        dur > 0 ? Math.max(0, Math.floor(dur * FPS) - 1) : requestedFrameIdx;
      const frameIdx = Math.max(0, Math.min(maxFrameIdx, requestedFrameIdx));

      // Seek to the middle of the frame to avoid landing on a boundary.
      const target = (frameIdx + 0.5) / FPS;
      const safeMax = dur > 0 ? Math.max(0, dur - 1 / FPS) : target;
      videoEl.currentTime = Math.min(Math.max(0, target), safeMax);
    },
    [FPS],
  );

  // Try to detect video availability on mount
  useEffect(() => {
    let cancelled = false;
    const test = document.createElement('video');
    test.preload = 'metadata';
    test.src = VIDEO_PATH

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

  // Ensure video shows the initial frame on load.
  useEffect(() => {
    if (mode !== 'video') return;
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const seekToInitial = () => {
      const fIdx = INITIAL_INDEX.y * X_STEPS + INITIAL_INDEX.x;
      setGridIndex(INITIAL_INDEX);
      setFrameIndex(fIdx);
      seekToFrame(fIdx);
    };

    if (videoEl.readyState >= 2) {
      seekToInitial();
      return;
    }

    videoEl.addEventListener('loadeddata', seekToInitial, { once: true });
    return () => videoEl.removeEventListener('loadeddata', seekToInitial);
  }, [mode, X_STEPS, seekToFrame]);

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
        // Compute pointer position within the *displayed* video content.
        // The video uses `object-fit: contain`, so the container can include letterboxing.
        // If we map against the full container, edges (especially right side) can quantize
        // to the wrong column. Use the intrinsic video aspect ratio when available.
        const videoEl = videoRef.current;
        const vw = videoEl.videoWidth || 0;
        const vh = videoEl.videoHeight || 0;

        // Fallback: use container rect if we don't know intrinsic dimensions yet.
        let contentLeft = rect.left;
        let contentTop = rect.top;
        let contentW = rect.width;
        let contentH = rect.height;

        if (vw > 0 && vh > 0) {
          const scale = Math.min(rect.width / vw, rect.height / vh);
          contentW = vw * scale;
          contentH = vh * scale;
          contentLeft = rect.left + (rect.width - contentW) / 2;
          contentTop = rect.top + (rect.height - contentH) / 2;
        }

        const rawXR = (e.clientX - contentLeft) / contentW;
        const rawYR = (e.clientY - contentTop) / contentH;

        // Clamp to [0, 1] within displayed content
        const xRatio = Math.max(0, Math.min(1, rawXR));
        const yRatio = Math.max(0, Math.min(1, rawYR));

        // Map to grid indices (right side => xIndex 0, left side => xIndex 10)
        const clampIndex = (idx, max) => Math.max(0, Math.min(max, idx));
        const xIndex = clampIndex(
          Math.floor((1 - xRatio) * X_STEPS),
          X_STEPS - 1,
        );
        const yIndex = clampIndex(Math.floor(yRatio * Y_STEPS), Y_STEPS - 1);
        setGridIndex({ x: xIndex, y: yIndex });

        // Calculate frame index (row-major: y * width + x)
        const fIdx = yIndex * X_STEPS + xIndex;
        setFrameIndex(fIdx);

        seekToFrame(fIdx);
      }
    },
    [mode, X_STEPS, Y_STEPS, seekToFrame],
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
            src={VIDEO_PATH}
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
            Index: ({gridIndex.x}, {gridIndex.y})
          </div>
          <div>Time: {videoRef.current?.currentTime.toFixed(3)}</div>
          {mode === 'images' && (
            <div>Image: {currentImage?.split('/').pop()}</div>
          )}
        </div>
      )}
    </div>
  );
}
