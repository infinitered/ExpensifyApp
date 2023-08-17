import {AppState} from 'react-native';
import {exists, moveFile, pathForGroup, unlink} from 'react-native-fs';
import Onyx from 'react-native-onyx';
import {ShareMenuReactView} from 'react-native-share-menu';
import CONST from '../../CONST';
import ONYXKEYS from '../../ONYXKEYS';
import Navigation from '../Navigation/Navigation';
import navigateToShare from './navigateToShare';
import normalizeShareData from './normalizeShareData';

let appGroupPath;
pathForGroup(CONST.IOS_APP_GROUP).then((path) => (appGroupPath = path));

const cleanUpActions = (file) => {
    if (!file || !file.source.includes(appGroupPath)) return [];
    return [
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: ONYXKEYS.TEMP_FILES_TO_DELETE,
            value: [file],
        },
    ];
};

let isCleaningUpTempFiles = false;
AppState.addEventListener('change', () => {
    const connectionID = Onyx.connect({
        key: ONYXKEYS.TEMP_FILES_TO_DELETE,
        callback: (val) => {
            Onyx.disconnect(connectionID);
            if (val && !isCleaningUpTempFiles) {
                isCleaningUpTempFiles = true;
                val.forEach((file) => {
                    exists(file.source).then((fileExists) => {
                        if (!fileExists) return;
                        unlink(file.source);
                    });
                });
                // TODO: Move to actions
                // eslint-disable-next-line rulesdir/prefer-actions-set-data
                Onyx.set(ONYXKEYS.TEMP_FILES_TO_DELETE, []);
                isCleaningUpTempFiles = false;
            }
        },
    });
});

const dismiss = () => ShareMenuReactView.dismissExtension();

const registerListener = () => {
    Navigation.isNavigationReady().then(() => {
        ShareMenuReactView.data().then((shared) => {
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
    cleanUpActions,
    dismiss,
    isShareExtension: ShareMenuReactView.isExtension,
    openApp: ShareMenuReactView.openApp,
    registerListener,
};
