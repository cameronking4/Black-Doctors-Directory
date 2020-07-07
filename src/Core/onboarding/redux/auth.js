const UPDATE_USER = 'UPDATE_USER';
const LOG_OUT = 'LOG_OUT';
const SET_USERS = 'SET_USERS';

export const DUMMY_USER_DATA = {
  id: '3783873893993783',
  profilePictureURL: 'https://firebasestorage.googleapis.com/v0/b/fadr-1533970908846.appspot.com/o/logo.png?alt=media&token=062d4469-7cce-4dea-8646-0462fd375164',
  firstName: 'BlackMD',
  lastName: 'Cares'
};

export const setUsers = data => ({
  type: SET_USERS,
  data,
});

export const setUserData = data => ({
  type: UPDATE_USER,
  data,
});

export const logout = () => ({
  type: LOG_OUT,
});

const initialState = {
  user: DUMMY_USER_DATA,
  users: []
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.data.user,
      };
    case SET_USERS:
      return { ...state, users: [...action.data] };
    case LOG_OUT: {
      return initialState;
    }
    default:
      return state;
  }
};
