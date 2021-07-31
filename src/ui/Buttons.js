import React from "react";
import {useSpring, animated} from "react-spring";

import "./Buttons.scss"
import * as style from "../style";

function Button(props) {
  const HEIGHTS = {
    'large': style.height6,
    'medium': style.height7,
    'small': style.height9,
  };

  const [spring, springApi] = useSpring(() => ({
    backgroundOpacity: 0,
    config: {duration: 300}
  }));

  return (
    <animated.div
      className="button"
      style={{
        height: HEIGHTS[props.size],
        backgroundColor: props.disabled ? 0 : spring.backgroundOpacity.to(x => style.rgba(style.grey3, x)),
      }}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={(e) => {
        springApi.start({backgroundOpacity: 1})
        if (props.onMouseEnter) props.onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        springApi.start({backgroundOpacity: 0})
        if (props.onMouseLeave) props.onMouseLeave(e);
      }}
    >
      {typeof props.children === "string" ? props.children :
        React.Children.map(props.children, (item) => (
          React.cloneElement(item, {
            className: "button-content",
          })
        ))
      }
    </animated.div>
  )
}

function ToolbarButton(props) {
  const [spring, springApi] = useSpring(() => ({
    backgroundOpacity: 0,
    config: {duration: 300}
  }));

  return (
    <animated.div
      className="toolbar-button"
      style={{
        backgroundColor: props.disabled ? style.rgba(style.grey3, 0) : spring.backgroundOpacity.to(x => style.rgba(style.grey3, x)),
      }}
      onClick={(e) => {
        if (props.onClick && !props.disabled) props.onClick(e);
      }}
      onMouseEnter={(e) => {
        springApi.start({backgroundOpacity: 1})
        if (props.onMouseEnter && !props.disabled) props.onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        springApi.start({backgroundOpacity: 0})
        if (props.onMouseLeave && !props.disabled) props.onMouseLeave(e);
      }}
    >
      {React.cloneElement(props.icon, {
        className: "button-content",
        style: {
          color: props.disabled ? style.grey2 : style.black,
        }
      })}
    </animated.div>
  )
}

function IconButton(props) {
  return (
    <div
      className="icon-button"
      style={{
        backgroundColor: props.disabled ? style.grey3 : (props.checked ? style.blue : style.white),
      }}
      onClick={props.onClick}
      onMouseDown={(e) => {
        if (props.onChange && !props.disabled) props.onChange(!props.checked);
        if (props.onMouseDown) props.onMouseDown(e);
      }}
      onMouseUp={(e) => {
        if (props.onMouseUp && !props.disabled) props.onMouseUp(!props.checked);
      }}
    >
      {React.cloneElement(props.icon, {
        style: {
          filter: `invert(${props.disabled ? 0.5 : (props.checked ? 1 : 0)})`
        }
      })}
    </div>
  )
}

function Buttons(props) {
  return (
    <div
      className="buttons"
      style={{
        flexDirection: props.reverse ? "row-reverse" : "row",
      }}
    >
      {React.Children.map(props.children, (item, index) => (
        React.cloneElement(item, {
          key: index,
          style: {
            left: props.overlap ? (props.reverse ? 5 : -5) * index : 0, // Simulate the overlapping between buttons
          },
        })
      ))}
    </div>
  )
}

export {Button, ToolbarButton, IconButton, Buttons};
