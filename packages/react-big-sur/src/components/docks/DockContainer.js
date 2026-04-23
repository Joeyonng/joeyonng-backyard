import React, {forwardRef, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useSpring, useTransition, animated} from "react-spring";
import {useEnsuredForwardedRef} from "react-use";
import {create, all} from 'mathjs'

import DockItem from "./DockItem";
import DockDivider from "./DockDivider";

import "./DockContainer.scss"
import * as style from "../../style";

const math = create(all, {matrix: 'Array'});

const DockContainer = forwardRef(function DockContainer(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {baseSize, largeSize, spreading, horizontal, magnifyDirection, debug, ...rootProps} = curProps;

  const getPercents = (cursorRel, scales) => {
    const distances = math.abs(math.subtract(scales, cursorRel));
    const percents = math.subtract(1, math.divide(distances, baseSizeMargin * spreading));
    const percentsClip = percents.map(x => x < 0 ? 0 : x);

    return percentsClip;
  }

  const getDockItemWidths = (cursorRel) => {
    if (cursorRel === null) return itemSizes;

    const magPercents = math.multiply(getPercents(cursorRel, scales), magnifier);
    const itemPercents = ranges.map((range, index) =>
      index !== 0 ? magPercents.slice(ranges[index - 1], range) : magPercents.slice(0, range));
    const itemWidths = math.add(math.apply(itemPercents, 1, math.sum), itemSizes);

    return itemWidths
  }

  const getDockWidth = (cursorRel=null) => {
    return math.sum(getDockItemWidths(cursorRel));
  }

  const getDockOffset = (cursorRel, left) => {
    const nonMagnifiedDockWidth = getDockWidth();
    const endMagnifiedDockWidth = getDockWidth(0);
    const maxOffset = endMagnifiedDockWidth - nonMagnifiedDockWidth;
    if (cursorRel === null) return maxOffset;

    const maxMagnifiedDockWidth = nonMagnifiedDockWidth + maxOffset * 2;
    const midMagnifiedDockWidth = getDockWidth(nonMagnifiedDockWidth / 2);
    const curDockOffset = math.abs(maxMagnifiedDockWidth - getDockWidth(cursorRel));
    const midDockOffset = math.abs(maxMagnifiedDockWidth - midMagnifiedDockWidth);

    const cursorMid = cursorRel / nonMagnifiedDockWidth - 0.5;
    const offset1 = (1 - math.abs(cursorMid) * 2) * midDockOffset / 2;
    const offset2 = curDockOffset - offset1;
    const dockOffset = (left && cursorMid < 0) || (!left && cursorMid >= 0) ? offset2 : offset1;

    return dockOffset
  }

  /*
  const getCursorRel = (cursor) => {
    if (!dockRef.current || cursor === null) return null;
    const dockRect = dockRef.current.getBoundingClientRect();

    const cursorRel = cursor - (horizontal ? dockRect.x : dockRect.y) - getDockOffset(null, true)
    return cursorRel < 0 || cursorRel > getDockWidth(null) ? null : cursorRel;
  }
   */

  const getCursorRel = (cursor) => {
    if (!dockRef.current || cursor === null) return null;
    const dockRect = dockRef.current.getBoundingClientRect();

    // Assuming dock is always anchored in the center
    const middle = (horizontal ? (2 * dockRect.x + dockRect.width) : (2 * dockRect.y + dockRect.height)) / 2;
    const cursorRel = cursor - middle + getDockWidth() / 2;
    return cursorRel < 0 || cursorRel > getDockWidth(null) ? null : cursorRel;
  }


  const baseSizeMargin = baseSize + baseSize / 16;
  const dockItems = React.Children.toArray(children).filter(item => item && (item.type === DockItem || item.type === DockDivider))
  const itemSizes = dockItems.map(item => item.type === DockItem ? baseSizeMargin : baseSize * 0.5625);

  // Only update when itemSizes changed to increase performance
  const [scales, ranges] = useMemo(() => {
    const cumItems = [];
    itemSizes.reduce((value, prevValue, index) => cumItems[index] = value + prevValue, 0);

    const scales = math.range(0, getDockWidth(), 1);
    const ranges = cumItems.map((x) => {
      const larger = math.compare(x, scales);
      return larger.includes(-1) ? larger.indexOf(-1) : scales.length;
    })

    return [scales, ranges]
  }, [JSON.stringify(itemSizes)])

  const largeSizeMargin = largeSize + largeSize / 16;
  const percents = getPercents(baseSizeMargin / 2, math.range(0, baseSizeMargin, 1));
  const magnifier = (largeSizeMargin - baseSizeMargin) / math.sum(percents);

  const [state, setState] = useState({
    cursor: null,
  });

  const dockRef = useEnsuredForwardedRef(ref);
  const dockCenterRef = useRef();

  // useSpring for magnifying animation
  const getSpringObject = (cursor) => {
    const cursorRel = getCursorRel(cursor);
    const dockItemSizes = getDockItemWidths(cursorRel);

    let config;
    if (dockCenterRef.current) {
      const curWidth = horizontal ? dockCenterRef.current.offsetWidth : dockCenterRef.current.offsetHeight;
      const duration = math.abs(getDockWidth(cursorRel) - curWidth) / 2;
      config = {duration};
    }

    return {
      ...Object.assign(...dockItems.map((item, index) => ({[item.props.id]: dockItemSizes[index]}))),
      offsetLeft: getDockOffset(cursorRel, true),
      offsetRight: getDockOffset(cursorRel, false),
      config: config,
    };
  }
  const spring = useSpring(getSpringObject(state.cursor));

  // useTransition for entering/leaving animation
  const springTransitions = useTransition(dockItems.map(item => item), {
    keys: item => item.props.id,
    from: () => ({scale: 0}),
    enter: () => ({scale: 1}),
    leave: () => ({scale: 0}),
    onStart: (result, spring, item) => {
      if (item.props.onAnimateStart) item.props.onAnimateStart('inOut', result.value.scale);
    },
    onRest: (result, spring, item) => {
      if (item.props.onAnimateStop) item.props.onAnimateStop('inOut', result.value.scale);
    },
    config: {duration: 100},
  });

  return(
    <div
      {...rootProps}
      ref={dockRef}
      className="dock-container"
      style={{
        flexDirection: horizontal ? "row" : "column",
      }}
    >
      <animated.div
        style={{
          width: horizontal ? spring.offsetLeft : "auto",
          height: !horizontal ? spring.offsetLeft : "auto",
          backgroundColor: style.rgba(style.red, debug ? 0.5 : 0),
        }}
      />

      <div
        ref={dockCenterRef}
        className="dock-center"
        style={{
          borderRadius: baseSize / 3,
          ...[{
            width: baseSizeMargin + 8,
            flexDirection: "column",
          }, {
            height: baseSizeMargin + 8,
            flexDirection: "row",
          }][Number(horizontal)],
          ...{
            'center': {alignItems: 'center'},
            'primary': {alignItems: 'end'},
            'secondary': {alignItems: 'start'},
          }[magnifyDirection],
        }}
        onMouseMove={(event) => {
          const cursor = horizontal ? event.clientX : event.clientY;
          setState({...state, cursor: cursor})
        }}
        onMouseLeave={(event) => {
          setState({...state, cursor: null});
        }}
      >
        <div
          className="dock-center-background"
          style={{
            borderRadius: baseSize / 3,
          }}
        />

        {springTransitions((springTransition, item) => React.cloneElement(item, {
          size: spring[item.props.id].to(size => size),
          scale: springTransition.scale,
          baseSize,
          horizontal,
          magnifyDirection,
          debug,
        }))}
      </div>

      <animated.div
        style={{
          width: horizontal ? spring.offsetRight : "auto",
          height: !horizontal ? spring.offsetRight : "auto",
          backgroundColor: style.rgba(style.red, debug ? 0.5 : 0),
        }}
      />
    </div>
  );
});

DockContainer.propTypes = {
  /** The unmagnified size of the item. Suggested ranges: [16, 128]. */
  baseSize: PropTypes.number,
  /** The magnified size of the item. Suggested ranges: [16, 128]. */
  largeSize: PropTypes.number,
  /** The magnified radius. The nearest `spreading * baseSize` number of pixels will be magnified. */
  spreading: PropTypes.number,
  /** Whether DockContainer will be horizontal or vertical. */
  horizontal: PropTypes.bool,
  /** The direction of the magnification. */
  magnifyDirection: PropTypes.oneOf(['primary', 'secondary', 'center']),
  /** Debug mode. */
  debug: PropTypes.bool,
}

DockContainer.defaultProps = {
  baseSize: 64,
  largeSize: 128,
  spreading: 3,
  horizontal: true,
  magnifyDirection: 'primary',
  debug: false,
}

export default DockContainer;