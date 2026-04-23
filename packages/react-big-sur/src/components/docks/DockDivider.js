import React, {forwardRef} from "react";
import {animated} from "react-spring";

import "./DockDivider.scss"
import * as style from "../../style";

const DockDivider = forwardRef(function DockDivider(props, ref) {
  const {size, scale, baseSize, horizontal, magnifyDirection, debug, ...publicProps} = props;
  const {classNames, styles, children, ...curProps} = publicProps;
  const {...rootProps} = curProps;

  return (
    <animated.div
      {...rootProps}
      ref={ref}
      className="dock-divider-container"
      style={{
        ...[{
          width: "100%",
          height: size,
        }, {
          width: size,
          height: "100%",
        }][Number(horizontal)],
        padding: baseSize / 16 * 2 + 2,
      }}
    >
      <div
        className="dock-divider"
        style={{
          ...[{
            width: "100%",
            height: 1,
            borderTop: style.divider1,
          }, {
            width: 1,
            height: "100%",
            borderLeft: style.divider1,
          }][Number(horizontal)]
        }}
      />
    </animated.div>
  );
});

DockDivider.propTypes = {

};

DockDivider.defaultProps = {

};

export default DockDivider;