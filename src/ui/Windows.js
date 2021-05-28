import React, {useState, useRef} from "react";
import {useSpring, animated} from "react-spring";
import {Rnd} from "react-rnd";

import Lights from "./Lights";
import Title from "./Title";
import Tabs, {Tab} from "./Tabs";

import "./Windows.scss";

function WindowBasic(props) {
  const [state, setState] = useState({
    x: props.initial.x,
    y: props.initial.y,
    w: props.initial.w,
    h: props.initial.h,
  })
  let rndRef = useRef(null)

  // const spring = useSpring({
  //   x: props.hidden ? 1000 : state.x,
  //   y: props.hidden ? 1000 : state.y,
  //   w: props.hidden ? 64 : state.w,
  //   h: props.hidden ? 64 : state.h
  // })

  return (
      <Rnd
        ref={rnd => {rndRef = rnd}}
        style={{
          display: props.hidden ? "none" : "inline-block",
          zIndex: props.zIndex,
        }}
        size={!props.enableResizing ? undefined : {
          width: state.w,
          height: state.h,
          // width: spring.w,
          // height: spring.h,
        }}
        position={{
          x: state.x,
          y: state.y,
          // x: spring.x,
          // y: spring.y,
        }}
        onDrag={(e, d) => {
          e.stopPropagation();
        }}
        onDragStop={(e, d) => {
          let x = d.x;
          let y = d.y;
          if (y < props.border.y0) {
            y = props.border.y0;
          }
          if (y > props.border.y1) {
            y = props.border.y1;
          }

          rndRef.updatePosition({x: x, y: y});
          setState({...state, x: x, y: y})
        }}
        onResize={(e, direction, ref, delta, position) => {
          e.stopPropagation();

          let x = position.x;
          let y = position.y;
          let w = ref.offsetWidth;
          let h = ref.offsetHeight;
          if (x < props.border.x0) {
            w = w + x;
            x = props.border.x0;
          }
          if ((x + w) > props.border.x1) {
            w = props.border.x1 - x;
          }
          if (y < props.border.y0) {
            h = h + y;
            y = props.border.y0;
          }
          if ((y + h) > props.border.y1) {
            h = props.border.y1 - y;
          }

          rndRef.updatePosition({x: x, y: y});
          rndRef.updateSize({width: w, height: h});
          setState({...state, x: x, y: y, w: w, h: h});
        }}
        onResizeStart={(e, direction, ref, delta, position) => {
          if (props.onFocus !== undefined) props.onFocus();
        }}
        onMouseDown={() => {
          if (props.onFocus !== undefined) props.onFocus();
        }}
        resizeHandleStyles={{
          top: {"cursor": "s-resize"},
          bottom: {"cursor": "s-resize"},
          left: {"cursor": "w-resize"},
          right: {"cursor": "w-resize"},
        }}
        cancel=".window-content"
        enableResizing={props.enableResizing}
      >
        <animated.div
          className="window"
          style={{
            boxShadow: props.focus ? "0 22px 70px 4px rgba(0,0,0,0.56)" : "none",
          }}
        >
          <div
            className="title-bar"
            style={{
              backgroundColor: props.focus ? "#FFFFFF" : "#F6F6F6",
            }}
          >
            <div className="first-level">
              <div className="first-level-lights">
                <Lights
                  focus={props.focus}
                  onCloseClick={props.onCloseClick}
                  onMinimizeClick={props.onMinimizeClick}
                  onMaximizeClick={props.onMaximizeClick}
                />
              </div>
              <Title>{props.firstTitle}</Title>
            </div>
            {props.secondTitle === undefined ? null :
              <div className="second-level">
                {props.secondTitle}
              </div>
            }
          </div>

          <div
            className="window-content"
          >
            {props.children}
          </div>
        </animated.div>
      </Rnd>
  )
}

function WindowWithTabs(props) {
  const [state, setState] = useState({
    selected_index: 0,
  });

  const spring = useSpring({
    width: props.children[state.selected_index].props.width,
    height: props.children[state.selected_index].props.height,
  });

  return (
    <WindowBasic
      initial={props.initial}
      enableResizing={false}
      firstTitle={props.firstTitle}
      secondTitle={
        <Tabs onSelect={(label, index) => setState({...state, selected_index: index})}>
          {React.Children.map(props.children, (children, index) => (
            <Tab key={index} label={children.props.label}/>
          ))}
        </Tabs>
      }
      hidden={props.hidden}
      focus={props.focus}
      zIndex={props.zIndex}
      border={props.border}
      onFocus={props.onFocus}
      onCloseClick={props.onCloseClick}
      onMinimizeClick={props.onMinimizeClick}
      onMaximizeClick={props.onMaximizeClick}
    >
      <animated.div
        style={{
          width: spring.width,
          height: spring.height,
        }}
      >
        {props.children[state.selected_index]}
      </animated.div>
    </WindowBasic>
  )
}

function WindowTab(props) {
  return (
    <div
      className="window-tab"
      style={{
        ...props.style,
      }}
    >
      {props.children}
    </div>
  )
}

export {WindowBasic, WindowWithTabs, WindowTab};
