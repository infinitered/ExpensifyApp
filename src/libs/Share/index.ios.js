import {ShareMenuReactView} from 'react-native-share-menu';
import Navigation from '../Navigation/Navigation';
import navigateToShare from './navigateToShare';

const dismiss = () => ShareMenuReactView.dismissExtension();

const registerListener = () => {
    Navigation.isNavigationReady().then(() => {
        ShareMenuReactView.data().then(navigateToShare);
    });
    return {remove: () => {}};
};

export default {
    dismiss,
    isShareExtension: ShareMenuReactView.isExtension,
    openApp: ShareMenuReactView.openApp,
    registerListener,
};
