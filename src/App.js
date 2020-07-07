import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import { initialMode, eventEmitter } from 'react-native-dark-mode';
import { setI18nConfig } from './Core/localization/IMLocalization';
import configureStore from './redux/store';
import { AppNavigator } from './navigators/AppNavigation';
import * as RNLocalize from 'react-native-localize';

const store = configureStore();
const useForceUpdate = () => useState()[1];

const App = props => {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    console.disableYellowBox = true;
    setI18nConfig();
    RNLocalize.addEventListener('change', handleLocalizationChange);
    eventEmitter.on('currentModeChanged', mode => {
      setMode(mode);
    });
    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    };
  }, []);

  const handleLocalizationChange = () => {
    setI18nConfig();
    useForceUpdate();
  };

  return (
    <Provider store={store}>
      <AppNavigator screenProps={{ theme: mode }} />
    </Provider>
  );
};

App.propTypes = {};

App.defaultProps = {};

AppRegistry.registerComponent('App', () => App);

export default App;
