import {ShareMenuReactView} from 'react-native-share-menu';
import Navigation from '../Navigation/Navigation';
import navigateToShare from './navigateToShare';

const registerListener = () => {
    Navigation.isNavigationReady().then(() => {
        ShareMenuReactView.data().then(navigateToShare);
    });
    return {remove: () => {}};
};

export default {
    registerListener,
};
