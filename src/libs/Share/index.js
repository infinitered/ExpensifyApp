import Navigation from '../Navigation/Navigation';
import isShareExtension from './isShareExtension';

const dismiss = () => Navigation.dismissModal();

export default {
    cleanUpActions: () => [],
    dismiss,
    isShareExtension,
    openApp: () => {},
    registerListener: () => ({remove: () => {}}),
};
