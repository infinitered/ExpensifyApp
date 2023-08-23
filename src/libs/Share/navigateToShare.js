import ROUTES from '../../ROUTES';
import Navigation from '../Navigation/Navigation';
import hasNoShareData from './hasNoShareData';
import normalizeShareData from './normalizeShareData';

const formatShareData = (shared) => {
    const share = normalizeShareData(shared);
    return {
        isTextShare: share.mimeType === 'text/plain',
        name: share.data.split('/').pop(),
        source: share.data,
        type: share.mimeType,
        uri: share.data,
    };
};

const navigateToShare = (share) => {
    if (hasNoShareData(share)) return;
    Navigation.isNavigationReady().then(() => {
        Navigation.navigate(ROUTES.NEW_GROUP);
        Navigation.setParams({share: formatShareData(share)});
    });
};

export default navigateToShare;
