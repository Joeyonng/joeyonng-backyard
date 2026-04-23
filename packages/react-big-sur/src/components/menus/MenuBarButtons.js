import React, {forwardRef, useState} from "react";
import PropTypes from "prop-types";

import "./MenuBarButtons.scss";

const MenuBarButtons = forwardRef(function MenuBarButtons(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {onChange, overlap, ...rootProps} = curProps;

  const [state, setState] = useState({
    openIndex: -1,
  })

  return (
    <div
      {...rootProps}
      ref={ref}
      className="menu-button-group"
    >
      {React.Children.toArray(children).filter(Boolean).map((menuButton, index) => (
        React.cloneElement(menuButton, {
          index: index,
          openIndex: state.openIndex,
          onOpen: () => {
            setState({...state, openIndex: index});
            if (onChange) onChange(index);
          },
          onClose: () => {
            setState({...state, openIndex: -1});
            if (onChange) onChange(-1);
          },
          overlap: overlap,
        })
      ))}
    </div>
  )
});

MenuBarButtons.propTypes = {
  /**
   * Callback function fired when a new menu is opened.
   * Signature: onClickOutside(newIndex: Number) => void.
   */
  onChange: PropTypes.func,
  /** If true, the button highlight will overlap on the neighbor buttons. */
  overlap: PropTypes.bool,
}

MenuBarButtons.defaultProps = {
  overlap: true,
}

export default MenuBarButtons;