import React from "react";

import DockOSX from "./components/Dock"
import MenuBar from "./components/MenuBar";
import Desktop from "./components/Desktop";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <MenuBar/>
      <Desktop/>
      <DockOSX/>
    </div>
  );
}

export default App;
