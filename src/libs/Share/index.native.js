import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import {createContext, useContext, useEffect, useState} from 'react';
import ShareMenu from 'react-native-share-menu';
import ROUTES from '../../ROUTES';
import Navigation from '../Navigation/Navigation';

const hasNoShareData = (share) => !share || !share.data || isEmpty(share.data);

const normalizeShareData = (shared) => (isArray(shared.data) ? shared.data[0] : shared);

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
    if (hasNoShareData(share)) {
        return;
    }
    Navigation.isNavigationReady().then(() => {
        Navigation.navigate(ROUTES.NEW_CHAT);
        Navigation.setParams({share: formatShareData(share)});
    });
};

const ShareContext = createContext(null);

function Provider(props) {
    const [shareData, setShareData] = useState(null);

    const handleShareData = (share) => {
        if (hasNoShareData(share)) {
            return;
        }
        setShareData(formatShareData(share));
    };

    ShareMenu.getInitialShare(handleShareData);
    useEffect(() => {
        const listener = ShareMenu.addNewShareListener(handleShareData);
        return listener.remove;
    }, []);

    return <ShareContext.Provider value={shareData}>{props.children}</ShareContext.Provider>;
}

Provider.propTypes = {
    /** Actual content wrapped by this component */
    children: PropTypes.node.isRequired,
};

const useShareData = () => useContext(ShareContext);

const registerListener = () => {
    ShareMenu.getInitialShare(navigateToShare);
    return ShareMenu.addNewShareListener(navigateToShare);
};

export {Provider, registerListener, useShareData};
