import {AppState} from 'react-native';
import {exists, pathForGroup, unlink} from 'react-native-fs';
import Onyx from 'react-native-onyx';
import {ShareMenuReactView} from 'react-native-share-menu';
import ONYXKEYS from '../../ONYXKEYS';
import Navigation from '../Navigation/Navigation';
import navigateToShare from './navigateToShare';

let appGroupPath;
pathForGroup('group.com.chat.expensify.chat').then((path) => (appGroupPath = path));

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
        ShareMenuReactView.data().then(navigateToShare);
    });
    return {remove: () => {}};
};

export default {
    cleanUpActions,
    dismiss,
    isShareExtension: ShareMenuReactView.isExtension,
    registerListener,
};
