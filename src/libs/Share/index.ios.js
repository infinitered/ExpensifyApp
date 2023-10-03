import ShareMenu, {ShareMenuReactView} from 'react-native-share-menu';
import * as ShareActions from '../actions/Share';
import isShareExtension from './isShareExtension';
import navigateToShare from './navigateToShare';

const dismiss = () => ShareMenuReactView.dismissExtension();

const openApp = () => ShareMenuReactView.openApp();

const registerListener = () => {
    ShareMenu.getInitialShare(navigateToShare);
    return ShareMenu.addNewShareListener(navigateToShare);
};

export default {
    cleanUpActions: ShareActions.cleanUpActions,
    dismiss,
    isShareExtension,
    openApp,
    registerListener,
};
