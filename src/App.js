import React from 'react';
import './App.css';
import Chat from './components/Chat';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/updated-logo.png" className="App-logo" alt="logo" />
        <h1 className="App-title">UPA LEAGUE</h1>
      </header>
      <Chat />
    </div>
  );
}

export default App;
