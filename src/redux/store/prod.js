import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";
import appReducer from "../reducers";

const middleware = createReactNavigationReduxMiddleware(state => state.nav);

/**
 * Creates the store applying Redux Thunk middleware.
 * @returns {Object} The Redux store.
 */
const configureStore = () =>
  createStore(appReducer, applyMiddleware(thunk, middleware));

export default configureStore;
