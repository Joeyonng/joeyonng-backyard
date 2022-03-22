import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {CssThree, Javascript, NodeDotJs, Numpy, Python, Pytorch, ReactJs, ScikitLearn} from "@icons-pack/react-simple-icons";
import {CircularBar, Notification, NotificationCenter, Notifications, Widget, Widgets} from "react-big-sur";

import {changeSettings, closeNotification} from "../redux";

import apps from "../apps";
import * as style from "../style";
import "./RightNotificationCenter.scss";
import geiselSun from "../media/images/Geisel-sun.jpg";
import geiselCloud from "../media/images/Geisel-cloud.jpg";

const APP_ID = '0';

function SkillsWidget(props) {
  const {title, labels, values, children} = props;

  return (
    <Widget size="medium">
      <div className="widget grid-widget">
        <div className="widget-title">{title}</div>
        <div className="widget-content">
          {React.Children.toArray(children).filter(Boolean).map((child, index) => (
            <div key={index} className="widget-content-item">
              <CircularBar
                diameter={style.rmPx(style.height3)}
                value={values[index]}
              >
                {child}
              </CircularBar>

              <div className="label">{labels[index]}</div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

function RightNotificationCenter(props) {
  const dispatch = useDispatch();
  const appSettings = useSelector(state => state.settings[APP_ID]);
  const notifications = useSelector(state => state.notifications);

  const notificationCenterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (appSettings.notificationCenterOpen && !appSettings.notificationCenterLock) {
        if (notificationCenterRef.current && !notificationCenterRef.current.contains(event.target))
          dispatch(changeSettings(APP_ID, {notificationCenterOpen: false}));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [appSettings.notificationCenterOpen, appSettings.notificationCenterLock])

  return (
    <div
      ref={notificationCenterRef}
      className="right-notification-center"
    >
      <NotificationCenter
        open={appSettings.notificationCenterOpen}
        notifications={
          <Notifications>
            {Object.entries(notifications).map(([notificationId, notification], index) => (
              <Notification
                key={index}
                id={notificationId}
                headerIcon={<img src={apps[notification.appId].icon} alt="header"/>}
                header={apps[notification.appId].name}
                primary={notification.header}
                secondary={notification.content}
                timeout={3000}
                onTimeout={() => {
                  dispatch(closeNotification(notificationId));
                }}
                onCloseClick={() => {
                  dispatch(closeNotification(notificationId));
                }}
              />
            ))}
          </Notifications>
        }
      >
        <Widgets>
          <Widget size="medium">
            <div
              className="widget image-widget"
              style={{
                backgroundImage: `url(${geiselSun})`
              }}
            >
              <div
                className="widget-title"
                style={{
                  top: style.space3,
                  right: style.space5,
                  textAlign: 'right',
                }}
              >
                <div>BS/MS in Computer Science</div>
                <div>UCSD, 2015-2020</div>
              </div>
            </div>
          </Widget>

          <Widget size="medium">
            <div
              className="widget image-widget"
              style={{
                backgroundImage: `url(${geiselCloud})`
              }}
            >
              <div
                className="widget-title"
                style={{
                  bottom: style.space3,
                  left: style.space5,
                  textAlign: 'left',
                }}
              >
                <div>PhD in Computer Engineering</div>
                <div>UCSD, 2020-current</div>
              </div>
            </div>
          </Widget>

          <SkillsWidget
            title={"Machine Learning"}
            labels={['Python', 'Pytorch', 'Numpy', 'Scikit-learn']}
            values={[90, 75, 80, 85]}
          >
            <Python/>
            <Pytorch/>
            <Numpy/>
            <ScikitLearn/>
          </SkillsWidget>

          <SkillsWidget
            title={"Web Development"}
            labels={['Javascript', 'CSS3', 'React', 'NodeJs']}
            values={[90, 75, 80, 85]}
          >
            <Javascript/>
            <CssThree/>
            <ReactJs/>
            <NodeDotJs/>
          </SkillsWidget>
        </Widgets>
      </NotificationCenter>
    </div>
  )
}

export default RightNotificationCenter;