import React, {forwardRef, useEffect} from 'react';
import PropTypes from "prop-types";
import {useEnsuredForwardedRef} from "react-use";

import Popover from "../popovers/Popover";

import './Menu.scss';

const Menu = forwardRef(function Menu(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {open, onClickInside, onClickOutside, ...rootProps} = curProps;

  const menuRef = useEnsuredForwardedRef(ref);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && menuRef.current) {
        if (!menuRef.current.contains(event.target) && onClickOutside) onClickOutside(event);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  })

  return (
    <Popover
      {...rootProps}
      ref={menuRef}
      open={open}
    >
      <div
        className="menu"
        onClick={(event) => {
          if (event.currentTarget !== event.target && onClickInside) onClickInside(event);
        }}
      >
        {children}
      </div>
    </Popover>
  )
});

Menu.propTypes = {
  /** If True, Menu is shown. */
  open: PropTypes.bool,
  /**
   * Callback function fired when a click is detected inside the menu.
   * Signature: onClickInside(event: MouseEvent) => void.
   */
  onClickInside: PropTypes.func,
  /**
   * Callback function fired when a click is detected outside the menu.
   * Signature: onClickOutside(event: MouseEvent) => void.
   */
  onClickOutside: PropTypes.func,
}

Menu.defaultProps = {
  open: false,
}

export default Menu;