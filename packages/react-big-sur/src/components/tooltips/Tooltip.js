import React, {forwardRef} from "react";
import PropTypes from "prop-types";

import "./Tooltip.scss"
import * as style from "../../style";

const PLACEMENTS = {
  'top': {
    flexDirection: "column",
    borderColor: `${style.grey2} transparent transparent transparent`,
    borderWidth: `${style.length14} ${style.length14} 0 ${style.length14}`,
  },
  'bottom': {
    flexDirection: "column-reverse",
    borderColor: `transparent transparent ${style.grey2} transparent`,
    borderWidth: `0 ${style.length14} ${style.length14} ${style.length14}`,
  },
  'left': {
    flexDirection: "row",
    borderColor: `transparent transparent transparent ${style.grey2}`,
    borderWidth: `${style.length14} 0 ${style.length14} ${style.length14}`,
  },
  'right': {
    flexDirection: "row-reverse",
    borderColor: `transparent ${style.grey2} transparent transparent`,
    borderWidth: `${style.length14} ${style.length14} ${style.length14} 0`,
  },
}

const Tooltip = forwardRef(function Tooltip(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {placement, ...rootProps} = curProps;

  return (
    <div
      {...rootProps}
      ref={ref}
      className="tooltip"
      style={{
        flexDirection: PLACEMENTS[placement].flexDirection,
      }}
    >
      <div className="tooltip-text">
        {children}
      </div>

      <div
        className="tooltip-tip"
        style={{
          borderColor: PLACEMENTS[placement].borderColor,
          borderWidth: PLACEMENTS[placement].borderWidth,
        }}
      />
    </div>
  )
});

Tooltip.propTypes = {
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
}

Tooltip.defaultProps = {
  placement: 'top',
}

export default Tooltip;
