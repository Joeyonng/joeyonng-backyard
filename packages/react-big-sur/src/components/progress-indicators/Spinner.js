// https://codepen.io/jmak/pen/LsCet
import React, {forwardRef} from "react";
import PropTypes from "prop-types";

import "./Spinner.scss"
import * as style from "../../style";

const Spinner = forwardRef(function Spinner(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {size, ...rootProps} = curProps;

  return (
    <div
      {...rootProps}
      ref={ref}
      className="overlay"
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="spinner"
        style={{
          fontSize: size,
        }}
      >
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
      </div>
    </div>
  )
});

Spinner.propTypes = {
  /** The size of the spinner */
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

Spinner.defaultProps = {
  size: style.length11,
}

export default Spinner;