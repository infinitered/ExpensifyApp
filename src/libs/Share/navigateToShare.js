import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import ROUTES from '../../ROUTES';
import Navigation from '../Navigation/Navigation';

const hasNoShareData = (share) => !share || !share.data || isEmpty(share.data);

const navigateToShare = (share) => {
    if (hasNoShareData(share)) return;
    Navigation.isNavigationReady().then(() => {
        Navigation.navigate(ROUTES.NEW_GROUP);
        Navigation.setParams({share: isArray(share.data) ? share.data[0] : share});
    });
};

export default navigateToShare;
