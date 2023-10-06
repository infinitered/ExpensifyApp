import ShareMenu from 'react-native-share-menu';
import isShareExtension from './isShareExtension';
import navigateToShare from './navigateToShare';

const registerListener = () => {
    ShareMenu.getInitialShare(navigateToShare);
    return ShareMenu.addNewShareListener(navigateToShare);
};

export default {
    cleanUpActions: () => [],
    isShareExtension,
    registerListener,
};
