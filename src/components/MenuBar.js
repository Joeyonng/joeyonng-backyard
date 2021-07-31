import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Code} from "react-feather"
import {Gmail, Github} from "@icons-pack/react-simple-icons";

import {changeSettings} from "../redux";
import Widgets from "./Widgets";
import Weathers from "../menus/Weathers";
import {Controls} from "../menus/Controls";
import {Buttons} from "../ui/Buttons";
import {MenuButton} from "../ui/MenuButton";
import {MenuDivider, MenuItem} from "../ui/Menu";

import * as style from "../style";
import apps from "../apps";
import "./MenuBar.scss";

function MenuBar(props) {
  const reduxState = useSelector(state => state);
  const dispatch = useDispatch();

  return (
    <div className="menu-bar">
      <div className="menu-bar-left">
        {React.createElement(apps[reduxState.focusedId].menu, {
          appId: reduxState.focusedId,
          name: apps[reduxState.focusedId].name,
          settings: reduxState.settings[reduxState.focusedId],
        }, (
          <MenuButton
            width={style.height7}
            title={<Code/>}
          >
            <MenuItem
              primary="Visit my Github"
              secondary={<Github width={style.icon1} height={style.icon1}/>}
              onClick={() => {
                window.open("https://github.com/Joeyonng", '_blank');
              }}
            />
            <MenuDivider/>
            <MenuItem
              primary="Contact me"
              secondary={<Gmail width={style.icon1} height={style.icon1}/>}
              onClick={() => {
                window.open("mailto:checkpppp@gmail.com", '_blank');
              }}
            />
          </MenuButton>
        ))
        }
      </div>

      <div>
        <Buttons overlap={true} reverse={true}>
          <Widgets
            widgetsLock={reduxState.settings['-1'].widgetsLock}
            notifications={reduxState.notifications}
          />
          <Controls
            widgetsLock={reduxState.settings['-1'].widgetsLock}
            background={reduxState.settings['-1'].background}
            volume={reduxState.settings['-1'].volume}
            onVolumeChange={(value) => {
              dispatch(changeSettings('-1', {volume: value / 100}));
            }}
          />
          <Weathers/>
        </Buttons>
      </div>
    </div>
  )
}

export default MenuBar;
