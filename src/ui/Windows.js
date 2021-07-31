import React, {useState, useRef, useEffect, forwardRef, useImperativeHandle} from "react";
import {useMeasure, useWindowSize} from "react-use";
import {useSpring, animated} from "react-spring";
import {Rnd} from "react-rnd";

import Lights from "./Lights";

import * as style from "../style";
import "./Windows.scss";

const Window = forwardRef((props, ref) => {
  const {x, y, w, h, ...others} = props;
  return (
    <Rnd
      ref={ref}
      position={{x: props.x, y: props.y}}
      // size={props.enableResizing ? {width: props.w, height: props.h} : undefined}
      size={{width: props.w, height: props.h}}
      {...others}
    />
  )
});

const AnimatedWindow = forwardRef((props, ref) => {
  const {width, height} = useWindowSize();
  const [innerMeasureRef, innerMeasure] = useMeasure();

  const [state, setState] = useState({
    hidden: false,
  })
  const [spring, springApi] = useSpring(() => ({
    ...props.initial
  }));

  const normalState = useRef(null);
  let prevWindowState = useRef(props.windowState);
  useEffect(() => {
    if (props.windowState && prevWindowState.current !== props.windowState) {
      springApi.stop();
      setState(state => ({...state, hidden: false}))

      if (props.windowState === 2) {
        springApi.start({
          from: {
            x: spring.x.get(),
            y: spring.y.get(),
            w: innerMeasure.width,
            h: innerMeasure.height,
          },
          ...normalState.current,
        });
      }
      else {
        const toState = props.windowState === 1 ? {
          x: width / 2,
          y: height,
          w: 0,
          h: 0,
        } : {
          x: 0,
          y: style.rmPx(style.menuBarHeight),
          w: width,
          h: height - style.rmPx(style.menuBarHeight) - style.rmPx(style.dockHeight),
        };

        normalState.current = {
          x: spring.x.get(),
          y: spring.y.get(),
          w: innerMeasure.width,
          h: innerMeasure.height,
        };

        springApi.start({
          from: normalState.current,
          ...toState,
          onRest: () => {
            setState(state => ({...state, hidden: props.windowState === 1}))
          }
        });
      }
    }
    prevWindowState.current = props.windowState;
  }, [props.windowState])

  let rndRef = useRef(null);
  let dragRef = useRef(null);
  useEffect(() => {
    if (ref) ref.current = rndRef.current
  }, [ref, rndRef])

  useImperativeHandle(ref, () => ({
    animate: (to) => {
      const from = {
        x: spring.x.get(),
        y: spring.y.get(),
        w: innerMeasure.width,
        h: innerMeasure.height,
      }

      springApi.start({
        from: {...from},
        ...from,
        ...to,
      });
    },
  }))

  const AnimatedWindow = animated(Window);
  return (
    <AnimatedWindow
      ref={rndRef}
      className="window-frame"
      style={{
        display: state.hidden ? "none" : "inline-block",
        zIndex: props.zIndex,
        boxShadow: props.focus ? style.shadow1 : "none",
      }}

      x={spring.x}
      h={spring.h}
      w={spring.w}
      y={spring.y}
      border={props.border}

      onMouseDown={() => {
        if (props.onFocus !== undefined && !props.focus) props.onFocus();
      }}
      onDragStart={(e, d) => {
        e.stopPropagation();

        dragRef.current = {...dragRef.current, x: d.x, y: d.y};
      }}
      onDragStop={(e, d) => {
        e.stopPropagation();

        if (d.x - dragRef.current.x !== 0 || d.y - dragRef.current.y !== 0) {
          let x = d.x;
          let y = d.y;
          if (y < props.border.y0) {
            y = props.border.y0;
          }
          if (y > props.border.y1) {
            y = props.border.y1;
          }

          springApi.set({x: x, y: y});
          if (rndRef.current) rndRef.current.updatePosition({x: x, y: y});

          if (props.onWindowStateChange && props.enableResizing) props.onWindowStateChange('restore')
        }
      }}
      onResize={(e, dir, ref, delta, position) => {
        e.stopPropagation();

        if (props.onFocus !== undefined && !props.focus) props.onFocus();

        let x = position.x;
        let y = position.y;
        let w = ref.offsetWidth;
        let h = ref.offsetHeight;
        if (dir === 'left' && x < props.border.x0) {
          w = w + x - props.border.x0;
          x = props.border.x0;
        }
        if (dir === 'right' && (x + w) > props.border.x1) {
          w = props.border.x1 - x;
        }
        if (dir === 'top' && y < props.border.y0) {
          h = h + y - props.border.y0;
          y = props.border.y0;
        }
        if (dir === 'bottom' && (y + h) > props.border.y1) {
          h = props.border.y1 - y;
        }

        springApi.set({x: x, y: y, w: w, h: h});
        if (rndRef.current) rndRef.current.updatePosition({x: x, y: y});
        if (rndRef.current) rndRef.current.updateSize({width: w, height: h});

        if (props.onWindowStateChange && props.enableResizing) props.onWindowStateChange('restore')
      }}

      resizeHandleStyles={{
        top: {"cursor": "s-resize"},
        bottom: {"cursor": "s-resize"},
        left: {"cursor": "w-resize"},
        right: {"cursor": "w-resize"},
      }}
      enableResizing={props.enableResizing}
      cancel=".window-content"
    >
      <div
        ref={innerMeasureRef}
        className="window-inner"
      >
        {props.children}
      </div>
    </AnimatedWindow>
  )
});

