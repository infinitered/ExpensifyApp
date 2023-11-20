import isEmpty from 'lodash/isEmpty';
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import ShareMenu, {ShareCallback, ShareData} from 'react-native-share-menu';
import Navigation from '@libs/Navigation/Navigation';
import ROUTES from '@src/ROUTES';

type NormalizedShareData<TExtraData = unknown> = {
    mimeType: string;
    data: string | string[];
    extraData?: TExtraData;
};

type FormattedShareData = {
    isTextShare: boolean;
    name: string;
    source: string;
    type: string;
    uri: string;
};

type SharedData = ShareData | {data: ShareData[]};

const hasNoShareData = (share?: SharedData): boolean => !share?.data || isEmpty(share.data);

const formatShareData = (shared: SharedData): FormattedShareData => {
    const share: NormalizedShareData = Array.isArray(shared.data) ? (shared.data as ShareData[])[0] : (shared as NormalizedShareData);

    if (Array.isArray(share.data)) {
        share.data = share.data[0];
    }

    const formattedData: FormattedShareData = {
        isTextShare: share.mimeType === 'text/plain',
        name: share.data.split('/').pop() ?? '',
        source: share.data,
        type: share.mimeType,
        uri: share.data,
    };
    return formattedData;
};

const ShareContext = createContext<FormattedShareData | null>(null);

type ProviderProps = {
    children: ReactNode;
};

function ShareContextProvider({children}: ProviderProps) {
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
        return () => listener.remove();
    }, []);

    return <ShareContext.Provider value={shareData}>{children}</ShareContext.Provider>;
}

const useShareData = (): FormattedShareData | null => useContext(ShareContext);

export {ShareContextProvider, useShareData};
