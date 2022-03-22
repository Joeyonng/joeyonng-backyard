import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dock, DockDivider, DockItem} from "react-big-sur";

import apps from "../apps";
import {updateWindow, startWindow, switchWindow} from "../redux";
import appNotesIcon from "../media/icons/app-notes.png";

function BottomDock(props) {
  const dispatch = useDispatch();
  const windows = useSelector(state => state.windows);

  return (
    <Dock>
      {Object.entries(apps).map(([appId, app]) => appId === '0' ? null :
        <DockItem
          key={appId}
          id={`app-${appId}`}
          src={app.icon}
          label={app.name}
          running={Object.values(windows).map(window => window.appId).includes(appId)}
          onClick={() => {
            dispatch(startWindow(app.appId))
          }}
        />
      )}
      <DockDivider
        id="divider"
      />
      {Object.entries(windows).map(([windowId, window]) => !window.snapshot ? null : (
        <DockItem
          key={windowId}
          id={`window-${windowId}`}
          src={window.snapshot}
          subSrc={apps[window.appId].icon}
          label={apps[window.appId].name}
          onClick={() => {
            dispatch(updateWindow(windowId, {snapshot: undefined}));
          }}
          animateDOMRect={window ? window.node.getBoundingClientRect() : undefined}
          onAnimateStop={(type, value) =>{
            if (type === 'inOut' && value === 0) {
              dispatch(switchWindow(windowId));
            }
          }}
        />
      ))}

      <DockItem
        id="notes"
        src={appNotesIcon}
        label="Joeyonng's Notebook"
        animateOpen={false}
        onClick={() => {
          window.open("https://joeyonng.github.io/joeyonng-notebook/root.html");
        }}
      />
    </Dock>
  )
}

export default BottomDock;