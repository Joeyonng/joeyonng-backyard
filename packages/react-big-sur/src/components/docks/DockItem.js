import React, {forwardRef, useState} from "react";
import PropTypes from "prop-types";
import {animated, useSpring, to} from "react-spring";

import Tooltip from "../tooltips/Tooltip";

import "./DockItem.scss"

const DockItem = forwardRef(function DockItem(props, ref) {
  const {size, scale, baseSize, horizontal, magnifyDirection, debug, ...publicProps} = props;
  const {classNames, styles, children, ...curProps} = publicProps;
  const {src, subSrc, label, running, onClick, animateOpen, animateDOMRect, onAnimateStart, onAnimateStop,
    ...rootProps} = curProps;

  const padding = baseSize / 32 * 4;
  const placement = horizontal ? (magnifyDirection === 'primary' ? 'top' : 'bottom') :
    (magnifyDirection === 'primary' ? 'left' : 'right');
  const animateOpenTransform = springValue => springValue.to({
    range: [0, 0.166, 0.333, 0.499, 0.665, 0.831, 1],
    output: [0, 50, 0, 50, 0, 50, 0]
  }).to(x => `translate${horizontal ? 'Y' : 'X'}(${magnifyDirection === 'primary' ? -x : x}px)`)

  const [state, setState] = useState({
    hover: false,
    dockItemAnchorRef: null,
  });
  const [spring, springApi] = useSpring(() => ({
    shift: 1,
    config: {duration: 1800},
    onStart: (result, spring, item) => {
      if (onAnimateStart) onAnimateStart('open', result.value.scale);
    },
    onRest: (result, spring, item) => {
      if (onAnimateStop) onAnimateStop('open', result.value.scale);
    }
  }));

  return (
    <animated.div
      {...rootProps}
      ref={ref}
      className="dock-item-container"
      style={{
        width: horizontal ? to([size, scale], (size, scale) => size * scale) : "auto",
        height: !horizontal ? to([size, scale], (size, scale) => size * scale) : "auto",
        zIndex: animateDOMRect ? scale.to(scale =>  scale === 1 ? "auto" : -1) : "auto",
        flexDirection: {top: "column", bottom: "column-reverse", left: "row", right: "row-reverse"}[placement],
        pointerEvents: scale.to(scale => scale === 1 ? "auto" : "none"),
        border: debug ? "1px solid red" : null,
      }}
      onMouseEnter={() => {
        setState({...state, hover: true})
      }}
      onMouseLeave = {() => {
        setState({...state, hover: false})
      }}
    >
      {!label ? null :
        <animated.div
          className="dock-item-tooltip"
          style={{
            display: state.hover ? "initial" : "none",
            transform: animateOpenTransform(spring.shift),
          }}
        >
          <Tooltip placement={placement}>{label}</Tooltip>
        </animated.div>
      }

      <animated.div
        className="dock-item"
        style={{
          width: horizontal ? "100%" : to([size, scale], (size, scale) => size * scale),
          height: !horizontal ? "100%" : to([size, scale], (size, scale) => size * scale),
          padding: scale.to(scale => scale * padding),
          transform: animateOpenTransform(spring.shift),
          border: debug ? "1px solid blue" : null,
        }}
        onClick={() => {
          if (animateOpen && !animateDOMRect && !running) springApi.start({from: {shift: 0}, shift: 1})
          if (onClick) props.onClick()
        }}
      >
        <animated.div
          ref={ref => {
            if (!state.dockItemAnchorRef && ref) setState(state => ({...state, dockItemAnchorRef: ref}))
          }}
          className="dock-item-anchor"
          style={{
            width: animateDOMRect ? size.to(size => size - 2 * padding) : "100%",
            height: animateDOMRect ? size.to(size => size - 2 * padding) : "100%",
            border: debug ? "1px solid yellow" : null,
          }}
        >
          {!state.dockItemAnchorRef ? null :
            <animated.img
              className="dock-item-icon"
              style={{
                transform: !animateDOMRect ? "none" : scale.to(scale => {
                  const anchorRect = state.dockItemAnchorRef.getBoundingClientRect();

                  const x = (animateDOMRect.x - anchorRect.x) * (1 - scale);
                  const y = (animateDOMRect.y - anchorRect.y) * (1 - scale);

                  const maxWH = Math.max(animateDOMRect.width, animateDOMRect.height);
                  const scaleWH = ((maxWH / anchorRect.width) - 1) * (1 - scale);

                  return `translate(${x}px, ${y}px) scale(${scaleWH + 1})`
                }),
              }}
              alt={`${label}-dockItem-srcImage`}
              src={src}
            />
          }

          {!subSrc ? null :
            <animated.img
              className="dock-item-sub"
              style={{
                right: baseSize / 128 * 4,
                bottom: baseSize / 128 * 4,
                display: scale.to(scale => scale === 1 ? "initial" : "none"),
              }}
              alt={`${label}-dockItem-subSrcImage`}
              src={subSrc}
            />
          }
        </animated.div>
      </animated.div>

      <div
        className="dock-item-indicator"
        style={{
          visibility: running ? "visible" : "hidden",
        }}
      />
    </animated.div>
  );
});

DockItem.propTypes = {
  /** The unique identifier for this dockItem */
  id: PropTypes.any.isRequired,
  /** The dock item icon image URL. */
  src: PropTypes.string,
  /** The sub dock item icon image URL. */
  subSrc: PropTypes.string,
  /** The label of the dockItem. */
  label: PropTypes.string,
  /** If True, a dot indicator will appear under the icon. */
  running: PropTypes.bool,
  /** Callback function when the dockItem is clicked. */
  onClick: PropTypes.func,
  /** If True, a bounce animation will be triggered everytime the dockItem is clicked. */
  animateOpen: PropTypes.bool,
  /**
   * A DOMRect of an element.
   * If provided, a minimize/maximize animation will be triggered when the item is added or removed.
   */
  animateDOMRect: PropTypes.instanceOf(DOMRect),
  /**
   * Callback function called when a animation starts.
   * Signature: onAnimateStart(type: string, value: Number) => void.
   * `type` can be 'open' and 'inOut'.
   * `value` has range from 0 to 1.
   */
  onAnimateStart: PropTypes.func,
  /**
   * Callback function called when a animation stops.
   * Signature: onAnimateStop(type: string, value: Number) => void.
   * `type` can be 'open' and 'inOut'.
   * `value` has range from 0 to 1.
   */
  onAnimateStop: PropTypes.func
}

DockItem.defaultProps = {
  running: false,
  animateOpen: true,
}

export default DockItem;