import React, {forwardRef, useState} from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";

import "./Popover.scss"

const Popover = forwardRef(function Popover(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {open, pos, anchorEl, anchorOriginX, anchorOriginY, popoverX, popoverY, offset, ...rootProps} = curProps;

  const [state, setState] = useState({
    node: null,
  });

  let x = offset.left ? offset.left : 0;
  let y = offset.top ? offset.top : 0;
  if (state.node) {
    const menuW = state.node.offsetWidth;
    const menuH = state.node.offsetHeight;

    let x0 = 0, y0 = 0, x1 = 0, y1 = 0;

    if (anchorEl) {
      const anchorElRect = anchorEl.getBoundingClientRect();
      x0 = anchorElRect.x;
      y0 = anchorElRect.y;
      x1 = x0 + anchorElRect.width;
      y1 = y0 + anchorElRect.height;
    }
    else if (pos) {
      x0 = pos.left;
      y0 = pos.top;
      x1 = x0;
      y1 = y0;
    }

    if (anchorOriginX === 'left') x += x0;
    else if (anchorOriginX === 'right') x += x1;
    else x += (x0 + x1) / 2;

    if (anchorOriginY === 'top') y += y0;
    else if (anchorOriginY === 'bottom') y += y1;
    else y += (y0 + y1) / 2;

    if (popoverX === 'right') x = x - menuW;
    else if (popoverX === 'middle') x = x - menuW / 2

    if (popoverY === 'bottom') y = y - menuH;
    else if (popoverY === 'middle') y = y - menuH / 2
  }

  return (
    <div
      {...rootProps}
      ref={(node) => {
        ref.current = node;
        if (!isEqual(node, state.node)) setState({...state, node});
      }}
      className="popover"
      style={{
        left: x,
        top: y,
        display: open ? "initial" : "none",
      }}
    >
      {React.Children.toArray(children).filter(Boolean).map((item) =>
        React.cloneElement(item)
      )}
    </div>
  )
});

Popover.propTypes = {
  /** If True, the Popover is shown. */
  open: PropTypes.bool,
  /** The position of the Popover with respect to the view port. */
  pos: PropTypes.shape({left: PropTypes.number, top: PropTypes.number}),
  /** An HTML element. It's used to set the position of the popover. */
  anchorEl: PropTypes.instanceOf(Element),
  /** The x-axis point on the anchor where the popover's anchorEl will attach to. */
  anchorOriginX: PropTypes.oneOf(['left', 'middle', 'right']),
  /** The y-axis point on the anchor where the popover's anchorEl will attach to. */
  anchorOriginY: PropTypes.oneOf(['top', 'middle', 'bottom']),
  /** The x-axis point on the popover which will attach to the anchor's origin. */
  popoverX: PropTypes.oneOf(['left', 'middle', 'right']),
  /** The y-axis point on the popover which will attach to the anchor's origin. */
  popoverY: PropTypes.oneOf(['top', 'middle', 'bottom']),
  /** The offset adjustment to the position of the popover. */
  offset: PropTypes.shape({left: PropTypes.number, top: PropTypes.number}),
}

Popover.defaultProps = {
  open: false,
  anchorOriginX: 'left',
  anchorOriginY: 'bottom',
  popoverX: 'left',
  popoverY: 'top',
  offset: {left: 0, top: 0},
}

export default Popover;