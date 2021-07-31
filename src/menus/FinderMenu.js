import React from "react";
import {useDispatch} from "react-redux";

import {closeApp, maximizeApp, minimizeApp} from "../redux";
import {MenuButton, MenuButtonGroup} from "../ui/MenuButton";
import {MenuItem} from "../ui/Menu";

import * as style from "../style";

function FinderMenu(props) {
  const dispatch = useDispatch();

  return (
    <MenuButtonGroup>
      {props.children}
      <MenuButton
        width={style.height7}
        title={props.name}
        fontWeight={style.fontWeight4}
      >
        <MenuItem
          primary="Close"
          onClick={() => {
            dispatch(closeApp(props.appId));
          }}
        />
        <MenuItem
          primary="Maximize"
          onClick={() => {
            dispatch(maximizeApp(props.appId));
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

export default FinderMenu;
