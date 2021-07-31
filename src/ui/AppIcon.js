import React from "react";

import AppEmpty from "../media/icons/app-empty.png";

function AppIcon(props) {
  return (
    <div className="app-icon">
      <img className="app-icon-frame" src={AppEmpty}/>
      <img className="app-icon-icon" src={props.image}/>
    </div>
  )
}

export {AppIcon}