const TitleBarWindow = forwardRef((props, ref) => {
  return (
    <AnimatedWindow
      ref={ref}
      initial={props.initial}
      zIndex={props.zIndex}
      border={props.border}
      focus={props.focus}
      onFocus={props.onFocus}
      enableResizing={props.enableResizing}
      windowState={props.windowState}
      onWindowStateChange={props.onWindowStateChange}
    >
      <div className="title-bar-window">
        <div
          className="title-bar"
          style={{
            filter: props.focus ? "none" : style.filterUnFocus,
          }}
          onDoubleClick={() => {
            if (props.onWindowStateChange && props.enableResizing) props.onWindowStateChange('maximize');
          }}
        >
          <div className="lights">
            <Lights
              focus={props.focus}
              onCloseClick={props.onCloseClick}
              onMinimizeClick={props.onMinimizeClick}
              onMaximizeClick={props.onMaximizeClick}
            />
          </div>
          <div>
            {props.title}
          </div>
        </div>

        <div
          className="window-content"
          style={{
            backgroundColor: props.backgroundColor,
          }}
        >
          {props.children}
        </div>
      </div>
    </AnimatedWindow>
  )
});

const SidebarWindow = forwardRef((props, ref) => {
  return (
    <AnimatedWindow
      ref={ref}
      initial={props.initial}
      zIndex={props.zIndex}
      border={props.border}
      focus={props.focus}
      onFocus={props.onFocus}
      enableResizing={props.enableResizing}
      windowState={props.windowState}
      onWindowStateChange={props.onWindowStateChange}
    >
      <div className="sidebar-window">
        {!props.sidebar ? null :
          <div
            className="sidebar"
            style={props.focus ? {} :{
              backgroundColor: style.white,
              filter: props.focus ? "none" : style.filterUnFocus,
            }}
          >
            <div
              className="left-toolbar"
              onDoubleClick={() => {
                if (props.onWindowStateChange && props.enableResizing) props.onWindowStateChange('maximize');
              }}
            >
              <div className="lights">
                <Lights
                  focus={props.focus}
                  onCloseClick={props.onCloseClick}
                  onMinimizeClick={props.onMinimizeClick}
                  onMaximizeClick={props.onMaximizeClick}
                />
              </div>

              {props.sidebarToolbar}
            </div>

            {props.sidebar}
          </div>
        }

        <div className="non-sidebar">
          <div
            className="right-toolbar"
            style={{
              filter: props.focus ? "none" : style.filterUnFocus,
            }}
            onDoubleClick={() => {
              if (props.onWindowStateChange && props.enableResizing) props.onWindowStateChange('maximize');
            }}
          >
            {props.sidebar ? null :
              <div className="lights">
                <Lights
                  focus={props.focus}
                  onCloseClick={props.onCloseClick}
                  onMinimizeClick={props.onMinimizeClick}
                  onMaximizeClick={props.onMaximizeClick}
                />
              </div>
            }

            {props.toolbar}
          </div>

          <div
            className="window-content"
            style={{
              backgroundColor: props.backgroundColor,
            }}
          >
            {props.children}
          </div>
        </div>
      </div>
    </AnimatedWindow>
  )
});

