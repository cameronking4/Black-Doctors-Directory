const SET_MODE = 'SET_MODE';
const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';

export const setMode = data => ({
  type: SET_MODE,
  data,
});

export const setNotifications = data => ({
  type: SET_NOTIFICATIONS,
  data,
});

const initialState = {
  notifications: [],
  mode: 'light',
};

export const app = (state = initialState, action) => {
  switch (action.type) {
    case SET_MODE:
      return {
        ...state,
        mode: 'action.data',
      };
    case SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: [...action.data],
      };
    default:
      return state;
  }
};
