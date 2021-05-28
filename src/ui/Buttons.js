import React from "react";

import "./Buttons.scss"

const Button = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
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
})

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

export {Button, Buttons};
