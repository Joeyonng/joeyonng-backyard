import React, {Fragment, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSpring, animated} from "react-spring";

import apps from "../apps";
import {startApp} from "../redux";

import "./Dock.scss"

function DockOffset(props) {
  return(
    <animated.div
      className="dock-offset"
      style={
        Object.assign({
          width: props.width,
          height: props.height,
          opacity: props.debug ? 0.5 : 0,
        }, (() => {
          switch (props.magnifyDirection) {
            case "up": return { alignSelf: "end", };
            case "down": return { alignSelf: "start", };
            case "center": return { alignSelf: "center", };
            default: return {};
          }
        })())
      }
    />
  )
}

function DockItem(props) {
  const [state, setState] = useState({
    hover: false,
  });
  const spring = useSpring({
    from: {y: 0},
    y: 1,
    config: {duration: 1800},
  });

  return (
    <div
      className="dock-item-container"
      style={{
      }}
      onMouseEnter={() => {
        setState({...state, hover: true})
      }}
      onMouseLeave={() => {
        setState({...state, hover: false})
      }}
    >
      <animated.div
        className="dock-item-popover"
        style={{
          display: state.hover ? "flex" : "none",
          transform: spring.y.to({
            range: [0, 0.5, 1],
            output: [0, -50, 0]
          }).to(y => `translateY(${y}px)`),
        }}
      >
        {props.name}
      </animated.div>

      <animated.div
        className="dock-item"
        style={{
          width: props.size,
          height: props.size,
          border: props.debug ? "1px solid red" : null,
        }}
        onClick={() => {
          props.onClick()
        }}
      >
        <animated.div
          style={{
            height: "100%",
            transform: spring.y.to({
              range: [0, 0.166, 0.333, 0.499, 0.665, 0.831, 1],
              output: [0, -50, 0, -50, 0, -50, 0]
            }).to(x => `translateY(${x}px)`),
          }}
        >
          {React.Children.map(props.children, (item) => (
            React.cloneElement(item, {
              className: "dock-item-icon",
            })
          ))}
        </animated.div>
        {props.running ? <animated.div className="dock-item-indicator"/> : null}
      </animated.div>
    </div>
  );
}

function Dock(props) {
  const [state, setState] = useState({
    inner: false,
    magnifierX: null,
  });
  const ref = useRef();

  const computeDockItemWidths = (magnifierX) => {
    return React.Children.map(props.children, (item, index) => {
      if (magnifierX === null) return props.itemWidth;

      let dockItemWidths = computeDockItemWidths(null);
      let itemCenter = computeDockWidth(dockItemWidths.slice(0, index)) + (props.itemWidth / 2);
      let distance = Math.abs(magnifierX - itemCenter);
      let distancePercent = Math.max(1 - (distance / (props.itemWidth * 3)), 0);
      return props.itemWidth + (props.itemWidth * distancePercent * props.magnification);
    });
  }

  const computeDockWidth = (itemWidths = []) => {
    return itemWidths.reduce((sum, itemWidth) => sum + itemWidth, 0);
  }

  const maxMagnifiedDockWidth = () => {
    // The dock's width will be maximum when the mouse is magnifying the center of it.
    return computeDockWidth(computeDockItemWidths(dockWidth(null) / 2));
  }

  const dockWidth = (magnifierX) => {
    return computeDockWidth(computeDockItemWidths(magnifierX));
  }

  const dockOffset = (magnifierX, left) => {
    const dockOffset = Math.abs(dockWidth(magnifierX) - maxMagnifiedDockWidth());
    if (magnifierX === null) return dockOffset / 2;

    const passMiddle = magnifierX >= dockWidth(null) / 2;
    return (left && !passMiddle) || (!left && passMiddle) ? dockOffset : 0;
  }

  let offsetLeft = dockOffset(state.magnifierX, true);
  let offsetRight = dockOffset(state.magnifierX, false);
  let itemWidths = computeDockItemWidths(state.magnifierX);

  let defaultSpring = {
    offsetLeft: offsetLeft,
    offsetRight: offsetRight,
    config: {tension: 500, clamp: true},
  }
  itemWidths.forEach((value, index) => {
    defaultSpring[`itemWidth${index}`] = value;
  })
  const spring = useSpring(defaultSpring)

  return (
    <div
      ref={ref}
      className="dock"
    >
      <DockOffset
        width={spring.offsetLeft}
        height={props.itemWidth}
        magnifyDirection={props.magnifyDirection}
        debug={props.debug}
      />
      <div
        style={
          Object.assign({
            display: "grid",
            gridTemplateColumns: React.Children.map(props.children, () => "auto").join(" "),
            position: "relative",
          }, (() => {
            switch (props.magnifyDirection) {
              case "up": return { alignItems: "end", };
              case "down": return { alignItems: "start", };
              case "center": return { alignItems: "center", };
              default: return {};
            }
          })())
        }
        onMouseEnter={() => {
          setState({...state, inner: true})
        }}
        onMouseMove={(event) => {
          let magnifierX = event.pageX - ref.current.offsetLeft - dockOffset(null, true);
          setState({...state, magnifierX: magnifierX >= 0 && magnifierX < dockWidth(null) ? magnifierX : null});
        }}
        onMouseLeave={() => {
          setState({...state, inner: false, magnifierX: null});
        }}
      >
        <div
          className={`dock-background ${props.backgroundClassName}`}
          style={
            Object.assign({
              height: `${props.itemWidth}px`,
              border: props.debug ? "1px solid red" : null,
            }, (() => {
              switch (props.magnifyDirection) {
                case "up": return { bottom: 0, };
                case "down": return { top: 0, };
                case "center": return { top: "50%", transform: "translateY(-50%)", };
                default: return {};
              }
            })())
          }
        />

        {React.Children.map(props.children, (item, index) => (
          React.cloneElement(item, {
            size: spring[`itemWidth${index}`],
            debug: props.debug,
          })
        ))}
      </div>
      <DockOffset
        width={spring.offsetRight}
        height={props.itemWidth}
        magnifyDirection={props.magnifyDirection}
        debug={props.debug}
      />
    </div>
  );
}

function DockOSX(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(state => state);

  return (
    <div className="dock-container">
      <Dock
        backgroundClassName="dock-background"
        itemWidth={64}
        magnification={2}
        magnifyDirection="up"
      >
        {Object.entries(apps).map(([id, app], index) => (
          id === '-1' ? <Fragment key={index}/> :
          <DockItem
            key={index}
            name={app.name}
            running={app.appId in reduxState.apps}
            onClick={() => {
              dispatch(startApp(id))
            }}
          >
            {app.icon}
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}

export default DockOSX;
