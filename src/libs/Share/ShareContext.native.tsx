import isEmpty from 'lodash/isEmpty';
import {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {Platform} from 'react-native';
import ShareMenu, {ShareData as ShareMenuData, ShareCallback} from 'react-native-share-menu';
import ROUTES from '@src/ROUTES';
import Navigation from '@libs/Navigation/Navigation';

type FormattedShareData = {
    isTextShare: boolean;
    name: string;
    source: string;
    type: string;
    uri: string;
}

const hasNoShareData = (share?: ShareMenuData): boolean => !share?.data || isEmpty(share.data);

const normalizeShareData = (shared: ShareMenuData): ShareMenuData => (Array.isArray(shared.data) ? {
    ...shared,
    data: shared.data[0]
} : shared);

const formatShareData = (shared: ShareMenuData): FormattedShareData => {
    const share = normalizeShareData(shared);
    return {
        isTextShare: share.mimeType === 'text/plain',
        name: typeof share.data === 'string' ? share.data.split('/').pop() ?? '' : '',
        source: typeof share.data === 'string' ? share.data : '',
        type: share.mimeType,
        uri: typeof share.data === 'string' ? share.data : '',
    };
};

const ShareContext = createContext<FormattedShareData | null>(null);

type ProviderProps = {
    children: ReactNode;
}

function Provider({children}: ProviderProps) {
    const [shareData, setShareData] = useState<FormattedShareData | null>(null);

    const handleShareData: ShareCallback = (share) => {
        if (!share || hasNoShareData(share)) {
            return;
        }
        setShareData(formatShareData(share));

        if (Platform.OS === 'android') {
            Navigation.isNavigationReady().then(() => {
                Navigation.navigate(ROUTES.SHARE);
            });
        }
    };

    ShareMenu.getInitialShare(handleShareData);
    useEffect(() => {
        const listener = ShareMenu.addNewShareListener(handleShareData);
        return ()=>listener.remove();
    }, []);

    return <ShareContext.Provider value={shareData}>{children}</ShareContext.Provider>;
}

const useShareData = (): FormattedShareData | null => useContext(ShareContext);

export {Provider, useShareData};
