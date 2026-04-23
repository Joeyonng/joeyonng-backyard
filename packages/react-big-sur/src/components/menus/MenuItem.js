import React, {forwardRef, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useEnsuredForwardedRef} from "react-use";

import ListItem from "../lists/ListItem";

import * as style from "../../style";
import "./MenuItem.scss";

const MenuItem = forwardRef(function MenuItem(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {size, primary, icon, tail, disabled, ...rootProps} = curProps;

  const menu = children === undefined ? null : React.Children.only(children);

  const [state, setState] = useState({
    menuOpen: false,
    hover: false,
  });

  const menuRef = useEnsuredForwardedRef(ref);
  return (
    <div
      onMouseLeave={() => {
        setState({...state, hover: false, menuOpen: false})
        if (rootProps.onMouseLeave) rootProps.onMouseLeave();
      }}
    >
      <ListItem
        {...rootProps}
        ref={menuRef}
        size={size}
        variant={disabled ? "disabled" : (state.hover ? "primary" : (children && state.menuOpen ? "subdued" : "normal"))}
        primary={primary}
        icon={icon}
        tail={tail}
        onMouseOver={() => {
          setState({...state, hover: true, menuOpen: true})
        }}
        onMouseLeave={() => {
          setState({...state, hover: false})
        }}
        disabled={disabled}
      />

      {!menu ? null : React.cloneElement(menu, {
        open: state.menuOpen,
        anchorEl: menuRef.current,
        anchorOriginX: 'right',
        anchorOriginY: 'top',
        offset: {top: -style.delPx(style.space7)},
      })}
    </div>
  )
});

MenuItem.propTypes = {
  /** Size of the menu item */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  /** Primary text of the menu item. */
  primary: PropTypes.string,
  /** Front Icon of the menu item */
  icon: PropTypes.node,
  /** Tail of the menu item */
  tail: PropTypes.node,
  /** If True, the menuItem is disabled. */
  disabled: PropTypes.bool,
}

MenuItem.defaultProps = {
  size: 'small',
}

export default MenuItem;