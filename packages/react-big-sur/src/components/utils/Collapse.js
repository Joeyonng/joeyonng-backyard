import React, {forwardRef, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useSpring, animated, config} from "react-spring";
import {useMeasure} from "react-use";

import "./Collapse.scss";

const Collapse = forwardRef(function Collapse(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {open, ...rootProps} = curProps;

  const [state, setState] = useState({
    contentHeight: 0,
  });

  const [contentMeasureRef, contentMeasure] = useMeasure()

  const spring = useSpring({
    contentHeight: open ? state.contentHeight : 0,
    config: config.stiff,
  })

  useEffect(() => {
    setState(state => ({...state, contentHeight: contentMeasure.height}));
  }, [contentMeasure.height]);

  return (
    <animated.div
      {...rootProps}
      ref={ref}
      className="collapse-container"
      style={{
        height: spring.contentHeight,
      }}
    >
      <animated.div
        ref={contentMeasureRef}
        style={{
          transform: spring.contentHeight.to(x => `translateY(${-(state.contentHeight - x)}px)`),
        }}
      >
        {children}
      </animated.div>
    </animated.div>
  )
});

Collapse.propTypes = {
  /** If True, Collapse is not collapsed. */
  open: PropTypes.bool,
}

Collapse.defaultProps = {
  open: false,
}


export default Collapse;
