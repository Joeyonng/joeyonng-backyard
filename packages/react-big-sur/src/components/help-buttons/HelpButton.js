import React, {forwardRef, useState} from "react";
import PropTypes from "prop-types";

import "./HelpButton.scss"
import * as style from "../../style";

const SIZES = {
  'large': {
    width: style.length7,
    height: style.length7,
    fontSize: style.font4,
    lineHeight: style.icon1,
  },
  'medium': {
    width: style.length10,
    height: style.length10,
    fontSize: style.font4,
    lineHeight: style.icon2,
  },
  'small': {
    width: style.length12,
    height: style.length12,
    fontSize: style.font7,
    lineHeight: style.icon3,
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

const HelpButton = forwardRef(function HelpButton(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {size, variant, disabled, ...rootProps} = curProps;

  const [state, setState] = useState({
    active: false,
  })

  return (
    <button
      {...rootProps}
      ref={ref}
      className="icon-button"
      style={{
        width: SIZES[size].width,
        height: SIZES[size].height,
        backgroundColor: state.active && variant === 'secondary' ? style.blue : VARIANTS[variant].backgroundColor,
        boxShadow: VARIANTS[variant].boxShadow,
        color: state.active && variant === 'secondary' ? style.white : VARIANTS[variant].color,
        filter: state.active && variant !== 'secondary' ? style.filterDarken : undefined,
        fontSize: SIZES[size].fontSize,
        lineHeight: SIZES[size].lineHeight,
      }}
      onMouseUp={(event) => {
        setState({...state, active: false})
        if (rootProps.onMouseUp) rootProps.onMouseUp(event);
      }}
      onMouseDown={(event) => {
        setState({...state, active: true})
        if (rootProps.onMouseDown) rootProps.onMouseDown(event);
      }}
      disabled={disabled}
    >
      {typeof children === "string" ? children :
        React.Children.toArray(children).filter(Boolean).map((item) =>
          React.cloneElement(item, {
            style: {
              width: SIZES[size].lineHeight,
              height: SIZES[size].lineHeight,
            }
          })
        )
      }
    </button>
  )
});

HelpButton.propTypes = {
  /** The size of the button. */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  /** Different variance of the button style */
  variant: PropTypes.oneOf(['primary', 'secondary', 'subdued', 'disabled']),
  /** Whether the button is disabled. */
  disabled: PropTypes.bool,
}

HelpButton.defaultProps = {
  size: "large",
  variant: 'primary',
  disabled: false,
}

export default HelpButton;