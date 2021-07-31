import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSpring, animated} from "react-spring";

import apps from "../apps";
import {minimizeApp, startApp, switchApp} from "../redux";
import Tooltip from "../ui/Tooltip";

import * as style from "../style";
import "./Dock.scss"

function DockOffset(props) {
  return(
    <animated.div
      className="dock-offset"
      style={{
        width: props.width,
        height: props.height,
        opacity: props.debug ? 0.5 : 0,
        ...{
          'up': {alignItems: 'end'},
          'down': {alignItems: 'start'},
          'center': {alignItems: 'center'}
        }[props.magnifyDirection]
      }}
    />
  )
}

function DockItem(props) {
  const [state, setState] = useState({
    hover: false,
  });
  const [spring, springApi] = useSpring(() => ({
    y: 1,
    config: {duration: 1800},
  }));

  return (
    <div
      className="dock-item-container"
      onMouseEnter={() => {
        setState({...state, hover: true})
      }}
      onMouseLeave = {() => {
        setState({...state, hover: false})
      }}
    >
      <animated.div
        className="dock-item-popover"
        style={{
          display: state.hover ? "initial" : "none",
          transform: spring.y.to({
            range: [0, 0.166, 0.333, 0.499, 0.665, 0.831, 1],
            output: [0, -50, 0, -50, 0, -50, 0]
          }).to(y => `translateY(${y}px)`),
        }}
      >
        <Tooltip text={props.name}/>
      </animated.div>

      <animated.div
        className="dock-item"
        style={{
          width: props.size,
          height: props.size,
          border: props.debug ? style.divider : null,
          transform: spring.y.to({
            range: [0, 0.166, 0.333, 0.499, 0.665, 0.831, 1],
            output: [0, -50, 0, -50, 0, -50, 0]
          }).to(x => `translateY(${x}px)`),
        }}
        onClick={() => {
          if (!props.running) {
            springApi.start({from: {y: 0}, y: 1})
          }

          if (props.onClick) props.onClick()
        }}
      >
        {React.Children.map(props.children, (item) => (
          React.cloneElement(item, {
            className: "dock-item-icon",
          })
        ))}
      </animated.div>

      {props.running ? <animated.div className="dock-item-indicator"/> : null}
    </div>
  );
}

function DockOSX(props) {
  const sumDockItemWidth = (itemWidths = []) => {
    return itemWidths.reduce((sum, itemWidth) => sum + itemWidth, 0);
  }

  const getDockItemWidth = (magnifierX) => {
    return React.Children.map(props.children, (item, index) => {
      if (item) {
        if (magnifierX === null) return props.itemWidth;

        let defaultDockItemWidths = getDockItemWidth(null);
        let itemCenter = sumDockItemWidth(defaultDockItemWidths.slice(0, index)) + (props.itemWidth / 2);
        let distance = Math.abs(magnifierX - itemCenter);
        let distancePercent = Math.max(1 - (distance / (props.itemWidth * props.spreading)), 0);
        return props.itemWidth + (props.itemWidth * distancePercent * props.magnification);
      }
    });
  }

  const getDockWidth = (magnifierX) => {
    return sumDockItemWidth(getDockItemWidth(magnifierX));
  }

  const getDockOffset = (magnifierX, left) => {
    // The dock's width will be maximum when the mouse is magnifying the center of it.
    const maxMagnifiedDockWidth = getDockWidth(getDockWidth(null) / 2)
    const dockOffset = Math.abs(maxMagnifiedDockWidth - getDockWidth(magnifierX));
    if (magnifierX === null) return dockOffset / 2;

    const passMiddle = magnifierX >= getDockWidth(null) / 2;
    return (left && !passMiddle) || (!left && passMiddle) ? dockOffset : 0;
  }

  const [state, setState] = useState({
    magnifierX: null,
  });
  let defaultSpring = {
    offsetLeft: getDockOffset(state.magnifierX, true),
    offsetRight: getDockOffset(state.magnifierX, false),
    config: {tension: 500, clamp: true},
  }
  getDockItemWidth(state.magnifierX).forEach((value, index) => {
    defaultSpring[`itemWidth${index}`] = value;
  })
  const spring = useSpring(defaultSpring)

  const dockRef = useRef();

  return (
    <div
      ref={dockRef}
      className="dock"
    >
      <DockOffset
        width={spring.offsetLeft}
        height={props.itemWidth}
        magnifyDirection={props.magnifyDirection}
        debug={props.debug}
      />
      <animated.div
        className="dock-center"
        style={{
          gridTemplateColumns: React.Children.map(props.children, () => "auto").join(" "),
          ...{
            'up': {alignItems: 'end'},
            'down': {alignItems: 'start'},
            'center': {alignItems: 'center'}
          }[props.magnifyDirection]
        }}
        onMouseMove={(event) => {
          let magnifierX = event.pageX - dockRef.current.offsetLeft - getDockOffset(null, true);
          setState({...state, magnifierX: magnifierX >= 0 && magnifierX < getDockWidth(null) ? magnifierX : null});
        }}
        onMouseLeave={() => {
          setState({...state, magnifierX: null});
        }}
      >
        <div
          className="dock-background"
          style={{
            height: `${props.itemWidth}px`,
            border: props.debug ? style.divider : null,
            ...{
              'up': {bottom: 0},
              'down': {top: 0},
              'center': {top: '50%', transform: 'translateY(-50%)'}
            }[props.magnifyDirection]
          }}
        />

        {React.Children.map(props.children, (item, index) => (
          !React.isValidElement(item) ? null :
            React.cloneElement(item, {
              size: spring[`itemWidth${index}`],
              debug: props.debug,
            })
        ))}
      </animated.div>
      <DockOffset
        width={spring.offsetRight}
        height={props.itemWidth}
        magnifyDirection={props.magnifyDirection}
        debug={props.debug}
      />
    </div>
  );
}

function Dock(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(state => state);

  return (
    <div className="dock-container">
      <DockOSX
        itemWidth={style.rmPx(style.dockHeight)}
        spreading={1.5}
        magnification={1}
        magnifyDirection="up"
      >
        {Object.entries(apps).map(([id, app], index) => (
          id === '-1' ? null :
            <DockItem
              key={index}
              name={app.name}
              running={app.appId in reduxState.apps}
              onClick={() => {
                dispatch(switchApp(app.appId))
              }}
            >
              {app.icon}
            </DockItem>
        ))}
      </DockOSX>
    </div>
  );
}

export default Dock;