export {TitleBarWindow, SidebarWindow, AnimatedWindow};

// function WindowBasic(props) {
//   const [state, setState] = useState({
//     x: props.initial.x,
//     y: props.initial.y,
//     w: props.initial.w,
//     h: props.initial.h,
//   })
//   let rndRef = useRef(null);
//   let dragRef = useRef(null);
//
//   return (
//     <Rnd
//       ref={rndRef}
//       className="window-frame"
//       style={{
//         display: props.hidden ? "none" : "inline-block",
//         zIndex: props.zIndex,
//         boxShadow: props.focus ? style.shadow1 : "none",
//       }}
//       size={!props.enableResizing ? undefined : {
//         width: state.w,
//         height: state.h,
//       }}
//       position={{
//         x: state.x,
//         y: state.y,
//       }}
//       onResize={(e, dir, ref, delta, position) => {
//         e.stopPropagation();
//
//         if (props.onFocus !== undefined && !props.focus) props.onFocus();
//
//         let x = position.x;
//         let y = position.y;
//         let w = ref.offsetWidth;
//         let h = ref.offsetHeight;
//         if (dir === 'left' && x < props.border.x0) {
//           w = w + x - props.border.x0;
//           x = props.border.x0;
//         }
//         if (dir === 'right' && (x + w) > props.border.x1) {
//           w = props.border.x1 - x;
//         }
//         if (dir === 'top' && y < props.border.y0) {
//           h = h + y - props.border.y0;
//           y = props.border.y0;
//         }
//         if (dir === 'bottom' && (y + h) > props.border.y1) {
//           h = props.border.y1 - y;
//         }
//
//         setState({...state, x: x, y: y, w: w, h: h, maximized: false});
//         if (rndRef.current) rndRef.current.updatePosition({x: x, y: y});
//         if (rndRef.current) rndRef.current.updateSize({width: w, height: h});
//       }}
//       onDragStart={(e, d) => {
//         e.stopPropagation();
//
//         dragRef.current = {...dragRef.current, x: d.x, y: d.y};
//       }}
//       onDragStop={(e, d) => {
//         e.stopPropagation();
//
//         if (d.x - dragRef.current.x !== 0 || d.y - dragRef.current.y !== 0) {
//           let x = d.x;
//           let y = d.y;
//           if (y < props.border.y0) {
//             y = props.border.y0;
//           }
//           if (y > props.border.y1) {
//             y = props.border.y1;
//           }
//
//           setState({...state, x: x, y: y})
//           if (rndRef.current) rndRef.current.updatePosition({x: x, y: y});
//         }
//       }}
//       onMouseDown={() => {
//         if (props.onFocus !== undefined) props.onFocus();
//       }}
//       resizeHandleStyles={{
//         top: {"cursor": "s-resize"},
//         bottom: {"cursor": "s-resize"},
//         left: {"cursor": "w-resize"},
//         right: {"cursor": "w-resize"},
//       }}
//       enableResizing={props.enableResizing}
//       cancel=".window-content"
//     >
//       {props.children}
//     </Rnd>
//   )
// }
