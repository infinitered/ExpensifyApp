import Navigation from '../Navigation/Navigation';

const dismiss = () => Navigation.dismissModal();

export default {
    dismiss,
    registerListener: () => ({remove: () => {}}),
};
