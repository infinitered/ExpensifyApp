/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import App from './src/App';
import Config from './src/CONFIG';
import additionalAppSetup from './src/setup';

AppRegistry.registerComponent(Config.APP_NAME, () => App);
AppRegistry.registerComponent('ShareMenuModuleComponent', () => App);
additionalAppSetup();
