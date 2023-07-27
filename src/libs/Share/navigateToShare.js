import isArray from 'lodash/isArray';

import ROUTES from '../../ROUTES';
import Navigation from '../Navigation/Navigation';

const navigateToShare = (share) => {
    if (!share || !share.data) return;
    if (isArray(share.data) && share.data.length === 0) return;
    Navigation.isNavigationReady().then(() => {
        Navigation.navigate(ROUTES.NEW_GROUP);
        Navigation.setParams({share: isArray(share.data) ? share.data[0] : share});
    });
};

export default navigateToShare;
