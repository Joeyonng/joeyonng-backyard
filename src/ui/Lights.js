import React, {useState} from "react";
import {X, Minus, Plus} from "react-feather"

import * as style from "../style";
import "./Lights.scss"

function Light(props) {
  return (
    <button
      className="traffic-light"
      style={{
        backgroundColor: props.hover ? props.color : (props.focus ? props.color : style.grey2),
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
        color={style.red}
        onClick={(event) => {
          if (props.onCloseClick !== undefined) {
            event.stopPropagation()
            props.onCloseClick()
          }
        }}
      >
        <X/>
      </Light>
      <Light
        hover={state.hover}
        focus={props.focus}
        color={style.yellow}
        onClick={(event) => {
          if (props.onMinimizeClick !== undefined) {
            event.stopPropagation()
            props.onMinimizeClick()
          }
        }}
      >
        <Minus/>
      </Light>
      <Light
        hover={state.hover}
        focus={props.focus}
        color={style.green}
        onClick={(event) => {
          if (props.onMaximizeClick	 !== undefined) {
            event.stopPropagation()
            props.onMaximizeClick()
          }
        }}
      >
        <Plus/>
      </Light>
    </div>
  )
}

export default Lights;
