import React, {useRef, useState} from "react";
import {animated, useSpring} from "react-spring";

import "./Video.scss";

function Video(props) {
  const [state, setState] = useState({
    prevProps: props,
  });
  const videoRef = useRef(null);

  const [spring] = useSpring(() => ({
    opacity: Number(props.show),
  }));

  if (state.prevProps.show !== props.show) {
    if (videoRef.current && props.show) {
      videoRef.current.style.display = 'initial';
      videoRef.current.play();
    }

    spring.opacity.start({
      from: Number(!props.show),
      to: Number(props.show),
      onRest: () => {
        if (videoRef.current && !props.show) {
          videoRef.current.style.display = 'none';
          videoRef.current.pause();
        }
      }
    })

    setState({...state, prevProps: {...state.prevProps, show: props.show}});
  }

  if (state.prevProps.video !== props.video) {
    if (props.show) {
      spring.opacity.start({
        from: 1,
        to: 0,
        onRest: () => {
          if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.oncanplay = () => {
              spring.opacity.start({from: 0, to: 1});
              videoRef.current.oncanplay = null;
            }
          }
        }
      })
    }
    else {
      if (videoRef.current) {
        videoRef.current.load();
      }
    }

    setState({...state, prevProps: {...state.prevProps, video: props.video}});
  }

  if (videoRef.current !== null) {
    videoRef.current.volume = props.volume;
  }

  return (
    <animated.video
      ref={videoRef}
      className={`video ${props.className ? props.className : ""}`}
      style={{
        opacity: spring.opacity,
      }}
      autoPlay={true}
      loop={true}
      muted={props.volume === 0}
    >
      <source
        src={props.video}
      />
    </animated.video>
  )
}

export default Video;