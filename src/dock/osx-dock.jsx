import React from "react";
import Dock from "./index1";
import './osx-dock.css';

import finder from './icons/finder.png';
import settings from './icons/settings.png';
import preview from './icons/preview.png';
import terminal from './icons/terminal.png';
import slack from './icons/slack.png';
import atom from './icons/atom.png';
import chrome from './icons/chrome.png';

const apps = {
  'finder': finder,
  'settings': settings,
  'preview': preview,
  'terminal': terminal,
  'slack': slack,
  'atom': atom,
  'chrome': chrome,
};

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="dock-container">
        <Dock
          backgroundClassName="dock-background"
          width={400}
          magnification={1}
          magnifyDirection="up"
          debug={true}
        >
          {Object.entries(apps).map((app, index) => (
            <Dock.Item
              className="dock-item"
              key={index}
              onClick={() =>
                console.log(app[0])
              }
            >
              <img style={{height: '100%'}} src={app[1]} />
            </Dock.Item>
          ))}
        </Dock>
      </div>
    );
  }
}
