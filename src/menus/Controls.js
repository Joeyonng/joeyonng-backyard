import React, {useState} from "react";
import {Feather, Sliders, Volume2} from "react-feather"

import {changeSettings} from "../redux";
import {AnchorPopover} from "../ui/Popover";
import Slider from "../ui/Slider";

import "./Controls.scss";
import {Button, ButtonIcon} from "../ui/Buttons";
import ListItem from "../ui/ListItem";
import {useDispatch} from "react-redux";

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
          onClick={() => {
            setState({...state, open: true})
          }}
        >
          <Sliders/>
        </Button>
      }
    >
      <div className="controls">
        <div className="control background">
          <ListItem
            icon={
              <ButtonIcon
                checked={props.background === 'weather'}
                icon={<Feather color="black"/>}
                checkedIcon={<Feather color="white"/>}
                onChange={(active) => {
                  dispatch(changeSettings('-1', {background: active ? 'weather' : 'wallpaper'}));
                }}
              />
            }
            primary="Background"
            secondary={props.background}
          />
        </div>

        <div className="control volume">
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
      </div>
    </AnchorPopover>
  )
}

export default Controls;
