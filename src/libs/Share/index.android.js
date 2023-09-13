import ShareMenu from 'react-native-share-menu';
import Navigation from '../Navigation/Navigation';
import isShareExtension from './isShareExtension';
import navigateToShare from './navigateToShare';
import ROUTES from '../../ROUTES';

const dismiss = (reportID) => {
    Navigation.dismissModal()
    Navigation.navigate(ROUTES.getReportRoute(reportID))
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
