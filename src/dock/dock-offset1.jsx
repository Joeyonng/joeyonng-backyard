import React from "react";
import {useSpring, animated} from "react-spring";

export default function(props) {
  const [animated_props, set] = useSpring(() => ({
    width: props.width,
    config: {tension: 500, clamp: true},
  }));

  set({
    width: props.width
  });

  let style = Object.assign({
    width: animated_props.width,
    //width: `${props.width}px`,
    height: `${props.height}px`,
    background: "red",
    opacity: props.debug ? 0.5 : 0,
  }, (() => {
    switch (props.magnifyDirection) {
      case "up": return { alignSelf: "end", };
      case "down": return { alignSelf: "start", };
      case "center": return { alignSelf: "center", };
    }
  })());

  return <animated.div style={style} />;
}
