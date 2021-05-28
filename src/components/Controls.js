import React, {useState} from "react";
import SlidersSvg from "feather-icons/dist/icons/sliders.svg"
import Volume2Svg from "feather-icons/dist/icons/volume-2.svg"

import {AnchorPopover} from "../ui/Popover";
import Slider from "../ui/Slider";

import "./Controls.scss";
import {Button} from "../ui/Buttons";

function Controls(props) {
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
          <img src={SlidersSvg} alt=""/>
        </Button>
      }
    >
      <div className="controls">
        <div className="control">
          <div
            className="control-title"
          >
            Volume
          </div>
          <Slider
            value={props.volume * 100}
            onChange={(value) => {
              if (props.onVolumeChange !== undefined) props.onVolumeChange(value);
            }}
          >
            <img src={Volume2Svg} alt=""/>
          </Slider>
        </div>
      </div>
    </AnchorPopover>
  )
}

export default Controls;
