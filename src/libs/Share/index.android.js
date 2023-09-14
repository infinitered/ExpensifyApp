import ShareMenu from 'react-native-share-menu';
import Navigation from '../Navigation/Navigation';
import isShareExtension from './isShareExtension';
import navigateToShare from './navigateToShare';

const dismiss = (reportID) => {
    Navigation.dismissModal(reportID);
};

const registerListener = () => {
    ShareMenu.getInitialShare(navigateToShare);
    return ShareMenu.addNewShareListener(navigateToShare);
};

export default {
    cleanUpActions: () => [],
    dismiss,
    isShareExtension,
    openApp: () => {},
    registerListener,
};
