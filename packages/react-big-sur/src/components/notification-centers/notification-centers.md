### `NotificationCenter` implements the basic [Notifications][1] and [Widgets][2].
[1]: https://developer.apple.com/design/human-interface-guidelines/macos/system-capabilities/notifications/
[2]: https://developer.apple.com/design/human-interface-guidelines/widgets/overview/introduction/

The `NotificationCenter` consists of two parts: `Notifications` and `Widgets`, which consists of `Notification`s and 
`Widget`s, respectively. The position and the height of the `NotificationCenter` is controlled by its container element
and the prop `left`. By default, `NotificationCenter` will appear on the right side of the container element. If `left` 
prop is set, then it appears at left side. Since 

```jsx
import {useState} from "react";
import {PushButton, NotificationCenter, Notifications, Notification, Widgets, Widget} from "react-big-sur";
import {settings} from "icons";

const [open, setOpen] = useState(true);
const [notifications, setNotifications] = useState({});
const [nextId, setNextId] = useState(0);

const deleteNotification = (prevNotifications, notificationId) => {
  let newNotifications = {...prevNotifications};
  delete newNotifications[notificationId];
  return newNotifications;
}

<div className="canvas background">
  <div className="row">
    <PushButton onClick={() => setOpen(!open)}>
      Toggle Notification Center
    </PushButton>

    <PushButton
      onClick={() => {
        setNextId(nextId + 1);
        let newNotifications = {...notifications};
        newNotifications[nextId] = {
          id: nextId,
          headerIcon: <img src={settings}/>,
          header: "header",
          primary: "I am a primary text.",
          secondary: "I am a secondary text.",
        };
        setNotifications(newNotifications);
      }}
    >
      Add notification
    </PushButton>
  </div>

  <div
    style={{
      height: "80%",
      position: "absolute",
      right: 0,
    }}
  >
    <NotificationCenter
      open={open}
      notifications={
        <Notifications>
          {Object.values(notifications).map((notification, index) => (
            <Notification
              key={notification.id}
              id={notification.id}
              headerIcon={notification.headerIcon}
              header={notification.header}
              primary={notification.primary}
              secondary={notification.secondary}
              onTimeout={() => {
                setNotifications(prevNotifications =>
                  deleteNotification(prevNotifications, notification.id)
                );
              }}
              onCloseClick={() => {
                setNotifications(deleteNotification(notifications, notification.id));
              }}
            />
          ))}
        </Notifications>
      }
    >
      <Widgets>
        {['medium', 'small', 'large', 'small', 'small', 'medium'].map((size, index) => (
          <Widget
            key={index}
            size={size}
          >
            <div style={{width: "100%", height: "100%", backgroundColor: "grey"}}/>
          </Widget>
        ))}
      </Widgets>
    </NotificationCenter>
  </div>
</div>
```

The `Notifications` can be used separately. You can customize the way it enters.

```jsx
import {useState} from "react";
import {PushButton, Notifications, Notification} from "react-big-sur";
import {settings} from "icons";

const [notifications, setNotifications] = useState({});
const [nextId, setNextId] = useState(0);

const deleteNotification = (prevNotifications, notificationId) => {
  let newNotifications = {...prevNotifications};
  delete newNotifications[notificationId];
  return newNotifications;
}

<div className="row">
  <PushButton
    onClick={() => {
      setNextId(nextId + 1);
      let newNotifications = {...notifications};
      newNotifications[nextId] = {
        id: nextId,
        headerIcon: <img src={settings}/>,
        header: "header",
        primary: "I am a primary text.",
        secondary: "I am a secondary text.",
      };
      setNotifications(newNotifications);
    }}
  >
    Add notification
  </PushButton>

  <Notifications
    horizontal="right"
    vertical="top"
  >
    {Object.values(notifications).map((notification) => (
      <Notification
        key={notification.id}
        id={notification.id}
        headerIcon={notification.headerIcon}
        header={notification.header}
        primary={notification.primary}
        secondary={notification.secondary}
        onCloseClick={() => {
          setNotifications(deleteNotification(notifications, notification.id));
        }}
        onTimeout={() => {
          setNotifications(prevNotifications =>
            deleteNotification(prevNotifications, notification.id)
          );
        }}
      />
    ))}
  </Notifications>
</div>
```