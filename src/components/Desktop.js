import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {useWindowSize} from "react-use";

import {closeApp, focusApp, minimizeApp} from "../redux";
import Video from "../ui/Video";

import "./Desktop.scss";
import apps from "../apps";
import backyardSunny from "../images/backyard-sunny.mp4"
import backyardCloudy from "../images/backyard-cloudy.mp4";
import backyardRain from "../images/backyard-rain.mp4";

const menuHeight = 24;
const dockHeight = 48;
const weatherVideo = (weather) => {
  switch (weather) {
    case "Clear":
      return backyardSunny;
    case "Clouds":
      return backyardCloudy;
    case "Rain":
      return backyardRain;
    default:
      return backyardRain;
  }
}

function Desktop(props) {
  const reduxState = useSelector(state => state);
  const dispatch = useDispatch();
  const {width, height} = useWindowSize();

  return (
    <div
      className="desktop"
    >
      <div className="desktop-wallpaper"/>

      <Video
        className="desktop-weather"
        video={weatherVideo(reduxState.settings['-1'].weather)}
        show={reduxState.settings['-1'].background === 'weather'}
        volume={reduxState.settings['-1'].volume}
      />

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
