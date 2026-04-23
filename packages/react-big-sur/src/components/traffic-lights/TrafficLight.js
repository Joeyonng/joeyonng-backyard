import React, {forwardRef, useState} from "react";
import PropTypes from "prop-types";

import "./TrafficLight.scss"
import * as style from "../../style";

const TrafficLight = forwardRef(function TrafficLight(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {hover, focus, color, ...rootProps} = curProps;

  const [state, setState] = useState({
    active: false,
  })

  return (
    <button
      {...rootProps}
      ref={ref}
      className="traffic-light"
      style={{
        backgroundColor: hover ? color : (focus ? color : style.grey2),
        filter: state.active ? style.filterDarken : undefined,
      }}
      onMouseUp={(e) => {
        setState({active: false});
        if (rootProps.onMouseUp) rootProps.onMouseUp(e);
      }}
      onMouseDown={(e) => {
        setState({active: true});
        if (rootProps.onMouseDown) rootProps.onMouseDown(e);
      }}
    >
      {!hover ? null : React.cloneElement(children, {
        className: "traffic-light-icon"
      })}
    </button>
  )
});

TrafficLight.propTypes = {
  /** If True, TrafficLight will have color even if it is not focused. */
  hover: PropTypes.bool,
  /** If False, TrafficLight is grey. */
  focus: PropTypes.bool,
  /** The color of the TrafficLight. */
  color: PropTypes.string,
}

TrafficLight.defaultProps = {
  focus: true,
}

export default TrafficLight;
