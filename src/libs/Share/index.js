import Navigation from '../Navigation/Navigation';

const dismiss = () => Navigation.dismissModal();

export default {
    dismiss,
    isShareExtension: false,
    openApp: () => {},
    registerListener: () => ({remove: () => {}}),
};
