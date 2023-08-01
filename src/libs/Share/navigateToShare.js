import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import ROUTES from '../../ROUTES';
import Navigation from '../Navigation/Navigation';

const formatShareData = (shared) => {
    const share = isArray(shared.data) ? shared.data[0] : shared;
    return {
        isTextShare: share.mimeType === 'text/plain',
        name: share.data.split('/').pop(),
        source: share.data,
        type: share.mimeType,
        uri: share.data,
    };
};

const hasNoShareData = (share) => !share || !share.data || isEmpty(share.data);

const navigateToShare = (share) => {
    if (hasNoShareData(share)) return;
    Navigation.isNavigationReady().then(() => {
        Navigation.navigate(ROUTES.NEW_GROUP);
        Navigation.setParams({share: formatShareData(share)});
    });
};

export default navigateToShare;
