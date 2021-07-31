// Action types
const START_APP = 'START_APP';
const CLOSE_APP = 'CLOSE_APP';
const FOCUS_APP = 'FOCUS_APP';
const SWITCH_APP = 'SWITCH_APP';
const RESTORE_APP = 'RESTORE_APP';
const MINIMIZE_APP = 'MINIMIZE_APP';
const MAXIMIZE_APP = 'MAXIMIZE_APP';
const CHANGE_APP_DATA = 'CHANGE_APP_DATA';
const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
const PUSH_NOTIFICATION = 'PUSH_NOTIFICATION';
const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

// Actions
const startApp = (appId) => ({
  type: START_APP,
  payload: {appId},
})
const closeApp = (appId) => ({
  type: CLOSE_APP,
  payload: {appId},
})
const focusApp = (appId) => ({
  type: FOCUS_APP,
  payload: {appId},
})
const switchApp = (appId) => ({
  type: SWITCH_APP,
  payload: {appId},
})
const restoreApp = (appId) => ({
  type: RESTORE_APP,
  payload: {appId},
})
const minimizeApp = (appId) => ({
  type: MINIMIZE_APP,
  payload: {appId},
})
const maximizeApp = (appId) => ({
  type: MAXIMIZE_APP,
  payload: {appId},
})
const changeAppData = (appId, changes) => ({
  type: CHANGE_APP_DATA,
  payload: {appId, changes},
})
const changeSettings = (appId, changes) => ({
  type: CHANGE_SETTINGS,
  payload: {appId, changes},
})
const pushNotification = (appId, header, content, persistent) => ({
  type: PUSH_NOTIFICATION,
  payload: {appId, header, content, persistent},
})
const closeNotification = (notificationId) => ({
  type: CLOSE_NOTIFICATION,
  payload: {notificationId},
})

// Reducers
let defaultState = {
  focusedId: '-1',
  apps: {
    '0': {
      data: {},
      appId: '0',
      zIndex: 0,
      windowState: 0,
    },
  },
  settings: {
    '-1': {
      volume: 0,
      weather: 'sun',
      background: 'wallpaper',
    },
    '2': {
      mediaAlign: 'center',
      displaySource: 'auto',
      displayOutput: 'auto',
    },
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
    const app = appsArray.sort((a, b) => b.zIndex - a.zIndex).find(app => app.windowState !== 1);
    if (app !== undefined) focusedId = app.appId;
  }
  return String(focusedId);
};

function reducer(state=defaultState, action) {
  switch (action.type) {
    case START_APP: {
      const {appId} = action.payload;

      if (state.apps[appId]) {
        return {
          ...state
        };
      }

      return {
        ...state,
        focusedId: appId,
        apps: {
          ...state.apps,
          [appId]: {
            ...state.apps[appId],
            data: {},
            appId: appId,
            zIndex: nextZIndex++,
            windowState: 0,
          }
        }
      }
    }
    case CLOSE_APP: {
      const {appId} = action.payload;

      if (!state.apps[appId]) {
        return {
          ...state
        };
      }

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
    case FOCUS_APP: {
      const {appId} = action.payload;

      if (!state.apps[appId]) {
        return {
          ...state,
          focusedId: -1,
        }
      }

      return {
        ...state,
        focusedId: appId,
        apps: {
          ...state.apps,
          [appId]: {
            ...state.apps[appId],
            zIndex: nextZIndex++,
          }
        },
      };
    }
    case SWITCH_APP: {
      const {appId} = action.payload;

      if (!state.apps[appId]) {
        return reducer(state, startApp(appId));
      }
      else if(state.apps[appId].windowState !== 1) {
        return reducer(state, focusApp(appId));
      }
      else {
        return reducer(state, minimizeApp(appId));
      }
    }
    case RESTORE_APP: {
      const {appId} = action.payload;

      return {
        ...state,
        apps: {
          ...state.apps,
          [appId]: {
            ...state.apps[appId],
            windowState: 0,
          },
        },
      };
    }
    case MINIMIZE_APP: {
      const {appId} = action.payload;

      return {
        ...state,
        focusedId: appId,
        apps: {
          ...state.apps,
          [appId]: {
            ...state.apps[appId],
            zIndex: nextZIndex++,
            windowState: state.apps[appId].windowState === 1 ? 2 : 1,
          },
        },
      };
    }
    case MAXIMIZE_APP: {
      const {appId} = action.payload;

      return {
        ...state,
        apps: {
          ...state.apps,
          [appId]: {
            ...state.apps[appId],
            windowState: state.apps[appId].windowState === 3 ? 2 : 3,
          },
        },
      };
    }
    case CHANGE_APP_DATA: {
      const {appId, changes} = action.payload;

      return {
        ...state,
        apps: {
          ...state.apps,
          [appId]: {
            ...state.apps[appId],
            data: {
              ...state.apps[appId].data,
              ...changes,
            }
          }
        }
      }
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
  startApp, closeApp, focusApp, switchApp,
  minimizeApp, maximizeApp, restoreApp,
  changeAppData, changeSettings, pushNotification, closeNotification
};
