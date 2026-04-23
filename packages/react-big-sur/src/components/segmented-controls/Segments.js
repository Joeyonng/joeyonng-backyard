import React, {forwardRef, Fragment, useState} from "react";
import PropTypes from "prop-types";

import "./Segments.scss"

const Segments = forwardRef(function Segments(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {defaultIndex, onChange, ...rootProps} = curProps;

  const [state, setState] = useState({
    selectedIndex: defaultIndex,
  })

  return (
    <div
      {...rootProps}
      ref={ref}
      className="segments"
    >
      {React.Children.toArray(children).filter(Boolean).map((item, index) => (
        <Fragment key={index}>
          {React.cloneElement(item, {
            selected: (index === state.selectedIndex),
            onSelect: () => {
              setState({...state, selectedIndex: index});
              if (onChange) onChange(state.selectedIndex, index);
            },
          })}
          <div
            className="segment-divider"
            style={{
              visibility : (!Array.isArray(children) || index === children.length - 1 ||
                index === state.selectedIndex - 1 || index === state.selectedIndex) ? "hidden" : "visible",
            }}
          />
        </Fragment>
      ))}
    </div>
  )
});

Segments.propTypes = {
  /** The default index of the selected segment. */
  defaultIndex: PropTypes.number,
  /** Callback function fired when a new segment is selected. */
  onChange: PropTypes.func,
}

Segments.defaultProps = {
  defaultIndex: 0,
}

export default Segments;