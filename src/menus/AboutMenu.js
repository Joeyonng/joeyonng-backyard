import React from "react";
import {useDispatch} from "react-redux";

import {closeApp, minimizeApp} from "../redux";
import {MenuButton, MenuButtonGroup} from "../ui/Menu";
import {MenuItem} from "../ui/MenuItem";

import * as style from "../style";

function AboutMenu(props) {
  const dispatch = useDispatch();

  return (
    <MenuButtonGroup>
      {props.children}
      <MenuButton
        width={style.lSize}
        title={props.name}
        fontWeight="bold"
      >
        <MenuItem
          primary="Close"
          onClick={() => {
            dispatch(closeApp(props.appId));
          }}
        />
        <MenuItem
          primary="Minimize"
          onClick={() => {
            dispatch(minimizeApp(props.appId));
          }}
        />
      </MenuButton>
    </MenuButtonGroup>
  )
}

export default AboutMenu;
