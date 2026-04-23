import React, {forwardRef} from "react";
import PropTypes from "prop-types";

import "./Segment.scss"

const Segment = forwardRef(function Segment(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {selected, onSelect, ...rootProps} = curProps;

  return (
    <div
      {...rootProps}
      ref={ref}
      className={selected ? "segment selected" : "segment"}
      onClick={() => {
        if (onSelect) onSelect();
        if (rootProps.onClick) rootProps.onClick();
      }}
    >
      {typeof children === "string" ? children :
        React.Children.toArray(children).filter(Boolean).map((item) => (
          React.cloneElement(item, {
            className: "segment-content",
          })
        ))
      }
    </div>
  )
});

Segment.propTypes = {
  /** Whether this segment is selected. */
  selected: PropTypes.bool,
  /** Callback function fired when this segment is selected. */
  onSelect: PropTypes.func,
}

Segment.defaultProps = {
  selected: false,
}

export default Segment;