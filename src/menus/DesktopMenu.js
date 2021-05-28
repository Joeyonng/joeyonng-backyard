import React from "react";

import {MenuButtonGroup} from "../ui/Menu";

function DesktopMenu(props) {
  return (
    <MenuButtonGroup>
      {props.children}
    </MenuButtonGroup>
  )
}

export default DesktopMenu;
