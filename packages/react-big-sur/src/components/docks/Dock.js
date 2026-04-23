import React, {forwardRef} from "react";
import PropTypes from "prop-types";

import DockContainer from "./DockContainer";

import "./Dock.scss"

const Dock = forwardRef(function Dock(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {baseSize, largeSize, position, debug, ...rootProps} = curProps;
  const horizontal = ['top', 'bottom'].includes(position);

  return (
    <div
      {...rootProps}
      ref={ref}
      className="dock"
      style={{
        ...[{
          height: "100%",
          flexDirection: "column",
        }, {
          width: "100%",
          flexDirection: "row",
        }][Number(horizontal)],
        [position]: 0,
      }}
    >
      <DockContainer
        baseSize={baseSize}
        largeSize={largeSize}
        spreading={3}
        horizontal={horizontal}
        magnifyDirection={{"top": "secondary", "bottom": "primary", "left": "secondary", "right": "primary"}[position]}
        debug={debug}
      >
        {children}
      </DockContainer>
    </div>
  );
});

Dock.propTypes = {
  /** The unmagnified size of the item. Suggested ranges: [16, 128]. */
  baseSize: PropTypes.number,
  /** The magnified size of the item. Suggested ranges: [16, 128]. */
  largeSize: PropTypes.number,
  /** The position of the dock. */
  position: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
  /** Debug mode. */
  debug: PropTypes.bool,
}

Dock.defaultProps = {
  baseSize: 64,
  largeSize: 128,
  position: 'bottom',
  debug: false,
}

export default Dock;