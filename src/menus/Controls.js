import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Feather, Sidebar, Sliders, Volume2} from "react-feather"

import {changeSettings} from "../redux";
import {AnchorPopover} from "../ui/Popover";
import {Button, IconButton} from "../ui/Buttons";
import {ListItem} from "../ui/ListItem";
import Slider from "../ui/Slider";

import "./Controls.scss";

function Control(props) {
  return (
    <div
      className="control"
      style={{
        gridRow: `${props.row[0] + 1} / ${props.row[1] + 2}`,
        gridColumn: `${props.col[0] + 1} / ${props.col[1] + 2}`,
      }}
    >
      {props.children}
    </div>
  )
}

function Controls(props) {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    open: false,
  })

  return (
    <AnchorPopover
      open={state.open}
      onClose={() => {
        setState({...state, open: false})
      }}
      anchorDir="y"
      anchor={
        <Button
          size="medium"uuu
          onClick={() => {
            setState({...state, open: true})
          }}
        >
          <Sliders/>
        </Button>
      }
    >
      <div className="controls">
        <Control
          row={[0, 0]}
          col={[0, 1]}
        >
          <ListItem
            icon={
              <IconButton
                icon={<Feather color="black"/>}
                checked={props.background === 'weather'}
                onChange={(checked) => {
                  dispatch(changeSettings('-1', {background: checked ? 'weather' : 'wallpaper'}));
                }}
              />
            }
            primary="Background"
            secondary={props.background}
            noPadding={true}
          />
        </Control>

        <Control
          row={[0, 0]}
          col={[2, 3]}
        >
          <ListItem
            icon={
              <IconButton
                icon={<Sidebar color="black"/>}
                checked={props.widgetsLock}
                onChange={(checked) => {
                  dispatch(changeSettings('-1', {widgetsLock: checked}));
                }}
              />
            }
            primary="Sidebar"
            secondary={props.widgetsLock ? 'Locked' : 'Temporary'}
            noPadding={true}
          />
        </Control>

        <Control
          row={[1, 1]}
          col={[0, 3]}
        >
          <div className="volume">
            <div className="control-title">
              Volume
            </div>
            <Slider
              value={props.volume * 100}
              onChange={(value) => {
                if (props.onVolumeChange !== undefined) props.onVolumeChange(value);
              }}
            >
              <Volume2/>
            </Slider>
          </div>
        </Control>
      </div>
    </AnchorPopover>
  )
}

export {Control, Controls};
