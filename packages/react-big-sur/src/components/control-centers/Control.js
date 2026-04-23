import React, {forwardRef} from "react";
import PropTypes from "prop-types";

import "./Control.scss";

const SIZES = {
  wide: 'auto / auto / span 1 / span 4',
  large: 'auto / auto / span 2 / span 2',
  medium: 'auto / auto / span 1 / span 2',
  small: 'auto / auto / span 1 / span 1',
}

const Control = forwardRef(function Control(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {size, ...rootProps} = curProps;

  return (
    <div
      {...rootProps}
      className="control"
      style={{
        gridArea: SIZES[size],
      }}
    >
      {React.Children.toArray(children).filter(Boolean).map((child) =>
        React.cloneElement(child)
      )}
    </div>
  )
});

Control.propTypes = {
  /** The size of the Control. */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'wide']),
}

Control.defaultProps = {
  size: 'small',
}

export default Control;
