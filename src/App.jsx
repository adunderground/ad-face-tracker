import React from 'react';
import GazeTracker from '../hooks/GazeTracker';
import Header from './components/Header'
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="face-tracker-container">
        <GazeTracker />
      </div>
    </div>
  );
}

export default App;
