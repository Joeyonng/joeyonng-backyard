import React, {useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useWindowSize} from "react-use";

import {closeApp, focusApp, minimizeApp} from "../redux";

import apps from "../apps";
import "./Desktop.scss";
import cloudy from "../images/cloudy.mp4"

const menuHeight = 24;
const dockHeight = 48;

function Desktop(props) {
  const reduxState = useSelector(state => state);
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const {width, height} = useWindowSize();

  if (videoRef.current !== null) {
    videoRef.current.volume = reduxState.settings['-1'].volume;
  }

  return (
    <div
      className="desktop"
    >
      <video
        ref={videoRef}
        className="desktop-background"
        autoPlay={true}
        loop={true}
        muted={reduxState.settings['-1'].volume === 0}
      >
        <source
          src={cloudy}
          type="video/mp4"
        />
      </video>

      {Object.entries(reduxState.apps).map(([id, appState]) => React.createElement(apps[id].element, {
        key: appState.appId,
        appId: id,
        name: apps[id].name,
        focus: appState.appId === reduxState.focusedId,
        hidden: appState.minimized,
        zIndex: appState.zIndex,
        border: {x0: 0, y0: menuHeight, x1: width, y1: height - menuHeight - dockHeight - 48},
        onFocus: () => {
          dispatch(focusApp(id))
        },
        onCloseClick: () => {
          dispatch(closeApp(id))
        },
        onMinimizeClick: () => {
          dispatch(minimizeApp(id))
        },
        settings: reduxState.settings[appState.appId],
      }))}
    </div>
  )
}

export default Desktop;
