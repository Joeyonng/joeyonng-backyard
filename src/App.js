import React from "react";

import "./App.scss";

import TopMenuBar from "./systems/TopMenuBar";
import RightNotificationCenter from "./systems/RightNotificationCenter";
import CenterDesktop from "./systems/CenterDesktop";
import BottomDock from "./systems/BottomDock";


function App() {
  return (
    <div className="app">
      <CenterDesktop/>
      <BottomDock/>
      <TopMenuBar/>
      <RightNotificationCenter/>
    </div>
  );
}

export default App;