import React from "react";
import {useSpring, animated} from 'react-spring'

export default function(props) {
  const [animated_props, set] = useSpring(() => ({
    size: props.size,
    config: {tension: 500, clamp: true},
  }));

  set({
    size: props.size,
  });

  return (
    <animated.div
      className={props.className}
      onClick={props.onClick}
      style={{
        width: animated_props.size,
        height: animated_props.size,
        //width: `${props.width}px`,
        //height: `${props.width}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        border: props.debug ? "1px solid red" : null,
        zIndex: 1,
      }}
    >
      {props.children}
    </animated.div>
  );
}
