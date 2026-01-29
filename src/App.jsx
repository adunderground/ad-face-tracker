import React from 'react';
import GazeTracker from '../hooks/GazeTracker';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="face-tracker-container">
        <GazeTracker className="face-1" />
        <GazeTracker className="face-2" />
        <GazeTracker className="face-3" />
        <GazeTracker className="face-4" />
      </div>
    </div>
  );
}

export default App;
