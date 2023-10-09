import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import {createContext, useContext, useEffect, useState} from 'react';
import ShareMenu from 'react-native-share-menu';

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

const ShareContext = createContext(null);

function ShareContextProvider(props) {
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

ShareContextProvider.propTypes = {
    /** Actual content wrapped by this component */
    children: PropTypes.node.isRequired,
};

const useShareData = () => useContext(ShareContext);

export {ShareContextProvider, useShareData};
export default useShareData;
