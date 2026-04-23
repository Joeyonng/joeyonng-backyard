import React, {forwardRef, useState} from "react";
import PropTypes from "prop-types";

import "./ToolbarItem.scss"
import * as style from "../../style";

const VARIANTS = {
  'focused': {
    color: style.black,
    boxShadow: style.shadow4,
    backgroundColor: style.white,
  },
  'selected': {
    color: style.grey1,
    boxShadow: undefined,
    backgroundColor: style.grey2,
  },
  'deselected': {
    color: style.grey1,
    boxShadow: undefined,
    backgroundColor: style.transparent,
  },
  'disabled': {
    color: style.grey2,
    boxShadow: undefined,
    backgroundColor: style.transparent,
  }
}

const ToolbarItem = forwardRef(function ToolbarItem(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {variant, disabled, ...rootProps} = curProps;

  const [state, setState] = useState({
    hover: false,
    active: false,
  })

  return (
    <button
      {...rootProps}
      ref={ref}
      className="toolbar-item"
      style={{
        backgroundColor: disabled ? style.transparent : (variant === 'deselected' ?
          style.rgba(style.grey3, state.hover ? 1 : 0) : VARIANTS[variant].backgroundColor),
        boxShadow: VARIANTS[variant].boxShadow,
        color: VARIANTS[variant].color,
        filter: disabled ? undefined : (state.active ? style.filterDarken : undefined),
      }}
      onMouseUp={(event) => {
        setState({...state, active: false});
        if (rootProps.onMouseUp) rootProps.onMouseUp(event);
      }}
      onMouseDown={(event) => {
        setState({...state, active: true});
        if (rootProps.onMouseDown) rootProps.onMouseDown(event);
      }}
      onMouseEnter={(event) => {
        setState({...state, hover: true});
        if (rootProps.onMouseEnter) rootProps.onMouseEnter(event);
      }}
      onMouseLeave={(event) => {
        setState({...state, hover: false});
        if (rootProps.onMouseLeave) rootProps.onMouseLeave(event);
      }}
      disabled={disabled}
    >
      {typeof children === "string" ? children :
        React.Children.toArray(children).filter(Boolean).map((item) => (
          React.cloneElement(item, {})
        ))
      }
    </button>
  )
});

ToolbarItem.propTypes = {
  /** Different variance of the button style */
  variant: PropTypes.oneOf(['focused', 'selected', 'deselected', 'disabled']),
  /** Whether the button is disabled. */
  disabled: PropTypes.bool,
}

ToolbarItem.defaultProps = {
  variant: 'focused',
  disabled: false,
}

export default ToolbarItem;