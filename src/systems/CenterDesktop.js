import React from "react";
import {useWindowSize} from "react-use";
import {useDispatch, useSelector} from "react-redux";
import {toPng} from "html-to-image";
import isEqual from "react-fast-compare";
import {AnimatedWindow} from "react-big-sur";

import {closeWindow, focusWindow, maximizeWindow, minimizeWindow, reshapeWindow, updateWindow} from "../redux";
import VideoBackground from "./VideoBackground";

import * as style from "../style";
import "./CenterDesktop.scss";
import apps from "../apps";
import background from "../media/images/macOS-Big-Sur-Vector-Wave-Wallpaper.jpg";
import backyardSunny from "../media/videos/backyard-sunny.mp4";
import backyardCloudy from "../media/videos/backyard-cloudy.mp4";
import backyardRain from "../media/videos/backyard-rain.mp4";

const APP_ID = '0';

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

function CenterDesktop(props) {
  const dispatch = useDispatch();
  const focusedId = useSelector(state => state.focusedId);
  const windows = useSelector(state => state.windows);
  const settings = useSelector(state => state.settings);
  const {width, height} = useWindowSize();

  return (
    <div
      className="desktop"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
      }}
    >
      <VideoBackground
        show={settings[APP_ID].background === 'Weather'}
        video={weatherVideo(settings[APP_ID].weather)}
        volume={settings[APP_ID].volume}
      />

      {Object.entries(windows).map(([windowId, window]) =>
        <AnimatedWindow
          key={windowId}
          initial={window.shape}
          dragBorder={{
            top: {border: style.rmPx(style.menuBarHeight)},
            bottom: {border: height - style.rmPx(style.dockHeight) - style.rmPx(style.menuBarHeight), reversed: true},
          }}
          resizeBorder={{
            top: {border: style.rmPx(style.menuBarHeight)},
            bottom: {border: height - style.rmPx(style.dockHeight) - style.rmPx(style.menuBarHeight)},
            left: {border: 0},
            right: {border: width},
          }}
          animateTo={!window.max ? window.shape : {
            x: 0,
            y: style.rmPx(style.menuBarHeight),
            w: width,
            h: height - style.rmPx(style.menuBarHeight) - style.rmPx(style.dockHeight),
          }}
          zIndex={window.zIndex}
          hidden={window.min}
          onFocus={() => {
            dispatch(focusWindow(windowId));
          }}
          onReshapeStop={(shape) => {
            dispatch(reshapeWindow(windowId, shape));
          }}
          cancel=".window-content"
        >
          {React.createElement(apps[window.appId].window, {
            ref: (node) => {
              if (node && !isEqual(window.node, node)) dispatch(updateWindow(windowId, {node}))
            },
            windowId: windowId,
            appId: window.appId,
            data: window.data,
            focus: windowId === focusedId,
            onCloseClick: () => {
              dispatch(closeWindow(windowId))
            },
            onMinimizeClick: () => {
              toPng(window.node).then(snapshot => {
                dispatch(updateWindow(windowId, {snapshot}));
                dispatch(minimizeWindow(windowId));
              }).catch(error => {
                console.error(error);
              });
            },
            onMaximizeClick: () => {
              dispatch(maximizeWindow(windowId))
            },
            settings: settings[window.appId],
          })}
        </AnimatedWindow>
      )}
    </div>
  );
}

export default CenterDesktop;