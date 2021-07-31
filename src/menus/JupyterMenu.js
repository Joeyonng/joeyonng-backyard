import React, {useRef} from "react";
import {useDispatch} from "react-redux";

import {changeAppData, changeSettings, closeApp, maximizeApp, minimizeApp} from "../redux";
import {MenuButton, MenuButtonGroup} from "../ui/MenuButton";
import {MenuItem, MenuItemGroupWithSelectors, MenuItemWithSubMenu} from "../ui/Menu";

import * as style from "../style";

function JupyterMenu(props) {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

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

      <MenuButton title="File">
        <MenuItem
          primary={"Upload"}
          onClick={() => {
            inputRef.current.click();
          }}
        />
      </MenuButton>

      <MenuButton title="View">
        <MenuItemWithSubMenu primary={'Media Alignment'}>
          <MenuItemGroupWithSelectors
            default={props.settings.mediaAlign}
            values={{
              'left': {
                primary: 'Left',
              },
              'center': {
                primary: 'Center',
              },
              'right': {
                primary: 'Right'
              }
            }}
            onChange={(value, index) => {
              dispatch(changeSettings(props.appId, {
                mediaAlign: value,
              }))
            }}
          >
          </MenuItemGroupWithSelectors>
        </MenuItemWithSubMenu>
        <MenuItemWithSubMenu primary={"Source"}>
          <MenuItemGroupWithSelectors
            default={props.settings.displaySource}
            values={{
              'auto': {
                primary: 'Auto',
              },
              'hide': {
                primary: 'hide',
              },
              'show': {
                primary: 'show',
              }
            }}
            onChange={(value, index) => {
              dispatch(changeSettings(props.appId, {
                displaySource: value,
              }))
            }}
          >
          </MenuItemGroupWithSelectors>
        </MenuItemWithSubMenu>
        <MenuItemWithSubMenu primary={"Output"}>
          <MenuItemGroupWithSelectors
            default={props.settings.displayOutput}
            values={{
              'auto': {
                primary: 'Auto',
              },
              'hide': {
                primary: 'hide',
              },
              'show': {
                primary: 'show',
              },
              'scroll': {
                primary: 'scroll',
              }
            }}
            onChange={(value, index) => {
              dispatch(changeSettings(props.appId, {
                displayOutput: value,
              }))
            }}
          >
          </MenuItemGroupWithSelectors>
        </MenuItemWithSubMenu>
      </MenuButton>

      <input
        ref={inputRef}
        type="file"
        style={{display: "none"}}
        onChange={(e) => {
          dispatch(changeAppData(props.appId, {input: e.target.files[0]}))
        }}
      />
    </MenuButtonGroup>
  )
}

export default JupyterMenu;
