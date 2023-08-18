import {moveFile, pathForGroup} from 'react-native-fs';
import {ShareMenuReactView} from 'react-native-share-menu';
import CONST from '../../CONST';
import Navigation from '../Navigation/Navigation';
import * as ShareActions from '../actions/Share';
import hasNoShareData from './hasNoShareData';
import navigateToShare from './navigateToShare';
import normalizeShareData from './normalizeShareData';

const dismiss = () => ShareMenuReactView.dismissExtension();

const registerListener = () => {
    Navigation.isNavigationReady().then(() => {
        ShareMenuReactView.data().then((shared) => {
            if (hasNoShareData(shared)) return;
            const share = normalizeShareData(shared);
            if (share.mimeType === 'text/plain') {
                navigateToShare(share);
            } else {
                // move to app group shared directory for offline uploads
                pathForGroup(CONST.IOS_APP_GROUP).then((sharedDir) => {
                    const filename = share.data.split('/').pop();
                    const destPath = `${sharedDir}/${filename}`;
                    moveFile(share.data, destPath).then(() => {
                        navigateToShare({...share, data: destPath});
                    });
                });
            }
        });
    });
    return {remove: () => {}};
};

export default {
    cleanUpActions: ShareActions.cleanUpActions,
    dismiss,
    isShareExtension: ShareMenuReactView.isExtension,
    openApp: ShareMenuReactView.openApp,
    registerListener,
};
