import React from 'react';

import './App.scss';

import BottomDock from './systems/BottomDock';
import CenterDesktop from './systems/CenterDesktop';
import RightNotificationCenter from './systems/RightNotificationCenter';
import TopMenuBar from './systems/TopMenuBar';

function App() {
  return (
    <div className="app">
      <CenterDesktop />
      <BottomDock />
      <TopMenuBar />
      <RightNotificationCenter />
    </div>
  );
}

export default App;
