import React, {createRef} from "react";
import {useDispatch} from "react-redux";

import {changeSettings, closeApp, minimizeApp} from "../redux";
import {MenuButton, MenuButtonGroup} from "../ui/Menu";
import {MenuItem, MenuItemGroupWithSelectors, MenuItemWithSubMenu} from "../ui/MenuItem";

import * as style from "../style";

function JupyterMenu(props) {
  const dispatch = useDispatch();
  const inputRef = createRef(null);

  return (
    <MenuButtonGroup>
      {props.children}

      <MenuButton
        width={style.xlSize}
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

      <MenuButton
        title="File"
      >
        <MenuItem
          primary={"Upload"}
          onClick={() => {
            inputRef.current.click();
          }}
        />
      </MenuButton>

      <MenuButton
        title="View"
      >
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
          dispatch(changeSettings(1, {input: e.target.files[0]}))
        }}
      />
    </MenuButtonGroup>
  )
}

export default JupyterMenu;
