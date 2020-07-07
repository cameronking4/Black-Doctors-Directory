import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {createReactNavigationReduxMiddleware} from 'react-navigation-redux-helpers';
import appReducer from '../reducers';

// instantiate logger middleware
const logger = createLogger();
const middleware = createReactNavigationReduxMiddleware(state => state.nav);

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const configureStore = () =>
  createStore(
    appReducer,
    composeEnhancers(applyMiddleware(thunk, middleware)),
    // composeEnhancers(applyMiddleware(thunk, logger, middleware)),
  );

export default configureStore;
