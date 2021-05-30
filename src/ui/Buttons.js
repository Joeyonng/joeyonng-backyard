import React, {useState} from "react";

import "./Buttons.scss"
import * as style from "../style";

function Button(props) {
  return (
    <div
      className="button"
      style={{
        ...props.style,
        minWidth: props.width,
      }}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    >
      {typeof props.children === "string" ? props.children :
        React.Children.map(props.children, (item) => (
          React.cloneElement(item, {
            className: "button-content",
          })
        ))
      }
    </div>
  )
}

function ButtonIcon(props) {
  return (
    <div
      className="button-icon"
      style={{
        background: props.checked ? style.rgba(style.blue, 1.0) : style.rgba(style.white, 1.0),
      }}
      onClick={props.onClick}
      onMouseDown={() => {
        if (props.onChange) props.onChange(!props.checked);
        if (props.onMouseDown) props.onMouseDown();
      }}
      onMouseUp={props.onMouseUp}
    >
      {props.checked ? props.checkedIcon : props.icon}
    </div>
  )
}

function Buttons(props) {
  return (
    <div
      className="buttons"
      style={{
        flexDirection: props.reverse ? "row-reverse" : "row",
      }}
    >
      {React.Children.map(props.children, (item, index) => (
        React.cloneElement(item, {
          key: index,
          style: {
            left: props.overlap ? (props.reverse ? 5 : -5) * index : 0, // Simulate the overlapping between buttons
          },
        })
      ))}
    </div>
  )
}

export {Button, ButtonIcon, Buttons};
