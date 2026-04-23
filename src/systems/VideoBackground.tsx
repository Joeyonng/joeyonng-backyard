import React, { useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import { usePrevious } from 'react-use';

import './VideoBackground.scss';

type VideoBackgroundProps = {
  show: boolean;
  video: string;
  volume: number;
};

function VideoBackground(props: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [spring, springApi] = useSpring(() => ({
    opacity: Number(props.show),
  }));

  const prevShow = usePrevious(props.show);
  if (!prevShow || prevShow !== props.show) {
    if (props.show) {
      if (videoRef.current) {
        videoRef.current.style.display = 'initial';
        void videoRef.current.play();
      }
      springApi.start({ opacity: 1 });
    } else {
      springApi.start({
        opacity: 0,
        onRest: () => {
          if (videoRef.current && !props.show) {
            if (spring.opacity.get() !== 1) {
              videoRef.current.style.display = 'none';
              videoRef.current.pause();
            }
          }
        },
      });
    }
  }

  const prevVideo = usePrevious(props.video);
  if (!prevVideo || prevVideo !== props.video) {
    if (props.show) {
      springApi.start({
        opacity: 0,
        onRest: () => {
          if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.oncanplay = () => {
              springApi.start({ opacity: 1 });
              if (videoRef.current) videoRef.current.oncanplay = null;
            };
          }
        },
      });
    } else {
      if (videoRef.current) videoRef.current.load();
    }
  }

  if (videoRef.current !== null) {
    videoRef.current.volume = props.volume / 100;
  }

  return (
    <animated.video
      ref={videoRef}
      className="video-background"
      style={{
        opacity: spring.opacity,
      }}
      autoPlay={props.show}
      loop
      muted={props.volume === 0}
    >
      <source src={props.video} />
    </animated.video>
  );
}

export default VideoBackground;
