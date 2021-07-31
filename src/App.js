import React from "react";

import MenuBar from "./components/MenuBar";
import Desktop from "./components/Desktop";
import Dock from "./components/Dock"

import "./App.scss";

function App() {
  return (
    <div className="App">
      <MenuBar/>
      <Desktop/>
      <Dock/>
    </div>
  );
}

export default App;
