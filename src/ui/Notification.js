import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {useSpring, animated} from "react-spring";
import XSvg from "feather-icons/dist/icons/x.svg";

import {closeNotification} from "../redux";

import './Notification.scss';

function Notification(props) {
  const dispatch = useDispatch();
  const [spring, setSpring] = useSpring(() => ({
    opacity: 0,
  }))

  useEffect(() => {
    if (!props.persistent) {
      setTimeout(() => {
        dispatch(closeNotification(props.notificationId))
      }, 3000)
    }
  }, [dispatch, props.notificationId, props.persistent])

  return (
    <div
      className="notification"
      onMouseEnter={() => {
        setSpring({opacity: 1})
      }}
      onMouseLeave={() => {
        setSpring({opacity: 0})
      }}
    >
      <animated.div
        className="notification-close"
        style={{
          opacity: spring.opacity,
        }}
        onClick={() => {
          dispatch(closeNotification(props.notificationId))
        }}
      >
        <img src={XSvg} alt=""/>
      </animated.div>


      <div className="notification-header">
        {React.cloneElement(props.headerIcon, {
          className: "notification-header-icon",
        })}

        <div className="notification-header-title">
          {props.header.toUpperCase()}
        </div>
      </div>

      <div className="notification-content">
        <div className="notification-content-primary">
          {props.primary}
        </div>

        <div className="notification-content-secondary">
          {props.secondary}
        </div>
      </div>
    </div>
  )
}

export default Notification;
