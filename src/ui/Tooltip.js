import React from "react";

import "./Tooltip.scss"

function Tooltip(props) {
  return (
    <div className="tooltip">
      <div className="tooltip-text">
        {props.text}
      </div>
      <div className="tooltip-tip"/>
    </div>
  )
}

export default Tooltip;
