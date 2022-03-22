import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Feather, Sidebar, Sliders, Volume2} from "react-feather"
import {Control, Controls, HelpButton, ListItem, Menu, MenuBarButton, Slider} from "react-big-sur";

import {changeSettings} from "../redux";

import "./ControlsMenu.scss";

const APP_ID = '0';

function ControlsMenu(props) {
  const dispatch = useDispatch();
  const appSettings = useSelector(state => state.settings[APP_ID]);

  return (
    <MenuBarButton
      label={<Sliders/>}
      separate={true}
      {...props}
    >
      <Menu
        anchorOriginX="right"
        popoverX="right"
      >
        <Controls
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Control size="medium">
            <ListItem
              icon={
                <HelpButton
                  variant={appSettings.background === 'Weather' ? 'primary' : 'subdued'}
                  onClick={() => {
                    dispatch(changeSettings(APP_ID, {background: appSettings.background === 'Weather' ? 'Wallpaper' : 'Weather'}));
                  }}
                >
                  <Feather color={appSettings.background === 'Weather' ? 'white' : 'black'}/>
                </HelpButton>
              }
              size="large"
              primary="Background"
              primaryWeight="bold"
              secondary={appSettings.background}
              noPadding={true}
            />
          </Control>

          <Control size="medium">
            <ListItem
              icon={
                <HelpButton
                  variant={appSettings.notificationCenterLock ? 'primary' : 'subdued'}
                  onClick={() => {
                    dispatch(changeSettings(APP_ID, {notificationCenterLock: !appSettings.notificationCenterLock}));
                  }}
                >
                  <Sidebar color={appSettings.notificationCenterLock ? 'white' : 'black'}/>
                </HelpButton>
              }
              primary="Sidebar"
              secondary={appSettings.notificationCenterLock ? 'Locked' : 'Temporary'}
              noPadding={true}
            />
          </Control>

          <Control size="wide">
            <div className="volume">
              <div className="control-title">
                Volume
              </div>
              <Slider
                value={appSettings.volume}
                onChange={(value) => {
                  dispatch(changeSettings(APP_ID, {volume: value}));
                }}
              >
                <Volume2/>
              </Slider>
            </div>
          </Control>
        </Controls>
      </Menu>
    </MenuBarButton>
  )
}

export default ControlsMenu;