import React, {forwardRef} from "react";

import './MenuDivider.scss';

const MenuDivider = forwardRef(function MenuDivider(props, ref) {
  return (
    <div
      ref={ref}
      className="menu-divider"
    />
  )
});

MenuDivider.propTypes = {
}

MenuDivider.defaultProps = {
}

export default MenuDivider;

