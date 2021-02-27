import logo from './logo.svg';
import './App.css';

import {Rnd} from "react-rnd";
import Dock from './dock/osx-dock'
import React from "react";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Dock />
    </div>
  );
}

export default App;
