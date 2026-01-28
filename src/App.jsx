import React from 'react'
import GazeTracker from '../hooks/GazeTracker'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="face-tracker-container">
        <GazeTracker />
      </div>
    </div>
  )
}

export default App

