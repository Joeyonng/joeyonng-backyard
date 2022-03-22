import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {toPng} from "html-to-image";
import {Code} from "react-feather";
import {Github, Gmail} from "@icons-pack/react-simple-icons";
import {Menu, MenuBarButton, MenuBarButtons, MenuDivider, MenuItem, MenuList} from "react-big-sur";

import {changeSettings, closeWindow, maximizeWindow, minimizeWindow, updateWindow} from "../redux";
import {formatDateTime} from "../utils/miscellaneous";
import WeatherMenu from "./WeatherMenu";
import ControlsMenu from "./ControlsMenu";
import apps from "../apps";

import * as style from "../style";
import "./TopMenuBar.scss"

const APP_ID = '0';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
        this.setState({
          date: new Date()
        });
      }, 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div className="clock">
        {formatDateTime(this.state.date)}
      </div>
    );
  }
}

function TopMenuBar(props) {
  const dispatch = useDispatch();
  const windowId = useSelector(state => state.focusedId);
  const appWindow = useSelector(state => state.windows[windowId]);
  const appSettings = useSelector(state => state.settings[APP_ID]);

  return (
    <div className="menu-bar">
      <div className="menu-bar-left">
        <MenuBarButtons>
          <MenuBarButton label={<Code/>}>
            <Menu>
              <MenuList>
                <MenuItem
                  primary="Visit my Github"
                  tail={<Github width={style.icon1} height={style.icon1}/>}
                  onClick={() => {
                    window.open("https://github.com/Joeyonng");
                  }}
                />
                <MenuDivider/>
                <MenuItem
                  primary="Contact me"
                  tail={<Gmail width={style.icon1} height={style.icon1}/>}
                  onClick={() => {
                    window.open("mailto:checkpppp@gmail.com");
                  }}
                />
              </MenuList>
            </Menu>
          </MenuBarButton>

          {!windowId || !appWindow?.appId ? null :
            <MenuBarButton label={apps[appWindow?.appId].name}>
              <Menu>
                <MenuList>
                  <MenuItem
                    primary="Close Window"
                    disabled={appWindow.min}
                    onClick={() => {
                      dispatch(closeWindow(windowId));
                    }}
                  />
                  <MenuItem
                    primary="Zoom"
                    disabled={appWindow.min}
                    onClick={() => {
                      dispatch(maximizeWindow(windowId));
                    }}
                  />
                  <MenuItem
                    primary="Minimize"
                    disabled={appWindow.min}
                    onClick={() => {
                      toPng(appWindow.node).then(snapshot => {
                        dispatch(updateWindow(windowId, {snapshot}));
                        dispatch(minimizeWindow(windowId));
                      }).catch(error => {
                        console.error(error);
                      });
                    }}
                  />
                </MenuList>
              </Menu>
            </MenuBarButton>
          }

          {!windowId || !appWindow?.appId ? null : React.createElement(apps[appWindow?.appId].menu, {
            appWindow: appWindow,
            windowId: windowId,
            appId: appWindow?.appId,
          })}
        </MenuBarButtons>

      </div>

      <div>
        <MenuBarButtons
          overlap={true}
        >
          <WeatherMenu/>
          <ControlsMenu/>
          <MenuBarButton
            label={<Clock/>}
            separate={true}
            onClick={() => {
              dispatch(changeSettings(APP_ID, {notificationCenterOpen: !appSettings.notificationCenterOpen}))
            }}
          />
        </MenuBarButtons>
      </div>
    </div>
  )
}

export default TopMenuBar;