import ShareMenu from 'react-native-share-menu';
import Navigation from '../Navigation/Navigation';
import navigateToShare from './navigateToShare';

const dismiss = () => Navigation.dismissModal();

const registerListener = () => {
    ShareMenu.getInitialShare(navigateToShare);
    return ShareMenu.addNewShareListener(navigateToShare);
};

export default {
    dismiss,
    registerListener,
};
