import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {useWindowSize} from "react-use";

import {closeApp, focusApp, maximizeApp, minimizeApp, restoreApp} from "../redux";
import Video from "../ui/Video";

import * as style from "../style";
import "./Desktop.scss";
import apps from "../apps";
import backyardSunny from "../media/videos/backyard-sunny.mp4"
import backyardCloudy from "../media/videos/backyard-cloudy.mp4";
import backyardRain from "../media/videos/backyard-rain.mp4";

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
    <div className="desktop">
      <div
        onClick={() => {
          dispatch(focusApp(-1))
        }}
      >
        <div className="desktop-wallpaper"/>

        <Video
          className="desktop-weather"
          video={weatherVideo(reduxState.settings['-1'].weather)}
          show={reduxState.settings['-1'].background === 'weather'}
          volume={reduxState.settings['-1'].volume}
        />
      </div>

      {Object.entries(reduxState.apps).map(([id, appState]) => React.createElement(apps[id].element, {
        key: appState.appId,
        appId: appState.appId,
        name: apps[id].name,
        focus: appState.appId === reduxState.focusedId,
        zIndex: appState.zIndex,
        border: {
          x0: 0,
          x1: width,
          y0: style.rmPx(style.menuBarHeight),
          y1: height - style.rmPx(style.dockHeight) - style.rmPx(style.menuBarHeight)},
        data: appState.data,
        windowState: appState.windowState,
        onWindowStateChange: (windowState) => {
          if (windowState === 'restore') {
            dispatch(restoreApp(appState.appId))
          }
          else if (windowState === 'maximize') {
            dispatch(maximizeApp(appState.appId))
          }
          else {
            dispatch(minimizeApp(appState.appId))
          }
        },
        onFocus: () => {
          dispatch(focusApp(id))
        },
        onCloseClick: () => {
          dispatch(closeApp(id))
        },
        onMinimizeClick: () => {
          dispatch(minimizeApp(id))
        },
        onMaximizeClick: () => {
          dispatch(maximizeApp(id))
        },
        settings: reduxState.settings[appState.appId],
      }))}
    </div>
  )
}

export default Desktop;
