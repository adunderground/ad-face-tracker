import React from 'react';
import GazeTracker from '../hooks/GazeTracker';
import Header from './components/Header';
// import Footer from './components/Footer'
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="face-tracker-container">
        <GazeTracker />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
