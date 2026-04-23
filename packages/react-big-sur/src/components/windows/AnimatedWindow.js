import React, {forwardRef, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {animated, useSpring} from "react-spring";
import {useEnsuredForwardedRef, useMeasure} from "react-use";
import isEqual from "react-fast-compare";
import {Rnd} from "react-rnd";

import "./AnimatedWindow.scss";

const Window = forwardRef((props, ref) => {
  const {x, y, w, h, ...others} = props;
  return (
    <Rnd
      ref={ref}
      position={{x: x, y: y}}
      size={{width: w, height: h}}
      {...others}
    />
  )
})

const AnimatedWindow = forwardRef(function AnimatedWindow(props, ref) {
  const {classNames, styles, children, ...curProps} = props
  const {initial, zIndex, resizeBorder, dragBorder, hidden, animateTo, onFocus, onAnimateStart, onAnimateStop,
    onReshapeStart, onReshapeStop, ...rootProps} = curProps

  // Measure inner sizes
  const [innerMeasureRef, innerMeasure] = useMeasure();

  const [spring, springApi] = useSpring(() => ({
    ...initial,
  }));

  // AnimateTo
  let prevAnimateTo = useRef(animateTo);
  useEffect(() => {
    if (animateTo && !isEqual(prevAnimateTo.current, animateTo)) {
      springApi.stop();
      springApi.start({
        from: {
          x: spring.x.get(),
          y: spring.y.get(),
          w: innerMeasure.width,
          h: innerMeasure.height,
        },
        ...animateTo,
        onStart: () => {
          if (onAnimateStart) onAnimateStart({
            x: spring.x.get(),
            y: spring.y.get(),
            w: spring.w.get(),
            h: spring.h.get(),
          });
        },
        onRest: () => {
          if (onAnimateStop) onAnimateStop({
            x: spring.x.get(),
            y: spring.y.get(),
            w: spring.w.get(),
            h: spring.h.get(),
          });
        },
      });
    }
    prevAnimateTo.current = animateTo;
  }, [animateTo])

  let rndRef = useEnsuredForwardedRef(ref);
  let dragRef = useRef(null);

  const AnimatedWindow = animated(Window);
  return (
    <AnimatedWindow
      {...rootProps}
      ref={rndRef}
      className="animated-window"
      style={{
        visibility: hidden ? "hidden" : "visible",
        zIndex: zIndex,
      }}
      x={spring.x}
      y={spring.y}
      h={spring.h}
      w={spring.w}
      onMouseDown={() => {
        if (onFocus !== undefined) onFocus();
      }}
      onDragStart={(event, d) => {
        event.stopPropagation();

        dragRef.current = {...dragRef.current, x: d.x, y: d.y};

        if (onReshapeStart) onReshapeStart({x: spring.x.get(), y: spring.y.get(), h: spring.h.get(), w: spring.w.get()});
      }}
      onDragStop={(event, d) => {
        event.stopPropagation();

        // If the window has no position changed
        if (d.x - dragRef.current.x === 0 && d.y - dragRef.current.y === 0) return;

        // Get current x, y, w, h
        const curPos = [d.x, d.y];
        const curSize = [spring.w.get(), spring.h.get()];
        let newPos = [...curPos];

        // Get new x, y to constrain window inside the bounding box
        if (dragBorder) {
          [['left', 'right'], ['top', 'bottom']].forEach((value, index) => {
            const border0 = dragBorder[value[0]];
            if (border0) {
              if (!border0.reversed && curPos[index] < border0.border) {
                newPos[index] = border0.border;
              }
              if (border0.reversed && curPos[index] < border0.border - curSize[index]) {
                newPos[index] = border0.border - curSize[index];
              }
            }

            const border1 = dragBorder[value[1]];
            if (border1) {
              if (border1.reversed && curPos[index] > border1.border) {
                newPos[index] = border1.border;
              }
              if (!border1.reversed && curPos[index] > border1.border - curSize[index]) {
                newPos[index] = border1.border - curSize[index];
              }
            }
          })
        }

        // Update x, y
        springApi.set({x: newPos[0], y: newPos[1]});
        if (rndRef.current) rndRef.current.updatePosition({x: newPos[0], y: newPos[1]});

        if (onReshapeStop) onReshapeStop({x: spring.x.get(), y: spring.y.get(), h: spring.h.get(), w: spring.w.get()});
      }}
      onResizeStart={(event, dir, refToElement) => {
        event.stopPropagation();

        if (spring.w === undefined || spring.h === undefined) {
          springApi.set({w: innerMeasure.width, h: innerMeasure.height});
        }

        if (onReshapeStart) onReshapeStart({x: spring.x.get(), y: spring.y.get(), h: spring.h.get(), w: spring.w.get()});
      }}
      onResize={(event, dir, ref, delta, position) => {
        event.stopPropagation();

        // Focus the window when resizer is clicked
        if (onFocus !== undefined) onFocus();

        // Get current x, y, w, h
        const curPos = [position.x, position.y];
        const curSize = [ref.offsetWidth, ref.offsetHeight];
        let newPos = [...curPos];
        let newSize = [...curSize];

        // Get new x, y, w, h to constrain window inside the bounding box
        if (resizeBorder) {
          [['left', 'right'], ['top', 'bottom']].forEach((value, index) => {
            dir = dir.toLowerCase();

            const border0 = resizeBorder[value[0]];
            if (border0) {
              if (dir.includes(value[0]) && !border0.reversed && curPos[index] < border0.border) {
                newSize[index] = curSize[index] + curPos[index] - border0.border;
                newPos[index] = border0.border;
              }
              if (dir.includes(value[1]) && border0.reversed && curPos[index] < border0.border - curSize[index]) {
                newSize[index] = border0.border - curPos[index];
              }
            }

            const border1 = resizeBorder[value[1]];
            if (border1) {
              if (dir.includes(value[1]) && !border1.reversed && curPos[index] > border1.border - curSize[index]) {
                newSize[index] = border1.border - curPos[index];
              }
              if (dir.includes(value[0]) && border1.reversed && curPos[index] > border1.border) {
                newSize[index] = curSize[index] + curPos[index] - border1.border;
                newPos[index] = border1.border;
              }
            }
          })
        }

        // Update x, y, w, h
        springApi.set({x: newPos[0], y: newPos[1]});
        if (rndRef.current) rndRef.current.updatePosition({x: newPos[0], y: newPos[1]});
        springApi.set({w: newSize[0], h: newSize[1]});
        if (rndRef.current) rndRef.current.updateSize({width: newSize[0], height: newSize[1]});
      }}
      onResizeStop={() => {
        if (onReshapeStop) onReshapeStop({x: spring.x.get(), y: spring.y.get(), h: spring.h.get(), w: spring.w.get()});
      }}
      resizeHandleStyles={{
        top: {"cursor": "s-resize"},
        bottom: {"cursor": "s-resize"},
        left: {"cursor": "w-resize"},
        right: {"cursor": "w-resize"},
      }}
    >
      <div
        ref={innerMeasureRef}
        className="window-inner"
      >
        {children}
      </div>
    </AnimatedWindow>
  )
});

AnimatedWindow.propTypes = {
  /** The initial position and size of the window. */
  initial: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    h: PropTypes.number,
    w: PropTypes.number,
  }),
  /** Defines the dragging boundaries. */
  dragBorder: PropTypes.shape({
    top: PropTypes.shape({border: PropTypes.number, reversed: PropTypes.bool}),
    right: PropTypes.shape({border: PropTypes.number, reversed: PropTypes.bool}),
    bottom: PropTypes.shape({border: PropTypes.number, reversed: PropTypes.bool}),
    left: PropTypes.shape({border: PropTypes.number, reversed: PropTypes.bool}),
  }),
  /** Defines the resizing boundaries. */
  resizeBorder: PropTypes.shape({
    top: PropTypes.shape({border: PropTypes.number, reversed: PropTypes.bool}),
    right: PropTypes.shape({border: PropTypes.number, reversed: PropTypes.bool}),
    bottom: PropTypes.shape({border: PropTypes.number, reversed: PropTypes.bool}),
    left: PropTypes.shape({border: PropTypes.number, reversed: PropTypes.bool}),
  }),
  /** Defines the position and size that the window will be animated to. */
  animateTo: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    h: PropTypes.number,
    w: PropTypes.number,
  }),
  /** The z-index of the window. */
  zIndex: PropTypes.number,
  /** Whether the window is hidden. */
  hidden: PropTypes.bool,
  /** Callback function fired when the window is focused. */
  onFocus: PropTypes.func,
  /** Callback function fired when the animateTo animation is started */
  onAnimateStart: PropTypes.func,
  /** Callback function fired when the animateTo animation is stopped */
  onAnimateStop: PropTypes.func,
  /** Callback function fired when the dragging or resizing is started */
  onReshapeStart: PropTypes.func,
  /** Callback function fired when the dragging or resizing is stopped */
  onReshapeStop: PropTypes.func,
}

AnimatedWindow.defaultProps = {
  zIndex: 0,
}

export default AnimatedWindow;