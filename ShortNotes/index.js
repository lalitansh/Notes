/**
 * @format
 */

//import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => ReduxTutorial);
import {Provider} from 'react-redux';
import configureStore from './src/store'
import React from 'react';
const store = configureStore();

const ReduxTutorial = () =>
<Provider store= {store}>
  <App/>
</Provider>
