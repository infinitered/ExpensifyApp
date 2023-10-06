import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import {useEffect, useState} from 'react';
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

export default function useShareData() {
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

    return shareData;
}
