import React, {forwardRef} from "react";
import PropTypes from "prop-types";
import {useMeasure} from "react-use";

import './CircularBar.scss';

const CircularBar = forwardRef(function CircularBar(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {diameter, color, backgroundColor, thickness, value, minValue, maxValue, ...rootProps} = curProps;

  const [centerMeasureRef, centerMeasure] = useMeasure();
  const [circularBarMeasureRef, circularBarMeasure] = useMeasure();

  const size = diameter ? Math.min(circularBarMeasure.width, circularBarMeasure.height)
    : 2 * Math.max(centerMeasure.width, centerMeasure.height);
  const percentage = Math.max(0, Math.min(1, value / (maxValue - minValue)));
  const strokeWidth = thickness >= 1 ? thickness : thickness * size;

  return (
    <div
      {...rootProps}
      ref={(node) => {
        circularBarMeasureRef(node);
        if (ref) ref.current = node;
      }}
      className="circular-bar"
      style={{
        width: diameter ? diameter : size,
        height: diameter ? diameter : size,
      }}
    >
      <svg className="circle">
        <circle
          cx="50%" cy="50%" r={size / 2}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx="50%" cy="50%" r={size / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${percentage * Math.PI * size}, ${Math.PI * size}`}
        />
      </svg>

      <div
        ref={centerMeasureRef}
        className="center"
        style={{
          width: diameter ? 0.5 * size : "fit-content",
          height: diameter ? 0.5 * size : "fit-content" ,
          fontSize: diameter ? 0.25 * size : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
});

CircularBar.propTypes = {
  /** The diameter of the circle, in px. If undefined, it is calculated based on size of the children. */
  diameter: PropTypes.number,
  /** The color of the circle. */
  color: PropTypes.string,
  /** The background color of the circle. */
  backgroundColor: PropTypes.string,
  /** The thickness of the circle, in px. If decimal, the real thickness = thickness * diameter. */
  thickness: PropTypes.number,
  /** The current value of the progress bar. */
  value: PropTypes.number,
  /** The min value of the progress bar */
  minValue: PropTypes.number,
  /** The max value of the progress bar */
  maxValue: PropTypes.number,
}

CircularBar.defaultProps = {
  color: 'green',
  backgroundColor: 'rgba(204, 204, 204, 0.7)',
  thickness: 0.08,
  value: 50,
  minValue: 0,
  maxValue: 100,
}

export default CircularBar;