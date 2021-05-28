import React from "react";
import "./Title.scss"

function Text(props) {
  return (
    <div
      style={{
        display: props.inline ? "inline" : "block",
        fontSize: props.size,
        fontWeight: props.bold ? "bold" : "normal",
        fontStyle: props.italic ? "italic" : "normal",
      }}
    >
      {props.children}
    </div>
  )
}

Text.defaultProps = {
  inline: true,
  size: "medium",
  bold: false,
  italic: false,
}

function Title(props) {
  return (
    <div
      className={"title"}
      style={{
        color: props.focus ? "#3D3D3D" : "#86868A",
      }}
    >
      {props.children}
    </div>
  )
}

export {Text};
export default Title;
