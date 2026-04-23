import React, {forwardRef} from "react";
import PropTypes from "prop-types";
import {useMeasure} from "react-use";

import "./Slider.scss"
import * as style from "../../style";

const Slider = forwardRef(function Slider(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {variant, value, minValue, maxValue, header, onChange, ...rootProps} = curProps;

  const [sliderRef, {width}] = useMeasure();

  return (
    <div
      {...rootProps}
      ref={ref}
      className="slider-container"
    >
      <div
        ref={sliderRef}
        className={`slider-track-${variant}`}
      >
        <div
          className="slider-fill"
          style={{
            width: value / (maxValue - minValue) *
              (width - style.delPx(style.length10) - 2) + style.delPx(style.length10)
          }}
        />

        <input
          className="slider-input"
          type="range"
          min={minValue}
          max={maxValue}
          value={value}
          onChange={(event) => {
            const value = parseInt(event.target.value);
            if (onChange !== undefined) onChange(value);
          }}
        />

        {variant === 'small' ? null : React.Children.toArray(header).filter(Boolean).map((item) => (
          React.cloneElement(item, {
            className: "slider-header"
          })
        ))}
      </div>
    </div>
  )
});

Slider.propTypes = {
  /** The variant to use */
  variant: PropTypes.oneOf(['small', 'large']),
  /** The current value of the slider */
  value: PropTypes.number,
  /** The minimum of the slider. */
  minValue: PropTypes.number,
  /** The maximum of the slider. */
  maxValue: PropTypes.number,
  /** The icon appeared at front of the slider */
  header: PropTypes.node,
  /** Callback function fired when the value of the slider is changed. */
  onChange: PropTypes.func,
}

Slider.defaultProps = {
  variant: 'large',
  minValue: 0,
  maxValue: 100,
}

export default Slider;
