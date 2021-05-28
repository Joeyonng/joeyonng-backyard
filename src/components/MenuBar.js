import React from "react";
import {useDispatch, useSelector} from "react-redux";
import CodeSvg from "feather-icons/dist/icons/code.svg"
import GmailSvg from "simple-icons/icons/gmail.svg";
import GithubSvg from "simple-icons/icons/github.svg"

import {changeSettings} from "../redux";
import Widgets from "./Widgets";
import Controls from "./Controls";
import Weathers from "./Weathers";
import {Buttons} from "../ui/Buttons";
import {MenuButton} from "../ui/Menu";
import {MenuItem} from "../ui/MenuItem";

import * as style from "../style";
import apps from "../apps";
import "./MenuBar.scss";

function MenuBar(props) {
  const reduxState = useSelector(state => state);
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <div
        className="menu-bar"
      >
        <div className="menu-bar-left">
          {React.createElement(apps[reduxState.focusedId].menu, {
              appId: reduxState.focusedId,
              name: apps[reduxState.focusedId].name,
              settings: reduxState.settings[reduxState.focusedId],
            }, (
              <MenuButton
                width={style.lSize}
                title={<img src={CodeSvg} alt=""/>}
              >
                <MenuItem
                  primary="Visit my Github"
                  secondary={<img src={GithubSvg} alt=""/>}
                  onClick={() => {
                    window.open("https://github.com/Joeyonng", '_blank');
                  }}
                />
                <MenuItem
                  primary="Contact me"
                  secondary={<img src={GmailSvg} alt=""/>}
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
            <Widgets/>
            <Controls
              volume={reduxState.settings['-1'].volume}
              onVolumeChange={(value) => {
                dispatch(changeSettings('-1', {volume: value / 100}));
              }}
            />
            <Weathers/>
          </Buttons>
        </div>
      </div>
    </React.Fragment>
  )
}

export default MenuBar;
