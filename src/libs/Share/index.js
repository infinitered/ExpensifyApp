import Navigation from '../Navigation/Navigation';

const dismiss = () => Navigation.dismissModal();

export default {
    cleanUpActions: () => [],
    dismiss,
    isShareExtension: false,
    openApp: () => {},
    registerListener: () => ({remove: () => {}}),
};
