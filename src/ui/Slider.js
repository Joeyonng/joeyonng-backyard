import React, {useState, useCallback} from "react";

import "./Slider.scss"
import * as style from "../style";

const buttonSize = parseInt(style.xlSize, 10);
function Slider(props) {
  const [state, setState] = useState({
    sliderRef: null
  });

  const onSliderRefChange = useCallback(node => {
    setState(state => ({...state, sliderRef: node}));
  }, []);

  return (
    <div
      ref={onSliderRefChange}
      className="slider-container"
    >
      <div
        className="slider-fill"
        style={{
          width: state.sliderRef === null ? 0 : props.value / 100 * (state.sliderRef.offsetWidth - buttonSize - 2) + buttonSize
        }}
      />

      <input
        className="slider"
        type="range"
        min={0}
        max={100}
        value={props.value}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (props.onChange !== undefined) props.onChange(value)
        }}
      />

      {React.Children.map(props.children, (item) => (
        React.cloneElement(props.children, {
          className: "slider-icon"
        })
      ))}
    </div>
  )
}

export default Slider;
