import React, {forwardRef, Fragment} from 'react';
import PropTypes from "prop-types";
import {useEnsuredForwardedRef} from "react-use";
import {useSpring, animated} from "react-spring";

import './NotificationCenter.scss';
import * as style from "../../style";

const NotificationCenter = forwardRef(function NotificationCenter(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {open, left, fadingHeight, notifications, ...rootProps} = curProps;

  const notificationCenterRef = useEnsuredForwardedRef(ref);
  const spring = useSpring({
    shift: open ? 0 : style.delPx(style.widgetsWidth),
  });

  // TODO: Now the blur background height is fixed to be the same height of the given parent.
  // However, the ideal situation is that the height should be the same as the content of the notification center.
  // I have tried the following solutions, but none of them work:
  // 1. Put the "notification-center-background" as the child of "notification-center" and makes "notifications-container"
  //  and "widgets-container" as the children of "notification-center-background", but because of the Chrome bug mentioned
  //  in NotificationCenter.scss file, the backdrop-filter property won't work under the div that has -webkit-mask property.
  // 2. Use a ref to capture the height of the content and set the background height using Javascript. Since react-spring
  //  in the notifications component doesn't rerender while animating, the height obtained from the ref is not update-to-date.
  return(
    <Fragment>
      <animated.div
        className="notification-center-background"
        style={{
          left: left ? spring.shift.to(x => `${-x}px`) : 'auto',
          right: left ? "auto" : spring.shift.to(x => `${-x}px`),
          padding: `${style.delPx(style.widgetGap) / 2 + fadingHeight}px ${style.widgetGap}`,
          display: spring.shift.to(x => x === style.delPx(style.widgetsWidth) ? "none" : "initial")
        }}
      />

      <animated.div
        {...rootProps}
        ref={notificationCenterRef}
        className="notification-center"
        style={{
          left: left ? 0 : "auto",
          right: left ? "auto" : 0,
          padding: `${style.delPx(style.widgetGap) / 2 + fadingHeight}px ${style.widgetGap}`,

          // Enable click through widgets when hidden
          pointerEvents: open ? "auto" : "none",
          // Top/bottom content fading
          WebkitMask: `linear-gradient(to bottom, ` +
            `${style.rgba(style.white, 0)} ${style.delPx(style.widgetGap) / 2}px, ` +
            `${style.rgba(style.white, 1)} ${style.delPx(style.widgetGap) / 2 + fadingHeight}px, ` +
            `${style.rgba(style.white, 1)} calc(100% - ${style.delPx(style.widgetGap) / 2 + fadingHeight}px), ` +
            `${style.rgba(style.white, 0)} calc(100% - ${style.delPx(style.widgetGap) / 2}px)`,
          Mask: `linear-gradient(to bottom, ` +
            `${style.rgba(style.white, 0)} ${style.delPx(style.widgetGap) / 2}px, ` +
            `${style.rgba(style.white, 1)} ${style.delPx(style.widgetGap) / 2 + fadingHeight}px, ` +
            `${style.rgba(style.white, 1)} calc(100% - ${style.delPx(style.widgetGap) / 2 + fadingHeight}px), ` +
            `${style.rgba(style.white, 0)} calc(100% - ${style.delPx(style.widgetGap) / 2}px)`,
        }}
      >
        {!notifications ? null :
          React.cloneElement(notifications, {
            horizontal: left ? "left" : "right",
          })
        }

        <animated.div
          className="widgets-container"
          style={{
            left: left ? spring.shift.to(x => `${-x}px`) : 'auto',
            right: left ? "auto" : spring.shift.to(x => `${-x}px`),
            display: spring.shift.to(x => x === style.delPx(style.widgetsWidth) ? "none" : "initial")
          }}
        >
          {children}
        </animated.div>
      </animated.div>
    </Fragment>
  )
});

NotificationCenter.propTypes = {
  /** If True, NotificationCenter is visible. */
  open: PropTypes.bool,
  /** If True, NotificationCenter will appear on the left. */
  left: PropTypes.bool,
  /** The height of the fading parts at the start and end of the widget list. */
  fadingHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The Notifications component. */
  notifications: PropTypes.node,
}

NotificationCenter.defaultProps = {
  fadingHeight: 8,
}

export default NotificationCenter;