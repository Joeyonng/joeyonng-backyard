import React, {forwardRef, useState} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import "./PushButton.scss"
import * as style from "../../style";

const SIZES = {
  'large': {
    height: style.length6,
    padding: `0 ${style.space1} 0 ${style.space1}`,
  },
  'small': {
    height: style.length10,
    padding: `0 ${style.space4} 0 ${style.space4}`,
  },
};

const VARIANTS = {
  'primary': {
    color: style.white,
    backgroundColor: style.blue,
    boxShadow: undefined,
  },
  'secondary': {
    color: style.black,
    backgroundColor: style.white,
    boxShadow: style.shadow4,
  },
  'subdued': {
    color: style.grey1,
    backgroundColor: style.white,
    boxShadow: style.shadow4,
  },
  'disabled': {
    color: style.grey1,
    backgroundColor: style.grey3,
    boxShadow: undefined,
  },
}

const PushButton = forwardRef(function PushButton(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {size, variant, disabled, ...rootProps} = curProps;

  const [state, setState] = useState({
    active: false,
  })

  return (
    <button
      {...rootProps}
      ref={ref}
      className="button"
      style={{
        height: SIZES[size].height,
        padding: SIZES[size].padding,
        backgroundColor: state.active && variant === 'secondary' ? style.blue : VARIANTS[variant].backgroundColor,
        boxShadow: VARIANTS[variant].boxShadow,
        color: state.active && variant === 'secondary' ? style.white : VARIANTS[variant].color,
        filter: state.active && variant !== 'secondary' ? style.filterDarken : undefined,
      }}
      onMouseUp={(event) => {
        setState({...state, active: false})
        if (rootProps.onMouseUp) rootProps.onMouseUp(event);
      }}
      onMouseDown={(event) => {
        setState({...state, active: true})
        if (rootProps.onMouseDown) rootProps.onMouseDown(event);
      }}
      onMouseOut={(event) => {
        setState({...state, active: false})
        if (rootProps.onMouseOut) rootProps.onMouseOut(event);
      }}
      disabled={disabled}
    >
      {typeof children === "string" ? children :
        React.Children.toArray(children).filter(Boolean).map((item) => (
          React.cloneElement(item, {
            className: clsx("button-content", item.props.className),
          })
        ))
      }
    </button>
  )
});

PushButton.propTypes = {
  /** The size of the button. */
  size: PropTypes.oneOf(['large', 'small']),
  /** Different variance of the button style */
  variant: PropTypes.oneOf(['primary', 'secondary', 'subdued', 'disabled']),
  /** Whether the button is disabled. */
  disabled: PropTypes.bool,
}

PushButton.defaultProps = {
  size: "large",
  variant: 'primary',
  disabled: false,
}

export default PushButton;