import apps from "./apps";

// Action types
const START_WINDOW = 'START_WINDOW';
const CLOSE_WINDOW = 'CLOSE_WINDOW';
const FOCUS_WINDOW = 'FOCUS_WINDOW';
const SWITCH_WINDOW = 'SWITCH_WINDOW';
const RESHAPE_WINDOW = 'RESHAPE_WINDOW';
const MINIMIZE_WINDOW = 'MINIMIZE_WINDOW';
const MAXIMIZE_WINDOW = 'MAXIMIZE_WINDOW';
const UPDATE_WINDOW = 'UPDATE_WINDOW';
const CHANGE_WINDOW_DATA = 'CHANGE_WINDOW_DATA';
const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
const PUSH_NOTIFICATION = 'PUSH_NOTIFICATION';
const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

// Actions
const startWindow = (appId) => ({
  type: START_WINDOW,
  payload: {appId},
})
const closeWindow = (windowId) => ({
  type: CLOSE_WINDOW,
  payload: {windowId},
})
const focusWindow = (windowId) => ({
  type: FOCUS_WINDOW,
  payload: {windowId},
})
const switchWindow = (windowId) => ({
  type: SWITCH_WINDOW,
  payload: {windowId},
})
const reshapeWindow = (windowId, newShape) => ({
  type: RESHAPE_WINDOW,
  payload: {windowId, newShape},
})
const minimizeWindow = (windowId) => ({
  type: MINIMIZE_WINDOW,
  payload: {windowId},
})
const maximizeWindow = (windowId) => ({
  type: MAXIMIZE_WINDOW,
  payload: {windowId},
})
const updateWindow = (windowId, changes) => ({
  type: UPDATE_WINDOW,
  payload: {windowId, changes},
})
const changeWindowData = (windowId, changes) => ({
  type: CHANGE_WINDOW_DATA,
  payload: {windowId, changes},
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
  focusedId: '0',
  windows: {
  },
  settings: {
    '0': {
      volume: 0,
      weather: 'sun',
      background: 'weather',
      notificationCenterOpen: true,
      notificationCenterLock: false,
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

let nextZIndex = Object.keys(defaultState.windows).length;
let nextNotificationId = Object.keys(defaultState.notifications).length;

const getFocusWindowId = (windows) => {
  let focusedWindowId = 0;
  const windowsArray = Object.entries(windows);
  if (windowsArray.length !== 0) {
    const [windowId, window] = windowsArray.sort(([_, window1], [__, window2]) =>
      window2.zIndex - window1.zIndex
    ).find(([___, window]) => !window.min);

    if (windowId !== undefined) focusedWindowId = windowId;
  }

  return String(focusedWindowId);
};

const getNextWindowId = (windows) => {
  const windowIds = Object.keys(windows);
  if (windowIds.length === 0) return 'win_0';

  const windowIdsNum = windowIds.map(windowId => Number(windowId.split('_')[1]));
  const nextWindowIdNum = Math.max(...windowIdsNum) + 1;

  return `win_${nextWindowIdNum}`;
}

const getNextWindowShape = (settings, appId) => {
  const shape = settings[appId]?.shape;

  if (shape) return {...shape, x: shape.x + 28, y: shape.y + 28};
  else return {x: 100, y: 100, h: apps[appId].size.h, w: apps[appId].size.w};
}

function reducer(state=defaultState, action) {
  switch (action.type) {
    case START_WINDOW: {
      const {appId} = action.payload;

      const nextWindowId = getNextWindowId(state.windows)
      const nextWindowShape = getNextWindowShape(state.settings, appId);
      return {
        ...state,
        focusedId: nextWindowId,
        windows: {
          ...state.windows,
          [nextWindowId]: {
            ...state.windows[nextWindowId],
            data: {},
            appId: appId,
            min: false,
            max: false,
            shape: nextWindowShape,
            zIndex: nextZIndex++,
          }
        },
        settings: {
          ...state.settings,
          [appId]: {
            ...state.settings[appId],
            shape: nextWindowShape,
          }
        }
      }
    }
    case CLOSE_WINDOW: {
      const {windowId} = action.payload;

      if (!state.windows[windowId]) {
        return {
          ...state
        };
      }

      let newWindows = {...state.windows};
      delete newWindows[windowId];

      const focusedId = getFocusWindowId(newWindows);
      return {
        ...state,
        focusedId: focusedId,
        windows: focusedId === '0' ? {...newWindows} : {
          ...newWindows,
          [focusedId]: {
            ...newWindows[focusedId],
            zIndex: nextZIndex++,
          }
        },
      };
    }
    case FOCUS_WINDOW: {
      const {windowId} = action.payload;

      if (!state.windows[windowId]) {
        return {
          ...state,
          focusedId: 0,
        }
      }

      return {
        ...state,
        focusedId: windowId,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            zIndex: nextZIndex++,
          }
        },
      };
    }
    case SWITCH_WINDOW: {
      const {windowId} = action.payload;

      if (!state.windows[windowId]) {
        return {
          ...state,
          focusedId: 0,
        }
      }

      return {
        ...state,
        focusedId: windowId,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            min: false,
            zIndex: nextZIndex++,
          }
        },
      };
    }
    case RESHAPE_WINDOW: {
      const {windowId, newShape} = action.payload;

      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            shape: newShape,
            max: false,
          },
        },
        settings: {
          ...state.settings,
          [state.windows[windowId].appId]: {
            ...state.settings[state.windows[windowId].appId],
            shape: newShape,
          }
        }
      };
    }
    case MINIMIZE_WINDOW: {
      const {windowId} = action.payload;

      return {
        ...state,
        focusedId: windowId,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            min: !state.windows[windowId].min,
          },
        },
      };
    }
    case MAXIMIZE_WINDOW: {
      const {windowId} = action.payload;

      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            max: !state.windows[windowId].max,
          },
        },
      };
    }
    case UPDATE_WINDOW: {
      const {windowId, changes} = action.payload;

      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            ...changes,
          },
        },
      };
    }
    case CHANGE_WINDOW_DATA: {
      const {windowId, changes} = action.payload;

      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            data: {
              ...state.windows[windowId].data,
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
  startWindow, closeWindow, focusWindow, switchWindow,
  reshapeWindow, minimizeWindow, maximizeWindow, updateWindow,
  changeWindowData, changeSettings, pushNotification, closeNotification
};
