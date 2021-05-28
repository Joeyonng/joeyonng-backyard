import React, {useState} from "react";
import XSvg from "feather-icons/dist/icons/x.svg";
import MinusSvg from "feather-icons/dist/icons/minus.svg";
import PlusSvg from "feather-icons/dist/icons/plus.svg";

import "./Lights.scss"

function Light(props) {
  return (
    <button
      className="traffic-light"
      style={{
        backgroundColor: props.hover ? props.color : (props.focus ? props.color : "#ddd"),
      }}
      onClick={(event) => {
        if (props.onClick !== undefined) props.onClick(event);
      }}
    >
      {!props.hover ? null : React.cloneElement(props.children, {
        className: "traffic-light-icon"
      })}
    </button>
  )
}

function Lights(props) {
  const [state, setState] = useState({
    hover: false,
  });

  return (
    <div
      className="traffic-lights"
      onMouseEnter={() => {
        setState({...state, hover: true})
      }}
      onMouseLeave={() => {
        setState({...state, hover: false})
      }}
    >
      <Light
        hover={state.hover}
        focus={props.focus}
        color="#FF5E57"
        onClick={(event) => {
          if (props.onCloseClick !== undefined) {
            event.stopPropagation()
            props.onCloseClick()
          }
        }}
      >
        <img src={XSvg} alt=""/>
      </Light>
      <Light
        hover={state.hover}
        focus={props.focus}
        color="#FFBB2E"
        onClick={(event) => {
          if (props.onMinimizeClick !== undefined) {
            event.stopPropagation()
            props.onMinimizeClick()
          }
        }}
      >
        <img src={MinusSvg} alt=""/>
      </Light>
      <Light
        hover={state.hover}
        focus={props.focus}
        color="#38C149"
        onClick={(event) => {
          if (props.onMaximizeClick	 !== undefined) {
            event.stopPropagation()
            props.onMaximizeClick()
          }
        }}
      >
        <img src={PlusSvg} alt=""/>
      </Light>
    </div>
  )
}

export default Lights;
