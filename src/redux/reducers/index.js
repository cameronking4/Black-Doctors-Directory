import { combineReducers } from "redux";
import { createNavigationReducer } from "react-navigation-redux-helpers";
import { RootNavigator } from "../../navigators/AppNavigation";
import { app } from "./app";
import { auth } from "../../Core/onboarding/redux/auth";
import { chat } from "../../Core/chat/redux";
import { userReports } from "../../Core/user-reporting/redux";

const LOG_OUT = "LOG_OUT";

const navReducer = createNavigationReducer(RootNavigator);

// combine reducers to build the state
const appReducer = combineReducers({
  nav: navReducer,
  auth,
  app,
  chat,
  userReports
});

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
