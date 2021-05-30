// Action types
const START_APP = 'START_APP';
const CLOSE_APP = 'CLOSE_APP';
const MINIMIZE_APP = 'MINIMIZE_APP';
const FOCUS_APP = 'FOCUS_APP';
const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
const PUSH_NOTIFICATION = 'PUSH_NOTIFICATION';
const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

// Actions
const startApp = (appId) => ({
  type: START_APP,
  payload: {appId}
})
const closeApp = (appId) => ({
  type: CLOSE_APP,
  payload: {appId}
})
const minimizeApp = (appId) => ({
  type: MINIMIZE_APP,
  payload: {appId}
})
const focusApp = (appId) => ({
  type: FOCUS_APP,
  payload: {appId}
})
const changeSettings = (appId, changes) => ({
  type: CHANGE_SETTINGS,
  payload: {appId, changes}
})
const pushNotification = (appId, header, content, persistent) => ({
  type: PUSH_NOTIFICATION,
  payload: {appId, header, content, persistent}
})
const closeNotification = (notificationId) => ({
  type: CLOSE_NOTIFICATION,
  payload: {notificationId}
})

// Reducers
let defaultState = {
  focusedId: '-1',
  apps: {
    '0': {
      appId: '0',
      minimized: false,
      zIndex: 0,
    },
  },
  settings: {
    '-1': {
      volume: 0,
      weather: 'sun',
      background: 'wallpaper',
    },
    '0': {

    },
    '1': {
      input: null,
      mediaAlign: 'center',
      displaySource: 'auto',
      displayOutput: 'auto',
    }
  },
  notifications: {
  },
}

let nextNotificationId = Object.keys(defaultState.notifications).length;
let nextZIndex = Object.keys(defaultState.apps).length;
const getFocusId = (apps) => {
  let focusedId = -1;
  const appsArray = Object.values(apps);
  if (appsArray.length !== 0) {
    const app = appsArray.sort((a, b) => b.zIndex - a.zIndex).find(app => !app.minimized);
    if (app !== undefined) focusedId = app.appId;
  }
  return String(focusedId);
};

function reducer(state=defaultState, action) {
  switch (action.type) {
    case START_APP: {
      const {appId} = action.payload;

      return {
        ...state,
        focusedId: appId,
        apps: {
          ...state.apps,
          [appId]: {
            ...state.apps[appId],
            appId: appId,
            minimized: false,
            zIndex: nextZIndex++,
          }
        }
      }
    }
    case FOCUS_APP: {
      const {appId} = action.payload;

      return {
        ...state,
        focusedId: appId,
        apps: {
          ...state.apps,
          [appId]: {
            ...state.apps[appId],
            minimized: false,
            zIndex: nextZIndex++,
          }
        },
      };
    }
    case CLOSE_APP: {
      const {appId} = action.payload;

      let newApps = {...state.apps};
      delete newApps[appId];

      const focusedId = getFocusId(newApps);
      return {
        ...state,
        focusedId: focusedId,
        apps: focusedId === '-1' ? {...newApps} : {
          ...newApps,
          [focusedId]: {
            ...newApps[focusedId],
            zIndex: nextZIndex++,
          }
        },
      };
    }
    case MINIMIZE_APP: {
      const {appId} = action.payload;

      return {
        ...state,
        apps: {
          ...state.apps,
          [appId]: {
            ...state.apps[appId],
            minimized: true,
          },
        },
      };
    }
    case CHANGE_SETTINGS: {
      const {appId, changes} = action.payload;

      return {
        ...state,
        settings: {
          ...state.settings,
          [appId]: {
            ...state.settings[appId],
            ...changes,
          }
        }
      }
    }
    case PUSH_NOTIFICATION: {
      const {appId, header, content, persistent} = action.payload;

      const notificationId = String(nextNotificationId++);
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [notificationId]: {
            appId: appId,
            header: header,
            content: content,
            persistent: persistent,
            notificationId: notificationId,
          },
        }
      }
    }
    case CLOSE_NOTIFICATION: {
      const {notificationId} = action.payload;

      let newNotifications = {...state.notifications};
      delete newNotifications[notificationId];

      return {
        ...state,
        notifications: {
          ...newNotifications,
        }
      }
    }
    default:
      return state;
  }
}

export {
  reducer,
  startApp, closeApp, focusApp, minimizeApp,
  changeSettings,
  pushNotification, closeNotification
};
