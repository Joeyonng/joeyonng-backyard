import React, {forwardRef, useEffect} from 'react';
import PropTypes from "prop-types";
import clsx from "clsx";
import {useSpring, animated} from "react-spring";
import {X} from "react-feather";

import './Notification.scss';

const Notification = forwardRef(function Notification(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {headerIcon, header, primary, secondary, timeout, onTimeout, onCloseClick, ...rootProps} = curProps;

  const [spring, springApi] = useSpring(() => ({
    opacity: 0,
  }))

  useEffect(() => {
    if (onTimeout) {
      const timer = setTimeout(() => onTimeout(), timeout);
      return () => clearTimeout(timer);
    }
  }, [])

  return (
    <div
      {...rootProps}
      ref={ref}
      className="notification"
      onMouseEnter={() => {
        springApi.start({opacity: 1})
      }}
      onMouseLeave={() => {
        springApi.start({opacity: 0})
      }}
    >
      <animated.div
        className="notification-close"
        style={{
          opacity: spring.opacity,
        }}
        onClick={() => {
          if (onCloseClick) onCloseClick();
        }}
      >
        <X/>
      </animated.div>

      <div className="notification-header">
        {React.cloneElement(headerIcon, {
          className: clsx("notification-header-icon", headerIcon.props.className),
        })}

        <div className="notification-header-title">
          {header.toUpperCase()}
        </div>
      </div>

      <div className="notification-content">
        <div className="notification-content-primary">
          {primary}
        </div>

        <div className="notification-content-secondary">
          {secondary}
        </div>
      </div>
    </div>
  )
});

Notification.propTypes = {
  /** The unique identifier used in Notifications. */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** The header icon of the notification. */
  headerIcon: PropTypes.node,
  /** The header of the notification. */
  header: PropTypes.string,
  /** The primary text of the notification. */
  primary: PropTypes.string,
  /** The secondary text of the notification. */
  secondary: PropTypes.string,
  /** If onTimeout is defined, onTimeout will be called after timeout milliseconds. */
  timeout: PropTypes.number,
  /** Callback function fired when the notification times out. Note this function will be called in setTimeout. */
  onTimeout: PropTypes.func,
  /** Callback function fired when the closed button is clicked */
  onCloseClick: PropTypes.func,
}

Notification.defaultProps = {
  timeout: 3000,
}

export default Notification;
