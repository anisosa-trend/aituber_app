import React, { FC } from 'react';
import logo from './logo.svg';
import './App.css';

export const eel = (window as any).eel;
eel.set_host("ws://localhost:8080");

function test(){
  eel.test();
}

const App: FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p
          className="App-link"
          onClick={test}
        >
          Learn React
        </p>
      </header>
    </div>
  );
}

export default App;
