import {AppState} from 'react-native';
import {exists, pathForGroup, unlink} from 'react-native-fs';
import Onyx from 'react-native-onyx';
import {ShareMenuReactView} from 'react-native-share-menu';
import CONST from '../../CONST';
import ONYXKEYS from '../../ONYXKEYS';
import * as PersistedRequests from './PersistedRequests';

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
Onyx.connect({
    key: ONYXKEYS.TEMP_FILES_TO_DELETE,
    callback: (val) => {
        if (!val || isCleaningUpTempFiles) return;
        isCleaningUpTempFiles = true;
        val.forEach((file) => {
            exists(file.source).then((fileExists) => {
                if (!fileExists) return;
                unlink(file.source);
            });
        });
        Onyx.set(ONYXKEYS.TEMP_FILES_TO_DELETE, []);
        isCleaningUpTempFiles = false;
    },
});

let isAppExtensionQueueFlushed = false;
const flushAppExtensionQueue = (callback = () => {}) => {
    if (isAppExtensionQueueFlushed) return false;
    const connectionID = Onyx.connect({
        key: ONYXKEYS.SHARE_PERSISTED_REQUESTS,
        callback: (val) => {
            Onyx.disconnect(connectionID);
            PersistedRequests.save(val || []);
            isAppExtensionQueueFlushed = true;
            Onyx.set(ONYXKEYS.SHARE_PERSISTED_REQUESTS, []);
            callback();
        },
    });

    return true;
};

AppState.addEventListener('change', (appState) => {
    if (ShareMenuReactView.isExtension) return;
    if (appState === CONST.APP_STATE.ACTIVE) return;
    isAppExtensionQueueFlushed = false;
});

export {cleanUpActions, flushAppExtensionQueue};
