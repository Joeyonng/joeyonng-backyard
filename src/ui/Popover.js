import React, {useCallback, useEffect, useRef, useState} from "react";
import {useWindowSize} from "react-use";

import "./Popover.scss"

const SUBMENU_Y_OFFSET = 7;

function Popover(props) {
  const [state, setState] = useState({});
  const {width, height} = useWindowSize();

  const onPopoverRefChange = useCallback(node => {
    if (node) {
      const menuW = node.offsetWidth;
      const menuH = node.offsetHeight;

      if (props.anchorRef !== undefined) {
        const left = props.anchorRef.current.offsetLeft;
        const right = props.anchorRef.current.offsetLeft + props.anchorRef.current.offsetWidth;
        const top = props.anchorRef.current.offsetTop;
        const bottom = props.anchorRef.current.offsetTop + props.anchorRef.current.offsetHeight;

        if (props.anchorDir === 'y') {
          if (width < left + menuW) setState(state => ({...state, left: right - menuW}));
          else setState(state => ({...state, left: left}));
          if (height < top + menuH) setState(state => ({...state, top: top - menuH}));
          else setState(state => ({...state, top: bottom}));
        }
        else {
          if (width < right + menuW) setState(state => ({...state, left: left - menuW}));
          else setState(state => ({...state, left: right}));
          if (height < top + menuH) setState(state => ({...state, top: bottom - menuH + SUBMENU_Y_OFFSET}));
          else setState(state => ({...state, top: top - SUBMENU_Y_OFFSET}));
        }
      }
      else {
        setState(state => ({...state, left: props.pos.x, top: props.pos.y}))

        if (width < props.pos.x + menuW) setState(state => ({...state, left: props.pos.x - menuW}));
        if (height < props.pos.y + menuH) setState(state => ({...state, top: props.pos.y - menuH}));
      }
    }
  }, [props.anchorRef, props.anchorDir, props.pos, width, height]);

  return (
    !props.open ? null :
      <div
        ref={onPopoverRefChange}
        className="popover"
        style={{
          left: state.left,
          top: state.top,
        }}
      >
        {React.Children.map(props.children, (item) =>
          React.cloneElement(item)
        )}
      </div>
  )
}

function AnchorPopover(props) {
  const anchorPopoverRef = useRef(null);
  const anchorRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (anchorPopoverRef.current && !anchorPopoverRef.current.contains(e.target)) {
        if (props.onClose !== undefined) props.onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  })

  return (
    <div
      ref={anchorPopoverRef}
    >
      {React.cloneElement(props.anchor, {
        ref: anchorRef
      })}

      <Popover
        open={props.open}
        anchorRef={anchorRef}
        anchorDir={props.anchorDir}
      >
        {props.children}
      </Popover>
    </div>
  )
}

export {Popover, AnchorPopover};
