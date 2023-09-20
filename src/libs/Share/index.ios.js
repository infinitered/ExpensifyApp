import {exists, moveFile, pathForGroup, unlink} from 'react-native-fs';
import {ShareMenuReactView} from 'react-native-share-menu';
import CONST from '../../CONST';
import Navigation from '../Navigation/Navigation';
import * as ShareActions from '../actions/Share';
import hasNoShareData from './hasNoShareData';
import isShareExtension from './isShareExtension';
import navigateToShare from './navigateToShare';
import normalizeShareData from './normalizeShareData';

const dismiss = () => ShareMenuReactView.dismissExtension();

const openApp = () => ShareMenuReactView.openApp();

const registerListener = () => {
    Navigation.isNavigationReady().then(() => {
        ShareMenuReactView.data().then((shared) => {
            if (hasNoShareData(shared)) {
                return;
            }
            const share = normalizeShareData(shared);
            if (share.mimeType !== 'text/plain') {
                // move to app group shared directory for offline uploads
                pathForGroup(CONST.IOS_APP_GROUP).then((sharedDir) => {
                    const filename = share.data.split('/').pop();
                    const destPath = `${sharedDir}/${filename}`;
                    exists(destPath).then((fileExists) => {
                        if (fileExists) {
                            unlink(destPath).then(() => {
                                moveFile(share.data, destPath).then(() => {
                                    navigateToShare({...share, data: destPath});
                                });
                            });
                            return;
                        }
                        moveFile(share.data, destPath).then(() => {
                            navigateToShare({...share, data: destPath});
                        });
                    });
                });
            } else {
                navigateToShare(share);
            }
        });
    });
    return {remove: () => {}};
};

export default {
    cleanUpActions: ShareActions.cleanUpActions,
    dismiss,
    isShareExtension,
    openApp,
    registerListener,
};
